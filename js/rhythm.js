/* ============================================================
   Movie Life — RhythmGame
   A small four-lane rhythm performance scene.
   ============================================================ */
(function () {
  'use strict';

  const LANE_COLORS = [
    { main: '#e15b5d', soft: 'rgba(225,91,93,.18)', light: '#ffb3b0' },
    { main: '#e8a33d', soft: 'rgba(232,163,61,.18)', light: '#ffe0a3' },
    { main: '#4b9b8c', soft: 'rgba(75,155,140,.18)', light: '#b7eadf' },
    { main: '#5b78c6', soft: 'rgba(91,120,198,.18)', light: '#c4d3ff' }
  ];
  const KEYS = ['D', 'F', 'J', 'K'];
  const KEY_TO_LANE = { d: 0, f: 1, j: 2, k: 3 };
  const ARROW_TO_LANE = { ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3 };
  const NUM_TO_LANE = { '1': 0, '2': 1, '3': 2, '4': 3 };

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
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

  const PATTERNS = {
    0: [
      [0, 2], [1, 3], [0, 1], [2, 3], [0, 2], [1, 2], [0, 3], [1, 3]
    ],
    1: [
      [0, 1, 2, 3], [0, 1, 2], [0, 2, 3], [0, 1, 3],
      [0, 1, 2, 3], [0, 0.5, 2, 3], [0, 2, 2.5, 3], [0, 1, 2, 2.5]
    ],
    2: [
      [0, 0.5, 1, 2, 2.5, 3], [0, 1, 1.5, 2, 3, 3.5],
      [0, 0.5, 1, 1.5, 2, 3], [0, 1, 2, 2.5, 3, 3.5],
      [0, 0.5, 1, 2, 2.5, 3], [0, 1, 1.5, 2, 3, 3.5]
    ]
  };

  class RhythmGame {
    constructor(game, opts) {
      this.game = game;
      this.opts = opts || {};
      this.title = this.opts.title || 'SUNSET LINE';
      this.bpm = this.opts.bpm || 132;
      this.bars = this.opts.bars || 8;
      this.difficulty = this.opts.difficulty == null ? 1 : this.opts.difficulty;
      this.pass = this.opts.pass == null ? 0.55 : this.opts.pass;
      this.mood = this.opts.mood || 'stage';
      this.seed = hashString(this.opts.id || this.title);
      this.finished = false;
      this.phase = 'idle';
      this.reset();
    }

    reset() {
      this.song = this.game.audio.startSong({
        bpm: this.bpm,
        bars: this.bars,
        mood: this.mood
      });
      this.startAt = this.song.startAt;
      this.duration = this.song.duration;
      this.beatDur = this.song.beatDur;
      this.notes = this.buildChart();
      this.perfect = 0;
      this.good = 0;
      this.ok = 0;
      this.miss = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.score = 0;
      this.feedback = '';
      this.feedbackTime = -10;
      this.feedbackColor = '#fff';
      this.phase = 'countdown';
      this.finished = false;
      this.lastLane = -1;
    }

    buildChart() {
      const rng = mulberry32(this.seed + this.difficulty * 97);
      const patterns = PATTERNS[this.difficulty] || PATTERNS[1];
      const notes = [];
      let lastLane = -1;
      for (let bar = 0; bar < this.bars; bar++) {
        const pattern = patterns[(bar + this.difficulty) % patterns.length];
        for (let i = 0; i < pattern.length; i++) {
          const offset = pattern[i];
          let lane = Math.floor(rng() * 4);
          if (lane === lastLane && i > 0) lane = (lane + 1 + Math.floor(rng() * 2)) % 4;
          lastLane = lane;
          notes.push({
            time: (bar * 4 + offset) * this.beatDur,
            lane,
            judged: false,
            hit: false,
            grade: ''
          });
        }
      }
      notes.sort((a, b) => a.time - b.time || a.lane - b.lane);
      return notes;
    }

    keyToLane(key) {
      const k = key.length === 1 ? key.toLowerCase() : key;
      if (KEY_TO_LANE[k] != null) return KEY_TO_LANE[k];
      if (ARROW_TO_LANE[k] != null) return ARROW_TO_LANE[k];
      if (NUM_TO_LANE[k] != null) return NUM_TO_LANE[k];
      return -1;
    }

    time() {
      return this.game.audio.now() - this.startAt;
    }

    update() {
      if (this.phase === 'done') return;
      const t = this.time();
      if (t >= 0 && this.phase === 'countdown') this.phase = 'playing';

      for (const n of this.notes) {
        if (!n.judged && t > n.time + 0.18) {
          n.judged = true;
          n.hit = false;
          n.grade = 'miss';
          this.miss++;
          this.combo = 0;
          this.showFeedback('MISS', '#ff8b8e', t);
          if (this.miss === 1) this.game.audio.playSfx('miss');
        }
      }

      if (t > this.duration + 0.55 && !this.finished) {
        this.finish();
      }
    }

    hit(lane) {
      if (this.phase !== 'playing' || this.finished) return;
      const t = this.time();
      if (t < -0.1) return;
      let best = null;
      let bestDiff = 999;
      for (const n of this.notes) {
        if (n.judged || n.lane !== lane) continue;
        const d = Math.abs(n.time - t);
        if (d < bestDiff) {
          bestDiff = d;
          best = n;
        }
      }
      if (!best || bestDiff > 0.19) {
        // Empty taps are harmless, but a tiny click keeps the keys responsive.
        this.game.audio.playSfx('click');
        return;
      }
      best.judged = true;
      best.hit = true;
      let points = 0.55;
      let label = 'OK';
      let color = '#ffe0a3';
      if (bestDiff <= 0.075) {
        this.perfect++;
        points = 1;
        label = 'PERFECT';
        color = '#fff0b0';
      } else if (bestDiff <= 0.14) {
        this.good++;
        points = 0.8;
        label = 'GOOD';
        color = '#b7eadf';
      } else {
        this.ok++;
        points = 0.55;
        label = 'OK';
        color = '#c4d3ff';
      }
      best.grade = label.toLowerCase();
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.score += points * (1 + Math.min(1.5, this.combo * 0.02));
      this.showFeedback(label, color, t);
      this.game.audio.playHit(lane, this.combo);
    }

    showFeedback(text, color, t) {
      this.feedback = text;
      this.feedbackColor = color;
      this.feedbackTime = t;
    }

    accuracy() {
      const total = this.notes.length || 1;
      const points = this.perfect + this.good * 0.8 + this.ok * 0.55;
      return Math.max(0, Math.min(1, points / total));
    }

    passed() {
      return this.accuracy() >= this.pass;
    }

    finish() {
      if (this.finished) return;
      this.finished = true;
      this.phase = 'done';
      this.game.onRhythmEnd(this);
    }

    draw(ctx, w, h) {
      const t = this.time();
      const laneAreaW = Math.min(590, w * 0.92);
      const laneW = laneAreaW / 4;
      const left = (w - laneAreaW) / 2;
      const top = Math.max(74, h * 0.09);
      const bottom = h - Math.max(52, h * 0.08);
      const hitY = bottom - 54;
      const leadTime = 1.55;
      const speed = (hitY - top) / leadTime;

      // dark veil
      const veil = ctx.createLinearGradient(0, 0, 0, h);
      veil.addColorStop(0, 'rgba(11, 15, 23, .78)');
      veil.addColorStop(0.5, 'rgba(11, 15, 23, .64)');
      veil.addColorStop(1, 'rgba(11, 15, 23, .85)');
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, w, h);

      // lanes
      for (let i = 0; i < 4; i++) {
        const x = left + i * laneW;
        const lc = LANE_COLORS[i];
        const g = ctx.createLinearGradient(0, top, 0, bottom);
        g.addColorStop(0, 'rgba(255,255,255,.015)');
        g.addColorStop(0.75, lc.soft);
        g.addColorStop(1, lc.soft);
        ctx.fillStyle = g;
        rr(ctx, x + 3, top, laneW - 6, bottom - top, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,247,231,.10)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // lane center line
        ctx.strokeStyle = 'rgba(255,247,231,.045)';
        ctx.beginPath();
        ctx.moveTo(x + laneW / 2, top);
        ctx.lineTo(x + laneW / 2, bottom);
        ctx.stroke();
      }

      // progress bar
      const prog = Math.max(0, Math.min(1, t / this.duration));
      ctx.fillStyle = 'rgba(255,247,231,.12)';
      rr(ctx, left, top - 21, laneAreaW, 4, 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(243,184,75,.8)';
      rr(ctx, left, top - 21, laneAreaW * prog, 4, 2);
      ctx.fill();

      // hit line
      const pulse = 0.86 + Math.sin(t * 8) * 0.08;
      ctx.save();
      ctx.shadowColor = 'rgba(243,184,75,.72)';
      ctx.shadowBlur = 18;
      const hg = ctx.createLinearGradient(left, hitY, left + laneAreaW, hitY);
      hg.addColorStop(0, 'rgba(225,91,93,.55)');
      hg.addColorStop(0.5, 'rgba(243,184,75,.95)');
      hg.addColorStop(1, 'rgba(91,120,198,.55)');
      ctx.fillStyle = hg;
      rr(ctx, left, hitY - 2, laneAreaW, 4.5, 2);
      ctx.fill();
      ctx.restore();
      // hit pads
      for (let i = 0; i < 4; i++) {
        const x = left + i * laneW + laneW / 2;
        const lc = LANE_COLORS[i];
        ctx.fillStyle = lc.soft;
        rr(ctx, x - laneW * 0.34, hitY + 9, laneW * 0.68, 44, 12);
        ctx.fill();
        ctx.strokeStyle = lc.main + 'aa';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,247,231,.86)';
        ctx.font = '900 18px "Trebuchet MS", "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(KEYS[i], x, hitY + 32);
      }

      // notes
      for (const n of this.notes) {
        if (n.judged) continue;
        const diff = n.time - t;
        if (diff > leadTime + 0.4 || diff < -0.3) continue;
        const x = left + n.lane * laneW + laneW / 2;
        const y = hitY - diff * speed;
        const lc = LANE_COLORS[n.lane];
        const scale = Math.min(1.12, Math.max(0.7, 1 - diff * 0.07));
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.shadowColor = lc.main;
        ctx.shadowBlur = 14;
        ctx.fillStyle = lc.light;
        ctx.strokeStyle = lc.main;
        ctx.lineWidth = 3;
        rr(ctx, -22, -13, 44, 26, 13);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(40,38,45,.68)';
        ctx.font = '900 15px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♪', 0, 1);
        ctx.restore();
      }

      // header
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,247,231,.62)';
      ctx.font = '900 10px "Trebuchet MS", "Segoe UI", sans-serif';
      ctx.fillText('LIVE PERFORMANCE', w / 2, top - 36);
      ctx.fillStyle = 'rgba(255,247,231,.94)';
      ctx.font = '700 24px Georgia, "Times New Roman", serif';
      ctx.fillText(this.title, w / 2, top - 58);

      // combo + feedback
      if (this.combo > 1) {
        ctx.fillStyle = 'rgba(255,247,231,.86)';
        ctx.font = '900 30px "Trebuchet MS", "Segoe UI", sans-serif';
        ctx.fillText(String(this.combo), w / 2, hitY - 118);
        ctx.fillStyle = 'rgba(255,247,231,.36)';
        ctx.font = '900 9px "Trebuchet MS", "Segoe UI", sans-serif';
        ctx.fillText('COMBO', w / 2, hitY - 94);
      }
      if (this.feedback && t - this.feedbackTime < 0.62) {
        const a = 1 - Math.max(0, (t - this.feedbackTime) / 0.62);
        ctx.globalAlpha = a;
        ctx.fillStyle = this.feedbackColor;
        ctx.font = '900 19px "Trebuchet MS", "Segoe UI", sans-serif';
        ctx.fillText(this.feedback, w / 2, hitY - 152);
        ctx.globalAlpha = 1;
      }

      // countdown
      if (t < 0.25) {
        let text = 'READY';
        if (t > -3.2) {
          const count = Math.ceil(-t / this.beatDur);
          if (count <= 0) text = 'GO!';
          else if (count <= 3) text = String(count);
          else text = 'READY';
        }
        const fade = Math.abs(t) < 0.2 ? 1 - Math.abs(t) / 0.2 : 1;
        ctx.globalAlpha = Math.max(0, fade);
        ctx.fillStyle = 'rgba(255,247,231,.94)';
        ctx.font = '800 62px Georgia, "Times New Roman", serif';
        ctx.fillText(text, w / 2, h * 0.44);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(255,247,231,.46)';
        ctx.font = '900 11px "Trebuchet MS", "Segoe UI", sans-serif';
        ctx.fillText('D  F  J  K   ·   TAP THE LANES', w / 2, h * 0.52);
      }

      // score
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,247,231,.48)';
      ctx.font = '900 9px "Trebuchet MS", "Segoe UI", sans-serif';
      ctx.fillText('SCORE', 22, 28);
      ctx.fillStyle = 'rgba(255,247,231,.88)';
      ctx.font = '700 20px Georgia, "Times New Roman", serif';
      ctx.fillText(String(Math.round(this.score * 100)), 22, 52);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,247,231,.48)';
      ctx.font = '900 9px "Trebuchet MS", "Segoe UI", sans-serif';
      ctx.fillText('ACCURACY', w - 22, 28);
      ctx.fillStyle = 'rgba(255,247,231,.88)';
      ctx.font = '700 20px Georgia, "Times New Roman", serif';
      ctx.fillText(Math.round(this.accuracy() * 100) + '%', w - 22, 52);
    }
  }

  window.RhythmGame = RhythmGame;
})();
