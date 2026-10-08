// Generell frågemotor som kör en runda med frågor från en generator.
import { h, clear, onTap, wait } from './dom.js';
import { kos } from './kos.js';
import { createRng } from '../core/rng.js';
import { roundLength, clampLevel } from '../core/age.js';
import { clockSvg, timeToSwedish, digitalTime } from './visuals.js';
import { moduleStat } from '../core/model.js';

const MAX_TRIES = { choice: 2, numpad: 3, order: 2, build: 3, tapcount: 3, tap: 3, clock: 3 };

export function effectiveLevel(app, mod) {
  const lvl = kos.level(app.id);
  return clampLevel(Math.min(mod.maxLevel ?? 4, Math.max(mod.minLevel ?? 0, lvl)));
}

export function runQuiz(el, { app, module: mod, onExit, seed = Date.now(), count }) {
  const p = kos.profile;
  const total = count || roundLength(p?.age ?? 7);
  const rng = createRng(seed);
  let index = 0;
  let correctFirst = 0;
  let alive = true;
  const ctx = { found: p?.sets?.species || {} };

  const dots = h('div.q-dots', Array.from({ length: total }, () => h('span.q-dot')));
  const stage = h('div.q-stage');
  const wrap = h('div.quiz', { style: { '--app': app.color } }, dots, stage);
  clear(el).appendChild(wrap);

  function next() {
    if (!alive) return;
    if (index >= total) return finish();
    const level = effectiveLevel(app, mod);
    let q;
    try {
      q = mod.gen(level, rng, ctx);
    } catch (e) {
      console.error(e);
      q = null;
    }
    if (!q) return finish();
    q.level = level;
    if (window.kidsos) window.kidsos.q = q; // testkrok: aktuell fråga
    renderQuestion(q);
  }

  function renderQuestion(q) {
    clear(stage);
    stage.classList.remove('done');
    let tries = 0;
    let resolved = false;
    const promptText = h('div.q-prompt-text', q.prompt);
    const speakBtn = h('button.icon-btn.q-speak', { 'aria-label': 'Läs upp frågan', type: 'button' }, '🔊');
    onTap(speakBtn, () => kos.say(q.say || q.prompt));
    const prompt = h('div.q-prompt', speakBtn, promptText);
    const visual = q.visual ? h('div.q-visual', { html: q.visual }) : null;
    const answers = h('div.q-answers');
    const feedback = h('div.q-feedback', { 'aria-live': 'polite' });
    const body = h('div.q-body', { class: q.visual ? 'has-visual' : 'no-visual' }, h('div.q-top', prompt, visual), h('div.q-bottom', answers, feedback));
    stage.appendChild(body);

    // Läs upp frågan (och textalternativ) för de som inte läser själva än.
    const optionWords = q.type === 'choice' && q.options && !q.noSpeakVisual && q.options.every((o) => o.say !== '' && /[a-zåäö]{3,}/i.test(o.say ?? o.label ?? ''));
    kos.autoSay(q.say || q.prompt).then(() => {
      if (alive && !resolved && optionWords && kos.shouldAutoSpeak()) {
        const words = q.options.map((o) => o.say ?? o.label);
        kos.autoSay(`${words.slice(0, -1).join(', ')} eller ${words[words.length - 1]}?`, { interrupt: false });
      }
    });

    const api = {
      correct() {
        if (resolved) return;
        resolved = true;
        const first = tries === 0;
        if (first) correctFirst++;
        dots.children[index]?.classList.add(first ? 'ok' : 'meh');
        kos.sfx('correct');
        kos.answer(app.id, first);
        if (first) kos.flyStar(1);
        if (q.collect) {
          const r = kos.reward({ set: q.collect.set, item: q.collect.item, silent: true });
          if (r.isNew && q.collect.label) kos.toast(q.collect.label, { icon: '🃏' });
        }
        showResult(true, first);
      },
      wrong(customHint) {
        if (resolved) return;
        tries++;
        kos.sfx('wrong');
        kos.retry();
        const max = MAX_TRIES[q.type] ?? 2;
        if (tries >= max) {
          resolved = true;
          dots.children[index]?.classList.add('meh');
          kos.answer(app.id, false);
          api.reveal?.();
          showResult(false, false);
          return;
        }
        const hint = customHint || q.hint || 'Försök igen!';
        clear(feedback).append(h('div.fb.fb-try', h('span.fb-icon', '💡'), h('div', h('b', 'Nästan! '), hint)));
        feedback.classList.add('show');
        kos.say(`Nästan! ${hint}`);
      },
      get tries() {
        return tries;
      },
      /** Räknar ett misslyckat försök utan att avsluta frågan (används av sortering). */
      markTry() {
        tries++;
      },
    };

    function showResult(ok, first) {
      const nextBtn = h('button.btn.btn-primary.btn-next', { type: 'button' }, index + 1 >= total ? 'Klar! 🎉' : 'Nästa ➜');
      onTap(nextBtn, () => {
        kos.stopSpeaking();
        index++;
        next();
      });
      const title = ok ? (first ? ['Rätt!', '⭐'] : ['Bra kämpat!', '👍']) : ['Så här är det:', '🧠'];
      clear(feedback).append(
        h('div.fb', { class: ok ? 'fb-ok' : 'fb-learn' }, h('span.fb-icon', title[1]), h('div.fb-text', h('b', title[0] + ' '), q.explain || ''), nextBtn),
      );
      feedback.classList.add('show');
      stage.classList.add('done');
      if (q.explain) kos.autoSay(`${title[0]} ${q.explain}`);
      else kos.autoSay(title[0]);
      setTimeout(() => nextBtn.focus({ preventScroll: true }), 50);
    }

    const renderers = { choice, numpad, order, sort, build, tapcount, tap, clock };
    (renderers[q.type] || choice)(q, answers, api, visual, stage);
  }

  async function finish() {
    alive = false;
    kos.stopSpeaking();
    const res = kos.roundDone(app.id, mod.id, correctFirst, total);
    const best = moduleStat(kos.profile, app.id, mod.id).best;
    clear(stage);
    const starsRow = h('div.sum-stars', [1, 2, 3].map((i) => h('span.sum-star', { class: i <= res.rating ? 'on' : '', style: { '--d': `${i * 0.18}s` } }, '★')));
    const msgs = ['Bra jobbat!', 'Superbra!', 'Fantastiskt – allt rätt!'];
    const card = h(
      'div.summary',
      h('div.sum-emoji', res.rating === 3 ? '🏆' : res.rating === 2 ? '🌟' : '💪'),
      h('h2.sum-title', msgs[res.rating - 1]),
      starsRow,
      h('p.sum-detail', `${correctFirst} av ${total} rätt på första försöket · +${correctFirst + res.bonus} ⭐`),
      res.rankUp ? h('div.sum-rank', `${res.rankUp.emoji} Ny titel: ${res.rankUp.title}!`) : null,
      res.trophies.length ? h('div.sum-trophies', res.trophies.map((t) => h('div.sum-trophy', h('span', t.icon), h('div', h('small', 'Ny trofé'), h('b', t.name))))) : null,
      h(
        'div.sum-actions',
        onTap(h('button.btn.btn-ghost', { type: 'button' }, '↩ Tillbaka'), () => onExit?.()),
        onTap(h('button.btn.btn-primary', { type: 'button' }, '🔁 En gång till'), () => runQuiz(el, { app, module: mod, onExit })),
      ),
    );
    stage.appendChild(card);
    if (res.rating === 3) kos.sfx('fanfare');
    else kos.sfx('star');
    kos.confetti(res.rating === 3 ? 160 : 70);
    kos.autoSay(`${msgs[res.rating - 1]} Du fick ${correctFirst} av ${total} rätt.`);
    res.trophies.forEach((t, i) => setTimeout(() => kos.trophyToast(t), 900 + i * 1700));
    void best;
  }

  next();
  return () => {
    alive = false;
    kos.stopSpeaking();
  };
}

