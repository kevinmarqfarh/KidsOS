// Anpassat läge – gränssnittsdelar för frågemotorn: först–sen-remsa, paus och belöning.
// Logiken (antal, intressen, ljud) finns i core/adapted.js. Bakgrund: docs/ANPASSAT-LAGE.md.
import { h, clear, onTap } from './dom.js';
import { kos } from './kos.js';
import { interestFor, rewardFor, firstThenText, rewardCount, REWARDS } from '../core/adapted.js';

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
 * Först–sen-remsa (visuellt schema): "Först ● ● ● ● ● ➜ Sen 🫧" och en paus-knapp.
 * `dots` är frågemotorns progress-prickar; de flyttas in i "Först"-rutan.
 */
export function adaptedStrip({ dots, total, prefs, host }) {
  const ft = firstThenText(total, prefs);
  const then = thenVisual(prefs);
  const pauseBtn = h('button.ad-pause', { type: 'button', 'aria-label': 'Jag behöver en paus' }, h('span.ad-pause-icon', { 'aria-hidden': 'true' }, '✋'), h('span', 'Paus'));
  onTap(pauseBtn, () => showPause(host));
  return h(
    'div.ad-strip',
    { role: 'group', 'aria-label': `${ft.first}. Sen ${then.label}.` },
    h('div.ad-first', h('span.ad-ft-label', 'Först'), dots),
    h('span.ad-arrow', { 'aria-hidden': 'true' }, '➜'),
    h('div.ad-then', h('span.ad-ft-label', 'Sen'), h('span.ad-then-icon', { 'aria-hidden': 'true' }, then.icon), h('span.ad-then-name', then.label)),
    pauseBtn,
  );
}

/** "Jag behöver en paus"-kort: lugn skärm utan krav. Barnet bestämmer när det fortsätter. */
export function showPause(host) {
  if (!host || host.querySelector('.ad-pause-screen')) return;
  kos.stopSpeaking();
  kos.paused = true;
  const resume = h('button.btn.btn-primary.btn-xl.ad-resume', { type: 'button' }, '▶ Fortsätt');
  const screen = h(
    'div.ad-pause-screen',
    { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Paus' },
    h('div.ad-pause-card', h('div.ad-breathe', { 'aria-hidden': 'true' }, '🌿'), h('h2', 'Paus'), h('p', 'Andas lugnt. In … och ut.'), h('p.muted', 'Tryck på Fortsätt när du är redo.'), resume),
  );
  onTap(resume, () => {
    kos.paused = false;
    screen.remove();
    kos.say('Nu fortsätter vi.');
  });
  host.appendChild(screen);
  kos.say('Paus. Andas lugnt. Tryck på Fortsätt när du är redo.');
}

/** Tydlig avslutning: "Klart! 🎉" och sedan den utlovade belöningen ("sen"). */
export function adaptedFinish({ stage, res, total, prefs, onExit, again, fresh }) {
  clear(stage);
  let rewardId = rewardFor(prefs).id;
  const play = h('div.ad-reward-slot');
  const pickRow = h('div.ad-reward-pick', { role: 'group', 'aria-label': 'Välj belöning' });
  const renderPick = () => {
    clear(pickRow).append(
      h('span.ad-pick-label', 'Välj:'),
      REWARDS.map((r) => {
        const icon = r.id === 'friends' ? interestFor(prefs).icon : r.icon;
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
    clear(play).appendChild(rewardPlay(rewardId, interestFor(prefs)));
    kos.say(rewardFor(rewardId).say);
  };
  const card = h(
    'div.summary.ad-summary',
    h('div.sum-emoji', '🎉'),
    h('h2.sum-title', 'Klart!'),
    h('p.ad-done', `Du gjorde ${total} ${total === 1 ? 'uppgift' : 'uppgifter'}. Bra jobbat!`),
    res?.trophies?.length ? h('p.ad-trophy', res.trophies.map((t) => `${t.icon} ${t.name}`).join(' · ')) : null,
    play,
    pickRow,
    h(
      'div.sum-actions',
      onTap(h('button.btn.btn-ghost', { type: 'button' }, '↩ Tillbaka'), () => onExit?.()),
      onTap(h('button.btn.btn-ghost', { type: 'button', title: 'Samma uppgifter en gång till' }, '🔁 Samma igen'), () => again?.()),
      onTap(h('button.btn.btn-primary', { type: 'button' }, '➜ Nya uppgifter'), () => fresh?.()),
    ),
  );
  stage.appendChild(card);
  kos.sfx('star');
  renderPick();
  clear(play).appendChild(rewardPlay(rewardId, interestFor(prefs)));
  kos.autoSay(`Klart! Bra jobbat. ${rewardFor(rewardId).say}`);
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
