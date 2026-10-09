// Ren datamodell för profiler, framsteg och statistik.
// Alla funktioner här är fria från DOM och lagring så att de kan enhetstestas.
import { startLevelForProfile, AGE_BANDS, clampLevel, MAX_LEVEL } from './age.js';

export const STATE_VERSION = 1;

export function emptyState() {
  return {
    version: STATE_VERSION,
    profiles: [],
    activeId: null,
    settings: {
      pin: null, // föräldrakod (4 siffror) eller null
      sound: true,
      speechRate: 0.92,
      theme: 'day', // 'day' | 'night'
    },
  };
}

let idCounter = 0;
export function makeId(prefix = 'p') {
  idCounter = (idCounter + 1) % 1e6;
  return `${prefix}${Date.now().toString(36)}${idCounter.toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
}

export function newProfile({ name, age, avatar = '🦊', color = '#4aa8ff', wallpaper = 'sky', ageBand } = {}) {
  const band = AGE_BANDS.find(item => item.id === ageBand);
  const cleanName = String(name || '').trim().slice(0, 16) || 'Kompis';
  return {
    id: makeId('p'),
    name: cleanName,
    age: band?.age ?? Math.max(3, Math.min(12, Number(age) || 6)),
    ...(band ? { ageBand: band.id } : {}),
    avatar,
    color,
    wallpaper,
    createdAt: new Date().toISOString(),
    stars: 0,
    stats: {},
    counters: {},
    sets: {},
    trophies: {},
    days: {},
    streak: { count: 0, best: 0, last: null },
    levelOverride: {},
    settings: {
      readAloud: 'auto', // 'auto' (efter ålder) | 'on' | 'off'
      dailyLimitMin: 0, // 0 = ingen gräns
      hiddenApps: [],
      showAllModules: false,
    },
  };
}

/** Migrerar/lagar en profil som kan sakna fält (äldre version eller korrupt data). */
export function normalizeProfile(p) {
  const base = newProfile({ name: p?.name, age: p?.age, avatar: p?.avatar, color: p?.color, wallpaper: p?.wallpaper, ageBand: p?.ageBand });
  const out = { ...base, ...p };
  const band = AGE_BANDS.find(item => item.id === out.ageBand);
  if (band) out.age = band.age;
  else delete out.ageBand;
  out.settings = { ...base.settings, ...(p?.settings || {}) };
  out.streak = { ...base.streak, ...(p?.streak || {}) };
  for (const k of ['stats', 'counters', 'sets', 'trophies', 'days', 'levelOverride']) {
    if (!out[k] || typeof out[k] !== 'object') out[k] = {};
  }
  if (!Array.isArray(out.settings.hiddenApps)) out.settings.hiddenApps = [];
  out.stars = Math.max(0, Number(out.stars) || 0);
  return out;
}

export function normalizeState(s) {
  const base = emptyState();
  if (!s || typeof s !== 'object') return base;
  const out = { ...base, ...s, settings: { ...base.settings, ...(s.settings || {}) } };
  out.profiles = Array.isArray(s.profiles) ? s.profiles.map(normalizeProfile) : [];
  if (!out.profiles.some((p) => p.id === out.activeId)) out.activeId = null;
  out.version = STATE_VERSION;
  return out;
}

export function appStat(profile, appId) {
  if (!profile.stats[appId]) {
    profile.stats[appId] = {
      level: startLevelForProfile(profile),
      rounds: 0,
      correct: 0,
      wrong: 0,
      runUp: 0,
      runDown: 0,
      modules: {},
    };
  }
  return profile.stats[appId];
}

export function moduleStat(profile, appId, moduleId) {
  const s = appStat(profile, appId);
  if (!s.modules[moduleId]) s.modules[moduleId] = { rounds: 0, best: 0, correct: 0 };
  return s.modules[moduleId];
}

export function currentLevel(profile, appId) {
  const o = profile.levelOverride?.[appId];
  if (o !== undefined && o !== null && o !== '') return clampLevel(o);
  return clampLevel(appStat(profile, appId).level);
}

export const ADAPT_UP_AFTER = 5; // rätt på första försöket i rad
export const ADAPT_DOWN_AFTER = 3; // missar i rad

/**
 * Registrerar ett svar och anpassar nivån (zonen för närmaste utveckling):
 * fem rätt i rad på första försöket → nivå upp, tre missar i rad → nivå ned.
 * Om en förälder har låst nivån sker ingen anpassning.
 */
export function recordAnswer(profile, appId, { firstTry }) {
  const s = appStat(profile, appId);
  let change = null;
  if (firstTry) {
    s.correct++;
    s.runUp++;
    s.runDown = 0;
  } else {
    s.wrong++;
    s.runDown++;
    s.runUp = 0;
  }
  const locked = profile.levelOverride?.[appId] !== undefined && profile.levelOverride?.[appId] !== null && profile.levelOverride?.[appId] !== '';
  if (!locked) {
    if (s.runUp >= ADAPT_UP_AFTER && s.level < MAX_LEVEL) {
      s.level++;
      s.runUp = 0;
      change = 'up';
    } else if (s.runDown >= ADAPT_DOWN_AFTER && s.level > 0) {
      s.level--;
      s.runDown = 0;
      change = 'down';
    }
  }
  return change;
}

/** 1–3 stjärnor för en runda beroende på andel rätt på första försöket. */
export function roundRating(correctFirst, total) {
  if (!total) return 1;
  const r = correctFirst / total;
  if (r >= 0.99) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

export function recordRound(profile, appId, moduleId, { correctFirst, total }) {
  const s = appStat(profile, appId);
  const m = moduleStat(profile, appId, moduleId);
  const rating = roundRating(correctFirst, total);
  s.rounds++;
  m.rounds++;
  m.correct += correctFirst;
  const improved = rating > m.best;
  m.best = Math.max(m.best, rating);
  bump(profile, 'rounds');
  bump(profile, `rounds:${appId}`);
  bump(profile, `rounds:${appId}:${moduleId}`);
  if (rating === 3) {
    bump(profile, 'perfect');
    bump(profile, `perfect:${appId}:${moduleId}`);
  }
  addToSet(profile, 'appsTried', appId);
  // Bonus: runda klar ger en extra stjärna, perfekt runda två.
  const bonus = rating === 3 ? 2 : 1;
  addStars(profile, bonus);
  return { rating, improved, bonus };
}

export function addStars(profile, n = 1) {
  profile.stars = Math.max(0, (profile.stars || 0) + n);
  return profile.stars;
}

export function bump(profile, key, n = 1) {
  profile.counters[key] = (profile.counters[key] || 0) + n;
  return profile.counters[key];
}

export function count(profile, key) {
  return profile.counters?.[key] || 0;
}

/** Lägger till i en samling. Returnerar true om objektet var nytt. */
export function addToSet(profile, setKey, item) {
  if (!profile.sets[setKey]) profile.sets[setKey] = {};
  if (profile.sets[setKey][item]) return false;
  profile.sets[setKey][item] = 1;
  return true;
}

export function setSize(profile, setKey) {
  return Object.keys(profile.sets?.[setKey] || {}).length;
}

export function hasInSet(profile, setKey, item) {
  return !!profile.sets?.[setKey]?.[item];
}

export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dayDiff(a, b) {
  const [ya, ma, da] = a.split('-').map(Number);
  const [yb, mb, db] = b.split('-').map(Number);
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86400000);
}

/** Registrerar aktiv tid för en dag och uppdaterar "dagar i rad". */
export function touchDay(profile, key, seconds = 0) {
  profile.days[key] = (profile.days[key] || 0) + Math.max(0, seconds);
  const st = profile.streak;
  if (st.last !== key) {
    if (st.last && dayDiff(st.last, key) === 1) st.count += 1;
    else if (!st.last || dayDiff(st.last, key) > 1) st.count = 1;
    // (dag bakåt i tiden – t.ex. fel klocka – ignoreras)
    if (!st.last || dayDiff(st.last, key) > 0) st.last = key;
    st.best = Math.max(st.best || 0, st.count);
  }
  return st;
}

export function secondsToday(profile, key = dateKey()) {
  return profile.days?.[key] || 0;
}

/** Extra minuter som en förälder har gett just i dag. */
export function bonusToday(profile, key = dateKey()) {
  return profile.limitBonus?.date === key ? Number(profile.limitBonus.min) || 0 : 0;
}

export function addBonusMinutes(profile, min, key = dateKey()) {
  const cur = bonusToday(profile, key);
  profile.limitBonus = { date: key, min: cur + min };
  return profile.limitBonus;
}

export function minutesLeftToday(profile, key = dateKey()) {
  const lim = Number(profile.settings?.dailyLimitMin) || 0;
  if (!lim) return Infinity;
  return Math.max(0, lim + bonusToday(profile, key) - secondsToday(profile, key) / 60);
}

export function isOverDailyLimit(profile, key = dateKey()) {
  return minutesLeftToday(profile, key) <= 0;
}

/** Förälderns nya intervall ändrar svårighet, inte intjänade framsteg. */
export function applyAgeBand(profile, bandId) {
  const band = AGE_BANDS.find(item => item.id === bandId);
  if (!band) return false;
  profile.ageBand = band.id;
  profile.age = band.age;
  for (const stat of Object.values(profile.stats)) {
    stat.level = band.level;
    stat.runUp = 0;
    stat.runDown = 0;
  }
  profile.levelOverride = {};
  return true;
}