/* ======================= Frågetyper ======================= */

function choice(q, el, api) {
  const long = q.options.some((o) => (o.label || '').length > 12);
  const grid = h('div.choices', { class: [q.wide ? 'wide' : '', long ? 'long' : '', `n${q.options.length}`].join(' ') });
  const btns = q.options.map((o) => {
    const b = h('button.choice', { type: 'button', dataset: { id: o.id } }, o.html ? h('span.choice-html', { html: o.html }) : h('span.choice-label', o.label));
    onTap(b, () => {
      if (b.disabled || el.closest('.q-stage').classList.contains('done')) return;
      if (o.id === q.answer) {
        b.classList.add('right');
        btns.forEach((x) => (x.disabled = true));
        api.correct();
      } else {
        b.classList.add('wrong-shake');
        b.disabled = true;
        setTimeout(() => b.classList.remove('wrong-shake'), 500);
        api.wrong();
      }
    });
    return b;
  });
  api.reveal = () => {
    btns.forEach((b) => {
      b.disabled = true;
      if (b.dataset.id === q.answer) b.classList.add('right');
    });
  };
  grid.append(...btns);
  el.appendChild(grid);
}

function numpad(q, el, api) {
  let value = '';
  const display = h('div.np-display', { 'aria-live': 'polite' }, h('span.np-value', ''), h('span.np-caret'));
  const valEl = display.firstChild;
  const keys = h('div.numpad');
  const update = () => {
    valEl.textContent = value;
    display.classList.toggle('empty', !value);
  };
  const press = (k) => {
    if (el.closest('.q-stage').classList.contains('done')) return;
    kos.sfx('click');
    if (k === '⌫') value = value.slice(0, -1);
    else if (k === 'OK') {
      if (!value) return;
      if (Number(value) === Number(q.answer)) {
        display.classList.add('right');
        api.correct();
      } else {
        display.classList.add('wrong-shake');
        setTimeout(() => display.classList.remove('wrong-shake'), 500);
        const guess = Number(value);
        const dir = guess < q.answer ? 'Lite för lite – det ska vara mer.' : 'Lite för mycket – det ska vara mindre.';
        value = '';
        update();
        api.wrong(`${dir} ${q.hint || ''}`);
      }
      return;
    } else if (value.length < 4) value = value === '0' ? k : value + k;
    update();
  };
  for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK']) {
    const b = h('button.np-key', { type: 'button', class: k === 'OK' ? 'ok' : k === '⌫' ? 'del' : '' }, k === '⌫' ? '⌫' : k);
    onTap(b, () => press(k), { guardMs: 120 });
    keys.appendChild(b);
  }
  api.reveal = () => {
    value = String(q.answer);
    update();
    display.classList.add('revealed');
  };
  update();
  el.append(display, keys);
}

