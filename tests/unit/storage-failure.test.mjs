import {test} from 'node:test';
import assert from 'node:assert/strict';

test('lagringsfel behåller senaste data, återhämtning rensar reservkopian', async()=>{
  const disk=new Map();let full=false;
  globalThis.localStorage={getItem:key=>disk.get(key)??null,setItem(key,value){if(full)throw new Error('quota');disk.set(key,value);},removeItem:key=>disk.delete(key)};
  const {saveJSON,loadJSON,removeJSON}=await import('../../src/core/storage.js?quota-test');
  assert.equal(saveJSON('test',{version:1}),true);
  full=true;assert.equal(saveJSON('test',{version:2}),false);
  assert.deepEqual(loadJSON('test',null),{version:2});
  full=false;assert.equal(saveJSON('test',{version:3}),true);
  assert.deepEqual(loadJSON('test',null),{version:3});
  removeJSON('test');assert.equal(loadJSON('test',null),null);
});
