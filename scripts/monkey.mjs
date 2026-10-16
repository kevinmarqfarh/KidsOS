// Monkey-/röktest: öppnar varje app och modul för åldrarna 5/7/9 i surfplatte- och datorlayout,
// svarar på några frågor, trycker slumpmässigt i interaktiva vyer, går hem och letar efter
// konsolfel, sidfel, ohanterade promise-avvisningar, fastlåsta vyer, dialoger som inte går att
// stänga, uppläsning som fortsätter, läckande intervall/lyssnare/animationsloopar och
// localStorage som växer onormalt.
//
// Kör: npm run -s build && node scripts/monkey.mjs
// Miljövariabler:
//   MONKEY_MS=15000        tid för slumptryck i interaktiva vyer (ms)
//   MONKEY_QUIZ_TAPS=4     antal slumptryck efter frågorna i frågemoduler
//   MONKEY_WORKERS=4       parallella webbläsarkontexter
//   MONKEY_AGES=5,7,9      åldrar
//   MONKEY_LAYOUTS=tablet,desktop
//   MONKEY_APPS=math,draw  bara dessa appar (valfritt)
//   MONKEY_MODULES=trace   bara moduler vars id innehåller texten (valfritt)
//   MONKEY_SEED=1          slumpfrö
//   MONKEY_OUT=fil.json    rapportfil (standard: monkey-report.json i arbetskatalogen)
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright-core';
import { APPS } from '../src/apps/registry.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP_URL = `file://${join(root, 'dist', 'index.html')}`;
const env = process.env;
const MONKEY_MS = Number(env.MONKEY_MS || 15000);
const QUIZ_TAPS = Number(env.MONKEY_QUIZ_TAPS || 4);
const WORKERS = Number(env.MONKEY_WORKERS || 4);
const AGES = (env.MONKEY_AGES || '5,7,9').split(',').map(Number);
const LAYOUTS = (env.MONKEY_LAYOUTS || 'tablet,desktop').split(',');
const ONLY_APPS = env.MONKEY_APPS ? env.MONKEY_APPS.split(',') : null;
const ONLY_MODS = env.MONKEY_MODULES || null;
const OUT = env.MONKEY_OUT || join(process.cwd(), 'monkey-report.json');
let seed = Number(env.MONKEY_SEED || 1);
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

