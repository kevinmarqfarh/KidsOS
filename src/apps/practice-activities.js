// Egenförfattade aktiviteter. Inspiration och läroplanskoppling:
// docs/COURSE-RESEARCH.md och docs/PRACTICE-ACTIVITIES.md.
import { numberOptions } from '../core/rng.js';

// Miniminivå, fråga, korrekt alternativ, två distraktorer, stöd, förklaring.
export const ACTIVITY_BANKS = {
  science: [
    [0, 'Du vill se om en sten flyter. Vad kan du göra med en vuxen?', 'Lägga den i en skål vatten', 'Bara titta på färgen', 'Räkna till tio', 'Prova det som frågan handlar om.', 'Du undersöker flytförmåga genom att se vad som händer i vatten.'],
    [0, 'Isen blir vatten. Vad har hänt?', 'Den har smält', 'Den har blivit sand', 'Den har försvunnit helt', 'Is är vatten i fast form.', 'När is smälter övergår vattnet från fast till flytande form.'],
    [0, 'Vad behöver du för att se en skugga?', 'Ljus och något som stoppar ljuset', 'Bara ljud', 'Bara vatten', 'Tänk på ficklampan och din hand.', 'En skugga bildas där ett föremål blockerar ljuset.'],
    [2, 'Vilken anteckning berättar vad du såg?', 'Träbiten låg kvar vid vattenytan', 'Jag trodde att den skulle sjunka', 'Träbiten var min favorit', 'Skilj observation från gissning och åsikt.', 'En observation beskriver det som hände. En gissning beskriver vad du tror ska hända.'],
    [2, 'Du jämför en bil på matta och trä. Vad ska vara samma?', 'Bilen och starthöjden', 'Underlaget', 'Resultatet', 'Byt bara det du vill jämföra.', 'Samma bil och starthöjd gör det lättare att undersöka hur underlaget påverkar.'],
    [4, 'Bilen rullar 20, 22 och 21 cm. Hur beskriver du resultatet?', 'Ungefär 21 cm, med lite variation', 'Exakt 20 cm varje gång', 'Minst 30 cm varje gång', 'Titta på alla tre mätningarna.', 'Upprepade mätningar visar både ett ungefärligt värde och variation.'],
    [4, 'Två försök gav olika resultat. Vad hjälper dig vidare?', 'Upprepa och kontrollera vad som ändrades', 'Välja det snyggaste resultatet', 'Ta bort alla anteckningar', 'Skillnader kan bero på flera saker.', 'Kontroll av metod och upprepningar hjälper dig att undersöka skillnaden.'],
  ],
  biology: [
    [0, 'Du hittar ett litet djur med åtta ben. Vilken grupp passar?', 'Spindeldjur', 'Fåglar', 'Insekter', 'Räkna benen.', 'Spindeldjur har åtta ben. Insekter har sex.'],
    [0, 'Vilken del tar vanligen upp vatten ur jorden?', 'Roten', 'Blombladet', 'Fröskalet', 'Titta längst ner på växten.', 'Växtens rötter tar upp vatten ur jorden.'],
    [0, 'Vad gör du med ett okänt djur ute?', 'Tittar försiktigt utan att skada det', 'Tar hem alla djur', 'Trampar på det', 'Djuret är i sin livsmiljö.', 'Naturspaning handlar om att observera och visa hänsyn.'],
    [2, 'Gräs äts av hare. Hare kan ätas av räv. Vilken ordning visar födan?', 'Gräs → hare → räv', 'Räv → gräs → hare', 'Hare → räv → gräs', 'Pilen går från födan till den som äter.', 'Näringskedjan visar hur födan går från växt till växtätare och vidare till rovdjur.'],
    [2, 'Varför är humlor viktiga för många blommande växter?', 'De kan flytta pollen mellan blommor', 'De gör jorden av plast', 'De gör alla frön till stenar', 'Humlor besöker blommor.', 'När humlor flyttar pollen hjälper de till med pollineringen.'],
    [4, 'Vad händer med näringsämnen när nedbrytare bryter ner döda löv?', 'De kan bli tillgängliga för växter igen', 'De försvinner ur naturen för alltid', 'De blir solljus', 'Tänk på ett kretslopp.', 'Nedbrytningen bidrar till att näringsämnen återförs till omgivningen.'],
    [4, 'Du ser färre fjärilar en dag. Vad kan du dra för slutsats?', 'Du behöver fler observationer för att se en trend', 'Alla fjärilar är borta för alltid', 'Fjärilar har blivit fåglar', 'Väder och tidpunkt kan påverka vad du ser.', 'En enda observation räcker inte för att avgöra om en art långsiktigt minskat.'],
  ],
  space: [
    [0, 'Din plats på jorden vänds bort från solen. Vad blir det?', 'Natt', 'Alltid sommar', 'En solförmörkelse varje gång', 'Tänk på boll och lampa.', 'När din plats är vänd bort från solen får den inget direkt solljus och har natt.'],
    [0, 'Vilket föremål lyser med eget ljus?', 'Solen', 'Månen', 'Jorden', 'Solen är en stjärna.', 'Solen avger ljus. Månen och jorden syns genom ljus de reflekterar.'],
    [0, 'Vad går månen runt?', 'Jorden', 'Ett moln', 'En byggnad', 'Månen är jordens naturliga satellit.', 'Månen kretsar runt jorden, samtidigt som jorden kretsar runt solen.'],
    [2, 'Varför kan månen se olika stor ut från natt till natt?', 'Vi ser olika mycket av dess belysta sida', 'Den växer och krymper varje natt', 'Den byter material', 'Solen belyser en del av månen.', 'Månens faser beror på hur stor del av den solbelysta sidan vi kan se från jorden.'],
    [2, 'Vad gör jorden på ungefär ett år?', 'Ett varv runt solen', 'Ett varv runt månen', 'Slutar snurra', 'Skilj rotation från omlopp.', 'Jordens omlopp runt solen tar ungefär ett år. Rotation kring axeln tar ungefär ett dygn.'],
    [4, 'Vad förklarar främst våra årstider?', 'Jordaxelns lutning och jordens omlopp', 'Att solen släcks på vintern', 'Att månen skuggar hela Sverige', 'Jämför hur ljuset träffar halvkloten.', 'Lutningen förändrar dagslängd och hur direkt solljuset träffar under året.'],
    [4, 'Vad kan boll-och-lampa-modellen ha svårt att visa?', 'Riktiga avstånd och storleksförhållanden', 'Vilken sida som får ljus', 'Att en boll kan rotera', 'Modellen förenklar verkligheten.', 'En modell hjälper oss att tänka men visar inte automatiskt alla riktiga proportioner.'],
  ],
  world: [
    [0, 'Vad hjälper dig förstå en symbol på en karta?', 'Teckenförklaringen', 'Papperets pris', 'Bokens vikt', 'Symbolerna behöver förklaras.', 'Teckenförklaringen berättar vad kartans symboler betyder.'],
    [0, 'Vad visar en karta över ditt rum?', 'Var sakerna finns sett uppifrån', 'Hur gott maten smakar', 'Vad alla drömmer', 'Tänk att du tittar ner på rummet.', 'En karta kan visa lägen med förenklade symboler.'],
    [0, 'Någon i gruppen vill säga sin idé. Vad kan du göra?', 'Lyssna och låta personen prata', 'Alltid avbryta', 'Bestämma att bara du får tala', 'Alla ska kunna komma till tals.', 'Att lyssna hjälper en grupp att fatta gemensamma beslut.'],
    [2, 'Norr är uppåt på kartan. Vilket håll är åt höger?', 'Öster', 'Väster', 'Söder', 'Tänk på de fyra väderstrecken.', 'När norr är uppåt är öster åt höger och väster åt vänster.'],
    [2, 'Vilket kommer först på en tidslinje?', 'Stenålder', 'Nutid', 'Järnålder', 'Tänk på äldre och senare tidsperioder.', 'Stenåldern kommer före bronsåldern och järnåldern.'],
    [4, 'Kartans skala säger att 1 cm motsvarar 2 km. Vad motsvarar 3 cm?', '6 km', '3 km', '2 km', 'Varje centimeter står för två kilometer.', 'Tre gånger två kilometer är sex kilometer.'],
    [4, 'Två kartor visar olika landsgränser. Vad bör du kontrollera först?', 'När kartorna gjordes och vad de visar', 'Vilken som har starkast färg', 'Vilken som är störst på skärmen', 'Kartor har syfte och datum.', 'Tidpunkt och syfte hjälper dig att förstå skillnader mellan kartor.'],
  ],
  ai: [
    [0, 'En bildapp känner igen en hund som en katt. Vad kan du säga?', 'Programmet kan ha gjort ett fel', 'Hunden måste vara en katt', 'Datorn är arg', 'Datorprogram kan missa.', 'Att granska ett svar är viktigt även när det kommer från ett program.'],
    [0, 'Vilka exempel hjälper en bildapp att se olika katter?', 'Katter i olika färger och storlekar', 'Bara samma bild tio gånger', 'Bara tomma bilder', 'Katter kan se olika ut.', 'Varierade exempel visar fler möjliga utseenden.'],
    [0, 'Vad ska du hålla privat?', 'Ditt lösenord', 'Att katter har tassar', 'Att två plus två är fyra', 'Lösenord skyddar ditt konto.', 'Lösenord ska inte lämnas till en AI-tjänst eller en okänd person.'],
    [2, 'Du vill öva att räkna själv. Vilken sorts hjälp passar?', 'En ledtråd och en chans att prova', 'Att alltid få hela svaret direkt', 'Att slippa tänka på uppgiften', 'Hjälpen ska lämna utrymme för ditt arbete.', 'En ledtråd kan hjälpa dig vidare medan du själv övar.'],
    [2, 'En AI anger ett citat ur en bok. Hur kan du kontrollera det?', 'Leta efter citatet i boken', 'Räkna orden i svaret', 'Titta på datorns färg', 'Kontrollera originalkällan.', 'Ett citat behöver finnas i den källa som anges. AI kan skapa felaktiga citat.'],
    [4, 'Ett AI-test gav 8 rätt av 10. Vad kan du säga säkert?', 'Den klarade åtta av de tio testfallen', 'Den klarar alla framtida frågor', 'Alla användare får samma resultat', 'Håll slutsatsen inom det som testats.', 'Testresultatet beskriver de valda testfallen. Nya situationer behöver undersökas.'],
    [4, 'En AI-lösning fungerar sämre för barns röster. Vad behövs?', 'Tester med relevanta röster och granskning av data', 'Att barnen får skulden', 'Att problemet göms', 'Tekniken behöver granskas för sina användare.', 'Bra genomsnittliga resultat räcker inte om en användargrupp får sämre stöd.'],
  ],
  wonder: [
    [0, 'Vilken fråga kan du undersöka genom att räkna?', 'Hur många fönster finns i rummet?', 'Vilken dröm får jag nästa år?', 'Vad tänker alla människor?', 'Välj något du kan observera.', 'Du kan titta på fönstren och räkna dem för att undersöka frågan.'],
    [0, 'Din gissning blev fel. Vad kan du göra?', 'Berätta vad du upptäckte och prova en ny idé', 'Sluta ställa frågor för alltid', 'Låtsas att inget hände', 'Ett oväntat resultat kan lära dig något.', 'Att ändra en gissning efter en observation är en del av att undersöka.'],
    [0, 'Vad hjälper dig minnas vad du såg ute?', 'Rita en bild eller berätta för någon', 'Blunda hela promenaden', 'Gömma alla frågor', 'Du kan dokumentera på olika sätt.', 'En bild eller berättelse hjälper dig att återvända till din upptäckt.'],
    [2, 'Vilket är en observation?', 'Bladet är gult', 'Bladet tycker om mig', 'Alla blad kommer alltid vara gula', 'Beskriv det du faktiskt ser.', 'Färg kan observeras. Känslor hos blad eller påståenden om alla framtida blad stöds inte av observationen.'],
    [2, 'Hur kan du undersöka om skuggans längd ändras?', 'Mäta samma föremåls skugga vid olika tider', 'Mäta olika föremål bara en gång', 'Bara välja ett tal', 'Gör mätningarna jämförbara.', 'Samma föremål och flera tidpunkter hjälper dig att undersöka förändringen.'],
    [4, 'Vilket stöd är starkast för ett påstående om ett försök?', 'Dokumenterade observationer som går att upprepa', 'Att texten har många utropstecken', 'Att någon låter väldigt säker', 'Skilj bevis från säker ton.', 'Dokumentation och upprepning gör det möjligt att granska hur slutsatsen drogs.'],
    [4, 'En källa motsäger din idé med tydliga belägg. Vad gör du?', 'Granskar beläggen och omprövar vid behov', 'Ignorerar allt som inte passar', 'Väljer det längsta svaret', 'Ditt tänkande får utvecklas.', 'Att ompröva med bättre stöd hjälper dig att lära och förstå.'],
  ],
  play: [
    [0, 'Två figurer vill leka olika lekar. Vad kan de prova?', 'Turas om eller hitta en gemensam lek', 'Att bara en alltid bestämmer', 'Att gömma den andra figuren', 'Hur kan båda få bidra?', 'Att lyssna och turas om ger utrymme för bådas idéer.'],
    [0, 'Du har tre låtsasmynt och köper något för två. Hur många finns kvar?', '1', '3', '5', 'Ta bort två från tre.', 'Tre minus två är ett.'],
    [0, 'Hur kan en lekfigur visa att den lyssnar?', 'Vänta på sin tur och svara på idén', 'Avbryta varje mening', 'Strunta i alla andras idéer', 'Lyssnande syns i vad man gör.', 'Att svara på en annans idé kan föra leken vidare tillsammans.'],
    [2, 'Du har 20 låtsasmynt. Två saker kostar 8 och 7. Räcker pengarna?', 'Ja, 5 mynt blir kvar', 'Nej, det fattas 5', 'Ja, 15 mynt blir kvar', 'Lägg ihop priserna först.', '8 + 7 är 15. 20 − 15 är 5.'],
    [2, 'Ni bygger ett rum. Vilket hjälper er samarbeta?', 'Bestämma tillsammans och prova idéerna', 'Att bara den snabbaste får välja', 'Att ändra allt utan att fråga', 'Alla kan bidra på olika sätt.', 'Gemensam planering och test av idéer ger fler sätt att lösa uppgiften.'],
    [4, 'Fyra figurer ska få lika många av tolv äpplen. Hur många var?', '3', '4', '6', 'Dela lika mellan fyra.', '12 delat med 4 är 3. Kontrollera: 4 gånger 3 är 12.'],
    [4, 'Du planerar en låtsasbutik med 50 mynt. Inköpen kostar 18, 12 och 15. Vad blir kvar?', '5 mynt', '15 mynt', 'Ingen vet', 'Räkna kostnaden och jämför med budgeten.', '18 + 12 + 15 är 45. Av 50 mynt blir 5 kvar.'],
  ],
};

