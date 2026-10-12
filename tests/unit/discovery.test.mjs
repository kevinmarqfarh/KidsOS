import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../../src/apps/registry.js';
import { CURRICULUM } from '../../src/core/curriculum.js';
import { genColumnNotes as genColumn } from '../../src/apps/math.js';
import { normalizeProfile, newProfile, layoutFor } from '../../src/core/model.js';

test('every app has accessible discovery lessons linked to real practice and curriculum', () => {
  // Känslor & jag är ett stödprogram (autismstöd) utan skolämneslektioner.
  for (const app of APPS.filter((a) => a.id !== 'feelings')) {
    assert.ok(app.lessons.length >= 2);
    assert.equal(new Set(app.lessons.map(l=>l.id)).size,app.lessons.length);
    assert.equal(app.lessons[0].minLevel, 0);
    assert.ok(app.modules.some(m => m.id === 'discover-course' && m.view === 'course'));
    for (const lesson of app.lessons) {
      const practice = app.modules.find(m => m.id === lesson.moduleId);
      assert.ok(practice, `${app.id}/${lesson.moduleId}`);
      assert.ok(practice.minLevel <= lesson.minLevel);
      assert.ok(lesson.steps.length >= 2);
      for (const id of lesson.lgr) assert.ok(CURRICULUM[id]);
    }
  }
});

test('column calculations explain carrying and borrowing across zero', () => {
  for (const [a, b, minus, expected, level] of [[27,15,false,42,2],[42,15,true,27,2],[302,185,true,117,4],[120,20,false,140,4]]) {
    const values = [a,b];
    const q = genColumn(level, { chance: () => minus, int: () => values.shift() });
    assert.equal(q.answer, expected);
    assert.ok(q.explain.includes(`Svaret är ${expected}`));
    assert.ok(q.visual.includes('aria-label="Minnessiffra eller växling: Ental"'));
    assert.ok(!q.visual.includes(`Svaret är ${expected}`));
    if (a === 302) assert.ok(q.explain.includes('0 − 1 (från förra växlingen) + 10'));
  }
});

test('layout preferences survive normalization independently per profile', () => {
  const pc = newProfile({age:5}), tablet = newProfile({age:10});
  pc.settings.layout = 'desktop'; tablet.settings.layout = 'tablet';
  assert.equal(layoutFor(normalizeProfile(pc)), 'desktop');
  assert.equal(layoutFor(normalizeProfile(tablet)), 'tablet');
  pc.settings.layout = 'broken';
  assert.equal(normalizeProfile(pc).settings.layout, 'auto');
});
