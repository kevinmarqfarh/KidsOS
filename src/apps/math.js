// Matte-appen: frågegeneratorer per modul och nivå (0–4).
import { numberOptions } from '../core/rng.js';
import {
  emojiGroup, tenFrame, tenFrames, dotArray, baseTen, clockSvg, timeToSwedish, digitalTime,
  shapeSvg, barChart, rulerSvg, balanceSvg, marbleBag,
} from '../ui/visuals.js';

const THINGS = ['🍎', '🐞', '⭐', '🐟', '🍓', '🚗', '🎈', '🐥', '🌸', '🍪', '⚽', '🦋'];
const THING_NAMES = { '🍎': 'äpplen', '🐞': 'nyckelpigor', '⭐': 'stjärnor', '🐟': 'fiskar', '🍓': 'jordgubbar', '🚗': 'bilar', '🎈': 'ballonger', '🐥': 'kycklingar', '🌸': 'blommor', '🍪': 'kakor', '⚽': 'bollar', '🦋': 'fjärilar' };

const numOpt = (n) => ({ id: String(n), label: String(n) });
const choice = (rng, answer, count, range) => numberOptions(rng, answer, count, range).map(numOpt);

// Talområde per nivå (Lgr22 anger inget talområde – vi följer vanlig progression F–3).
export const RANGE = [5, 10, 20, 100, 1000];
export const RANGE_ADD = [5, 10, 20, 100, 1000];

/* ---------- Räkna ---------- */
export function genCount(level, rng) {
  const max = level === 0 ? 6 : level === 1 ? 10 : 20;
  const n = rng.int(level === 0 ? 1 : 3, max);
  const e = rng.pick(THINGS);
  const visual = n > 10 && level >= 1 ? `${emojiGroup(e, n, { perRow: 5, size: 's' })}` : emojiGroup(e, n, { perRow: 5 });
  return {
    type: level >= 2 ? 'numpad' : 'choice',
    prompt: `Hur många ${THING_NAMES[e]} ser du?`,
    visual,
    options: level >= 2 ? undefined : choice(rng, n, 3, { min: 1, max: max + 2, spread: 2 }),
    answer: level >= 2 ? n : String(n),
    hint: 'Peka på varje sak och räkna högt. Tips: en rad har fem.',
    explain: `Det är ${n}.`,
  };
}

/* ---------- Jämför ---------- */
export function genCompare(level, rng) {
  if (level === 0) {
    const e = rng.pick(THINGS);
    let a = rng.int(1, 8);
    let b = rng.int(1, 8);
    while (b === a) b = rng.int(1, 8);
    return {
      type: 'choice',
      prompt: `Var finns det flest ${THING_NAMES[e]}?`,
      options: [
        { id: 'a', html: emojiGroup(e, a, { size: 's' }), say: 'den här' },
        { id: 'b', html: emojiGroup(e, b, { size: 's' }), say: 'den här' },
      ],
      answer: a > b ? 'a' : 'b',
      wide: true,
      hint: 'Räkna båda grupperna.',
      explain: `${Math.max(a, b)} är fler än ${Math.min(a, b)}.`,
    };
  }
  const max = RANGE[Math.min(level + 1, 4)];
  let a = rng.int(0, max);
  let b = rng.int(0, max);
  if (rng.chance(0.15)) b = a;
  if (level >= 2) {
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return {
      type: 'choice',
      prompt: `Vilket tecken passar? ${a} __ ${b}`,
      say: `Vilket tecken passar mellan ${a} och ${b}?`,
      visual: `<div class="big-expr">${a} <span class="blank">?</span> ${b}</div>`,
      options: [
        { id: '<', label: '<', say: 'mindre än' },
        { id: '=', label: '=', say: 'lika med' },
        { id: '>', label: '>', say: 'större än' },
      ],
      answer: ans,
      hint: 'Krokodilens mun 🐊 gapar alltid mot det största talet.',
      explain: ans === '=' ? `${a} är lika med ${b}.` : `${a} är ${ans === '>' ? 'större' : 'mindre'} än ${b}.`,
    };
  }
  while (b === a) b = rng.int(0, max);
  const askBig = rng.chance(0.6);
  const ans = askBig ? Math.max(a, b) : Math.min(a, b);
  return {
    type: 'choice',
    prompt: askBig ? 'Vilket tal är störst?' : 'Vilket tal är minst?',
    options: rng.shuffle([numOpt(a), numOpt(b)]),
    answer: String(ans),
    hint: 'Tänk på tallinjen: talen blir större ju längre bort från noll.',
    explain: `${Math.max(a, b)} är större än ${Math.min(a, b)}.`,
  };
}

