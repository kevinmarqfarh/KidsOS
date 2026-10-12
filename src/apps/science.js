// Vetenskap-appen: experiment med arbetsgången Fråga → Gissa → Testa → Förklara.

/* ---------- Gemensamma hjälpare för faktafrågor (används även av Biologi) ---------- */
// En rad: { lv, q, o: [rätt, ...fel], ex, hint?, say? }. Ett alternativ är text eller [emoji, text].
// Emoji som inte ska bytas mot foto (t.ex. för att fotot visar fel art) skrivs med np('🦌').
export const np = (e) => `<span class="no-photo">${e}</span>`;

/** Väljer en rad som passar nivån: oftast nivån eller nivån under, ibland lättare repetition. */
export function levelPick(rng, rows, level) {
  const all = rows.filter((r) => r.lv <= level);
  const near = all.filter((r) => r.lv >= level - 1);
  return near.length && rng.chance(0.75) ? rng.pick(near) : rng.pick(all);
}

const toOption = (o) => (Array.isArray(o) ? { id: o[1], html: `<span class="pic sm">${o[0]}</span><span>${o[1]}</span>`, say: o[1] } : { id: o, label: o });

/** Flervalsfråga av en rad. Nivå 0–1: högst tre alternativ, därefter fyra. */
export function rowChoice(rng, row, level, { hint = 'Tänk efter – vad vet du om det här?', visual } = {}) {
  const [right, ...wrong] = row.o;
  const opts = [right, ...rng.sample(wrong, level <= 1 ? 2 : 3)].map(toOption);
  const q = { type: 'choice', prompt: row.q, options: rng.shuffle(opts), answer: toOption(right).id, hint: row.hint || hint, explain: row.ex };
  if (row.say) q.say = row.say;
  if (visual) q.visual = visual;
  return q;
}

/** Sorteringsuppgift: välj lådor och föremål efter nivå. items: { id, e, n, bin }. */
export function sortTask(rng, { bins, items, nBins, nItems, prompt, hint, explain }) {
  const useBins = nBins && nBins < bins.length ? rng.sample(bins, nBins) : bins;
  const pool = items.filter((i) => useBins.some((b) => b.id === i.bin));
  const chosen = rng.sample(pool, nItems);
  return {
    type: 'sort',
    prompt,
    bins: useBins.map((b) => ({ id: b.id, label: b.label, html: b.html })),
    items: chosen.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
    hint,
    explain,
  };
}

