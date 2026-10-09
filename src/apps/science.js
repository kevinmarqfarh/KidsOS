// Vetenskap-appen: experiment med arbetsgången Fråga → Gissa → Testa → Förklara.

export const FLOAT_ITEMS = [
  { id: 'apple', e: '🍎', n: 'äpplet', floats: true, why: 'Äpplet flyter eftersom det har mycket luft inuti – ungefär en fjärdedel av äpplet är luft.' },
  { id: 'stone', e: '🪨', n: 'stenen', floats: false, why: 'Stenen är tung för sin storlek. Den är tätare än vatten och sjunker.' },
  { id: 'wood', e: '🪵', n: 'träbiten', floats: true, why: 'Trä är lättare än lika mycket vatten. Därför flyter båtar av trä.' },
  { id: 'key', e: '🔑', n: 'nyckeln', floats: false, why: 'Nyckeln är av metall. Metall är mycket tätare än vatten.' },
  { id: 'duck', e: '🦆', n: 'badankan', floats: true, why: 'Badankan är ihålig och full av luft, så den flyter.' },
  { id: 'coin', e: '🪙', n: 'myntet', floats: false, why: 'Ett mynt är litet men tätt och tungt för sin storlek. Det sjunker.' },
  { id: 'sponge', e: '🧽', n: 'tvättsvampen', floats: true, why: 'Svampen har massor av små hål med luft. Den flyter – tills den suger upp mycket vatten.' },
  { id: 'ice', e: '🧊', n: 'isbiten', floats: true, why: 'Is är lite lättare än vatten. Därför flyter isbitar och isberg!' },
  { id: 'spoon', e: '🥄', n: 'skeden', floats: false, why: 'Skeden är av metall och sjunker.' },
  { id: 'egg', e: '🥚', n: 'ägget', floats: false, why: 'Ett färskt ägg sjunker i vanligt vatten. Men häller man i mycket salt flyter det! Saltvatten bär mer.' },
  { id: 'orange', e: '🍊', n: 'apelsinen', floats: true, why: 'Apelsinen flyter tack vare skalet som är fullt av små luftbubblor. Utan skal sjunker den!' },
  { id: 'ball', e: '🏐', n: 'bollen', floats: true, why: 'Bollen är fylld med luft och flyter, fast den är stor.' },
];

const FOIL = '<svg viewBox="0 0 60 60" class="mini"><path d="M10 34 L18 14 L32 18 L44 10 L52 26 L48 44 L34 52 L18 48 Z" fill="#d9dde6" stroke="#8d96a8" stroke-width="2"/><path d="M18 14 L26 30 L44 10 M26 30 L48 44 M26 30 L18 48 M26 30 L10 34" stroke="#a8b0c0" stroke-width="1.5" fill="none"/></svg>';

export const MAGNET_ITEMS = [
  { id: 'clip', e: '📎', n: 'gemet', magnetic: true, why: 'Gem är gjorda av stål (järn). Järn dras till magneter.' },
  { id: 'nail', e: '🔩', n: 'skruven', magnetic: true, why: 'Skruven är av stål, som innehåller järn.' },
  { id: 'can', e: '🥫', n: 'konservburken', magnetic: true, why: 'Konservburkar är oftast gjorda av stål.' },
  { id: 'pin', e: '🧷', n: 'säkerhetsnålen', magnetic: true, why: 'Säkerhetsnålen är av stål.' },
  { id: 'pencil', e: '✏️', n: 'pennan', magnetic: false, why: 'Pennan är av trä och grafit. De dras inte till magneter.' },
  { id: 'apple', e: '🍎', n: 'äpplet', magnetic: false, why: 'Frukt är inte magnetisk.' },
  { id: 'glass', e: '🥛', n: 'glaset', magnetic: false, why: 'Glas är inte magnetiskt.' },
  { id: 'foil', e: FOIL, n: 'aluminiumfolien', magnetic: false, why: 'Överraskning! Aluminium är en metall men dras INTE till magneter. Bara vissa metaller, som järn, är magnetiska.' },
  { id: 'ring', e: '💍', n: 'guldringen', magnetic: false, why: 'Guld är en metall som inte är magnetisk.' },
  { id: 'teddy', e: '🧸', n: 'nallen', magnetic: false, why: 'Tyg och stoppning är inte magnetiskt.' },
];

