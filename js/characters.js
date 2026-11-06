/* ============================================================
   Movie Life — CharacterArt
   Original code-drawn cartoon characters. No external sprites.
   Local coordinate system: (0,0) is the character's feet.
   ============================================================ */
(function () {
  'use strict';

  const CHARACTERS = {
    tomoko: {
      name: 'Tomoko', skin: '#f6c7a6', skinShade: '#e6a27e',
      hair: '#5a3928', hairDark: '#3d2419', hairLight: '#7a4d32',
      hairStyle: 'bob', outfit: 'sailor', accent: '#e15b5d', clip: true
    },
    yoshie: {
      name: 'Yoshie', skin: '#f4c3a0', skinShade: '#e09d77',
      hair: '#342624', hairDark: '#211716', hairLight: '#4b3630',
      hairStyle: 'long', outfit: 'sailor', accent: '#e9a23b'
    },
    naomi: {
      name: 'Naomi', skin: '#efbd96', skinShade: '#d99770',
      hair: '#6b4730', hairDark: '#4a2d1c', hairLight: '#8d6344',
      hairStyle: 'ponytail', outfit: 'sailor', accent: '#4b9b8c'
    },
    kaori: {
      name: 'Kaori', skin: '#f8d0b4', skinShade: '#e8ae8d',
      hair: '#2f2a2e', hairDark: '#1b171b', hairLight: '#4a4148',
      hairStyle: 'long', outfit: 'sailor', accent: '#7287c9', glasses: true
    },
    takuo: {
      name: 'Takuo', skin: '#eec09d', skinShade: '#d79b73',
      hair: '#2d2928', hairDark: '#1c1918', hairLight: '#48413e',
      hairStyle: 'buzz', outfit: 'gakuran', accent: '#53758e'
    },
    ozawa: {
      name: 'Mr. Ozawa', skin: '#e8b58d', skinShade: '#ce9169',
      hair: '#373131', hairDark: '#221d1d', hairLight: '#544b48',
      hairStyle: 'teacher', outfit: 'tracksuit', accent: '#7f8f58', mustache: true
    },
    itami: {
      name: 'Ms. Itami', skin: '#f4c9ac', skinShade: '#dfa17f',
      hair: '#4a3228', hairDark: '#2e1d17', hairLight: '#6b4a3a',
      hairStyle: 'elegant', outfit: 'blazer', accent: '#a65c7b'
    },
    shopkeep: {
      name: 'Record Shop Owner', skin: '#eab991', skinShade: '#d1966c',
      hair: '#5b514b', hairDark: '#3b332f', hairLight: '#7a6d64',
      hairStyle: 'bun', outfit: 'apron', accent: '#7c8d61'
    },
    friend: {
      name: 'Classmate', skin: '#f3c3a2', skinShade: '#e09d77',
      hair: '#49342b', hairDark: '#2e201a', hairLight: '#65493b',
      hairStyle: 'long', outfit: 'sailor', accent: '#6c86a4'
    },
    classmate2: {
      name: 'Classmate', skin: '#f0bd97', skinShade: '#d99a72',
      hair: '#3d2c24', hairDark: '#261b16', hairLight: '#594137',
      hairStyle: 'ponytail', outfit: 'sailor', accent: '#b47f94'
    },
    announcer: {
      name: 'Announcer', skin: '#e9b991', skinShade: '#d1946a',
      hair: '#42322a', hairDark: '#291f1a', hairLight: '#5e483c',
      hairStyle: 'teacher', outfit: 'suit', accent: '#6d7b96'
    }
  };

  const SKIN_LINE = '#3b2b2340';

  function rr(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  function line(ctx, x1, y1, x2, y2, color, width, cap) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = cap || 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  /* ---------------- hair ---------------- */
  function drawHairBack(ctx, cfg, dir) {
    const h = cfg.hair;
    const hd = cfg.hairDark;
    ctx.fillStyle = h;
    ctx.strokeStyle = hd;
    ctx.lineWidth = 1.5;

    if (cfg.hairStyle === 'long' || cfg.hairStyle === 'elegant') {
      ctx.beginPath();
      ctx.ellipse(0, 4, 24, 37, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // soft inner shadow
      ctx.fillStyle = hd;
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.ellipse(0, 18, 18, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else if (cfg.hairStyle === 'bob') {
      ctx.beginPath();
      ctx.ellipse(0, 2, 23, 27, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (cfg.hairStyle === 'ponytail') {
      // high side ponytail behind the head
      ctx.save();
      ctx.translate(15, -11);
      ctx.rotate(0.55);
      ctx.beginPath();
      ctx.ellipse(16, 10, 9, 22, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.beginPath();
      ctx.ellipse(0, 1, 21, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (cfg.hairStyle === 'bun') {
      ctx.beginPath();
      ctx.arc(0, -18, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 1, 21, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, 21, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  function drawHairFront(ctx, cfg, dir) {
    const h = cfg.hair;
    const hd = cfg.hairDark;
    const hl = cfg.hairLight;
    ctx.fillStyle = h;
    ctx.strokeStyle = hd;
    ctx.lineWidth = 1.4;

    if (cfg.hairStyle === 'bob') {
      ctx.beginPath();
      ctx.moveTo(-20, 3);
      ctx.bezierCurveTo(-22, -16, -13, -27, 0, -27);
      ctx.bezierCurveTo(14, -27, 22, -15, 20, 3);
      ctx.bezierCurveTo(17, -4, 13, -10, 9, -12);
      ctx.bezierCurveTo(4, -3, -5, -1, -12, -8);
      ctx.bezierCurveTo(-15, -2, -18, 2, -20, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // side locks
      ctx.beginPath();
      ctx.moveTo(-19, -4);
      ctx.quadraticCurveTo(-23, 10, -17, 18);
      ctx.quadraticCurveTo(-13, 8, -15, -3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(19, -4);
      ctx.quadraticCurveTo(23, 10, 17, 18);
      ctx.quadraticCurveTo(13, 8, 15, -3);
      ctx.fill();
      // highlight
      ctx.strokeStyle = hl;
      ctx.globalAlpha = 0.65;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-5, -15, 12, Math.PI * 1.08, Math.PI * 1.5);
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (cfg.clip) {
        ctx.fillStyle = cfg.accent;
        rr(ctx, 11, -11, 8, 3.5, 1.7);
        ctx.fill();
        ctx.fillStyle = '#ffd76e';
        ctx.beginPath();
        ctx.arc(10.7, -9.2, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (cfg.hairStyle === 'long') {
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.bezierCurveTo(-24, -18, -13, -28, 0, -28);
      ctx.bezierCurveTo(14, -28, 24, -18, 20, 0);
      ctx.bezierCurveTo(17, -8, 12, -13, 7, -14);
      ctx.bezierCurveTo(4, -6, -3, -5, -9, -12);
      ctx.bezierCurveTo(-13, -7, -17, -3, -20, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // long side panels
      ctx.beginPath();
      ctx.moveTo(-19, -3);
      ctx.quadraticCurveTo(-25, 15, -18, 30);
      ctx.quadraticCurveTo(-11, 19, -13, -2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(19, -3);
      ctx.quadraticCurveTo(25, 15, 18, 30);
      ctx.quadraticCurveTo(11, 19, 13, -2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = hl;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-4, -16, 13, Math.PI * 1.04, Math.PI * 1.48);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (cfg.hairStyle === 'ponytail') {
      ctx.beginPath();
      ctx.moveTo(-20, 1);
      ctx.bezierCurveTo(-22, -17, -12, -26, 0, -26);
      ctx.bezierCurveTo(13, -26, 22, -16, 20, 1);
      ctx.bezierCurveTo(15, -7, 11, -12, 7, -13);
      ctx.bezierCurveTo(2, -5, -6, -4, -13, -11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // hair tie
      ctx.fillStyle = cfg.accent;
      ctx.beginPath();
      ctx.arc(16, -14, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hd;
      ctx.stroke();
      ctx.strokeStyle = hl;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-3, -15, 12, Math.PI * 1.08, Math.PI * 1.48);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (cfg.hairStyle === 'buzz') {
      ctx.beginPath();
      ctx.moveTo(-19, 4);
      ctx.bezierCurveTo(-19, -15, -10, -22, 0, -22);
      ctx.bezierCurveTo(10, -22, 19, -15, 19, 4);
      ctx.bezierCurveTo(11, -3, 6, -6, 0, -6);
      ctx.bezierCurveTo(-7, -6, -12, -3, -19, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = hl;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.3;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(0, -2, 12 + i * 2, Math.PI * 1.12, Math.PI * 1.35);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (cfg.hairStyle === 'teacher') {
      ctx.beginPath();
      ctx.moveTo(-19, 2);
      ctx.bezierCurveTo(-20, -16, -10, -24, 0, -24);
      ctx.bezierCurveTo(10, -24, 20, -16, 20, 2);
      ctx.bezierCurveTo(15, -3, 8, -5, 3, -13);
      ctx.bezierCurveTo(-3, -4, -11, -2, -19, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = hl;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, -21);
      ctx.quadraticCurveTo(4, -26, 13, -17);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (cfg.hairStyle === 'elegant') {
      ctx.beginPath();
      ctx.moveTo(-20, 2);
      ctx.bezierCurveTo(-23, -17, -13, -27, 0, -27);
      ctx.bezierCurveTo(14, -27, 23, -17, 20, 2);
      ctx.bezierCurveTo(17, -7, 11, -12, 6, -13);
      ctx.bezierCurveTo(2, -5, -8, -4, -14, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = hl;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-3, -16, 13, Math.PI * 1.06, Math.PI * 1.48);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (cfg.hairStyle === 'bun') {
      ctx.beginPath();
      ctx.moveTo(-19, 2);
      ctx.bezierCurveTo(-21, -15, -11, -23, 0, -23);
      ctx.bezierCurveTo(11, -23, 21, -15, 19, 2);
      ctx.bezierCurveTo(12, -5, 5, -8, 0, -8);
      ctx.bezierCurveTo(-7, -8, -13, -5, -19, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  /* ---------------- face ---------------- */
  function drawFace(ctx, cfg, expr, dir) {
    if (dir === 'up') return;
    const side = dir === 'left' || dir === 'right';
    const look = side ? 4.5 : 0;
    const eyeY = side ? 1 : 2;
    const eyeColor = '#26202a';
    const mouthColor = '#8d4a44';

    // blush
    ctx.fillStyle = '#ef8b82';
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.ellipse(-10 + look, 9, 4.2, 2.3, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!side) {
      ctx.beginPath();
      ctx.ellipse(10, 9, 4.2, 2.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const drawEye = (x, y, scale) => {
      ctx.fillStyle = eyeColor;
      if (expr === 'happy') {
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(x, y + 1, 3.1 * scale, Math.PI * 1.08, Math.PI * 1.92);
        ctx.stroke();
      } else if (expr === 'sad') {
        ctx.beginPath();
        ctx.ellipse(x, y + 1.3, 2.5 * scale, 2.0 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x - 3.2 * scale, y - 2.6);
        ctx.lineTo(x + 3.2 * scale, y - 1.4);
        ctx.stroke();
      } else if (expr === 'angry') {
        ctx.beginPath();
        ctx.ellipse(x, y + 0.6, 2.6 * scale, 2.3 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x - 3.2 * scale, y - 2.8);
        ctx.lineTo(x + 3.0 * scale, y - 1.2);
        ctx.stroke();
      } else if (expr === 'surprised') {
        ctx.beginPath();
        ctx.arc(x, y, 3.2 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x - 0.9 * scale, y - 1.0, 1.1 * scale, 0, Math.PI * 2);
        ctx.fill();
      } else if (expr === 'shy') {
        ctx.beginPath();
        ctx.ellipse(x, y + 0.8, 2.2 * scale, 1.8 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x - 2.7 * scale, y - 2.8);
        ctx.lineTo(x + 2.2 * scale, y - 2.0);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.ellipse(x, y, 2.7 * scale, 3.0 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x - 0.8 * scale, y - 1.0, 1.0 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (side) {
      drawEye(6, eyeY, 1);
      // nose
      ctx.strokeStyle = SKIN_LINE;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(16.3, 3);
      ctx.quadraticCurveTo(17.4, 5, 15.8, 6);
      ctx.stroke();
    } else {
      drawEye(-7, eyeY, 1);
      drawEye(7, eyeY, 1);
    }

    // eyebrows
    if (expr !== 'happy' && expr !== 'surprised') {
      ctx.strokeStyle = cfg.hairDark;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.25;
      ctx.lineCap = 'round';
      if (side) {
        ctx.beginPath();
        ctx.moveTo(3, -5);
        ctx.lineTo(8, -4.5);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-10, -5.5);
        ctx.lineTo(-4.5, -4.7);
        ctx.moveTo(4.5, -4.7);
        ctx.lineTo(10, -5.5);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // mouth
    ctx.strokeStyle = mouthColor;
    ctx.fillStyle = '#a85550';
    ctx.lineWidth = 1.35;
    ctx.lineCap = 'round';
    const mx = side ? 10 : 0;
    const my = 12;
    if (expr === 'happy') {
      ctx.beginPath();
      ctx.arc(mx, my - 1, 3.1, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    } else if (expr === 'sad') {
      ctx.beginPath();
      ctx.arc(mx, my + 3.2, 3.0, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else if (expr === 'surprised') {
      ctx.beginPath();
      ctx.ellipse(mx, my, 1.8, 2.3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (expr === 'angry') {
      ctx.beginPath();
      ctx.moveTo(mx - 3, my + 0.5);
      ctx.quadraticCurveTo(mx, my - 0.7, mx + 3, my + 0.5);
      ctx.stroke();
    } else if (expr === 'shy') {
      ctx.beginPath();
      ctx.moveTo(mx - 2.8, my + 0.4);
      ctx.quadraticCurveTo(mx - 1.4, my + 1.6, mx, my + 0.3);
      ctx.quadraticCurveTo(mx + 1.4, my + 1.6, mx + 2.8, my + 0.4);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(mx - 2.6, my);
      ctx.lineTo(mx + 2.6, my);
      ctx.stroke();
    }

    if (cfg.mustache) {
      ctx.fillStyle = cfg.hairDark;
      ctx.beginPath();
      ctx.ellipse(side ? 12 : -3.2, 8, 3.5, 1.8, -0.15, 0, Math.PI * 2);
      ctx.fill();
      if (!side) {
        ctx.beginPath();
        ctx.ellipse(3.2, 8, 3.5, 1.8, 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (cfg.glasses) {
      ctx.strokeStyle = '#3b3540';
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 0.9;
      if (side) {
        ctx.beginPath();
        ctx.arc(6, 1.5, 5.0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(11, 1.5);
        ctx.lineTo(16, 1.5);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(-7, 1.5, 5.0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(7, 1.5, 5.0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-2, 1.5);
        ctx.lineTo(2, 1.5);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawHead(ctx, cfg, expr, dir) {
    if (dir !== 'up') {
      // neck
      ctx.fillStyle = cfg.skinShade;
      ctx.beginPath();
      ctx.ellipse(0, 20, 6.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cfg.skin;
      ctx.beginPath();
      ctx.ellipse(0, 17, 5.5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    drawHairBack(ctx, cfg, dir);
    // ears
    if (dir !== 'up') {
      ctx.fillStyle = cfg.skin;
      ctx.beginPath();
      ctx.ellipse(-18, 2, 3.4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(18, 2, 3.4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // face
    ctx.fillStyle = cfg.skin;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18.5, 19.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = SKIN_LINE;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    drawFace(ctx, cfg, expr, dir);
    drawHairFront(ctx, cfg, dir);
  }

  /* ---------------- outfit ---------------- */
  function drawLegs(ctx, cfg, swing, moving) {
    const pants = cfg.outfit === 'gakuran' || cfg.outfit === 'tracksuit' || cfg.outfit === 'suit';
    const legColor = pants ? (cfg.outfit === 'gakuran' || cfg.outfit === 'suit' ? '#2c3549' : '#66734d') : cfg.skin;
    const shoeColor = '#4b3630';
    const lx = -7 + swing * 0.55;
    const rx = 7 - swing * 0.55;
    // back leg
    ctx.strokeStyle = legColor;
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-7, -43);
    ctx.lineTo(lx, -7);
    ctx.stroke();
    // front leg
    ctx.strokeStyle = legColor;
    ctx.beginPath();
    ctx.moveTo(7, -43);
    ctx.lineTo(rx, -7);
    ctx.stroke();
    // socks
    if (!pants) {
      ctx.strokeStyle = '#f8f4e9';
      ctx.lineWidth = 7.8;
      ctx.beginPath();
      ctx.moveTo(lx, -19);
      ctx.lineTo(lx, -7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rx, -19);
      ctx.lineTo(rx, -7);
      ctx.stroke();
    }
    // shoes
    ctx.fillStyle = shoeColor;
    ctx.beginPath();
    ctx.ellipse(lx - (moving ? 1 : 0), -4, 6.4, 3.4, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(rx + (moving ? 1 : 0), -4, 6.4, 3.4, 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSkirt(ctx, cfg) {
    const navy = '#2b3750';
    const navyDark = '#1d2739';
    ctx.fillStyle = navy;
    ctx.strokeStyle = navyDark;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-14, -69);
    ctx.quadraticCurveTo(-22, -52, -24, -38);
    ctx.quadraticCurveTo(0, -33, 24, -38);
    ctx.quadraticCurveTo(22, -52, 14, -69);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,247,231,.18)';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 5.2, -66);
      ctx.lineTo(i * 7.2, -37);
      ctx.stroke();
    }
  }

  function drawTorso(ctx, cfg) {
    const outfit = cfg.outfit;
    if (outfit === 'sailor') {
      // white blouse
      ctx.fillStyle = '#fbf7ec';
      ctx.strokeStyle = '#d8cdb9';
      ctx.lineWidth = 1.2;
      rr(ctx, -15, -88, 30, 26, 7);
      ctx.fill();
      ctx.stroke();
      // navy collar
      ctx.fillStyle = '#2b3750';
      ctx.beginPath();
      ctx.moveTo(-16, -88);
      ctx.lineTo(-4, -74);
      ctx.lineTo(0, -80);
      ctx.lineTo(4, -74);
      ctx.lineTo(16, -88);
      ctx.lineTo(13, -92);
      ctx.lineTo(0, -85);
      ctx.lineTo(-13, -92);
      ctx.closePath();
      ctx.fill();
      // red scarf
      ctx.fillStyle = cfg.accent;
      ctx.beginPath();
      ctx.moveTo(-3, -78);
      ctx.lineTo(0, -66);
      ctx.lineTo(3, -78);
      ctx.lineTo(0, -82);
      ctx.closePath();
      ctx.fill();
      // sleeves
      ctx.strokeStyle = '#fbf7ec';
      ctx.lineWidth = 8.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-14, -84);
      ctx.lineTo(-20, -64);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, -84);
      ctx.lineTo(20, -64);
      ctx.stroke();
    } else if (outfit === 'gakuran') {
      ctx.fillStyle = '#2c3549';
      ctx.strokeStyle = '#1c2433';
      ctx.lineWidth = 1.3;
      rr(ctx, -16, -89, 32, 30, 6);
      ctx.fill();
      ctx.stroke();
      // collar
      ctx.fillStyle = '#202838';
      rr(ctx, -7, -92, 14, 8, 3);
      ctx.fill();
      // buttons
      ctx.fillStyle = '#d9b25e';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, -80 + i * 7, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
      // sleeves
      ctx.strokeStyle = '#2c3549';
      ctx.lineWidth = 8.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-14, -84);
      ctx.lineTo(-20, -64);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, -84);
      ctx.lineTo(20, -64);
      ctx.stroke();
    } else if (outfit === 'tracksuit') {
      ctx.fillStyle = '#7d8a5d';
      ctx.strokeStyle = '#5d6843';
      ctx.lineWidth = 1.2;
      rr(ctx, -17, -89, 34, 30, 6);
      ctx.fill();
      ctx.stroke();
      // zipper
      ctx.strokeStyle = '#d7d0aa';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -88);
      ctx.lineTo(0, -60);
      ctx.stroke();
      // collar
      ctx.strokeStyle = '#68744d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-7, -88);
      ctx.lineTo(0, -82);
      ctx.lineTo(7, -88);
      ctx.stroke();
      // sleeves
      ctx.strokeStyle = '#7d8a5d';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-15, -84);
      ctx.lineTo(-21, -63);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(15, -84);
      ctx.lineTo(21, -63);
      ctx.stroke();
      ctx.strokeStyle = '#d7d0aa';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-21, -70);
      ctx.lineTo(-21, -61);
      ctx.moveTo(21, -70);
      ctx.lineTo(21, -61);
      ctx.stroke();
    } else if (outfit === 'blazer') {
      ctx.fillStyle = '#8a4c62';
      ctx.strokeStyle = '#673247';
      ctx.lineWidth = 1.2;
      rr(ctx, -16, -89, 32, 30, 6);
      ctx.fill();
      ctx.stroke();
      // white shirt
      ctx.fillStyle = '#fbf7ec';
      ctx.beginPath();
      ctx.moveTo(-5, -89);
      ctx.lineTo(0, -75);
      ctx.lineTo(5, -89);
      ctx.closePath();
      ctx.fill();
      // tie
      ctx.fillStyle = '#d9a23e';
      ctx.beginPath();
      ctx.moveTo(-1.8, -83);
      ctx.lineTo(1.8, -83);
      ctx.lineTo(2.4, -63);
      ctx.lineTo(0, -59);
      ctx.lineTo(-2.4, -63);
      ctx.closePath();
      ctx.fill();
      // sleeves
      ctx.strokeStyle = '#8a4c62';
      ctx.lineWidth = 8.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-14, -84);
      ctx.lineTo(-20, -63);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, -84);
      ctx.lineTo(20, -63);
      ctx.stroke();
    } else if (outfit === 'apron') {
      ctx.fillStyle = '#5f7356';
      ctx.strokeStyle = '#44543d';
      ctx.lineWidth = 1.2;
      rr(ctx, -16, -89, 32, 30, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f1dfb9';
      ctx.beginPath();
      ctx.moveTo(-10, -86);
      ctx.lineTo(10, -86);
      ctx.lineTo(13, -60);
      ctx.lineTo(-13, -60);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#cdb98d';
      ctx.stroke();
      ctx.strokeStyle = '#5f7356';
      ctx.lineWidth = 8.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-14, -84);
      ctx.lineTo(-20, -63);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, -84);
      ctx.lineTo(20, -63);
      ctx.stroke();
    } else {
      // suit
      ctx.fillStyle = '#4c556b';
      ctx.strokeStyle = '#343b4e';
      ctx.lineWidth = 1.2;
      rr(ctx, -16, -89, 32, 30, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f7f1e5';
      ctx.beginPath();
      ctx.moveTo(-5, -89);
      ctx.lineTo(0, -76);
      ctx.lineTo(5, -89);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#4c556b';
      ctx.lineWidth = 8.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-14, -84);
      ctx.lineTo(-20, -63);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, -84);
      ctx.lineTo(20, -63);
      ctx.stroke();
    }

    // hands
    ctx.fillStyle = cfg.skin;
    ctx.beginPath();
    ctx.arc(-21, -62, 3.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(21, -62, 3.3, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------------- instruments ---------------- */
  function drawSax(ctx) {
    ctx.save();
    ctx.translate(12, -62);
    ctx.rotate(0.10);
    ctx.strokeStyle = '#3b2a1a';
    ctx.lineWidth = 1.3;
    // main body
    const grad = ctx.createLinearGradient(-2, -32, 12, 22);
    grad.addColorStop(0, '#ffe08a');
    grad.addColorStop(0.45, '#e7a83c');
    grad.addColorStop(1, '#b9741d');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-3, -31);
    ctx.bezierCurveTo(4, -26, 3, 3, 3, 13);
    ctx.bezierCurveTo(3, 22, 10, 26, 16, 21);
    ctx.stroke();
    ctx.strokeStyle = '#5e4015';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-3, -31);
    ctx.bezierCurveTo(4, -26, 3, 3, 3, 13);
    ctx.bezierCurveTo(3, 22, 10, 26, 16, 21);
    ctx.stroke();
    // bell
    ctx.fillStyle = '#f3b84b';
    ctx.strokeStyle = '#8e5e16';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(17, 20, 9, 6.5, 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5b3d12';
    ctx.beginPath();
    ctx.ellipse(18, 20, 5.2, 3.4, 0.28, 0, Math.PI * 2);
    ctx.fill();
    // mouthpiece
    ctx.strokeStyle = '#2f2a2a';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-3, -31);
    ctx.lineTo(-6, -38);
    ctx.stroke();
    // keys
    ctx.fillStyle = '#fff1c7';
    ctx.strokeStyle = '#8e5e16';
    ctx.lineWidth = 0.9;
    [-18, -11, -4, 3, 10].forEach((ky, i) => {
      ctx.beginPath();
      ctx.arc(5.5 + (i % 2) * 3, ky, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawTrumpet(ctx) {
    ctx.save();
    ctx.translate(10, -70);
    ctx.strokeStyle = '#8e5e16';
    ctx.lineWidth = 1.3;
    const grad = ctx.createLinearGradient(0, -3, 0, 4);
    grad.addColorStop(0, '#ffe08a');
    grad.addColorStop(1, '#c98622');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(21, 0);
    ctx.stroke();
    ctx.fillStyle = '#f3b84b';
    ctx.strokeStyle = '#8e5e16';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(19, -6);
    ctx.quadraticCurveTo(31, -9, 31, 0);
    ctx.quadraticCurveTo(31, 9, 19, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5b3d12';
    ctx.beginPath();
    ctx.ellipse(27, 0, 2.3, 5.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // valves
    ctx.strokeStyle = '#8e5e16';
    ctx.lineWidth = 1.5;
    [2, 7, 12].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, -2);
      ctx.lineTo(x, -7);
      ctx.stroke();
    });
    // mouthpiece
    ctx.strokeStyle = '#2f2a2a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(-8, -2);
    ctx.stroke();
    ctx.restore();
  }

  function drawTrombone(ctx) {
    ctx.save();
    ctx.translate(8, -65);
    ctx.strokeStyle = '#8e5e16';
    ctx.lineWidth = 1.2;
    const grad = ctx.createLinearGradient(0, 0, 30, 0);
    grad.addColorStop(0, '#ffe08a');
    grad.addColorStop(1, '#c98622');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(15, -2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(15, -2);
    ctx.lineTo(30, -9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(15, 4);
    ctx.lineTo(30, -2);
    ctx.stroke();
    ctx.fillStyle = '#f3b84b';
    ctx.strokeStyle = '#8e5e16';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-3, -5);
    ctx.quadraticCurveTo(-12, 0, -3, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#2f2a2a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(-7, 0);
    ctx.stroke();
    ctx.restore();
  }

  function drawDrumsticks(ctx) {
    ctx.save();
    ctx.translate(0, -58);
    ctx.strokeStyle = '#b98a4d';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(15, 4);
    ctx.lineTo(26, -17);
    ctx.moveTo(17, 5);
    ctx.lineTo(30, -11);
    ctx.stroke();
    ctx.restore();
  }

  function drawCymbal(ctx) {
    ctx.save();
    ctx.translate(19, -62);
    ctx.rotate(-0.18);
    ctx.fillStyle = '#e7b249';
    ctx.strokeStyle = '#96621e';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 3.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, -0.4, 4, 1.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f8d57f';
    ctx.fill();
    ctx.restore();
  }

  function drawBento(ctx) {
    ctx.save();
    ctx.translate(0, -54);
    ctx.fillStyle = '#7d4a2c';
    ctx.strokeStyle = '#4a2a17';
    ctx.lineWidth = 1.4;
    rr(ctx, -11, -7, 22, 14, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f2d49a';
    ctx.beginPath();
    ctx.moveTo(-9, -5);
    ctx.lineTo(9, -5);
    ctx.lineTo(7, 4);
    ctx.lineTo(-7, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d9534f';
    ctx.beginPath();
    ctx.arc(0, -1, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5f9a6b';
    ctx.beginPath();
    ctx.arc(4, 1, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4a2a17';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -7);
    ctx.lineTo(-2, -14);
    ctx.moveTo(5, -7);
    ctx.lineTo(2, -14);
    ctx.stroke();
    ctx.restore();
  }

  function drawRecord(ctx) {
    ctx.save();
    ctx.translate(15, -60);
    ctx.fillStyle = '#17141a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5b5460';
    ctx.lineWidth = 0.8;
    for (let i = 2; i <= 8; i += 2) {
      ctx.beginPath();
      ctx.ellipse(0, 0, i, i, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#e15b5d';
    ctx.beginPath();
    ctx.arc(0, 0, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawInstrument(ctx, kind) {
    if (!kind) return;
    if (kind === 'sax') drawSax(ctx);
    else if (kind === 'trumpet') drawTrumpet(ctx);
    else if (kind === 'trombone') drawTrombone(ctx);
    else if (kind === 'drumsticks') drawDrumsticks(ctx);
    else if (kind === 'cymbal') drawCymbal(ctx);
    else if (kind === 'bento') drawBento(ctx);
    else if (kind === 'record') drawRecord(ctx);
  }

  /* ---------------- public draw ---------------- */
  function draw(ctx, key, x, y, t, opts) {
    const cfg = typeof key === 'string' ? (CHARACTERS[key] || CHARACTERS.friend) : key;
    opts = opts || {};
    const dir = opts.dir || 'down';
    const moving = !!opts.moving;
    const scale = opts.scale || 1;
    const expr = opts.expr || 'neutral';
    const phase = t * (moving ? 10.5 : 2.1) + (opts.phase || 0);
    const bob = moving ? Math.abs(Math.sin(phase)) * 2.4 : Math.sin(phase) * 0.7;
    const legSwing = moving ? Math.sin(phase) * 7.5 : 0;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    if (dir === 'left') ctx.scale(-1, 1);
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;

    // shadow
    ctx.fillStyle = 'rgba(23, 25, 32, .22)';
    ctx.beginPath();
    ctx.ellipse(0, 1, 24, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, -bob);

    drawLegs(ctx, cfg, legSwing, moving);
    if (cfg.outfit === 'sailor' || cfg.outfit === 'blazer') drawSkirt(ctx, cfg);
    drawTorso(ctx, cfg);
    if (opts.instrument) drawInstrument(ctx, opts.instrument);
    ctx.save();
    ctx.translate(0, -102);
    drawHead(ctx, cfg, expr, dir);
    ctx.restore();

    // little idle note for musicians
    if (opts.note && !moving) {
      const a = (t * 0.9 + (opts.phase || 0)) % 1;
      ctx.globalAlpha = (1 - a) * 0.55;
      ctx.fillStyle = cfg.accent || '#f3b84b';
      ctx.font = 'bold 15px Georgia, serif';
      ctx.fillText('♪', 23 + a * 8, -118 - a * 18);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function drawPortrait(canvas, speaker, expr) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const cfg = CHARACTERS[speaker] || CHARACTERS.tomoko;

    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#ffe5ad');
    bg.addColorStop(0.6, '#f3b78c');
    bg.addColorStop(1, '#d97a6d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // soft rings
    ctx.strokeStyle = 'rgba(255,255,255,.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.44, w * 0.34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.44, w * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    // shoulders
    ctx.fillStyle = cfg.outfit === 'tracksuit' ? '#7d8a5d' : cfg.outfit === 'gakuran' ? '#2c3549' : '#fbf7ec';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 1.05, w * 0.42, h * 0.31, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(w * 0.5, h * 0.56);
    ctx.scale(2.55, 2.55);
    drawHead(ctx, cfg, expr || 'neutral', 'down');
    ctx.restore();

    // decorative notes
    ctx.fillStyle = 'rgba(255,255,255,.34)';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText('♪', w * 0.10, h * 0.20);
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillText('♫', w * 0.78, h * 0.84);
  }

  window.CharacterArt = {
    CHARACTERS,
    draw,
    drawPortrait
  };
})();