export const FLOAT_ITEMS = [
  { id: 'apple', e: '🍎', n: 'äpplet', floats: true, why: 'Äpplet flyter eftersom det har mycket luft inuti – ungefär en fjärdedel av äpplet är luft.' },
  { id: 'stone', e: '🪨', n: 'stenen', floats: false, why: 'Stenen är tung för sin storlek. Den är tätare än vatten och sjunker.' },
  { id: 'wood', e: '🪵', n: 'träbiten', floats: true, why: 'Trä är lättare än lika mycket vatten. Därför flyter båtar av trä.' },
  { id: 'key', e: '🔑', n: 'nyckeln', floats: false, why: 'Nyckeln är av metall. Metall är mycket tätare än vatten.' },
  { id: 'duck', e: '<span class="no-photo">🦆</span>', n: 'badankan', floats: true, why: 'Badankan är ihålig och full av luft, så den flyter.' },
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
  { id: 'batteri', label: 'Batterier', html: '🔋' },
];
export const RECYCLE_ITEMS = [
  { id: 'mjolk', e: '🥛', n: 'mjölkpaket', bin: 'papper' },
  { id: 'tidning', e: '📰', n: 'tidning', bin: 'papper' },
  { id: 'kartong', e: '📦', n: 'kartong', bin: 'papper' },
  { id: 'pizzakartong', e: '<span class="no-photo">🍕</span>', n: 'pizzakartong', bin: 'papper' },
  { id: 'banan', e: '🍌', n: 'bananskal', bin: 'mat' },
  { id: 'agg', e: '🥚', n: 'äggskal', bin: 'mat' },
  { id: 'apple', e: '🍏', n: 'äppelskrutt', bin: 'mat' },
  { id: 'apelsin', e: '🍊', n: 'apelsinskal', bin: 'mat' },
  { id: 'kaffe', e: '☕', n: 'kaffesump', bin: 'mat' },
  { id: 'syltburk', e: '🫙', n: 'syltburk', bin: 'glas' },
  { id: 'vinflaska', e: '🍾', n: 'glasflaska', bin: 'glas' },
  { id: 'konserv', e: '🥫', n: 'konservburk', bin: 'metall' },
  { id: 'lock', e: '🔘', n: 'metallock', bin: 'metall' },
  { id: 'varmeljus', e: '<span class="no-photo">🕯️</span>', n: 'tom värmeljuskopp', bin: 'metall' },
  { id: 'pase', e: '🛍️', n: 'plastpåse', bin: 'plast' },
  { id: 'schampo', e: '🧴', n: 'schampoflaska', bin: 'plast' },
  { id: 'tub', e: '<span class="no-photo">🪥</span>', n: 'tom tandkrämstub', bin: 'plast' },
  { id: 'burk', e: '🥤', n: 'läskburk med pant', bin: 'pant' },
  { id: 'pet', e: '<span class="no-photo">🍼</span>', n: 'PET-flaska med pant', bin: 'pant' },
  { id: 'batteri', e: '🔋', n: 'gammalt batteri', bin: 'batteri' },
  { id: 'knappcell', e: '🔋', n: 'litet knappbatteri', bin: 'batteri' },
];
export const RECYCLE_FACTS = [
  { lv: 2, q: 'Var lämnar du en burk eller flaska med pant?', o: ['i affärens pantmaskin', 'i matavfallet', 'i skogen'], ex: 'Pantburkar och PET-flaskor lämnar du i pantmaskinen i affären. Då får du tillbaka lite pengar och materialet blir nya burkar och flaskor.' },
  { lv: 3, q: 'Varför ska batterier inte slängas bland de vanliga soporna?', o: ['de innehåller ämnen som kan skada naturen', 'de kan börja växa', 'de är för tunga för soppåsen'], ex: 'Batterier lämnar du i en batteriholk eller på en återvinningscentral. Där tas ämnena om hand på ett säkert sätt.' },
  { lv: 3, q: 'Vad kan matavfall bli när det sorteras?', o: ['biogas och gödsel', 'nya bananer direkt', 'plastpåsar'], ex: 'Av matavfall kan man göra biogas, som kan driva bussar, och gödsel som hjälper nya växter att växa.' },
  { lv: 3, q: 'Vad är skillnaden mellan pappersförpackningar och tidningar?', o: ['de sorteras i olika kärl', 'tidningar ska i matavfallet', 'det finns ingen skillnad alls'], ex: 'Mjölkpaket och kartonger är pappersförpackningar. Tidningar har ett eget kärl. Båda blir nytt papper.' },
  { lv: 4, q: 'Hur många gånger kan glas återvinnas?', o: ['många gånger utan att bli sämre', 'bara en gång', 'aldrig'], ex: 'Glas kan smältas om och bli nya burkar och flaskor om och om igen.' },
  { lv: 4, q: 'Vad är allra bäst för miljön?', o: ['att använda saker länge och laga dem', 'att köpa nytt hela tiden', 'att slänga allt i samma påse'], ex: 'Återvinning är bra, men det är ännu bättre att använda saker länge, laga dem och låna av varandra. Då behövs mindre nytt material.' },
  { lv: 4, q: 'Varför ska plast inte hamna i naturen?', o: ['den bryts ner väldigt långsamt och kan skada djur', 'den blir till sand på en dag', 'den smakar gott för fåglar'], ex: 'Plast kan ligga kvar i naturen i hundratals år. Djur kan trassla in sig eller äta små plastbitar.' },
];
export function genRecycle(level, rng) {
  if (level >= 2 && rng.chance(level >= 3 ? 0.35 : 0.2)) return rowChoice(rng, levelPick(rng, RECYCLE_FACTS, level), level, { hint: 'Tänk på vad som händer med saken efteråt.' });
  const allowed = RECYCLE_BINS.filter((b) => (level === 0 ? !['pant', 'batteri'].includes(b.id) : level === 1 ? b.id !== 'batteri' : true));
  const nBins = level === 0 ? 2 : level === 1 ? 3 : level <= 3 ? 4 : 5;
  const bins = rng.sample(allowed, nBins);
  const items = rng.sample(RECYCLE_ITEMS.filter((i) => bins.some((b) => b.id === i.bin)), level === 0 ? 4 : level <= 2 ? 6 : 8);
  return {
    type: 'sort',
    prompt: 'Källsortera skräpet! Var ska det slängas?',
    bins,
    items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
    hint: 'Vad är saken gjord av? Papper, plast, metall eller glas? Är det mat?',
    explain: 'När vi sorterar kan materialet återvinnas och bli nya saker. Burkar och flaskor med pant lämnar man tillbaka i affären och får pengar. Batterier lämnas i en batteriholk.',
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

/* ---------- Material och deras egenskaper ---------- */
export const MATERIAL_BINS = [
  { id: 'tra', label: 'Trä', html: '🪵' },
  { id: 'metall', label: 'Metall', html: '🔩' },
  { id: 'glas', label: 'Glas', html: '🫙' },
  { id: 'plast', label: 'Plast', html: '🧴' },
  { id: 'papper', label: 'Papper', html: '📦' },
  { id: 'tyg', label: 'Tyg', html: '🧶' },
];
export const MATERIAL_ITEMS = [
  { id: 'vedtra', e: '🪵', n: 'vedträ', bin: 'tra' },
  { id: 'penna', e: '✏️', n: 'blyertspenna', bin: 'tra' },
  { id: 'fiol', e: '🎻', n: 'fiol', bin: 'tra' },
  { id: 'trasked', e: np('🥢'), n: 'ätpinnar av trä', bin: 'tra' },
  { id: 'nyckel', e: '🔑', n: 'nyckel', bin: 'metall' },
  { id: 'gem', e: '📎', n: 'gem', bin: 'metall' },
  { id: 'mynt', e: '🪙', n: 'mynt', bin: 'metall' },
  { id: 'burk', e: '🥫', n: 'konservburk', bin: 'metall' },
  { id: 'syltburk', e: '🫙', n: 'syltburk', bin: 'glas' },
  { id: 'spegel', e: '🪞', n: 'spegel', bin: 'glas' },
  { id: 'flaska', e: '🍾', n: 'glasflaska', bin: 'glas' },
  { id: 'tandborste', e: '🪥', n: 'tandborste', bin: 'plast' },
  { id: 'kontroll', e: '🎮', n: 'handkontroll', bin: 'plast' },
  { id: 'schampo', e: '🧴', n: 'schampoflaska', bin: 'plast' },
  { id: 'bok', e: '📖', n: 'bok', bin: 'papper' },
  { id: 'kartong', e: '📦', n: 'kartong', bin: 'papper' },
  { id: 'bocker', e: '📚', n: 'böcker', bin: 'papper' },
  { id: 'strumpa', e: '🧦', n: 'strumpa', bin: 'tyg' },
  { id: 'keps', e: '🧢', n: 'keps', bin: 'tyg' },
  { id: 'tshirt', e: '👕', n: 't-shirt', bin: 'tyg' },
];
export const MATERIAL_FACTS = [
  { lv: 1, q: 'Vilket material kan du se igenom?', o: ['glas', 'trä', 'metall', 'kartong'], ex: 'Glas är genomskinligt – ljuset går igenom. Därför har fönster glas.' },
  { lv: 1, q: 'Vad är papper gjort av?', o: ['trä', 'sand', 'olja', 'ull'], ex: 'Papper tillverkas av trä från träd, till exempel gran och tall.' },
  { lv: 2, q: 'Vad tillverkas glas mest av?', o: ['sand', 'trä', 'ull', 'mjölk'], ex: 'Glas görs mest av sand som smälts i väldigt hög värme.' },
  { lv: 2, q: 'Vilket material dras till en magnet?', o: ['järn', 'trä', 'glas', 'plast'], ex: 'Järn och stål dras till magneter. Trä, glas och plast gör det inte.' },
  { lv: 2, q: 'Vad kommer ull ifrån?', o: ['får', 'träd', 'berget', 'havet'], ex: 'Ull klipps från fårens päls. Ull värmer även när den har blivit lite blöt.' },
  { lv: 2, q: 'Varför är regnkläder ofta gjorda av plast eller gummi?', o: ['vattnet tränger inte igenom', 'de blir varmare av regn', 'de luktar gott'], ex: 'Plast och gummi släpper inte igenom vatten. Därför håller regnkläderna dig torr.' },
  { lv: 3, q: 'Varför har kastruller ofta handtag av plast eller trä?', o: ['handtaget blir inte lika varmt', 'kastrullen blir tyngre', 'handtaget lyser i mörkret'], ex: 'Metall leder värme bra och blir varm fort. Trä och plast leder värme dåligt, så du bränner dig inte.' },
  { lv: 3, q: 'Vilket material leder elektricitet?', o: ['metall', 'plast', 'gummi', 'trä'], ex: 'Elsladdar har metall inuti som leder strömmen och plast utanpå som skyddar oss.' },
  { lv: 3, q: 'Vad tillverkas plast oftast av?', o: ['olja', 'sand', 'ull', 'trä'], ex: 'De flesta plaster görs av olja. Plast kan ligga kvar i naturen i hundratals år – därför ska den sorteras.' },
  { lv: 3, q: 'Vad betyder det att ett material är elastiskt?', o: ['det går tillbaka till sin form', 'det smälter direkt', 'det är genomskinligt'], ex: 'Ett gummiband blir långt när du drar – och går tillbaka när du släpper. Det är elastiskt.' },
  { lv: 4, q: 'Varför rostar en cykel som står ute?', o: ['järnet reagerar med vatten och luft', 'solen målar den brun', 'cykeln blir för gammal för att glänsa'], ex: 'När järn får vatten och luft bildas rost. Färg och olja skyddar metallen.' },
  { lv: 4, q: 'Du vill testa vilket tyg som håller vattnet ute bäst. Vad är rättvist?', o: ['lika mycket vatten på lika stora tygbitar', 'olika mycket vatten på varje tyg', 'bara testa ett tyg'], ex: 'Bara tyget ska vara olika. Allt annat ska vara lika – annars vet vi inte vad som gjorde skillnaden.' },
  { lv: 4, q: 'Vad kan gamla glasflaskor bli efter återvinning?', o: ['nya glasburkar och flaskor', 'nya träd', 'bensin'], ex: 'Glas kan smältas om och bli nytt glas om och om igen.' },
  { lv: 4, q: 'Varför är en ytterdörr ofta av trä eller metall och inte av papper?', o: ['trä och metall är hårda och tåliga', 'papper är för tungt', 'papper är genomskinligt'], ex: 'Vi väljer material efter egenskaper. En dörr ska vara stark, hård och tåla regn.' },
];
export function genMaterials(level, rng) {
  if (level <= 1 && rng.chance(level === 0 ? 0.6 : 0.3)) {
    const bins = rng.sample(MATERIAL_BINS, 3);
    const [right, ...others] = bins;
    const target = rng.pick(MATERIAL_ITEMS.filter((i) => i.bin === right.id));
    const wrong = others.map((b) => rng.pick(MATERIAL_ITEMS.filter((i) => i.bin === b.id)));
    const mat = right.label.toLowerCase();
    return {
      type: 'choice',
      prompt: `Vilken sak är gjord av ${mat}?`,
      options: rng.shuffle([target, ...wrong]).map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span>${i.n}</span>`, say: i.n })),
      answer: target.id,
      hint: `Hur känns ${mat}? Tänk på hur saken ser ut och känns.`,
      explain: `${target.n[0].toUpperCase() + target.n.slice(1)} är gjord av ${mat}.`,
    };
  }
  if (level >= 2 && rng.chance(level === 2 ? 0.45 : 0.6)) return rowChoice(rng, levelPick(rng, MATERIAL_FACTS, level), level, { hint: 'Tänk på materialets egenskaper: hårt, mjukt, genomskinligt, magnetiskt?' });
  return sortTask(rng, {
    bins: MATERIAL_BINS,
    items: MATERIAL_ITEMS,
    nBins: level === 0 ? 2 : level <= 2 ? 3 : 4,
    nItems: level === 0 ? 4 : level <= 2 ? 6 : 8,
    prompt: 'Vad är sakerna gjorda av? Sortera efter material!',
    hint: 'Känns det hårt och kallt som metall? Går det att se igenom som glas?',
    explain: 'Föremål kan sorteras efter material. Trä kommer från träd, glas görs av sand och plast oftast av olja.',
  });
}

/* ---------- Vattnets former ---------- */
export const WATER_BINS = [
  { id: 'fast', label: 'Fast', html: '🧊' },
  { id: 'flytande', label: 'Flytande', html: '💧' },
  { id: 'gas', label: 'Gas', html: '♨️' },
];
export const WATER_ITEMS = [
  { id: 'isbit', e: '🧊', n: 'isbit', bin: 'fast' },
  { id: 'snogubbe', e: '⛄', n: 'snögubbe', bin: 'fast' },
  { id: 'snoflinga', e: '❄️', n: 'snöflinga', bin: 'fast' },
  { id: 'istapp', e: np('🧊'), n: 'istapp', bin: 'fast' },
  { id: 'droppe', e: '💧', n: 'vattendroppe', bin: 'flytande' },
  { id: 'hav', e: '🌊', n: 'havet', bin: 'flytande' },
  { id: 'regn', e: '☔', n: 'regn', bin: 'flytande' },
  { id: 'kran', e: np('🚰'), n: 'vatten ur kranen', bin: 'flytande' },
  { id: 'anga', e: '♨️', n: 'vattenånga när vatten kokar', bin: 'gas' },
  { id: 'tvatt', e: np('👕'), n: 'vatten som avdunstar från tvätten', bin: 'gas' },
  { id: 'pol', e: np('☀️'), n: 'vatten som avdunstar från en pöl', bin: 'gas' },
];
export const WATER_FACTS = [
  { lv: 0, q: 'Vad händer med en snögubbe när solen värmer?', o: [['💧', 'den smälter'], ['⛄', 'den blir större'], ['🔥', 'den börjar brinna']], ex: 'Snö är fruset vatten. När det blir varmt smälter snön och blir vatten.' },
  { lv: 0, q: 'Vad händer med vatten i frysen?', o: [['🧊', 'det blir is'], ['♨️', 'det blir ånga'], ['🌈', 'det blir en regnbåge']], ex: 'I frysen är det kallt. Vattnet fryser och blir is.' },
  { lv: 0, q: 'Vad händer med en isbit i en varm hand?', o: [['💧', 'den smälter till vatten'], ['🧊', 'den blir större'], ['❄️', 'den blir till snö']], ex: 'Handen är varm. Isen smälter och blir vatten.' },
  { lv: 1, q: 'Vid hur många grader fryser vatten till is?', o: ['0 grader', '20 grader', '100 grader', '50 grader'], ex: 'Vatten fryser vid noll grader. Kallare än noll kallas minusgrader.' },
  { lv: 1, q: 'Vad kallas det när is blir till vatten?', o: ['smältning', 'kokning', 'stelning', 'avdunstning'], ex: 'När is värms upp smälter den. Det kallas smältning.' },
  { lv: 2, q: 'Vid hur många grader kokar vatten?', o: ['100 grader', '0 grader', '37 grader', '10 grader'], ex: 'Vatten kokar vid 100 grader. Då bubblar det och blir vattenånga.' },
  { lv: 2, q: 'Vart tar vattnet i en pöl vägen när solen skiner?', o: ['det avdunstar och blir ånga i luften', 'det sjunker ner till jordens mitt', 'fåglarna dricker upp allt'], ex: 'Vattnet avdunstar – det blir till osynlig vattenånga i luften. Det kallas avdunstning.' },
  { lv: 2, q: 'Varför flyter isbitar i saften?', o: ['is är lättare än lika mycket vatten', 'is är varm', 'isbitar kan simma'], ex: 'När vatten fryser tar det mer plats. Därför blir isen lättare än samma mängd vatten och flyter.' },
  { lv: 3, q: 'Varför blir det små droppar på utsidan av ett kallt glas?', o: ['vattenånga i luften blir till droppar', 'glaset svettas', 'saften läcker genom glaset'], ex: 'Luften har osynlig vattenånga. När den kyls av mot det kalla glaset blir den droppar. Det kallas kondensering.' },
  { lv: 3, q: 'Vad kallas det när vatten blir till is?', o: ['stelning', 'smältning', 'avdunstning', 'kokning'], ex: 'När vatten fryser till is kallas det stelning.' },
  { lv: 3, q: 'Vad är moln gjorda av?', o: ['små vattendroppar eller iskristaller', 'bomull', 'rök från skorstenar'], ex: 'Moln är jättemånga pyttesmå droppar eller iskristaller som svävar i luften.' },
  { lv: 3, q: 'Vattnets kretslopp: vad händer efter att vattnet har avdunstat från havet?', o: ['det bildar moln', 'det blir sand', 'det försvinner för alltid'], ex: 'Vattenångan stiger, kyls av och bildar moln. Sen regnar eller snöar det, och vattnet rinner tillbaka till havet.' },
  { lv: 4, q: 'Varför kan en full glasflaska med vatten spricka i frysen?', o: ['vattnet tar mer plats när det fryser', 'kylan gör glaset mjukt', 'isen blir tyngre än glaset'], ex: 'Is tar ungefär en tiondel mer plats än vatten. Isen trycker sönder flaskan.' },
  { lv: 4, q: 'Varför är gräset blött av dagg en sval morgon?', o: ['vattenånga i luften kondenserar när det svalnar', 'det har regnat i hemlighet', 'gräset svettas på natten'], ex: 'På natten svalnar marken. Vattenångan i luften blir till små droppar på gräset – dagg.' },
  { lv: 4, q: 'Den vita "röken" ovanför en kokande kastrull – vad är det?', o: ['små vattendroppar', 'osynlig gas', 'rök från spisen'], ex: 'Riktig vattenånga är osynlig. När den kyls av i luften blir den små droppar som vi kan se.' },
  { lv: 4, q: 'Tvätt torkar snabbast när det är …', o: ['varmt och blåsigt', 'kallt och stilla', 'mörkt och fuktigt'], ex: 'Värme och vind gör att vattnet avdunstar snabbare.' },
];
const WATER_ORDERS = [
  { lv: 1, prompt: 'Vi värmer en isbit. Lägg bilderna i rätt ordning!', steps: [['isbit', '🧊', 'isbit'], ['vatten', '💧', 'vatten'], ['anga', '♨️', 'vattenånga']], ex: 'Is smälter till vatten. Om vattnet kokar blir det vattenånga.' },
  { lv: 1, prompt: 'Vi lägger vatten i frysen. Lägg bilderna i rätt ordning!', steps: [['vatten', '💧', 'vatten i en form'], ['kallt', '❄️', 'det blir kallt i frysen'], ['is', '🧊', 'isbitar']], ex: 'Vatten som blir kallare än noll grader stelnar till is.' },
  { lv: 3, prompt: 'Vattnets kretslopp! Börja med havet.', steps: [['hav', '🌊', 'vatten i havet'], ['avdunstar', '♨️', 'vattnet avdunstar'], ['moln', '☁️', 'det bildas moln'], ['regn', '☔', 'det regnar']], ex: 'Solen värmer havet så att vatten avdunstar. Ångan bildar moln, och sen regnar det. Vattnet rinner tillbaka till havet – och så börjar det om.' },
];
export function genWaterForms(level, rng) {
  const orders = WATER_ORDERS.filter((o) => o.lv <= level);
  if (orders.length && rng.chance(0.25)) {
    const o = rng.pick(orders);
    return {
      type: 'order',
      prompt: o.prompt,
      items: rng.shuffle(o.steps).map(([id, e, n]) => ({ id, html: `<span class="pic sm">${e}</span><span class="lbl">${n}</span>`, say: n })),
      answerOrder: o.steps.map(([id]) => id),
      joiner: '→',
      hint: 'Vad händer först?',
      explain: o.ex,
    };
  }
  if (rng.chance(level === 0 ? 0.5 : 0.5)) return rowChoice(rng, levelPick(rng, WATER_FACTS, level), level, { hint: 'Är det varmt eller kallt?' });
  return sortTask(rng, {
    bins: level === 0 ? WATER_BINS.slice(0, 2) : WATER_BINS,
    items: WATER_ITEMS,
    nItems: level === 0 ? 4 : level <= 2 ? 6 : 8,
    prompt: 'Vatten kan vara fast, flytande eller gas. Sortera!',
    hint: 'Fast är hårt, som is. Flytande rinner. Gas syns inte och flyger iväg i luften.',
    explain: 'Is och snö är fast vatten. Det vi dricker är flytande. Vattenånga är en osynlig gas.',
  });
}

/* ---------- Lösningar och blandningar ---------- */
export const DISSOLVE_BINS = [
  { id: 'loser', label: 'Löser sig', html: '💧' },
  { id: 'inte', label: 'Löser sig inte', html: '🪨' },
];
export const DISSOLVE_ITEMS = [
  { id: 'socker', e: np('🍬'), n: 'socker', bin: 'loser' },
  { id: 'salt', e: '🧂', n: 'salt', bin: 'loser' },
  { id: 'saft', e: '🧃', n: 'saft', bin: 'loser' },
  { id: 'buljong', e: np('🟫'), n: 'buljongtärning', bin: 'loser' },
  { id: 'kakao', e: np('☕'), n: 'kakaopulver med socker', bin: 'loser' },
  { id: 'sand', e: np('🏖️'), n: 'sand', bin: 'inte' },
  { id: 'sten', e: '🪨', n: 'sten', bin: 'inte' },
  { id: 'gem', e: '📎', n: 'gem', bin: 'inte' },
  { id: 'ris', e: '🍚', n: 'okokt ris', bin: 'inte' },
  { id: 'olja', e: np('🫒'), n: 'matolja', bin: 'inte' },
];
export const MIX_FACTS = [
  { lv: 1, q: 'Vad händer med socker när du rör ner det i varmt vatten?', o: ['det löser sig och syns inte', 'det blir till sten', 'det flyter upp till ytan'], ex: 'Sockret löser sig i vattnet. Du ser det inte, men smaka – det är sött!' },
  { lv: 1, q: 'Hur får du bort sanden ur vattnet?', o: ['häll vattnet genom ett filter', 'rör snabbare', 'häll i mer sand'], ex: 'Ett filter, som ett kaffefilter, släpper igenom vattnet men stoppar sandkornen. Det kallas filtrering.' },
  { lv: 2, q: 'Hur får du tillbaka saltet ur saltvatten?', o: ['låt vattnet avdunsta', 'häll det genom ett filter', 'skaka flaskan'], ex: 'Saltet är löst och går igenom filtret. Men om vattnet avdunstar blir saltet kvar i skålen.' },
  { lv: 2, q: 'Järnspik och sand är blandade. Hur delar du dem?', o: ['med en magnet', 'med socker', 'genom att blåsa på dem'], ex: 'Magneten drar till sig järnet men inte sanden.' },
  { lv: 2, q: 'Matolja och vatten i ett glas – vad händer?', o: ['oljan lägger sig ovanpå vattnet', 'de blandas till ett', 'oljan sjunker till botten'], ex: 'Olja löser sig inte i vatten. Den är lättare och lägger sig överst.' },
  { lv: 3, q: 'Socker löser sig snabbast i …', o: ['varmt vatten', 'iskallt vatten', 'torr sand'], ex: 'I varmt vatten rör sig vattnet snabbare, och sockret löser sig fortare.' },
  { lv: 3, q: 'Vad är en lösning i naturvetenskap?', o: ['när något löser sig så att det inte syns, som socker i vatten', 'när man svarar rätt på en fråga', 'när sand ligger på botten av ett glas'], ex: 'Ordet lösning betyder flera saker! I NO är det en blandning där ett ämne har löst sig helt, som salt i vatten.' },
  { lv: 3, q: 'Varför smakar havet salt?', o: ['det finns salt löst i vattnet', 'fiskarna saltar det', 'sanden smälter'], ex: 'Floder för med sig salt från berg och mark ut i havet. Saltet är löst och syns inte.' },
  { lv: 4, q: 'Hur kan du visa att saltet finns kvar i vattnet fast det inte syns?', o: ['låta vattnet avdunsta och se saltet bli kvar', 'titta noga med ögonen', 'frysa vattnet och se saltet sjunka'], ex: 'När vattnet avdunstar blir saltkristallerna kvar. Då ser vi att saltet fanns där hela tiden.' },
  { lv: 4, q: 'Müsli med mjölk – är det en lösning eller en blandning?', o: ['en blandning', 'en lösning', 'ingetdera'], ex: 'Bitarna syns och kan plockas isär. Därför är det en blandning, inte en lösning.' },
  { lv: 4, q: 'Du vill testa om socker löser sig snabbast i varmt eller kallt vatten. Vad ska vara lika?', o: ['lika mycket socker och vatten och lika mycket omrörning', 'olika glas och olika mycket socker', 'bara temperaturen ska vara lika'], ex: 'Bara temperaturen ska skilja. Allt annat ska vara lika för att testet ska vara rättvist.' },
];
export function genMixtures(level, rng) {
  if (level >= 1 && rng.chance(level === 1 ? 0.4 : 0.6)) return rowChoice(rng, levelPick(rng, MIX_FACTS, level), level, { hint: 'Syns ämnet i vattnet efteråt?' });
  return sortTask(rng, {
    bins: DISSOLVE_BINS,
    items: DISSOLVE_ITEMS,
    nItems: level === 0 ? 4 : level <= 2 ? 6 : 8,
    prompt: 'Vi rör ner sakerna i varmt vatten. Vilka löser sig?',
    hint: 'Försvinner det i vattnet, eller ligger det kvar på botten eller ytan?',
    explain: 'Socker och salt löser sig och blir en lösning. Sand, sten och olja löser sig inte – då blir det en blandning som kan delas upp igen.',
  });
}

/* ---------- Ljus och skugga ---------- */
export const LIGHT_BINS = [
  { id: 'lyser', label: 'Lyser själv', html: '💡' },
  { id: 'inte', label: 'Lyser inte själv', html: '🪨' },
];
export const LIGHT_ITEMS = [
  { id: 'sol', e: '☀️', n: 'solen', bin: 'lyser' },
  { id: 'lampa', e: '💡', n: 'lampan', bin: 'lyser' },
  { id: 'ljus', e: '🕯️', n: 'ett levande ljus', bin: 'lyser' },
  { id: 'ficklampa', e: '🔦', n: 'ficklampan', bin: 'lyser' },
  { id: 'eld', e: '🔥', n: 'elden', bin: 'lyser' },
  { id: 'blixt', e: '⚡', n: 'blixten', bin: 'lyser' },
  { id: 'mane', e: '🌕', n: 'månen', bin: 'inte' },
  { id: 'spegel', e: '🪞', n: 'spegeln', bin: 'inte' },
  { id: 'boll', e: '⚽', n: 'bollen', bin: 'inte' },
  { id: 'bok', e: '📖', n: 'boken', bin: 'inte' },
  { id: 'reflex', e: np('🔶'), n: 'reflexen', bin: 'inte' },
];
export const LIGHT_FACTS = [
  { lv: 0, q: 'Vad behöver du för att se i mörkret?', o: [['🔦', 'en ficklampa'], ['🧸', 'en nalle'], ['🧦', 'en strumpa']], ex: 'Ficklampan lyser. Utan ljus kan ögonen inte se något.' },
  { lv: 0, q: 'När blir det en skugga?', o: [['🧍', 'när något står i vägen för ljuset'], ['🌑', 'när det är helt mörkt'], ['💧', 'när det regnar']], ex: 'Skuggan blir där ljuset inte kommer fram. I helt mörker finns ingen skugga att se.' },
  { lv: 1, q: 'Lyser månen själv?', o: ['nej, solen lyser på den', 'ja, den har lampor', 'ja, den brinner'], ex: 'Månen är ett stort klot av sten. Vi ser den för att solen lyser på den.' },
  { lv: 1, q: 'Vilket material släpper igenom ljus?', o: ['glas', 'trä', 'kartong', 'sten'], ex: 'Glas är genomskinligt. Trä, kartong och sten stoppar ljuset – då blir det skugga.' },
  { lv: 2, q: 'När på dagen är din skugga kortast?', o: ['mitt på dagen', 'tidigt på morgonen', 'sent på kvällen'], ex: 'Mitt på dagen står solen högst på himlen. Då blir skuggan kortast.' },
  { lv: 2, q: 'Varför ska du ha reflex när det är mörkt ute?', o: ['billjuset studsar på reflexen så att föraren ser dig', 'reflexen lyser själv', 'reflexen håller dig varm'], ex: 'En reflex lyser inte själv. Den kastar tillbaka ljuset från bilens lyktor, så att föraren ser dig mycket tidigare.' },
  { lv: 2, q: 'Hur går ljuset?', o: ['rakt fram', 'runt hörn', 'i sicksack'], ex: 'Ljus går rakt fram. Därför kan du inte se runt ett hörn – men en spegel kan studsa ljuset.' },
  { lv: 3, q: 'Nallen står framför en lampa. Lampan flyttas närmare nallen. Vad händer med skuggan på väggen?', o: ['den blir större', 'den blir mindre', 'den försvinner'], ex: 'Nära lampan stoppar nallen mer av ljuset. Då blir skuggan större.' },
  { lv: 3, q: 'Solen står i öster på morgonen. Åt vilket håll pekar din skugga?', o: ['åt väster', 'åt öster', 'rakt upp i luften'], ex: 'Skuggan hamnar alltid på motsatt sida från ljuset.' },
  { lv: 3, q: 'Vilken tröja blir varmast i solen?', o: ['den svarta', 'den vita', 'de blir lika varma'], ex: 'Mörka färger tar upp mer av solljuset och blir varmare. Vita färger kastar tillbaka mer ljus.' },
  { lv: 4, q: 'Vad händer när solljus går genom regndroppar?', o: ['ljuset delas upp i färger', 'ljuset blir svart', 'regnet börjar lysa själv'], ex: 'Vitt ljus består av alla regnbågens färger. Dropparna delar upp ljuset – en regnbåge!' },
  { lv: 4, q: 'Varför ser vi blixten innan vi hör åskan?', o: ['ljuset färdas mycket snabbare än ljudet', 'ögonen är snabbare än öronen', 'åskan kommer från ett annat moln'], ex: 'Ljuset kommer fram nästan direkt. Ljudet tar ungefär tre sekunder på sig för varje kilometer.' },
  { lv: 4, q: 'Vad gör en spegel med ljuset?', o: ['den studsar tillbaka ljuset', 'den gör eget ljus', 'den sväljer ljuset'], ex: 'Spegeln reflekterar ljuset. Därför kan du se dig själv i den.' },
  { lv: 4, q: 'Varför är skuggorna långa på vintern i Sverige, även mitt på dagen?', o: ['solen står lågt på himlen', 'solen är mindre på vintern', 'snön gör skuggorna längre'], ex: 'På vintern står solen lågt, även mitt på dagen. Låg sol ger långa skuggor.' },
];
export function genLight(level, rng) {
  if (rng.chance(level <= 1 ? 0.45 : 0.65)) return rowChoice(rng, levelPick(rng, LIGHT_FACTS, level), level, { hint: 'Varifrån kommer ljuset?' });
  return sortTask(rng, {
    bins: LIGHT_BINS,
    items: LIGHT_ITEMS,
    nItems: level === 0 ? 4 : level <= 2 ? 6 : 8,
    prompt: 'Vad är en ljuskälla? Sortera: lyser saken själv?',
    hint: 'En ljuskälla gör eget ljus. Andra saker syns för att ljus studsar på dem.',
    explain: 'Solen, lampor och eld är ljuskällor. Månen, speglar och reflexer lyser inte själva – de kastar tillbaka ljus från något annat.',
  });
}

/* ---------- Ljud ---------- */
export const SOUND_BINS = [
  { id: 'starkt', label: 'Starkt ljud', html: '📢' },
  { id: 'svagt', label: 'Svagt ljud', html: '🤫' },
];
export const SOUND_ITEMS = [
  { id: 'trumma', e: '🥁', n: 'en trumma', bin: 'starkt' },
  { id: 'aska', e: '⛈️', n: 'åskan', bin: 'starkt' },
  { id: 'siren', e: '🚑', n: 'ambulansens siren', bin: 'starkt' },
  { id: 'mc', e: '🏍️', n: 'en motorcykel', bin: 'starkt' },
  { id: 'fyrverkeri', e: '🎆', n: 'fyrverkerier', bin: 'starkt' },
  { id: 'viska', e: np('🤫'), n: 'någon som viskar', bin: 'svagt' },
  { id: 'fjader', e: '🪶', n: 'en fjäder som landar', bin: 'svagt' },
  { id: 'katt', e: '🐈', n: 'en katt som smyger', bin: 'svagt' },
  { id: 'sno', e: '❄️', n: 'snöflingor som faller', bin: 'svagt' },
  { id: 'blad', e: '🍃', n: 'ett löv som prasslar', bin: 'svagt' },
];
export const SOUND_FACTS = [
  { lv: 0, q: 'Vad använder du när du lyssnar?', o: [['👂', 'öronen'], ['👀', 'ögonen'], ['👃', 'näsan']], ex: 'Du hör med öronen. Det är hörselsinnet.' },
  { lv: 0, q: 'Vilket ljud är starkast?', o: [['🚑', 'ambulansens siren'], ['🪶', 'en fjäder som landar'], ['🐈', 'en katt som smyger']], ex: 'Sirenen är stark så att alla ska höra att ambulansen kommer.' },
  { lv: 0, q: 'Det är jättehögt ljud. Hur skyddar du öronen?', o: [['🙉', 'håller för öronen'], ['🙈', 'blundar'], ['📢', 'skriker ännu högre']], ex: 'Väldigt starka ljud kan skada öronen. Håll för öronen eller använd hörselkåpor.' },
  { lv: 1, q: 'Hur blir ljud till?', o: ['något vibrerar, alltså darrar', 'något blir varmt', 'något blir blött'], ex: 'Lägg handen på halsen och säg aaa. Känner du att det darrar? Det är stämbanden som vibrerar.' },
  { lv: 1, q: 'Vilken trumma ger mörkast ljud?', o: ['den stora trumman', 'den lilla trumman'], ex: 'Stora saker vibrerar långsammare och ger mörkare ljud. Ett mörkt ljud kallas också lågt.' },
  { lv: 2, q: 'Vad är ett eko?', o: ['ljud som studsar tillbaka', 'ett djur i skogen', 'ljud som blir starkare av sig självt'], ex: 'Ropa mot en bergvägg – ljudet studsar och kommer tillbaka till dig. Det är ett eko.' },
  { lv: 2, q: 'Kan ljud gå genom vatten?', o: ['ja, valar hör varandra långt bort', 'nej, aldrig', 'bara på vintern'], ex: 'Ljud går genom luft, vatten och fasta saker. I vatten går ljudet till och med snabbare än i luft.' },
  { lv: 2, q: 'Vilken gitarrsträng ger ljusast ton?', o: ['den tunnaste strängen', 'den tjockaste strängen'], ex: 'Tunna och spända strängar vibrerar snabbare och ger ljusare ton.' },
  { lv: 3, q: 'Varför hör man inga ljud ute i rymden?', o: ['det finns ingen luft som ljudet kan gå genom', 'det är för kallt', 'astronauterna har lock för öronen'], ex: 'Ljud behöver något att färdas genom, till exempel luft. I rymden är det nästan tomt.' },
  { lv: 3, q: 'Hur använder fladdermusen ljud?', o: ['den lyssnar på ekon för att hitta insekter', 'den sjunger för att hålla sig varm', 'den skrämmer bort solen'], ex: 'Fladdermusen piper så ljust att vi inte hör det. Ekot berättar var insekterna finns.' },
  { lv: 3, q: 'Varför är det så tyst ute när det har snöat mycket?', o: ['nysnön dämpar ljuden', 'ljuden fryser fast', 'alla fåglar har flyttat'], ex: 'Nysnö har mycket luft mellan flingorna. Den suger upp ljud, ungefär som en kudde.' },
  { lv: 4, q: 'Du ser blixten och räknar till sex innan åskan hörs. Ungefär hur långt bort är åskan?', o: ['2 kilometer', '6 kilometer', '600 meter', '20 kilometer'], ex: 'Ljudet går ungefär en kilometer på tre sekunder. Sex delat med tre är två.' },
  { lv: 4, q: 'Du blåser över en flaska. Sen häller du i mer vatten och blåser igen. Vad händer med tonen?', o: ['den blir ljusare', 'den blir mörkare', 'det blir helt tyst'], ex: 'Det är luften i flaskan som vibrerar. Mindre luft ger ljusare ton.' },
  { lv: 4, q: 'Varför ska man ha hörselkåpor när man klipper gräset med en motorgräsklippare?', o: ['starka ljud kan skada hörseln för alltid', 'så att man slipper höra fåglarna', 'för att hålla öronen varma'], ex: 'Öronen har små hårceller som kan skadas av starka ljud. De växer inte tillbaka.' },
];
export function genSound(level, rng) {
  if (rng.chance(level === 0 ? 0.5 : 0.65)) return rowChoice(rng, levelPick(rng, SOUND_FACTS, level), level, { hint: 'Ljud är något som darrar. Tänk på öronen.' });
  return sortTask(rng, {
    bins: SOUND_BINS,
    items: SOUND_ITEMS,
    nItems: level === 0 ? 4 : 6,
    prompt: 'Lyssna med fantasin! Är ljudet starkt eller svagt?',
    hint: 'Skulle du behöva hålla för öronen? Då är det starkt.',
    explain: 'Starka ljud hörs långt. Mycket starka ljud kan skada öronen, så skydda dem!',
  });
}

/* ---------- Knuffa och dra (kraft och rörelse) ---------- */
export const PUSH_BINS = [
  { id: 'knuffa', label: 'Knuffa', html: '➡️' },
  { id: 'dra', label: 'Dra', html: '⬅️' },
];
export const PUSH_ITEMS = [
  { id: 'sparka', e: '⚽', n: 'sparka en boll', bin: 'knuffa' },
  { id: 'kundvagn', e: '🛒', n: 'skjuta en kundvagn', bin: 'knuffa' },
  { id: 'knapp', e: np('🔘'), n: 'trycka på en knapp', bin: 'knuffa' },
  { id: 'gunga', e: np('🧒'), n: 'knuffa någon på gungan', bin: 'knuffa' },
  { id: 'stol', e: '🪑', n: 'skjuta in stolen under bordet', bin: 'knuffa' },
  { id: 'pulka', e: '🛷', n: 'dra en pulka', bin: 'dra' },
  { id: 'morot', e: '🥕', n: 'dra upp en morot', bin: 'dra' },
  { id: 'dragkedja', e: '🧥', n: 'dra upp dragkedjan', bin: 'dra' },
  { id: 'rep', e: np('🪢'), n: 'dra i ett rep', bin: 'dra' },
  { id: 'lada', e: np('🗄️'), n: 'öppna en låda', bin: 'dra' },
];
export const FORCE_FACTS = [
  { lv: 0, q: 'Vad händer om du släpper en boll?', o: [['⬇️', 'den faller ner'], ['⬆️', 'den flyger upp'], ['⏸️', 'den stannar i luften']], ex: 'Jorden drar allt mot sig. Det kallas tyngdkraft.' },
  { lv: 0, q: 'Var är det lättast att halka?', o: [['🧊', 'på is'], ['🟫', 'på en matta'], ['🌱', 'på gräs']], ex: 'Is är hal. Den har lite friktion, så fötterna glider lätt.' },
  { lv: 1, q: 'Varför halkar man lätt på is?', o: ['isen är slät och har lite friktion', 'isen är varm', 'isen drar i fötterna'], ex: 'Friktion är det som bromsar och ger grepp. På slät is är friktionen liten.' },
  { lv: 1, q: 'Hur får du gungan att gunga högre?', o: ['ge små knuffar i rätt ögonblick', 'dra den åt sidan', 'blåsa på den'], ex: 'En knuff precis när gungan vänder ger mer fart för varje gång.' },
  { lv: 2, q: 'Varför sandar man vägar och trottoarer på vintern?', o: ['sanden ger mer friktion så att man inte halkar', 'sanden smälter snön', 'sanden gör vägen varmare'], ex: 'Sandkornen gör isen sträv. Då får skor och däck bättre grepp.' },
  { lv: 2, q: 'Vad gör tyngdkraften?', o: ['den drar allt mot jorden', 'den trycker upp saker i luften', 'den gör saker varma'], ex: 'Tyngdkraften gör att saker faller ner och att vi står kvar på marken.' },
  { lv: 3, q: 'En boll rullar lika hårt på gräs och på asfalt. Var rullar den längst?', o: ['på asfalten', 'på gräset', 'lika långt'], ex: 'Gräset bromsar mer – där är friktionen större.' },
  { lv: 3, q: 'Vad gör bromsarna på en cykel?', o: ['de skapar friktion så att hjulet saktar in', 'de gör hjulet större', 'de stänger av tyngdkraften'], ex: 'Bromsklossarna trycker mot hjulet. Friktionen gör att cykeln saktar in.' },
  { lv: 3, q: 'Varför har vinterdäck mönster och ibland dubbar?', o: ['de ger bättre grepp på snö och is', 'de låter roligt', 'de gör bilen lättare'], ex: 'Mönster och dubbar ökar friktionen så att bilen inte sladdar lika lätt.' },
  { lv: 4, q: 'Du släpper en fjäder och en sten samtidigt. Varför landar stenen först?', o: ['luften bromsar fjädern mer', 'tyngdkraften drar inte i fjädern', 'fjädern väger ingenting'], ex: 'Luftmotståndet bromsar den lätta, luftiga fjädern. På månen finns ingen luft – där föll en fjäder och en hammare lika fort när astronauten David Scott testade 1971.' },
  { lv: 4, q: 'Du drar en kartong över golvet. Vad händer med friktionen om du lägger i fler böcker?', o: ['den blir större', 'den blir mindre', 'den blir likadan'], ex: 'En tyngre kartong trycker hårdare mot golvet. Då blir friktionen större och det blir tyngre att dra.' },
  { lv: 4, q: 'Varför vallar man längdskidor?', o: ['för att skidorna ska glida bra men ändå ge fäste', 'för att skidorna ska lukta gott', 'för att skidorna ska bli tyngre'], ex: 'Rätt valla ger lite friktion när skidan glider och mer friktion när du trycker ifrån.' },
];
export function genPushPull(level, rng) {
  if (rng.chance(level === 0 ? 0.4 : 0.6)) return rowChoice(rng, levelPick(rng, FORCE_FACTS, level), level, { hint: 'Vad drar eller bromsar?' });
  return sortTask(rng, {
    bins: PUSH_BINS,
    items: PUSH_ITEMS,
    nItems: level === 0 ? 4 : 6,
    prompt: 'En kraft kan vara en knuff eller ett drag. Sortera!',
    hint: 'Trycker du bort saken från dig, eller drar du den mot dig?',
    explain: 'När du knuffar trycker du bort något. När du drar flyttar du det mot dig. Båda är krafter som får saker att röra sig.',
  });
}

/* ---------- Forskarens steg (enkla undersökningar) ---------- */
const METHOD_STEPS = {
  fraga: ['❓', 'Fråga'],
  gissa: ['🤔', 'Gissa'],
  planera: ['📋', 'Planera'],
  testa: ['🧪', 'Testa'],
  anteckna: ['📝', 'Titta och anteckna'],
  forklara: ['💬', 'Förklara'],
};
const METHOD_QUESTIONS = ['Flyter äpplet?', 'Vilken bil rullar längst?', 'Smälter is fortare i solen?', 'Vilka saker dras till magneten?', 'Gror bönan utan vatten?', 'Löser sig salt i vatten?'];
export const METHOD_TOOLS = [
  { lv: 0, q: 'Vad använder du för att se små saker större?', o: [['🔍', 'förstoringsglas'], ['📏', 'linjal'], ['⚖️', 'våg']], ex: 'Ett förstoringsglas gör små saker större, till exempel en myra eller ett blad.' },
  { lv: 0, q: 'Vad använder du för att se om det finns järn i en sak?', o: [['🧲', 'magnet'], ['🔦', 'ficklampa'], ['📏', 'linjal']], ex: 'En magnet drar till sig saker av järn.' },
  { lv: 1, q: 'Vad använder du för att mäta hur varmt det är?', o: [['🌡️', 'termometer'], ['🔍', 'förstoringsglas'], ['📏', 'linjal']], ex: 'En termometer visar temperaturen i grader.' },
  { lv: 1, q: 'Vad använder du för att mäta hur lång en daggmask är?', o: [['📏', 'linjal'], ['🌡️', 'termometer'], ['⚖️', 'våg']], ex: 'Med en linjal mäter du längd i centimeter.' },
  { lv: 2, q: 'Vad använder du för att ta reda på vilken sak som väger mest?', o: [['⚖️', 'våg'], ['📏', 'linjal'], ['🔦', 'ficklampa']], ex: 'En våg visar hur mycket något väger.' },
  { lv: 2, q: 'Vad använder du för att titta på stjärnor långt bort?', o: [['🔭', 'teleskop'], ['🔬', 'mikroskop'], ['🧲', 'magnet']], ex: 'Ett teleskop gör saker långt bort större.' },
  { lv: 3, q: 'Vad använder du för att se pyttesmå saker, som celler i ett blad?', o: [['🔬', 'mikroskop'], ['🔭', 'teleskop'], ['🧭', 'kompass']], ex: 'Ett mikroskop förstorar mycket mer än ett förstoringsglas.' },
  { lv: 3, q: 'Varför skriver eller ritar en forskare ner vad som händer?', o: ['för att kunna minnas och jämföra', 'för att det ser fint ut', 'för att slippa testa igen'], ex: 'Anteckningar gör att vi kan jämföra resultat och berätta för andra.' },
  { lv: 4, q: 'Resultatet blev inte som du gissade. Vad gör en bra forskare?', o: ['skriver ner det och funderar på varför', 'ändrar resultatet', 'låtsas att testet aldrig hände'], ex: 'Ett oväntat resultat lär oss något nytt. Man kan också göra om testet för att se om det blir samma sak.' },
  { lv: 4, q: 'Varför kan det vara bra att göra samma test flera gånger?', o: ['för att se om resultatet blir likadant', 'för att det blir roligare att gissa fel', 'för att mätverktyget ska bli trött'], ex: 'Om resultatet blir ungefär likadant flera gånger kan vi lita mer på det.' },
];
export function methodSteps(level) {
  if (level >= 4) return ['fraga', 'gissa', 'planera', 'testa', 'anteckna', 'forklara'];
  if (level >= 3) return ['fraga', 'gissa', 'testa', 'anteckna', 'forklara'];
  if (level >= 1) return ['fraga', 'gissa', 'testa', 'forklara'];
  return ['fraga', 'gissa', 'testa'];
}
export function genMethod(level, rng) {
  if (rng.chance(level === 0 ? 0.6 : 0.4)) return rowChoice(rng, levelPick(rng, METHOD_TOOLS, level), level, { hint: 'Vad vill du ta reda på – storlek, värme, längd eller vikt?' });
  const steps = methodSteps(level);
  const question = rng.pick(METHOD_QUESTIONS);
  return {
    type: 'order',
    prompt: `Du undersöker: ”${question}” Lägg forskarens steg i rätt ordning!`,
    say: `Du undersöker: ${question} Lägg forskarens steg i rätt ordning!`,
    items: rng.shuffle(steps).map((id) => ({ id, html: `<span class="pic sm">${METHOD_STEPS[id][0]}</span><span class="lbl">${METHOD_STEPS[id][1]}</span>`, say: METHOD_STEPS[id][1] })),
    answerOrder: steps,
    joiner: '→',
    hint: 'Först undrar man något. Sen gissar man, och sen testar man.',
    explain: `Forskarens steg: ${steps.map((id) => METHOD_STEPS[id][1]).join(' → ')}. Man börjar alltid med något man undrar över.`,
  };
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
    { id: 'recycle', name: 'Källsortera', icon: '♻️', minLevel: 0, gen: genRecycle, lgr: ['no-sortera', 'no22-atervinning'] },
    { id: 'materials', name: 'Vad är det gjort av?', icon: '🪵', minLevel: 0, gen: genMaterials, lgr: ['no-material', 'no22-material'] },
    { id: 'waterforms', name: 'Is, vatten, ånga', icon: '🧊', minLevel: 0, gen: genWaterForms, lgr: ['no-vatten', 'no22-vatten'] },
    { id: 'pushpull', name: 'Knuffa & dra', icon: '🛷', minLevel: 0, gen: genPushPull, lgr: ['no-friktion', 'no22-kraft'] },
    { id: 'light', name: 'Ljusets gåtor', icon: '💡', minLevel: 0, gen: genLight, lgr: ['no-ljus', 'no22-sinnen'] },
    { id: 'sound', name: 'Ljud', icon: '🥁', minLevel: 0, gen: genSound, lgr: ['no22-sinnen'] },
    { id: 'method', name: 'Forskarens steg', icon: '📝', minLevel: 0, gen: genMethod, lgr: ['no-metod', 'no22-undersokning', 'no22-dokumentation'] },
    { id: 'mixquiz', name: 'Löser sig eller inte?', icon: '🧂', minLevel: 1, gen: genMixtures, lgr: ['no-blandning'] },
    { id: 'shadow', name: 'Ljus & skugga', icon: '🔦', minLevel: 0, view: 'shadow', lgr: ['no-ljus'] },
    { id: 'water', name: 'Vattnets former', icon: '💧', minLevel: 1, view: 'water', lgr: ['no-vatten'] },
    { id: 'seesaw', name: 'Gungbrädan', icon: '⚖️', minLevel: 1, view: 'seesaw', lgr: ['no-balans'] },
    { id: 'slide', name: 'Rutschkanan', icon: '🛝', minLevel: 2, view: 'slide', lgr: ['no-friktion'] },
    { id: 'mix', name: 'Blanda & separera', icon: '🧪', minLevel: 2, view: 'mix', lgr: ['no-blandning', 'no-metod'] },
  ],
};

export const EXPERIMENT_IDS = scienceApp.modules.filter((m) => m.view).map((m) => m.id);
