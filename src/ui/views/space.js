import { photoFigure } from '../photos.js';
// Rymden – interaktiva vyer.
import { h, clear, onTap, interactiveGraphic, wait, reducedMotion } from '../dom.js';
import { PLANETS, SUN, CONSTELLATIONS, moonPhaseName, moonPhasePath, moonPhaseFor, moonPhaseImage, GBG_DAYLIGHT, MONTHS, seasonForMonth } from '../../apps/space.js';
import { hasInSet } from '../../core/model.js';
import { createRng } from '../../core/rng.js';
import { photo, creditLine, hasPhoto, photoUrl } from '../img.js';

/* ---------- Solsystemet ---------- */
/** En planet i banvyn: riktigt foto (klippt till en cirkel) om det finns, annars en färgad cirkel. */
function planetBody(pl, r) {
  if (!hasPhoto(pl.img)) return `${pl.id === 'saturnus' ? `<ellipse rx="${r * 1.9}" ry="${r * 0.55}" fill="none" stroke="#e8d08a" stroke-width="3"/>` : ''}<circle r="${r}" fill="${pl.color}"/>`;
  const href = photoUrl(pl.img);
  // Saturnusfotot är brett med ringarna: klotet är ungefär 40 % av bildens bredd.
  if (pl.id === 'saturnus') return `<image href="${href}" x="${-r * 2.45}" y="${-r * 0.98}" width="${r * 4.9}" height="${r * 1.96}" preserveAspectRatio="xMidYMid meet"/>`;
  const sz = r * 2.3;
  return `<clipPath id="pc-${pl.id}"><circle r="${r}"/></clipPath><image href="${href}" x="${-sz / 2}" y="${-sz / 2}" width="${sz}" height="${sz}" clip-path="url(#pc-${pl.id})" preserveAspectRatio="xMidYMid slice"/>`;
}

