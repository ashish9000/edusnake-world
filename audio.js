// =============================================
// EDUSNAKE WORLD - AUDIO ENGINE
// =============================================

let audioCtx = null;
let soundEnabled = true;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    const start = ctx.currentTime + delay;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.start(start);
    osc.stop(start + duration + 0.01);
  } catch (e) {
    // Silently fail - audio not supported
  }
}

export const SFX = {
  correct: () => {
    beep(523, 0.08, 'sine', 0.3, 0);
    beep(659, 0.08, 'sine', 0.3, 0.09);
    beep(784, 0.15, 'sine', 0.3, 0.18);
  },

  wrong: () => {
    beep(200, 0.15, 'sawtooth', 0.25, 0);
    beep(150, 0.2, 'sawtooth', 0.2, 0.15);
  },

  die: () => {
    beep(400, 0.12, 'sawtooth', 0.3, 0);
    beep(300, 0.12, 'sawtooth', 0.3, 0.12);
    beep(200, 0.25, 'sawtooth', 0.3, 0.24);
  },

  levelUp: () => {
    [523, 587, 659, 698, 784, 880].forEach((f, i) => beep(f, 0.12, 'sine', 0.35, i * 0.07));
  },

  wordComplete: () => {
    [784, 880, 988, 1047].forEach((f, i) => beep(f, 0.15, 'sine', 0.4, i * 0.08));
    setTimeout(() => {
      [1047, 988, 880, 784].forEach((f, i) => beep(f, 0.12, 'sine', 0.3, i * 0.06));
    }, 400);
  },

  combo: (multiplier) => {
    const base = 400 + multiplier * 80;
    beep(base, 0.06, 'sine', 0.25, 0);
    beep(base * 1.25, 0.1, 'sine', 0.3, 0.07);
  },

  menuClick: () => {
    beep(660, 0.06, 'sine', 0.2, 0);
  },

  unlock: () => {
    [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.15, 'sine', 0.4, i * 0.1));
  },

  countdown: () => {
    beep(440, 0.1, 'sine', 0.3, 0);
  },

  achievement: () => {
    [784, 988, 1175, 1568].forEach((f, i) => beep(f, 0.12, 'sine', 0.4, i * 0.08));
  },
};

export function toggleSound(enabled) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

// Text-to-Speech for letter/word pronunciation
export function speak(text, lang = 'en-US', rate = 0.8) {
  if (!soundEnabled) return;
  if (!window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;
    utter.pitch = 1.2;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  } catch (e) {}
}

export function speakHindi(text) {
  speak(text, 'hi-IN', 0.75);
}

export function speakEnglish(text) {
  speak(text, 'en-US', 0.85);
}

export default SFX;
