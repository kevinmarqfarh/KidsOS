import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NEW_WONDERS, eligibleWonders, wonderAnswer, wonderOfTheDay } from '../../src/apps/wonder.js';

test('nya frågor har både enkelt svar och fördjupning', () => {
  assert.equal(NEW_WONDERS.length, 8);
  for (const card of NEW_WONDERS) {
    assert.ok(card.q && card.a && card.simple && card.deep && card.think);
    assert.equal(wonderAnswer(card, 0), card.simple);
    assert.equal(wonderAnswer(card, 2), card.a);
    assert.ok(wonderAnswer(card, 4).includes(card.deep));
  }
});
test('slump- och dagsfrågepooler håller nivån och har stabila kort inom dagen', () => {
  for (let level = 0; level <= 4; level++) {
    const pool = eligibleWonders(level);
    assert.ok(pool.length > 32);
    assert.ok(pool.every(card => (card.minLevel ?? 0) <= level));
    for (let day = 1; day <= 30; day++) {
      const morning = wonderOfTheDay(new Date(2026, 9, day, 8), level);
      const evening = wonderOfTheDay(new Date(2026, 9, day, 20), level);
      assert.equal(morning.id, evening.id);
      assert.ok(pool.includes(morning));
    }
  }
  assert.ok(!eligibleWonders(0).some(card => card.id === 'satellitbana'));
  assert.ok(eligibleWonders(0, true).some(card => card.id === 'satellitbana'));
});