/* ---------- Talgrannar & talföljder ---------- */
export function genNeighbors(level, rng) {
  const steps = [[1], [1], [1, 2, 10], [2, 5, 10, 100], [3, 4, 25, 50, 100]][level];
  const step = rng.pick(steps);
  const max = RANGE[Math.min(level + 1, 4)];
  const len = 5;
  const start = rng.int(0, Math.max(0, Math.floor((max - step * (len - 1)) / step))) * step;
  const seq = Array.from({ length: len }, (_, i) => start + i * step);
  const hole = level === 0 ? len - 1 : rng.int(1, len - 1);
  const ans = seq[hole];
  const shown = seq.map((v, i) => (i === hole ? '<span class="blank">?</span>' : `<span>${v}</span>`)).join('<span class="sep">,</span>');
  return {
    type: level >= 2 ? 'numpad' : 'choice',
    prompt: hole === len - 1 ? 'Vilket tal kommer sen?' : 'Vilket tal fattas?',
    say: `${seq.map((v, i) => (i === hole ? 'vad' : v)).join(', ')}. Vilket tal fattas?`,
    visual: `<div class="seq">${shown}</div>`,
    options: level >= 2 ? undefined : choice(rng, ans, 3, { min: 0, max: max + step, spread: Math.max(1, step) }),
    answer: level >= 2 ? ans : String(ans),
    hint: step === 1 ? 'Räkna ett steg i taget.' : `Hur mycket växer talen varje steg? (${step})`,
    explain: step === 1 ? `Efter ${ans - 1} kommer ${ans}.` : `Talen ökar med ${step} varje gång.`,
  };
}

/* ---------- Plus & minus ---------- */
export function genAddSub(level, rng) {
  const max = RANGE_ADD[level];
  const minus = level > 0 && rng.chance(0.45);
  let a;
  let b;
  if (level === 3) {
    // tiotalsövergång inom 100
    a = rng.int(11, 89);
    b = rng.int(3, Math.min(99 - a, 40));
  } else if (level === 4) {
    a = rng.int(100, 800);
    b = rng.int(20, Math.min(999 - a, 300));
  } else {
    a = rng.int(0, max);
    b = rng.int(0, max - a);
  }
  let q;
  let ans;
  if (minus) {
    const tot = a + b;
    q = `${tot} - ${a}`;
    ans = b;
  } else {
    q = `${a} + ${b}`;
    ans = a + b;
  }
  let visual = `<div class="big-expr">${q} = <span class="blank">?</span></div>`;
  if (level === 0) {
    const e = rng.pick(THINGS);
    visual = `<div class="addpics">${emojiGroup(e, a, { size: 's' })}<span class="op">+</span>${emojiGroup(e, b, { size: 's' })}</div>` + visual;
  } else if (level === 1 && !minus && a + b <= 10) {
    visual = tenFrame(a, { second: b }) + visual;
  } else if (level === 2 && !minus && a + b <= 20) {
    visual = tenFrames(a, { color: '#ff6b5b' }) + visual;
  }
  return {
    type: level === 0 ? 'choice' : 'numpad',
    prompt: minus ? 'Hur mycket blir det kvar?' : 'Hur mycket blir det tillsammans?',
    say: `${q} är lika med vad?`,
    visual,
    options: level === 0 ? choice(rng, ans, 3, { min: 0, max: 10, spread: 2 }) : undefined,
    answer: level === 0 ? String(ans) : ans,
    hint: minus ? 'Börja på det stora talet och räkna baklänges.' : level >= 3 ? 'Dela upp: räkna tiotalen först och sen entalen.' : 'Börja på det största talet och räkna uppåt.',
    explain: `${q} = ${ans}.`,
  };
}

/* ---------- Tiokompisar / hundrakompisar ---------- */
export function genTenPairs(level, rng) {
  if (level >= 3) {
    const a = rng.int(1, 9) * 10;
    return {
      type: 'numpad',
      prompt: `Hundrakompisar: ${a} + ? = 100`,
      say: `${a} plus vad blir hundra?`,
      visual: `<div class="big-expr">${a} + <span class="blank">?</span> = 100</div>`,
      answer: 100 - a,
      hint: 'Tänk tiokompisar: om 3 + 7 = 10 så är 30 + 70 = 100.',
      explain: `${a} + ${100 - a} = 100.`,
    };
  }
  const target = level === 0 ? rng.pick([5, 10]) : 10;
  const a = rng.int(0, target);
  return {
    type: level === 0 ? 'choice' : 'numpad',
    prompt: `Hur många fattas till ${target}?`,
    say: `${a} plus vad blir ${target}?`,
    visual: (target === 10 ? tenFrame(a) : tenFrame(a).replace('viewBox="0 0 212 92"', 'viewBox="0 0 212 48"')) + `<div class="big-expr">${a} + <span class="blank">?</span> = ${target}</div>`,
    options: level === 0 ? choice(rng, target - a, 3, { min: 0, max: target, spread: 2 }) : undefined,
    answer: level === 0 ? String(target - a) : target - a,
    hint: 'Räkna de tomma rutorna!',
    explain: `${a} och ${target - a} är kompisar – tillsammans blir de ${target}.`,
  };
}