const CHROME = [env.CHROME_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/usr/bin/chromium', '/usr/bin/google-chrome'].filter(Boolean).find((p) => existsSync(p));
const TABLET = { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
const DESKTOP = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false };

/** Instrumentering som körs före appens kod. */
function instrument() {
  const w = window;
  const mon = (w.__mon = { intervals: new Map(), listenerStacks: new Map(), listeners: 0, listenerTypes: {}, raf: 0, rejections: [], speech: [], speaking: null });
  const si = w.setInterval.bind(w);
  const ci = w.clearInterval.bind(w);
  w.setInterval = function (fn, ms, ...rest) {
    const id = si(fn, ms, ...rest);
    const stack = (new Error().stack || '').split('\n').slice(2, 4).map((s) => s.trim()).join(' | ');
    mon.intervals.set(id, `${ms}ms ${stack}`);
    return id;
  };
  w.clearInterval = function (id) {
    mon.intervals.delete(id);
    return ci(id);
  };
  const raf = w.requestAnimationFrame.bind(w);
  w.requestAnimationFrame = (fn) => raf((t) => { mon.raf++; fn(t); });
  const add = EventTarget.prototype.addEventListener;
  const rem = EventTarget.prototype.removeEventListener;
  const tracked = (t) => t === w || t === document;
  const keys = new Set();
  const key = (t, type, fn, opt) => `${t === w ? 'w' : 'd'}:${type}:${typeof opt === 'boolean' ? opt : !!opt?.capture}:${mon.fnId(fn)}`;
  const ids = new WeakMap();
  let next = 1;
  mon.fnId = (fn) => { if (!fn || (typeof fn !== 'function' && typeof fn !== 'object')) return 0; if (!ids.has(fn)) ids.set(fn, next++); return ids.get(fn); };
  EventTarget.prototype.addEventListener = function (type, fn, opt) {
    if (tracked(this) && fn && !(opt && opt.once)) {
      const k = key(this, type, fn, opt);
      if (!keys.has(k)) { keys.add(k); mon.listenerTypes[type] = (mon.listenerTypes[type] || 0) + 1; mon.listenerStacks.set(k, (new Error().stack || '').split('\n').slice(2, 5).map((x) => x.trim()).join(' | ')); }
      mon.listeners = keys.size;
    }
    return add.call(this, type, fn, opt);
  };
  EventTarget.prototype.removeEventListener = function (type, fn, opt) {
    if (tracked(this)) {
      const k = key(this, type, fn, opt);
      if (keys.delete(k)) { mon.listenerTypes[type]--; mon.listenerStacks.delete(k); }
      mon.listeners = keys.size;
    }
    return rem.call(this, type, fn, opt);
  };
  w.addEventListener('unhandledrejection', (e) => mon.rejections.push(String(e.reason?.stack || e.reason)));
  // Låtsasröst: varje uppläsning "pågår" 70 ms per tecken tills cancel() anropas.
  const synth = {
    speaking: false, pending: false, paused: false,
    getVoices: () => [{ lang: 'sv-SE', name: 'Alva', localService: true, default: true, voiceURI: 'alva' }],
    addEventListener() {}, removeEventListener() {}, onvoiceschanged: null,
    speak(u) {
      if (mon.speaking) { mon.speaking.u.onend?.({}); }
      const entry = { text: String(u.text), at: performance.now(), u };
      mon.speech.push({ text: entry.text, at: entry.at });
      mon.speaking = entry;
      synth.speaking = true;
      setTimeout(() => u.onstart?.({}), 5);
      setTimeout(() => { if (mon.speaking === entry) { mon.speaking = null; synth.speaking = false; u.onend?.({}); } }, Math.min(30000, 70 * entry.text.length));
    },
    cancel() { const e = mon.speaking; mon.speaking = null; synth.speaking = false; if (e) e.u.onend?.({}); },
    pause() {}, resume() {},
  };
  Object.defineProperty(w, 'speechSynthesis', { configurable: true, value: synth });
  if (!w.SpeechSynthesisUtterance) w.SpeechSynthesisUtterance = function (t) { this.text = t; };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const m = window.__mon;
    return {
      intervals: [...m.intervals.values()],
      listeners: m.listeners,
      listenerKeys: [...m.listenerStacks.keys()],
      listenerTypes: { ...m.listenerTypes },
      storage: Object.keys(localStorage).reduce((n, k) => n + k.length + (localStorage.getItem(k) || '').length, 0),
      dialogs: [...document.querySelectorAll('dialog[open]')].map((d) => d.className || d.getAttribute('aria-label')),
      speaking: m.speaking ? m.speaking.text.slice(0, 80) : null,
    };
  });
}

async function rafRate(page, ms = 700) {
  const a = await page.evaluate(() => window.__mon.raf);
  await page.waitForTimeout(ms);
  const b = await page.evaluate(() => window.__mon.raf);
  return Math.round(((b - a) * 1000) / ms);
}

async function answerCurrent(page) {
  const q = await page.evaluate(() => {
    const q = window.kidsos.q;
    if (!q) return null;
    return { type: q.type, answer: q.answer, answerOrder: q.answerOrder, items: q.items?.map((i) => ({ id: i.id, bin: i.bin })), word: q.word, target: q.target, step: q.step };
  });
  if (!q) return null;
  const t = { timeout: 3000 };
  switch (q.type) {
    case 'choice':
      await page.evaluate((id) => [...document.querySelectorAll('.choice')].find((b) => b.dataset.id === String(id))?.click(), q.answer);
      break;
    case 'numpad':
      for (const d of String(q.answer)) { await page.locator('.np-key', { hasText: new RegExp(`^${d}$`) }).first().click(t); await page.waitForTimeout(140); }
      await page.locator('.np-key.ok').first().click(t);
      break;
    case 'order':
      for (const id of q.answerOrder) await page.locator('.order-item').nth(q.items.findIndex((i) => i.id === id)).click(t);
      break;
    case 'sort':
      for (const it of q.items) { await page.locator(`.sort-item[data-id="${it.id}"]`).click(t); await page.locator(`.sort-bin[data-bin="${it.bin}"]`).click(t); }
      break;
    case 'build':
      for (const ch of q.word) await page.locator('.build-tile:not(.used)', { hasText: new RegExp(`^${ch}$`) }).first().click(t);
      break;
    case 'tapcount':
      for (let i = 0; i < q.answer; i++) { await page.locator('.drum').click(t); await page.waitForTimeout(170); }
      await page.getByRole('button', { name: 'Klar ✓' }).click(t);
      break;
    case 'tap':
      await page.locator(`[data-hit="${q.answer}"]`).first().click({ force: true, timeout: 3000 });
      break;
    case 'clock': {
      const steps = ((q.target.h % 12) * 60 + q.target.m) / q.step;
      const plus = page.getByRole('button', { name: new RegExp(`^\\+${q.step} min`) });
      for (let i = 0; i < steps; i++) { await plus.click(t); await page.waitForTimeout(110); }
      await page.getByRole('button', { name: 'Klar ✓' }).click(t);
      break;
    }
    default:
      throw new Error(`okänd frågetyp ${q.type}`);
  }
  return q.type;
}

