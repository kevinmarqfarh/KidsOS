// fx – små animationskomponenter som förstärker inlärningen.
// Vanilla JS-portar av React-komponenter från 21st.dev (Magic UI av Dillion Verma, Animate UI av
// Elliot Sutton – båda MIT). Inga beroenden, fungerar offline. Se docs/KOMPONENTER.md.
//
// Alla effekter respekterar:
//  - prefers-reduced-motion  → 'none': inga animationer, värden sätts direkt
//  - <html data-adapted="…">  → 'calm': lugna, korta övergångar utan partiklar/blixtar (anpassat läge)
import { h, reducedMotion } from './dom.js';
import {
  motionMode, tickerValue, tickerDuration, progressPercent, ringDash, segmentWords,
  wordIndexAt, isSpokenWord, wordTimings, sparkleParticles, staggerDelay,
} from './fx-logic.js';

export { progressPercent, segmentWords, levelProgress } from './fx-logic.js';

/** 'full' | 'calm' | 'none' – läses varje gång så att inställningen kan ändras medan appen körs. */
export function motion() {
  let adapted = '';
  let motionOff = false;
  try {
    adapted = document.documentElement.dataset.adapted || '';
    motionOff = document.documentElement.dataset.adaptedMotion === 'off'; // Autismstöd: animationer avstängda
  } catch {}
  return motionMode({ reduced: reducedMotion() || motionOff, adapted });
}

const raf = (fn) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(fn) : setTimeout(fn, 16));

/* ------------------------------------------------------------------ */
/* Number Ticker (Magic UI) – talet räknar upp så att barnet SER att    */
/* stjärnorna/mynten blir fler (antalsuppfattning, uppräkning).         */
/* ------------------------------------------------------------------ */
export function numberTicker(el, from, to, { duration, format = String } = {}) {
  const a = Math.round(Number(from) || 0);
  const b = Math.round(Number(to) || 0);
  const ms = duration ?? tickerDuration(a, b);
  if (el.__fxTick) el.__fxTick.cancelled = true;
  const mode = motion();
  if (mode === 'none' || !ms || a === b) {
    el.textContent = format(b);
    return Promise.resolve();
  }
  const job = { cancelled: false };
  el.__fxTick = job;
  const dur = mode === 'calm' ? Math.min(ms, 500) : ms;
  const t0 = performance.now();
  el.textContent = format(a);
  return new Promise((resolve) => {
    const step = (now) => {
      if (job.cancelled) return resolve();
      const t = (now - t0) / dur;
      el.textContent = format(tickerValue(a, b, t));
      if (t < 1) raf(step);
      else resolve();
    };
    raf(step);
  });
}

// Senast visade värde per nyckel, så att en omritad statusrad kan ticka från förra värdet.
const lastShown = new Map();

/**
 * <span> som visar `value` och tickar upp från förra värdet för samma `key` (t.ex. 'stars').
 * Lägger klassen fx-bump på föräldern när värdet ökar (liten "studs" på chippet).
 */
export function tickerSpan(key, value) {
  const v = Math.round(Number(value) || 0);
  const span = h('span.fx-ticker', String(v));
  const prev = lastShown.get(key);
  lastShown.set(key, v);
  if (prev !== undefined && prev !== v) {
    span.textContent = String(prev);
    raf(() => {
      numberTicker(span, prev, v);
      if (v > prev && motion() !== 'none') {
        const chip = span.parentElement;
        if (chip) {
          chip.classList.remove('fx-bump');
          void chip.offsetWidth;
          chip.classList.add('fx-bump');
          setTimeout(() => chip.classList.remove('fx-bump'), 700);
        }
      }
    });
  }
  return span;
}

