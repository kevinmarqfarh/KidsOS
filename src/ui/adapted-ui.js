// Autismstöd – gränssnittsdelar för frågemotorn: visuellt schema, polletter, förvarning ("2 kvar"),
// "Hur mår du?", lugn-hörna med andningscirkel och den utlovade belöningen.
// Logiken (antal, intressen, ljud, förvarning) finns i core/adapted.js. Bakgrund: docs/ANPASSAT-LAGE.md.
import { h, clear, onTap } from './dom.js';
import { kos } from './kos.js';
import {
  interestFor, rewardFor, firstThenText, rewardCount, REWARDS, FEELINGS, feelingResponse, scheduleSteps,
  tasksLeft, leftLabel, remainingCue, breathPhase, BREATH,
} from '../core/adapted.js';
import { logAdapted, markPlan, breakPicker } from './calm-kit.js';
import { planNextButton } from './adapted-home.js';

/** Vad "sen" visar: belöningens ikon, eller favoritintresset för "Mina favoriter". */
function thenVisual(prefs) {
  const reward = rewardFor(prefs);
  const interest = interestFor(prefs);
  return reward.id === 'friends' ? { icon: interest.icon, label: interest.label } : { icon: reward.icon, label: reward.label };
}

/** Kort text som läses upp när passet börjar. */
export function adaptedIntro(total, prefs) {
  const ft = firstThenText(total, prefs);
  return `${ft.first}. Sen ${thenVisual(prefs).label.toLowerCase()}.`;
}

/**
 * Remsan överst: visuellt schema (Hur mår du? ➜ uppgifter ➜ belöning ➜ klart), pollett-tavla,
 * "kvar"-klocka och knappen till lugn-hörnan. `dots` är frågemotorns progress-prickar; de blir polletter.
 */
export function adaptedStrip({ dots, total, prefs, host }) {
  const ft = firstThenText(total, prefs);
  const interest = interestFor(prefs);
  const steps = scheduleSteps(total, prefs);
  const sched = h(
    'ol.ad-sched',
    { 'aria-label': 'Schema' },
    steps.map((s, i) => h('li.ad-step', { dataset: { step: s.id } }, i ? h('span.ad-step-arrow', { 'aria-hidden': 'true' }, '➜') : null, h('span.ad-step-icon', { 'aria-hidden': 'true' }, s.icon), h('span.ad-step-label', s.label))),
  );
  const pie = h('div.ad-left', { role: 'img', 'aria-label': `${total} kvar` }, h('span.ad-left-pie', { style: { '--left': '1' } }), h('b.ad-left-text', `${total} kvar`));
  const calmBtn = h('button.ad-pause', { type: 'button', 'aria-label': 'Jag behöver en paus' }, h('span.ad-pause-icon', { 'aria-hidden': 'true' }, '🌿'), h('span', 'Paus'));
  onTap(calmBtn, () => showPause(host, { prefs }));
  dots.setAttribute('aria-hidden', 'true');
  const strip = h(
    'div.ad-strip',
    { role: 'group', 'aria-label': `${ft.first}. ${ft.then}.`, style: { '--ad-token': `"${interest.icon}"` }, dataset: { step: steps[0].id } },
    sched,
    h('div.ad-now', h('div.ad-first', h('span.ad-ft-label', 'Polletter'), dots), pie, calmBtn),
  );
  setStripStep(strip, steps[0].id);
  return strip;
}

/** Markerar vilket steg i schemat som pågår (nu) och vilka som är klara. */
export function setStripStep(strip, stepId) {
  if (!strip) return;
  strip.dataset.step = stepId;
  let passed = true;
  strip.querySelectorAll('.ad-step').forEach((li) => {
    const now = li.dataset.step === stepId;
    if (now) passed = false;
    li.classList.toggle('now', now);
    li.classList.toggle('done', passed && !now);
    if (now) li.setAttribute('aria-current', 'step');
    else li.removeAttribute('aria-current');
  });
}

