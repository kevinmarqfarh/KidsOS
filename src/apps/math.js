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

/** Siffra + prickar – ett svarsalternativ som även en förläsare kan "läsa". */
export function numPic(n) {
  const dots = n > 0 && n <= 10 ? `<span class="mp-dots">${'<i></i>'.repeat(n)}</span>` : '';
  return `<span class="mp-num"><b>${n}</b>${dots}</span>`;
}
/** Bildsvar för nivå 0: siffra med prickar under. */
const picChoice = (rng, answer, count, range) => numberOptions(rng, answer, count, range).map((n) => ({ id: String(n), html: numPic(n), say: String(n) }));

// Talområde per nivå (Lgr22 anger inget talområde – vi följer vanlig progression F–3).
export const RANGE = [5, 10, 20, 100, 1000];
export const RANGE_ADD = [5, 10, 20, 100, 1000];

/** Uppställning med kladdrutor för minnessiffror och växling (från Codex-spåret). */
export function genColumnNotes(level, rng) {
  const max = level >= 4 ? 999 : 99;
  const minus = rng.chance(0.5);
  const a = rng.int(20, max - 10);
  const b = rng.int(10, minus ? a : max - a);
  const answer = minus ? a - b : a + b;
  const columns = level >= 4 ? 3 : 2;
  const labels = columns === 3 ? ['Hundratal', 'Tiotal', 'Ental'] : ['Tiotal', 'Ental'];
  const digits = n => String(n).padStart(columns, ' ').split('').map(d => `<td>${d.trim()}</td>`).join('');
  const notes = labels.map(label => `<td><input class="column-note" type="text" inputmode="numeric" maxlength="2" aria-label="Minnessiffra eller växling: ${label}" autocomplete="off"></td>`).join('');
  let carry = 0;
  const steps = [];
  for (let i = 0; i < columns; i++) {
    const x = Math.floor(a / 10 ** i) % 10;
    const y = Math.floor(b / 10 ** i) % 10;
    const place = labels[columns - i - 1].toLowerCase();
    if (minus) {
      const available = x - carry;
      const borrow = available < y;
      steps.push(`${place}: ${x}${carry ? ' − 1 (från förra växlingen)' : ''}${borrow ? ' + 10 (växla från kolumnen till vänster)' : ''} − ${y} = ${available + (borrow ? 10 : 0) - y}.`);
      carry = borrow ? 1 : 0;
    } else {
      const total = x + y + carry;
      steps.push(`${place}: ${x} + ${y}${carry ? ' + 1 (minnessiffra)' : ''} = ${total}.${total >= 10 ? ` Skriv ${total % 10} och för 1 till nästa kolumn.` : ` Skriv ${total}.`}`);
      carry = Math.floor(total / 10);
    }
  }
  return {
    type: 'numpad', prompt: 'Räkna med uppställning', say: `Räkna ${a} ${minus ? 'minus' : 'plus'} ${b}.`,
    visual: `<div class="column-work"><table aria-label="${a} ${minus ? 'minus' : 'plus'} ${b} i uppställning"><thead><tr><th></th>${labels.map(label => `<th>${label}</th>`).join('')}</tr></thead><tbody><tr><td></td>${notes}</tr><tr><td></td>${digits(a)}</tr><tr><td>${minus ? '−' : '+'}</td>${digits(b)}</tr><tr class="column-result"><td>=</td><td colspan="${columns}">?</td></tr></tbody></table><p>Rutorna är ditt kladd för minnessiffror och växling. Skriv hela svaret på sifferknapparna.</p></div>`,
    answer,
    hint: minus ? 'Börja med entalen till höger. Om de inte räcker: växla ett tiotal till tio ental. Minska då tiotalen med ett. Fortsätt åt vänster.' : 'Börja med entalen till höger. Tio ental blir ett tiotal: skriv entalen och för minnessiffran till nästa kolumn.',
    explain: `${steps.join(' ')} Svaret är ${answer}. Kontroll: ${minus ? `${answer} + ${b} = ${a}` : `${answer} − ${b} = ${a}`}.`,
  };
}

/* ---------- Räkna ---------- */
export function genCount(level, rng) {
  const max = level === 0 ? 8 : level === 1 ? 10 : 20;
  const n = rng.int(level === 0 ? 1 : 3, max);
  const e = rng.pick(THINGS);
  const visual = n > 10 && level >= 1 ? `${emojiGroup(e, n, { perRow: 5, size: 's' })}` : emojiGroup(e, n, { perRow: 5 });
  return {
    type: level >= 2 ? 'numpad' : 'choice',
    prompt: `Hur många ${THING_NAMES[e]} ser du?`,
    visual,
    options: level >= 2 ? undefined : (level === 0 ? picChoice : choice)(rng, n, 3, { min: 1, max: max + 2, spread: 2 }),
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
    options: level >= 2 ? undefined : (level === 0 ? picChoice : choice)(rng, ans, 3, { min: 0, max: max + step, spread: Math.max(1, step) }),
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
    options: level === 0 ? picChoice(rng, ans, 3, { min: 0, max: 10, spread: 2 }) : undefined,
    answer: level === 0 ? String(ans) : ans,
    hint: minus ? 'Börja på det stora talet och räkna baklänges.' : level >= 3 ? 'Dela upp: räkna tiotalen först och sen entalen.' : 'Börja på det största talet och räkna uppåt.',
    explain: `${q} = ${ans}.`,
  };
}

/* ---------- Tiokompisar / hundrakompisar ---------- */
export function genTenPairs(level, rng) {
  if (level === 4 && rng.chance(0.6)) {
    // hundrakompisar med ental, eller tusenkompisar
    const thousand = rng.chance(0.4);
    const a = thousand ? rng.int(1, 9) * 100 : rng.int(11, 89);
    const target = thousand ? 1000 : 100;
    return {
      type: 'numpad',
      prompt: `${thousand ? 'Tusenkompisar' : 'Hundrakompisar'}: ${a} + ? = ${target}`,
      say: `${a} plus vad blir ${target === 1000 ? 'tusen' : 'hundra'}?`,
      visual: `<div class="big-expr">${a} + <span class="blank">?</span> = ${target}</div>`,
      answer: target - a,
      hint: thousand ? 'Tänk tiokompisar: om 3 + 7 = 10 så är 300 + 700 = 1000.' : `Hoppa först till närmaste tiotal, sen vidare till 100.`,
      explain: thousand
        ? `${a} + ${target - a} = ${target}.`
        : a % 10 === 0
          ? `${a} + ${100 - a} = 100. Tiokompisar: ${a / 10} + ${10 - a / 10} = 10.`
          : `${a} + ${100 - a} = 100. Hoppa först till tiotalet: ${a} och ${10 - (a % 10)} blir ${a + 10 - (a % 10)}, sen ${100 - a - 10 + (a % 10)} till blir 100.`,
    };
  }
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
    options: level === 0 ? picChoice(rng, target - a, 3, { min: 0, max: target, spread: 2 }) : undefined,
    answer: level === 0 ? String(target - a) : target - a,
    hint: 'Räkna de tomma rutorna!',
    explain: `${a} och ${target - a} är kompisar – tillsammans blir de ${target}.`,
  };
}

