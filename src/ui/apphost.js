// Appvärden: visar en app (hubb → modul) i en behållare. Används av både
// surfplatte-läget (ett fönster i taget) och dator-läget (många fönster).
import { h, clear, onTap } from './dom.js';
import { kos } from './kos.js';
import { appById, moduleById } from '../apps/registry.js';
import { LEVELS } from '../core/age.js';
import { moduleStat } from '../core/model.js';
import { runQuiz, effectiveLevel } from './quiz.js';
import { VIEWS } from './views/index.js';
import { SYSTEM_APPS } from './system.js';

/**
 * host = {
 *   content: HTMLElement,            // där appen ritas
 *   setHead({ title, icon, back, levelAppId }) // uppdatera titelrad
 *   close()                          // stäng fönstret
 * }
 * Returnerar ett objekt med navigate(moduleId) och destroy().
 */
export function mountApp(host, appId, moduleId = null, opts = {}) {
  let cleanup = null;
  const sys = SYSTEM_APPS[appId];
  const app = sys ? null : appById(appId);

  function teardown() {
    if (cleanup) {
      try {
        cleanup();
      } catch (e) {
        console.error(e);
      }
      cleanup = null;
    }
    kos.stopSpeaking();
  }

  function showSystem() {
    teardown();
    clear(host.content);
    host.setHead({ title: sys.name, icon: sys.icon });
    cleanup = sys.render(host.content, { host, opts, openApp: host.openApp }) || null;
  }

  function showHub() {
    teardown();
    clear(host.content);
    host.setHead({ title: app.name, icon: app.icon, levelAppId: app.id });
    const p = kos.profile;
    const level = kos.level(app.id);
    const showAll = p.settings.showAllModules;
    const tiles = app.modules.map((m, i) => {
      const locked = !showAll && level < (m.minLevel ?? 0);
      const st = moduleStat(p, app.id, m.id);
      const easy = m.maxLevel !== undefined && level > m.maxLevel + 1;
      const stars = h('span.mod-stars', [1, 2, 3].map((k) => h('i', { class: k <= st.best ? 'on' : '' }, '★')));
      const b = h(
        'button.mod-tile',
        { type: 'button', class: [locked ? 'locked' : '', m.photo ? 'has-photo' : ''].join(' '), style: { '--i': i }, dataset: { mod: m.id } },
        m.photo ? h('span.mod-photo', { html: m.photo() }) : null,
        h('span.mod-icon', m.icon),
        h('span.mod-name', m.name),
        locked ? h('span.mod-lock', `🔒 ${LEVELS[m.minLevel].short}`) : m.gen ? stars : h('span.mod-kind', '▶ Utforska'),
        easy && !locked ? h('span.mod-tag', 'Lätt') : null,
      );
      onTap(b, () => {
        if (locked) {
          kos.sfx('wrong');
          kos.say(`${m.name} låses upp när du når ${LEVELS[m.minLevel].short}. Fortsätt öva så kommer du dit!`);
          b.classList.add('wrong-shake');
          setTimeout(() => b.classList.remove('wrong-shake'), 500);
          return;
        }
        kos.sfx('pop');
        showModule(m.id);
      });
      return b;
    });
    host.content.append(h('div.hub', h('p.hub-tag', app.tagline), h('div.mod-grid', tiles)));
    kos.autoSay(`${app.name}. ${app.tagline}. Vad vill du göra?`);
  }

  function showModule(mid, mopts = {}) {
    const mod = moduleById(app, mid);
    if (!mod) return showHub();
    teardown();
    clear(host.content);
    const single = app.modules.length === 1;
    const back = single ? null : () => showHub();
    host.setHead({
      title: single ? app.name : mod.name,
      icon: single ? app.icon : mod.icon,
      back,
      levelAppId: mod.gen || ['robot', 'trace', 'stories'].includes(mod.view) ? app.id : null,
    });
    const exit = () => (single ? host.close() : showHub());
    if (mod.gen) cleanup = runQuiz(host.content, { app, module: mod, onExit: exit });
    else if (mod.view && VIEWS[mod.view]) cleanup = VIEWS[mod.view](host.content, { kos, app, module: mod, level: effectiveLevel(app, mod), back: exit, opts: mopts, host }) || null;
    else host.content.append(h('p', 'Kommer snart!'));
  }

  function navigate(mid, mopts) {
    if (sys) return showSystem();
    if (!mid && app.modules.length === 1) mid = app.modules[0].id;
    if (mid) showModule(mid, mopts);
    else showHub();
  }

  navigate(moduleId, opts);
  return { navigate, destroy: teardown, app: app || sys };
}

export function appMeta(appId) {
  return SYSTEM_APPS[appId] || appById(appId);
}
