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
      const fb = stripColorMix(decl.value);
      if (inKeyframes) {
        decl.value = fb;
        return;
      }
      modern.push(decl.clone());
      decl.value = fb;
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

/** Simulerar en gammal Safari: tar bort alla @supports(color-mix)-block (för tester och skärmbilder). */
export function simulateLegacy(css) {
  const rootNode = postcss.parse(css);
  rootNode.walkAtRules('supports', (at) => {
    if (at.params.replace(/\s/g, '') === SUPPORTS.replace(/\s/g, '')) at.remove();
  });
  return rootNode.toString();
}
