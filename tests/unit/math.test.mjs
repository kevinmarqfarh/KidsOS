// Enhetstester för mattens nya hjälpfunktioner och moduler.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../src/core/rng.js';
import {
  mathApp, numPic, cnt, makeStory, STORY_TEMPLATES, genStory, isEven, genOddEven, fracName, fractionOf, fracSvg, genFraction,
  sumMoney, moneyHtml, genMoney, hasCarry, hasBorrow, columnSteps, genColumn, roundTo, genUnits, SIZE_FACTS, CONVERSIONS,
  addMinutes, fmt24, durText, genCalendar, growingCount, genGrowing, genGroups, genShapePattern, genChart, genCount,
} from '../../src/apps/math.js';

const evalArith = (expr) => {
  const e = expr.replace(/×/g, '*').replace(/÷/g, '/');
  assert.match(e, /^[\d\s+\-*/]+$/, `konstigt uttryck: ${expr}`);
  return Function(`return (${e})`)();
};
const SEEDS = 250;

test('böjning: en/ett och plural efter antal', () => {
  assert.equal(cnt(1, { sg: 'kaka', pl: 'kakor', g: 'en' }), 'en kaka');
  assert.equal(cnt(1, { sg: 'äpple', pl: 'äpplen', g: 'ett' }), 'ett äpple');
  assert.equal(cnt(4, { sg: 'äpple', pl: 'äpplen', g: 'ett' }), '4 äpplen');
});

test('numPic: siffra och lika många prickar', () => {
  const h = numPic(4);
  assert.match(h, /<b>4<\/b>/);
  assert.equal((h.match(/<i><\/i>/g) || []).length, 4);
  assert.equal((numPic(0).match(/<i>/g) || []).length, 0);
});

test('textuppgifter: uttrycket ger svaret och talen passar nivån', () => {
  const maxAns = [5, 10, 20, 100, 1000];
  for (let level = 0; level <= 4; level++) {
    const seen = new Set();
    for (let s = 0; s < SEEDS; s++) {
      const st = makeStory(level, createRng(s * 13 + level));
      seen.add(st.id);
      assert.equal(evalArith(st.expr), st.answer, `${st.id}: ${st.text}`);
      assert.ok(Number.isInteger(st.answer) && st.answer >= 0, `${st.id}: ${st.answer}`);
      assert.ok(st.answer <= maxAns[level], `nivå ${level} för stort svar: ${st.text} = ${st.answer}`);
      // inga "1 kakor" / "1 äpplen" – singular ska skrivas "en/ett"
      assert.doesNotMatch(st.text, /(^|\s)1 (?!krona)[a-zåäö]+(or|ar|er|en|ner)\b/, st.text);
      assert.doesNotMatch(st.text, /undefined|NaN/, st.text);
      // texten ska innehålla en fråga
      assert.match(st.text, /\?$/, st.text);
    }
    const expected = STORY_TEMPLATES.filter((t) => level >= t.lv[0] && level <= t.lv[1]).map((t) => t.id);
    expected.forEach((id) => assert.ok(seen.has(id), `mallen ${id} kom aldrig på nivå ${level}`));
  }
});

test('textuppgifter: nivå 0 har bildsvar och uppläsning', () => {
  for (let s = 0; s < SEEDS; s++) {
    const q = genStory(0, createRng(s));
    assert.equal(q.type, 'choice');
    assert.ok(q.options.length <= 3);
    q.options.forEach((o) => assert.ok(o.html && o.html.includes('mp-num')));
    assert.ok(q.say && q.say.length > 10);
    assert.ok(Number(q.answer) <= 5);
  }
});

test('udda och jämna', () => {
  assert.ok(isEven(0) && isEven(8) && !isEven(7) && isEven(512) && !isEven(999));
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = genOddEven(level, createRng(s + 1000 * level));
    const nums = (q.prompt.match(/\d+/g) || []).map(Number);
    if (/^Är (\d+) ett udda/.test(q.prompt)) assert.equal(q.answer, isEven(nums[0]) ? 'jämnt' : 'udda');
    if (/^Blir (\d+) \+ (\d+)/.test(q.prompt)) assert.equal(q.answer, isEven(nums[0] + nums[1]) ? 'jämnt' : 'udda');
    if (/^Vilket tal är (jämnt|udda)/.test(q.prompt)) {
      const want = q.prompt.includes('jämnt');
      assert.equal(isEven(Number(q.answer)), want);
      q.options.filter((o) => o.id !== q.answer).forEach((o) => assert.notEqual(isEven(Number(o.id)), want, q.prompt));
    }
    if (q.visual && q.visual.includes('mp-pairs')) {
      const n = (q.visual.match(/<span>/g) || []).length;
      if (q.answer === 'ja' || q.answer === 'nej') assert.equal(q.answer, isEven(n) ? 'ja' : 'nej');
    }
  }
});

