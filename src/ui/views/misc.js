// Övriga vyer: kroppen, berättelser, Undra och Rita.
import { h, clear, onTap, wait } from '../dom.js';
import { bodySvg, BODY_PARTS, ORGANS } from '../../apps/biology.js';
import { STORIES } from '../../apps/svenska.js';
import { WONDERS, eligibleWonders, wonderAnswer } from '../../apps/wonder.js';
import { DRAW_PROMPTS, DRAW_COLORS, DRAW_STAMPS } from '../../apps/draw.js';
import { hasInSet } from '../../core/model.js';
import { loadDrawings, saveDrawing, deleteDrawing, loadJSON } from '../../core/storage.js';
import { createRng } from '../../core/rng.js';
import { photo, creditLine } from '../img.js';

/* ---------- Utforska kroppen ---------- */
export function bodyView(el, { kos, app, level }) {
  let organs = false;
  const toggle = h('div.seg', h('button.seg-btn.on', { type: 'button' }, '🧍 Utsidan'), h('button.seg-btn', { type: 'button' }, '🫀 Insidan'));
  const [outBtn, inBtn] = toggle.children;
  const pic = h('div.body-pic');
  const card = h('div.body-card');
  const found = h('div.body-found');
  el.append(h('div.body-explore', h('div.row-between', h('p.muted', 'Tryck på kroppen för att lära dig vad delarna heter och gör.'), toggle), h('div.body-layout', pic, h('div.body-side', card, found))));
  const p = kos.profile;
  function renderFound() {
    const all = [...BODY_PARTS, ...ORGANS];
    const n = all.filter((x) => hasInSet(p, 'bodyParts', x.id)).length;
    clear(found).append(h('small', `Upptäckta delar: ${n} av ${all.length}`), h('div.v-row', all.map((x) => h('span.v-dot', { class: hasInSet(p, 'bodyParts', x.id) ? 'on' : '', title: x.name }))));
  }
  function render(hl) {
    pic.innerHTML = bodySvg({ organs, highlight: hl });
    pic.querySelectorAll('[data-hit]').forEach((n) => n.addEventListener('click', () => pick(n.getAttribute('data-hit'))));
  }
  function pick(id) {
    const part = [...BODY_PARTS, ...ORGANS].find((x) => x.id === id);
    if (!part) return;
    render(id);
    const r = kos.reward({ app: app.id, set: 'bodyParts', item: id, stars: hasInSet(p, 'bodyParts', id) ? 0 : 1 });
    kos.sfx('pop');
    const nm = part.name[0].toUpperCase() + part.name.slice(1);
    clear(card).append(h('div.pi-card', h('h3', nm, r.isNew ? h('span.new-tag', 'Ny!') : null), h('p.pi-fact', part.fn), onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔊 Läs'), () => kos.say(`${nm}. ${part.fn}`))));
    kos.autoSay(`${nm}. ${part.fn}`);
    renderFound();
  }
  onTap(outBtn, () => {
    organs = false;
    outBtn.classList.add('on');
    inBtn.classList.remove('on');
    render();
  });
  onTap(inBtn, () => {
    organs = true;
    inBtn.classList.add('on');
    outBtn.classList.remove('on');
    render();
    kos.autoSay('Insidan! Här ser du några av kroppens organ.');
  });
  render();
  renderFound();
  clear(card).append(h('div.teach', h('span.teach-icon', '👆'), h('span', level >= 2 ? 'Tips: titta på insidan också – där finns hjärtat, lungorna och hjärnan.' : 'Tryck på huvudet, händerna eller fötterna!')));
  kos.autoSay('Tryck på kroppen för att lära dig vad delarna heter.');
}

/* ---------- Berättelser ---------- */
export function storiesView(el, { kos, app, level }) {
  const p = kos.profile;
  let alive = true;
  function list() {
    clear(el);
    const grid = h('div.story-grid');
    STORIES.forEach((s, i) => {
      const read = hasInSet(p, 'stories', s.id);
      const tooHard = !p.settings.showAllModules && s.level > level;
      const b = h('button.story-card', { type: 'button', disabled: tooHard, style: { '--i': i }, class: tooHard ? 'hard' : '' }, h('span.story-e', s.e), h('span.story-t', s.title), h('span.story-l', ['🔊 Lyssna tillsammans', '⭐ Börja läsa', '⭐⭐ Läs och förstå', '⭐⭐⭐ Läs och resonera', '🔎 Läs mellan raderna'][s.level]), read ? h('span.lv-ok', '✓') : tooHard ? h('span.lv-ok', '🔒') : null);
      onTap(b, () => open(s));
      grid.appendChild(b);
    });
    el.append(h('div.stories', h('p.muted', 'Välj en berättelse. Tryck på ett ord om du vill höra det.'), grid));
    kos.autoSay('Välj en berättelse.');
  }
  function open(s) {
    clear(el);
    const lines = s.text.map((t) =>
      h(
        'p.story-line',
        t.split(/(\s+)/).map((w) => {
          if (!w.trim()) return w;
          const span = h('span.word', w);
          span.addEventListener('click', () => {
            span.classList.add('said');
            kos.say(w.replace(/[^\p{L}\p{N}]/gu, ''), { slow: true });
            setTimeout(() => span.classList.remove('said'), 800);
          });
          return span;
        }),
      ),
    );
    const readBtn = h('button.btn.btn-ghost', { type: 'button' }, '🔊 Läs för mig');
    const quizBtn = h('button.btn.btn-primary', { type: 'button' }, 'Jag har läst klart ➜');
    const backBtn = h('button.btn.btn-ghost', { type: 'button' }, '☰ Alla berättelser');
    el.append(h('div.story', h('h2.story-title', `${s.e} ${s.title}`), h('div.story-text', lines), h('div.row-actions', backBtn, readBtn, quizBtn)));
    let reading = false;
    onTap(readBtn, async () => {
      if (reading) {
        reading = false;
        kos.stopSpeaking();
        readBtn.textContent = '🔊 Läs för mig';
        return;
      }
      reading = true;
      readBtn.textContent = '⏸ Stopp';
      for (const ln of lines) {
        if (!reading || !alive) break;
        ln.classList.add('reading');
        ln.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        await kos.say(ln.textContent);
        ln.classList.remove('reading');
        await wait(250);
      }
      reading = false;
      readBtn.textContent = '🔊 Läs för mig';
    });
    onTap(backBtn, () => {
      reading = false;
      kos.stopSpeaking();
      list();
    });
    onTap(quizBtn, () => {
      reading = false;
      kos.stopSpeaking();
      questions(s);
    });
    if (kos.shouldAutoSpeak() && p.age <= 6) readBtn.click();
  }
  function questions(s) {
    clear(el);
    let qi = 0;
    let right = 0;
    const rng = createRng(Date.now());
    const box = h('div.story-q');
    el.append(h('div.story', h('h2.story-title', `${s.e} Frågor om "${s.title}"`), box));
    const ask = () => {
      if (qi >= s.questions.length) return done();
      const q = s.questions[qi];
      let tries = 0;
      let resolved = false;
      const feedback = h('div.story-feedback', { 'aria-live': 'polite' });
      clear(box).append(
        h('p.sci-q', `${qi + 1}. ${q.q}`),
        h(
          'div.choices.long',
          rng.shuffle(q.o).map((o) => {
            const b = h('button.choice', { type: 'button' }, h('span.choice-label', o));
            onTap(b, () => {
              if (resolved) return;
              if (o === q.a) {
                resolved = true;
                b.classList.add('right');
                box.querySelectorAll('.choice').forEach(button => { button.disabled = true; });
                if (tries === 0) right++;
                kos.sfx('correct');
                const explanation = q.explain || `Svaret är ${q.a}.`;
                clear(feedback).append(h('div.fb.fb-ok', h('div.fb-text', h('b', 'Rätt! '), explanation)), onTap(h('button.btn.btn-primary.story-next', { type: 'button' }, qi + 1 === s.questions.length ? 'Klar! 🎉' : 'Nästa fråga →'), () => { kos.stopSpeaking(); qi++; ask(); }));
                kos.autoSay(`Rätt! ${explanation}`);
              } else {
                tries++;
                b.classList.add('wrong-shake');
                b.disabled = true;
                kos.sfx('wrong');
                kos.say('Titta i texten igen!');
              }
            });
            return b;
          }),
        ),
      );
      box.append(h('details.story-evidence', h('summary', '📖 Läs texten igen'), s.text.map(text => h('p', text))), feedback);
      kos.autoSay(`${q.q} ${q.o.join(', ')}?`);
    };
    const done = () => {
      const first = !hasInSet(p, 'stories', s.id);
      kos.reward({ app: app.id, set: 'stories', item: s.id, stars: right + (first ? 2 : 0) });
      kos.confetti(80);
      kos.sfx('fanfare');
      clear(box).append(
        h('div.summary', h('div.sum-emoji', right === s.questions.length ? '🏆' : '📚'), h('h2.sum-title', right === s.questions.length ? 'Du förstod allt!' : 'Bra läst!'), h('p.sum-detail', `${right} av ${s.questions.length} rätt på första försöket.`), h('p.muted', 'En berättelse har ofta en början (inledning), något som händer (händelseförlopp) och ett slut (avslutning). Kan du berätta den för någon?'), h('div.sum-actions', onTap(h('button.btn.btn-primary', { type: 'button' }, '📚 Fler berättelser'), list))),
      );
      kos.say(right === s.questions.length ? 'Du förstod allt!' : 'Bra läst!');
    };
    ask();
  }
  list();
  return () => {
    alive = false;
  };
}

/* ---------- Undra ---------- */
export function wonderView(el, { kos, app, opts, level }) {
  const p = kos.profile;
  let cat = 'Alla';
  const available = eligibleWonders(level, p.settings.showAllModules);
  const cats = ['Alla', ...new Set(available.map((w) => w.cat))];
  function list() {
    clear(el);
    const chips = h('div.chip-row', cats.map((c) => onTap(h('button.chip-btn', { type: 'button', class: c === cat ? 'on' : '' }, c), () => {
      cat = c;
      list();
    })));
    const grid = h('div.wonder-grid');
    available.filter((w) => cat === 'Alla' || w.cat === cat).forEach((w, i) => {
      const seen = hasInSet(p, 'wonders', w.id);
      const ph = photo(`w-${w.id}`, { alt: '' });
      grid.appendChild(onTap(h('button.wonder-tile', { type: 'button', class: `${seen ? 'seen' : ''} ${ph ? 'has-photo' : ''}`, style: { '--i': i } }, ph ? h('span.wt-photo', { html: ph }) : null, h('span.wt-e', w.e), h('span.wt-q', w.q), seen ? h('span.lv-ok', '✓') : null), () => open(w)));
    });
    const n = available.filter((w) => hasInSet(p, 'wonders', w.id)).length;
    el.append(h('div.wonder', h('p.muted', `Stora frågor om allt möjligt. Du har utforskat ${n} av ${available.length}.`), chips, grid));
  }
  function open(w) {
    clear(el);
    const answer = h('div.wonder-answer', { hidden: true }, h('p', wonderAnswer(w, level)), h('div.wonder-think', h('b', '🤔 Fundera vidare: '), w.think));
    const reveal = h('button.btn.btn-primary.btn-xl', { type: 'button' }, '💡 Visa svaret');
    el.append(
      h(
        'div.wonder-card-big',
        photo(`w-${w.id}`) ? h('figure.wcb-photo', h('span', { html: photo(`w-${w.id}`, { alt: w.q }) }), h('figcaption.credit', creditLine(`w-${w.id}`))) : h('span.wcb-e', w.e),
        h('span.wcb-cat', w.cat),
        h('h2', w.q),
        h('p.wonder-guess', 'Vad tror du? Gissa först – säg det högt eller berätta för någon!'),
        reveal,
        answer,
        h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, '☰ Alla frågor'), () => {
          kos.stopSpeaking();
          list();
        }), onTap(h('button.btn.btn-ghost', { type: 'button' }, '🎲 Slumpa en fråga'), () => {
          kos.stopSpeaking();
          open(available[Math.floor(Math.random() * available.length)]);
        })),
      ),
    );
    kos.autoSay(`${w.q} Vad tror du? Gissa först!`);
    onTap(reveal, () => {
      reveal.hidden = true;
      answer.hidden = false;
      const first = !hasInSet(p, 'wonders', w.id);
      kos.reward({ app: app.id, set: 'wonders', item: w.id, stars: first ? 1 : 0 });
      kos.say(`${wonderAnswer(w, level)} Fundera vidare: ${w.think}`);
    });
  }
  const focus = opts?.focus && available.find((w) => w.id === opts.focus);
  if (focus) open(focus);
  else list();
}