export function genActivity(topic, level, rng, ctx = {}) {
  const bank = ACTIVITY_BANKS[topic].filter(row => row[0] <= level);
  const newest = Math.max(...bank.map(row => row[0]));
  const pool = bank.filter(row => row[0] === newest);
  // Undvik omedelbar upprepning inom samma runda.
  const lastKey = `activityLast:${topic}`;
  const alternatives = pool.filter(row => row[1] !== ctx[lastKey]);
  const row = rng.pick(alternatives.length ? alternatives : pool);
  ctx[lastKey] = row[1];
  return { type: 'choice', prompt: row[1], options: rng.shuffle([row[2], row[3], row[4]]).map(label => ({ id: label, label })), answer: row[2], hint: row[5], explain: row[6] };
}

export function genShopping(level, rng) {
  const budget = [5, 10, 20, 100, 500][level];
  const a = rng.int(1, Math.floor(budget / 2));
  const b = rng.int(1, budget - a);
  const change = level >= 2 && rng.chance(0.5);
  const answer = change ? budget - a - b : a + b;
  return {
    type: level === 0 ? 'choice' : 'numpad',
    prompt: change ? `Du har ${budget} kr. Ett äpple kostar ${a} kr och ett päron ${b} kr. Hur mycket har du kvar?` : `Ett äpple kostar ${a} kr och ett päron ${b} kr. Vad kostar de tillsammans?`,
    visual: `<div class="big-expr">🍎 ${a} kr · 🍐 ${b} kr</div>`,
    answer: level === 0 ? String(answer) : answer,
    options: level === 0 ? numberOptions(rng, answer, 3, {min:0,max:budget+2,spread:2}).map(n => ({id:String(n),label:`${n} kr`})) : undefined,
    hint: change ? 'Lägg ihop priserna. Ta sedan bort kostnaden från pengarna du har.' : 'Lägg ihop de två priserna. Visa med klossar om du vill.',
    explain: `${a} + ${b} = ${a+b} kr.${change ? ` ${budget} − ${a+b} = ${answer} kr kvar.` : ''} Det här är låtsaspriser.`,
  };
}

