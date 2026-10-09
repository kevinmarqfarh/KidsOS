import { test } from 'node:test';
import assert from 'node:assert/strict';
import { genEveryday, genSharing, mathApp } from '../../src/apps/math.js';
import { createRng } from '../../src/core/rng.js';

// Count physical tokens and allocations rather than repeat the generators' formulas.
function tokens(n) { return Array.from({ length: n }, (_, i) => i); }
function checkAnswer(q, expected) {
  assert.equal(Number(q.answer), expected, q.prompt);
  assert.ok(q.hint.length > 20);
  if (q.options) {
    assert.equal(new Set(q.options.map(o => o.id)).size, 3);
    assert.equal(q.options.filter(o => Number(o.id) === expected).length, 1);
  }
}

test('Vardagsklur answers satisfy the described physical situation across all age levels', () => {
  for (let level = 0; level <= 4; level++) {
    const families = new Set();
    const prompts = new Set();
    for (let seed = 1; seed <= 400; seed++) {
      const q = genEveryday(level, createRng(seed));
      const [a, b, c] = q.prompt.match(/\d+/g).map(Number);
      let expected;
      if (q.prompt.includes('äpplen')) {
        families.add('picnic'); expected = [...tokens(a), ...tokens(b)].length;
      } else if (q.prompt.includes('buss')) {
        families.add('bus'); expected = tokens(a).filter((_, i) => i >= b).length;
      } else if (q.prompt.includes('klossar')) {
        families.add('build'); expected = tokens(a).filter((_, i) => i >= b).length;
      } else if (q.prompt.includes('planterar')) {
        families.add('garden'); expected = tokens(a).flatMap(() => tokens(b)).length;
      } else {
        families.add('shop'); const purse = tokens(c);
        for (let item = 0; item < a; item++) for (let krona = 0; krona < b; krona++) purse.pop();
        expected = purse.length;
      }
      checkAnswer(q, expected); prompts.add(q.prompt);
      if (level === 0) assert.ok(expected <= 5);
    }
    assert.equal(families.size, level < 2 ? 3 : 5);
    assert.ok(prompts.size >= (level === 0 ? 10 : 30));
  }
});

test('Lika delar answers match round-robin distribution and selected fraction groups', () => {
  for (let level = 0; level <= 4; level++) {
    const families = new Set();
    for (let seed = 1; seed <= 400; seed++) {
      const q = genSharing(level, createRng(seed));
      const nums = q.prompt.match(/\d+/g).map(Number);
      const total = nums[0];
      const share = q.prompt.includes('jordgubbar');
      const denominator = share ? nums[1] : nums[2];
      const groups = Array.from({ length: denominator }, () => []);
      tokens(total).forEach((t, i) => groups[i % denominator].push(t));
      assert.equal(new Set(groups.map(g => g.length)).size, 1);
      const left = q.prompt.includes('kvar');
      families.add(share ? 'share' : left ? 'left' : 'portion');
      const selected = share ? [groups[0]] : left ? groups.slice(nums[1]) : groups.slice(0, nums[1]);
      checkAnswer(q, selected.flat().length);
      assert.ok(!q.say.includes('/'));
      if (level === 0) assert.ok(q.visual.includes('🍓'));
    }
    assert.equal(families.size, level <= 1 ? 1 : 3);
  }
});

test('new modules start at appropriate ages and preserve existing arithmetic modules', () => {
  assert.equal(mathApp.modules.find(m => m.id === 'everyday').minLevel, 0);
  assert.equal(mathApp.modules.find(m => m.id === 'sharing').minLevel, 2);
  for (const id of ['count', 'addsub', 'times', 'doublehalf']) assert.ok(mathApp.modules.some(m => m.id === id));
});
