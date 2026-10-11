import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../../src/apps/registry.js';
import { ACTIVITY_BANKS, DRAW_MISSIONS, genActivity, genShopping, genCodeMachine, genSpelling } from '../../src/apps/practice-activities.js';
import { createRng } from '../../src/core/rng.js';
import { newProfile, normalizeProfile } from '../../src/core/model.js';

test('each app has new practice with age progression and distinct scenarios', () => {
  for (const app of APPS) {
    const ids = ['letter-practice','shopping-practice','spelling-practice','loop-machine','drawing-missions','activity-practice'];
    assert.ok(app.modules.some(m => ids.includes(m.id)), app.id);
  }
  for (const [topic, bank] of Object.entries(ACTIVITY_BANKS)) {
    assert.equal(new Set(bank.map(row => row[1])).size, bank.length);
    for (const level of [0,2,4]) {
      assert.ok(bank.filter(row => row[0] === level).length >= 2);
      const ctx = {}, rng = createRng(19), seen = [];
      for (let i=0; i<15; i++) seen.push(genActivity(topic,level,rng,ctx).prompt);
      assert.ok(seen.every((prompt,i) => !i || prompt !== seen[i-1]));
      const allowed = bank.filter(row => row[0] === level).map(row => row[1]);
      assert.ok(seen.every(prompt => allowed.includes(prompt)));
    }
  }
  assert.equal(DRAW_MISSIONS.length, 6);
});

test('generated shopping and loops are arithmetically correct and spelling tiles are complete', () => {
  for (let level=0;level<5;level++) for(let seed=1;seed<100;seed++) {
    const shop = genShopping(level,createRng(seed));
    const [a,b] = [...shop.visual.matchAll(/(\d+) kr/g)].map(m=>Number(m[1]));
    const budget=[5,10,20,100,500][level];
    assert.equal(Number(shop.answer), shop.prompt.includes('kvar') ? budget-a-b : a+b);
    const code=genCodeMachine(level,createRng(seed));
    const [,start,loops,step]=/🤖 (\d+) → (\d+) × (\d+)/.exec(code.visual);
    assert.equal(Number(code.answer),Number(start)+Number(loops)*Number(step));
    const spell=genSpelling(level,createRng(seed));
    assert.deepEqual([...spell.tiles].sort(),[...spell.word].sort());
    assert.ok(!spell.prompt.includes(spell.word));
  }
});

test('writing settings migrate and repetition counts are preserved per profile', () => {
  const old=normalizeProfile({name:'Barn',age:7});
  assert.equal(old.settings.writingRepetitions,8);
  assert.equal(old.settings.writingPenOnly,false);
  const p=newProfile({age:7});
  p.settings.writingRepetitions=10;p.settings.writingPenOnly=true;p.counters['writing:A']=5;
  const restored=normalizeProfile(JSON.parse(JSON.stringify(p)));
  assert.equal(restored.settings.writingRepetitions,10);
  assert.equal(restored.settings.writingPenOnly,true);
  assert.equal(restored.counters['writing:A'],5);
  assert.equal(newProfile({age:7}).counters['writing:A'],undefined);
  p.settings.writingRepetitions=-1;p.settings.writingPenOnly='yes';
  assert.equal(normalizeProfile(p).settings.writingRepetitions,8);
  assert.equal(normalizeProfile(p).settings.writingPenOnly,false);
});
