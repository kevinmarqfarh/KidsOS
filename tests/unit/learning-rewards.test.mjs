import test from 'node:test';
import assert from 'node:assert/strict';
import { newProfile, recordRound, spendCoins, LEARNING_ROUND_COINS } from '../../src/core/model.js';

test('fullföljd modul ger samma lärandemynt även efter flera försök', () => {
  const p = newProfile({ name: 'Kompis', age: 6 });
  const result = recordRound(p, 'math', 'count', { correctFirst: 0, total: 6 });
  assert.equal(result.moduleCoins, LEARNING_ROUND_COINS.firstCompletion);
  assert.equal(result.coinsEarned, 6);
  assert.equal(p.coins, result.coinsEarned);
  assert.equal(p.stats.math.modules.count.rounds, 1);
});

test('nya moduler ger upptäckarbonus och övning får mindre fullföljandebonus', () => {
  const p = newProfile({ name: 'Kompis', age: 9 });
  const first = recordRound(p, 'ai', 'patterns', { correctFirst: 6, total: 6 });
  const practice = recordRound(p, 'ai', 'patterns', { correctFirst: 6, total: 6 });
  const next = recordRound(p, 'ai', 'privacy', { correctFirst: 3, total: 6 });
  assert.equal(first.moduleCoins, 5);
  assert.equal(practice.moduleCoins, 2);
  assert.equal(next.moduleCoins, 5);
  assert.equal(p.coins, first.coinsEarned + practice.coinsEarned + next.coinsEarned);
  assert.equal(p.stars, 5);
});

test('myntköp är atomiska och kan aldrig skapa pengar med ogiltiga priser', () => {
  const p = newProfile({ name: 'Kompis', age: 7 });
  p.coins = 8;
  for (const price of [-1, NaN, Infinity, -Infinity, 0.5, '4', 9]) {
    assert.equal(spendCoins(p, price), false);
    assert.equal(p.coins, 8);
  }
  assert.equal(spendCoins(p, 8), true);
  assert.equal(p.coins, 0);
  assert.equal(spendCoins(p, 0), true);
});

test('tom runda ger ingen extra fullföljandebonus', () => {
  const p = newProfile({ name: 'Kompis', age: 4 });
  assert.equal(recordRound(p, 'math', 'count', { correctFirst: 0, total: 0 }).moduleCoins, 0);
});
