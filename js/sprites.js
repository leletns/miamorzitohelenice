// ============================================================
// Pixel-art em código: personagens, acessórios e helpers
// ============================================================
// Cada sprite é uma grade de caracteres; o palette mapeia
// caractere -> cor. '.' é transparente.

function drawPixelMap(ctx, map, palette, x, y, px, flip) {
  for (let r = 0; r < map.length; r++) {
    const row = map[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === '.') continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      const cx = flip ? (row.length - 1 - c) : c;
      ctx.fillRect(Math.round(x + cx * px), Math.round(y + r * px), Math.ceil(px), Math.ceil(px));
    }
  }
}

// ---------- Humanas (12 x 16) ----------
const GIRL_LONGHAIR = {
  walkA: [
    '..HHHHHHHH..',
    '.HHHHHHHHHH.',
    '.HHSSSSSSHH.',
    '.HHSESSESHH.',
    '.HHSSSSSSHH.',
    '.HHSSMMSSHH.',
    '.HH.SSSS.HH.',
    '.HH.TTTT.HH.',
    '.H.TTTTTT.H.',
    '...TTTTTT...',
    '..S.TTTT.S..',
    '....PPPP....',
    '....P..P....',
    '....P..P....',
    '...BB..BB...',
    '............',
  ],
  walkB: [
    '..HHHHHHHH..',
    '.HHHHHHHHHH.',
    '.HHSSSSSSHH.',
    '.HHSESSESHH.',
    '.HHSSSSSSHH.',
    '.HHSSMMSSHH.',
    '.HH.SSSS.HH.',
    '.HH.TTTT.HH.',
    '.H.TTTTTT.H.',
    '...TTTTTT...',
    '..S.TTTT.S..',
    '...PP..PP...',
    '...P....P...',
    '...P....P...',
    '..BB....BB..',
    '............',
  ],
  jump: [
    '..HHHHHHHH..',
    '.HHHHHHHHHH.',
    '.HHSSSSSSHH.',
    '.HHSESSESHH.',
    '.HHSSSSSSHH.',
    '.HHSSMMSSHH.',
    '.HH.SSSS.HH.',
    'SHH.TTTT.HHS',
    '.H.TTTTTT.H.',
    '...TTTTTT...',
    '....TTTT....',
    '...PP..PP...',
    '..PP....PP..',
    '..B......B..',
    '............',
    '............',
  ],
};

const GIRL_CURLY = {
  walkA: [
    '.H.HHHHHH.H.',
    'HHHHHHHHHHHH',
    '.HHSSSSSSHH.',
    'HHHSESSESHHH',
    '.HHSSSSSSHH.',
    'HHHSSMMSSHHH',
    '.HH.SSSS.HH.',
    '.HH.TTTT.HH.',
    '.H.TTTTTT.H.',
    '...TTTTTT...',
    '..S.TTTT.S..',
    '....PPPP....',
    '....P..P....',
    '....P..P....',
    '...BB..BB...',
    '............',
  ],
  walkB: [
    '.H.HHHHHH.H.',
    'HHHHHHHHHHHH',
    '.HHSSSSSSHH.',
    'HHHSESSESHHH',
    '.HHSSSSSSHH.',
    'HHHSSMMSSHHH',
    '.HH.SSSS.HH.',
    '.HH.TTTT.HH.',
    '.H.TTTTTT.H.',
    '...TTTTTT...',
    '..S.TTTT.S..',
    '...PP..PP...',
    '...P....P...',
    '...P....P...',
    '..BB....BB..',
    '............',
  ],
  jump: [
    '.H.HHHHHH.H.',
    'HHHHHHHHHHHH',
    '.HHSSSSSSHH.',
    'HHHSESSESHHH',
    '.HHSSSSSSHH.',
    'HHHSSMMSSHHH',
    '.HH.SSSS.HH.',
    'SHH.TTTT.HHS',
    '.H.TTTTTT.H.',
    '...TTTTTT...',
    '....TTTT....',
    '...PP..PP...',
    '..PP....PP..',
    '..B......B..',
    '............',
    '............',
  ],
};

// ---------- Gatinhas (14 x 10) ----------
const CAT = {
  walkA: [
    '...........K..',
    'K.....A..A.K..',
    'KK...AAAAAA...',
    '.KK..AEAAEA...',
    '..WWWWAANA....',
    '.WWWWWWAAA....',
    '.WWWWWWWW.....',
    '.WW.WW.WW.....',
    '.AA..AA..AA...',
    '..............',
  ],
  walkB: [
    '..K...........',
    '.K....A..A....',
    '.KK..AAAAAA...',
    '..KK.AEAAEA...',
    '..WWWWAANA....',
    '.WWWWWWAAA....',
    '.WWWWWWWW.....',
    '.W.WW.WW.W....',
    'AA..AA..AA....',
    '..............',
  ],
  jump: [
    '...........K..',
    'K.....A..A.K..',
    '.K...AAAAAA...',
    '.KK..AEAAEA...',
    '..WWWWAANA....',
    '.WWWWWWAAA....',
    'WWWWWWWWW.....',
    'WA......AA....',
    'A..........',
    '..............',
  ],
};

