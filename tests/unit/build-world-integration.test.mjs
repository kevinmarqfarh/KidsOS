import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newProfile,emptyState,recordRound,addStars,spendCoins} from '../../src/core/model.js';
import {saveJSON,loadJSON,exportBackup,importBackup,deleteDrawingsFor} from '../../src/core/storage.js';
import {APPS} from '../../src/apps/registry.js';
import {emptyWorld,purchaseBlock,placeBlock} from '../../src/apps/build-world.js';

test('Byggvärlden ligger direkt efter Lekstaden och använder den gemensamma valutan från alla kursappar',()=>{
 const index=APPS.findIndex(a=>a.id==='play');assert.equal(APPS[index+1].id,'build-world');
 for(const app of APPS.filter(a=>!['play','build-world'].includes(a.id))){
  const p=newProfile({name:'Lärande',age:8});p.coins=0;let world=emptyWorld();
  const result=recordRound(p,app.id,'integration',{correctFirst:0,total:5});assert.ok(result.coinsEarned>=5,app.id);
  const quote=purchaseBlock(world,'stone');const before=p.coins;
  assert.ok(spendCoins(p,quote.cost));world=quote.state;
  assert.equal(p.coins,before-quote.cost);assert.equal(world.inventory.stone,emptyWorld().inventory.stone+1);
  assert.ok(placeBlock(world,1,1,'stone').ok);
 }
 const creative=newProfile({name:'Skapare',age:5});addStars(creative,2);assert.equal(creative.coins,2);
});
test('spelvärld och gemensamt saldo återställs från backup utan att annan profils värld skrivs över',()=>{
 const state=emptyState(),p=newProfile({name:'Byggare',age:9}),other=newProfile({name:'Vän',age:6});state.profiles.push(p,other);
 p.coins=37;const built=placeBlock(emptyWorld(),2,3,'wood').state,otherWorld=placeBlock(emptyWorld(),1,4,'glass').state;
 saveJSON(`buildWorld.${p.id}`,built);saveJSON(`buildWorld.${other.id}`,otherWorld);
 const backup=exportBackup(state);saveJSON(`buildWorld.${p.id}`,emptyWorld());
 const restored=importBackup(backup);assert.deepEqual(loadJSON(`buildWorld.${p.id}`,null),built);assert.equal(restored.profiles.find(x=>x.id===p.id).coins,37);
 deleteDrawingsFor(p.id);assert.equal(loadJSON(`buildWorld.${p.id}`,null),null);assert.deepEqual(loadJSON(`buildWorld.${other.id}`,null),otherWorld);
 deleteDrawingsFor(other.id);
});
