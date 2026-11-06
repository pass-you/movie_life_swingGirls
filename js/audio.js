/* ============================================================
   Movie Life — AudioEngine
   All music and sound effects are synthesized in the browser.
   No external audio files are required.
   ============================================================ */
(function () {
  'use strict';

  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  function midiToHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  const CHORDS = {
    Dm7:   { root: 62, notes: [62, 65, 69, 72] },
    G7:    { root: 55, notes: [59, 62, 65, 67] },
    Cmaj7: { root: 60, notes: [60, 64, 67, 71] },
    A7:    { root: 57, notes: [57, 61, 64, 67] },
    Fmaj7: { root: 53, notes: [53, 57, 60, 64] },
    Em7:   { root: 52, notes: [52, 55, 59, 62] },
    Am7:   { root: 57, notes: [57, 60, 64, 67] },
    Bb6:   { root: 58, notes: [58, 62, 65, 67] }
  };

  const MOODS = {
    summer: {
      bpm: 126,
      progression: ['Dm7', 'G7', 'Cmaj7', 'A7'],
      melody: [72, 76, 79, 77, 74, 72, 71, 69, 72, 76, 74, 72, 69, 67, 69, 72],
      swing: 0.66,
      bassVol: 0.075,
      chordVol: 0.035,
      melodyVol: 0.030,
      hats: 0.016
    },
    autumn: {
      bpm: 104,
      progression: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
      melody: [76, 74, 72, 71, 69, 72, 74, 76, 79, 76, 74, 72, 71, 69, 67, 69],
      swing: 0.66,
      bassVol: 0.065,
      chordVol: 0.030,
      melodyVol: 0.027,
      hats: 0.012
    },
    winter: {
      bpm: 88,
      progression: ['Am7', 'Fmaj7', 'Cmaj7', 'G7'],
      melody: [69, 72, 76, 74, 72, 69, 67, 64, 69, 72, 74, 76, 79, 76, 74, 72],
      swing: 0.64,
      bassVol: 0.060,
      chordVol: 0.031,
      melodyVol: 0.025,
      hats: 0.010
    },
    stage: {
      bpm: 146,
      progression: ['Dm7', 'G7', 'Cmaj7', 'A7'],
      melody: [74, 77, 81, 79, 77, 74, 72, 69, 74, 77, 79, 81, 79, 77, 74, 72],
      swing: 0.67,
      bassVol: 0.085,
      chordVol: 0.043,
      melodyVol: 0.038,
      hats: 0.020
    },
    train: {
      bpm: 112,
      progression: ['Cmaj7', 'A7', 'Dm7', 'G7'],
      melody: [72, 79, 76, 74, 72, 69, 67, 72, 74, 76, 79, 76, 74, 72, 69, 67],
      swing: 0.66,
      bassVol: 0.070,
      chordVol: 0.034,
      melodyVol: 0.030,
      hats: 0.014
    }
  };

  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.noiseBuffer = null;
      this.muted = false;
      this.mood = null;
      this.timer = null;
      this.bpm = 126;
      this.beatDur = 60 / 126;
      this.beatIndex = 0;
      this.nextBeatTime = 0;
      this.songStart = 0;
      this.songEnd = 0;
    }

    init() {
      if (this.ctx) return this.ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0.0001 : 0.9;
      this.master.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.34;
      this.musicGain.connect(this.master);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.65;
      this.sfxGain.connect(this.master);

      this.songBus = this.ctx.createGain();
      this.songBus.gain.value = 1;
      this.songBus.connect(this.master);

      this.noiseBuffer = this._makeNoise();
      return this.ctx;
    }

    async unlock() {
      this.init();
      if (this.ctx && this.ctx.state !== 'running') {
        try {
          // Some browsers/headless environments never resolve resume() when
          // there is no audio device. Never let that block the story.
          await Promise.race([
            this.ctx.resume(),
            new Promise((resolve) => setTimeout(resolve, 700))
          ]);
        } catch (e) { /* ignore */ }
      }
    }

    now() {
      return this.ctx ? this.ctx.currentTime : performance.now() / 1000;
    }

    _makeNoise() {
      const len = Math.floor(this.ctx.sampleRate * 1.0);
      const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      return buffer;
    }

    setMuted(muted) {
      this.muted = !!muted;
      if (!this.master || !this.ctx) return;
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(this.muted ? 0.0001 : 0.9, t, 0.03);
    }

    tone(freq, when, dur, type, vol, opts) {
      if (!this.ctx) return;
      opts = opts || {};
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(Math.max(20, freq), when);
      if (opts.slide) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.slide), when + dur);
      }
      if (opts.vibrato) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = opts.vibratoRate || 5.2;
        lfoGain.gain.value = opts.vibrato;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(when);
        lfo.stop(when + dur + 0.05);
      }
      gain.gain.setValueAtTime(0.0001, when);
      const attack = opts.attack == null ? 0.012 : opts.attack;
      const release = opts.release == null ? 0.12 : opts.release;
      gain.gain.linearRampToValueAtTime(Math.max(0.0002, vol), when + attack);
      gain.gain.setTargetAtTime(0.0001, when + Math.max(attack + 0.01, dur - release), release * 0.4);
      osc.connect(gain);
      let out = gain;
      if (opts.filter) {
        const filter = ctx.createBiquadFilter();
        filter.type = opts.filterType || 'lowpass';
        filter.frequency.setValueAtTime(opts.filter, when);
        filter.Q.value = opts.q || 0.8;
        gain.connect(filter);
        out = filter;
      }
      out.connect(opts.dest || this.musicGain);
      osc.start(when);
      osc.stop(when + dur + 0.08);
    }

    noise(when, dur, vol, filterFreq, dest, type) {
      if (!this.ctx || !this.noiseBuffer) return;
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = type || 'highpass';
      filter.frequency.value = filterFreq || 5000;
      filter.Q.value = 0.6;
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.linearRampToValueAtTime(vol, when + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(dest || this.musicGain);
      src.start(when);
      src.stop(when + dur + 0.03);
    }

    startMusic(mood) {
      if (!this.ctx) return;
      if (this.mood === mood && this.timer) return;
      this.stopMusic(0.18);
      this._stopSongBus();
      const cfg = MOODS[mood] || MOODS.summer;
      this.mood = mood;
      this.bpm = cfg.bpm;
      this.beatDur = 60 / cfg.bpm;
      this.beatIndex = 0;
      this.nextBeatTime = this.now() + 0.06;
      this.musicGain.gain.cancelScheduledValues(this.now());
      this.musicGain.gain.setTargetAtTime(0.34, this.now(), 0.25);
      const schedule = () => this._scheduleMusic();
      schedule();
      this.timer = setInterval(schedule, 82);
    }

    stopMusic(fade) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.mood = null;
      if (this.ctx && this.musicGain) {
        const t = this.now();
        this.musicGain.gain.cancelScheduledValues(t);
        this.musicGain.gain.setTargetAtTime(0.0001, t, fade || 0.06);
      }
    }

    _stopSongBus() {
      if (!this.ctx || !this.songBus) return;
      const old = this.songBus;
      const t = this.now();
      old.gain.cancelScheduledValues(t);
      old.gain.setTargetAtTime(0.0001, t, 0.025);
      try { setTimeout(() => old.disconnect(), 500); } catch (e) { /* ignore */ }
      this.songBus = this.ctx.createGain();
      this.songBus.gain.value = 1;
      this.songBus.connect(this.master);
    }

    _scheduleMusic() {
      if (!this.ctx || !this.mood) return;
      const ahead = 0.45;
      let guard = 0;
      while (this.nextBeatTime < this.now() + ahead && guard < 40) {
        this._scheduleBeat(this.beatIndex, this.nextBeatTime);
        this.beatIndex++;
        this.nextBeatTime += this.beatDur;
        guard++;
      }
      // If the tab was asleep, do not burst-schedule a whole song.
      if (this.nextBeatTime < this.now() - 1.5) {
        this.nextBeatTime = this.now() + 0.08;
      }
    }

    _scheduleBeat(index, t) {
      const cfg = MOODS[this.mood] || MOODS.summer;
      const bar = Math.floor(index / 4);
      const beat = index % 4;
      const chordName = cfg.progression[bar % cfg.progression.length];
      const chord = CHORDS[chordName] || CHORDS.Cmaj7;
      const swingOff = t + this.beatDur * cfg.swing;
      const mel = cfg.melody[(bar * 4 + beat) % cfg.melody.length];

      // A soft, brushed ride pattern.
      this.noise(t, 0.055, cfg.hats, 6200, this.musicGain, 'highpass');
      this.noise(swingOff, 0.040, cfg.hats * 0.65, 7000, this.musicGain, 'highpass');

      // Kick and snare.
      if (beat === 0 || beat === 2) {
        this.tone(52, t, 0.16, 'sine', cfg.bassVol * 0.9, { slide: 40, release: 0.08 });
      }
      if (beat === 1 || beat === 3) {
        this.noise(t, 0.10, 0.020, 1700, this.musicGain, 'bandpass');
      }

      // Walking bass.
      const bassOffsets = [0, 7, 12, 10];
      const bassMidi = chord.root - 24 + bassOffsets[beat];
      this.tone(midiToHz(bassMidi), t, this.beatDur * 0.9, 'triangle', cfg.bassVol, {
        release: 0.08, filter: 900
      });

      // Piano comping.
      if (beat === 0 || beat === 2) {
        const notes = chord.notes;
        notes.forEach((n, i) => {
          this.tone(midiToHz(n), t + i * 0.006, this.beatDur * 0.72, 'triangle', cfg.chordVol * (i === 0 ? 1 : 0.7), {
            release: 0.16, filter: 1800
          });
        });
      } else if (beat === 3) {
        chord.notes.slice(1, 4).forEach((n) => {
          this.tone(midiToHz(n), swingOff, this.beatDur * 0.32, 'triangle', cfg.chordVol * 0.55, {
            release: 0.10, filter: 1600
          });
        });
      }

      // A lazy, original melody line.
      if (beat % 2 === 0 || (beat === 3 && bar % 2 === 1)) {
        this.tone(midiToHz(mel), t + 0.02, this.beatDur * 0.72, 'sawtooth', cfg.melodyVol, {
          filter: 1350, vibrato: 2.2, vibratoRate: 5.1, release: 0.12
        });
      }

      // Tiny count-in accents every two bars.
      if (beat === 0 && bar % 2 === 0) {
        this.tone(midiToHz(chord.notes[2] + 12), t, 0.08, 'sine', cfg.chordVol * 0.45, { release: 0.06 });
      }
    }

    startSong(opts) {
      opts = opts || {};
      if (!this.ctx) {
        const fallbackBpm = opts.bpm || 132;
        const fallbackBeat = 60 / fallbackBpm;
        const fallbackBars = opts.bars || 8;
        return {
          startAt: this.now() + 1,
          duration: fallbackBars * 4 * fallbackBeat,
          bpm: fallbackBpm,
          beatDur: fallbackBeat,
          bars: fallbackBars
        };
      }
      this.stopMusic(0.08);
      this._stopSongBus();
      const bus = this.songBus;
      const bpm = opts.bpm || 132;
      const beatDur = 60 / bpm;
      const bars = opts.bars || 8;
      const countIn = 4;
      const startAt = this.now() + 0.75 + countIn * beatDur;
      const duration = bars * 4 * beatDur;
      const cfg = MOODS[opts.mood || 'stage'] || MOODS.stage;

      // Count-in woodblock.
      for (let i = 0; i < countIn; i++) {
        const t = startAt - (countIn - i) * beatDur;
        this.tone(i === countIn - 1 ? 1320 : 990, t, 0.055, 'sine', 0.030, {
          dest: bus, release: 0.02
        });
        this.noise(t, 0.018, 0.012, 2200, bus, 'bandpass');
      }

      // Crash on the downbeat.
      this.noise(startAt, 0.38, 0.030, 5000, bus, 'highpass');

      for (let b = 0; b < bars; b++) {
        const barT = startAt + b * 4 * beatDur;
        const chordName = cfg.progression[b % cfg.progression.length];
        const chord = CHORDS[chordName] || CHORDS.Cmaj7;
        const swing = cfg.swing;

        for (let beat = 0; beat < 4; beat++) {
          const t = barT + beat * beatDur;
          const off = t + beatDur * swing;
          const mel = cfg.melody[(b * 4 + beat) % cfg.melody.length];

          // Drums.
          if (beat === 0 || beat === 2) {
            this.tone(52, t, 0.18, 'sine', 0.085, { slide: 38, release: 0.08, dest: bus });
          }
          if (beat === 1 || beat === 3) {
            this.noise(t, 0.12, 0.030, 1600, bus, 'bandpass');
          }
          this.noise(t, 0.045, 0.020, 7000, bus, 'highpass');
          this.noise(off, 0.035, 0.015, 7600, bus, 'highpass');

          // Bass.
          const bassOffsets = [0, 7, 12, 10];
          const bassMidi = chord.root - 24 + bassOffsets[beat];
          this.tone(midiToHz(bassMidi), t, beatDur * 0.86, 'triangle', 0.090, {
            release: 0.07, filter: 950, dest: bus
          });

          // Comping.
          if (beat === 0 || beat === 2) {
            chord.notes.forEach((n, i) => {
              this.tone(midiToHz(n), t + i * 0.005, beatDur * 0.62, 'triangle', 0.040 * (i === 0 ? 1 : 0.65), {
                release: 0.12, filter: 1900, dest: bus
              });
            });
          }

          // Lead line.
          const leadVol = beat % 2 === 0 ? 0.044 : 0.032;
          this.tone(midiToHz(mel + (beat === 2 ? 0 : 0)), t + 0.01, beatDur * 0.72, 'sawtooth', leadVol, {
            filter: 1500, vibrato: 2.8, vibratoRate: 5.4, release: 0.11, dest: bus
          });
          if (beat === 3) {
            this.tone(midiToHz(mel + 2), off, beatDur * 0.34, 'square', 0.020, {
              filter: 1700, release: 0.08, dest: bus
            });
          }
        }
      }

      this.songStart = startAt;
      this.songEnd = startAt + duration;
      return { startAt, duration, bpm, beatDur, bars };
    }

    playHit(lane, combo) {
      if (!this.ctx) return;
      const scale = [72, 74, 76, 79, 81, 84, 86, 88];
      const idx = Math.min(scale.length - 1, (Math.floor((combo || 0) / 8) + lane * 2) % scale.length);
      const midi = scale[idx] + (lane === 0 ? 0 : lane === 1 ? 0 : lane === 2 ? 0 : 0);
      const t = this.now();
      this.tone(midiToHz(midi), t, 0.16, 'triangle', 0.045, {
        dest: this.sfxGain, release: 0.10, filter: 2400
      });
      this.tone(midiToHz(midi + 12), t + 0.006, 0.10, 'sine', 0.018, {
        dest: this.sfxGain, release: 0.08
      });
    }

    playSfx(name) {
      if (!this.ctx) return;
      const t = this.now();
      switch (name) {
        case 'talk':
          this.tone(660, t, 0.045, 'sine', 0.020, { dest: this.sfxGain, release: 0.03 });
          this.tone(880, t + 0.055, 0.050, 'sine', 0.014, { dest: this.sfxGain, release: 0.03 });
          break;
        case 'confirm':
          [0, 4, 7, 12].forEach((n, i) => {
            this.tone(midiToHz(72 + n), t + i * 0.065, 0.18, 'triangle', 0.035, {
              dest: this.sfxGain, release: 0.1, filter: 2200
            });
          });
          break;
        case 'click':
          this.tone(880, t, 0.035, 'sine', 0.018, { dest: this.sfxGain, release: 0.02 });
          break;
        case 'hit':
          this.playHit(1, 0);
          break;
        case 'miss':
          this.tone(110, t, 0.12, 'square', 0.022, { dest: this.sfxGain, release: 0.06, filter: 400 });
          break;
        case 'success':
          [0, 5, 7, 12, 16].forEach((n, i) => {
            this.tone(midiToHz(67 + n), t + i * 0.08, 0.4, 'triangle', 0.040, {
              dest: this.sfxGain, release: 0.18, filter: 2600
            });
          });
          break;
        case 'fail':
          [7, 5, 2, 0].forEach((n, i) => {
            this.tone(midiToHz(67 + n), t + i * 0.09, 0.28, 'triangle', 0.030, {
              dest: this.sfxGain, release: 0.14, filter: 1800
            });
          });
          break;
        case 'chapter':
          [0, 7, 12].forEach((n, i) => {
            this.tone(midiToHz(60 + n), t + i * 0.16, 0.8, 'sine', 0.028, {
              dest: this.sfxGain, release: 0.4
            });
          });
          break;
        case 'snow':
          this.noise(t, 0.4, 0.010, 3200, this.sfxGain, 'highpass');
          break;
        default:
          break;
      }
    }
  }

  window.AudioEngine = AudioEngine;
})();
