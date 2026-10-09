// Lokala fotografier fungerar även i den fristående offline-versionen.
import { PHOTOS } from '../assets/photos/catalog.js';
import { esc } from './visuals.js';

export function photoImage(id, alt = 'Fotografi av en art', compact = false) {
  const photo = PHOTOS[id];
  if (!photo) return '';
  return `<img class="learning-photo${compact ? ' compact' : ''}" src="${photo.data}" alt="${esc(alt)}" decoding="async" width="330" height="280">`;
}

export function photoFigure(id, alt = 'Fotografi av en art') {
  const photo = PHOTOS[id];
  if (!photo) return '';
  return `<figure class="photo-figure">${photoImage(id, alt)}<figcaption>Foto: ${esc(photo.artist)} · ${esc(photo.license)}<details><summary>Bildkälla och licens</summary><a href="${esc(photo.source)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · <a href="${esc(photo.licenseUrl || photo.source)}" target="_blank" rel="noopener noreferrer">${esc(photo.license)}</a><span> Bilden visas i mindre storlek.</span></details></figcaption></figure>`;
}

export function photoCredits() {
  return `<details class="photo-credits"><summary>Bildkällor</summary>${Object.values(PHOTOS).map(photo => `<p>${esc(photo.artist)} · <a href="${esc(photo.source)}" target="_blank" rel="noopener noreferrer">${esc(photo.title)}</a> · <a href="${esc(photo.licenseUrl || photo.source)}" target="_blank" rel="noopener noreferrer">${esc(photo.license)}</a></p>`).join('')}<p>Bilderna visas i mindre storlek.</p></details>`;
}
