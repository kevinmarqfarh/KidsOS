import { questionSession, variedQuestion } from '../core/questions.js';
import { learningPlayReward } from './play-rewards.js';
import { photosForQuestion } from '../apps/question-photos.js';
import { learningPhoto } from './learning-photo.js';
import { hasPhoto } from './img.js';
// Generell frågemotor som kör en runda med frågor från en generator.
import { h, clear, onTap, wait, openDialog } from './dom.js';
import { kos } from './kos.js';
import { createRng } from '../core/rng.js';
import { roundLength, clampLevel } from '../core/age.js';
import { clockSvg, timeToSwedish, digitalTime } from './visuals.js';
import { moduleStat, appStat, ADAPT_UP_AFTER } from '../core/model.js';
import { LEVELS, MAX_LEVEL } from '../core/age.js';
import { isAdapted, adaptedPrefs, adaptQuestion, sessionLength, errorlessNext, praiseFor, interestFor, remainingCue, softRetryText } from '../core/adapted.js';
import { adaptedStrip, adaptedFinish, adaptedIntro, adaptedCheckin, setStripStep, setStripLeft } from './adapted-ui.js';
import { progressRing, sparkles, shimmer, ripple, blurFade, wordReveal, speakAlong, levelProgress, numberTicker } from './fx.js';

const MAX_TRIES = { choice: 2, numpad: 3, order: 2, build: 3, tapcount: 3, tap: 3, clock: 3 };

export function effectiveLevel(app, mod) {
  const lvl = kos.level(app.id);
  return clampLevel(Math.min(mod.maxLevel ?? 4, Math.max(mod.minLevel ?? 0, lvl)));
}

