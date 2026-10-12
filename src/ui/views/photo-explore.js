import { h, clear, onTap } from '../dom.js';
import { learningPhoto } from '../learning-photo.js';
import { hasPhoto, photoUrl } from '../img.js';
import { PHOTO_LEARNING, PHOTO_DETAILS } from '../../apps/photo-learning.js';
import { hasInSet } from '../../core/model.js';

export function photoExploreView(el, { kos, app, level }) {
  const items = (PHOTO_LEARNING[app.id] || []).filter(item => hasPhoto(item.key));
  const seenSet = `photoSeen:${app.id}`;
  const list = h('nav.photo-explore-list', { 'aria-label': 'Välj ett fotografi' });
  const stage = h('section.photo-explore-stage', { tabindex: '-1' });
  const progress = h('p.photo-explore-progress', { 'aria-live': 'polite' });
  let current = items.find(item => !hasInSet(kos.profile, seenSet, item.key)) || items[0];
  let alive = true;
  el.append(h('div.photo-explore', h('h2', 'Titta nära. Vad upptäcker du?'),
    h('p', 'Utforska riktiga fotografier. Lyssna på frågan, titta på detaljerna och berätta hur du tänker.'),
    progress, h('div.photo-explore-layout', list, stage)));

  function renderList() {
    clear(list);
    progress.textContent = `${items.filter(item => hasInSet(kos.profile, seenSet, item.key)).length} av ${items.length} bilder undersökta. Du kan titta igen när du vill.`;
    for (const item of items) {
      const seen = hasInSet(kos.profile, seenSet, item.key);
      list.append(onTap(h('button.photo-explore-card', { type: 'button', 'aria-pressed': String(current === item), dataset: { photo: item.key } },
        h('img', { src: photoUrl(item.key), alt: '', draggable: 'false', loading: 'lazy' }), h('span', item.title), seen ? h('small', '✓ Undersökt') : null),
        () => { kos.stopSpeaking(); current = item; render(); showSelectedPhoto(); }));
    }
  }

  function showSelectedPhoto() {
    stage.focus({ preventScroll: true });
    stage.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  function render() {
    renderList();
    clear(stage);
    if (!current) { stage.append(h('p', 'Inga fotografier är tillgängliga just nu.')); return; }
    const item = current;
    stage.setAttribute('aria-label', item.title);
    const insight = h('div.photo-insight', { hidden: true }, h('h3', 'Upptäck mer'), h('p', item.detail));
    const reveal = onTap(h('button.btn.btn-ghost', { type: 'button', 'aria-expanded': 'false' }, 'Upptäck mer'), () => {
      insight.hidden = !insight.hidden; reveal.setAttribute('aria-expanded', String(!insight.hidden));
      if (!insight.hidden) kos.autoSay(item.detail);
    });
    const finish = onTap(h('button.btn.btn-primary', { type: 'button' }, 'Jag har undersökt bilden ✓'), () => {
      kos.reward({ app: app.id, set: seenSet, item: item.key, silent: true }); kos.saveNow(); renderList();
      finish.textContent = 'Sparat – bilden är undersökt ✓';
    });
    const photos = item.compareKey && hasPhoto(item.compareKey) ? h('div.photo-comparison', { 'aria-label': 'Två fotografier att jämföra' }, learningPhoto(item), learningPhoto(PHOTO_DETAILS[item.compareKey])) : learningPhoto(item);
    stage.append(photos, h('h3', item.compareKey ? 'Jämför bilderna' : 'Vad ser du?'), h('p.photo-observation', item.question),
      onTap(h('button.btn.btn-ghost', { type: 'button' }, '🔊 Lyssna på frågan'), () => kos.read(item.question)), reveal, insight,
      h('p.muted', 'Du kan svara genom att prata, peka eller rita. Undersökt betyder att du har tittat och funderat, inte att svaret har bedömts.'), finish,
      onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Nästa foto →'), () => { kos.stopSpeaking(); current = items[(items.indexOf(current) + 1) % items.length]; render(); showSelectedPhoto(); }));
    const mod = app.modules.find(mod => mod.id === item.practice);
    if (mod && (kos.profile.settings.showAllModules || (mod.minLevel || 0) <= level)) stage.append(onTap(h('button.btn.btn-ghost', { type: 'button' }, `Öva vidare: ${mod.name}`), () => {
      kos.stopSpeaking(); el.dispatchEvent(new CustomEvent('kos-open', { bubbles: true, detail: { app: app.id, module: mod.id } }));
    }));
    if (alive) kos.autoSay(item.question);
  }
  render();
  return () => { alive = false; kos.stopSpeaking(); };
}
