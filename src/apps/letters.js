// Bokstavsmallar för "Skriv ABC" – varje tecken är en lista av drag (strokes),
// varje drag en lista av punkter i en enhetsruta (0–1). Draget ritas i den ordning
// barnet ska skriva det (startpunkt = grön prick).
//
// Hjälplinjer: versalhöjd 0.12, x-höjd 0.45, baslinje 0.82, nedstapel 0.98.

const T = 0.12; // versal-/uppstapelstopp
const X = 0.45; // x-höjd
const B = 0.82; // baslinje
const D = 0.98; // nedstapel
export const GUIDES = { top: T, x: X, base: B, desc: D };

const STEP = 0.02;

function line(x1, y1, x2, y2) {
  const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / STEP));
  return Array.from({ length: n + 1 }, (_, i) => [x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n]);
}
function arc(cx, cy, rx, ry, a0, a1) {
  const len = (Math.abs(a1 - a0) / 360) * Math.PI * (rx + ry);
  const n = Math.max(4, Math.ceil(len / STEP));
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
}
function dot(cx, cy, r = 0.022) {
  return arc(cx, cy, r, r, 0, 360);
}
/** Slår ihop segment till ett drag och tar bort dubblettpunkter i skarvarna. */
function S(...segs) {
  const out = [];
  for (const seg of segs) {
    for (const p of seg) {
      const last = out[out.length - 1];
      if (!last || Math.hypot(last[0] - p[0], last[1] - p[1]) > 1e-6) out.push(p);
    }
  }
  return out;
}

const circleLower = (cx = 0.48) => arc(cx, 0.635, 0.21, 0.185, -20, -380);