export function runQuiz(el, { app, module: mod, onExit, seed = Date.now(), count }) {
  const p = kos.profile;
  // Anpassat läge (core/adapted.js): korta pass, färre alternativ, felfri inlärning, först–sen-remsa.
  const adapted = isAdapted(p);
  const ap = adaptedPrefs(p);
  let total = count || sessionLength(p, p?.settings.roundLength || roundLength(p?.age ?? 7));
  const steadyLevel = p?.settings.steadyRounds ? effectiveLevel(app, mod) : null;
  const rng = createRng(seed);
  let index = 0;
  let correctFirst = 0;
  let alive = true;
  let replayCleanup = null;
  let pauseDialog = null;
  let closePauseDialog = null;
  let quizPaused = false;
  let narrationEpoch = 0;
  let toggleHelp = () => {};
  const session = questionSession(p?.id, app.id, mod.id);
  const ctx = session.ctx;
  ctx.found = p?.sets?.species || {};
  const roundSeen = new Set();

  const dots = h('div.q-dots', Array.from({ length: total }, () => h('span.q-dot')));
  const stage = h('div.q-stage');
  // fx: rundans framsteg som ring (Animated Circular Progress, Magic UI)
  const ring = progressRing({ value: 0, max: total, size: 46, stroke: 6, center: (v, m) => `${v}/${m}`, ariaLabel: (v, m) => `Fråga ${v} av ${m} klar` });
  const progress = h('p.q-status', { 'aria-live': 'polite' });
  const pauseButton = onTap(h('button.btn.btn-ghost.quiz-pause', { type: 'button' }, 'Paus'), pause);
  const helpButton = onTap(h('button.btn.btn-ghost.quiz-help', { type: 'button' }, 'Hjälp'), () => toggleHelp());
  const wrap = h('div.quiz', { style: { '--app': app.color } }, h('div.q-toolbar', h('div.q-progress', ring.el, dots), progress, h('div.q-support-actions', helpButton, pauseButton)), stage);
  // Autismstöd: visuellt schema, polletter och "kvar"-klocka överst (adapted-ui.js).
  const strip = adapted ? adaptedStrip({ dots, total, prefs: ap, host: wrap }) : null;
  if (adapted) {
    wrap.classList.add('adapted');
    wrap.prepend(strip);
  }
  clear(el).appendChild(wrap);

  function resume() {
    if (!quizPaused) return;
    quizPaused = false;
    kos.paused = false;
    kos.applySettings();
    closePauseDialog?.();
    closePauseDialog = null;
    pauseDialog = null;
    if (alive) pauseButton.focus({ preventScroll: true });
  }

  function pause() {
    if (!alive || quizPaused) return;
    quizPaused = true;
    narrationEpoch++;
    kos.paused = true;
    kos.stopSpeaking();
    kos.applySettings();
    pauseDialog = h('dialog.quiz-pause-dialog', { 'aria-labelledby': 'quiz-pause-title' },
      h('h2#quiz-pause-title', 'Paus'),
      h('p', 'Din uppgift finns kvar. Fortsätt när du vill.'),
      onTap(h('button.btn.btn-primary', { type: 'button' }, 'Fortsätt'), resume),
      h('p.muted', 'Det du redan tjänat finns kvar. Om du avslutar börjar rundan om nästa gång.'),
      onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Avsluta rundan'), () => {
        alive = false;
        resume();
        kos.saveNow();
        onExit?.();
      }));
    pauseDialog.addEventListener('cancel', event => { event.preventDefault(); resume(); });
    closePauseDialog = openDialog(pauseDialog, kos.overlayRoot || document.body);
  }

  function next(restorePosition = false) {
    if (!alive) return;
    if (restorePosition) (el.closest('.win-content, .dwin-content') || el).scrollTop = 0;
    if (index >= total) return finish();
    const level = steadyLevel ?? effectiveLevel(app, mod);
    progress.textContent = `Nu: fråga ${index + 1} av ${total} · Sedan: ${index + 1 === total ? 'klar' : 'nästa fråga'}`;
    let q;
    try {
      q = variedQuestion(() => mod.gen(level, rng, ctx), session, roundSeen);
    } catch (e) {
      console.error(e);
      q = null;
    }
    if (!q) {
      // En begränsad bank ger en kortare fullföljd runda i stället för dubbletter.
      if (index > 0) { total = index; return finish(); }
      clear(stage).append(h('p', 'Det finns inga fler frågor för den här nivån just nu.'), onTap(h('button.btn.btn-ghost', {type:'button'}, 'Tillbaka'), () => onExit?.()));
      return;
    }
    q.level = level;
    if (adapted) {
      q = adaptQuestion(q, ap);
      setStripStep(strip, 'tasks');
      setStripLeft(strip, index, total, ap);
    }
    if (window.kidsos) window.kidsos.q = q; // testkrok: aktuell fråga
    renderQuestion(q, 0, restorePosition);
  }

  /** redo > 0: anpassat läge gör om frågan efter ett fel (felfri inlärning). */
  function renderQuestion(q, redo = 0, restorePosition = false) {
    clear(stage);
    stage.classList.remove('done');
    let tries = redo;
    let resolved = false;
    const promptText = h('div.q-prompt-text', q.prompt);
    const speakBtn = h('button.icon-btn.q-speak', { 'aria-label': 'Läs upp frågan', type: 'button' }, '🔊');
    // fx: när uppläst text = frågetexten markeras varje ord medan det läses (läsinlärning).
    const along = typeof q.prompt === 'string' && (!q.say || q.say === q.prompt) && /\s/.test(q.prompt.trim());
    if (along) wordReveal(promptText, q.prompt);
    const sayAlong = () => speakAlong(promptText, (t, o) => kos.read(t, o));
    onTap(speakBtn, () => (along ? sayAlong() : kos.read(q.say || q.prompt)));
    const prompt = h('div.q-prompt', { tabindex: '-1', role: 'group', 'aria-label': q.prompt }, speakBtn, promptText);
    const visual = q.visual ? h('div.q-visual', { html: q.visual }) : null;
    const answers = h('div.q-answers');
    const feedback = h('div.q-feedback', { 'aria-live': 'polite' });
    const help = h('div.q-help-panel', { hidden: true, role: 'status' },
      h('p', q.hint || 'Du kan be en vuxen att visa hur uppgiften fungerar.'),
      onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'Läs hjälpen'), () => kos.read(q.hint || 'Be en vuxen att visa hur uppgiften fungerar.')));
    toggleHelp = () => {
      help.hidden = !help.hidden;
      helpButton.setAttribute('aria-expanded', String(!help.hidden));
    };
    helpButton.setAttribute('aria-expanded', 'false');
    const photos = adapted && ap.themeTasks ? [] : photosForQuestion(app.id, mod.id, q.prompt).filter(item=>hasPhoto(item.key));
    const photoSupport = photos.length ? h('div.question-photo-support',
      h('p.muted', 'Fotot är ett exempel. Använd informationen i frågan när du svarar.'),
      h('div.question-photo-grid', photos.map(item=>learningPhoto(item,{compact:true})))) : null;
    const body = h('div.q-body', { class: q.visual || photoSupport ? 'has-visual' : 'no-visual' }, h('div.q-top', prompt, visual, photoSupport), h('div.q-bottom', answers, feedback));
    stage.append(help, blurFade(body));

    // Läs upp frågan (och textalternativ) för de som inte läser själva än.
    const optionWords = q.type === 'choice' && q.options && !q.noSpeakVisual && q.options.every((o) => o.say !== '' && /[a-zåäö]{3,}/i.test(o.say ?? o.label ?? ''));
    // Anpassat läge: första frågan inleds med först–sen ("Först 5 uppgifter. Sen bubblor.").
    // Förvarning före slutet: "Två uppgifter kvar." / "Sista uppgiften! Sen bubblor."
    const cue = adapted && !redo ? remainingCue(index, total, ap) : null;
    const intro = adapted && index === 0 && !redo ? kos.autoSay(adaptedIntro(total, ap)) : cue ? kos.autoSay(cue.say) : Promise.resolve();
    const questionEpoch = narrationEpoch;
    intro.then(() => (alive && !quizPaused && !resolved ? (along && kos.shouldAutoSpeak() ? sayAlong() : kos.autoSay(q.say || q.prompt)) : null)).then(() => {
      if (alive && !quizPaused && questionEpoch === narrationEpoch && !resolved && optionWords && kos.shouldAutoSpeak()) {
        const words = q.options.map((o) => o.say ?? o.label);
        kos.autoSay(`${words.slice(0, -1).join(', ')} eller ${words[words.length - 1]}?`, { interrupt: false });
      }
    });

    const api = {
      correct() {
        if (resolved) return;
        resolved = true;
        const first = tries === 0;
        if (first) correctFirst++;
        dots.children[index]?.classList.add(first ? 'ok' : 'meh');
        kos.sfx('correct');
        kos.answer(app.id, first);
        if (first) kos.flyStar(1);
        if (!adapted) sparkles(stage.querySelector('.right, .hit-right') || answers, { count: first ? 16 : 8 });
        if (q.collect) {
          const r = kos.reward({ set: q.collect.set, item: q.collect.item, silent: true });
          if (r.isNew && q.collect.label) kos.toast(q.collect.label, { icon: '🃏' });
        }
        showResult(true, first);
      },
      wrong(customHint) {
        if (resolved) return;
        if (adapted && ap.errorMode === 'errorless') return errorless();
        tries++;
        kos.sfx('wrong');
        kos.retry();
        const max = MAX_TRIES[q.type] ?? 2;
        if (tries >= max) {
          resolved = true;
          dots.children[index]?.classList.add('meh');
          kos.answer(app.id, false);
          api.reveal?.();
          showResult(false, false);
          return;
        }
        if (adapted) {
          // Autismstöd: mjukt och lugnt – inget "fel"-ljud, inget "Nästan!", bara en uppmaning och ev. ledtråd.
          const soft = softRetryText(customHint || q.hint);
          clear(feedback).append(h('div.fb.fb-try.ad-soft', h('span.fb-icon', '🤔'), h('div', h('b', `${soft.title} `), soft.text)));
          feedback.classList.add('show');
          kos.say(soft.say);
          return;
        }
        const hint = customHint || q.hint || 'Försök igen!';
        clear(feedback).append(h('div.fb.fb-try', h('span.fb-icon', '💡'), h('div', h('b', 'Nästan! '), hint)));
        feedback.classList.add('show');
        kos.say(`Nästan! ${hint}`);
      },
      get tries() {
        return tries;
      },
      /** Räknar ett misslyckat försök utan att avsluta frågan (används av sortering). */
      markTry() {
        tries++;
      },
    };

    /** Felfri inlärning: inget "fel", bara "titta – det här är rätt" och gör om (en gång). */
    function errorless() {
      tries++;
      kos.retry();
      resolved = true;
      api.reveal?.();
      if (errorlessNext(redo) === 'reveal') {
        dots.children[index]?.classList.add('meh');
        kos.answer(app.id, false);
        showResult(false, false);
        return;
      }
      const again = h('button.btn.btn-primary.btn-next', { type: 'button' }, 'Gör igen ➜');
      onTap(again, () => {
        kos.stopSpeaking();
        renderQuestion(q, redo + 1, true);
      });
      clear(feedback).append(h('div.fb.fb-model', h('span.fb-icon', '👉'), h('div.fb-text', h('b', 'Titta! '), 'Det här är rätt. Nu gör vi den igen.'), again));
      feedback.classList.add('show');
      stage.classList.add('done', 'modeling');
      kos.say('Titta! Det här är rätt. Nu gör vi den igen.');
      setTimeout(() => again.focus({ preventScroll: true }), 50);
    }

    function showResult(ok, first) {
      if (adapted) return showAdaptedResult(ok);
      const nextBtn = shimmer(h('button.btn.btn-primary.btn-next', { type: 'button' }, index + 1 >= total ? 'Klar! 🎉' : 'Nästa ➜'));
      ring.update(index + 1, total);
      onTap(nextBtn, () => {
        kos.stopSpeaking();
        index++;
        next(true);
      });
      const title = ok ? (first ? ['Rätt!', '⭐'] : ['Bra kämpat!', '👍']) : ['Så här är det:', '🧠'];
      clear(feedback).append(
        h('div.fb', { class: ok ? 'fb-ok' : 'fb-learn' }, h('span.fb-icon', title[1]), h('div.fb-text', h('b', title[0] + ' '), q.explain || ''), nextBtn),
      );
      feedback.classList.add('show');
      stage.classList.add('done');
      if (q.explain) kos.autoSay(`${title[0]} ${q.explain}`);
      else kos.autoSay(title[0]);
      setTimeout(() => { if (alive && !quizPaused && nextBtn.isConnected) nextBtn.focus({ preventScroll: true }); }, 50);
    }

    /** Anpassat läge: kort, konkret och alltid positivt. Barnet trycker själv vidare (ingen tidspress). */
    function showAdaptedResult(ok) {
      ring.update(index + 1, total);
      setStripLeft(strip, index + 1, total, ap); // klockan krymper direkt när uppgiften är gjord
      const last = index + 1 >= total;
      const nextBtn = h('button.btn.btn-primary.btn-next', { type: 'button' }, last ? 'Klart! 🎉' : 'Nästa ➜');
      onTap(nextBtn, () => {
        kos.stopSpeaking();
        index++;
        next(true);
      });
      const word = ok ? praiseFor(index, ap) : 'Nu vet du!';
      const icon = ok ? interestFor(ap).icon : '👍';
      clear(feedback).append(h('div.fb', { class: ok ? 'fb-ok' : 'fb-learn' }, h('span.fb-icon', icon), h('div.fb-text', h('b', `${word} `), q.explain ? h('small.ad-explain', q.explain) : null), nextBtn));
      feedback.classList.add('show');
      stage.classList.add('done');
      kos.autoSay(word);
      setTimeout(() => nextBtn.focus({ preventScroll: true }), 50);
    }

    const renderers = { choice, numpad, order, sort, build, tapcount, tap, clock };
    (renderers[q.type] || choice)(q, answers, api, visual, stage);
    if (restorePosition) {
      const scroller = el.closest('.win-content, .dwin-content') || el;
      scroller.scrollTop = 0;
      prompt.focus({ preventScroll: true });
    }
    // Felfri inlärning: vid omgörningen pekar en mjuk markering ut rätt svar (prompt som sedan tonas bort).
    if (adapted && redo) {
      answers.querySelector(`.choice[data-id="${CSS.escape(String(q.answer))}"]`)?.classList.add('ad-prompt');
      visual?.querySelector(`[data-hit="${CSS.escape(String(q.answer))}"]`)?.classList.add('ad-prompt');
    }
  }

  async function finish() {
    alive = false;
    pauseButton.hidden = true;
    helpButton.hidden = true;
    progress.textContent = `Klar: ${total} frågor`;
    kos.stopSpeaking();
    const res = kos.roundDone(app.id, mod.id, correctFirst, total);
    if (adapted) {
      // Tydlig avslutning + utlovad belöning. "Samma igen" ger exakt samma uppgifter (samma frö).
      return adaptedFinish({ stage, res, total, prefs: ap, onExit, strip, app: app.id, again: () => runQuiz(el, { app, module: mod, onExit, seed, count }), fresh: () => runQuiz(el, { app, module: mod, onExit }) });
    }
    const best = moduleStat(kos.profile, app.id, mod.id).best;
    clear(stage);
    const starsRow = h('div.sum-stars', [1, 2, 3].map((i) => h('span.sum-star', { class: i <= res.rating ? 'on' : '', style: { '--d': `${i * 0.18}s` } }, '★')));
    const msgs = ['Bra jobbat!', 'Superbra!', 'Fantastiskt – allt rätt!'];
    // fx: två ringar – rundans resultat och hur nära nästa nivå barnet är (synliga delmål).
    const score = progressRing({ value: correctFirst, max: total, size: 116, stroke: 12, center: (v, m) => h('span', h('b', `${v}/${m}`), h('em', 'rätt')), ariaLabel: (v, m) => `${v} av ${m} rätt på första försöket` });
    const lp = levelProgress(p ? appStat(p, app.id) : null, { upAfter: ADAPT_UP_AFTER, maxLevel: MAX_LEVEL });
    const lvl = LEVELS[lp.level];
    const levelRing = progressRing({ value: lp.atMax ? lp.need : lp.run, max: lp.need, size: 116, stroke: 12, className: 'lvl', center: () => lvl.emoji, ariaLabel: () => `${lvl.short}` });
    levelRing.el.style.setProperty('--fx-ring-color', '#2fae66');
    const rings = h(
      'div.sum-rings',
      h('div.sum-ring', score.el, h('small', 'den här rundan')),
      h('div.sum-ring.level', levelRing.el, h('small', lp.atMax ? `${lvl.short} – högsta nivån!` : `${lvl.short}: ${lp.run} av ${lp.need} rätt i rad till nästa nivå`)),
    );
    const card = h(
      'div.summary',
      h('div.sum-emoji', res.rating === 3 ? '🏆' : res.rating === 2 ? '🌟' : '💪'),
      h('h2.sum-title', { class: res.rating === 3 ? 'fx-sparkle-text' : '' }, msgs[res.rating - 1]),
      starsRow,
      rings,
      h('p.sum-detail', `${correctFirst} av ${total} rätt på första försöket · +`, h('span.sum-gain', String(correctFirst + res.bonus)), ' ⭐'),
      learningPlayReward(kos.profile, res, correctFirst),
      res.rankUp ? h('div.sum-rank', `${res.rankUp.emoji} Ny titel: ${res.rankUp.title}!`) : null,
      res.trophies.length ? h('div.sum-trophies', res.trophies.map((t) => h('div.sum-trophy', h('span', t.icon), h('div', h('small', 'Ny trofé'), h('b', t.name))))) : null,
      h(
        'div.sum-actions',
        onTap(h('button.btn.btn-ghost', { type: 'button' }, '↩ Tillbaka'), () => onExit?.()),
        onTap(shimmer(h('button.btn.btn-primary', { type: 'button' }, '🔁 En gång till')), () => { replayCleanup?.(); replayCleanup = runQuiz(el, { app, module: mod, onExit }); }),
      ),
    );
    stage.appendChild(card);
    numberTicker(card.querySelector('.sum-gain'), 0, correctFirst + res.bonus, { duration: 900 });
    if (res.rating === 3) kos.sfx('fanfare');
    else kos.sfx('star');
    kos.confetti(res.rating === 3 ? 160 : 70);
    kos.autoSay(`${msgs[res.rating - 1]} Du fick ${correctFirst} av ${total} rätt.`);
    res.trophies.forEach((t, i) => setTimeout(() => { if (card.isConnected && kos.profile === p) kos.trophyToast(t); }, 900 + i * 1700));
    void best;
  }

  // Autismstöd: "Hur mår du?" före passet (inte vid "Samma igen", då är barnet redan igång).
  if (adapted && ap.checkin && !count) adaptedCheckin({ stage, prefs: ap, host: wrap, onStart: () => alive && next() });
  else if (p?.settings.previewRounds) {
    dots.hidden = true;
    helpButton.hidden = true;
    progress.textContent = 'Din plan';
    stage.append(h('div.quiz-plan',
      h('h2', mod.name),
      h('ol', h('li', `${total} frågor, en i taget.`), h('li', 'Välj själv när du går vidare.'), h('li', 'Sedan är rundan klar.')),
      h('p', 'Du kan be om hjälp eller pausa när du vill.'),
      onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Läs planen'), () => kos.read(`${mod.name}. ${total} frågor, en i taget. Du väljer när du går vidare. Sedan är rundan klar. Du kan be om hjälp eller pausa.`)),
      onTap(h('button.btn.btn-primary', { type: 'button' }, 'Starta rundan'), () => {
        dots.hidden = false;
        helpButton.hidden = false;
        next();
      })));
  } else next();
  return () => {
    alive = false;
    resume();
    replayCleanup?.();
    kos.stopSpeaking();
    if (wrap.querySelector('.ad-pause-screen')) kos.paused = false; // stängd mitt i en paus
  };
}