/* ---------- Gånger & delat ---------- */
export function genTimes(level, rng) {
  const tables = level <= 2 ? [2, 5, 10] : level === 3 ? [2, 3, 4, 5, 10] : [3, 4, 6, 7, 8, 9];
  const t = rng.pick(tables);
  const k = rng.int(1, 10);
  const division = level >= 3 && rng.chance(0.35);
  const product = t * k;
  if (division) {
    return {
      type: 'numpad',
      prompt: `Dela ${product} lika på ${t}. Hur många får var och en?`,
      say: `${product} delat med ${t} är lika med vad?`,
      visual: `<div class="big-expr">${product} ÷ ${t} = <span class="blank">?</span></div>`,
      answer: k,
      hint: `Vilket tal gånger ${t} blir ${product}?`,
      explain: `${product} ÷ ${t} = ${k}, eftersom ${t} × ${k} = ${product}.`,
    };
  }
  const visual = (product <= 40 && level <= 3 ? dotArray(k, t) : '') + `<div class="big-expr">${k} × ${t} = <span class="blank">?</span></div>`;
  return {
    type: 'numpad',
    prompt: product <= 40 && level <= 3 ? `${k} rader med ${t} i varje. Hur många är det?` : 'Räkna ut!',
    say: `${k} gånger ${t} är lika med vad?`,
    visual,
    answer: product,
    hint: `Gånger är upprepad plus: ${Array.from({ length: Math.min(k, 6) }, () => t).join(' + ')}${k > 6 ? ' …' : ''}`,
    explain: `${k} × ${t} = ${product}.`,
  };
}

/* ---------- Dubbelt & hälften ---------- */
export function genDoubleHalf(level, rng) {
  const max = level <= 1 ? 10 : level === 2 ? 40 : level === 3 ? 100 : 500;
  const doubling = rng.chance(0.5);
  if (doubling) {
    const n = rng.int(1, max / 2);
    return {
      type: level <= 1 ? 'choice' : 'numpad',
      prompt: `Vad är dubbelt så mycket som ${n}?`,
      visual: level <= 1 ? `<div class="addpics">${emojiGroup('🍪', n, { size: 's' })}<span class="op">×2</span></div>` : `<div class="big-expr">dubbelt av ${n}</div>`,
      options: level <= 1 ? choice(rng, n * 2, 3, { min: 0, max: 20, spread: 3 }) : undefined,
      answer: level <= 1 ? String(n * 2) : n * 2,
      hint: `Dubbelt betyder samma tal två gånger: ${n} + ${n}.`,
      explain: `${n} + ${n} = ${n * 2}.`,
    };
  }
  const n = rng.int(1, max / 2) * 2;
  return {
    type: level <= 1 ? 'choice' : 'numpad',
    prompt: `Vad är hälften av ${n}?`,
    visual: level <= 1 ? `<div class="addpics">${emojiGroup('🍪', n, { size: 's' })}<span class="op">÷2</span></div>` : `<div class="big-expr">hälften av ${n}</div>`,
    options: level <= 1 ? choice(rng, n / 2, 3, { min: 0, max: 10, spread: 2 }) : undefined,
    answer: level <= 1 ? String(n / 2) : n / 2,
    hint: 'Dela upp i två lika stora högar.',
    explain: `${n / 2} + ${n / 2} = ${n}, så hälften av ${n} är ${n / 2}.`,
  };
}

