// Autismstöd – förälderns del i Inställningar: dagens plan (ordning), "Vad gör jag sen?",
// tema/rörelsepauser/förvarning och en enkel logg över mående och pauser per dag (bara lokalt).
// Anropas från settings.js (adaptedSection). Logik: core/adapted.js och core/adapted-log.js.
import { h, onTap } from './dom.js';
import { APPS } from '../apps/registry.js';
import { PLAN_SPECIAL, PLAN_MAX, AFTER_ACTIVITIES, FEELINGS, movePlanStep, normalizePlan } from '../core/adapted.js';
import { loadLog, summarizeLog, logPatterns, clearLog } from '../core/adapted-log.js';
import { dateKey } from '../core/model.js';
import { planStepInfo } from './adapted-home.js';

/**
 * Rader till föräldrapanelen. `ui` = { ap, save, sub, seg, toggle, render } från settings.js.
 */
export function adaptedParentRows(kp, { ap, save, sub, seg, toggle, render }) {
  const plan = normalizePlan(ap.plan);
  const steps = plan.map((id, i) => {
    const s = planStepInfo(id);
    const label = s ? `${s.icon} ${s.label}` : `❔ ${id}`;
    return h(
      'li.ap-plan-step',
      h('span.ap-plan-n', String(i + 1)),
      h('span.ap-plan-label', label),
      onTap(h('button.icon-btn', { type: 'button', 'aria-label': `Flytta ${s?.label || id} upp`, disabled: i === 0 }, '↑'), () => save({ plan: movePlanStep(plan, i, -1) })),
      onTap(h('button.icon-btn', { type: 'button', 'aria-label': `Flytta ${s?.label || id} ner`, disabled: i === plan.length - 1 }, '↓'), () => save({ plan: movePlanStep(plan, i, 1) })),
      onTap(h('button.icon-btn', { type: 'button', 'aria-label': `Ta bort ${s?.label || id}` }, '✕'), () => save({ plan: plan.filter((_, k) => k !== i) })),
    );
  });
  const hidden = new Set(kp.settings.hiddenApps || []);
  const addable = [
    ...APPS.filter((a) => !hidden.has(a.id)).map((a) => [a.id, `${a.icon} ${a.name}`]),
    ...PLAN_SPECIAL.map((s) => [s.id, `${s.icon} ${s.label}`]),
  ];
  const addRow = plan.length < PLAN_MAX
    ? h('div.ap-plan-add', h('small.muted', 'Lägg till:'), h('div.ap-plan-chips', addable.map(([id, label]) => onTap(h('button.pick.ap-chip', { type: 'button' }, label), () => save({ plan: normalizePlan([...plan, id]) })))))
    : h('small.muted', `Planen har ${PLAN_MAX} steg (max).`);

  // Loggen: senaste 7 dagarna.
  const log = loadLog(kp.id);
  const rows = summarizeLog(log, dateKey(), 7, kp.days || {});
  const icon = (id) => FEELINGS.find((f) => f.id === id)?.icon || '';
  const table = h(
    'table.ap-log',
    h('thead', h('tr', h('th', 'Dag'), h('th', 'Mående (före pass)'), h('th', 'Lugna pauser'), h('th', 'Rörelse­pauser'), h('th', 'Pass'), h('th', 'Skärm (min)'))),
    h('tbody', rows.map((r) => h('tr', h('td', `${r.weekday} ${r.day.slice(5)}`), h('td.ap-moods', r.moods.length ? r.moods.map(icon).join(' ') : '–'), h('td', String(r.pauses)), h('td', String(r.breaks)), h('td', String(r.passes)), h('td', String(r.minutes))))),
  );
  return [
    sub('Dagens plan (visas på hemskärmen)'),
    h('p.muted.adapted-note', 'Du väljer ordningen. Barnet ser planen som bilder med ”Nu” och bockar för det som är gjort. Sist visas vad som händer borta från skärmen.'),
    h('ol.ap-plan', steps.length ? steps : h('li.muted', 'Planen är tom. Lägg till steg nedan.')),
    addRow,
    h('div.set-row', h('span', 'Sen (borta från skärmen)'), seg(AFTER_ACTIVITIES.map((a) => [a.id, `${a.icon} ${a.label}`]), ap.after, (v) => save({ after: v }))),
    sub('Fokus och övergångar'),
    h('div.set-row', h('span', 'Intresset som tema i uppgifterna (t.ex. räkna raketer)'), toggle(ap.themeTasks, (v) => save({ themeTasks: v }))),
    h('div.set-row', h('span', 'Erbjud rörelsepaus efter passet'), toggle(ap.breaks, (v) => save({ breaks: v }))),
    h('div.set-row', h('span', 'Förvarning 2 minuter före skärmtidens slut'), toggle(ap.screenWarn, (v) => save({ screenWarn: v }))),
    h('p.muted.adapted-note', 'När skärmtiden tar slut mitt i ett pass får barnet göra klart passet (högst 3 minuter). Sedan kommer en lugn avslutning med samma steg varje gång. Skärmtiden ställs in under Tid.'),
    sub('Mående och pauser – senaste 7 dagarna'),
    h('div.ap-log-wrap', table),
    h('ul.ap-patterns', logPatterns(rows).map((t) => h('li', t))),
    h('p.muted.adapted-note', 'Loggen sparas bara på den här enheten och visas inte för barnet. Den är ett underlag för samtal med barnet, skolan eller habiliteringen – ingen bedömning.'),
    h('div.set-row', h('span', 'Rensa loggen'), onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🗑️ Rensa'), () => {
      if (typeof confirm === 'function' && !confirm('Rensa loggen för den här profilen?')) return;
      clearLog(kp.id);
      render();
    })),
  ];
}