/* ======================= Frågetyper ======================= */

function choice(q, el, api) {
  const long = q.options.some((o) => (o.label || '').length > 12);
  const grid = h('div.choices', { class: [q.wide ? 'wide' : '', long ? 'long' : '', `n${q.options.length}`].join(' ') });
  const btns = q.options.map((o) => {
    const b = ripple(h('button.choice', { type: 'button', dataset: { id: o.id } }, o.html ? h('span.choice-html', { html: o.html }) : h('span.choice-label', o.label)));
    onTap(b, () => {
      if (b.disabled || el.closest('.q-stage').classList.contains('done')) return;
      if (o.id === q.answer) {
        b.classList.add('right');
        btns.forEach((x) => (x.disabled = true));
        api.correct();
      } else {
        b.classList.add('wrong-shake');
        b.disabled = true;
        setTimeout(() => b.classList.remove('wrong-shake'), 500);
        api.wrong();
      }
    });
    return b;
  });
  api.reveal = () => {
    btns.forEach((b) => {
      b.disabled = true;
      if (b.dataset.id === q.answer) b.classList.add('right');
    });
  };
  grid.append(...btns);
  el.appendChild(grid);
}

function numpad(q, el, api) {
  let value = '';
  const display = h('div.np-display', { 'aria-live': 'polite' }, h('span.np-value', ''), h('span.np-caret'));
  const valEl = display.firstChild;
  const keys = h('div.numpad');
  const update = () => {
    valEl.textContent = value;
    display.classList.toggle('empty', !value);
  };
  const press = (k) => {
    if (el.closest('.q-stage').classList.contains('done')) return;
    kos.sfx('click');
    if (k === '⌫') value = value.slice(0, -1);
    else if (k === 'OK') {
      if (!value) return;
      if (Number(value) === Number(q.answer)) {
        display.classList.add('right');
        api.correct();
      } else {
        display.classList.add('wrong-shake');
        setTimeout(() => display.classList.remove('wrong-shake'), 500);
        const guess = Number(value);
        const dir = guess < q.answer ? 'Lite för lite – det ska vara mer.' : 'Lite för mycket – det ska vara mindre.';
        value = '';
        update();
        api.wrong(`${dir} ${q.hint || ''}`);
      }
      return;
    } else if (value.length < 4) value = value === '0' ? k : value + k;
    update();
  };
  for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK']) {
    const b = ripple(h('button.np-key', { type: 'button', class: k === 'OK' ? 'ok' : k === '⌫' ? 'del' : '' }, k === '⌫' ? '⌫' : k));
    onTap(b, () => press(k), { guardMs: 120 });
    keys.appendChild(b);
  }
  api.reveal = () => {
    value = String(q.answer);
    update();
    display.classList.add('revealed');
  };
  update();
  el.append(display, keys);
}