/** Uppdaterar "kvar"-klockan (krymper som en Time Timer) och markerar förvarning vid 2 kvar och sista. */
export function setStripLeft(strip, index, total, prefs) {
  const pie = strip?.querySelector('.ad-left');
  if (!pie) return;
  const left = tasksLeft(index, total);
  const label = leftLabel(index, total);
  pie.querySelector('.ad-left-pie').style.setProperty('--left', String(left / Math.max(1, total)));
  pie.querySelector('.ad-left-text').textContent = label;
  pie.setAttribute('aria-label', label);
  pie.classList.toggle('warn', !!remainingCue(index, total, prefs));
}

/**
 * "Hur mår du?" före passet (känslokort). Aldrig ett krav: barnet kan hoppa över och börja direkt.
 * Om barnet är oroligt, trött eller argt erbjuds lugn-hörnan först.
 */
export function adaptedCheckin({ stage, prefs, host, onStart }) {
  clear(stage);
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    kos.stopSpeaking();
    onStart?.();
  };
  const answer = h('div.ad-checkin-answer', { 'aria-live': 'polite' });
  const cards = h(
    'div.ad-feelings',
    { role: 'group', 'aria-label': 'Hur mår du?' },
    FEELINGS.map((f) =>
      onTap(h('button.ad-feeling', { type: 'button', dataset: { feeling: f.id }, 'aria-label': f.label }, h('span.ad-feeling-icon', { 'aria-hidden': 'true' }, f.icon), h('span', f.label)), () => {
        cards.querySelectorAll('.ad-feeling').forEach((b) => b.classList.toggle('on', b.dataset.feeling === f.id));
        if (!cards.dataset.logged) logAdapted('mood', f.id); // förälderns lokala logg (en gång per pass)
        cards.dataset.logged = '1';
        const r = feelingResponse(f.id);
        kos.say(r.say);
        if (!r.calm) {
          clear(answer).append(h('p.ad-checkin-say', r.say));
          setTimeout(start, 900);
          return;
        }
        clear(answer).append(
          h('p.ad-checkin-say', 'Tack för att du berättar. Vill du andas en stund först?'),
          h(
            'div.ad-checkin-actions',
            onTap(h('button.btn.btn-ghost.btn-xl', { type: 'button' }, '🌿 Andas först'), () => showPause(host, { prefs, onResume: start })),
            onTap(h('button.btn.btn-primary.btn-xl', { type: 'button' }, '▶ Börja'), start),
          ),
        );
      }),
    ),
  );
  const skip = onTap(h('button.btn.btn-ghost.ad-checkin-skip', { type: 'button' }, 'Börja direkt ➜'), start);
  stage.appendChild(h('div.ad-checkin', h('h2.ad-checkin-title', 'Hur mår du?'), h('p.muted', 'Tryck på en bild.'), cards, answer, skip));
  kos.autoSay('Hur mår du? Tryck på en bild.');
}

/**
 * Lugn-hörna ("Jag behöver en paus"): andningscirkel (in 4 s, ut 6 s), inga krav.
 * Barnet bestämmer själv när det fortsätter. Inga ljud under andningen.
 */