// ---------- Personagens ----------
const CHARACTERS = [
  {
    id: 'le',
    name: 'Lê',
    sub: 'Cascãozinho 💜',
    type: 'girl',
    maps: GIRL_CURLY,
    w: 12, h: 16,
    palette: {
      H: '#2a1a12', S: '#c98e6a', E: '#241208', M: '#b65a54',
      T: '#7e57c2', P: '#3d5a80', B: '#fdf6ec',
    },
  },
  {
    id: 'helen',
    name: 'Helen',
    sub: 'Leãozinho 🦁',
    type: 'girl',
    maps: GIRL_LONGHAIR,
    w: 12, h: 16,
    palette: {
      H: '#1c1410', S: '#b97a56', E: '#1c0d04', M: '#a8524c',
      T: '#e63962', P: '#222a3a', B: '#f5e9d9',
    },
  },
  {
    id: 'siamesa',
    name: 'Gatinha da Helen',
    sub: 'Siamesa 🤍',
    type: 'cat',
    maps: CAT,
    w: 14, h: 10,
    palette: {
      W: '#f3e9d8', A: '#e8d9c2', K: '#5b4634', E: '#4a86c8', N: '#d98a8a',
    },
  },
  {
    id: 'nice',
    name: 'Nice',
    sub: 'Gatinha preta 🖤',
    type: 'cat',
    maps: CAT,
    w: 14, h: 10,
    palette: {
      W: '#23202a', A: '#171419', K: '#23202a', E: '#e8c94f', N: '#d98a8a',
    },
  },
];

// ---------- Acessórios (comprados com alianças 💍) ----------
// draw(ctx, x, y, px, flip): x/y é o canto superior esquerdo do sprite
const ACCESSORIES = [
  {
    id: 'laco', name: 'Lacinho rosa', emoji: '🎀', cost: 10,
    draw(ctx, x, y, px, headW) {
      ctx.fillStyle = '#ff6fa5';
      ctx.fillRect(x + px * (headW / 2 - 2), y - px, px * 1.6, px * 1.6);
      ctx.fillRect(x + px * (headW / 2 + 0.6), y - px, px * 1.6, px * 1.6);
      ctx.fillStyle = '#e63962';
      ctx.fillRect(x + px * (headW / 2 - 0.4), y - px * 0.6, px, px);
    },
  },
  {
    id: 'flor', name: 'Florzinha', emoji: '🌼', cost: 15,
    draw(ctx, x, y, px, headW) {
      ctx.fillStyle = '#ffd95e';
      ctx.fillRect(x + px * (headW - 3), y - px * 0.5, px, px);
      ctx.fillStyle = '#fff5fa';
      ctx.fillRect(x + px * (headW - 4), y - px * 0.5, px, px);
      ctx.fillRect(x + px * (headW - 2), y - px * 0.5, px, px);
      ctx.fillRect(x + px * (headW - 3), y - px * 1.5, px, px);
      ctx.fillRect(x + px * (headW - 3), y + px * 0.5, px, px);
    },
  },
  {
    id: 'coroa', name: 'Coroinha', emoji: '👑', cost: 20,
    draw(ctx, x, y, px, headW) {
      ctx.fillStyle = '#f7c948';
      const cx = x + px * (headW / 2 - 2.5);
      ctx.fillRect(cx, y - px * 0.6, px * 5, px * 0.8);
      ctx.fillRect(cx, y - px * 1.6, px, px);
      ctx.fillRect(cx + px * 2, y - px * 2, px, px * 1.4);
      ctx.fillRect(cx + px * 4, y - px * 1.6, px, px);
    },
  },
  {
    id: 'oculos', name: 'Oculinhos', emoji: '🕶️', cost: 25,
    draw(ctx, x, y, px, headW, char) {
      const eyeRow = char.type === 'cat' ? 3 : 3;
      ctx.fillStyle = '#1b1b24';
      ctx.fillRect(x + px * 2.5, y + px * eyeRow, px * 3, px * 1.2);
      ctx.fillRect(x + px * 6.5, y + px * eyeRow, px * 3, px * 1.2);
      ctx.fillRect(x + px * 5.5, y + px * (eyeRow + 0.2), px, px * 0.5);
    },
  },
];

function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[1];
}
function getAccessory(id) {
  return ACCESSORIES.find((a) => a.id === id) || null;
}

// Desenha um personagem (com acessório equipado, se houver)
function drawCharacter(ctx, char, frame, x, y, px, flip, accessoryId) {
  const map = char.maps[frame] || char.maps.walkA;
  drawPixelMap(ctx, map, char.palette, x, y, px, flip);
  if (accessoryId) {
    const acc = getAccessory(accessoryId);
    if (acc) acc.draw(ctx, x, y, px, char.w, char);
  }
}

// Coração coletável (8 x 7)
const HEART_MAP = [
  '.RR..RR.',
  'RRRRRRRR',
  'RRRWRRRR',
  'RRRRRRRR',
  '.RRRRRR.',
  '..RRRR..',
  '...RR...',
];
const HEART_PAL = { R: '#ff4d6d', W: '#ffd0da' };

// Aliança de prata (9 x 9)
const RING_MAP = [
  '....W....',
  '...WDW...',
  '...GGG...',
  '..G...G..',
  '.G.....G.',
  '.G.....G.',
  '..G...G..',
  '...GGG...',
];
const RING_PAL = { G: '#cfd6e0', W: '#eef3f9', D: '#9fb0c4' };
// (o brilho do diamante é desenhado em cima, no engine)

function drawHeart(ctx, x, y, px) { drawPixelMap(ctx, HEART_MAP, HEART_PAL, x, y, px, false); }
function drawRing(ctx, x, y, px) { drawPixelMap(ctx, RING_MAP, RING_PAL, x, y, px, false); }
