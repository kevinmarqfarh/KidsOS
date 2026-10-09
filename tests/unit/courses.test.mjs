import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS, appById } from '../../src/apps/registry.js';
import { AI_LESSONS, AI_SCENARIOS } from '../../src/apps/ai.js';
import { CODING_LESSONS, CODING_QUESTIONS } from '../../src/apps/code.js';
import { AI_TRAINING, AI_TESTING, classifyAnimal } from '../../src/apps/ai-lab.js';

test('kurser har lektionssteg och giltiga övningar', () => {
  assert.equal(appById('code').name, 'Kodning');
  assert.equal(appById('ai').name, 'AI');
  assert.equal(APPS.length, 10);
  for (const [appId, lessons] of [['ai', AI_LESSONS], ['code', CODING_LESSONS]]) {
    const app = appById(appId);
    assert.ok(lessons.length >= 6);
    assert.equal(new Set(lessons.map(item => item.id)).size, lessons.length);
    for (const lesson of lessons) {
      const practice = app.modules.find(item => item.id === lesson.moduleId);
      assert.ok(practice, `${appId}/${lesson.id}: övning saknas`);
      assert.ok(practice.minLevel <= lesson.minLevel, 'Övningen ska vara tillgänglig när lektionen är det');
      assert.ok(lesson.takeaway && lesson.steps.length >= 2);
      for (const step of lesson.steps) assert.ok(step.title && step.text && step.example);
    }
  }
  assert.ok(Object.values(AI_SCENARIOS).flat().length >= 42);
  assert.ok(Object.values(CODING_QUESTIONS).flat().length >= 30);
});

test('modellen ändrar sina svar när träningens etiketter ändras', () => {
  const bird = AI_TESTING.find(item => item.label === 'fågel');
  const mammalOnly = AI_TRAINING.filter(item => item.label === 'däggdjur');
  assert.equal(classifyAnimal(mammalOnly, bird.features).label, 'däggdjur');
  assert.equal(classifyAnimal(AI_TRAINING, bird.features).label, 'fågel');
  const incorrect = AI_TRAINING.map(item => ({ ...item, label: 'däggdjur' }));
  assert.equal(classifyAnimal(incorrect, bird.features).label, 'däggdjur');
  for (const item of AI_TESTING) {
    assert.ok(!AI_TRAINING.some(train => train.id === item.id), 'testdjuren måste hållas isär från träningen');
    assert.equal(classifyAnimal(AI_TRAINING, item.features).label, item.label);
  }
});

test('modellen visar osäkerhet vid tom träning och motstridiga lika nära exempel', () => {
  const features = [1, 0, 1, 0];
  assert.equal(classifyAnimal([], features).label, null);
  const conflicting = [{ id: 'a', features, label: 'fågel' }, { id: 'b', features, label: 'däggdjur' }];
  const result = classifyAnimal(conflicting, features);
  assert.equal(result.label, null);
  assert.equal(result.nearest.length, 2);
});