export const RECYCLE_BINS = [
  { id: 'papper', label: 'Papper', html: '📦' },
  { id: 'plast', label: 'Plast', html: '🧴' },
  { id: 'metall', label: 'Metall', html: '🥫' },
  { id: 'glas', label: 'Glas', html: '🫙' },
  { id: 'mat', label: 'Matavfall', html: '🍌' },
  { id: 'pant', label: 'Pant', html: '♻️' },
];
export const RECYCLE_ITEMS = [
  { id: 'mjolk', e: '🥛', n: 'mjölkpaket', bin: 'papper' },
  { id: 'tidning', e: '📰', n: 'tidning', bin: 'papper' },
  { id: 'kartong', e: '📦', n: 'kartong', bin: 'papper' },
  { id: 'banan', e: '🍌', n: 'bananskal', bin: 'mat' },
  { id: 'agg', e: '🥚', n: 'äggskal', bin: 'mat' },
  { id: 'apple', e: '🍏', n: 'skrutt', bin: 'mat' },
  { id: 'syltburk', e: '🫙', n: 'syltburk', bin: 'glas' },
  { id: 'vinflaska', e: '🍾', n: 'glasflaska', bin: 'glas' },
  { id: 'konserv', e: '🥫', n: 'konservburk', bin: 'metall' },
  { id: 'lock', e: '🔘', n: 'metallock', bin: 'metall' },
  { id: 'pase', e: '🛍️', n: 'plastpåse', bin: 'plast' },
  { id: 'schampo', e: '🧴', n: 'schampoflaska', bin: 'plast' },
  { id: 'burk', e: '🥤', n: 'läskburk med pant', bin: 'pant' },
  { id: 'pet', e: '🍼', n: 'PET-flaska med pant', bin: 'pant' },
];
export function genRecycle(level, rng) {
  const bins = level === 0 ? rng.sample(RECYCLE_BINS.filter((b) => b.id !== 'pant'), 2) : level === 1 ? rng.sample(RECYCLE_BINS, 3) : rng.sample(RECYCLE_BINS, 4);
  const items = rng.sample(RECYCLE_ITEMS.filter((i) => bins.some((b) => b.id === i.bin)), level === 0 ? 4 : 6);
  return {
    type: 'sort',
    prompt: 'Källsortera skräpet! Var ska det slängas?',
    bins,
    items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
    hint: 'Vad är saken gjord av? Papper, plast, metall eller glas? Är det mat?',
    explain: 'När vi sorterar kan materialet återvinnas och bli nya saker. Burkar och flaskor med pant lämnar man tillbaka i affären och får pengar.',
  };
}

// Friktionstal (förenklade) för rutschkanan.
export const SURFACES = [
  { id: 'is', n: 'Is', e: '🧊', mu: 0.03, color: '#d4f1ff' },
  { id: 'plast', n: 'Plast', e: '🛝', mu: 0.12, color: '#ff9f1c' },
  { id: 'tra', n: 'Trä', e: '🪵', mu: 0.3, color: '#c58b4f' },
  { id: 'matta', n: 'Matta', e: '🧶', mu: 0.5, color: '#b06bff' },
  { id: 'sand', n: 'Sandpapper', e: '🟫', mu: 0.75, color: '#c9a27a' },
];

