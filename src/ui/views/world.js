// Världen – interaktiv världskarta (världsdelar och hav) och Sverigekarta.
import { h, clear, onTap, interactiveGraphic } from '../dom.js';
import { CONTINENTS, OCEANS, WORLD_ANIMALS, PLACES, SWEDISH_CITIES, projectSweden, bearing8, clearTargets, worldMapSvg, swedenBase } from '../../apps/world.js';
import { photo, hasPhoto, creditLine } from '../img.js';
import { hasInSet } from '../../core/model.js';
import { createRng } from '../../core/rng.js';

const FIND_ROUNDS = 7;

export function continentsView(el, { kos, app, level = 0 }) {
  const p = kos.profile;
  let mode = 'explore';
  let queue = [];
  let target = null;
  let round = 0;
  let right = 0;
  let busy = false;
  const rng = createRng(Date.now());
  const withOceans = level >= 2;
  const seg = h('div.seg', h('button.seg-btn.on', { type: 'button' }, '🔍 Utforska'), h('button.seg-btn', { type: 'button' }, '🎯 Hitta'));
  const mapBox = h('div.world-map');
  const info = h('div.cont-info');
  el.append(h('div.sci', h('div.row-between', h('p.muted', 'Tryck på en världsdel eller ett hav! Den vita pricken är Sverige.'), seg), mapBox, info));
  const [exBtn, findBtn] = seg.children;
  const findById = (id) => CONTINENTS.find((x) => x.id === id) || OCEANS.find((x) => x.id === id);
  function draw(hl) {
    mapBox.innerHTML = worldMapSvg(hl, { oceans: true, oceanLabels: mode === 'explore' && level >= 1 });
    mapBox.querySelectorAll('[data-hit]').forEach((g) => interactiveGraphic(g, [...CONTINENTS, ...OCEANS].find((c) => c.id === g.dataset.hit)?.name || 'Världsdel', () => tap(g.dataset.hit)));
  }
  function explore(id) {
    const c = findById(id);
    const isOcean = OCEANS.includes(c);
    draw(id);
    const set = isOcean ? 'oceans' : 'continents';
    kos.reward({ app: app.id, set, item: id, stars: hasInSet(p, set, id) ? 0 : 1 });
    const animals = isOcean ? [] : WORLD_ANIMALS.filter((a) => a.home === id);
    const places = isOcean ? [] : PLACES.filter((x) => x.cont === id);
    const thumbs = [...animals, ...places].filter((x) => hasPhoto(x.id)).slice(0, 6);
    const chips = [...animals, ...places].filter((x) => !hasPhoto(x.id)).slice(0, Math.max(0, 6 - thumbs.length));
    clear(info).append(
      h('div.pi-card', { style: { '--c': c.color || '#2563eb' } }, h('div.pi-head', h('span.pi-ball'), h('h3', `${isOcean ? '🌊 ' : ''}${c.name}`)), h('p.pi-fact', c.fact),
        thumbs.length ? h('div.thumbs', thumbs.map((x) => h('figure.thumb', h('span', { html: photo(x.id, { alt: x.name }) }), h('figcaption', x.name)))) : null,
        chips.length ? h('div.world-chips', chips.map((x) => h('span.world-chip', `${x.e} ${x.name}`))) : null),
    );
    kos.autoSay(`${c.name}. ${c.fact}`);
  }
  function tap(id) {
    if (mode === 'explore') return explore(id);
    if (!target || busy) return;
    if (id === target.id) {
      right++;
      kos.sfx('correct');
      kos.reward({ app: app.id, stars: 1, set: OCEANS.includes(target) ? 'oceans' : 'continents', item: id });
      busy = true;
      draw(id);
      setTimeout(nextFind, 700);
      return;
    }
    const c = findById(id);
    kos.sfx('wrong');
    kos.say(`Det där är ${c.name}. ${target.name} är ${OCEANS.includes(target) ? 'havet' : 'världsdelen'} som blinkar nu.`);
    busy = true;
    draw(target.id);
    setTimeout(nextFind, 2200);
  }
  function nextFind() {
    busy = false;
    round++;
    if (round > FIND_ROUNDS) {
      clear(info).append(h('div.fb.fb-ok', h('span.fb-icon', '🌍'), h('div.fb-text', h('b', `Du hittade ${right} av ${FIND_ROUNDS}! `), withOceans ? 'Jorden har sju världsdelar och fem världshav.' : 'Jorden har sju världsdelar.'), onTap(h('button.btn.btn-primary', { type: 'button' }, 'Igen'), startFind)));
      if (right === FIND_ROUNDS) kos.confetti(80);
      target = null;
      draw();
      return;
    }
    target = queue[round - 1];
    draw();
    clear(info).append(h('p.sci-q', `${round}/${FIND_ROUNDS}: Var är ${target.name}?`));
    kos.say(`Var är ${target.name}?`);
  }
  function startFind() {
    round = 0;
    right = 0;
    // Alla sju världsdelar en gång; från nivå 2 blandas några hav in.
    queue = withOceans ? rng.shuffle([...rng.sample(CONTINENTS, 4), ...rng.sample(OCEANS, 3)]) : rng.shuffle([...CONTINENTS]);
    nextFind();
  }
  onTap(exBtn, () => {
    mode = 'explore';
    target = null;
    exBtn.classList.add('on');
    findBtn.classList.remove('on');
    draw();
    clear(info);
  });
  onTap(findBtn, () => {
    mode = 'find';
    findBtn.classList.add('on');
    exBtn.classList.remove('on');
    startFind();
  });
  draw();
  kos.autoSay('Världskartan! Tryck på en världsdel eller ett hav för att lära dig mer.');
}