export const GLYPHS = {
  A: [S(line(0.5, T, 0.18, B)), S(line(0.5, T, 0.82, B)), S(line(0.29, 0.6, 0.71, 0.6))],
  B: [S(line(0.25, T, 0.25, B)), S(line(0.25, T, 0.55, T), arc(0.55, 0.295, 0.17, 0.175, -90, 90), line(0.55, 0.47, 0.25, 0.47)), S(line(0.25, 0.47, 0.58, 0.47), arc(0.58, 0.645, 0.19, 0.175, -90, 90), line(0.58, B, 0.25, B))],
  C: [S(arc(0.55, 0.47, 0.33, 0.35, -40, -320))],
  D: [S(line(0.25, T, 0.25, B)), S(line(0.25, T, 0.45, T), arc(0.45, 0.47, 0.33, 0.35, -90, 90), line(0.45, B, 0.25, B))],
  E: [S(line(0.3, T, 0.3, B)), S(line(0.3, T, 0.75, T)), S(line(0.3, 0.47, 0.68, 0.47)), S(line(0.3, B, 0.75, B))],
  F: [S(line(0.3, T, 0.3, B)), S(line(0.3, T, 0.75, T)), S(line(0.3, 0.47, 0.68, 0.47))],
  G: [S(arc(0.55, 0.47, 0.33, 0.35, -40, -360), line(0.88, 0.47, 0.6, 0.47))],
  H: [S(line(0.22, T, 0.22, B)), S(line(0.78, T, 0.78, B)), S(line(0.22, 0.47, 0.78, 0.47))],
  I: [S(line(0.5, T, 0.5, B))],
  J: [S(line(0.62, T, 0.62, 0.62), arc(0.42, 0.62, 0.2, 0.2, 0, 180))],
  K: [S(line(0.25, T, 0.25, B)), S(line(0.75, T, 0.27, 0.5), line(0.27, 0.5, 0.78, B))],
  L: [S(line(0.28, T, 0.28, B), line(0.28, B, 0.75, B))],
  M: [S(line(0.18, B, 0.18, T), line(0.18, T, 0.5, 0.6), line(0.5, 0.6, 0.82, T), line(0.82, T, 0.82, B))],
  N: [S(line(0.22, B, 0.22, T), line(0.22, T, 0.78, B), line(0.78, B, 0.78, T))],
  O: [S(arc(0.5, 0.47, 0.32, 0.35, -90, -450))],
  P: [S(line(0.25, T, 0.25, B)), S(line(0.25, T, 0.52, T), arc(0.52, 0.3, 0.2, 0.18, -90, 90), line(0.52, 0.48, 0.25, 0.48))],
  Q: [S(arc(0.5, 0.47, 0.32, 0.35, -90, -450)), S(line(0.6, 0.66, 0.86, 0.9))],
  R: [S(line(0.25, T, 0.25, B)), S(line(0.25, T, 0.52, T), arc(0.52, 0.3, 0.2, 0.18, -90, 90), line(0.52, 0.48, 0.25, 0.48)), S(line(0.45, 0.48, 0.78, B))],
  S: [S(arc(0.5, 0.295, 0.25, 0.175, -30, -270), arc(0.5, 0.645, 0.27, 0.175, -90, 150))],
  T: [S(line(0.2, T, 0.8, T)), S(line(0.5, T, 0.5, B))],
  U: [S(line(0.22, T, 0.22, 0.6), arc(0.5, 0.6, 0.28, 0.22, 180, 0), line(0.78, 0.6, 0.78, T))],
  V: [S(line(0.18, T, 0.5, B), line(0.5, B, 0.82, T))],
  W: [S(line(0.1, T, 0.3, B), line(0.3, B, 0.5, 0.4), line(0.5, 0.4, 0.7, B), line(0.7, B, 0.9, T))],
  X: [S(line(0.2, T, 0.8, B)), S(line(0.8, T, 0.2, B))],
  Y: [S(line(0.2, T, 0.5, 0.47)), S(line(0.8, T, 0.5, 0.47), line(0.5, 0.47, 0.5, B))],
  Z: [S(line(0.2, T, 0.8, T), line(0.8, T, 0.2, B), line(0.2, B, 0.8, B))],

  a: [S(circleLower()), S(line(0.69, X, 0.69, B))],
  b: [S(line(0.3, T, 0.3, B)), S(arc(0.5, 0.635, 0.2, 0.185, -180, 180))],
  c: [S(arc(0.5, 0.635, 0.21, 0.185, -40, -320))],
  d: [S(circleLower()), S(line(0.69, T, 0.69, B))],
  e: [S(line(0.29, 0.64, 0.71, 0.64), arc(0.5, 0.635, 0.21, 0.185, 0, -320))],
  f: [S(arc(0.56, 0.25, 0.13, 0.12, -30, -180), line(0.43, 0.25, 0.43, B)), S(line(0.3, X, 0.6, X))],
  g: [S(circleLower()), S(line(0.69, X, 0.69, 0.88), arc(0.5, 0.88, 0.19, 0.1, 0, 160))],
  h: [S(line(0.3, T, 0.3, B)), S(arc(0.48, 0.63, 0.18, 0.15, 180, 360), line(0.66, 0.63, 0.66, B))],
  i: [S(line(0.5, X, 0.5, B)), S(dot(0.5, 0.3))],
  j: [S(line(0.56, X, 0.56, 0.88), arc(0.4, 0.88, 0.16, 0.1, 0, 160)), S(dot(0.56, 0.3))],
  k: [S(line(0.3, T, 0.3, B)), S(line(0.66, X, 0.32, 0.66), line(0.32, 0.66, 0.7, B))],
  l: [S(line(0.5, T, 0.5, B))],
  m: [S(line(0.2, X, 0.2, B)), S(arc(0.33, 0.6, 0.13, 0.14, 180, 360), line(0.46, 0.6, 0.46, B)), S(arc(0.59, 0.6, 0.13, 0.14, 180, 360), line(0.72, 0.6, 0.72, B))],
  n: [S(line(0.28, X, 0.28, B)), S(arc(0.47, 0.62, 0.19, 0.16, 180, 360), line(0.66, 0.62, 0.66, B))],
  o: [S(arc(0.5, 0.635, 0.21, 0.185, -90, -450))],
  p: [S(line(0.3, X, 0.3, D)), S(arc(0.5, 0.635, 0.2, 0.185, -180, 180))],
  q: [S(circleLower()), S(line(0.69, X, 0.69, D))],
  r: [S(line(0.32, X, 0.32, B)), S(arc(0.5, 0.62, 0.18, 0.15, 180, 290))],
  s: [S(arc(0.5, 0.54, 0.17, 0.09, -30, -270), arc(0.5, 0.725, 0.19, 0.095, -90, 150))],
  t: [S(line(0.45, 0.22, 0.45, 0.74), arc(0.55, 0.74, 0.1, 0.08, 180, 40)), S(line(0.3, X, 0.65, X))],
  u: [S(line(0.3, X, 0.3, 0.66), arc(0.48, 0.66, 0.18, 0.16, 180, 0), line(0.66, 0.66, 0.66, X)), S(line(0.66, X, 0.66, B))],
  v: [S(line(0.25, X, 0.5, B), line(0.5, B, 0.75, X))],
  w: [S(line(0.15, X, 0.32, B), line(0.32, B, 0.5, 0.58), line(0.5, 0.58, 0.68, B), line(0.68, B, 0.85, X))],
  x: [S(line(0.27, X, 0.73, B)), S(line(0.73, X, 0.27, B))],
  y: [S(line(0.27, X, 0.5, B)), S(line(0.73, X, 0.38, D))],
  z: [S(line(0.28, X, 0.72, X), line(0.72, X, 0.28, B), line(0.28, B, 0.72, B))],

  0: [S(arc(0.5, 0.47, 0.25, 0.35, -90, -450))],
  1: [S(line(0.35, 0.25, 0.55, T), line(0.55, T, 0.55, B))],
  2: [S(arc(0.5, 0.3, 0.22, 0.18, -160, 30), line(0.69, 0.39, 0.25, B), line(0.25, B, 0.75, B))],
  3: [S(arc(0.48, 0.3, 0.22, 0.17, -160, 90), arc(0.48, 0.645, 0.24, 0.175, -90, 160))],
  4: [S(line(0.6, T, 0.2, 0.62), line(0.2, 0.62, 0.8, 0.62)), S(line(0.6, T, 0.6, B))],
  5: [S(line(0.32, T, 0.31, 0.46), arc(0.48, 0.62, 0.23, 0.2, -130, 150)), S(line(0.32, T, 0.72, T))],
  6: [S(arc(0.56, 0.64, 0.28, 0.5, -75, -180), arc(0.5, 0.64, 0.22, 0.18, 180, -180))],
  7: [S(line(0.22, T, 0.78, T), line(0.78, T, 0.4, B))],
  8: [S(arc(0.5, 0.3, 0.2, 0.17, 90, -270)), S(arc(0.5, 0.645, 0.24, 0.175, -90, 270))],
  9: [S(arc(0.5, 0.32, 0.22, 0.19, 0, -360), line(0.72, 0.32, 0.68, B))],
};

