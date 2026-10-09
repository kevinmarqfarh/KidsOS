// Världen – interaktiv världskarta och Sverigekarta.
import { h, clear, onTap } from '../dom.js';
import { CONTINENTS, WORLD_ANIMALS, PLACES, SWEDISH_CITIES, projectSweden, bearing8 } from '../../apps/world.js';
import { photo, hasPhoto, creditLine } from '../img.js';
import { hasInSet } from '../../core/model.js';
import { createRng } from '../../core/rng.js';

// Förenklade konturer (longitud, latitud) – barnvänliga, igenkännbara former.
export const OUTLINES = {
  nordamerika: [
    [[-168, 66], [-160, 71], [-140, 70], [-120, 72], [-95, 73], [-80, 70], [-62, 60], [-55, 52], [-65, 45], [-75, 40], [-81, 31], [-80, 26], [-90, 29], [-97, 26], [-97, 20], [-90, 16], [-83, 10], [-78, 8], [-85, 12], [-92, 15], [-105, 20], [-112, 30], [-117, 33], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 60]],
    [[-55, 60], [-45, 60], [-20, 70], [-20, 80], [-40, 83], [-65, 80], [-72, 77], [-60, 70]],
  ],
  sydamerika: [[[-80, 8], [-72, 12], [-60, 10], [-50, 0], [-35, -5], [-38, -15], [-48, -28], [-58, -38], [-65, -45], [-68, -55], [-74, -50], [-72, -35], [-71, -18], [-77, -8], [-81, -3]]],
  europa: [
    [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [5, 58], [5, 62], [12, 66], [20, 70], [30, 70], [40, 68], [45, 65], [55, 68], [60, 60], [55, 50], [48, 45], [40, 42], [30, 41], [26, 38], [22, 36], [15, 38], [12, 44], [5, 43], [-2, 37]],
    [[-6, 50], [2, 51], [0, 54], [-3, 58], [-6, 58], [-5, 54]],
    [[-24, 64], [-14, 64], [-14, 66], [-22, 66]],
  ],
  afrika: [
    [[-17, 21], [-10, 30], [-5, 36], [10, 37], [20, 32], [32, 31], [35, 28], [43, 12], [51, 12], [42, 0], [40, -10], [35, -22], [30, -32], [20, -35], [15, -28], [12, -15], [9, -2], [10, 4], [-8, 5], [-15, 11]],
    [[44, -25], [50, -15], [49, -12], [43, -20]],
  ],
  asien: [
    [[26, 40], [36, 36], [35, 31], [43, 13], [55, 22], [58, 24], [66, 25], [72, 20], [78, 8], [82, 15], [90, 22], [98, 16], [100, 8], [104, 1], [108, 12], [106, 20], [110, 21], [120, 23], [122, 31], [122, 40], [128, 38], [130, 43], [140, 47], [142, 55], [160, 60], [180, 66], [180, 70], [140, 73], [110, 77], [80, 73], [68, 70], [60, 68], [60, 60], [55, 50], [48, 45], [42, 42], [36, 40]],
    [[130, 31], [141, 36], [142, 43], [140, 42], [135, 34]],
    [[95, 5], [105, -6], [115, -8], [120, -5], [110, 1], [100, 2]],
  ],
  oceanien: [
    [[114, -22], [122, -17], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [145, -38], [138, -35], [131, -31], [117, -35], [114, -28]],
    [[166, -46], [174, -41], [178, -38], [173, -35], [170, -44]],
    [[141, -3], [150, -6], [147, -9], [141, -9]],
  ],
  antarktis: [[[-180, -72], [-120, -74], [-60, -66], [0, -70], [60, -67], [120, -66], [180, -72], [180, -85], [-180, -85]]],
};
const W = 360;
const H = 170;
const proj = ([lon, lat]) => [lon + 180, 85 - lat];
const LABEL = { nordamerika: [-100, 46], sydamerika: [-60, -15], europa: [18, 52], afrika: [20, 5], asien: [95, 50], oceanien: [134, -26], antarktis: [0, -78] };

export function worldMapSvg(highlight = null) {
  let s = `<svg class="world-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="världskarta"><rect width="${W}" height="${H}" rx="8" fill="#7cc8f2"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M0 ${20 + i * 26} Q90 ${14 + i * 26} 180 ${20 + i * 26} T360 ${20 + i * 26}" stroke="#a5dcf7" stroke-width="1" fill="none"/>`;
  for (const c of CONTINENTS) {
    const polys = OUTLINES[c.id].map((poly) => `<polygon points="${poly.map(proj).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}"/>`).join('');
    s += `<g class="cont${highlight === c.id ? ' hl' : ''}" data-hit="${c.id}" fill="${c.color}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round">${polys}</g>`;
  }
  const [sx, sy] = proj([12, 58]);
  s += `<g class="home-pin" pointer-events="none"><circle cx="${sx}" cy="${sy}" r="3.4" fill="#fff" stroke="#1f2a44" stroke-width="1.2"/><text x="${sx + 5}" y="${sy - 3}" font-size="7" font-weight="800" fill="#1f2a44">Du</text></g>`;
  s += '</svg>';
  return s;
}

