// KidsOS-kärnan: tillstånd, belöningar, uppläsning, notiser och skärmtid.
import { loadState, saveState } from '../core/storage.js';
import {
  newProfile, recordAnswer, recordRound, addStars, bump, addToSet, touchDay, dateKey,
  isOverDailyLimit, currentLevel, appStat, addCoins, ageBand,
} from '../core/model.js';
import { awardTrophies } from '../core/trophies.js';
import { rankFor } from '../core/progress.js';
import { speak, stopSpeaking, setSpeechRate, setSpeechEnabled, initSpeech } from '../core/speech.js';
import { sfx, setSoundEnabled, unlockAudio } from '../core/sound.js';
import { isPreReader, LEVELS } from '../core/age.js';
import { h, reducedMotion } from './dom.js';

const listeners = new Map();
let saveTimer = null;
let tickTimer = null;
let lastTick = Date.now();

export const kos = {
  state: null,
  root: null,
  overlayRoot: null,
  paused: false,

  init(root) {
    this.root = root;
    this.state = loadState();
    initSpeech();
    this.applySettings();
    // Ljud och tal kräver ett första tryck på iOS.
    const unlock = () => {
      unlockAudio();
      window.removeEventListener('pointerdown', unlock, true);
    };
    window.addEventListener('pointerdown', unlock, true);
    this.startClock();
    document.addEventListener('visibilitychange', () => {
      lastTick = Date.now();
      if (document.hidden) this.saveNow();
    });
    window.addEventListener('pagehide', () => this.saveNow());
  },

  get profile() {
    return this.state.profiles.find((p) => p.id === this.state.activeId) || null;
  },

  applySettings() {
    const s = this.state.settings;
    setSoundEnabled(s.sound);
    setSpeechRate(s.speechRate);
    document.documentElement.dataset.ostheme = s.theme || 'day';
    const p = this.profile;
    setSpeechEnabled(!p || p.settings.readAloud !== 'off');
    if (p) document.documentElement.style.setProperty('--me', p.color);
    document.documentElement.dataset.ageband = p ? ageBand(p.age) : 'mid';
  },

  on(evt, fn) {
    if (!listeners.has(evt)) listeners.set(evt, new Set());
    listeners.get(evt).add(fn);
    return () => listeners.get(evt)?.delete(fn);
  },
  emit(evt, data) {
    listeners.get(evt)?.forEach((fn) => {
      try {
        fn(data);
      } catch (e) {
        console.error(e);
      }
    });
  },

  save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => this.saveNow(), 250);
  },
  saveNow() {
    clearTimeout(saveTimer);
    if (this.state) saveState(this.state);
  },

  /* ---------- profiler ---------- */
  createProfile(data) {
    const p = newProfile(data);
    this.state.profiles.push(p);
    this.saveNow();
    return p;
  },
  login(id) {
    this.state.activeId = id;
    const p = this.profile;
    if (p) touchDay(p, dateKey(), 0);
    lastTick = Date.now();
    this.applySettings();
    this.saveNow();
    this.emit('profile');
  },
  logout() {
    stopSpeaking();
    this.state.activeId = null;
    this.saveNow();
    this.emit('profile');
  },

  /* ---------- tal & ljud ---------- */
  shouldAutoSpeak() {
    const p = this.profile;
    if (!p) return false;
    if (p.settings.readAloud === 'on') return true;
    if (p.settings.readAloud === 'off') return false;
    return isPreReader(p.age) || p.age <= 7;
  },
  say(text, opts) {
    return speak(text, { force: true, ...opts });
  },
  autoSay(text, opts) {
    if (this.shouldAutoSpeak()) return speak(text, opts);
    return Promise.resolve();
  },
  stopSpeaking,
  sfx(name) {
    try {
      sfx[name]?.();
    } catch {}
  },

  /* ---------- nivåer & belöningar ---------- */
  level(appId) {
    const p = this.profile;
    return p ? currentLevel(p, appId) : 0;
  },
  levelInfo(appId) {
    return LEVELS[this.level(appId)];
  },

  /** Ett svar i en quiz. firstTry = rätt på första försöket. */
  answer(appId, firstTry) {
    const p = this.profile;
    if (!p) return null;
    const change = recordAnswer(p, appId, { firstTry });
    if (firstTry) {
      addStars(p, 1);
      this.emit('stars', p.stars);
    }
    if (change === 'up') {
      this.toast(`<b>Nivå upp!</b> ${LEVELS[appStat(p, appId).level].emoji} Du är redo för lite svårare uppgifter.`, { icon: '🚀' });
      this.sfx('fanfare');
    }
    this.checkTrophies();
    this.save();
    return change;
  },

  retry() {
    const p = this.profile;
    if (p) bump(p, 'retries');
  },

  roundDone(appId, moduleId, correctFirst, total) {
    const p = this.profile;
    if (!p) return { rating: 1, bonus: 0, trophies: [] };
    const before = rankFor(p.stars);
    const res = recordRound(p, appId, moduleId, { correctFirst, total });
    const trophies = this.checkTrophies({ silent: true });
    const after = rankFor(p.stars);
    this.emit('stars', p.stars);
    this.saveNow();
    return { ...res, trophies, rankUp: after.index > before.index ? after : null };
  },

  /** Belöning från interaktiva vyer (experiment, robotbanor, spårning …). */
  reward({ app, stars = 0, set, item, counter, counterBy = 1, silent = false } = {}) {
    const p = this.profile;
    if (!p) return { isNew: false, trophies: [] };
    let isNew = false;
    if (set && item !== undefined) isNew = addToSet(p, set, item);
    if (counter) bump(p, counter, counterBy);
    if (app) addToSet(p, 'appsTried', app);
    if (stars) {
      addStars(p, stars);
      this.emit('stars', p.stars);
      if (!silent) this.flyStar(stars);
    }
    const trophies = this.checkTrophies();
    this.save();
    return { isNew, trophies };
  },

  checkTrophies({ silent = false } = {}) {
    const p = this.profile;
    if (!p) return [];
    const won = awardTrophies(p);
    // Varje ny trofé ger också fem mynt till Lekstaden.
    if (won.length) addCoins(p, won.length * 5);
    if (!silent) won.forEach((t, i) => setTimeout(() => this.trophyToast(t), 400 + i * 1600));
    if (won.length) this.emit('trophies', won);
    return won;
  },

  /* ---------- notiser & firande ---------- */
  toast(html, { icon = '✨', ms = 3200 } = {}) {
    const layer = this.overlayRoot || document.body;
    const el = h('div.toast', { role: 'status' }, h('span.toast-icon', icon), h('div.toast-text', { html }));
    layer.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => {
      el.classList.remove('in');
      setTimeout(() => el.remove(), 400);
    }, ms);
  },
  trophyToast(t) {
    this.sfx('trophy');
    this.toast(`<small>Ny trofé! +5 🪙</small><b>${t.name}</b>`, { icon: t.icon, ms: 3600 });
    this.say(`Ny trofé! ${t.name}`, { interrupt: false });
    this.confetti(60);
  },
  flyStar(n = 1) {
    if (reducedMotion()) return;
    const layer = this.overlayRoot || document.body;
    const target = [...document.querySelectorAll('.tb-stars, .sb-stars')].find((n) => n.offsetParent !== null);
    const tr = target?.getBoundingClientRect();
    for (let i = 0; i < Math.min(n, 5); i++) {
      const s = h('div.fly-star', '⭐');
      s.style.left = `${window.innerWidth / 2 - 20 + i * 14}px`;
      s.style.top = `${window.innerHeight / 2}px`;
      layer.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = tr ? `translate(${tr.left - window.innerWidth / 2 + 10 - i * 14}px, ${tr.top - window.innerHeight / 2}px) scale(.6)` : 'translateY(-60vh)';
        s.style.opacity = '0.2';
      });
      setTimeout(() => s.remove(), 900);
    }
    this.sfx('star');
  },
  confetti(count = 120) {
    if (reducedMotion()) return;
    const layer = this.overlayRoot || document.body;
    const c = h('canvas.confetti');
    layer.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    const colors = ['#ff6b5b', '#ffc93c', '#2fae66', '#3d8bfd', '#8a5cf6', '#ff5fa2', '#13a3a0'];
    const parts = Array.from({ length: count }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 16 - 6,
      r: Math.random() * 6 + 4,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * Math.PI,
      va: (Math.random() - 0.5) * 0.4,
    }));
    let frame = 0;
    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of parts) {
        p.vy += 0.45;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.va;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      }
      if (frame < 110) requestAnimationFrame(tick);
      else c.remove();
    };
    requestAnimationFrame(tick);
  },

  /* ---------- skärmtid ---------- */
  startClock() {
    clearInterval(tickTimer);
    tickTimer = setInterval(() => this.tick(), 10000);
  },
  tick() {
    const now = Date.now();
    const dt = Math.min(60, Math.round((now - lastTick) / 1000));
    lastTick = now;
    const p = this.profile;
    if (!p || document.hidden || this.paused) return;
    touchDay(p, dateKey(), dt);
    this.save();
    this.emit('tick');
    if (isOverDailyLimit(p)) this.emit('limit');
  },
};
