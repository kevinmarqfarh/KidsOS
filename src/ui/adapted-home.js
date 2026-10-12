// Autismstöd – hemskärmen och tiden: "Dagens plan" (föräldern väljer ordningen), skärmtidens
// krympande cirkel, förvarning 2 minuter före slutet, lugn avslutningsritual och "Vad gör jag sen?".
// Kopplas in från shell.js med installAdapted(). Logik: core/adapted.js, core/adapted-log.js.
import { h, clear, onTap } from './dom.js';
import { kos } from './kos.js';
import { pic } from './img.js';
import { appById } from '../apps/registry.js';
import {
  adaptedPrefs, PLAN_SPECIAL, afterFor, AFTER_ACTIVITIES, screenTimer, shouldWarnScreen, screenWarnText,
  endingSteps, LIMIT_GRACE_MS,
} from '../core/adapted.js';
import { loadLog, planProgress, currentPlanIndex, markPlanStep, saveLog } from '../core/adapted-log.js';
import { minutesLeftToday, dateKey, bonusToday, addBonusMinutes } from '../core/model.js';
import { timerRing } from './calm-kit.js';

let shell = {};

/** Bild för "Vad gör jag sen?": riktigt foto när det passar, annars emoji. */
export function afterPic(a, { cls = '' } = {}) {
  return a.noPhoto ? `<span class="pic no-photo ${cls}">${a.icon}</span>` : pic(a.icon, { cls });
}

/** Ett steg i planen som visningsdata: { id, icon, label, app, module } eller null om det inte finns. */
export function planStepInfo(id) {
  const sp = PLAN_SPECIAL.find((s) => s.id === id);
  if (sp) return { ...sp };
  const app = appById(id);
  return app ? { id, icon: app.icon, label: app.name, app: app.id, module: null } : null;
}

function openStep(step) {
  if (!step) return;
  kos.sfx('pop');
  kos.emit('adapted:open', { app: step.app, module: step.module });
}

/** Knapp till nästa ogjorda steg i dagens plan (visas efter ett pass). Null om planen är klar. */
export function planNextButton() {
  const p = kos.profile;
  if (!p || !kos.adapted) return null;
  const plan = adaptedPrefs(p).plan;
  const idx = currentPlanIndex(loadLog(p.id), dateKey(), plan);
  const step = idx >= 0 ? planStepInfo(plan[idx]) : null;
  if (!step) {
    const a = afterFor(adaptedPrefs(p));
    return plan.length ? h('p.ad-plan-next.done', { html: `✓ Dagens plan är klar. Sen: ${afterPic(a, { cls: 'sm' })} ${a.label.toLowerCase()}.` }) : null;
  }
  return onTap(h('button.btn.btn-primary.ad-plan-next', { type: 'button', dataset: { step: step.id } }, `Nästa i planen: ${step.icon} ${step.label} ➜`), () => openStep(step));
}

/* ---------------- Skärmtid ---------------- */

function screenState(p) {
  const left = minutesLeftToday(p);
  const lim = Number(p.settings?.dailyLimitMin) || 0;
  return screenTimer(left, lim + bonusToday(p, dateKey()));
}

/** Liten krympande cirkel i statusraden (ersätter "⏳ 12 min"). Null om ingen gräns finns. */
export function adaptedTimeChip(p) {
  const st = screenState(p);
  if (st.unlimited) return null;
  const ring = timerRing(st.frac, { size: 22, warn: st.warn, label: '' });
  return h('span.sb-chip.sb-timeleft.ad-time', { title: 'Skärmtid kvar i dag', class: st.warn ? 'warn' : '', 'aria-label': `Skärmtid: ${st.label}` }, ring, h('span', st.over ? 'Slut' : `${st.mins} min`));
}

/* ---------------- Dagens plan på hemskärmen ---------------- */

