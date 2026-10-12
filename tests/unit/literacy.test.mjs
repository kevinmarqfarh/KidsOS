import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FACT_TEXTS,STORY_TEXTS,PICTURE_PROMPTS,readingQuestions} from '../../src/apps/literacy-bank.js';
import {hasPhoto} from '../../src/ui/img.js';
import {saveJSON,loadJSON,exportBackup,importBackup,deleteDrawingsFor} from '../../src/core/storage.js';
import {newProfile,emptyState} from '../../src/core/model.js';

test('banken har 48 originaltexter, 156 frågor och 24 tillgängliga bildmotiv',()=>{
 assert.equal(FACT_TEXTS.length,30);assert.equal(STORY_TEXTS.length,18);assert.equal(PICTURE_PROMPTS.length,24);
 const ids=new Set();
 for(const item of [...FACT_TEXTS,...STORY_TEXTS,...PICTURE_PROMPTS]){assert.ok(!ids.has(item.id));ids.add(item.id);assert.ok(hasPhoto(item.key||item.photo),item.title);}
 assert.equal([...FACT_TEXTS,...STORY_TEXTS].reduce((n,t)=>n+t.questions.length,0),156);
});
test('frågor har unika alternativ och ledtrådar finns i rätt textversion',()=>{
 for(const item of [...FACT_TEXTS,...STORY_TEXTS]){
  assert.equal(item.questions.length,item.minLevel?4:3);
  for(const short of [true,false]){
   const text=short&&!item.minLevel?item.short:item.text;
   for(const q of readingQuestions(item,short)){
    assert.equal(new Set([q.answer,...q.wrong]).size,3,`${item.title}: ${q.prompt}`);
    // Evidence may combine two nonadjacent sentences, but each sentence is present.
    for(const sentence of q.evidence.split(/(?<=[.!?])\s+/))assert.ok(text.includes(sentence),`${item.id}: ${sentence}`);
    assert.ok(q.answer && q.prompt && q.kind);
   }
  }
  assert.equal(readingQuestions(item,true).length,item.minLevel?4:1);
 }
});
test('texter följer rätt profil i säkerhetskopia och tas bort med profilen',()=>{
 const state=emptyState(),p=newProfile({name:'Skrivare',age:9});state.profiles.push(p);
 const notes={'picture-1':{text:'Min berättelse',review0:true},'fact-2:writing':{text:'Min faktatext'}};
 saveJSON(`literacy.${p.id}`,notes);const backup=exportBackup(state);saveJSON(`literacy.${p.id}`,{});importBackup(backup);
 assert.deepEqual(loadJSON(`literacy.${p.id}`,null),notes);
 deleteDrawingsFor(p.id);assert.equal(loadJSON(`literacy.${p.id}`,null),null);
});
