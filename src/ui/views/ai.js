import { h, clear, onTap, wait } from '../dom.js';
import { photoFigure } from '../photos.js';
import { photo, hasPhoto, pic } from '../img.js';
import { hasInSet } from '../../core/model.js';
import { AI_FEATURES, AI_TRAINING, AI_TESTING, classifyAnimal, TRAINER_SETS, BIAS_CHALLENGE, trainerSet, trainerItem, examplesFrom, classify, evaluate, sharedClues, factLine } from '../../apps/ai-lab.js';

/** AI-labbet: modulen "trainer" visar fotolabbet, modulen "lab" egenskapslabbet. */
export function aiLabView(el, ctx) {
  if (ctx.module?.id === 'trainer') return trainerView(el, ctx);
  return featureLabView(el, ctx);
}

function featureLabView(el, { kos, app }) {
  const labels = new Map();
  let tested = false;
  let complete = false;
  const root = h('div.ai-lab.sci');
  el.append(root);
  const button = (text, fn, primary = false) => onTap(h(`button.btn.${primary ? 'btn-primary' : 'btn-ghost'}`, { type: 'button' }, text), fn);
  const speak = (text) => button('🔊 Läs upp', () => kos.read(text));
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

/* ======================================================================
 * Träna en klassificerare (fotolabbet)
 * ==================================================================== */
const BATCH = 4;

function itemPic(item, cls = '') {
  if (item.photo && hasPhoto(item.photo)) return `<span class="pic photo-pic ${cls}">${photo(item.photo, { alt: item.name })}</span>`;
  return pic(item.e, { cls, alt: item.name });
}
const clsOf = (set, id) => set.classes.find((c) => c.id === id);

export function trainerView(el, { kos, app, level }) {
  const p = kos.profile;
  const showAll = p.settings.showAllModules;
  const root = h('div.trn');
  el.append(root);
  let alive = true;
  let st = null; // aktuell övning

  const btn = (text, fn, kind = 'ghost', extra = {}) => onTap(h(`button.btn.btn-${kind}`, { type: 'button', ...extra }, text), fn);
  const speakBtn = (text) => onTap(h('button.icon-btn.trn-speak', { type: 'button', 'aria-label': 'Läs upp' }, '🔊'), () => kos.say(text));
  const say = (text) => alive && kos.autoSay(text);
  const steps = (on) => h('ol.trn-steps', ['Träna', 'Testa', 'Förbättra'].map((t, i) => h('li', { class: i === on ? 'on' : i < on ? 'done' : '' }, h('b', String(i + 1)), t)));

  function clueChips(set, item, features = set.features.map((f) => f.id)) {
    return h('div.trn-clues', set.features.filter((f) => features.includes(f.id)).map((f) => {
      const v = f.values[item.f[f.id]] || { label: item.f[f.id], icon: '•' };
      return h('span.trn-clue', { title: `${f.label}: ${v.label}` }, h('i', v.icon), v.label);
    }));
  }

  /* ---------- Välj övning ---------- */
  function chooser() {
    st = null;
    clear(root);
    const intro = 'Träna en AI! Du visar exempel och säger vad de är. Sedan testar vi om datorn kan gissa rätt på nya bilder.';
    const cards = h('div.trn-choose');
    for (const set of TRAINER_SETS) {
      const locked = !showAll && level < set.minLevel;
      const thumbs = set.train.slice(0, 4).map((id) => h('span.trn-thumb', { html: itemPic(trainerItem(set, id)) }));
      cards.append(onTap(h('button.trn-card', { type: 'button', class: locked ? 'locked' : '', dataset: { set: set.id } }, h('span.trn-thumbs', thumbs), h('b', `${set.icon} ${set.title}`), h('small', locked ? '🔒 Låses upp senare' : `${set.classes.map((c) => c.label).join(' eller ')} – sortera och testa`)), () => {
        if (locked) return kos.say('Den här övningen låses upp senare. Börja med fåglar och däggdjur!');
        start(set, 'normal');
      }));
    }
    const biasLocked = !showAll && level < 2;
    const bset = trainerSet(BIAS_CHALLENGE.set);
    cards.append(onTap(h('button.trn-card.bias', { type: 'button', class: biasLocked ? 'locked' : '', dataset: { set: 'bias' } }, h('span.trn-thumbs', Object.keys(BIAS_CHALLENGE.skewed).slice(0, 4).map((id) => h('span.trn-thumb', { html: itemPic(trainerItem(bset, id)) }))), h('b', '⚖️ Skev data-utmaningen'), h('small', biasLocked ? '🔒 Från åk 1' : 'Någon har tränat AI:n med konstiga exempel. Hitta felet!')), () => {
      if (biasLocked) return kos.say('Skev data-utmaningen låses upp när du har övat mer.');
      start(bset, 'bias');
    }));
    root.append(h('div.trn-head', h('h2', '🧪 Träna en AI'), speakBtn(intro)), h('p.trn-lead', intro), cards,
      h('p.trn-note', 'Så fungerar labbet: under varje bild står ledtrådar som människor har skrivit in, till exempel färg och storlek. AI:n jämför ett nytt foto med dina exempel och väljer gruppen hos de exempel som liknar mest. En riktig bild-AI hittar själv mönster i bildens pixlar – men den lär sig också från exempel som människor har valt och märkt.'));
    say(intro);
  }

  function start(set, mode) {
    st = {
      set, mode, labels: mode === 'bias' ? { ...BIAS_CHALLENGE.skewed } : {},
      pool: mode === 'bias' ? BIAS_CHALLENGE.fixes : set.train,
      shown: mode === 'bias' ? 0 : BATCH,
      test: mode === 'bias' ? BIAS_CHALLENGE.test : set.test,
      features: set.features.map((f) => f.id),
      history: [], tested: false,
    };
    train();
  }

  /* ---------- Träna ---------- */
  function train() {
    const { set } = st;
    clear(root);
    const count = Object.keys(st.labels).length;
    const bias = st.mode === 'bias';
    const intro = bias && !st.tested
      ? 'Någon har redan tränat den här AI:n. Titta på exemplen i de två lådorna. Vad har alla frukter gemensamt? Och alla grönsaker? Testa sedan AI:n.'
      : bias
        ? 'Lägg till fler och olika exempel i lådorna. Sedan testar du igen.'
        : `${set.intro} Tryck på rätt grupp under varje bild.`;
    root.append(h('div.trn-head', btn('← Övningar', chooser, 'ghost', { class: 'btn-sm' }), h('h2', bias ? '⚖️ Skev data' : `${set.icon} ${set.title}`), speakBtn(intro)), steps(st.tested ? 2 : 0), h('p.trn-lead', intro));

    // Lådorna = träningsdata
    const bins = h('div.trn-bins');
    for (const c of set.classes) {
      const ids = Object.keys(st.labels).filter((id) => st.labels[id] === c.id);
      bins.append(h('section.trn-bin', { dataset: { cls: c.id } }, h('h3', `${c.icon} ${c.label}`, h('span.trn-count', String(ids.length))),
        h('div.trn-bin-items', ids.length ? ids.map((id) => {
          const it = trainerItem(set, id);
          return onTap(h('button.trn-chip', { type: 'button', 'aria-label': `Ta bort ${it.name} ur ${c.label}` , class: it.cls !== c.id ? 'mislabel' : '' }, h('span', { html: itemPic(it, 'sm') }), h('span', it.name), h('i', '×')), () => {
            delete st.labels[id];
            if (!st.pool.includes(id)) st.pool = [...st.pool, id];
            if (st.pool.indexOf(id) >= st.shown) st.shown = st.pool.indexOf(id) + 1;
            train();
          });
        }) : h('p.trn-empty', 'Inga exempel än'))));
    }
    root.append(h('p.trn-count-line', `${count} exempel i träningsdata. Testbilderna är andra bilder som AI:n aldrig får träna på.`), bins);

    // Exempel att sortera
    const waiting = st.pool.slice(0, st.shown).filter((id) => !(id in st.labels));
    if (waiting.length) {
      const grid = h('div.trn-pool');
      for (const id of waiting) {
        const it = trainerItem(set, id);
        const card = h('div.trn-item', { dataset: { item: id } }, h('div.trn-photo', { html: itemPic(it, 'big') }), h('b.trn-name', it.name), clueChips(set, it, st.features));
        const row = h('div.trn-sort');
        for (const c of set.classes) {
          row.append(onTap(h('button.btn.trn-label', { type: 'button', dataset: { cls: c.id } }, `${c.icon} ${c.label}`), () => {
            st.labels[id] = c.id;
            kos.sfx('pop');
            train();
          }));
        }
        card.append(row);
        grid.append(card);
      }
      root.append(h('h3.trn-sub', 'Sortera bilderna'), grid);
    }
    const more = st.shown < st.pool.length && (st.tested || !waiting.length);
    const actions = h('div.row-actions.trn-actions');
    if (more) actions.append(btn(`➕ Visa ${Math.min(BATCH, st.pool.length - st.shown)} nya exempel`, () => { st.shown = Math.min(st.pool.length, st.shown + BATCH); train(); }, waiting.length ? 'ghost' : 'primary', { class: 'trn-more' }));
    const testBtn = btn('▶ Testa AI:n', () => runTest(), 'primary', { class: 'trn-test', disabled: count === 0 });
    actions.append(testBtn);
    root.append(actions);
    if (!count) root.append(h('p.trn-hint', 'Sortera minst en bild först.'));

    // Ledtrådar (från nivå 2): välj vad modellen får titta på.
    if (level >= 2 || showAll) {
      const box = h('details.trn-features', { open: st.featuresOpen || null }, h('summary', '🔎 Vilka ledtrådar får AI:n använda?'),
        h('p', 'Stäng av en ledtråd och testa igen. Blir AI:n bättre eller sämre? Att välja bra ledtrådar är en viktig del av att bygga AI.'));
      const row = h('div.trn-feature-row');
      for (const f of set.features) {
        const on = st.features.includes(f.id);
        row.append(onTap(h('button.trn-feature', { type: 'button', 'aria-pressed': String(on), dataset: { feature: f.id } }, `${on ? '✅' : '⬜'} ${f.label}`), () => {
          if (on && st.features.length === 1) return kos.say('AI:n behöver minst en ledtråd.');
          st.features = on ? st.features.filter((x) => x !== f.id) : [...st.features, f.id];
          st.featuresOpen = true;
          train();
        }));
      }
      box.append(row);
      box.addEventListener('toggle', () => { st.featuresOpen = box.open; });
      root.append(box);
    }
    say(intro);
  }

  /* ---------- Testa ---------- */
  function runTest() {
    kos.stopSpeaking();
    st.result = evaluate(st.set, st.labels, st.test, st.features);
    st.judged = 0;
    testStep(0);
  }

  function testStep(i) {
    const { set } = st;
    const row = st.result.rows[i];
    clear(root);
    const guessCls = row.label && clsOf(set, row.label);
    const head = h('div.trn-head', btn('← Träning', train, 'ghost', { class: 'btn-sm' }), h('h2', `🔬 Test ${i + 1} av ${st.result.rows.length}`));
    const guess = h('div.trn-guess', { 'aria-live': 'polite' }, h('span.trn-thinking', '🤖 AI:n tänker …'));
    const card = h('div.trn-testcard', h('div.trn-photo.big', { html: itemPic(row.item, 'big') }), h('b.trn-name', row.item.name), clueChips(set, row.item, st.features), guess);
    root.append(head, steps(1), h('p.trn-lead', 'Den här bilden har AI:n aldrig sett. Vad gissar den?'), card);
    const after = h('div.trn-after');
    root.append(after);
    const reveal = async () => {
      await wait(450);
      if (!alive) return;
      clear(guess);
      const guessText = guessCls ? `Jag tror att det är ${guessCls.a}.` : 'Jag vet inte. Exemplen som liknar mest hör till olika grupper.';
      guess.append(h('p.trn-ai', h('span.trn-bot', '🤖'), h('b', guessCls ? `${guessCls.icon} ${guessCls.label}` : '🤷 Vet inte'), h('small', guessText)));
      // Därför: de mest lika exemplen
      if (row.nearest.length) {
        const why = h('div.trn-why', h('small', row.distance === 0 ? 'Liknar precis:' : `Liknar mest (${row.distance} ${row.distance === 1 ? 'ledtråd skiljer' : 'ledtrådar skiljer'}):`));
        for (const ex of row.nearest.slice(0, 4)) {
          const c = clsOf(set, ex.label);
          const same = sharedClues(set, ex.f, row.item.f, st.features);
          why.append(h('span.trn-near', h('span', { html: itemPic(ex, 'sm') }), h('span', `${ex.name} – ${c.icon} ${c.label}`), level >= 3 && same.length ? h('em', `samma: ${same.join(', ')}`) : null));
        }
        if (row.nearest.length > 4) why.append(h('small', `… och ${row.nearest.length - 4} till`));
        guess.append(why);
      }
      kos.say(`${guessText} Hade AI:n rätt?`);
      if (!guessCls) {
        after.append(h('p.trn-truth', `${factLine(set, row.item)} AI:n kunde inte bestämma sig – det räknas inte som rätt.`), next(i));
        return;
      }
      const ask = h('div.trn-judge', h('b', 'Hade AI:n rätt?'),
        onTap(h('button.btn.trn-yes', { type: 'button' }, '✅ Ja'), () => judge(true)),
        onTap(h('button.btn.trn-no', { type: 'button' }, '❌ Nej'), () => judge(false)));
      after.append(ask);
      function judge(saysRight) {
        clear(after);
        const ok = saysRight === row.correct;
        if (ok) st.judged++;
        kos.sfx(ok ? 'correct' : 'wrong');
        const fact = factLine(set, row.item);
        const text = ok ? `Bra granskat! ${fact} ${row.correct ? 'AI:n hade rätt.' : 'AI:n hade fel.'}` : `Titta igen! ${fact} Så AI:n hade ${row.correct ? 'rätt' : 'fel'}.`;
        after.append(h('p.trn-truth', { class: ok ? 'fb-ok' : 'fb-learn' }, text), next(i));
        kos.say(text);
      }
    };
    reveal();
  }

  function next(i) {
    const last = i === st.result.rows.length - 1;
    return btn(last ? 'Se resultatet →' : 'Nästa bild →', () => { kos.stopSpeaking(); last ? summary() : testStep(i + 1); }, 'primary', { class: 'trn-next' });
  }

  /* ---------- Resultat och förbättring ---------- */
  function summary() {
    const { set, result } = st;
    const prev = st.history[st.history.length - 1];
    st.history.push({ correct: result.correct, total: result.total, examples: Object.keys(st.labels).length });
    st.tested = true;
    clear(root);
    const bias = st.mode === 'bias';
    const mislabeled = examplesFrom(set, st.labels).filter((ex) => ex.label !== ex.cls);
    const all = result.correct === result.total;
    let insight;
    if (mislabeled.length) insight = `Obs! ${mislabeled.map((ex) => ex.name).join(', ')} ligger i fel låda. AI:n härmar exemplen – även felen. Rätta etiketterna och testa igen!`;
    else if (bias && st.history.length === 1) insight = 'Alla frukter i träningen var röda och alla grönsaker var gröna. AI:n har lärt sig att färgen avslöjar gruppen – men det stämmer inte! Det kallas skev träningsdata. Lägg till fler och olika exempel.';
    else if (prev && result.correct > prev.correct) insight = `Bättre! Förra gången ${prev.correct} rätt, nu ${result.correct}. Fler och mer olika exempel hjälpte AI:n.`;
    else if (prev && result.correct < prev.correct) insight = 'Sämre än förra gången. Vad ändrade du? Ledtrådar eller exempel kan göra AI:n sämre också.';
    else if (all) insight = 'Alla rätt på de här testbilderna! Det betyder inte att AI:n alltid har rätt – nya bilder kan fortfarande lura den.';
    else insight = 'AI:n behöver fler exempel. Särskilt sådana som liknar bilderna den gissade fel på.';
    const grid = h('div.trn-results', result.rows.map((r) => {
      const g = r.label ? clsOf(set, r.label) : null;
      return h('div.trn-res', { class: r.correct ? 'ok' : 'bad' }, h('span', { html: itemPic(r.item, 'sm') }), h('b', r.item.name), h('small', g ? `${g.icon} ${g.label}` : '🤷 vet inte'), h('i', r.correct ? '✓' : '✗'));
    }));
    const chart = h('div.trn-chart', { 'aria-label': 'Resultat per test' }, st.history.map((x, k) => h('div.trn-bar', h('span', { style: { '--h': `${Math.round((x.correct / x.total) * 100)}%` } }), h('small', `Test ${k + 1}`), h('b', `${x.correct}/${x.total}`), h('em', `${x.examples} ex.`))));
    root.append(h('div.trn-head', btn('← Övningar', chooser, 'ghost', { class: 'btn-sm' }), h('h2', `AI:n fick ${result.correct} av ${result.total} rätt`), speakBtn(insight)), steps(2),
      grid, h('p.trn-insight', insight), chart,
      h('p.trn-judged', `Du granskade ${st.judged} av ${result.rows.filter((r) => r.label).length} gissningar rätt. Att kontrollera AI är ett viktigt jobb för människor!`));
    if (all || st.history.length >= 3) root.append(h('div.course-takeaway', h('b', 'Tänk vidare'), h('p', set.lesson)));
    const actions = h('div.row-actions.trn-actions');
    const more = st.shown < st.pool.length;
    if (more) actions.append(btn('➕ Lägg till fler exempel', () => { st.shown = Math.min(st.pool.length, st.shown + BATCH); train(); }, 'primary', { class: 'trn-more' }));
    actions.append(btn('✏️ Ändra exemplen', train, more ? 'ghost' : 'primary', { class: 'trn-edit' }), btn('🔄 Börja om', () => start(set, st.mode)), btn('Byt övning', chooser));
    root.append(actions);
    root.scrollIntoView?.({ block: 'start' });

    // Belöningar: en gång per övning, och extra när AI:n blivit riktigt bra efter förbättring.
    const once = (item, stars) => {
      if (hasInSet(p, 'aiLab', item)) return;
      kos.reward({ app: app.id, stars, set: 'aiLab', item });
    };
    once(bias ? 'bias-test' : `train-${set.id}`, 1);
    if (!mislabeled.length && st.history.length >= 2 && result.correct >= result.total - (bias ? 1 : 0) && result.correct > st.history[0].correct) {
      once(bias ? 'bias-fixed' : `master-${set.id}`, 3);
      kos.sfx('correct');
    }
    say(`AI:n fick ${result.correct} av ${result.total} rätt. ${insight}`);
  }

  chooser();
  return () => { alive = false; kos.stopSpeaking(); };
}