/** Hur långt en kälke glider ut på marken efter backen (förenklad fysik). */
export function slideDistance(heightM, muSlope, muGround = 0.25, angleDeg = 30) {
  const a = (angleDeg * Math.PI) / 180;
  // Energi längs backen: m g h - μ m g cos(a) * (h / sin a)
  const lossFactor = muSlope / Math.tan(a);
  const energyAtBottom = heightM * (1 - lossFactor); // i meter "höjd"
  if (energyAtBottom <= 0) return { stuck: true, ground: 0, slopeFraction: Math.max(0, Math.min(1, 1 / Math.max(lossFactor, 1e-6))) };
  return { stuck: false, ground: energyAtBottom / muGround, slopeFraction: 1 };
}

/** Gungbräda: vridmoment (vikt × avstånd). Positiv = lutar åt höger. */
export function seesawTorque(left, right) {
  const t = (arr) => arr.reduce((s, x) => s + x.w * x.d, 0);
  return t(right) - t(left);
}

export const SEESAW_ANIMALS = [
  { id: 'mus', e: '🐭', n: 'musen', w: 1 },
  { id: 'katt', e: '🐱', n: 'katten', w: 2 },
  { id: 'hund', e: '🐶', n: 'hunden', w: 3 },
  { id: 'gris', e: '🐷', n: 'grisen', w: 4 },
];

export const SEESAW_MISSIONS = [
  { text: 'Sätt katten på ena sidan och en annan katt på andra sidan – lika långt ut. Blir det jämvikt?', check: (L, R) => L.length === 1 && R.length === 1 && L[0].w === R[0].w && L[0].d === R[0].d },
  { text: 'Få gungbrädan i jämvikt med musen och katten. Tips: den lätta ska sitta längre ut!', check: (L, R) => [...L, ...R].length === 2 && new Set([...L, ...R].map((x) => x.w)).size === 2 && [...L, ...R].every((x) => x.w <= 2) && L.length === 1 && seesawTorque(L, R) === 0 },
  { text: 'Kan grisen balansera mot hunden + musen?', check: (L, R) => seesawTorque(L, R) === 0 && [...L, ...R].length === 3 && [...L, ...R].some((x) => x.w === 4) },
  { text: 'Fri lek! Få jämvikt med minst fyra djur.', check: (L, R) => seesawTorque(L, R) === 0 && L.length + R.length >= 4 },
];

