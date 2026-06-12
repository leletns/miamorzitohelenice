// ============================================================
// Navegação, save, sons e telas do presente 💕
// ============================================================

// ---------- Save (localStorage — fica pra sempre no celular) ----------
const Save = (() => {
  const KEY = 'miamorzito_save_v1';
  const DEFAULTS = {
    selectedChar: 'helen',
    bestScore: 0,
    totalHearts: 0,
    ringsBank: 0,
    lastLevel: 0,
    levelsDone: [],
    unlockedPhotos: [],
    achievements: {},
    accessories: [],
    equipped: {},
    charsPlayed: [],
  };
  let data;
  try {
    data = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}'));
  } catch (e) {
    data = Object.assign({}, DEFAULTS);
  }
  return {
    get: () => data,
    commit() {
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* sem espaço, segue o jogo */ }
    },
  };
})();

// ---------- Sons (WebAudio, gerados em código — leves e eternos) ----------
const SFX = (() => {
  let ac = null;
  function ctx() {
    if (!ac) {
      try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function beep(freq, dur, type, vol, when) {
    const a = ctx();
    if (!a) return;
    const t = a.currentTime + (when || 0);
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol || 0.06, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
  return {
    jump() { beep(300, 0.12, 'square', 0.05); beep(480, 0.1, 'square', 0.04, 0.04); },
    pickup(mult) { beep(620 + mult * 70, 0.09, 'square', 0.05); },
    ring() { beep(880, 0.1, 'triangle', 0.07); beep(1175, 0.12, 'triangle', 0.07, 0.08); beep(1568, 0.18, 'triangle', 0.07, 0.16); },
    hurt() { beep(200, 0.18, 'sawtooth', 0.05); beep(140, 0.18, 'sawtooth', 0.05, 0.06); },
    win() { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.18, 'triangle', 0.07, i * 0.12)); },
    fanfare() { [659, 880].forEach((f, i) => beep(f, 0.14, 'triangle', 0.06, i * 0.1)); },
    dice() { for (let i = 0; i < 6; i++) beep(280 + Math.random() * 200, 0.05, 'square', 0.04, i * 0.1); },
    hop() { beep(420, 0.06, 'square', 0.04); },
    card() { beep(700, 0.08, 'triangle', 0.05); beep(940, 0.1, 'triangle', 0.05, 0.07); },
  };
})();

// ---------- Confete ----------
function confettiBurst() {
  const colors = ['#ff4d6d', '#ffd95e', '#7e57c2', '#67a06f', '#5b8bd9', '#ff8f1f'];
  const box = document.getElementById('confetti');
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('span');
    c.className = 'confetti-bit';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = Math.random() * 0.6 + 's';
    c.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
    c.style.width = c.style.height = 4 + Math.random() * 5 + 'px';
    box.appendChild(c);
    setTimeout(() => c.remove(), 3600);
  }
}

// ---------- Navegação entre telas ----------
function show(screenId) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if (screenId !== 'screen-game') Platformer.stop();
  if (screenId === 'screen-charselect') Platformer.renderCharSelect();
  if (screenId === 'screen-board') Board.init();
  if (screenId === 'screen-album') renderAlbum();
  if (screenId === 'screen-letter') renderLetter();
  window.scrollTo(0, 0);
}

// ---------- Álbum (fotos + conquistas) ----------
function renderAlbum() {
  const save = Save.get();
  const ph = document.getElementById('album-photos');
  ph.innerHTML = '';
  PHOTOS.forEach((p, i) => {
    const unlocked = save.unlockedPhotos.includes(i);
    const fig = document.createElement('figure');
    fig.className = 'album-pol' + (unlocked ? '' : ' locked');
    fig.innerHTML = unlocked
      ? `<img src="${p.src}" alt=""><figcaption>${p.caption}</figcaption>`
      : `<div class="pol-lock">?</div><figcaption>Complete fases para desbloquear</figcaption>`;
    ph.appendChild(fig);
  });
  document.getElementById('album-count').textContent =
    `${save.unlockedPhotos.length}/${PHOTOS.length} fotos desbloqueadas`;

  const ach = document.getElementById('album-achievements');
  ach.innerHTML = '';
  for (const a of Platformer.ACHIEVEMENTS) {
    const got = !!save.achievements[a.id];
    const el = document.createElement('div');
    el.className = 'ach' + (got ? ' got' : '');
    el.innerHTML = `<span class="ach-emoji">${got ? a.emoji : '?'}</span>
      <div><b>${a.name}</b><small>${a.desc}</small></div>`;
    ach.appendChild(el);
  }

  document.getElementById('album-stats').innerHTML =
    `recorde <b>${save.bestScore}</b> · corações <b>${save.totalHearts}</b> · alianças <b>${save.ringsBank}</b>`;
}

