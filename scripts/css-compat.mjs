// Gör den byggda CSS:en tålig för äldre Safari (iPad med iPadOS 15/16.1 och äldre).
//
// Problemet: color-mix() stöds först från Safari 16.2. När ett värde innehåller var() godtar
// webbläsaren deklarationen när den läses in, men den blir ogiltig först när den räknas ut.
// Då används inte heller en reservdeklaration som står före – egenskapen blir "unset".
// Resultatet på en gammal iPad: rubrikrader utan färg (vit text på vitt) och osynliga
// bokstavsmallar i Skriv ABC.
//
// Lösningen: varje deklaration med color-mix() får en reservdeklaration där color-mix(...)
// byts mot den mest betydelsefulla färgen, och originalet flyttas in i
// @supports (color: color-mix(in srgb, red 50%, blue)) så att bara moderna webbläsare ser det.
import postcss from 'postcss';

export const SUPPORTS = '(color:color-mix(in srgb,red 50%,blue))';

const NEUTRAL = /^(transparent|white|#fff(fff)?|black|#000(000)?|currentcolor)$/i;

/** Hittar color-mix( … ) med balanserade parenteser. Returnerar [start, slut] för första förekomsten. */
function findMix(value, from = 0) {
  const i = value.toLowerCase().indexOf('color-mix(', from);
  if (i < 0) return null;
  let depth = 0;
  for (let j = i + 'color-mix'.length; j < value.length; j++) {
    if (value[j] === '(') depth++;
    else if (value[j] === ')') {
      depth--;
      if (depth === 0) return [i, j + 1];
    }
  }
  return null;
}

/** Delar på kommatecken som inte ligger inuti parenteser. */
function splitTop(s) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Plockar ut färgen ur "var(--app) 60%" → { color: 'var(--app)', pct: 60 }. */
function colorPart(part) {
  const m = part.match(/^(.*?)(?:\s+(\d+(?:\.\d+)?)%)?$/s);
  return { color: (m?.[1] || part).trim(), pct: m?.[2] !== undefined ? Number(m[2]) : null };
}

/** Fast färg → [r, g, b, a] (hex, white, black, transparent). null för var() m.m. */
function literalColor(c) {
  const s = c.trim().toLowerCase();
  if (s === 'transparent') return [0, 0, 0, 0];
  if (s === 'white') return [255, 255, 255, 1];
  if (s === 'black') return [0, 0, 0, 1];
  const m = s.match(/^#([0-9a-f]{3,8})$/);
  if (!m || ![3, 4, 6, 8].includes(m[1].length)) return null;
  let hex = m[1];
  if (hex.length <= 4) hex = [...hex].map((ch) => ch + ch).join('');
  const n = (i) => parseInt(hex.slice(i, i + 2), 16);
  return [n(0), n(2), n(4), hex.length === 8 ? n(6) / 255 : 1];
}

/** Blandar två fasta färger som color-mix(in srgb) gör (förmultiplicerad alfa). */
function mixLiterals(a, b, p) {
  if (!a || !b) return null;
  const alpha = a[3] * p + b[3] * (1 - p);
  if (alpha === 0) return 'transparent';
  const ch = (i) => Math.round((a[i] * a[3] * p + b[i] * b[3] * (1 - p)) / alpha);
  const al = Math.round(alpha * 1000) / 1000;
  return al >= 1 ? `rgb(${ch(0)},${ch(1)},${ch(2)})` : `rgba(${ch(0)},${ch(1)},${ch(2)},${al})`;
}

/**
 * Ersättningsfärg för en color-mix: den "betydelsefulla" färgen (inte vitt/svart/transparent),
 * annars den som har störst andel.
 */
export function fallbackForMix(mix) {
  const inner = mix.slice(mix.indexOf('(') + 1, -1);
  const parts = splitTop(inner);
  // parts[0] är "in srgb" (eller annan färgrymd)
  const a = colorPart(parts[1] || '');
  const b = colorPart(parts[2] || '');
  const aPct = a.pct ?? (b.pct !== null ? 100 - b.pct : 50);
  // Två fasta färger (t.ex. #ff7a2f 60%, transparent) kan blandas exakt redan vid bygget.
  const exact = mixLiterals(literalColor(a.color), literalColor(b.color), aPct / 100);
  if (exact) return exact;
  // var(--x) N%, transparent med liten andel är en svag ton (tomma stjärnor, prickar, tips).
  // Hela färgen vore fel (tomma stjärnor ser fyllda ut), så använd en lika svag grå ton –
  // den fungerar både i dag- och nattläge.
  const tAlpha = /^transparent$/i.test(b.color) ? aPct : /^transparent$/i.test(a.color) ? 100 - aPct : null;
  if (tAlpha !== null && tAlpha < 50) return `rgba(128,128,128,${Math.round(tAlpha) / 100})`;
  const aNeutral = NEUTRAL.test(a.color);
  const bNeutral = NEUTRAL.test(b.color);
  if (aNeutral && !bNeutral) return b.color;
  if (bNeutral && !aNeutral) return a.color;
  return aPct >= 50 ? a.color : b.color;
}

/** Byter alla color-mix() i ett värde (även nästlade) mot reservfärger. */
export function stripColorMix(value) {
  let v = value;
  let guard = 0;
  while (guard++ < 200) {
    // ta den innersta först: sista förekomsten saknar nästlade color-mix inuti sig
    let last = null;
    let from = 0;
    for (;;) {
      const r = findMix(v, from);
      if (!r) break;
      last = r;
      from = r[0] + 1;
    }
    if (!last) break;
    const [s, e] = last;
    v = v.slice(0, s) + fallbackForMix(v.slice(s, e)) + v.slice(e);
  }
  return v;
}

/**
 * background: color-mix(in srgb, var(--x) N%, white|black) – en ljus/mörk ton av en variabel.
 * Utan color-mix går det ändå att få samma ton med ett genomskinligt vitt/svart lager ovanpå
 * färgen: linear-gradient(rgba(255,255,255,1-N), …), var(--x).
 */
function backgroundTint(decl) {
  if (decl.prop.toLowerCase() !== 'background') return null;
  const v = decl.value.trim().replace(/\s*!important$/i, '');
  const r = findMix(v);
  if (!r || r[0] !== 0 || r[1] !== v.length) return null;
  const parts = splitTop(v.slice(v.indexOf('(') + 1, -1));
  const a = colorPart(parts[1] || '');
  const b = colorPart(parts[2] || '');
  const aPct = a.pct ?? (b.pct !== null ? 100 - b.pct : 50);
  const [base, pct, other] = /^var\(/i.test(a.color) ? [a.color, aPct, b.color] : [b.color, 100 - aPct, a.color];
  if (!/^var\(/i.test(base) || !/^(white|#fff(fff)?|black|#000(000)?)$/i.test(other)) return null;
  const rgb = /^(white|#fff)/i.test(other) ? '255,255,255' : '0,0,0';
  const alpha = Math.round(100 - pct) / 100;
  const layer = `rgba(${rgb},${alpha})`;
  return `linear-gradient(${layer},${layer}),${base}${/!important$/i.test(decl.value.trim()) ? ' !important' : ''}`;
}

/** PostCSS-transform: reservdeklarationer + @supports för color-mix. */
export function colorMixFallbacks(css) {
  const rootNode = postcss.parse(css);
  const rules = [];
  rootNode.walkRules((rule) => rules.push(rule)); // samla först – nya regler ska inte besökas igen
  for (const rule of rules) {
    // regler inuti @keyframes har inga vanliga selektorer – där räcker en direkt ersättning
    const inKeyframes = rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name);
    const modern = [];
    rule.walkDecls((decl) => {
      if (decl.parent !== rule || !/color-mix\(/i.test(decl.value)) return;
      const fb = backgroundTint(decl) || stripColorMix(decl.value);
      if (inKeyframes) {
        decl.value = fb;
        return;
      }
      modern.push(decl.clone());
      // Har författaren skrivit en egen reserv direkt före (samma egenskap, utan color-mix)?
      // Då gäller den – ingen automatisk reserv som skriver över den.
      const prev = decl.prev();
      if (prev?.type === 'decl' && prev.prop === decl.prop && !/color-mix\(/i.test(prev.value)) decl.remove();
      else decl.value = fb;
    });
    if (modern.length) {
      const supports = postcss.atRule({ name: 'supports', params: SUPPORTS });
      const copy = postcss.rule({ selector: rule.selector });
      modern.forEach((d) => copy.append(d));
      supports.append(copy);
      rule.after(supports);
    }
  }
  return rootNode.toString();
}

// ---------------------------------------------------------------------------------------------
// Fler reserver för Safari 15.0–16.x (iPad 9,7"). Samma mönster som för color-mix: en
// reservdeklaration som gamla Safari förstår och originalet i @supports. Det behövs eftersom
// t.ex. var(--app-height,100dvh) godtas vid inläsning men blir "unset" när värdet räknas ut.

/** dvh/svh/lvh (Safari 15.4) → vh. */
export const VIEWPORT_SUPPORTS = '(height:100dvh)';
const VIEWPORT_UNIT = /(\d)[dsl]v(h|w|min|max)\b/gi;
export const stripViewportUnits = (value) => value.replace(VIEWPORT_UNIT, '$1v$2');

/** cqw/cqh/cqi … (Safari 16.0) → viewport-enheter. */
export const CQ_SUPPORTS = '(width:1cqw)';
const CQ_UNIT = /(\d)cq(w|h|i|b|min|max)\b/gi;
const CQ_MAP = { w: 'vw', i: 'vw', h: 'vh', b: 'vh', min: 'vmin', max: 'vmax' };
export const stripContainerUnits = (value) => value.replace(CQ_UNIT, (_, d, u) => d + CQ_MAP[u.toLowerCase()]);

/** Alla @supports-villkor som bygget lägger till (används av simulateLegacy). */
export const GENERATED_SUPPORTS = [SUPPORTS, VIEWPORT_SUPPORTS, CQ_SUPPORTS];
export const CONTAINER_FALLBACK = 'not (container-type:inline-size)';

/**
 * Generell transform: varje deklaration där test(value) slår till får ett reservvärde
 * (strip(value)) och originalet flyttas in i @supports <supports>.
 */
export function declFallbacks(rootNode, { test, strip, supports }) {
  const rules = [];
  rootNode.walkRules((rule) => rules.push(rule));
  for (const rule of rules) {
    const inKeyframes = rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name);
    const modern = [];
    rule.walkDecls((decl) => {
      if (decl.parent !== rule) return;
      test.lastIndex = 0;
      if (!test.test(decl.value)) return;
      const fb = strip(decl.value);
      if (fb === decl.value) return;
      if (!inKeyframes) modern.push(decl.clone());
      decl.value = fb;
    });
    if (modern.length) {
      const at = postcss.atRule({ name: 'supports', params: supports });
      const copy = postcss.rule({ selector: rule.selector });
      modern.forEach((d) => copy.append(d));
      at.append(copy);
      rule.after(at);
    }
  }
  return rootNode;
}

/**
 * Pseudoklasser som Safari 15.0 inte känner till. En okänd selektor gör att HELA regeln
 * (alla selektorer i listan) kastas, så de bryts ut till egna regler. :fullscreen (Safari 16.4)
 * får dessutom en kopia med :-webkit-full-screen.
 */
export const RISKY_SELECTOR = /:fullscreen|:has\(|:focus-visible|::backdrop|:modal\b|:user-(?:in)?valid|:popover-open/i;

export function splitRiskySelectors(rootNode) {
  const rules = [];
  rootNode.walkRules((rule) => rules.push(rule));
  for (const rule of rules) {
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) continue;
    const selectors = rule.selectors;
    const risky = selectors.filter((s) => RISKY_SELECTOR.test(s));
    const webkitFull = risky.filter((s) => /:fullscreen/i.test(s)).map((s) => s.replace(/:fullscreen/gi, ':-webkit-full-screen'));
    if (!risky.length || (risky.length === selectors.length && !webkitFull.length)) continue;
    let anchor = rule;
    const add = (sel) => {
      const copy = rule.clone({ selector: sel });
      anchor.after(copy);
      anchor = copy;
    };
    if (risky.length < selectors.length) {
      rule.selectors = selectors.filter((s) => !RISKY_SELECTOR.test(s));
      risky.forEach(add);
    }
    webkitFull.forEach(add);
  }
  return rootNode;
}

/**
 * Container queries (Safari 16.0): varje @container (max-width: …) får en kopia som
 * @media (…) inuti @supports not (container-type:inline-size). Fönstret fyller i stort sett
 * hela skärmen i surfplatte-läget, så skärmbredden är en bra uppskattning.
 */
export function containerQueryFallbacks(rootNode) {
  const ats = [];
  rootNode.walkAtRules('container', (at) => ats.push(at));
  for (const at of ats) {
    const query = at.params.replace(/^[a-z_-][\w-]*\s+(?=\()/i, '').trim(); // ta bort ev. containernamn
    if (!/^\((?:min-|max-)?width\s*:[^()]+\)(?:\s+and\s+\((?:min-|max-)?width\s*:[^()]+\))*$/i.test(query)) continue;
    const media = postcss.atRule({ name: 'media', params: query });
    at.each((node) => { media.append(node.clone()); });
    const sup = postcss.atRule({ name: 'supports', params: CONTAINER_FALLBACK });
    sup.append(media);
    at.after(sup);
  }
  return rootNode;
}

/** Alla reserver för äldre Safari i rätt ordning. */
export function legacySafariFallbacks(css) {
  const rootNode = postcss.parse(css);
  splitRiskySelectors(rootNode);
  containerQueryFallbacks(rootNode);
  declFallbacks(rootNode, { test: VIEWPORT_UNIT, strip: stripViewportUnits, supports: VIEWPORT_SUPPORTS });
  declFallbacks(rootNode, { test: CQ_UNIT, strip: stripContainerUnits, supports: CQ_SUPPORTS });
  return colorMixFallbacks(rootNode.toString());
}

const norm = (s) => s.replace(/\s/g, '').toLowerCase();

/**
 * Simulerar Safari 15.0 (för tester och skärmbilder): tar bort byggets @supports-block för
 * color-mix/dvh/cq, @container-regler och regler med okända pseudoklasser, och låter
 * reserverna för container queries gälla.
 */
export function simulateLegacy(css) {
  const rootNode = postcss.parse(css);
  const generated = GENERATED_SUPPORTS.map(norm);
  rootNode.walkAtRules('supports', (at) => {
    const p = norm(at.params);
    if (generated.includes(p)) at.remove();
    else if (p === norm(CONTAINER_FALLBACK)) at.replaceWith(at.nodes.slice());
  });
  rootNode.walkAtRules('container', (at) => at.remove());
  rootNode.walkRules((rule) => { if (RISKY_SELECTOR.test(rule.selector)) rule.remove(); });
  return rootNode.toString();
}