/** Synliga, tryckbara element i det översta lagret (öppen dialog, annars aktivt fönster). */
async function tappables(page) {
  return page.evaluate(() => {
    const dialogs = [...document.querySelectorAll('dialog[open]')].filter((d) => !d.closest('[inert]'));
    const scope = dialogs.at(-1) || document.querySelector('.dwin.active:not(.minimized)') || document.querySelector('.window.open') || document.body;
    const skip = '.win-home, .win-back, .dwin-btn, .sb-who, .dock, .taskbar, .tb-start';
    const els = [...scope.querySelectorAll('button, [role=button], a[href], input, select, canvas, .drum, [data-hit], svg [data-id]')]
      .filter((el) => !el.disabled && !el.closest('[inert],[hidden]') && !el.matches(skip) && !el.closest(skip))
      .filter((el) => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cx = r.left + r.width / 2, cy = r.top + r.height / 2; if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return false; const top = document.elementFromPoint(cx, cy); return top && (top === el || el.contains(top) || top.contains(el)); });
    window.__tapList = els;
    return { count: els.length, inDialog: !!dialogs.length, scope: scope.className };
  });
}

async function randomTap(page) {
  const info = await tappables(page);
  if (!info.count) return info;
  const i = Math.floor(rand() * info.count);
  const desc = await page.evaluate((i) => {
    const el = window.__tapList[i];
    const text = (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 40);
    // Låt inte apan lämna appen via länkar, exportera filer eller välja filer.
    if (el.tagName === 'A' || (el.tagName === 'INPUT' && el.type === 'file')) return { text, skip: true };
    const r = el.getBoundingClientRect();
    return { text, tag: el.tagName, x: r.left + r.width * (0.2 + Math.random() * 0.6), y: r.top + r.height * (0.2 + Math.random() * 0.6), w: r.width, h: r.height };
  }, i);
  info.target = desc.text;
  if (desc.skip) return info;
  if (desc.tag === 'CANVAS' || desc.tag === 'svg' || (desc.w > 200 && desc.h > 150)) {
    // Dra en kort linje (rita, flytta) i stora ytor.
    await page.mouse.move(desc.x, desc.y);
    await page.mouse.down();
    await page.mouse.move(desc.x + (rand() - 0.5) * 80, desc.y + (rand() - 0.5) * 80, { steps: 5 });
    await page.mouse.up();
  } else if (desc.tag === 'INPUT') {
    await page.mouse.click(desc.x, desc.y);
    await page.keyboard.type('ab1').catch(() => {});
  } else await page.mouse.click(desc.x, desc.y);
  return info;
}

async function closeDialogs(page) {
  for (let i = 0; i < 4; i++) {
    const n = await page.evaluate(() => [...document.querySelectorAll('dialog[open]')].filter((d) => !d.classList.contains('limit-screen')).length);
    if (!n) return 0;
    await page.keyboard.press('Escape');
    await page.waitForTimeout(260);
  }
  // Prova knappar som brukar stänga.
  for (const name of [/^Stäng/, /^Avbryt/, /^Klar/, /^Stanna/, /^OK/, /^Fortsätt/, /^Tillbaka/]) {
    const b = page.locator('dialog[open]').last().getByRole('button', { name });
    if (await b.count()) { await b.first().click({ timeout: 1500 }).catch(() => {}); await page.waitForTimeout(260); }
  }
  return page.evaluate(() => [...document.querySelectorAll('dialog[open]')].filter((d) => !d.classList.contains('limit-screen')).length);
}

