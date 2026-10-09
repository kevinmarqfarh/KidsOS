// Systemappar: Troféer, Inställningar, Utforskaren, Anteckningar och Miniräknare.
import { h, clear, onTap } from './dom.js';
import { kos } from './kos.js';
import { renderTrophyRoom } from './trophyroom.js';
import { renderSettings } from './settings.js';
import { loadDrawings, loadJSON, saveJSON } from '../core/storage.js';
import { photo, hasPhoto, creditLine } from './img.js';
import { SPECIES } from '../apps/biology.js';
import { SPACE_PHOTOS } from '../apps/space.js';
import { PLACES, WORLD_ANIMALS } from '../apps/world.js';
import { hasInSet, bump } from '../core/model.js';

/** Skalets funktioner (sätts av shell.js för att undvika cirkulära beroenden). */
export const shellApi = {};

export const SYSTEM_APPS = {
  trophies: { id: 'trophies', name: 'Troféer', icon: '🏆', color: '#e3a008', render: (el, { openApp }) => renderTrophyRoom(el, { openApp }) },
  settings: {
    id: 'settings',
    name: 'Inställningar',
    icon: '⚙️',
    color: '#64748b',
    render: (el, { host }) => renderSettings(el, { ...shellApi, refresh: () => host.reload?.() }),
  },
  explorer: { id: 'explorer', name: 'Utforskaren', icon: '🗂️', color: '#0ea5e9', render: renderExplorer },
  notes: { id: 'notes', name: 'Anteckningar', icon: '📝', color: '#eab308', render: renderNotes },
  calc: { id: 'calc', name: 'Miniräknare', icon: '🧮', color: '#475569', render: renderCalc },
};