// Scenarios use supplied observations, not instructions to perform experiments.
// Level 0: 4–5 years; 1: 6–7; 2–3: 8–9; 4: 10–12.
export const SCIENCE_SCENARIOS = {
  investigate: [
    [0, 'Du ser tre blad på bordet. Vad har du gjort?', 'Tittat och räknat', ['Gissat vad som finns i morgon', 'Ändrat bladen'], 'Tänk på vad du kan se nu.', 'En observation är något vi ser eller mäter. Här räknade du tre blad.'],
    [0, 'Jag tror att bollen rullar. Vad är det?', 'En gissning före testet', ['Ett resultat efter testet', 'Ett foto'], 'Testet har inte hänt ännu.', 'En förutsägelse säger vad vi tror kommer att hända. Sedan kan vi undersöka.'],
    [1, 'Du gissade att klossen flyter. Den sjönk i testet. Vad skriver du?', 'Klossen sjönk', ['Klossen flöt', 'Jag måste gömma resultatet'], 'Berätta vad du såg.', 'Vi skriver resultatet även när det skiljer sig från vår förutsägelse.'],
    [1, 'En bil rullade till den blå linjen. Hur sparar du observationen?', 'Ritar bilen vid den blå linjen', ['Ritar var jag önskade att den stannade', 'Skriver bara att bilen var fin'], 'Visa var bilen faktiskt stannade.', 'En bild kan dokumentera ett resultat så att vi minns och kan jämföra.'],
    [2, 'Vi jämför hur långt samma bil rullar på två underlag. Vad ska vara lika?', 'Bil och startplats', ['Bara färgen på våra tröjor', 'Vi byter både bil och startplats'], 'Vi vill undersöka underlaget.', 'När bara underlaget ändras blir jämförelsen lättare att tolka.'],
    [2, 'Bilen rullade 20, 21 och 19 centimeter. Varför testa flera gånger?', 'För att se hur resultaten varierar', ['För att ett önskat svar ska vinna', 'För att slippa mäta'], 'Alla mätningar behöver inte bli identiska.', 'Upprepningar visar variation. Ett enda försök kan ge en ofullständig bild.'],
    [3, 'Vilken fråga går att undersöka genom att mäta?', 'Hur långt rullar bilen på mattan?', ['Är bilen världens finaste?', 'Vilken färg är bäst för alla?'], 'En mätning kan ge ett avstånd.', 'En undersökningsbar fråga behöver kunna kopplas till observationer eller mätningar.'],
    [3, 'Vi såg en fågel en gång. Vad kan vi säga säkert?', 'Vi såg en fågel vid det tillfället', ['Det finns alltid exakt en fågel', 'Det finns inga andra fåglar'], 'Skilj vad vi såg från vad vi inte vet.', 'En observation beskriver ett tillfälle. Fler tillfällen behövs för ett större mönster.'],
    [4, 'Två växter får olika ljus och olika mycket vatten. Kan vi avgöra ljusets effekt?', 'Nej, båda sakerna ändrades', ['Ja, vatten spelar aldrig roll', 'Ja, två växter räcker alltid'], 'Vilka skillnader kan påverka resultatet?', 'Flera ändrade faktorer gör det svårt att skilja deras effekter. Jämför grupper med samma vatten men olika ljus.'],
    [4, 'Två grupper får nästan samma mätresultat. Skillnaden är mindre än linjalens minsta steg. Vad är rimligt?', 'Skillnaden kan vara för liten för att avgöra med mätningen', ['Vi har bevisat en stor skillnad', 'Vi ska hitta på fler decimaler'], 'Tänk på hur noggrant vi kan mäta.', 'Mätverktyg har begränsad upplösning. Redovisa osäkerheten och använd fler eller noggrannare mätningar vid behov.'],
  ],
  forces: [
    [0, 'Du skjuter en leksaksbil framåt. Vad använder du?', 'En knuff', ['En doft', 'En skugga'], 'Din hand trycker på bilen.', 'En kraft kan vara en knuff eller ett drag.'],
    [0, 'Ett löst äpple faller från trädet. Vad drar det mot marken?', 'Tyngdkraften', ['Äpplets färg', 'Ljudet från trädet'], 'Jorden drar föremål mot sig.', 'Tyngdkraften drar äpplet mot jorden.'],
    [1, 'Du drar en leksaksvagn mot dig. Vad gör kraften här?', 'Får vagnen att börja röra sig', ['Gör vagnen levande', 'Tar bort alla hjul'], 'Titta på vad som ändras.', 'En kraft kan ändra ett föremåls rörelse.'],
    [1, 'En rullande boll bromsas av mattan. Vad kallas kraften mellan ytorna?', 'Friktion', ['Regn', 'Ljus'], 'Ytorna bromsar rörelsen.', 'Friktion mellan ytor kan motverka rörelse.'],
    [2, 'Samma bil startar lika på två underlag. Den rullar kortare på matta än på slätt golv. Vad stöder testet?', 'Bilen bromsas mer på mattan i detta test', ['Alla mattor har exakt samma friktion', 'Bilens färg ändrade kraften'], 'Använd resultatet från just detta test.', 'Friktion beror på ytorna. Observationen jämför dessa underlag med denna bil.'],
    [2, 'Två lika tunga figurer sitter lika långt från mitten på en gungbräda. Vad väntar vi oss?', 'Jämvikt', ['Att bara färgen avgör', 'Att båda sidorna blir tyngre'], 'Jämför vikt och avstånd på båda sidor.', 'Lika vikter på lika avstånd ger lika stora vridande effekter.'],
    [3, 'En lätt figur ska balansera en tyngre på gungbrädan. Vad kan hjälpa?', 'Flytta den lätta längre från mitten', ['Flytta den lätta till mitten', 'Byta den lätta figurens färg'], 'Avståndet påverkar balansen.', 'Vridmoment beror på både tyngd och avstånd till mitten.'],
    [3, 'Två lika stora pilar visar lika stora krafter åt motsatta håll på en stilla låda. Vad är summan?', 'Noll', ['Dubbelt åt höger', 'Alltid uppåt'], 'Krafterna motverkar varandra.', 'Lika stora motsatta krafter tar ut varandra. Den stilla lådan börjar inte röra sig av dessa krafter.'],
    [4, 'En bil rullar längre efter att både rampen höjts och underlaget bytts. Vilken slutsats är stödd?', 'Vi vet inte vilken ändring som gav skillnaden', ['Höjden är säkert ensam orsak', 'Underlaget är säkert ensam orsak'], 'Två faktorer ändrades samtidigt.', 'För att jämföra rampens höjd behöver bil och underlag hållas lika medan höjden ändras.'],
    [4, 'I modellen blir glidsträckan dubbelt så lång när höjden dubbleras. Kan vi lova samma sak i verkligheten?', 'Nej, modellen förenklar och behöver jämföras med mätningar', ['Ja, modeller är alltid exakt verkligheten', 'Ja, alla ytor är likadana'], 'Modellen använder antaganden.', 'En modell hjälper oss tänka, men verkliga ytor och andra krafter kan ge skillnader.'],
  ],
  resources: [
    [0, 'En tom kartong blir ett leksakshus. Vad gör vi?', 'Använder kartongen igen', ['Tillverkar en ny kartong', 'Gör kartongen till vatten'], 'Samma kartong får en ny uppgift.', 'Att använda en sak igen kallas återanvändning.'],
    [0, 'Du ritar på papperets tomma baksida. Vad sparar du?', 'Ett nytt papper', ['Alla träd på jorden', 'Ingenting alls'], 'Du använder det papper du har.', 'När båda sidor används kan färre nya papper behövas.'],
    [1, 'Vad är skillnaden mellan återanvändning och återvinning?', 'Använda saken igen eller göra nytt material av den', ['Båda betyder att gömma saken', 'Återvinning gör inget med materialet'], 'Tänk på sak och material.', 'Återanvändning behåller saken. Vid återvinning bearbetas material för att kunna användas igen.'],
    [1, 'En hel bok får en ny läsare. Behövs en ny bok för den läsningen?', 'Nej, samma bok används igen', ['Ja, boken försvinner vid läsning', 'Ja, varje läsning kräver nytt papper'], 'Boken finns redan.', 'Delning kan göra att fler får använda en sak som redan tillverkats.'],
    [2, 'En trasig leksak lagas och fungerar igen. Vad kan det minska behovet av?', 'Att tillverka en ersättningsleksak', ['Att någon leker', 'Att någonsin sortera avfall'], 'Den lagade saken kan användas vidare.', 'Reparation kan förlänga användningen och minska behovet av nya saker och material.'],
    [2, 'Gruppen har tio pappersark. Varje barn behöver två sidor. Vad ger flest skrivsidor?', 'Använda båda sidorna på alla ark', ['Använda bara framsidan', 'Kasta fem ark först'], 'Ett ark har två sidor.', 'Tio ark ger tjugo skrivsidor om båda sidor används.'],
    [3, 'Skolan kastade 12 ark på måndagen och 7 på tisdagen. Vad vet vi?', 'Färre ark kastades på tisdagen', ['Alla veckor ger samma skillnad', 'Vi vet säkert varför det minskade'], 'Räkning visar vad, men inte alltid varför.', 'Mätningen visar en skillnad på fem ark. Den visar inte ensam orsaken eller ett långvarigt mönster.'],
    [3, 'Varför kan återvinning spara råvaror?', 'Material från gamla saker kan användas i nya', ['Material försvinner för alltid', 'Alla nya saker blir helt utan material'], 'Nya produkter behöver material.', 'Återvunnet material kan ersätta en del nya råvaror. Alla material kan inte återvinnas hur många gånger som helst.'],
    [4, 'Klass A kastar 20 ark med 20 barn. Klass B kastar 15 ark med 10 barn. Vilken jämförelse är rättvisare?', 'Jämföra ark per barn under samma tid', ['Bara jämföra totalen', 'Ignorera antalet barn'], 'Grupperna är olika stora.', 'A kastar ett ark per barn, B ett och ett halvt. Samma tidsperiod och liknande uppgifter behövs också.'],
    [4, 'En klass delar böcker och får färre leveranser, men elevantalet minskar också. Vad behövs för att tolka resultatet?', 'Ta hänsyn till både elevantal och delning', ['Ge delning hela äran direkt', 'Räkna bara bokomslagens färger'], 'Fler än en faktor kan påverka behovet.', 'En minskning visar inte ensam delningens effekt. Jämför exempelvis böcker per elev med liknande behov före och efter.'],
  ],
};