async function leave(page, layout) {
  await closeDialogs(page);
  if (layout === 'desktop') {
    // Stäng översta fönstret först, som ett barn gör (de andra kan ligga under det).
    for (let i = 0; i < 8; i++) {
      const top = await page.evaluate(() => { const ws = [...document.querySelectorAll('.dwin:not(.closing)')]; ws.sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0)); const w = ws.find((x) => !x.classList.contains('minimized')) || ws[0]; return w ? w.dataset.app : null; });
      if (!top) break;
      const btn = page.locator(`.dwin[data-app="${top}"]:not(.closing) .dwin-btn.close`);
      if (await page.locator(`.dwin[data-app="${top}"].minimized`).count()) await page.locator(`.tb-task[data-app="${top}"]`).click({ timeout: 2000 }).catch(() => {});
      await btn.click({ timeout: 2000 }).catch(() => page.evaluate((a) => document.querySelector(`.dwin[data-app="${a}"] .dwin-btn.close`)?.click(), top));
      await page.waitForTimeout(250);
    }
    await page.evaluate(() => window.kidsos.goHome());
  } else {
    const home = page.locator('.window.open .win-home');
    if (await home.count()) await home.click({ timeout: 2000 }).catch(() => page.evaluate(() => window.kidsos.goHome()));
    else await page.evaluate(() => window.kidsos.goHome());
  }
  await page.waitForTimeout(450);
}

