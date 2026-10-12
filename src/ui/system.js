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
import { NOTE_IDEAS, countWords, calculate, canAppend, formatNumber, speakExpr } from './system-logic.js';

export { NOTE_IDEAS, countWords, calculate };

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
      files: () => loadDrawings(p.id).map((d, i) => ({ id: d.id, name: `teckning-${i + 1}.jpg`, thumb: imgTag(d.data), big: imgTag(d.data), text: savedText(d.at) })),
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
      files: () => (loadJSON(`notes.${p.id}`, []) || []).map((n) => ({ id: n.id, name: `${(n.title || 'anteckning').slice(0, 18)}.txt`, thumb: '<span class="pic">📝</span>', big: `<div class="note-preview">${escapeHtml(n.text || '')}</div>`, text: '', say: n.text, open: () => {
        pendingNoteId = n.id;
        openApp('notes');
      } })),
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
    main.querySelector('.ex-preview')?.remove();
    const box = h(
      'div.ex-preview',
      h('div.ex-big', { html: f.big }),
      h('div.ex-info', h('b', f.name), f.text ? h('p', f.text) : null, f.credit ? h('small.credit', f.credit) : null, h('div.row-actions.left', f.say ? onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔊 Läs'), () => kos.read(f.say)) : null, onTap(h('button.btn.btn-primary.btn-sm', { type: 'button' }, '✕ Stäng'), () => box.remove()))),
    );
    main.appendChild(box);
    // Förhandsvisningen ligger överst i högerspalten – se till att den syns även om listan var nedskrollad.
    try {
      box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } catch {}
    if (f.say) kos.autoSay(f.say);
  }
  renderSide();
  renderMain();
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** Bara data-URL:er för bilder släpps igenom (teckningar kan komma från en inklistrad säkerhetskopia). */
function imgTag(src) {
  const ok = typeof src === 'string' && /^data:image\/[a-z+.-]+;base64,[A-Za-z0-9+/=\s]*$/i.test(src);
  return ok ? `<img class="photo" src="${escapeHtml(src)}" alt="" draggable="false">` : '<span class="pic">🖼️</span>';
}

function savedText(at) {
  const d = new Date(at);
  return Number.isNaN(d.getTime()) ? 'Sparad teckning' : `Sparad ${d.toLocaleDateString('sv-SE')}`;
}

/** Anteckning som Utforskaren vill öppna direkt. */
let pendingNoteId = null;

/* ======================= Anteckningar ======================= */
function renderNotes(el) {
  const p = kos.profile;
  const key = `notes.${p.id}`;
  let notes = loadJSON(key, []);
  if (!Array.isArray(notes)) notes = [];
  notes = notes.filter((n) => n && typeof n === 'object' && n.id);
  let cur = notes.find((n) => n.id === pendingNoteId) || notes[0] || null;
  pendingNoteId = null;
  let saveTimer;
  let confirmDel = false;
  const list = h('div.notes-list');
  const ta = h('textarea.notes-text#notes-text', { 'aria-label': 'Anteckningens text', placeholder: 'Skriv här …', spellcheck: 'true', lang: 'sv', autocapitalize: 'sentences' });
  const words = h('span.muted');
  const idea = h('div.notes-idea', { 'aria-live': 'polite' });
  const sizes = [22, 28, 36];
  let size = p.age <= 7 ? 2 : 1;
  ta.style.fontSize = `${sizes[size]}px`;
  const delBtn = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🗑️ Ta bort');
  const toolbar = h(
    'div.notes-tools',
    onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '＋ Ny'), () => newNote(true)),
    onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔊 Läs upp'), () => kos.read(ta.value.trim() || 'Du har inte skrivit något än.')),
    onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button', 'aria-label': 'textstorlek' }, 'Aa'), () => {
      size = (size + 1) % sizes.length;
      ta.style.fontSize = `${sizes[size]}px`;
    }),
    onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '💡 Idé'), () => showIdea()),
    onTap(delBtn, () => removeCurrent()),
    words,
  );
  el.append(h('div.notes', list, h('div.notes-edit', toolbar, idea, ta)));
  function persist() {
    // Nya tomma anteckningar (utom den som är öppen) sparas inte – annars fylls listan av "Ny anteckning".
    // Anteckningar som redan fanns sparade behålls även om de är tomma.
    notes = notes.filter((n) => n === cur || (n.text || '').trim() || !n.fresh);
    saveJSON(key, notes);
  }
  function resetDelete() {
    confirmDel = false;
    delBtn.textContent = '🗑️ Ta bort';
  }
  function renderList() {
    clear(list);
    list.append(...notes.map((n) => onTap(h('button.note-item', { type: 'button', class: n === cur ? 'on' : '' }, h('b', n.title || 'Ny anteckning'), h('small', new Date(n.at).toLocaleDateString('sv-SE'))), () => {
      if (n === cur) return;
      flush();
      cur = n;
      load(true);
    })));
  }
  function load(focus) {
    resetDelete();
    ta.value = cur?.text || '';
    words.textContent = `${countWords(ta.value)} ord`;
    renderList();
    // På surfplatta öppnar fokus tangentbordet, så det görs bara när barnet själv valt en anteckning.
    if (focus) ta.focus({ preventScroll: true });
  }
  function makeNote() {
    return { id: `n${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`, title: '', text: '', at: new Date().toISOString(), counted: 0, fresh: true };
  }
  function newNote(focus) {
    flush();
    if (cur && !(cur.text || '').trim()) {
      load(focus); // den öppna anteckningen är redan tom – återanvänd den
      return;
    }
    cur = makeNote();
    notes.unshift(cur);
    persist();
    load(focus);
  }
  function removeCurrent() {
    if (!cur) return;
    if (!(cur.text || '').trim()) {
      newNote(false);
      return;
    }
    if (!confirmDel) {
      confirmDel = true;
      delBtn.textContent = '❓ Säker? Tryck igen';
      kos.say('Tryck en gång till för att ta bort anteckningen.');
      return;
    }
    clearTimeout(saveTimer);
    notes = notes.filter((n) => n !== cur);
    cur = notes[0] || null;
    if (!cur) {
      cur = makeNote();
      notes.unshift(cur);
    }
    persist();
    load(false);
  }
  function showIdea() {
    const t = NOTE_IDEAS[Math.floor(Math.random() * NOTE_IDEAS.length)];
    clear(idea).append(h('span', `💡 ${t}`));
    kos.say(t);
  }
  /** Sparar och delar ut stjärnor för en viss anteckning (en stjärna per tio nya ord, bara en gång). */
  function commit(note) {
    persist();
    renderList();
    const n = countWords(note.text);
    const fresh = Math.floor(n / 10) - Math.floor((note.counted || 0) / 10);
    if (fresh > 0) {
      note.counted = n;
      persist();
      kos.reward({ app: 'notes', stars: fresh, counter: 'wordsWritten', counterBy: fresh * 10 });
    }
  }
  let pending = null;
  function flush() {
    clearTimeout(saveTimer);
    if (pending) {
      const note = pending;
      pending = null;
      commit(note);
    }
  }
  ta.addEventListener('input', () => {
    if (!cur) {
      cur = makeNote();
      notes.unshift(cur);
    }
    resetDelete();
    const note = cur;
    note.text = ta.value;
    note.title = ta.value.trim().split('\n')[0].slice(0, 30);
    note.at = new Date().toISOString();
    words.textContent = `${countWords(ta.value)} ord`;
    clearTimeout(saveTimer);
    pending = note;
    saveTimer = setTimeout(flush, 700);
  });
  if (!cur) newNote(false);
  else load(false);
  showIdea();
  return () => {
    clearTimeout(saveTimer);
    if (pending) {
      // Spara utan att rita om (vyn håller på att stängas).
      const note = pending;
      pending = null;
      persist();
      const n = countWords(note.text);
      const fresh = Math.floor(n / 10) - Math.floor((note.counted || 0) / 10);
      if (fresh > 0) {
        note.counted = n;
        persist();
        kos.reward({ app: 'notes', stars: fresh, counter: 'wordsWritten', counterBy: fresh * 10, silent: true });
      }
    } else persist();
  };
}

