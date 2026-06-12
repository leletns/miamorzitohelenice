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

function px(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// faixa horizontal com transição em dithering (xadrez) — céu retrô
function bands(ctx, x, w, stops) {
  // stops: [[y, cor], ...] ordenado; desenha blocos + 2px de dither entre eles
  for (let i = 0; i < stops.length; i++) {
    const [y, c] = stops[i];
    const yEnd = i + 1 < stops.length ? stops[i + 1][0] : GAME_H;
    px(ctx, x, y, w, yEnd - y, c);
    if (i + 1 < stops.length) {
      const nc = stops[i + 1][1];
      ctx.fillStyle = nc;
      for (let dx = 0; dx < w; dx += 2) {
        ctx.fillRect(x + dx + (yEnd % 2), yEnd - 2, 1, 1);
        ctx.fillRect(x + dx + ((yEnd + 1) % 2), yEnd - 1, 1, 1);
      }
    }
  }
}

function signText(ctx, text, x, y, color, size) {
  ctx.fillStyle = color;
  ctx.font = `${size || 6}px "Press Start 2P", monospace`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, Math.round(x), Math.round(y));
}

// posições tiladas com parallax: chama fn(x, k) para cada repetição visível
function tiled(camX, par, period, span, fn) {
  const off = camX * par;
  const first = Math.floor((off - span) / period);
  const last = Math.ceil((off + GAME_W + span) / period);
  for (let k = first; k <= last; k++) {
    fn(k * period - off, ((k % 1000) + 1000) % 1000);
  }
}

