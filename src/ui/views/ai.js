import { h, clear, onTap } from '../dom.js';
import { photoFigure } from '../photos.js';
import { hasInSet } from '../../core/model.js';
import { AI_FEATURES, AI_TRAINING, AI_TESTING, classifyAnimal } from '../../apps/ai-lab.js';

export function aiLabView(el, { kos, app }) {
  const labels = new Map();
  let tested = false;
  let complete = false;
  const root = h('div.ai-lab.sci');
  el.append(root);
  const button = (text, fn, primary = false) => onTap(h(`button.btn.${primary ? 'btn-primary' : 'btn-ghost'}`, { type: 'button' }, text), fn);
  const speak = (text) => button('🔊 Läs upp', () => kos.say(text));
  function animalCard(animal) {
    return h('div.ai-animal', h('div.ai-photo', { html: photoFigure(animal.id, `Fotografi av ${animal.name}`) }), h('h3', animal.name),
      h('ul.ai-features', AI_FEATURES.map((feature, i) => h('li', `${animal.features[i] ? '✓' : '–'} ${feature}: ${animal.features[i] ? 'ja' : 'nej'}`))));
  }
  function training() {
    clear(root);
    const intro = 'Lär en liten modell att skilja fåglar från däggdjur. Välj en grupp för minst ett djur och testa. Prova sedan fler exempel och rätta etiketter. En etikett är namnet på gruppen.';
    root.append(h('h2', '🧠 Träna en liten AI'), h('p', intro), speak(intro),
      h('p.ai-note', 'En förenklad modell: människor har fyllt i de fyra egenskaperna. Modellen jämför siffrorna 1 (ja) och 0 (nej). Den läser inte fotografierna. Denna övning handlar om klassificering, en sorts maskininlärning.'),
      h('p.ai-note', 'Egenskaperna är förenklade för just de här exemplen. Ett djur kan till exempel vara vaket både på dagen och på natten.'),
      h('p', 'Fåglar har fjädrar. Däggdjursungar får mjölk från sin mamma. Välj etiketter och undersök vad som händer om någon blir fel.'),
      h('p', 'Ekorre och igelkott är däggdjur. Uggla och örn är fåglar. Du får ändra ditt val.'));
    const grid = h('div.ai-grid');
    const count = h('p.ai-training-count', `${labels.size} exempel i träningsdata. De nya testdjuren ingår aldrig i träningen.`);
    const testBtn = button('Testa på två nya djur →', results, true);
    testBtn.disabled = labels.size === 0;
    for (const animal of AI_TRAINING) {
      const card = animalCard(animal);
      const options = h('div.row-actions');
      for (const label of ['fågel', 'däggdjur']) {
        const option = button(label === 'fågel' ? '🐦 Fågel' : '🐾 Däggdjur', () => {
          labels.set(animal.id, label);
          for (const b of options.children) b.setAttribute('aria-pressed', String(b === option));
          status.textContent = `Din etikett: ${label}`;
          testBtn.disabled = false;
          count.textContent = `${labels.size} exempel i träningsdata. De nya testdjuren ingår aldrig i träningen.`;
        });
        option.setAttribute('aria-pressed', String(labels.get(animal.id) === label));
        options.append(option);
      }
      const status = h('p', { 'aria-live': 'polite' }, labels.has(animal.id) ? `Din etikett: ${labels.get(animal.id)}` : 'Ingen etikett ännu');
      card.append(options, status, button('Ta bort exempel', () => { labels.delete(animal.id); training(); }));
      grid.append(card);
    }
    root.append(grid, count, testBtn,
      button('Börja om', () => { labels.clear(); tested = false; complete = false; training(); }));
  }
  function results() {
    tested = true;
    clear(root);
    const examples = AI_TRAINING.filter((animal) => labels.has(animal.id)).map((animal) => ({ ...animal, label: labels.get(animal.id) }));
    root.append(h('h2', '🔎 Testa – kontrollera – förbättra'), h('p', 'De här djuren fanns inte i träningen. Modellen lånar etiketten från det exempel som har flest likadana egenskaper. Vid lika nära exempel med olika etiketter svarar den ”vet inte”.'));
    let correct = 0;
    const grid = h('div.ai-grid');
    for (const animal of AI_TESTING) {
      const result = classifyAnimal(examples, animal.features);
      if (result.label === animal.label) correct++;
      const card = animalCard(animal);
      card.append(h('p', h('b', `Modellens svar: ${result.label || 'vet inte'}`)),
        h('p', `Närmast: ${result.nearest.map((item) => `${item.name} (${item.label})`).join(', ')}. ${result.distance} olika egenskaper.`),
        h('p', { class: result.label === animal.label ? 'fb-ok' : 'fb-learn' }, `Vi kontrollerar: ${animal.name} är ${animal.label}. ${result.label === animal.label ? 'Svaret stämde den här gången.' : 'Här behöver modellen bättre exempel eller rättade etiketter.'}`));
      grid.append(card);
    }
    root.scrollIntoView({ block: 'start' });
    root.append(grid, h('p', `${correct} av 2 testdjurs svar stämde. Två rätt betyder inte att modellen klarar alla djur! En fladdermus kan flyga men är ett däggdjur. Fler olika exempel och bra egenskaper hjälper; fler exempel med fel etiketter kan göra det sämre.`),
      button('← Rätta etiketter eller lägg till exempel', training, true),
      h('h3', 'Vad lärde vi oss?'), h('p', 'Om modellen svarar fel på ett nytt djur: vad hjälper oss att undersöka varför?'));
    const feedback = h('p', { role: 'status' });
    root.append(button('Kontrollera etiketter och prova olika exempel', () => {
      feedback.textContent = 'Precis! Vi tränar på exempel, testar på andra och kontrollerar svaren. Människor behöver granska AI.';
      if (tested && !complete && !hasInSet(kos.profile, 'aiLab', 'classify')) {
        kos.reward({ app: app.id, stars: 3, set: 'aiLab', item: 'classify' });
        kos.sfx('correct');
      }
      complete = true;
    }), button('Lita på svaret bara för att det kommer från AI', () => {
      feedback.textContent = 'AI kan ha fel. Vi behöver kontrollera svaret och undersöka träningen. Prova det andra svaret!';
    }), feedback);
  }
  training();
  kos.autoSay('Träna en liten AI. Välj grupper för djuren, testa på nya djur och kontrollera svaren.');
}
