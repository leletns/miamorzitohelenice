// ============================================================
// Pixel-art em código: personagens, ícones e helpers
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

// ============================================================
// HELEN — cabelo longo liso escuro, blusa preta, calça jeans clara
// 16 x 22
// ============================================================
const HELEN_MAPS = {
  walkA: [
    '....HHHHHHHH....',
    '...HHHHHHHHHH...',
    '..HHHHHHHHHHHH..',
    '..HHhSSSSSShHH..',
    '..HSSBSSSSBSSH..',
    '..HSSESSSSESSH..',
    '..HSSSSSSSSSSH..',
    '..HSSSSMMSSSSH..',
    '..HHSSSSSSSSHH..',
    '..HH..SSSS..HH..',
    '..HH.TTTTTT.HH..',
    '..HHTTTTTTTTHH..',
    '..HHTTTTTTTTHH..',
    '..HHTTTTTTTTHH..',
    '...STTTTTTTTS...',
    '...S.TTTTTT.S...',
    '.....JJJJJJ.....',
    '.....JJJJJJ.....',
    '.....JJjjJJ.....',
    '....JJj..jJJ....',
    '....Jj....jJ....',
    '...WWW....WWW...',
  ],
  walkB: [
    '....HHHHHHHH....',
    '...HHHHHHHHHH...',
    '..HHHHHHHHHHHH..',
    '..HHhSSSSSShHH..',
    '..HSSBSSSSBSSH..',
    '..HSSESSSSESSH..',
    '..HSSSSSSSSSSH..',
    '..HSSSSMMSSSSH..',
    '..HHSSSSSSSSHH..',
    '..HH..SSSS..HH..',
    '..HH.TTTTTT.HH..',
    '..HHTTTTTTTTHH..',
    '..HHTTTTTTTTHH..',
    '..HHTTTTTTTTHH..',
    '...STTTTTTTTS...',
    '...S.TTTTTT.S...',
    '.....JJJJJJ.....',
    '.....JJJJJJ.....',
    '......JjjJ......',
    '......Jj.J......',
    '......J..J......',
    '.....WWW.WWW....',
  ],
  jump: [
    '....HHHHHHHH....',
    '...HHHHHHHHHH...',
    '..HHHHHHHHHHHH..',
    '..HHhSSSSSShHH..',
    '..HSSBSSSSBSSH..',
    '..HSSESSSSESSH..',
    '..HSSSSSSSSSSH..',
    '..HSSSSMMSSSSH..',
    '..HHSSSSSSSSHH..',
    '.SHH..SSSS..HHS.',
    '.SHH.TTTTTT.HHS.',
    '..HHTTTTTTTTHH..',
    '..HHTTTTTTTTHH..',
    '..HHTTTTTTTTHH..',
    '....TTTTTTTT....',
    '.....TTTTTT.....',
    '.....JJJJJJ.....',
    '....JJJ..JJJ....',
    '...JJJ....JJJ...',
    '...Jj......jJ...',
    '..WWW......WWW..',
    '................',
  ],
};

