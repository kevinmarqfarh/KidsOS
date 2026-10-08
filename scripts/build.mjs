// Bygger KidsOS till självständiga HTML-filer (allt inbäddat):
//   dist/index.html    – fristående sida (öppna lokalt, lägg på valfri webbserver, "Lägg till på hemskärmen")
//   dist/artifact.html – samma innehåll utan <html>/<head>-skal (för publicering som Claude-artifact)
import { build, context } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const watch = process.argv.includes('--watch');

const FONTS = 'https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Baloo+2:wght@500;600;700;800&display=swap';
const ICON = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#3d8bfd"/><text x="50" y="70" font-size="62" text-anchor="middle" font-family="Arial Rounded MT Bold,Arial" font-weight="900" fill="#fff">K</text><circle cx="78" cy="24" r="10" fill="#ffc93c"/></svg>')}`;

async function bundle() {
  const js = await build({ entryPoints: [join(root, 'src/main.js')], bundle: true, format: 'iife', minify: true, write: false, target: ['safari14', 'chrome90', 'firefox90'], legalComments: 'none' });
  const css = await build({ entryPoints: [join(root, 'src/styles/app.css')], bundle: true, minify: true, write: false, loader: { '.css': 'css' }, target: ['safari14'] });
  const jsText = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const cssText = css.outputFiles[0].text;
  const body = `<title>KidsOS</title>
<meta name="description" content="KidsOS – ett lärande operativsystem för barn 4–10 år.">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="KidsOS">
<meta name="theme-color" content="#3d8bfd">
<link rel="icon" href="${ICON}">
<link rel="apple-touch-icon" href="${ICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>${cssText}</style>
<div id="kidsos" class="kidsos-root"><noscript>KidsOS behöver JavaScript.</noscript></div>
<script>${jsText}</script>`;
  const full = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
${body.split('<div id="kidsos"')[0]}</head>
<body>
<div id="kidsos"${body.split('<div id="kidsos"')[1]}
</body>
</html>
`;
  mkdirSync(join(root, 'dist'), { recursive: true });
  writeFileSync(join(root, 'dist/index.html'), full);
  writeFileSync(join(root, 'dist/artifact.html'), body + '\n');
  const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)} kB`;
  console.log(`✓ dist/index.html (${kb(full)})  ✓ dist/artifact.html (${kb(body)})`);
}

await bundle();
if (watch) {
  const { watch: fsWatch } = await import('node:fs');
  let t;
  fsWatch(join(root, 'src'), { recursive: true }, () => {
    clearTimeout(t);
    t = setTimeout(() => bundle().catch((e) => console.error(e.message)), 120);
  });
  console.log('Bevakar src/ …');
}
void context;
void readFileSync;