export function swedenView(el, { kos, app, level = 1 }) {
  const rng = createRng(Date.now());
  const mapWrap = h('div.sweden-map');
  const panel = h('div.cont-info');
  const modes = ['explore', 'find', ...(level >= 2 ? ['dir'] : [])];
  const seg = h('div.seg', h('button.seg-btn.on', { type: 'button' }, '🔍 Utforska'), h('button.seg-btn', { type: 'button' }, '🎯 Hitta staden'), level >= 2 ? h('button.seg-btn', { type: 'button' }, '🧭 Väderstreck') : null);
  el.append(h('div.sci', h('div.row-between', h('p.muted', 'Norr är uppåt på kartan.'), seg), h('div.sweden-layout', mapWrap, panel)));
  let mode = 'explore';
  let target = null;
  let score = 0;
  let n = 0;
  let busy = false;
  let ROUNDS = 6;
  const home = SWEDISH_CITIES.find((c) => c.id === 'goteborg');
  mapWrap.innerHTML = `${swedenBase('map-img')}<div class="map-n">N ⬆</div>`;
  SWEDISH_CITIES.forEach((c) => {
    const q = projectSweden(c.lat, c.lon);
    const pin = h('button.city-pin', { type: 'button', style: { left: `${q.x * 100}%`, top: `${q.y * 100}%` }, dataset: { id: c.id }, 'aria-label': c.name }, h('i'), h('span.city-name', c.name));
    if (q.x > 0.62) pin.classList.add('label-left');
    onTap(pin, () => tap(c));
    mapWrap.appendChild(pin);
  });
  const setNames = (show) => mapWrap.classList.toggle('hide-names', !show);
  const mark = (ids) => mapWrap.querySelectorAll('.city-pin').forEach((x) => x.classList.toggle('on', ids.includes(x.dataset.id)));
  function tap(c) {
    if (mode === 'explore') {
      mark([c.id]);
      const dir = c.id === home.id ? 'Här ligger Liseberg och Göteborgs hamn.' : `${c.name} ligger ${bearing8(home, c)} om Göteborg.`;
      clear(panel).append(h('div.pi-card', h('h3', `📍 ${c.name}`), h('p.pi-fact', c.fact), h('p', dir), c.landskap ? h('p.muted', `Landskap: ${c.landskap} · Landsdel: ${c.landsdel}`) : h('p.muted', `Landsdel: ${c.landsdel}`)));
      kos.reward({ app: app.id, set: 'cities', item: c.id, stars: 0 });
      kos.autoSay(`${c.name}. ${c.fact}`);
      return;
    }
    if (mode !== 'find' || !target || busy) return;
    busy = true;
    const ok = c.id === target.id;
    if (ok) {
      score++;
      kos.sfx('correct');
      kos.reward({ app: app.id, stars: 1, set: 'cities', item: c.id });
      mark([c.id]);
    } else {
      kos.sfx('wrong');
      mark([target.id]);
      kos.say(`Det där är ${c.name}. ${target.name} ligger här.`);
    }
    setTimeout(next, ok ? 600 : 2000);
  }
  function answerDir(o, ans, to) {
    if (busy) return;
    busy = true;
    if (o === ans) {
      score++;
      kos.sfx('correct');
      kos.reward({ app: app.id, stars: 1 });
      setTimeout(next, 600);
    } else {
      kos.sfx('wrong');
      kos.say(`Nästan! ${to.name} ligger ${ans} om Göteborg.`);
      setTimeout(next, 2200);
    }
  }
  let queue = [];
  function next() {
    busy = false;
    mark([]);
    n++;
    if (n > ROUNDS) {
      clear(panel).append(h('div.fb.fb-ok', h('span.fb-icon', '🇸🇪'), h('div.fb-text', h('b', `${score} av ${ROUNDS} rätt! `), 'Bra koll på Sverigekartan.'), onTap(h('button.btn.btn-primary', { type: 'button' }, 'Igen'), () => start(mode))));
      target = null;
      setNames(true);
      return;
    }
    if (mode === 'find') {
      target = queue[n - 1];
      clear(panel).append(h('p.sci-q', `${n}/${ROUNDS}: Var ligger ${target.name}?`));
      kos.say(`Var ligger ${target.name}?`);
      return;
    }
    const to = queue[n - 1];
    const ans = bearing8(home, to);
    const pool = level >= 3 ? ['norr', 'nordost', 'öster', 'sydost', 'söder', 'sydväst', 'väster', 'nordväst'] : ['norr', 'öster', 'söder', 'väster', ...(ans.length > 6 ? [ans] : [])];
    const opts = rng.shuffle([ans, ...rng.sample([...new Set(pool)].filter((x) => x !== ans), 2)]);
    mark([to.id, home.id]);
    clear(panel).append(
      h('p.sci-q', `${n}/${ROUNDS}: Du är i Göteborg. Åt vilket håll ligger ${to.name}?`),
      h('div.choices.n3.long', opts.map((o) => onTap(h('button.choice', { type: 'button' }, h('span.choice-label', o)), () => answerDir(o, ans, to)))),
    );
    kos.say(`Du är i Göteborg. Åt vilket håll ligger ${to.name}?`);
  }
  function start(m) {
    mode = m;
    n = 0;
    score = 0;
    busy = false;
    [...seg.children].forEach((b, i) => b.classList.toggle('on', modes[i] === m));
    if (m === 'explore') {
      setNames(true);
      mark([]);
      clear(panel).append(h('div.teach', h('span.teach-icon', '📍'), h('span', 'Tryck på en stad för att lära dig om den.')));
      return;
    }
    // Hitta: nivå 1 de största städerna, sedan alla. Väderstreck: bara tydliga riktningar från Göteborg.
    const big = ['stockholm', 'goteborg', 'malmo', 'kiruna', 'uppsala', 'visby', 'umea', 'lulea'];
    const findPool = level <= 1 ? SWEDISH_CITIES.filter((c) => big.includes(c.id)) : SWEDISH_CITIES;
    const dirPool = clearTargets(home, SWEDISH_CITIES);
    queue = rng.sample(m === 'find' ? findPool : dirPool, 6);
    ROUNDS = queue.length;
    setNames(m !== 'find');
    next();
  }
  [...seg.children].forEach((b, i) => onTap(b, () => start(modes[i])));
  start('explore');
  kos.autoSay('Sverigekartan. Tryck på en stad!');
}

/* ---------- Rymdens bildgalleri ---------- */
export function galleryView(el, { kos, items, title = 'Bildgalleri' }) {
  const grid = h('div.gallery-photos');
  const big = h('div.gallery-big', { hidden: true });
  el.append(h('div.sci', h('p.muted', `${title} – tryck på en bild.`), big, grid));
  items.filter((x) => hasPhoto(x.key)).forEach((it) => {
    grid.appendChild(onTap(h('button.gal-item', { type: 'button' }, h('span', { html: photo(it.key, { alt: it.title }) }), h('small', it.title)), () => {
      big.hidden = false;
      clear(big).append(h('div.gb-img', { html: photo(it.key, { alt: it.title }) }), h('div.gb-text', h('h3', it.title), h('p', it.fact), h('small.credit', creditLine(it.key)), onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '✕ Stäng'), () => (big.hidden = true))));
      big.scrollIntoView({ behavior: 'smooth', block: 'start' });
      kos.reward({ set: 'spacePhotos', item: it.key });
      kos.autoSay(`${it.title}. ${it.fact}`);
    }));
  });
  if (!grid.children.length) grid.append(h('p.muted', 'Bilderna kunde inte laddas.'));
}
