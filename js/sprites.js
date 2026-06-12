// ============================================================
// Pixel-art em código: personagens chibi, ícones e helpers
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
// HELEN — chibi: cabelão liso castanho, cropped branco, jeans claro
// 22 x 26
// ============================================================
const HELEN_MAPS = {
  walkA: [
    '.....ooooooooooo......',
    '...ooHHHHHHHHHHHoo....',
    '..oHHHHHHHHHHHHHHHo...',
    '..oHHhhHHHHHHHHHhHo...',
    '.oHHHooooooooooooHHo..',
    '.oHHoSSSSSSSSSSSSoHHo.',
    '.oHHoSPPSSSSSSPPSoHHo.',
    '.oHHoSPXSSSSSSPXSoHHo.',
    '.oHHoRSSSSSSSSSSRoHHo.',
    '.oHHoSSommmmmoSSSoHHo.',
    '.oHHoSSSommmoSSSSoHHo.',
    '..oHHoSSSSSSSSSSoHHo..',
    '..oHHHoooooooooHHHo...',
    '..oHHo.oWWWWWWo.oHHo..',
    '..oHHoWWWWWWWWWWoHHo..',
    '..oHHoWWWWWWWWWWoHHo..',
    '...oooSWWWWWWWWSooo...',
    '.....oSoWWWWWWoSo.....',
    '......oWWWWWWWWo......',
    '......oJJJJJJJJo......',
    '......oJJJJJJJJo......',
    '......oJJJooJJJo......',
    '......oJJo..oJJo......',
    '.....oJJo....oJJo.....',
    '.....oKKo....oKKo.....',
    '......oo......oo......',
  ],
  walkB: [
    '.....ooooooooooo......',
    '...ooHHHHHHHHHHHoo....',
    '..oHHHHHHHHHHHHHHHo...',
    '..oHHhhHHHHHHHHHhHo...',
    '.oHHHooooooooooooHHo..',
    '.oHHoSSSSSSSSSSSSoHHo.',
    '.oHHoSPPSSSSSSPPSoHHo.',
    '.oHHoSPXSSSSSSPXSoHHo.',
    '.oHHoRSSSSSSSSSSRoHHo.',
    '.oHHoSSommmmmoSSSoHHo.',
    '.oHHoSSSommmoSSSSoHHo.',
    '..oHHoSSSSSSSSSSoHHo..',
    '..oHHHoooooooooHHHo...',
    '..oHHo.oWWWWWWo.oHHo..',
    '..oHHoWWWWWWWWWWoHHo..',
    '..oHHoWWWWWWWWWWoHHo..',
    '...oooSWWWWWWWWSooo...',
    '.....oSoWWWWWWoSo.....',
    '......oWWWWWWWWo......',
    '......oJJJJJJJJo......',
    '......oJJJJJJJJo......',
    '......oJJJJJJJJo......',
    '.......oJJooJJo.......',
    '.......oJJo.oJJo......',
    '......oKKo..oKKo......',
    '......................',
  ],
  jump: [
    '.....ooooooooooo......',
    '...ooHHHHHHHHHHHoo....',
    '..oHHHHHHHHHHHHHHHo...',
    '..oHHhhHHHHHHHHHhHo...',
    '.oHHHooooooooooooHHo..',
    '.oHHoSSSSSSSSSSSSoHHo.',
    '.oHHoSPPSSSSSSPPSoHHo.',
    '.oHHoSPXSSSSSSPXSoHHo.',
    '.oHHoRSSSSSSSSSSRoHHo.',
    '.oHHoSSommmmmoSSSoHHo.',
    '.oHHoSSSommmoSSSSoHHo.',
    '..oHHoSSSSSSSSSSoHHo..',
    '..oHHHoooooooooHHHo...',
    'So.oHo.oWWWWWWo.oHo.oS',
    'oSoHHoWWWWWWWWWWoHHoSo',
    '.ooHHoWWWWWWWWWWoHHoo.',
    '...oooWWWWWWWWWWooo...',
    '.....ooWWWWWWWWoo.....',
    '......oWWWWWWWWo......',
    '......oJJJJJJJJo......',
    '......oJJJJJJJJo......',
    '......oJJJJJJJJo......',
    '.....oJJJo..oJJJo.....',
    '....oJJo......oJJo....',
    '....oKKo......oKKo....',
    '......................',
  ],
};

