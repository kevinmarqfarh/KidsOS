// Vyer för "Känslor & jag": sociala berättelser, kroppskartan, verktygslådan och rörelsepausen.
// Innehållet finns i apps/feelings.js. Inga rätt/fel här – det handlar om barnets egen upplevelse.
import { h, clear, onTap } from '../dom.js';
import { pic } from '../img.js';
import { SOCIAL_STORIES, storyText, emotionById, MAP_FEELINGS, BODY_PARTS, CALM_TOOLS, faceSvg } from '../../apps/feelings.js';
import { interestFor } from '../../core/adapted.js';
import { loadLog, saveLog, toggleTool } from '../../core/adapted-log.js';
import { breakPicker, runBreak, quietMinute, helpCard, logAdapted, markPlan } from '../calm-kit.js';
import { showPause } from '../adapted-ui.js';
import { BRAIN_BREAKS } from '../../core/adapted.js';

/* ---------------- Sociala berättelser ---------------- */
export function socialStoriesView(el, { kos, opts = {} }) {
  const interest = interestFor(kos.adaptedPrefs()).label;

  function list() {
    clear(el);
    const grid = h(
      'div.ss-grid',
      SOCIAL_STORIES.map((s) =>
        onTap(h('button.ss-card', { type: 'button', dataset: { story: s.id } }, h('span.ss-card-pic', { html: pic(s.icon) }), h('span.ss-card-title', s.title), h('small', `${s.pages.length} sidor`)), () => open(s)),
      ),
    );
    el.append(h('div.ss', h('p.muted.ss-intro', 'Korta berättelser om sådant som händer i vardagen. Läs själv eller lyssna.'), grid));
    kos.autoSay('Välj en berättelse.');
  }

  function open(story, page = 0) {
    clear(el);
    const pg = story.pages[page];
    const last = page === story.pages.length - 1;
    const lines = pg.lines.map(([kind, t]) => h('p.ss-line', { class: kind === 'c' ? 'coach' : '' }, storyText(t, interest)));
    const text = lines.map((l) => l.textContent).join(' ');
    const read = onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔊 Läs'), () => kos.say(text));
    const prev = onTap(h('button.btn.btn-ghost', { type: 'button', disabled: page === 0, 'aria-label': 'Förra sidan' }, '‹ Förra'), () => open(story, page - 1));
    const next = onTap(h('button.btn.btn-primary.btn-xl.ss-next', { type: 'button' }, last ? '✓ Klar' : 'Nästa ›'), () => {
      kos.stopSpeaking();
      if (!last) return open(story, page + 1);
      logAdapted('story', story.id);
      markPlan('story');
      kos.reward({ app: 'feelings', set: 'stories-social', item: story.id, silent: true });
      done(story);
    });
    const dots = h('div.ss-dots', { 'aria-label': `Sida ${page + 1} av ${story.pages.length}` }, story.pages.map((_, i) => h('span', { class: i === page ? 'on' : i < page ? 'past' : '' })));
    el.append(
      h(
        'article.ss-page',
        { 'aria-label': story.title },
        h('header.ss-head', onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '☰ Alla'), () => { kos.stopSpeaking(); list(); }), h('h2.ss-title', story.title), dots),
        h('div.ss-pic', { html: pic(pg.pic, { cls: 'ss-pic-inner' }) }),
        h('div.ss-text', lines),
        h('div.ss-actions', prev, read, next),
      ),
    );
    if (kos.shouldAutoSpeak()) kos.say(page === 0 ? `${story.title}. ${text}` : text);
  }

  function done(story) {
    clear(el);
    el.append(
      h(
        'div.ss-done',
        h('div.ss-pic', { html: pic(story.icon) }),
        h('h2', 'Berättelsen är slut.'),
        h('p.muted', 'Du kan läsa den igen när du vill, eller prata om den med en vuxen.'),
        h('div.ss-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔁 Läs igen'), () => open(story)), onTap(h('button.btn.btn-primary', { type: 'button' }, '☰ Alla berättelser'), list)),
      ),
    );
    kos.autoSay('Berättelsen är slut.');
  }

  const start = opts.story && SOCIAL_STORIES.find((s) => s.id === opts.story);
  if (start) open(start);
  else list();
  return () => kos.stopSpeaking();
}