function order(q, el, api) {
  const picked = [];
  const slots = h('div.order-slots', { class: q.joiner === ' ' ? 'sentence' : '' });
  const pool = h('div.order-pool');
  const itemBtn = new Map();
  const n = q.answerOrder.length;
  const renderSlots = () => {
    clear(slots);
    for (let i = 0; i < n; i++) {
      const id = picked[i];
      const it = q.items.find((x) => x.id === id);
      const s = h('button.order-slot', { type: 'button', class: id ? 'filled' : '' }, id ? (it.html ? h('span', { html: it.html }) : it.label) : h('span.slot-n', String(i + 1)));
      if (id) onTap(s, () => {
        if (el.closest('.q-stage').classList.contains('done')) return;
        picked.splice(i, 1);
        itemBtn.get(id).classList.remove('used');
        renderSlots();
      });
      slots.appendChild(s);
      if (q.joiner && q.joiner !== ' ' && i < n - 1) slots.appendChild(h('span.order-join', q.joiner));
    }
  };
  for (const it of q.items) {
    const b = h('button.order-item', { type: 'button' }, it.html ? h('span', { html: it.html }) : it.label);
    onTap(b, () => {
      if (b.classList.contains('used') || el.closest('.q-stage').classList.contains('done')) return;
      kos.sfx('pop');
      if (it.say && kos.shouldAutoSpeak()) kos.say(it.say);
      picked.push(it.id);
      b.classList.add('used');
      renderSlots();
      if (picked.length === n) check();
    });
    itemBtn.set(it.id, b);
    pool.appendChild(b);
  }
  async function check() {
    const ok = picked.every((id, i) => id === q.answerOrder[i]);
    if (ok) {
      slots.classList.add('right');
      api.correct();
      return;
    }
    slots.classList.add('wrong-shake');
    await wait(450);
    slots.classList.remove('wrong-shake');
    // behåll de som står rätt från början, lägg tillbaka resten
    let k = 0;
    while (k < picked.length && picked[k] === q.answerOrder[k]) k++;
    picked.splice(k).forEach((id) => itemBtn.get(id).classList.remove('used'));
    renderSlots();
    api.wrong(k > 0 ? `De ${k} första står rätt! ${q.hint || ''}` : q.hint);
  }
  api.reveal = () => {
    picked.length = 0;
    picked.push(...q.answerOrder);
    itemBtn.forEach((b) => b.classList.add('used'));
    renderSlots();
    slots.classList.add('revealed');
  };
  renderSlots();
  el.append(slots, pool);
}

