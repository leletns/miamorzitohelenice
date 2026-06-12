// ============================================================
// Cenários e geração de fases do jogo "Nossa Aventura"
// Resolução lógica: 320 x 180. Chão em y = 150.
// ============================================================

const GAME_W = 320;
const GAME_H = 180;
const GROUND_Y = 150;

// Random determinístico por fase (cada fase sempre igual)
function makeRng(seed) {
  let s = seed >>> 0 || 1;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function vgrad(ctx, x, y, w, h, c1, c2) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

function px(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

function tinyText(ctx, text, x, y, color, size) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size || 5}px monospace`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, Math.round(x), Math.round(y));
}

// ------------------------------------------------------------
// Temas: cada um desenha céu + camadas com parallax e define
// as cores do chão/plataformas e os obstáculos.
// ------------------------------------------------------------
const THEMES = {
  // 1 ----- Via Parque (shopping, vitrines, banquinho PENSE VERDE)
  viaparque: {
    ground: { top: '#d9c8a9', body: '#bfa57e' },
    platform: { top: '#2e7d4f', body: '#1d5635' }, // banquinhos verdes
    platformType: 'bench',
    drawBG(ctx, camX, t) {
      vgrad(ctx, 0, 0, GAME_W, GAME_H, '#f6ead7', '#eedbbe');
      // teto do shopping com claraboias
      px(ctx, 0, 0, GAME_W, 14, '#e3cfae');
      for (let i = -1; i < 9; i++) {
        const x = ((i * 48 - camX * 0.2) % (GAME_W + 96) + GAME_W + 96) % (GAME_W + 96) - 48;
        px(ctx, x, 3, 28, 8, '#fdf8ee');
      }
      // vitrines (parallax 0.45)
      for (let i = -1; i < 6; i++) {
        const period = 110;
        const wx = i * period - ((camX * 0.45) % period);
        const k = Math.abs(Math.round((camX * 0.45 + wx) / period)) % 4;
        const cols = ['#9ed3f0', '#f4b8cf', '#c9b6ef', '#ffd98a'];
        px(ctx, wx, 60, 64, 70, '#8a7355');
        px(ctx, wx + 4, 66, 56, 56, cols[k]);
        px(ctx, wx + 8, 72, 20, 44, '#ffffff44');
        px(ctx, wx + 18, 124, 28, 6, '#6b5435');
        // manequins/plantinhas
        if (k % 2 === 0) {
          px(ctx, wx + 36, 96, 10, 26, '#4f7d57');
          px(ctx, wx + 38, 86, 6, 12, '#67a06f');
        }
      }
      // letreiro VIA PARQUE de vez em quando
      const period2 = 480;
      const sx = -((camX * 0.45) % period2) + 300;
      px(ctx, sx - 6, 30, 88, 18, '#234d36');
      tinyText(ctx, 'VIA PARQUE', sx, 42, '#ffe9a8', 9);
    },
    benchLabel: 'PENSE VERDE',
    obstacles: {
      static: {
        w: 10, h: 10,
        draw(ctx, o, t) { // cone de limpeza
          px(ctx, o.x + 3, o.y, 4, 4, '#ffb340');
          px(ctx, o.x + 2, o.y + 4, 6, 3, '#ff8f1f');
          px(ctx, o.x + 1, o.y + 7, 8, 3, '#ffb340');
          px(ctx, o.x, o.y + 9, 10, 1, '#d97700');
        },
      },
      mover: {
        w: 12, h: 8, fly: true,
        draw(ctx, o, t) { // pombo do shopping
          px(ctx, o.x + 2, o.y + 2, 8, 5, '#9aa3ad');
          px(ctx, o.x + (o.dir > 0 ? 9 : 0), o.y, 3, 3, '#7d8791');
          const wing = Math.sin(t * 12 + o.x) > 0 ? -2 : 1;
          px(ctx, o.x + 4, o.y + 2 + wing, 5, 2, '#c3cad2');
          px(ctx, o.x + (o.dir > 0 ? 12 : -1), o.y + 1, 1, 1, '#ffb340');
        },
      },
    },
  },

  // 2 ----- Cinema New York (sala escura, sofás vermelhos)
  cinema: {
    ground: { top: '#3a2433', body: '#2a1825' },
    platform: { top: '#c62b3e', body: '#8e1d2c' }, // sofás vermelhos
    platformType: 'sofa',
    drawBG(ctx, camX, t) {
      vgrad(ctx, 0, 0, GAME_W, GAME_H, '#171028', '#241636');
      // telão gigante passando "um filme"
      const period = 560;
      const sx = -((camX * 0.3) % period) + 60;
      px(ctx, sx - 8, 22, 176, 96, '#0b0817');
      const flick = 0.75 + 0.25 * Math.sin(t * 2.1);
      const g = ctx.createLinearGradient(0, 26, 0, 110);
      g.addColorStop(0, `rgba(120,170,255,${0.5 * flick})`);
      g.addColorStop(1, `rgba(255,140,190,${0.35 * flick})`);
      ctx.fillStyle = g;
      ctx.fillRect(sx, 26, 160, 88);
      // coraçãozinho pulsando no telão
      const hp = 4 + Math.sin(t * 3) * 0.4;
      drawHeart(ctx, sx + 64, 52, hp);
      tinyText(ctx, 'NEW YORK', sx + 52, 20, '#f3c969', 8);
      // luzinhas de corredor
      for (let i = -1; i < 12; i++) {
        const lx = ((i * 32 - camX * 0.7) % (GAME_W + 64) + GAME_W + 64) % (GAME_W + 64) - 32;
        px(ctx, lx, 142, 2, 2, Math.floor(t * 2 + i) % 2 ? '#ffd95e' : '#7a5e2a');
      }
    },
    obstacles: {
      static: {
        w: 9, h: 11,
        draw(ctx, o) { // copo de refri caído
          px(ctx, o.x + 1, o.y + 3, 7, 8, '#d9445a');
          px(ctx, o.x + 1, o.y + 3, 7, 2, '#f0f0f0');
          px(ctx, o.x + 4, o.y, 1, 4, '#f0f0f0');
        },
      },
      mover: {
        w: 10, h: 8, fly: false,
        draw(ctx, o, t) { // pipoca saltitante
          px(ctx, o.x + 2, o.y + 3, 6, 5, '#d9243f');
          px(ctx, o.x + 3, o.y + 3, 1, 5, '#fdf6ec');
          px(ctx, o.x + 6, o.y + 3, 1, 5, '#fdf6ec');
          px(ctx, o.x + 1, o.y, 3, 3, '#fff3d6');
          px(ctx, o.x + 5, o.y + 1, 3, 2, '#ffe9b8');
        },
      },
    },
  },

  // 3 ----- McDonald's
  mcdonalds: {
    ground: { top: '#c8413b', body: '#a32f2a' },
    platform: { top: '#f7c948', body: '#d49a1e' }, // mesinhas amarelas
    platformType: 'table',
    drawBG(ctx, camX, t) {
      vgrad(ctx, 0, 0, GAME_W, GAME_H, '#fff3df', '#ffe3c2');
      px(ctx, 0, 110, GAME_W, 40, '#b3322c');
      // arcos dourados gigantes (parallax 0.4)
      const period = 240;
      for (let i = -1; i < 3; i++) {
        const mx = i * period - ((camX * 0.4) % period) + 40;
        ctx.fillStyle = '#f7c948';
        ctx.font = 'bold 64px Georgia, serif';
        ctx.fillText('M', mx, 100);
      }
      // balcão e luminárias
      for (let i = -1; i < 7; i++) {
        const lx = ((i * 64 - camX * 0.6) % (GAME_W + 128) + GAME_W + 128) % (GAME_W + 128) - 64;
        px(ctx, lx, 18, 2, 14, '#7a4a17');
        px(ctx, lx - 5, 32, 12, 5, '#f7c948');
      }
      tinyText(ctx, 'MÉQUI DO AMOR', -((camX * 0.4) % 520) + 320, 30, '#b3322c', 8);
    },
    obstacles: {
      static: {
        w: 9, h: 9,
        draw(ctx, o) { // casquinha caída
          px(ctx, o.x + 2, o.y, 5, 4, '#fdf6ec');
          px(ctx, o.x + 3, o.y + 4, 3, 3, '#d9a05b');
          px(ctx, o.x + 4, o.y + 7, 1, 2, '#b5793a');
        },
      },
      mover: {
        w: 11, h: 8, fly: false,
        draw(ctx, o, t) { // hambúrguer fujão
          px(ctx, o.x + 1, o.y, 9, 3, '#e8a955');
          px(ctx, o.x, o.y + 3, 11, 2, '#7da838');
          px(ctx, o.x + 1, o.y + 5, 9, 2, '#8a4b25');
          px(ctx, o.x + 1, o.y + 7, 9, 1, '#e8a955');
          px(ctx, o.x + 3, o.y + 1, 1, 1, '#fdf6ec');
          px(ctx, o.x + 6, o.y + 1, 1, 1, '#fdf6ec');
        },
      },
    },
  },

  // 4 ----- Lagoa (pôr do sol, pedalinhos)
  lagoa: {
    ground: { top: '#cfc4ae', body: '#b5a78c' }, // calçadão
    platform: { top: '#f0eee9', body: '#c9c4ba' }, // pedrinhas portuguesas
    platformType: 'stone',
    drawBG(ctx, camX, t) {
      vgrad(ctx, 0, 0, GAME_W, 100, '#ffb35c', '#ff7e8a');
      // sol se pondo
      px(ctx, 220 - (camX * 0.1) % 40, 38, 22, 22, '#ffe08a');
      // morros
      for (let i = -1; i < 4; i++) {
        const period = 180;
        const hx = i * period - ((camX * 0.25) % period);
        ctx.fillStyle = '#7b5e7d';
        ctx.beginPath();
        ctx.moveTo(hx, 100);
        ctx.lineTo(hx + 60, 52);
        ctx.lineTo(hx + 130, 100);
        ctx.closePath();
        ctx.fill();
      }
      // água da lagoa
      vgrad(ctx, 0, 100, GAME_W, 50, '#3f7fae', '#2b5f88');
      for (let i = -1; i < 12; i++) {
        const wx = ((i * 36 - camX * 0.5 + Math.sin(t + i) * 3) % (GAME_W + 72) + GAME_W + 72) % (GAME_W + 72) - 36;
        px(ctx, wx, 108 + (i % 3) * 9, 16, 1, '#ffffff55');
      }
      // pedalinhos-cisne
      const period2 = 300;
      for (let i = -1; i < 3; i++) {
        const sx = i * period2 - ((camX * 0.5) % period2) + 120;
        const sy = 116 + Math.sin(t * 1.4 + i * 2) * 2;
        px(ctx, sx, sy, 18, 7, '#fdf6ec');
        px(ctx, sx + 14, sy - 7, 3, 8, '#fdf6ec');
        px(ctx, sx + 14, sy - 8, 5, 3, '#fdf6ec');
        px(ctx, sx + 18, sy - 8, 2, 2, '#ff8f1f');
        px(ctx, sx + 15, sy - 7, 1, 1, '#222');
      }
    },
    obstacles: {
      static: {
        w: 12, h: 4,
        draw(ctx, o, t) { // poça d'água
          px(ctx, o.x, o.y + 1, 12, 3, '#5e9ec7');
          px(ctx, o.x + 2, o.y, 8, 1, '#8cc3e8');
        },
      },
      mover: {
        w: 12, h: 9, fly: false,
        draw(ctx, o, t) { // patinho passeando
          px(ctx, o.x + 2, o.y + 4, 8, 4, '#ffd95e');
          px(ctx, o.x + (o.dir > 0 ? 8 : 1), o.y, 3, 5, '#ffd95e');
          px(ctx, o.x + (o.dir > 0 ? 11 : -1), o.y + 1, 2, 2, '#ff8f1f');
          px(ctx, o.x + (o.dir > 0 ? 9 : 2), o.y + 1, 1, 1, '#222');
          px(ctx, o.x + 4, o.y + 8, 2, 1, '#ff8f1f');
          px(ctx, o.x + 7, o.y + 8, 2, 1, '#ff8f1f');
        },
      },
    },
  },

  // 5 ----- Praia à noite
  praia: {
    ground: { top: '#e8d5ae', body: '#cdb588' }, // areia
    platform: { top: '#8a7355', body: '#6b5435' }, // troncos
    platformType: 'wood',
    drawBG(ctx, camX, t) {
      vgrad(ctx, 0, 0, GAME_W, 105, '#0c1238', '#27356b');
      // estrelas
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 53 - camX * 0.1) % (GAME_W + 40) + GAME_W + 40) % (GAME_W + 40) - 20;
        const sy = (i * 37) % 90;
        const tw = Math.sin(t * 3 + i) > 0.4 ? '#fff' : '#9aa6d8';
        px(ctx, sx, sy, 1, 1, tw);
      }
      // lua
      const mx = 250 - (camX * 0.08) % 60;
      px(ctx, mx, 20, 18, 18, '#f4efd9');
      px(ctx, mx + 4, 24, 4, 4, '#ddd6ba');
      px(ctx, mx + 10, 30, 3, 3, '#ddd6ba');
      // mar escuro com reflexo
      vgrad(ctx, 0, 105, GAME_W, 45, '#16264f', '#0d1733');
      for (let i = -1; i < 12; i++) {
        const wx = ((i * 34 - camX * 0.4 + Math.sin(t * 1.5 + i) * 4) % (GAME_W + 68) + GAME_W + 68) % (GAME_W + 68) - 34;
        px(ctx, wx, 112 + (i % 3) * 10, 14, 1, '#aab9e833');
      }
      px(ctx, mx - 2, 110, 22, 1, '#f4efd933');
      px(ctx, mx + 2, 118, 14, 1, '#f4efd922');
      // coqueiros (parallax 0.55)
      const period = 200;
      for (let i = -1; i < 3; i++) {
        const cx = i * period - ((camX * 0.55) % period) + 70;
        px(ctx, cx, 92, 4, 48, '#1c2030');
        for (let f = 0; f < 5; f++) {
          const a = (f / 4) * Math.PI - Math.PI / 2;
          px(ctx, cx + 2 + Math.cos(a + 0.3) * 14 - 7, 88 + Math.sin(a) * 7, 14, 3, '#15321f');
        }
      }
    },
    obstacles: {
      static: {
        w: 8, h: 7,
        draw(ctx, o) { // coco na areia
          px(ctx, o.x + 1, o.y + 1, 6, 6, '#6b5435');
          px(ctx, o.x + 2, o.y, 4, 2, '#8a7355');
          px(ctx, o.x + 3, o.y + 2, 1, 1, '#3d2f1c');
          px(ctx, o.x + 5, o.y + 2, 1, 1, '#3d2f1c');
        },
      },
      mover: {
        w: 11, h: 7, fly: false,
        draw(ctx, o, t) { // caranguejo
          px(ctx, o.x + 2, o.y + 2, 7, 4, '#e8543f');
          px(ctx, o.x + 3, o.y + 1, 1, 2, '#fff');
          px(ctx, o.x + 6, o.y + 1, 1, 2, '#fff');
          const leg = Math.sin(t * 10 + o.x) > 0 ? 1 : 0;
          px(ctx, o.x, o.y + 4 + leg, 2, 2, '#c23a28');
          px(ctx, o.x + 9, o.y + 5 - leg, 2, 2, '#c23a28');
          px(ctx, o.x + 1, o.y, 2, 2, '#c23a28');
          px(ctx, o.x + 8, o.y, 2, 2, '#c23a28');
        },
      },
    },
  },

  // 6 ----- Rocinha ilustrada
  rocinha: {
    ground: { top: '#9a8d7f', body: '#7d7164' }, // ladeira de concreto
    platform: { top: '#c2b6a5', body: '#9a8d7f' }, // lajes
    platformType: 'laje',
    drawBG(ctx, camX, t) {
      vgrad(ctx, 0, 0, GAME_W, GAME_H, '#ffca7a', '#ff9a6b');
      // morro ao fundo
      ctx.fillStyle = '#5d7a4e';
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(120 - (camX * 0.15) % 80, 26);
      ctx.lineTo(GAME_W, 64);
      ctx.lineTo(GAME_W, 80);
      ctx.lineTo(0, 80);
      ctx.fill();
      // casinhas coloridas empilhadas (3 fileiras, parallax)
      const cols = ['#e2725b', '#5b8bd9', '#67a06f', '#e0a64e', '#b06ab3', '#d95b79'];
      for (let row = 0; row < 3; row++) {
        const par = 0.3 + row * 0.15;
        const y = 56 + row * 28;
        const period = 30;
        for (let i = -1; i < 13; i++) {
          const hx = ((i * period - camX * par) % (GAME_W + 60) + GAME_W + 60) % (GAME_W + 60) - 30;
          const k = (i * 7 + row * 3) % cols.length;
          px(ctx, hx, y, 26, 26, cols[Math.abs(k)]);
          px(ctx, hx + 4, y + 5, 7, 8, '#2c3e50');
          px(ctx, hx + 15, y + 5, 7, 8, '#f6e7b2');
          px(ctx, hx, y - 3, 26, 3, '#8a5a3b');
        }
      }
      // fios de luz com bandeirinhas
      for (let i = -1; i < 6; i++) {
        const fx = ((i * 80 - camX * 0.6) % (GAME_W + 160) + GAME_W + 160) % (GAME_W + 160) - 80;
        for (let s = 0; s < 16; s++) {
          const lx = fx + s * 5;
          const ly = 130 + Math.sin((s / 15) * Math.PI) * 6;
          px(ctx, lx, ly, 1, 1, '#3d2f1c');
          if (s % 3 === 1) px(ctx, lx, ly + 1, 2, 2, cols[s % cols.length]);
        }
      }
    },
    obstacles: {
      static: {
        w: 8, h: 9,
        draw(ctx, o) { // vasinho de planta
          px(ctx, o.x + 1, o.y + 4, 6, 5, '#c2603f');
          px(ctx, o.x + 2, o.y + 1, 4, 3, '#4f7d57');
          px(ctx, o.x + 3, o.y - 1, 2, 3, '#67a06f');
        },
      },
      mover: {
        w: 10, h: 10, fly: true,
        draw(ctx, o, t) { // pipa voando
          px(ctx, o.x + 4, o.y, 2, 2, '#ffd95e');
          px(ctx, o.x + 2, o.y + 2, 6, 2, '#e63962');
          px(ctx, o.x + 1, o.y + 4, 8, 2, '#ffd95e');
          px(ctx, o.x + 3, o.y + 6, 4, 2, '#e63962');
          px(ctx, o.x + 4 + Math.sin(t * 6) * 2, o.y + 8, 1, 3, '#fdf6ec');
        },
      },
    },
  },
};

// ------------------------------------------------------------
// Geração da fase
// ------------------------------------------------------------
function buildLevel(levelIndex) {
  const themeId = THEME_ORDER[levelIndex % THEME_ORDER.length];
  const cycle = Math.floor(levelIndex / THEME_ORDER.length);
  const theme = THEMES[themeId];
  const rng = makeRng(1234567 + levelIndex * 7919);

  const length = 1900 + Math.min(cycle, 5) * 250;
  const speedMul = 1 + Math.min(cycle, 6) * 0.14;

  const platforms = [];
  const hearts = [];
  const rings = [];
  const obstacles = [];

  // Plataformas (banquinhos/sofás/mesas/lajes...)
  let x = 220;
  while (x < length - 320) {
    const w = 44 + Math.floor(rng() * 36);
    const y = GROUND_Y - (24 + Math.floor(rng() * 26));
    platforms.push({ x, y, w, h: 8, type: theme.platformType });
    // corações em cima da plataforma
    const n = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < n; i++) hearts.push({ x: x + 8 + i * 14, y: y - 16, got: false });
    // de vez em quando, uma aliança bem no alto
    if (rng() < 0.4 && rings.length < 3) {
      rings.push({ x: x + w / 2, y: y - 34, got: false });
    }
    x += w + 70 + Math.floor(rng() * 100);
  }
  while (rings.length < 2) {
    rings.push({ x: 400 + rng() * (length - 700), y: GROUND_Y - 60, got: false });
  }

  // Corações no chão em ondinhas
  for (let hx = 140; hx < length - 260; hx += 34 + Math.floor(rng() * 40)) {
    const arc = rng() < 0.35;
    if (arc) {
      for (let i = 0; i < 3; i++) {
        hearts.push({ x: hx + i * 12, y: GROUND_Y - 18 - Math.sin((i / 2) * Math.PI) * 14, got: false });
      }
    } else {
      hearts.push({ x: hx, y: GROUND_Y - 16, got: false });
    }
  }

  // Obstáculos
  const obsCount = Math.min(4 + cycle * 2, 12);
  for (let i = 0; i < obsCount; i++) {
    const ox = 320 + ((length - 600) / obsCount) * i + rng() * 80;
    const mover = rng() < 0.45;
    const def = mover ? theme.obstacles.mover : theme.obstacles.static;
    if (mover) {
      const fly = !!def.fly;
      obstacles.push({
        kind: 'mover', fly,
        x: ox, baseX: ox,
        y: fly ? GROUND_Y - 50 - rng() * 30 : GROUND_Y - def.h,
        baseY: 0, w: def.w, h: def.h,
        range: 34 + rng() * 30,
        speed: (0.45 + rng() * 0.35) * speedMul,
        dir: 1, def,
      });
    } else {
      obstacles.push({ kind: 'static', x: ox, y: GROUND_Y - def.h, w: def.w, h: def.h, def });
    }
  }

  const totalHearts = hearts.length;
  return {
    themeId, theme, cycle, length, speedMul,
    platforms, hearts, rings, obstacles,
    totalHearts,
    goalX: length - 110,
  };
}