async function runModule(page, layout, app, mod, findings, cfg) {
  const where = `${cfg} ${app.id}/${mod.id}`;
  const errs = (page.__errs = []);
  const before = await snapshot(page);
  const beforeRaf = await rafRate(page, 400);
  await page.evaluate(([a, m]) => { window.kidsos.q = null; window.__mon.rejections.length = 0; window.kidsos.openApp(a, m); }, [app.id, mod.id]);
  await page.waitForTimeout(700);
  let answered = 0;
  const isQuiz = !!mod.gen;
  if (isQuiz) {
    for (let i = 0; i < 3 + Math.floor(rand() * 3); i++) {
      if (await page.locator('.summary').isVisible().catch(() => false)) break;
      if (!(await page.locator('.q-prompt').first().isVisible().catch(() => false))) break;
      try {
        await answerCurrent(page);
        answered++;
        await page.locator('.btn-next').first().click({ timeout: 5000 });
        await page.waitForTimeout(150);
      } catch (e) {
        findings.push({ kind: 'quiz-stuck', where, detail: `fråga ${i + 1}: ${e.message.split('\n')[0]}`, q: await page.evaluate(() => window.kidsos.q && { type: window.kidsos.q.type, prompt: window.kidsos.q.prompt }).catch(() => null) });
        break;
      }
    }
  }
  const end = Date.now() + (isQuiz ? 0 : MONKEY_MS);
  let taps = 0;
  let emptyRuns = 0;
  const trail = [];
  while (Date.now() < end || (isQuiz && taps < QUIZ_TAPS)) {
    let info;
    try { info = await randomTap(page); } catch (e) { info = { count: -1, error: e.message.split('\n')[0] }; }
    taps++;
    if (info.target) trail.push(info.target);
    if (info.count === 0) {
      emptyRuns++;
      if (emptyRuns === 4) {
        const cover = await page.evaluate(() => { const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2); return el ? `${el.tagName}.${el.className}` : null; }).catch(() => null);
        const shot = join(dirname(OUT), `monkey-stuck-${Date.now()}.png`);
        await page.screenshot({ path: shot }).catch(() => {});
        findings.push({ kind: 'stuck', where, detail: `inget går att trycka på (lager: ${info.scope}, dialog: ${info.inDialog}, mitt på skärmen: ${cover})`, trail: trail.slice(-6), shot });
      }
      if (emptyRuns >= 4) break;
    } else emptyRuns = 0;
    const dialogs = await page.evaluate(() => [...document.querySelectorAll('dialog[open]')].filter((d) => !d.closest('[inert]')).length);
    if (dialogs > 2) findings.push({ kind: 'dialog-stack', where, detail: `${dialogs} dialoger öppna samtidigt`, trail: trail.slice(-6) });
    await page.waitForTimeout(120 + Math.floor(rand() * 200));
    if (taps > 400) break;
  }
  const stillOpen = await closeDialogs(page);
  if (stillOpen) findings.push({ kind: 'dialog-stuck', where, detail: `${stillOpen} dialog(er) gick inte att stänga`, dialogs: (await snapshot(page)).dialogs, trail: trail.slice(-6) });
  const speechBefore = await page.evaluate(() => window.__mon.speech.length);
  await leave(page, layout);
  const after = await snapshot(page);
  if (after.speaking) {
    const t0 = await page.evaluate(() => window.__mon.speaking?.at);
    const spokenAfterLeave = await page.evaluate((n) => window.__mon.speech.slice(n).map((s) => s.text.slice(0, 60)), speechBefore);
    findings.push({ kind: 'speech-after-leave', where, detail: `fortsätter läsa: "${after.speaking}"`, startedAfterLeave: spokenAfterLeave, t0 });
  }
  if (after.dialogs.length) findings.push({ kind: 'dialog-after-leave', where, detail: after.dialogs.join(', ') });
  const leakedIntervals = after.intervals.filter((s) => !before.intervals.includes(s) || after.intervals.filter((x) => x === s).length > before.intervals.filter((x) => x === s).length);
  if (after.intervals.length > before.intervals.length) findings.push({ kind: 'interval-leak', where, detail: `${before.intervals.length} → ${after.intervals.length}`, intervals: [...new Set(leakedIntervals)] });
  if (after.listeners > before.listeners + 1) {
    const diff = Object.fromEntries(Object.entries(after.listenerTypes).filter(([k, v]) => v > (before.listenerTypes[k] || 0)).map(([k, v]) => [k, v - (before.listenerTypes[k] || 0)]));
    const added = after.listenerKeys.filter((k) => !before.listenerKeys.includes(k));
    const stacks = await page.evaluate((keys) => keys.map((k) => `${k} @ ${window.__mon.listenerStacks.get(k)}`), added);
    findings.push({ kind: 'listener-leak', where, detail: `${before.listeners} → ${after.listeners}`, diff, stacks, trail: trail.slice(-12) });
  }
  if (after.storage - before.storage > 60000) findings.push({ kind: 'storage-growth', where, detail: `${before.storage} → ${after.storage} tecken` });
  await page.waitForTimeout(2200); // låt räkneverk och övergångar på hemskärmen bli klara
  let afterRaf = await rafRate(page, 700);
  // Troféfirande (konfetti) kan starta strax efter att vyn lämnats; en läcka ger ramar även efter flera sekunder.
  if (afterRaf > beforeRaf + 20) { await page.waitForTimeout(5000); afterRaf = await rafRate(page, 700); }
  if (afterRaf > beforeRaf + 20) findings.push({ kind: 'raf-leak', where, detail: `animationsramar/s ${beforeRaf} → ${afterRaf} efter att vyn lämnats` });
  const rejections = await page.evaluate(() => window.__mon.rejections.slice());
  for (const r of rejections) findings.push({ kind: 'unhandled-rejection', where, detail: r.slice(0, 300) });
  for (const e of errs) findings.push({ kind: e.kind, where, detail: e.text.slice(0, 400), trail: trail.slice(-6) });
  return { answered, taps, storage: after.storage, intervals: after.intervals.length, listeners: after.listeners };
}

