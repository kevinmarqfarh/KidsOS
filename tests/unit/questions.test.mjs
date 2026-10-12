import {test} from 'node:test';import assert from 'node:assert/strict';
import {deckPick,questionIdentity,variedQuestion,questionSession} from '../../src/core/questions.js';
import {createRng} from '../../src/core/rng.js';
import {ACTIVITY_BANKS,genActivity,SPELL_WORDS,genSpelling} from '../../src/apps/practice-activities.js';
import {AI_SCENARIOS,genAIQuiz} from '../../src/apps/ai.js';
import {APPS} from '../../src/apps/registry.js';

test('åtta kursfrågor i varje nivågrupp är unika före repetition',()=>{
 for(const [topic,bank] of Object.entries(ACTIVITY_BANKS))for(const level of [0,1,2,3,4]){
  const ctx={},rng=createRng(93),pool=bank.filter(row=>row[0]===(level>=4?4:level>=2?2:0));
  assert.ok(pool.length>=8,topic);const seen=[];for(let i=0;i<8;i++)seen.push(genActivity(topic,level,rng,ctx).prompt);
  assert.equal(new Set(seen).size,8,`${topic}/${level}`);
 }
});
test('alla AI-ämnen erbjuder minst åtta olika frågor från nivå 2',()=>{
 for(const topic of Object.keys(AI_SCENARIOS)){
  const ctx={},rng=createRng(1),seen=new Set();for(let i=0;i<8;i++)seen.add(genAIQuiz(topic,2,rng,ctx).prompt);
  assert.equal(seen.size,8,topic);
 }
});
test('stavning har tolv ord på varje nivå och använder alla före omstart',()=>{
 for(let level=0;level<5;level++){
  assert.ok(SPELL_WORDS[level].length>=12);const ctx={},rng=createRng(1),seen=new Set();
  for(let i=0;i<12;i++)seen.add(genSpelling(level,rng,ctx).word);assert.equal(seen.size,12);
 }
});
test('omkastade svar förändrar inte frågans identitet',()=>{
 const a={type:'choice',prompt:'Samma fråga',answer:'a',options:['a','b']};assert.equal(questionIdentity(a),questionIdentity({...a,options:['b','a']}));
 assert.notEqual(questionIdentity(a),questionIdentity({...a,prompt:'En annan fråga'}));
});
test('slut på olika frågor ger stopp i stället för en dubblett och återanvänds i ny runda',()=>{
 const session={ctx:{},recent:[]},rng=createRng(1),seen=new Set(),pool=[['a','A'],['b','B']];
 const generate=()=>{const item=deckPick(pool,rng,session.ctx,'test',r=>r[0]);return{type:'choice',prompt:item[1],answer:item[0]};};
 assert.ok(variedQuestion(generate,session,seen));assert.ok(variedQuestion(generate,session,seen));assert.equal(variedQuestion(generate,session,seen),null);
 assert.ok(variedQuestion(generate,session,new Set()));
});
test('historik följer profil och modul och undviker senaste frågan mellan rundor',()=>{
 const a=questionSession('a','math','one'),b=questionSession('b','math','one');assert.equal(a,questionSession('a','math','one'));assert.notEqual(a,b);
 const rng=createRng(1),generate=()=>({type:'choice',prompt:String(rng.int(1,20)),answer:'yes'});
 const first=variedQuestion(generate,a,new Set()),second=variedQuestion(generate,a,new Set());assert.notEqual(questionIdentity(first),questionIdentity(second));
});
test('alla quizmoduler ger bara unika frågor inom runda eller stoppar vid tömd bank',()=>{
 for(const app of APPS)for(const mod of app.modules.filter(m=>m.gen))for(let level=mod.minLevel||0;level<5;level++){
  const ctx={found:{}},session={ctx,recent:[]},seen=new Set(),rng=createRng(18),actual=new Set();
  for(let n=0;n<8;n++){
   const q=variedQuestion(()=>mod.gen(Math.min(level,mod.maxLevel??4),rng,ctx),session,seen);if(!q)break;
   const id=questionIdentity(q);assert.ok(!actual.has(id),`${app.id}/${mod.id}/${level}`);actual.add(id);
  }
  assert.ok(actual.size,`${app.id}/${mod.id}/${level}`);
 }
});
