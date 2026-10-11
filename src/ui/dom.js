// Liten DOM-hjälpare: h('div.klass', {onClick}, barn...)
import { activityWait } from '../core/activity.js';

// Villkorliga barn (t.ex. `cond ? h(...) : null`) ska aldrig skrivas ut som texten "null".
if (typeof Element !== 'undefined' && !Element.prototype.__kidsosAppend) {
  for (const proto of [Element.prototype, DocumentFragment.prototype]) {
    const orig = proto.append;
    proto.append = function (...nodes) {
      return orig.apply(this, nodes.flat().filter((n) => n !== null && n !== undefined && n !== false));
    };
  }
  Element.prototype.__kidsosAppend = true;
}
export function h(tag, attrs, ...children) {
  let id = null;
  let spec = String(tag);
  const hash = spec.indexOf('#');
  if (hash >= 0) {
    const rest = spec.slice(hash + 1);
    const dot = rest.indexOf('.');
    id = dot >= 0 ? rest.slice(0, dot) : rest;
    spec = spec.slice(0, hash) + (dot >= 0 ? rest.slice(dot) : '');
  }
  const [name, ...classes] = spec.split('.');
  const el = name === 'svg' || name === 'path' ? document.createElementNS('http://www.w3.org/2000/svg', name) : document.createElement(name || 'div');
  if (id) el.id = id;
  if (classes.length) el.className = classes.join(' ');
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) {
    children.unshift(attrs);
    attrs = null;
  }
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (k === 'class') {
        el.className = [el.className, v].filter(Boolean).join(' ');
      } else if (k === 'style' && typeof v === 'object') {
        for (const [sk, sv] of Object.entries(v)) {
          if (sk.startsWith('--')) el.style.setProperty(sk, sv);
          else el.style[sk] = sv;
        }
      } else if (k === 'html') {
        el.innerHTML = v;
      } else if (k === 'dataset') {
        Object.assign(el.dataset, v);
      } else if (v === true) {
        el.setAttribute(k, '');
      } else {
        el.setAttribute(k, v);
      }
    }
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else if (c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

export function svgEl(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/**
 * Barnvänlig tryckhantering: reagerar på pointerup inom elementet,
 * ignorerar "holdovers" (dubbeltryck inom 350 ms) enligt Anthony m.fl. (2019).
 */
export function onTap(el, fn, { guardMs = 350 } = {}) {
  let last = -Infinity; // Första trycket ska fungera även direkt efter start.
  el.addEventListener('click', (e) => {
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
    const now = performance.now();
    if (now - last < guardMs) return;
    last = now;
    fn(e);
  });
  // En ARIA-roll ger inte i sig tangentbordets knappbeteende.
  if (el.tagName !== 'BUTTON' && el.getAttribute('role') === 'button') {
    el.addEventListener('keydown', (e) => {
      if (e.target !== el || !['Enter', ' '].includes(e.key)) return;
      e.preventDefault();
      if (!e.repeat && el.getAttribute('aria-disabled') !== 'true') {
        if (typeof el.click === 'function') el.click();
        else el.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
      }
    });
  }
  return el;
}

export function wait(ms) {
  return activityWait(ms);
}

/** Modal dialog med fokusspärr även i webbläsare utan showModal. */
export function openDialog(dialog, layer = document.body) {
  const previous = document.activeElement;
  const native = typeof dialog.showModal === 'function';
  layer.append(dialog);
  const restoreBackground = isolateModal(dialog);
  dialog.setAttribute('aria-modal', 'true');
  const controls = () => [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter(node => !node.closest('[hidden]'));
  const key = event => {
    if (native) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    } else if (event.key === 'Tab') {
      const items = controls();
      const index = items.indexOf(document.activeElement);
      event.preventDefault();
      const next = index < 0 ? (event.shiftKey ? items.length - 1 : 0) : (index + (event.shiftKey ? -1 : 1) + items.length) % items.length;
      (items[next] || dialog).focus();
    }
  };
  const blockOutside = event => {
    if (!native && !dialog.contains(event.target)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  document.addEventListener('keydown', key, true);
  document.addEventListener('pointerdown', blockOutside, true);
  document.addEventListener('click', blockOutside, true);
  if (native) dialog.showModal();
  else {
    dialog.setAttribute('open', '');
    dialog.setAttribute('role', 'dialog');
    dialog.classList.add('dialog-fallback');
    dialog.setAttribute('tabindex', '-1');
    (controls()[0] || dialog).focus();
  }
  return () => {
    document.removeEventListener('keydown', key, true);
    document.removeEventListener('pointerdown', blockOutside, true);
    document.removeEventListener('click', blockOutside, true);
    dialog.remove();
    restoreBackground();
    if (previous?.isConnected) previous.focus?.({ preventScroll: true });
  };
}

export const reducedMotion = () => {
  if (typeof document !== 'undefined' && document.documentElement.dataset.reducedMotion === 'true') return true;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/** Ge interaktiva SVG-delar samma namn och tangentbordsbeteende som knappar. */
export function interactiveGraphic(node, label, activate) {
  const svg = node.ownerSVGElement || node.closest('svg');
  if (svg?.getAttribute('role') === 'img') svg.setAttribute('role', 'group');
  node.setAttribute('role', 'button');
  node.setAttribute('tabindex', '0');
  node.setAttribute('aria-label', label);
  return onTap(node, () => {
    const root = node.ownerSVGElement || node.closest('svg') || node.parentElement;
    const parent = root.parentElement;
    const focused = document.activeElement === node;
    const id = node.getAttribute('data-hit') || node.getAttribute('data-id') || node.getAttribute('data-i');
    activate();
    if (focused && !node.isConnected && id !== null) {
      const replacement = [...(parent?.querySelectorAll('[role="button"]') || [])].find(item =>
        (item.getAttribute('data-hit') || item.getAttribute('data-id') || item.getAttribute('data-i')) === id);
      replacement?.focus();
    }
  });
}

/** Dölj modalens bakgrund även för hjälpmedlens virtuella markör. */
export function isolateModal(node) {
  const changed = [];
  for (let branch = node; branch?.parentElement && branch !== document.body; branch = branch.parentElement) {
    for (const sibling of branch.parentElement.children) {
      if (sibling === branch || sibling.hasAttribute('inert')) continue;
      sibling.setAttribute('inert', ''); changed.push(sibling);
    }
  }
  return () => changed.forEach(sibling => sibling.removeAttribute('inert'));
}