/* ---------- Hemliga talet (likheter och obekanta tal) ---------- */
export function genMissing(level, rng) {
  if (level >= 2 && rng.chance(0.35)) {
    // Sant eller falskt – likhetstecknets betydelse
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const c = rng.int(1, a + b - 1 || 1);
    const truth = rng.chance(0.5);
    const d = truth ? a + b - c : a + b - c + rng.pick([-2, -1, 1, 2]);
    const dd = Math.max(0, d);
    const isTrue = a + b === c + dd;
    return {
      type: 'choice',
      prompt: `Stämmer det? ${a} + ${b} = ${c} + ${dd}`,
      visual: balanceSvg(`${a} + ${b}`, `${c} + ${dd}`, isTrue ? 0 : a + b > c + dd ? -8 : 8),
      options: [
        { id: 'ja', label: 'Ja, lika', say: 'ja' },
        { id: 'nej', label: 'Nej', say: 'nej' },
      ],
      answer: isTrue ? 'ja' : 'nej',
      hint: 'Likhetstecknet betyder "är lika mycket som". Räkna båda sidor.',
      explain: `Vänster sida är ${a + b} och höger sida är ${c + dd}.`,
    };
  }
  const max = level <= 1 ? 10 : level === 2 ? 20 : 100;
  const a = rng.int(0, max / 2);
  const x = rng.int(1, max / 2);
  if (level >= 3 && rng.chance(0.4)) {
    const t = rng.pick([2, 3, 4, 5, 10]);
    const k = rng.int(2, 10);
    return {
      type: 'numpad',
      prompt: `Vilket tal döljer sig under 🐸? ${t} × 🐸 = ${t * k}`,
      say: `${t} gånger grodan är ${t * k}. Vilket tal är grodan?`,
      visual: `<div class="big-expr">${t} × 🐸 = ${t * k}</div>`,
      answer: k,
      hint: `Räkna ${t}-hopp tills du kommer till ${t * k}.`,
      explain: `${t} × ${k} = ${t * k}, så grodan är ${k}.`,
    };
  }
  const sym = rng.pick(['🐸', '🎁', '🐱', '❓']);
  const minus = level >= 2 && rng.chance(0.4);
  const expr = minus ? `${sym} - ${a} = ${x}` : `${a} + ${sym} = ${a + x}`;
  const ans = minus ? a + x : x;
  return {
    type: level === 0 ? 'choice' : 'numpad',
    prompt: `Vilket tal gömmer sig? ${expr}`,
    say: minus ? `Något minus ${a} är ${x}. Vilket tal?` : `${a} plus något är ${a + x}. Vilket tal?`,
    visual: minus ? `<div class="big-expr">${expr}</div>` : balanceSvg(`${a} + ${sym}`, `${a + x}`, 0),
    options: level === 0 ? choice(rng, ans, 3, { min: 0, max: max + 2, spread: 2 }) : undefined,
    answer: level === 0 ? String(ans) : ans,
    hint: minus ? `Räkna baklänges: ${x} + ${a} = ?` : `Börja på ${a}. Hur många steg till ${a + x}?`,
    explain: `${sym} är ${ans}.`,
  };
}

/* ---------- Mönster ---------- */
const PATTERNS = [['🔴', '🔵'], ['🍎', '🍌'], ['⭐', '🌙'], ['🐶', '🐱'], ['🟢', '🟡'], ['🔺', '🟦']];
export function genPattern(level, rng) {
  if (level >= 2 && rng.chance(0.5)) return genNeighbors(Math.min(4, level + 1), rng);
  const kinds = level === 0 ? ['AB'] : level === 1 ? ['AB', 'AAB', 'ABB'] : ['AAB', 'ABC', 'ABBC'];
  const kind = rng.pick(kinds);
  const pair = rng.pick(PATTERNS);
  const third = rng.pick(['🟣', '🍇', '☀️', '🐭', '⚫'].filter((x) => !pair.includes(x)));
  const map = { A: pair[0], B: pair[1], C: third };
  const unit = kind.split('').map((c) => map[c]);
  const len = level === 0 ? 6 : 8;
  const seq = Array.from({ length: len + 1 }, (_, i) => unit[i % unit.length]);
  const ans = seq[len];
  const opts = [...new Set([pair[0], pair[1], third])].slice(0, 3);
  return {
    type: 'choice',
    prompt: 'Vad kommer härnäst i mönstret?',
    visual: `<div class="pattern">${seq.slice(0, len).map((e) => `<span>${e}</span>`).join('')}<span class="blank">?</span></div>`,
    options: rng.shuffle(opts.map((e) => ({ id: e, label: e, say: '' }))),
    answer: ans,
    hint: 'Säg mönstret högt – vilken del upprepas?',
    explain: `Mönstret upprepar ${unit.join(' ')}.`,
  };
}