/* ======================= Utforskaren ======================= */
function renderExplorer(el, { openApp }) {
  const p = kos.profile;
  const folders = [
    {
      id: 'drawings', icon: '🖼️', name: 'Mina teckningar',
      files: () => loadDrawings(p.id).map((d, i) => ({ id: d.id, name: `teckning-${i + 1}.jpg`, thumb: `<img class="photo" src="${d.data}" alt="">`, big: `<img class="photo" src="${d.data}" alt="">`, text: `Sparad ${new Date(d.at).toLocaleDateString('sv-SE')}` })),
      empty: 'Inga teckningar än. Öppna Rita och tryck på 💾!',
    },
    {
      id: 'species', icon: '🃏', name: 'Artkort',
      files: () => SPECIES.filter((s) => hasInSet(p, 'species', s.id)).map((s) => ({ id: s.id, name: `${s.n}.jpg`, thumb: photo(s.id, { alt: s.n, fallback: `<span class="pic">${s.e}</span>` }), big: photo(s.id, { alt: s.n, fallback: `<span class="pic-big">${s.e}</span>` }), text: s.fact, credit: creditLine(s.id), say: `${s.n}. ${s.fact}` })),
      empty: 'Samla artkort i Biologi → Artkort.',
    },
    {
      id: 'space', icon: '🪐', name: 'Rymdbilder',
      files: () => SPACE_PHOTOS.filter((s) => hasPhoto(s.key)).map((s) => ({ id: s.key, name: `${s.file}.jpg`, thumb: photo(s.key, { alt: s.title }), big: photo(s.key, { alt: s.title }), text: `${s.title}. ${s.fact}`, credit: creditLine(s.key), say: `${s.title}. ${s.fact}` })),
      empty: 'Inga rymdbilder hittades.',
    },
    {
      id: 'places', icon: '🌍', name: 'Världen',
      files: () => [...PLACES, ...WORLD_ANIMALS].filter((s) => hasInSet(p, 'places', s.id) && hasPhoto(s.id)).map((s) => ({ id: s.id, name: `${s.name.toLowerCase().replace(/\s+/g, '-')}.jpg`, thumb: photo(s.id, { alt: s.name }), big: photo(s.id, { alt: s.name }), text: s.fact, credit: creditLine(s.id), say: `${s.name}. ${s.fact}` })),
      empty: 'Upptäck platser och djur i appen Världen så hamnar bilderna här.',
    },
    {
      id: 'notes', icon: '📝', name: 'Anteckningar',
      files: () => (loadJSON(`notes.${p.id}`, []) || []).map((n) => ({ id: n.id, name: `${(n.title || 'anteckning').slice(0, 18)}.txt`, thumb: '<span class="pic">📝</span>', big: `<div class="note-preview">${escapeHtml(n.text || '')}</div>`, text: '', say: n.text, open: () => openApp('notes') })),
      empty: 'Inga anteckningar än.',
    },
  ];
  let cur = folders[0];
  const side = h('nav.ex-side');
  const main = h('div.ex-main');
  const path = h('div.ex-path');
  el.append(h('div.explorer', side, h('div.ex-right', path, main)));
  function renderSide() {
    clear(side);
    folders.forEach((f) => side.appendChild(onTap(h('button.ex-folder', { type: 'button', class: f === cur ? 'on' : '' }, h('span', f.icon), h('span', f.name), h('small', String(f.files().length))), () => {
      cur = f;
      renderSide();
      renderMain();
    })));
  }
  function renderMain() {
    clear(path).append(h('span', '💻 Den här datorn'), h('span.sep', '›'), h('span', `${kos.profile.name}`), h('span.sep', '›'), h('b', `${cur.icon} ${cur.name}`));
    clear(main);
    const files = cur.files();
    if (!files.length) {
      main.append(h('p.muted.ex-empty', cur.empty));
      return;
    }
    main.append(
      h(
        'div.ex-grid',
        files.map((f) => onTap(h('button.ex-file', { type: 'button' }, h('span.ex-thumb', { html: f.thumb }), h('small', f.name)), () => (f.open ? f.open() : preview(f)))),
      ),
    );
  }
  function preview(f) {
    const box = h(
      'div.ex-preview',
      h('div.ex-big', { html: f.big }),
      h('div.ex-info', h('b', f.name), f.text ? h('p', f.text) : null, f.credit ? h('small.credit', f.credit) : null, h('div.row-actions.left', f.say ? onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔊 Läs'), () => kos.say(f.say)) : null, onTap(h('button.btn.btn-primary.btn-sm', { type: 'button' }, '✕ Stäng'), () => box.remove()))),
    );
    main.appendChild(box);
    if (f.say) kos.autoSay(f.say);
  }
  renderSide();
  renderMain();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
}

/* ======================= Anteckningar ======================= */
export const NOTE_IDEAS = [
  'Vad gjorde du i dag?',
  'Skriv om ditt favoritdjur.',
  'Hitta på en saga som börjar med "Det var en gång …"',
  'Vad vill du bli när du blir stor?',
  'Skriv en inköpslista till en picknick.',
  'Skriv ett brev till någon du tycker om.',
  'Vad skulle du göra om du var osynlig en dag?',
  'Beskriv ditt rum så att någon annan kan rita det.',
];

export function countWords(text) {
  return (String(text).match(/[\p{L}\p{N}]+/gu) || []).length;
}

function renderNotes(el) {
  const p = kos.profile;
  const key = `notes.${p.id}`;
  let notes = loadJSON(key, []) || [];
  let cur = notes[0] || null;
  let saveTimer;
  const list = h('div.notes-list');
  const ta = h('textarea.notes-text#notes-text', { placeholder: 'Skriv här …', spellcheck: 'true', lang: 'sv', autocapitalize: 'sentences' });
  const words = h('span.muted');
  const idea = h('div.notes-idea');
  const sizes = [22, 28, 36];
  let size = p.age <= 7 ? 2 : 1;
  ta.style.fontSize = `${sizes[size]}px`;
  const toolbar = h(
    'div.notes-tools',
    onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '＋ Ny'), () => newNote()),
    onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔊 Läs upp'), () => kos.say(ta.value || 'Du har inte skrivit något än.')),
    onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button', 'aria-label': 'textstorlek' }, 'Aa'), () => {
      size = (size + 1) % sizes.length;
      ta.style.fontSize = `${sizes[size]}px`;
    }),
    onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '💡 Idé'), () => showIdea()),
    words,
  );
  el.append(h('div.notes', list, h('div.notes-edit', toolbar, idea, ta)));
  function persist() {
    saveJSON(key, notes);
  }
  function renderList() {
    clear(list);
    list.append(...notes.map((n) => onTap(h('button.note-item', { type: 'button', class: n === cur ? 'on' : '' }, h('b', n.title || 'Ny anteckning'), h('small', new Date(n.at).toLocaleDateString('sv-SE'))), () => {
      cur = n;
      load();
    })));
  }
  function load() {
    ta.value = cur?.text || '';
    words.textContent = `${countWords(ta.value)} ord`;
    renderList();
    ta.focus({ preventScroll: true });
  }
  function newNote() {
    cur = { id: `n${Date.now().toString(36)}`, title: '', text: '', at: new Date().toISOString(), counted: 0 };
    notes.unshift(cur);
    persist();
    load();
  }
  function showIdea() {
    const t = NOTE_IDEAS[Math.floor(Math.random() * NOTE_IDEAS.length)];
    clear(idea).append(h('span', `💡 ${t}`));
    kos.say(t);
  }
  ta.addEventListener('input', () => {
    if (!cur) newNote();
    cur.text = ta.value;
    cur.title = ta.value.trim().split('\n')[0].slice(0, 30);
    cur.at = new Date().toISOString();
    const n = countWords(ta.value);
    words.textContent = `${n} ord`;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      persist();
      renderList();
      // Belöning: en stjärna per tio nya ord (räknas bara en gång per anteckning).
      const fresh = Math.floor(n / 10) - Math.floor((cur.counted || 0) / 10);
      if (fresh > 0) {
        kos.reward({ app: 'notes', stars: fresh, counter: 'wordsWritten', counterBy: fresh * 10 });
        cur.counted = n;
        persist();
      }
    }, 700);
  });
  if (!notes.length) newNote();
  else load();
  showIdea();
  return () => {
    clearTimeout(saveTimer);
    persist();
  };
}