export function solarView(el, { kos, app }) {
  const p = kos.profile;
  let alive = true;
  let mode = 'orbit';
  let selected = null;
  let factIdx = 0;
  const holder = h('div.solar-holder');
  const info = h('div.planet-info');
  const toggle = h('button.chip-btn', { type: 'button' }, '📏 Jämför storlek');
  const visited = h('div.visited');
  el.append(h('div.solar', h('div.row-between', h('p.muted', 'Tryck på solen eller en planet!'), toggle), holder, info, visited));
  const W = 600;
  const H = 600;
  const radii = [70, 98, 128, 156, 196, 232, 262, 290];
  const speeds = [4.1, 1.6, 1, 0.53, 0.084, 0.034, 0.012, 0.006].map((s) => s * 0.6);
  const angles = PLANETS.map((_, i) => i * 0.9);
  function renderVisited() {
    clear(visited).append(
      h('small', 'Besökta planeter: '),
      ...PLANETS.map((pl) => h('span.v-dot', { class: hasInSet(p, 'planets', pl.id) ? 'on' : '', style: { '--c': pl.color }, title: pl.name })),
    );
  }
  function buildOrbit() {
    clear(holder);
    let s = `<svg viewBox="0 0 ${W} ${H}" class="solar-svg"><defs><radialGradient id="sunG"><stop offset="0" stop-color="#fff6c2"/><stop offset=".55" stop-color="#ffc93c"/><stop offset="1" stop-color="#ff8a1c"/></radialGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="#0d1030" rx="24"/>`;
    const rng = createRng(7);
    for (let i = 0; i < 90; i++) s += `<circle cx="${rng.int(5, W - 5)}" cy="${rng.int(5, H - 5)}" r="${rng.next() * 1.4 + 0.3}" fill="#fff" opacity="${0.3 + rng.next() * 0.6}"/>`;
    radii.forEach((r) => (s += `<circle cx="300" cy="300" r="${r}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1.5"/>`));
    s += `<g class="body" data-id="solen"><circle cx="300" cy="300" r="44" fill="url(#sunG)"/><circle cx="300" cy="300" r="56" fill="transparent"/></g>`;
    PLANETS.forEach((pl, i) => {
      const r = Math.max(7, Math.min(20, 5 + Math.sqrt(pl.size) * 4.5));
      s += `<g class="body planet" data-id="${pl.id}"><circle class="hitzone" r="26" fill="transparent"/>${planetBody(pl, r)}</g>`;
      void i;
    });
    s += '</svg>';
    holder.innerHTML = s;
    holder.querySelectorAll('.body').forEach((g) => interactiveGraphic(g, g.dataset.id === 'solen' ? 'Solen' : PLANETS.find(pl => pl.id === g.dataset.id)?.name || g.dataset.id, () => select(g.dataset.id)));
  }
  function animate() {
    if (!alive || !el.isConnected || mode !== 'orbit') return;
    const gs = holder.querySelectorAll('.planet');
    PLANETS.forEach((pl, i) => {
      if (!kos.paused && !reducedMotion()) angles[i] += speeds[i] * 0.01;
      const x = 300 + Math.cos(angles[i]) * radii[i];
      const y = 300 + Math.sin(angles[i]) * radii[i];
      gs[i]?.setAttribute('transform', `translate(${x} ${y})`);
      gs[i]?.classList.toggle('sel', selected === pl.id);
    });
    requestAnimationFrame(animate);
  }
  function buildSizes() {
    clear(holder);
    const maxD = 11.2;
    const row = h('div.size-row');
    PLANETS.forEach((pl) => {
      const d = Math.max(6, (pl.size / maxD) * 150);
      const ball = hasPhoto(pl.img) ? h('span.sp-ball.has-photo', { html: photo(pl.img, { alt: pl.name }) }) : h('span.sp-ball');
      const b = h('button.size-planet', { type: 'button', style: { '--d': `${d}px`, '--c': pl.color } }, ball, h('small', pl.name));
      onTap(b, () => select(pl.id));
      row.appendChild(b);
    });
    holder.append(h('p.muted', 'Planeterna i rätt storlek jämfört med varandra. Solen skulle vara över 9 gånger större än Jupiter!'), row);
  }
  function select(id) {
    selected = id;
    factIdx = 0;
    kos.sfx('pop');
    const body = id === 'solen' ? SUN : PLANETS.find((x) => x.id === id);
    if (id !== 'solen') {
      const r = kos.reward({ app: app.id, set: 'planets', item: id, stars: hasInSet(p, 'planets', id) ? 0 : 1 });
      void r;
      renderVisited();
    }
    renderInfo(body);
  }
  function renderInfo(body) {
    const fact = body.facts[factIdx % body.facts.length];
    const isPlanet = body.id !== 'solen';
    clear(info).append(
      h(
        'div.pi-card',
        { style: { '--c': body.color } },
        h('div.pi-head', h('span.pi-ball'), h('h3', body.name), isPlanet ? h('span.pi-order', `Planet nr ${PLANETS.indexOf(body) + 1} från solen`) : h('span.pi-order', 'Vår stjärna')),
        photoFigure(body.id, `Rymdbild av ${body.name}`) ? h('div.pi-photo', { html: photoFigure(body.id, `Rymdbild av ${body.name}`) }) : (body.img && photo(body.img) ? h('figure.pi-photo', h('span', { html: photo(body.img, { alt: body.name }) }), h('figcaption.credit', creditLine(body.img))) : null),
        h('p.pi-fact', fact),
        isPlanet
          ? h(
              'div.pi-stats',
              h('span', h('small', 'Ett år'), h('b', body.year)),
              h('span', h('small', 'Månar'), h('b', body.moons)),
              h('span', h('small', 'Storlek'), h('b', body.size >= 1 ? `${body.size.toLocaleString('sv-SE')} × jorden` : `${Math.round(body.size * 100)} % av jorden`)),
            )
          : null,
        h(
          'div.row-actions',
          onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '🔊 Läs'), () => kos.read(`${body.name}. ${fact}`)),
          onTap(h('button.btn.btn-primary.btn-sm', { type: 'button' }, 'Mer fakta ➜'), () => {
            factIdx++;
            renderInfo(body);
            kos.say(body.facts[factIdx % body.facts.length]);
          }),
        ),
      ),
    );
    kos.autoSay(`${body.name}. ${fact}`);
  }
  onTap(toggle, () => {
    mode = mode === 'orbit' ? 'size' : 'orbit';
    toggle.textContent = mode === 'orbit' ? '📏 Jämför storlek' : '🪐 Banor';
    if (mode === 'orbit') {
      buildOrbit();
      animate();
    } else buildSizes();
  });
  buildOrbit();
  animate();
  renderVisited();
  clear(info).append(h('div.teach', h('span.teach-icon', '☀️'), h('span', 'Åtta planeter åker runt solen. Den som är närmast tar kortast tid på sig för ett varv.')));
  kos.autoSay('Solsystemet! Tryck på solen eller en planet för att lära dig mer.');
  return () => {
    alive = false;
  };
}