/* ---------- Former ---------- */
const SHAPE_FACTS = {
  triangel: { hörn: 3, sidor: 3 },
  kvadrat: { hörn: 4, sidor: 4 },
  rektangel: { hörn: 4, sidor: 4 },
  femhörning: { hörn: 5, sidor: 5 },
  sexhörning: { hörn: 6, sidor: 6 },
  cirkel: { hörn: 0, sidor: 0 },
};
export function genShapes(level, rng) {
  const two = level === 0 ? ['cirkel', 'kvadrat', 'triangel', 'rektangel'] : ['cirkel', 'kvadrat', 'triangel', 'rektangel', 'oval', 'femhörning', 'sexhörning'];
  const three = ['klot', 'kub', 'rätblock', 'cylinder', 'kon', 'pyramid'];
  if (level >= 2 && rng.chance(0.4)) {
    const name = rng.pick(Object.keys(SHAPE_FACTS).filter((n) => n !== 'cirkel'));
    const prop = rng.pick(['hörn', 'sidor']);
    return {
      type: 'numpad',
      prompt: `Hur många ${prop} har en ${name}?`,
      visual: shapeSvg(name),
      answer: SHAPE_FACTS[name][prop],
      hint: 'Peka och räkna runt formen.',
      explain: `En ${name} har ${SHAPE_FACTS[name][prop]} ${prop}.`,
    };
  }
  const pool = level >= 1 && rng.chance(0.5) ? three : two;
  const name = rng.pick(pool);
  const others = rng.sample(pool.filter((n) => n !== name), level === 0 ? 2 : 3);
  const askVisual = rng.chance(0.5);
  if (askVisual) {
    return {
      type: 'choice',
      prompt: `Var är ${name === 'klot' || name === 'rätblock' ? 'ett' : 'en'} ${name}?`,
      options: rng.shuffle([name, ...others]).map((n) => ({ id: n, html: shapeSvg(n), say: '' })),
      answer: name,
      wide: true,
      hint: pool === three ? 'Tredimensionella former kan man hålla i handen.' : 'Titta på hörnen och sidorna.',
      explain: `Det här är ${name === 'klot' || name === 'rätblock' ? 'ett' : 'en'} ${name}.`,
    };
  }
  return {
    type: 'choice',
    prompt: 'Vad heter formen?',
    visual: shapeSvg(name),
    options: rng.shuffle([name, ...others]).map((n) => ({ id: n, label: n })),
    answer: name,
    hint: 'Hur många hörn har den?',
    explain: `Det är ${name === 'klot' || name === 'rätblock' ? 'ett' : 'en'} ${name}.`,
  };
}

/* ---------- Klockan ---------- */
export function minutesForLevel(level) {
  if (level <= 0) return [0];
  if (level === 1) return [0, 30];
  if (level === 2) return [0, 15, 30, 45];
  return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
}
export function genClock(level, rng) {
  const mins = minutesForLevel(level);
  const h = rng.int(1, 12);
  const m = rng.pick(mins);
  const setMode = level >= 1 && rng.chance(0.4);
  if (setMode) {
    return {
      type: 'clock',
      prompt: `Ställ klockan på ${timeToSwedish(h, m)}.`,
      target: { h, m },
      step: level >= 3 ? 5 : 15,
      hint: 'Den långa visaren visar minuter. Den korta visaren visar timmar.',
      explain: `${timeToSwedish(h, m)} – digitalt ${digitalTime(h, m)}.`,
    };
  }
  const wrong = new Set();
  let guard = 0;
  while (wrong.size < 2 && guard++ < 50) {
    const hh = rng.chance(0.5) ? h : rng.int(1, 12);
    const mm = rng.pick(mins.length > 1 ? mins : [0]);
    const key = `${hh}:${mm}`;
    if (key !== `${h}:${m}` && !(mins.length === 1 && hh === h)) wrong.add(key);
  }
  const opts = [`${h}:${m}`, ...wrong].map((k) => {
    const [hh, mm] = k.split(':').map(Number);
    const label = timeToSwedish(hh, mm);
    return { id: k, label: level >= 3 ? `${label} (${digitalTime(hh, mm)})` : label, say: label };
  });
  return {
    type: 'choice',
    prompt: 'Vad är klockan?',
    visual: clockSvg(h, m),
    options: rng.shuffle(opts),
    answer: `${h}:${m}`,
    hint: 'Titta först på den korta röda visaren (timmar), sen den långa blå (minuter).',
    explain: `Klockan är ${timeToSwedish(h, m)}.`,
  };
}

/* ---------- Mäta ---------- */
const MEASURE_THINGS = ['✏️', '🖍️', '🐛', '🥕', '🔑', '🐟', '🍌', '🦎'];
export function genMeasure(level, rng) {
  const len = rng.int(2, level <= 1 ? 8 : 12);
  const start = level >= 3 ? rng.int(1, 3) : 0;
  const e = rng.pick(MEASURE_THINGS);
  return {
    type: level <= 1 ? 'choice' : 'numpad',
    prompt: start ? 'Hur lång är saken? Akta – den börjar inte på noll!' : 'Hur många centimeter lång är saken?',
    visual: rulerSvg(len, e, { start }),
    options: level <= 1 ? choice(rng, len, 3, { min: 1, max: 14, spread: 2 }) : undefined,
    answer: level <= 1 ? String(len) : len,
    hint: start ? `Räkna centimeterstegen från ${start} till slutet.` : 'Läs av talet där saken slutar.',
    explain: `Den är ${len} cm lång.`,
  };
}

