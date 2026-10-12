import {test} from 'node:test';
import assert from 'node:assert/strict';
import {genSequenceRule,genColumn,columnSteps} from '../../src/apps/math.js';
import {createRng} from '../../src/core/rng.js';
test('talföljdens regel stämmer med alla visade tal och svaren är unika',()=>{
 for(let level=0;level<5;level++)for(let seed=0;seed<100;seed++){
  const q=genSequenceRule(level,createRng(seed));
  const numbers=[...q.visual.matchAll(/<span>(\d+)<\/span>/g)].map(m=>Number(m[1]));
  assert.equal(numbers.length,5);
  for(let i=1;i<5;i++)assert.equal(numbers[i]-numbers[i-1],Number(q.answer));
  assert.equal(new Set(q.options.map(o=>o.id)).size,3);
  assert.ok(numbers.every(n=>n>=0));
 }
});
test('kolumnträning har ett steg för varje siffra även vid överföring och nollor',()=>{
 for(let level=1;level<5;level++)for(let seed=0;seed<100;seed++){
  const q=genColumn(level,createRng(seed));const [,a,op,b]=q.prompt.match(/(\d+) ([+-]) (\d+)/);
  const steps=columnSteps(Number(a),Number(b),op);
  assert.equal(steps.length,Math.max(String(a).length,String(b).length,String(q.answer).length));
 }
 assert.equal(columnSteps(100,1,'-').length,3);
 assert.equal(columnSteps(99,1,'+').length,3);
});
