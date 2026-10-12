import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PROGRESSION_LESSONS} from '../../src/apps/progression-lessons.js';
import {PROGRESSION_QUESTIONS} from '../../src/apps/progression-questions.js';
import {APPS} from '../../src/apps/registry.js';
import {CURRICULUM} from '../../src/core/curriculum.js';
import {genStatistics,genFractionLinks} from '../../src/apps/math.js';
import {createRng} from '../../src/core/rng.js';

test('sex ämnen har progression från lek till fördjupning med öppningsbara övningar',()=>{
 assert.equal(Object.values(PROGRESSION_LESSONS).flat().length,48);
 for(const [id,lessons] of Object.entries(PROGRESSION_LESSONS)){
  const app=APPS.find(a=>a.id===id);
  for(const stage of ['preschool','reception','primary','middle'])assert.ok(lessons.some(l=>l.stage===stage),`${id}/${stage}`);
  for(const lesson of lessons){
   const practice=app.modules.find(m=>m.id===lesson.moduleId);assert.ok(practice&&practice.minLevel<=lesson.minLevel,lesson.id);
   for(const tag of lesson.lgr){assert.ok(CURRICULUM[tag]);if(lesson.stage==='middle')assert.equal(CURRICULUM[tag].stage,'middle');}
   assert.ok(lesson.steps[1].text.length>50&&lesson.takeaway);
  }
 }
});
test('84 nya scenarier har ett entydigt svar och tolv nya uppgifter per ämne',()=>{
 assert.equal(Object.values(PROGRESSION_QUESTIONS).flat().length,84);
 for(const rows of Object.values(PROGRESSION_QUESTIONS)){
  for(const level of [0,2,4])assert.equal(rows.filter(r=>r[0]===level).length,4);
  for(const row of rows){assert.equal(new Set(row.slice(2,5)).size,3);assert.ok(row[6].length>30);}
 }
});
test('statistikfrågors facit följer visade data och skiljer medelvärde från median',()=>{
 const seen=new Set();
 for(let seed=0;seed<250;seed++){
  const q=genStatistics(4,createRng(seed));const values=[...q.visual.matchAll(/<span>(\d+)<\/span>/g)].map(m=>Number(m[1]));
  assert.equal(values.length,5);let expected;
  if(q.prompt.includes('median')){seen.add('median');expected=[...values].sort((a,b)=>a-b)[2];}
  else if(q.prompt.includes('medelvärde')){seen.add('mean');expected=values.reduce((a,b)=>a+b,0)/values.length;assert.notEqual(expected,[...values].sort((a,b)=>a-b)[2]);}
  else {seen.add('mode');expected=[...new Set(values)].sort((a,b)=>values.filter(n=>n===b).length-values.filter(n=>n===a).length)[0];}
  assert.equal(Number(q.answer),expected);assert.equal(q.options.filter(o=>o.id===q.answer).length,1);
 }
 assert.equal(seen.size,3);
});
test('bråk/procent-frågor har exakt andel och tre skilda svar',()=>{
 for(let seed=0;seed<100;seed++){
  const q=genFractionLinks(4,createRng(seed)),[,n,d]=q.prompt.match(/(\d+)\/(\d+)/);
  assert.equal(Number(q.answer),Number(n)*100/Number(d));assert.equal(new Set(q.options.map(o=>o.id)).size,3);
  assert.ok(q.explain.includes(String(Number(n)/Number(d)).replace('.',',')));
 }
});