/* ---------- Diagram ---------- */
const FRUITS = [
  { label: '🍎', name: 'äpple', color: '#ff6b5b' },
  { label: '🍌', name: 'banan', color: '#ffc93c' },
  { label: '🍐', name: 'päron', color: '#3fb67a' },
  { label: '🍇', name: 'vindruvor', color: '#b06bff' },
  { label: '🍊', name: 'apelsin', color: '#ff9f1c' },
];
export function genChart(level, rng) {
  const n = level <= 1 ? 3 : 4;
  const items = rng.sample(FRUITS, n);
  let values = items.map(() => rng.int(1, level <= 1 ? 6 : 10));
  // se till att max är unikt
  const mx = Math.max(...values);
  if (values.filter((v) => v === mx).length > 1) values[values.indexOf(mx)] = mx + 1;
  const data = items.map((it, i) => ({ ...it, value: values[i] }));
  const kind = level <= 1 ? rng.pick(['most', 'count']) : rng.pick(['most', 'count', 'diff', 'total']);
  const visual = barChart(data);
  const intro = 'Barnen i klassen röstade på sin favoritfrukt.';
  if (kind === 'most') {
    const best = data.reduce((a, b) => (b.value > a.value ? b : a));
    return {
      type: 'choice', prompt: `${intro} Vilken frukt fick flest röster?`, visual,
      options: rng.shuffle(data.map((d) => ({ id: d.name, label: d.label, say: d.name }))), answer: best.name,
      hint: 'Leta efter den högsta stapeln.', explain: `${best.name} fick ${best.value} röster.`,
    };
  }
  const it = rng.pick(data);
  if (kind === 'count') {
    return {
      type: level <= 1 ? 'choice' : 'numpad', prompt: `Hur många röstade på ${it.name} ${it.label}?`, visual,
      options: level <= 1 ? choice(rng, it.value, 3, { min: 1, max: 11, spread: 2 }) : undefined,
      answer: level <= 1 ? String(it.value) : it.value, hint: 'Följ stapelns topp till siffrorna till vänster.', explain: `${it.value} röstade på ${it.name}.`,
    };
  }
  if (kind === 'diff') {
    const [a, b] = rng.sample(data, 2);
    const big = a.value >= b.value ? a : b;
    const small = big === a ? b : a;
    return {
      type: 'numpad', prompt: `Hur många fler röster fick ${big.name} än ${small.name}?`, visual,
      answer: big.value - small.value, hint: 'Ta det stora talet minus det lilla.', explain: `${big.value} - ${small.value} = ${big.value - small.value}.`,
    };
  }
  const total = data.reduce((s, d) => s + d.value, 0);
  return {
    type: 'numpad', prompt: 'Hur många röstade sammanlagt?', visual, answer: total,
    hint: 'Lägg ihop alla staplar.', explain: `Sammanlagt ${total} röster.`,
  };
}

/* ---------- Chans (sannolikhet) ---------- */
export function genChance(level, rng) {
  const colors = rng.sample(['röd', 'blå', 'gul', 'grön'], 3);
  const counts = {};
  const vals = rng.shuffle([rng.int(6, 9), rng.int(2, 4), rng.int(0, 2)]);
  colors.forEach((c, i) => (counts[c] = vals[i]));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const askMost = rng.chance(0.6);
  const ans = askMost ? sorted[0][0] : sorted[sorted.length - 1][0];
  if (!askMost && sorted[sorted.length - 1][1] === sorted[sorted.length - 2][1]) return genChance(level, rng);
  const pl = (c) => ({ röd: 'röda', blå: 'blå', gul: 'gula', grön: 'gröna' })[c];
  const dot = (c) => ({ röd: '🔴', blå: '🔵', gul: '🟡', grön: '🟢' })[c];
  const impossible = Object.entries(counts).find(([, n]) => n === 0);
  if (impossible && rng.chance(0.4)) {
    return {
      type: 'choice', prompt: `Du drar en kula utan att titta. Kan den bli ${impossible[0]}?`, visual: marbleBag(counts),
      options: [{ id: 'säkert', label: 'Säkert' }, { id: 'kanske', label: 'Kanske' }, { id: 'omöjligt', label: 'Omöjligt' }],
      answer: 'omöjligt', hint: 'Finns det någon sådan kula i påsen?', explain: `Det finns inga ${pl(impossible[0])} kulor – det är omöjligt.`,
    };
  }
  return {
    type: 'choice',
    prompt: `Du drar en kula utan att titta. Vilken färg är ${askMost ? 'mest' : 'minst'} trolig?`,
    visual: marbleBag(counts),
    options: colors.map((c) => ({ id: c, label: dot(c), say: c })),
    answer: ans,
    hint: 'Räkna kulorna av varje färg.',
    explain: askMost ? `Det finns flest ${pl(ans)} kulor, så ${ans} är mest troligt.` : `Det finns minst ${pl(ans)} kulor.`,
  };
}