/* ---------- Gånger & delat ---------- */
export function genTimes(level, rng) {
  if (level >= 1 && level <= 2 && (level === 1 || rng.chance(0.4))) return genGroups(level, rng);
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
    prompt: product <= 40 && level <= 3 ? `${k} ${k === 1 ? 'rad' : 'rader'} med ${t} i varje. Hur många är det?` : 'Räkna ut!',
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
      options: level <= 1 ? (level === 0 ? picChoice : choice)(rng, n * 2, 3, { min: 0, max: 20, spread: 3 }) : undefined,
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
    options: level <= 1 ? (level === 0 ? picChoice : choice)(rng, n / 2, 3, { min: 0, max: 10, spread: 2 }) : undefined,
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
  if (level >= 3 && rng.chance(0.4)) return genGrowing(level, rng);
  if (level <= 1 && rng.chance(0.45)) return genShapePattern(level, rng);
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
  const askVisual = level === 0 || rng.chance(0.5); // förläsare: svara alltid med bild
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

/* =====================================================================
   Nya moduler och varianter (fördjupning Lgr22 åk 1–3)
   ===================================================================== */

export const NUM_WORDS = ['noll', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
/** Substantiv med singular, plural och genus (en/ett). */
const N = (sg, pl, g = 'en') => ({ sg, pl, g });
/** "en kaka", "ett äpple", "3 kakor" – korrekt böjning efter antal. */
export function cnt(k, noun) {
  return k === 1 ? `${noun.g} ${noun.sg}` : `${k} ${noun.pl}`;
}
const genitive = (name) => (/[sxz]$/i.test(name) ? name : `${name}s`);
const KIDS = [
  ['Elsa', 'hon'], ['Omar', 'han'], ['Maja', 'hon'], ['Leo', 'han'], ['Alva', 'hon'], ['Noah', 'han'], ['Saga', 'hon'],
  ['Ali', 'han'], ['Nora', 'hon'], ['Hugo', 'han'], ['Amira', 'hon'], ['Elias', 'han'], ['Vera', 'hon'], ['Sami', 'han'],
  ['Ebba', 'hon'], ['Liam', 'han'], ['Selma', 'hon'], ['Adam', 'han'],
];
const kid = (rng, not) => {
  const [name, pron] = rng.pick(KIDS.filter((k) => k[0] !== not));
  return { name, pron, Pron: cap(pron) };
};

/** Emoji-grupp där de sista `gone` är överstrukna/bleka (för "kvar"-uppgifter). */
function goneGroup(emoji, n, gone) {
  const items = Array.from({ length: n }, (_, i) => `<span class="eg-item${i >= n - gone ? ' mp-gone' : ''}">${emoji}</span>`);
  const rows = [];
  for (let i = 0; i < n; i += 5) rows.push(`<div class="eg-row">${items.slice(i, i + 5).join('')}</div>`);
  return `<div class="emoji-group eg-s" role="img" aria-label="${n} st, ${gone} försvinner">${rows.join('')}</div>`;
}
const addPics = (e, a, b) => `<div class="addpics">${emojiGroup(e, a, { size: 's' })}<span class="op">+</span>${emojiGroup(e, b, { size: 's' })}</div>`;

/* ---------- Textuppgifter ---------- */
const FOOD = [
  { e: '🍪', n: N('kaka', 'kakor'), eat: true },
  { e: '🧁', n: N('muffin', 'muffins'), eat: true },
  { e: '🍩', n: N('munk', 'munkar'), eat: true },
  { e: '🍓', n: N('jordgubbe', 'jordgubbar'), eat: true },
  { e: '🍎', n: N('äpple', 'äpplen', 'ett'), eat: true },
  { e: '🍬', n: N('godisbit', 'godisbitar'), eat: true },
  { e: '🍭', n: N('klubba', 'klubbor'), eat: true },
  { e: '🍌', n: N('banan', 'bananer'), eat: true },
  { e: '🥕', n: N('morot', 'morötter'), eat: true },
  { e: '🍒', n: N('körsbär', 'körsbär', 'ett'), eat: true },
];
const TOYS = [
  { e: '🔮', n: N('glaskula', 'glaskulor') },
  { e: '🖍️', n: N('krita', 'kritor') },
  { e: '🎈', n: N('ballong', 'ballonger') },
  { e: '🐚', n: N('snäcka', 'snäckor') },
  { e: '⚽', n: N('boll', 'bollar') },
  { e: '🃏', n: N('fotbollskort', 'fotbollskort', 'ett') },
];
const ANIMALS = [
  { e: '🐦', n: N('fågel', 'fåglar'), place: 'på taket', away: 'flyger iväg', come: 'flyger dit' },
  { e: '🐸', n: N('groda', 'grodor'), place: 'på stenen', away: 'hoppar ner i vattnet', come: 'hoppar upp' },
  { e: '🦆', n: N('anka', 'ankor'), place: 'i dammen', away: 'simmar iväg', come: 'simmar dit' },
  { e: '🐰', n: N('kanin', 'kaniner'), place: 'på ängen', away: 'skuttar in i skogen', come: 'skuttar dit' },
  { e: '🐞', n: N('nyckelpiga', 'nyckelpigor'), place: 'på bladet', away: 'flyger iväg', come: 'landar där' },
  { e: '🐑', n: N('får', 'får', 'ett'), place: 'i hagen', away: 'springer iväg', come: 'springer dit' },
];
const GIVERS = ['mormor', 'farfar', 'sin kompis', 'sin storasyster', 'pappa', 'mamma', 'sin lillebror', 'fröken'];
const LEGS = [
  { e: '🐔', n: N('höna', 'hönor'), legs: 2, place: 'I hönsgården', fact: 'En höna har 2 ben.' },
  { e: '🐄', n: N('ko', 'kor'), legs: 4, place: 'I hagen', fact: 'En ko har 4 ben.' },
  { e: '🐞', n: N('nyckelpiga', 'nyckelpigor'), legs: 6, place: 'På rosenbusken', fact: 'En nyckelpiga är en insekt, och alla insekter har 6 ben.' },
  { e: '🕷️', n: N('spindel', 'spindlar'), legs: 8, place: 'I trädgården', fact: 'En spindel har 8 ben – två fler än en insekt.' },
];
const SHOP = [
  { e: '🍦', n: N('glass', 'glassar') },
  { e: '📕', n: N('bok', 'böcker') },
  { e: '🎟️', n: N('biobiljett', 'biobiljetter') },
  { e: '🥐', n: N('bulle', 'bullar') },
  { e: '📒', n: N('serietidning', 'serietidningar') },
  { e: '🧃', n: N('juice', 'juicer') },
];
const SHOP_BIG = [
  { e: '👕', n: N('tröja', 'tröjor') },
  { e: '🧸', n: N('gosedjur', 'gosedjur', 'ett') },
  { e: '🎲', n: N('sällskapsspel', 'sällskapsspel', 'ett') },
  { e: '⚽', n: N('fotboll', 'fotbollar') },
  { e: '📚', n: N('bokpaket', 'bokpaket', 'ett') },
  { e: '🛼', n: N('par rullskridskor', 'par rullskridskor', 'ett') },
];
/** Välj en vara som det är rimligt ska kosta `price` kronor. */
const itemFor = (rng, price) => rng.pick(price > 45 ? SHOP_BIG : SHOP);
const kr = (n) => (n === 1 ? '1 krona' : `${n} kronor`);
const PAY = { 20: 'en tjugolapp', 50: 'en femtiolapp', 100: 'en hundralapp', 200: 'en tvåhundralapp', 500: 'en femhundralapp' };

/** Talområde för plus/minus i textuppgifter per nivå. */
function storyAddNums(level, rng) {
  if (level === 0) { const a = rng.int(1, 4); return [a, rng.int(1, 5 - a)]; }
  if (level === 1) { const a = rng.int(2, 8); return [a, rng.int(1, 10 - a)]; }
  if (level === 2) { const a = rng.int(5, 15); return [a, rng.int(2, 20 - a)]; }
  if (level === 3) { const a = rng.int(15, 65); return [a, rng.int(6, Math.min(34, 99 - a))]; }
  const a = rng.int(120, 600); return [a, rng.int(35, 999 - a > 350 ? 350 : 999 - a)];
}

// Varje mall: { lv: [min, max], kind, make(level, rng) → { text, expr, answer, e, hint, after } }
export const STORY_TEMPLATES = [
  { id: 'get', lv: [0, 3], kind: 'add', make(level, rng) {
    const f = rng.pick(level >= 3 ? [...FOOD, ...TOYS] : FOOD);
    const k = kid(rng);
    const [a, b] = storyAddNums(level, rng);
    const giver = rng.pick(GIVERS);
    return {
      text: `${k.name} har ${cnt(a, f.n)}. ${k.Pron} får ${cnt(b, f.n)} till av ${giver}. Hur många ${f.n.pl} har ${k.pron} nu?`,
      expr: `${a} + ${b}`, answer: a + b, e: f.e, a, b,
      hint: 'Får man fler blir det mer – det är plus.',
      after: `${k.name} har ${cnt(a + b, f.n)} nu.`,
    };
  } },
  { id: 'eat', lv: [0, 3], kind: 'sub', make(level, rng) {
    const f = rng.pick(FOOD);
    const k = kid(rng);
    const [x, y] = storyAddNums(level, rng);
    const a = x + y;
    const b = rng.chance(0.5) ? x : y;
    const eat = rng.chance(0.6);
    const friend = kid(rng, k.name).name;
    return {
      text: eat
        ? `${k.name} har ${cnt(a, f.n)} till fikat. ${k.Pron} äter upp ${b}. Hur många ${f.n.pl} har ${k.pron} kvar?`
        : `${k.name} har ${cnt(a, f.n)}. ${k.Pron} ger ${b} till ${friend}. Hur många ${f.n.pl} har ${k.pron} kvar?`,
      expr: `${a} - ${b}`, answer: a - b, e: f.e, a, b,
      hint: 'Det blir färre – det är minus. Börja på det stora talet och räkna baklänges.',
      after: `${k.name} har ${cnt(a - b, f.n)} kvar.`,
    };
  } },
  { id: 'animals', lv: [0, 2], kind: 'sub', make(level, rng) {
    const an = rng.pick(ANIMALS);
    const [x, y] = storyAddNums(level, rng);
    if (rng.chance(0.4)) {
      return {
        text: `Det är ${cnt(x, an.n)} ${an.place}. Sen kommer ${y} till som ${an.come}. Hur många ${an.n.pl} är det ${an.place} nu?`,
        expr: `${x} + ${y}`, answer: x + y, e: an.e, a: x, b: y, kind: 'add',
        hint: 'Det kommer fler – räkna vidare uppåt.',
        after: `Nu är det ${cnt(x + y, an.n)} ${an.place}.`,
      };
    }
    const a = x + y;
    const b = rng.chance(0.5) ? x : y;
    return {
      text: `Det är ${cnt(a, an.n)} ${an.place}. ${b === 1 ? 'En' : b} av dem ${an.away}. Hur många ${an.n.pl} är kvar ${an.place}?`,
      expr: `${a} - ${b}`, answer: a - b, e: an.e, a, b,
      hint: 'Några försvinner – det blir färre. Räkna dem som är kvar.',
      after: `${cap(cnt(a - b, an.n))} är kvar.`,
    };
  } },
  { id: 'goals', lv: [1, 3], kind: 'add', make(level, rng) {
    const MAL = N('mål', 'mål', 'ett');
    const k = kid(rng);
    const max = level === 1 ? 5 : level === 2 ? 9 : 30;
    const a = rng.int(level === 3 ? 10 : 1, max);
    const b = rng.int(level === 3 ? 10 : 0, max);
    const where = level === 3 ? ['I höstas', 'I våras'] : ['I första halvlek', 'I andra halvlek'];
    return {
      text: `${where[0]} gjorde ${genitive(k.name)} lag ${cnt(a, MAL)}. ${where[1]} gjorde laget ${cnt(b, MAL)}. Hur många mål gjorde laget sammanlagt?`,
      expr: `${a} + ${b}`, answer: a + b, e: '⚽',
      hint: '"Sammanlagt" betyder att man lägger ihop – plus.',
      after: `Laget gjorde ${cnt(a + b, MAL)} sammanlagt.`,
    };
  } },
  { id: 'compare', lv: [1, 4], kind: 'sub', make(level, rng) {
    const f = rng.pick([...FOOD, ...TOYS]);
    const A = kid(rng);
    const B = kid(rng, A.name);
    const max = [5, 10, 20, 100, 100][level];
    const b = rng.int(1, Math.floor(max / 2));
    const a = rng.int(b + 1, max);
    return {
      text: `${A.name} har ${cnt(a, f.n)} och ${B.name} har ${cnt(b, f.n)}. Hur många fler ${f.n.pl} har ${A.name}?`,
      expr: `${a} - ${b}`, answer: a - b, e: f.e,
      hint: '"Hur många fler" – ta det stora talet minus det lilla, eller räkna hur långt det är mellan talen.',
      after: `${A.name} har ${a - b} fler än ${B.name}.`,
    };
  } },
  { id: 'times', lv: [2, 4], kind: 'mul', make(level, rng) {
    const t = rng.pick(level === 2 ? [2, 5, 10] : level === 3 ? [2, 3, 4, 5, 10] : [3, 4, 6, 7, 8, 9]);
    const k = rng.int(2, level === 2 ? Math.max(2, Math.floor(20 / t)) : 10);
    const v = rng.int(0, 2);
    if (v === 0) {
      const f = rng.pick(FOOD);
      return {
        text: `${k} barn har ${cnt(t, f.n)} var. Hur många ${f.n.pl} har barnen tillsammans?`,
        expr: `${k} × ${t}`, answer: k * t, e: f.e,
        hint: `Lika många var – det är gånger. ${t} + ${t} + … ${k} gånger.`,
        after: `Barnen har ${cnt(k * t, f.n)} tillsammans.`,
      };
    }
    if (v === 1) {
      return {
        text: `I fotbollsturneringen är det ${k} lag. Varje lag har ${t} spelare. Hur många spelare är det sammanlagt?`,
        expr: `${k} × ${t}`, answer: k * t, e: '⚽',
        hint: `${k} lag med ${t} i varje: räkna ${t}-hopp ${k} gånger.`,
        after: `Det är ${k * t} spelare.`,
      };
    }
    const k2 = kid(rng);
    return {
      text: `${k2.name} läser ${t} sidor i sin bok varje kväll. Hur många sidor har ${k2.pron} läst efter ${k} kvällar?`,
      expr: `${k} × ${t}`, answer: k * t, e: '📖',
      hint: `Samma antal varje kväll – det är gånger.`,
      after: `${k2.name} har läst ${k * t} sidor.`,
    };
  } },
  { id: 'legs', lv: [3, 4], kind: 'mul', make(level, rng) {
    if (level === 4 && rng.chance(0.5)) {
      const a = rng.int(2, 9);
      const b = rng.int(2, 9);
      return {
        text: `På bondgården finns ${a} hönor och ${b} kor. Hur många ben har djuren sammanlagt?`,
        expr: `${a} × 2 + ${b} × 4`, answer: a * 2 + b * 4, e: '🐔🐄',
        hint: 'En höna har 2 ben och en ko har 4 ben. Räkna hönornas ben och kornas ben var för sig.',
        after: `Hönorna har ${a * 2} ben och korna har ${b * 4} ben.`,
      };
    }
    const an = rng.pick(level === 3 ? LEGS.slice(0, 2) : LEGS);
    const k = rng.int(2, level === 3 ? 10 : 9);
    return {
      text: `${an.place} finns ${k} ${an.n.pl}. Hur många ben har de tillsammans?`,
      expr: `${k} × ${an.legs}`, answer: k * an.legs, e: an.e,
      hint: `Hur många ben har en ${an.n.sg}? Ta det gånger ${k}.`,
      after: an.fact,
    };
  } },
  { id: 'share', lv: [3, 4], kind: 'div', make(level, rng) {
    const t = rng.int(2, level === 3 ? 6 : 10);
    const k = rng.int(2, level === 3 ? 5 : 9);
    const f = rng.pick(FOOD);
    const k2 = kid(rng);
    if (rng.chance(0.5)) {
      return {
        text: `${cap(cnt(k * t, f.n))} ska delas lika mellan ${k} barn. Hur många ${f.n.pl} får varje barn?`,
        expr: `${k * t} ÷ ${k}`, answer: t, e: f.e,
        hint: `Dela ut en i taget till ${k} barn, eller tänk: ${k} gånger vad blir ${k * t}?`,
        after: `Varje barn får ${cnt(t, f.n)}.`,
      };
    }
    return {
      text: `${k2.name} har ${cnt(k * t, f.n)} och lägger lika många i ${k} påsar. Hur många ${f.n.pl} blir det i varje påse?`,
      expr: `${k * t} ÷ ${k}`, answer: t, e: f.e,
      hint: `Vilket tal gånger ${k} blir ${k * t}?`,
      after: `Det blir ${cnt(t, f.n)} i varje påse.`,
    };
  } },
  { id: 'money', lv: [2, 4], kind: 'sub', make(level, rng) {
    let it = rng.pick(SHOP);
    const k = kid(rng);
    if (level === 4) {
      const pay = rng.pick([100, 200, 500]);
      const n = rng.int(2, 5);
      const p = rng.int(4, Math.floor((pay - 5) / n / 1.2));
      it = itemFor(rng, p);
      return {
        text: `${k.name} köper ${n} ${it.n.pl} som kostar ${p} kronor styck. ${k.Pron} betalar med ${PAY[pay]}. Hur många kronor får ${k.pron} tillbaka?`,
        expr: `${pay} - ${n} × ${p}`, answer: pay - n * p, e: it.e,
        hint: `Räkna först vad allt kostar: ${n} × ${p}. Sen: hur mycket är kvar av ${pay}?`,
        after: `Allt kostar ${n * p} kronor, så ${k.pron} får ${pay - n * p} kronor tillbaka.`,
      };
    }
    if (level === 3 && rng.chance(0.4)) {
      const [a, b] = storyAddNums(3, rng);
      const it2 = rng.pick(SHOP.filter((x) => x !== it));
      return {
        text: `${cap(it.n.g)} ${it.n.sg} kostar ${a} kronor och ${it2.n.g} ${it2.n.sg} kostar ${b} kronor. Hur mycket kostar de tillsammans?`,
        expr: `${a} + ${b}`, answer: a + b, e: it.e + it2.e,
        hint: 'Lägg ihop tiotalen först och sen entalen.',
        after: `Tillsammans kostar de ${a + b} kronor.`,
      };
    }
    const pay = level === 2 ? 20 : rng.pick([50, 100]);
    const p = rng.int(level === 2 ? 3 : 12, pay - 2);
    it = itemFor(rng, p);
    return {
      text: `${cap(it.n.g)} ${it.n.sg} kostar ${p} kronor. ${k.name} betalar med ${PAY[pay]}. Hur många kronor får ${k.pron} tillbaka?`,
      expr: `${pay} - ${p}`, answer: pay - p, e: it.e,
      hint: `Räkna uppåt från ${p} till ${pay}.`,
      after: `${k.name} får ${pay - p} kronor tillbaka.`,
    };
  } },
  { id: 'school', lv: [3, 4], kind: 'add', make(level, rng) {
    const [a, b] = storyAddNums(level, rng);
    const v = rng.int(0, 1);
    if (v === 0) {
      return {
        text: `På skolan går ${a} elever. Till hösten börjar ${b} nya elever. Hur många elever går på skolan då?`,
        expr: `${a} + ${b}`, answer: a + b, e: '🏫',
        hint: 'Dela upp talen: lägg ihop hundratal, tiotal och ental var för sig.',
        after: `Då går ${a + b} elever på skolan.`,
      };
    }
    return {
      text: `Klassen samlar burkar till pant. Första veckan samlar de ${a} burkar och andra veckan ${b} burkar. Hur många burkar har de samlat?`,
      expr: `${a} + ${b}`, answer: a + b, e: '🥫',
      hint: 'Lägg ihop – börja med de största delarna.',
      after: `De har samlat ${a + b} burkar.`,
    };
  } },
  { id: 'bus', lv: [3, 4], kind: 'two', make(level, rng) {
    const a = rng.int(level === 3 ? 12 : 25, level === 3 ? 40 : 80);
    const b = rng.int(3, a - 2);
    const c = rng.int(2, level === 3 ? 19 : 35);
    return {
      text: `På bussen sitter ${a} personer. Vid hållplatsen kliver ${b} av och ${c} på. Hur många personer sitter på bussen nu?`,
      expr: `${a} - ${b} + ${c}`, answer: a - b + c, e: '🚌',
      hint: 'Ta ett steg i taget: först de som kliver av, sen de som kliver på.',
      after: `${a} - ${b} = ${a - b}, och ${a - b} + ${c} = ${a - b + c}.`,
    };
  } },
];

/** Väljer en mall som passar nivån och bygger uppgiften. */
export function makeStory(level, rng) {
  const pool = STORY_TEMPLATES.filter((t) => level >= t.lv[0] && level <= t.lv[1]);
  const tpl = rng.pick(pool);
  const s = tpl.make(level, rng);
  return { kind: s.kind || tpl.kind, id: tpl.id, ...s };
}

export function genStory(level, rng) {
  const s = makeStory(level, rng);
  let visual = `<div class="mp-story-pic">${s.e}</div>`;
  if (level <= 1 && s.a !== undefined && s.a + (s.kind === 'add' ? s.b : 0) <= 10 && s.e.length <= 2) {
    visual = s.kind === 'add' ? addPics(s.e, s.a, s.b) : goneGroup(s.e, s.a, s.b);
  }
  return {
    type: level === 0 ? 'choice' : 'numpad',
    prompt: s.text,
    say: s.text,
    visual,
    options: level === 0 ? picChoice(rng, s.answer, 3, { min: 0, max: 8, spread: 2 }) : undefined,
    answer: level === 0 ? String(s.answer) : s.answer,
    hint: s.hint,
    explain: `${s.expr} = ${s.answer}. ${s.after}`,
  };
}

/* ---------- Grupper: gånger som upprepad addition ---------- */
export function genGroups(level, rng) {
  const t = level === 0 ? 2 : rng.pick(level === 1 ? [2, 3] : [2, 5, 10]);
  const k = rng.int(2, level === 0 ? 3 : t === 10 ? 3 : 4);
  const e = rng.pick(THINGS);
  const product = k * t;
  const groups = Array.from({ length: k }, () => `<div class="mp-grp">${emojiGroup(e, t, { size: 's', perRow: 5 })}</div>`).join('');
  const sum = Array.from({ length: k }, () => t).join(' + ');
  return {
    type: level === 0 ? 'choice' : 'numpad',
    prompt: `${cap(NUM_WORDS[k])} grupper med ${t} ${THING_NAMES[e]} i varje. Hur många ${THING_NAMES[e]} är det?`,
    visual: `<div class="mp-groups">${groups}</div>` + (level >= 1 ? `<div class="big-expr sm">${sum} = <span class="blank">?</span></div>` : ''),
    options: level === 0 ? picChoice(rng, product, 3, { min: 1, max: 10, spread: 2 }) : undefined,
    answer: level === 0 ? String(product) : product,
    hint: `Räkna ${t} i taget: ${Array.from({ length: k }, (_, i) => t * (i + 1)).join(', ')}.`,
    explain: `${k} × ${t} = ${product}, eftersom ${sum} = ${product}. "${cap(NUM_WORDS[k])} gånger ${t}" betyder ${NUM_WORDS[k]} grupper med ${t} i varje.`,
  };
}

/* ---------- Mönster med former och växande mönster ---------- */
const PAT_SHAPES = ['cirkel', 'kvadrat', 'triangel', 'rektangel', 'femhörning', 'sexhörning'];
export function genShapePattern(level, rng) {
  const kind = level === 0 ? rng.pick(['AB', 'AB', 'ABC']) : rng.pick(['AAB', 'ABB', 'ABC']);
  const [A, B, C] = rng.sample(PAT_SHAPES, 3);
  const map = { A, B, C };
  const unit = kind.split('').map((c) => map[c]);
  const len = level === 0 ? 6 : 8;
  const seq = Array.from({ length: len + 1 }, (_, i) => unit[i % unit.length]);
  return {
    type: 'choice',
    prompt: 'Vilken form kommer härnäst?',
    say: 'Titta på mönstret. Vilken form kommer härnäst?',
    visual: `<div class="pattern mp-shapepat">${seq.slice(0, len).map((n) => `<span>${shapeSvg(n)}</span>`).join('')}<span class="blank">?</span></div>`,
    options: rng.shuffle([A, B, C]).map((n) => ({ id: n, html: shapeSvg(n), say: '' })),
    answer: seq[len],
    wide: true,
    hint: 'Peka på formerna och säg dem högt. Vilken del upprepas?',
    explain: `Mönstret upprepar ${unit.join(', ')}. Nästa form är en ${seq[len]}.`,
  };
}

/** Antal rutor i figur nr i i ett växande mönster: start + steg·(i−1). */
export const growingCount = (start, step, i) => start + step * (i - 1);
function growingSvg(start, step, figs) {
  const c = 16;
  let x = 6;
  let s = '';
  const maxH = Math.max(start, step);
  const H = maxH * c + 34;
  for (let i = 1; i <= figs; i++) {
    const cols = [start, ...Array.from({ length: i - 1 }, () => step)];
    cols.forEach((h, ci) => {
      for (let r = 0; r < h; r++) s += `<rect x="${x + ci * c}" y="${H - 26 - (r + 1) * c}" width="${c - 2}" height="${c - 2}" rx="2" fill="${ci === 0 ? '#4aa8ff' : '#ff9f1c'}"/>`;
    });
    s += `<text x="${x + (cols.length * c) / 2}" y="${H - 6}" text-anchor="middle" font-size="12" font-weight="700" fill="#23324a">Figur ${i}</text>`;
    x += cols.length * c + 22;
  }
  return `<svg class="mp-growing" viewBox="0 0 ${x} ${H}" role="img" aria-label="växande mönster">${s}</svg>`;
}
export function genGrowing(level, rng) {
  const start = rng.int(1, 3);
  const step = rng.int(level >= 4 ? 2 : 1, 3);
  const ask = level >= 4 ? rng.int(5, 8) : 4;
  const ans = growingCount(start, step, ask);
  return {
    type: 'numpad',
    prompt: `Mönstret växer. Hur många rutor har figur ${ask}?`,
    visual: growingSvg(start, step, 3),
    answer: ans,
    hint: `Hur många rutor kommer till för varje ny figur? (${step})`,
    explain: `Figur 1 har ${start} ${start === 1 ? 'ruta' : 'rutor'} och varje figur får ${step} till. Figur ${ask}: ${start} + ${ask - 1} × ${step} = ${ans}.`,
  };
}

/* ---------- Udda & jämna ---------- */
export const isEven = (n) => n % 2 === 0;
function pairsHtml(e, n) {
  const pairs = [];
  for (let i = 0; i < n; i += 2) {
    const two = i + 1 < n;
    pairs.push(`<span class="mp-pair${two ? '' : ' alone'}"><span>${e}</span>${two ? `<span>${e}</span>` : ''}</span>`);
  }
  return `<div class="mp-pairs" role="img" aria-label="${n} st i par">${pairs.join('')}</div>`;
}
const YES_NO = [
  { id: 'ja', html: '<span class="mp-yn">✅</span><span class="lbl">Ja</span>', say: 'ja' },
  { id: 'nej', html: '<span class="mp-yn">❌</span><span class="lbl">Nej</span>', say: 'nej' },
];
const ODD_EVEN_OPTS = [
  { id: 'jämnt', label: 'jämnt', say: 'jämnt' },
  { id: 'udda', label: 'udda', say: 'udda' },
];
const oddEvenFact = 'Jämna tal slutar på 0, 2, 4, 6 eller 8. Udda tal slutar på 1, 3, 5, 7 eller 9.';
export function genOddEven(level, rng) {
  const e = rng.pick(['🧦', '👟', '🧤', '🐥', '🐞', '🍒', '🎈']);
  if (level === 0 || (level === 1 && rng.chance(0.5))) {
    const n = rng.int(2, level === 0 ? 8 : 12);
    const even = isEven(n);
    return {
      type: 'choice',
      prompt: 'Kan alla få en kompis i ett par?',
      say: 'Titta på paren. Får alla en kompis? Tryck på bocken för ja eller krysset för nej.',
      visual: pairsHtml(e, n),
      options: YES_NO,
      answer: even ? 'ja' : 'nej',
      hint: 'Finns det någon som står ensam utan kompis?',
      explain: even ? `Ja! ${n} går att dela i par. ${n} är ett jämnt tal.` : `Nej, en blir ensam. ${n} är ett udda tal.`,
    };
  }
  if (level === 1) {
    const n = rng.int(1, 10);
    return {
      type: 'choice',
      prompt: `Är ${n} ett udda eller ett jämnt tal?`,
      visual: pairsHtml(e, n),
      options: ODD_EVEN_OPTS,
      answer: isEven(n) ? 'jämnt' : 'udda',
      hint: 'Om alla har en kompis är talet jämnt. Blir en ensam är det udda.',
      explain: isEven(n) ? `${n} är jämnt – alla får en kompis.` : `${n} är udda – en blir över.`,
    };
  }
  if (level === 4 && rng.chance(0.5)) {
    const a = rng.int(11, 499);
    const b = rng.int(11, 499);
    const sum = a + b;
    const rule = isEven(a) === isEven(b) ? (isEven(a) ? 'jämnt + jämnt' : 'udda + udda') : 'udda + jämnt';
    return {
      type: 'choice',
      prompt: `Blir ${a} + ${b} ett udda eller ett jämnt tal? Försök utan att räkna ut summan!`,
      say: `Blir ${a} plus ${b} udda eller jämnt?`,
      visual: `<div class="big-expr sm">${a} + ${b}</div>`,
      options: ODD_EVEN_OPTS,
      answer: isEven(sum) ? 'jämnt' : 'udda',
      hint: 'Titta bara på entalssiffrorna. Udda + udda blir jämnt – de två ensamma blir ett par!',
      explain: `${rule} blir ${isEven(sum) ? 'jämnt' : 'udda'}. ${a} + ${b} = ${sum}.`,
    };
  }
  const max = level === 2 ? 20 : level === 3 ? 100 : 1000;
  if (rng.chance(0.5)) {
    const wantEven = rng.chance(0.5);
    const pickP = (even) => { let n; do n = rng.int(0, max); while (isEven(n) !== even); return n; };
    const ans = pickP(wantEven);
    const opts = new Set([ans]);
    while (opts.size < 3) opts.add(pickP(!wantEven));
    return {
      type: 'choice',
      prompt: `Vilket tal är ${wantEven ? 'jämnt' : 'udda'}?`,
      options: rng.shuffle([...opts]).map(numOpt),
      answer: String(ans),
      hint: 'Titta på entalssiffran – den sista siffran.',
      explain: `${ans} är ${wantEven ? 'jämnt' : 'udda'} eftersom det slutar på ${ans % 10}. ${oddEvenFact}`,
    };
  }
  const n = rng.int(level === 2 ? 0 : 21, max - 1);
  return {
    type: 'choice',
    prompt: `Är ${n} ett udda eller ett jämnt tal?`,
    visual: `<div class="big-expr">${n}</div>`,
    options: ODD_EVEN_OPTS,
    answer: isEven(n) ? 'jämnt' : 'udda',
    hint: 'Titta på entalssiffran – den sista siffran.',
    explain: `${n} slutar på ${n % 10}, så det är ${isEven(n) ? 'jämnt' : 'udda'}. ${oddEvenFact}`,
  };
}

/* ---------- Bråk ---------- */
const DEN = { 2: ['halv', 'halvor'], 3: ['tredjedel', 'tredjedelar'], 4: ['fjärdedel', 'fjärdedelar'], 5: ['femtedel', 'femtedelar'], 6: ['sjättedel', 'sjättedelar'], 8: ['åttondel', 'åttondelar'], 10: ['tiondel', 'tiondelar'] };
/** "en halv", "två tredjedelar", "tre fjärdedelar" */
export function fracName(n, d) {
  return n === 1 ? `en ${DEN[d][0]}` : `${NUM_WORDS[n]} ${DEN[d][1]}`;
}
/** n/d av ett antal (antalet måste vara delbart med d). */
export const fractionOf = (n, d, total) => (total / d) * n;
/** "hälften" i stället för "en halv" när man tar en del av ett antal. */
const partName = (n, d) => (n === 1 && d === 2 ? 'hälften' : fracName(n, d));
const fracHtml = (n, d) => `<span class="mp-frac"><span>${n}</span><span>${d}</span></span>`;
const fracOpt = (n, d) => ({ id: `${n}/${d}`, html: `${fracHtml(n, d)}<span class="lbl">${fracName(n, d)}</span>`, say: fracName(n, d) });

/** Pizza (cirkel) eller chokladkaka (rektangel) delad i bitar. sizes = andelar som summerar till 1. */
export function fracSvg(kind, sizes, filled = 0, color = '#ff9f1c') {
  const stroke = 'stroke="#23324a" stroke-width="3" stroke-linejoin="round"';
  const empty = kind === 'pizza' ? '#fff1cf' : '#c89b74';
  const fillC = kind === 'pizza' ? color : '#6b3e1f';
  let s = '';
  if (kind === 'pizza') {
    const cx = 60, cy = 60, r = 50;
    if (sizes.length === 1) s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${filled ? fillC : empty}" ${stroke}/>`;
    else {
      let acc = 0;
      sizes.forEach((p, i) => {
        const a0 = acc * 2 * Math.PI - Math.PI / 2;
        acc += p;
        const a1 = acc * 2 * Math.PI - Math.PI / 2;
        const x0 = (cx + r * Math.cos(a0)).toFixed(1), y0 = (cy + r * Math.sin(a0)).toFixed(1);
        const x1 = (cx + r * Math.cos(a1)).toFixed(1), y1 = (cy + r * Math.sin(a1)).toFixed(1);
        s += `<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${x1} ${y1} Z" fill="${i < filled ? fillC : empty}" ${stroke}/>`;
      });
    }
    return `<svg class="mp-fracsvg" viewBox="0 0 120 120" role="img" aria-label="pizza i ${sizes.length} bitar">${s}</svg>`;
  }
  const W = 140, H = 70;
  let x = 5;
  sizes.forEach((p, i) => {
    const w = p * W;
    s += `<rect x="${x.toFixed(1)}" y="5" width="${w.toFixed(1)}" height="${H}" fill="${i < filled ? fillC : empty}" ${stroke}/>`;
    x += w;
  });
  return `<svg class="mp-fracsvg" viewBox="0 0 150 80" role="img" aria-label="chokladkaka i ${sizes.length} bitar">${s}</svg>`;
}
const equalSizes = (d) => Array.from({ length: d }, () => 1 / d);
const UNEQUAL = { 2: [0.3, 0.7], 3: [0.2, 0.3, 0.5], 4: [0.15, 0.2, 0.3, 0.35] };

export function genFraction(level, rng) {
  const kind = rng.pick(['pizza', 'choklad']);
  const thing = kind === 'pizza' ? 'pizzan' : 'chokladkakan';
  if (level === 0 || (level === 1 && rng.chance(0.5))) {
    const d = level === 0 ? 2 : rng.pick([2, 4]);
    const opts = [
      { id: 'lika', html: fracSvg(kind, equalSizes(d)), say: '' },
      { id: 'olika', html: fracSvg(kind, UNEQUAL[d]), say: '' },
    ];
    if (level === 1) opts.push({ id: 'annat', html: fracSvg(kind, equalSizes(d === 2 ? 3 : 2)), say: '' });
    return {
      type: 'choice',
      prompt: `Vilken ${kind === 'pizza' ? 'pizza' : 'chokladkaka'} är delad i ${NUM_WORDS[d]} lika stora bitar?`,
      say: `Vilken ${kind === 'pizza' ? 'pizza' : 'chokladkaka'} är delad i ${NUM_WORDS[d]} lika stora bitar? Då blir det rättvist!`,
      options: rng.shuffle(opts),
      answer: 'lika',
      wide: true,
      hint: `Räkna bitarna. Är alla bitar lika stora?`,
      explain: d === 2 ? 'Två lika stora delar kallas halvor. Varje del är en halv.' : 'Fyra lika stora delar kallas fjärdedelar.',
    };
  }
  if (level === 1) {
    const d = rng.int(2, 6);
    return {
      type: 'choice',
      prompt: `I hur många lika stora bitar är ${thing} delad?`,
      visual: fracSvg(kind, equalSizes(d)),
      options: choice(rng, d, 3, { min: 1, max: 8, spread: 2 }),
      answer: String(d),
      hint: 'Peka på varje bit och räkna.',
      explain: `${cap(thing)} är delad i ${d} lika stora bitar. Varje bit är ${fracName(1, d)}.`,
    };
  }
  if (level === 2) {
    const ds = rng.shuffle([2, 3, 4]);
    const d = ds[0];
    if (rng.chance(0.5)) {
      return {
        type: 'choice',
        prompt: `Hur stor del av ${thing} är färgad?`,
        visual: fracSvg(kind, equalSizes(d), 1),
        options: rng.shuffle(ds.map((x) => fracOpt(1, x))),
        answer: `1/${d}`,
        hint: 'Räkna hur många lika stora bitar det finns totalt.',
        explain: `${cap(thing)} har ${d} lika stora bitar och en är färgad. Det är ${fracName(1, d)}, som skrivs 1/${d}.`,
      };
    }
    return {
      type: 'choice',
      prompt: `Var är ${fracName(1, d)} av ${thing} färgad?`,
      options: rng.shuffle(ds.map((x) => ({ id: String(x), html: fracSvg(kind, equalSizes(x), 1), say: '' }))),
      answer: String(d),
      wide: true,
      hint: `${cap(fracName(1, d))} betyder att det hela är delat i ${d} lika stora bitar.`,
      explain: `${cap(fracName(1, d))} (1/${d}) är en bit av ${d} lika stora.`,
    };
  }
  if (level === 3) {
    if (rng.chance(0.5)) {
      const d = rng.pick([2, 3, 4]);
      const t = rng.int(2, 5);
      const f = rng.pick(FOOD);
      const total = d * t;
      return {
        type: 'numpad',
        prompt: `${cap(partName(1, d))} av ${total} ${f.n.pl} – hur många är det?`,
        visual: `<div class="mp-fracrows">${Array.from({ length: d }, () => emojiGroup(f.e, t, { size: 's', perRow: 6 })).join('')}</div>`,
        answer: t,
        hint: `Dela ${total} i ${d} lika stora högar. Hur många blir det i en hög?`,
        explain: `${total} delat i ${d} lika delar blir ${t} i varje. ${cap(partName(1, d))} av ${total} är ${t}.`,
      };
    }
    const d = rng.pick([3, 4, 6, 8]);
    const n = rng.int(2, d - 1);
    const wrong = new Set();
    while (wrong.size < 2) {
      const dd = rng.pick([3, 4, 6, 8]);
      const nn = rng.int(1, dd - 1);
      if (nn * d !== n * dd) wrong.add(`${nn}/${dd}`); // inga likvärdiga bråk som fel svar
    }
    return {
      type: 'choice',
      prompt: `Hur stor del av ${thing} är färgad?`,
      visual: fracSvg(kind, equalSizes(d), n),
      options: rng.shuffle([`${n}/${d}`, ...wrong]).map((k) => fracOpt(...k.split('/').map(Number))),
      answer: `${n}/${d}`,
      hint: 'Nämnaren (talet under strecket) är antalet bitar. Täljaren (talet över) är de färgade bitarna.',
      explain: `${n} av ${d} lika stora bitar är färgade: ${fracName(n, d)} = ${n}/${d}.`,
    };
  }
  // nivå 4
  const v = rng.int(0, 2);
  if (v === 0) {
    const d = rng.pick([2, 3, 4, 5, 10]);
    const n = rng.int(1, d - 1);
    const t = rng.int(2, 10);
    const total = d * t;
    return {
      type: 'numpad',
      prompt: `Vad är ${partName(n, d)} av ${total}?`,
      say: `Vad är ${partName(n, d)} av ${total}?`,
      visual: `<div class="big-expr sm">${fracHtml(n, d)} av ${total}</div>`,
      answer: fractionOf(n, d, total),
      hint: `Ta först ${fracName(1, d)}: ${total} ÷ ${d}. Ta sedan det ${n} gånger.`,
      explain: `${total} ÷ ${d} = ${t}, och ${n} × ${t} = ${n * t}. Så ${partName(n, d)} av ${total} är ${n * t}.`,
    };
  }
  if (v === 1) {
    const d = rng.pick([2, 3, 4]);
    const w = rng.int(2, 5);
    return {
      type: 'numpad',
      prompt: `Hur många ${DEN[d][1]} går det på ${w} hela pizzor?`,
      visual: `<div class="mp-pizzarow">${Array.from({ length: w }, () => fracSvg('pizza', equalSizes(d))).join('')}</div>`,
      answer: d * w,
      hint: `En hel pizza har ${d} ${DEN[d][1]}.`,
      explain: `En hel är ${d} ${DEN[d][1]}, så ${w} hela är ${w} × ${d} = ${w * d} ${DEN[d][1]}.`,
    };
  }
  const ds = rng.sample([2, 3, 4, 8], 3);
  const big = rng.chance(0.5);
  const ans = big ? Math.min(...ds) : Math.max(...ds);
  return {
    type: 'choice',
    prompt: `Tre lika stora pizzor. Vilken bit är ${big ? 'störst' : 'minst'}?`,
    options: rng.shuffle(ds).map((d) => fracOpt(1, d)),
    answer: `1/${ans}`,
    hint: 'Ju fler bitar en pizza delas i, desto mindre blir varje bit.',
    explain: `${cap(fracName(1, ans))} är ${big ? 'störst' : 'minst'}, eftersom pizzan är delad i ${big ? 'minst' : 'flest'} bitar.`,
  };
}

/* ---------- Pengar ---------- */
const NOTE_COLORS = { 20: '#9b6bd6', 50: '#ff9f1c', 100: '#4a90e2', 200: '#3fb67a', 500: '#e0483a' };
const MONEY_NAMES = { 1: 'enkrona', 2: 'tvåkrona', 5: 'femkrona', 10: 'tiokrona', 20: 'tjugolapp', 50: 'femtiolapp', 100: 'hundralapp', 200: 'tvåhundralapp', 500: 'femhundralapp' };
function coinSvg(v) {
  const r = { 1: 20, 2: 23, 5: 25, 10: 22 }[v];
  const fill = v === 10 ? '#f2c94c' : '#cfd5df';
  const edge = v === 10 ? '#b8860b' : '#7d8799';
  return `<svg class="mp-coin" viewBox="0 0 56 56" role="img" aria-label="${v} krona"><circle cx="28" cy="28" r="${r}" fill="${fill}" stroke="${edge}" stroke-width="3"/><circle cx="28" cy="28" r="${r - 5}" fill="none" stroke="${edge}" stroke-width="1" opacity=".6"/><text x="28" y="${v === 10 ? 34 : 35}" text-anchor="middle" font-size="${v === 10 ? 17 : 20}" font-weight="800" fill="#23324a">${v}</text></svg>`;
}
function noteSvg(v) {
  return `<svg class="mp-note" viewBox="0 0 104 56" role="img" aria-label="${v} kronor"><rect x="2" y="2" width="100" height="52" rx="6" fill="${NOTE_COLORS[v]}" stroke="#23324a" stroke-width="2"/><rect x="8" y="8" width="88" height="40" rx="4" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/><text x="52" y="37" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${v} kr</text></svg>`;
}
export const sumMoney = (list) => list.reduce((s, v) => s + v, 0);
/** Ritar pengar, största först. */
export function moneyHtml(list) {
  const sorted = [...list].sort((a, b) => b - a);
  return `<div class="mp-money">${sorted.map((v) => (v >= 20 ? noteSvg(v) : coinSvg(v))).join('')}</div>`;
}
function randomMoney(rng, kinds, count) {
  return Array.from({ length: count }, () => rng.pick(kinds));
}

export function genMoney(level, rng) {
  if (level === 0) {
    const n = rng.int(1, 5);
    return {
      type: 'choice',
      prompt: 'Hur många kronor är det?',
      say: 'Varje mynt är en krona. Hur många kronor är det?',
      visual: moneyHtml(Array(n).fill(1)),
      options: picChoice(rng, n, 3, { min: 1, max: 7, spread: 2 }),
      answer: String(n),
      hint: 'Peka på varje mynt och räkna.',
      explain: `${n === 1 ? 'En enkrona är' : `${n} enkronor är`} ${n} ${n === 1 ? 'krona' : 'kronor'}.`,
    };
  }
  if (level === 1 && rng.chance(0.35)) {
    const vals = rng.sample([1, 2, 5, 10], 3);
    const most = rng.chance(0.6);
    const ans = most ? Math.max(...vals) : Math.min(...vals);
    return {
      type: 'choice',
      prompt: `Vilket mynt är värt ${most ? 'mest' : 'minst'}?`,
      options: vals.map((v) => ({ id: String(v), html: coinSvg(v), say: '' })),
      answer: String(ans),
      hint: 'Titta på siffran på myntet, inte på hur stort det är!',
      explain: `${cap(MONEY_NAMES[ans])}n är värd ${ans} ${ans === 1 ? 'krona' : 'kronor'}.`,
    };
  }
  if (level === 3 && rng.chance(0.35)) {
    // Vilka pengar är exakt x kronor?
    const kinds = [1, 2, 5, 10, 20, 50, 100];
    const right = randomMoney(rng, kinds, rng.int(3, 4));
    const x = sumMoney(right);
    const opts = [right];
    let guard = 0;
    while (opts.length < 3 && guard++ < 50) {
      const w = [...right];
      const i = rng.int(0, w.length - 1);
      w[i] = rng.pick(kinds.filter((k) => k !== w[i]));
      if (!opts.some((o) => sumMoney(o) === sumMoney(w))) opts.push(w);
    }
    return {
      type: 'choice',
      prompt: `Var finns det exakt ${x} kronor?`,
      options: rng.shuffle(opts.map((o, i) => ({ id: i === 0 ? 'rätt' : `fel${i}`, html: moneyHtml(o), say: '' }))),
      answer: 'rätt',
      wide: true,
      hint: 'Räkna sedlarna först och sen mynten.',
      explain: `${[...right].sort((a, b) => b - a).join(' + ')} = ${x} kronor.`,
    };
  }
  if (level >= 2 && rng.chance(0.3)) {
    const k = kid(rng);
    const have = randomMoney(rng, level === 2 ? [1, 2, 5, 10, 20] : [5, 10, 20, 50, 100], level === 2 ? 3 : 4);
    const sum = sumMoney(have);
    let price = sum + rng.pick([-7, -4, -2, -1, 1, 2, 4, 6]) * (level >= 3 ? 3 : 1);
    if (price < 2) price = sum + 2;
    const it = itemFor(rng, price);
    const ok = sum >= price;
    return {
      type: 'choice',
      prompt: `${k.name} vill köpa ${it.n.g} ${it.n.sg} för ${price} kronor. Räcker pengarna?`,
      visual: moneyHtml(have),
      options: YES_NO,
      answer: ok ? 'ja' : 'nej',
      hint: 'Räkna ihop pengarna först. Är det lika mycket eller mer än priset?',
      explain: `${k.name} har ${kr(sum)}. ${ok ? `Det räcker${sum > price ? ` – och ${kr(sum - price)} blir över` : ' precis'}.` : `Det fattas ${kr(price - sum)}.`}`,
    };
  }
  if (level === 4 && rng.chance(0.5)) {
    const k = kid(rng);
    const pay = rng.pick([100, 200, 500]);
    const price = rng.int(Math.floor(pay / 5), pay - 3);
    const it = itemFor(rng, price);
    return {
      type: 'numpad',
      prompt: `${cap(it.n.g)} ${it.n.sg} kostar ${price} kronor. ${k.name} betalar med ${PAY[pay]}. Hur många kronor får ${k.pron} tillbaka?`,
      visual: moneyHtml([pay]),
      answer: pay - price,
      hint: `Räkna uppåt från ${price}: först till närmaste tiotal, sen till närmaste hundratal, sen till ${pay}.`,
      explain: `${pay} - ${price} = ${pay - price}. Kontroll: ${price} + ${pay - price} = ${pay}.`,
    };
  }
  const kinds = level === 1 ? [1, 2, 5] : level === 2 ? [1, 2, 5, 10, 20] : level === 3 ? [1, 2, 5, 10, 20, 50, 100] : [5, 10, 20, 50, 100, 200, 500];
  const count = level === 1 ? rng.int(2, 3) : rng.int(3, 5);
  let list = randomMoney(rng, kinds, count);
  if (level === 1) while (sumMoney(list) > 10) list = randomMoney(rng, kinds, count);
  const sum = sumMoney(list);
  return {
    type: 'numpad',
    prompt: 'Hur många kronor är det tillsammans?',
    visual: moneyHtml(list),
    answer: sum,
    hint: 'Börja med det som är värt mest och räkna vidare uppåt.',
    explain: `${[...list].sort((a, b) => b - a).join(' + ')} = ${sum} kronor.`,
  };
}

/* ---------- Uppställning (skriftlig räkning) ---------- */
export function hasCarry(a, b) {
  while (a || b) {
    if ((a % 10) + (b % 10) >= 10) return true;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return false;
}
/** Måste man växla när man räknar a − b (a ≥ b) i uppställning? */
export function hasBorrow(a, b) {
  while (b) {
    if (a % 10 < b % 10) return true;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return false;
}
const PLACE_NAMES = ['Ental', 'Tiotal', 'Hundratal', 'Tusental'];
/** Steg-för-steg-förklaring av uppställningen. */
export function columnSteps(a, b, op) {
  const steps = [];
  let carry = 0;
  let i = 0;
  let x = a;
  let y = b;
  while (x || y) {
    const da = x % 10;
    const db = y % 10;
    if (op === '+') {
      const s = da + db + carry;
      steps.push(`${PLACE_NAMES[i]}: ${da} + ${db}${carry ? ' + 1' : ''} = ${s}${s >= 10 ? ` – skriv ${s % 10} och 1 i minnet` : ''}`);
      carry = s >= 10 ? 1 : 0;
    } else {
      const d = da - carry;
      const top = `${da}${carry ? ' - 1 (växlat)' : ''}`;
      if (d < db) {
        steps.push(`${PLACE_NAMES[i]}: ${top} räcker inte till ${db} – växla ett ${PLACE_NAMES[i + 1].toLowerCase()}: ${d + 10} - ${db} = ${d + 10 - db}`);
        carry = 1;
      } else {
        steps.push(`${PLACE_NAMES[i]}: ${top} - ${db} = ${d - db}`);
        carry = 0;
      }
    }
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
    i++;
  }
  if (op === '+' && carry) steps.push(`${PLACE_NAMES[i]}: 1 från minnet`);
  return steps;
}
function columnHtml(a, b, op, showHeads) {
  const res = op === '+' ? a + b : a - b;
  const w = Math.max(String(a).length, String(b).length, String(res).length);
  const pad = (n) => String(n).padStart(w, ' ').split('').map((c) => `<td>${c.trim()}</td>`).join('');
  const heads = showHeads ? `<tr class="mp-heads"><td></td>${['T', 'H', 'T', 'E'].slice(4 - w).map((h, i) => `<td>${w === 4 && i === 0 ? 'Tu' : h}</td>`).join('')}</tr>` : '';
  const blanks = Array.from({ length: w }, () => '<td><span class="mp-cell">?</span></td>').join('');
  return `<table class="mp-column" role="img" aria-label="uppställning ${a} ${op === '+' ? 'plus' : 'minus'} ${b}">${heads}<tr><td></td>${pad(a)}</tr><tr><td>${op}</td>${pad(b)}</tr><tr class="mp-sum"><td></td>${blanks}</tr></table>`;
}
function pickColumn(rng, lo, hi, op, wantSwap, maxRes) {
  for (let g = 0; g < 400; g++) {
    let a = rng.int(lo[0], lo[1]);
    let b = rng.int(hi[0], hi[1]);
    if (op === '-' && b > a) [a, b] = [b, a];
    if (op === '-' && a === b) continue;
    const swap = op === '+' ? hasCarry(a, b) : hasBorrow(a, b);
    const res = op === '+' ? a + b : a - b;
    if (swap === wantSwap && res <= maxRes) return [a, b];
  }
  return op === '+' ? [lo[0], hi[0]] : [lo[1], hi[0]];
}
export function genColumn(level, rng) {
  const op = level === 0 || rng.chance(0.55) ? '+' : '-';
  let a;
  let b;
  if (level <= 1) [a, b] = pickColumn(rng, [10, 19], [1, 8], op, false, 99);
  else if (level === 2) [a, b] = pickColumn(rng, [20, 89], [10, 69], op, false, 99);
  else if (level === 3) [a, b] = pickColumn(rng, [20, 89], [12, 79], op, true, 99);
  else [a, b] = pickColumn(rng, [150, 899], [105, 699], op, rng.chance(0.85), 999);
  const ans = op === '+' ? a + b : a - b;
  const swap = op === '+' ? hasCarry(a, b) : hasBorrow(a, b);
  return {
    type: 'numpad',
    prompt: `Räkna med uppställning: ${a} ${op} ${b}`,
    say: `Räkna ${a} ${op === '+' ? 'plus' : 'minus'} ${b} med uppställning. Börja med entalen.`,
    visual: columnHtml(a, b, op, level >= 2),
    answer: ans,
    hint: swap
      ? op === '+'
        ? 'Börja med entalen. Blir det 10 eller mer? Skriv entalet och lägg 1 i minnet ovanför nästa kolumn.'
        : 'Börja med entalen. Räcker de inte? Växla ett tiotal till tio ental.'
      : 'Börja alltid med entalen längst till höger, sen tiotalen.',
    explain: `${columnSteps(a, b, op).join('. ')}. Svaret är ${ans}.`,
  };
}

/* ---------- Mått & ungefär ---------- */
const HEAVY = [
  [['🐘', 'elefanten'], ['🐭', 'musen']], [['🚗', 'bilen'], ['🚲', 'cykeln']], [['🐴', 'hästen'], ['🐱', 'katten']],
  [['🍉', 'vattenmelonen'], ['🍓', 'jordgubben']], [['🪨', 'stenen'], ['🪶', 'fjädern']], [['🐻', 'björnen'], ['🐿️', 'ekorren']],
];
const LONG = [
  [['🚆', 'tåget'], ['🚗', 'bilen']], [['🦒', 'giraffen'], ['🐰', 'kaninen']], [['🐍', 'ormen'], ['🐛', 'larven']],
  [['🌳', 'trädet'], ['🌷', 'tulpanen']], [['🐋', 'valen'], ['🐟', 'fisken']],
];
const HOLDS = [
  [['🛁', 'badkaret'], ['☕', 'koppen']], [['🪣', 'hinken'], ['🥄', 'skeden']], [['🏊', 'simbassängen'], ['🛁', 'badkaret']],
];
const COMPARE_Q = [
  { list: HEAVY, big: 'Vilken är tyngst?', small: 'Vilken är lättast?', bigW: 'är tyngre' },
  { list: LONG, big: 'Vilken är längst?', small: 'Vilken är kortast?', bigW: 'är längre' },
  { list: HOLDS, big: 'Vilken rymmer mest vatten?', small: 'Vilken rymmer minst vatten?', bigW: 'rymmer mer vatten' },
];
const TOOLS = [
  { id: 'linjal', e: '📏', what: 'hur lång en penna är' },
  { id: 'våg', e: '⚖️', what: 'hur mycket du väger' },
  { id: 'klocka', e: '⏰', what: 'hur lång tid en film är' },
  { id: 'litermått', e: '🥛', what: 'hur mycket mjölk som behövs i pannkakssmeten' },
];
// Rimliga mått (barnvänligt avrundade). fam = enhetsfamilj för felaktiga alternativ.
export const SIZE_FACTS = [
  { q: 'Ungefär hur hög är en dörr?', v: 2, u: 'm', fam: 'len' },
  { q: 'Ungefär hur lång är en fotbollsplan?', v: 100, u: 'm', fam: 'len' },
  { q: 'Ungefär hur lång är en blyertspenna?', v: 18, u: 'cm', fam: 'len' },
  { q: 'Ungefär hur lång är en gaffel?', v: 20, u: 'cm', fam: 'len' },
  { q: 'Ungefär hur hög kan en giraff bli?', v: 5, u: 'm', fam: 'len' },
  { q: 'Ungefär hur långt är det mellan Göteborg och Stockholm?', v: 400, u: 'km', fam: 'len' },
  { q: 'Ungefär hur bred är din tumnagel?', v: 1, u: 'cm', fam: 'len' },
  { q: 'Ungefär hur mycket väger ett paket med en liter mjölk?', v: 1, u: 'kg', fam: 'mass' },
  { q: 'Ungefär hur mycket väger ett äpple?', v: 150, u: 'g', fam: 'mass' },
  { q: 'Ungefär hur mycket väger en katt?', v: 4, u: 'kg', fam: 'mass' },
  { q: 'Ungefär hur mycket väger en personbil?', v: 1500, u: 'kg', fam: 'mass' },
  { q: 'Ungefär hur mycket väger en vuxen afrikansk elefant?', v: 5, u: 'ton', fam: 'mass' },
  { q: 'Ungefär hur mycket väger en 9-åring?', v: 30, u: 'kg', fam: 'mass' },
  { q: 'Ungefär hur mycket rymmer ett vanligt dricksglas?', v: 2, u: 'dl', fam: 'vol' },
  { q: 'Ungefär hur mycket rymmer en hink?', v: 10, u: 'l', fam: 'vol' },
  { q: 'Ungefär hur mycket rymmer ett badkar?', v: 200, u: 'l', fam: 'vol' },
  { q: 'Ungefär hur mycket rymmer en tesked?', v: 5, u: 'ml', fam: 'vol' },
  { q: 'Ungefär hur mycket rymmer en liten vattenflaska?', v: 5, u: 'dl', fam: 'vol' },
  { q: 'Hur länge ska man borsta tänderna?', v: 2, u: 'minuter', fam: 'time' },
  { q: 'Hur lång är en fotbollsmatch för vuxna (utan paus)?', v: 90, u: 'minuter', fam: 'time' },
  { q: 'Ungefär hur länge sover ett barn på natten?', v: 10, u: 'timmar', fam: 'time' },
  { q: 'Ungefär hur länge är sommarlovet?', v: 10, u: 'veckor', fam: 'time' },
];
const FAMILIES = { len: ['cm', 'm', 'km'], mass: ['g', 'kg', 'ton'], vol: ['ml', 'dl', 'l'], time: ['sekunder', 'minuter', 'timmar', 'veckor'] };
const UNIT_SAY = { cm: 'centimeter', m: 'meter', km: 'kilometer', g: 'gram', kg: 'kilo', ton: 'ton', ml: 'milliliter', dl: 'deciliter', l: 'liter' };
// Enhetsomvandlingar: 1 big = f small
export const CONVERSIONS = [
  { big: 'm', bigSay: 'meter', small: 'cm', smallSay: 'centimeter', f: 100 },
  { big: 'km', bigSay: 'kilometer', small: 'm', smallSay: 'meter', f: 1000 },
  { big: 'l', bigSay: 'liter', small: 'dl', smallSay: 'deciliter', f: 10 },
  { big: 'kg', bigSay: 'kilo', small: 'g', smallSay: 'gram', f: 1000 },
  { big: 'timmar', bigSay: 'timmar', small: 'minuter', smallSay: 'minuter', f: 60, one: 'timme' },
  { big: 'dygn', bigSay: 'dygn', small: 'timmar', smallSay: 'timmar', f: 24 },
  { big: 'veckor', bigSay: 'veckor', small: 'dagar', smallSay: 'dagar', f: 7, one: 'vecka' },
];
/** Avrundning till närmaste tiotal/hundratal (för överslag). */
export const roundTo = (n, step) => Math.round(n / step) * step;
function pickNoHalf(rng, lo, hi, step) {
  let n;
  do n = rng.int(lo, hi); while ((n % step) === step / 2 || n % step === 0);
  return n;
}

export function genUnits(level, rng) {
  if (level <= 1 && (level === 0 || rng.chance(0.5))) {
    const cq = rng.pick(COMPARE_Q);
    const pair = rng.pick(cq.list);
    const askBig = rng.chance(0.6);
    const [big, small] = pair;
    const ans = askBig ? big : small;
    return {
      type: 'choice',
      prompt: askBig ? cq.big : cq.small,
      options: rng.shuffle(pair.map(([e, name]) => ({ id: name, html: `<span class="pic sm">${e}</span>`, say: name }))),
      answer: ans[1],
      hint: 'Tänk dig att du har dem framför dig. Vilken skulle du orka bära, eller vilken är störst?',
      explain: `${cap(big[1])} ${cq.bigW} än ${small[1]}.`,
    };
  }
  if (level === 1) {
    const t = rng.pick(TOOLS);
    return {
      type: 'choice',
      prompt: `Vad använder du för att mäta ${t.what}?`,
      options: rng.shuffle(TOOLS).map((x) => ({ id: x.id, html: `<span class="pic sm">${x.e}</span><span class="lbl">${x.id}</span>`, say: x.id })),
      answer: t.id,
      hint: 'Längd, vikt, tid eller hur mycket det rymmer – vad är det du vill veta?',
      explain: { linjal: 'Med en linjal mäter man längd.', våg: 'Med en våg mäter man hur mycket något väger.', klocka: 'Med en klocka mäter man tid.', litermått: 'Med ett litermått mäter man hur mycket något rymmer – volym.' }[t.id],
    };
  }
  if (level === 2 || (level === 3 && rng.chance(0.25))) {
    const f = rng.pick(SIZE_FACTS);
    const others = rng.sample(FAMILIES[f.fam].filter((u) => u !== f.u), 2);
    const opts = [f.u, ...others].map((u) => ({ id: u, label: `${f.v} ${u}`, say: `${f.v} ${UNIT_SAY[u] || u}` }));
    return {
      type: 'choice',
      prompt: f.q,
      options: rng.shuffle(opts),
      answer: f.u,
      hint: 'Tänk på något du känner till: en meter är ungefär ett stort kliv, ett kilo väger som ett mjölkpaket.',
      explain: `Ungefär ${f.v} ${UNIT_SAY[f.u] || f.u}. ${f.v} ${others[0]} eller ${f.v} ${others[1]} vore inte alls rimligt.`,
    };
  }
  const v = rng.int(0, 2);
  if (v === 0) {
    // Överslag
    const step = level === 3 ? 10 : 100;
    const a = level === 3 ? pickNoHalf(rng, 12, 88, 10) : pickNoHalf(rng, 120, 780, 100);
    const b = level === 3 ? pickNoHalf(rng, 12, Math.min(88, 99 - a + 5), 10) : pickNoHalf(rng, 120, Math.min(780, 999 - a + 50), 100);
    const minus = rng.chance(0.35) && a > b + step;
    const est = minus ? roundTo(a, step) - roundTo(b, step) : roundTo(a, step) + roundTo(b, step);
    const optsSet = new Set([est]);
    for (const d of rng.shuffle([-2, -1, 1, 2])) if (optsSet.size < 3 && est + d * step > 0) optsSet.add(est + d * step);
    const exact = minus ? a - b : a + b;
    return {
      type: 'choice',
      prompt: `Gör ett överslag! Ungefär hur mycket är ${a} ${minus ? '-' : '+'} ${b}?`,
      say: `Ungefär hur mycket är ${a} ${minus ? 'minus' : 'plus'} ${b}? Avrunda först.`,
      options: rng.shuffle([...optsSet]).map(numOpt),
      answer: String(est),
      hint: `Avrunda båda talen till närmaste ${step === 10 ? 'tiotal' : 'hundratal'} först.`,
      explain: `${a} är ungefär ${roundTo(a, step)} och ${b} är ungefär ${roundTo(b, step)}. ${roundTo(a, step)} ${minus ? '-' : '+'} ${roundTo(b, step)} = ${est}. (Exakt: ${exact}.)`,
    };
  }
  if (v === 1) {
    // Rimlighetsbedömning
    const k = kid(rng);
    const a = level === 3 ? rng.int(15, 60) : rng.int(120, 600);
    const b = level === 3 ? rng.int(12, 39) : rng.int(110, 390);
    const right = a + b;
    // bara tydligt orimliga fel – ett svar som är lite fel kan ju se rimligt ut
    const wrongs = level === 3 ? [right + 100, right * 10, a - b] : [right + 1000, right * 10, Math.abs(a - b)];
    const correct = rng.chance(0.4);
    const shown = correct ? right : rng.pick(wrongs.filter((x) => x > 0 && x !== right));
    return {
      type: 'choice',
      prompt: `${k.name} räknade ${a} + ${b} = ${shown}. Är svaret rimligt?`,
      say: `${k.name} räknade ${a} plus ${b} och fick ${shown}. Är svaret rimligt?`,
      options: YES_NO,
      answer: correct ? 'ja' : 'nej',
      hint: `Gör ett överslag: ungefär ${roundTo(a, level === 3 ? 10 : 100)} + ${roundTo(b, level === 3 ? 10 : 100)}.`,
      explain: correct ? `Ja! ${a} + ${b} = ${right}, och det stämmer med överslaget.` : `Nej, ${a} + ${b} = ${right}. ${shown} är alldeles för ${shown > right ? 'mycket' : 'lite'} – ett överslag hade avslöjat det.`,
    };
  }
  // Omvandla enheter
  const c = rng.pick(level === 3 ? CONVERSIONS.filter((x) => ['m', 'l', 'timmar', 'veckor', 'dygn'].includes(x.big)) : CONVERSIONS);
  const k = rng.int(level === 3 ? 1 : 2, level === 3 ? 4 : 9);
  const extra = level === 4 && c.f >= 10 && rng.chance(0.5) ? rng.int(1, Math.min(c.f - 1, c.f === 1000 ? 999 : c.f - 1)) : 0;
  const bigTxt = k === 1 && c.one ? c.one : c.big;
  const bigSay = k === 1 && c.one ? c.one : c.bigSay;
  const ans = k * c.f + extra;
  return {
    type: 'numpad',
    prompt: `Hur många ${c.small} är ${k} ${bigTxt}${extra ? ` och ${extra} ${c.small}` : ''}?`,
    say: `Hur många ${c.smallSay} är ${k} ${bigSay}${extra ? ` och ${extra} ${c.smallSay}` : ''}?`,
    answer: ans,
    hint: `1 ${c.one || c.big} = ${c.f} ${c.small}.`,
    explain: `1 ${c.one || c.big} = ${c.f} ${c.small}, så ${k} ${bigTxt} = ${k * c.f} ${c.small}${extra ? `. Plus ${extra} blir det ${ans} ${c.small}` : ''}.`,
  };
}

/* ---------- Tid & kalender ---------- */
export const WEEKDAYS = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'];
export const MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
const SEASONS = [
  { id: 'vinter', e: '❄️', def: 'vintern', months: [11, 0, 1] },
  { id: 'vår', e: '🌷', def: 'våren', months: [2, 3, 4] },
  { id: 'sommar', e: '☀️', def: 'sommaren', months: [5, 6, 7] },
  { id: 'höst', e: '🍂', def: 'hösten', months: [8, 9, 10] },
];
const DAY_EVENTS = [
  { id: 'vakna', e: '🌅', t: 'vakna' }, { id: 'frukost', e: '🥣', t: 'äta frukost' }, { id: 'skola', e: '🎒', t: 'gå till skolan' },
  { id: 'lunch', e: '🍝', t: 'äta lunch' }, { id: 'hem', e: '🏠', t: 'gå hem' }, { id: 'bada', e: '🛁', t: 'bada' }, { id: 'sova', e: '🌙', t: 'sova' },
];
const pad2 = (n) => String(n).padStart(2, '0');
export const fmt24 = (h, m) => `${pad2(h)}:${pad2(m)}`;
/** Lägg till minuter på en tid (24-timmarsklocka). */
export function addMinutes(h, m, d) {
  const t = (((h * 60 + m + d) % 1440) + 1440) % 1440;
  return { h: Math.floor(t / 60), m: t % 60 };
}
/** "en halvtimme", "en och en halv timme", "två timmar", "45 minuter" … */
export function durText(min) {
  const h = Math.floor(min / 60);
  const r = min % 60;
  if (h === 0) return r === 30 ? 'en halvtimme' : `${r} minuter`;
  const hs = h === 1 ? 'en timme' : `${NUM_WORDS[h]} timmar`;
  if (r === 0) return hs;
  if (r === 30) return `${h === 1 ? 'en' : NUM_WORDS[h]} och en halv timme`;
  return `${hs} och ${r} minuter`;
}
const ACTIVITIES = [
  { t: 'Fotbollsträningen', p: 'Den' }, { t: 'Filmen', p: 'Den' }, { t: 'Simskolan', p: 'Den' },
  { t: 'Kalaset', p: 'Det' }, { t: 'Utflykten', p: 'Den' }, { t: 'Pianolektionen', p: 'Den' }, { t: 'Bakningen', p: 'Den' },
];

export function genCalendar(level, rng) {
  if (level === 0) {
    if (rng.chance(0.5)) {
      const start = rng.int(0, DAY_EVENTS.length - 3);
      const ev = DAY_EVENTS.slice(start, start + 3);
      return {
        type: 'order',
        prompt: 'Vad gör man först? Tryck i rätt ordning.',
        say: `Vad gör man först under dagen? ${ev.map((x) => x.t).join(', ')}. Tryck i rätt ordning.`,
        items: rng.shuffle(ev).map((x) => ({ id: x.id, html: `<span class="pic sm">${x.e}</span><span class="lbl">${x.t}</span>`, say: x.t })),
        answerOrder: ev.map((x) => x.id),
        hint: 'Vad gör du på morgonen när du vaknar?',
        explain: ev.map((x) => x.t).join(', sen ') + '.',
      };
    }
  }
  if (level <= 1) {
    const i = rng.int(0, 3);
    const s = SEASONS[i];
    const next = SEASONS[(i + 1) % 4];
    return {
      type: 'choice',
      prompt: `Vilken årstid kommer efter ${s.def}?`,
      visual: `<div class="mp-story-pic">${s.e} ➡️ ❓</div>`,
      options: SEASONS.filter((x) => x !== s).map((x) => ({ id: x.id, html: `<span class="pic sm">${x.e}</span><span class="lbl">${x.def}</span>`, say: x.def })),
      answer: next.id,
      hint: 'Vinter, vår, sommar, höst – och sen börjar det om.',
      explain: `Efter ${s.def} kommer ${next.def}. Årstiderna går runt i en cirkel.`,
    };
  }
  if (level === 2) {
    const v = rng.int(0, 3);
    if (v === 0) {
      const d = rng.int(0, 6);
      const after = rng.chance(0.6);
      const ans = WEEKDAYS[(d + (after ? 1 : 6)) % 7];
      return {
        type: 'choice',
        prompt: `Vilken dag kommer ${after ? 'efter' : 'före'} ${WEEKDAYS[d]}?`,
        options: rng.shuffle([ans, ...rng.sample(WEEKDAYS.filter((x) => x !== ans && x !== WEEKDAYS[d]), 2)]).map((x) => ({ id: x, label: x })),
        answer: ans,
        hint: 'Säg veckodagarna högt: måndag, tisdag, onsdag …',
        explain: `${cap(WEEKDAYS[(d + 6) % 7])}, ${WEEKDAYS[d]}, ${WEEKDAYS[(d + 1) % 7]}. En vecka har sju dagar.`,
      };
    }
    if (v === 1) {
      const m = rng.int(0, 11);
      const ans = MONTHS[(m + 1) % 12];
      return {
        type: 'choice',
        prompt: `Vilken månad kommer efter ${MONTHS[m]}?`,
        options: rng.shuffle([ans, ...rng.sample(MONTHS.filter((x) => x !== ans && x !== MONTHS[m]), 2)]).map((x) => ({ id: x, label: x })),
        answer: ans,
        hint: 'Januari, februari, mars … ett år har tolv månader.',
        explain: `Efter ${MONTHS[m]} kommer ${ans}.`,
      };
    }
    if (v === 2) {
      const m = rng.int(0, 11);
      const s = SEASONS.find((x) => x.months.includes(m));
      return {
        type: 'choice',
        prompt: `Vilken årstid är det i ${MONTHS[m]} i Sverige?`,
        options: SEASONS.map((x) => ({ id: x.id, html: `<span class="pic sm">${x.e}</span><span class="lbl">${x.def}</span>`, say: x.def })),
        answer: s.id,
        hint: 'Tänk på hur det brukar se ut ute då.',
        explain: `${cap(MONTHS[m])} räknas oftast till ${s.def}: ${s.months.map((x) => MONTHS[x]).join(', ')}.`,
      };
    }
    const q = rng.pick([
      { q: 'Hur många dagar har en vecka?', a: 7, e: 'Måndag till söndag – sju dagar.' },
      { q: 'Hur många månader har ett år?', a: 12, e: 'Januari till december – tolv månader.' },
      { q: 'Hur många timmar har ett dygn?', a: 24, e: 'Ett dygn är en dag och en natt – 24 timmar.' },
      { q: 'Hur många minuter är en timme?', a: 60, e: 'En timme är 60 minuter. Den långa visaren går ett helt varv.' },
      { q: 'Hur många minuter är en halvtimme?', a: 30, e: 'En halvtimme är hälften av 60 minuter, alltså 30.' },
      { q: 'Hur många minuter är en kvart?', a: 15, e: 'En kvart är en fjärdedel av en timme: 60 ÷ 4 = 15.' },
    ]);
    return { type: 'numpad', prompt: q.q, answer: q.a, hint: 'Tänk på klockan och almanackan.', explain: q.e };
  }
  if (rng.chance(0.3)) {
    // Dagar kvar
    const d = rng.int(0, 6);
    const target = rng.int(0, 6);
    const diff = (target - d + 7) % 7 || 7;
    return {
      type: 'numpad',
      prompt: `I dag är det ${WEEKDAYS[d]}. Hur många dagar är det kvar till ${WEEKDAYS[target]}${diff === 7 ? ' nästa vecka' : ''}?`,
      answer: diff,
      hint: 'Räkna dagarna på fingrarna – börja med dagen efter i dag.',
      explain: `Från ${WEEKDAYS[d]} till ${WEEKDAYS[target]} är det ${diff} ${diff === 1 ? 'dag' : 'dagar'}.`,
    };
  }
  const act = rng.pick(ACTIVITIES);
  if (level === 3) {
    const sh = rng.int(8, 18);
    const sm = rng.pick([0, 30]);
    const dur = rng.pick([30, 60, 90, 120]);
    const end = addMinutes(sh, sm, dur);
    const key = (t) => fmt24(t.h, t.m);
    const opts = new Set([key(end)]);
    for (const d of rng.shuffle([-30, 30, -60, 60, 90])) if (opts.size < 3) opts.add(key(addMinutes(end.h, end.m, d)));
    return {
      type: 'choice',
      prompt: `${act.t} börjar klockan ${fmt24(sh, sm)}. ${act.p} håller på i ${durText(dur)}. När är ${act.p.toLowerCase()} slut?`,
      options: rng.shuffle([...opts]).map((x) => ({ id: x, label: x, say: x.replace(':', ' och ') })),
      answer: key(end),
      hint: 'Räkna först hela timmar, sen halvtimmar.',
      explain: `${fmt24(sh, sm)} + ${durText(dur)} = ${key(end)}.`,
    };
  }
  // nivå 4
  const sh = rng.int(8, 18);
  const sm = rng.int(0, 11) * 5;
  const dur = rng.int(3, 19) * 5;
  const end = addMinutes(sh, sm, dur);
  if (rng.chance(0.5)) {
    return {
      type: 'numpad',
      prompt: `${act.t} börjar ${fmt24(sh, sm)} och slutar ${fmt24(end.h, end.m)}. Hur många minuter håller ${act.p.toLowerCase()} på?`,
      answer: dur,
      hint: `Räkna först fram till nästa hel timme, sen resten.`,
      explain: sm + dur > 60 && sm > 0
        ? `Från ${fmt24(sh, sm)} till ${fmt24(sh + 1, 0)} är ${60 - sm} minuter, och sen ${dur - (60 - sm)} minuter till. ${60 - sm} + ${dur - (60 - sm)} = ${dur}.`
        : `Från ${fmt24(sh, sm)} till ${fmt24(end.h, end.m)} är det ${dur} minuter.`,
    };
  }
  const key = (t) => fmt24(t.h, t.m);
  const opts = new Set([key(end)]);
  for (const d of rng.shuffle([-10, 10, -60, 60, 40, -40])) if (opts.size < 3) opts.add(key(addMinutes(end.h, end.m, d)));
  return {
    type: 'choice',
    prompt: `${act.t} börjar ${fmt24(sh, sm)} och håller på i ${dur} minuter. När är ${act.p.toLowerCase()} slut?`,
    options: rng.shuffle([...opts]).map((x) => ({ id: x, label: x, say: x.replace(':', ' och ') })),
    answer: key(end),
    hint: `Hur många minuter är det kvar till nästa hel timme? Ta dem först.`,
    explain: `${fmt24(sh, sm)} + ${dur} minuter = ${key(end)}.`,
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
    { id: 'column-notes', name: 'Uppställning med kladd', icon: '📝', minLevel: 3, gen: genColumnNotes, lgr: ['ma-pos', 'ma-metod', 'ma-rakna'] },
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
    { id: 'story', name: 'Räknesagor', icon: '📖', minLevel: 0, gen: genStory, lgr: ['ma-problem', 'ma-rakna', 'ma-vardag'] },
    { id: 'units', name: 'Mått & ungefär', icon: '⚖️', minLevel: 0, gen: genUnits, lgr: ['ma-mat', 'ma-rimlig'] },
    { id: 'calendar', name: 'Tid & kalender', icon: '📅', minLevel: 0, gen: genCalendar, lgr: ['ma-tid'] },
    { id: 'oddeven', name: 'Udda & jämna', icon: '🧦', minLevel: 1, gen: genOddEven, lgr: ['ma-tal'] },
    { id: 'fraction', name: 'Bråk', icon: '🍕', minLevel: 1, gen: genFraction, lgr: ['ma-brak'] },
    { id: 'money', name: 'Pengar', icon: '🪙', minLevel: 1, gen: genMoney, lgr: ['ma-vardag', 'ma-rakna'] },
    { id: 'column', name: 'Uppställning', icon: '🧮', minLevel: 2, gen: genColumn, lgr: ['ma-skriftlig'] },
  ],
};
