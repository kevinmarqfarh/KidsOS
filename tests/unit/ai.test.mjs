// Tester för AI-appen: frågebanken, kursen och fotolabbet "Träna en AI".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../src/core/rng.js';
import { CURRICULUM } from '../../src/core/curriculum.js';
import { AI_SCENARIOS, AI_LESSONS, genAIQuiz, aiApp } from '../../src/apps/ai.js';
import { TRAINER_SETS, BIAS_CHALLENGE, trainerSet, trainerItem, classify, evaluate, examplesFrom, sharedClues, factLine } from '../../src/apps/ai-lab.js';

const BAD = /undefined|NaN|\[object|null/;
const labelsFor = (set, ids) => Object.fromEntries(ids.map((id) => [id, trainerItem(set, id).cls]));

/* ======================= Frågebanken ======================= */

test('AI-frågor: tio ämnen, varje ämne täcker nivå 0–4 och har bildfrågor för förläsare', () => {
  const topics = Object.keys(AI_SCENARIOS);
  for (const t of ['meaning', 'examples', 'everyday', 'verify', 'fairness', 'prompts', 'privacy', 'feelings', 'create', 'responsibility']) assert.ok(topics.includes(t), t);
  for (const [topic, rows] of Object.entries(AI_SCENARIOS)) {
    assert.ok(rows.length >= 10, `${topic}: för få frågor (${rows.length})`);
    for (let lvl = 0; lvl <= 4; lvl++) assert.ok(rows.some((r) => r[0] === lvl), `${topic}: saknar nivå ${lvl}`);
    const young = rows.filter((r) => r[0] === 0);
    assert.ok(young.length >= 3, `${topic}: minst tre frågor på nivå 0`);
    for (const r of rows) {
      const [lvl, q, answer, distractors, hint, explain, pics] = r;
      assert.ok(q.endsWith('?'), `${topic}: ${q}`);
      assert.ok(answer && hint && explain && explain.length > 20, `${topic}: ${q}`);
      assert.ok(!BAD.test(`${q}${answer}${distractors.join('')}${hint}${explain}`), q);
      assert.equal(new Set([answer, ...distractors]).size, distractors.length + 1, `${topic}: dubbla alternativ i ${q}`);
      if (lvl <= 1) {
        assert.ok(Array.isArray(pics) && pics.length === distractors.length + 1, `${topic}: nivå ${lvl} behöver en bild per alternativ (${q})`);
        assert.ok(distractors.length <= 2, `${topic}: högst tre alternativ för de minsta (${q})`);
      }
    }
  }
  assert.ok(Object.values(AI_SCENARIOS).flat().length >= 100);
});

test('AI-frågor: generatorn ger bildknappar på nivå 0–1 och föredrar svårare frågor för äldre', () => {
  for (const topic of Object.keys(AI_SCENARIOS)) {
    let hard = 0;
    for (let lvl = 0; lvl <= 4; lvl++) {
      for (let s = 0; s < 120; s++) {
        const q = genAIQuiz(topic, lvl, createRng(s * 37 + lvl));
        assert.equal(q.type, 'choice');
        assert.ok(q.options.some((o) => o.id === q.answer));
        assert.ok(q.say && q.options.every((o) => o.say), 'allt ska kunna läsas upp');
        const row = AI_SCENARIOS[topic].find((r) => r[1] === q.prompt);
        assert.ok(row[0] <= lvl, `${topic}: för svår fråga på nivå ${lvl}`);
        if (lvl <= 1) assert.ok(q.options.every((o) => o.html && o.html.includes('class="pic"')), `${topic}: bildknappar på nivå ${lvl}`);
        if (lvl === 4 && row[0] >= 3) hard++;
      }
    }
    assert.ok(hard > 60, `${topic}: nivå 4 får för få utmanande frågor (${hard} av 120)`);
  }
});

test('AI-appen: moduler, läroplanskoder och en lektion per ämne', () => {
  const ids = aiApp.modules.map((m) => m.id);
  assert.ok(ids.includes('trainer') && ids.includes('lab') && ids.includes('course'));
  for (const m of aiApp.modules) for (const code of m.lgr) assert.ok(CURRICULUM[code], `${m.id}: ${code}`);
  for (const topic of Object.keys(AI_SCENARIOS)) assert.ok(AI_LESSONS.some((l) => l.moduleId === topic), `ingen lektion för ${topic}`);
  assert.ok(AI_LESSONS.some((l) => l.moduleId === 'trainer'), 'lektion som leder till labbet');
  for (const l of AI_LESSONS) for (const st of l.steps) assert.ok(!BAD.test(`${st.title}${st.text}${st.example}`), l.id);
  // nya läroplanskoder citerar Lgr22 och har ämne och område
  for (const code of ['tk-sakerhet', 'tk-datorer', 'so-kallor', 'sv-avsandare']) assert.ok(CURRICULUM[code]?.subject && CURRICULUM[code]?.area && CURRICULUM[code]?.text.endsWith('.'), code);
});

/* ======================= Fotolabbet ======================= */

test('träna en AI: dataseten är kompletta och testbilderna ingår aldrig i träningen', () => {
  for (const set of TRAINER_SETS) {
    assert.equal(set.classes.length, 2);
    assert.equal(new Set(set.items.map((i) => i.id)).size, set.items.length, `${set.id}: dubbla id`);
    for (const it of set.items) {
      assert.ok(set.classes.some((c) => c.id === it.cls), `${set.id}/${it.id}: okänd grupp`);
      assert.ok(it.e && it.name, `${set.id}/${it.id}: emoji och namn (reserv om fotot saknas)`);
      for (const f of set.features) assert.ok(f.values[it.f[f.id]], `${set.id}/${it.id}: ledtråden ${f.id}=${it.f[f.id]} saknar etikett`);
    }
    assert.equal(set.train.length, 12);
    assert.ok(set.test.length >= 6);
    for (const id of [...set.train, ...set.test]) assert.ok(trainerItem(set, id), `${set.id}: ${id} saknas`);
    assert.ok(!set.test.some((id) => set.train.includes(id)), `${set.id}: testbild i träningen`);
    for (const c of set.classes) {
      assert.ok(set.train.slice(0, 4).some((id) => trainerItem(set, id).cls === c.id), `${set.id}: första omgången saknar ${c.id}`);
      assert.ok(set.test.some((id) => trainerItem(set, id).cls === c.id), `${set.id}: testet saknar ${c.id}`);
    }
  }
});

test('träna en AI: fler och mer olika exempel gör modellen bättre – omgång för omgång', () => {
  for (const set of TRAINER_SETS) {
    const scores = [4, 8, 12].map((n) => evaluate(set, labelsFor(set, set.train.slice(0, n)), set.test).correct);
    assert.ok(scores[0] <= set.test.length / 2, `${set.id}: första omgången ska lämna mycket att förbättra (${scores})`);
    assert.ok(scores[0] < scores[1] && scores[1] <= scores[2], `${set.id}: modellen ska bli bättre (${scores})`);
    assert.equal(scores[2], set.test.length, `${set.id}: med alla exempel ska alla testbilder bli rätt`);
  }
});

test('träna en AI: fel etiketter ger fel svar – modellen härmar exemplen', () => {
  for (const set of TRAINER_SETS) {
    const good = labelsFor(set, set.train);
    const [a, b] = set.classes.map((c) => c.id);
    const swapped = Object.fromEntries(Object.entries(good).map(([id, c]) => [id, c === a ? b : a]));
    assert.equal(evaluate(set, swapped, set.test).correct, 0, `${set.id}: alla etiketter omvända ger noll rätt`);
    const mis = examplesFrom(set, swapped).filter((ex) => ex.label !== ex.cls);
    assert.equal(mis.length, set.train.length);
  }
});

test('träna en AI: skev träningsdata ger skeva svar, varierade exempel rättar det', () => {
  const set = trainerSet(BIAS_CHALLENGE.set);
  const skewed = examplesFrom(set, BIAS_CHALLENGE.skewed);
  assert.ok(skewed.every((ex) => ex.label === ex.cls), 'etiketterna är rätt – det är urvalet som är skevt');
  assert.ok(skewed.filter((ex) => ex.cls === 'frukt').every((ex) => ex.f.farg === 'röd'), 'alla frukter är röda');
  assert.ok(skewed.filter((ex) => ex.cls === 'grönsak').every((ex) => ex.f.farg === 'grön'), 'alla grönsaker är gröna');
  for (const id of [...BIAS_CHALLENGE.test, ...BIAS_CHALLENGE.fixes]) assert.ok(!(id in BIAS_CHALLENGE.skewed), id);
  assert.ok(!BIAS_CHALLENGE.test.some((id) => BIAS_CHALLENGE.fixes.includes(id)));
  const before = evaluate(set, BIAS_CHALLENGE.skewed, BIAS_CHALLENGE.test);
  assert.ok(before.correct <= 2, `skev data ska ge få rätt (${before.correct})`);
  assert.ok(!before.rows.find((r) => r.item.id === 'gapple').correct, 'det gröna äpplet lurar modellen');
  const after = evaluate(set, { ...BIAS_CHALLENGE.skewed, ...labelsFor(set, BIAS_CHALLENGE.fixes) }, BIAS_CHALLENGE.test);
  assert.ok(after.correct >= before.correct + 3, `varierade exempel ska hjälpa (${before.correct} → ${after.correct})`);
});

test('träna en AI: att välja rätt ledtråd spelar roll', () => {
  const set = trainerSet('djur');
  const few = labelsFor(set, set.train.slice(0, 4));
  const all = set.features.map((f) => f.id);
  const body = evaluate(set, few, set.test, ['kropp']).correct;
  const colour = evaluate(set, few, set.test, ['farg']).correct;
  assert.ok(body > evaluate(set, few, set.test, all).correct, 'bara "kroppen" slår alla ledtrådar med få exempel');
  assert.ok(colour < body, 'färgen ensam avslöjar inte gruppen');
});

test('träna en AI: närmaste granne röstar och säger ärligt "vet inte" vid oavgjort', () => {
  const f = { a: 1, b: 2 };
  assert.equal(classify([], f, ['a']).label, null);
  const tie = classify([{ id: 'x', f, label: 'A' }, { id: 'y', f, label: 'B' }], f, ['a', 'b']);
  assert.equal(tie.label, null);
  assert.equal(tie.nearest.length, 2);
  const vote = classify([{ id: 'x', f, label: 'A' }, { id: 'y', f, label: 'A' }, { id: 'z', f, label: 'B' }], f, ['a', 'b']);
  assert.equal(vote.label, 'A');
  assert.deepEqual(vote.votes, { A: 2, B: 1 });
  const near = classify([{ id: 'x', f: { a: 1, b: 9 }, label: 'A' }, { id: 'y', f: { a: 5, b: 5 }, label: 'B' }], f, ['a', 'b']);
  assert.equal(near.label, 'A');
  assert.equal(near.distance, 1);
  const set = trainerSet('djur');
  assert.deepEqual(sharedClues(set, trainerItem(set, 'svan').f, trainerItem(set, 'pingvin').f, ['kropp', 'farg']), ['fjädrar']);
});

test('träna en AI: faktameningarna har rätt svensk grammatik', () => {
  const lines = TRAINER_SETS.flatMap((set) => set.items.map((it) => factLine(set, it)));
  assert.ok(lines.includes('En pingvin är en fågel.'));
  assert.ok(lines.includes('En fladdermus är ett däggdjur.'));
  assert.ok(lines.includes('Ett grönt äpple är en frukt.'));
  assert.ok(lines.includes('Ett päron är en frukt.'));
  assert.ok(lines.includes('Vindruvor är frukter.'));
  assert.ok(lines.includes('Ärtor är grönsaker.'));
  for (const l of lines) assert.match(l, /^[A-ZÅÄÖ][a-zåäö ]+ är [a-zåäö ]+\.$/);
});
