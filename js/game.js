/* ============================================================
   Movie Life — Game
   State, movement, dialogue, scenes, rhythm scenes, ending.
   ============================================================ */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dist = (a, b, c, d) => Math.hypot(a - c, b - d);

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

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.audio = new AudioEngine();
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.touchMode = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;

      this.mode = 'title';
      this.started = false;
      this.busy = false;
      this.time = 0;
      this.lastTime = performance.now();
      this.keys = new Set();
      this.touchMove = { x: 0, y: 0 };
      this.joystickActive = false;
      this.joystickId = null;

      this.sceneId = null;
      this.scene = null;
      this.background = null;
      this.world = { w: 1600, h: 1000 };
      this.season = 'summer';
      this.step = '';
      this.chapter = 1;
      this.flags = {};
      this.entities = [];
      this.zones = [];
      this.player = {
        x: 800, y: 800, dir: 'down', moving: false, phase: 0, hasSax: false
      };
      this.camera = { x: 0, y: 0 };
      this.view = { w: 1280, h: 720, zoom: 1 };
      this.clickTarget = null;
      this.pendingInteract = null;
      this.nearest = null;
      this.dialogue = null;
      this.rhythm = null;
      this.rhythmResolve = null;
      this.fx = { shake: 0, flash: 0 };
      this.weather = [];
      this.weatherType = '';
      this.confetti = [];
      this.stats = { perfect: 0, good: 0, ok: 0, miss: 0, minigames: 0, maxCombo: 0, totalNotes: 0 };
      this._toastTimer = null;
      this._hello = false;

      this.dom = {
        hud: document.getElementById('hud'),
        chapterLabel: document.getElementById('chapterLabel'),
        objectiveText: document.getElementById('objectiveText'),
        objectivePill: document.getElementById('objectivePill'),
        topActions: document.getElementById('topActions'),
        muteBtn: document.getElementById('muteBtn'),
        helpBtn: document.getElementById('helpBtn'),
        dialogue: document.getElementById('dialogue'),
        speakerName: document.getElementById('speakerName'),
        dialogueText: document.getElementById('dialogueText'),
        dialogueHint: document.getElementById('dialogueHint'),
        portrait: document.getElementById('portrait'),
        touchControls: document.getElementById('touchControls'),
        joystick: document.getElementById('joystick'),
        stick: document.getElementById('stick'),
        actionBtn: document.getElementById('actionBtn'),
        chapterCard: document.getElementById('chapterCard'),
        chapterPart: document.getElementById('chapterPart'),
        chapterTitle: document.getElementById('chapterTitle'),
        chapterSubtitle: document.getElementById('chapterSubtitle'),
        resultModal: document.getElementById('resultModal'),
        resultKicker: document.getElementById('resultKicker'),
        resultTitle: document.getElementById('resultTitle'),
        resultCopy: document.getElementById('resultCopy'),
        resultAccuracy: document.getElementById('resultAccuracy'),
        resultCombo: document.getElementById('resultCombo'),
        resultPerfect: document.getElementById('resultPerfect'),
        retryBtn: document.getElementById('retryBtn'),
        continueBtn: document.getElementById('continueBtn'),
        skipBtn: document.getElementById('skipBtn'),
        helpModal: document.getElementById('helpModal'),
        helpCloseBtn: document.getElementById('helpCloseBtn'),
        ending: document.getElementById('ending'),
        endingTitle: document.getElementById('endingTitle'),
        endingCopy: document.getElementById('endingCopy'),
        endingStats: document.getElementById('endingStats'),
        playAgainBtn: document.getElementById('playAgainBtn'),
        fade: document.getElementById('fade'),
        toast: document.getElementById('toast'),
        a11y: document.getElementById('a11y')
      };

      this._bindEvents();
      this.resize();
      this.initWeather('summer');
      this.showTouch(false);
    }

    /* ---------------- setup / input ---------------- */
    _bindEvents() {
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('keydown', (e) => this.handleKey(e));
      window.addEventListener('keyup', (e) => this.handleKeyUp(e));
      window.addEventListener('blur', () => {
        this.keys.clear();
        this.touchMove = { x: 0, y: 0 };
        this.joystickActive = false;
        this.dom.stick.style.transform = 'translate(0, 0)';
      });

      this.canvas.addEventListener('pointerdown', (e) => this.handleCanvasPointer(e));
      this.dom.dialogue.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.advanceDialogue();
      });
      this.dom.actionBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.mode === 'dialogue') this.advanceDialogue();
        else if (this.mode === 'play') this.interact();
      });
      this.dom.muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMute();
      });
      this.dom.helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openHelp();
      });
      this.dom.helpCloseBtn.addEventListener('click', () => this.closeHelp());
      this.dom.retryBtn.addEventListener('click', () => this.retryRhythm());
      this.dom.continueBtn.addEventListener('click', () => this.continueRhythm(false));
      this.dom.skipBtn.addEventListener('click', () => this.continueRhythm(true));
      this.dom.playAgainBtn.addEventListener('click', () => window.location.reload());

      this._bindJoystick();
    }

    _bindJoystick() {
      const base = document.getElementById('joystickBase');
      const updateStick = (dx, dy) => {
        this.dom.stick.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const start = (e) => {
        if (this.mode !== 'play') return;
        e.preventDefault();
        this.joystickActive = true;
        this.joystickId = e.pointerId;
        try { this.dom.joystick.setPointerCapture?.(e.pointerId); } catch (err) { /* synthetic pointers */ }
        move(e);
      };
      const move = (e) => {
        if (!this.joystickActive || e.pointerId !== this.joystickId) return;
        const rect = this.dom.joystick.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = e.clientX - cx;
        let dy = e.clientY - cy;
        const max = rect.width * 0.34;
        const len = Math.hypot(dx, dy);
        if (len > max) {
          dx = dx / len * max;
          dy = dy / len * max;
        }
        updateStick(dx, dy);
        this.touchMove.x = dx / max;
        this.touchMove.y = dy / max;
        if (Math.hypot(this.touchMove.x, this.touchMove.y) < 0.08) this.touchMove = { x: 0, y: 0 };
      };
      const end = (e) => {
        if (e.pointerId !== this.joystickId) return;
        this.joystickActive = false;
        this.joystickId = null;
        this.touchMove = { x: 0, y: 0 };
        updateStick(0, 0);
      };
      base.addEventListener('pointerdown', start);
      base.addEventListener('pointermove', move);
      base.addEventListener('pointerup', end);
      base.addEventListener('pointercancel', end);
      base.addEventListener('lostpointercapture', end);
    }

    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.dpr = dpr;
      this.cssW = w;
      this.cssH = h;
      this.zoom = clamp(Math.sqrt((w * h) / (1280 * 720)), 0.62, 1.32);
      this.view = { w: w / this.zoom, h: h / this.zoom, zoom: this.zoom };
      if (this.sceneId) this.cameraSnap();
    }

    handleKey(e) {
      const key = e.key;
      const low = String(key).toLowerCase();
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar'].includes(key)) {
        if (this.started) e.preventDefault();
      }

      if (!this.started) {
        if (!['Shift', 'Control', 'Alt', 'Meta'].includes(key)) {
          e.preventDefault();
          this.begin();
        }
        return;
      }

      if (this.mode === 'ending') return;

      if (this.mode === 'help') {
        if (low === 'h' || key === 'Escape') this.closeHelp();
        return;
      }

      if (this.mode === 'rhythm') {
        const lane = this.rhythm ? this.rhythm.keyToLane(key) : -1;
        if (lane >= 0) {
          e.preventDefault();
          this.rhythm.hit(lane);
        }
        return;
      }

      if (this.mode === 'result') return;

      if (this.mode === 'dialogue') {
        if (low === 'e' || low === 'enter' || low === ' ' || key === ' ' || key === 'Spacebar') {
          e.preventDefault();
          this.advanceDialogue();
        }
        return;
      }

      if (this.mode !== 'play') return;

      if (low === 'm') {
        this.toggleMute();
        return;
      }
      if (low === 'h' || key === '?') {
        this.openHelp();
        return;
      }
      if (low === 'e' || low === 'enter' || key === ' ' || key === 'Spacebar') {
        e.preventDefault();
        this.interact();
        return;
      }
      if (['arrowup', 'w'].includes(low)) this.keys.add('up');
      else if (['arrowdown', 's'].includes(low)) this.keys.add('down');
      else if (['arrowleft', 'a'].includes(low)) this.keys.add('left');
      else if (['arrowright', 'd'].includes(low)) this.keys.add('right');
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(low)) {
        this.clickTarget = null;
        this.pendingInteract = null;
      }
    }

    handleKeyUp(e) {
      const low = String(e.key).toLowerCase();
      if (['arrowup', 'w'].includes(low)) this.keys.delete('up');
      else if (['arrowdown', 's'].includes(low)) this.keys.delete('down');
      else if (['arrowleft', 'a'].includes(low)) this.keys.delete('left');
      else if (['arrowright', 'd'].includes(low)) this.keys.delete('right');
    }

    handleCanvasPointer(e) {
      if (!this.started) {
        this.begin();
        return;
      }
      if (this.mode === 'dialogue') {
        this.advanceDialogue();
        return;
      }
      if (this.mode === 'rhythm') {
        this.tapRhythmLane(e);
        return;
      }
      if (this.mode !== 'play' || this.busy) return;
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const wx = this.camera.x + sx / this.zoom;
      const wy = this.camera.y + sy / this.zoom;
      let clicked = null;
      let best = 75 / this.zoom;
      for (const ent of this.entities) {
        if (!ent.onInteract) continue;
        const d = Math.hypot(ent.x - wx, ent.y - wy);
        if (d < best) {
          best = d;
          clicked = ent;
        }
      }
      if (clicked) {
        this.pendingInteract = clicked;
        const dx = this.player.x - clicked.x;
        const dy = (this.player.y - 55) - clicked.y;
        const len = Math.hypot(dx, dy) || 1;
        this.clickTarget = {
          x: clicked.x + dx / len * Math.min(55, len),
          y: clicked.y + dy / len * Math.min(55, len)
        };
      } else {
        this.pendingInteract = null;
        this.clickTarget = { x: wx, y: wy };
      }
    }

    tapRhythmLane(e) {
      if (!this.rhythm || this.mode !== 'rhythm') return;
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const laneAreaW = Math.min(590, this.cssW * 0.92);
      const left = (this.cssW - laneAreaW) / 2;
      const lane = Math.floor((sx - left) / (laneAreaW / 4));
      if (lane >= 0 && lane < 4) this.rhythm.hit(lane);
    }

    /* ---------------- start / reset ---------------- */
    async begin() {
      if (this.started) return;
      this.started = true;
      this.mode = 'play';
      this.dom.hud.classList.remove('hidden');
      this.dom.topActions.classList.remove('hidden');
      this.showTouch(this.touchMode);
      this.canvas.focus?.();
      // Create the audio context inside the first user gesture, but do not
      // make the story wait for resume(): show the scene and the chapter card
      // immediately, then let the audio unlock finish in parallel.
      this.audio.init();
      const story = Story.begin(this);
      await this.audio.unlock();
      this.audio.setMuted(this.audio.muted);
      this.updateMuteButton();
      try {
        await story;
      } catch (err) {
        console.error(err);
      }
    }

    debugStart(sceneId, step, season) {
      this.started = true;
      this.mode = 'play';
      this.dom.hud.classList.remove('hidden');
      this.dom.topActions.classList.remove('hidden');
      this.showTouch(false);
      const id = sceneId || 'classroom';
      const chapterMatch = /^c([1-4])_/.exec(step || '');
      if (chapterMatch) this.setChapter(Number(chapterMatch[1]));
      this.loadScene(id, { season });
      if (step) this.setStep(step);
      else this.updateHUD();
      this.audio.muted = true;
      this.updateMuteButton();
    }

    /* ---------------- scene / entities ---------------- */
    loadScene(id, opts) {
      opts = opts || {};
      const def = Story.scenes[id];
      if (!def) return;
      this.sceneId = id;
      this.scene = def;
      this.world = def.world || this.world;
      this.season = opts.season || def.season || 'summer';
      this.background = Backgrounds.build(def.bg || id, this.season, this.world.w, this.world.h);
      this.player.x = (opts.spawn && opts.spawn.x) || def.spawn.x;
      this.player.y = (opts.spawn && opts.spawn.y) || def.spawn.y;
      this.player.dir = 'down';
      this.player.moving = false;
      if (opts.step) {
        this.step = opts.step;
        this.updateHUD();
      }
      this.entities = [];
      this.zones = [];
      if (def.setup) def.setup(this);
      this.clickTarget = null;
      this.pendingInteract = null;
      this.nearest = null;
      this.initWeather(def.effects || (this.season === 'winter' ? 'snow' : 'summer'));
      this.cameraSnap();
      this.mode = 'play';
      this.updateTouchUI();
      if (this.started && !this.audio.muted) {
        this.audio.startMusic(def.music || 'summer');
      }
    }

    refreshScene() {
      if (!this.scene) return;
      const x = this.player.x;
      const y = this.player.y;
      const dir = this.player.dir;
      this.entities = [];
      this.zones = [];
      if (this.scene.setup) this.scene.setup(this);
      this.player.x = x;
      this.player.y = y;
      this.player.dir = dir;
      this.clickTarget = null;
      this.pendingInteract = null;
      this.nearest = null;
    }

    addNPC(opts) {
      const ent = Object.assign({
        kind: 'npc',
        radius: 92,
        dir: 'down',
        expr: 'neutral',
        phase: Math.random() * 10,
        moving: false,
        important: false
      }, opts);
      this.entities.push(ent);
      return ent;
    }

    addProp(opts) {
      const ent = Object.assign({ kind: 'prop', radius: 90, important: false }, opts);
      this.entities.push(ent);
      return ent;
    }

    addZone(opts) {
      this.zones.push(Object.assign({ used: false, once: true }, opts));
    }

    setStep(step) {
      this.step = step;
      this.updateHUD();
      this.refreshScene();
      this.dom.objectivePill.classList.remove('pulse');
      void this.dom.objectivePill.offsetWidth;
      this.dom.objectivePill.classList.add('pulse');
      this.updateTouchUI();
    }

    setChapter(n) {
      this.chapter = n;
      this.dom.chapterLabel.textContent = Story.CHAPTER_LABELS[n] || '';
    }

    updateHUD() {
      const objective = Story.OBJECTIVES[this.step] || '';
      this.dom.objectiveText.textContent = objective;
      this.dom.chapterLabel.textContent = Story.CHAPTER_LABELS[this.chapter] || '';
      this.dom.a11y.textContent = objective ? 'Objective: ' + objective : '';
    }

    /* ---------------- movement / update ---------------- */
    update(dt) {
      this.time += dt;
      this.fx.shake = Math.max(0, this.fx.shake - dt * 2.2);
      this.fx.flash = Math.max(0, this.fx.flash - dt * 2.8);

      if (this.mode === 'dialogue') this.updateDialogue(dt);
      if (this.mode === 'rhythm' && this.rhythm) this.rhythm.update();
      if (this.mode === 'ending') this.updateConfetti(dt);

      this.updateWeather(dt);

      if (this.mode === 'play' && !this.busy) {
        this.updatePlayer(dt);
        this.checkZones();
        this.updateNearest();
      } else if (this.mode === 'dialogue' || this.mode === 'card') {
        this.player.moving = false;
      }

      this.updateCamera(dt);
      this.updateTouchUI();
    }

    updatePlayer(dt) {
      let vx = 0;
      let vy = 0;
      if (this.keys.has('left')) vx -= 1;
      if (this.keys.has('right')) vx += 1;
      if (this.keys.has('up')) vy -= 1;
      if (this.keys.has('down')) vy += 1;
      vx += this.touchMove.x;
      vy += this.touchMove.y;

      if (Math.abs(vx) < 0.08) vx = 0;
      if (Math.abs(vy) < 0.08) vy = 0;

      if (vx === 0 && vy === 0 && this.clickTarget) {
        const dx = this.clickTarget.x - this.player.x;
        const dy = this.clickTarget.y - this.player.y;
        const d = Math.hypot(dx, dy);
        if (d < 8) {
          this.clickTarget = null;
          if (this.pendingInteract) {
            const ent = this.pendingInteract;
            this.pendingInteract = null;
            if (dist(this.player.x, this.player.y, ent.x, ent.y) <= ent.radius + 8) this.runInteraction(ent);
          }
        } else {
          vx = dx / d;
          vy = dy / d;
        }
      } else if (vx || vy) {
        this.clickTarget = null;
      }

      const len = Math.hypot(vx, vy);
      if (len > 0) {
        vx /= len;
        vy /= len;
        const speed = 255;
        this.player.moving = true;
        this.player.phase += dt;
        if (Math.abs(vx) > Math.abs(vy)) this.player.dir = vx > 0 ? 'right' : 'left';
        else this.player.dir = vy > 0 ? 'down' : 'up';
        const nx = this.player.x + vx * speed * dt;
        const ny = this.player.y + vy * speed * dt;
        this.player.x = clamp(nx, 44, this.world.w - 44);
        this.player.y = clamp(ny, 90, this.world.h - 20);
      } else {
        this.player.moving = false;
        this.player.phase += dt * 0.3;
      }
    }

    updateNearest() {
      let best = null;
      let bestDist = Infinity;
      for (const ent of this.entities) {
        if (!ent.onInteract) continue;
        const d = dist(this.player.x, this.player.y, ent.x, ent.y);
        if (d <= (ent.radius || 90) && d < bestDist) {
          best = ent;
          bestDist = d;
        }
      }
      this.nearest = best;
    }

    checkZones() {
      for (const zone of this.zones) {
        if (zone.once && zone.used) continue;
        const x = this.player.x;
        const y = this.player.y;
        if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
          if (zone.when && !zone.when(this)) continue;
          zone.used = true;
          this.runZone(zone);
          break;
        }
      }
    }

    async runInteraction(ent) {
      if (this.busy || !ent || !ent.onInteract) return;
      this.busy = true;
      this.pendingInteract = null;
      const before = this.sceneId;
      try {
        await ent.onInteract(this);
      } catch (err) {
        console.error(err);
      } finally {
        this.busy = false;
        if (this.sceneId === before && this.mode !== 'ending') this.refreshScene();
        this.updateTouchUI();
      }
    }

    async runZone(zone) {
      if (this.busy || !zone.onEnter) return;
      this.busy = true;
      const before = this.sceneId;
      try {
        await zone.onEnter(this);
      } catch (err) {
        console.error(err);
      } finally {
        this.busy = false;
        if (this.sceneId === before && this.mode !== 'ending') this.refreshScene();
      }
    }

    interact() {
      if (this.mode !== 'play' || this.busy) return;
      if (this.nearest && this.nearest.onInteract) {
        this.runInteraction(this.nearest);
      }
    }

    updateCamera(dt) {
      if (!this.scene) return;
      const vw = this.cssW / this.zoom;
      const vh = this.cssH / this.zoom;
      let tx = this.player.x - vw / 2;
      let ty = this.player.y - vh / 2;
      tx = this.world.w > vw ? clamp(tx, 0, this.world.w - vw) : (this.world.w - vw) / 2;
      ty = this.world.h > vh ? clamp(ty, 0, this.world.h - vh) : (this.world.h - vh) / 2;
      const k = Math.min(1, dt * 7);
      this.camera.x += (tx - this.camera.x) * k;
      this.camera.y += (ty - this.camera.y) * k;
    }

    cameraSnap() {
      const vw = this.cssW / this.zoom;
      const vh = this.cssH / this.zoom;
      this.camera.x = this.world.w > vw ? clamp(this.player.x - vw / 2, 0, this.world.w - vw) : (this.world.w - vw) / 2;
      this.camera.y = this.world.h > vh ? clamp(this.player.y - vh / 2, 0, this.world.h - vh) : (this.world.h - vh) / 2;
    }

    /* ---------------- dialogue ---------------- */
    async say(lines) {
      if (!lines || !lines.length) return;
      return new Promise((resolve) => {
        this.mode = 'dialogue';
        this.showTouch(false);
        this.dialogue = {
          lines,
          index: 0,
          chars: 0,
          text: '',
          typed: 0,
          complete: false,
          resolve
        };
        this.dom.dialogue.classList.remove('hidden');
        this.dom.dialogue.classList.remove('narrator');
        this.showDialogueLine();
      });
    }

    showDialogueLine() {
      const d = this.dialogue;
      if (!d) return;
      const line = d.lines[d.index];
      d.text = line.text || '';
      d.typed = 0;
      d.complete = false;
      const isNarrator = !line.who;
      this.dom.dialogue.classList.toggle('narrator', isNarrator);
      this.dom.speakerName.textContent = isNarrator ? 'NARRATION' : (CharacterArt.CHARACTERS[line.who]?.name || line.who);
      this.dom.dialogueText.textContent = '';
      this.dom.dialogueHint.classList.remove('ready');
      if (!isNarrator) CharacterArt.drawPortrait(this.dom.portrait, line.who, line.expr || 'neutral');
      this.dom.a11y.textContent = (isNarrator ? 'Narration: ' : (CharacterArt.CHARACTERS[line.who]?.name || line.who) + ': ') + d.text;
      if (line.fx === 'shake') this.fx.shake = 0.8;
      if (line.fx === 'flash') this.fx.flash = 0.7;
    }

    updateDialogue(dt) {
      const d = this.dialogue;
      if (!d || d.complete) return;
      d.typed = Math.min(d.text.length, d.typed + dt * 52);
      const n = Math.floor(d.typed);
      if (n !== d.chars) {
        d.chars = n;
        this.dom.dialogueText.textContent = d.text.slice(0, n);
      }
      if (d.typed >= d.text.length) {
        d.complete = true;
        this.dom.dialogueText.textContent = d.text;
        this.dom.dialogueHint.classList.add('ready');
      }
    }

    advanceDialogue() {
      const d = this.dialogue;
      if (!d) return;
      if (!d.complete) {
        d.typed = d.text.length;
        d.complete = true;
        d.chars = d.text.length;
        this.dom.dialogueText.textContent = d.text;
        this.dom.dialogueHint.classList.add('ready');
        return;
      }
      this.audio.playSfx('talk');
      d.index++;
      if (d.index >= d.lines.length) {
        this.dom.dialogue.classList.add('hidden');
        this.dom.dialogue.classList.remove('narrator');
        this.dialogue = null;
        this.mode = this.mode === 'ending' ? 'ending' : 'play';
        this.showTouch(this.touchMode && this.mode === 'play');
        d.resolve();
      } else {
        this.showDialogueLine();
      }
    }

    /* ---------------- rhythm ---------------- */
    startRhythm(opts) {
      this.mode = 'rhythm';
      this.showTouch(false);
      this.setHudVisible(false);
      this.dom.resultModal.classList.add('hidden');
      this.rhythm = new RhythmGame(this, opts);
      return new Promise((resolve) => {
        this.rhythmResolve = resolve;
      });
    }

    onRhythmEnd(rhythm) {
      this.mode = 'result';
      this.dom.resultKicker.textContent = rhythm.title;
      const passed = rhythm.passed();
      this.dom.resultTitle.textContent = passed ? 'Nice!' : 'Keep going';
      this.dom.resultCopy.textContent = passed
        ? 'The band is finding its groove.'
        : 'The notes got away from you. Try the performance again.';
      this.dom.resultAccuracy.textContent = Math.round(rhythm.accuracy() * 100) + '%';
      this.dom.resultCombo.textContent = String(rhythm.maxCombo);
      this.dom.resultPerfect.textContent = String(rhythm.perfect);
      this.dom.retryBtn.classList.remove('hidden');
      this.dom.continueBtn.classList.toggle('hidden', !passed);
      this.dom.skipBtn.classList.toggle('hidden', passed);
      this.dom.resultModal.classList.remove('hidden');
      this.audio.playSfx(passed ? 'success' : 'fail');
    }

    retryRhythm() {
      if (!this.rhythm) return;
      this.dom.resultModal.classList.add('hidden');
      this.mode = 'rhythm';
      this.showTouch(false);
      this.rhythm.reset();
    }

    continueRhythm(skipped) {
      if (!this.rhythm) return;
      const r = this.rhythm;
      this.dom.resultModal.classList.add('hidden');
      this.stats.perfect += r.perfect;
      this.stats.good += r.good;
      this.stats.ok += r.ok;
      this.stats.miss += r.miss;
      this.stats.minigames++;
      this.stats.maxCombo = Math.max(this.stats.maxCombo, r.maxCombo);
      this.stats.totalNotes += r.notes.length;
      const result = {
        passed: r.passed(),
        skipped: !!skipped,
        stats: {
          perfect: r.perfect,
          good: r.good,
          ok: r.ok,
          miss: r.miss,
          maxCombo: r.maxCombo,
          total: r.notes.length
        }
      };
      this.rhythm = null;
      this.mode = 'play';
      this.setHudVisible(true);
      this.showTouch(this.touchMode);
      if (this.scene) this.audio.startMusic(this.scene.music || 'summer');
      const resolve = this.rhythmResolve;
      this.rhythmResolve = null;
      if (resolve) resolve(result);
    }

    /* ---------------- ui helpers ---------------- */
    setHudVisible(visible) {
      this.dom.hud.classList.toggle('hidden', !visible);
      this.dom.topActions.classList.toggle('hidden', !visible);
    }

    showTouch(show) {
      if (show && this.touchMode) this.dom.touchControls.classList.remove('hidden');
      else this.dom.touchControls.classList.add('hidden');
    }

    updateTouchUI() {
      const canControl = this.mode === 'play' && !this.busy;
      this.dom.touchControls.classList.toggle('hidden', !(canControl && this.touchMode));
      this.dom.actionBtn.classList.toggle('near', !!(this.nearest && canControl));
    }

    async showChapterCard(part, title, subtitle) {
      const previousMode = this.mode;
      const hudWasVisible = !this.dom.hud.classList.contains('hidden');
      this.mode = 'card';
      this.showTouch(false);
      this.setHudVisible(false);
      this.dom.chapterPart.textContent = 'PART ' + part;
      this.dom.chapterTitle.textContent = title;
      this.dom.chapterSubtitle.textContent = subtitle || '';
      this.dom.chapterCard.classList.remove('hidden');
      this.audio.playSfx('chapter');
      await this.wait(2350);
      this.dom.chapterCard.classList.add('hidden');
      this.setHudVisible(hudWasVisible);
      if (this.mode === 'card') this.mode = previousMode;
      this.updateTouchUI();
    }

    toast(text) {
      if (!text) return;
      this.dom.toast.textContent = text;
      this.dom.toast.classList.remove('hidden');
      requestAnimationFrame(() => this.dom.toast.classList.add('show'));
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.dom.toast.classList.remove('show');
        setTimeout(() => this.dom.toast.classList.add('hidden'), 300);
      }, 2300);
    }

    async fadeOut(ms) {
      this.dom.fade.classList.add('on');
      await this.wait(ms || 450);
    }

    async fadeIn(ms) {
      this.dom.fade.classList.remove('on');
      await this.wait(ms || 450);
    }

    async transitionTo(sceneId, opts) {
      await this.fadeOut(430);
      this.loadScene(sceneId, opts);
      await this.wait(70);
      await this.fadeIn(430);
    }

    wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    toggleMute() {
      this.audio.init();
      this.audio.setMuted(!this.audio.muted);
      this.updateMuteButton();
    }

    updateMuteButton() {
      this.dom.muteBtn.classList.toggle('muted', this.audio.muted);
      this.dom.muteBtn.setAttribute('aria-label', this.audio.muted ? 'Unmute audio' : 'Mute audio');
      this.dom.muteBtn.title = this.audio.muted ? 'Unmute audio (M)' : 'Mute audio (M)';
    }

    openHelp() {
      if (this.mode === 'rhythm' || this.mode === 'result' || this.mode === 'ending') return;
      this._modeBeforeHelp = this.mode;
      this.mode = 'help';
      this.dom.helpModal.classList.remove('hidden');
      this.showTouch(false);
      this.dom.helpCloseBtn.focus?.();
    }

    closeHelp() {
      this.dom.helpModal.classList.add('hidden');
      this.mode = this._modeBeforeHelp || 'play';
      this.showTouch(this.mode === 'play' && this.touchMode);
      this.canvas.focus?.();
    }

    finishStory(result) {
      this.mode = 'ending';
      this.showTouch(false);
      this.dom.hud.classList.add('hidden');
      this.dom.topActions.classList.add('hidden');
      const total = this.stats.totalNotes || 1;
      const points = this.stats.perfect + this.stats.good * 0.8 + this.stats.ok * 0.55;
      const acc = Math.round((points / total) * 100);
      this.dom.endingCopy.textContent = result && result.passed
        ? 'The last note hangs in the air, then the whole hall is on its feet.'
        : 'The last note wobbles, but the hall is on its feet anyway. Some stories end better than they sound.';
      this.dom.endingStats.innerHTML = `
        <div class="ending-stat"><strong>${acc}%</strong><span>accuracy</span></div>
        <div class="ending-stat"><strong>${this.stats.perfect}</strong><span>perfect hits</span></div>
        <div class="ending-stat"><strong>${this.stats.maxCombo}</strong><span>best combo</span></div>
        <div class="ending-stat"><strong>${this.stats.minigames}</strong><span>performances</span></div>
      `;
      this.dom.ending.classList.remove('hidden');
      this.audio.startMusic('stage');
      this.audio.playSfx('success');
      this.makeConfetti();
    }

    makeConfetti() {
      this.confetti = [];
      const colors = ['#f3b84b', '#e15b5d', '#4b9b8c', '#5b78c6', '#fff7e7', '#e8a33d'];
      for (let i = 0; i < 140; i++) {
        this.confetti.push({
          x: Math.random() * this.cssW,
          y: -Math.random() * this.cssH * 0.8,
          vx: (Math.random() - 0.5) * 70,
          vy: 60 + Math.random() * 130,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 8,
          w: 5 + Math.random() * 7,
          h: 8 + Math.random() * 9,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    updateConfetti(dt) {
      for (const c of this.confetti) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.rot += c.spin * dt;
        if (c.y > this.cssH + 30) {
          c.y = -20;
          c.x = Math.random() * this.cssW;
        }
      }
    }

    /* ---------------- weather ---------------- */
    initWeather(type) {
      this.weatherType = type || 'summer';
      this.weather = [];
      const n = type === 'snow' ? 90 : type === 'autumn' ? 32 : type === 'stage' ? 34 : 24;
      for (let i = 0; i < n; i++) {
        this.weather.push(this.makeWeatherParticle(type, true));
      }
    }

    makeWeatherParticle(type, anywhere) {
      if (type === 'snow') {
        return {
          x: Math.random() * this.cssW,
          y: anywhere ? Math.random() * this.cssH : -10,
          vx: -10 + Math.random() * 20,
          vy: 25 + Math.random() * 40,
          size: 1.4 + Math.random() * 2.8,
          phase: Math.random() * 10
        };
      }
      if (type === 'autumn') {
        return {
          x: Math.random() * this.cssW,
          y: anywhere ? Math.random() * this.cssH : -20,
          vx: 6 + Math.random() * 22,
          vy: 18 + Math.random() * 26,
          size: 3 + Math.random() * 4,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 3,
          color: Math.random() > 0.5 ? '#d07a3c' : '#e0aa3d',
          phase: Math.random() * 10
        };
      }
      if (type === 'stage') {
        return {
          x: Math.random() * this.cssW,
          y: Math.random() * this.cssH,
          vx: (Math.random() - 0.5) * 8,
          vy: -4 - Math.random() * 10,
          size: 1 + Math.random() * 2,
          phase: Math.random() * 10
        };
      }
      return {
        x: Math.random() * this.cssW,
        y: anywhere ? Math.random() * this.cssH : Math.random() * this.cssH,
        vx: (Math.random() - 0.5) * 6,
        vy: -3 - Math.random() * 8,
        size: 1 + Math.random() * 1.6,
        phase: Math.random() * 10
      };
    }

    updateWeather(dt) {
      if (this.reduced && this.weatherType === 'snow') {
        // fewer flakes are enough
      }
      for (const p of this.weather) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.rot != null) p.rot += p.spin * dt;
        if (p.y > this.cssH + 30 || p.y < -40 || p.x > this.cssW + 40 || p.x < -40) {
          const np = this.makeWeatherParticle(this.weatherType, false);
          Object.assign(p, np);
          if (this.weatherType === 'snow' || this.weatherType === 'autumn') p.y = -20;
        }
      }
    }

    drawWeather(ctx) {
      const type = this.weatherType;
      if (!type) return;
      ctx.save();
      if (type === 'snow') {
        ctx.fillStyle = 'rgba(255,255,255,.72)';
        for (const p of this.weather) {
          ctx.beginPath();
          ctx.arc(p.x + Math.sin(this.time * 1.2 + p.phase) * 8, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'autumn') {
        for (const p of this.weather) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot + Math.sin(this.time + p.phase) * 0.3);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else if (type === 'stage') {
        ctx.fillStyle = 'rgba(255,238,180,.32)';
        for (const p of this.weather) {
          ctx.beginPath();
          ctx.arc(p.x, p.y + Math.sin(this.time + p.phase) * 5, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = 'rgba(255,245,180,.42)';
        for (const p of this.weather) {
          ctx.beginPath();
          ctx.arc(p.x, p.y + Math.sin(this.time * 0.8 + p.phase) * 10, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    /* ---------------- render ---------------- */
    render() {
      const ctx = this.ctx;
      const w = this.cssW;
      const h = this.cssH;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (this.mode === 'title') {
        this.drawTitle(ctx, w, h);
        return;
      }

      // world
      ctx.save();
      if (this.fx.shake > 0.01 && !this.reduced) {
        ctx.translate((Math.random() - 0.5) * this.fx.shake * 12, (Math.random() - 0.5) * this.fx.shake * 12);
      }
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.camera.x, -this.camera.y);
      if (this.background) ctx.drawImage(this.background, 0, 0);

      this.drawSceneEntities(ctx);
      ctx.restore();

      this.drawWeather(ctx);

      if (this.rhythm && (this.mode === 'rhythm' || this.mode === 'result')) {
        this.rhythm.draw(ctx, w, h);
      }

      this.drawObjectiveArrow(ctx, w, h);

      if (this.mode === 'ending') this.drawConfetti(ctx);

      if (this.fx.flash > 0.01) {
        ctx.fillStyle = `rgba(255,248,225,${this.fx.flash * 0.7})`;
        ctx.fillRect(0, 0, w, h);
      }
    }

    drawSceneEntities(ctx) {
      const list = [];
      for (const ent of this.entities) {
        if (ent.draw) list.push({ y: ent.y, ent, type: 'prop' });
        else if (ent.char) list.push({ y: ent.y, ent, type: 'npc' });
      }
      list.push({ y: this.player.y, type: 'player' });
      list.sort((a, b) => a.y - b.y);

      for (const item of list) {
        if (item.type === 'player') {
          const carrying = ['c1_get_bentos', 'c1_board_train', 'c1_eat_bento', 'c1_sleep', 'c1_run_field', 'c1_reach_field'].includes(this.step);
          CharacterArt.draw(ctx, 'tomoko', this.player.x, this.player.y, this.time, {
            dir: this.player.dir,
            moving: this.player.moving,
            expr: this.player.moving ? 'neutral' : 'neutral',
            instrument: this.player.hasSax ? 'sax' : carrying ? 'bento' : null,
            phase: this.player.phase,
            scale: 1.03
          });
        } else if (item.type === 'npc') {
          const e = item.ent;
          const important = typeof e.important === 'function' ? e.important(this) : e.important;
          CharacterArt.draw(ctx, e.char, e.x, e.y, this.time, {
            dir: e.dir || 'down',
            expr: e.expr || 'neutral',
            instrument: e.instrument,
            note: e.note,
            phase: e.phase,
            moving: false,
            scale: e.scale || 1
          });
          if (important) {
            const pulse = 0.5 + Math.sin(this.time * 3) * 0.12;
            ctx.save();
            ctx.strokeStyle = `rgba(243,184,75,${pulse})`;
            ctx.lineWidth = 3;
            ctx.setLineDash([4, 7]);
            ctx.beginPath();
            ctx.ellipse(e.x, e.y, 34, 15, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
            this.drawWorldBubble(ctx, e.x, e.y - 145, '!', '#ffd36a');
          }
        } else {
          item.ent.draw(ctx, item.ent.x, item.ent.y, this.time, this);
        }
      }

      // interaction prompt
      if (this.mode === 'play' && !this.busy && this.nearest) {
        const e = this.nearest;
        this.drawWorldBubble(ctx, e.x, e.y - 130, 'E', '#fff7e7');
      }
      if (this.clickTarget) {
        ctx.strokeStyle = 'rgba(255,247,231,.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(this.clickTarget.x, this.clickTarget.y, 12 + Math.sin(this.time * 6) * 2, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawWorldBubble(ctx, x, y, text, color) {
      const bob = Math.sin(this.time * 3.2) * 3;
      ctx.save();
      ctx.translate(x, y + bob);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#4a2b08';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4a2b08';
      ctx.font = '900 15px "Trebuchet MS", "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, 1);
      ctx.restore();
    }

    drawObjectiveArrow(ctx, w, h) {
      if (!this.scene || (this.mode !== 'play' && this.mode !== 'dialogue')) return;
      let target = null;
      for (const ent of this.entities) {
        const important = typeof ent.important === 'function' ? ent.important(this) : ent.important;
        if (important) { target = ent; break; }
      }
      if (!target) return;
      const sx = (target.x - this.camera.x) * this.zoom;
      const sy = (target.y - this.camera.y) * this.zoom;
      if (sx > 60 && sx < w - 60 && sy > 90 && sy < h - 90) return;
      const cx = w / 2;
      const cy = h / 2;
      const angle = Math.atan2(sy - cy, sx - cx);
      const margin = 70;
      const px = clamp(sx, margin, w - margin);
      const py = clamp(sy, 100, h - 150);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.fillStyle = 'rgba(243,184,75,.92)';
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-10, -11);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, 11);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    drawConfetti(ctx) {
      for (const c of this.confetti) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
    }

    /* ---------------- title screen ---------------- */
    drawTitle(ctx, w, h) {
      const t = this.time;
      const horizon = h * 0.62;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#38436e');
      skyGrad.addColorStop(0.3, '#8c6d8f');
      skyGrad.addColorStop(0.58, '#e1957e');
      skyGrad.addColorStop(0.82, '#f6c47f');
      skyGrad.addColorStop(1, '#f8dfaa');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // sun
      const sunX = w * 0.68;
      const sunY = horizon - h * 0.16;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, h * 0.16);
      sunGrad.addColorStop(0, 'rgba(255,248,199,.98)');
      sunGrad.addColorStop(0.3, 'rgba(255,216,135,.8)');
      sunGrad.addColorStop(1, 'rgba(255,184,113,0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, h * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,246,198,.96)';
      ctx.beginPath();
      ctx.arc(sunX, sunY, Math.min(w, h) * 0.055, 0, Math.PI * 2);
      ctx.fill();

      // clouds
      const cloudDrift = (t * 7) % (w + 500) - 250;
      this.drawCloud(ctx, cloudDrift, h * 0.16, 1.1, 'rgba(255,243,220,.32)');
      this.drawCloud(ctx, w * 0.25 + Math.sin(t * 0.05) * 30, h * 0.25, 0.7, 'rgba(255,243,220,.22)');

      // mountains
      this.drawMountainLayer(ctx, w, h, horizon, h * 0.12, '#5e4d68', 0);
      this.drawMountainLayer(ctx, w, h, horizon + h * 0.02, h * 0.08, '#4b3e59', 140);

      // rice fields
      const fieldGrad = ctx.createLinearGradient(0, horizon, 0, h);
      fieldGrad.addColorStop(0, '#6f7d67');
      fieldGrad.addColorStop(0.45, '#4f635b');
      fieldGrad.addColorStop(1, '#263a3b');
      ctx.fillStyle = fieldGrad;
      ctx.fillRect(0, horizon, w, h - horizon);
      // water reflection
      ctx.save();
      ctx.globalAlpha = 0.22;
      const refl = ctx.createLinearGradient(0, horizon, 0, h);
      refl.addColorStop(0, '#ffd992');
      refl.addColorStop(1, 'rgba(255,217,146,0)');
      ctx.fillStyle = refl;
      ctx.beginPath();
      ctx.moveTo(sunX - w * 0.1, horizon);
      ctx.lineTo(sunX + w * 0.1, horizon);
      ctx.lineTo(sunX + w * 0.24, h);
      ctx.lineTo(sunX - w * 0.24, h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      // field lines
      ctx.strokeStyle = 'rgba(240,224,184,.15)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 12; i++) {
        const y = horizon + 18 + i * (h - horizon) / 12;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + 3);
        ctx.stroke();
      }
      for (let i = 0; i < 18; i++) {
        const x = (i / 18) * w;
        ctx.beginPath();
        ctx.moveTo(x, horizon);
        ctx.lineTo(x + (w * 0.5 - x) * 0.25, h);
        ctx.stroke();
      }

      // train on the horizon
      const trainX = ((t * 26) % (w + 700)) - 350;
      const trainY = horizon - 34;
      ctx.save();
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = '#2b2b38';
      rr(ctx, trainX, trainY, 260, 34, 7);
      ctx.fill();
      ctx.fillStyle = '#f9d98d';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(trainX + 18 + i * 46, trainY + 9, 24, 12);
      }
      ctx.fillStyle = '#1f2029';
      ctx.beginPath();
      ctx.arc(trainX + 55, trainY + 38, 5, 0, Math.PI * 2);
      ctx.arc(trainX + 205, trainY + 38, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // bridge line
      ctx.strokeStyle = 'rgba(26,28,38,.55)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, horizon - 2);
      ctx.lineTo(w, horizon - 2);
      ctx.stroke();

      // fireflies / motes
      for (let i = 0; i < 34; i++) {
        const x = (i * 173 + t * (5 + (i % 4) * 3)) % (w + 40) - 20;
        const y = h * 0.5 + Math.sin(t * 0.7 + i) * h * 0.18 + (i * 37) % (h * 0.4);
        const a = 0.16 + Math.sin(t * 1.8 + i) * 0.12;
        ctx.fillStyle = `rgba(255,230,150,${Math.max(0.03, a)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + (i % 3) * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      // floating notes
      const notes = ['♪', '♫', '♪', '♩'];
      for (let i = 0; i < 9; i++) {
        const x = w * 0.08 + i * w * 0.1 + Math.sin(t * 0.6 + i) * 18;
        const y = h * 0.32 + Math.sin(t * 0.8 + i * 1.7) * h * 0.08 - (t * (9 + i * 2)) % (h * 0.24);
        ctx.fillStyle = `rgba(255,237,178,${0.12 + (i % 3) * 0.06})`;
        ctx.font = `${18 + (i % 3) * 8}px Georgia, serif`;
        ctx.fillText(notes[i % notes.length], x, y);
      }

      // foreground grass
      ctx.strokeStyle = 'rgba(19,36,35,.75)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 70; i++) {
        const x = (i * 71) % w;
        const y = h - 10 - (i % 6) * 8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + 4, y - 20, x + 11, y - 28);
        ctx.stroke();
      }

      // Tomoko with saxophone
      const scale = clamp(Math.min(w, h) / 640, 1.15, 2.25);
      const girlX = w * 0.77;
      const girlY = h * 0.88;
      ctx.save();
      ctx.globalAlpha = 0.94;
      CharacterArt.draw(ctx, 'tomoko', girlX, girlY, t, {
        dir: 'left',
        moving: false,
        expr: 'happy',
        instrument: 'sax',
        phase: t * 0.6,
        scale
      });
      ctx.restore();

      // gentle vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.7);
      vignette.addColorStop(0, 'rgba(12,15,25,0)');
      vignette.addColorStop(1, 'rgba(12,15,25,.56)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // silent start pulse: no words, just a music note
      const pulse = 0.5 + Math.sin(t * 2.2) * 0.5;
      const cx = w / 2;
      const cy = h - Math.max(54, h * 0.09);
      ctx.save();
      ctx.strokeStyle = `rgba(255,247,231,${0.18 + pulse * 0.25})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 24 + pulse * 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,247,231,${0.7 + pulse * 0.2})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4a2b08';
      ctx.font = '900 22px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♪', cx, cy + 1);
      ctx.restore();
    }

    drawCloud(ctx, x, y, s, color) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, 60 * s, 17 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 38 * s, y + 3 * s, 34 * s, 14 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 38 * s, y + 2 * s, 40 * s, 15 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 8 * s, y - 12 * s, 34 * s, 20 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawMountainLayer(ctx, w, h, baseY, amp, color, offset) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-20, baseY + 40);
      for (let x = -20; x <= w + 20; x += 24) {
        const y = baseY - Math.abs(Math.sin((x + offset) * 0.0045)) * amp - Math.sin((x + offset) * 0.013) * amp * 0.2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w + 20, baseY + 100);
      ctx.lineTo(-20, baseY + 100);
      ctx.closePath();
      ctx.fill();
    }

    /* ---------------- main loop ---------------- */
    startLoop() {
      const loop = (now) => {
        const dt = Math.min(0.05, (now - this.lastTime) / 1000 || 0.016);
        this.lastTime = now;
        this.update(dt);
        this.render();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  window.Game = Game;
})();