const SPELL_WORDS = [['sol','is','ö'],['sol','bil','hus'],['katt','hund','måne'],['äpple','blomma','skola'],['stjärna','hjärta','skjorta']];
export function genSpelling(level, rng) {
  const word = rng.pick(SPELL_WORDS[level]);
  return { type: 'build', prompt: 'Lyssna och bygg ordet', say: `Skriv ordet ${word}. ${word}.`, sayWord: word, word, tiles: rng.shuffle([...word]), showWordSupport: true,
    hint: `Säg ${word} långsamt. Lyssna på ljuden och välj bokstäverna i ordning.`, explain: `Ordet skrivs ${word}. Läs det högt och jämför ljuden med bokstäverna.` };
}

export function genCodeMachine(level, rng) {
  const loops = rng.int(2, level >= 4 ? 6 : 3);
  const step = level <= 1 ? 1 : rng.int(2, level >= 4 ? 5 : 3);
  const start = level >= 3 ? rng.int(1, 10) : 0;
  const answer = start + loops * step;
  return { type: level === 0 ? 'choice' : 'numpad', prompt: `Roboten börjar på ${start}. Den hoppar ${step} steg framåt, ${loops} gånger. Var hamnar den?`,
    visual: `<div class="big-expr">🤖 ${start} → ${loops} × ${step} steg</div>`,
    answer: level === 0 ? String(answer) : answer,
    options: level === 0 ? numberOptions(rng,answer,3,{min:0,max:10,spread:2}).map(n=>({id:String(n),label:String(n)})) : undefined,
    hint: 'Börja på starttalet och lägg till hoppet en gång för varje upprepning.', explain: `${start} + ${loops} × ${step} = ${answer}. En loop upprepar samma instruktion.` };
}

