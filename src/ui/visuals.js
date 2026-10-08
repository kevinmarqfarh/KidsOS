// Rena funktioner som bygger SVG/HTML-strängar för illustrationer.
// Inga beroenden till DOM – testbara i Node.

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** Emoji i grupper om fem (underlättar subitisering – att se antal utan att räkna). */
export function emojiGroup(emoji, n, { perRow = 5, size = 'm' } = {}) {
  const rows = [];
  for (let i = 0; i < n; i += perRow) {
    const cnt = Math.min(perRow, n - i);
    rows.push(`<div class="eg-row">${Array.from({ length: cnt }, () => `<span class="eg-item">${emoji}</span>`).join('')}</div>`);
  }
  return `<div class="emoji-group eg-${size}" role="img" aria-label="${n} st">${rows.join('')}</div>`;
}

/** Tiorams-ruta: 2 × 5 rutor, filled fyllda. */
export function tenFrame(filled, { color = '#ff6b5b', second = 0, color2 = '#4aa8ff' } = {}) {
  const cells = [];
  for (let i = 0; i < 10; i++) {
    const x = 6 + (i % 5) * 40;
    const y = 6 + Math.floor(i / 5) * 40;
    let dot = '';
    if (i < filled) dot = `<circle cx="${x + 18}" cy="${y + 18}" r="13" fill="${color}"/>`;
    else if (i < filled + second) dot = `<circle cx="${x + 18}" cy="${y + 18}" r="13" fill="${color2}"/>`;
    cells.push(`<rect x="${x}" y="${y}" width="36" height="36" rx="6" fill="#fff" stroke="#23324a" stroke-width="2.5"/>${dot}`);
  }
  return `<svg class="tenframe" viewBox="0 0 212 92" role="img" aria-label="tioram">${cells.join('')}</svg>`;
}

export function tenFrames(n, opts) {
  const frames = [];
  let left = n;
  do {
    frames.push(tenFrame(Math.min(10, left), opts));
    left -= 10;
  } while (left > 0);
  return `<div class="tenframes">${frames.join('')}</div>`;
}

/** Rader × kolumner med prickar – visar multiplikation som en rektangel. */
export function dotArray(rows, cols, color = '#4aa8ff') {
  const r = 11;
  const gap = 30;
  const w = cols * gap + 10;
  const hgt = rows * gap + 10;
  let dots = '';
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) dots += `<circle cx="${20 + j * gap}" cy="${20 + i * gap}" r="${r}" fill="${color}"/>`;
  return `<svg class="dotarray" viewBox="0 0 ${w} ${hgt}" style="max-width:${Math.min(100, cols * 9)}%" role="img" aria-label="${rows} rader med ${cols}">${dots}</svg>`;
}

/** Tiobasmaterial: hundraplattor, tiostavar och entalskuber. */
export function baseTen(n) {
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;
  let x = 4;
  let s = '';
  for (let i = 0; i < hundreds; i++) {
    s += `<rect x="${x}" y="4" width="60" height="60" rx="3" fill="#ffc93c" stroke="#b8860b" stroke-width="2"/>`;
    for (let k = 1; k < 10; k++) s += `<line x1="${x + k * 6}" y1="4" x2="${x + k * 6}" y2="64" stroke="#b8860b" stroke-width=".6"/><line x1="${x}" y1="${4 + k * 6}" x2="${x + 60}" y2="${4 + k * 6}" stroke="#b8860b" stroke-width=".6"/>`;
    x += 66;
  }
  for (let i = 0; i < tens; i++) {
    s += `<rect x="${x}" y="4" width="8" height="60" rx="2" fill="#3fb67a" stroke="#1d7a4c" stroke-width="1.5"/>`;
    x += 12;
  }
  x += 4;
  for (let i = 0; i < ones; i++) {
    const col = Math.floor(i / 5);
    const row = i % 5;
    s += `<rect x="${x + col * 12}" y="${4 + row * 12}" width="9" height="9" rx="1.5" fill="#ff6b5b" stroke="#a83a2f" stroke-width="1"/>`;
  }
  x += Math.ceil(ones / 5) * 12 + 4;
  return `<svg class="baseten" viewBox="0 0 ${Math.max(40, x)} 68" role="img" aria-label="${n} med tiobasmaterial">${s}</svg>`;
}