// ============================================================
// LÊ — cabelo cacheado volumoso, óculos, blusa verde-sálvia
// 16 x 22
// ============================================================
const LE_MAPS = {
  walkA: [
    '...H.HHHHHH.H...',
    '..HHHHHHHHHHHH..',
    '.HHHHHHHHHHHHHH.',
    '.HHHhSSSSSShHHH.',
    '.HHSSBSSSSBSSHH.',
    '.HHGGGGSSGGGGHH.',
    '.HHGEGGSSGEGGHH.',
    '.HHSSSSMMSSSSHH.',
    '.HHHSSSSSSSSHHH.',
    '..HH..SSSS..HH..',
    '..HH.VVVVVV.HH..',
    '..H.VVVVVVVV.H..',
    '....VVVVVVVV....',
    '....VVVVVVVV....',
    '...SVVVVVVVVS...',
    '...S.VVVVVV.S...',
    '.....jjjjjj.....',
    '.....jjjjjj.....',
    '.....jjJJjj.....',
    '....jjJ..Jjj....',
    '....jJ....Jj....',
    '...WWW....WWW...',
  ],
  walkB: [
    '...H.HHHHHH.H...',
    '..HHHHHHHHHHHH..',
    '.HHHHHHHHHHHHHH.',
    '.HHHhSSSSSShHHH.',
    '.HHSSBSSSSBSSHH.',
    '.HHGGGGSSGGGGHH.',
    '.HHGEGGSSGEGGHH.',
    '.HHSSSSMMSSSSHH.',
    '.HHHSSSSSSSSHHH.',
    '..HH..SSSS..HH..',
    '..HH.VVVVVV.HH..',
    '..H.VVVVVVVV.H..',
    '....VVVVVVVV....',
    '....VVVVVVVV....',
    '...SVVVVVVVVS...',
    '...S.VVVVVV.S...',
    '.....jjjjjj.....',
    '.....jjjjjj.....',
    '......jJJj......',
    '......jJ.j......',
    '......j..j......',
    '.....WWW.WWW....',
  ],
  jump: [
    '...H.HHHHHH.H...',
    '..HHHHHHHHHHHH..',
    '.HHHHHHHHHHHHHH.',
    '.HHHhSSSSSShHHH.',
    '.HHSSBSSSSBSSHH.',
    '.HHGGGGSSGGGGHH.',
    '.HHGEGGSSGEGGHH.',
    '.HHSSSSMMSSSSHH.',
    '.HHHSSSSSSSSHHH.',
    '.SHH..SSSS..HHS.',
    '.SHH.VVVVVV.HHS.',
    '..H.VVVVVVVV.H..',
    '....VVVVVVVV....',
    '....VVVVVVVV....',
    '....VVVVVVVV....',
    '.....VVVVVV.....',
    '.....jjjjjj.....',
    '....jjj..jjj....',
    '...jjj....jjj...',
    '...jJ......Jj...',
    '..WWW......WWW..',
    '................',
  ],
};

// ============================================================
// GATAS — vista lateral de verdade: orelhas, focinho, 4 patas,
// rabo erguido. 20 x 14, viradas para a direita.
// ============================================================
const CAT_MAPS = {
  walkA: [
    '.k..................',
    '.kk.................',
    '..k.................',
    '..k.........kk..kk..',
    '..k.........kAkkAk..',
    '..kk........AAAAAA..',
    '...k........AEAAEA..',
    '...kAAAAAAAAAAAAAA..',
    '....AAAAAAAAAAwNw...',
    '....AAAAAAAAAAww....',
    '....AAAAAAAAAA......',
    '....kA...AAk..A.....',
    '...kA....Ak....A....',
    '...p.....p.....p....',
  ],
  walkB: [
    '..k.................',
    '.kk.................',
    '.k..................',
    '.k..........kk..kk..',
    '.kk.........kAkkAk..',
    '..k.........AAAAAA..',
    '..kk........AEAAEA..',
    '...kAAAAAAAAAAAAAA..',
    '....AAAAAAAAAAwNw...',
    '....AAAAAAAAAAww....',
    '....AAAAAAAAAA......',
    '....Ak...kAA..k.....',
    '....Ak....kA...k....',
    '....p......p...p....',
  ],
  jump: [
    'k...................',
    'kk..................',
    '.k..........kk..kk..',
    '.k..........kAkkAk..',
    '..k.........AAAAAA..',
    '..kk........AEAAEA..',
    '...kkAAAAAAAAAAAAA..',
    '.....AAAAAAAAAwNw...',
    '....AAAAAAAAAAww....',
    '...kA....AAAA.......',
    '..kA......kAA.......',
    '..A........kA.......',
    '.A..........A.......',
    '....................',
  ],
};