export const DRAW_MISSIONS = [
  { level: 0, title: 'En känsla i en bild', text: 'Rita en figur som känner något. Hur kan ansikte, kropp eller färger visa känslan? Berätta för någon vad du valde.' },
  { level: 0, title: 'Mitt fantasidjur', text: 'Skapa ett djur med olika former. Var bor det? Rita något i miljön som hjälper djuret att leva där.' },
  { level: 2, title: 'Tre rutor berättar', text: 'Dela bilden i tre rutor. Visa ett problem, ett försök och en lösning. Be någon läsa din bildberättelse.' },
  { level: 2, title: 'Nära och långt borta', text: 'Rita samma sak nära och långt borta. Prova större och mindre former. Hur kan du visa avstånd?' },
  { level: 4, title: 'En bild med ett budskap', text: 'Gör en affisch om att ta hand om naturen. Välj en bild och några ord. Förklara vad du vill att betraktaren ska tänka eller göra.' },
  { level: 4, title: 'Byt bildutsnitt', text: 'Rita en scen och sedan en närbild av en detalj. Jämför hur de två bilderna berättar olika saker.' },
];

const TOPICS = {
  science: ['Undersök & förklara','🔬',['no-metod','no-material']],
  biology: ['Naturdetektiven','🌿',['no-arter','no-kedja','no-metod']],
  space: ['Rymddetektiven','🌗',['no-himmel']],
  world: ['Kartor & ledtrådar','🗺️',['so-karta','so-tid','so-rattigheter']],
  ai: ['Granska & välj hjälp','🔎',['sv-digital','sv-avkoda']],
  wonder: ['Fråga & undersök','💡',['no-metod','fsk-utforska']],
  play: ['Samarbeta & planera','🤝',['sv-ord','ma-rakna']],
};
export function practiceModules(appId) {
  if (appId === 'write') return []; // Bokstavspar använder skrivytan i letters.js.
  if (appId === 'math') return [{id:'shopping-practice',name:'Min låtsasbutik',icon:'🛍️',minLevel:0,gen:genShopping,lgr:['ma-rakna','ma-metod']}];
  if (appId === 'svenska') return [{id:'spelling-practice',name:'Lyssna & stava',icon:'🔊',minLevel:0,gen:genSpelling,lgr:['sv-ljud','sv-skriva']}];
  if (appId === 'code') return [{id:'loop-machine',name:'Robotens talhopp',icon:'🔁',minLevel:0,gen:genCodeMachine,lgr:['ma-instr','tk-styr']}];
  if (appId === 'draw') return [{id:'drawing-missions',name:'Bildverkstaden',icon:'🎨',minLevel:0,view:'drawingMissions',lgr:['bi-skapa']}];
  const [name,icon,lgr] = TOPICS[appId];
  return [{id:'activity-practice',name,icon,minLevel:0,gen:(level,rng,ctx)=>genActivity(appId,level,rng,ctx),lgr}];
}