// ============================================================
// LÊ — chibi: cacheada, óculos escuros na cabeça, jaqueta verde
// 22 x 26
// ============================================================
const LE_MAPS = {
  walkA: [
    '.....oooooooooooo.....',
    '...ooHHHHHHHHHHHHoo...',
    '..oHHGGXGGGGGGXGGHHo..',
    '..oHHHHHHHHHHHHHHHHo..',
    '.oHHHooooooooooooHHHo.',
    '.oHHoSSSSSSSSSSSSoHHo.',
    '.oHHoSPPSSSSSSPPSoHHo.',
    '.oHHoSPXSSSSSSPXSoHHo.',
    '.oHHoRSSSSSSSSSSRoHHo.',
    '.oHHoSSommmmmoSSSoHHo.',
    '.oHHoSSSommmoSSSSoHHo.',
    '..oHHoSSSSSSSSSSoHHo..',
    '..oHHHoooooooooHHHo...',
    '..oHHo.oVVVVVVo.oHHo..',
    '..oHHoVVoWWWWoVVoHHo..',
    '..oHHoVVoWWWWoVVoHHo..',
    '...oooVVoWWWWoVVooo...',
    '.....oSoVVVVVVoSo.....',
    '......oVVVVVVVVo......',
    '......ojjjjjjjjo......',
    '......ojjjjjjjjo......',
    '......ojjjoojjjo......',
    '......ojjo..ojjo......',
    '.....ojjo....ojjo.....',
    '.....oKKo....oKKo.....',
    '......oo......oo......',
  ],
  walkB: [
    '.....oooooooooooo.....',
    '...ooHHHHHHHHHHHHoo...',
    '..oHHGGXGGGGGGXGGHHo..',
    '..oHHHHHHHHHHHHHHHHo..',
    '.oHHHooooooooooooHHHo.',
    '.oHHoSSSSSSSSSSSSoHHo.',
    '.oHHoSPPSSSSSSPPSoHHo.',
    '.oHHoSPXSSSSSSPXSoHHo.',
    '.oHHoRSSSSSSSSSSRoHHo.',
    '.oHHoSSommmmmoSSSoHHo.',
    '.oHHoSSSommmoSSSSoHHo.',
    '..oHHoSSSSSSSSSSoHHo..',
    '..oHHHoooooooooHHHo...',
    '..oHHo.oVVVVVVo.oHHo..',
    '..oHHoVVoWWWWoVVoHHo..',
    '..oHHoVVoWWWWoVVoHHo..',
    '...oooVVoWWWWoVVooo...',
    '.....oSoVVVVVVoSo.....',
    '......oVVVVVVVVo......',
    '......ojjjjjjjjo......',
    '......ojjjjjjjjo......',
    '......ojjjjjjjjo......',
    '.......ojjoojjo.......',
    '.......ojjo.ojjo......',
    '......oKKo..oKKo......',
    '......................',
  ],
  jump: [
    '.....oooooooooooo.....',
    '...ooHHHHHHHHHHHHoo...',
    '..oHHGGXGGGGGGXGGHHo..',
    '..oHHHHHHHHHHHHHHHHo..',
    '.oHHHooooooooooooHHHo.',
    '.oHHoSSSSSSSSSSSSoHHo.',
    '.oHHoSPPSSSSSSPPSoHHo.',
    '.oHHoSPXSSSSSSPXSoHHo.',
    '.oHHoRSSSSSSSSSSRoHHo.',
    '.oHHoSSommmmmoSSSoHHo.',
    '.oHHoSSSommmoSSSSoHHo.',
    '..oHHoSSSSSSSSSSoHHo..',
    '..oHHHoooooooooHHHo...',
    'So.oHo.oVVVVVVo.oHo.oS',
    'oSoHHoVVoWWWWoVVoHHoSo',
    '.ooHHoVVoWWWWoVVoHHoo.',
    '...oooVVoWWWWoVVooo...',
    '.....ooVVVVVVVVoo.....',
    '......oVVVVVVVVo......',
    '......ojjjjjjjjo......',
    '......ojjjjjjjjo......',
    '......ojjjjjjjjo......',
    '.....ojjjo..ojjjo.....',
    '....ojjo......ojjo....',
    '....oKKo......oKKo....',
    '......................',
  ],
};

