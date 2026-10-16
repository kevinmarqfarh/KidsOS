// Kompatibilitet med Safari 15.0–16.x (äldre iPad 9,7"). Vaktar mot syntax, API:er och CSS
// som får hela appen eller delar av layouten att gå sönder på barnens iPad.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { build } from 'esbuild';
import postcss from 'postcss';
import { legacySafariFallbacks, simulateLegacy, SUPPORTS, VIEWPORT_SUPPORTS, CQ_SUPPORTS, CONTAINER_FALLBACK, RISKY_SELECTOR } from '../../scripts/css-compat.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const walk = (dir, ext) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : [];
});
const POLYFILLS = join(root, 'src/core/polyfills.js');
const sources = walk(join(root, 'src'), '.js').filter((p) => p !== POLYFILLS && !p.includes(`${join('src', 'generated')}`));
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');

let bundleText;
async function bundleJs() {
  bundleText ??= (await build({ entryPoints: [join(root, 'src/main.js')], bundle: true, format: 'iife', minify: true, write: false, target: ['safari15', 'chrome90', 'firefox90'], logLevel: 'silent' })).outputFiles[0].text;
  return bundleText;
}
let cssText;
async function bundleCss() {
  cssText ??= legacySafariFallbacks((await build({ entryPoints: [join(root, 'src/styles/index.css')], bundle: true, minify: true, write: false, loader: { '.css': 'css' }, target: ['safari15'], logLevel: 'silent' })).outputFiles[0].text);
  return cssText;
}

