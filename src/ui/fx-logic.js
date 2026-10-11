// Ren logik för fx-komponenterna (ingen DOM) – testas i tests/unit/fx.test.mjs.
// Porterat från idéer i Magic UI / Animate UI på 21st.dev (MIT), se docs/KOMPONENTER.md.

/** Hur mycket rörelse som är tillåten: 'full', 'calm' (anpassat läge) eller 'none' (reducerad rörelse). */
export function motionMode({ reduced = false, adapted = '' } = {}) {
  if (reduced) return 'none';
  const a = String(adapted ?? '').trim().toLowerCase();
  if (a && !['off', 'false', '0', 'no', 'nej'].includes(a)) return 'calm';
  return 'full';
}

/** Ease-out (kubisk) – snabb start, mjukt slut, som en fjäder utan studs. */
export function easeOutCubic(t) {
  const x = Math.max(0, Math.min(1, t));
  return 1 - (1 - x) ** 3;
}

/** Värdet en Number Ticker visar vid tiden t (0–1). Alltid ett heltal mellan from och to. */
export function tickerValue(from, to, t) {
  const a = Number(from) || 0;
  const b = Number(to) || 0;
  if (t >= 1) return b;
  if (t <= 0) return a;
  const v = a + (b - a) * easeOutCubic(t);
  return b >= a ? Math.min(b, Math.floor(v)) : Math.max(b, Math.ceil(v));
}

/** Alla distinkta steg en ticker passerar på `frames` bildrutor (för tester och förhandsvisning). */
export function tickerSteps(from, to, frames = 30) {
  const out = [];
  for (let i = 0; i <= frames; i++) {
    const v = tickerValue(from, to, i / frames);
    if (out[out.length - 1] !== v) out.push(v);
  }
  return out;
}

/** Längd på animationen: kort för små steg, max ~1,2 s så barnet hinner se talet växa men inte väntar. */
export function tickerDuration(from, to) {
  const d = Math.abs((Number(to) || 0) - (Number(from) || 0));
  if (!d) return 0;
  return Math.round(Math.min(1200, 350 + 120 * Math.log2(d + 1) * 2));
}

/** Procent (0–100, heltal) för en progressring. Klarar max 0 och värden utanför intervallet. */
export function progressPercent(value, max) {
  const m = Number(max);
  if (!m || m <= 0) return 0;
  const p = (Number(value) / m) * 100;
  if (!Number.isFinite(p)) return 0;
  return Math.round(Math.max(0, Math.min(100, p)));
}

/** stroke-dashoffset för en SVG-cirkel med radien r som ska visa `percent` procent. */
export function ringDash(percent, r) {
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  return { circumference: c, offset: c * (1 - p / 100) };
}

/**
 * Hur nära nästa nivå barnet är. Systemet går upp efter `upAfter` rätt i rad.
 * Returnerar { level, run, need, atMax }.
 */
export function levelProgress(stat, { upAfter = 5, maxLevel = 4 } = {}) {
  const level = Math.max(0, Math.min(maxLevel, Number(stat?.level) || 0));
  const run = Math.max(0, Math.min(upAfter, Number(stat?.runUp) || 0));
  return { level, run, need: upAfter, atMax: level >= maxLevel };
}

/**
 * Delar en text i ord och mellanrum med teckenpositioner.
 * Varje ord: { text, start, end, word: true, index }. Mellanrum: { text, word: false }.
 * Skiljetecken hänger kvar på ordet ("Hej!" är ett ord) så att markeringen ser naturlig ut.
 */
export function segmentWords(text) {
  const s = String(text ?? '');
  const out = [];
  const re = /\S+/g;
  let last = 0;
  let index = 0;
  let m;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index), word: false });
    out.push({ text: m[0], start: m.index, end: m.index + m[0].length, word: true, index: index++ });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ text: s.slice(last), word: false });
  return out;
}

/** Bara orden ur segmentWords. */
export function wordsOf(text) {
  return segmentWords(text).filter((x) => x.word);
}

/** Vilket ord (index) ett teckenindex från talsyntesens boundary-händelse ligger i. */
export function wordIndexAt(text, charIndex) {
  const words = wordsOf(text);
  if (!words.length) return -1;
  for (const w of words) {
    if (charIndex < w.end) return w.index;
  }
  return words[words.length - 1].index;
}

/** Ord som inte uttalas (bara emoji/symboler) – de hoppas över i uppläsningsmarkeringen. */
export function isSpokenWord(w) {
  return /[\p{L}\p{N}]/u.test(String(w));
}

/**
 * Uppskattade starttider (ms) för varje ord, när talsyntesen inte skickar boundary-händelser
 * (t.ex. vissa Chrome-röster). Bygger på antal stavelser ≈ vokalgrupper, och talhastigheten.
 */
export function wordTimings(words, { rate = 0.92, msPerSyllable = 210, pauseMs = 260 } = {}) {
  const r = Math.max(0.5, Number(rate) || 1);
  const times = [];
  let t = 0;
  for (const w of words) {
    times.push(Math.round(t));
    const txt = String(w.text ?? w);
    const syll = Math.max(1, (txt.toLowerCase().match(/[aeiouyåäö]+/g) || []).length);
    const spoken = isSpokenWord(txt);
    t += spoken ? (syll * msPerSyllable) / r : 0;
    if (/[.!?]$/.test(txt)) t += (pauseMs * 1.6) / r;
    else if (/[,;:]$/.test(txt)) t += pauseMs / r;
    else if (spoken) t += 40 / r;
  }
  return times;
}

/**
 * Partiklar för en gnistrande "rätt svar"-skur (Cool Mode / Sparkles).
 * Deterministisk när en rng skickas in. Returnerar vinkel, avstånd, storlek och fördröjning.
 */
export function sparkleParticles(count, rand = Math.random) {
  const n = Math.max(0, Math.min(40, Math.floor(count)));
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / Math.max(1, n)) * Math.PI * 2 + (rand() - 0.5) * 0.6;
    const dist = 40 + rand() * 50;
    return {
      dx: Math.round(Math.cos(angle) * dist),
      dy: Math.round(Math.sin(angle) * dist),
      size: Math.round(10 + rand() * 14),
      delay: Math.round(rand() * 120),
      rot: Math.round((rand() - 0.5) * 180),
    };
  });
}

/** Fördröjning för element i en Animated List: jämn takt men aldrig mer än `cap` ms totalt. */
export function staggerDelay(i, { step = 60, cap = 900 } = {}) {
  return Math.min(cap, Math.max(0, i) * step);
}
