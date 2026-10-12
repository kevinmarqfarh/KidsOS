// Ren logik för systemapparna (Miniräknaren och Anteckningar) – utan DOM, så att den kan enhetstestas i node.

export const NOTE_IDEAS = [
  'Vad gjorde du i dag?',
  'Skriv om ditt favoritdjur.',
  'Hitta på en saga som börjar med "Det var en gång …"',
  'Vad vill du bli när du blir stor?',
  'Skriv en inköpslista till en picknick.',
  'Skriv ett brev till någon du tycker om.',
  'Vad skulle du göra om du var osynlig en dag?',
  'Beskriv ditt rum så att någon annan kan rita det.',
];

/** Antal ord (bokstäver/siffror i följd, även å, ä, ö). */
export function countWords(text) {
  return (String(text ?? '').match(/[\p{L}\p{N}]+/gu) || []).length;
}

const MAX_EXPR = 200;

/** Delar upp ett uttryck i tal, operatorer och parenteser. Kastar 'fel' vid okända tecken. */
export function tokenize(expr) {
  const s = String(expr ?? '')
    .replace(/,/g, '.')
    .replace(/−/g, '-');
  if (s.length > MAX_EXPR) throw new Error('fel');
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const rest = s.slice(i);
    const num = /^(\d+(?:\.\d*)?|\.\d+)/.exec(rest);
    if (num) {
      tokens.push(num[0]);
      i += num[0].length;
      continue;
    }
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if ('+-×÷*/()'.includes(c)) {
      tokens.push(c);
      i++;
      continue;
    }
    throw new Error('fel'); // bokstäver, flera kommatecken i ett tal, kod … allt annat är ogiltigt
  }
  return tokens;
}

/**
 * Säker uträkning av + − × ÷ med rätt prioritet och parenteser (ingen eval).
 * Returnerar null för tomt uttryck. Kastar Error('noll') vid division med noll och Error('fel') annars.
 */
export function calculate(expr) {
  const tokens = tokenize(expr);
  if (!tokens.length) return null;
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  // uttryck := term (('+'|'-') term)*
  function expression(depth) {
    let v = term(depth);
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const b = term(depth);
      v = op === '+' ? v + b : v - b;
    }
    return v;
  }
  // term := faktor (('×'|'*'|'÷'|'/') faktor)*
  function term(depth) {
    let v = factor(depth);
    while (peek() && '×*÷/'.includes(peek())) {
      const op = next();
      const b = factor(depth);
      if (op === '×' || op === '*') v *= b;
      else {
        if (b === 0) throw new Error('noll');
        v /= b;
      }
    }
    return v;
  }
  // faktor := '-' faktor | '+' faktor | tal | '(' uttryck ')'
  function factor(depth) {
    if (depth > 50) throw new Error('fel');
    const t = next();
    if (t === undefined) throw new Error('fel');
    if (t === '-') return -factor(depth + 1);
    if (t === '+') return factor(depth + 1);
    if (t === '(') {
      const v = expression(depth + 1);
      if (next() !== ')') throw new Error('fel');
      return v;
    }
    if (/^[\d.]/.test(t)) return Number(t);
    throw new Error('fel');
  }

  const result = expression(0);
  if (pos !== tokens.length) throw new Error('fel');
  if (!Number.isFinite(result)) throw new Error('fel');
  const rounded = Math.round(result * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/** Talet som visas och läses upp: decimalkomma och riktigt minustecken. */
export function formatNumber(n) {
  return String(n).replace('.', ',').replace('-', '−');
}

/** Läsbar text för uppläsning av ett uttryck. */
export function speakExpr(s) {
  return String(s)
    .replace(/[−-]/g, ' minus ')
    .replace(/\+/g, ' plus ')
    .replace(/[×*]/g, ' gånger ')
    .replace(/[÷/]/g, ' delat med ')
    .replace(/\./g, ',');
}

/** Får tangenten läggas till uttrycket? Hindrar t.ex. två kommatecken i samma tal och två operatorer i rad. */
export function canAppend(expr, key) {
  const last = expr.slice(-1);
  const isOp = (c) => '+−×÷'.includes(c);
  if (key === ',') {
    const cur = /[\d,]*$/.exec(expr)[0];
    return !cur.includes(',');
  }
  if (isOp(key)) {
    if (!expr) return key === '−'; // negativt tal i början
    if (last === ',') return false;
    if (isOp(last)) return key === '−' && last !== '−'; // t.ex. 5×−2
    return true;
  }
  return true;
}
