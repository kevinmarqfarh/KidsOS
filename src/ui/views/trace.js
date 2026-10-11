// Skriv ABC – spåra bokstäver, siffror, ord och sitt eget namn med fingret.
//
// Bokstäver och siffror övas i serier: barnet väljer att skriva samma tecken
// 5 eller 10 gånger i rad. En prickrad visar hur många som är kvar, och stödet
// minskar gradvis (tydlig mall med startpunkt och pil → prickad mall → svag mall).
// Efter en klar serie kan barnet gå vidare och stava ett ord med bokstaven.
//
// "Stava ord": barnet hör ordet och skriver det bokstav för bokstav – med mall
// (spåra) eller utan (skriv själv).
import { h, clear, onTap } from '../dom.js';
import {
  GLYPHS, UPPER, LOWER, DIGITS, GUIDES, layoutWord, scoreTrace, strokeHints, WRITE_WORDS,
  letterSpeech, REPEAT_CHOICES, normalizeRepeat, newSeries, seriesAdvance, seriesLeft, supportFor, seriesKey, praiseFor,
} from '../../apps/letters.js';
import { ALPHABET, SPELL_WORDS, spellWordsForLevel, spellTip } from '../../apps/svenska.js';
import { hasInSet, count } from '../../core/model.js';
import { photo, hasPhoto, pic } from '../img.js';

