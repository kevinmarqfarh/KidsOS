// Små syntetiserade ljud med Web Audio – inga ljudfiler behövs.
let ctx = null;
let on = true;

function ac() {
  if (!on) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function setSoundEnabled(v) {
  on = !!v;
}

function tone(freq, start, dur, { type = 'sine', gain = 0.18, slide = 0 } = {}) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  tap() {
    tone(660, 0, 0.06, { type: 'triangle', gain: 0.08 });
  },
  correct() {
    tone(784, 0, 0.12, { type: 'triangle' });
    tone(1046, 0.09, 0.22, { type: 'triangle' });
  },
  wrong() {
    tone(330, 0, 0.16, { type: 'sine', gain: 0.12, slide: -80 });
  },
  star() {
    tone(1318, 0, 0.1, { type: 'sine', gain: 0.1 });
    tone(1760, 0.06, 0.16, { type: 'sine', gain: 0.08 });
  },
  fanfare() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.25, { type: 'triangle', gain: 0.15 }));
    tone(1318, 0.48, 0.5, { type: 'triangle', gain: 0.12 });
  },
  trophy() {
    [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.08, 0.3, { type: 'sine', gain: 0.13 }));
  },
  pop() {
    tone(500, 0, 0.08, { type: 'sine', gain: 0.12, slide: 400 });
  },
  whoosh() {
    tone(200, 0, 0.35, { type: 'sawtooth', gain: 0.04, slide: 900 });
  },
  click() {
    tone(1200, 0, 0.03, { type: 'square', gain: 0.03 });
  },
  note(freq, dur = 0.3) {
    tone(freq, 0, dur, { type: 'triangle', gain: 0.14 });
  },
  boom() {
    tone(90, 0, 0.6, { type: 'sawtooth', gain: 0.12, slide: -50 });
  },
};

/** Låser upp ljud på iOS – anropas vid första tryck. */
export function unlockAudio() {
  const c = ac();
  if (!c) return;
  try {
    const b = c.createBuffer(1, 1, 22050);
    const s = c.createBufferSource();
    s.buffer = b;
    s.connect(c.destination);
    s.start(0);
  } catch {}
}