function order(q, el, api) {
  const picked = [];
  const slots = h('div.order-slots', { class: q.joiner === ' ' ? 'sentence' : '' });
  const pool = h('div.order-pool');
  const itemBtn = new Map();
  const n = q.answerOrder.length;
  const renderSlots = () => {
    clear(slots);
    for (let i = 0; i < n; i++) {
      const id = picked[i];
      const it = q.items.find((x) => x.id === id);
      const s = h('button.order-slot', { type: 'button', class: id ? 'filled' : '' }, id ? (it.html ? h('span', { html: it.html }) : it.label) : h('span.slot-n', String(i + 1)));
      if (id) onTap(s, () => {
        if (el.closest('.q-stage').classList.contains('done')) return;
        picked.splice(i, 1);
        itemBtn.get(id).classList.remove('used');
        renderSlots();
      });
      slots.appendChild(s);
      if (q.joiner && q.joiner !== ' ' && i < n - 1) slots.appendChild(h('span.order-join', q.joiner));
    }
  };
  for (const it of q.items) {
    const b = h('button.order-item', { type: 'button' }, it.html ? h('span', { html: it.html }) : it.label);
    onTap(b, () => {
      if (b.classList.contains('used') || el.closest('.q-stage').classList.contains('done')) return;
      kos.sfx('pop');
      if (it.say && kos.shouldAutoSpeak()) kos.say(it.say);
      picked.push(it.id);
      b.classList.add('used');
      renderSlots();
      if (picked.length === n) check();
    });
    itemBtn.set(it.id, b);
    pool.appendChild(b);
  }
  async function check() {
    const ok = picked.every((id, i) => id === q.answerOrder[i]);
    if (ok) {
      slots.classList.add('right');
      api.correct();
      return;
    }
    slots.classList.add('wrong-shake');
    await wait(450);
    slots.classList.remove('wrong-shake');
    // behåll de som står rätt från början, lägg tillbaka resten
    let k = 0;
    while (k < picked.length && picked[k] === q.answerOrder[k]) k++;
    picked.splice(k).forEach((id) => itemBtn.get(id).classList.remove('used'));
    renderSlots();
    api.wrong(k > 0 ? `De ${k} första står rätt! ${q.hint || ''}` : q.hint);
  }
  api.reveal = () => {
    picked.length = 0;
    picked.push(...q.answerOrder);
    itemBtn.forEach((b) => b.classList.add('used'));
    renderSlots();
    slots.classList.add('revealed');
  };
  renderSlots();
  el.append(slots, pool);
}