// ------------------------------------------------------------
// TEMAS
// ------------------------------------------------------------
const THEMES = {
  // ===== 1. VIA PARQUE — interior de shopping, piso polido =====
  viaparque: {
    platform: { top: '#3e7d52', body: '#2c5a3a' },
    platformType: 'bench',
    benchLabel: 'PENSE VERDE',
    drawBG(ctx, camX, t) {
      // parede superior + claraboia
      px(ctx, 0, 0, GAME_W, GAME_H, '#efe0c8');
      px(ctx, 0, 0, GAME_W, 26, '#d9c5a4');
      px(ctx, 0, 24, GAME_W, 2, '#c4ad88');
      tiled(camX, 0.2, 56, 40, (x) => {
        px(ctx, x, 4, 34, 14, '#fbf7ee');
        px(ctx, x, 4, 34, 3, '#fffdf6');
        px(ctx, x + 16, 4, 2, 14, '#d9c5a4');
      });
      // mezanino com guarda-corpo
      px(ctx, 0, 26, GAME_W, 8, '#e3d2b4');
      tiled(camX, 0.3, 10, 10, (x) => px(ctx, x, 28, 2, 6, '#b89e74'));
      px(ctx, 0, 26, GAME_W, 2, '#9c855e');

      // vitrines (parallax 0.5)
      tiled(camX, 0.5, 128, 130, (x, k) => {
        const ins = [
          { glass: '#bfdcec', sign: '#3a5a8c', name: 'MODA', deco: '#7e9ab8' },
          { glass: '#f2cdd9', sign: '#a83a5e', name: 'DOCES', deco: '#d96a8a' },
          { glass: '#d6cdec', sign: '#5a4a8c', name: 'GAMES', deco: '#8a78c2' },
          { glass: '#cde2c8', sign: '#3a6a44', name: 'VERDE', deco: '#6a9a6e' },
        ][k % 4];
        // moldura da loja
        px(ctx, x, 40, 104, 102, '#caa87c');
        px(ctx, x + 3, 40, 98, 8, ins.sign);
        signText(ctx, ins.name, x + 32, 47, '#f6ecd8', 6);
        // vidro
        px(ctx, x + 6, 52, 92, 84, ins.glass);
        px(ctx, x + 10, 56, 18, 76, '#ffffff55');
        px(ctx, x + 52, 52, 2, 84, '#caa87c');
        // produtos na vitrine
        px(ctx, x + 14, 100, 14, 36, ins.deco);
        px(ctx, x + 32, 110, 12, 26, ins.sign);
        px(ctx, x + 62, 96, 16, 40, ins.deco);
        px(ctx, x + 82, 108, 10, 28, ins.sign);
        px(ctx, x + 6, 134, 92, 4, '#9c855e');
        // pilar entre lojas
        px(ctx, x + 108, 30, 12, 118, '#d9c5a4');
        px(ctx, x + 108, 30, 3, 118, '#efe0c8');
        px(ctx, x + 117, 30, 3, 118, '#b89e74');
      });

      // letreiro suspenso VIA PARQUE
      tiled(camX, 0.5, 512, 140, (x) => {
        px(ctx, x + 200, 8, 2, 16, '#6a5a3e');
        px(ctx, x + 318, 8, 2, 16, '#6a5a3e');
        px(ctx, x + 188, 22, 144, 18, '#1d4d33');
        px(ctx, x + 190, 24, 140, 14, '#2c6a46');
        signText(ctx, 'VIA PARQUE', x + 196, 35, '#ffe9a8', 6);
      });

      // plantas decorativas
      tiled(camX, 0.65, 180, 30, (x) => {
        px(ctx, x, 132, 14, 16, '#a8552f');
        px(ctx, x + 2, 120, 10, 12, '#3e7d52');
        px(ctx, x + 4, 112, 6, 10, '#54a06a');
        px(ctx, x - 2, 124, 6, 8, '#54a06a');
        px(ctx, x + 10, 124, 6, 8, '#2c5a3a');
      });
    },
    drawGround(ctx, x0, x1) {
      // piso polido com rejunte e reflexo
      px(ctx, x0, GROUND_Y, x1 - x0, GAME_H - GROUND_Y, '#d9cdb4');
      px(ctx, x0, GROUND_Y, x1 - x0, 2, '#efe6d2');
      for (let x = Math.floor(x0 / 40) * 40; x < x1; x += 40) {
        px(ctx, x, GROUND_Y, 1, GAME_H - GROUND_Y, '#bfb094');
        px(ctx, x + 6, GROUND_Y + 4, 20, 1, '#efe6d2aa');
      }
      px(ctx, x0, GROUND_Y + 12, x1 - x0, 1, '#cabd9f');
    },
    obstacles: {
      static: {
        w: 10, h: 11,
        draw(ctx, o) { // placa "piso molhado"
          px(ctx, o.x + 4, o.y, 2, 2, '#f0b428');
          px(ctx, o.x + 3, o.y + 2, 4, 3, '#ffd24d');
          px(ctx, o.x + 2, o.y + 5, 6, 3, '#f0b428');
          px(ctx, o.x + 1, o.y + 8, 8, 2, '#ffd24d');
          px(ctx, o.x, o.y + 10, 3, 1, '#c2882a');
          px(ctx, o.x + 7, o.y + 10, 3, 1, '#c2882a');
          px(ctx, o.x + 4, o.y + 4, 2, 4, '#7a4a17');
        },
      },
      mover: {
        w: 13, h: 9, fly: true,
        draw(ctx, o, t) { // pombo que entrou no shopping
          px(ctx, o.x + 3, o.y + 3, 8, 5, '#8e98a4');
          px(ctx, o.x + (o.dir > 0 ? 10 : 1), o.y, 3, 4, '#717c88');
          px(ctx, o.x + (o.dir > 0 ? 13 : 0), o.y + 1, 1, 1, '#f0b428');
          px(ctx, o.x + (o.dir > 0 ? 11 : 2), o.y + 1, 1, 1, '#1d1b26');
          const wing = Math.sin(t * 14 + o.baseX) > 0 ? -2 : 1;
          px(ctx, o.x + 4, o.y + 3 + wing, 6, 2, '#b8c2cc');
          px(ctx, o.x + (o.dir > 0 ? 1 : 10), o.y + 4, 3, 2, '#5e6874');
        },
      },
    },
  },

  // ===== 2. CINEMA NEW YORK — sala escura, poltronas, telão =====
  cinema: {
    platform: { top: '#b8323e', body: '#7e1f28' },
    platformType: 'sofa',
    drawBG(ctx, camX, t) {
      px(ctx, 0, 0, GAME_W, GAME_H, '#120b1e');
      // painéis acústicos da parede
      tiled(camX, 0.25, 60, 40, (x, k) => {
        px(ctx, x, 10, 50, 120, k % 2 ? '#1a1128' : '#160e23');
        px(ctx, x, 10, 50, 2, '#241838');
      });

      // telão gigante com "filme"
      tiled(camX, 0.35, 640, 300, (x) => {
        const sx = x + 100;
        px(ctx, sx - 10, 18, 240, 110, '#05030c');
        // imagem do filme: pôr do sol + casal (silhueta)
        const flick = Math.sin(t * 7) > 0.92 ? 8 : 0;
        px(ctx, sx, 24, 220, 26, `rgb(${94 + flick},52,88)`);
        px(ctx, sx, 50, 220, 26, `rgb(${168 + flick},74,98)`);
        px(ctx, sx, 76, 220, 20, `rgb(${228 + flick},122,92)`);
        px(ctx, sx, 96, 220, 26, '#2c1430');
        // sol no telão
        px(ctx, sx + 150, 64, 22, 22, '#ffd98a');
        // casal de silhueta
        px(ctx, sx + 60, 86, 6, 22, '#1a0c1e');
        px(ctx, sx + 59, 82, 8, 6, '#1a0c1e');
        px(ctx, sx + 70, 88, 6, 20, '#1a0c1e');
        px(ctx, sx + 69, 84, 8, 6, '#1a0c1e');
        px(ctx, sx + 66, 94, 4, 2, '#1a0c1e');
        // letterbox + moldura
        px(ctx, sx - 10, 18, 240, 4, '#05030c');
        signText(ctx, 'SALA NEW YORK', sx + 56, 14, '#d9b14a', 6);
        // feixe do projetor
        ctx.fillStyle = 'rgba(220,200,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(sx + 230, 6);
        ctx.lineTo(sx - 4, 30);
        ctx.lineTo(sx - 4, 120);
        ctx.closePath();
        ctx.fill();
      });

      // fileiras de poltronas (silhueta, 2 profundidades)
      tiled(camX, 0.55, 26, 30, (x) => {
        px(ctx, x, 118, 22, 18, '#27101c');
        px(ctx, x + 2, 114, 18, 6, '#311420');
        px(ctx, x, 118, 2, 18, '#1c0b14');
      });
      tiled(camX, 0.75, 30, 30, (x) => {
        px(ctx, x, 128, 26, 22, '#3a1622');
        px(ctx, x + 3, 122, 20, 8, '#481b2a');
        px(ctx, x + 24, 128, 2, 22, '#27101c');
        px(ctx, x, 128, 2, 22, '#27101c');
      });

      // placa EXIT
      tiled(camX, 0.55, 480, 60, (x) => {
        px(ctx, x + 380, 96, 30, 12, '#0c2a14');
        signText(ctx, 'SAIDA', x + 383, 105, '#4ade80', 5);
      });
    },
    drawGround(ctx, x0, x1) {
      // carpete vinho com losangos e luz de corredor
      px(ctx, x0, GROUND_Y, x1 - x0, GAME_H - GROUND_Y, '#33121f');
      px(ctx, x0, GROUND_Y, x1 - x0, 2, '#481b2a');
      for (let x = Math.floor(x0 / 16) * 16; x < x1; x += 16) {
        px(ctx, x + 6, GROUND_Y + 8, 2, 2, '#48203255');
        px(ctx, x + 14, GROUND_Y + 16, 2, 2, '#48203255');
        px(ctx, x, GROUND_Y + 3, 2, 2, '#f0b42866');
      }
    },
    obstacles: {
      static: {
        w: 9, h: 11,
        draw(ctx, o) { // balde de pipoca derrubado
          px(ctx, o.x + 1, o.y + 4, 7, 7, '#d9243f');
          px(ctx, o.x + 2, o.y + 4, 1, 7, '#f6ecd8');
          px(ctx, o.x + 5, o.y + 4, 1, 7, '#f6ecd8');
          px(ctx, o.x, o.y + 2, 3, 3, '#ffe9b8');
          px(ctx, o.x + 4, o.y, 3, 3, '#f5d98a');
          px(ctx, o.x + 7, o.y + 2, 2, 2, '#ffe9b8');
        },
      },
      mover: {
        w: 12, h: 7, fly: false,
        draw(ctx, o, t) { // ratinho de cinema correndo
          px(ctx, o.x + 2, o.y + 2, 8, 4, '#6e6876');
          px(ctx, o.x + (o.dir > 0 ? 9 : 0), o.y + 1, 3, 4, '#7e7888');
          px(ctx, o.x + (o.dir > 0 ? 11 : 0), o.y, 1, 2, '#9a92a8');
          px(ctx, o.x + (o.dir > 0 ? 10 : 1), o.y + 2, 1, 1, '#1d1b26');
          const tail = Math.sin(t * 8 + o.baseX) * 1.5;
          px(ctx, o.x + (o.dir > 0 ? -2 : 12), o.y + 2 + tail, 3, 1, '#9a92a8');
          px(ctx, o.x + 3, o.y + 6, 2, 1, '#55505e');
          px(ctx, o.x + 7, o.y + 6, 2, 1, '#55505e');
        },
      },
    },
  },

  // ===== 3. McDONALD'S — balcão, letreiro, piso xadrez =====
  mcdonalds: {
    platform: { top: '#f0b428', body: '#c28a1e' },
    platformType: 'table',
    drawBG(ctx, camX, t) {
      px(ctx, 0, 0, GAME_W, GAME_H, '#f4e6cf');
      px(ctx, 0, 0, GAME_W, 20, '#b3322c');
      px(ctx, 0, 20, GAME_W, 2, '#8e2722');
      // faixa decorativa
      px(ctx, 0, 96, GAME_W, 40, '#b3322c');
      px(ctx, 0, 96, GAME_W, 2, '#d9453e');
      px(ctx, 0, 134, GAME_W, 2, '#8e2722');

      // letreiro M dourado com fundo
      tiled(camX, 0.3, 280, 100, (x) => {
        px(ctx, x + 40, 28, 64, 56, '#8e2722');
        px(ctx, x + 44, 32, 56, 48, '#b3322c');
        ctx.fillStyle = '#f7c948';
        ctx.font = 'bold 44px Georgia, serif';
        ctx.fillText('M', x + 50, 74);
        signText(ctx, 'MEQUI', x + 52, 92, '#f7c948', 6);
      });

      // painel de menu atrás do balcão
      tiled(camX, 0.5, 240, 130, (x) => {
        px(ctx, x, 40, 110, 50, '#3a2a1c');
        px(ctx, x + 4, 44, 30, 20, '#d9a05b');
        px(ctx, x + 38, 44, 30, 20, '#e8543f');
        px(ctx, x + 72, 44, 30, 20, '#f0b428');
        for (let l = 0; l < 3; l++) {
          px(ctx, x + 6, 68 + l * 6, 44, 2, '#c2b49a');
          px(ctx, x + 56, 68 + l * 6, 30, 2, '#c2b49a');
        }
        // balcão
        px(ctx, x + 0, 110, 130, 8, '#d9453e');
        px(ctx, x + 0, 118, 130, 22, '#b3322c');
        px(ctx, x + 0, 110, 130, 2, '#f4978e');
        // caixa registradora e copos
        px(ctx, x + 16, 100, 14, 10, '#3a3440');
        px(ctx, x + 18, 96, 10, 4, '#55505e');
        px(ctx, x + 60, 102, 6, 8, '#e8543f');
        px(ctx, x + 70, 104, 6, 6, '#f0b428');
        // máquina de refri
        px(ctx, x + 96, 92, 24, 18, '#3a3440');
        px(ctx, x + 100, 96, 4, 6, '#e8543f');
        px(ctx, x + 108, 96, 4, 6, '#f0b428');
        px(ctx, x + 114, 96, 4, 6, '#54a06a');
      });

      // luminárias pendentes
      tiled(camX, 0.6, 96, 30, (x) => {
        px(ctx, x, 22, 2, 16, '#5e4630');
        px(ctx, x - 6, 38, 14, 6, '#f7c948');
        px(ctx, x - 4, 44, 10, 2, '#fff3c4');
      });
    },
    drawGround(ctx, x0, x1) {
      // piso xadrez vermelho e creme
      px(ctx, x0, GROUND_Y, x1 - x0, GAME_H - GROUND_Y, '#e8dcc4');
      for (let x = Math.floor(x0 / 12) * 12; x < x1; x += 12) {
        for (let ry = 0; ry < 3; ry++) {
          if ((x / 12 + ry) % 2 === 0) px(ctx, x, GROUND_Y + ry * 10, 12, 10, '#c24a42');
        }
      }
      px(ctx, x0, GROUND_Y, x1 - x0, 1, '#fff7e8');
    },
    obstacles: {
      static: {
        w: 9, h: 9,
        draw(ctx, o) { // casquinha caída
          px(ctx, o.x + 2, o.y, 5, 4, '#fdf6ec');
          px(ctx, o.x + 1, o.y + 1, 2, 2, '#fdf6ec');
          px(ctx, o.x + 3, o.y + 4, 3, 3, '#d9a05b');
          px(ctx, o.x + 4, o.y + 7, 1, 2, '#b5793a');
          px(ctx, o.x + 4, o.y + 5, 1, 1, '#8a5a2e');
        },
      },
      mover: {
        w: 12, h: 9, fly: false,
        draw(ctx, o, t) { // hambúrguer fujão
          const hop = Math.abs(Math.sin(t * 6 + o.baseX)) * 2;
          const y = o.y - hop;
          px(ctx, o.x + 1, y, 10, 3, '#e8a955');
          px(ctx, o.x + 2, y - 1, 8, 1, '#f5c87e');
          px(ctx, o.x, y + 3, 12, 2, '#7da838');
          px(ctx, o.x + 1, y + 5, 10, 2, '#8a4b25');
          px(ctx, o.x + 1, y + 7, 10, 2, '#e8a955');
          px(ctx, o.x + 3, y + 1, 1, 1, '#fdf6ec');
          px(ctx, o.x + 7, y + 1, 1, 1, '#fdf6ec');
        },
      },
    },
  },

  // ===== 4. LAGOA — entardecer, Cristo ao longe, pedalinhos =====
  lagoa: {
    platform: { top: '#e6ddca', body: '#b8ad92' },
    platformType: 'stone',
    drawBG(ctx, camX, t) {
      // céu de entardecer com dithering
      bands(ctx, 0, GAME_W, [
        [0, '#2e2a55'],
        [22, '#6e4670'],
        [44, '#b85a78'],
        [66, '#e8825e'],
        [84, '#f5aa5e'],
      ]);
      // sol
      px(ctx, 226, 60, 20, 20, '#ffe08a');
      px(ctx, 230, 56, 12, 2, '#ffe08a');
      px(ctx, 230, 82, 12, 2, '#ffd06a');

      // morro do Corcovado com Cristo (silhueta)
      tiled(camX, 0.15, 520, 200, (x) => {
        const mx = x + 110;
        ctx.fillStyle = '#3a2c4a';
        ctx.beginPath();
        ctx.moveTo(mx - 90, 100);
        ctx.lineTo(mx - 20, 38);
        ctx.lineTo(mx + 10, 50);
        ctx.lineTo(mx + 80, 100);
        ctx.closePath();
        ctx.fill();
        // Cristo
        px(ctx, mx - 22, 22, 4, 14, '#2c2138');
        px(ctx, mx - 32, 26, 24, 3, '#2c2138');
        px(ctx, mx - 21, 18, 2, 4, '#2c2138');
      });
      // morro Dois Irmãos
      tiled(camX, 0.22, 460, 200, (x) => {
        const mx = x + 330;
        ctx.fillStyle = '#503a5e';
        ctx.beginPath();
        ctx.moveTo(mx - 60, 102);
        ctx.lineTo(mx - 18, 56);
        ctx.lineTo(mx + 4, 78);
        ctx.lineTo(mx + 22, 62);
        ctx.lineTo(mx + 60, 102);
        ctx.closePath();
        ctx.fill();
      });
      // prédios da orla (silhueta com janelas acesas)
      tiled(camX, 0.3, 46, 60, (x, k) => {
        const h = 24 + (k * 13) % 20;
        px(ctx, x, 100 - h, 38, h, '#42355c');
        for (let wy = 0; wy < h - 6; wy += 7) {
          for (let wx = 4; wx < 32; wx += 9) {
            if ((k + wx + wy) % 3 === 0) px(ctx, x + wx, 102 - h + wy, 3, 3, '#ffd98a');
          }
        }
      });

      // água
      bands(ctx, 0, GAME_W, [
        [100, '#7e5276'],
        [116, '#5e4470'],
        [134, '#46365e'],
      ]);
      // reflexo do sol na água
      for (let ry = 0; ry < 6; ry++) {
        const rw = 18 - ry * 2 + Math.sin(t * 2 + ry) * 3;
        px(ctx, 236 - rw / 2 - (camX * 0.05) % 4, 102 + ry * 7, rw, 2, ry % 2 ? '#f5aa5e88' : '#ffd98a66');
      }
      // ondinhas
      tiled(camX, 0.4, 42, 20, (x, k) => {
        px(ctx, x + Math.sin(t * 1.5 + k) * 3, 106 + (k % 4) * 9, 16, 1, '#ffffff2e');
      });

      // pedalinhos-cisne
      tiled(camX, 0.45, 230, 40, (x, k) => {
        const sy = 112 + (k % 2) * 12 + Math.sin(t * 1.4 + k * 2) * 2;
        px(ctx, x, sy, 22, 8, '#f0e8da');
        px(ctx, x + 2, sy + 8, 18, 2, '#cabd9f');
        px(ctx, x + 17, sy - 8, 3, 9, '#f0e8da');
        px(ctx, x + 16, sy - 10, 6, 4, '#f0e8da');
        px(ctx, x + 21, sy - 9, 3, 2, '#e8823c');
        px(ctx, x + 18, sy - 9, 1, 1, '#1d1b26');
        px(ctx, x + 4, sy + 2, 6, 4, '#46365e');
      });

      // coqueiros da margem (camada próxima)
      tiled(camX, 0.7, 240, 60, (x) => {
        px(ctx, x + 2, 104, 5, 46, '#3a2c28');
        px(ctx, x + 3, 104, 2, 46, '#55403a');
        for (let f = 0; f < 6; f++) {
          const a = (f / 5) * Math.PI;
          const fx = Math.cos(a) * 20;
          const fy = Math.sin(a) * 8;
          px(ctx, x + 4 + fx - 9, 98 - fy, 18, 3, f % 2 ? '#2c5a3a' : '#3e7d52');
        }
      });
    },
    drawGround(ctx, x0, x1) {
      // calçadão de pedras portuguesas com ondas
      px(ctx, x0, GROUND_Y, x1 - x0, GAME_H - GROUND_Y, '#e6ddca');
      px(ctx, x0, GROUND_Y, x1 - x0, 2, '#f4eee0');
      ctx.fillStyle = '#3a3440';
      for (let x = Math.floor(x0 / 64) * 64; x < x1; x += 64) {
        for (let i = 0; i < 32; i++) {
          const wy = GROUND_Y + 8 + Math.sin((i / 32) * Math.PI * 2) * 5;
          ctx.fillRect(x + i * 2, Math.round(wy), 2, 5);
        }
      }
      px(ctx, x0, GROUND_Y + 22, x1 - x0, 1, '#cabd9f');
    },
    obstacles: {
      static: {
        w: 14, h: 4,
        draw(ctx, o, t) { // poça d'água
          px(ctx, o.x, o.y + 1, 14, 3, '#5e7ea6');
          px(ctx, o.x + 2, o.y, 10, 1, '#8cb0cc');
          px(ctx, o.x + 4 + Math.sin(t * 3) * 2, o.y + 2, 4, 1, '#aacce0');
        },
      },
      mover: {
        w: 13, h: 10, fly: false,
        draw(ctx, o, t) { // capivara filhote passeando
          px(ctx, o.x + 1, o.y + 3, 10, 5, '#8a6a42');
          px(ctx, o.x + 2, o.y + 2, 8, 2, '#9c7a4e');
          px(ctx, o.x + (o.dir > 0 ? 9 : 0), o.y, 4, 5, '#8a6a42');
          px(ctx, o.x + (o.dir > 0 ? 12 : 0), o.y + 2, 1, 2, '#5e4630');
          px(ctx, o.x + (o.dir > 0 ? 10 : 2), o.y + 1, 1, 1, '#1d1b26');
          px(ctx, o.x + (o.dir > 0 ? 9 : 3), o.y - 1, 1, 2, '#6e522e');
          const leg = Math.sin(t * 9 + o.baseX) > 0 ? 1 : 0;
          px(ctx, o.x + 2 + leg, o.y + 8, 2, 2, '#6e522e');
          px(ctx, o.x + 8 - leg, o.y + 8, 2, 2, '#6e522e');
        },
      },
    },
  },

  // ===== 5. PRAIA À NOITE — lua, mar em camadas, quiosque =====
  praia: {
    platform: { top: '#8a6e4a', body: '#62492e' },
    platformType: 'wood',
    drawBG(ctx, camX, t) {
      bands(ctx, 0, GAME_W, [
        [0, '#070b22'],
        [34, '#0d1430'],
        [66, '#162042'],
      ]);
      // estrelas
      for (let i = 0; i < 50; i++) {
        const sx = ((i * 67 - camX * 0.08) % (GAME_W + 40) + GAME_W + 40) % (GAME_W + 40) - 20;
        const sy = (i * 41) % 84;
        const tw = (Math.sin(t * 2.5 + i * 1.7) > 0.5) ? '#fff' : '#7e8ec2';
        px(ctx, sx, sy, 1, 1, tw);
        if (i % 11 === 0) px(ctx, sx - 1, sy, 3, 1, '#7e8ec244');
      }
      // lua com crateras
      const mx = 240 - (camX * 0.06) % 50;
      px(ctx, mx, 18, 24, 24, '#f0ead2');
      px(ctx, mx + 2, 16, 20, 2, '#f0ead2');
      px(ctx, mx + 2, 42, 20, 2, '#f0ead2');
      px(ctx, mx - 2, 20, 2, 20, '#f0ead2');
      px(ctx, mx + 24, 20, 2, 20, '#f0ead2');
      px(ctx, mx + 5, 24, 5, 5, '#d2cab2');
      px(ctx, mx + 14, 32, 4, 4, '#d2cab2');
      px(ctx, mx + 16, 22, 3, 3, '#dcd4ba');
      px(ctx, mx + 7, 34, 3, 3, '#dcd4ba');

      // cidade distante no horizonte
      tiled(camX, 0.12, 30, 20, (x, k) => {
        if (k % 3 === 0) return;
        px(ctx, x, 98, 2, 1, '#ffd98a99');
        px(ctx, x + 8, 99, 1, 1, '#ff9a6b88');
      });

      // mar em 3 faixas com espuma
      bands(ctx, 0, GAME_W, [
        [102, '#1c2c58'],
        [118, '#16234a'],
        [132, '#101a3a'],
      ]);
      // trilho de luar
      for (let ry = 0; ry < 7; ry++) {
        const rw = 16 - ry * 1.5 + Math.sin(t * 1.8 + ry * 2) * 3;
        px(ctx, mx + 12 - rw / 2, 104 + ry * 6, rw, 1, ry % 2 ? '#f0ead255' : '#f0ead233');
      }
      // ondas com espuma animada
      tiled(camX, 0.3, 56, 30, (x, k) => {
        const wx = x + Math.sin(t * 1.2 + k) * 5;
        px(ctx, wx, 104 + (k % 3) * 12, 22, 1, '#aab9e833');
        px(ctx, wx + 4, 105 + (k % 3) * 12, 8, 1, '#e8ecf855');
      });
      // linha de espuma na areia
      const foam = Math.sin(t * 0.8) * 4;
      px(ctx, 0, 140 + foam * 0.4, GAME_W, 2, '#dce4f455');

      // quiosque com luzinha
      tiled(camX, 0.55, 420, 80, (x) => {
        const qx = x + 250;
        px(ctx, qx, 108, 4, 36, '#3a2c20');
        px(ctx, qx + 40, 108, 4, 36, '#3a2c20');
        px(ctx, qx - 8, 96, 60, 8, '#7a5a32');
        px(ctx, qx - 4, 92, 52, 6, '#8a6a3e');
        px(ctx, qx - 8, 104, 60, 2, '#5e4426');
        px(ctx, qx + 6, 118, 32, 12, '#55403a');
        px(ctx, qx + 10, 122, 8, 8, '#ffd98a');
        signText(ctx, 'AGUA D COCO', qx - 4, 102, '#ffe9a8', 5);
        px(ctx, qx + 20, 108, 2, 4, '#ffd98a');
      });

      // coqueiros em silhueta (camada próxima)
      tiled(camX, 0.75, 270, 70, (x, k) => {
        const lean = (k % 2) * 6 - 3;
        for (let s = 0; s < 12; s++) {
          px(ctx, x + s * lean / 12, 92 + s * 5, 4, 5, '#0c1020');
        }
        const topx = x + lean;
        for (let f = 0; f < 7; f++) {
          const a = (f / 6) * Math.PI;
          const fx = Math.cos(a) * 22;
          const fy = Math.sin(a) * 9;
          const sway = Math.sin(t * 1.5 + k + f) * 1.5;
          px(ctx, topx + fx - 10 + sway, 88 - fy, 20, 3, '#0e1426');
        }
        px(ctx, topx - 2, 88, 6, 4, '#0c1020');
      });
    },
    drawGround(ctx, x0, x1) {
      // areia noturna com brilho da lua
      px(ctx, x0, GROUND_Y, x1 - x0, GAME_H - GROUND_Y, '#8a7a5e');
      px(ctx, x0, GROUND_Y, x1 - x0, 2, '#a89570');
      for (let x = Math.floor(x0 / 18) * 18; x < x1; x += 18) {
        px(ctx, x + 4, GROUND_Y + 8, 2, 1, '#6e6048');
        px(ctx, x + 12, GROUND_Y + 16, 3, 1, '#6e6048');
        px(ctx, x + 8, GROUND_Y + 23, 2, 1, '#a8957066');
      }
    },
    obstacles: {
      static: {
        w: 9, h: 8,
        draw(ctx, o) { // coco na areia
          px(ctx, o.x + 1, o.y + 2, 7, 6, '#4e3a22');
          px(ctx, o.x + 2, o.y + 1, 5, 2, '#62492e');
          px(ctx, o.x + 3, o.y, 3, 2, '#76583a');
          px(ctx, o.x + 3, o.y + 4, 1, 2, '#2c2014');
          px(ctx, o.x + 5, o.y + 4, 1, 2, '#2c2014');
          px(ctx, o.x + 4, o.y + 6, 1, 1, '#2c2014');
        },
      },
      mover: {
        w: 12, h: 8, fly: false,
        draw(ctx, o, t) { // caranguejo
          px(ctx, o.x + 2, o.y + 2, 8, 4, '#d44a32');
          px(ctx, o.x + 3, o.y + 1, 6, 2, '#e85c40');
          px(ctx, o.x + 3, o.y, 1, 2, '#f6ecd8');
          px(ctx, o.x + 7, o.y, 1, 2, '#f6ecd8');
          px(ctx, o.x + 3, o.y, 1, 1, '#1d1b26');
          px(ctx, o.x + 7, o.y, 1, 1, '#1d1b26');
          const leg = Math.sin(t * 12 + o.baseX) > 0 ? 1 : 0;
          px(ctx, o.x, o.y + 4 + leg, 2, 3, '#a83622');
          px(ctx, o.x + 10, o.y + 5 - leg, 2, 3, '#a83622');
          px(ctx, o.x + 1, o.y - 1 + leg, 2, 2, '#a83622');
          px(ctx, o.x + 9, o.y - leg, 2, 2, '#a83622');
        },
      },
    },
  },

  // ===== 6. ROCINHA — fim de tarde, casas em camadas, pipas =====
  rocinha: {
    platform: { top: '#b8a890', body: '#8e8070' },
    platformType: 'laje',
    drawBG(ctx, camX, t) {
      bands(ctx, 0, GAME_W, [
        [0, '#f5aa5e'],
        [26, '#e8825e'],
        [48, '#c45e64'],
      ]);
      // morro ao fundo
      tiled(camX, 0.1, 600, 250, (x) => {
        ctx.fillStyle = '#5e4a66';
        ctx.beginPath();
        ctx.moveTo(x, 64);
        ctx.lineTo(x + 180, 18);
        ctx.lineTo(x + 320, 50);
        ctx.lineTo(x + 600, 30);
        ctx.lineTo(x + 600, 64);
        ctx.closePath();
        ctx.fill();
      });

      // 3 camadas de casinhas
      const rowCfg = [
        { par: 0.22, y: 44, w: 22, h: 22, dark: 0.78 },
        { par: 0.38, y: 66, w: 26, h: 28, dark: 0.9 },
        { par: 0.55, y: 92, w: 30, h: 36, dark: 1 },
      ];
      const palette = ['#c75b4a', '#4a72a8', '#4f8a58', '#c08a36', '#8a5a9e', '#b8485e', '#3e7d8a', '#a8623c'];
      for (let r = 0; r < 3; r++) {
        const cfg = rowCfg[r];
        tiled(camX, cfg.par, cfg.w, 40, (x, k) => {
          const hVar = cfg.h + ((k * 7) % 3) * 4;
          const base = palette[(k * 5 + r * 3) % palette.length];
          // sombreia camadas de trás
          ctx.fillStyle = base;
          ctx.globalAlpha = cfg.dark;
          ctx.fillRect(Math.round(x), cfg.y + (cfg.h - hVar), cfg.w - 2, hVar + 40);
          ctx.globalAlpha = 1;
          // tijolo aparente em algumas
          if (k % 4 === 1) {
            px(ctx, x, cfg.y + (cfg.h - hVar), cfg.w - 2, hVar + 40, '#a8623c');
            px(ctx, x + 2, cfg.y + 4, cfg.w - 8, 1, '#8e4e2e');
            px(ctx, x + 4, cfg.y + 9, cfg.w - 10, 1, '#8e4e2e');
          }
          // janelas (algumas acesas)
          const wy = cfg.y + 6;
          if ((k * 11) % 3 !== 0) {
            px(ctx, x + 4, wy, 6, 7, (k * 13) % 2 ? '#ffd98a' : '#2c2138');
            px(ctx, x + 4, wy, 6, 1, '#00000033');
          }
          if (cfg.w > 24 && (k * 7) % 2 === 0) {
            px(ctx, x + 16, wy + 2, 7, 8, (k * 17) % 3 ? '#2c2138' : '#ffd98a');
          }
          // laje com caixa d'água azul
          px(ctx, x, cfg.y + (cfg.h - hVar) - 2, cfg.w - 2, 2, '#00000022');
          if ((k * 3) % 4 === 0) {
            px(ctx, x + cfg.w - 12, cfg.y + (cfg.h - hVar) - 9, 8, 7, '#3a6aa8');
            px(ctx, x + cfg.w - 12, cfg.y + (cfg.h - hVar) - 9, 8, 2, '#4a82c4');
          }
          // antena
          if ((k * 9) % 5 === 0) px(ctx, x + 4, cfg.y + (cfg.h - hVar) - 10, 1, 8, '#2c2138');
        });
      }

      // fios elétricos cruzando
      ctx.strokeStyle = '#2c2138';
      ctx.lineWidth = 1;
      tiled(camX, 0.6, 130, 60, (x, k) => {
        ctx.beginPath();
        ctx.moveTo(x, 110);
        ctx.quadraticCurveTo(x + 65, 124 + (k % 2) * 6, x + 130, 110);
        ctx.stroke();
        // bandeirinhas de festa junina
        for (let s = 1; s < 8; s++) {
          const bx = x + s * 16;
          const by = 110 + Math.sin((s / 8) * Math.PI) * (12 + (k % 2) * 6);
          px(ctx, bx, by, 4, 3, palette[(s + k) % palette.length]);
          px(ctx, bx + 1, by + 3, 2, 2, palette[(s + k) % palette.length]);
        }
      });

      // pipa no céu
      const kx = 60 + Math.sin(t * 0.7) * 30 - (camX * 0.2) % 120;
      const ky = 20 + Math.cos(t * 0.9) * 8;
      px(ctx, kx + 3, ky, 2, 2, '#ffd24d');
      px(ctx, kx + 1, ky + 2, 6, 2, '#e63962');
      px(ctx, kx, ky + 4, 8, 2, '#ffd24d');
      px(ctx, kx + 2, ky + 6, 4, 2, '#e63962');
      px(ctx, kx + 3, ky + 8, 1, 6, '#f6ecd866');
      px(ctx, kx + 2, ky + 14, 1, 4, '#f6ecd844');
    },
    drawGround(ctx, x0, x1) {
      // ladeira de concreto com mureta
      px(ctx, x0, GROUND_Y, x1 - x0, GAME_H - GROUND_Y, '#8e8070');
      px(ctx, x0, GROUND_Y, x1 - x0, 3, '#a89884');
      px(ctx, x0, GROUND_Y + 3, x1 - x0, 1, '#6e624f');
      for (let x = Math.floor(x0 / 26) * 26; x < x1; x += 26) {
        px(ctx, x, GROUND_Y + 4, 1, GAME_H - GROUND_Y, '#7a6e5c');
        px(ctx, x + 9, GROUND_Y + 14, 4, 2, '#7a6e5c');
      }
    },
    obstacles: {
      static: {
        w: 9, h: 10,
        draw(ctx, o) { // vaso de planta na calçada
          px(ctx, o.x + 1, o.y + 5, 7, 5, '#b05838');
          px(ctx, o.x, o.y + 4, 9, 2, '#c2603f');
          px(ctx, o.x + 3, o.y + 1, 3, 4, '#3e7d52');
          px(ctx, o.x + 1, o.y - 1, 3, 4, '#54a06a');
          px(ctx, o.x + 5, o.y - 1, 3, 3, '#54a06a');
        },
      },
      mover: {
        w: 11, h: 8, fly: true,
        draw(ctx, o, t) { // pipa rasante
          px(ctx, o.x + 4, o.y, 3, 2, '#ffd24d');
          px(ctx, o.x + 2, o.y + 2, 7, 2, '#4a72a8');
          px(ctx, o.x + 1, o.y + 4, 9, 2, '#ffd24d');
          px(ctx, o.x + 3, o.y + 6, 5, 2, '#4a72a8');
          const rab = Math.sin(t * 7 + o.baseX) * 2;
          px(ctx, o.x + 5 + rab, o.y + 8, 1, 3, '#f6ecd8aa');
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

  // Plataformas (bancos/sofás/mesas/lajes...)
  let x = 220;
  while (x < length - 320) {
    const w = 44 + Math.floor(rng() * 36);
    const y = GROUND_Y - (26 + Math.floor(rng() * 26));
    platforms.push({ x, y, w, h: 8, type: theme.platformType });
    const n = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < n; i++) hearts.push({ x: x + 8 + i * 14, y: y - 16, got: false });
    if (rng() < 0.4 && rings.length < 3) {
      rings.push({ x: x + w / 2, y: y - 36, got: false });
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
        y: fly ? GROUND_Y - 52 - rng() * 30 : GROUND_Y - def.h,
        w: def.w, h: def.h,
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
