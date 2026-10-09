import test from 'node:test';
import assert from 'node:assert/strict';
import { STORIES, CONTEXT_WORDS, TEXT_CLUES, genContextWords, genTextClues, svenskaApp } from '../../src/apps/svenska.js';
import { createRng } from '../../src/core/rng.js';

const newIds = ['bollhjalp', 'tva-koppar', 'froraden', 'bibliotekskort', 'pappersbron', 'spar-i-snon', 'klassens-skylt', 'ryktet-om-parken'];
test('original stories offer listening through inference with unique questions and answers', () => {
  const added = STORIES.filter((story) => newIds.includes(story.id));
  assert.equal(added.length, 8);
  assert.deepEqual([...new Set(added.map((story) => story.level))].sort(), [0, 1, 2, 3, 4]);
  assert.equal(new Set(STORIES.map((story) => story.id)).size, STORIES.length);
  for (const story of added) {
    assert.ok(story.text.length >= 4);
    assert.ok(story.questions.length >= 3);
    for (const question of story.questions) {
      assert.equal(question.o.filter((option) => option === question.a).length, 1);
      assert.equal(new Set(question.o).size, question.o.length);
    }
  }
  assert.equal(svenskaApp.modules.find((module) => module.id === 'stories').minLevel, 0);
});
test('context banks cover every learning level with self-contained situations', () => {
  for (const bank of [CONTEXT_WORDS, TEXT_CLUES]) {
    assert.ok(bank.length >= 12);
    assert.equal(new Set(bank.map((row) => row[1])).size, bank.length);
    for (let level = 0; level <= 4; level++) assert.ok(bank.filter((row) => row[0] === level).length >= 3);
    for (const row of bank) assert.equal(new Set(row.slice(3)).size, 3);
  }
});
test('context generators retain spoken evidence and exactly one correct answer', () => {
  for (const gen of [genContextWords, genTextClues]) {
    for (let level = 0; level <= 4; level++) {
      const contexts = new Set();
      for (let seed = 1; seed <= 100; seed++) {
        const question = gen(level, createRng(seed));
        contexts.add(question.prompt);
        assert.equal(question.options.filter((option) => option.id === question.answer).length, 1);
        assert.equal(question.say, question.prompt);
        assert.ok(question.options.every((option) => option.say === option.label));
        assert.ok(question.explain.includes(question.answer));
      }
      assert.ok(contexts.size >= 3);
    }
  }
});