/* ---------- Raketen ---------- */
export function rocketView(el, { kos, app, level }) {
  let color = '#ff6b5b';
  let fins = 0;
  let alive = true;
  const preview = h('div.rocket-preview');
  const colors = ['#ff6b5b', '#3d8bfd', '#2fae66', '#8a5cf6', '#ffc93c', '#ec4899'];
  const colorRow = h('div.pick-row.colors');
  const finRow = h('div.chip-row');
  const rocketSvg = () => `<svg viewBox="0 0 120 220" class="rocket-svg">
      <path d="M60 8 C 92 40 96 110 88 160 L32 160 C 24 110 28 40 60 8Z" fill="#f4f6fb" stroke="#1f2a44" stroke-width="3"/>
      <path d="M60 8 C 74 22 82 40 86 58 L34 58 C 38 40 46 22 60 8Z" fill="${color}"/>
      <circle cx="60" cy="92" r="17" fill="#9fd0ff" stroke="#1f2a44" stroke-width="3"/><circle cx="54" cy="86" r="5" fill="#fff" opacity=".8"/>
      ${fins === 0 ? `<path d="M32 120 L10 170 L34 160Z M88 120 L110 170 L86 160Z" fill="${color}" stroke="#1f2a44" stroke-width="3"/>` : fins === 1 ? `<path d="M32 130 L14 182 L40 160Z M88 130 L106 182 L80 160Z M54 150 L60 186 L66 150Z" fill="${color}" stroke="#1f2a44" stroke-width="3"/>` : `<path d="M34 110 Q0 150 20 178 L36 160Z M86 110 Q120 150 100 178 L84 160Z" fill="${color}" stroke="#1f2a44" stroke-width="3"/>`}
      <rect x="44" y="160" width="32" height="12" rx="3" fill="#6b7a99"/>
      <g class="flame"><path d="M46 172 Q60 214 74 172Z" fill="#ffb020"/><path d="M52 172 Q60 198 68 172Z" fill="#fff3b0"/></g></svg>`;
  const renderBuild = () => {
    preview.innerHTML = rocketSvg();
    clear(colorRow);
    colors.forEach((c) => colorRow.appendChild(onTap(h('button.pick.pick-col', { type: 'button', class: c === color ? 'on' : '', style: { background: c }, 'aria-label': 'färg' }), () => {
      color = c;
      renderBuild();
    })));
    clear(finRow);
    ['Spetsiga fenor', 'Tre fenor', 'Runda fenor'].forEach((n, i) => finRow.appendChild(onTap(h('button.chip-btn', { type: 'button', class: i === fins ? 'on' : '' }, n), () => {
      fins = i;
      renderBuild();
    })));
  };
  function build() {
    clear(el).append(
      h('div.rocket', h('div.rocket-build', preview, h('div.rocket-opts', h('h3', '🔧 Bygg din raket'), h('div.field', h('span', 'Färg'), colorRow), h('div.field', h('span', 'Fenor'), finRow), onTap(h('button.btn.btn-primary.btn-xl', { type: 'button' }, '🚀 Till startplattan'), countdown)))),
    );
    renderBuild();
    kos.autoSay('Bygg din raket! Välj färg och fenor.');
  }
  function countdown() {
    let n = 10;
    const big = h('div.count-big', '10');
    const opts = h('div.choices.n3');
    const pad = h('div.rocket-pad', h('div.pad-rocket', { html: rocketSvg() }));
    const step = level <= 0 ? 1 : 1;
    clear(el).append(h('div.rocket', h('p.sci-q', 'Räkna ner till uppskjutningen! Tryck på talet som kommer härnäst.'), pad, big, opts));
    const ask = () => {
      big.textContent = String(n);
      kos.say(String(n));
      if (n === 0) return launch(pad);
      clear(opts);
      const ans = n - step;
      const rng = createRng(Date.now() + n);
      const set = new Set([ans]);
      while (set.size < 3) {
        const v = ans + rng.pick([-2, -1, 1, 2, 3]);
        if (v >= 0 && v <= 10 && v !== n) set.add(v);
      }
      rng.shuffle([...set]).forEach((v) => {
        const b = h('button.choice', { type: 'button' }, h('span.choice-label', String(v)));
        onTap(b, () => {
          if (v === ans) {
            kos.sfx('click');
            n = ans;
            ask();
          } else {
            b.classList.add('wrong-shake');
            kos.sfx('wrong');
            setTimeout(() => b.classList.remove('wrong-shake'), 400);
          }
        });
        opts.appendChild(b);
      });
    };
    ask();
  }
  async function launch(pad) {
    if (!alive) return;
    kos.say('Noll! Lyft!');
    kos.sfx('boom');
    pad.classList.add('launch');
    el.querySelector('.choices')?.remove();
    await wait(reducedMotion() ? 0 : 2600);
    if (!alive) return;
    kos.reward({ app: app.id, counter: 'rocketLaunch', stars: 2 });
    kos.confetti(120);
    clear(el).append(
      h(
        'div.rocket-space',
        h('div.rs-emoji', '🌍 ✨ 🚀'),
        h('h2', 'Du är i rymden!'),
        h('p', 'För att fortsätta runt jorden i en låg omloppsbana behöver en farkost röra sig ungefär 28 000 kilometer i timmen. Raketen hjälper farkosten upp och ger den fart åt sidan.'),
        h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔧 Bygg en ny'), build), onTap(h('button.btn.btn-primary', { type: 'button' }, '🪐 Till solsystemet'), () => el.dispatchEvent(new CustomEvent('kos-open', { bubbles: true, detail: { app: 'space', module: 'solar' } })))),
      ),
    );
    kos.say('Du är i rymden! Bra räknat!');
  }
  build();
  return () => {
    alive = false;
  };
}