function sort(q, el, api) {
  let selected = null;
  let mistakes = 0;
  let placed = 0;
  const tray = h('div.sort-tray');
  const bins = h('div.sort-bins', { class: `n${q.bins.length}` });
  const binEls = new Map();
  for (const b of q.bins) {
    const be = h('div.sort-bin', { dataset: { bin: b.id }, role: 'button', tabindex: '0', 'aria-label': b.label }, h('div.bin-head', h('span.bin-icon', { html: b.html }), h('span.bin-label', b.label)), h('div.bin-items'));
    onTap(be, e => {
      // Ett tryck på en sak som redan ligger i lådan räknas som ett tryck på lådan.
      const hit = e.target.closest('.sort-item');
      if (!hit || hit.classList.contains('placed')) selected && drop(selected, b.id);
    }, { guardMs: 0 });
    binEls.set(b.id, be);
    bins.appendChild(be);
  }
  const itemEls = new Map();
  for (const it of q.items) {
    const ie = h('div.sort-item', { dataset: { id: it.id }, role: 'button', tabindex: '0', 'aria-label': it.say || it.label || it.n || `Sak ${itemEls.size + 1}`, 'aria-pressed': 'false', html: it.html });
    itemEls.set(it.id, ie);
    tray.appendChild(ie);
    attachDrag(ie, it);
  }
  function select(it) {
    itemEls.forEach((e) => {
      e.classList.remove('sel');
      e.setAttribute('aria-pressed', 'false');
    });
    selected = it;
    if (it) {
      itemEls.get(it.id).classList.add('sel');
      itemEls.get(it.id).setAttribute('aria-pressed', 'true');
      bins.classList.add('armed');
      if (kos.shouldAutoSpeak() && it.say) kos.say(it.say);
    } else bins.classList.remove('armed');
  }
  function drop(it, binId) {
    const ie = itemEls.get(it.id);
    if (!ie || ie.classList.contains('placed')) return;
    if (it.bin === binId) {
      kos.sfx('pop');
      ie.classList.remove('sel');
      ie.classList.add('placed');
      ie.setAttribute('aria-disabled', 'true');
      ie.tabIndex = -1;
      binEls.get(binId).querySelector('.bin-items').appendChild(ie);
      placed++;
      select(null);
      if (placed === q.items.length) {
        api.correct();
      }
    } else {
      mistakes++;
      api.markTry();
      ie.classList.add('wrong-shake');
      binEls.get(binId).classList.add('wrong-flash');
      setTimeout(() => {
        ie.classList.remove('wrong-shake');
        binEls.get(binId).classList.remove('wrong-flash');
      }, 500);
      kos.sfx('wrong');
      kos.retry();
      select(null);
      const hintEl = el.parentElement.querySelector('.q-feedback');
      if (hintEl) {
        clear(hintEl).append(h('div.fb.fb-try', h('span.fb-icon', '💡'), h('div', h('b', kos.adapted ? 'Prova en annan. ' : 'Inte där! '), q.hint || 'Försök med en annan.')));
        hintEl.classList.add('show');
      }
    }
  }
  function attachDrag(ie, it) {
    let start = null;
    let ghost = null;
    let suppressClick = false;
    onTap(ie, e => {
      e.stopPropagation();
      if (suppressClick) { suppressClick = false; return; }
      if (!ie.classList.contains('placed')) select(selected === it ? null : it);
    });
    ie.addEventListener('pointerdown', (e) => {
      if (ie.classList.contains('placed')) return;
      suppressClick = false;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      ie.setPointerCapture?.(e.pointerId);
    });
    ie.addEventListener('pointermove', (e) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!ghost && Math.hypot(dx, dy) > 10) {
        ghost = ie.cloneNode(true);
        ghost.classList.add('drag-ghost');
        const r = ie.getBoundingClientRect();
        ghost.style.width = `${r.width}px`;
        ghost.style.left = `${r.left}px`;
        ghost.style.top = `${r.top}px`;
        document.body.appendChild(ghost);
        ie.classList.add('dragging');
        select(it);
      }
      if (ghost) {
        ghost.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
        const over = binAt(e.clientX, e.clientY);
        binEls.forEach((b, id) => b.classList.toggle('over', id === over));
      }
    });
    const end = (e) => {
      if (!start) return;
      const wasDrag = !!ghost;
      if (ghost) {
        ghost.remove();
        ghost = null;
        ie.classList.remove('dragging');
        binEls.forEach((b) => b.classList.remove('over'));
        const over = binAt(e.clientX, e.clientY);
        if (over) drop(it, over);
        else select(null);
      }
      start = null;
      suppressClick = wasDrag && e.type === 'pointerup';
    };
    ie.addEventListener('pointerup', end);
    ie.addEventListener('pointercancel', end);
  }
  function binAt(x, y) {
    for (const [id, b] of binEls) {
      const r = b.getBoundingClientRect();
      const pad = 16; // större aktiv yta än det synliga
      if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) return id;
    }
    return null;
  }
  el.append(tray, bins);
}