/* ------------------------------------------------------------------ */
/* Animated Circular Progress Bar (Magic UI) – hur långt i rundan /     */
/* hur nära nästa nivå. Synlig delmålsstruktur (self-monitoring).       */
/* ------------------------------------------------------------------ */
export function progressRing({ value = 0, max = 1, size = 64, stroke = 8, label, center, className = '', ariaLabel } = {}) {
  const r = (size - stroke) / 2;
  const { circumference } = ringDash(0, r);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('aria-hidden', 'true');
  const mk = (cls) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', size / 2);
    c.setAttribute('cy', size / 2);
    c.setAttribute('r', r);
    c.setAttribute('fill', 'none');
    c.setAttribute('stroke-width', stroke);
    c.setAttribute('class', cls);
    return c;
  };
  const track = mk('fx-ring-track');
  const bar = mk('fx-ring-bar');
  bar.setAttribute('stroke-linecap', 'round');
  bar.setAttribute('stroke-dasharray', circumference.toFixed(2));
  bar.setAttribute('stroke-dashoffset', circumference.toFixed(2));
  bar.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);
  svg.append(track, bar);
  const mid = h('span.fx-ring-center');
  const wrap = h('div.fx-ring', { class: className, role: 'img', style: { width: `${size}px`, height: `${size}px`, '--fx-ring-size': `${size}px` } }, svg, mid);
  let cur = 0;
  const api = {
    el: wrap,
    update(v, m = max) {
      max = m;
      const pct = progressPercent(v, m);
      const { offset } = ringDash(pct, r);
      bar.style.strokeDashoffset = offset.toFixed(2);
      wrap.style.setProperty('--fx-pct', pct);
      wrap.setAttribute('aria-label', ariaLabel ? ariaLabel(v, m, pct) : `${v} av ${m}`);
      if (center) {
        const c = center(v, m, pct);
        if (c instanceof Node) mid.replaceChildren(c);
        else mid.textContent = c;
      } else if (label !== false) {
        numberTicker(mid, cur, pct, { format: (x) => `${x}%`, duration: 700 });
      }
      cur = pct;
      wrap.classList.toggle('full', pct >= 100);
      return api;
    },
  };
  wrap.__fx = api;
  // Starta från 0 så att ringen fylls upp synligt när den visas.
  raf(() => raf(() => api.update(value, max)));
  if (motion() === 'none') api.update(value, max);
  return api;
}

/* ------------------------------------------------------------------ */
/* Flip Card (Animate UI) – fråga fram, svar bak. Hämtning ur minnet    */
/* (retrieval practice): barnet gissar först, vänder sedan.             */
/* ------------------------------------------------------------------ */
export function flipCard(front, back, { onFlip, label = 'Vänd kortet', className = '' } = {}) {
  const inner = h('span.fx-flip-inner', h('span.fx-flip-face.fx-flip-front', front), h('span.fx-flip-face.fx-flip-back', { 'aria-hidden': 'true' }, back));
  const card = h('button.fx-flip', { type: 'button', class: className, 'aria-pressed': 'false', 'aria-label': label }, inner);
  let flipped = false;
  const set = (f) => {
    flipped = f;
    card.classList.toggle('flipped', f);
    card.setAttribute('aria-pressed', String(f));
    card.querySelector('.fx-flip-front').setAttribute('aria-hidden', String(f));
    card.querySelector('.fx-flip-back').setAttribute('aria-hidden', String(!f));
  };
  card.addEventListener('click', () => {
    set(!flipped);
    onFlip?.(flipped);
  });
  card.flip = (f = !flipped) => set(f);
  return card;
}

/* ------------------------------------------------------------------ */
/* Typing Animation / Text Animate (Magic UI) → ord-för-ord-markering  */
/* vid uppläsning. Kopplar ljud till skrift (fonologisk medvetenhet,   */
/* läsinlärning): barnet ser exakt vilket ord som sägs.                */
/* ------------------------------------------------------------------ */
/** Fyller `el` med <span class="word"> per ord. Returnerar spännen. */
export function wordReveal(el, text, { appear = false } = {}) {
  el.replaceChildren();
  const spans = [];
  for (const seg of segmentWords(text)) {
    if (!seg.word) {
      el.append(seg.text);
      continue;
    }
    const s = h('span.word', seg.text);
    if (appear && motion() === 'full') {
      s.classList.add('fx-word-in');
      s.style.animationDelay = `${staggerDelay(seg.index, { step: 70, cap: 1400 })}ms`;
    }
    spans.push(s);
    el.append(s);
  }
  el.classList.add('fx-words');
  return spans;
}

/**
 * Läser upp texten i `container` och markerar varje ord när det sägs.
 * `say(text, opts)` är t.ex. kos.say. Använder talsyntesens boundary-händelser och faller
 * annars tillbaka på uppskattad tid per stavelse. Returnerar ett löfte som löses när uppläsningen är klar.
 */
export function speakAlong(container, say, { text, rate = 0.92, slow = false } = {}) {
  let spans = [...container.querySelectorAll('.word')];
  const full = text ?? container.textContent;
  if (!spans.length) spans = wordReveal(container, full);
  const spoken = spans.filter((s) => isSpokenWord(s.textContent));
  let current = -1;
  let gotBoundary = false;
  let timers = [];
  const mark = (i) => {
    if (i === current || i < 0 || i >= spoken.length) return;
    spoken[current]?.classList.remove('fx-now');
    spoken[current]?.classList.add('fx-read');
    current = i;
    spoken[i].classList.add('fx-now');
  };
  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };
  const finish = () => {
    clearTimers();
    spans.forEach((s) => s.classList.remove('fx-now', 'fx-read'));
    container.classList.remove('fx-speaking');
  };
  container.classList.add('fx-speaking');
  const startFallback = (r) => {
    clearTimers();
    const times = wordTimings(spoken.map((s) => s.textContent), { rate: slow ? Math.max(0.55, r - 0.3) : r });
    times.forEach((t, i) => timers.push(setTimeout(() => !gotBoundary && mark(i), t)));
  };
  startFallback(rate);
  const p = Promise.resolve(
    say(full, {
      slow,
      onStart: (r) => startFallback(r || rate),
      onBoundary: (charIndex, cleanText) => {
        if (!gotBoundary) clearTimers();
        gotBoundary = true;
        mark(wordIndexAt(cleanText, charIndex));
      },
    }),
  );
  return p.then(finish, finish);
}