/** "Dagens plan": stegen i förälderns ordning, bock på gjorda steg, "Nu" på nästa, sist "Sen" (borta från skärmen). */
export function adaptedHomeSection() {
  const p = kos.profile;
  if (!p || !kos.adapted) return null;
  const ap = adaptedPrefs(p);
  const log = loadLog(p.id);
  const day = dateKey();
  const steps = ap.plan.map((id) => planStepInfo(id));
  const prog = planProgress(log, day, ap.plan);
  const now = prog.findIndex((d, i) => !d && steps[i]);
  const after = afterFor(ap);
  const items = ap.plan.map((id, i) => {
    const s = steps[i];
    if (!s) return null;
    const state = prog[i] ? 'done' : i === now ? 'now' : 'later';
    const b = onTap(
      h('button.dp-step', { type: 'button', class: state, dataset: { step: id }, 'aria-current': state === 'now' ? 'step' : null, 'aria-label': `${s.label}${state === 'done' ? ', klart' : state === 'now' ? ', nu' : ''}` },
        h('span.dp-icon', { 'aria-hidden': 'true' }, s.icon),
        h('span.dp-label', s.label),
        h('span.dp-state', state === 'done' ? '✓' : state === 'now' ? 'Nu' : String(i + 1))),
      () => openStep(s),
    );
    return b;
  });
  const sen = h('div.dp-step.dp-after', { 'aria-label': `Sen: ${after.label}` }, h('span.dp-icon', { html: afterPic(after, { cls: 'sm' }) }), h('span.dp-label', after.label), h('span.dp-state', 'Sen'));
  const nowStep = now >= 0 ? steps[now] : null;
  // Självkontroll: barnet kan själv bocka av steget som är "nu" (t.ex. efter att ha ritat).
  const check = nowStep ? onTap(h('button.btn.btn-ghost.btn-sm.dp-check', { type: 'button' }, `✓ ${nowStep.label} är klart`), () => {
    const l = loadLog(p.id);
    markPlanStep(l, day, ap.plan, ap.plan[now]);
    saveLog(p.id, l);
    kos.emit('adapted:plan', {});
  }) : null;
  const st = screenState(p);
  const timer = st.unlimited ? null : h('div.dp-timer', timerRing(st.frac, { size: 64, warn: st.warn, label: st.over ? 'Slut' : `${st.mins}` }), h('small', st.over ? 'Skärmtiden är slut' : 'min skärmtid kvar'));
  const plan = h(
    'section.dp',
    { 'aria-label': 'Dagens plan' },
    h('div.dp-head', h('h2', '🗓️ Dagens plan'), nowStep ? h('span.dp-now', `Nu: ${nowStep.icon} ${nowStep.label}`) : h('span.dp-now.done', 'Allt klart! 🎉')),
    h('div.dp-row', h('ol.dp-steps', items.filter(Boolean).map((b) => h('li', b)), h('li', sen)), timer),
    check,
  );
  return plan;
}

/* ---------------- Förvarning och avslutning ---------------- */

const warned = new Set();
let pending = null;

function showWarnBanner(p) {
  const ap = adaptedPrefs(p);
  const t = screenWarnText(ap);
  const st = screenState(p);
  const a = afterFor(ap);
  document.querySelector('.ad-warn-banner')?.remove();
  const ring = timerRing(st.frac, { size: 48, warn: true, label: '2' });
  const ok = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'OK');
  const el = h('div.ad-warn-banner', { role: 'status' }, ring, h('div.ad-warn-text', h('b', t.title), h('span', { html: `Sen är skärmtiden slut för i dag. Sen: ${afterPic(a, { cls: 'sm' })} ${a.label.toLowerCase()}.` })), ok);
  onTap(ok, () => el.remove());
  (kos.overlayRoot || document.body).appendChild(el);
  kos.say(t.say);
  setTimeout(() => el.remove(), 12000);
}

/** Är barnet mitt i ett pass? Då väntar avslutningen på en naturlig paus (passet tar slut). */
function midPass() {
  return !!document.querySelector('.quiz.adapted') && !document.querySelector('.quiz.adapted .ad-summary');
}

/**
 * Dagens skärmtid är slut (anropas av shell.js i stället för den vanliga gränsskärmen).
 * Mitt i ett pass: "Gör klart passet" och vänta (högst LIMIT_GRACE_MS). Annars: avslutningsritualen.
 */
export function adaptedLimit() {
  if (document.querySelector('.ad-ending')) return;
  if (midPass()) {
    if (!pending) {
      pending = { since: Date.now() };
      document.querySelector('.ad-warn-banner')?.remove();
      const el = h('div.ad-warn-banner.finish', { role: 'status' }, timerRing(0, { size: 48, warn: true }), h('div.ad-warn-text', h('b', 'Skärmtiden är slut'), h('span', 'Gör klart passet. Sen avslutar vi.')));
      (kos.overlayRoot || document.body).appendChild(el);
      kos.say('Skärmtiden är slut. Gör klart passet. Sen avslutar vi.');
      return;
    }
    if (Date.now() - pending.since < LIMIT_GRACE_MS) return;
  }
  showEnding();
}

