import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
const dom = parseHTML('<!doctype html><html><body><main></main><aside></aside></body></html>');
for (const name of ['window','document','Node','Element','DocumentFragment','Event','CustomEvent','HTMLElement']) globalThis[name] = dom[name] || dom.window[name];
globalThis.requestAnimationFrame = () => 0;
window.matchMedia = () => ({matches:false});
const { modal } = await import('../../src/ui/shell.js');
const { h } = await import('../../src/ui/dom.js');
const { kos } = await import('../../src/ui/kos.js');
kos.overlayRoot = document.querySelector('aside');

test('shell confirmation uses the browser top layer, isolates app controls and closes through cancel', () => {
  let opened = 0, closed = 0;
  HTMLElement.prototype.showModal = function() { opened++; this.setAttribute('open',''); };
  HTMLElement.prototype.close = function() { closed++; this.removeAttribute('open'); };
  Object.defineProperty(HTMLElement.prototype,'open',{configurable:true,get(){return this.hasAttribute('open');}});
  const sheet = modal(h('div',h('h2','Byta användare?')), [['Stanna','ghost',()=>{}]]);
  const dialog = kos.overlayRoot.querySelector('dialog.sheet');
  assert.equal(opened,1);
  assert.equal(dialog.getAttribute('aria-label'),'Byta användare?');
  assert.equal(document.querySelector('main').hasAttribute('inert'),true);
  dialog.dispatchEvent(new Event('cancel',{cancelable:true}));
  assert.equal(closed,1);
  assert.equal(document.querySelector('main').hasAttribute('inert'),false);
  sheet.close();
  assert.equal(closed,1);
  dialog.remove();
  delete HTMLElement.prototype.showModal; delete HTMLElement.prototype.close; delete HTMLElement.prototype.open;
});

test('fallback sheet remains open and nondismissable sheets ignore cancel', () => {
  const sheet = modal(h('h2','Vänta'),[],{dismissable:false});
  const dialog = kos.overlayRoot.querySelector('dialog.sheet');
  assert.ok(dialog.hasAttribute('open'));
  dialog.dispatchEvent(new Event('cancel',{cancelable:true}));
  assert.equal(dialog.hasAttribute('inert'),false);
  assert.equal(document.querySelector('main').hasAttribute('inert'),true);
  sheet.close(); dialog.remove();
  assert.equal(document.querySelector('main').hasAttribute('inert'),false);
});


test('nested sheet is hosted by the active dialog and restores the parent when closed', () => {
  const parent = h('dialog', {open:true}, h('button','Fortsätt'));
  kos.overlayRoot.append(parent);
  const child = modal(h('h2','Nästa dialog'), [['Stanna','ghost',()=>{}]]);
  assert.equal(parent.querySelector('dialog.sheet')?.contains(child.panel),true);
  assert.equal(parent.hasAttribute('inert'),false);
  assert.equal(parent.querySelector('button').hasAttribute('inert'),true);
  child.close();
  assert.equal(parent.querySelector('button').hasAttribute('inert'),false);
  parent.remove();
});
