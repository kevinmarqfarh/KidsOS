import { h, clear, onTap } from '../dom.js';
import { DRAW_MISSIONS } from '../../apps/practice-activities.js';
import { drawView } from './misc.js';

export function drawingMissionsView(el, ctx) {
  const available = DRAW_MISSIONS.filter(item => item.level <= ctx.level);
  let index = 0;
  const brief = h('section.drawing-brief');
  const canvasRoot = h('div');
  el.append(brief, canvasRoot);
  function render() {
    const mission = available[index];
    clear(brief).append(h('h2', mission.title), h('p', mission.text),
      h('p.muted', 'Det finns flera bra lösningar. Din bild bedöms inte automatiskt. Spara den i galleriet och berätta om dina val.'),
      onTap(h('button.btn.btn-ghost', {type:'button'}, '🔊 Läs uppdraget'), () => ctx.kos.read(`${mission.title}. ${mission.text}`)),
      onTap(h('button.btn.btn-ghost', {type:'button'}, 'Byt uppdrag'), () => { index = (index + 1) % available.length; render(); }));
  }
  render();
  const cleanup = drawView(canvasRoot, ctx);
  // Uppdraget ovan är instruktionen; den fria ritytans slumpidé ska inte
  // visa en annan uppgift samtidigt.
  const freePrompt = canvasRoot.querySelector('.draw-prompt');
  if (freePrompt) freePrompt.hidden = true;
  return cleanup;
}