const SET_KEYS = { upper: 'traced:upper', lower: 'traced:lower', digits: 'traced:digits', name: 'tracedNameSet', words: 'traced:words', spell: 'traced:spell' };
const SERIES_SETS = new Set(['upper', 'lower', 'digits']);
const NUM_WORDS = ['noll', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio'];

export function traceView(el, { kos, app, module: mod, level }) {
  const p = kos.profile;
  const spellUpper = level <= 1;
  let set = mod.set;
  let items = itemsFor(set);
  let setKey = SET_KEYS[set];
  let idx = Math.max(0, items.findIndex((c) => !hasInSet(p, setKey, c)));
  let mode = level >= 4 ? 'free' : 'trace'; // 'trace' = spåra mall, 'free' = skriv själv
  let repeat = normalizeRepeat(p.settings?.writeRepeat);
  let series = newSeries(repeat);
  let fromLetter = null; // bokstaven barnet kom ifrån när det valde "Stava ord med …"
  let spellPos = 0;
  let strokes = [];
  let current = null;
  let layout = null;
  let unitPx = 100;
  let demoRaf = 0;
  let alive = true;
  let busy = false; // under den korta pausen mellan två gånger i en serie
  const timers = new Set();
  const later = (fn, ms) => {
    const t = setTimeout(() => {
      timers.delete(t);
      if (alive) fn();
    }, ms);
    timers.add(t);
  };

  function itemsFor(s) {
    if (s === 'upper') return UPPER;
    if (s === 'lower') return LOWER;
    if (s === 'digits') return DIGITS;
    if (s === 'name') return [p.name];
    if (s === 'spell') return spellWordsForLevel(level).map((x) => x.w);
    return WRITE_WORDS.map((w) => w.w);
  }
  const isSeries = () => SERIES_SETS.has(set);
  const isSpell = () => set === 'spell';
  const spellWord = () => items[idx];
  const spellCased = () => (spellUpper ? spellWord().toUpperCase() : spellWord());

  /* ---------- DOM ---------- */
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
  const backBtn = h('button.btn.btn-ghost', { type: 'button', hidden: true }, '⬅ Bokstäverna');

  // Repetition: välj antal gånger + prickrad.
  const repChoices = REPEAT_CHOICES.map((n) => {
    const b = h('button.rep-choice', { type: 'button', 'aria-pressed': 'false' }, `${n} gånger`);
    onTap(b, () => chooseRepeat(n));
    return b;
  });
  const repDots = h('div.rep-dots', { role: 'progressbar', 'aria-valuemin': '0' });
  const repLeft = h('div.rep-left');
  const repBar = h('div.rep-bar', h('div.rep-pick', h('span.rep-q', 'Hur många gånger?'), ...repChoices), h('div.rep-progress', repDots, repLeft));
  const againBtn = h('button.btn.btn-ghost.rep-big', { type: 'button' }, '🔁 En serie till');
  const nextLetterBtn = h('button.btn.btn-primary.rep-big', { type: 'button' }, 'Nästa ➜');
  const spellBtn = h('button.btn.btn-primary.rep-big.rep-spell', { type: 'button' }, '🔡 Stava ord');
  const repAfter = h('div.rep-after', { hidden: true }, againBtn, nextLetterBtn, spellBtn);

  // Stava ord: bild, lyssna-knapp och rutor för bokstäverna.
  const spellPic = h('div.spell-pic-box');
  const spellSlots = h('div.spell-slots');
  const hearWord = h('button.btn.btn-ghost.spell-hear', { type: 'button' }, '🔊 Hör ordet');
  const hearSound = h('button.btn.btn-ghost.spell-hear', { type: 'button' }, '👂 Vilket ljud?');
  const spellRow = h('div.spell-row', spellPic, h('div.spell-mid', spellSlots, h('div.spell-btns', hearWord, hearSound)));

  el.append(
    h(
      'div.trace',
      strip,
      repBar,
      spellRow,
      h('div.trace-top', caption, modeBtn),
      board,
      msg,
      repAfter,
      h('div.row-actions.trace-actions', backBtn, demoBtn, clearBtn, doneBtn, nextBtn),
    ),
  );

  /* ---------- rendering ---------- */
  function renderStrip() {
    clear(strip);
    if (items.length <= 1) {
      strip.hidden = true;
      return;
    }
    strip.hidden = false;
    items.forEach((c, i) => {
      const done = hasInSet(p, setKey, c);
      const label = isSpell() && spellUpper ? c.toUpperCase() : c;
      const b = h('button.trace-chip', { type: 'button', class: `${i === idx ? 'on' : ''} ${done ? 'done' : ''}`, role: 'tab', 'aria-selected': String(i === idx) }, label);
      onTap(b, () => select(i));
      strip.appendChild(b);
    });
    strip.children[idx]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  function renderRepeat() {
    repBar.hidden = !isSeries();
    if (!isSeries()) return;
    repChoices.forEach((b, i) => {
      const on = REPEAT_CHOICES[i] === series.target;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    clear(repDots);
    repDots.classList.toggle('many', series.target > 6);
    for (let i = 0; i < series.target; i++) {
      const state = i < series.done ? 'done' : i === series.done && !series.complete ? 'now' : '';
      repDots.appendChild(h('span.rep-dot', { class: state }, i < series.done ? '⭐' : String(i + 1)));
    }
    repDots.setAttribute('aria-valuemax', String(series.target));
    repDots.setAttribute('aria-valuenow', String(series.done));
    const left = seriesLeft(series);
    const made = count(p, seriesKey(set, items[idx]));
    repLeft.textContent = series.complete
      ? `🏆 Klar! ${made > 1 ? `Du har gjort ${made} serier med ${items[idx]}.` : ''}`
      : `${left === 1 ? 'En gång kvar' : `${left} kvar`}${made ? ` · ${made} ${made === 1 ? 'serie' : 'serier'} klara` : ''}`;
  }

  function renderSpell() {
    spellRow.hidden = !isSpell();
    if (!isSpell()) return;
    const info = SPELL_WORDS.find((x) => x.w === spellWord());
    clear(spellPic);
    // Eget foto (obj-<ord>) om det finns, annars fotoagentens emoji→foto-koppling, annars emoji.
    if (info?.photo && hasPhoto(info.photo)) spellPic.innerHTML = photo(info.photo, { alt: info.w, cls: 'spell-photo' });
    else spellPic.innerHTML = pic(info?.e || '📝', { alt: info?.w || '' });
    clear(spellSlots);
    spellCased()
      .split('')
      .forEach((ch, i) => {
        const state = i < spellPos ? 'done' : i === spellPos ? 'now' : '';
        // Spåra: hela ordet syns svagt (avskrift). Skriv själv: bara rutor (stava ur minnet).
        const text = i < spellPos ? ch : mode === 'trace' ? ch : '';
        spellSlots.appendChild(h('span.spell-slot', { class: `${state} ${i >= spellPos && mode === 'trace' ? 'hint' : ''}` }, text));
      });
    hearSound.hidden = spellPos >= spellWord().length;
  }

  function select(i, { quiet = false } = {}) {
    idx = i;
    strokes = [];
    spellPos = 0;
    series = newSeries(repeat);
    busy = false;
    nextBtn.hidden = true;
    doneBtn.hidden = false;
    repAfter.hidden = true;
    msg.textContent = '';
    msg.className = 'trace-msg';
    renderStrip();
    setup();
    if (!quiet) sayItem();
  }

  function switchSet(newSet, newItems, i = 0) {
    set = newSet;
    items = newItems;
    setKey = SET_KEYS[set];
    backBtn.hidden = !fromLetter || isSeries();
    select(i);
  }

  function itemText() {
    if (isSpell()) return spellCased()[Math.min(spellPos, spellWord().length - 1)];
    return items[idx];
  }

  function letterWord(ch) {
    return ALPHABET.find((x) => x.l === ch.toUpperCase())?.word;
  }

  function sayItem() {
    const t = itemText();
    if (set === 'upper' || set === 'lower') {
      const tip = mode === 'trace' ? 'Följ linjen från den gröna pricken.' : 'Skriv själv!';
      kos.autoSay(`${letterSpeech(t, letterWord(t))} ${tip} Vi skriver den ${NUM_WORDS[series.target] || series.target} gånger.`);
    } else if (set === 'digits') kos.autoSay(`Siffran ${t}. Skriv den ${NUM_WORDS[series.target] || series.target} gånger.`);
    else if (isSpell()) {
      const w = spellWord();
      kos.autoSay(mode === 'trace' ? `Stava ordet ${w}. Börja med ${w[0].toUpperCase()}.` : `Stava ordet ${w}. Vilket ljud hör du först?`);
    } else kos.autoSay(`Skriv ${t}.`);
  }

  /** Hur mycket stöd mallen ger just nu. */
  function support() {
    if (mode === 'free') return { stage: 'free', template: 'none', startDots: false, arrows: false };
    if (isSeries()) return supportFor(series.done, series.target);
    return level >= 2 ? { stage: 'dotted', template: 'dotted', startDots: true, arrows: true } : { stage: 'full', template: 'solid', startDots: true, arrows: true };
  }

  function setup() {
    const t = itemText();
    layout = t.length === 1 && GLYPHS[t] ? { strokes: GLYPHS[t], width: 1 } : layoutWord(t);
    // clientWidth påverkas inte av fönstrets öppningsanimation (transform)
    const maxW = Math.max(240, Math.min(el.clientWidth - 8, 900));
    const maxH = Math.max(200, Math.min(window.innerHeight * (isSeries() || isSpell() ? 0.44 : 0.52), 540));
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
    renderCaption();
    renderRepeat();
    renderSpell();
    modeTrace.classList.toggle('on', mode === 'trace');
    modeFree.classList.toggle('on', mode === 'free');
  }

  function renderCaption() {
    const t = items[idx];
    clear(caption);
    const hear = h('button.trace-hear', { type: 'button', 'aria-label': 'Lyssna' }, '🔊');
    if (set === 'upper' || set === 'lower') {
      const a = ALPHABET.find((x) => x.l === t.toUpperCase());
      onTap(hear, () => kos.say(letterSpeech(t, a.word)));
      caption.append(h('span.trace-pic', a.e), h('span', h('b', `${t.toUpperCase()} ${t.toLowerCase()}`), ` som i ${a.word}`), hear);
    } else if (set === 'words') {
      const w = WRITE_WORDS.find((x) => x.w === t);
      onTap(hear, () => kos.say(t));
      caption.append(h('span.trace-pic', w?.e || '📝'), h('b', t), hear);
    } else if (set === 'name') {
      caption.append(h('span.trace-pic.no-photo', p.avatar), h('b', `Ditt namn: ${t}`));
    } else if (isSpell()) {
      const ch = itemText();
      onTap(hear, () => kos.say(letterSpeech(ch)));
      caption.append(h('b', `Bokstav ${Math.min(spellPos + 1, t.length)} av ${t.length}`), hear);
    } else {
      onTap(hear, () => kos.say(`Siffran ${t}`));
      caption.append(h('span.trace-pic', '🔢'), h('b', `Siffran ${t}`), hear);
    }
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
    const sup = support();
    const cls = missed ? 'tmpl dashed' : { solid: 'tmpl', dotted: 'tmpl dashed', faint: 'tmpl faint', none: 'tmpl ghost' }[sup.template];
    for (const st of layout.strokes) s += `<polyline points="${pts(st)}" class="${cls}"/>`;
    if (missed) for (const st of missed) s += `<polyline points="${pts(st)}" class="tmpl missed"/>`;
    if (sup.startDots && layout.strokes.length <= 12) {
      for (const hint of strokeHints(layout.strokes)) {
        const x = hint.x * 100;
        const yy = hint.y * 100;
        s += `<g class="start-dot" transform="translate(${x} ${yy})"><circle r="4.2"/><text y="1.6" text-anchor="middle">${hint.n}</text></g>`;
        if (sup.arrows) s += `<g class="dir-arrow" transform="translate(${x} ${yy}) rotate(${hint.angle}) translate(8 0)"><path d="M0,-2.4 L4,0 L0,2.4 Z"/></g>`;
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
      for (const [x, yy] of st) ctx.lineTo(x * unitPx, yy * unitPx);
      ctx.stroke();
    }
  }

  /* ---------- ritning ---------- */
  const toUnit = (e) => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / unitPx, (e.clientY - r.top) / unitPx];
  };
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (busy) return;
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

  /* ---------- knappar ---------- */
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
    kos.say(mode === 'trace' ? 'Spåra längs linjen.' : isSpell() ? 'Skriv själv – lyssna på ordet och skriv bokstäverna ur minnet!' : 'Skriv själv – utan mall! Du får en extra stjärna.');
  };
  onTap(modeTrace, () => setMode('trace'));
  onTap(modeFree, () => setMode('free'));
  onTap(demoBtn, () => demo());
  onTap(doneBtn, () => check());
  onTap(nextBtn, () => select((idx + 1) % items.length));
  onTap(hearWord, () => kos.say(spellWord(), { slow: true }));
  onTap(hearSound, () => kos.say(letterSpeech(itemText())));
  onTap(againBtn, () => select(idx));
  onTap(nextLetterBtn, () => select((idx + 1) % items.length));
  onTap(spellBtn, () => startSpellFrom(items[idx]));
  onTap(backBtn, () => {
    const back = fromLetter;
    fromLetter = null;
    backBtn.hidden = true;
    switchSet(back.set, itemsFor(back.set), Math.max(0, itemsFor(back.set).indexOf(back.ch)));
  });

  function chooseRepeat(n) {
    repeat = normalizeRepeat(n);
    if (p.settings) {
      p.settings.writeRepeat = repeat;
      kos.save?.();
    }
    // Byte mitt i en serie: behåll det som redan är gjort om det ryms.
    const done = Math.min(series.complete ? 0 : series.done, repeat - 1);
    series = { ...newSeries(repeat), done };
    repAfter.hidden = true;
    doneBtn.hidden = false;
    setup();
    kos.say(`${NUM_WORDS[repeat] || repeat} gånger. Kör!`);
  }

  /** Ord för steget efter en bokstavsserie: helst på barnets nivå och börjar med bokstaven. */
  function wordsStartingWith(ch) {
    const c = ch.toLowerCase();
    const lv = Math.max(0, Math.min(4, level));
    const all = SPELL_WORDS.filter((x) => x.w[0] === c);
    const near = all.filter((x) => Math.abs(x.lvl - lv) <= 1).sort((a, b) => Math.abs(a.lvl - lv) - Math.abs(b.lvl - lv));
    const list = (near.length ? near : all).map((x) => x.w);
    const ex = letterWord(ch);
    return list.length ? list.slice(0, 8) : ex ? [ex] : [];
  }

  function startSpellFrom(ch) {
    const words = wordsStartingWith(ch);
    if (!words.length) return;
    fromLetter = { set, ch };
    switchSet('spell', words, 0);
    backBtn.textContent = `⬅ Bokstaven ${ch.toUpperCase()}`;
    backBtn.hidden = false;
  }

  /* ---------- bedömning ---------- */
  function check() {
    if (busy) return;
    if (!strokes.length) {
      kos.say('Rita först med fingret!');
      return;
    }
    const sup = support();
    const lvl = mode === 'free' || sup.template === 'faint' ? Math.max(0, level - 1) : level;
    const res = scoreTrace(layout.strokes, strokes, lvl);
    if (!res.pass) return miss(res);
    kos.sfx('correct');
    if (isSeries()) return passSeries(res);
    if (isSpell()) return passSpellLetter(res);
    passSingle(res);
  }

  function passSingle(res) {
    const t = items[idx];
    const bonus = mode === 'free' ? 1 : 0;
    const isNew = !hasInSet(p, setKey, t);
    kos.reward({ app: app.id, stars: res.stars + bonus, set: setKey, item: t });
    if (set === 'name') kos.reward({ counter: 'tracedName', silent: true });
    msg.className = 'trace-msg ok';
    msg.textContent = `${'⭐'.repeat(res.stars)} ${res.stars === 3 ? 'Supersnyggt!' : res.stars === 2 ? 'Snyggt!' : 'Bra!'} ${isNew ? '(ny!)' : ''}`;
    kos.say(res.stars === 3 ? 'Supersnyggt!' : 'Snyggt skrivet!');
    if (res.stars === 3) kos.confetti(50);
    doneBtn.hidden = true;
    nextBtn.hidden = items.length <= 1;
    renderStrip();
  }

  function passSeries(res) {
    const t = items[idx];
    const stageBefore = support().stage;
    series = seriesAdvance(series, true);
    // En stjärna per gång (inte 1–3) så att tio repetitioner inte blåser upp stjärnorna.
    kos.reward({ app: app.id, stars: 1, set: setKey, item: t });
    msg.className = 'trace-msg ok';
    renderRepeat();
    if (!series.complete) {
      const praise = praiseFor(series.done, series.target);
      msg.textContent = `${'⭐'.repeat(res.stars)} ${praise}`;
      kos.say(praise);
      busy = true;
      later(() => {
        busy = false;
        strokes = [];
        msg.textContent = '';
        setup();
        const stageNow = support().stage;
        if (stageNow !== stageBefore && mode === 'trace') {
          msg.className = 'trace-msg';
          msg.textContent = stageNow === 'dotted' ? '💡 Nu är linjen prickig – du klarar mer själv!' : '💡 Nu syns linjen knappt – skriv nästan själv!';
          kos.autoSay(stageNow === 'dotted' ? 'Nu blir linjen prickig.' : 'Nu syns linjen knappt. Du kan!');
        }
      }, 950);
      return;
    }
    // Hela serien klar: extra firande.
    kos.reward({ app: app.id, stars: series.target >= 10 ? 3 : 2, counter: 'writeSeries' });
    kos.reward({ counter: seriesKey(set, t), silent: true });
    kos.sfx('fanfare');
    kos.confetti(series.target >= 10 ? 160 : 110);
    const what = set === 'digits' ? `siffran ${t}` : t;
    msg.textContent = `🏆 Hela serien klar! Du skrev ${what} ${series.target} gånger.`;
    kos.say(`Hurra! Du skrev ${set === 'digits' ? `siffran ${t}` : t} ${NUM_WORDS[series.target] || series.target} gånger!`);
    doneBtn.hidden = true;
    repAfter.hidden = false;
    spellBtn.hidden = set === 'digits' || !wordsStartingWith(t).length;
    spellBtn.textContent = `🔡 Stava ord med ${t.toUpperCase()}`;
    nextLetterBtn.textContent = set === 'digits' ? 'Nästa siffra ➜' : 'Nästa bokstav ➜';
    renderRepeat();
    renderStrip();
  }

  function passSpellLetter() {
    const word = spellWord();
    const ch = spellCased()[spellPos];
    spellPos++;
    renderSpell();
    if (spellPos < word.length) {
      msg.className = 'trace-msg ok';
      msg.textContent = `✓ ${ch}`;
      kos.say(ch.toLowerCase());
      busy = true;
      later(() => {
        busy = false;
        strokes = [];
        msg.textContent = '';
        setup();
      }, 700);
      return;
    }
    const isNew = !hasInSet(p, setKey, word);
    kos.reward({ app: app.id, stars: mode === 'free' ? 3 : 2, set: setKey, item: word, counter: 'spelledWords' });
    kos.confetti(90);
    const tip = spellTip(word);
    msg.className = 'trace-msg ok';
    msg.textContent = `🎉 Du stavade ${spellCased()}!${isNew ? ' (nytt ord!)' : ''}`;
    kos.say(`${word}! Du stavade ${word}.${tip ? ` ${tip}` : ''}`);
    doneBtn.hidden = true;
    nextBtn.hidden = items.length <= 1;
    renderStrip();
  }

  function miss(res) {
    kos.sfx('wrong');
    kos.retry();
    if (isSeries()) series = seriesAdvance(series, false);
    // markera delar av mallen som inte täcktes
    const tol = 0.1;
    const ink = strokes.flat();
    const missed = layout.strokes
      .map((st) => st.filter(([x, y]) => !ink.some(([a, b]) => Math.hypot(a - x, b - y) < tol)))
      .filter((st) => st.length > 1);
    drawGuide(missed);
    msg.className = 'trace-msg try';
    const tip = res.scribble
      ? ['💡 Oj, mycket kludd! Rita lugnt längs linjen – sudda och försök igen.', 'Rita lugnt längs linjen.']
      : res.coverage < 0.8
        ? ['💡 Nästan! De orangea delarna saknas. Sudda och försök igen.', 'Nästan! Några delar saknas. Försök igen.']
        : ['💡 Försök hålla dig närmare linjen.', 'Försök hålla dig närmare linjen.'];
    msg.textContent = tip[0];
    kos.say(tip[1]);
  }

  /* ---------- demo ---------- */
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
        later(cancelDemo, 600);
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
    if (!alive) return;
    setup();
    sayItem();
  });
  return () => {
    alive = false;
    timers.forEach(clearTimeout);
    cancelDemo();
    window.removeEventListener('resize', onResize);
  };
}
