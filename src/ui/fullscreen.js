import { h, onTap } from './dom.js';

let active = null;
const resized = () => requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));

export function exitAppFullscreen() { active?.exit(); }

// Helskärm på OS-roten behåller dialoger och skärmtidsöverlägg synliga.
export function createAppFullscreenControl(target, root) {
  let expanded = false;
  let native = false;
  let disposed = false;
  const button = h('button.app-fullscreen-toggle', { type: 'button', 'aria-label': 'Helskärm', title: 'Helskärm', 'aria-pressed': 'false' }, '⛶');
  const refresh = () => {
    button.textContent = expanded ? '⤡' : '⛶';
    button.setAttribute('aria-label', expanded ? 'Avsluta helskärm' : 'Helskärm');
    button.title = expanded ? 'Avsluta helskärm' : 'Helskärm';
    button.setAttribute('aria-pressed', String(expanded));
  };
  const leave = () => {
    expanded = false;
    target.classList.remove('app-fullscreen');
    root.classList.remove('app-focus-mode');
    if (active === control) active = null;
    refresh(); resized();
  };
  const control = {
    button,
    get expanded() { return expanded; },
    exit() {
      const shouldExitNative = native && document.fullscreenElement === root;
      native = false;
      leave();
      if (shouldExitNative) document.exitFullscreen?.()?.catch?.(() => {});
    },
    destroy() {
      if (disposed) return;
      if (active === control) control.exit();
      disposed = true;
      document.removeEventListener('fullscreenchange', changed);
      document.removeEventListener('keydown', keydown);
    },
  };
  const changed = () => {
    if (active !== control) return;
    if (document.fullscreenElement === root) native = true;
    else if (native) { native = false; leave(); }
    resized();
  };
  const keydown = event => {
    if (event.defaultPrevented || document.querySelector('dialog[open], .sheet')) return;
    if (event.key === 'Escape' && active === control) control.exit();
  };
  onTap(button, () => {
    if (expanded) { control.exit(); return; }
    exitAppFullscreen();
    expanded = true; active = control;
    target.classList.add('app-fullscreen'); root.classList.add('app-focus-mode');
    refresh(); resized();
    // CSS-vyn fungerar också där webbläsaren inte erbjuder Fullscreen API.
    try {
      const request = root.requestFullscreen?.();
      request?.then?.(() => {
        if (disposed || active !== control) {
          if (!active && document.fullscreenElement === root) document.exitFullscreen?.()?.catch?.(() => {});
          return;
        }
        native = document.fullscreenElement === root;
        resized();
      }).catch(() => {});
    } catch {}
  }, { guardMs: 150 });
  document.addEventListener('fullscreenchange', changed);
  document.addEventListener('keydown', keydown);
  return control;
}
