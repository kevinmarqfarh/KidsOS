import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeAdaptedPrefs, normalizeAdaptedSettings, defaultAdaptedPrefs, isAdapted, adaptedPrefs, sessionLength,
  reduceOptions, adaptQuestion, errorlessNext, adaptedSfx, praiseFor, PRAISE, firstThenText, interestFor, rewardFor,
  INTERESTS, REWARDS, ADAPTED_DEFAULTS, ADAPTED_QUESTION_CHOICES, ADAPTED_OPTION_CHOICES, rewardCount,
} from '../../src/core/adapted.js';
import { newProfile, normalizeProfile, normalizeState } from '../../src/core/model.js';
import { createRng } from '../../src/core/rng.js';
import { APPS } from '../../src/apps/registry.js';

const opts = (n) => Array.from({ length: n }, (_, i) => ({ id: `o${i}`, label: String(i) }));

test('anpassat läge: standardvärden och normalisering av trasiga värden', () => {
  assert.deepEqual(normalizeAdaptedPrefs(undefined), defaultAdaptedPrefs());
  assert.deepEqual(normalizeAdaptedPrefs('skräp'), { ...ADAPTED_DEFAULTS });
  const n = normalizeAdaptedPrefs({ questions: 99, options: 1, sound: 'ja', focus: false, interest: 'okänt', reward: 'stars' });
  assert.equal(n.questions, 10);
  assert.equal(n.options, 2);
  assert.equal(n.sound, true, 'icke-boolesk ljudinställning ger standard');
  assert.equal(n.focus, false);
  assert.equal(n.interest, 'animals');
  assert.equal(n.reward, 'stars');
  assert.equal(normalizeAdaptedPrefs({ questions: 1 }).questions, 3);
  assert.equal(normalizeAdaptedPrefs({ options: 0 }).options, 0, '0 = som vanligt');
  assert.equal(normalizeAdaptedPrefs({ options: '' }).options, 3);
  for (const q of ADAPTED_QUESTION_CHOICES) assert.equal(normalizeAdaptedPrefs({ questions: q }).questions, q);
  for (const o of ADAPTED_OPTION_CHOICES) assert.equal(normalizeAdaptedPrefs({ options: o }).options, o);
});

test('anpassat läge: bara true slår på läget', () => {
  assert.equal(normalizeAdaptedSettings({ adapted: 'true' }).adapted, false);
  assert.equal(normalizeAdaptedSettings({ adapted: 1 }).adapted, false);
  assert.equal(normalizeAdaptedSettings({ adapted: true }).adapted, true);
  assert.equal(normalizeAdaptedSettings(null).adapted, false);
});

test('profiler: nya profiler har läget av, kan skapas med läget på', () => {
  const p = newProfile({ name: 'A', age: 7 });
  assert.equal(p.settings.adapted, false);
  assert.deepEqual(p.settings.adaptedPrefs, defaultAdaptedPrefs());
  const q = newProfile({ name: 'B', ageBand: '6-7', adapted: true, adaptedPrefs: { interest: 'space', questions: 4 } });
  assert.equal(q.settings.adapted, true);
  assert.equal(q.settings.adaptedPrefs.interest, 'space');
  assert.equal(q.settings.adaptedPrefs.questions, 4);
  assert.equal(isAdapted(q), true);
  assert.equal(isAdapted(p), false);
  assert.equal(isAdapted(null), false);
});

test('profiler: äldre sparade profiler utan fälten migreras bakåtkompatibelt', () => {
  const old = { id: 'x', name: 'Gammal', age: 6, stars: 3, settings: { readAloud: 'on', hiddenApps: [] } };
  const n = normalizeProfile(old);
  assert.equal(n.settings.adapted, false);
  assert.deepEqual(n.settings.adaptedPrefs, defaultAdaptedPrefs());
  assert.equal(n.settings.readAloud, 'on', 'andra inställningar behålls');
  const on = normalizeProfile({ ...old, settings: { adapted: true, adaptedPrefs: { options: 2, sound: false } } });
  assert.equal(on.settings.adapted, true);
  assert.equal(on.settings.adaptedPrefs.options, 2);
  assert.equal(on.settings.adaptedPrefs.sound, false);
  assert.equal(on.settings.adaptedPrefs.questions, 5);
  const st = normalizeState({ profiles: [old, { ...old, id: 'y', settings: { adapted: true } }] });
  assert.deepEqual(st.profiles.map((p) => p.settings.adapted), [false, true]);
});

test('passlängd: anpassat läge ger förälderns val, annars ordinarie', () => {
  const p = newProfile({ name: 'A', age: 9 });
  assert.equal(sessionLength(p, 8), 8);
  p.settings.adapted = true;
  assert.equal(sessionLength(p, 8), 5);
  p.settings.adaptedPrefs.questions = 3;
  assert.equal(sessionLength(p, 8), 3);
  p.settings.adaptedPrefs = 'trasig';
  assert.equal(sessionLength(p, 8), 5);
  assert.deepEqual(adaptedPrefs(p), defaultAdaptedPrefs());
});