function sort(q, el, api) {
  let selected = null;
  let mistakes = 0;
  let placed = 0;
  const tray = h('div.sort-tray');
  const bins = h('div.sort-bins', { class: `n${q.bins.length}` });
  const binEls = new Map();
  for (const b of q.bins) {
    const be = h('div.sort-bin', { dataset: { bin: b.id }, role: 'button', tabindex: '0' }, h('div.bin-head', h('span.bin-icon', { html: b.html }), h('span.bin-label', b.label)), h('div.bin-items'));
    onTap(be, () => selected && drop(selected, b.id), { guardMs: 0 });
    binEls.set(b.id, be);
    bins.appendChild(be);
  }
  const itemEls = new Map();
  for (const it of q.items) {
    const ie = h('div.sort-item', { dataset: { id: it.id }, role: 'button', tabindex: '0', html: it.html });
    itemEls.set(it.id, ie);
    tray.appendChild(ie);
    attachDrag(ie, it);
  }
  function select(it) {
    itemEls.forEach((e) => e.classList.remove('sel'));
    selected = it;
    if (it) {
      itemEls.get(it.id).classList.add('sel');
      bins.classList.add('armed');
      if (kos.shouldAutoSpeak() && it.say) kos.say(it.say);
    } else bins.classList.remove('armed');
  }
  function drop(it, binId) {
    const ie = itemEls.get(it.id);
    if (!ie || ie.classList.contains('placed')) return;
    if (it.bin === binId) {
      kos.sfx('pop');
      ie.classList.remove('sel');
      ie.classList.add('placed');
      binEls.get(binId).querySelector('.bin-items').appendChild(ie);
      placed++;
      select(null);
      if (placed === q.items.length) {
        api.correct();
      }
    } else {
      mistakes++;
      api.markTry();
      ie.classList.add('wrong-shake');
      binEls.get(binId).classList.add('wrong-flash');
      setTimeout(() => {
        ie.classList.remove('wrong-shake');
        binEls.get(binId).classList.remove('wrong-flash');
      }, 500);
      kos.sfx('wrong');
      kos.retry();
      select(null);
      const hintEl = el.parentElement.querySelector('.q-feedback');
      if (hintEl) {
        clear(hintEl).append(h('div.fb.fb-try', h('span.fb-icon', '💡'), h('div', h('b', 'Inte där! '), q.hint || 'Försök med en annan.')));
        hintEl.classList.add('show');
      }
    }
  }
  function attachDrag(ie, it) {
    let start = null;
    let ghost = null;
    ie.addEventListener('pointerdown', (e) => {
      if (ie.classList.contains('placed')) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      ie.setPointerCapture?.(e.pointerId);
    });
    ie.addEventListener('pointermove', (e) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!ghost && Math.hypot(dx, dy) > 10) {
        ghost = ie.cloneNode(true);
        ghost.classList.add('drag-ghost');
        const r = ie.getBoundingClientRect();
        ghost.style.width = `${r.width}px`;
        ghost.style.left = `${r.left}px`;
        ghost.style.top = `${r.top}px`;
        document.body.appendChild(ghost);
        ie.classList.add('dragging');
        select(it);
      }
      if (ghost) {
        ghost.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
        const over = binAt(e.clientX, e.clientY);
        binEls.forEach((b, id) => b.classList.toggle('over', id === over));
      }
    });
    const end = (e) => {
      if (!start) return;
      const wasDrag = !!ghost;
      if (ghost) {
        ghost.remove();
        ghost = null;
        ie.classList.remove('dragging');
        binEls.forEach((b) => b.classList.remove('over'));
        const over = binAt(e.clientX, e.clientY);
        if (over) drop(it, over);
        else select(null);
      }
      start = null;
      if (!wasDrag && e.type === 'pointerup') select(selected === it ? null : it);
    };
    ie.addEventListener('pointerup', end);
    ie.addEventListener('pointercancel', end);
  }
  function binAt(x, y) {
    for (const [id, b] of binEls) {
      const r = b.getBoundingClientRect();
      const pad = 16; // större aktiv yta än det synliga
      if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) return id;
    }
    return null;
  }
  el.append(tray, bins);
}