test('bråk: namn, del av antal och bilder', () => {
  assert.equal(fracName(1, 2), 'en halv');
  assert.equal(fracName(2, 2), 'två halvor');
  assert.equal(fracName(1, 3), 'en tredjedel');
  assert.equal(fracName(3, 4), 'tre fjärdedelar');
  assert.equal(fractionOf(3, 4, 20), 15);
  assert.equal(fractionOf(1, 2, 14), 7);
  const svg = fracSvg('pizza', [0.25, 0.25, 0.25, 0.25], 3);
  assert.equal((svg.match(/<path/g) || []).length, 4);
  assert.equal((svg.match(/#ff9f1c/g) || []).length, 3, 'tre färgade bitar');
  const bar = fracSvg('choklad', [0.5, 0.5], 1);
  assert.equal((bar.match(/<rect/g) || []).length, 2);
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = genFraction(level, createRng(s * 3 + level));
    const m = /^Vad är (.+) av (\d+)\?$/.exec(q.prompt);
    if (m) assert.ok(Number.isInteger(q.answer));
    if (q.prompt.startsWith('Hur stor del') && q.visual.includes('<path')) {
      const [n, d] = q.answer.split('/').map(Number);
      assert.equal((q.visual.match(/<path/g) || []).length, d);
      assert.equal((q.visual.match(/#ff9f1c/g) || []).length, n);
    }
    if (level === 0) assert.equal(q.options.length, 2, 'nivå 0: två bildval');
  }
});

test('pengar: summor stämmer', () => {
  assert.equal(sumMoney([20, 5, 2, 1]), 28);
  const h = moneyHtml([1, 100, 5]);
  assert.ok(h.indexOf('100 kr') < h.indexOf('>5<'), 'största först');
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = genMoney(level, createRng(s * 5 + level));
    if (q.prompt === 'Hur många kronor är det tillsammans?') {
      const vals = [...q.visual.matchAll(/aria-label="(\d+) kron/g)].map((x) => Number(x[1]));
      assert.equal(sumMoney(vals), q.answer);
    }
    if (q.prompt.startsWith('Var finns det exakt')) {
      const x = Number(/exakt (\d+)/.exec(q.prompt)[1]);
      for (const o of q.options) {
        const sum = sumMoney([...o.html.matchAll(/aria-label="(\d+) kron/g)].map((m) => Number(m[1])));
        assert.equal(sum === x, o.id === q.answer, `${o.id}: ${sum} vs ${x}`);
      }
    }
    if (level === 1 && q.type === 'numpad') assert.ok(q.answer <= 10);
  }
});

test('uppställning: minnessiffra och växling', () => {
  assert.equal(hasCarry(27, 35), true);
  assert.equal(hasCarry(21, 35), false);
  assert.equal(hasCarry(150, 160), true);
  assert.equal(hasBorrow(52, 27), true);
  assert.equal(hasBorrow(58, 27), false);
  assert.equal(hasBorrow(705, 340), true);
  assert.deepEqual(columnSteps(27, 35, '+'), ['Ental: 7 + 5 = 12 – skriv 2 och 1 i minnet', 'Tiotal: 2 + 3 + 1 = 6']);
  assert.equal(columnSteps(95, 17, '+').at(-1), 'Hundratal: 1 från minnet');
  assert.match(columnSteps(705, 348, '-')[1], /räcker inte/);
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = genColumn(level, createRng(s * 7 + level));
    const [, a, op, b] = /(\d+) ([+-]) (\d+)$/.exec(q.prompt);
    assert.equal(evalArith(`${a} ${op} ${b}`), q.answer);
    assert.ok(q.explain.endsWith(`Svaret är ${q.answer}.`));
    if (level === 2) assert.equal(op === '+' ? hasCarry(+a, +b) : hasBorrow(+a, +b), false, q.prompt);
    if (level === 3) assert.equal(op === '+' ? hasCarry(+a, +b) : hasBorrow(+a, +b), true, q.prompt);
    if (level === 4) assert.ok(+a >= 100 && q.answer <= 999);
  }
});

test('mått och överslag', () => {
  assert.equal(roundTo(38, 10), 40);
  assert.equal(roundTo(41, 10), 40);
  assert.equal(roundTo(649, 100), 600);
  SIZE_FACTS.forEach((f) => assert.ok(f.v > 0 && f.q.endsWith('?')));
  CONVERSIONS.forEach((c) => assert.ok(c.f > 1));
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = genUnits(level, createRng(s * 11 + level));
    const conv = /^Hur många (\S+) är (\d+) (\S+)(?: och (\d+) \S+)?\?$/.exec(q.prompt);
    if (conv) {
      const c = CONVERSIONS.find((x) => x.small === conv[1] && (x.big === conv[3] || x.one === conv[3]));
      assert.ok(c, q.prompt);
      assert.equal(q.answer, Number(conv[2]) * c.f + Number(conv[4] || 0));
    }
    const est = /Ungefär hur mycket är (\d+) ([+-]) (\d+)\?$/.exec(q.prompt);
    if (est) {
      const step = level === 3 ? 10 : 100;
      const r = est[2] === '+' ? roundTo(+est[1], step) + roundTo(+est[3], step) : roundTo(+est[1], step) - roundTo(+est[3], step);
      assert.equal(q.answer, String(r));
    }
    const rim = /räknade (\d+) \+ (\d+) = (\d+)\./.exec(q.prompt);
    if (rim) assert.equal(q.answer, +rim[1] + +rim[2] === +rim[3] ? 'ja' : 'nej');
    if (level === 0) assert.equal(q.options.length, 2);
  }
});

test('tid: minuter, klockslag och tidsord', () => {
  assert.deepEqual(addMinutes(10, 35, 65), { h: 11, m: 40 });
  assert.deepEqual(addMinutes(23, 50, 20), { h: 0, m: 10 });
  assert.equal(fmt24(9, 5), '09:05');
  assert.equal(durText(30), 'en halvtimme');
  assert.equal(durText(60), 'en timme');
  assert.equal(durText(90), 'en och en halv timme');
  assert.equal(durText(120), 'två timmar');
  assert.equal(durText(75), 'en timme och 15 minuter');
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = genCalendar(level, createRng(s * 17 + level));
    const m = /börjar (?:klockan )?(\d\d):(\d\d) och (?:håller på i (\d+) minuter|slutar (\d\d):(\d\d))/.exec(q.prompt);
    if (m && m[3]) {
      const t = addMinutes(+m[1], +m[2], +m[3]);
      assert.equal(q.answer, fmt24(t.h, t.m));
    } else if (m && m[4]) {
      assert.equal(q.answer, (+m[4] * 60 + +m[5]) - (+m[1] * 60 + +m[2]));
    }
    if (level === 0 && q.type === 'choice') assert.ok(q.options.length <= 3);
  }
});

test('mönster, grupper och nivå 0-bilder', () => {
  assert.equal(growingCount(1, 2, 4), 7);
  assert.equal(growingCount(3, 1, 1), 3);
  for (let s = 0; s < SEEDS; s++) {
    const g = genGrowing(4, createRng(s));
    const [, fig] = /figur (\d+)/.exec(g.prompt);
    assert.ok(g.explain.endsWith(`= ${g.answer}.`));
    assert.ok(+fig >= 5);
    const gr = genGroups(2, createRng(s));
    const [, k, t] = /^(\d+) × (\d+) = (\d+)/.exec(gr.explain);
    assert.equal(gr.answer, k * t);
    assert.equal((gr.visual.match(/mp-grp/g) || []).length, Number(k));
    const sp = genShapePattern(0, createRng(s));
    assert.ok(sp.options.length <= 3 && sp.options.every((o) => o.html.includes('<svg')));
    const c = genCount(0, createRng(s));
    assert.ok(c.options.every((o) => o.html.includes('mp-num')), 'nivå 0 räkna: bildsvar');
  }
});

test('diagram: svaret går att läsa ur staplarna', () => {
  for (let level = 0; level <= 4; level++) for (let s = 0; s < SEEDS; s++) {
    const q = genChart(level, createRng(s * 19 + level));
    const bars = [...q.visual.matchAll(/height="([\d.]+)"/g)].map((x) => Number(x[1]));
    assert.ok(bars.length >= 3);
    if (q.prompt.endsWith('flest röster?')) {
      const top = Math.max(...bars);
      assert.equal(bars.filter((b) => b === top).length, 1, 'unik högsta stapel');
    }
  }
});

test('nya moduler finns i appen med rätt startnivå', () => {
  const ids = Object.fromEntries(mathApp.modules.map((m) => [m.id, m]));
  for (const id of ['story', 'units', 'calendar', 'oddeven', 'fraction', 'money', 'column']) assert.ok(ids[id]?.gen, id);
  assert.equal(ids.story.minLevel, 0);
  assert.equal(ids.column.minLevel, 2);
});