export function genScienceScenario(topic, level, rng) {
  const rows = SCIENCE_SCENARIOS[topic];
  const band = level === 3 ? 2 : level;
  // Prefer age-band content; level 2 and 3 share a band.
  const eligible = rows.filter(([min]) => (min === 3 ? 2 : min) === band);
  const [, prompt, answer, distractors, hint, explain] = rng.pick(eligible);
  return { type: 'choice', prompt, options: rng.shuffle([answer, ...distractors]).map(label => ({ id: label, label })), answer, hint, explain };
}

export const scienceApp = {
  id: 'science',
  name: 'Vetenskap',
  icon: '🔬',
  color: '#13a3a0',
  tagline: 'Experimentera och undersök',
  modules: [
    { id: 'investigate', name: 'Tänk som en forskare', icon: '🔎', minLevel: 0, gen: (level, rng) => genScienceScenario('investigate', level, rng), lgr: ['no-metod'] },
    { id: 'forces', name: 'Krafter i vardagen', icon: '↔️', minLevel: 0, gen: (level, rng) => genScienceScenario('forces', level, rng), lgr: ['no-friktion', 'no-balans', 'no-metod'] },
    { id: 'resources', name: 'Ta vara på saker', icon: '🌱', minLevel: 0, gen: (level, rng) => genScienceScenario('resources', level, rng), lgr: ['no-sortera', 'no-metod'] },
    { id: 'float', name: 'Flyter eller sjunker?', icon: '🛁', minLevel: 0, view: 'float', lgr: ['no-material', 'no-metod'] },
    { id: 'magnet', name: 'Magneten', icon: '🧲', minLevel: 0, view: 'magnet', lgr: ['no-material', 'no-metod'] },
    { id: 'recycle', name: 'Källsortera', icon: '♻️', minLevel: 0, gen: genRecycle, lgr: ['no-sortera'] },
    { id: 'shadow', name: 'Ljus & skugga', icon: '🔦', minLevel: 0, view: 'shadow', lgr: ['no-ljus'] },
    { id: 'water', name: 'Vattnets former', icon: '💧', minLevel: 1, view: 'water', lgr: ['no-vatten'] },
    { id: 'seesaw', name: 'Gungbrädan', icon: '⚖️', minLevel: 1, view: 'seesaw', lgr: ['no-balans'] },
    { id: 'slide', name: 'Rutschkanan', icon: '🛝', minLevel: 2, view: 'slide', lgr: ['no-friktion'] },
    { id: 'mix', name: 'Blanda & separera', icon: '🧪', minLevel: 2, view: 'mix', lgr: ['no-blandning', 'no-metod'] },
  ],
};

export const EXPERIMENT_IDS = scienceApp.modules.filter((m) => m.view).map((m) => m.id);