function build(q, el, api) {
  const n = q.word.length;
  const filled = Array(n).fill(null);
  const slots = h('div.build-slots');
  const tiles = h('div.build-tiles');
  const tileEls = [];
  const hear = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔊 Hör ordet');
  onTap(hear, () => kos.say(q.sayWord || q.word.toLowerCase(), { slow: true }));
  const renderSlots = () => {
    clear(slots);
    filled.forEach((ti, i) => {
      const s = h('button.build-slot', { type: 'button', class: ti !== null ? 'filled' : '' }, ti !== null ? q.tiles[ti] : '');
      onTap(s, () => {
        if (ti === null || el.closest('.q-stage').classList.contains('done')) return;
        filled[i] = null;
        tileEls[ti].classList.remove('used');
        renderSlots();
      });
      slots.appendChild(s);
    });
  };
  q.tiles.forEach((letter, ti) => {
    const b = h('button.build-tile', { type: 'button' }, letter);
    onTap(b, () => {
      if (b.classList.contains('used') || el.closest('.q-stage').classList.contains('done')) return;
      const i = filled.indexOf(null);
      if (i < 0) return;
      kos.sfx('pop');
      filled[i] = ti;
      b.classList.add('used');
      renderSlots();
      if (!filled.includes(null)) check();
    });
    tileEls.push(b);
    tiles.appendChild(b);
  });
  async function check() {
    const word = filled.map((ti) => q.tiles[ti]).join('');
    if (word === q.word) {
      slots.classList.add('right');
      kos.say(q.sayWord || q.word.toLowerCase());
      api.correct();
      return;
    }
    slots.classList.add('wrong-shake');
    await wait(450);
    slots.classList.remove('wrong-shake');
    filled.forEach((ti, i) => {
      if (ti !== null && q.tiles[ti] !== q.word[i]) {
        tileEls[ti].classList.remove('used');
        filled[i] = null;
      }
    });
    renderSlots();
    api.wrong();
  }
  api.reveal = () => {
    filled.fill(null);
    tileEls.forEach((t) => t.classList.remove('used'));
    const used = new Set();
    q.word.split('').forEach((ch, i) => {
      const ti = q.tiles.findIndex((t, k) => t === ch && !used.has(k));
      used.add(ti);
      filled[i] = ti;
      tileEls[ti]?.classList.add('used');
    });
    renderSlots();
    slots.classList.add('revealed');
  };
  renderSlots();
  el.append(slots, tiles, h('div.build-extra', hear));
}

function tapcount(q, el, api) {
  let beats = 0;
  const beatRow = h('div.beats');
  const drum = h('button.drum', { type: 'button', 'aria-label': 'Trumma' }, '🥁');
  const renderBeats = () => {
    clear(beatRow);
    for (let i = 0; i < Math.max(beats, 1); i++) beatRow.appendChild(h('span.beat', { class: i < beats ? 'on' : '' }));
  };
  onTap(
    drum,
    () => {
      if (el.closest('.q-stage').classList.contains('done') || beats >= (q.max || 6)) return;
      beats++;
      kos.sfx('note');
      drum.classList.remove('hit');
      void drum.offsetWidth;
      drum.classList.add('hit');
      renderBeats();
    },
    { guardMs: 140 },
  );
  const reset = onTap(h('button.btn.btn-ghost', { type: 'button' }, '↺ Börja om'), () => {
    beats = 0;
    renderBeats();
  });
  const hear = onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔊 Lyssna'), () => kos.say(q.sayWord, { slow: true }));
  const done = onTap(h('button.btn.btn-primary', { type: 'button' }, 'Klar ✓'), () => {
    if (!beats || el.closest('.q-stage').classList.contains('done')) return;
    if (beats === q.answer) api.correct();
    else {
      beats = 0;
      renderBeats();
      api.wrong();
    }
  });
  api.reveal = () => {
    beats = q.answer;
    renderBeats();
  };
  renderBeats();
  el.append(h('div.drum-wrap', drum, beatRow), h('div.row-actions', hear, reset, done));
}

