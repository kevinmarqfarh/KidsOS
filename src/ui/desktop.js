// Dator-läget: skrivbord med ikoner och widgetar, fönster som kan flyttas, ändras,
// minimeras och maximeras, ett aktivitetsfält och en startmeny.
// Allt går att göra med tryck – att dra är ett tillval (forskning: drag är svårare för små barn).
import { h, clear, onTap, reducedMotion } from './dom.js';
import { kos } from './kos.js';
import { APPS } from '../apps/registry.js';
import { mountApp, appMeta } from './apphost.js';
import { rankFor } from '../core/progress.js';
import { nextTrophy, TROPHIES } from '../core/trophies.js';
import { wonderOfTheDay } from '../apps/wonder.js';
import { minutesLeftToday } from '../core/model.js';
import { clockSvg, timeToSwedish } from './visuals.js';

const ACCESSORIES = ['explorer', 'notes', 'calc', 'trophies', 'settings'];

export function createDesktop(root, { osEl, confirmSwitch, showLock }) {
  const wins = new Map(); // appId → fönster
  let z = 10;
  let cascade = 0;
  let built = false;
  let clockTimer = null;
  let desk;
  let winLayer;
  let iconsEl;
  let widgetsEl;
  let taskbar;
  let tasks;
  let tray;
  let startMenu;
  let resizeT;

  function build() {
    clear(root);
    desk = h('div.desk');
    iconsEl = h('div.desk-icons', { role: 'list' });
    widgetsEl = h('aside.desk-widgets');
    winLayer = h('div.win-layer');
    tasks = h('div.tb-tasks');
    tray = h('div.tb-tray');
    const startBtn = h('button.tb-start', { type: 'button', 'aria-label': 'Start', 'aria-haspopup': 'menu' }, h('span.logo-mark', 'K'), h('span.tb-start-label', 'Start'));
    onTap(startBtn, () => toggleStart());
    taskbar = h('nav.taskbar', startBtn, tasks, tray);
    startMenu = h('div.start-menu', { hidden: true, role: 'menu' });
    desk.append(iconsEl, widgetsEl, winLayer);
    root.append(desk, startMenu, taskbar);
    desk.addEventListener('pointerdown', (e) => {
      if (!startMenu.hidden && !e.target.closest('.start-menu')) toggleStart(false);
    });
    kos.on('stars', renderTray);
    kos.on('tick', renderTray);
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => wins.forEach((w) => clampWin(w)), 150);
    });
    built = true;
  }

  function phone() {
    return desk.clientWidth < 700;
  }

  /* ---------------- Skrivbord ---------------- */
  function show() {
    if (!built) build();
    root.hidden = false;
    root.classList.remove('booting');
    renderIcons();
    renderWidgets();
    renderTray();
    renderTasks();
    clearInterval(clockTimer);
    clockTimer = setInterval(() => {
      renderTray();
      renderWidgets(true);
    }, 30000);
    if (!show.booted) boot();
    show.booted = true;
  }

  function boot() {
    if (reducedMotion()) return;
    const p = kos.profile;
    const b = h('div.boot', h('div.boot-logo', h('span.logo-mark.big', 'K'), h('b', 'KidsOS')), h('div.boot-bar', h('i')), h('small', `Startar för ${p.name} …`));
    root.appendChild(b);
    kos.sfx('fanfare');
    setTimeout(() => b.classList.add('done'), 900);
    setTimeout(() => b.remove(), 1400);
  }

  function hide() {
    wins.forEach((w) => destroyWin(w));
    wins.clear();
    clearInterval(clockTimer);
    if (built) toggleStart(false);
    root.hidden = true;
    show.booted = false;
  }

  function renderIcons() {
    const p = kos.profile;
    const hidden = new Set(p.settings.hiddenApps || []);
    clear(iconsEl);
    const list = [...APPS.filter((a) => !hidden.has(a.id)), ...ACCESSORIES.map(appMeta)];
    list.forEach((a, i) => {
      const ic = h('button.desk-icon', { type: 'button', role: 'listitem', style: { '--app': a.color, '--i': i }, dataset: { app: a.id }, 'aria-label': a.name }, h('span.di-glyph', a.icon), h('span.di-name', a.name));
      onTap(ic, () => {
        iconsEl.querySelectorAll('.desk-icon').forEach((x) => x.classList.toggle('sel', x === ic));
        kos.sfx('pop');
        open(a.id, null, {}, ic);
      });
      iconsEl.appendChild(ic);
    });
  }

  function renderWidgets(onlyClock = false) {
    const p = kos.profile;
    if (!p) return;
    const now = new Date();
    const hh = now.getHours();
    const mm = now.getMinutes();
    const clock = h('div.widget.w-clock', h('div.w-clock-face', { html: clockSvg(hh, mm, { size: 150, showMinutes: false }) }), h('b', timeToSwedish(hh, mm - (mm % 5))), h('small', now.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })));
    if (onlyClock) {
      const old = widgetsEl.querySelector('.w-clock');
      if (old) old.replaceWith(clock);
      return;
    }
    const w = wonderOfTheDay();
    const nt = nextTrophy(p);
    const rank = rankFor(p.stars);
    clear(widgetsEl).append(
      clock,
      onTap(h('button.widget.w-note', { type: 'button' }, h('small', '📌 Dagens fråga'), h('b', `${w.e} ${w.q}`)), () => open('wonder', 'cards', { focus: w.id })),
      onTap(h('button.widget.w-coins', { type: 'button' }, h('span.w-big', '🪙'), h('div', h('b', `${p.coins || 0} mynt`), h('small', 'Handla i Lekstaden'))), () => open('play')),
      onTap(
        h('button.widget.w-trophy', { type: 'button' }, h('span.w-big', nt ? nt.t.icon : rank.emoji), h('div', h('b', nt ? nt.t.name : rank.title), h('small', nt ? `${nt.pr.value}/${nt.pr.target} · ${nt.t.desc}` : `${Object.keys(p.trophies).length}/${TROPHIES.length} troféer`), nt ? h('span.hc-bar', h('i', { style: { width: `${Math.round(nt.pr.ratio * 100)}%` } })) : null)),
        () => open('trophies'),
      ),
    );
  }

  function renderTray() {
    const p = kos.profile;
    if (!p || !tray) return;
    const now = new Date();
    const left = minutesLeftToday(p);
    const who = h('button.tb-user', { type: 'button', 'aria-label': 'Användare' }, h('span.sb-avatar', { style: { background: p.color } }, p.avatar));
    onTap(who, () => toggleStart());
    clear(tray).append(
      h('span.tb-chip', { title: 'Mynt' }, `🪙 ${p.coins || 0}`),
      h('span.tb-chip.tb-stars', { title: 'Stjärnor' }, `⭐ ${p.stars}`),
      p.streak?.count > 1 ? h('span.tb-chip.tb-opt', { title: 'Dagar i rad' }, `🔥 ${p.streak.count}`) : null,
      Number.isFinite(left) ? h('span.tb-chip.tb-opt', { title: 'Tid kvar i dag' }, `⏳ ${Math.ceil(left)}`) : null,
      h('span.tb-clock', h('b', now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })), h('small', now.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }))),
      who,
    );
  }

  function renderTasks() {
    clear(tasks);
    const active = topWin();
    wins.forEach((w) => {
      const b = h('button.tb-task', { type: 'button', class: `${w === active && !w.min ? 'on' : ''} ${w.min ? 'min' : ''}`, style: { '--app': w.meta.color }, dataset: { app: w.id }, 'aria-label': w.meta.name }, h('span', w.meta.icon), h('span.tb-task-name', w.meta.name));
      onTap(b, () => {
        if (w.min) restore(w);
        else if (w === topWin()) minimize(w);
        else focus(w);
      });
      tasks.appendChild(b);
    });
  }

  /* ---------------- Startmeny ---------------- */
  function toggleStart(force) {
    const showIt = force ?? startMenu.hidden;
    if (!showIt) {
      startMenu.hidden = true;
      return;
    }
    const p = kos.profile;
    const rank = rankFor(p.stars);
    const hidden = new Set(p.settings.hiddenApps || []);
    const appBtn = (a) => onTap(h('button.sm-app', { type: 'button', style: { '--app': a.color }, dataset: { app: a.id } }, h('span.sm-glyph', a.icon), h('span', a.name)), () => {
      toggleStart(false);
      open(a.id);
    });
    clear(startMenu).append(
      h('div.sm-head', h('span.who-avatar', { style: { background: p.color } }, p.avatar), h('div', h('b', p.name), h('div.rank.inline', h('span.rank-emoji', rank.emoji), h('div.rank-text', h('small', rank.title), h('span.rank-bar', h('i', { style: { width: `${Math.round(rank.progress * 100)}%` } })))))),
      h('small.sm-label', 'Appar'),
      h('div.sm-grid', APPS.filter((a) => !hidden.has(a.id)).map(appBtn)),
      h('small.sm-label', 'Verktyg'),
      h('div.sm-grid.tools', ACCESSORIES.map(appMeta).map(appBtn)),
      h(
        'div.sm-foot',
        onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '👋 Byt användare'), () => {
          toggleStart(false);
          confirmSwitch();
        }),
        onTap(h('button.btn.btn-ghost.btn-sm', { type: 'button' }, '⏻ Stäng av'), () => {
          toggleStart(false);
          shutdown();
        }),
      ),
    );
    startMenu.hidden = false;
    kos.sfx('pop');
  }

  function shutdown() {
    const s = h('div.boot.off', h('div.boot-logo', h('span.logo-mark.big', 'K'), h('b', 'Hej då!')), h('small', 'Stänger av …'));
    root.appendChild(s);
    kos.say(`Hej då ${kos.profile.name}!`);
    setTimeout(() => {
      s.remove();
      kos.logout();
      showLock();
    }, 1100);
  }

  /* ---------------- Fönsterhantering ---------------- */
  function topWin() {
    let best = null;
    wins.forEach((w) => {
      if (!w.min && (!best || w.z > best.z)) best = w;
    });
    return best;
  }

  function deskRect() {
    return { w: desk.clientWidth, h: desk.clientHeight };
  }

  function defaultRect() {
    const d = deskRect();
    const w = Math.min(d.w - 32, Math.max(560, Math.round(d.w * 0.74)), 980);
    const hh = Math.min(d.h - 24, Math.max(420, Math.round(d.h * 0.86)), 820);
    const off = (cascade++ % 5) * 30;
    const iconsW = d.w >= 900 ? 120 : 0;
    return { x: Math.min(d.w - w - 8, iconsW + 16 + off), y: Math.min(d.h - hh - 8, 10 + off), w, h: hh };
  }

  function applyRect(w) {
    const r = w.rect;
    Object.assign(w.el.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
  }

  function clampWin(w) {
    const d = deskRect();
    w.rect.w = Math.min(w.rect.w, d.w);
    w.rect.h = Math.min(w.rect.h, d.h);
    w.rect.x = Math.max(-w.rect.w + 120, Math.min(d.w - 120, w.rect.x));
    w.rect.y = Math.max(0, Math.min(d.h - 56, w.rect.y));
    applyRect(w);
    w.el.classList.toggle('max', w.max || phone());
  }

  function open(appId, moduleId = null, opts = {}, fromEl = null) {
    const meta = appMeta(appId);
    if (!meta) return;
    let w = wins.get(appId);
    if (w) {
      if (moduleId) w.app.navigate(moduleId, opts);
      restore(w);
      return w;
    }
    w = createWin(appId, meta, fromEl);
    w.app = mountApp(w.host, appId, moduleId, opts);
    return w;
  }

  function createWin(appId, meta, fromEl) {
    const titleEl = h('div.dwin-title');
    const backSlot = h('span.back-slot');
    const lvlSlot = h('span.lvl-slot');
    const btn = (cls, label, txt) => h(`button.dwin-btn.${cls}`, { type: 'button', 'aria-label': label }, txt);
    const minB = btn('min', 'Minimera', '–');
    const maxB = btn('max', 'Maximera', '□');
    const closeB = btn('close', 'Stäng', '✕');
    const bar = h('div.dwin-bar', backSlot, titleEl, lvlSlot, h('div.dwin-ctrl', minB, maxB, closeB));
    const content = h('div.dwin-content.win-content');
    const grip = h('div.dwin-grip', { 'aria-hidden': 'true' });
    const el = h('section.dwin', { style: { '--app': meta.color }, dataset: { app: appId }, role: 'dialog', 'aria-label': meta.name }, bar, content, grip);
    const w = { id: appId, meta, el, content, z: ++z, min: false, max: false, rect: defaultRect() };
    w.host = {
      content,
      setHead({ title, icon, back, levelAppId }) {
        clear(titleEl).append(h('span.win-icon', icon), h('span.dwin-name', title));
        clear(backSlot);
        if (back) backSlot.appendChild(onTap(h('button.dwin-btn.back', { type: 'button', 'aria-label': 'Tillbaka' }, '‹'), back));
        clear(lvlSlot);
        const lvl = levelAppId ? kos.levelInfo(levelAppId) : null;
        if (lvl) lvlSlot.appendChild(h('span.level-chip', { title: lvl.school }, `${lvl.emoji} ${lvl.short}`));
        content.scrollTop = 0;
      },
      close: () => close(w),
      openApp: (a, m) => open(a, m),
      reload: () => {
        w.app.destroy();
        clear(content);
        w.app = mountApp(w.host, appId, null);
      },
    };
    el.style.zIndex = w.z;
    applyRect(w);
    if (phone()) el.classList.add('max');
    // öppningsanimation från ikonen
    if (fromEl && !reducedMotion()) {
      const fr = fromEl.getBoundingClientRect();
      const dr = desk.getBoundingClientRect();
      el.style.transformOrigin = `${fr.left + fr.width / 2 - dr.left - w.rect.x}px ${fr.top + fr.height / 2 - dr.top - w.rect.y}px`;
    }
    el.classList.add('opening');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('opening')));
    winLayer.appendChild(el);
    wins.set(appId, w);
    el.addEventListener('pointerdown', () => focus(w), true);
    onTap(minB, () => minimize(w), { guardMs: 200 });
    onTap(maxB, () => toggleMax(w), { guardMs: 200 });
    onTap(closeB, () => close(w), { guardMs: 200 });
    dragTitle(w, bar);
    resizeGrip(w, grip);
    const ro = new ResizeObserver(() => {
      clearTimeout(w.rt);
      w.rt = setTimeout(() => window.dispatchEvent(new Event('resize')), 180);
    });
    ro.observe(content);
    w.ro = ro;
    focus(w);
    kos.sfx('whoosh');
    return w;
  }

  function dragTitle(w, bar) {
    let start = null;
    let lastTap = 0;
    bar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || w.max || phone()) return;
      start = { x: e.clientX, y: e.clientY, rx: w.rect.x, ry: w.rect.y, moved: false };
      bar.setPointerCapture?.(e.pointerId);
    });
    bar.addEventListener('pointermove', (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!start.moved && Math.hypot(dx, dy) < 6) return;
      start.moved = true;
      w.el.classList.add('dragging');
      w.rect.x = start.rx + dx;
      w.rect.y = start.ry + dy;
      clampWin(w);
    });
    const end = (e) => {
      if (start && !start.moved && !e.target.closest('button')) {
        const now = performance.now();
        if (now - lastTap < 380) toggleMax(w); // dubbeltryck på titelraden
        lastTap = now;
      }
      start = null;
      w.el.classList.remove('dragging');
    };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
    bar.addEventListener('dblclick', (e) => {
      if (!e.target.closest('button') && !phone()) toggleMax(w);
    });
  }

  function resizeGrip(w, grip) {
    let start = null;
    grip.addEventListener('pointerdown', (e) => {
      if (w.max || phone()) return;
      e.preventDefault();
      e.stopPropagation();
      start = { x: e.clientX, y: e.clientY, w: w.rect.w, h: w.rect.h };
      grip.setPointerCapture?.(e.pointerId);
      w.el.classList.add('dragging');
    });
    grip.addEventListener('pointermove', (e) => {
      if (!start) return;
      const d = deskRect();
      w.rect.w = Math.max(340, Math.min(d.w - w.rect.x, start.w + e.clientX - start.x));
      w.rect.h = Math.max(280, Math.min(d.h - w.rect.y, start.h + e.clientY - start.y));
      applyRect(w);
    });
    const end = () => {
      start = null;
      w.el.classList.remove('dragging');
    };
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
  }

  function focus(w) {
    if (topWin() === w && w.el.classList.contains('active')) return;
    w.z = ++z;
    w.el.style.zIndex = w.z;
    wins.forEach((x) => x.el.classList.toggle('active', x === w));
    renderTasks();
  }

  function minimize(w) {
    w.min = true;
    w.el.classList.add('minimized');
    kos.sfx('whoosh');
    const next = topWin();
    if (next) focus(next);
    renderTasks();
  }

  function restore(w) {
    w.min = false;
    w.el.classList.remove('minimized');
    focus(w);
    renderTasks();
  }

  function toggleMax(w) {
    w.max = !w.max;
    w.el.classList.toggle('max', w.max || phone());
    w.el.querySelector('.dwin-btn.max').textContent = w.max ? '❐' : '□';
    kos.sfx('click');
  }

  function destroyWin(w) {
    try {
      w.app?.destroy();
    } catch (e) {
      console.error(e);
    }
    w.ro?.disconnect();
    w.el.remove();
  }

  function close(w) {
    w.el.classList.add('closing');
    kos.stopSpeaking();
    setTimeout(() => destroyWin(w), 180);
    wins.delete(w.id);
    const next = topWin();
    if (next) focus(next);
    renderTasks();
    renderWidgets();
    renderTray();
  }

  return { show, hide, open, closeAll: () => wins.forEach((w) => close(w)), get windows() { return [...wins.keys()]; } };
}
