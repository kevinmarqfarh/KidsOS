import {test} from 'node:test';
import assert from 'node:assert/strict';
import {exchangePieces,pieceValue,equivalentFractions,sentenceIsValid,mapMove,MAP_MISSIONS,MAP_PLACES} from '../../src/apps/workshops.js';
import {newProfile,emptyState} from '../../src/core/model.js';
import {saveJSON,loadJSON,exportBackup,importBackup,deleteDrawingsFor} from '../../src/core/storage.js';

test('växling bevarar värdet och är reversibel för alla möjliga tal under 100',()=>{
  for(let ones=0;ones<=99;ones++)for(let tens=0;tens<=9;tens++){
    const initial={ones,tens},bundled=exchangePieces(initial,'bundle');
    assert.equal(pieceValue(initial),pieceValue(bundled));
    if(ones>=10)assert.deepEqual(exchangePieces(bundled,'split'),initial);
    assert.equal(pieceValue(exchangePieces(initial,'split')),pieceValue(initial));
    assert.deepEqual(initial,{ones,tens});
  }
});
test('bråkkök jämför samma helhet med korsmultiplikation',()=>{
  assert.ok(equivalentFractions({n:1,d:2},{n:4,d:8}));
  assert.ok(equivalentFractions({n:3,d:4},{n:6,d:8}));
  assert.equal(equivalentFractions({n:1,d:4},{n:1,d:2}),false);
});
test('alla 27 avsedda meningar accepteras och fel ordföljd avvisas',()=>{
  for(const s of ['Katten','Roboten','Fågeln'])for(const v of ['vilar','hoppar','leker'])for(const p of ['i parken','vid huset','i skogen'])assert.ok(sentenceIsValid([s,v,p]));
  assert.equal(sentenceIsValid(['vilar','Katten','i parken']),false);assert.equal(sentenceIsValid(['Katten']),false);
});
test('kartuppdrag är nåbara med steg och rörelser håller sig inom kartan',()=>{
  let pos={x:0,y:2};
  for(const [i,deltas] of [[[1,0],[1,0]],[[0,-1],[0,-1]],[[1,0],[1,0]]].entries()){
    for(const [dx,dy] of deltas)pos=mapMove(pos,dx,dy);
    const target=MAP_PLACES.find(p=>p.id===MAP_MISSIONS[i].place);assert.deepEqual(pos,{x:target.x,y:target.y});
  }
  assert.deepEqual(mapMove({x:0,y:0},-1,-1),{x:0,y:0});assert.deepEqual(mapMove({x:4,y:2},1,1),{x:4,y:2});
});
test('berättelse följer profil i backup och tas bort med profilen',()=>{
  const state=emptyState(),p=newProfile({name:'Ateljé',age:7});state.profiles.push(p);
  const story=[{person:'En vän',place:'i parken',event:'hittar ett brev',text:'Min egen berättelse.'}];
  saveJSON(`story.${p.id}`,story);const backup=exportBackup(state);saveJSON(`story.${p.id}`,[]);importBackup(backup);
  assert.deepEqual(loadJSON(`story.${p.id}`,null),story);deleteDrawingsFor(p.id);assert.equal(loadJSON(`story.${p.id}`,null),null);
});