/** Lugn avslutningsritual: samma steg varje gång, barnet trycker själv på "Hej då". */
export function showEnding() {
  pending = null;
  document.querySelector('.ad-warn-banner')?.remove();
  if (document.querySelector('.ad-ending')) return;
  const p = kos.profile;
  if (!p) return;
  shell.closeWindow?.(true);
  kos.paused = true;
  kos.stopSpeaking();
  let ap = adaptedPrefs(p);
  const list = h('ol.ae-steps');
  const nextSlot = h('div.ae-next');
  const actions = h('div.ae-actions');
  const el = h('div.limit-screen.ad-ending', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Skärmtiden är slut' }, h('div.ae-card', h('h1.ae-title', `Bra jobbat i dag, ${p.name}!`), list, nextSlot, actions));
  const steps = endingSteps(ap);
  let i = 0;
  const renderSteps = () => {
    clear(list).append(...steps.map((s, k) => h('li.ae-step', { class: k < i ? 'done' : k === i ? 'now' : '' }, h('span.ae-icon', { html: s.id === 'next' ? afterPic(afterFor(ap), { cls: 'sm' }) : s.icon }), h('span', s.title))));
  };
  const showNext = () => {
    const a = afterFor(ap);
    clear(nextSlot).append(h('div.ae-next-pic', { html: afterPic(a) }), h('p.ae-next-label', `Sen: ${a.label}`), onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'Välj något annat'), chooseOther));
    clear(actions).append(
      onTap(h('button.btn.btn-primary.btn-xl.ae-bye', { type: 'button' }, '👋 Hej då, skärmen'), () => {
        el.remove();
        kos.paused = false;
        kos.logout();
        shell.showLock?.();
      }),
      onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔒 Vuxen: +15 min'), () => shell.parentGate?.(() => {
        addBonusMinutes(p, 15);
        kos.saveNow();
        el.remove();
        kos.paused = false;
        shell.goHome?.();
      })),
    );
  };
  const chooseOther = () => {
    clear(nextSlot).append(
      h('p.ae-next-label', 'Vad vill du göra sen?'),
      h('div.ae-choices', AFTER_ACTIVITIES.map((a) => onTap(h('button.ae-choice', { type: 'button', class: a.id === ap.after ? 'on' : '' }, h('span', { html: afterPic(a, { cls: 'sm' }) }), h('small', a.label)), () => {
        ap = { ...ap, after: a.id };
        kos.say(`Sen: ${a.label.toLowerCase()}.`);
        steps[steps.length - 1] = endingSteps(ap)[steps.length - 1];
        renderSteps();
        showNext();
      }))),
    );
  };
  const advance = async () => {
    renderSteps();
    for (; i < steps.length; i++) {
      renderSteps();
      if (!el.isConnected) return;
      await Promise.race([kos.say(steps[i].say), new Promise((r) => setTimeout(r, 4000))]);
      await new Promise((r) => setTimeout(r, 700));
    }
    renderSteps();
    showNext();
  };
  (kos.overlayRoot || document.body).appendChild(el);
  advance();
}

/**
 * Kopplas in en gång från shell.js. `api` = { goHome, openApp, closeWindow, showLock, parentGate }.
 * Lyssnar på tick (förvarning), slutet av ett pass (väntande avslutning) och "öppna steg i planen".
 */
export function installAdapted(api = {}) {
  shell = api;
  const refreshPlan = () => {
    const dp = document.querySelector('.dp');
    const fresh = dp && adaptedHomeSection();
    if (fresh) dp.replaceWith(fresh);
  };
  kos.on('adapted:plan', refreshPlan);
  kos.on('tick', () => {
    const p = kos.profile;
    if (!p || !kos.adapted) return;
    refreshPlan();
    const key = `${p.id}:${dateKey()}`;
    const left = minutesLeftToday(p);
    if (shouldWarnScreen(left, adaptedPrefs(p), warned.has(key))) {
      warned.add(key);
      showWarnBanner(p);
    }
  });
  kos.on('adapted:passdone', () => {
    if (pending) setTimeout(showEnding, 2500); // låt "Klart!" synas en kort stund först
  });
  kos.on('adapted:open', ({ app, module } = {}) => {
    if (app) shell.openApp?.(app, module || null);
  });
}