export function continentsView(el, { kos, app, level }) {
  const p = kos.profile;
  let mode = 'explore';
  let target = null;
  let round = 0;
  let right = 0;
  const rng = createRng(Date.now());
  const seg = h('div.seg', h('button.seg-btn.on', { type: 'button' }, '🔍 Utforska'), h('button.seg-btn', { type: 'button' }, '🎯 Hitta'));
  const mapBox = h('div.world-map');
  const info = h('div.cont-info');
  el.append(h('div.sci', h('div.row-between', h('p.muted', 'Tryck på en världsdel! Den vita pricken är Sverige.'), seg), mapBox, info));
  const [exBtn, findBtn] = seg.children;
  function draw(hl) {
    mapBox.innerHTML = worldMapSvg(hl);
    mapBox.querySelectorAll('.cont').forEach((g) => g.addEventListener('click', () => tap(g.dataset.hit)));
  }
  function tap(id) {
    const c = CONTINENTS.find((x) => x.id === id);
    if (mode === 'find') {
      if (!target) return;
      if (id === target.id) {
        right++;
        kos.sfx('correct');
        kos.reward({ app: app.id, stars: 1, set: 'continents', item: id });
      } else {
        kos.sfx('wrong');
        kos.say(`Det där är ${c.name}. ${target.name} är den som blinkar nu.`);
        draw(target.id);
        setTimeout(() => nextFind(), 1800);
        return;
      }
      nextFind();
      return;
    }
    draw(id);
    const r = kos.reward({ app: app.id, set: 'continents', item: id, stars: hasInSet(p, 'continents', id) ? 0 : 1 });
    void r;
    const animals = WORLD_ANIMALS.filter((a) => a.home === id);
    const places = PLACES.filter((x) => x.cont === id);
    clear(info).append(
      h('div.pi-card', { style: { '--c': c.color } }, h('div.pi-head', h('span.pi-ball'), h('h3', c.name)), h('p.pi-fact', c.fact),
        h('div.thumbs', [...animals, ...places].filter((x) => hasPhoto(x.id)).slice(0, 6).map((x) => h('figure.thumb', h('span', { html: photo(x.id, { alt: x.name }) }), h('figcaption', x.name))))),
    );
    kos.autoSay(`${c.name}. ${c.fact}`);
  }
  function nextFind() {
    round++;
    if (round > 7) {
      clear(info).append(h('div.fb.fb-ok', h('span.fb-icon', '🌍'), h('div.fb-text', h('b', `Du hittade ${right} av 7! `), 'Jorden har sju världsdelar.'), onTap(h('button.btn.btn-primary', { type: 'button' }, 'Igen'), startFind)));
      if (right === 7) kos.confetti(80);
      target = null;
      return;
    }
    target = rng.pick(CONTINENTS);
    draw();
    clear(info).append(h('p.sci-q', `${round}/7: Var är ${target.name}?`));
    kos.say(`Var är ${target.name}?`);
  }
  function startFind() {
    round = 0;
    right = 0;
    nextFind();
  }
  onTap(exBtn, () => {
    mode = 'explore';
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
  kos.autoSay('Världskartan! Tryck på en världsdel för att lära dig mer.');
  void level;
}

export function swedenView(el, { kos, app, level }) {
  const rng = createRng(Date.now());
  const mapWrap = h('div.sweden-map');
  const panel = h('div.cont-info');
  const seg = h('div.seg', h('button.seg-btn.on', { type: 'button' }, '🔍 Utforska'), h('button.seg-btn', { type: 'button' }, '🎯 Hitta staden'), level >= 2 ? h('button.seg-btn', { type: 'button' }, '🧭 Väderstreck') : null);
  el.append(h('div.sci', h('div.row-between', h('p.muted', 'Norr är uppåt på kartan.'), seg), h('div.sweden-layout', mapWrap, panel)));
  let mode = 'explore';
  let target = null;
  let score = 0;
  let n = 0;
  const img = photo('sverigekarta', { alt: 'Karta över Sverige', cls: 'map-img' }) || '<div class="map-fallback">🇸🇪</div>';
  mapWrap.innerHTML = `${img}<div class="map-n">N ⬆</div>`;
  SWEDISH_CITIES.forEach((c) => {
    const q = projectSweden(c.lat, c.lon);
    const pin = h('button.city-pin', { type: 'button', style: { left: `${q.x * 100}%`, top: `${q.y * 100}%` }, dataset: { id: c.id }, 'aria-label': c.name }, h('i'), h('span.city-name', c.name));
    onTap(pin, () => tap(c));
    mapWrap.appendChild(pin);
  });
  const setNames = (show) => mapWrap.classList.toggle('hide-names', !show);
  function tap(c) {
    if (mode === 'explore') {
      mapWrap.querySelectorAll('.city-pin').forEach((x) => x.classList.toggle('on', x.dataset.id === c.id));
      const from = SWEDISH_CITIES[0];
      clear(panel).append(h('div.pi-card', h('h3', `📍 ${c.name}`), h('p.pi-fact', c.fact), c.id !== 'goteborg' ? h('p', `Från Göteborg ligger ${c.name} åt ${bearing8(from, c)}.`) : h('p', 'Här ligger Liseberg och Göteborgs hamn.')));
      kos.reward({ app: app.id, set: 'cities', item: c.id, stars: 0 });
      kos.autoSay(`${c.name}. ${c.fact}`);
      return;
    }
    if (!target) return;
    const ok = mode === 'find' ? c.id === target.id : false;
    if (ok) {
      score++;
      kos.sfx('correct');
      kos.reward({ app: app.id, stars: 1, set: 'cities', item: c.id });
    } else {
      kos.sfx('wrong');
      mapWrap.querySelector(`[data-id="${target.id}"]`)?.classList.add('on');
      kos.say(`Det där är ${c.name}. ${target.name} ligger här.`);
    }
    setTimeout(next, ok ? 500 : 1800);
  }
  function next() {
    mapWrap.querySelectorAll('.city-pin').forEach((x) => x.classList.remove('on'));
    n++;
    if (n > 6) {
      clear(panel).append(h('div.fb.fb-ok', h('span.fb-icon', '🇸🇪'), h('div.fb-text', h('b', `${score} av 6 rätt! `), 'Bra koll på Sverigekartan.'), onTap(h('button.btn.btn-primary', { type: 'button' }, 'Igen'), () => start(mode))));
      target = null;
      setNames(true);
      return;
    }
    if (mode === 'find') {
      target = rng.pick(SWEDISH_CITIES);
      clear(panel).append(h('p.sci-q', `${n}/6: Var ligger ${target.name}?`));
      kos.say(`Var ligger ${target.name}?`);
    } else {
      const from = SWEDISH_CITIES[0];
      const to = rng.pick(SWEDISH_CITIES.filter((c) => !['goteborg', 'helsingborg'].includes(c.id)));
      const ans = bearing8(from, to);
      const opts = rng.shuffle([ans, ...rng.sample(['norr', 'nordost', 'öster', 'sydost', 'söder', 'sydväst', 'väster', 'nordväst'].filter((x) => x !== ans), 2)]);
      mapWrap.querySelector(`[data-id="${to.id}"]`)?.classList.add('on');
      mapWrap.querySelector('[data-id="goteborg"]')?.classList.add('on');
      clear(panel).append(
        h('p.sci-q', `${n}/6: Från Göteborg – åt vilket håll ligger ${to.name}?`),
        h('div.choices.n3.long', opts.map((o) => onTap(h('button.choice', { type: 'button' }, h('span.choice-label', o)), () => {
          if (o === ans) {
            score++;
            kos.sfx('correct');
            kos.reward({ app: app.id, stars: 1 });
            setTimeout(next, 500);
          } else {
            kos.sfx('wrong');
            kos.say(`Nästan! ${to.name} ligger åt ${ans}.`);
            setTimeout(next, 1800);
          }
        }))),
      );
      kos.say(`Åt vilket håll ligger ${to.name} från Göteborg?`);
    }
  }
  function start(m) {
    mode = m;
    n = 0;
    score = 0;
    [...seg.children].forEach((b, i) => b.classList.toggle('on', ['explore', 'find', 'dir'][i] === m));
    if (m === 'explore') {
      setNames(true);
      clear(panel).append(h('div.teach', h('span.teach-icon', '📍'), h('span', 'Tryck på en stad för att lära dig om den.')));
      return;
    }
    setNames(m !== 'find');
    next();
  }
  [...seg.children].forEach((b, i) => onTap(b, () => start(['explore', 'find', 'dir'][i])));
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