// Prickar och ringar över Å Ä Ö (versaler) och å ä ö (gemener).
GLYPHS['Å'] = [...GLYPHS.A, S(arc(0.5, 0.045, 0.045, 0.035, -90, -450))];
GLYPHS['Ä'] = [...GLYPHS.A, S(dot(0.38, 0.05)), S(dot(0.62, 0.05))];
GLYPHS['Ö'] = [...GLYPHS.O, S(dot(0.38, 0.05)), S(dot(0.62, 0.05))];
GLYPHS['å'] = [...GLYPHS.a, S(arc(0.48, 0.3, 0.06, 0.055, -90, -450))];
GLYPHS['ä'] = [...GLYPHS.a, S(dot(0.38, 0.32)), S(dot(0.6, 0.32))];
GLYPHS['ö'] = [...GLYPHS.o, S(dot(0.4, 0.32)), S(dot(0.6, 0.32))];

export const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'.split('');
export const LOWER = 'abcdefghijklmnopqrstuvwxyzåäö'.split('');
export const DIGITS = '0123456789'.split('');

export function glyphBounds(strokes) {
  let minX = 1;
  let maxX = 0;
  for (const s of strokes) for (const [x] of s) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
  }
  return { minX, maxX };
}

const NORMALIZE = { é: 'e', è: 'e', É: 'E', ü: 'u', Ü: 'U', á: 'a', à: 'a', ñ: 'n', ç: 'c', ø: 'ö', Ø: 'Ö', æ: 'ä', Æ: 'Ä' };

/**
 * Lägger ihop flera tecken till ett ord (t.ex. barnets namn).
 * Returnerar drag i en ruta där bredden är summan av tecknen; höjden är 1.
 */
export function layoutWord(text) {
  const strokes = [];
  let cursor = 0.1;
  const chars = [];
  for (const raw of String(text)) {
    const ch = NORMALIZE[raw] || raw;
    if (ch === ' ') {
      cursor += 0.4;
      continue;
    }
    const g = GLYPHS[ch];
    if (!g) continue;
    const { minX, maxX } = glyphBounds(g);
    const shift = cursor - minX;
    const start = strokes.length;
    for (const s of g) strokes.push(s.map(([x, y]) => [x + shift, y]));
    chars.push({ ch, from: start, to: strokes.length, x0: cursor, x1: cursor + (maxX - minX) });
    cursor += maxX - minX + 0.22;
  }
  return { strokes, width: cursor + 0.1 - 0.22, chars };
}