async function setup(browser, age, layout) {
  const ctx = await browser.newContext({ ...(layout === 'desktop' ? DESKTOP : TABLET), locale: 'sv-SE' });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await ctx.addInitScript(instrument);
  const page = await ctx.newPage();
  page.__errs = [];
  page.on('pageerror', (e) => page.__errs.push({ kind: 'pageerror', text: String(e.stack || e.message) }));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|net::|Failed to load resource/.test(m.text())) page.__errs.push({ kind: 'console-error', text: m.text() }); });
  page.on('dialog', (d) => d.dismiss().catch(() => {}));
  page.on('framenavigated', (f) => { if (f === page.mainFrame() && !f.url().startsWith(APP_URL)) page.__errs.push({ kind: 'navigated-away', text: f.url() }); });
  ctx.on('page', (p) => { if (p !== page) { page.__errs.push({ kind: 'popup', text: p.url() }); p.close().catch(() => {}); } });
  await page.goto(APP_URL);
  await page.waitForSelector('.lock');
  await page.evaluate(([age, layout]) => {
    const k = window.kidsos.kos;
    const p = k.createProfile({ name: `Apa${age}`, age, wallpaper: 'sky' });
    p.settings.layout = layout;
    p.settings.showAllModules = true;
    k.login(p.id);
    window.kidsos.goHome();
  }, [age, layout]);
  await page.waitForTimeout(layout === 'desktop' ? 1600 : 500);
  return { ctx, page };
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME });
  const findings = [];
  const stats = [];
  const jobs = [];
  for (const age of AGES) for (const layout of LAYOUTS) {
    const mods = [];
    for (const app of APPS) {
      if (ONLY_APPS && !ONLY_APPS.includes(app.id)) continue;
      for (const mod of app.modules) if (!ONLY_MODS || mod.id.includes(ONLY_MODS)) mods.push([app, mod]);
    }
    for (let i = 0; i < mods.length; i += 24) jobs.push({ age, layout, mods: mods.slice(i, i + 24) });
  }
  let done = 0;
  const total = jobs.reduce((n, j) => n + j.mods.length, 0);
  async function worker() {
    while (jobs.length) {
      const job = jobs.shift();
      const cfg = `${job.layout}/${job.age}år`;
      let env;
      try { env = await setup(browser, job.age, job.layout); } catch (e) { findings.push({ kind: 'setup', where: cfg, detail: e.message }); continue; }
      const startStorage = (await snapshot(env.page)).storage;
      for (const [app, mod] of job.mods) {
        if (env.page.isClosed()) {
          findings.push({ kind: 'page-closed', where: `${cfg} ${app.id}/${mod.id}`, detail: 'sidan stängdes (navigering eller krasch) – ny kontext skapas' });
          await env.ctx.close().catch(() => {});
          env = await setup(browser, job.age, job.layout);
        }
        try {
          const s = await runModule(env.page, job.layout, app, mod, findings, cfg);
          stats.push({ cfg, app: app.id, mod: mod.id, ...s });
        } catch (e) {
          findings.push({ kind: 'harness', where: `${cfg} ${app.id}/${mod.id}`, detail: e.message.split('\n')[0] });
          await env.page.evaluate(() => window.kidsos.goHome()).catch(() => {});
        }
        done++;
        if (done % 20 === 0) { console.log(`… ${done}/${total} moduler, ${findings.length} fynd`); writeFileSync(OUT, JSON.stringify({ partial: true, findings, stats }, null, 1)); }
      }
      const endStorage = await snapshot(env.page).then((s) => s.storage).catch(() => NaN);
      stats.push({ cfg, storageGrowth: endStorage - startStorage, modules: job.mods.length });
      await env.ctx.close().catch(() => {});
    }
  }
  await Promise.all(Array.from({ length: WORKERS }, worker));
  await browser.close();
  const byKind = {};
  for (const f of findings) (byKind[f.kind] ||= []).push(f);
  writeFileSync(OUT, JSON.stringify({ when: new Date().toISOString(), MONKEY_MS, AGES, LAYOUTS, findings, stats }, null, 1));
  console.log(`\nMonkey klart: ${done} moduler. Rapport: ${OUT}`);
  for (const [kind, list] of Object.entries(byKind)) {
    console.log(`\n## ${kind} (${list.length})`);
    const uniq = new Map();
    for (const f of list) { const k = f.detail.replace(/\d+/g, '#').slice(0, 160); if (!uniq.has(k)) uniq.set(k, []); uniq.get(k).push(f.where); }
    for (const [detail, wheres] of uniq) console.log(`- ${detail}\n    ${wheres.length}×: ${wheres.slice(0, 5).join('; ')}${wheres.length > 5 ? ' …' : ''}`);
  }
  process.exitCode = findings.length ? 1 : 0;
}

main().catch((e) => { console.error(e); process.exit(2); });