/* ---------- Positionssystemet ---------- */
export function genPlaceValue(level, rng) {
  const n = level <= 2 ? rng.int(11, 99) : rng.int(101, 999);
  const ask = rng.pick(level <= 2 ? ['tiotal', 'ental', 'tal'] : ['hundratal', 'tiotal', 'ental', 'tal']);
  const parts = { hundratal: Math.floor(n / 100), tiotal: Math.floor((n % 100) / 10), ental: n % 10 };
  if (ask === 'tal') {
    return {
      type: 'numpad', prompt: 'Vilket tal visar klossarna?', visual: baseTen(n), answer: n,
      hint: 'Gul platta = 100, grön stav = 10, röd kub = 1.', explain: `Det är ${n}.`,
    };
  }
  return {
    type: 'numpad', prompt: `Hur många ${ask} finns i ${n}?`, visual: `<div class="big-expr">${n}</div>` + baseTen(n), answer: parts[ask],
    hint: 'Hundratal står först, sedan tiotal och sist ental.', explain: `${n} har ${parts[ask]} ${ask}.`,
  };
}

/* ---------- Matte i vardagen: välj räknesätt från situationen ---------- */
export function genEveryday(level, rng) {
  const cap = [5, 10, 20, 100, 500][level];
  const kind = rng.pick(level < 2 ? ['picnic', 'bus', 'build'] : ['picnic', 'bus', 'build', 'garden', 'shop']);
  const a = rng.int(1, Math.floor(cap / 2));
  const b = rng.int(1, Math.floor(cap / 2));
  let prompt, answer, hint, explain, visual;
  if (kind === 'picnic') {
    prompt = `Du har ${a} äpplen. Du får ${b} till. Hur många har du nu?`;
    answer = a + b;
    hint = 'Börja med dina äpplen. Räkna sedan vidare för varje nytt äpple.';
    explain = `${a} + ${b} = ${answer} äpplen.`;
    visual = level <= 1 ? `<div class="addpics">${emojiGroup('🍎', a, { size: 's' })}<span class="op">+</span>${emojiGroup('🍎', b, { size: 's' })}</div>` : '';
  } else if (kind === 'bus') {
    const off = rng.int(1, a);
    prompt = `${a} barn åker buss. ${off} går av. Hur många är kvar?`;
    answer = a - off;
    hint = 'Börja med alla barn. Räkna bakåt ett steg för varje barn som går av.';
    explain = `${a} − ${off} = ${answer} barn kvar.`;
    visual = level <= 1 ? emojiGroup('🧒', a, { size: 's' }) : '';
  } else if (kind === 'build') {
    const target = a + b;
    prompt = `Du behöver ${target} klossar. Du har ${a}. Hur många fattas?`;
    answer = b;
    hint = 'Räkna steg från antalet du har till antalet du behöver.';
    explain = `${a} + ${answer} = ${target}. Det fattas ${answer} klossar.`;
    visual = level <= 1 ? emojiGroup('🧱', a, { size: 's' }) : '';
  } else if (kind === 'garden') {
    const rows = rng.int(2, level === 4 ? 9 : 5);
    const each = rng.int(2, level === 4 ? 12 : 5);
    prompt = `Du planterar ${rows} rader med ${each} blommor i varje. Hur många blommor blir det?`;
    answer = rows * each;
    hint = `Lägg ihop ${each} en gång för varje rad, eller använd gånger.`;
    explain = `${rows} × ${each} = ${answer} blommor.`;
    visual = level <= 3 ? dotArray(rows, each) : '';
  } else {
    const price = rng.int(2, level === 4 ? 30 : 10);
    const count = rng.int(2, level === 4 ? 8 : 4);
    const change = rng.int(1, level === 4 ? 50 : 10);
    const paid = price * count + change;
    prompt = `Du köper ${count} pennor för ${price} kronor styck och betalar ${paid} kronor. Hur många kronor får du tillbaka?`;
    answer = change;
    hint = 'Räkna först vad alla pennor kostar. Ta sedan betalt belopp minus kostnaden.';
    explain = `Pennorna kostar ${count} × ${price} = ${price * count} kronor. ${paid} − ${price * count} = ${answer} kronor tillbaka.`;
    visual = '';
  }
  return {
    type: level <= 1 ? 'choice' : 'numpad', prompt, visual, hint, explain,
    options: level <= 1 ? choice(rng, answer, 3, { min: 0, max: cap + 2, spread: 2 }) : undefined,
    answer: level <= 1 ? String(answer) : answer,
  };
}

