import { aiApp } from './ai.js';
// Alla appar i den ordning de visas på hemskärmen.
import { mathApp } from './math.js';
import { svenskaApp } from './svenska.js';
import { writeApp } from './letters.js';
import { scienceApp } from './science.js';
import { biologyApp } from './biology.js';
import { spaceApp } from './space.js';
import { codeApp } from './code.js';
import { drawApp } from './draw.js';
import { wonderApp } from './wonder.js';
import { worldApp } from './world.js';
import { playApp } from './play.js';
import { feelingsApp } from './feelings.js';
import { DISCOVERY_LESSONS } from './discovery-lessons.js';
import { WORKSHOP_MODULES } from './workshops.js';
import { practiceModules } from './practice-activities.js';

export const APPS = [mathApp, svenskaApp, writeApp, scienceApp, biologyApp, spaceApp, worldApp, aiApp, codeApp, drawApp, wonderApp, playApp];
for (const app of APPS) {
  app.modules.push(...practiceModules(app.id), ...(WORKSHOP_MODULES[app.id] || []));
  app.lessons = DISCOVERY_LESSONS[app.id] || [];
  app.modules.push({ id: 'discover-course', name: 'Upptäck & lär', icon: '📖', minLevel: 0, view: 'course', lgr: [...new Set(app.lessons.flatMap(item => item.lgr))] });
}
APPS.push(feelingsApp);
export const appById = (id) => APPS.find((a) => a.id === id);
export const moduleById = (app, id) => app?.modules.find((m) => m.id === id);