/* ---------- Dag & natt ---------- */
export function dayNightView(el, { kos, app }) {
  let theta = 200; // grader, moturs; 180 = mitt på dagen (vänd mot solen)
  const wrap = h('div.dn-wrap');
  const readout = h('div.sci-readout');
  const missions = h('div.teach', h('span.teach-icon', '🌍'), h('span', 'Snurra jorden med fingret. Gör så att det blir natt i Göteborg – och sedan dag igen!'));
  // Riktiga foton av Göteborg på dagen och på natten, bredvid modellen.
  const dnPhoto = h('figure.dn-photo.real-photo');
  const hasDnPhotos = hasPhoto('dn-gbg-dag') && hasPhoto('dn-gbg-natt');
  el.append(h('div.sci', missions, hasDnPhotos ? h('div.photo-side', wrap, dnPhoto) : wrap, readout, h('div.row-actions', onTap(h('button.btn.btn-ghost', { type: 'button' }, reducedMotion() ? 'Nästa tid på dygnet' : '▶ Snurra ett dygn'), spinDay))));
  const done = new Set();
  function timeFor(t) {
    let hrs = (12 + (t - 180) / 15) % 24;
    if (hrs < 0) hrs += 24;
    return hrs;
  }
  function render() {
    const rad = (theta * Math.PI) / 180;
    const mx = 200 + Math.cos(rad) * 92;
    const my = 200 - Math.sin(rad) * 92;
    const hrs = timeFor(theta);
    const isDay = Math.cos(rad) < 0;
    let rays = '';
    for (let i = 0; i < 7; i++) rays += `<line x1="8" y1="${110 + i * 30}" x2="80" y2="${110 + i * 30}" stroke="#ffc93c" stroke-width="4" stroke-linecap="round" opacity=".7" marker-end="url(#arr)"/>`;
    wrap.innerHTML = `<svg viewBox="0 0 400 400" class="dn-svg"><defs><marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#ffc93c"/></marker><clipPath id="earthClip"><circle cx="200" cy="200" r="120"/></clipPath></defs>
      <rect width="400" height="400" fill="#0d1030" rx="24"/>${rays}<text x="30" y="80" fill="#ffc93c" font-size="16">☀️ Solljus</text>
      <g clip-path="url(#earthClip)"><circle cx="200" cy="200" r="120" fill="#3d8bfd"/>
        <g transform="rotate(${-theta} 200 200)"><path d="M250 150 q30 10 40 50 q-20 30 -50 10 q-10 -30 10 -60z M140 120 q40 -20 60 10 q-10 40 -50 30z M120 230 q30 0 40 40 q-30 20 -50 -10z" fill="#2fae66"/></g>
        <rect x="200" y="70" width="140" height="260" fill="rgba(5,8,30,.62)"/></g>
      <circle cx="200" cy="200" r="120" fill="none" stroke="#9fd0ff" stroke-width="3"/><circle cx="200" cy="200" r="7" fill="#fff"/><text x="200" y="228" fill="#fff" font-size="11" text-anchor="middle">Nordpolen</text>
      <g transform="translate(${mx} ${my})"><circle r="16" fill="#fff" opacity=".25"/><circle r="9" fill="#ff5fa2" stroke="#fff" stroke-width="3"/></g>
      <text x="${mx}" y="${my - 20}" fill="#fff" font-size="14" text-anchor="middle" font-weight="700">Göteborg</text></svg>`;
    const hh = Math.floor(hrs);
    const mm = Math.round((hrs - hh) * 60 / 15) * 15 % 60;
    readout.innerHTML = `I Göteborg är klockan ungefär <b>${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}</b> – det är <b>${isDay ? 'dag ☀️' : 'natt 🌙'}</b>. ${isDay ? 'Göteborg är vänt mot solen.' : 'Göteborg är vänt bort från solen.'}`;
    const key = isDay ? 'dag' : 'natt';
    if (hasDnPhotos && dnPhoto.dataset.k !== key) {
      dnPhoto.dataset.k = key;
      const pk = `dn-gbg-${key}`;
      dnPhoto.innerHTML = `${photo(pk, { alt: `Göteborg ${isDay ? 'på dagen' : 'på natten'}` })}<figcaption><b>Göteborg ${isDay ? 'på dagen ☀️' : 'på natten 🌙'}</b><small class="credit">${creditLine(pk)}</small></figcaption>`;
    }
    if (!started) return;
    if (!done.has(key) && !(key === initialKey && !done.size)) {
      done.add(key);
      kos.reward({ app: app.id, set: 'daynight', item: key, stars: 1 });
      kos.sfx('correct');
      if (done.size === 2) {
        const exp = 'Jorden snurrar runt sin egen axel ett varv varje dygn. Den sida som är vänd mot solen har dag, och den andra sidan har natt. Solen står still – det är vi som snurrar!';
        el.querySelector('.sci').appendChild(h('div.fb.fb-ok', h('span.fb-icon', '💡'), h('div.fb-text', h('b', 'Därför blir det natt: '), exp)));
        kos.say(exp);
      }
    }
  }
  let drag = false;
  let last = null;
  const angleAt = (e) => {
    const r = wrap.getBoundingClientRect();
    return (Math.atan2(-(e.clientY - (r.top + r.height / 2)), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };
  wrap.addEventListener('pointerdown', (e) => {
    drag = true;
    last = angleAt(e);
    wrap.setPointerCapture?.(e.pointerId);
  });
  wrap.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const a = angleAt(e);
    let d = a - last;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    theta = (theta + d + 360) % 360;
    last = a;
    render();
  });
  const up = () => (drag = false);
  wrap.addEventListener('pointerup', up);
  wrap.addEventListener('pointercancel', up);
  async function spinDay() {
    if (reducedMotion()) {
      theta = (theta + 90) % 360;
      render();
      return;
    }
    for (let i = 0; i < 72; i++) {
      if (!el.isConnected) return;
      theta = (theta + 5) % 360;
      render();
      await wait(40);
    }
  }
  let started = false;
  const initialKey = Math.cos((theta * Math.PI) / 180) < 0 ? 'dag' : 'natt';
  render();
  started = true;
  kos.autoSay('Snurra jorden med fingret. Gör så att det blir natt i Göteborg, och sedan dag igen.');
}