export function showPause(host, { prefs, onResume } = {}) {
  if (!host || host.querySelector('.ad-pause-screen')) return;
  kos.stopSpeaking();
  kos.paused = true;
  logAdapted('pause');
  const ring = h('div.ad-breath-ring', h('div.ad-breath-dot', { 'aria-hidden': 'true' }, interestFor(prefs).icon));
  const text = h('p.ad-breath-text', { 'aria-live': 'polite' }, 'Andas in …');
  let t0 = Date.now();
  let timer = null;
  const tick = () => {
    // Vyn stängdes mitt i pausen (Hem, byt användare): stoppa andningsklockan.
    if (timer && !screen.isConnected) {
      clearInterval(timer);
      timer = null;
      return;
    }
    const ph = breathPhase(Date.now() - t0);
    ring.style.setProperty('--s', String(0.55 + ph.size * 0.45));
    ring.dataset.phase = ph.phase;
    if (text.textContent !== ph.text) text.textContent = ph.text;
    if (ph.phase === 'done') {
      clearInterval(timer);
      timer = null;
    }
  };
  const again = onTap(h('button.btn.btn-ghost', { type: 'button' }, '🌬️ Andas igen'), () => {
    t0 = Date.now();
    if (!timer) timer = setInterval(tick, 100);
    tick();
  });
  const resume = h('button.btn.btn-primary.btn-xl.ad-resume', { type: 'button' }, '▶ Fortsätt');
  const screen = h(
    'div.ad-pause-screen',
    { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Paus' },
    h('div.ad-pause-card', h('h2', '🌿 Paus'), ring, text, h('p.muted', `Följ cirkeln. ${BREATH.rounds} andetag. Tryck på Fortsätt när du är redo.`), h('div.ad-pause-actions', again, resume)),
  );
  onTap(resume, () => {
    clearInterval(timer);
    kos.paused = false;
    screen.remove();
    if (onResume) onResume();
    else kos.say('Nu fortsätter vi.');
  });
  host.appendChild(screen);
  timer = setInterval(tick, 100);
  tick();
  kos.say('Paus. Följ cirkeln och andas lugnt.');
}

/** Tydlig avslutning: "Klart! 🎉", alla polletter samlade och sedan den utlovade belöningen ("sen"). */
export function adaptedFinish({ stage, res, total, prefs, onExit, again, fresh, strip, app }) {
  clear(stage);
  // Förälderns logg + dagens plan: passet är gjort (bockas av i planen om appen finns där).
  logAdapted('pass', app);
  if (app) markPlan(app);
  setStripStep(strip, 'reward');
  if (strip) setStripLeft(strip, total, total, prefs);
  const interest = interestFor(prefs);
  let rewardId = rewardFor(prefs).id;
  const play = h('div.ad-reward-slot');
  const pickRow = h('div.ad-reward-pick', { role: 'group', 'aria-label': 'Välj belöning' });
  const renderPick = () => {
    clear(pickRow).append(
      h('span.ad-pick-label', 'Välj:'),
      REWARDS.map((r) => {
        const icon = r.id === 'friends' ? interest.icon : r.icon;
        const b = h('button.ad-pick', { type: 'button', class: r.id === rewardId ? 'on' : '', 'aria-pressed': String(r.id === rewardId), 'aria-label': r.label }, h('span', icon));
        onTap(b, () => {
          rewardId = r.id;
          renderPick();
          startReward();
        });
        return b;
      }),
    );
  };
  const startReward = () => {
    clear(play).appendChild(rewardPlay(rewardId, interest));
    kos.say(rewardFor(rewardId).say);
  };
  const tokens = h('div.ad-tokens-done', { 'aria-hidden': 'true' }, Array.from({ length: total }, () => h('span', interest.icon)));
  const card = h(
    'div.summary.ad-summary',
    h('h2.sum-title', 'Klart! 🎉'),
    tokens,
    h('p.ad-done', `Du samlade ${total} ${total === 1 ? 'pollett' : 'polletter'}. Nu är det dags för ${thenVisual(prefs).label.toLowerCase()}.`),
    res?.trophies?.length ? h('p.ad-trophy', res.trophies.map((t) => `${t.icon} ${t.name}`).join(' · ')) : null,
    play,
    pickRow,
    afterPassExtras(prefs),
    h(
      'div.sum-actions',
      onTap(h('button.btn.btn-ghost', { type: 'button' }, '🏁 Sluta för nu'), () => {
        setStripStep(strip, 'done');
        onExit?.();
      }),
      onTap(h('button.btn.btn-ghost', { type: 'button', title: 'Samma uppgifter en gång till' }, '🔁 Samma igen'), () => again?.()),
      onTap(h('button.btn.btn-primary', { type: 'button' }, '➜ Nya uppgifter'), () => fresh?.()),
    ),
  );
  stage.appendChild(card);
  kos.sfx('star');
  renderPick();
  clear(play).appendChild(rewardPlay(rewardId, interest));
  kos.autoSay(`Klart! Du samlade ${total} polletter. ${rewardFor(rewardId).say}`);
  kos.emit('adapted:passdone', { app });
}

let breakIndex = new Date().getDate();
/**
 * Efter passet: erbjud en rörelsepaus (valbar, aldrig ett krav) och visa nästa steg i dagens plan.
 * Rörelsepausen öppnas på plats i kortet; "Hoppa över" stänger den.
 */
function afterPassExtras(prefs) {
  const box = h('div.ad-after');
  const next = planNextButton();
  if (prefs?.breaks !== false && next?.dataset?.step !== 'move') {
    const slot = h('div.ad-break-slot');
    const offer = onTap(h('button.btn.btn-ghost.ad-break-offer', { type: 'button' }, '🤸 Rörelsepaus?'), () => {
      offer.hidden = true;
      breakPicker(slot, {
        index: breakIndex++,
        title: 'Rörelsepaus',
        onDone: () => { clear(slot).append(h('p.ad-break-done', '✓ Bra rört!')); },
        onSkip: () => { clear(slot); offer.hidden = false; },
      });
    });
    box.append(offer, slot);
  }
  if (next) box.append(next);
  return box.childNodes.length ? box : null;
}

/* Fasta positioner (procent) – samma varje gång, förutsägbart. */
const SPOTS = [[14, 24], [38, 20], [64, 28], [86, 22], [22, 62], [50, 52], [76, 64], [88, 46], [12, 80], [58, 80]];

/** Själva belöningen. Mjuka ljud, inga blixtar, inga överraskningar. */
export function rewardPlay(rewardId, interest) {
  const items = interest.items;
  const wrap = h('div.ad-reward', { dataset: { kind: rewardId } });
  const msg = h('p.ad-reward-msg', { 'aria-live': 'polite' });
  if (rewardId === 'stars') {
    const sky = h('div.ad-sky', { role: 'button', tabindex: '0', 'aria-label': 'Tryck på himlen' });
    let lit = 0;
    const max = rewardCount('stars');
    sky.addEventListener('click', (e) => {
      if (lit >= max) return;
      const r = sky.getBoundingClientRect();
      const x = r.width ? ((e.clientX - r.left) / r.width) * 100 : SPOTS[lit % SPOTS.length][0];
      const y = r.height ? ((e.clientY - r.top) / r.height) * 100 : SPOTS[lit % SPOTS.length][1];
      sky.appendChild(h('span.ad-star', { style: { left: `${Math.max(4, Math.min(96, x))}%`, top: `${Math.max(6, Math.min(94, y))}%` } }, '⭐'));
      lit++;
      kos.sfx('tap');
      if (lit === max) {
        msg.textContent = 'Hela himlen lyser! ✨';
        kos.say('Hela himlen lyser!');
      }
    });
    const again = onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🌙 Släck och börja om'), () => {
      sky.querySelectorAll('.ad-star').forEach((s) => s.remove());
      lit = 0;
      msg.textContent = '';
    });
    wrap.append(sky, msg, again);
    return wrap;
  }
  if (rewardId === 'friends') {
    let i = 0;
    const big = h('button.ad-friend', { type: 'button', 'aria-label': 'Tryck för nästa' }, h('span.ad-friend-emoji', items[0][0]), h('span.ad-friend-name', items[0][1]));
    onTap(big, () => {
      i = (i + 1) % items.length;
      clear(big).append(h('span.ad-friend-emoji', items[i][0]), h('span.ad-friend-name', items[i][1]));
      big.classList.remove('hop');
      void big.offsetWidth;
      big.classList.add('hop');
      kos.sfx('star');
      kos.say(items[i][1]);
      msg.textContent = i === items.length - 1 ? 'Du har sett alla! 🎉' : '';
    }, { guardMs: 250 });
    wrap.append(big, msg);
    return wrap;
  }
  // Bubblor (standard)
  const field = h('div.ad-bubbles');
  const fill = () => {
    clear(field);
    msg.textContent = '';
    let left = rewardCount('bubbles');
    for (let k = 0; k < left; k++) {
      const [emoji, name] = items[k % items.length];
      const [x, y] = SPOTS[k % SPOTS.length];
      const b = h('button.ad-bubble', { type: 'button', 'aria-label': name, style: { left: `${x}%`, top: `${y}%`, '--k': k } }, h('span', emoji));
      onTap(b, () => {
        if (b.classList.contains('popped')) return;
        b.classList.add('popped');
        b.disabled = true;
        kos.sfx('pop');
        kos.say(name);
        left--;
        if (!left) {
          msg.textContent = 'Alla bubblor! 🎉';
          kos.say('Alla bubblor!', { interrupt: false });
        }
      }, { guardMs: 0 });
      field.appendChild(b);
    }
  };
  fill();
  const more = onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🫧 Fler bubblor'), fill);
  wrap.append(field, msg, more);
  return wrap;
}