// ============================================================
// Personagens
// ============================================================
const CHARACTERS = [
  {
    id: 'le',
    name: 'LÊ',
    sub: 'Cascãozinho',
    type: 'girl',
    maps: LE_MAPS,
    w: 16, h: 22,
    palette: {
      H: '#241510', h: '#3c2418', S: '#c08a64', B: '#241510',
      E: '#1c0d04', M: '#a8524c', G: '#2b2b36',
      V: '#7e9b6e', j: '#33415e', J: '#26314a', W: '#e8e4dc',
    },
  },
  {
    id: 'helen',
    name: 'HELEN',
    sub: 'Leãozinho',
    type: 'girl',
    maps: HELEN_MAPS,
    w: 16, h: 22,
    palette: {
      H: '#1a110c', h: '#2e1d14', S: '#b97a56', B: '#1a110c',
      E: '#190b03', M: '#9c4f49',
      T: '#23222c', J: '#9db8d4', j: '#7e9ab8', W: '#ece6da',
    },
  },
  {
    id: 'siamesa',
    name: 'MIA',
    sub: 'Gata da Helen',
    type: 'cat',
    maps: CAT_MAPS,
    w: 20, h: 14,
    palette: {
      A: '#efe3cf', k: '#4a3526', E: '#4a86c8',
      w: '#fbf6ec', N: '#cf8080', p: '#4a3526',
    },
  },
  {
    id: 'nice',
    name: 'NICE',
    sub: 'Gata preta',
    type: 'cat',
    maps: CAT_MAPS,
    w: 20, h: 14,
    palette: {
      A: '#22202b', k: '#15131c', E: '#f0c33c',
      w: '#33303e', N: '#b76e74', p: '#15131c',
    },
  },
];

// ============================================================
// Acessórios (comprados com alianças)
// ============================================================
const ACCESSORIES = [
  {
    id: 'laco', name: 'Laço', emoji: '🎀', cost: 10,
    draw(ctx, x, y, px, headW) {
      const cx = x + px * (headW / 2);
      ctx.fillStyle = '#ff5d8f';
      ctx.fillRect(cx - px * 2.4, y - px * 1.2, px * 2, px * 2);
      ctx.fillRect(cx + px * 0.4, y - px * 1.2, px * 2, px * 2);
      ctx.fillStyle = '#d13869';
      ctx.fillRect(cx - px * 0.6, y - px * 0.8, px * 1.2, px * 1.2);
    },
  },
  {
    id: 'flor', name: 'Flor', emoji: '🌼', cost: 15,
    draw(ctx, x, y, px, headW) {
      const fx = x + px * (headW - 4.5);
      ctx.fillStyle = '#fff3f6';
      ctx.fillRect(fx - px, y, px, px);
      ctx.fillRect(fx + px, y, px, px);
      ctx.fillRect(fx, y - px, px, px);
      ctx.fillRect(fx, y + px, px, px);
      ctx.fillStyle = '#ffc93c';
      ctx.fillRect(fx, y, px, px);
    },
  },
  {
    id: 'coroa', name: 'Coroa', emoji: '👑', cost: 20,
    draw(ctx, x, y, px, headW) {
      const cx = x + px * (headW / 2 - 3);
      ctx.fillStyle = '#f7c948';
      ctx.fillRect(cx, y - px, px * 6, px);
      ctx.fillRect(cx, y - px * 2.6, px, px * 1.6);
      ctx.fillRect(cx + px * 2.5, y - px * 3, px, px * 2);
      ctx.fillRect(cx + px * 5, y - px * 2.6, px, px * 1.6);
      ctx.fillStyle = '#e63962';
      ctx.fillRect(cx + px * 2.5, y - px * 2, px, px * 0.8);
    },
  },
  {
    id: 'bone', name: 'Boné', emoji: '🧢', cost: 25,
    draw(ctx, x, y, px, headW) {
      const cx = x + px * (headW / 2 - 4);
      ctx.fillStyle = '#5b8bd9';
      ctx.fillRect(cx, y - px * 0.5, px * 8, px * 1.6);
      ctx.fillRect(cx + px, y - px * 1.5, px * 6, px);
      ctx.fillStyle = '#3a64a8';
      ctx.fillRect(cx + px * 6.5, y + px * 0.6, px * 4, px * 0.9);
    },
  },
];

function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[1];
}
function getAccessory(id) {
  return ACCESSORIES.find((a) => a.id === id) || null;
}