function build(q, el, api) {
  const n = q.word.length;
  const filled = Array(n).fill(null);
  const slots = h('div.build-slots');
  const tiles = h('div.build-tiles');
  const tileEls = [];
  const hear = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔊 Hör ordet');
  onTap(hear, () => kos.read(q.sayWord || q.word.toLowerCase(), { slow: true }));
  if (q.showWordSupport) {
    const writtenWord = h('p.spelling-word', { hidden: true }, q.word);
    const showWord = onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button', 'aria-expanded': 'false' }, 'Visa ordet som stöd'), () => {
      writtenWord.hidden = !writtenWord.hidden;
      showWord.setAttribute('aria-expanded', String(!writtenWord.hidden));
    });
    el.append(showWord, writtenWord);
  }
  const renderSlots = () => {
    clear(slots);
    filled.forEach((ti, i) => {
      const s = h('button.build-slot', { type: 'button', class: ti !== null ? 'filled' : '' }, ti !== null ? q.tiles[ti] : '');
      onTap(s, () => {
        if (ti === null || el.closest('.q-stage').classList.contains('done')) return;
        filled[i] = null;
        tileEls[ti].classList.remove('used');
        renderSlots();
      });
      slots.appendChild(s);
    });
  };
  q.tiles.forEach((letter, ti) => {
    const b = h('button.build-tile', { type: 'button' }, letter);
    onTap(b, () => {
      if (b.classList.contains('used') || el.closest('.q-stage').classList.contains('done')) return;
      const i = filled.indexOf(null);
      if (i < 0) return;
      kos.sfx('pop');
      filled[i] = ti;
      b.classList.add('used');
      renderSlots();
      if (!filled.includes(null)) check();
    });
    tileEls.push(b);
    tiles.appendChild(b);
  });
  async function check() {
    const word = filled.map((ti) => q.tiles[ti]).join('');
    if (word === q.word) {
      slots.classList.add('right');
      kos.say(q.sayWord || q.word.toLowerCase());
      api.correct();
      return;
    }
    slots.classList.add('wrong-shake');
    await wait(450);
    slots.classList.remove('wrong-shake');
    filled.forEach((ti, i) => {
      if (ti !== null && q.tiles[ti] !== q.word[i]) {
        tileEls[ti].classList.remove('used');
        filled[i] = null;
      }
    });
    renderSlots();
    api.wrong();
  }
  api.reveal = () => {
    filled.fill(null);
    tileEls.forEach((t) => t.classList.remove('used'));
    const used = new Set();
    q.word.split('').forEach((ch, i) => {
      const ti = q.tiles.findIndex((t, k) => t === ch && !used.has(k));
      used.add(ti);
      filled[i] = ti;
      tileEls[ti]?.classList.add('used');
    });
    renderSlots();
    slots.classList.add('revealed');
  };
  renderSlots();
  el.append(slots, tiles, h('div.build-extra', hear));
}