/* ---------------- Var känns det? (kroppskarta) ---------------- */
const BODY_SVG = `<svg class="bm-body" viewBox="0 0 100 100" aria-hidden="true">
<circle cx="50" cy="14" r="9" />
<path d="M38 26 Q50 22 62 26 L66 62 Q50 66 34 62 Z" />
<path d="M38 28 Q26 36 18 56" fill="none" stroke-width="7" stroke-linecap="round"/>
<path d="M62 28 Q74 36 82 56" fill="none" stroke-width="7" stroke-linecap="round"/>
<path d="M43 62 L40 94" fill="none" stroke-width="8" stroke-linecap="round"/>
<path d="M57 62 L60 94" fill="none" stroke-width="8" stroke-linecap="round"/>
</svg>`;

export function bodyMapView(el, { kos }) {
  let feeling = null;
  const marked = new Set();
  function chooseFeeling() {
    clear(el);
    marked.clear();
    el.append(
      h(
        'div.bm',
        h('h2.bm-title', 'Var i kroppen känns det?'),
        h('p.muted', 'Välj en känsla. Sedan visar du var den brukar kännas i din kropp. Det finns inget rätt eller fel – det är din kropp.'),
        h(
          'div.bm-feelings',
          MAP_FEELINGS.map((id) => {
            const e = emotionById(id);
            return onTap(h('button.bm-feeling', { type: 'button', dataset: { feeling: id } }, h('span', { html: faceSvg(id, 1, { size: 's' }) }), h('b', e.label)), () => {
              feeling = e;
              mapBody();
            });
          }),
        ),
      ),
    );
    kos.autoSay('Var i kroppen känns det? Välj en känsla.');
  }
  function mapBody() {
    clear(el);
    const spots = [...BODY_PARTS, { id: 'hands', label: 'händerna', x: 83, y: 56, twin: true }, { id: 'legs', label: 'benen', x: 59, y: 80, twin: true }];
    const figure = h('div.bm-figure', { html: BODY_SVG });
    const btns = spots.map((s) =>
      onTap(h('button.bm-spot', { type: 'button', 'aria-label': s.label, 'aria-pressed': 'false', dataset: { part: s.id }, style: { left: `${s.x}%`, top: `${s.y}%` } }), () => {
        if (marked.has(s.id)) marked.delete(s.id);
        else marked.add(s.id);
        figure.querySelectorAll('.bm-spot').forEach((b) => {
          const on = marked.has(b.dataset.part);
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        kos.say(s.label);
      }, { guardMs: 120 }),
    );
    figure.append(...btns);
    el.append(
      h(
        'div.bm',
        h('h2.bm-title', `När jag är ${feeling.label} känns det …`),
        h('p.muted', 'Tryck där det känns. Du kan välja flera ställen.'),
        figure,
        h('div.mvb-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, '‹ Byt känsla'), chooseFeeling), onTap(h('button.btn.btn-primary.btn-xl', { type: 'button' }, '✓ Klar'), summary)),
      ),
    );
    kos.autoSay(`När jag är ${feeling.label} känns det … Tryck där det känns.`);
  }
  function summary() {
    clear(el);
    const parts = BODY_PARTS.filter((b) => marked.has(b.id)).map((b) => b.label);
    const where = parts.length ? (parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} och ${parts[parts.length - 1]}`) : null;
    const sentence = where ? `När jag är ${feeling.label} känns det i ${where}.` : `Jag vet inte riktigt var det känns när jag är ${feeling.label}. Det är också okej.`;
    const calmish = ['glad', 'lugn'].includes(feeling.id);
    el.append(
      h(
        'div.bm',
        h('div.bm-face', { html: faceSvg(feeling.id, 1) }),
        h('p.bm-sentence', sentence),
        calmish
          ? h('p.muted', 'Bra att känna igen! Då vet du hur det känns när kroppen mår bra.')
          : h('p.muted', 'När du känner så i kroppen kan något i verktygslådan hjälpa, till exempel att andas, trycka händerna mot varandra eller be om hjälp.'),
        h('div.mvb-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔁 En känsla till'), chooseFeeling)),
      ),
    );
    kos.say(sentence);
  }
  chooseFeeling();
  return () => kos.stopSpeaking();
}

/* ---------------- Min verktygslåda ---------------- */
export function calmToolsView(container, { kos }) {
  const p = kos.profile;
  const stops = [];
  // Egen positionerad behållare så att andningscirkeln (lugn-hörnan) täcker just vyn.
  const el = h('div.ct-root');
  clear(container).appendChild(el);
  const layer = el;
  function render() {
    clear(el);
    const favs = p ? loadLog(p.id).tools : [];
    const tools = [...CALM_TOOLS].sort((a, b) => (favs.includes(b.id) ? 1 : 0) - (favs.includes(a.id) ? 1 : 0));
    el.append(
      h(
        'div.ct',
        h('p.muted', 'Saker som kan hjälpa när det känns jobbigt. Tryck på ☆ för att spara dina favoriter – de hamnar först.'),
        h(
          'div.ct-grid',
          tools.map((t) => {
            const fav = favs.includes(t.id);
            const star = onTap(h('button.ct-star', { type: 'button', 'aria-pressed': String(fav), 'aria-label': fav ? `Ta bort ${t.title} från favoriter` : `Spara ${t.title} som favorit` }, fav ? '★' : '☆'), (e) => {
              e.stopPropagation();
              if (!p) return;
              const log = loadLog(p.id);
              saveLog(p.id, toggleTool(log, t.id));
              render();
            });
            const card = h('div.ct-card', { class: fav ? 'fav' : '', dataset: { tool: t.id } }, onTap(h('button.ct-open', { type: 'button' }, h('span.ct-icon', { 'aria-hidden': 'true' }, t.icon), h('b', t.title), h('small', t.text)), () => openTool(t)), star);
            return card;
          }),
        ),
      ),
    );
    kos.autoSay('Min verktygslåda. Välj något som hjälper.');
  }
  function openTool(t) {
    kos.stopSpeaking();
    markPlan('calm');
    if (t.id === 'breathe') return showPause(layer, { prefs: kos.adaptedPrefs(), onResume: render });
    if (t.id === 'help') return helpCard(el, { onDone: render });
    if (t.id === 'quiet') return stops.push(quietMinute(el, { onDone: render }));
    if (t.id === 'move') return breakPicker(el, { index: new Date().getDate(), onDone: render, onSkip: render });
    if (t.id === 'press') return stops.push(runBreak(el, BRAIN_BREAKS.find((b) => b.id === 'press'), { onDone: render, onSkip: render }));
    if (t.id === 'count') return countDown(t);
    clear(el);
    el.append(h('div.mvb', h('div.mvb-big', { 'aria-hidden': 'true' }, t.icon), h('h2.mvb-title', t.title), h('p.mvb-say', t.text), h('div.mvb-actions', onTap(h('button.btn.btn-primary.btn-xl', { type: 'button' }, '✓ Klart'), () => { logAdapted('pause'); render(); }))));
    kos.say(t.text);
  }
  function countDown(t) {
    clear(el);
    const big = h('div.mvb-count', '10');
    let n = 10;
    const id = setInterval(() => {
      if (!el.isConnected) return clearInterval(id);
      n--;
      if (n <= 0) {
        clearInterval(id);
        big.textContent = '🌿';
        kos.say('Klart.');
        return;
      }
      big.textContent = String(n);
      kos.say(String(n));
    }, 1800);
    stops.push(() => clearInterval(id));
    el.append(h('div.mvb', h('h2.mvb-title', `${t.icon} ${t.title}`), h('p.mvb-say', 'Räkna tyst eller högt, långsamt, tillsammans med siffrorna.'), big, h('div.mvb-actions', onTap(h('button.btn.btn-primary.btn-xl', { type: 'button' }, '✓ Klart'), () => { clearInterval(id); logAdapted('pause'); render(); }))));
    kos.say('Tio');
  }
  render();
  return () => {
    stops.forEach((s) => s?.());
    kos.stopSpeaking();
  };
}

/* ---------------- Rörelsepaus ---------------- */
export function moveBreakView(el, { kos, back }) {
  let n = new Date().getDate();
  const again = () => {
    n++;
    breakPicker(el, { index: n, onDone: finished });
  };
  function finished(brk) {
    clear(el);
    el.append(
      h(
        'div.mvb',
        h('div.mvb-big', { 'aria-hidden': 'true' }, brk?.icon || '🤸'),
        h('h2.mvb-title', 'Bra rört!'),
        h('p.muted', 'Kroppen har fått röra sig. Ofta blir det lättare att fokusera efteråt.'),
        h('div.mvb-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔁 En till'), again), back ? onTap(h('button.btn.btn-primary', { type: 'button' }, '✓ Klar'), () => back()) : null),
      ),
    );
    kos.autoSay('Bra rört!');
  }
  breakPicker(el, { index: n, onDone: finished });
  return () => kos.stopSpeaking();
}
