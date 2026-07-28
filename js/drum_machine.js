// Pekosoft Drum Machine
// pekosoft.net/js/drum_machine.js

(() => {
  const STORAGE_KEY = "drum_machine.state";
  const STEP_COUNT = 16;
  const SCHEDULE_AHEAD_SEC = 0.1;
  const SCHEDULER_DELAY_MS = 25;
  const TIMELINE_WINDOW_MS = 8000;

  const VOICES = [
    { id: "kick", label: "KICK" },
    { id: "snare", label: "SNARE" },
    { id: "hat", label: "HI-HAT" },
    { id: "perc", label: "PERC" }
  ];

  const VOICE_LIMITS = {
    kick: { frequency: [35, 180], decay: [0.06, 1.2] },
    snare: { frequency: [90, 360], decay: [0.04, 0.8] },
    hat: { frequency: [3000, 14000], decay: [0.015, 0.5] },
    perc: { frequency: [120, 2400], decay: [0.025, 0.8] }
  };

  const PATTERN_PRESETS = {
    basic: {
      kick:  [2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
      hat:   [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      perc:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    four_floor: {
      kick:  [2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
      snare: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
      hat:   [1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0],
      perc:  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]
    },
    breakbeat: {
      kick:  [2, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 1, 0, 0],
      snare: [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0],
      hat:   [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 2, 1],
      perc:  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
    },
    electro: {
      kick:  [2, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 1, 0],
      snare: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
      hat:   [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 2, 0],
      perc:  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]
    },
    empty: {
      kick:  Array(STEP_COUNT).fill(0),
      snare: Array(STEP_COUNT).fill(0),
      hat:   Array(STEP_COUNT).fill(0),
      perc:  Array(STEP_COUNT).fill(0)
    }
  };

  const KIT_PRESETS = {
    classic: {
      kick:  { frequency: 55, decay: 0.35, tone: 0.48, level: 0.9, pan: -0.04 },
      snare: { frequency: 180, decay: 0.2, tone: 0.72, level: 0.78, pan: 0.04 },
      hat:   { frequency: 8000, decay: 0.06, tone: 0.78, level: 0.58, pan: 0.16 },
      perc:  { frequency: 620, decay: 0.14, tone: 0.6, level: 0.62, pan: -0.16 }
    },
    deep: {
      kick:  { frequency: 42, decay: 0.62, tone: 0.28, level: 0.94, pan: 0 },
      snare: { frequency: 145, decay: 0.3, tone: 0.52, level: 0.78, pan: 0.05 },
      hat:   { frequency: 6500, decay: 0.1, tone: 0.56, level: 0.52, pan: 0.2 },
      perc:  { frequency: 360, decay: 0.24, tone: 0.42, level: 0.66, pan: -0.18 }
    },
    tight: {
      kick:  { frequency: 68, decay: 0.18, tone: 0.7, level: 0.86, pan: -0.03 },
      snare: { frequency: 210, decay: 0.1, tone: 0.84, level: 0.74, pan: 0.03 },
      hat:   { frequency: 9600, decay: 0.035, tone: 0.88, level: 0.52, pan: 0.12 },
      perc:  { frequency: 920, decay: 0.07, tone: 0.78, level: 0.58, pan: -0.12 }
    },
    bright: {
      kick:  { frequency: 74, decay: 0.3, tone: 0.72, level: 0.86, pan: -0.06 },
      snare: { frequency: 230, decay: 0.23, tone: 0.9, level: 0.8, pan: 0.06 },
      hat:   { frequency: 11200, decay: 0.075, tone: 0.94, level: 0.6, pan: 0.22 },
      perc:  { frequency: 1380, decay: 0.12, tone: 0.86, level: 0.6, pan: -0.22 }
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max, fallback) {
    const parsed = Number(value);
    return Math.max(min, Math.min(max, Number.isFinite(parsed) ? parsed : fallback));
  }

  function normalizePattern(pattern) {
    const fallback = PATTERN_PRESETS.basic;
    const normalized = {};

    VOICES.forEach(({ id }) => {
      const source = pattern && Array.isArray(pattern[id]) ? pattern[id] : fallback[id];
      normalized[id] = Array.from({ length: STEP_COUNT }, (_, index) => {
        return Math.round(clamp(source[index], 0, 2, 0));
      });
    });

    return normalized;
  }

  function normalizeVoices(voices) {
    const normalized = {};

    VOICES.forEach(({ id }) => {
      const source = voices && voices[id] ? voices[id] : KIT_PRESETS.classic[id];
      const fallback = KIT_PRESETS.classic[id];
      const limits = VOICE_LIMITS[id];
      normalized[id] = {
        frequency: clamp(source.frequency, limits.frequency[0], limits.frequency[1], fallback.frequency),
        decay: clamp(source.decay, limits.decay[0], limits.decay[1], fallback.decay),
        tone: clamp(source.tone, 0, 1, fallback.tone),
        level: clamp(source.level, 0, 1, fallback.level),
        pan: clamp(source.pan, -1, 1, fallback.pan)
      };
    });

    return normalized;
  }

  function createDefaultState() {
    const globalBpm = Number.parseFloat(localStorage.getItem("global.default_bpm"));
    return {
      bpm: Number.isFinite(globalBpm) ? clamp(globalBpm, 30, 320, 120) : 120,
      swing: 0,
      volume: 80,
      sound: true,
      haptic: localStorage.getItem("global.haptics") === "true",
      timelineGuides: localStorage.getItem("global.guides") === "true",
      length: STEP_COUNT,
      patternName: "basic",
      kitName: "classic",
      selectedVoice: "kick",
      pattern: clone(PATTERN_PRESETS.basic),
      voices: clone(KIT_PRESETS.classic),
      mutes: { kick: false, snare: false, hat: false, perc: false }
    };
  }

  function normalizeState(rawState, useGlobalDefaults) {
    const defaults = createDefaultState();
    const raw = rawState && typeof rawState === "object" ? rawState : {};
    const globalBpm = Number.parseFloat(localStorage.getItem("global.default_bpm"));
    const patternNames = [...Object.keys(PATTERN_PRESETS), "custom"];
    const kitNames = [...Object.keys(KIT_PRESETS), "custom"];
    const voiceIds = VOICES.map(({ id }) => id);
    const mutes = {};

    VOICES.forEach(({ id }) => {
      mutes[id] = !!(raw.mutes && raw.mutes[id]);
    });

    return {
      bpm: useGlobalDefaults && Number.isFinite(globalBpm)
        ? clamp(globalBpm, 30, 320, defaults.bpm)
        : clamp(raw.bpm, 30, 320, defaults.bpm),
      swing: Math.round(clamp(raw.swing, 0, 50, defaults.swing)),
      volume: Math.round(clamp(raw.volume, 0, 100, defaults.volume)),
      sound: raw.sound === undefined ? defaults.sound : !!raw.sound,
      haptic: raw.haptic === undefined ? defaults.haptic : !!raw.haptic,
      timelineGuides: raw.timelineGuides === undefined ? defaults.timelineGuides : !!raw.timelineGuides,
      length: [4, 8, 12, 16].includes(Number(raw.length)) ? Number(raw.length) : defaults.length,
      patternName: patternNames.includes(raw.patternName) ? raw.patternName : defaults.patternName,
      kitName: kitNames.includes(raw.kitName) ? raw.kitName : defaults.kitName,
      selectedVoice: voiceIds.includes(raw.selectedVoice) ? raw.selectedVoice : defaults.selectedVoice,
      pattern: normalizePattern(raw.pattern),
      voices: normalizeVoices(raw.voices),
      mutes
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return normalizeState(saved, true);
    } catch (_) {
      return createDefaultState();
    }
  }

  class DrumMachine {
    constructor() {
      this.state = loadState();
      this.isPlaying = false;
      this.currentStep = -1;
      this.nextStep = 0;
      this.nextStepTime = 0;
      this.schedulerTimer = null;
      this.visualTimers = new Set();
      this.activeSources = new Set();
      this.lastMetersActivitySec = 0;
      this.paintGesture = null;
      this.undoStack = [];
      this.redoStack = [];
      this.tapTimes = [];
      this.tapFlashTimer = null;
      this.timelineEvents = [];
      this.timelineAnimationFrame = null;

      this.elements = {
        grid: document.getElementById("sequencer-grid"),
        play: document.getElementById("play-button"),
        stop: document.getElementById("stop-button"),
        tap: document.getElementById("tap-button"),
        sound: document.getElementById("toggle-sound-button"),
        haptic: document.getElementById("haptic-button"),
        reset: document.getElementById("reset-button"),
        undo: document.getElementById("undo-button"),
        redo: document.getElementById("redo-button"),
        shiftLeft: document.getElementById("shift-left-button"),
        shiftRight: document.getElementById("shift-right-button"),
        random: document.getElementById("random-button"),
        clear: document.getElementById("clear-button"),
        bpmInput: document.getElementById("bpm-input"),
        bpmSlider: document.getElementById("tempo-slider"),
        swingInput: document.getElementById("swing-input"),
        swingSlider: document.getElementById("swing-slider"),
        volumeSlider: document.getElementById("volume-slider"),
        patternSelect: document.getElementById("pattern-select"),
        kitSelect: document.getElementById("kit-select"),
        lengthSelect: document.getElementById("length-select"),
        voiceSelect: document.getElementById("voice-select"),
        pitchInput: document.getElementById("pitch-input"),
        decayInput: document.getElementById("decay-input"),
        toneInput: document.getElementById("tone-input"),
        levelInput: document.getElementById("level-input"),
        panInput: document.getElementById("pan-input"),
        timelineCanvas: document.getElementById("drum-roll"),
        timelineGuides: document.getElementById("timeline-guides-button"),
        patternText: document.getElementById("pattern-text"),
        open: document.getElementById("open-button"),
        save: document.getElementById("save-button"),
        apply: document.getElementById("apply-button"),
        copy: document.getElementById("copy-button"),
        fileInput: document.getElementById("file-input")
      };

      this.buildGrid();
  this.setupTimeline();
      this.setupAudio();
      this.bindEvents();
      this.updateAll();
    }

    setupAudio() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 12;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.008;
      this.compressor.release.value = 0.18;
      this.masterGain = this.audioContext.createGain();
      this.analyser.connect(this.compressor);
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);
      this.applyMasterGain();

      window.__pekosoftMetersSource = {
        analyser: this.analyser,
        channelCount: 2,
        sampleRate: this.audioContext.sampleRate,
        isActive: () => {
          return this.isPlaying || (this.audioContext.currentTime - this.lastMetersActivitySec) < 0.25;
        }
      };
    }

    async ensureAudioReady() {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    }

    applyMasterGain() {
      if (!this.masterGain || !this.audioContext) return;
      const now = this.audioContext.currentTime;
      const gain = this.state.sound ? this.state.volume / 100 : 0;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(gain, now);
    }

    setupTimeline() {
      this.timelineContext = this.elements.timelineCanvas.getContext("2d");
      this.elements.timelineGuides.addEventListener("click", () => {
        this.state.timelineGuides = !this.state.timelineGuides;
        this.saveState();
        this.updateTimelineButton();
        this.updatePanel();
      });
      this.drawTimeline();
    }

    syncTimelineCanvas() {
      const canvas = this.elements.timelineCanvas;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width <= 0 || height <= 0) return null;

      const dpr = window.devicePixelRatio || 1;
      const pixelWidth = Math.max(1, Math.round(width * dpr));
      const pixelHeight = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      this.timelineContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width, height };
    }

    drawTimeline() {
      this.timelineAnimationFrame = requestAnimationFrame(() => this.drawTimeline());
      const size = this.syncTimelineCanvas();
      if (!size) return;

      const { width, height } = size;
      const context = this.timelineContext;
      const now = performance.now();
      const windowStart = now - TIMELINE_WINDOW_MS;
      const rowHeight = height / VOICES.length;
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryColor = rootStyles.getPropertyValue("--color1").trim();
      const guideColor = rootStyles.getPropertyValue("--grey2").trim();

      this.timelineEvents = this.timelineEvents.filter((event) => event.endTime >= windowStart);
      context.clearRect(0, 0, width, height);

      if (this.state.timelineGuides) {
        context.lineWidth = 1;
        context.strokeStyle = guideColor;
        for (let row = 0; row <= VOICES.length; row++) {
          const y = Math.min(height - 0.5, Math.max(0.5, row * rowHeight));
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.stroke();
        }
      }

      context.fillStyle = primaryColor;
      this.timelineEvents.forEach((event) => {
        if (event.startTime > now) return;

        const eventStart = Math.max(event.startTime, windowStart);
        const eventEnd = Math.min(event.endTime, now);
        if (eventEnd <= eventStart) return;

        const x = ((eventStart - windowStart) / TIMELINE_WINDOW_MS) * width;
        const eventWidth = ((eventEnd - eventStart) / TIMELINE_WINDOW_MS) * width;
        const row = VOICES.findIndex(({ id }) => id === event.voice);
        const blockHeight = Math.max(6, rowHeight * (event.velocity === 2 ? 0.58 : 0.34));
        const y = (row * rowHeight) + ((rowHeight - blockHeight) / 2);
        context.fillRect(x, y, Math.max(3, eventWidth), blockHeight);
      });
    }

    recordTimelineHit(voice, velocity, when, stopTime) {
      const delayMs = Math.max(0, (when - this.audioContext.currentTime) * 1000);
      const durationMs = Math.max(40, (stopTime - when) * 1000);
      const startTime = performance.now() + delayMs;
      this.timelineEvents.push({
        voice,
        velocity,
        startTime,
        endTime: startTime + durationMs
      });
    }

    buildGrid() {
      this.elements.grid.textContent = "";

      for (let bankIndex = 0; bankIndex < 2; bankIndex++) {
        const bank = document.createElement("div");
        bank.className = "sequence-bank";
        bank.dataset.bank = String(bankIndex);

        const voiceHeading = document.createElement("div");
        voiceHeading.className = "sequence-heading bank-leading";
        voiceHeading.textContent = "VOICE";
        bank.appendChild(voiceHeading);

        const muteHeading = document.createElement("div");
        muteHeading.className = "sequence-heading bank-leading";
        muteHeading.textContent = "M";
        bank.appendChild(muteHeading);

        for (let localStep = 0; localStep < 8; localStep++) {
          const step = (bankIndex * 8) + localStep;
          const number = document.createElement("div");
          number.className = "step-number" + (step % 4 === 0 ? " beat-start" : "");
          number.textContent = String(step + 1);
          bank.appendChild(number);
        }

        VOICES.forEach(({ id, label }) => {
          const trigger = document.createElement("button");
          trigger.type = "button";
          trigger.className = "voice-trigger bank-leading";
          trigger.dataset.voice = id;
          trigger.textContent = label;
          trigger.title = `Play ${label.toLowerCase()}`;
          trigger.setAttribute("aria-label", `Play ${label.toLowerCase()}`);
          bank.appendChild(trigger);

          const mute = document.createElement("button");
          mute.type = "button";
          mute.className = "voice-mute bank-leading";
          mute.dataset.voice = id;
          mute.title = `Mute ${label.toLowerCase()}`;
          mute.setAttribute("aria-label", `Mute ${label.toLowerCase()}`);
          mute.innerHTML = '<svg class="icons" role="img"><use href="/icons.svg#sound" /></svg>';
          bank.appendChild(mute);

          for (let localStep = 0; localStep < 8; localStep++) {
            const step = (bankIndex * 8) + localStep;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "step-button" + (step % 4 === 0 ? " beat-start" : "");
            button.dataset.voice = id;
            button.dataset.step = String(step);
            button.innerHTML = '<span class="step-mark" aria-hidden="true"></span>';
            bank.appendChild(button);
          }
        });

        this.elements.grid.appendChild(bank);
      }
    }

    bindEvents() {
      this.elements.grid.addEventListener("pointerdown", (event) => this.handleGridPointerDown(event));
      this.elements.grid.addEventListener("click", (event) => this.handleGridClick(event));
      this.elements.grid.addEventListener("keydown", (event) => this.handleGridKeyDown(event));
      document.addEventListener("pointermove", (event) => this.handlePaintMove(event), { passive: false });
      document.addEventListener("pointerup", (event) => this.endPaintGesture(event), true);
      document.addEventListener("pointercancel", (event) => this.endPaintGesture(event), true);

      this.elements.play.addEventListener("click", () => this.togglePlayback());
      this.elements.stop.addEventListener("click", () => this.pausePlayback(true));
      this.elements.tap.addEventListener("click", () => this.tapTempo());
      this.elements.sound.addEventListener("click", () => {
        this.state.sound = !this.state.sound;
        this.applyMasterGain();
        this.saveState();
        this.updateToggleButtons();
        this.updatePanel();
      });
      this.elements.haptic.addEventListener("click", () => {
        this.state.haptic = !this.state.haptic;
        this.saveState();
        this.updateToggleButtons();
        this.updatePanel();
      });
      this.elements.reset.addEventListener("click", () => this.reset());

      this.elements.undo.addEventListener("click", () => this.undo());
      this.elements.redo.addEventListener("click", () => this.redo());
      this.elements.shiftLeft.addEventListener("click", () => this.shiftPattern(-1));
      this.elements.shiftRight.addEventListener("click", () => this.shiftPattern(1));
      this.elements.random.addEventListener("click", () => this.randomizePattern());
      this.elements.clear.addEventListener("click", () => this.clearPattern());

      this.elements.bpmInput.addEventListener("change", () => this.setBpm(this.elements.bpmInput.value));
      this.elements.bpmSlider.addEventListener("input", () => this.setBpm(this.elements.bpmSlider.value));
      this.elements.swingInput.addEventListener("change", () => this.setSwing(this.elements.swingInput.value));
      this.elements.swingSlider.addEventListener("input", () => this.setSwing(this.elements.swingSlider.value));
      this.elements.volumeSlider.addEventListener("input", () => this.setVolume(this.elements.volumeSlider.value));

      window.bindPekosoftRangeButtons(
        this.elements.bpmSlider,
        document.getElementById("tempo-decrease-button"),
        document.getElementById("tempo-increase-button")
      );
      window.bindPekosoftRangeButtons(
        this.elements.swingSlider,
        document.getElementById("swing-decrease-button"),
        document.getElementById("swing-increase-button")
      );
      window.bindPekosoftRangeButtons(
        this.elements.volumeSlider,
        document.getElementById("volume-decrease-button"),
        document.getElementById("volume-increase-button")
      );

      this.elements.patternSelect.addEventListener("change", () => {
        if (PATTERN_PRESETS[this.elements.patternSelect.value]) {
          this.loadPatternPreset(this.elements.patternSelect.value);
        }
      });
      this.elements.kitSelect.addEventListener("change", () => {
        if (KIT_PRESETS[this.elements.kitSelect.value]) {
          this.loadKitPreset(this.elements.kitSelect.value);
        }
      });
      this.elements.lengthSelect.addEventListener("change", () => {
        this.state.length = Number(this.elements.lengthSelect.value);
        if (this.currentStep >= this.state.length) this.setCurrentStep(-1);
        if (this.nextStep >= this.state.length) this.nextStep = 0;
        this.saveAndRender();
      });
      this.elements.voiceSelect.addEventListener("change", () => {
        this.state.selectedVoice = this.elements.voiceSelect.value;
        this.saveState();
        this.updateGrid();
        this.updateVoiceFields();
        this.updatePanel();
      });

      [
        [this.elements.pitchInput, "frequency", 1],
        [this.elements.decayInput, "decay", 0.001],
        [this.elements.toneInput, "tone", 0.01],
        [this.elements.levelInput, "level", 0.01],
        [this.elements.panInput, "pan", 0.01]
      ].forEach(([input, property, scale]) => {
        input.addEventListener("change", () => this.setVoiceParameter(property, Number(input.value) * scale));
      });

      this.elements.open.addEventListener("click", () => this.elements.fileInput.click());
      this.elements.fileInput.addEventListener("change", () => this.openPatternFile());
      this.elements.save.addEventListener("click", () => this.savePatternFile());
      this.elements.apply.addEventListener("click", () => this.applyPatternText());
      this.elements.copy.addEventListener("click", () => this.copyPatternText());
      this.elements.patternText.addEventListener("input", () => {
        this.elements.patternText.classList.remove("pattern-error");
      });

      document.addEventListener("keydown", (event) => this.handleGlobalKeyDown(event));
      window.addEventListener("pagehide", () => this.pausePlayback(false));
    }

    handleGridPointerDown(event) {
      const button = event.target.closest(".step-button");
      if (!button || button.disabled || event.button !== 0) return;

      event.preventDefault();
      const voice = button.dataset.voice;
      const step = Number(button.dataset.step);
      const value = (this.state.pattern[voice][step] + 1) % 3;
      this.paintGesture = {
        pointerId: event.pointerId,
        before: this.patternSnapshot(),
        value,
        visited: new Set()
      };
      this.paintStep(button);
    }

    handlePaintMove(event) {
      if (!this.paintGesture || event.pointerId !== this.paintGesture.pointerId) return;
      event.preventDefault();
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const button = target ? target.closest(".step-button") : null;
      if (button && !button.disabled) this.paintStep(button);
    }

    paintStep(button) {
      const voice = button.dataset.voice;
      const step = Number(button.dataset.step);
      const key = `${voice}:${step}`;
      if (this.paintGesture.visited.has(key)) return;

      this.paintGesture.visited.add(key);
      this.state.pattern[voice][step] = this.paintGesture.value;
      this.updateStepButton(button, voice, step);
    }

    endPaintGesture(event) {
      if (!this.paintGesture || event.pointerId !== this.paintGesture.pointerId) return;
      const before = this.paintGesture.before;
      this.paintGesture = null;
      this.commitPatternChange(before, true);
    }

    handleGridClick(event) {
      const trigger = event.target.closest(".voice-trigger");
      if (trigger) {
        this.selectVoice(trigger.dataset.voice);
        this.auditionVoice(trigger.dataset.voice);
        return;
      }

      const mute = event.target.closest(".voice-mute");
      if (mute) {
        const voice = mute.dataset.voice;
        this.state.mutes[voice] = !this.state.mutes[voice];
        this.saveState();
        this.updateGrid();
        this.updatePanel();
      }
    }

    handleGridKeyDown(event) {
      const button = event.target.closest(".step-button");
      if (!button || button.disabled || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      const before = this.patternSnapshot();
      const voice = button.dataset.voice;
      const step = Number(button.dataset.step);
      this.state.pattern[voice][step] = (this.state.pattern[voice][step] + 1) % 3;
      this.commitPatternChange(before, true);
    }

    handleGlobalKeyDown(event) {
      const target = event.target;
      const isEditing = target && (
        ["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(target.tagName) ||
        target.isContentEditable
      );
      if (isEditing || event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.code === "Space") {
        event.preventDefault();
        this.togglePlayback();
        return;
      }

      const index = Number(event.key) - 1;
      if (index >= 0 && index < VOICES.length) {
        event.preventDefault();
        this.selectVoice(VOICES[index].id);
        this.auditionVoice(VOICES[index].id);
      }
    }

    selectVoice(voice) {
      this.state.selectedVoice = voice;
      this.elements.voiceSelect.value = voice;
      this.saveState();
      this.updateGrid();
      this.updateVoiceFields();
      this.updatePanel();
    }

    async auditionVoice(voice) {
      await this.ensureAudioReady();
      this.playVoice(voice, 2, this.audioContext.currentTime + 0.001);
      this.flashVoice(voice, 0);
      this.vibrate(8);
    }

    playVoice(voice, velocity, when) {
      const settings = this.state.voices[voice];
      const result = window.playDrumSound({
        audioContext: this.audioContext,
        destinationNode: this.analyser,
        voice,
        when,
        velocity: velocity === 2 ? 1 : 0.68,
        level: settings.level,
        pan: settings.pan,
        frequency: settings.frequency,
        decay: settings.decay,
        tone: settings.tone,
        snap: settings.tone
      });

      if (!result) return;
      this.recordTimelineHit(voice, velocity, when, result.stopTime);
      this.lastMetersActivitySec = Math.max(this.lastMetersActivitySec, result.stopTime);
      result.sources.forEach((source) => this.activeSources.add(source));
      const cleanupDelay = Math.max(0, (result.stopTime - this.audioContext.currentTime) * 1000) + 100;
      window.setTimeout(() => {
        result.sources.forEach((source) => this.activeSources.delete(source));
      }, cleanupDelay);
    }

    async togglePlayback() {
      if (this.isPlaying) {
        this.pausePlayback(false);
        return;
      }

      await this.ensureAudioReady();
      this.isPlaying = true;
      this.nextStep = this.currentStep >= 0 ? (this.currentStep + 1) % this.state.length : 0;
      this.nextStepTime = this.audioContext.currentTime + 0.03;
      this.updateToggleButtons();
      this.scheduler();
    }

    scheduler() {
      if (!this.isPlaying) return;

      while (this.nextStepTime < this.audioContext.currentTime + SCHEDULE_AHEAD_SEC) {
        this.scheduleStep(this.nextStep, this.nextStepTime);
        this.nextStepTime += this.getStepDuration(this.nextStep);
        this.nextStep = (this.nextStep + 1) % this.state.length;
      }

      this.schedulerTimer = window.setTimeout(() => this.scheduler(), SCHEDULER_DELAY_MS);
    }

    getStepDuration(step) {
      const straightDuration = (60 / this.state.bpm) / 4;
      const swingRatio = this.state.swing / 100;
      return straightDuration * (step % 2 === 0 ? 1 + swingRatio : 1 - swingRatio);
    }

    scheduleStep(step, when) {
      const delayMs = Math.max(0, (when - this.audioContext.currentTime) * 1000);
      this.scheduleVisual(() => {
        if (this.isPlaying) this.setCurrentStep(step);
      }, delayMs);

      VOICES.forEach(({ id }) => {
        const velocity = this.state.pattern[id][step];
        if (!velocity || this.state.mutes[id]) return;
        this.playVoice(id, velocity, when);
        this.flashVoice(id, delayMs);
        if (id === "kick") {
          this.scheduleVisual(() => this.vibrate(8), delayMs);
        }
      });
    }

    scheduleVisual(callback, delayMs) {
      const timer = window.setTimeout(() => {
        this.visualTimers.delete(timer);
        callback();
      }, delayMs);
      this.visualTimers.add(timer);
    }

    flashVoice(voice, delayMs) {
      this.scheduleVisual(() => {
        const triggers = document.querySelectorAll(`.voice-trigger[data-voice="${voice}"]`);
        triggers.forEach((trigger) => trigger.classList.add("voice-hit"));
        this.scheduleVisual(() => {
          triggers.forEach((trigger) => trigger.classList.remove("voice-hit"));
        }, 80);
      }, delayMs);
    }

    pausePlayback(resetPlayhead) {
      this.isPlaying = false;
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
      this.visualTimers.forEach((timer) => window.clearTimeout(timer));
      this.visualTimers.clear();
      this.activeSources.forEach((source) => {
        try {
          source.stop(this.audioContext.currentTime);
        } catch (_) {
          // Source may already have ended.
        }
      });
      this.activeSources.clear();
      const timelineNow = performance.now();
      this.timelineEvents = this.timelineEvents
        .filter((event) => event.startTime <= timelineNow)
        .map((event) => ({ ...event, endTime: Math.min(event.endTime, timelineNow) }));
      document.querySelectorAll(".voice-trigger.voice-hit").forEach((trigger) => {
        trigger.classList.remove("voice-hit");
      });
      if (resetPlayhead) this.setCurrentStep(-1);
      this.updateToggleButtons();
    }

    setCurrentStep(step) {
      this.currentStep = step;
      document.querySelectorAll(".step-button.current-step").forEach((button) => {
        button.classList.remove("current-step");
      });
      if (step >= 0) {
        document.querySelectorAll(`.step-button[data-step="${step}"]`).forEach((button) => {
          button.classList.add("current-step");
        });
      }
    }

    vibrate(duration) {
      if (this.state.haptic && "vibrate" in navigator) navigator.vibrate(duration);
    }

    tapTempo() {
      const now = performance.now();
      if (this.tapTimes.length && now - this.tapTimes[this.tapTimes.length - 1] > 2000) {
        this.tapTimes = [];
      }
      this.tapTimes.push(now);
      this.tapTimes = this.tapTimes.slice(-6);

      this.elements.tap.classList.add("button-on");
      window.clearTimeout(this.tapFlashTimer);
      this.tapFlashTimer = window.setTimeout(() => this.elements.tap.classList.remove("button-on"), 90);
      this.vibrate(8);

      if (this.tapTimes.length < 2) return;
      const intervals = this.tapTimes.slice(1).map((time, index) => time - this.tapTimes[index]);
      const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      this.setBpm(60000 / average);
    }

    setBpm(value) {
      this.state.bpm = Math.round(clamp(value, 30, 320, this.state.bpm));
      this.elements.bpmInput.value = String(this.state.bpm);
      this.elements.bpmSlider.value = String(this.state.bpm);
      this.saveState();
      this.updatePanel();
    }

    setSwing(value) {
      this.state.swing = Math.round(clamp(value, 0, 50, this.state.swing));
      this.elements.swingInput.value = String(this.state.swing);
      this.elements.swingSlider.value = String(this.state.swing);
      this.saveState();
      this.updatePanel();
    }

    setVolume(value) {
      this.state.volume = Math.round(clamp(value, 0, 100, this.state.volume));
      this.elements.volumeSlider.value = String(this.state.volume);
      this.applyMasterGain();
      this.saveState();
      this.updatePanel();
    }

    setVoiceParameter(property, value) {
      const voice = this.state.selectedVoice;
      const limits = VOICE_LIMITS[voice];
      const settings = this.state.voices[voice];

      if (property === "frequency") {
        settings.frequency = clamp(value, limits.frequency[0], limits.frequency[1], settings.frequency);
      } else if (property === "decay") {
        settings.decay = clamp(value, limits.decay[0], limits.decay[1], settings.decay);
      } else if (property === "pan") {
        settings.pan = clamp(value, -1, 1, settings.pan);
      } else {
        settings[property] = clamp(value, 0, 1, settings[property]);
      }

      this.state.kitName = "custom";
      this.saveState();
      this.updateControls();
      this.updatePanel();
      this.auditionVoice(voice);
    }

    loadPatternPreset(name) {
      const before = this.patternSnapshot();
      this.state.pattern = clone(PATTERN_PRESETS[name]);
      this.state.patternName = name;
      if (before === this.patternSnapshot()) {
        this.saveAndRender();
        return;
      }
      this.commitPatternChange(before, false);
    }

    loadKitPreset(name) {
      this.state.voices = clone(KIT_PRESETS[name]);
      this.state.kitName = name;
      this.saveAndRender();
      this.auditionVoice(this.state.selectedVoice);
    }

    shiftPattern(direction) {
      const before = this.patternSnapshot();
      VOICES.forEach(({ id }) => {
        const active = this.state.pattern[id].slice(0, this.state.length);
        if (direction < 0) active.push(active.shift());
        else active.unshift(active.pop());
        active.forEach((value, index) => {
          this.state.pattern[id][index] = value;
        });
      });
      this.commitPatternChange(before, true);
    }

    randomizePattern() {
      const before = this.patternSnapshot();
      const probabilities = { kick: 0.3, snare: 0.2, hat: 0.68, perc: 0.16 };

      VOICES.forEach(({ id }) => {
        for (let step = 0; step < STEP_COUNT; step++) {
          if (step >= this.state.length) {
            this.state.pattern[id][step] = 0;
            continue;
          }
          const active = Math.random() < probabilities[id];
          this.state.pattern[id][step] = active ? (Math.random() < 0.2 ? 2 : 1) : 0;
        }
      });

      this.state.pattern.kick[0] = 2;
      if (this.state.length > 4) this.state.pattern.snare[4] = 2;
      if (this.state.length > 12) this.state.pattern.snare[12] = 2;
      this.commitPatternChange(before, true);
    }

    clearPattern() {
      const before = this.patternSnapshot();
      VOICES.forEach(({ id }) => this.state.pattern[id].fill(0));
      this.commitPatternChange(before, true);
    }

    patternSnapshot() {
      return JSON.stringify(this.state.pattern);
    }

    commitPatternChange(before, markCustom) {
      const after = this.patternSnapshot();
      if (before === after) return;
      this.undoStack.push(before);
      this.undoStack = this.undoStack.slice(-50);
      this.redoStack = [];
      if (markCustom) this.state.patternName = "custom";
      this.saveAndRender();
    }

    undo() {
      const snapshot = this.undoStack.pop();
      if (!snapshot) return;
      this.redoStack.push(this.patternSnapshot());
      this.state.pattern = normalizePattern(JSON.parse(snapshot));
      this.state.patternName = "custom";
      this.saveAndRender();
    }

    redo() {
      const snapshot = this.redoStack.pop();
      if (!snapshot) return;
      this.undoStack.push(this.patternSnapshot());
      this.state.pattern = normalizePattern(JSON.parse(snapshot));
      this.state.patternName = "custom";
      this.saveAndRender();
    }

    reset() {
      this.pausePlayback(true);
      localStorage.removeItem(STORAGE_KEY);
      this.state = createDefaultState();
      this.undoStack = [];
      this.redoStack = [];
      this.tapTimes = [];
      this.timelineEvents = [];
      this.applyMasterGain();
      this.saveAndRender();
    }

    getExportData() {
      return {
        release: "drum_machine",
        version: 1,
        bpm: this.state.bpm,
        swing: this.state.swing,
        volume: this.state.volume,
        sound: this.state.sound,
        haptic: this.state.haptic,
        timelineGuides: this.state.timelineGuides,
        length: this.state.length,
        patternName: this.state.patternName,
        kitName: this.state.kitName,
        selectedVoice: this.state.selectedVoice,
        pattern: clone(this.state.pattern),
        voices: clone(this.state.voices),
        mutes: clone(this.state.mutes)
      };
    }

    updatePanel() {
      const text = JSON.stringify(this.getExportData(), null, 2);
      if (this.elements.patternText.value === text) return;
      this.elements.patternText.value = text;
      this.elements.patternText.dispatchEvent(new Event("input", { bubbles: true }));
    }

    applyPatternText() {
      try {
        const data = JSON.parse(this.elements.patternText.value);
        if (!data || typeof data.pattern !== "object") throw new Error("Pattern data is missing");
        const before = this.patternSnapshot();
        this.state = normalizeState({ ...this.state, ...data }, false);
        this.applyMasterGain();
        this.commitPatternChange(before, false);
        this.saveAndRender();
        this.showPanelSuccess(this.elements.apply);
      } catch (error) {
        this.elements.patternText.classList.add("pattern-error");
        console.warn("Drum Machine pattern could not be applied:", error);
      }
    }

    async copyPatternText() {
      await navigator.clipboard.writeText(this.elements.patternText.value);
      this.showPanelSuccess(this.elements.copy);
    }

    savePatternFile() {
      const blob = new Blob([this.elements.patternText.value], { type: "application/json" });
      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = window.ensurePekosoftFilename("drum_machine_pattern.json");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      this.showPanelSuccess(this.elements.save);
    }

    async openPatternFile() {
      const file = this.elements.fileInput.files[0];
      if (!file) return;
      this.elements.patternText.value = await file.text();
      this.elements.patternText.dispatchEvent(new Event("input", { bubbles: true }));
      this.applyPatternText();
      this.elements.fileInput.value = "";
    }

    showPanelSuccess(button) {
      button.classList.add("button-on");
      window.setTimeout(() => button.classList.remove("button-on"), 500);
    }

    saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }

    saveAndRender() {
      this.saveState();
      this.updateAll();
    }

    updateAll() {
      this.updateGrid();
      this.updateControls();
      this.updateToggleButtons();
      this.updateTimelineButton();
      this.updateHistoryButtons();
      this.updatePanel();
    }

    updateGrid() {
      document.querySelectorAll(".step-button").forEach((button) => {
        this.updateStepButton(button, button.dataset.voice, Number(button.dataset.step));
      });

      document.querySelectorAll(".voice-trigger").forEach((trigger) => {
        const voice = trigger.dataset.voice;
        trigger.classList.toggle("selected-voice", voice === this.state.selectedVoice);
        trigger.classList.toggle("muted-step", this.state.mutes[voice]);
      });

      document.querySelectorAll(".voice-mute").forEach((button) => {
        const muted = this.state.mutes[button.dataset.voice];
        button.classList.toggle("button-on", muted);
        button.setAttribute("aria-pressed", muted ? "true" : "false");
      });
    }

    updateStepButton(button, voice, step) {
      const velocity = this.state.pattern[voice][step];
      const disabled = step >= this.state.length;
      const muted = this.state.mutes[voice];
      const voiceLabel = VOICES.find((item) => item.id === voice).label;
      const velocityLabel = velocity === 2 ? "accent" : velocity === 1 ? "on" : "off";
      button.classList.toggle("velocity-1", velocity === 1);
      button.classList.toggle("velocity-2", velocity === 2);
      button.classList.toggle("muted-step", muted);
      button.disabled = disabled;
      button.setAttribute("aria-pressed", velocity > 0 ? "true" : "false");
      button.setAttribute("aria-label", `${voiceLabel}, step ${step + 1}, ${disabled ? "disabled" : velocityLabel}`);
      button.title = `${voiceLabel} step ${step + 1}: ${disabled ? "disabled" : velocityLabel}`;
    }

    updateControls() {
      this.elements.bpmInput.value = String(this.state.bpm);
      this.elements.bpmSlider.value = String(this.state.bpm);
      this.elements.swingInput.value = String(this.state.swing);
      this.elements.swingSlider.value = String(this.state.swing);
      this.elements.volumeSlider.value = String(this.state.volume);
      this.elements.patternSelect.value = this.state.patternName;
      this.elements.kitSelect.value = this.state.kitName;
      this.elements.lengthSelect.value = String(this.state.length);
      this.elements.voiceSelect.value = this.state.selectedVoice;
      this.updateVoiceFields();
    }

    updateVoiceFields() {
      const voice = this.state.selectedVoice;
      const settings = this.state.voices[voice];
      const limits = VOICE_LIMITS[voice];
      this.elements.pitchInput.min = String(limits.frequency[0]);
      this.elements.pitchInput.max = String(limits.frequency[1]);
      this.elements.pitchInput.value = settings.frequency.toFixed(3);
      this.elements.decayInput.min = String(limits.decay[0] * 1000);
      this.elements.decayInput.max = String(limits.decay[1] * 1000);
      this.elements.decayInput.value = (settings.decay * 1000).toFixed(3);
      this.elements.toneInput.value = String(Math.round(settings.tone * 100));
      this.elements.levelInput.value = String(Math.round(settings.level * 100));
      this.elements.panInput.value = String(Math.round(settings.pan * 100));
    }

    updateToggleButtons() {
      this.elements.play.classList.toggle("button-on", this.isPlaying);
      this.elements.play.setAttribute("aria-pressed", this.isPlaying ? "true" : "false");
      this.elements.sound.classList.toggle("button-on", this.state.sound);
      this.elements.sound.setAttribute("aria-pressed", this.state.sound ? "true" : "false");
      this.elements.haptic.classList.toggle("button-on", this.state.haptic);
      this.elements.haptic.setAttribute("aria-pressed", this.state.haptic ? "true" : "false");
    }

    updateTimelineButton() {
      this.elements.timelineGuides.classList.toggle("button-on", this.state.timelineGuides);
      this.elements.timelineGuides.setAttribute("aria-pressed", this.state.timelineGuides ? "true" : "false");
    }

    updateHistoryButtons() {
      this.elements.undo.disabled = this.undoStack.length === 0;
      this.elements.redo.disabled = this.redoStack.length === 0;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.drumMachine = new DrumMachine();
  });
})();

// END OF FILE