import {test} from 'node:test';
import assert from 'node:assert/strict';
import {visibleViewportHeight,installViewport} from '../../src/core/viewport.js';
test('visible height follows keyboard and rotation but does not reflow pinch zoom',()=>{
 assert.equal(visibleViewportHeight({height:418.3,scale:1},844),418);
 assert.equal(visibleViewportHeight({height:390,scale:1},844),390);
 assert.equal(visibleViewportHeight(null,844),844);
 assert.equal(visibleViewportHeight({height:300,scale:2},844),null);
 assert.equal(visibleViewportHeight({height:NaN,scale:1},844),844);
});
test('viewport updates CSS height without rebuilding profile or activity and cleans up listeners',()=>{
 const host=new EventTarget(),viewport=new EventTarget(),properties=new Map();
 host.innerHeight=844;host.visualViewport=viewport;viewport.height=844;viewport.scale=1;
 const root={style:{setProperty:(k,v)=>properties.set(k,v),removeProperty:k=>properties.delete(k)}};
 const cleanup=installViewport(root,host);assert.equal(properties.get('--app-height'),'844px');
 viewport.height=410;viewport.dispatchEvent(new Event('resize'));assert.equal(properties.get('--app-height'),'410px');
 viewport.scale=2;viewport.height=200;viewport.dispatchEvent(new Event('resize'));assert.equal(properties.get('--app-height'),'410px');
 cleanup();viewport.scale=1;viewport.dispatchEvent(new Event('resize'));assert.equal(properties.has('--app-height'),false);
});