/* ======================= Miniräknare ======================= */
function renderCalc(el) {
  let expr = '';
  let result = null;
  const disp = h('div.calc-expr');
  const res = h('div.calc-res', { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
  const dots = h('div.calc-dots');
  const keys = ['C', '⌫', '÷', '×', '7', '8', '9', '−', '4', '5', '6', '+', '1', '2', '3', '=', '0', ','];
  const labels = { C: 'rensa', '⌫': 'sudda', '÷': 'delat med', '×': 'gånger', '−': 'minus', '+': 'plus', '=': 'lika med', ',': 'komma' };
  const pad = h('div.calc-pad');
  el.append(h('div.calc', h('div.calc-screen', disp, res), dots, pad));
  function render() {
    disp.textContent = expr || '0';
    res.textContent = result === null ? '' : `= ${formatNumber(result)}`;
    clear(dots);
    if (result !== null && Number.isInteger(result) && result > 0 && result <= 30) {
      for (let i = 0; i < result; i++) dots.appendChild(h('i', { class: i % 10 < 5 ? 'a' : 'b' }));
    }
  }
  keys.forEach((k) => {
    const b = h('button.calc-key', { type: 'button', 'aria-label': labels[k] || k, class: k === '=' ? 'eq' : /[+−×÷]/.test(k) ? 'op' : /C|⌫/.test(k) ? 'fn' : k === '0' ? 'zero' : '' }, k);
    onTap(b, () => press(k), { guardMs: 60 });
    pad.appendChild(b);
  });
  function showError(msg) {
    result = null;
    disp.textContent = expr || '0';
    res.textContent = msg;
    clear(dots);
    kos.say(msg);
  }
  function press(k) {
    kos.sfx('click');
    if (k === 'C') {
      expr = '';
      result = null;
    } else if (k === '⌫') {
      if (result !== null) result = null;
      else expr = expr.slice(0, -1);
    } else if (k === '=') {
      if (result !== null) return; // redan uträknat – räkna inte samma tal flera gånger
      try {
        result = calculate(expr);
        if (result !== null) {
          kos.say(`${speakExpr(expr)} är ${formatNumber(result).replace('−', 'minus ')}`);
          bump(kos.profile, 'calculations');
          kos.save();
        }
      } catch (e) {
        showError(e.message === 'noll' ? 'Man kan inte dela med noll!' : 'Hm, det går inte att räkna ut.');
        return;
      }
    } else {
      if (result !== null) {
        // Siffra efter ett svar börjar om; räknesätt fortsätter med svaret.
        expr = /[\d,]/.test(k) ? '' : formatNumber(result);
        result = null;
      }
      if (expr.length < 24 && canAppend(expr, k)) expr += k;
    }
    render();
  }
  const keyMap = { '*': '×', x: '×', '/': '÷', '-': '−', '.': ',', Enter: '=', Backspace: '⌫', Escape: 'C', Delete: 'C' };
  function onKey(e) {
    if (!el.isConnected || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const k = keyMap[e.key] || e.key;
    if (k === '=' || keys.includes(k)) {
      e.preventDefault();
      press(k);
    }
  }
  document.addEventListener('keydown', onKey);
  render();
  kos.autoSay('Miniräknaren. Tryck på talen och sedan på lika med.');
  return () => document.removeEventListener('keydown', onKey);
}