// Syntax som Safari < 16.4 inte kan läsa: ett enda fel stoppar HELA skriptet (vit skärm).
// esbuild gör om regex-lookbehind till new RegExp("(?<=…") – det kraschar ändå när det körs.
const FATAL = [[/\(\?<[=!]/, 'regex-lookbehind (?<= / (?<! – Safari 16.4']];
test('bundeln innehåller ingen syntax som Safari 15 inte kan tolka', async () => {
  const js = await bundleJs();
  assert.doesNotMatch(js, FATAL[0][0], FATAL[0][1]);
  assert.doesNotMatch(js, /\bstatic\s*\{/, 'class static block – Safari 16.4 (ska sänkas av esbuild)');
  for (const file of sources) assert.doesNotMatch(readFileSync(file, 'utf8'), FATAL[0][0], `${relative(root, file)}: ${FATAL[0][1]}`);
});

test('den byggda dist/index.html (om den finns) har inte lookbehind eller static-block', () => {
  let html;
  try { html = readFileSync(join(root, 'dist/index.html'), 'utf8'); } catch { return; }
  const js = html.slice(html.lastIndexOf('<script>'));
  assert.doesNotMatch(js, FATAL[0][0], FATAL[0][1]);
  assert.doesNotMatch(js, /\bstatic\s*\{/, 'class static block');
});

// API:er som saknas i Safari 15.0. Antingen polyfill (måste finnas i polyfills.js) eller förbjudet.
const POLYFILLED = { '.at(': 'at', 'findLast': 'findLast', 'Object.hasOwn': 'hasOwn' };
const FORBIDDEN = [
  [/\bstructuredClone\s*\(/, 'structuredClone – Safari 15.4'],
  [/\.(toSorted|toReversed|toSpliced)\s*\(/, 'Array.prototype.toSorted/toReversed/toSpliced – Safari 16'],
  [/\.with\(\s*-?\d+\s*,/, 'Array.prototype.with – Safari 16'],
  [/\b(Object|Map)\.groupBy\b|\.group(ToMap)?\(/, 'groupBy – Safari 17.4'],
  [/\bAbortSignal\.(timeout|any)\b/, 'AbortSignal.timeout/any – Safari 16/17.4'],
  [/\bPromise\.withResolvers\b/, 'Promise.withResolvers – Safari 17.4'],
  [/\bArray\.fromAsync\b/, 'Array.fromAsync – Safari 16.4'],
  [/\.(union|intersection|difference|symmetricDifference|isSubsetOf)\(/, 'Set-metoder – Safari 17'],
  [/\.checkVisibility\(/, 'checkVisibility – Safari 17.4'],
];
// Får användas, men bara bakom en funktionskontroll (typeof/?./in).
const GUARDED = [
  [/requestIdleCallback\s*\(/, /typeof\s+requestIdleCallback|requestIdleCallback\s*\?\.|'requestIdleCallback'\s+in/, 'requestIdleCallback – saknas i Safari'],
  [/\.showModal\s*\(/, /typeof\s+\w+\.showModal|\.showModal\?\./, 'HTMLDialogElement.showModal – Safari 15.4'],
  [/getCoalescedEvents\s*\(/, /getCoalescedEvents\s*\?\.|\.getCoalescedEvents\s*\?/, 'getCoalescedEvents – saknas i Safari'],
  [/randomUUID\s*\(/, /randomUUID\s*\?\.|typeof\s+crypto/, 'crypto.randomUUID – Safari 15.4'],
  [/navigator\.wakeLock\.request/, /wakeLock\?\.|'wakeLock'\s+in/, 'navigator.wakeLock – Safari 16.4'],
  [/new\s+BroadcastChannel\b/, /typeof\s+BroadcastChannel/, 'BroadcastChannel – Safari 15.4'],
  [/new\s+(?:webkit)?SpeechRecognition\b/, /SpeechRecognition\s*\|\||typeof\s+\w*SpeechRecognition/, 'SpeechRecognition – saknas i Safari'],
  [/requestFullscreen\s*\(/, /requestFullscreen\s*\?\./, 'requestFullscreen – iPad före 16.4 bara med webkit-prefix'],
];

test('källkoden använder inga API:er som saknas i Safari 15.0', () => {
  const problems = [];
  for (const file of sources) {
    const src = stripComments(readFileSync(file, 'utf8'));
    const name = relative(root, file);
    for (const [re, why] of FORBIDDEN) if (re.test(src)) problems.push(`${name}: ${why}`);
    // Kontrollen får stå på samma rad eller någon annanstans i filen (t.ex. const native = typeof …).
    for (const [use, guard, why] of GUARDED) if (use.test(src) && !guard.test(src)) problems.push(`${name}: ${why} utan kontroll`);
  }
  assert.deepEqual(problems, []);
});

test('API:er med polyfill finns i polyfills.js, som laddas först i main.js', () => {
  const poly = readFileSync(POLYFILLS, 'utf8');
  const used = new Set();
  for (const file of sources) {
    const src = stripComments(readFileSync(file, 'utf8'));
    for (const [needle, name] of Object.entries(POLYFILLED)) if (src.includes(needle)) used.add(name);
  }
  for (const name of used) assert.match(poly, new RegExp(`define\\([^,]+,\\s*'${name}'`), `polyfill för ${name} saknas`);
  const firstImport = readFileSync(join(root, 'src/main.js'), 'utf8').match(/^import\s+[^;]+;/m)?.[0] || '';
  assert.match(firstImport, /core\/polyfills\.js/, 'polyfills.js måste vara första importen i main.js');
});

test('polyfillerna fungerar i en miljö utan at/findLast/hasOwn', () => {
  const ctx = vm.createContext({});
  vm.runInContext('delete Array.prototype.at; delete String.prototype.at; delete Array.prototype.findLast; delete Array.prototype.findLastIndex; delete Object.hasOwn; delete Object.getPrototypeOf(Int8Array.prototype).at;', ctx);
  vm.runInContext(readFileSync(POLYFILLS, 'utf8'), ctx);
  const r = vm.runInContext(`JSON.stringify([[1,2,3].at(-1), [1,2,3].at(0), [1].at(5), 'abc'.at(-1), new Int8Array([4,5]).at(-1),
    [1,2,3,4].findLast(x => x % 2), [1,2,3].findLastIndex(x => x > 5), Object.hasOwn({a:1}, 'a'), Object.hasOwn({}, 'toString'),
    Object.keys(Array.prototype).includes('at')])`, ctx);
  assert.deepEqual(JSON.parse(r), [3, 1, null, 'c', 5, 3, -1, true, false, false]);
});

// ------------------------------- CSS --------------------------------------------------------
const norm = (s) => s.replace(/\s/g, '').toLowerCase();
const insideSupports = (node, params) => {
  for (let p = node.parent; p; p = p.parent) if (p.type === 'atrule' && p.name === 'supports' && norm(p.params) === norm(params)) return true;
  return false;
};

test('modern CSS ligger bakom @supports med reserv för Safari 15', async () => {
  const ast = postcss.parse(await bundleCss());
  const problems = [];
  ast.walkDecls((d) => {
    const where = `${d.parent.selector || d.parent.name}{${d.prop}:${d.value}}`;
    if (/color-mix\(/i.test(d.value) && !insideSupports(d, SUPPORTS) && !/keyframes/.test(d.parent.parent?.name || '')) problems.push(`color-mix utan @supports: ${where}`);
    if (/\d[dsl]v(h|w|min|max)\b/i.test(d.value) && !insideSupports(d, VIEWPORT_SUPPORTS)) problems.push(`dvh/svh/lvh utan reserv: ${where}`);
    if (/\dcq(w|h|i|b|min|max)\b/i.test(d.value) && !insideSupports(d, CQ_SUPPORTS)) problems.push(`cq-enhet utan reserv: ${where}`);
    if (/\b(oklch|oklab|lab|lch|light-dark)\(|\bcolor\(\s*(srgb|display-p3)|from\s+var\(/i.test(d.value) && !d.parent.parent?.params?.includes('supports')) problems.push(`ny färgsyntax: ${where}`);
    if (d.prop === 'backdrop-filter' && !d.parent.nodes.some((n) => n.prop === '-webkit-backdrop-filter')) problems.push(`backdrop-filter utan -webkit-: ${where}`);
    if (/^mask(-image|-size|-position|-repeat)?$/.test(d.prop) && !d.parent.nodes.some((n) => n.prop === `-webkit-${d.prop}`)) problems.push(`mask utan -webkit-: ${where}`);
  });
  ast.walkAtRules((at) => {
    if (at.name === 'layer' || at.name === 'property' || at.name === 'starting-style' || at.name === 'scope') problems.push(`@${at.name} stöds inte i Safari 15`);
  });
  ast.walkRules((rule) => {
    if (/(^|[\s,>+~])&/.test(rule.selector)) problems.push(`CSS-nesting kvar: ${rule.selector}`);
    const sels = rule.selectors;
    const risky = sels.filter((s) => RISKY_SELECTOR.test(s)).length;
    if (risky && risky < sels.length) problems.push(`selektorlista med :has/:fullscreen/:focus-visible kastas helt i Safari 15: ${rule.selector}`);
  });
  assert.deepEqual(problems, []);
});

test('varje @container har en @media-reserv och :fullscreen har -webkit-kopia', async () => {
  const ast = postcss.parse(await bundleCss());
  ast.walkAtRules('container', (at) => {
    const next = at.next();
    assert.ok(next?.type === 'atrule' && norm(next.params) === norm(CONTAINER_FALLBACK) && next.first?.name === 'media', `@container ${at.params} saknar reserv`);
  });
  const css = await bundleCss();
  for (const m of css.matchAll(/([^{}]*):fullscreen[^{]*\{/g)) assert.ok(css.includes(`${m[1]}:-webkit-full-screen`), `${m[1]}:fullscreen saknar :-webkit-full-screen`);
});

test('legacy-simulering tar bort det moderna men behåller reserverna', async () => {
  const legacy = simulateLegacy(await bundleCss());
  assert.doesNotMatch(legacy, /color-mix\(|\d[dsl]vh\b|\dcqw\b|@container|:has\(|:focus-visible|:fullscreen/);
  assert.match(legacy, /:-webkit-full-screen/);
  assert.match(legacy, /\.kidsos-root\{[^}]*height:var\(--app-height,100vh\)/);
});
