// ============================================================
// "Tabuleiro do Amor" — ludo digital para jogarem juntinhas
// ============================================================

const Board = (() => {
  const SIZE = 36; // casas (6 x 6 serpenteando)
  const COLS = 6;

  // tipos: i=início, f=fofa, p=picante, l=sorte, m=memória, F=final
  const LAYOUT = 'iffplfpfmfplfpfmflpffpmflfpfmpflpffF'.split('');

  const TYPE_INFO = {
    i: { label: '💕', name: 'Início', cls: 'cell-start' },
    f: { label: '💗', name: 'Fofa', cls: 'cell-cute' },
    p: { label: '🔥', name: 'Picante', cls: 'cell-spicy' },
    l: { label: '⭐', name: 'Sorte', cls: 'cell-luck' },
    m: { label: '📸', name: 'Memória', cls: 'cell-memory' },
    F: { label: '🏠', name: 'LAR', cls: 'cell-final' },
  };

  const PLAYERS = [
    { id: 'helen', name: 'Leãozinho', emoji: '🦁', color: '#e63962', charId: 'helen' },
    { id: 'le', name: 'Cascãozinho', emoji: '💜', color: '#7e57c2', charId: 'le' },
  ];

  let pos, turn, rolling, moving, decks, finished;

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = secureRandom(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function secureRandom(n) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % n;
  }

  function init() {
    pos = [0, 0];
    turn = 0; // Leãozinho começa 🦁
    rolling = false;
    moving = false;
    finished = false;
    decks = { f: shuffled(BOARD_CUTE), p: shuffled(BOARD_SPICY), l: shuffled(BOARD_LUCK) };
    buildGrid();
    placePawns(true);
    updateTurnUI();
    document.getElementById('board-win').classList.add('hidden');
    document.getElementById('dice-result').textContent = '';
    setDiceFace(secureRandom(6) + 1);
  }

  function buildGrid() {
    const grid = document.getElementById('board-grid');
    grid.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
      const cell = document.createElement('div');
      const t = TYPE_INFO[LAYOUT[i]];
      cell.className = 'board-cell ' + t.cls;
      cell.dataset.idx = i;
      const r = Math.floor(i / COLS);
      const c = r % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);
      cell.style.gridRow = String(Math.ceil(SIZE / COLS) - r);
      cell.style.gridColumn = String(c + 1);
      cell.innerHTML = `<span class="cell-num">${i === 0 ? '' : i === SIZE - 1 ? '' : i}</span><span class="cell-ico">${t.label}</span>`;
      grid.appendChild(cell);
    }
  }

  function cellEl(i) {
    return document.querySelector(`.board-cell[data-idx="${i}"]`);
  }

  function placePawns(instant) {
    for (let pIdx = 0; pIdx < 2; pIdx++) {
      let pawn = document.getElementById('pawn-' + PLAYERS[pIdx].id);
      if (!pawn) {
        pawn = document.createElement('canvas');
        pawn.id = 'pawn-' + PLAYERS[pIdx].id;
        pawn.className = 'pawn';
        pawn.width = 36; pawn.height = 44;
        const c = pawn.getContext('2d');
        c.imageSmoothingEnabled = false;
        const ch = getCharacter(PLAYERS[pIdx].charId);
        drawCharacter(c, ch, 'walkA', (36 - ch.w * 2.4) / 2, 4, 2.4, false, null);
        document.getElementById('board-wrap').appendChild(pawn);
      }
      const cell = cellEl(Math.min(pos[pIdx], SIZE - 1));
      const wrap = document.getElementById('board-wrap');
      const cr = cell.getBoundingClientRect();
      const wr = wrap.getBoundingClientRect();
      const ox = pIdx === 0 ? -9 : 9;
      pawn.style.transition = instant ? 'none' : 'left .22s ease, top .22s ease';
      pawn.style.left = (cr.left - wr.left + cr.width / 2 - 18 + ox) + 'px';
      pawn.style.top = (cr.top - wr.top + cr.height / 2 - 30) + 'px';
      pawn.style.zIndex = pIdx === turn ? 6 : 5;
    }
  }

  function updateTurnUI() {
    const p = PLAYERS[turn];
    const el = document.getElementById('turn-banner');
    el.innerHTML = `Vez do <b>${p.name}</b> ${p.emoji}`;
    el.style.background = p.color;
    document.getElementById('btn-roll').disabled = rolling || moving || finished;
  }

  // ---------- Dado ----------
  const PIPS = {
    1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
  };
  function setDiceFace(n) {
    const d = document.getElementById('dice');
    d.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const dot = document.createElement('span');
      dot.className = 'pip' + (PIPS[n].includes(i) ? ' on' : '');
      d.appendChild(dot);
    }
  }

  function roll() {
    if (rolling || moving || finished) return;
    rolling = true;
    updateTurnUI();
    const d = document.getElementById('dice');
    d.classList.add('rolling');
    SFX.dice();
    let ticks = 0;
    const iv = setInterval(() => {
      setDiceFace(secureRandom(6) + 1);
      ticks++;
      if (ticks >= 10) {
        clearInterval(iv);
        const n = secureRandom(6) + 1;
        setDiceFace(n);
        d.classList.remove('rolling');
        document.getElementById('dice-result').textContent =
          `${PLAYERS[turn].emoji} tirou ${n}!`;
        rolling = false;
        movePawn(n);
      }
    }, 90);
  }

  function movePawn(steps) {
    moving = true;
    updateTurnUI();
    const dir = steps >= 0 ? 1 : -1;
    let remaining = Math.abs(steps);
    const stepOnce = () => {
      if (remaining <= 0) {
        moving = false;
        updateTurnUI();
        const landed = pos[turn];
        if (landed >= SIZE - 1) { win(); return; }
        resolveCell(landed);
        return;
      }
      pos[turn] = Math.max(0, Math.min(SIZE - 1, pos[turn] + dir));
      placePawns(false);
      SFX.hop();
      remaining--;
      if (pos[turn] === SIZE - 1) remaining = 0;
      setTimeout(stepOnce, 260);
    };
    setTimeout(stepOnce, 300);
  }

  // ---------- Cartas ----------
  function drawCard(type) {
    if (!decks[type] || decks[type].length === 0) {
      decks[type] = shuffled(type === 'f' ? BOARD_CUTE : type === 'p' ? BOARD_SPICY : BOARD_LUCK);
    }
    return decks[type].pop();
  }

  function resolveCell(idx) {
    const t = LAYOUT[idx];
    if (t === 'f' || t === 'p') {
      const text = drawCard(t);
      showCard(t === 'f' ? 'Desafio fofo 💗' : 'Desafio picante 🔥', text, t === 'f' ? 'card-cute' : 'card-spicy', () => endTurn(false));
    } else if (t === 'l') {
      const card = drawCard('l');
      showCard('Casa da sorte ⭐', card.text, 'card-luck', () => {
        if (card.again) { endTurn(true); return; }
        if (card.move) { movePawn(card.move); return; }
        endTurn(false);
      });
    } else if (t === 'm') {
      const photo = PHOTOS[secureRandom(PHOTOS.length)];
      showMemory(photo, () => endTurn(false));
    } else {
      endTurn(false);
    }
  }

  function endTurn(again) {
    if (finished) return;
    if (!again) turn = 1 - turn;
    else Platformer.showToast(`${PLAYERS[turn].emoji} joga de novo!`);
    placePawns(false);
    updateTurnUI();
  }

  function showCard(title, text, cls, onDone) {
    const ov = document.getElementById('card-overlay');
    const card = document.getElementById('card-box');
    card.className = 'card-box ' + cls;
    document.getElementById('card-title').textContent = title;
    document.getElementById('card-player').textContent =
      `${PLAYERS[turn].name} ${PLAYERS[turn].emoji}`;
    document.getElementById('card-text').textContent = text;
    const img = document.getElementById('card-photo');
    img.classList.add('hidden');
    ov.classList.remove('hidden');
    SFX.card();
    document.getElementById('btn-card-done').onclick = () => {
      ov.classList.add('hidden');
      onDone();
    };
  }

  function showMemory(photo, onDone) {
    const ov = document.getElementById('card-overlay');
    const card = document.getElementById('card-box');
    card.className = 'card-box card-memory';
    document.getElementById('card-title').textContent = 'Casa da memória 📸';
    document.getElementById('card-player').textContent = 'Pra vocês duas 💕';
    document.getElementById('card-text').textContent = photo.caption;
    const img = document.getElementById('card-photo');
    img.src = photo.src;
    img.classList.remove('hidden');
    ov.classList.remove('hidden');
    SFX.card();
    document.getElementById('btn-card-done').onclick = () => {
      ov.classList.add('hidden');
      onDone();
    };
  }

  function win() {
    finished = true;
    placePawns(false);
    const p = PLAYERS[turn];
    const photo = PHOTOS[secureRandom(PHOTOS.length)];
    const ov = document.getElementById('board-win');
    document.getElementById('win-title').textContent = `${p.name} ${p.emoji} chegou no LAR!`;
    document.getElementById('win-photo').src = photo.src;
    ov.classList.remove('hidden');
    SFX.win();
    confettiBurst();
    updateTurnUI();
  }

  window.addEventListener('resize', () => {
    if (document.getElementById('screen-board').classList.contains('active') && pos) {
      placePawns(true);
    }
  });

  return { init, roll };
})();
