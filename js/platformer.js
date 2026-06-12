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
    if (a) showToast(`${a.emoji} Conquista: ${a.name}!`);
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

    const speed = s.char.type === 'cat' ? 1.85 : 1.6;
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
        spawnBurst(h.x + 4, h.y + 3, '#ff4d6d');
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
        showToast('💍 Aliança de prata! +50');
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

    // chão
    px(ctx, s.cam - 4, GROUND_Y, GAME_W + 8, 4, lv.theme.ground.top);
    px(ctx, s.cam - 4, GROUND_Y + 4, GAME_W + 8, GAME_H - GROUND_Y - 4, lv.theme.ground.body);

    // plataformas
    for (const pl of lv.platforms) {
      if (pl.x + pl.w < s.cam - 20 || pl.x > s.cam + GAME_W + 20) continue;
      px(ctx, pl.x, pl.y, pl.w, 3, lv.theme.platform.top);
      px(ctx, pl.x + 2, pl.y + 3, pl.w - 4, pl.h - 3, lv.theme.platform.body);
      if (pl.type === 'bench') {
        px(ctx, pl.x + 3, pl.y + pl.h, 3, GROUND_Y - pl.y - pl.h, lv.theme.platform.body);
        px(ctx, pl.x + pl.w - 6, pl.y + pl.h, 3, GROUND_Y - pl.y - pl.h, lv.theme.platform.body);
        tinyText(ctx, 'PENSE VERDE', pl.x + 4, pl.y - 2, '#1d5635', 5);
      } else if (pl.type === 'sofa') {
        px(ctx, pl.x - 3, pl.y - 6, 5, pl.h + 6, lv.theme.platform.body);
        px(ctx, pl.x + pl.w - 2, pl.y - 6, 5, pl.h + 6, lv.theme.platform.body);
      } else if (pl.type === 'table') {
        px(ctx, pl.x + pl.w / 2 - 2, pl.y + pl.h, 4, GROUND_Y - pl.y - pl.h, '#a37718');
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

    drawHUD();
  }

  function drawGoal(ctx, gx, t) {
    // casinha com coração — o "lar"
    px(ctx, gx, GROUND_Y - 34, 40, 34, '#fdf3e3');
    px(ctx, gx - 4, GROUND_Y - 34, 48, 5, '#e2725b');
    px(ctx, gx + 2, GROUND_Y - 42, 36, 8, '#e2725b');
    px(ctx, gx + 8, GROUND_Y - 48, 24, 6, '#e2725b');
    px(ctx, gx + 16, GROUND_Y - 16, 10, 16, '#8a5a3b');
    const pulse = Math.sin(t * 4) > 0 ? 0 : 1;
    drawHeart(ctx, gx + 16 - pulse / 2, GROUND_Y - 32 - pulse / 2, 1 + pulse * 0.12);
    tinyText(ctx, 'LAR', gx + 14, GROUND_Y - 36, '#b3322c', 6);
  }

  function drawHUD() {
    const s = state;
    const save = Save.get();
    ctx.fillStyle = 'rgba(20,10,18,0.55)';
    ctx.fillRect(0, 0, GAME_W, 14);
    drawHeart(ctx, 4, 3, 1);
    tinyText(ctx, `${s.heartsGot}/${s.level.totalHearts}`, 14, 10, '#fff', 7);
    drawRing(ctx, 52, 2, 1);
    tinyText(ctx, `${s.ringsGot}/${s.level.rings.length}`, 63, 10, '#fff', 7);
    tinyText(ctx, `Nível ${s.levelIndex + 1} · ${THEME_NAMES[s.level.themeId].replace(/ \S+$/, '')}`, 95, 10, '#ffd0da', 7);
    tinyText(ctx, `★${s.score}`, 240, 10, '#ffd95e', 7);
    tinyText(ctx, `Rec ${Math.max(save.bestScore, s.score)}`, 278, 10, '#9fe8b8', 6);
    if (s.combo.mult > 1) {
      const pop = s.combo.popT > 0 ? 2 : 0;
      tinyText(ctx, `COMBO x${s.combo.mult}!`, 130, 26 + pop, '#ff8f1f', 9 + pop);
    }
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
    ov.querySelector('.pol-place').textContent = THEME_NAMES[s.level.themeId];
    ov.querySelector('.pol-phrase').textContent = phrase;
    ov.querySelector('.pol-stats').innerHTML =
      `❤️ ${s.heartsGot}/${s.level.totalHearts} &nbsp; 💍 ${s.ringsGot}/${s.level.rings.length} &nbsp; ★ ${finalScore}` +
      (newRecord ? '<br><span class="record">🎉 NOVO RECORDE! 🎉</span>' : '');
    ov.querySelector('.pol-album').textContent =
      `📸 Álbum: ${save.unlockedPhotos.length}/${PHOTOS.length} fotos desbloqueadas` +
      (newPhoto !== null ? ' — nova foto! 💕' : '');
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
      cv.width = 64; cv.height = 64;
      const cctx = cv.getContext('2d');
      cctx.imageSmoothingEnabled = false;
      const pxSize = c.type === 'cat' ? 4 : 3.6;
      drawCharacter(cctx, c, 'walkA', (64 - c.w * pxSize) / 2, (64 - c.h * pxSize) / 2 + 4, pxSize, false, save.equipped[c.id]);
      card.appendChild(cv);
      const nm = document.createElement('div');
      nm.className = 'char-name';
      nm.innerHTML = `<b>${c.name}</b><br><small>${c.sub}</small>`;
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
        `<small>${owned ? (equipped ? 'Equipado ✓' : 'Toque p/ equipar') : `💍 ${a.cost}`}</small>`;
      b.onclick = () => {
        if (!owned) {
          if (save.ringsBank >= a.cost) {
            save.ringsBank -= a.cost;
            save.accessories.push(a.id);
            save.equipped[save.selectedChar] = a.id;
            Save.commit();
            SFX.ring();
            showToast(`${a.emoji} ${a.name} comprado!`);
          } else {
            showToast(`Faltam 💍 ${a.cost - save.ringsBank} alianças — colete jogando!`);
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
      ? `▶ Continuar — Nível ${save2.lastLevel + 1}`
      : '▶ Começar aventura';
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
  }

  return {
    start, stop, nextLevel, replay, renderCharSelect, bindInputs,
    ACHIEVEMENTS,
    showToast,
  };
})();
