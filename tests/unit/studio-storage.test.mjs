import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyState,newProfile} from '../../src/core/model.js';
import {emptyStudio} from '../../src/apps/studio.js';
import {saveJSON,loadJSON,exportBackup,importBackup,deleteDrawingsFor} from '../../src/core/storage.js';
test('backup restores studio ownership and rooms with the same profile and coin balance',()=>{
 const state=emptyState(),profile=newProfile({name:'Saga',ageBand:'6-7'});
 state.profiles.push(profile);state.activeId=profile.id;profile.coins=9;
 const studio=emptyStudio(profile);studio.rooms[0].name='Min sagoverkstad';
 saveJSON(`studio.${profile.id}`,studio);
 const backup=exportBackup(state);
 saveJSON(`studio.${profile.id}`,{rooms:[]});
 const restored=importBackup(backup);
 assert.equal(restored.profiles[0].coins,9);
 assert.equal(loadJSON(`studio.${profile.id}`,null).rooms[0].name,'Min sagoverkstad');
 assert.deepEqual(loadJSON(`studio.${profile.id}`,null).inventory,studio.inventory);
 deleteDrawingsFor(profile.id);
 assert.equal(loadJSON(`studio.${profile.id}`,null),null);
});
