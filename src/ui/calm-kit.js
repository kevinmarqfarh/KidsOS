// Autismstöd – delade byggstenar: visuell timer (krympande cirkel), rörelsepaus med nedräkning,
// tyst minut, hjälpkort och loggning till förälderns lokala logg. Används av adapted-ui.js,
// adapted-home.js och vyerna i views/feelings.js. Logik: core/adapted.js och core/adapted-log.js.
import { h, clear, onTap } from './dom.js';
import { kos } from './kos.js';
import { breakChoices, countWord, adaptedPrefs, PLAN_SPECIAL } from '../core/adapted.js';
import { updateLog, logEvent, markPlanStep } from '../core/adapted-log.js';
import { dateKey } from '../core/model.js';

/* ---------- Logg och dagens plan ---------- */

export function nowTime(d = new Date()) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Skriver en händelse i förälderns lokala logg (bara när autismstödet är på). */
export function logAdapted(type, data) {
  const p = kos.profile;
  if (!p || !kos.adapted) return;
  updateLog(p.id, (log) => logEvent(log, dateKey(), type, data, nowTime()));
}

/** Bockar av ett steg i dagens plan (app-id eller 'move', 'story', 'calm', 'faces'). */
export function markPlan(stepId) {
  const p = kos.profile;
  if (!p || !kos.adapted || !stepId) return -1;
  const plan = adaptedPrefs(p).plan;
  // Pauser och berättelser räknas också som steget "Känslor & jag" om föräldern lagt in hela appen.
  const app = PLAN_SPECIAL.find((s) => s.id === stepId)?.app;
  const idx = updateLog(p.id, (log) => {
    const i = markPlanStep(log, dateKey(), plan, stepId);
    return i < 0 && app ? markPlanStep(log, dateKey(), plan, app) : i;
  });
  if (idx >= 0) kos.emit('adapted:plan', { stepId, idx });
  return idx;
}

/* ---------- Visuell timer: en skiva som krymper (som en Time Timer) ---------- */

/** Skapar en krympande cirkel. frac = andel kvar (0–1). */
export function timerRing(frac = 1, { size = 56, label = '', warn = false, cls = '' } = {}) {
  const el = h('span.tt-ring', { class: cls, role: 'img', 'aria-label': label || 'Tid kvar', style: { '--tt-size': `${size}px` } }, h('span.tt-disc'), label ? h('b.tt-label', label) : null);
  setRing(el, frac, { warn, label });
  return el;
}

export function setRing(el, frac, { warn = false, label } = {}) {
  if (!el) return;
  const f = Math.max(0, Math.min(1, Number(frac) || 0));
  el.style.setProperty('--tt-frac', String(f));
  el.classList.toggle('warn', !!warn);
  if (label !== undefined) {
    el.setAttribute('aria-label', label || 'Tid kvar');
    const b = el.querySelector('.tt-label');
    if (b) b.textContent = label;
  }
}

/** Kör en nedräkning på `ms` millisekunder och uppdaterar ringen. Returnerar stop(). */
export function runRing(el, ms, { onDone, tickMs = 250 } = {}) {
  const t0 = Date.now();
  const id = setInterval(() => {
    if (!el.isConnected) return clearInterval(id);
    const left = Math.max(0, ms - (Date.now() - t0));
    setRing(el, left / ms, { label: `${Math.ceil(left / 1000)} s` });
    if (left <= 0) {
      clearInterval(id);
      onDone?.();
    }
  }, tickMs);
  setRing(el, 1, { label: `${Math.ceil(ms / 1000)} s` });
  return () => clearInterval(id);
}

/* ---------- Rörelsepaus ---------- */

/**
 * Tre rörelsepauser att välja mellan + "Hoppa över". Barnet väljer själv (självbestämmande).
 * index styr vilka tre som visas (förutsägbar rotation).
 */
