// Skriv ABC – spåra bokstäver, siffror, ord och sitt eget namn med fingret.
import { h, clear, onTap } from '../dom.js';
import { GLYPHS, UPPER, LOWER, DIGITS, GUIDES, layoutWord, scoreTrace, strokeHints, WRITE_WORDS } from '../../apps/letters.js';
import { ALPHABET } from '../../apps/svenska.js';
import { hasInSet } from '../../core/model.js';

const SET_KEYS = { upper: 'traced:upper', lower: 'traced:lower', digits: 'traced:digits', name: 'tracedNameSet', words: 'traced:words' };

export function traceView(el, { kos, app, module: mod, level }) {
  const p = kos.profile;
  const set = mod.set;
  let items;
  if (set === 'upper') items = UPPER;
  else if (set === 'lower') items = LOWER;
  else if (set === 'digits') items = DIGITS;
  else if (set === 'name') items = [p.name];
  else items = WRITE_WORDS.map((w) => w.w);
  const setKey = SET_KEYS[set];
  let idx = 0;
  // börja på första som inte är klar
  const firstOpen = items.findIndex((c) => !hasInSet(p, setKey, c));
  if (firstOpen > 0) idx = firstOpen;
  let mode = level >= 4 ? 'free' : 'trace'; // 'trace' = spåra mall, 'free' = skriv själv
  let strokes = [];
  let current = null;
  let layout = null;
  let unitPx = 100;
  let demoRaf = 0;

  const strip = h('div.trace-strip', { role: 'tablist' });
  const caption = h('div.trace-caption');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'trace-guide');
  const canvas = h('canvas.trace-ink');
  const board = h('div.trace-board', svg, canvas);
  const msg = h('div.trace-msg', { 'aria-live': 'polite' });
  const modeTrace = h('button.seg-btn', { type: 'button' }, '👀 Spåra');
  const modeFree = h('button.seg-btn', { type: 'button' }, '✍️ Skriv själv');
  const modeBtn = h('div.seg', modeTrace, modeFree);
  const demoBtn = h('button.btn.btn-ghost', { type: 'button' }, '▶ Visa hur');
  const clearBtn = h('button.btn.btn-ghost', { type: 'button' }, '🧽 Sudda');
  const doneBtn = h('button.btn.btn-primary', { type: 'button' }, 'Klar ✓');
  const nextBtn = h('button.btn.btn-primary', { type: 'button', hidden: true }, 'Nästa ➜');

  el.append(
    h('div.trace', strip, h('div.trace-top', caption, modeBtn), board, msg, h('div.row-actions.trace-actions', demoBtn, clearBtn, doneBtn, nextBtn)),
  );

  function renderStrip() {
    clear(strip);
    if (items.length <= 1) {
      strip.hidden = true;
      return;
    }
    items.forEach((c, i) => {
      const done = hasInSet(p, setKey, c);
      const b = h('button.trace-chip', { type: 'button', class: `${i === idx ? 'on' : ''} ${done ? 'done' : ''}`, role: 'tab', 'aria-selected': String(i === idx) }, c);
      onTap(b, () => select(i));
      strip.appendChild(b);
    });
    strip.children[idx]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  function select(i) {
    idx = i;
    strokes = [];
    nextBtn.hidden = true;
    doneBtn.hidden = false;
    msg.textContent = '';
    msg.className = 'trace-msg';
    renderStrip();
    setup();
    sayItem();
  }

  function itemText() {
    return items[idx];
  }

  function sayItem() {
    const t = itemText();
    if (set === 'upper' || set === 'lower') {
      const a = ALPHABET.find((x) => x.l === t.toUpperCase());
      kos.autoSay(`${t.toUpperCase()}, som i ${a.word}. ${mode === 'trace' ? 'Följ linjen från den gröna pricken.' : 'Skriv själv!'}`);
    } else if (set === 'digits') kos.autoSay(`Siffran ${t}.`);
    else kos.autoSay(`Skriv ${t}.`);
  }

  function setup() {
    const t = itemText();
    layout = t.length === 1 && GLYPHS[t] ? { strokes: GLYPHS[t], width: 1 } : layoutWord(t);
    // storlek
    // clientWidth påverkas inte av fönstrets öppningsanimation (transform)
    const maxW = Math.max(240, Math.min(el.clientWidth - 8, 900));
    const maxH = Math.max(220, Math.min(window.innerHeight * 0.52, 560));
    unitPx = Math.floor(Math.min(maxH, maxW / layout.width));
    const W = Math.round(unitPx * layout.width);
    const H = unitPx;
    board.style.width = `${W}px`;
    board.style.height = `${H}px`;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    svg.setAttribute('viewBox', `0 0 ${layout.width * 100} 100`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    drawGuide();
    redrawInk();
    // bildtext
    clear(caption);
    if (set === 'upper' || set === 'lower') {
      const a = ALPHABET.find((x) => x.l === t.toUpperCase());
      caption.append(h('span.trace-pic', a.e), h('span', h('b', `${t.toUpperCase()} ${t.toLowerCase()}`), ` som i ${a.word}`));
    } else if (set === 'words') {
      const w = WRITE_WORDS.find((x) => x.w === t);
      caption.append(h('span.trace-pic', w?.e || '📝'), h('b', t));
    } else if (set === 'name') {
      caption.append(h('span.trace-pic', p.avatar), h('b', `Ditt namn: ${t}`));
    } else caption.append(h('span.trace-pic', '🔢'), h('b', `Siffran ${t}`));
    modeTrace.classList.toggle('on', mode === 'trace');
    modeFree.classList.toggle('on', mode === 'free');
  }

  function drawGuide(missed = null) {
    const W = layout.width * 100;
    let s = '';
    const y = (v) => v * 100;
    s += `<rect x="0" y="0" width="${W}" height="100" rx="4" fill="var(--paper-2)"/>`;
    s += `<line x1="0" x2="${W}" y1="${y(GUIDES.top)}" y2="${y(GUIDES.top)}" class="gl gl-top"/>`;
    s += `<line x1="0" x2="${W}" y1="${y(GUIDES.x)}" y2="${y(GUIDES.x)}" class="gl gl-mid"/>`;
    s += `<line x1="0" x2="${W}" y1="${y(GUIDES.base)}" y2="${y(GUIDES.base)}" class="gl gl-base"/>`;
    s += `<line x1="0" x2="${W}" y1="${y(GUIDES.desc)}" y2="${y(GUIDES.desc)}" class="gl gl-top"/>`;
    const pts = (st) => st.map(([a, b]) => `${(a * 100).toFixed(1)},${(b * 100).toFixed(1)}`).join(' ');
    const showTemplate = mode === 'trace' || missed;
    const tmplClass = level >= 2 ? 'tmpl dashed' : 'tmpl';
    if (showTemplate) for (const st of layout.strokes) s += `<polyline points="${pts(st)}" class="${tmplClass}"/>`;
    else s += layout.strokes.map((st) => `<polyline points="${pts(st)}" class="tmpl ghost"/>`).join('');
    if (missed) for (const st of missed) s += `<polyline points="${pts(st)}" class="tmpl missed"/>`;
    if (mode === 'trace' && layout.strokes.length <= 12) {
      for (const hint of strokeHints(layout.strokes)) {
        const x = hint.x * 100;
        const yy = hint.y * 100;
        s += `<g class="start-dot" transform="translate(${x} ${yy})"><circle r="4.2"/><text y="1.6" text-anchor="middle">${hint.n}</text></g>`;
        s += `<g class="dir-arrow" transform="translate(${x} ${yy}) rotate(${hint.angle}) translate(8 0)"><path d="M0,-2.4 L4,0 L0,2.4 Z"/></g>`;
      }
    }
    svg.innerHTML = s;
  }

  function redrawInk() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = p.color || '#3d8bfd';
    ctx.lineWidth = Math.max(8, unitPx * 0.055);
    for (const st of [...strokes, current].filter(Boolean)) {
      if (!st.length) continue;
      ctx.beginPath();
      ctx.moveTo(st[0][0] * unitPx, st[0][1] * unitPx);
      if (st.length === 1) ctx.lineTo(st[0][0] * unitPx + 0.1, st[0][1] * unitPx);
      for (const [x, y] of st) ctx.lineTo(x * unitPx, y * unitPx);
      ctx.stroke();
    }
  }

  const toUnit = (e) => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / unitPx, (e.clientY - r.top) / unitPx];
  };
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    cancelDemo();
    canvas.setPointerCapture?.(e.pointerId);
    current = [toUnit(e)];
    redrawInk();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!current) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs) current.push(toUnit(ev));
    redrawInk();
  });
  const end = () => {
    if (current && current.length) strokes.push(current);
    current = null;
    redrawInk();
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  onTap(clearBtn, () => {
    strokes = [];
    redrawInk();
    drawGuide();
    msg.textContent = '';
  });
  const setMode = (m) => {
    if (mode === m) return;
    mode = m;
    strokes = [];
    setup();
    kos.say(mode === 'trace' ? 'Spåra längs linjen.' : 'Skriv själv – utan mall! Du får en extra stjärna.');
  };
  onTap(modeTrace, () => setMode('trace'));
  onTap(modeFree, () => setMode('free'));
  onTap(demoBtn, () => demo());
  onTap(doneBtn, () => check());
  onTap(nextBtn, () => select((idx + 1) % items.length));

  function check() {
    if (!strokes.length) {
      kos.say('Rita först med fingret!');
      return;
    }
    const lvl = mode === 'free' ? Math.max(0, level - 1) : level;
    const res = scoreTrace(layout.strokes, strokes, lvl);
    const t = itemText();
    if (res.pass) {
      const bonus = mode === 'free' ? 1 : 0;
      const stars = res.stars + bonus;
      const isNew = !hasInSet(p, setKey, t);
      const r = kos.reward({ app: app.id, stars, set: setKey, item: t });
      if (set === 'name') kos.reward({ counter: 'tracedName', silent: true });
      kos.sfx('correct');
      msg.className = 'trace-msg ok';
      msg.textContent = `${'⭐'.repeat(res.stars)} ${res.stars === 3 ? 'Supersnyggt!' : res.stars === 2 ? 'Snyggt!' : 'Bra!'} ${isNew ? '(ny!)' : ''}`;
      kos.say(res.stars === 3 ? 'Supersnyggt!' : 'Snyggt skrivet!');
      if (res.stars === 3) kos.confetti(50);
      doneBtn.hidden = true;
      nextBtn.hidden = items.length <= 1;
      renderStrip();
      void r;
    } else {
      kos.sfx('wrong');
      kos.retry();
      // markera delar av mallen som inte täcktes
      const tol = 0.1;
      const ink = strokes.flat();
      const missed = layout.strokes
        .map((st) => st.filter(([x, y]) => !ink.some(([a, b]) => Math.hypot(a - x, b - y) < tol)))
        .filter((st) => st.length > 1);
      drawGuide(missed);
      msg.className = 'trace-msg try';
      const tip = res.scribble ? ['💡 Oj, mycket kludd! Rita lugnt längs linjen – sudda och försök igen.', 'Rita lugnt längs linjen.'] : res.coverage < 0.8 ? ['💡 Nästan! De orangea delarna saknas. Sudda och försök igen.', 'Nästan! Några delar saknas. Försök igen.'] : ['💡 Försök hålla dig närmare linjen.', 'Försök hålla dig närmare linjen.'];
      msg.textContent = tip[0];
      kos.say(tip[1]);
    }
  }

  function cancelDemo() {
    cancelAnimationFrame(demoRaf);
    svg.querySelectorAll('.demo-path, .demo-pen').forEach((n) => n.remove());
  }

  function demo() {
    cancelDemo();
    const all = layout.strokes;
    const ns = 'http://www.w3.org/2000/svg';
    const pen = document.createElementNS(ns, 'circle');
    pen.setAttribute('r', '4');
    pen.setAttribute('class', 'demo-pen');
    svg.appendChild(pen);
    let si = 0;
    let pi = 0;
    let poly = null;
    const step = () => {
      if (si >= all.length) {
        setTimeout(cancelDemo, 600);
        return;
      }
      const st = all[si];
      if (!poly) {
        poly = document.createElementNS(ns, 'polyline');
        poly.setAttribute('class', 'demo-path');
        svg.appendChild(poly);
      }
      pi = Math.min(st.length, pi + 2);
      poly.setAttribute('points', st.slice(0, pi).map(([a, b]) => `${a * 100},${b * 100}`).join(' '));
      const [cx, cy] = st[pi - 1];
      pen.setAttribute('cx', cx * 100);
      pen.setAttribute('cy', cy * 100);
      if (pi >= st.length) {
        si++;
        pi = 0;
        poly = null;
      }
      demoRaf = requestAnimationFrame(step);
    };
    step();
  }

  const onResize = () => setup();
  window.addEventListener('resize', onResize);
  renderStrip();
  requestAnimationFrame(() => {
    setup();
    sayItem();
  });
  return () => {
    cancelDemo();
    window.removeEventListener('resize', onResize);
  };
}
