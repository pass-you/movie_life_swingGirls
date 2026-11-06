/* ============================================================
   Movie Life — Backgrounds
   Hand-drawn (code-drawn) canvas scenery for every scene.
   ============================================================ */
(function () {
  'use strict';

  const cache = new Map();

  function make(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

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

  function sky(ctx, w, h, top, mid, bottom) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, top);
    g.addColorStop(0.55, mid);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function cloud(ctx, x, y, s, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 0.8 : alpha;
    ctx.fillStyle = color || '#fff8e9';
    ctx.beginPath();
    ctx.ellipse(x, y, 46 * s, 16 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 28 * s, y + 3 * s, 26 * s, 13 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 28 * s, y + 2 * s, 30 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 5 * s, y - 10 * s, 25 * s, 16 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function hills(ctx, w, baseY, color, amp, step, seed) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += step) {
      const y = baseY - Math.sin((x + seed) * 0.004) * amp - Math.sin((x + seed) * 0.011) * amp * 0.35;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, baseY + 200);
    ctx.lineTo(0, baseY + 200);
    ctx.closePath();
    ctx.fill();
  }

  function tree(ctx, x, y, s, season) {
    const autumn = season === 'autumn';
    const winter = season === 'winter';
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    // trunk
    ctx.strokeStyle = winter ? '#5c4c46' : '#6a4a32';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -62);
    ctx.moveTo(0, -38);
    ctx.lineTo(-22, -58);
    ctx.moveTo(0, -44);
    ctx.lineTo(24, -66);
    ctx.stroke();
    // canopy
    const colors = winter ? ['#d8e4ea', '#c3d4dd'] : autumn ? ['#d97b3b', '#e8a747', '#b95e35'] : ['#4f8a4d', '#67a65a', '#3f7043'];
    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.ellipse(-22, -70, 34, 27, 0, 0, Math.PI * 2);
    ctx.ellipse(20, -75, 38, 30, 0, 0, Math.PI * 2);
    ctx.ellipse(0, -98, 38, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors[1];
    ctx.beginPath();
    ctx.ellipse(-10, -88, 22, 17, 0, 0, Math.PI * 2);
    ctx.ellipse(22, -66, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors[2];
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(-30, -58, 18, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // snow caps
    if (winter) {
      ctx.fillStyle = '#fff8ee';
      ctx.beginPath();
      ctx.ellipse(-4, -106, 25, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(24, -70, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function grass(ctx, x, y, s, color) {
    ctx.strokeStyle = color || '#4e7f45';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 4 * s, y);
      ctx.quadraticCurveTo(x + i * 7 * s, y - 10 * s, x + i * 6 * s + 3, y - 18 * s);
      ctx.stroke();
    }
  }

  function label(ctx, text, x, y, size, color, align) {
    ctx.save();
    ctx.fillStyle = color || '#29303d';
    ctx.font = `800 ${size}px "Trebuchet MS", "Segoe UI", sans-serif`;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function woodFloor(ctx, w, y, h, color1, color2) {
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, color1 || '#c8955f');
    g.addColorStop(1, color2 || '#a66e43');
    ctx.fillStyle = g;
    ctx.fillRect(0, y, w, h);
    ctx.strokeStyle = 'rgba(92, 55, 30, .18)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < h; i += 38) {
      ctx.beginPath();
      ctx.moveTo(0, y + i);
      ctx.lineTo(w, y + i + 6);
      ctx.stroke();
    }
    for (let x = 0; x < w; x += 150) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 40, y + h);
      ctx.stroke();
    }
    const shine = ctx.createLinearGradient(0, y, 0, y + h);
    shine.addColorStop(0, 'rgba(255,232,181,.18)');
    shine.addColorStop(0.5, 'rgba(255,255,255,0)');
    shine.addColorStop(1, 'rgba(60,28,15,.12)');
    ctx.fillStyle = shine;
    ctx.fillRect(0, y, w, h);
  }

  function windowView(ctx, x, y, w, h, season) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    if (season === 'winter') {
      sky(ctx, w, y + h, '#b9d3df', '#dbe8ed', '#eef3f2');
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.fillRect(x, y, w, h);
      hills(ctx, w, y + h * 0.66, '#c7d8df', 16, 40, x);
      tree(ctx, x + w * 0.2, y + h * 0.78, 0.45, 'winter');
      tree(ctx, x + w * 0.7, y + h * 0.83, 0.36, 'winter');
    } else {
      sky(ctx, w, y + h, '#8dd1e7', '#c9eff0', '#f7e8b5');
      cloud(ctx, x + w * 0.3, y + h * 0.23, 0.65, '#ffffff', 0.8);
      cloud(ctx, x + w * 0.72, y + h * 0.15, 0.45, '#ffffff', 0.65);
      hills(ctx, w, y + h * 0.7, '#8fbd75', 20, 50, x);
      hills(ctx, w, y + h * 0.84, '#6e9e5c', 14, 38, x + 90);
      tree(ctx, x + w * 0.22, y + h * 0.92, 0.55, season || 'summer');
      tree(ctx, x + w * 0.75, y + h * 0.95, 0.4, season || 'summer');
    }
    ctx.restore();
    // frame
    ctx.strokeStyle = '#6b5138';
    ctx.lineWidth = 8;
    ctx.strokeRect(x, y, w, h);
    ctx.strokeStyle = '#8f7352';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.strokeStyle = '#6b5138';
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  /* ---------------- classroom ---------------- */
  function classroom(ctx, w, h) {
    // wall
    const wall = ctx.createLinearGradient(0, 0, 0, 540);
    wall.addColorStop(0, '#f5e6c7');
    wall.addColorStop(1, '#e7cea6');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, 560);
    // soft wall stripes
    ctx.strokeStyle = 'rgba(170, 126, 77, .13)';
    ctx.lineWidth = 2;
    for (let y = 28; y < 540; y += 56) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    woodFloor(ctx, w, 540, h - 540, '#c7945e', '#9d6840');

    // windows
    windowView(ctx, 930, 80, 520, 300, 'summer');
    // blackboard
    ctx.fillStyle = '#2f5947';
    ctx.strokeStyle = '#8a6138';
    ctx.lineWidth = 13;
    rr(ctx, 90, 95, 650, 250, 10);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(221, 244, 220, .75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(130, 150);
    ctx.lineTo(570, 150);
    ctx.moveTo(130, 200);
    ctx.lineTo(470, 200);
    ctx.stroke();
    label(ctx, 'x² + y² = ?', 150, 250, 40, 'rgba(235,247,225,.85)');
    label(ctx, 'SUMMER CLASS', 150, 305, 17, 'rgba(235,247,225,.55)');
    // chalk doodles
    ctx.strokeStyle = 'rgba(235,247,225,.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(620, 240, 30, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(680, 295);
    ctx.lineTo(710, 265);
    ctx.stroke();

    // clock
    ctx.fillStyle = '#fff8e9';
    ctx.strokeStyle = '#6b5138';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(800, 90, 31, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#6b5138';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(800, 90);
    ctx.lineTo(800, 72);
    ctx.moveTo(800, 90);
    ctx.lineTo(814, 95);
    ctx.stroke();

    // posters
    ctx.fillStyle = '#f7e7bd';
    ctx.strokeStyle = '#c58a4a';
    ctx.lineWidth = 3;
    rr(ctx, 795, 160, 105, 150, 4);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'JAZZ', 847, 205, 20, '#b4514c', 'center');
    ctx.fillStyle = '#32526e';
    ctx.beginPath();
    ctx.arc(847, 250, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f3b84b';
    ctx.beginPath();
    ctx.arc(847, 250, 10, 0, Math.PI * 2);
    ctx.fill();

    // teacher desk
    ctx.fillStyle = '#9a6740';
    ctx.strokeStyle = '#6d4329';
    ctx.lineWidth = 3;
    rr(ctx, 710, 360, 200, 90, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b98454';
    rr(ctx, 690, 350, 240, 28, 6);
    ctx.fill();
    ctx.stroke();
    // papers
    ctx.fillStyle = '#fdf6e5';
    ctx.save();
    ctx.translate(745, 342);
    ctx.rotate(-0.08);
    ctx.fillRect(0, 0, 42, 28);
    ctx.restore();

    // desks
    const deskRows = [
      { y: 650, xs: [230, 430, 630, 830, 1030, 1230] },
      { y: 780, xs: [230, 430, 630, 830, 1030, 1230] },
      { y: 910, xs: [230, 430, 630, 830, 1030, 1230] }
    ];
    deskRows.forEach((row, ri) => {
      row.xs.forEach((x, i) => {
        ctx.fillStyle = '#d8a86e';
        ctx.strokeStyle = '#8a5c37';
        ctx.lineWidth = 2;
        rr(ctx, x - 48, row.y - 18, 96, 38, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#b9824f';
        ctx.fillRect(x - 42, row.y + 16, 7, 28);
        ctx.fillRect(x + 35, row.y + 16, 7, 28);
        // chair
        ctx.fillStyle = '#a97548';
        rr(ctx, x - 26, row.y + 45, 52, 9, 3);
        ctx.fill();
        ctx.fillRect(x - 20, row.y + 52, 5, 25);
        ctx.fillRect(x + 15, row.y + 52, 5, 25);
        if (ri === 0 && (i === 1 || i === 4)) {
          // students' little bags
          ctx.fillStyle = i === 1 ? '#d95b5d' : '#4b9b8c';
          rr(ctx, x + 54, row.y + 25, 27, 22, 4);
          ctx.fill();
        }
      });
    });

    // door
    ctx.fillStyle = '#bb8a5b';
    ctx.strokeStyle = '#83582f';
    ctx.lineWidth = 4;
    rr(ctx, 1470, 520, 90, 250, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d5a574';
    rr(ctx, 1478, 530, 74, 232, 2);
    ctx.fill();
    ctx.fillStyle = '#8a5c37';
    ctx.beginPath();
    ctx.arc(1538, 655, 4, 0, Math.PI * 2);
    ctx.fill();

    // light beams
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const beam = ctx.createLinearGradient(1000, 80, 700, 700);
    beam.addColorStop(0, 'rgba(255, 235, 167, .18)');
    beam.addColorStop(1, 'rgba(255, 235, 167, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(980, 80);
    ctx.lineTo(1250, 80);
    ctx.lineTo(790, 700);
    ctx.lineTo(520, 700);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // small sign
    ctx.fillStyle = '#f7e7bd';
    ctx.strokeStyle = '#c58a4a';
    ctx.lineWidth = 2;
    rr(ctx, 1390, 140, 85, 50, 3);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'NO\nRUNNING', 1432, 166, 9, '#6d4329', 'center');
  }

  /* ---------------- music room ---------------- */
  function musicRoom(ctx, w, h, season) {
    const wall = ctx.createLinearGradient(0, 0, 0, 540);
    wall.addColorStop(0, season === 'winter' ? '#e9e3d5' : '#eee0c5');
    wall.addColorStop(1, season === 'winter' ? '#d8cdbd' : '#ddc8a5');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, 560);
    woodFloor(ctx, w, 540, h - 540, '#b9804f', '#8f5b38');

    // windows
    windowView(ctx, 900, 70, 580, 320, season || 'autumn');

    // blackboard with staff
    ctx.fillStyle = '#315849';
    ctx.strokeStyle = '#8a6138';
    ctx.lineWidth = 12;
    rr(ctx, 70, 90, 680, 260, 9);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(232, 247, 225, .56)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(120, 180 + i * 22);
      ctx.lineTo(680, 180 + i * 22);
      ctx.stroke();
    }
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = 'rgba(232, 247, 225, .8)';
      ctx.beginPath();
      ctx.ellipse(150 + i * 78, 226 - (i % 3) * 22, 7, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(156 + i * 78, 170 - (i % 3) * 22, 3, 56);
    }
    label(ctx, 'SWING!', 570, 130, 30, 'rgba(232,247,225,.78)', 'center');

    // instrument lockers
    ctx.fillStyle = '#6f5138';
    ctx.strokeStyle = '#4c3524';
    ctx.lineWidth = 3;
    rr(ctx, 60, 430, 260, 240, 8);
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#8a6648';
      rr(ctx, 74, 444 + i * 72, 232, 60, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d4b27c';
      ctx.beginPath();
      ctx.arc(280, 474 + i * 72, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    label(ctx, 'BRASS', 190, 625, 12, 'rgba(255,240,210,.5)', 'center');

    // piano
    ctx.fillStyle = '#2b2430';
    ctx.strokeStyle = '#141019';
    ctx.lineWidth = 4;
    rr(ctx, 930, 560, 330, 160, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f8f2e5';
    rr(ctx, 955, 620, 280, 54, 4);
    ctx.fill();
    ctx.fillStyle = '#1b171e';
    for (let i = 0; i < 18; i++) {
      if (i % 7 === 2 || i % 7 === 6) continue;
      ctx.fillRect(968 + i * 14.8, 620, 8, 32);
    }
    ctx.fillStyle = '#3a3040';
    rr(ctx, 992, 665, 220, 25, 3);
    ctx.fill();

    // drum kit
    ctx.strokeStyle = '#3d3439';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(470, 680);
    ctx.lineTo(440, 810);
    ctx.moveTo(540, 680);
    ctx.lineTo(570, 810);
    ctx.stroke();
    ctx.fillStyle = '#d9d2c4';
    ctx.strokeStyle = '#5d4f46';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(505, 690, 60, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b64746';
    ctx.beginPath();
    ctx.ellipse(505, 690, 46, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e1b74f';
    ctx.beginPath();
    ctx.ellipse(600, 650, 27, 8, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#c9963b';
    ctx.beginPath();
    ctx.ellipse(420, 630, 23, 7, 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // music stands
    [[720, 760], [830, 690], [1080, 760]].forEach(([x, y], i) => {
      ctx.strokeStyle = '#4a4a52';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 110);
      ctx.moveTo(x - 28, y + 110);
      ctx.lineTo(x + 28, y + 110);
      ctx.stroke();
      ctx.fillStyle = '#3c3c47';
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(i === 1 ? 0.08 : -0.05);
      ctx.fillRect(-32, -28, 64, 37);
      ctx.restore();
      ctx.fillStyle = '#f7eed9';
      ctx.save();
      ctx.translate(x, y - 2);
      ctx.rotate(i === 1 ? 0.08 : -0.05);
      ctx.fillRect(-26, -23, 52, 24);
      ctx.restore();
    });

    // record player on a small table
    ctx.fillStyle = '#8b623e';
    rr(ctx, 1180, 580, 160, 80, 6);
    ctx.fill();
    ctx.fillStyle = '#3a2b22';
    rr(ctx, 1200, 550, 120, 40, 5);
    ctx.fill();
    ctx.fillStyle = '#17141a';
    ctx.beginPath();
    ctx.arc(1245, 570, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e15b5d';
    ctx.beginPath();
    ctx.arc(1245, 570, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // posters
    ctx.fillStyle = '#f6e6b9';
    ctx.strokeStyle = '#b67d47';
    ctx.lineWidth = 3;
    rr(ctx, 1380, 455, 150, 90, 5);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'JAZZ', 1455, 492, 22, '#a94545', 'center');
    label(ctx, 'NIGHT', 1455, 518, 10, '#4a5c70', 'center');

    // scattered chairs
    ctx.fillStyle = '#9c6b44';
    [[340, 760], [1150, 690], [1290, 790]].forEach(([x, y]) => {
      rr(ctx, x, y, 44, 12, 3);
      ctx.fill();
      ctx.fillRect(x + 4, y + 10, 5, 36);
      ctx.fillRect(x + 34, y + 10, 5, 36);
    });
  }

  /* ---------------- station ---------------- */
  function station(ctx, w, h, season) {
    const winter = season === 'winter';
    sky(ctx, w, h, winter ? '#8aa4b8' : '#7bc6df', winter ? '#c4d6df' : '#c8eee7', winter ? '#eef3f1' : '#f7e7b5');
    const sunX = w * 0.78, sunY = 150;
    ctx.fillStyle = winter ? 'rgba(255,248,235,.38)' : 'rgba(255,241,169,.55)';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 66, 0, Math.PI * 2);
    ctx.fill();
    hills(ctx, w, 360, winter ? '#b6c9d0' : '#7da96c', 38, 58, 30);
    hills(ctx, w, 430, winter ? '#d6e1e3' : '#5e8b52', 26, 44, 160);
    cloud(ctx, w * 0.16, 115, 1.0, '#fffaf0', 0.7);
    cloud(ctx, w * 0.52, 78, 0.7, '#fffaf0', 0.55);

    // snow/ground behind platform
    ctx.fillStyle = winter ? '#e9eff0' : '#81a35e';
    ctx.fillRect(0, 450, w, 170);

    // tracks
    ctx.fillStyle = winter ? '#9aa4a8' : '#8f7f6c';
    ctx.fillRect(0, 440, w, 100);
    ctx.strokeStyle = '#4c4b4d';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 480);
    ctx.lineTo(w, 480);
    ctx.moveTo(0, 520);
    ctx.lineTo(w, 520);
    ctx.stroke();
    ctx.strokeStyle = '#6c5e4d';
    ctx.lineWidth = 10;
    for (let x = 0; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 468);
      ctx.lineTo(x + 18, 532);
      ctx.stroke();
    }

    // train
    const trainY = 230;
    ctx.fillStyle = winter ? '#8b9aa3' : '#e9e5d8';
    ctx.strokeStyle = '#4e5962';
    ctx.lineWidth = 4;
    rr(ctx, 80, trainY, w - 160, 230, 28);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = winter ? '#6f858e' : '#4f8f86';
    ctx.fillRect(80, trainY + 145, w - 160, 38);
    ctx.fillStyle = winter ? '#c9d6da' : '#f7f3e7';
    ctx.fillRect(80, trainY + 185, w - 160, 20);
    // windows
    for (let i = 0; i < 9; i++) {
      const x = 130 + i * 170;
      ctx.fillStyle = winter ? '#2e4654' : '#9bd8e4';
      ctx.strokeStyle = '#4e5962';
      ctx.lineWidth = 3;
      rr(ctx, x, trainY + 50, 122, 68, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.24)';
      ctx.fillRect(x + 12, trainY + 58, 38, 12);
    }
    // doors
    [850, 1260].forEach((x) => {
      ctx.fillStyle = winter ? '#7f939c' : '#d3cebd';
      ctx.strokeStyle = '#4e5962';
      ctx.lineWidth = 3;
      rr(ctx, x, trainY + 35, 90, 165, 7);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 45, trainY + 45);
      ctx.lineTo(x + 45, trainY + 190);
      ctx.stroke();
      ctx.fillStyle = winter ? '#b4c4ca' : '#f7f3e7';
      rr(ctx, x + 16, trainY + 58, 58, 28, 3);
      ctx.fill();
    });
    // headlights
    ctx.fillStyle = '#fff1b7';
    ctx.beginPath();
    ctx.arc(w - 130, trainY + 180, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = winter ? '#d6e0e2' : '#f7f3e7';
    ctx.fillRect(w - 190, trainY + 10, 70, 20);
    // wheels
    ctx.fillStyle = '#33383e';
    [280, 520, 760, 1000, 1240, 1480].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, trainY + 228, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#777d82';
      ctx.beginPath();
      ctx.arc(x, trainY + 228, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#33383e';
    });

    // platform
    ctx.fillStyle = winter ? '#dbe2e1' : '#c8b48c';
    ctx.fillRect(0, 545, w, h - 545);
    if (!winter) {
      ctx.fillStyle = '#e2d1a9';
      ctx.fillRect(0, 545, w, 18);
      ctx.strokeStyle = 'rgba(110, 82, 48, .22)';
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 563);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#f4f8f7';
      ctx.fillRect(0, 545, w, 22);
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = 'rgba(255,255,255,.8)';
        ctx.beginPath();
        ctx.ellipse((i * 173 + 40) % w, 600 + (i % 4) * 70, 58, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // yellow safety line
    ctx.fillStyle = '#e8b64b';
    ctx.fillRect(0, 552, w, 9);
    // roof
    ctx.fillStyle = winter ? '#5c6870' : '#6e5946';
    ctx.fillRect(0, 0, w, 24);
    ctx.fillStyle = 'rgba(92, 67, 48, .16)';
    ctx.fillRect(0, 24, w, 70);
    // roof support poles
    ctx.fillStyle = '#5f4f40';
    [120, 620, 1120, 1620].forEach((x) => {
      ctx.fillRect(x, 70, 14, 480);
      ctx.fillStyle = '#77604b';
      ctx.fillRect(x + 2, 70, 4, 480);
      ctx.fillStyle = '#5f4f40';
    });

    // station sign
    ctx.fillStyle = '#f5efe0';
    ctx.strokeStyle = '#4e5962';
    ctx.lineWidth = 4;
    rr(ctx, 690, 70, 390, 90, 9);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'YAMAGATA', 885, 102, 28, '#33475d', 'center');
    label(ctx, 'MOVIE LIFE LINE', 885, 134, 11, '#7e6a54', 'center');

    // bench
    ctx.fillStyle = '#7b5b3c';
    rr(ctx, 300, 650, 220, 22, 4);
    ctx.fill();
    ctx.fillRect(320, 672, 12, 55);
    ctx.fillRect(488, 672, 12, 55);
    ctx.fillStyle = '#9c7750';
    rr(ctx, 300, 605, 220, 35, 4);
    ctx.fill();

    // vending machine
    ctx.fillStyle = '#c9524f';
    ctx.strokeStyle = '#7f2f31';
    ctx.lineWidth = 3;
    rr(ctx, 1450, 590, 110, 190, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f3ead8';
    rr(ctx, 1466, 610, 78, 100, 4);
    ctx.fill();
    ctx.fillStyle = '#3b5f78';
    for (let i = 0; i < 4; i++) ctx.fillRect(1472 + (i % 2) * 38, 620 + Math.floor(i / 2) * 36, 26, 22);
    ctx.fillStyle = '#2b2b2b';
    rr(ctx, 1470, 726, 72, 35, 3);
    ctx.fill();

    // winter extras
    if (winter) {
      ctx.fillStyle = 'rgba(255,255,255,.82)';
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.ellipse(80 + i * 230, 560, 80, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // snowman
      ctx.fillStyle = '#f7fbfa';
      ctx.strokeStyle = '#b7c8cd';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(1700, 800, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(1700, 732, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(1692, 728, 2.6, 0, Math.PI * 2);
      ctx.arc(1708, 728, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d98235';
      ctx.beginPath();
      ctx.moveTo(1700, 735);
      ctx.lineTo(1716, 740);
      ctx.lineTo(1700, 743);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#6b4a32';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(1668, 724);
      ctx.lineTo(1732, 716);
      ctx.stroke();
    }
  }

  /* ---------------- train interior ---------------- */
  function train(ctx, w, h, season) {
    const winter = season === 'winter';
    // ceiling
    ctx.fillStyle = winter ? '#d6d1c8' : '#e8dfcc';
    ctx.fillRect(0, 0, w, 110);
    ctx.fillStyle = '#b9ab94';
    ctx.fillRect(0, 96, w, 18);
    // wall
    ctx.fillStyle = winter ? '#e4ded3' : '#f0e7d4';
    ctx.fillRect(0, 110, w, 250);
    // floor
    ctx.fillStyle = winter ? '#6c7477' : '#7b6b55';
    ctx.fillRect(0, 560, w, h - 560);
    ctx.strokeStyle = 'rgba(255,255,255,.06)';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 560);
      ctx.lineTo(x - 50, h);
      ctx.stroke();
    }
    // windows
    for (let i = 0; i < 4; i++) {
      const x = 130 + i * 350;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 145, 260, 150);
      ctx.clip();
      const g = ctx.createLinearGradient(0, 145, 0, 295);
      if (winter) {
        g.addColorStop(0, '#93aab7');
        g.addColorStop(1, '#e8eef0');
      } else {
        g.addColorStop(0, '#8fd4e4');
        g.addColorStop(1, '#f4e6ad');
      }
      ctx.fillStyle = g;
      ctx.fillRect(x, 145, 260, 150);
      // distant hills
      ctx.fillStyle = winter ? '#c5d7dd' : '#7ba86b';
      ctx.beginPath();
      ctx.moveTo(x, 270);
      for (let k = 0; k <= 260; k += 20) {
        ctx.lineTo(x + k, 240 - Math.sin(k * 0.05 + i) * 16);
      }
      ctx.lineTo(x + 260, 295);
      ctx.lineTo(x, 295);
      ctx.closePath();
      ctx.fill();
      if (!winter) {
        ctx.fillStyle = '#5b8f52';
        ctx.fillRect(x, 278, 260, 17);
      } else {
        ctx.fillStyle = '#f7fbfa';
        ctx.fillRect(x, 273, 260, 22);
      }
      // window reflection
      ctx.fillStyle = 'rgba(255,255,255,.22)';
      ctx.beginPath();
      ctx.moveTo(x + 32, 145);
      ctx.lineTo(x + 94, 145);
      ctx.lineTo(x + 30, 295);
      ctx.lineTo(x - 12, 295);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = '#6d6252';
      ctx.lineWidth = 7;
      ctx.strokeRect(x, 145, 260, 150);
      ctx.beginPath();
      ctx.moveTo(x + 130, 145);
      ctx.lineTo(x + 130, 295);
      ctx.stroke();
    }
    // luggage racks
    ctx.fillStyle = '#8e806b';
    ctx.fillRect(0, 112, w, 8);
    ctx.strokeStyle = '#6e6250';
    ctx.lineWidth = 4;
    for (let x = 100; x < w; x += 190) {
      ctx.beginPath();
      ctx.moveTo(x, 120);
      ctx.lineTo(x + 70, 155);
      ctx.lineTo(x + 150, 120);
      ctx.stroke();
    }
    // seats left/right
    const seatY = 380;
    for (let i = 0; i < 4; i++) {
      const x = 90 + i * 370;
      // left row
      ctx.fillStyle = winter ? '#45616b' : '#496f74';
      ctx.strokeStyle = '#2f4147';
      ctx.lineWidth = 4;
      rr(ctx, x, seatY, 230, 95, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = winter ? '#d7e0df' : '#efe6d0';
      rr(ctx, x + 18, seatY - 12, 194, 52, 13);
      ctx.fill();
      ctx.strokeStyle = '#2f4147';
      ctx.stroke();
      // right row
      ctx.fillStyle = winter ? '#45616b' : '#496f74';
      rr(ctx, x + 70, h - 180, 230, 95, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = winter ? '#d7e0df' : '#efe6d0';
      rr(ctx, x + 88, h - 192, 194, 52, 13);
      ctx.fill();
      ctx.stroke();
    }
    // aisle carpet
    ctx.fillStyle = winter ? 'rgba(50, 70, 78, .38)' : 'rgba(93, 64, 40, .22)';
    ctx.fillRect(0, 500, w, 90);
    // overhead lights
    ctx.fillStyle = 'rgba(255, 244, 205, .7)';
    for (let x = 220; x < w; x += 360) {
      rr(ctx, x, 118, 120, 9, 4);
      ctx.fill();
    }
    // door at each end
    [0, w - 70].forEach((x, i) => {
      ctx.fillStyle = winter ? '#8a989d' : '#c5b79f';
      rr(ctx, x, 300, 70, 270, 6);
      ctx.fill();
      ctx.strokeStyle = '#5e574c';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = '#3f4b55';
      ctx.fillRect(x + 56, 420, 6, 32);
      ctx.fillStyle = '#f4ead4';
      ctx.fillRect(x + 8 + (i ? 0 : 4), 330, 48, 26);
    });
    // hanging strap handles
    ctx.strokeStyle = '#6b5d4d';
    ctx.lineWidth = 4;
    for (let x = 180; x < w; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 150);
      ctx.lineTo(x, 196);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, 204, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    // small "thank you for riding" sign
    ctx.fillStyle = '#f7edd8';
    ctx.strokeStyle = '#8b7b62';
    ctx.lineWidth = 2;
    rr(ctx, 590, 335, 220, 36, 4);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'NEXT STOP: HOME', 700, 354, 12, '#7d6b51', 'center');
  }

  /* ---------------- rice fields ---------------- */
  function ricefield(ctx, w, h) {
    sky(ctx, w, h, '#6fc8e5', '#b8e9e2', '#f8e5ad');
    // sun
    ctx.fillStyle = 'rgba(255, 241, 171, .7)';
    ctx.beginPath();
    ctx.arc(1750, 120, 92, 0, Math.PI * 2);
    ctx.fill();
    cloud(ctx, 300, 145, 1.25, '#fffaf0', 0.82);
    cloud(ctx, 1250, 90, 0.7, '#fffaf0', 0.6);
    // mountains
    hills(ctx, w, 430, '#729c70', 75, 70, 80);
    hills(ctx, w, 500, '#5d875b', 45, 55, 270);
    // tree line
    for (let i = 0; i < 18; i++) {
      tree(ctx, 80 + i * 130, 490, 0.6, 'summer');
    }
    // fields
    ctx.fillStyle = '#7aa35f';
    ctx.fillRect(0, 500, w, h - 500);
    ctx.fillStyle = '#8cb268';
    ctx.fillRect(0, 530, w, h - 530);
    // paddies
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        const x = 50 + col * 280;
        const y = 560 + row * 170;
        ctx.fillStyle = row % 2 ? '#a8c37b' : '#9bbb6f';
        ctx.strokeStyle = '#6e9154';
        ctx.lineWidth = 3;
        rr(ctx, x, y, 250, 140, 10);
        ctx.fill();
        ctx.stroke();
        // water glints
        ctx.strokeStyle = 'rgba(232, 250, 220, .5)';
        ctx.lineWidth = 2;
        for (let k = 0; k < 4; k++) {
          ctx.beginPath();
          ctx.moveTo(x + 16 + k * 54, y + 26);
          ctx.lineTo(x + 40 + k * 54, y + 26);
          ctx.stroke();
        }
        // rice rows
        ctx.strokeStyle = 'rgba(74, 110, 55, .5)';
        ctx.lineWidth = 2;
        for (let k = 0; k < 6; k++) {
          ctx.beginPath();
          ctx.moveTo(x + 16 + k * 38, y + 50);
          ctx.lineTo(x + 16 + k * 38, y + 124);
          ctx.stroke();
        }
      }
    }
    // path
    ctx.fillStyle = '#d8bd86';
    ctx.strokeStyle = '#b68f58';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, 760);
    ctx.bezierCurveTo(400, 705, 900, 835, 1400, 760);
    ctx.bezierCurveTo(1700, 720, 1980, 760, w + 20, 720);
    ctx.lineTo(w + 20, 815);
    ctx.bezierCurveTo(1980, 855, 1700, 815, 1400, 855);
    ctx.bezierCurveTo(900, 930, 400, 800, -20, 855);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // muddy patch
    ctx.fillStyle = '#8e6b45';
    ctx.beginPath();
    ctx.ellipse(1010, 825, 120, 45, 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6f5032';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.beginPath();
    ctx.ellipse(980, 812, 44, 9, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // grass tufts
    for (let i = 0; i < 40; i++) {
      grass(ctx, (i * 97 + 30) % w, 690 + (i % 4) * 95, 0.8, '#5f874b');
    }
    // power poles
    ctx.strokeStyle = '#5d554b';
    ctx.lineWidth = 7;
    for (let i = 0; i < 5; i++) {
      const x = 170 + i * 470;
      ctx.beginPath();
      ctx.moveTo(x, 520);
      ctx.lineTo(x, 300);
      ctx.moveTo(x - 38, 340);
      ctx.lineTo(x + 38, 340);
      ctx.stroke();
      ctx.strokeStyle = '#71665a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 30, 340);
      ctx.quadraticCurveTo(x - 200, 390, x - 470, 340);
      ctx.stroke();
      ctx.strokeStyle = '#5d554b';
      ctx.lineWidth = 7;
    }
    // baseball field far right
    ctx.fillStyle = '#7ea95e';
    ctx.beginPath();
    ctx.ellipse(2060, 690, 240, 150, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f6edcf';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(2060, 690, 170, Math.PI, Math.PI * 1.85);
    ctx.stroke();
    ctx.strokeStyle = '#9c7b4b';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(1980 + i * 24, 560);
      ctx.lineTo(1980 + i * 24, 600);
      ctx.stroke();
    }
    ctx.fillStyle = '#f7f1df';
    ctx.fillRect(2020, 525, 90, 40);
    label(ctx, 'BASEBALL', 2065, 545, 9, '#3e5d73', 'center');
    // distant house
    ctx.fillStyle = '#f0dfc0';
    ctx.strokeStyle = '#95734e';
    ctx.lineWidth = 3;
    ctx.fillRect(300, 400, 170, 110);
    ctx.strokeRect(300, 400, 170, 110);
    ctx.fillStyle = '#b95b45';
    ctx.beginPath();
    ctx.moveTo(280, 400);
    ctx.lineTo(385, 330);
    ctx.lineTo(490, 400);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#7b8a92';
    ctx.fillRect(340, 430, 40, 36);
    ctx.fillRect(410, 430, 40, 36);
    // birds
    ctx.strokeStyle = 'rgba(50, 60, 70, .5)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const x = 1500 + i * 70;
      const y = 210 + (i % 2) * 25;
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.quadraticCurveTo(x - 4, y - 8, x, y);
      ctx.quadraticCurveTo(x + 4, y - 8, x + 12, y);
      ctx.stroke();
    }
  }

  /* ---------------- town ---------------- */
  function town(ctx, w, h) {
    sky(ctx, w, h, '#9ccbd6', '#e3dcb8', '#f5d6a1');
    cloud(ctx, 250, 110, 0.8, '#fffaf0', 0.65);
    cloud(ctx, 900, 82, 0.6, '#fffaf0', 0.55);
    hills(ctx, w, 360, '#9a9b72', 44, 54, 30);
    // road
    ctx.fillStyle = '#b7a58a';
    ctx.fillRect(0, 520, w, h - 520);
    ctx.fillStyle = '#d8cbb1';
    ctx.fillRect(0, 520, w, 60);
    ctx.fillStyle = '#6a6d72';
    ctx.fillRect(0, 700, w, 210);
    // road markings
    ctx.fillStyle = '#f3ead6';
    for (let x = 30; x < w; x += 150) {
      ctx.fillRect(x, 795, 80, 12);
    }
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 720);
    ctx.lineTo(w, 720);
    ctx.stroke();
    // sidewalk edge
    ctx.fillStyle = '#a39580';
    ctx.fillRect(0, 910, w, 20);
    // buildings
    // music shop
    ctx.fillStyle = '#c47a5a';
    ctx.strokeStyle = '#824633';
    ctx.lineWidth = 4;
    rr(ctx, 120, 250, 410, 310, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1ddbb';
    ctx.fillRect(145, 285, 360, 74);
    label(ctx, 'MUSIC', 325, 324, 48, '#7b3d30', 'center');
    // shop window
    ctx.fillStyle = '#2e4d56';
    ctx.strokeStyle = '#7b3d30';
    ctx.lineWidth = 4;
    rr(ctx, 160, 390, 200, 140, 6);
    ctx.fill();
    ctx.stroke();
    // sax silhouette in window
    ctx.strokeStyle = '#f7c75d';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(260, 415);
    ctx.bezierCurveTo(255, 460, 280, 470, 300, 490);
    ctx.stroke();
    ctx.fillStyle = '#f7c75d';
    ctx.beginPath();
    ctx.ellipse(303, 492, 18, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // shop door
    ctx.fillStyle = '#6b4130';
    rr(ctx, 400, 405, 95, 155, 5);
    ctx.fill();
    ctx.fillStyle = '#f0c96d';
    ctx.beginPath();
    ctx.arc(478, 485, 4, 0, Math.PI * 2);
    ctx.fill();
    // awning
    ctx.fillStyle = '#e7b34d';
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(110 + i * 54, 245, 40, 28);
    }
    // supermarket
    ctx.fillStyle = '#e8d7b5';
    ctx.strokeStyle = '#9e815c';
    ctx.lineWidth = 4;
    rr(ctx, 840, 300, 610, 260, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4f8f86';
    ctx.fillRect(865, 325, 560, 62);
    label(ctx, 'SUPERMARKET', 1145, 358, 34, '#f7f1df', 'center');
    // entrance
    ctx.fillStyle = '#5f7c83';
    rr(ctx, 960, 415, 230, 145, 7);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    for (let i = 0; i < 3; i++) ctx.fillRect(1000 + i * 64, 430, 8, 120);
    // live stage in plaza
    ctx.fillStyle = '#7b5a41';
    ctx.strokeStyle = '#4f3a2b';
    ctx.lineWidth = 4;
    rr(ctx, 1260, 500, 260, 60, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d95b5d';
    rr(ctx, 1180, 405, 420, 55, 5);
    ctx.fill();
    label(ctx, 'LIVE STAGE', 1390, 433, 25, '#fff5de', 'center');
    // Ozawa house
    ctx.fillStyle = '#d8c7a7';
    ctx.strokeStyle = '#8f7453';
    ctx.lineWidth = 4;
    rr(ctx, 1790, 350, 320, 210, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#a45143';
    ctx.beginPath();
    ctx.moveTo(1760, 355);
    ctx.lineTo(1950, 245);
    ctx.lineTo(2140, 355);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#6d4a37';
    rr(ctx, 1900, 420, 85, 140, 4);
    ctx.fill();
    ctx.fillStyle = '#f3d77c';
    ctx.fillRect(1815, 405, 55, 50);
    ctx.strokeStyle = '#8f7453';
    ctx.lineWidth = 2;
    ctx.strokeRect(1815, 405, 55, 50);
    ctx.beginPath();
    ctx.moveTo(1842, 405);
    ctx.lineTo(1842, 455);
    ctx.stroke();
    // fence
    ctx.strokeStyle = '#99744e';
    ctx.lineWidth = 5;
    for (let x = 1760; x <= 2150; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 600);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(1760, 620);
    ctx.lineTo(2150, 620);
    ctx.stroke();
    // bus stop / camp van stop
    ctx.fillStyle = '#f0e5ce';
    ctx.strokeStyle = '#7d6b58';
    ctx.lineWidth = 3;
    rr(ctx, 2170, 620, 150, 80, 5);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'CAMP BUS', 2245, 660, 16, '#5f4b3d', 'center');
    // trees
    tree(ctx, 650, 670, 0.9, 'autumn');
    tree(ctx, 1650, 640, 0.8, 'autumn');
    tree(ctx, 2220, 760, 0.7, 'autumn');
    // lamp posts
    for (let i = 0; i < 5; i++) {
      const x = 100 + i * 500;
      ctx.strokeStyle = '#4f5056';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x, 640);
      ctx.lineTo(x, 420);
      ctx.lineTo(x + 45, 420);
      ctx.stroke();
      ctx.fillStyle = '#f8df8e';
      ctx.beginPath();
      ctx.ellipse(x + 50, 425, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // fallen leaves
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = i % 2 ? '#c9763b' : '#d9a13c';
      ctx.beginPath();
      ctx.ellipse((i * 131 + 70) % w, 690 + (i % 5) * 70, 8, 3, i * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------------- mountain camp ---------------- */
  function camp(ctx, w, h) {
    sky(ctx, w, h, '#8bc7d8', '#cde4cf', '#f1d9a0');
    cloud(ctx, 260, 130, 0.9, '#fffaf0', 0.7);
    hills(ctx, w, 400, '#7a8e69', 70, 60, 20);
    hills(ctx, w, 470, '#5e7357', 42, 45, 180);
    // forest
    for (let i = 0; i < 16; i++) {
      tree(ctx, 50 + i * 120, 520, 0.72, 'autumn');
    }
    // clearing
    ctx.fillStyle = '#8fa05e';
    ctx.fillRect(0, 500, w, h - 500);
    ctx.fillStyle = '#9eae68';
    ctx.beginPath();
    ctx.ellipse(w * 0.52, 760, 620, 250, 0, 0, Math.PI * 2);
    ctx.fill();
    // path
    ctx.fillStyle = '#d3b77f';
    ctx.beginPath();
    ctx.moveTo(0, 930);
    ctx.bezierCurveTo(350, 850, 700, 920, 900, 820);
    ctx.bezierCurveTo(1100, 720, 1400, 820, w, 760);
    ctx.lineTo(w, 850);
    ctx.bezierCurveTo(1400, 900, 1100, 810, 900, 900);
    ctx.bezierCurveTo(700, 990, 350, 930, 0, 1010);
    ctx.closePath();
    ctx.fill();
    // wooden lodge
    ctx.fillStyle = '#9b6f48';
    ctx.strokeStyle = '#5f4129';
    ctx.lineWidth = 4;
    rr(ctx, 90, 470, 310, 200, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b5483e';
    ctx.beginPath();
    ctx.moveTo(60, 475);
    ctx.lineTo(245, 350);
    ctx.lineTo(430, 475);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f2d889';
    ctx.fillRect(140, 520, 70, 58);
    ctx.fillRect(290, 520, 70, 58);
    ctx.fillStyle = '#5d402b';
    rr(ctx, 215, 560, 60, 110, 3);
    ctx.fill();
    // van
    ctx.fillStyle = '#e7ddc5';
    ctx.strokeStyle = '#5e5548';
    ctx.lineWidth = 4;
    rr(ctx, 1410, 590, 270, 135, 20);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#6d8a91';
    rr(ctx, 1450, 615, 100, 58, 8);
    ctx.fill();
    rr(ctx, 1590, 615, 62, 58, 8);
    ctx.fill();
    ctx.fillStyle = '#33383e';
    ctx.beginPath();
    ctx.arc(1465, 732, 23, 0, Math.PI * 2);
    ctx.arc(1635, 732, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b7bdc0';
    ctx.beginPath();
    ctx.arc(1465, 732, 8, 0, Math.PI * 2);
    ctx.arc(1635, 732, 8, 0, Math.PI * 2);
    ctx.fill();
    label(ctx, 'SWING', 1560, 665, 24, '#9c4e3d', 'center');
    // music stands in clearing
    [[560, 690], [780, 640], [1040, 700], [1220, 650]].forEach(([x, y]) => {
      ctx.strokeStyle = '#3e4148';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 90);
      ctx.moveTo(x - 24, y + 90);
      ctx.lineTo(x + 24, y + 90);
      ctx.stroke();
      ctx.fillStyle = '#3e4148';
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(x % 2 ? 0.08 : -0.08);
      ctx.fillRect(-30, -26, 60, 34);
      ctx.restore();
      ctx.fillStyle = '#f7eed9';
      ctx.save();
      ctx.translate(x, y - 2);
      ctx.rotate(x % 2 ? 0.08 : -0.08);
      ctx.fillRect(-24, -21, 48, 22);
      ctx.restore();
    });
    // lake
    ctx.fillStyle = '#6ba5b0';
    ctx.beginPath();
    ctx.ellipse(1410, 890, 280, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(240,250,240,.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(1410, 880 + i * 12, 150 - i * 18, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // leaves on ground
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = i % 2 ? '#d17a3d' : '#e1ac3c';
      ctx.beginPath();
      ctx.ellipse((i * 173 + 40) % w, 650 + (i % 4) * 100, 9, 3.5, i, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------------- winter schoolyard ---------------- */
  function schoolyard(ctx, w, h) {
    sky(ctx, w, h, '#91a8ba', '#c9d9e0', '#edf1ef');
    cloud(ctx, 300, 120, 1.0, '#fffdf7', 0.65);
    // school building
    ctx.fillStyle = '#d9d2c4';
    ctx.strokeStyle = '#8f877a';
    ctx.lineWidth = 4;
    rr(ctx, 110, 160, 980, 380, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#c2bbb0';
    ctx.fillRect(110, 160, 980, 34);
    // windows
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 6; col++) {
        ctx.fillStyle = '#8faab7';
        ctx.strokeStyle = '#7b7468';
        ctx.lineWidth = 3;
        rr(ctx, 160 + col * 145, 230 + row * 120, 105, 75, 4);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(212 + col * 145, 230 + row * 120);
        ctx.lineTo(212 + col * 145, 305 + row * 120);
        ctx.stroke();
      }
    }
    // school sign
    ctx.fillStyle = '#f1eadc';
    ctx.strokeStyle = '#77705f';
    ctx.lineWidth = 3;
    rr(ctx, 480, 185, 250, 42, 4);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'YAMAGATA HIGH', 605, 207, 17, '#4d5d6e', 'center');
    // snow ground
    ctx.fillStyle = '#eef3f1';
    ctx.fillRect(0, 540, w, h - 540);
    ctx.fillStyle = '#dbe5e5';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.ellipse((i * 197 + 30) % w, 600 + (i % 4) * 90, 90, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // school gate
    ctx.strokeStyle = '#5a5e64';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(60, 540);
    ctx.lineTo(60, 780);
    ctx.moveTo(300, 540);
    ctx.lineTo(300, 780);
    ctx.stroke();
    ctx.strokeStyle = '#7b7f83';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(40, 545);
    ctx.lineTo(320, 545);
    ctx.stroke();
    // trees
    tree(ctx, 1400, 640, 0.9, 'winter');
    tree(ctx, 1600, 600, 0.7, 'winter');
    // mailbox
    ctx.fillStyle = '#c1433f';
    ctx.strokeStyle = '#7b2928';
    ctx.lineWidth = 4;
    rr(ctx, 1060, 650, 100, 125, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8d2f2d';
    ctx.fillRect(1070, 625, 80, 32);
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(1100, 700, 30, 10);
    ctx.fillStyle = '#e7d8a8';
    rr(ctx, 1070, 685, 52, 8, 2);
    ctx.fill();
    ctx.fillStyle = '#6e4f38';
    ctx.fillRect(1105, 775, 10, 60);
    // bus / station sign
    ctx.fillStyle = '#f1e8d4';
    ctx.strokeStyle = '#6e6b61';
    ctx.lineWidth = 3;
    rr(ctx, 1550, 650, 170, 105, 6);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'STATION', 1635, 686, 18, '#4e5f70', 'center');
    label(ctx, '→', 1635, 720, 24, '#b95d45', 'center');
    // snowman
    ctx.fillStyle = '#fbfdfc';
    ctx.strokeStyle = '#bdcbd0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(760, 800, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(760, 720, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2f3033';
    ctx.beginPath();
    ctx.arc(750, 715, 3, 0, Math.PI * 2);
    ctx.arc(770, 715, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d98235';
    ctx.beginPath();
    ctx.moveTo(760, 724);
    ctx.lineTo(780, 730);
    ctx.lineTo(760, 734);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6b4a32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(720, 708);
    ctx.lineTo(800, 698);
    ctx.stroke();
  }

  /* ---------------- concert hall ---------------- */
  function hall(ctx, w, h) {
    // back wall
    ctx.fillStyle = '#241c25';
    ctx.fillRect(0, 0, w, h);
    // stage back panels
    const g = ctx.createLinearGradient(0, 0, 0, 700);
    g.addColorStop(0, '#3d2030');
    g.addColorStop(1, '#170f18');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, 720);
    // curtains
    const curtain = ctx.createLinearGradient(0, 0, 0, 700);
    curtain.addColorStop(0, '#8e2735');
    curtain.addColorStop(1, '#4e121f');
    ctx.fillStyle = curtain;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(250, 0);
    ctx.quadraticCurveTo(200, 360, 270, 730);
    ctx.lineTo(0, 730);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w - 250, 0);
    ctx.quadraticCurveTo(w - 200, 360, w - 270, 730);
    ctx.lineTo(w, 730);
    ctx.closePath();
    ctx.fill();
    // curtain folds
    ctx.strokeStyle = 'rgba(255,180,150,.15)';
    ctx.lineWidth = 5;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(20 + i * 30, 0);
      ctx.quadraticCurveTo(40 + i * 26, 350, 30 + i * 32, 720);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w - 20 - i * 30, 0);
      ctx.quadraticCurveTo(w - 40 - i * 26, 350, w - 30 - i * 32, 720);
      ctx.stroke();
    }
    // banner
    ctx.fillStyle = '#f0e4c8';
    ctx.strokeStyle = '#b58a4e';
    ctx.lineWidth = 4;
    rr(ctx, w * 0.5 - 260, 60, 520, 100, 6);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'WINTER MUSIC FESTIVAL', w * 0.5, 100, 25, '#6e3b38', 'center');
    // stage floor
    const floor = ctx.createLinearGradient(0, 700, 0, h);
    floor.addColorStop(0, '#5c4030');
    floor.addColorStop(1, '#2b1d18');
    ctx.fillStyle = floor;
    ctx.fillRect(0, 700, w, h - 700);
    ctx.strokeStyle = 'rgba(255,220,170,.14)';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, 700);
      ctx.lineTo(x - 80, h);
      ctx.stroke();
    }
    // stage lip
    ctx.fillStyle = '#3a2520';
    ctx.fillRect(0, 700, w, 18);
    ctx.fillStyle = '#d8b563';
    ctx.fillRect(0, 718, w, 4);
    // spotlights
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    [[w * 0.3, '#ffe7a3'], [w * 0.5, '#ffd0c0'], [w * 0.7, '#b8e4ff']].forEach(([x, color], i) => {
      const beam = ctx.createLinearGradient(x, 0, w * 0.5 + (i - 1) * 200, 750);
      beam.addColorStop(0, color + '55');
      beam.addColorStop(1, color + '00');
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(x - 40, 0);
      ctx.lineTo(x + 40, 0);
      ctx.lineTo(w * 0.5 + (i - 1) * 160 + 230, 760);
      ctx.lineTo(w * 0.5 + (i - 1) * 160 - 230, 760);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
    // piano on stage
    ctx.fillStyle = '#151116';
    ctx.strokeStyle = '#856a3d';
    ctx.lineWidth = 3;
    rr(ctx, 200, 600, 260, 100, 18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f6eedf';
    ctx.fillRect(235, 630, 190, 18);
    // drum kit
    ctx.fillStyle = '#ddd4c7';
    ctx.strokeStyle = '#5b4b43';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(1260, 620, 58, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#9f3436';
    ctx.beginPath();
    ctx.ellipse(1260, 620, 44, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    // music stands
    [[520, 640], [720, 650], [900, 640], [1100, 650]].forEach(([x, y]) => {
      ctx.strokeStyle = '#1b171d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 80);
      ctx.stroke();
      ctx.fillStyle = '#1b171d';
      ctx.fillRect(x - 28, y - 25, 56, 32);
      ctx.fillStyle = '#f2eadb';
      ctx.fillRect(x - 22, y - 20, 44, 20);
    });
    // audience silhouettes
    ctx.fillStyle = 'rgba(10, 8, 12, .88)';
    for (let i = 0; i < 16; i++) {
      const x = 40 + i * 100;
      const y = 900 + (i % 3) * 35;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x, y + 55, 40, 45, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // warm glow
    const glow = ctx.createRadialGradient(w * 0.5, 500, 80, w * 0.5, 500, 600);
    glow.addColorStop(0, 'rgba(255, 206, 110, .13)');
    glow.addColorStop(1, 'rgba(255, 206, 110, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  const builders = {
    classroom: (ctx, w, h) => classroom(ctx, w, h),
    musicroom: (ctx, w, h, season) => musicRoom(ctx, w, h, season),
    station: (ctx, w, h, season) => station(ctx, w, h, season),
    train: (ctx, w, h, season) => train(ctx, w, h, season),
    ricefield: (ctx, w, h) => ricefield(ctx, w, h),
    town: (ctx, w, h) => town(ctx, w, h),
    camp: (ctx, w, h) => camp(ctx, w, h),
    schoolyard: (ctx, w, h) => schoolyard(ctx, w, h),
    hall: (ctx, w, h) => hall(ctx, w, h)
  };

  function build(id, season, w, h) {
    const key = id + '|' + (season || '') + '|' + w + 'x' + h;
    if (cache.has(key)) return cache.get(key);
    const canvas = make(w, h);
    const ctx = canvas.getContext('2d');
    const builder = builders[id];
    if (builder) builder(ctx, w, h, season);
    else {
      ctx.fillStyle = '#7da36a';
      ctx.fillRect(0, 0, w, h);
    }
    cache.set(key, canvas);
    return canvas;
  }

  window.Backgrounds = { build };
})();