// ============================================================
// GATAS — chibi fofas: cabeção, olhos grandes, rabinho
// 18 x 16
// ============================================================
const CAT_MAPS = {
  walkA: [
    '..oo........oo....',
    '.oDDo......oDDo...',
    '.oDkDo....oDkDo...',
    '.oAAAoooooooAAAo..',
    'oAAAAAAAAAAAAAAAo.',
    'oAPPAAAAAAAAPPAAo.',
    'oAPXAAAAAAAAPXAAo.',
    'oAAAAAAnnAAAAAAAo.',
    'oARAAAmmmAAAARAo..',
    '.oAAAAAAAAAAAAo...',
    '..ooAAAAAAAAoo.oo.',
    '..oAAAAAAAAAo.oDo.',
    '..oAAAAAAAAAooDo..',
    '..oAAAAAAAAAADo...',
    '..oAAooAAooAAo....',
    '..oo..oo....oo....',
  ],
  walkB: [
    '..oo........oo....',
    '.oDDo......oDDo...',
    '.oDkDo....oDkDo...',
    '.oAAAoooooooAAAo..',
    'oAAAAAAAAAAAAAAAo.',
    'oAPPAAAAAAAAPPAAo.',
    'oAPXAAAAAAAAPXAAo.',
    'oAAAAAAnnAAAAAAAo.',
    'oARAAAmmmAAAARAo..',
    '.oAAAAAAAAAAAAo...',
    '..ooAAAAAAAAoo.oo.',
    '..oAAAAAAAAAo.oDo.',
    '..oAAAAAAAAAooDo..',
    '..oAAAAAAAAAADo...',
    '..oAooAAooAAAo....',
    '...oo...oo..oo....',
  ],
  jump: [
    '..oo........oo....',
    '.oDDo......oDDo...',
    '.oDkDo....oDkDo...',
    '.oAAAoooooooAAAo..',
    'oAAAAAAAAAAAAAAAo.',
    'oAPPAAAAAAAAPPAAo.',
    'oAPXAAAAAAAAPXAAo.',
    'oAAAAAAnnAAAAAAAo.',
    'oARAAAmmmAAAARAo..',
    '.oAAAAAAAAAAAAo...',
    '..ooAAAAAAAAoooDo.',
    '..oAAAAAAAAAooDo..',
    '..oAAAAAAAAADDo...',
    '..oAAAAAAAAAAo....',
    '.oAAo..oo..oAAo...',
    '.oo..........oo...',
  ],
};

// ============================================================
// Personagens
// ============================================================
const CHARACTERS = [
  {
    id: 'le',
    name: 'Lê',
    type: 'girl',
    maps: LE_MAPS,
    w: 22, h: 26,
    palette: {
      o: '#2a1a14', H: '#241813', h: '#3c2a1e',
      S: '#b9805a', P: '#1c0f08', X: '#ffffff',
      m: '#7a3a38', R: '#d98a76',
      G: '#34343f', V: '#6e9460', W: '#f4f1ea',
      j: '#3a3f52', K: '#f0ece2',
    },
  },
  {
    id: 'helen',
    name: 'Helen',
    type: 'girl',
    maps: HELEN_MAPS,
    w: 22, h: 26,
    palette: {
      o: '#2a1a14', H: '#4e3120', h: '#6e4a30',
      S: '#c08a5e', P: '#1c0f08', X: '#ffffff',
      m: '#7a3a38', R: '#e08a78',
      W: '#f6f3ee', J: '#7e9ec2', K: '#f0ece2',
    },
  },
  {
    id: 'siamesa',
    name: 'Mia',
    type: 'cat',
    maps: CAT_MAPS,
    w: 18, h: 16,
    palette: {
      o: '#3a2c20', A: '#f2e7d4', D: '#5e4632', k: '#d9a0a0',
      P: '#3f74b8', X: '#ffffff', n: '#d98c8c', m: '#7a5e48', R: '#e8b4a8',
    },
  },
  {
    id: 'nice',
    name: 'Nice',
    type: 'cat',
    maps: CAT_MAPS,
    w: 18, h: 16,
    palette: {
      o: '#14121c', A: '#2e2b38', D: '#1c1a26', k: '#8a5e6a',
      P: '#f0c33c', X: '#ffffff', n: '#c27a82', m: '#0e0d14', R: '#553a46',
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
      ctx.fillRect(cx - px * 2.6, y - px * 1.4, px * 2.2, px * 2.2);
      ctx.fillRect(cx + px * 0.4, y - px * 1.4, px * 2.2, px * 2.2);
      ctx.fillStyle = '#d13869';
      ctx.fillRect(cx - px * 0.6, y - px * 0.9, px * 1.2, px * 1.2);
    },
  },
  {
    id: 'flor', name: 'Flor', emoji: '🌼', cost: 15,
    draw(ctx, x, y, px, headW) {
      const fx = x + px * (headW - 5.5);
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
      const cx = x + px * (headW / 2 - 4.5);
      ctx.fillStyle = '#5b8bd9';
      ctx.fillRect(cx, y - px * 0.4, px * 9, px * 1.8);
      ctx.fillRect(cx + px, y - px * 1.6, px * 7, px * 1.2);
      ctx.fillStyle = '#3a64a8';
      ctx.fillRect(cx + px * 7.5, y + px * 0.8, px * 4.5, px);
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

// Ícones de interface (gerados como dataURL para usar em <img>)
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
