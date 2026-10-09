// Troférummet: titel, statistik, troféer och samlingar.
import { h, clear, onTap } from './dom.js';
import { kos } from './kos.js';
import { rankFor } from '../core/progress.js';
import { TROPHIES, CATEGORIES, trophyProgress } from '../core/trophies.js';
import { SPECIES } from '../apps/biology.js';
import { PLANETS, CONSTELLATIONS } from '../apps/space.js';
import { UPPER } from '../apps/letters.js';
import { hasInSet } from '../core/model.js';
import { photo } from './img.js';

export function renderTrophyRoom(el) {
  const p = kos.profile;
  let tab = 'trophies';
  const rank = rankFor(p.stars);
  const won = Object.keys(p.trophies).length;
  const days = Object.keys(p.days).length;
  const tabs = h('div.seg');
  const body = h('div.tr-body');
  const head = h(
    'div.tr-head',
    h('span.who-avatar.big', { style: { background: p.color } }, p.avatar),
    h('div.tr-id', h('h2', p.name), h('div.rank.inline', h('span.rank-emoji', rank.emoji), h('div.rank-text', h('b', rank.title), h('span.rank-bar', h('i', { style: { width: `${Math.round(rank.progress * 100)}%` } })), h('small', rank.next ? `${rank.toNext} ⭐ kvar till ${rank.next.title}` : 'Högsta titeln!')))),
    h('div.tr-stats', stat('⭐', p.stars, 'stjärnor'), stat('🏆', `${won}/${TROPHIES.length}`, 'troféer'), stat('🔥', p.streak?.best || 0, 'bästa svit'), stat('📅', days, 'dagar')),
  );
  el.append(h('div.troom', head, tabs, body));
  function stat(icon, v, label) {
    return h('div.tr-stat', h('span', icon), h('b', String(v)), h('small', label));
  }
  function renderTabs() {
    clear(tabs);
    for (const [id, label] of [
      ['trophies', '🏆 Troféer'],
      ['collections', '🃏 Samlingar'],
    ]) {
      tabs.appendChild(onTap(h('button.seg-btn', { type: 'button', class: tab === id ? 'on' : '' }, label), () => {
        tab = id;
        renderTabs();
        render();
      }));
    }
  }
  function render() {
    clear(body);
    if (tab === 'trophies') {
      for (const c of CATEGORIES) {
        const list = TROPHIES.filter((t) => t.cat === c.id);
        const n = list.filter((t) => p.trophies[t.id]).length;
        body.appendChild(h('h3.tr-cat', `${c.icon} ${c.name}`, h('small', ` ${n}/${list.length}`)));
        body.appendChild(
          h(
            'div.medal-grid',
            list.map((t) => {
              const got = p.trophies[t.id];
              const pr = trophyProgress(p, t);
              const m = h(
                'button.medal',
                { type: 'button', class: got ? 'got' : 'locked' },
                h('span.medal-icon', t.icon),
                h('span.medal-name', t.name),
                got ? h('small.medal-date', new Date(got).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })) : h('span.medal-bar', h('i', { style: { width: `${Math.round(pr.ratio * 100)}%` } })),
                got ? null : h('small.medal-desc', `${t.desc} (${pr.value}/${pr.target})`),
              );
              onTap(m, () => kos.say(got ? `${t.name}! ${t.desc}` : `${t.desc} Du har ${pr.value} av ${pr.target}.`));
              return m;
            }),
          ),
        );
      }
    } else {
      body.append(
        collection('🃏 Artkort', SPECIES, (s) => hasInSet(p, 'species', s.id), (s) => photo(s.id, { alt: s.n, fallback: s.e }), (s) => s.n, (s) => s.fact, 'Spela Artkort i Biologi för att samla fler!'),
        collection('🪐 Planeter', PLANETS, (x) => hasInSet(p, 'planets', x.id), () => '●', (x) => x.name, (x) => x.facts[0], 'Besök planeterna i Rymden → Solsystemet.', (x) => x.color),
        collection('✨ Stjärnbilder', CONSTELLATIONS, (x) => hasInSet(p, 'constellations', x.id), () => '✨', (x) => x.name, (x) => x.story, 'Rita stjärnbilder i Rymden.'),
        collection('✏️ Skrivna bokstäver', UPPER, (x) => hasInSet(p, 'traced:upper', x), (x) => x, (x) => x, () => '', 'Skriv bokstäver i Skriv ABC.'),
      );
    }
  }
  function collection(title, items, has, icon, name, fact, hint, color) {
    const n = items.filter(has).length;
    return h(
      'section.coll',
      h('h3.tr-cat', title, h('small', ` ${n}/${items.length}`)),
      n === 0 ? h('p.muted', hint) : null,
      h(
        'div.coll-grid',
        items.map((it) => {
          const got = has(it);
          const card = h('button.coll-card', { type: 'button', class: got ? 'got' : 'locked', style: color ? { '--c': color(it) } : {} }, h('span.coll-icon', { html: got ? icon(it) : '?' }), h('small', got ? name(it) : '???'));
          onTap(card, () => (got ? kos.say(`${name(it)}. ${fact(it)}`) : kos.say(hint)));
          return card;
        }),
      ),
    );
  }
  renderTabs();
  render();
  kos.autoSay(`Ditt troférum! Du har ${won} troféer och ${p.stars} stjärnor.`);
}