function tap(q, el, api, visual) {
  if (!visual) return;
  visual.classList.add('tappable');
  el.appendChild(h('p.tap-help', '👆 Tryck i bilden'));
  const handler = (e) => {
    if (visual.closest('.q-stage').classList.contains('done')) return;
    let target = e.target.closest?.('[data-hit]');
    if (!target) {
      // närmaste träffyta inom 48 px (större aktiv yta än det som syns)
      let best = null;
      let bd = 48;
      visual.querySelectorAll('[data-hit]').forEach((n) => {
        const r = n.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        if (d < bd) {
          bd = d;
          best = n;
        }
      });
      target = best;
    }
    if (!target) return;
    const id = target.getAttribute('data-hit');
    if (id === q.answer) {
      target.classList.add('hit-right');
      api.correct();
    } else {
      target.classList.add('hit-wrong');
      setTimeout(() => target.classList.remove('hit-wrong'), 600);
      api.wrong();
    }
  };
  visual.addEventListener('click', handler);
  api.reveal = () => visual.querySelector(`[data-hit="${q.answer}"]`)?.classList.add('hit-right', 'pulse');
}

function clock(q, el, api, visual, stage) {
  let total = 12 * 60; // minuter sedan 00:00 (startar på 12:00)
  const step = q.step || 15;
  const holder = h('div.clock-set', { html: clockSvg(12, 0, { size: 300 }) });
  const svg = holder.querySelector('svg');
  const readout = h('div.clock-readout', '');
  const render = () => {
    const hh = Math.floor(total / 60) % 12;
    const mm = ((total % 60) + 60) % 60;
    svg.querySelector('.hand-m').setAttribute('transform', `rotate(${mm * 6} 110 110)`);
    svg.querySelector('.hand-h').setAttribute('transform', `rotate(${(hh + mm / 60) * 30} 110 110)`);
  };
  let dragging = false;
  let prevMin = 0;
  const angleAt = (e) => {
    const r = svg.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    let a = (Math.atan2(x, -y) * 180) / Math.PI;
    if (a < 0) a += 360;
    return a;
  };
  svg.addEventListener('pointerdown', (e) => {
    if (stage.classList.contains('done')) return;
    dragging = true;
    prevMin = ((total % 60) + 60) % 60;
    svg.setPointerCapture?.(e.pointerId);
    move(e);
  });
  const move = (e) => {
    if (!dragging) return;
    const m = (Math.round(angleAt(e) / 6 / step) * step) % 60;
    if (m === prevMin) return;
    let delta = m - prevMin;
    if (delta > 30) delta -= 60;
    if (delta < -30) delta += 60;
    total += delta;
    prevMin = m;
    kos.sfx('click');
    render();
  };
  svg.addEventListener('pointermove', move);
  const up = () => (dragging = false);
  svg.addEventListener('pointerup', up);
  svg.addEventListener('pointercancel', up);
  const nudge = (d) =>
    onTap(
      h('button.btn.btn-ghost.btn-sm', { type: 'button' }, d > 0 ? `+${step} min ⟳` : `⟲ −${step} min`),
      () => {
        total += d;
        render();
      },
      { guardMs: 100 },
    );
  const ok = onTap(h('button.btn.btn-primary', { type: 'button' }, 'Klar ✓'), () => {
    if (stage.classList.contains('done')) return;
    const hh = Math.floor(total / 60) % 12;
    const mm = ((total % 60) + 60) % 60;
    if (hh === q.target.h % 12 && mm === q.target.m) {
      readout.textContent = `${timeToSwedish(q.target.h, q.target.m)} (${digitalTime(q.target.h, q.target.m)})`;
      api.correct();
    } else {
      const wantH = q.target.h % 12;
      const msg = mm !== q.target.m ? 'Kolla den långa visaren (minuterna) först.' : hh !== wantH ? 'Minuterna är rätt! Kolla nu den korta visaren.' : '';
      api.wrong(msg);
    }
  });
  api.reveal = () => {
    total = (q.target.h % 12) * 60 + q.target.m;
    render();
    readout.textContent = `${timeToSwedish(q.target.h, q.target.m)} (${digitalTime(q.target.h, q.target.m)})`;
  };
  render();
  el.append(h('p.tap-help', '👆 Dra i den långa blå visaren'), holder, readout, h('div.row-actions', nudge(-step), nudge(step), ok));
}