function drawCharacter(ctx, char, frame, x, y, px, flip, accessoryId) {
  const map = char.maps[frame] || char.maps.walkA;
  drawPixelMap(ctx, map, char.palette, x, y, px, flip);
  if (accessoryId) {
    const acc = getAccessory(accessoryId);
    if (acc) acc.draw(ctx, x, y, px, char.w, char);
  }
}

// ============================================================
// Coletáveis e ícones pixel-art
// ============================================================
const HEART_MAP = [
  '.RR..RR.',
  'RRRWRRRR',
  'RRWRRRRR',
  'RRRRRRRR',
  '.RRRRRR.',
  '..RRRR..',
  '...RR...',
];
const HEART_PAL = { R: '#ff4d6d', W: '#ffc2cf' };

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
const RING_PAL = { G: '#cfd6e0', W: '#ffffff', D: '#8fd8e8' };

function drawHeart(ctx, x, y, px) { drawPixelMap(ctx, HEART_MAP, HEART_PAL, x, y, px, false); }
function drawRing(ctx, x, y, px) { drawPixelMap(ctx, RING_MAP, RING_PAL, x, y, px, false); }

// Ícones de UI (gerados como dataURL para usar em <img>)
const ICON_MAPS = {
  heart: { map: HEART_MAP, pal: HEART_PAL },
  ring: { map: RING_MAP, pal: RING_PAL },
  dice: {
    map: [
      'WWWWWWWW',
      'WKW..WKW',
      'W......W',
      'W..KK..W',
      'W..KK..W',
      'W......W',
      'WKW..WKW',
      'WWWWWWWW',
    ],
    pal: { W: '#f4f1ea', K: '#1d1b26' },
  },
  cam: {
    map: [
      '...KK...',
      'KKKKKKKK',
      'KWWKKWWK',
      'KWKWWKWK',
      'KWKWWKWK',
      'KWWKKWWK',
      'KKKKKKKK',
    ],
    pal: { K: '#4f6fae', W: '#cfe0f8' },
  },
  letter: {
    map: [
      'KKKKKKKK',
      'KWWWWWWK',
      'KWKWWKWK',
      'KWWKKWWK',
      'KWWWWWWK',
      'KWWRRWWK',
      'KKKKKKKK',
    ],
    pal: { K: '#b08948', W: '#f6ecd8', R: '#e0455e' },
  },
  flame: {
    map: [
      '...R....',
      '..RR.R..',
      '.RRRRR..',
      '.RRYRR..',
      'RRYYYRR.',
      'RYYWYYR.',
      '.RYYYR..',
      '..RRR...',
    ],
    pal: { R: '#ff5c33', Y: '#ffb13d', W: '#fff3c4' },
  },
  star: {
    map: [
      '...Y....',
      '...YY...',
      'YYYYYYY.',
      '.YYYYY..',
      '..YYY...',
      '.YY.YY..',
      'Y.....Y.',
    ],
    pal: { Y: '#ffd24d' },
  },
  house: {
    map: [
      '...RR...',
      '..RRRR..',
      '.RRRRRR.',
      'RRRRRRRR',
      '.WWWWWW.',
      '.WWKKWW.',
      '.WWKKWW.',
    ],
    pal: { R: '#e2725b', W: '#f6ecd8', K: '#7a4a2b' },
  },
  pad: {
    map: [
      '.KKKKKK.',
      'KKWKKKKK',
      'KWWWKBKK',
      'KKWKKKBK',
      'KKKKKKKK',
      '.KK..KK.',
    ],
    pal: { K: '#7e57c2', W: '#efe7fb', B: '#ff5d8f' },
  },
};

function iconDataURL(name, scale) {
  const def = ICON_MAPS[name];
  if (!def) return '';
  const s = scale || 4;
  const cv = document.createElement('canvas');
  cv.width = def.map[0].length * s;
  cv.height = def.map.length * s;
  const c = cv.getContext('2d');
  drawPixelMap(c, def.map, def.pal, 0, 0, s, false);
  return cv.toDataURL();
}