/** Täthet: punkt-avstånd till närmaste punkt i en lista (enkel men tillräckligt snabb). */
function nearest(p, pts) {
  let best = Infinity;
  for (const q of pts) {
    const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

/** Jämnar ut barnets punkter så att de ligger ungefär STEP isär. */
export function resample(points, step = STEP) {
  if (points.length < 2) return points.slice();
  const out = [points[0]];
  let prev = points[0];
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    let d = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    while (d >= step) {
      const t = step / d;
      prev = [prev[0] + (p[0] - prev[0]) * t, prev[1] + (p[1] - prev[1]) * t];
      out.push(prev);
      d = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    }
  }
  return out;
}

export const TOLERANCE = [0.11, 0.095, 0.085, 0.075, 0.065];

/**
 * Bedömer en spårning.
 * template: drag (listor av [x,y]) i enhetsrutan, drawn: barnets drag i samma koordinater.
 * coverage = hur stor del av mallen som är täckt, precision = hur mycket av barnets
 * streck som ligger nära mallen.
 */
export function scoreTrace(template, drawn, level = 1) {
  const tol = TOLERANCE[Math.max(0, Math.min(4, level))];
  const tpts = template.flat();
  const dpts = drawn.map((s) => resample(s)).flat();
  if (!dpts.length || !tpts.length) return { coverage: 0, precision: 0, inkRatio: 0, pass: false, stars: 0 };
  let covered = 0;
  for (const p of tpts) if (nearest(p, dpts) <= tol) covered++;
  let precise = 0;
  for (const p of dpts) if (nearest(p, tpts) <= tol * 1.6) precise++;
  const coverage = covered / tpts.length;
  const precision = precise / dpts.length;
  // Klotterskydd: barnets streck får inte vara mycket längre än mallen.
  const inkRatio = pathLength(drawn) / Math.max(1e-6, pathLength(template));
  const pass = coverage >= 0.8 && precision >= 0.72 && inkRatio <= 2.2;
  const stars = !pass ? 0 : coverage >= 0.93 && precision >= 0.9 ? 3 : coverage >= 0.87 && precision >= 0.82 ? 2 : 1;
  return { coverage, precision, inkRatio, pass, stars, scribble: inkRatio > 2.2 };
}

export function pathLength(strokes) {
  let len = 0;
  for (const s of strokes) for (let i = 1; i < s.length; i++) len += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
  return len;
}

/** Startpunkt och riktning för varje drag (för pilar i mallen). */
export function strokeHints(strokes) {
  return strokes.map((s, i) => {
    const a = s[0];
    const b = s[Math.min(s.length - 1, 4)];
    return { n: i + 1, x: a[0], y: a[1], angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
  });
}

export const WRITE_WORDS = [
  { w: 'sol', e: '☀️' }, { w: 'mamma', e: '👩' }, { w: 'pappa', e: '👨' }, { w: 'katt', e: '🐱' }, { w: 'hund', e: '🐶' },
  { w: 'bil', e: '🚗' }, { w: 'hus', e: '🏠' }, { w: 'glass', e: '🍦' }, { w: 'boll', e: '⚽' }, { w: 'måne', e: '🌙' },
  { w: 'äpple', e: '🍎' }, { w: 'tåg', e: '🚂' }, { w: 'öga', e: '👁️' }, { w: 'raket', e: '🚀' }, { w: 'Sverige', e: '🇸🇪' },
];

export const writeApp = {
  id: 'write',
  name: 'Skriv ABC',
  icon: '✏️',
  color: '#8a5cf6',
  tagline: 'Rita bokstäver och siffror',
  modules: [
    { id: 'upper', name: 'Stora bokstäver', icon: 'A', minLevel: 0, view: 'trace', set: 'upper', lgr: ['sv-handstil', 'sv-regler'] },
    { id: 'digits', name: 'Siffror', icon: '1', minLevel: 0, view: 'trace', set: 'digits', lgr: ['ma-tal'] },
    { id: 'name', name: 'Mitt namn', icon: '🙋', minLevel: 0, view: 'trace', set: 'name', lgr: ['sv-handstil'] },
    { id: 'lower', name: 'Små bokstäver', icon: 'a', minLevel: 1, view: 'trace', set: 'lower', lgr: ['sv-handstil', 'sv-regler'] },
    { id: 'words', name: 'Skriv ord', icon: '📝', minLevel: 2, view: 'trace', set: 'words', lgr: ['sv-handstil', 'sv-skriva'] },
  ],
};