/* ======================= Miniräknare ======================= */
/** Säker uträkning av + − × ÷ med rätt prioritet (ingen eval). */
export function calculate(expr) {
  const tokens = String(expr).replace(/,/g, '.').match(/\d+(?:\.\d+)?|[+\-×÷*/]/g) || [];
  if (!tokens.length) return null;
  const nums = [];
  const ops = [];
  const prec = (o) => ('×÷*/'.includes(o) ? 2 : 1);
  const apply = () => {
    const b = nums.pop();
    const a = nums.pop();
    const o = ops.pop();
    if (a === undefined || b === undefined) throw new Error('fel');
    if (o === '+') nums.push(a + b);
    else if (o === '-') nums.push(a - b);
    else if (o === '×' || o === '*') nums.push(a * b);
    else {
      if (b === 0) throw new Error('noll');
      nums.push(a / b);
    }
  };
  let expectNum = true;
  for (const t of tokens) {
    if (/\d/.test(t)) {
      nums.push(Number(t));
      expectNum = false;
    } else {
      if (expectNum) throw new Error('fel');
      while (ops.length && prec(ops[ops.length - 1]) >= prec(t)) apply();
      ops.push(t);
      expectNum = true;
    }
  }
  if (expectNum) throw new Error('fel');
  while (ops.length) apply();
  return Math.round(nums[0] * 1e6) / 1e6;
}

function renderCalc(el) {
  let expr = '';
  let result = null;
  const disp = h('div.calc-expr');
  const res = h('div.calc-res');
  const dots = h('div.calc-dots');
  const keys = ['C', '⌫', '÷', '×', '7', '8', '9', '−', '4', '5', '6', '+', '1', '2', '3', '=', '0', ','];
  const pad = h('div.calc-pad');
  el.append(h('div.calc', h('div.calc-screen', disp, res), dots, pad));
  const say = (s) => s.replace(/−/g, ' minus ').replace(/\+/g, ' plus ').replace(/×/g, ' gånger ').replace(/÷/g, ' delat med ').replace(/\./g, ',');
  function render() {
    disp.textContent = expr || '0';
    res.textContent = result === null ? '' : `= ${String(result).replace('.', ',')}`;
    clear(dots);
    if (result !== null && Number.isInteger(result) && result > 0 && result <= 30) {
      for (let i = 0; i < result; i++) dots.appendChild(h('i', { class: i % 10 < 5 ? 'a' : 'b' }));
    }
  }
  keys.forEach((k) => {
    const b = h('button.calc-key', { type: 'button', class: k === '=' ? 'eq' : /[+−×÷]/.test(k) ? 'op' : /C|⌫/.test(k) ? 'fn' : k === '0' ? 'zero' : '' }, k);
    onTap(b, () => press(k), { guardMs: 60 });
    pad.appendChild(b);
  });
  function press(k) {
    kos.sfx('click');
    if (k === 'C') {
      expr = '';
      result = null;
    } else if (k === '⌫') expr = expr.slice(0, -1);
    else if (k === '=') {
      try {
        result = calculate(expr.replace(/−/g, '-'));
        if (result !== null) {
          kos.say(`${say(expr)} är ${String(result).replace('.', ',')}`);
          bump(kos.profile, 'calculations');
          kos.save();
        }
      } catch (e) {
        result = null;
        res.textContent = e.message === 'noll' ? 'Man kan inte dela med noll!' : 'Hm, det går inte att räkna ut';
        kos.say(e.message === 'noll' ? 'Man kan inte dela med noll!' : 'Det går inte att räkna ut.');
        disp.textContent = expr;
        return;
      }
    } else {
      if (result !== null && /\d/.test(k)) {
        expr = '';
      } else if (result !== null) expr = String(result).replace('.', ',');
      result = null;
      if (expr.length < 24) expr += k;
    }
    render();
  }
  render();
  kos.autoSay('Miniräknaren. Tryck på talen och sedan på lika med.');
}
