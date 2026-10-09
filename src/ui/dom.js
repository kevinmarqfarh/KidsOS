// Liten DOM-hjälpare: h('div.klass', {onClick}, barn...)
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
    const now = performance.now();
    if (now - last < guardMs) return;
    last = now;
    fn(e);
  });
  return el;
}

export function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export const reducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};