/* ------------------------------------------------------------------ */
/* Cool Mode + Sparkles Text (Magic UI) – kort gnistskur vid rätt svar. */
/* Tydlig, omedelbar positiv återkoppling knuten till det man tryckte på.*/
/* ------------------------------------------------------------------ */
export function sparkles(target, { count = 14, symbols = ['✦', '★', '✧', '•'] } = {}) {
  const mode = motion();
  if (!target || mode === 'none') return;
  if (mode === 'calm') {
    target.classList.add('fx-glow');
    setTimeout(() => target.classList.remove('fx-glow'), 900);
    return;
  }
  // Mät först nästa bildruta: återkopplingen som visas samtidigt kan flytta knappen.
  raf(() => raf(() => burst(target, count, symbols)));
}

function burst(target, count, symbols) {
  if (!target.isConnected) return;
  const r = target.getBoundingClientRect();
  if (!r.width && !r.height) return;
  const layer = h('div.fx-sparkle-layer', { style: { left: `${r.left + r.width / 2}px`, top: `${r.top + r.height / 2}px` }, 'aria-hidden': 'true' });
  const colors = ['#ffc93c', '#ff6b5b', '#3d8bfd', '#2fae66', '#8a5cf6', '#ff5fa2'];
  sparkleParticles(count).forEach((pt, i) => {
    layer.appendChild(
      h('span.fx-sparkle', {
        style: { '--dx': `${pt.dx}px`, '--dy': `${pt.dy}px`, '--rot': `${pt.rot}deg`, '--sz': `${pt.size}px`, animationDelay: `${pt.delay}ms`, color: colors[i % colors.length] },
      }, symbols[i % symbols.length]),
    );
  });
  (document.querySelector('.overlays') || document.body).appendChild(layer);
  setTimeout(() => layer.remove(), 1100);
}

/* ------------------------------------------------------------------ */
/* Ripple (Magic UI ripple-button) – visar exakt var fingret träffade. */
/* Hjälper små barn att förstå att tryck registreras.                  */
/* ------------------------------------------------------------------ */
export function ripple(el) {
  if (!el || el.__fxRipple) return el;
  el.__fxRipple = true;
  el.classList.add('fx-ripple-host');
  el.addEventListener('pointerdown', (e) => {
    if (motion() !== 'full' || el.disabled) return;
    const r = el.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2;
    // Eget klipp-lager: värden får inte overflow:hidden, då skulle den utökade träffytan (::after) klippas.
    let clip = el.querySelector(':scope > .fx-ripple-clip');
    if (!clip) {
      clip = h('span.fx-ripple-clip', { 'aria-hidden': 'true' });
      el.appendChild(clip);
    }
    const dot = h('span.fx-ripple', { style: { width: `${d}px`, height: `${d}px`, left: `${e.clientX - r.left - d / 2}px`, top: `${e.clientY - r.top - d / 2}px` } });
    clip.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  });
  return el;
}

/* ------------------------------------------------------------------ */
/* Animated List + Blur Fade (Magic UI) – element glider in i tur och   */
/* ordning: ögat följer en sak i taget i stället för en vägg av ikoner. */
/* ------------------------------------------------------------------ */
export function animatedList(container, { step = 55, cap = 900, selector } = {}) {
  if (!container || motion() === 'none') return container;
  const items = selector ? container.querySelectorAll(selector) : container.children;
  [...items].forEach((it, i) => {
    it.classList.add('fx-list-item');
    it.style.setProperty('--fx-delay', `${staggerDelay(i, { step, cap })}ms`);
  });
  return container;
}

export function blurFade(el) {
  if (el && motion() !== 'none') el.classList.add('fx-blur-fade');
  return el;
}

/* ------------------------------------------------------------------ */
/* Shimmer Button (Magic UI) – en mjuk glans som visar "nästa steg".    */
/* Lägg på den VIKTIGASTE knappen så att barnet vet vart det ska.       */
/* ------------------------------------------------------------------ */
export function shimmer(btn) {
  if (btn) btn.classList.add('fx-shimmer');
  return btn;
}