/* ---------- Lika delar och bråk av ett antal ---------- */
export function genSharing(level, rng) {
  const parts = rng.pick(level <= 1 ? [2] : level === 2 ? [2, 4] : level === 3 ? [2, 3, 4] : [3, 4, 5, 6, 8, 10]);
  const each = rng.int(1, level <= 1 ? 3 : level === 2 ? 5 : level === 3 ? 10 : 20);
  const total = parts * each;
  const kind = rng.pick(level <= 1 ? ['share'] : ['share', 'portion', 'left']);
  const taken = level >= 3 ? rng.int(1, parts - 1) : 1;
  let prompt, answer, hint, explain;
  if (kind === 'share') {
    prompt = `${total} jordgubbar delas lika mellan ${parts} barn. Hur många får varje barn?`;
    answer = each;
    hint = 'Ge ett bär i taget till varje barn. Alla ska få lika många.';
    explain = `${parts} lika grupper med ${each} bär blir ${total}. Varje barn får ${each}.`;
  } else {
    const fraction = `${taken}/${parts}`;
    prompt = kind === 'portion'
      ? `Du har ${total} pärlor. Du använder ${fraction} av dem. Hur många pärlor använder du?`
      : `Du har ${total} pärlor. Du använder ${fraction} av dem. Hur många pärlor har du kvar?`;
    answer = kind === 'portion' ? taken * each : total - taken * each;
    hint = `Dela först alla pärlor i ${parts} lika grupper. ${fraction} betyder ${taken} av de grupperna.${kind === 'left' ? ' Räkna sedan grupperna som är kvar.' : ''}`;
    explain = `En grupp har ${total} ÷ ${parts} = ${each} pärlor. Du använder ${taken} × ${each} = ${taken * each}.${kind === 'left' ? ` Kvar blir ${total} − ${taken * each} = ${answer}.` : ''}`;
  }
  return {
    type: level <= 1 ? 'choice' : 'numpad', prompt,
    say: prompt.replace(/(\d+)\/(\d+)/g, '$1 av $2 lika delar'),
    visual: total <= 30 ? emojiGroup(kind === 'share' ? '🍓' : '🔵', total, { perRow: each, size: 's' }) : '',
    options: level <= 1 ? choice(rng, answer, 3, { min: 0, max: total + 2, spread: 2 }) : undefined,
    answer: level <= 1 ? String(answer) : answer, hint, explain,
  };
}

export const mathApp = {
  id: 'math',
  name: 'Matte',
  icon: '🔢',
  color: '#3d8bfd',
  tagline: 'Räkna, mät och klura',
  modules: [
    { id: 'count', name: 'Räkna', icon: '🍎', minLevel: 0, maxLevel: 2, gen: genCount, lgr: ['ma-tal'] },
    { id: 'compare', name: 'Störst & minst', icon: '🐊', minLevel: 0, gen: genCompare, lgr: ['ma-tal'] },
    { id: 'pattern', name: 'Mönster', icon: '🔴', minLevel: 0, gen: genPattern, lgr: ['ma-monster'] },
    { id: 'shapes', name: 'Former', icon: '🔺', minLevel: 0, gen: genShapes, lgr: ['ma-geo'] },
    { id: 'tenpairs', name: 'Tiokompisar', icon: '🤝', minLevel: 0, gen: genTenPairs, lgr: ['ma-tal', 'ma-rakna'] },
    { id: 'addsub', name: 'Plus & minus', icon: '➕', minLevel: 0, gen: genAddSub, lgr: ['ma-rakna', 'ma-metod'] },
    { id: 'neighbors', name: 'Talföljder', icon: '🐾', minLevel: 0, gen: genNeighbors, lgr: ['ma-tal', 'ma-monster'] },
    { id: 'clock', name: 'Klockan', icon: '⏰', minLevel: 0, gen: genClock, lgr: ['ma-tid'] },
    { id: 'missing', name: 'Hemliga talet', icon: '🐸', minLevel: 1, gen: genMissing, lgr: ['ma-likhet', 'ma-okand'] },
    { id: 'doublehalf', name: 'Dubbelt & hälften', icon: '🍪', minLevel: 1, gen: genDoubleHalf, lgr: ['ma-prop'] },
    { id: 'measure', name: 'Mäta', icon: '📏', minLevel: 1, gen: genMeasure, lgr: ['ma-mat'] },
    { id: 'chart', name: 'Diagram', icon: '📊', minLevel: 1, gen: genChart, lgr: ['ma-diagram'] },
    { id: 'placevalue', name: 'Tiotal & ental', icon: '🧱', minLevel: 2, gen: genPlaceValue, lgr: ['ma-pos'] },
    { id: 'times', name: 'Gånger & delat', icon: '✖️', minLevel: 2, gen: genTimes, lgr: ['ma-rakna'] },
    { id: 'everyday', name: 'Vardagsklur', icon: '🛒', minLevel: 0, gen: genEveryday, lgr: ['ma-rakna', 'ma-metod'] },
    { id: 'sharing', name: 'Lika delar & bråk', icon: '🍓', minLevel: 2, gen: genSharing, lgr: ['ma-tal', 'ma-prop', 'ma-rakna'] },
    { id: 'chance', name: 'Chans', icon: '🎲', minLevel: 2, gen: genChance, lgr: ['ma-chans'] },
  ],
};