test('färre alternativ: rätt svar finns alltid kvar och ordningen bevaras', () => {
  const o = opts(5);
  for (const ans of o.map((x) => x.id)) {
    for (const max of [2, 3, 4]) {
      const r = reduceOptions(o, ans, max);
      assert.equal(r.length, max);
      assert.ok(r.some((x) => x.id === ans), `rätt svar ${ans} kvar vid max ${max}`);
      const idx = r.map((x) => o.indexOf(x));
      assert.deepEqual(idx, [...idx].sort((a, b) => a - b), 'ursprunglig ordning');
    }
  }
  assert.equal(reduceOptions(o, 'o0', 0).length, 5, '0 = som vanligt');
  assert.equal(reduceOptions(o, 'o0', 9).length, 5);
  assert.equal(reduceOptions(o, 'saknas', 2).length, 5, 'okänt svar rörs inte');
  assert.equal(o.length, 5, 'muterar inte indata');
});

test('adaptQuestion: bara flervalsfrågor får färre alternativ', () => {
  const q = { type: 'choice', prompt: 'X', options: opts(4), answer: 'o3' };
  const a = adaptQuestion(q, { options: 2 });
  assert.equal(a.options.length, 2);
  assert.ok(a.options.some((x) => x.id === 'o3'));
  assert.equal(q.options.length, 4, 'originalet orört');
  assert.equal(a.adapted, true);
  const num = { type: 'numpad', prompt: 'Y', answer: 4 };
  assert.deepEqual({ ...adaptQuestion(num, { options: 2 }), adapted: undefined }, { ...num, adapted: undefined });
});

test('adaptQuestion på riktiga generatorer: rätt svar finns alltid bland alternativen', () => {
  const rng = createRng(7);
  let checked = 0;
  for (const app of APPS) {
    for (const mod of app.modules.filter((m) => m.gen)) {
      for (const level of [0, 1, 2]) {
        let q;
        try { q = mod.gen(level, rng, { found: {} }); } catch { continue; }
        if (!q || q.type !== 'choice' || !Array.isArray(q.options)) continue;
        for (const max of [2, 3]) {
          const a = adaptQuestion(q, { options: max });
          assert.ok(a.options.length <= Math.max(max, 0) || a.options.length === q.options.length);
          if (q.options.some((o) => o.id === q.answer)) assert.ok(a.options.some((o) => o.id === q.answer), `${app.id}/${mod.id}`);
        }
        checked++;
      }
    }
  }
  assert.ok(checked > 10, `kontrollerade ${checked} frågor`);
});

test('felfri inlärning: göra om en gång, sedan lugnt visa svaret', () => {
  assert.equal(errorlessNext(0), 'redo');
  assert.equal(errorlessNext(1), 'reveal');
  assert.equal(errorlessNext(5), 'reveal');
  assert.equal(errorlessNext(undefined), 'redo');
});

test('ljud: inga fel- eller fanfarljud, inget alls när ljudet är av', () => {
  assert.equal(adaptedSfx('wrong', {}), null);
  assert.equal(adaptedSfx('fanfare', {}), 'star');
  assert.equal(adaptedSfx('correct', {}), 'correct');
  assert.equal(adaptedSfx('pop', { sound: false }), null);
  assert.equal(adaptedSfx('correct', { sound: false }), null);
});

test('beröm och först–sen-text är korta och förutsägbara', () => {
  for (let i = 0; i < 12; i++) assert.ok(PRAISE.includes(praiseFor(i)));
  assert.equal(praiseFor(0), praiseFor(PRAISE.length));
  assert.ok(PRAISE.every((p) => p.split(' ').length <= 3));
  assert.deepEqual(firstThenText(5, { reward: 'bubbles' }), { first: 'Först 5 uppgifter', then: 'Sen bubblor' });
  assert.equal(firstThenText(1, {}).first, 'Först 1 uppgift');
});

test('intressen och belöningar har giltiga data', () => {
  assert.equal(interestFor('nope').id, 'animals');
  assert.equal(interestFor({ interest: 'ocean' }).id, 'ocean');
  assert.equal(rewardFor('nope').id, 'bubbles');
  for (const i of INTERESTS) {
    assert.ok(i.items.length >= 5, i.id);
    for (const [emoji, name] of i.items) {
      assert.ok(emoji && name);
      assert.match(name, /^(en |ett )?[a-zåäö]+$/);
    }
  }
  assert.equal(new Set(INTERESTS.map((i) => i.id)).size, INTERESTS.length);
  assert.equal(new Set(REWARDS.map((r) => r.id)).size, REWARDS.length);
  for (const r of REWARDS) assert.ok(rewardCount(r.id) >= 5 && rewardCount(r.id) <= 12);
});