// ---------- Cartinha ----------
let letterRendered = false;
function renderLetter() {
  if (letterRendered) return;
  letterRendered = true;
  const box = document.getElementById('letter-body');
  const frag = document.createDocumentFragment();
  LETTER_PARAGRAPHS.forEach((p, i) => {
    const para = document.createElement('p');
    para.innerHTML = p.replace(/\n/g, '<br>');
    frag.appendChild(para);
    // intercala polaroids entre parágrafos
    const photoIdx = [1, 3, 5, 7, 8][i];
    if (photoIdx !== undefined && PHOTOS[photoIdx]) {
      const fig = document.createElement('figure');
      fig.className = 'letter-pol' + (i % 2 ? ' tilt-l' : ' tilt-r');
      fig.innerHTML = `<img src="${PHOTOS[photoIdx].src}" alt=""><figcaption>${PHOTOS[photoIdx].caption}</figcaption>`;
      frag.appendChild(fig);
    }
  });
  const sig = document.createElement('p');
  sig.className = 'letter-sig';
  sig.textContent = LETTER_SIGNATURE;
  frag.appendChild(sig);
  box.appendChild(frag);
}

// ---------- Boot ----------
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('letter-title').textContent = LETTER_TITLE;
  Platformer.bindInputs();

  // botões do hub
  document.querySelectorAll('[data-goto]').forEach((b) => {
    b.addEventListener('click', () => show(b.dataset.goto));
  });

  // aventura
  document.getElementById('btn-continue').addEventListener('click', () => {
    show('screen-game');
    Platformer.start(Save.get().lastLevel);
  });
  document.getElementById('btn-restart-lv1').addEventListener('click', () => {
    show('screen-game');
    Platformer.start(0);
  });
  document.getElementById('btn-pol-next').addEventListener('click', () => Platformer.nextLevel());
  document.getElementById('btn-pol-menu').addEventListener('click', () => show('screen-home'));

  // tabuleiro
  document.getElementById('btn-roll').addEventListener('click', () => Board.roll());
  document.getElementById('btn-win-replay').addEventListener('click', () => Board.init());
  document.getElementById('btn-win-menu').addEventListener('click', () => show('screen-home'));

  // ícones pixel-art nos elementos marcados
  document.querySelectorAll('img[data-icon]').forEach((im) => {
    im.src = iconDataURL(im.dataset.icon, parseInt(im.dataset.scale || '4', 10));
  });

  // corações pixel flutuando no título
  const floatBox = document.getElementById('floating-hearts');
  if (floatBox) {
    const heartURL = iconDataURL('heart', 3);
    for (let i = 0; i < 10; i++) {
      const h = document.createElement('img');
      h.className = 'float-heart';
      h.src = heartURL;
      h.style.left = Math.random() * 100 + '%';
      h.style.width = 10 + Math.random() * 14 + 'px';
      h.style.animationDuration = 9 + Math.random() * 10 + 's';
      h.style.animationDelay = -Math.random() * 12 + 's';
      floatBox.appendChild(h);
    }
  }

  // garante a fonte pixel antes de desenhar placas no canvas
  if (document.fonts && document.fonts.load) {
    document.fonts.load('6px "Press Start 2P"');
  }

  show('screen-home');
});

// ---------- PWA: offline para sempre ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* file:// ou navegador antigo */ });
  });
}
