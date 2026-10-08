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
  try {
    return s ? s.getItem(key) : memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function rawSet(key, value) {
  const s = store();
  try {
    if (s) s.setItem(key, value);
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
}

/** Säkerhetskopia som text (JSON) – fungerar även där nedladdning är spärrad. */
export function exportBackup(state) {
  const drawings = {};
  for (const p of state.profiles) drawings[p.id] = loadDrawings(p.id).slice(0, 6);
  return JSON.stringify({ kidsos: 1, exportedAt: new Date().toISOString(), state, drawings });
}

export function importBackup(text) {
  const data = JSON.parse(text);
  if (!data || data.kidsos !== 1 || !data.state) throw new Error('Det här ser inte ut som en KidsOS-säkerhetskopia.');
  const state = normalizeState(data.state);
  for (const [pid, list] of Object.entries(data.drawings || {})) {
    if (Array.isArray(list)) rawSet(DRAW_KEY(pid), JSON.stringify(list));
  }
  saveState(state);
  return state;
}

export function wipeAll(state) {
  for (const p of state?.profiles || []) deleteDrawingsFor(p.id);
  rawRemove(KEY);
}