/* ---------- Månens faser ---------- */
// moonPhasePath ligger nu i apps/space.js (används även av månquizet); exporteras vidare här.
export { moonPhasePath };

export function moonView(el, { kos, app }) {
  let a = 45;
  const wrap = h('div.moon-wrap');
  const position = h('input.slider', { type: 'range', min: '0', max: '360', step: '5', value: '45', 'aria-label': 'Månens position runt jorden' });
  const phaseBox = h('div.moon-phase');
  const name = h('div.sci-readout');
  const goals = ['nymåne', 'halvmåne', 'fullmåne'];
  const goalEl = h('div.chip-row', goals.map((g) => h('span.chip-btn.static', { dataset: { g } }, `○ Hitta ${g}`)));
  el.append(h('div.sci', h('div.teach', h('span.teach-icon', '🌙'), h('span', 'Dra månen runt jorden. Hur ser månen ut härifrån jorden?')), goalEl, h('div.moon-layout', wrap, phaseBox), h('label.field', h('span', 'Månens position – använd reglaget eller dra månen'), position), name));
  function render() {
    const rad = ((180 + a) * Math.PI) / 180;
    const mx = 200 + Math.cos(rad) * 130;
    const my = 200 - Math.sin(rad) * 130;
    let rays = '';
    for (let i = 0; i < 6; i++) rays += `<line x1="6" y1="${70 + i * 52}" x2="40" y2="${70 + i * 52}" stroke="#ffc93c" stroke-width="4" stroke-linecap="round"/>`;
    // Jorden och månen sedda uppifrån (riktiga foton om de finns): alltid belysta på vänster sida, mot solen.
    const earthBody = hasPhoto('earth') ? `<image href="${photoUrl('earth')}" x="160" y="160" width="80" height="80" clip-path="url(#mEarthClip)" preserveAspectRatio="xMidYMid slice"/>` : '<circle cx="200" cy="200" r="40" fill="#3d8bfd"/>';
    const moonBody = hasPhoto('moon-full') ? `<image href="${photoUrl('moon-full')}" x="-18" y="-18" width="36" height="36" clip-path="url(#mMoonClip)" preserveAspectRatio="xMidYMid slice"/>` : '<circle r="18" fill="#d9d6cc"/>';
    wrap.innerHTML = `<svg viewBox="0 0 400 400" class="moon-svg"><defs><clipPath id="mEarthClip"><circle cx="200" cy="200" r="40"/></clipPath><clipPath id="mMoonClip"><circle r="18"/></clipPath></defs><rect width="400" height="400" fill="#0d1030" rx="24"/>${rays}<text x="10" y="40" fill="#ffc93c" font-size="15">☀️ Solen</text>
      <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(255,255,255,.2)" stroke-dasharray="5 7"/>
      ${earthBody}<path d="M200 160 A40 40 0 0 1 200 240 Z" fill="rgba(5,8,30,.62)"/><text x="200" y="256" fill="#fff" font-size="12" text-anchor="middle">Jorden</text>
      <g transform="translate(${mx} ${my})"><circle r="30" fill="transparent"/>${moonBody}<path d="M0 -18 A18 18 0 0 1 0 18 Z" fill="rgba(5,8,30,.78)"/></g></svg>`;
    const nm = moonPhaseName(a);
    position.value = String(a);
    position.setAttribute('aria-valuetext', `${Math.round(a)} grader, ${nm}`);
    const ph = moonPhaseFor(a);
    if (phaseBox.dataset.phase !== ph.id) {
      // Byt bara bild när fasen ändras – annars flimrar fotot medan man drar.
      phaseBox.dataset.phase = ph.id;
      const credit = hasPhoto(ph.key) ? `<small class="credit">${creditLine(ph.key)}</small>` : '';
      phaseBox.innerHTML = `<small>Så ser vi månen från jorden</small>${moonPhaseImage(ph, 'big')}<b>${nm}</b>${credit}`;
    }
    name.innerHTML = `<b>${nm[0].toUpperCase() + nm.slice(1)}.</b> ${a < 20 || a > 340 ? 'Månen står mellan jorden och solen – den belysta sidan är vänd bort från oss.' : a > 160 && a < 200 ? 'Jorden står mellan solen och månen – vi ser hela den belysta sidan.' : 'Vi ser bara en del av den belysta sidan.'}${ph.lit === 'höger' ? ' Ljuset är på höger sida – månen växer.' : ph.lit === 'vänster' ? ' Ljuset är på vänster sida – månen krymper.' : ''}`;
    const found = nm === 'nymåne' ? 'nymåne' : nm.includes('halvmåne') ? 'halvmåne' : nm === 'fullmåne' ? 'fullmåne' : null;
    if (found) {
      const r = kos.reward({ app: app.id, set: 'moonPhases', item: found });
      if (r.isNew) {
        kos.sfx('correct');
        kos.reward({ stars: 1 });
        kos.say(`Du hittade ${found}!`);
        const chip = goalEl.querySelector(`[data-g="${found}"]`);
        chip.classList.add('done');
        chip.textContent = `✓ ${found}`;
      }
    }
  }
  let drag = false;
  wrap.addEventListener('pointerdown', (e) => {
    drag = true;
    wrap.setPointerCapture?.(e.pointerId);
    move(e);
  });
  const move = (e) => {
    if (!drag) return;
    const r = wrap.getBoundingClientRect();
    const ang = (Math.atan2(-(e.clientY - (r.top + r.height / 2)), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
    a = (ang - 180 + 720) % 360;
    render();
  };
  position.addEventListener('input', () => { a = Number(position.value) % 360; render(); });
  wrap.addEventListener('pointermove', move);
  wrap.addEventListener('pointerup', () => (drag = false));
  wrap.addEventListener('pointercancel', () => (drag = false));
  render();
  const p = kos.profile;
  goals.forEach((g) => {
    if (hasInSet(p, 'moonPhases', g)) {
      const c = goalEl.querySelector(`[data-g="${g}"]`);
      c.classList.add('done');
      c.textContent = `✓ ${g}`;
    }
  });
  kos.autoSay('Dra månen runt jorden. Hitta nymåne, halvmåne och fullmåne.');
}

/* ---------- Stjärnbilder ---------- */
export function starsView(el, { kos, app }) {
  const p = kos.profile;
  let c = CONSTELLATIONS.find((x) => !hasInSet(p, 'constellations', x.id)) || CONSTELLATIONS[0];
  let step = 0;
  const chips = h('div.chip-row');
  const sky = h('div.sky');
  const story = h('div.sky-story');
  const skyPhoto = h('figure.sky-photo.real-photo');
  el.append(h('div.sci', chips, h('p.sci-q', '✨ Tryck på stjärnorna i ordning – börja på den som blinkar.'), h('div.photo-side', sky, skyPhoto), story));
  function renderPhoto() {
    const key = `sky-${c.id}`;
    skyPhoto.hidden = !hasPhoto(key);
    if (skyPhoto.hidden) return;
    skyPhoto.innerHTML = `${photo(key, { alt: `Foto av ${c.name} på natthimlen` })}<figcaption><b>${c.name} på riktigt</b> – så här ser det ut på natthimlen.<small class="credit">${creditLine(key)}</small></figcaption>`;
  }
  const bg = (() => {
    const rng = createRng(42);
    let s = '';
    for (let i = 0; i < 120; i++) s += `<circle cx="${rng.int(0, 100)}" cy="${rng.int(0, 100)}" r="${rng.next() * 0.35 + 0.1}" fill="#fff" opacity="${0.3 + rng.next() * 0.5}"/>`;
    return s;
  })();
  function renderChips() {
    clear(chips);
    CONSTELLATIONS.forEach((x) => chips.appendChild(onTap(h('button.chip-btn', { type: 'button', class: `${x === c ? 'on' : ''} ${hasInSet(p, 'constellations', x.id) ? 'done' : ''}` }, `${hasInSet(p, 'constellations', x.id) ? '✓ ' : ''}${x.name}`), () => {
      c = x;
      step = 0;
      start();
    })));
  }
  function render() {
    let lines = '';
    for (let i = 1; i <= step && i < c.order.length; i++) {
      const [x1, y1] = c.stars[c.order[i - 1]];
      const [x2, y2] = c.stars[c.order[i]];
      lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9fd0ff" stroke-width=".8" stroke-linecap="round"/>`;
    }
    const nextIdx = c.order[step];
    const stars = c.stars.map(([x, y], i) => `<g class="star-t" data-i="${i}"><circle cx="${x}" cy="${y}" r="6" fill="transparent"/><circle cx="${x}" cy="${y}" r="${i === nextIdx && step < c.order.length ? 2.2 : 1.6}" fill="#fff8d6" class="${i === nextIdx && step < c.order.length ? 'twinkle' : ''}"/></g>`).join('');
    sky.innerHTML = `<svg viewBox="0 0 100 100" class="sky-svg"><rect width="100" height="100" fill="#0b0e2a" rx="4"/>${bg}${lines}${stars}</svg>`;
    sky.querySelectorAll('.star-t').forEach((g) => interactiveGraphic(g, `Stjärna ${Number(g.dataset.i) + 1}`, () => tapStar(Number(g.dataset.i))));
  }
  function tapStar(i) {
    if (step >= c.order.length) return;
    if (i === c.order[step]) {
      step++;
      kos.sfx('note');
      render();
      if (step >= c.order.length) complete();
    } else {
      kos.sfx('wrong');
    }
  }
  function complete() {
    const first = !hasInSet(p, 'constellations', c.id);
    kos.reward({ app: app.id, set: 'constellations', item: c.id, stars: first ? 2 : 0 });
    kos.sfx('fanfare');
    clear(story).append(h('div.fb.fb-ok', h('span.fb-icon', '🌌'), h('div.fb-text', h('b', `${c.name} (${c.also}). `), c.story)));
    if (c.culture) story.append(h('div.sky-culture', h('span.fb-icon', '🌍'), h('div', h('b', 'Andra kulturer: '), c.culture)));
    kos.say(`${c.name}! ${c.story}${c.culture ? ` ${c.culture}` : ''}`);
    renderChips();
  }
  function start() {
    renderChips();
    clear(story);
    render();
    renderPhoto();
    kos.autoSay(`${c.name}. Tryck på stjärnorna i ordning.`);
  }
  start();
}

/* ---------- Varför årstider? ---------- */
export function orbitView(el, { kos, app }) {
  let month = 3;
  const wrap = h('div.orbit-wrap');
  const slider = h('input#orbit-month.slider', { type: 'range', min: '0', max: '11', value: String(month), 'aria-label': 'månad' });
  const readout = h('div.sci-readout');
  const goals = [
    { id: 'midsommar', label: 'Hitta midsommar', test: (m) => m === 5 },
    { id: 'jul', label: 'Hitta jul', test: (m) => m === 11 },
    { id: 'lika', label: 'Hitta när dag och natt är lika långa', test: (m) => m === 2 || m === 8 },
  ];
  const doneSet = new Set();
  const goalEl = h('div.chip-row', goals.map((g) => h('span.chip-btn.static', { dataset: { g: g.id } }, `○ ${g.label}`)));
  const seasonPhoto = h('figure.season-photo.real-photo');
  const SEASON_KEY = { vinter: 'season-vinter', vår: 'season-var', sommar: 'season-sommar', höst: 'season-host' };
  const hasSeasonPhotos = Object.values(SEASON_KEY).every(hasPhoto);
  el.append(h('div.sci', h('div.teach', h('span.teach-icon', '🌍'), h('span', 'Flytta jorden runt solen med reglaget. Se vad som händer i Göteborg!')), goalEl, hasSeasonPhotos ? h('div.photo-side', wrap, seasonPhoto) : wrap, slider, readout));
  function render() {
    // dec = vänster, jun = höger
    const ang = ((month - 11.7) / 12) * Math.PI * 2 + Math.PI;
    const ex = 200 + Math.cos(ang) * 140;
    const ey = 200 + Math.sin(ang) * 80;
    const sunDir = Math.atan2(200 - ey, 200 - ex);
    wrap.innerHTML = `<svg viewBox="0 0 400 400" class="orbit-svg"><rect width="400" height="400" fill="#0d1030" rx="24"/>
      <ellipse cx="200" cy="200" rx="140" ry="80" fill="none" stroke="rgba(255,255,255,.2)" stroke-dasharray="5 7"/>
      <circle cx="200" cy="200" r="34" fill="#ffc93c"/><text x="200" y="250" fill="#ffc93c" font-size="12" text-anchor="middle">Solen</text>
      <g transform="translate(${ex} ${ey})">
        <circle r="26" fill="#3d8bfd"/>
        <path d="M 0 -26 A 26 26 0 0 1 0 26 Z" fill="rgba(5,8,30,.6)" transform="rotate(${(sunDir * 180) / Math.PI - 180})"/>
        <g transform="rotate(-23.4)"><line x1="0" y1="-38" x2="0" y2="38" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><circle cx="0" cy="-17" r="4.5" fill="#ff5fa2" stroke="#fff" stroke-width="1.5"/></g>
      </g>
      <text x="200" y="385" fill="#9fd0ff" font-size="12" text-anchor="middle">Jordaxeln lutar alltid åt samma håll i rymden</text></svg>`;
    const hrs = GBG_DAYLIGHT[month];
    const season = seasonForMonth(month);
    if (hasSeasonPhotos && seasonPhoto.dataset.s !== season) {
      seasonPhoto.dataset.s = season;
      const pk = SEASON_KEY[season];
      seasonPhoto.innerHTML = `${photo(pk, { alt: `Svensk natur på ${season}en` })}<figcaption><b>${season[0].toUpperCase() + season.slice(1)} i Sverige</b><small class="credit">${creditLine(pk)}</small></figcaption>`;
    }
    const hh = Math.floor(hrs);
    const mm = Math.round((hrs - hh) * 60);
    readout.innerHTML = `<b>${MONTHS[month][0].toUpperCase() + MONTHS[month].slice(1)}</b> – det är <b>${season}</b> i Sverige. I Göteborg är det ljust ungefär <b>${hh} timmar${mm ? ` och ${mm} minuter` : ''}</b> per dygn. <div class="daybar"><i style="width:${(hrs / 24) * 100}%"></i></div>${month >= 4 && month <= 7 ? 'Norra halvklotet lutar mot solen: solen står högt och dagarna är långa.' : month >= 10 || month <= 1 ? 'Norra halvklotet lutar bort från solen: solen står lågt och dagarna är korta.' : 'Ingen halva lutar mot solen – dag och natt är ungefär lika långa.'}`;
    for (const g of goals)
      if (g.test(month) && !doneSet.has(g.id)) {
        doneSet.add(g.id);
        const chip = goalEl.querySelector(`[data-g="${g.id}"]`);
        chip.classList.add('done');
        chip.textContent = `✓ ${g.label.replace('Hitta ', '')}`;
        kos.sfx('correct');
        kos.reward({ app: app.id, stars: 1 });
        if (doneSet.size === goals.length) {
          const exp = 'Årstiderna beror inte på att jorden kommer närmare solen. Det beror på att jordaxeln lutar! När vår del av jorden lutar mot solen får vi sommar, och när den lutar bort får vi vinter.';
          el.querySelector('.sci').appendChild(h('div.fb.fb-ok', h('span.fb-icon', '💡'), h('div.fb-text', h('b', 'Hemligheten: '), exp)));
          kos.say(exp);
        }
      }
  }
  slider.addEventListener('input', () => {
    month = Number(slider.value);
    kos.sfx('click');
    render();
  });
  render();
  kos.autoSay('Flytta jorden runt solen med reglaget. Hitta midsommar och jul!');
}
