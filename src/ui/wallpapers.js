import { h, onTap } from './dom.js';

// Samma bakgrund som på hemskärmen, skalad till en liten förhandsvisning.
export function wallpaperButton(wallpaper, selected, choose) {
  return onTap(h('button.pick.pick-wp', { type: 'button', class: `${selected ? 'on' : ''} wp-${wallpaper.id}`, 'aria-pressed': String(selected), 'aria-label': wallpaper.name, dataset: { wallpaper: wallpaper.id } },
    h('span.wp-preview', { 'aria-hidden': 'true' }, h('span.wp-mini-clock', '10:00'), h('span.wp-mini-apps', Array.from({ length: 6 }, () => h('i')))),
    h('span.wp-caption', h('b', wallpaper.name), h('span.wp-check', { 'aria-hidden': 'true' }, selected ? '✓' : ''))), choose);
}
