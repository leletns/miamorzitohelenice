// ============================================================
// "Nossa Aventura" — plataforma pixel-art estilo Mario/Sonic
// ============================================================

const Platformer = (() => {
  let canvas, ctx;
  let raf = null;
  let last = 0;
  let state = null;
  const keys = {};
  const touch = { left: false, right: false, jump: false };

  // ---------- Conquistas ----------
  const ACHIEVEMENTS = [
    { id: 'first', emoji: '🏁', name: 'Primeiro cantinho', desc: 'Complete sua primeira fase' },
    { id: 'allRings', emoji: '💍', name: 'Caçadora de alianças', desc: 'Pegue todas as alianças de uma fase' },
    { id: 'noHit', emoji: '🛡️', name: 'Intocável', desc: 'Complete uma fase sem perder coração' },
    { id: 'allChars', emoji: '👨‍👩‍👧‍👧', name: 'Nossa família', desc: 'Jogue com as 4 personagens' },
    { id: 'combo5', emoji: '⚡', name: 'Combo apaixonada', desc: 'Chegue ao combo x5' },
    { id: 'hearts100', emoji: '💯', name: '100 corações', desc: 'Colete 100 corações no total' },
    { id: 'cycle1', emoji: '🗺️', name: 'Rolê completo', desc: 'Passe pelos 6 cantinhos' },
    { id: 'photos10', emoji: '📸', name: 'Álbum completo', desc: 'Desbloqueie as 10 fotos' },
  ];

  function unlockAchievement(id) {
    const save = Save.get();
    if (save.achievements[id]) return;
    save.achievements[id] = true;
    Save.commit();
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (a) showToast(`Conquista: ${a.name}`);
    SFX.fanfare();
  }

  function showToast(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => el.classList.add('show'), 30);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3200);
  }

  // ---------- Início de fase ----------
  function start(levelIndex) {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const save = Save.get();
    const charId = save.selectedChar;
    if (!save.charsPlayed.includes(charId)) {
      save.charsPlayed.push(charId);
      Save.commit();
      if (save.charsPlayed.length >= 4) unlockAchievement('allChars');
    }

    const level = buildLevel(levelIndex);
    const char = getCharacter(charId);
    state = {
      levelIndex, level, char,
      accessory: save.equipped[charId] || null,
      player: {
        x: 40, y: GROUND_Y - char.h, vx: 0, vy: 0,
        onGround: true, facing: 1, frame: 0, frameT: 0, invuln: 0,
      },
      cam: 0, t: 0,
      score: 0, heartsGot: 0, ringsGot: 0, damaged: false,
      combo: { n: 0, timer: 0, mult: 1, popT: 0 },
      particles: [],
      done: false,
    };
    document.getElementById('polaroid-overlay').classList.add('hidden');
    stopLoop();
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }
  function stop() { stopLoop(); state = null; }

  // ---------- Loop ----------
  function loop(now) {
    raf = requestAnimationFrame(loop);
    let dt = Math.min((now - last) / 16.666, 2.2);
    last = now;
    if (!state || state.done) { render(); return; }
    update(dt);
    render();
  }

  function update(dt) {
    const s = state;
    const p = s.player;
    const lv = s.level;
    s.t += dt / 60;

    // entrada
    const left = keys.ArrowLeft || keys.a || touch.left;
    const right = keys.ArrowRight || keys.d || touch.right;
    const jump = keys.ArrowUp || keys[' '] || keys.w || touch.jump;
    const run = keys.Shift || keys.x || touch.run;

    const speed = (s.char.type === 'cat' ? 1.85 : 1.6) * (run ? 1.55 : 1);
    if (left) { p.vx = -speed; p.facing = -1; }
    else if (right) { p.vx = speed; p.facing = 1; }
    else p.vx *= 0.7;

    if (jump && p.onGround) {
      p.vy = s.char.type === 'cat' ? -4.9 : -4.6;
      p.onGround = false;
      SFX.jump();
    }

    p.vy += 0.24 * dt;
    if (p.vy > 5) p.vy = 5;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.x < 4) p.x = 4;
    if (p.x > lv.length - s.char.w - 4) p.x = lv.length - s.char.w - 4;

    // chão
    p.onGround = false;
    if (p.y + s.char.h >= GROUND_Y) {
      p.y = GROUND_Y - s.char.h;
      p.vy = 0;
      p.onGround = true;
    }
    // plataformas (one-way)
    for (const pl of lv.platforms) {
      const feet = p.y + s.char.h;
      if (p.vy >= 0 && feet >= pl.y && feet <= pl.y + 7 + p.vy * dt &&
          p.x + s.char.w - 3 > pl.x && p.x + 3 < pl.x + pl.w) {
        p.y = pl.y - s.char.h;
        p.vy = 0;
        p.onGround = true;
      }
    }

    // animação
    p.frameT += Math.abs(p.vx) * dt;
    if (p.frameT > 6) { p.frameT = 0; p.frame = 1 - p.frame; }

    // combo
    if (s.combo.timer > 0) {
      s.combo.timer -= dt / 60;
      if (s.combo.timer <= 0) { s.combo.n = 0; s.combo.mult = 1; }
    }
    if (s.combo.popT > 0) s.combo.popT -= dt / 60;

    // corações
    for (const h of lv.hearts) {
      if (h.got) continue;
      if (Math.abs(p.x + s.char.w / 2 - (h.x + 4)) < 10 && Math.abs(p.y + s.char.h / 2 - (h.y + 3)) < 12) {
        h.got = true;
        s.heartsGot++;
        s.combo.n++;
        s.combo.timer = 1.3;
        const newMult = Math.min(1 + Math.floor(s.combo.n / 3), 5);
        if (newMult > s.combo.mult) { s.combo.mult = newMult; s.combo.popT = 1; }
        if (s.combo.mult >= 5) unlockAchievement('combo5');
        s.score += 10 * s.combo.mult;
        spawnBurst(h.x + 4, h.y + 3, '#4d9aff');
        SFX.pickup(s.combo.mult);
        const save = Save.get();
        save.totalHearts++;
        if (save.totalHearts >= 100) unlockAchievement('hearts100');
        Save.commit();
      }
    }
    // alianças
    for (const r of lv.rings) {
      if (r.got) continue;
      if (Math.abs(p.x + s.char.w / 2 - (r.x + 4)) < 11 && Math.abs(p.y + s.char.h / 2 - (r.y + 4)) < 13) {
        r.got = true;
        s.ringsGot++;
        s.score += 50;
        spawnBurst(r.x + 4, r.y + 4, '#eef3f9');
        SFX.ring();
        const save = Save.get();
        save.ringsBank++;
        Save.commit();
        showToast('Aliança de prata +50');
      }
    }

    // obstáculos
    if (p.invuln > 0) p.invuln -= dt / 60;
    for (const o of lv.obstacles) {
      if (o.kind === 'mover') {
        o.x += o.speed * o.dir * dt;
        if (o.x > o.baseX + o.range) o.dir = -1;
        if (o.x < o.baseX - o.range) o.dir = 1;
        if (o.fly) o.y += Math.sin(s.t * 4 + o.baseX) * 0.15 * dt;
      }
      if (p.invuln <= 0 &&
          p.x + s.char.w - 2 > o.x && p.x + 2 < o.x + o.w &&
          p.y + s.char.h - 1 > o.y && p.y + 2 < o.y + o.h) {
        p.invuln = 1.3;
        s.damaged = true;
        if (s.heartsGot > 0) {
          s.heartsGot--;
          spawnBurst(p.x + s.char.w / 2, p.y, '#9aa3ad');
        }
        p.vy = -2.4;
        p.vx = -p.facing * 2;
        SFX.hurt();
      }
    }

    // partículas
    for (const pt of s.particles) {
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 0.06 * dt;
      pt.life -= dt / 60;
    }
    s.particles = s.particles.filter((pt) => pt.life > 0);

    // câmera
    s.cam = Math.max(0, Math.min(p.x - GAME_W * 0.38, lv.length - GAME_W));

    // chegou na casinha?
    if (p.x + s.char.w / 2 >= lv.goalX + 14) levelComplete();
  }

  function spawnBurst(x, y, color) {
    for (let i = 0; i < 6; i++) {
      state.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 2.4,
        vy: -Math.random() * 2 - 0.4,
        life: 0.55, color,
      });
    }
  }

  // ---------- Desenho ----------
  function render() {
    if (!state) return;
    const s = state;
    const lv = s.level;
    ctx.clearRect(0, 0, GAME_W, GAME_H);
    lv.theme.drawBG(ctx, s.cam, s.t);

    ctx.save();
    ctx.translate(-Math.round(s.cam), 0);

    // chão texturizado do tema
    lv.theme.drawGround(ctx, s.cam - 4, s.cam + GAME_W + 4);

    // plataformas
    for (const pl of lv.platforms) {
      if (pl.x + pl.w < s.cam - 20 || pl.x > s.cam + GAME_W + 20) continue;
      const P = lv.theme.platform;
      if (pl.type === 'bench') {
        // banco de madeira verde com ripas e pés de ferro
        px(ctx, pl.x, pl.y, pl.w, 2, P.top);
        px(ctx, pl.x, pl.y + 3, pl.w, 2, P.top);
        px(ctx, pl.x, pl.y + 6, pl.w, 2, P.body);
        px(ctx, pl.x + 4, pl.y + pl.h, 2, GROUND_Y - pl.y - pl.h, '#2b2b36');
        px(ctx, pl.x + pl.w - 6, pl.y + pl.h, 2, GROUND_Y - pl.y - pl.h, '#2b2b36');
        px(ctx, pl.x + 2, GROUND_Y - 2, 6, 2, '#2b2b36');
        px(ctx, pl.x + pl.w - 8, GROUND_Y - 2, 6, 2, '#2b2b36');
        // plaquinha PENSE VERDE no encosto
        px(ctx, pl.x + pl.w / 2 - 24, pl.y - 12, 48, 9, '#1d4d33');
        px(ctx, pl.x + pl.w / 2 - 23, pl.y - 11, 46, 7, '#2c6a46');
        signText(ctx, 'PENSE VERDE', pl.x + pl.w / 2 - 22, pl.y - 5, '#cfe8b8', 4);
        px(ctx, pl.x + pl.w / 2 - 1, pl.y - 3, 2, 3, '#1d4d33');
      } else if (pl.type === 'sofa') {
        // poltrona dupla de cinema
        px(ctx, pl.x - 3, pl.y - 10, 4, pl.h + 10, P.body);
        px(ctx, pl.x + pl.w - 1, pl.y - 10, 4, pl.h + 10, P.body);
        px(ctx, pl.x - 3, pl.y - 10, 4, 2, '#d9445a');
        px(ctx, pl.x + pl.w - 1, pl.y - 10, 4, 2, '#d9445a');
        px(ctx, pl.x, pl.y, pl.w, 3, P.top);
        px(ctx, pl.x, pl.y + 3, pl.w, pl.h - 3, P.body);
        px(ctx, pl.x + pl.w / 2 - 1, pl.y + 1, 2, pl.h - 2, '#5e1620');
        px(ctx, pl.x + 1, pl.y + pl.h, 3, GROUND_Y - pl.y - pl.h, '#1c0b14');
        px(ctx, pl.x + pl.w - 4, pl.y + pl.h, 3, GROUND_Y - pl.y - pl.h, '#1c0b14');
      } else if (pl.type === 'table') {
        // mesa do méqui com banco
        px(ctx, pl.x, pl.y, pl.w, 3, P.top);
        px(ctx, pl.x + 1, pl.y + 3, pl.w - 2, 2, P.body);
        px(ctx, pl.x + pl.w / 2 - 2, pl.y + 5, 4, GROUND_Y - pl.y - 5, '#8e8088');
        px(ctx, pl.x + pl.w / 2 - 7, GROUND_Y - 2, 14, 2, '#8e8088');
      } else if (pl.type === 'stone') {
        // mureta de pedra do calçadão
        px(ctx, pl.x, pl.y, pl.w, 2, P.top);
        px(ctx, pl.x, pl.y + 2, pl.w, GROUND_Y - pl.y - 2, P.body);
        for (let bx = pl.x + 4; bx < pl.x + pl.w - 4; bx += 12) {
          px(ctx, bx, pl.y + 4, 8, 1, '#a39879');
          px(ctx, bx + 6, pl.y + 8, 8, 1, '#a39879');
        }
      } else if (pl.type === 'wood') {
        // deck de madeira na areia
        px(ctx, pl.x, pl.y, pl.w, 3, P.top);
        for (let bx = pl.x; bx < pl.x + pl.w; bx += 8) px(ctx, bx, pl.y, 1, 3, '#4e3a22');
        px(ctx, pl.x, pl.y + 3, pl.w, 2, P.body);
        px(ctx, pl.x + 3, pl.y + 5, 2, GROUND_Y - pl.y - 5, '#4e3a22');
        px(ctx, pl.x + pl.w - 5, pl.y + 5, 2, GROUND_Y - pl.y - 5, '#4e3a22');
      } else {
        // laje com mureta
        px(ctx, pl.x, pl.y, pl.w, 3, P.top);
        px(ctx, pl.x, pl.y + 3, pl.w, GROUND_Y - pl.y - 3, P.body);
        px(ctx, pl.x, pl.y + 3, 2, GROUND_Y - pl.y - 3, '#7a6e5c');
        px(ctx, pl.x + pl.w - 2, pl.y + 3, 2, GROUND_Y - pl.y - 3, '#7a6e5c');
        px(ctx, pl.x + 3, pl.y - 5, 8, 5, '#3a6aa8');
        px(ctx, pl.x + 3, pl.y - 5, 8, 1, '#4a82c4');
      }
    }

    // coletáveis
    for (const h of lv.hearts) {
      if (h.got || h.x < s.cam - 20 || h.x > s.cam + GAME_W + 20) continue;
      const bob = Math.sin(s.t * 4 + h.x * 0.2) * 1.5;
      drawHeart(ctx, h.x, h.y + bob, 1);
    }
    for (const r of lv.rings) {
      if (r.got) continue;
      const bob = Math.sin(s.t * 3 + r.x * 0.1) * 2;
      drawRing(ctx, r.x, r.y + bob, 1);
      if (Math.sin(s.t * 6 + r.x) > 0.6) px(ctx, r.x + 8, r.y + bob - 2, 2, 2, '#ffffff');
    }

    // obstáculos
    for (const o of lv.obstacles) {
      if (o.x < s.cam - 30 || o.x > s.cam + GAME_W + 30) continue;
      o.def.draw(ctx, o, s.t);
    }

    // casinha do fim da fase
    drawGoal(ctx, lv.goalX, s.t);

    // partículas
    for (const pt of s.particles) {
      ctx.globalAlpha = Math.max(pt.life / 0.55, 0);
      px(ctx, pt.x, pt.y, 2, 2, pt.color);
      ctx.globalAlpha = 1;
    }

    // jogadora
    const p = s.player;
    const blink = p.invuln > 0 && Math.floor(s.t * 16) % 2 === 0;
    if (!blink) {
      const frame = !p.onGround ? 'jump' : (Math.abs(p.vx) > 0.3 ? (p.frame ? 'walkB' : 'walkA') : 'walkA');
      drawCharacter(ctx, s.char, frame, p.x, p.y, 1, p.facing < 0, s.accessory);
    }

    ctx.restore();

    updateHUD();
  }

  function drawGoal(ctx, gx, t) {
    // casinha com coração — o "lar"
    px(ctx, gx - 2, GROUND_Y - 36, 44, 36, '#e8dcc4');
    px(ctx, gx + 2, GROUND_Y - 32, 36, 32, '#f4ecd8');
    // telhado em degraus
    px(ctx, gx - 6, GROUND_Y - 38, 52, 4, '#c75b4a');
    px(ctx, gx, GROUND_Y - 44, 40, 6, '#d96a52');
    px(ctx, gx + 8, GROUND_Y - 50, 24, 6, '#c75b4a');
    px(ctx, gx + 14, GROUND_Y - 54, 12, 4, '#d96a52');
    // porta
    px(ctx, gx + 15, GROUND_Y - 18, 12, 18, '#6e4a2e');
    px(ctx, gx + 16, GROUND_Y - 17, 10, 17, '#8a5e3a');
    px(ctx, gx + 24, GROUND_Y - 10, 2, 2, '#f0b428');
    // janela com luz
    px(ctx, gx + 4, GROUND_Y - 28, 8, 8, '#2c2138');
    px(ctx, gx + 5, GROUND_Y - 27, 6, 6, '#ffd98a');
    px(ctx, gx + 7, GROUND_Y - 27, 1, 6, '#2c2138');
    const pulse = Math.sin(t * 4) > 0 ? 0 : 1;
    drawHeart(ctx, gx + 28, GROUND_Y - 31 - pulse, 1 + pulse * 0.12);
    signText(ctx, 'lar', gx + 14, GROUND_Y - 40, '#fff3e0', 5);
  }

  const hudEl = {};
  function updateHUD() {
    const s = state;
    if (!hudEl.hearts) {
      hudEl.hearts = document.getElementById('hud-hearts');
      hudEl.rings = document.getElementById('hud-rings');
      hudEl.level = document.getElementById('hud-level');
      hudEl.score = document.getElementById('hud-score');
      hudEl.record = document.getElementById('hud-record');
      hudEl.combo = document.getElementById('hud-combo');
    }
    const save = Save.get();
    setText(hudEl.hearts, `${s.heartsGot}/${s.level.totalHearts}`);
    setText(hudEl.rings, `${s.ringsGot}/${s.level.rings.length}`);
    setText(hudEl.level, `Fase ${s.levelIndex + 1} · ${THEME_NAMES[s.level.themeId]}`);
    setText(hudEl.score, String(s.score).padStart(5, '0'));
    setText(hudEl.record, `rec ${String(Math.max(save.bestScore, s.score)).padStart(5, '0')}`);
    if (s.combo.mult > 1) {
      setText(hudEl.combo, `Combo x${s.combo.mult}`);
      hudEl.combo.classList.toggle('pop', s.combo.popT > 0);
    } else {
      setText(hudEl.combo, '');
    }
  }
  function setText(el, v) {
    if (el && el.textContent !== v) el.textContent = v;
  }

  // ---------- Fim de fase ----------
  function levelComplete() {
    const s = state;
    s.done = true;
    SFX.win();

    const save = Save.get();
    const firstTime = !save.levelsDone.includes(s.levelIndex);
    if (firstTime) save.levelsDone.push(s.levelIndex);

    // pontuação final (bônus por corações e alianças)
    const finalScore = s.score + s.heartsGot * 5 + s.ringsGot * 25;
    let newRecord = false;
    if (finalScore > save.bestScore) {
      save.bestScore = finalScore;
      newRecord = true;
    }
    save.lastLevel = s.levelIndex + 1;

    // desbloqueio de foto (uma por fase nova, até 10)
    let newPhoto = null;
    if (save.unlockedPhotos.length < PHOTOS.length && firstTime) {
      const idx = save.unlockedPhotos.length;
      save.unlockedPhotos.push(idx);
      newPhoto = idx;
      if (save.unlockedPhotos.length >= PHOTOS.length) unlockAchievement('photos10');
    }
    Save.commit();

    // conquistas
    unlockAchievement('first');
    if (s.ringsGot >= s.level.rings.length && s.level.rings.length > 0) unlockAchievement('allRings');
    if (!s.damaged) unlockAchievement('noHit');
    if (save.levelsDone.length >= 6) unlockAchievement('cycle1');

    // frase do cantinho
    const opts = PHRASES[s.level.themeId];
    const phrase = opts[Math.floor(Math.random() * opts.length)];

    // foto do polaroid: a recém-desbloqueada, ou uma aleatória já aberta
    const photoIdx = newPhoto !== null ? newPhoto
      : save.unlockedPhotos[Math.floor(Math.random() * Math.max(save.unlockedPhotos.length, 1))] || 0;
    const photo = PHOTOS[photoIdx];

    const ov = document.getElementById('polaroid-overlay');
    ov.querySelector('.pol-photo').src = photo.src;
    ov.querySelector('.pol-place').textContent = `Fase ${s.levelIndex + 1} completa · ${THEME_NAMES[s.level.themeId]}`;
    ov.querySelector('.pol-phrase').textContent = phrase;
    ov.querySelector('.pol-stats').innerHTML =
      `<img src="${iconDataURL('heart', 2)}" alt=""> ${s.heartsGot}/${s.level.totalHearts}` +
      ` &nbsp; <img src="${iconDataURL('ring', 2)}" alt=""> ${s.ringsGot}/${s.level.rings.length}` +
      ` &nbsp; ${finalScore} pontos` +
      (newRecord ? '<br><span class="record">Novo recorde!</span>' : '');
    ov.querySelector('.pol-album').textContent =
      `Álbum ${save.unlockedPhotos.length}/${PHOTOS.length}` +
      (newPhoto !== null ? ' · nova foto desbloqueada' : '');
    ov.classList.remove('hidden');
    if (newRecord) confettiBurst();
  }

  function nextLevel() { start(state.levelIndex + 1); }
  function replay() { start(state ? state.levelIndex : 0); }

  // ---------- Tela de seleção de personagem + lojinha ----------
  function renderCharSelect() {
    const save = Save.get();
    const grid = document.getElementById('char-grid');
    grid.innerHTML = '';
    for (const c of CHARACTERS) {
      const card = document.createElement('button');
      card.className = 'char-card' + (save.selectedChar === c.id ? ' selected' : '');
      const cv = document.createElement('canvas');
      cv.width = 72; cv.height = 72;
      const cctx = cv.getContext('2d');
      cctx.imageSmoothingEnabled = false;
      const pxSize = c.type === 'cat' ? 3 : 3;
      drawCharacter(cctx, c, 'walkA', (72 - c.w * pxSize) / 2, (72 - c.h * pxSize) / 2 + 3, pxSize, false, save.equipped[c.id]);
      card.appendChild(cv);
      const nm = document.createElement('div');
      nm.className = 'char-name';
      nm.innerHTML = `<b>${c.name}</b>`;
      card.appendChild(nm);
      card.onclick = () => {
        save.selectedChar = c.id;
        Save.commit();
        SFX.pickup(1);
        renderCharSelect();
      };
      grid.appendChild(card);
    }

    // lojinha de acessórios
    document.getElementById('rings-bank').textContent = save.ringsBank;
    const shop = document.getElementById('shop-grid');
    shop.innerHTML = '';
    for (const a of ACCESSORIES) {
      const owned = save.accessories.includes(a.id);
      const equipped = save.equipped[save.selectedChar] === a.id;
      const b = document.createElement('button');
      b.className = 'shop-item' + (equipped ? ' equipped' : '') + (owned ? ' owned' : '');
      b.innerHTML = `<span class="shop-emoji">${a.emoji}</span><span>${a.name}</span>` +
        `<small>${owned ? (equipped ? 'equipado' : 'equipar') : `<img src="${iconDataURL('ring', 2)}" alt=""> ${a.cost}`}</small>`;
      b.onclick = () => {
        if (!owned) {
          if (save.ringsBank >= a.cost) {
            save.ringsBank -= a.cost;
            save.accessories.push(a.id);
            save.equipped[save.selectedChar] = a.id;
            Save.commit();
            SFX.ring();
            showToast(`${a.name} desbloqueado`);
          } else {
            showToast(`Faltam ${a.cost - save.ringsBank} alianças — colete jogando`);
            SFX.hurt();
          }
        } else {
          save.equipped[save.selectedChar] = equipped ? null : a.id;
          Save.commit();
          SFX.pickup(1);
        }
        renderCharSelect();
      };
      shop.appendChild(b);
    }

    const cont = document.getElementById('btn-continue');
    const save2 = Save.get();
    cont.textContent = save2.lastLevel > 0
      ? `Continuar — fase ${save2.lastLevel + 1}`
      : 'Começar';
  }

  // ---------- Entradas ----------
  function bindInputs() {
    window.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      if ([' ', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => { keys[e.key] = false; });

    const bind = (id, prop) => {
      const el = document.getElementById(id);
      const on = (e) => { e.preventDefault(); touch[prop] = true; };
      const off = (e) => { e.preventDefault(); touch[prop] = false; };
      el.addEventListener('pointerdown', on);
      el.addEventListener('pointerup', off);
      el.addEventListener('pointercancel', off);
      el.addEventListener('pointerleave', off);
    };
    bind('btn-left', 'left');
    bind('btn-right', 'right');
    bind('btn-jump', 'jump');
    bind('btn-run', 'run');
  }

  return {
    start, stop, nextLevel, replay, renderCharSelect, bindInputs,
    ACHIEVEMENTS,
    showToast,
  };
})();
