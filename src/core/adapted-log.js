// Autismstöd – förälderns logg över mående, pauser och pass per dag. Sparas bara lokalt
// (localStorage på den här enheten), aldrig i molnet och aldrig synligt för barnet.
// Rena funktioner först (testbara i Node), lagring sist. Bakgrund: docs/ANPASSAT-LAGE.md.
import { FEELINGS } from './adapted.js';

export const LOG_VERSION = 1;
/** Hur många dagar loggen sparas. Äldre dagar rensas bort automatiskt. */
export const LOG_KEEP_DAYS = 60;
const MAX_PER_DAY = 40;

export function emptyLog() {
  return { v: LOG_VERSION, days: {}, tools: [] };
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const int = (v) => Math.max(0, Math.min(999, Math.round(Number(v) || 0)));

function emptyDay() {
  return { moods: [], pauses: 0, breaks: 0, passes: 0, stories: 0, plan: [] };
}

function normalizeDay(d) {
  const r = d && typeof d === 'object' ? d : {};
  const out = emptyDay();
  if (Array.isArray(r.moods)) out.moods = r.moods.filter((m) => FEELINGS.some((f) => f.id === m?.id)).slice(-MAX_PER_DAY).map((m) => ({ id: m.id, t: String(m.t || '').slice(0, 5) }));
  for (const k of ['pauses', 'breaks', 'passes', 'stories']) out[k] = int(r[k]);
  if (Array.isArray(r.plan)) out.plan = [...new Set(r.plan.filter((i) => Number.isInteger(i) && i >= 0 && i < 20))].sort((a, b) => a - b);
  return out;
}

/** Lagar en sparad logg (trasig data blir tom logg, okända fält tas bort). */
export function normalizeLog(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const out = emptyLog();
  if (r.days && typeof r.days === 'object') {
    for (const [k, v] of Object.entries(r.days)) if (DAY_RE.test(k)) out.days[k] = normalizeDay(v);
  }
  if (Array.isArray(r.tools)) out.tools = [...new Set(r.tools.filter((t) => typeof t === 'string' && /^[a-z-]{2,20}$/.test(t)))].slice(0, 8);
  return out;
}

/** Tar bort dagar äldre än LOG_KEEP_DAYS räknat från `today` (YYYY-MM-DD). */
export function pruneLog(log, today) {
  const t = Date.parse(`${today}T12:00:00`);
  if (!Number.isFinite(t)) return log;
  for (const k of Object.keys(log.days)) {
    const age = (t - Date.parse(`${k}T12:00:00`)) / 86400000;
    if (age > LOG_KEEP_DAYS) delete log.days[k];
  }
  return log;
}

/**
 * Lägger till en händelse. type: 'mood' (data = känslans id), 'pause', 'break', 'pass', 'story'.
 * `time` är "HH:MM". Muterar och returnerar loggen.
 */
export function logEvent(log, day, type, data, time = '') {
  if (!DAY_RE.test(day)) return log;
  const d = (log.days[day] = normalizeDay(log.days[day]));
  if (type === 'mood') {
    if (FEELINGS.some((f) => f.id === data) && d.moods.length < MAX_PER_DAY) d.moods.push({ id: data, t: String(time).slice(0, 5) });
  } else if (type === 'pause') d.pauses = int(d.pauses + 1);
  else if (type === 'break') d.breaks = int(d.breaks + 1);
  else if (type === 'pass') d.passes = int(d.passes + 1);
  else if (type === 'story') d.stories = int(d.stories + 1);
  pruneLog(log, day);
  return log;
}

/* ---------- Dagens plan ---------- */

/** Vilka steg i planen som är gjorda i dag (en boolean per steg). */
export function planProgress(log, day, plan) {
  const done = new Set(log.days[day]?.plan || []);
  return (plan || []).map((_, i) => done.has(i));
}

/** Index för steget som är "nu" (första ej gjorda), eller -1 om allt är klart. */
export function currentPlanIndex(log, day, plan) {
  return planProgress(log, day, plan).findIndex((d) => !d);
}

/**
 * Markerar steget `stepId` som gjort: i första hand steget som är "nu", annars det första
 * ogjorda steget med samma id. Returnerar indexet som markerades eller -1.
 */
export function markPlanStep(log, day, plan, stepId) {
  if (!DAY_RE.test(day) || !Array.isArray(plan)) return -1;
  const prog = planProgress(log, day, plan);
  const now = prog.findIndex((d) => !d);
  let idx = now >= 0 && plan[now] === stepId ? now : plan.findIndex((id, i) => id === stepId && !prog[i]);
  if (idx < 0) return -1;
  const d = (log.days[day] = normalizeDay(log.days[day]));
  d.plan = [...new Set([...d.plan, idx])].sort((a, b) => a - b);
  return idx;
}

/* ---------- Översikt för föräldern ---------- */

/** Dagar bakåt från `today` (inklusive), nyast först. */
export function lastDays(today, n = 7) {
  const t = Date.parse(`${today}T12:00:00`);
  if (!Number.isFinite(t)) return [];
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(t - i * 86400000);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
}

const WEEKDAYS = ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'];
export function weekdayLabel(day) {
  const t = Date.parse(`${day}T12:00:00`);
  return Number.isFinite(t) ? WEEKDAYS[new Date(t).getDay()] : '';
}

/**
 * Rader för tabellen i föräldravyn. `minutesByDay` (valfritt) = profilens skärmminuter per dag.
 */
export function summarizeLog(log, today, n = 7, minutesByDay = {}) {
  return lastDays(today, n).map((day) => {
    const d = log.days[day] || emptyDay();
    return {
      day,
      weekday: weekdayLabel(day),
      moods: d.moods.map((m) => m.id),
      pauses: d.pauses,
      breaks: d.breaks,
      passes: d.passes,
      stories: d.stories,
      minutes: Math.round((Number(minutesByDay[day]) || 0) / 60),
    };
  });
}

/**
 * Enkla mönster att samtala om (inga diagnoser, inga slutsatser): hur ofta varje känsla valts,
 * dagar med oro/ilska/trötthet och om pauser används. Returnerar korta svenska meningar.
 */
export function logPatterns(rows) {
  const out = [];
  const withMood = rows.filter((r) => r.moods.length);
  if (!withMood.length) return ['Inga känslokort valda ännu. Korten visas före varje pass (om ”Hur mår du?” är på).'];
  const counts = {};
  for (const r of withMood) for (const m of r.moods) counts[m] = (counts[m] || 0) + 1;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const f = FEELINGS.find((x) => x.id === top[0]);
  out.push(`Vanligast: ${f.icon} ${f.label.toLowerCase()} (${top[1]} av ${total} val).`);
  const hard = rows.filter((r) => r.moods.some((m) => ['worried', 'tired', 'angry'].includes(m)));
  if (hard.length) out.push(`Oro, trötthet eller ilska valdes ${hard.length} av ${rows.length} dagar (${hard.map((r) => r.weekday).join(', ')}).`);
  const pauses = rows.reduce((a, r) => a + r.pauses, 0);
  const breaks = rows.reduce((a, r) => a + r.breaks, 0);
  if (pauses || breaks) out.push(`Pauser: ${pauses} lugna pauser och ${breaks} rörelsepauser.`);
  return out;
}

/* ---------- Verktygslådan: barnets egna favoriter ---------- */

export function toggleTool(log, id) {
  if (typeof id !== 'string' || !/^[a-z-]{2,20}$/.test(id)) return log;
  const has = log.tools.includes(id);
  log.tools = has ? log.tools.filter((t) => t !== id) : [...log.tools, id].slice(-8);
  return log;
}

/* ---------- Lagring (bara den här enheten) ---------- */

const key = (profileId) => `kidsos.adaptedLog.v${LOG_VERSION}.${profileId}`;

export function loadLog(profileId) {
  try {
    if (typeof localStorage === 'undefined' || !profileId) return emptyLog();
    return normalizeLog(JSON.parse(localStorage.getItem(key(profileId)) || 'null'));
  } catch {
    return emptyLog();
  }
}

export function saveLog(profileId, log) {
  try {
    if (typeof localStorage === 'undefined' || !profileId) return false;
    localStorage.setItem(key(profileId), JSON.stringify(normalizeLog(log)));
    return true;
  } catch {
    return false;
  }
}

export function clearLog(profileId) {
  try {
    if (typeof localStorage !== 'undefined' && profileId) localStorage.removeItem(key(profileId));
  } catch {}
}

/** Bekvämlighet: läs, ändra, spara. */
export function updateLog(profileId, fn) {
  const log = loadLog(profileId);
  const res = fn(log);
  saveLog(profileId, log);
  return res;
}