const HOUR_WORDS = ['tolv', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv'];
export function hourWord(h) {
  return HOUR_WORDS[((h % 12) + 12) % 12 === 0 ? 12 : ((h % 12) + 12) % 12];
}

/** Svenska tidsuttryck: 3:30 → "halv fyra", 2:45 → "kvart i tre". */
export function timeToSwedish(h, m) {
  const cur = hourWord(h);
  const nxt = hourWord(h + 1);
  switch (m) {
    case 0:
      return `klockan ${cur}`;
    case 5:
      return `fem över ${cur}`;
    case 10:
      return `tio över ${cur}`;
    case 15:
      return `kvart över ${cur}`;
    case 20:
      return `tjugo över ${cur}`;
    case 25:
      return `fem i halv ${nxt}`;
    case 30:
      return `halv ${nxt}`;
    case 35:
      return `fem över halv ${nxt}`;
    case 40:
      return `tjugo i ${nxt}`;
    case 45:
      return `kvart i ${nxt}`;
    case 50:
      return `tio i ${nxt}`;
    case 55:
      return `fem i ${nxt}`;
    default:
      return `${h}:${String(m).padStart(2, '0')}`;
  }
}

export function digitalTime(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Analog klocka. */
export function clockSvg(h, m, { size = 220, showMinutes = true, hands = true, id = '' } = {}) {
  const cx = 110;
  const cy = 110;
  let ticks = '';
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const big = i % 5 === 0;
    const r1 = big ? 86 : 90;
    ticks += `<line x1="${cx + Math.sin(a) * r1}" y1="${cy - Math.cos(a) * r1}" x2="${cx + Math.sin(a) * 96}" y2="${cy - Math.cos(a) * 96}" stroke="#23324a" stroke-width="${big ? 3 : 1}" stroke-linecap="round"/>`;
  }
  let nums = '';
  for (let i = 1; i <= 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    nums += `<text x="${cx + Math.sin(a) * 70}" y="${cy - Math.cos(a) * 70 + 8}" text-anchor="middle" font-size="22" font-weight="700" fill="#23324a" font-family="var(--font-display)">${i}</text>`;
  }
  let mins = '';
  if (showMinutes) {
    for (let i = 1; i <= 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      mins += `<text x="${cx + Math.sin(a) * 104}" y="${cy - Math.cos(a) * 104 + 4}" text-anchor="middle" font-size="9" fill="#6b7a99" font-family="var(--font-body)">${(i * 5) % 60}</text>`;
    }
  }
  const hourAngle = (((h % 12) + m / 60) / 12) * 360;
  const minAngle = (m / 60) * 360;
  const handsSvg = hands
    ? `<g class="hand-h" transform="rotate(${hourAngle} ${cx} ${cy})"><line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy - 48}" stroke="#ff6b5b" stroke-width="9" stroke-linecap="round"/></g>
       <g class="hand-m" transform="rotate(${minAngle} ${cx} ${cy})"><line x1="${cx}" y1="${cy + 12}" x2="${cx}" y2="${cy - 78}" stroke="#4aa8ff" stroke-width="6" stroke-linecap="round"/><circle class="hand-m-knob" cx="${cx}" cy="${cy - 78}" r="11" fill="#4aa8ff" fill-opacity=".35"/></g>
       <circle cx="${cx}" cy="${cy}" r="7" fill="#23324a"/>`
    : '';
  return `<svg ${id ? `id="${id}"` : ''} class="clock" viewBox="0 0 220 220" width="${size}" height="${size}" role="img" aria-label="klocka">
    <circle cx="${cx}" cy="${cy}" r="108" fill="#fff" stroke="#23324a" stroke-width="5"/>${ticks}${nums}${mins}${handsSvg}</svg>`;
}

/** Geometriska former (2D och 3D). */
export const SHAPES_2D = {
  cirkel: '<circle cx="60" cy="60" r="44" fill="#ff6b5b"/>',
  kvadrat: '<rect x="18" y="18" width="84" height="84" rx="3" fill="#4aa8ff"/>',
  triangel: '<polygon points="60,14 108,102 12,102" fill="#3fb67a" stroke-linejoin="round"/>',
  rektangel: '<rect x="8" y="32" width="104" height="56" rx="3" fill="#ffc93c"/>',
  oval: '<ellipse cx="60" cy="60" rx="50" ry="32" fill="#b06bff"/>',
  femhörning: '<polygon points="60,12 106,46 88,102 32,102 14,46" fill="#ff9f1c"/>',
  sexhörning: '<polygon points="34,14 86,14 112,60 86,106 34,106 8,60" fill="#19b5b0"/>',
};

export const SHAPES_3D = {
  klot: '<defs><radialGradient id="gk" cx="35%" cy="35%"><stop offset="0" stop-color="#ffd2cc"/><stop offset="1" stop-color="#e0483a"/></radialGradient></defs><circle cx="60" cy="60" r="46" fill="url(#gk)"/>',
  kub: '<polygon points="20,40 70,40 70,100 20,100" fill="#4aa8ff"/><polygon points="20,40 45,18 95,18 70,40" fill="#9fd0ff"/><polygon points="70,40 95,18 95,78 70,100" fill="#2a7fd4"/>',
  rätblock: '<polygon points="10,48 80,48 80,100 10,100" fill="#ffc93c"/><polygon points="10,48 32,28 102,28 80,48" fill="#ffe08a"/><polygon points="80,48 102,28 102,80 80,100" fill="#d9a514"/>',
  cylinder: '<rect x="28" y="28" width="64" height="70" fill="#3fb67a"/><ellipse cx="60" cy="98" rx="32" ry="11" fill="#2b8f5c"/><ellipse cx="60" cy="28" rx="32" ry="11" fill="#8fe0b6"/>',
  kon: '<polygon points="60,10 94,96 26,96" fill="#b06bff"/><ellipse cx="60" cy="96" rx="34" ry="11" fill="#8247d6"/>',
  pyramid: '<polygon points="60,12 20,96 70,108" fill="#ff9f1c"/><polygon points="60,12 70,108 104,88" fill="#d97706"/>',
};

export function shapeSvg(name) {
  const body = SHAPES_2D[name] || SHAPES_3D[name] || '';
  return `<svg class="shape" viewBox="0 0 120 120" role="img" aria-label="${esc(name)}">${body}</svg>`;
}

/** Stapeldiagram för statistikfrågor. */
export function barChart(data, { unit = '' } = {}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const top = Math.ceil(max / 2) * 2;
  const w = 60 + data.length * 70;
  const hgt = 230;
  const base = 190;
  const scale = 160 / top;
  let s = '';
  for (let v = 0; v <= top; v += top > 10 ? 2 : 1) {
    const y = base - v * scale;
    s += `<line x1="44" x2="${w - 6}" y1="${y}" y2="${y}" stroke="#d6dcea" stroke-width="1"/><text x="38" y="${y + 4}" text-anchor="end" font-size="12" fill="#4b5a78">${v}</text>`;
  }
  data.forEach((d, i) => {
    const x = 60 + i * 70;
    const bh = d.value * scale;
    s += `<rect x="${x}" y="${base - bh}" width="44" height="${bh}" rx="5" fill="${d.color || '#4aa8ff'}"/>`;
    s += `<text x="${x + 22}" y="${base + 30}" text-anchor="middle" font-size="26">${d.label}</text>`;
  });
  s += `<line x1="44" x2="${w - 6}" y1="${base}" y2="${base}" stroke="#23324a" stroke-width="2"/>`;
  return `<svg class="barchart" viewBox="0 0 ${w} ${hgt}" role="img" aria-label="stapeldiagram${unit ? ' ' + esc(unit) : ''}">${s}</svg>`;
}

/** Linjal med ett föremål ovanför. */
export function rulerSvg(lengthCm, emoji = '✏️', { start = 0 } = {}) {
  const px = 28;
  const total = Math.max(lengthCm + start + 1, 10);
  const w = 20 + total * px;
  let s = `<rect x="10" y="60" width="${total * px + 6}" height="46" rx="5" fill="#ffe08a" stroke="#b8860b" stroke-width="2"/>`;
  for (let i = 0; i <= total; i++) {
    const x = 13 + i * px;
    s += `<line x1="${x}" y1="60" x2="${x}" y2="${i % 5 === 0 ? 82 : 76}" stroke="#23324a" stroke-width="2"/>`;
    s += `<text x="${x}" y="100" text-anchor="middle" font-size="13" fill="#23324a" font-weight="700">${i}</text>`;
    if (i < total) s += `<line x1="${x + px / 2}" y1="60" x2="${x + px / 2}" y2="69" stroke="#23324a" stroke-width="1"/>`;
  }
  const x0 = 13 + start * px;
  const x1 = 13 + (start + lengthCm) * px;
  s += `<rect x="${x0}" y="22" width="${x1 - x0}" height="26" rx="13" fill="#ff9f1c" stroke="#a85d00" stroke-width="2"/>`;
  s += `<line x1="${x0}" y1="16" x2="${x0}" y2="58" stroke="#ff6b5b" stroke-dasharray="4 3" stroke-width="2"/><line x1="${x1}" y1="16" x2="${x1}" y2="58" stroke="#ff6b5b" stroke-dasharray="4 3" stroke-width="2"/>`;
  s += `<text x="${(x0 + x1) / 2}" y="42" text-anchor="middle" font-size="18">${emoji}</text>`;
  return `<svg class="ruler" viewBox="0 0 ${w} 110" role="img" aria-label="linjal">${s}</svg>`;
}

/** Våg/balans för likhetstecknet. */
export function balanceSvg(leftLabel, rightLabel, tilt = 0) {
  return `<svg class="balance" viewBox="0 0 320 170" role="img" aria-label="våg">
    <polygon points="160,70 140,160 180,160" fill="#6b7a99"/>
    <g transform="rotate(${tilt} 160 70)">
      <rect x="30" y="64" width="260" height="10" rx="5" fill="#23324a"/>
      <line x1="60" y1="74" x2="60" y2="100" stroke="#23324a" stroke-width="3"/>
      <line x1="260" y1="74" x2="260" y2="100" stroke="#23324a" stroke-width="3"/>
      <rect x="10" y="100" width="100" height="40" rx="10" fill="#fff" stroke="#23324a" stroke-width="3"/>
      <rect x="210" y="100" width="100" height="40" rx="10" fill="#fff" stroke="#23324a" stroke-width="3"/>
      <text x="60" y="128" text-anchor="middle" font-size="20" font-weight="800" fill="#23324a" font-family="var(--font-display)">${esc(leftLabel)}</text>
      <text x="260" y="128" text-anchor="middle" font-size="20" font-weight="800" fill="#23324a" font-family="var(--font-display)">${esc(rightLabel)}</text>
    </g></svg>`;
}

/** Påse med kulor för sannolikhet. */
export function marbleBag(counts) {
  const colors = { röd: '#ff4b3e', blå: '#3a8bff', gul: '#ffc400', grön: '#2fb36b' };
  let s = '<path d="M40,60 Q30,180 150,190 Q270,180 260,60 Z" fill="#c9a27a" stroke="#7a5532" stroke-width="4"/><path d="M40,60 Q150,30 260,60" fill="none" stroke="#7a5532" stroke-width="4"/>';
  let i = 0;
  const entries = Object.entries(counts);
  const all = [];
  for (const [c, n] of entries) for (let k = 0; k < n; k++) all.push(c);
  // stabil, utspridd placering
  all.forEach((c, k) => {
    const col = k % 6;
    const row = Math.floor(k / 6);
    const x = 75 + col * 30 + (row % 2) * 14;
    const y = 85 + row * 28;
    s += `<circle cx="${x}" cy="${y}" r="12" fill="${colors[c] || c}" stroke="#0003" stroke-width="2"/>`;
    i++;
  });
  return `<svg class="bag" viewBox="0 0 300 200" role="img" aria-label="påse med kulor">${s}</svg>`;
}