/* ---------- Rita ---------- */
export function drawView(el, { kos, app }) {
  const p = kos.profile;
  let color = DRAW_COLORS[6];
  let size = 12;
  let tool = 'pen'; // pen | eraser | stamp
  let stamp = DRAW_STAMPS[0];
  let mirror = false;
  let usedMirror = false;
  const undo = [];
  const canvas = h('canvas.draw-canvas');
  const wrap = h('div.draw-wrap', canvas);
  const colorsRow = h('div.draw-colors');
  const toolsRow = h('div.draw-tools');
  const stampRow = h('div.draw-stamps', { hidden: true });
  const prompt = h('div.draw-prompt');
  const gallery = h('div.draw-gallery', { hidden: true });
  el.append(h('div.draw', prompt, toolsRow, stampRow, wrap, colorsRow, gallery));
  const ctxOf = () => canvas.getContext('2d');
  let W = 600;
  let H = 400;
  function setup() {
    const prev = W > 0 && canvas.width ? canvas.toDataURL() : null;
    W = Math.floor(Math.min(el.clientWidth - 8, 1100));
    H = Math.floor(Math.max(260, Math.min(window.innerHeight * 0.55, W * 0.8)));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = ctxOf();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    if (prev) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, W, H);
      img.src = prev;
    }
  }
  function snapshot() {
    try {
      undo.push(canvas.toDataURL('image/png'));
      if (undo.length > 15) undo.shift();
    } catch {}
  }
  function renderColors() {
    clear(colorsRow);
    // Färger som barnet har upptäckt i Lekstadens färglabb finns också här.
    const discovered = Object.values(loadJSON(`play.${p.id}`, {})?.colors || {});
    [...DRAW_COLORS, ...discovered.filter((c) => !DRAW_COLORS.includes(c))].forEach((c) => colorsRow.appendChild(onTap(h('button.pick.pick-col', { type: 'button', class: c === color && tool === 'pen' ? 'on' : '', style: { background: c }, 'aria-label': 'färg' }), () => {
      color = c;
      tool = 'pen';
      renderColors();
      renderTools();
    }, { guardMs: 60 })));
  }
  function renderTools() {
    clear(toolsRow);
    const tb = (label, active, fn, aria) => onTap(h('button.tool-btn', { type: 'button', class: active ? 'on' : '', 'aria-label': aria || label }, label), fn, { guardMs: 80 });
    toolsRow.append(
      tb('✏️', tool === 'pen' && size === 6, () => { tool = 'pen'; size = 6; renderTools(); renderColors(); }, 'tunn penna'),
      tb('🖌️', tool === 'pen' && size === 12, () => { tool = 'pen'; size = 12; renderTools(); renderColors(); }, 'pensel'),
      tb('🖍️', tool === 'pen' && size === 26, () => { tool = 'pen'; size = 26; renderTools(); renderColors(); }, 'tjock krita'),
      tb('🧽', tool === 'eraser', () => { tool = 'eraser'; renderTools(); renderColors(); }, 'suddgummi'),
      tb('⭐', tool === 'stamp', () => { tool = 'stamp'; stampRow.hidden = false; renderTools(); renderColors(); }, 'stämplar'),
      tb('🦋', mirror, () => { mirror = !mirror; renderTools(); kos.say(mirror ? 'Spegelpensel på! Det du ritar speglas – symmetri!' : 'Spegelpensel av.'); }, 'spegelpensel'),
      tb('↶', false, () => {
        const last = undo.pop();
        if (!last) return;
        const img = new Image();
        img.onload = () => {
          const ctx = ctxOf();
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, W, H);
          ctx.drawImage(img, 0, 0, W, H);
        };
        img.src = last;
      }, 'ångra'),
      tb('🗑️', false, () => {
        snapshot();
        const ctx = ctxOf();
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, W, H);
        kos.sfx('whoosh');
      }, 'rensa'),
      tb('💾', false, save, 'spara'),
      tb('🖼️', !gallery.hidden, () => {
        gallery.hidden = !gallery.hidden;
        renderGallery();
        renderTools();
      }, 'galleri'),
    );
    if (tool !== 'stamp') stampRow.hidden = true;
    if (mirror) wrap.classList.add('mirror');
    else wrap.classList.remove('mirror');
  }
  function renderStamps() {
    clear(stampRow);
    DRAW_STAMPS.forEach((s) => stampRow.appendChild(onTap(h('button.tool-btn', { type: 'button', class: s === stamp ? 'on' : '' }, s), () => {
      stamp = s;
      renderStamps();
    }, { guardMs: 60 })));
  }
  function newPrompt() {
    const t = DRAW_PROMPTS[Math.floor(Math.random() * DRAW_PROMPTS.length)];
    clear(prompt).append(h('span', '💡 '), h('span', t), onTap(h('button.chip-btn', { type: 'button' }, '🎲 Ny idé'), newPrompt));
    kos.autoSay(t);
  }
  function renderGallery() {
    clear(gallery);
    const list = loadDrawings(p.id);
    if (!list.length) {
      gallery.append(h('p.muted', 'Inga sparade teckningar än. Tryck på 💾 för att spara!'));
      return;
    }
    gallery.append(
      h(
        'div.gallery-grid',
        list.map((d) => {
          const del = onTap(h('button.blk-x', { type: 'button', 'aria-label': 'ta bort' }, '×'), () => {
            deleteDrawing(p.id, d.id);
            renderGallery();
          });
          const img = h('img', { src: d.data, alt: 'teckning' });
          onTap(img, () => {
            snapshot();
            const im = new Image();
            im.onload = () => ctxOf().drawImage(im, 0, 0, W, H);
            im.src = d.data;
            gallery.hidden = true;
            renderTools();
          });
          return h('div.g-item', img, del);
        }),
      ),
    );
  }
  function save() {
    // spara som komprimerad JPEG (max 900 px) för att spara utrymme
    const scale = Math.min(1, 900 / W);
    const c2 = document.createElement('canvas');
    c2.width = Math.round(W * scale);
    c2.height = Math.round(H * scale);
    c2.getContext('2d').drawImage(canvas, 0, 0, c2.width, c2.height);
    const data = c2.toDataURL('image/jpeg', 0.72);
    saveDrawing(p.id, data);
    kos.reward({ app: app.id, counter: 'drawings', stars: 2 });
    if (usedMirror) kos.reward({ counter: 'symmetryDrawings', silent: true });
    kos.sfx('fanfare');
    kos.toast('Teckningen är sparad i ditt galleri!', { icon: '🖼️' });
    if (!gallery.hidden) renderGallery();
  }
  // ritande
  let drawing = false;
  let last = null;
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const line = (a, b) => {
    const ctx = ctxOf();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tool === 'eraser' ? 34 : size;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
    if (mirror) {
      ctx.beginPath();
      ctx.moveTo(W - a[0], a[1]);
      ctx.lineTo(W - b[0], b[1]);
      ctx.stroke();
    }
  };
  const stampAt = (pt) => {
    const ctx = ctxOf();
    ctx.font = `${Math.max(36, size * 3)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stamp, pt[0], pt[1]);
    if (mirror) ctx.fillText(stamp, W - pt[0], pt[1]);
    kos.sfx('pop');
  };
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    snapshot();
    if (mirror) usedMirror = true;
    const pt = pos(e);
    if (tool === 'stamp') {
      stampAt(pt);
      return;
    }
    drawing = true;
    canvas.setPointerCapture?.(e.pointerId);
    last = pt;
    line(pt, [pt[0] + 0.1, pt[1]]);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs) {
      const pt = pos(ev);
      line(last, pt);
      last = pt;
    }
  });
  const end = () => (drawing = false);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  const onResize = () => setup();
  window.addEventListener('resize', onResize);
  renderColors();
  renderTools();
  renderStamps();
  newPrompt();
  requestAnimationFrame(setup);
  return () => window.removeEventListener('resize', onResize);
}
