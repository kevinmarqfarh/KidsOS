// Säker lagring: localStorage när det finns, annars minne (privat läge, förhandsvisning).
import { normalizeState, emptyState } from './model.js';

const KEY = 'kidsos.v1';
const DRAW_KEY = (pid) => `kidsos.v1.drawings.${pid}`;
export const MAX_DRAWINGS = 24;

const memory = new Map();

function ls() {
  try {
    const s = globalThis.localStorage;
    if (!s) return null;
    const probe = '__kidsos_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

let backend;
function store() {
  if (backend === undefined) backend = ls();
  return backend;
}

export function isPersistent() {
  return !!store();
}

function rawGet(key) {
  const s = store();
  // En misslyckad skrivning är nyare än den gamla versionen på disk.
  if (memory.has(key)) return memory.get(key);
  try {
    return s ? s.getItem(key) : null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function rawSet(key, value) {
  const s = store();
  try {
    if (s) { s.setItem(key, value); memory.delete(key); }
    else memory.set(key, value);
    return true;
  } catch {
    memory.set(key, value);
    return false; // troligen fullt lagringsutrymme
  }
}

function rawRemove(key) {
  const s = store();
  try {
    if (s) s.removeItem(key);
  } catch {}
  memory.delete(key);
}

export function loadState() {
  const raw = rawGet(KEY);
  if (!raw) return emptyState();
  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  return rawSet(KEY, JSON.stringify(state));
}

export function loadDrawings(pid) {
  try {
    const arr = JSON.parse(rawGet(DRAW_KEY(pid)) || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveDrawing(pid, dataUrl) {
  const list = loadDrawings(pid);
  list.unshift({ id: `d${Date.now().toString(36)}`, data: dataUrl, at: new Date().toISOString() });
  while (list.length > MAX_DRAWINGS) list.pop();
  let ok = rawSet(DRAW_KEY(pid), JSON.stringify(list));
  // Om lagringen är full: ta bort äldsta tills det går.
  while (!ok && list.length > 1) {
    list.pop();
    ok = rawSet(DRAW_KEY(pid), JSON.stringify(list));
  }
  return list;
}

export function deleteDrawing(pid, id) {
  const list = loadDrawings(pid).filter((d) => d.id !== id);
  rawSet(DRAW_KEY(pid), JSON.stringify(list));
  return list;
}

export function deleteDrawingsFor(pid) {
  rawRemove(DRAW_KEY(pid));
  rawRemove(`kidsos.v1.notes.${pid}`);
  rawRemove(`kidsos.v1.play.${pid}`);
  rawRemove(`kidsos.v1.studio.${pid}`);
  rawRemove(`kidsos.v1.story.${pid}`);
}

/** Per-profil-data (utöver teckningar) som följer med i säkerhetskopian: nyckelprefix → förväntad typ. */
export const BACKUP_EXTRAS = { notes: 'array', play: 'object' };

const typeOk = (v, type) => (type === 'array' ? Array.isArray(v) : !!v && typeof v === 'object' && !Array.isArray(v));

/** Säkerhetskopia som text (JSON) – fungerar även där nedladdning är spärrad. */
export function exportBackup(state) {
  const drawings = {};
  const extras = Object.fromEntries(Object.keys(BACKUP_EXTRAS).map((k) => [k, {}]));
  for (const p of state.profiles) {
    drawings[p.id] = loadDrawings(p.id);
    for (const [k, type] of Object.entries(BACKUP_EXTRAS)) {
      const v = loadJSON(`${k}.${p.id}`, null);
      if (typeOk(v, type)) extras[k][p.id] = v;
    }
  }
  const worlds = {};
  for (const p of state.profiles) worlds[p.id] = { studio: loadJSON(`studio.${p.id}`, null), play: loadJSON(`play.${p.id}`, null), notes: loadJSON(`notes.${p.id}`, null), story: loadJSON(`story.${p.id}`, null) };
  return JSON.stringify({ kidsos: 1, exportedAt: new Date().toISOString(), state, drawings, ...extras, worlds });
}

/**
 * Läser en säkerhetskopia. Äldre kopior (utan anteckningar och Lekstaden) fungerar också –
 * då lämnas den datan orörd på enheten. Bara data för profiler som finns i kopian återställs.
 */
export function importBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  if (!data || data.kidsos !== 1 || !data.state || typeof data.state !== 'object') throw new Error('Det här ser inte ut som en KidsOS-säkerhetskopia.');
  const state = normalizeState(data.state);
  const pids = new Set(state.profiles.map((p) => p.id));
  for (const [pid, list] of Object.entries(data.drawings || {})) {
    if (pids.has(pid) && Array.isArray(list)) rawSet(DRAW_KEY(pid), JSON.stringify(list.filter((d) => d && typeof d.data === 'string')));
  }
  for (const [k, type] of Object.entries(BACKUP_EXTRAS)) {
    const byPid = data[k];
    if (!byPid || typeof byPid !== 'object') continue;
    for (const [pid, v] of Object.entries(byPid)) {
      if (pids.has(pid) && typeOk(v, type)) saveJSON(`${k}.${pid}`, v);
    }
  }
  for (const profile of state.profiles) {
    const world = data.worlds?.[profile.id];
    if (!world || typeof world !== 'object') continue;
    for (const area of ['studio', 'play', 'notes', 'story']) if (world[area] !== null && world[area] !== undefined) saveJSON(`${area}.${profile.id}`, world[area]);
  }
  saveState(state);
  return state;
}

export function wipeAll(state) {
  for (const p of state?.profiles || []) deleteDrawingsFor(p.id);
  rawRemove(KEY);
}

/** Generell JSON-lagring per nyckel (anteckningar, lekstaden m.m.). */
export function loadJSON(key, fallback) {
  try {
    const raw = rawGet(`kidsos.v1.${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  return rawSet(`kidsos.v1.${key}`, JSON.stringify(value));
}

export function removeJSON(key) {
  rawRemove(`kidsos.v1.${key}`);
}
