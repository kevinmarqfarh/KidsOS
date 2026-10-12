import { h } from './dom.js';
import { hasPhoto, photoUrl, photoCredit, creditLine } from './img.js';

const webUrl = value => typeof value === 'string' && /^https:\/\//.test(value);

/** En riktig motivbild med upphov, licens och hela bilden synlig. */
export function learningPhoto(item, { compact = false } = {}) {
  if (!item || !hasPhoto(item.key)) return null;
  const credit = photoCredit(item.key);
  const licenseUrl = credit?.lu?.replace(/^http:/, 'https:');
  const figure = h('figure.learning-photo-card', { class: compact ? 'compact' : '', dataset: { photo: item.key } },
    h('img', { src: photoUrl(item.key), alt: item.title, draggable: 'false', loading: 'lazy', decoding: 'async' }),
    h('figcaption', h('b', item.title), h('small', creditLine(item.key)),
      h('details', h('summary', 'Bildkälla och licens'),
        webUrl(credit?.u) ? h('a', { href: credit.u, target: '_blank', rel: 'noopener noreferrer' }, 'Original och bildkälla') : null,
        webUrl(licenseUrl) ? h('a', { href: licenseUrl, target: '_blank', rel: 'noopener noreferrer' }, credit.l) : h('span', credit?.l || ''),
        h('span', 'Bilden är förminskad och omkodad till WebP.'))));
  return figure;
}
