// Uppläsning på svenska via Web Speech API (iPad har rösten "Alva" inbyggd).
let voice = null;
let rate = 0.92;
let enabled = true;
let listeners = new Set();
const pending = new Set();

function synth() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

function pickVoice() {
  const s = synth();
  if (!s) return null;
  const voices = s.getVoices() || [];
  const sv = voices.filter((v) => /^sv/i.test(v.lang));
  // Föredra kända svenska röster av hög kvalitet.
  const pref = ['Alva', 'Klara', 'Sofie', 'Google svenska', 'Microsoft Sofie', 'Hedvig', 'Oskar'];
  for (const name of pref) {
    const v = sv.find((x) => x.name.includes(name));
    if (v) return v;
  }
  return sv[0] || null;
}

export function initSpeech() {
  const s = synth();
  if (!s) return;
  voice = pickVoice();
  try {
    s.addEventListener?.('voiceschanged', () => {
      voice = pickVoice();
    });
  } catch {}
}

export function hasSwedishVoice() {
  return !!voice || !!pickVoice();
}

export function setSpeechRate(r) {
  rate = Math.max(0.6, Math.min(1.3, Number(r) || 0.92));
}

export function setSpeechEnabled(on) {
  enabled = !!on;
  if (!enabled) stopSpeaking();
}

/** Tar bort emoji och symboler som inte ska läsas upp. */
export function cleanForSpeech(text) {
  return String(text || '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s*[×]\s*/g, ' gånger ')
    .replace(/\s*[÷]\s*/g, ' delat med ')
    .replace(/(\d)\s*-\s*(\d)/g, '$1 minus $2')
    .replace(/(\d)\s*\+\s*(\d)/g, '$1 plus $2')
    .replace(/\s*=\s*\?/g, ' är lika med vad?')
    .replace(/_+|□/g, ' vad ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getSpeechRate() {
  return rate;
}

/** onBoundary(charIndex, cleanText) anropas per ord om rösten stöder det (används av fx.speakAlong). */
export function speak(text, { force = false, interrupt = true, slow = false, onStart, onBoundary } = {}) {
  const s = synth();
  if (!s || (!enabled && !force)) return Promise.resolve();
  const t = cleanForSpeech(text);
  if (!t) return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    let safetyTimer = null;
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(safetyTimer);
      pending.delete(done);
      listeners.forEach((fn) => fn(false));
      resolve();
    };
    try {
      if (interrupt) stopSpeaking();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = 'sv-SE';
      if (!voice) voice = pickVoice();
      if (voice) u.voice = voice;
      u.rate = slow ? Math.max(0.55, rate - 0.3) : rate;
      u.pitch = 1.05;
      u.onend = done;
      u.onerror = done;
      pending.add(done);
      if (onStart) u.onstart = () => onStart(u.rate);
      if (onBoundary) {
        u.onboundary = (e) => {
          if (!e.name || e.name === 'word') onBoundary(e.charIndex, t);
        };
      }
      listeners.forEach((fn) => fn(true));
      s.speak(u);
      // säkerhetsnät om onend aldrig kommer (känt i vissa webbläsare)
      if (!settled) safetyTimer = setTimeout(done, Math.min(20000, 1500 + t.length * 90));
    } catch {
      done();
    }
  });
}

export function stopSpeaking() {
  try {
    synth()?.cancel();
  } catch {}
  for (const finish of [...pending]) finish();
}

export function onSpeaking(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
