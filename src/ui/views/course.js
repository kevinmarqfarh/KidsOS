// Läs/lyssna → fundera → öva. Lästa lektioner hålls isär från quizresultat.
import { h, clear, onTap } from '../dom.js';
import { AI_LESSONS } from '../../apps/ai.js';
import { CODING_LESSONS } from '../../apps/code.js';
import { hasInSet } from '../../core/model.js';
import { LEVELS } from '../../core/age.js';

export function courseView(el, { kos, app, level }) {
  const lessons = app.id === 'ai' ? AI_LESSONS : CODING_LESSONS;
  const readSet = `courseRead:${app.id}`;
  const list = h('nav.course-list', { 'aria-label': 'Kursens lektioner' });
  const stage = h('section.course-stage', { 'aria-live': 'polite' });
  const progress = h('p.course-progress');
  const wrap = h('div.course', h('div.teach', h('span.teach-icon', app.icon), h('span', 'Börja med en lektion. Lyssna, fundera och prova sedan en övning.')), progress, h('div.course-layout', list, stage));
  el.append(wrap);
  let lesson = null;
  let stepIndex = 0;
  let alive = true;
  const unlocked = item => kos.profile.settings.showAllModules || (item.minLevel ?? 0) <= level;
  const available = lessons.filter(unlocked);
  const openPractice = item => {
    kos.stopSpeaking();
    el.dispatchEvent(new CustomEvent('kos-open', { bubbles: true, detail: { app: app.id, module: item.moduleId } }));
  };

  function renderList() {
    clear(list);
    const read = available.filter(item => hasInSet(kos.profile, readSet, item.id)).length;
    progress.textContent = `${read} av ${available.length} tillgängliga lektioner lästa. Övningarnas resultat visas i appens meny.`;
    lessons.forEach((item, i) => {
      const locked = !unlocked(item);
      const done = hasInSet(kos.profile, readSet, item.id);
      const button = h('button.course-lesson', { type: 'button', disabled: locked, class: item === lesson ? 'on' : '', 'aria-current': item === lesson ? 'step' : null, dataset: { lesson: item.id } }, h('span', locked ? '🔒' : done ? '✓' : String(i + 1)), h('div', h('b', item.title), h('small', locked ? `Från ${LEVELS[item.minLevel].short}` : done ? 'Läst – du kan repetera' : 'Läs eller lyssna')));
      onTap(button, () => { lesson = item; stepIndex = 0; renderList(); renderStep(); stage.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
      list.append(button);
    });
  }

  function readStep() {
    const step = lesson.steps[stepIndex];
    kos.say(`${lesson.title}. ${step.title}. ${step.text}. ${step.example || ''}`);
  }

  function renderStep() {
    clear(stage);
    const step = lesson.steps[stepIndex];
    const finalStep = stepIndex === lesson.steps.length - 1;
    stage.append(
      h('p.course-eyebrow', `Lektion ${lessons.indexOf(lesson) + 1} · Del ${stepIndex + 1} av ${lesson.steps.length}`),
      h('h2', lesson.title),
      h('h3', step.title),
      h('p.course-text', step.text),
      step.example ? h('div.course-example', h('b', 'Prova att tänka så här'), h('p', step.example)) : null,
      onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔊 Lyssna'), readStep),
    );
    if (finalStep) stage.append(h('div.course-takeaway', h('b', 'Det här tar du med dig'), h('p', lesson.takeaway)));
    const previous = onTap(h('button.btn.btn-ghost', { type: 'button', disabled: stepIndex === 0 }, '← Tillbaka'), () => { stepIndex--; renderStep(); });
    const next = onTap(h('button.btn.btn-primary.course-next', { type: 'button' }, finalStep ? '✓ Jag har läst lektionen' : 'Nästa del →'), () => {
      kos.stopSpeaking();
      if (!finalStep) { stepIndex++; renderStep(); return; }
      kos.reward({ app: app.id, set: readSet, item: lesson.id });
      renderList();
      renderFinished();
    });
    stage.append(h('div.row-actions', previous, next));
    kos.autoSay(`${step.title}. ${step.text}. ${step.example || ''}`);
  }

  function renderFinished() {
    clear(stage).append(h('h2', 'Nu är det dags att prova!'), h('p.course-text', lesson.takeaway), h('p.muted', 'Du har läst lektionen. Öva för att se vad du förstår – och lär dig av det som blir fel.'));
    const mod = app.modules.find(item => item.id === lesson.moduleId);
    if (mod && ((mod.minLevel ?? 0) <= level || kos.profile.settings.showAllModules)) stage.append(onTap(h('button.btn.btn-primary.course-practice', { type: 'button' }, `▶ Öva: ${mod.name}`), () => openPractice(lesson)));
    const nextLesson = available[available.indexOf(lesson) + 1];
    if (nextLesson) stage.append(onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Nästa lektion →'), () => { lesson = nextLesson; stepIndex = 0; renderList(); renderStep(); }));
    stage.append(onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Läs igen'), () => { stepIndex = 0; renderStep(); }));
    if (alive) kos.autoSay(`Nu är det dags att prova! ${lesson.takeaway}`);
  }
  lesson = available.find(item => !hasInSet(kos.profile, readSet, item.id)) || available[0];
  renderList();
  if (lesson) renderStep();
  return () => { alive = false; kos.stopSpeaking(); };
}
