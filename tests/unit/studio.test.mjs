import test from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../../src/apps/registry.js';
import { STUDIO_ITEMS, STUDIO_ROOMS, STUDIO_PACKS, STORY_PROMPTS, emptyStudio, normalizeStudio, getRequirementProgress, buyPack, unlockRoom, canUnlockPack } from '../../src/apps/studio.js';
const ready = (req, coins=100) => ({coins,stats:{[req.app]:{modules:{[req.module]:{rounds:1,best:8}}}}});
test('studio bank has distinct, complete curated content and valid playable learning links',()=>{
  assert.ok(STUDIO_ITEMS.length>=60); assert.ok(STUDIO_PACKS.length>=8); assert.ok(STORY_PROMPTS.length>=32);
  for(const bank of [STUDIO_ITEMS,STUDIO_ROOMS,STUDIO_PACKS,STORY_PROMPTS]) assert.equal(new Set(bank.map(i=>i.id)).size,bank.length);
  for(const item of STUDIO_ITEMS){assert.ok(item.name&&item.shape&&item.theme); assert.ok(item.width>0&&item.height>0);}
  for(const entry of [...STUDIO_PACKS,...STUDIO_ROOMS.filter(r=>r.requirement)]){
    const app=APPS.find(a=>a.id===entry.requirement.app); const module=app?.modules.find(m=>m.id===entry.requirement.module);
    assert.ok(module?.gen,`${entry.id} must link to a completable exercise`); assert.equal(module.minLevel,0);
  }
  for(const pack of STUDIO_PACKS){assert.ok(pack.items.length>=4);assert.equal(new Set(pack.items).size,pack.items.length); for(const id of pack.items)assert.ok(STUDIO_ITEMS.some(i=>i.id===id));}
});
test('free starter includes two characters and ten owned props and survives reload',()=>{
  const state=emptyStudio({name:'Mira'});assert.equal(state.characters[0].name,'Mira');assert.equal(state.characters.length,2);assert.equal(Object.keys(state.inventory).length,10);
  assert.deepEqual(normalizeStudio(JSON.parse(JSON.stringify(state))),state);
});
test('learning means finished rounds rather than question score, and pack spending is exactly once',()=>{
  const pack=STUDIO_PACKS[0], state=emptyStudio();const p=ready(pack.requirement);p.stats[pack.requirement.app].modules[pack.requirement.module].rounds=0;
  const before=JSON.stringify(state); assert.equal(getRequirementProgress(p,pack.requirement).complete,false);assert.equal(buyPack(p,state,pack.id).reason,'learning');assert.equal(p.coins,100);assert.equal(JSON.stringify(state),before);
  p.stats[pack.requirement.app].modules[pack.requirement.module].rounds=1;assert.equal(canUnlockPack(p,state,pack),true);
  state.goal={type:'pack',id:pack.id};assert.equal(buyPack(p,state,pack.id).ok,true);assert.equal(p.coins,100-pack.price);assert.equal(state.goal,null);
  for(const id of pack.items)assert.equal(state.inventory[id],1);
  assert.equal(buyPack(p,state,pack.id).reason,'owned');assert.equal(p.coins,100-pack.price);
  assert.deepEqual(normalizeStudio(JSON.parse(JSON.stringify(state))),state);
});
test('insufficient balance and locked rooms cannot mutate either state',()=>{
  const room=STUDIO_ROOMS[1],p=ready(room.requirement,0),state=emptyStudio();const before=JSON.stringify(state);
  assert.equal(unlockRoom(p,state,room.id).reason,'coins');assert.equal(JSON.stringify(state),before);assert.equal(p.coins,0);
  p.coins=room.price; assert.equal(unlockRoom(p,state,room.id).ok,true); assert.equal(p.coins,0);assert.equal(state.rooms.length,2); assert.equal(unlockRoom(p,state,room.id).reason,'owned');
  assert.equal(buyPack(p,state,'missing').reason,'unknown');
});
test('malformed saves remove unknown content and duplicate placements while preserving valid play',()=>{
  assert.equal(normalizeStudio(null).rooms.length,1);const s=emptyStudio();s.rooms[0].placed.push({...s.rooms[0].placed[0],uid:'extra',x:-100,y:900});s.rooms[0].placed[0].x=-100;s.rooms[0].placed[0].y=900;
  s.inventory.fake=100;s.inventory['moon-lamp']=-5;s.activeRoom='missing';s.characters[0].shirt='url(evil)';s.rooms[0].placed.push({uid:'fake',itemId:'missing',x:50,y:50});
  const n=normalizeStudio(s);assert.equal(n.rooms[0].placed.filter(p=>p.itemId==='cloud-sofa').length,1);assert.equal(n.rooms[0].placed[0].x,0);assert.equal(n.rooms[0].placed[0].y,100);assert.equal(n.inventory.fake,undefined);assert.equal(n.inventory['moon-lamp'],undefined);assert.equal(n.activeRoom,n.rooms[0].id);assert.equal(n.characters[0].shirt,'#77bdb5');
});
test('older children have a rich narrative challenge in every theme and all stories have descriptive titles',()=>{
  const themes=new Set(STUDIO_ITEMS.map(i=>i.theme));
  assert.equal(STORY_PROMPTS.length,50);
  for(const theme of themes){const older=STORY_PROMPTS.filter(p=>p.theme===theme&&p.minLevel===4);assert.equal(older.length,1);assert.ok(older[0].text.includes('1.')&&older[0].text.includes('2.')&&older[0].text.includes('3.'));assert.ok(older[0].text.length>220);}
  for(const prompt of STORY_PROMPTS){assert.ok(!/berättelse \d/.test(prompt.title));assert.ok(prompt.title.length>8);}
});
