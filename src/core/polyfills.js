// Små polyfills för Safari 15.0–16.x (äldre iPad 9,7"). Importeras först i main.js.
// Bara det som appen faktiskt använder – tests/unit/compat.test.mjs vaktar resten.

const define = (target, name, value) => {
  if (target && !(name in target)) Object.defineProperty(target, name, { value, writable: true, configurable: true });
};

// Array/String.prototype.at (Safari 15.4). Används t.ex. i Bygga, Svenska och dialogernas fokusspärr.
function at(n) {
  const len = this.length >>> 0;
  let i = Math.trunc(n) || 0;
  if (i < 0) i += len;
  return i < 0 || i >= len ? undefined : this[i];
}
define(Array.prototype, 'at', at);
define(String.prototype, 'at', function (n) { return at.call(String(this), n); });
if (typeof Int8Array !== 'undefined') define(Object.getPrototypeOf(Int8Array.prototype), 'at', at);

// findLast/findLastIndex (Safari 15.4) och Object.hasOwn (Safari 15.4).
define(Array.prototype, 'findLastIndex', function (fn, thisArg) {
  for (let i = this.length - 1; i >= 0; i--) if (fn.call(thisArg, this[i], i, this)) return i;
  return -1;
});
define(Array.prototype, 'findLast', function (fn, thisArg) {
  const i = this.findLastIndex(fn, thisArg);
  return i < 0 ? undefined : this[i];
});
define(Object, 'hasOwn', (obj, key) => Object.prototype.hasOwnProperty.call(Object(obj), key));

if (typeof document !== 'undefined' && typeof HTMLElement !== 'undefined') {
  // inert-attributet (Safari 15.5): CSS i app.css spärrar tryck under .no-inert.
  if (!('inert' in HTMLElement.prototype)) document.documentElement.classList.add('no-inert');

  // Fullscreen API: iPad-Safari före 16.4 har bara webkit-prefixet (iPhone saknar det helt,
  // där används appens CSS-helskärm). Prefixet returnerar inget Promise.
  const E = Element.prototype;
  const D = Document.prototype;
  if (!E.requestFullscreen && E.webkitRequestFullscreen) {
    E.requestFullscreen = function () {
      return new Promise((resolve, reject) => {
        const done = () => { cleanup(); resolve(); };
        const fail = () => { cleanup(); reject(new TypeError('fullscreen error')); };
        const cleanup = () => {
          document.removeEventListener('webkitfullscreenchange', done);
          document.removeEventListener('webkitfullscreenerror', fail);
        };
        document.addEventListener('webkitfullscreenchange', done);
        document.addEventListener('webkitfullscreenerror', fail);
        try { this.webkitRequestFullscreen(); } catch (err) { cleanup(); reject(err); }
      });
    };
    if (!('fullscreenElement' in D)) Object.defineProperty(D, 'fullscreenElement', { configurable: true, get() { return this.webkitFullscreenElement || this.webkitCurrentFullScreenElement || null; } });
    if (!D.exitFullscreen && (D.webkitExitFullscreen || D.webkitCancelFullScreen)) {
      D.exitFullscreen = function () {
        if (!this.fullscreenElement) return Promise.resolve();
        (this.webkitExitFullscreen || this.webkitCancelFullScreen).call(this);
        return Promise.resolve();
      };
    }
    document.addEventListener('webkitfullscreenchange', () => document.dispatchEvent(new Event('fullscreenchange')));
  }
}