function tapcount(q, el, api) {
  let beats = 0;
  const beatRow = h('div.beats');
  const drum = h('button.drum', { type: 'button', 'aria-label': 'Trumma' }, '🥁');
  const renderBeats = () => {
    clear(beatRow);
    for (let i = 0; i < Math.max(beats, 1); i++) beatRow.appendChild(h('span.beat', { class: i < beats ? 'on' : '' }));
  };
  onTap(
    drum,
    () => {
      if (el.closest('.q-stage').classList.contains('done') || beats >= (q.max || 6)) return;
      beats++;
      kos.sfx('note');
      drum.classList.remove('hit');
      void drum.offsetWidth;
      drum.classList.add('hit');
      renderBeats();
    },
    { guardMs: 140 },
  );
  const reset = onTap(h('button.btn.btn-ghost', { type: 'button' }, '↺ Börja om'), () => {
    beats = 0;
    renderBeats();
  });
  const hear = onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔊 Lyssna'), () => kos.read(q.sayWord, { slow: true }));
  const done = onTap(h('button.btn.btn-primary', { type: 'button' }, 'Klar ✓'), () => {
    if (!beats || el.closest('.q-stage').classList.contains('done')) return;
    if (beats === q.answer) api.correct();
    else {
      beats = 0;
      renderBeats();
      api.wrong();
    }
  });
  api.reveal = () => {
    beats = q.answer;
    renderBeats();
  };
  renderBeats();
  el.append(h('div.drum-wrap', drum, beatRow), h('div.row-actions', hear, reset, done));
}