export function breakPicker(el, { index = 0, onDone, onSkip, title = 'Rörelsepaus' } = {}) {
  clear(el);
  const choices = breakChoices(index);
  const grid = h(
    'div.mvb-choices',
    { role: 'group', 'aria-label': 'Välj en rörelsepaus' },
    choices.map((b) => onTap(h('button.mvb-choice', { type: 'button', dataset: { brk: b.id } }, h('span.mvb-icon', { 'aria-hidden': 'true' }, b.icon), h('b', b.title), h('small', b.kind === 'calm' ? 'Lugn' : 'Pigg')), () => runBreak(el, b, { onDone, onSkip }))),
  );
  el.append(
    h('div.mvb', h('h2.mvb-title', `🤸 ${title}`), h('p.muted', 'Välj en. Den tar ungefär en halv minut.'), grid, onSkip ? onTap(h('button.btn.btn-ghost.mvb-skip', { type: 'button' }, 'Hoppa över ➜'), () => onSkip()) : null),
  );
  kos.autoSay(`${title}. Välj en: ${choices.map((c) => c.title).join(', ')}.`);
}

/** Själva rörelsen: instruktion → "Nu kör vi" → räkning med prickar → Klart. Barnet startar själv. */
export function runBreak(el, brk, { onDone, onSkip } = {}) {
  clear(el);
  let n = 0;
  let timer = null;
  const dots = h('div.mvb-dots', { 'aria-hidden': 'true' }, Array.from({ length: brk.count }, () => h('span.mvb-dot')));
  const big = h('div.mvb-count', { 'aria-live': 'polite' }, '');
  const start = h('button.btn.btn-primary.btn-xl', { type: 'button' }, '▶ Nu kör vi');
  const done = h('button.btn.btn-primary.btn-xl', { type: 'button', hidden: true }, '✓ Klart');
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const finish = () => {
    stop();
    kos.stopSpeaking();
    logAdapted('break', brk.id);
    markPlan('move');
    onDone?.(brk);
  };
  onTap(start, () => {
    start.hidden = true;
    done.hidden = false;
    kos.stopSpeaking();
    timer = setInterval(() => {
      if (!el.isConnected) return stop();
      n++;
      dots.children[n - 1]?.classList.add('on');
      big.textContent = String(n);
      kos.say(countWord(n));
      if (n >= brk.count) {
        stop();
        big.textContent = 'Bra!';
        kos.say('Bra! Klart.', { interrupt: false });
      }
    }, 1600);
  });
  onTap(done, finish);
  el.append(
    h(
      'div.mvb.mvb-run',
      h('div.mvb-big', { 'aria-hidden': 'true' }, brk.icon),
      h('h2.mvb-title', brk.title),
      h('p.mvb-say', brk.say),
      dots,
      big,
      h('div.mvb-actions', onSkip ? onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Hoppa över'), () => { stop(); kos.stopSpeaking(); onSkip(); }) : null, start, done),
    ),
  );
  kos.say(brk.say);
  return stop;
}

/* ---------- Tyst minut och hjälpkort ---------- */

/** En minut utan krav. Cirkeln krymper; barnet kan sluta när det vill. */
export function quietMinute(el, { onDone, ms = 60000 } = {}) {
  clear(el);
  const ring = timerRing(1, { size: 180, label: '60 s', cls: 'tt-big' });
  const done = onTap(h('button.btn.btn-primary.btn-xl', { type: 'button' }, '✓ Klart'), () => {
    stopRing();
    onDone?.();
  });
  el.append(h('div.mvb.quiet', h('h2.mvb-title', '🤫 Tyst minut'), h('p.muted', 'Inga krav. Sitt, ligg eller blunda. Cirkeln visar hur mycket som är kvar.'), ring, h('div.mvb-actions', done)));
  const stopRing = runRing(ring, ms, { onDone: () => kos.say('Minuten är slut.') });
  logAdapted('pause');
  kos.say('Tyst minut. Inga krav.');
  return stopRing;
}

/** Stort kort att visa för en vuxen ("Jag behöver hjälp"). */
export function helpCard(el, { onDone } = {}) {
  clear(el);
  el.append(
    h(
      'div.help-card',
      { role: 'status' },
      h('div.help-icon', { 'aria-hidden': 'true' }, '🙋'),
      h('p.help-text', 'Jag behöver hjälp.'),
      h('p.muted', 'Visa kortet för en vuxen. Du kan också peka på det som är svårt.'),
      onTap(h('button.btn.btn-ghost.btn-xl', { type: 'button' }, '✓ Klart'), () => onDone?.()),
    ),
  );
  kos.say('Jag behöver hjälp.');
}
