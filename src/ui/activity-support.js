import { h, onTap, openDialog } from './dom.js';

const HELP = {
  pairs: 'Välj två kort som hör ihop. Visa alla kort om du vill ha stöd. Efter två olika kort väljer du själv när du provar igen.',
  numberWorkshop: 'Lägg till ental och tiotal. Växla mellan dem med knapparna. Kontrollera när talet matchar målet.',
  fractionKitchen: 'Välj hur många lika stora delar portionen har. Tryck på delar för att välja dem och jämför med målet.',
  storyAtelier: 'Välj början, sedan och slutet. Välj idéer och skriv eller berätta med en vuxen. Din text sparas när du skriver.',
  wordScene: 'Tryck på vem, vad som händer och var. Tryck på ett valt ord för att ta bort det. Dragning går att slå på om du vill.',
  mapJourney: 'Följ ledtråden med riktningsknappar eller angränsande rutor. Norr är uppåt. Kontrollera när du är framme.',
  course: 'Välj en lektion. Läs eller lyssna på en del i taget. Tryck på Nästa del när du vill fortsätta.',
  robot: 'Välj pilar för att bygga en instruktion. Tryck på Kör för att prova. Du kan ändra och prova igen.',
  trace: 'Välj en bokstav eller siffra. Följ linjen med pennan eller fingret, eller tryck på Visa hur. Du kan börja om. I Öva A och a sparas varje godkänd skrivning.',
  float: 'Starta experimentet. Välj vad du tror kommer att hända. Titta på resultatet och välj själv när du går vidare.',
  magnet: 'Starta experimentet. Välj vad du tror magneten drar till sig. Titta på resultatet innan nästa sak.',
  water: 'Ändra temperaturen med termometern. Texten visar om det är is, vatten eller ånga. Prova det kalla locket när det är ånga.',
  solar: 'Välj solen eller en planet för att läsa om den. Du kan också jämföra planeternas storlek.',
  rocket: 'Välj färg och fenor. Gå till startplattan och välj nästa tal i nedräkningen.',
  studio: 'Välj en sak och tryck i rummet för att placera den. Du kan flytta, vända och lägga tillbaka saker. Leken har inget rätt svar.',
  stories: 'Välj en berättelse. Du kan lyssna eller trycka på ett ord för att höra det. Titta i texten när du svarar på frågor.',
};

// Varje vy får en egen rot: sena händelser kan se när aktiviteten stängts.
export function mountActivitySupport(el, { kos, module: mod, onExit }) {
  const helpText = HELP[mod.view] || `Utforska ${mod.name}. Prova ett val i taget. Be en vuxen att visa om du behöver hjälp.`;
  const help = h('div.activity-help', { hidden: true, role: 'status' }, h('p', helpText),
    onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Läs hjälpen'), () => kos.read(helpText)));
  const helpButton = onTap(h('button.btn.btn-ghost', { type: 'button', 'aria-expanded': 'false' }, 'Hjälp'), () => {
    help.hidden = !help.hidden;
    helpButton.setAttribute('aria-expanded', String(!help.hidden));
  });
  const content = h('div.activity-content');
  let dialog = null;
  let closeDialog = null;
  let ownsPause = false;
  const resume = () => {
    if (!ownsPause) return;
    ownsPause = false;
    kos.paused = false;
    closeDialog?.();
    closeDialog = null;
    dialog = null;
    if (pauseButton.isConnected) pauseButton.focus({ preventScroll: true });
  };
  const pauseButton = onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Paus'), () => {
    if (ownsPause || kos.paused) return;
    ownsPause = true;
    kos.paused = true;
    dialog = h('dialog.quiz-pause-dialog', { 'aria-label': 'Paus' }, h('h2', 'Paus'),
      h('p', 'Aktiviteten finns kvar. Fortsätt när du vill.'),
      onTap(h('button.btn.btn-primary', { type: 'button' }, 'Fortsätt'), resume),
      h('p.muted', 'Det du redan tjänat finns kvar. En ofärdig aktivitet kan börja om nästa gång.'),
      onTap(h('button.btn.btn-ghost', { type: 'button' }, 'Avsluta aktiviteten'), () => { resume(); onExit(); }));
    dialog.addEventListener('cancel', event => { event.preventDefault(); resume(); });
    closeDialog = openDialog(dialog, kos.overlayRoot || document.body);
  });
  el.append(h('div.activity-support', helpButton, pauseButton), help, content);
  return { content, destroy: resume };
}