function tap(q, el, api, visual) {
  if (!visual) return;
  visual.classList.add('tappable');
  el.appendChild(h('p.tap-help', '👆 Tryck i bilden'));
  const handler = (e) => {
    if (visual.closest('.q-stage').classList.contains('done')) return;
    let target = e.target.closest?.('[data-hit]');
    if (!target) {
      // närmaste träffyta inom 48 px (större aktiv yta än det som syns)
      let best = null;
      let bd = 48;
      visual.querySelectorAll('[data-hit]').forEach((n) => {
        const r = n.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        if (d < bd) {
          bd = d;
          best = n;
        }
      });
      target = best;
    }
    if (!target) return;
    const id = target.getAttribute('data-hit');
    if (id === q.answer) {
      target.classList.add('hit-right');
      api.correct();
    } else {
      target.classList.add('hit-wrong');
      setTimeout(() => target.classList.remove('hit-wrong'), 600);
      api.wrong();
    }
  };
  visual.addEventListener('click', handler);
  api.reveal = () => visual.querySelector(`[data-hit="${q.answer}"]`)?.classList.add('hit-right', 'pulse');
}

function clock(q, el, api, visual, stage) {
  let total = 12 * 60; // minuter sedan 00:00 (startar på 12:00)
  const step = q.step || 15;
  const holder = h('div.clock-set', { html: clockSvg(12, 0, { size: 300 }) });
  const svg = holder.querySelector('svg');
  const readout = h('div.clock-readout', '');
  const render = () => {
    const hh = Math.floor(total / 60) % 12;
    const mm = ((total % 60) + 60) % 60;
    svg.querySelector('.hand-m').setAttribute('transform', `rotate(${mm * 6} 110 110)`);
    svg.querySelector('.hand-h').setAttribute('transform', `rotate(${(hh + mm / 60) * 30} 110 110)`);
  };
  let dragging = false;
  let prevMin = 0;
  const angleAt = (e) => {
    const r = svg.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    let a = (Math.atan2(x, -y) * 180) / Math.PI;
    if (a < 0) a += 360;
    return a;
  };
  svg.addEventListener('pointerdown', (e) => {
    if (stage.classList.contains('done')) return;
    dragging = true;
    prevMin = ((total % 60) + 60) % 60;
    svg.setPointerCapture?.(e.pointerId);
    move(e);
  });
  const move = (e) => {
    if (!dragging) return;
    const m = (Math.round(angleAt(e) / 6 / step) * step) % 60;
    if (m === prevMin) return;
    let delta = m - prevMin;
    if (delta > 30) delta -= 60;
    if (delta < -30) delta += 60;
    total += delta;
    prevMin = m;
    kos.sfx('click');
    render();
  };
  svg.addEventListener('pointermove', move);
  const up = () => (dragging = false);
  svg.addEventListener('pointerup', up);
  svg.addEventListener('pointercancel', up);
  const nudge = (d) =>
    onTap(
      h('button.btn.btn-ghost.btn-sm', { type: 'button' }, d > 0 ? `+${step} min ⟳` : `⟲ −${step} min`),
      () => {
        total += d;
        render();
      },
      { guardMs: 100 },
    );
  const ok = onTap(h('button.btn.btn-primary', { type: 'button' }, 'Klar ✓'), () => {
    if (stage.classList.contains('done')) return;
    const hh = Math.floor(total / 60) % 12;
    const mm = ((total % 60) + 60) % 60;
    if (hh === q.target.h % 12 && mm === q.target.m) {
      readout.textContent = `${timeToSwedish(q.target.h, q.target.m)} (${digitalTime(q.target.h, q.target.m)})`;
      api.correct();
    } else {
      const wantH = q.target.h % 12;
      const msg = mm !== q.target.m ? 'Kolla den långa visaren (minuterna) först.' : hh !== wantH ? 'Minuterna är rätt! Kolla nu den korta visaren.' : '';
      api.wrong(msg);
    }
  });
  api.reveal = () => {
    total = (q.target.h % 12) * 60 + q.target.m;
    render();
    readout.textContent = `${timeToSwedish(q.target.h, q.target.m)} (${digitalTime(q.target.h, q.target.m)})`;
  };
  render();
  el.append(h('p.tap-help', '👆 Dra i den långa blå visaren'), holder, readout, h('div.row-actions', nudge(-step), nudge(step), ok));
}
