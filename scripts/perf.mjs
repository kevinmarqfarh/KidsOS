// Prestandamätning av dist/index.html i Chromium med CPU-strypning (simulerar en äldre iPad).
// Kör: node scripts/perf.mjs [fil.html] [--runs=3] [--throttle=6] [--json]
// Mäter: tid till hemskärm (inloggad profil), JS-parse/kompilering, skriptkörning, JS-heap och
// renderarens RSS (Linux), samt tid för att öppna några appar.
import { chromium } from 'playwright-core';
import { existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, def) => Number((args.find((a) => a.startsWith(`--${name}=`)) || '').split('=')[1] || def);
// Flera filer mäts omväxlande (A, B, A, B …) så att störningar från andra processer slår lika.
const files = (args.filter((a) => !a.startsWith('--')).length ? args.filter((a) => !a.startsWith('--')) : [join(root, 'dist/index.html')]).map((f) => resolve(f));
const RUNS = opt('runs', 3);
const THROTTLE = opt('throttle', 6);
const exe = [process.env.CHROME_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/usr/bin/chromium'].filter(Boolean).find((p) => existsSync(p));
const IPAD = { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'sv-SE' };
const APPS_TO_OPEN = [['wonder', null], ['space', null], ['math', null], ['trophies', null]];

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const mb = (b) => Math.round((b / 1048576) * 10) / 10;

function rendererRssMb(browserPid) {
  try {
    // Summera RSS för alla renderarprocesser under webbläsaren (bara en flik är öppen).
    const out = execSync(`ps -eo pid,ppid,rss,args`, { encoding: 'utf8' });
    const rows = out.split('\n').slice(1).map((l) => l.trim().split(/\s+/)).filter((r) => r.length > 3);
    const kids = new Set([String(browserPid)]);
    let grew = true;
    while (grew) { grew = false; for (const r of rows) if (kids.has(r[1]) && !kids.has(r[0])) { kids.add(r[0]); grew = true; } }
    return Math.round(rows.filter((r) => kids.has(r[0]) && r.join(' ').includes('--type=renderer')).reduce((s, r) => s + Number(r[2]), 0) / 1024);
  } catch { return null; }
}

async function seedProfile(page, URL) {
  await page.goto(URL);
  await page.waitForFunction(() => window.kidsos);
  await page.evaluate(() => {
    const k = window.kidsos.kos;
    const p = k.createProfile({ name: 'Mätbarn', age: 6 });
    p.settings.layout = 'tablet';
    k.login(p.id);
    k.saveNow();
  });
  await page.goto('about:blank');
}

async function oneRun(browser, browserPid, URL) {
  const ctx = await browser.newContext(IPAD);
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  await seedProfile(page, URL);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
  // Spårning för parse-/kompileringstid.
  const events = [];
  cdp.on('Tracing.dataCollected', (e) => events.push(...e.value));
  const traced = new Promise((r) => cdp.once('Tracing.tracingComplete', r));
  await cdp.send('Tracing.start', { categories: 'devtools.timeline,v8,disabled-by-default-v8.compile', transferMode: 'ReportEvents' });
  const t0 = Date.now();
  await page.goto(URL, { waitUntil: 'commit' });
  await page.waitForSelector('.home', { timeout: 120000 });
  const wall = Date.now() - t0;
  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    const home = performance.now();
    return { dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, home };
  });
  await page.waitForTimeout(1500); // låt lata bilder och animationer starta
  await cdp.send('Tracing.end');
  await traced;
  const sum = (pred, f = 'dur') => Math.round(events.filter((e) => e.ph === 'X' && pred(e)).reduce((s, e) => s + (e[f] || 0), 0) / 1000);
  // tdur = trådens CPU-tid (utan strypningens pauser och utan väntan på andra processer): stabilare än väggklocka.
  const cpuHtml = sum((e) => e.name === 'ParseHTML', 'tdur');
  const cpuParse = sum((e) => /^(v8\.compile|V8\.CompileCode|v8\.parseOnBackground|V8\.ParseProgram|V8\.ScriptCompiler|v8\.compileModule)$/.test(e.name), 'tdur');
  const parse = sum((e) => /^(v8\.compile|V8\.CompileCode|v8\.parseOnBackground|V8\.ParseProgram|V8\.ScriptCompiler|v8\.compileModule)$/.test(e.name));
  const evalScript = sum((e) => e.name === 'EvaluateScript' || e.name === 'v8.run');
  const htmlParse = sum((e) => e.name === 'ParseHTML');
  const metrics = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  await cdp.send('HeapProfiler.enable');
  await cdp.send('HeapProfiler.collectGarbage');
  const heapStart = (await page.evaluate(() => performance.memory?.usedJSHeapSize || 0));
  const rssStart = rendererRssMb(browserPid);

  const appTimes = {};
  const appTask = {}; // huvudtrådens arbete (TaskDuration) från openApp till två bildrutor senare
  for (const [app, mod] of APPS_TO_OPEN) {
    await page.evaluate(() => window.kidsos.goHome());
    await page.waitForSelector('.home');
    const before = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
    const ms = await page.evaluate(async ([a, m]) => {
      const t = performance.now();
      window.kidsos.openApp(a, m);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return performance.now() - t;
    }, [app, mod]);
    const after = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
    appTimes[app] = Math.round(ms);
    appTask[app] = Math.round((after.TaskDuration - before.TaskDuration) * 1000);
    await page.waitForTimeout(800);
  }
  await cdp.send('HeapProfiler.collectGarbage');
  const heapAfter = await page.evaluate(() => performance.memory?.usedJSHeapSize || 0);
  const rssAfter = rendererRssMb(browserPid);
  await ctx.close();
  return {
    wall, dcl: Math.round(nav.dcl), home: Math.round(nav.home), parse, evalScript, htmlParse, cpuHtml, cpuParse,
    scriptDuration: Math.round(metrics.ScriptDuration * 1000), taskDuration: Math.round(metrics.TaskDuration * 1000),
    heapStartMb: mb(heapStart), heapAfterAppsMb: mb(heapAfter), rssStartMb: rssStart, rssAfterAppsMb: rssAfter, nodes: metrics.Nodes, appTimes, appTask,
  };
}

const server = await chromium.launchServer({ executablePath: exe, args: ['--enable-precise-memory-info'] });
const browserPid = server.process().pid;
const browser = await chromium.connect(server.wsEndpoint());
const all = files.map(() => []);
for (let i = 0; i < RUNS; i++) for (const [n, f] of files.entries()) all[n].push(await oneRun(browser, browserPid, `file://${f}`));
await browser.close();
await server.close();

for (const [n, file] of files.entries()) {
  const runs = all[n];
  const keys = Object.keys(runs[0]).filter((k) => typeof runs[0][k] !== 'object');
  const result = { file: file.split('/').pop(), ...Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))])) };
  for (const obj of ['appTimes', 'appTask']) result[obj] = Object.fromEntries(Object.keys(runs[0][obj]).map((a) => [a, median(runs.map((r) => r[obj][a]))]));
  result.fileMb = mb(statSync(file).size);
  result.throttle = THROTTLE;
  result.runs = RUNS;
  if (args.includes('--json')) console.log(JSON.stringify(result));
  else console.log(result);
}
