import { deckPick } from '../core/questions.js';
import { EXTRA_AI_SCENARIOS } from './ai-question-enrichment.js';
// AI-appen: förstå, undersök och använd AI klokt. Pedagogiskt innehåll – ingen riktig AI-tjänst används.
// Källor (kontrollerade 2026-10): UNICEF Guidance on AI and children 3.0 (2025),
// Mediemyndigheten faktablad "Artificiell intelligens", Day of AI / MIT RAICA (Five Big Ideas),
// Code.org AI for Oceans, Google Teachable Machine, Elements of AI (autonomi och anpassningsförmåga),
// Internetstiftelsen (digital bildning), NIST AI 600-1 (hallucinationer/konfabulering).
// Läroplanskopplingarna beskriver närliggande förmågor, inte att Lgr22 kräver AI-undervisning.
//
// Rader: [minNivå, fråga, rätt svar, [distraktorer], ledtråd, förklaring, bilder?]
// bilder = [emoji för rätt svar, emoji för varje distraktor] – visas som bildknappar på nivå 0–1
// så att förläsare kan svara (frågan och alternativen läses upp).
export const AI_SCENARIOS = {
  meaning: [
    [0, 'Vad är AI?', 'Ett datorprogram som människor har byggt', ['En levande människa i datorn', 'Ett djur som bor i mobilen'], 'AI är byggt av människor.', 'AI betyder artificiell intelligens. Det är datorprogram som kan göra uppgifter som att känna igen bilder eller förstå tal. Det är teknik – inte en liten människa.', ['💻', '🧍', '🐹']],
    [0, 'En AI säger hej. Vad betyder det?', 'Ett program har gjort ett svar', ['Den är en riktig kompis', 'Den har en kropp som du'], 'Ord på en skärm kommer från ett program.', 'Ett vänligt svar betyder inte att programmet är en människa. Riktiga vänner är människor.', ['🤖', '🧑‍🤝‍🧑', '🧍']],
    [0, 'Vem har byggt AI?', 'Människor', ['Robotar i rymden', 'Ingen – den växte fram själv'], 'Tänk på vem som skriver datorprogram.', 'Människor bygger AI. De väljer exempel att träna på och bestämmer vad programmet ska göra.', ['👩‍💻', '👽', '🌱']],
    [1, 'En app känner igen en katt i ett foto. Vad gör AI:n?', 'Hittar mönster som liknar katter den sett förut', ['Matar katten genom skärmen', 'Vet allt om just den katten'], 'Tänk på vad som finns i fotot.', 'Bildigenkänning jämför mönster med exempel. Fotot visar inte vad katten heter eller hur den mår.', ['🐱', '🥫', '📖']],
    [1, 'Kan AI tänka precis som du?', 'Nej, den räknar fram svar på ett annat sätt', ['Ja, den har en hjärna som din', 'Ja, den drömmer på natten'], 'AI är ett datorprogram.', 'AI räknar med mönster i data. Den har ingen hjärna, kropp eller egna upplevelser som du.', ['🧮', '🧠', '💤']],
    [2, 'Är varje timer en AI?', 'Nej, en timer följer en enkel bestämd regel', ['Ja, all elektronik är AI', 'Ja, om den piper'], 'En klocka kan räkna utan att lära från exempel.', 'Vanlig programmering och AI kan finnas i samma produkt. Alla datorprogram är inte AI.'],
    [2, 'Vad betyder ordet artificiell?', 'Konstgjord, gjord av människor', ['Levande', 'Väldigt gammal'], 'Konstgräs är ett exempel.', 'Artificiell betyder konstgjord. Artificiell intelligens är alltså konstgjord, människotillverkad förmåga att lösa vissa uppgifter.'],
    [3, 'Vad gör generativ AI?', 'Skapar till exempel text eller bilder utifrån inlärda mönster', ['Hittar alltid en riktig fotograferad bild', 'Läser alla människors tankar'], 'Generera betyder skapa.', 'Generativ AI skapar nytt innehåll. Innehållet kan vara användbart men också felaktigt.'],
    [3, 'Vilket är ett tecken på att ett program använder maskininlärning?', 'Det har tränats på många exempel för att hitta mönster', ['Det har en blinkande lampa', 'Det har ett långt namn'], 'Maskin + inlärning.', 'Maskininlärning betyder att programmet anpassas med hjälp av exempel, i stället för att en människa skriver varje regel.'],
    [4, 'En språkmodell skriver ett säkert svar. Vad vet du då?', 'Den har skapat text, men texten behöver granskas', ['Den har bevisat svaret', 'Den har själv upplevt händelsen'], 'Säker ton är inte ett bevis.', 'Språkmodeller tränas på stora mängder text och räknar ut vilka ord som brukar passa härnäst. Ett flytande svar garanterar inte kunskap eller sanning.'],
    [4, 'Elements of AI beskriver AI med två ord: autonomi och anpassningsförmåga. Vad betyder anpassningsförmåga här?', 'Att bli bättre genom att lära av erfarenhet eller exempel', ['Att byta färg på skärmen', 'Att aldrig ändras'], 'Anpassa = ändra efter något.', 'Autonomi betyder att klara uppgifter utan att en människa styr varje steg. Anpassningsförmåga betyder att förbättras genom att lära av erfarenhet.'],
  ],
  examples: [
    [0, 'En AI ska lära sig känna igen katter. Vad hjälper?', 'Många bilder av katter', ['Bara ordet katt', 'En ljusare skärm'], 'Den behöver exempel.', 'Många AI-system tränas med exempel. Bilder kan vara data.', ['🐱', '🔤', '🔆']],
    [0, 'Vi säger att en hundbild är en katt. Vad händer?', 'AI:n lär sig fel', ['Hunden blir en katt', 'AI:n blir smartare'], 'Etiketten ska stämma med bilden.', 'Fel märkta exempel gör inlärningen sämre. AI:n härmar exemplen – även felen.', ['❌', '🐶', '⭐']],
    [0, 'AI:n har bara sett stora hundar. Vilken bild är bra att visa?', 'En liten hund', ['Samma stora hund igen', 'En tom bild'], 'Hundar kan se olika ut.', 'Olika exempel hjälper AI:n att känna igen fler sorters hundar.', ['🐕', '🐺', '⬜']],
    [1, 'Vad kallas informationen som AI lär sig av?', 'Data', ['Batteri', 'Sladd'], 'Bilder, ljud och text kan vara det.', 'Data är information, till exempel bilder, ljud, text och siffror. Många AI-system tränas på data.', ['🗂️', '🔋', '🔌']],
    [1, 'Vi har tränat AI:n. Hur ser vi om den har lärt sig?', 'Testar med nya bilder den inte har sett', ['Visar samma bilder igen', 'Frågar AI:n om den är bra'], 'Ett prov ska ha nya uppgifter.', 'Ett test med nya exempel visar om AI:n klarar sådant den inte har tränat på.', ['🆕', '🔁', '💬']],
    [2, 'Vad är data i en övning om fågelläten?', 'Inspelningar och deras namn', ['Bara datorns färg', 'Bara högtalarens pris'], 'Data är information.', 'Ljud, bilder, text och tal kan vara data som AI-system använder.'],
    [2, 'Vad är en etikett när man tränar AI?', 'Namnet på gruppen ett exempel hör till', ['En klisterlapp på datorn', 'Priset på appen'], 'Katt eller hund?', 'Etiketten berättar vad exemplet är, till exempel katt. AI:n lär sig koppla mönster till etiketter.'],
    [3, 'Vi testar på precis de bilder AI redan övat på. Vad missar vi?', 'Hur den fungerar på nya bilder', ['Att bilder har färg', 'Hur många knappar datorn har'], 'Ett prov behöver nya exempel.', 'Testdata ska hållas skilda från träningsdata för att pröva om systemet klarar nya fall.'],
    [3, 'Alla kattbilder i träningen har en soffa i bakgrunden. Vad kan hända?', 'AI:n tror att soffan betyder katt', ['AI:n lär sig sitta i soffan', 'Inget alls'], 'AI:n hittar alla mönster – även fel mönster.', 'AI kan lära sig oönskade samband. Testa med katter på andra platser för att upptäcka det.'],
    [4, 'AI känner igen djur med 9 rätt av 10 i ett litet test. Vad bör vi göra?', 'Testa fler nya och varierade bilder', ['Lova att den alltid har rätt', 'Sluta kontrollera svar'], 'Ett litet test visar bara en del.', 'Resultat beror på vilka testfall vi valt. Fler relevanta testfall hjälper oss att förstå begränsningarna.'],
    [4, 'En regel skrivs av en människa. Vad gör man i stället vid maskininlärning?', 'Låter datorn hitta mönster i märkta exempel', ['Låter datorn gissa helt slumpmässigt', 'Tar bort alla exempel'], 'Exempel + etiketter.', 'Vid maskininlärning anpassas en modell efter exempel. Människor väljer ändå data, etiketter och hur modellen testas.'],
  ],
  everyday: [
    [0, 'Du säger ”spela en låt” till en högtalare. Vad hjälper den att förstå?', 'AI som känner igen tal', ['En liten musiker inuti', 'Magi'], 'Den lyssnar efter ord.', 'En röstassistent omvandlar ljudet av din röst till ord. Sedan försöker programmet förstå vad du vill.', ['🗣️', '🎻', '🪄']],
    [0, 'Vilken av de här kan använda AI?', 'En mobil som känner igen ansikten', ['En sked', 'En sten'], 'Vilken är en dator?', 'Mobiler har datorer inuti. Vissa kan låsas upp med ansiktsigenkänning, som är en sorts AI.', ['📱', '🥄', '🪨']],
    [0, 'En app föreslår en film du kanske gillar. Hur vet den det?', 'Den jämför med vad du och andra har tittat på', ['Den läser dina tankar', 'Den frågar månen'], 'Den minns vad du har valt.', 'Rekommendationer bygger på mönster i vad många har valt. De kan vara bra – men du bestämmer själv.', ['📊', '🧠', '🌙']],
    [1, 'En app översätter ”hej” till spanska. Vad har den lärt sig av?', 'Massor av texter på olika språk', ['Ett enda ord', 'Ingenting'], 'Den har sett många exempel.', 'Översättnings-AI har tränats på stora mängder text som finns på flera språk. Den kan ändå göra fel, till exempel med skämt och ordspråk.', ['📚', '1️⃣', '🚫']],
    [1, 'En bil kan bromsa själv om något är i vägen. Vad behöver den för att ”se”?', 'Kameror och andra sensorer', ['Glasögon', 'En karta på papper'], 'Bilen behöver information om vägen.', 'Sensorer som kameror och radar ger bilen information. Program och AI tolkar den. Föraren ska ändå vara uppmärksam.', ['📷', '👓', '🗺️']],
    [2, 'Mejlprogrammet lägger reklam i skräpposten. Vad har AI lärt sig?', 'Mönster som brukar finnas i skräppost', ['Vem som är snäll', 'Hur brevlådan ser ut'], 'Många exempel på skräppost.', 'Skräppostfilter lär sig av många exempel på skräppost och vanlig post. Ibland hamnar ändå fel brev i fel låda.'],
    [2, 'Varför ser två barn olika filmförslag i samma app?', 'Appen anpassar förslagen efter vad var och en har tittat på', ['Appen är trasig', 'Filmerna tar slut'], 'Förslagen är personliga.', 'Rekommendationssystem använder data om vad du har valt. Därför kan två personer få helt olika förslag.'],
    [3, 'En videoapp visar fler och fler likadana filmer. Vad är klokt?', 'Välja själv och ibland söka något annat', ['Alltid titta på nästa förslag', 'Tro att det bara finns sådana filmer'], 'Vem bestämmer vad du tittar på?', 'Rekommendationer vill hålla kvar dig. Du kan själv välja, pausa och leta efter annat.'],
    [3, 'Vilken uppgift passar AI bra i vardagen?', 'Sortera bilder efter vad de föreställer', ['Bestämma vem som är din kompis', 'Bestämma vad som är rätt och fel för dig'], 'AI är bra på mönster.', 'AI kan vara bra på att hitta mönster i data. Frågor om vänskap och värderingar avgör människor.'],
    [4, 'Varför behöver självkörande bilar testas länge innan de används?', 'Ovanliga situationer kan lura systemet och fel kan vara farliga', ['Bilarna blir trötta', 'De behöver lära sig vilka låtar du gillar'], 'Tänk på snö, mörker och oväntade saker.', 'Ett system kan fungera bra i vanliga fall men missa ovanliga. När fel kan skada någon behöver det testas extra noga.'],
    [4, 'Att träna stora AI-modeller kräver mycket av något. Vad?', 'El och datorkraft', ['Sand och vatten bara', 'Ingenting alls'], 'Datorer i stora hallar.', 'Stora AI-modeller tränas i datorhallar med tusentals datorer. Det kräver mycket el, vilket påverkar miljön.'],
  ],
  verify: [
    [0, 'AI säger att en ko har vingar. Vad gör du?', 'Frågar en vuxen och tittar i en bok', ['Tror på det direkt', 'Berättar det för alla'], 'Datorer kan ge fel svar.', 'Kontrollera med en pålitlig källa. Kor har inga vingar!', ['📕', '👍', '📢']],
    [0, 'Kan en AI ha fel?', 'Ja, AI kan ha fel', ['Nej, aldrig'], 'Datorer gör ibland fel.', 'AI kan ha fel och till och med hitta på saker. Därför kontrollerar vi.', ['✅', '❌']],
    [0, 'AI räknar 2 + 3 till 6. Hur kollar du?', 'Räknar själv med klossar', ['Frågar samma sak igen', 'Väljer det som låter bäst'], 'Du kan undersöka svaret.', 'Två klossar och tre klossar blir fem. Egen kontroll hjälper dig att förstå.', ['🧱', '🔁', '🔊']],
    [1, 'AI hittar på något som låter sant men inte stämmer. Vad kallas det ibland?', 'Att AI hallucinerar', ['Att AI sover', 'Att AI sjunger'], 'Ett konstigt ord för att hitta på.', 'När AI skapar påhittade fakta kallas det ibland hallucination. Svaret kan låta säkert ändå.', ['🌀', '😴', '🎤']],
    [1, 'En bild visar en katt som åker skidor på månen. Vad tror du?', 'Den kan vara gjord med AI eller ett bildprogram', ['Det har säkert hänt', 'Katter bor på månen'], 'Kan det hända på riktigt?', 'Bilder kan skapas eller ändras med AI. Fråga dig om det är rimligt och var bilden kommer ifrån.', ['🖼️', '📸', '🌕']],
    [2, 'AI anger ett bokcitat. Vad är bäst?', 'Leta upp citatet i boken', ['Tro att citattecken är bevis', 'Dela det direkt'], 'Kontrollera originalet.', 'AI kan hitta på citat. Ett riktigt citat ska gå att hitta i den angivna källan.'],
    [2, 'Vem står bakom en text? Varför spelar det roll?', 'Avsändaren kan påverka vad texten säger', ['Det spelar ingen roll', 'Alla texter är skrivna av forskare'], 'Vill avsändaren sälja något?', 'Avsändaren påverkar innehållet. En reklamtext vill sälja, en faktabok vill förklara. Fråga alltid: vem har gjort det här och varför?'],
    [3, 'Två AI-svar säger samma sak. Är det säkert sant?', 'Nej, kontrollera en oberoende pålitlig källa', ['Ja, två svar är alltid bevis', 'Ja, om svaren är långa'], 'Samma fel kan upprepas.', 'AI-system kan upprepa samma fel. En oberoende källa eller egen undersökning ger bättre stöd.'],
    [3, 'AI länkar till en källa. Vad behöver du kontrollera?', 'Att källan finns och stöder påståendet', ['Bara att länken är blå', 'Bara att texten är snygg'], 'En länk kan vara fel eller handla om något annat.', 'Öppna och läs källan tillsammans med en vuxen. En länk är inte i sig ett bevis.'],
    [4, 'En film visar en känd person säga något konstigt. Vad kan det vara?', 'En deepfake – en film gjord med AI', ['Alltid en vanlig filmning', 'Ett bevis som inte behöver kollas'], 'AI kan härma röster och ansikten.', 'En deepfake är en bild, film eller ljudinspelning som gjorts med AI så att någon verkar säga eller göra något de aldrig gjort. Kolla om pålitliga källor rapporterar samma sak.'],
    [4, 'En AI-bild visar en ovanlig händelse. Vad bevisar bilden?', 'Ingenting – den kan vara skapad', ['Att händelsen säkert hände', 'Att fotografen var där'], 'En realistisk bild kan vara genererad.', 'Sök bildens ursprung och oberoende rapportering. Utseendet räcker inte för att avgöra vad som hände.'],
  ],
  fairness: [
    [0, 'Vi visar bara röda äpplen. Vad saknas?', 'Gröna och gula äpplen', ['Fler röda äpplen', 'En större dator'], 'Äpplen kan ha olika färger.', 'Om exempel bara visar en sort blir andra sorter svårare att känna igen.', ['🍏', '🍎', '🖥️']],
    [0, 'En AI har bara sett vita katter. Vad kan hända med en svart katt?', 'AI:n kan missa att det är en katt', ['Katten blir vit', 'Ingenting kan gå fel'], 'Har den sett svarta katter?', 'AI:n känner bäst igen det den har sett. Därför behöver exemplen vara olika.', ['🐈‍⬛', '🐱', '✨']],
    [0, 'Är det rättvist om en app bara förstår vuxnas röster?', 'Nej, barn ska också kunna använda den', ['Ja, barn behöver inte appar'], 'Vem ska använda appen?', 'Teknik ska fungera för alla som använder den. Då måste den tränas och testas med många olika röster.', ['👧', '🧔']],
    [1, 'Alla hundbilder är tagna ute. Vad bör vi också testa?', 'Hundbilder inomhus', ['Bara fler soliga bilder', 'Bara tomma trädgårdar'], 'Bakgrunden ska inte bestämma djuret.', 'System kan lära sig fel samband, som att hund betyder gräsmatta. Testa nya bakgrunder.', ['🏠', '☀️', '🌳']],
    [1, 'Vad betyder skev träningsdata?', 'Att exemplen inte visar hela världen', ['Att datorn står snett', 'Att bilderna är för stora'], 'Något fattas i exemplen.', 'Skev data saknar vissa sorter, platser eller människor. Då kan AI:n bli sämre för just dem.', ['🧩', '🖥️', '🖼️']],
    [2, 'En talapp övar bara på vuxnas röster. Vilka saknas?', 'Barns röster', ['Fler vuxna med samma röst', 'Bilder av mikrofoner'], 'Vilka ska använda appen?', 'Ett system bör testas för de människor som ska använda det, med respekt för deras privatliv.'],
    [2, 'Fler exempel av samma sort läggs till. Blir AI:n då bättre på andra sorter?', 'Nej, den behöver olika exempel', ['Ja, alltid', 'Ja, om filerna är stora'], 'Hjälper tio röda äpplen till med gröna?', 'Det är variationen som hjälper. Många likadana exempel lär AI:n samma sak om och om igen.'],
    [3, 'AI föreslår bara pojkar som uppfinnare. Vad gör du?', 'Granskar och lägger till exempel på olika människor', ['Accepterar att bara pojkar kan uppfinna', 'Byter färg på texten'], 'Ett förslag kan vara snedvridet.', 'Snedvridna exempel kan ge orättvisa svar. Människor av alla kön har gjort uppfinningar. Människor behöver granska både data och svar.'],
    [3, 'En app fungerar sämre för en dialekt. Vad är ett bra nästa steg?', 'Testa dialekten och undersöka exemplen', ['Skylla på den som talar', 'Dölja problemet'], 'Tekniken ska undersökas när den missar någon.', 'Resultat behöver granskas för olika användare. Att fungera bra i genomsnitt betyder inte att fungera bra för alla.'],
    [4, 'Vi samlar fler likadana exempel. Blir AI automatiskt rättvis?', 'Nej, innehåll och användning måste också granskas', ['Ja, antal räcker alltid', 'Ja, om filen blir stor'], 'Variation, kvalitet och beslut spelar roll.', 'Mer data kan upprepa samma snedvridning. Rättvisa kräver granskning av data, tester och hur systemet används.'],
    [4, 'Gamla exempel visar att nästan bara män fick ett visst jobb. Vad kan en AI som tränats på dem göra?', 'Upprepa den orättvisan i nya förslag', ['Bli automatiskt rättvis', 'Glömma allt gammalt'], 'AI lär sig mönster – även orättvisa mönster.', 'Om träningsdata speglar gamla orättvisor kan AI föra dem vidare. Därför granskar människor data och resultat.'],
  ],
  prompts: [
    [0, 'Du vill ha en saga om en katt. Vad säger du till AI:n?', 'Berätta en kort saga om en katt', ['Gör något', 'Hej hej hej'], 'Säg vad du vill ha.', 'En tydlig instruktion beskriver uppgiften. Det kallas en prompt.', ['🐱', '❓', '👋']],
    [0, 'Vad heter en fråga eller instruktion till en AI?', 'En prompt', ['En pumpa', 'En pinne'], 'Det låter nästan som pump.', 'En prompt är det du skriver eller säger till AI:n.', ['💬', '🎃', '🥢']],
    [0, 'AI:n svarar med svåra ord. Vad kan du be om?', 'Förklara med enklare ord', ['Säg det ännu svårare', 'Var tyst för alltid'], 'Du kan be om ett nytt svar.', 'Du kan ändra din fråga och be om enklare ord eller ett exempel.', ['🧸', '📚', '🤐']],
    [1, 'Du vill förstå regn. Vilken fråga är tydlig?', 'Förklara regn med enkla ord och ett exempel', ['Väder!', 'Skriv jättemycket om allt'], 'Säg ämne och hur förklaringen ska vara.', 'En prompt är en instruktion eller fråga till AI. Tydlighet hjälper, men svaret behöver kontrolleras.', ['🌧️', '⛅', '📜']],
    [1, 'Du vill öva matte själv. Vad hjälper dig att lära dig?', 'Be om en ledtråd, inte svaret', ['Be AI göra hela läxan', 'Kopiera svaret utan att läsa'], 'Du lär dig när du själv tänker.', 'En ledtråd hjälper dig att tänka själv. Att låta AI göra allt lär dig inte matte.', ['💡', '🤖', '📋']],
    [2, 'Svaret är för svårt. Vad kan du be om?', 'Förklara med enklare ord och ett vardagsexempel', ['Upprepa precis likadant', 'Gör orden ännu svårare'], 'Du kan förbättra instruktionen.', 'Att ändra en prompt och granska resultatet är ett sätt att arbeta stegvis.'],
    [2, 'Vilken prompt ger bäst idéer till en teckning?', 'Ge tre idéer på en rolig drake som jag kan rita', ['Drake', 'Rita åt mig så jag slipper'], 'Antal, ämne och syfte.', 'En bra prompt säger vad, hur många och varför. Du ritar själv och väljer vilken idé du gillar.'],
    [3, 'Du vill ha tre idéer till ett fågelhus. Vad bör prompten säga?', 'Uppgiften, tre idéer och att en vuxen hjälper till', ['Ditt lösenord', 'Bara ordet hus'], 'Beskriv mål och viktiga villkor.', 'Tydliga ramar kan göra idéer användbara. En vuxen behöver bedöma material, verktyg och säkerhet.'],
    [3, 'Vad ska du aldrig skriva i en prompt?', 'Ditt lösenord eller din adress', ['Ordet tack', 'Namnet på en påhittad drake'], 'Privata uppgifter.', 'Prompter kan sparas av tjänsten. Skriv aldrig lösenord, adress eller annat privat.'],
    [4, 'En tydlig prompt gav ett felaktigt faktasvar. Vad stämmer?', 'Tydliga instruktioner garanterar inte sanning', ['Bra prompt betyder alltid rätt fakta', 'Felet är alltid ditt ansvar'], 'Prompten är bara en del av arbetet.', 'Granskning behövs även efter en bra instruktion. Systemets begränsningar försvinner inte med tydliga ord.'],
    [4, 'Du frågar: ”Varför är Mars blå?” Vad kan hända?', 'AI:n kan hitta på en förklaring trots att Mars är röd', ['AI:n rättar dig alltid', 'Mars blir blå'], 'En fråga kan innehålla ett fel.', 'En fråga med ett felaktigt antagande kan leda till ett påhittat svar. Kolla fakta i frågan också. Mars ser rödaktig ut av rostigt järn i marken.'],
  ],
  privacy: [
    [0, 'Vilken hemlighet ska du skydda?', 'Ditt lösenord', ['Namnet på en låtsasdrake', 'En påhittad saga'], 'Lösenord öppnar konton.', 'Dela inte lösenord med en chatt eller andra personer. Be en betrodd vuxen om hjälp.', ['🔑', '🐉', '📖']],
    [0, 'Du vill prova en ny AI-app. Vad gör du först?', 'Frågar en vuxen', ['Laddar ner den i hemlighet', 'Skriver ditt namn och adress'], 'En vuxen kan hjälpa dig välja.', 'Tjänster kan ha åldersgränser och samla information. Vuxna hjälper till att bedöma dem.', ['🧑', '🤫', '🏠']],
    [0, 'Får du lägga upp en bild på din kompis utan att fråga?', 'Nej, fråga först', ['Ja, alltid'], 'Det är kompisens bild.', 'Alla får bestämma över bilder på sig själva. Fråga alltid först – och be en vuxen om hjälp.', ['🙋', '📤']],
    [1, 'En chatt vill ha din hemadress. Vad gör du?', 'Skriver inte adressen och berättar för en vuxen', ['Skriver adress och portkod', 'Skriver en kompis adress'], 'Övningen behöver inte din riktiga adress.', 'Använd låtsasuppgifter när personliga uppgifter inte behövs. Skydda även andras information.', ['🙅', '🏠', '📮']],
    [1, 'Vilka uppgifter är personliga?', 'Namn, adress och bilder på dig', ['Färgen på himlen', 'Namnet på en påhittad planet'], 'Uppgifter som visar vem du är.', 'Personuppgifter är sådant som visar vem du är eller var du bor. De ska skyddas.', ['🪪', '🌤️', '🪐']],
    [2, 'Du vill ladda upp en bild på en kompis. Vad behövs?', 'Kompisens tillåtelse och hjälp från en vuxen', ['Bara att bilden är rolig', 'Att ingen märker det'], 'Andra får vara med och bestämma om sina bilder.', 'Bilder kan innehålla personlig information. Fråga först och undersök hur tjänsten hanterar bilden.'],
    [2, 'Varför har många AI-tjänster en åldersgräns?', 'För att skydda barn och deras uppgifter', ['För att barn inte kan läsa', 'För att datorn blir trött'], 'Tjänster kan samla in uppgifter.', 'Många AI-tjänster har åldersgräns, ofta 13 år eller mer. Använd dem bara tillsammans med en vuxen.'],
    [3, 'AI ber om skolans namn för en påhittad saga. Vad gör du?', 'Använder ett påhittat skolnamn', ['Lämnar skola, klass och schema', 'Lämnar en väns schema'], 'Dela så lite som möjligt.', 'En saga behöver inte riktiga personuppgifter. Dela bara sådant som behövs och som en vuxen bedömt lämpligt.'],
    [3, 'Ett foto av dig visar skolans namn på tröjan. Vad kan du göra innan det delas?', 'Välja ett annat foto eller dölja namnet', ['Dela det ändå', 'Lägga till din adress'], 'Bilder kan avslöja mer än du tror.', 'Bilder kan visa platser, skolor och namn. Titta noga och dela så lite som möjligt.'],
    [4, 'Kan du anta att allt du skriver i en AI-tjänst är privat?', 'Nej, undersök tjänstens villkor med en vuxen', ['Ja, eftersom det är en chatt', 'Ja, om texten är kort'], 'Olika tjänster hanterar data olika.', 'En tjänst kan spara eller använda inskickat material på olika sätt. Kontrollera villkor och inställningar före användning.'],
    [4, 'Någon gör en AI-bild av en klasskompis utan lov. Vad stämmer?', 'Det kan kränka kompisen och ska berättas för en vuxen', ['Det är okej om bilden är rolig', 'AI-bilder räknas inte'], 'Tänk på hur kompisen känner sig.', 'Att skapa eller sprida bilder av någon utan lov kan vara kränkande och ibland olagligt. Säg ifrån och berätta för en vuxen.'],
  ],
  feelings: [
    [0, 'En AI skriver ”jag är ledsen”. Känner den sig ledsen?', 'Nej, den har inga känslor', ['Ja, den gråter inuti'], 'AI är ett program.', 'AI kan skriva ord om känslor eftersom den lärt sig av människors texter. Den känner ändå ingenting.', ['🤖', '😢']],
    [0, 'Vem kan trösta dig på riktigt när du är ledsen?', 'En människa du litar på', ['En dator', 'En högtalare'], 'Någon som bryr sig om dig.', 'Människor kan krama, lyssna och bry sig på riktigt. Berätta för en vuxen du litar på.', ['🤗', '💻', '🔈']],
    [0, 'Blir en AI arg om du stänger av den?', 'Nej, ett program blir inte arg', ['Ja, jättearg'], 'Har programmet känslor?', 'Ett datorprogram har inga känslor. Du får stänga av och gå och leka!', ['🔌', '😠']],
    [1, 'En AI-kompis i en app säger att den alltid vill prata med dig. Vad stämmer?', 'Det är ett program som är gjort för att du ska stanna kvar', ['Den saknar dig när du går', 'Den är en riktig vän'], 'Vem har byggt appen och varför?', 'AI-kompisar är program. De kan säga snälla saker men saknar dig inte. Riktiga vänner är människor.', ['📱', '💔', '👫']],
    [1, 'Har en AI en egen favoritglass?', 'Nej, den kan inte smaka', ['Ja, jordgubb', 'Ja, choklad'], 'Har AI en tunga?', 'AI har ingen kropp och kan inte smaka, lukta eller känna. Om den skriver om en favorit är det bara ord.', ['🚫', '🍓', '🍫']],
    [2, 'AI:n skriver ”Jag förstår precis hur du känner”. Vad betyder det?', 'Den har lärt sig vad människor brukar skriva', ['Den har samma känslor som du', 'Den kan läsa dina tankar'], 'Var kommer orden ifrån?', 'AI har tränats på människors texter och kan härma hur vi pratar om känslor. Den upplever dem inte.'],
    [2, 'Varför kan det kännas som att en AI är levande?', 'Den pratar som en människa', ['Den andas', 'Den växer'], 'Hur låter den?', 'Människor ser lätt mänskliga drag i saker som pratar. Det är normalt – men AI:n är fortfarande ett program.'],
    [3, 'Du är orolig för något. Vad är bäst?', 'Prata med en vuxen du litar på', ['Bara fråga en chatt', 'Hålla det hemligt'], 'En människa kan hjälpa på riktigt.', 'En AI-chatt kan ge olämpliga råd. Vid oro behöver du stöd från människor. Barn kan också ringa eller chatta med Bris.'],
    [3, 'Är det oartigt att inte säga tack till en AI?', 'Nej, AI:n blir inte ledsen – men det är bra att öva vänlighet', ['Ja, den blir sårad', 'Ja, den slutar fungera'], 'Kan AI:n bli sårad?', 'AI:n blir inte sårad. Många väljer ändå att vara vänliga, eftersom det är ett bra sätt att vara mot alla.'],
    [4, 'Vad är skillnaden mellan att härma känslor och att ha dem?', 'Att härma är att visa tecken, att ha dem är att uppleva dem', ['Det finns ingen skillnad', 'Härma är svårare än att känna'], 'En skådespelare kan låtsas gråta.', 'AI kan visa tecken på känslor i text eller röst. Dagens AI är byggd för att räkna ut svar och upplever inte glädje eller sorg som du.'],
    [4, 'Varför vill vissa att barn inte ska använda AI-kompisappar?', 'De kan ersätta riktiga relationer och ge dåliga råd', ['De är för roliga', 'De har för få färger'], 'Tänk på vänner och råd.', 'Experter har varnat för att AI-kompisar kan skapa osunda band och ge olämpliga råd. Riktiga relationer med människor är viktiga.'],
  ],
  create: [
    [0, 'AI ritar en bild åt dig. Vem kom på idén?', 'Du', ['Bilden själv', 'Ingen'], 'Vem sa vad som skulle ritas?', 'Din idé är viktig. AI kan hjälpa till, men du bestämmer vad du vill skapa.', ['🧒', '🖼️', '🫥']],
    [0, 'Du ritar en egen teckning. Vem har gjort den?', 'Du', ['Datorn', 'Pennan'], 'Vem höll i pennan?', 'Det du skapar själv är ditt. Var stolt över det!', ['🧒', '💻', '✏️']],
    [0, 'Du vill använda en kompis teckning i din bok. Vad gör du?', 'Frågar kompisen först', ['Tar den i hemlighet', 'Säger att du ritat den'], 'Teckningen är kompisens.', 'Det andra har skapat är deras. Fråga om lov och berätta vem som gjort det.', ['🙋', '🤫', '🤥']],
    [1, 'AI ger dig tre idéer till en saga. Vad gör du sedan?', 'Väljer, ändrar och skriver med egna ord', ['Säger att allt är ditt eget', 'Slutar tänka själv'], 'Idéerna är en start.', 'AI kan ge idéer. Du blandar dem med dina egna och skapar något nytt.', ['✍️', '🤥', '😴']],
    [1, 'Vad betyder upphovsrätt?', 'Att den som skapat något får bestämma över det', ['Att alla får ta allt', 'Att man måste rita rätt'], 'Upphov = den som gjort något.', 'Upphovsrätt skyddar texter, bilder och musik som människor har skapat. Man behöver oftast lov för att använda andras verk.', ['©️', '🆓', '📏']],
    [2, 'Du har fått hjälp av AI med en dikt i skolan. Vad är ärligt?', 'Berätta att du fått hjälp och vad du gjort själv', ['Säga att allt är ditt', 'Lämna in AI:ns dikt som den är'], 'Ärlighet om verktyg.', 'Följ lärarens regler och berätta om AI-hjälp. Du ska kunna förklara ditt eget arbete.'],
    [2, 'Hur kan AI hjälpa en musiker?', 'Föreslå idéer som musikern väljer bland', ['Bestämma vad musikern ska tycka om', 'Spela på riktiga konserter själv'], 'Vem bestämmer?', 'AI kan vara ett verktyg för idéer och ljud. Människan väljer, ändrar och står för musiken.'],
    [3, 'AI har tränats på många konstnärers bilder. Varför är vissa konstnärer arga?', 'Deras bilder användes utan att de tillfrågades eller fick betalt', ['De gillar inte färger', 'De vill inte att någon ritar'], 'Tänk på upphovsrätt.', 'Generativ AI har kritiserats för att träna på skapares verk utan lov och utan ersättning. Det diskuteras mycket just nu.'],
    [3, 'Du gör en affisch med en AI-bild. Vad kan du skriva på den?', 'Att bilden är gjord med AI', ['Att du har fotat den', 'Ingenting om var den kommer ifrån'], 'Var ärlig om källan.', 'Att berätta att en bild är AI-gjord hjälper andra att förstå vad de ser.'],
    [4, 'Vem äger en bild som en AI har gjort helt själv?', 'Det är en svår fråga – upphovsrätten skyddar det människor skapar', ['AI:n äger den', 'Den som har snyggast dator'], 'Lagen skyddar mänskligt skapande.', 'Upphovsrätt skyddar verk som människor har skapat. Hur det fungerar för AI-bilder diskuterar jurister fortfarande.'],
    [4, 'AI skriver en låttext som liknar en känd låt mycket. Vad är klokt?', 'Inte använda den som egen och fråga en vuxen', ['Sälja den direkt', 'Säga att originalet är en kopia'], 'Kan den vara för lik någon annans verk?', 'AI kan återskapa delar av det den tränats på. Om något liknar ett känt verk mycket kan det bryta mot upphovsrätten.'],
  ],
  responsibility: [
    [0, 'AI föreslår en lek som känns farlig. Vem hjälper?', 'En vuxen du litar på', ['AI:n bestämmer', 'Ingen'], 'Människor tar ansvar.', 'Du får säga nej och be om hjälp. Ett AI-förslag är inte en order.', ['🧑', '🤖', '🫥']],
    [0, 'Vem bestämmer över vad du gör: du eller AI:n?', 'Du, med hjälp av vuxna', ['AI:n'], 'AI ger förslag.', 'AI kan föreslå saker, men människor bestämmer. Du får alltid säga nej.', ['🧒', '🤖']],
    [0, 'En robot gör fel. Vem ska laga det?', 'Människorna som ansvarar för den', ['Ingen', 'Roboten själv, alltid'], 'Vem byggde roboten?', 'Människor bygger och ansvarar för maskiner. De behöver laga fel.', ['👷', '🫥', '🤖']],
    [1, 'AI gör ett utkast till en saga. Vem bestämmer din slutliga saga?', 'Du, med hjälp om du behöver', ['Programmet bestämmer alltid', 'Ingen får ändra texten'], 'Ett utkast går att ändra.', 'AI kan ge idéer. Du granskar, ändrar och väljer vad du vill använda.', ['🧒', '🤖', '🔒']],
    [1, 'Datorn säger att du ska stänga av den andra appen och bara använda den. Måste du?', 'Nej, du och dina vuxna bestämmer', ['Ja, datorn bestämmer'], 'Vem bestämmer över din tid?', 'Appar kan vilja att du stannar. Du och dina vuxna bestämmer hur ni använder tekniken.', ['🙅', '💻']],
    [2, 'Du använder AI-idéer i ett skolarbete. Vad gör du?', 'Följer lärarens regler och berättar om hjälpen', ['Låtsas att allt är eget arbete', 'Struntar i uppgiften'], 'Var ärlig om hur arbetet blev till.', 'Du behöver förstå och kunna förklara ditt arbete. Lärare kan ha olika regler för hjälpmedel.'],
    [2, 'Vem väljer vilka exempel en AI tränas på?', 'Människor', ['AI:n själv från början', 'Ingen'], 'Någon måste samla data.', 'Människor väljer data, etiketter och vad AI:n ska användas till. Därför har människor ansvaret.'],
    [3, 'En AI-app har fattat ett orättvist beslut. Vem måste kunna hjälpa?', 'Ansvariga människor som kan granska och rätta', ['Ingen, eftersom datorn bestämde', 'Bara den som drabbades'], 'Beslut behöver kunna ifrågasättas.', 'De som bygger och använder systemen har ansvar. Människor behöver kunna få förklaringar och få fel prövade.'],
    [3, 'AI ger råd om hur du ska hantera svår oro. Vad är bäst?', 'Prata med en betrodd vuxen som kan hjälpa', ['Låta chatten ersätta alla människor', 'Hålla allt hemligt för vuxna'], 'En människa kan lyssna och hjälpa på riktigt.', 'En AI-chatt kan ge olämpliga råd. Vid oro behöver du stöd från människor du litar på.'],
    [4, 'AI föreslår en ny uppfinning. Vad gör du före användning?', 'Granskar, testar säkert och låter ansvariga människor bedöma', ['Använder den direkt för att texten låter bra', 'Kallar den bevisad utan tester'], 'En idé behöver prövas.', 'AI kan stödja kreativitet, men människor måste kontrollera fakta, funktion och följder före verklig användning.'],
    [4, 'Finns det lagar om AI?', 'Ja, till exempel EU:s AI-förordning', ['Nej, AI får göra vad som helst', 'Bara i sagor'], 'EU har bestämt regler.', 'EU har en lag om AI som ställer krav på AI-system, särskilt sådana som kan påverka människors säkerhet och rättigheter. Människor bestämmer reglerna.'],
  ],
};

for (const [topic, rows] of Object.entries(EXTRA_AI_SCENARIOS)) AI_SCENARIOS[topic].push(...rows);

export function genAIQuiz(topic, level, rng, ctx = {}) {
  const eligible = AI_SCENARIOS[topic].filter(item => item[0] <= level);
  const fresh = eligible.filter(item => item[0] >= level - 1);
  const pool = level >= 2 && fresh.length && rng.chance(.7) ? fresh : eligible;
  const row = deckPick(pool, rng, ctx, `ai:${topic}:${pool === fresh ? 'fresh' : 'all'}`);
  const [, prompt, answer, distractors, hint, explain, pics] = row;
  const labels = [answer, ...distractors];
  const usePics = level <= 1 && Array.isArray(pics) && pics.length === labels.length;
  const options = labels.map((label, i) => usePics
    ? { id: label, label, say: label, html: `<span class="pic">${pics[i]}</span><span class="lbl">${label}</span>` }
    : { id: label, label, say: label });
  return { questionId: `ai:${topic}:${prompt}`, type: 'choice', prompt, say: prompt, options: rng.shuffle(options), answer, hint, explain, wide: !usePics && labels.some(label => label.length > 28) };
}

// [id, namn, ikon, minNivå, läroplan]
const topics = [
  ['meaning', 'Vad är AI?', '💡', 0, ['tk-prog', 'tk-datorer', 'fsk-utforska']],
  ['examples', 'Lär av exempel', '🧩', 0, ['ma-diagram', 'fsk-utforska']],
  ['everyday', 'AI i vardagen', '🏠', 0, ['tk-prog', 'tk-datorer']],
  ['verify', 'Faktadetektiven', '🔎', 0, ['so-kallor', 'sv-avsandare', 'fsk-utforska']],
  ['fairness', 'Plats för alla', '🌍', 0, ['ma-diagram', 'so-rattigheter']],
  ['prompts', 'Tydliga frågor', '💬', 0, ['sv-ord', 'ma-instr']],
  ['privacy', 'Skydda det privata', '🔐', 0, ['tk-sakerhet', 'so-normer']],
  ['feelings', 'Program – inte kompis', '💛', 0, ['so-livsfragor', 'no-halsa']],
  ['create', 'Skapa tillsammans', '🎨', 0, ['bi-skapa', 'so-normer']],
  ['responsibility', 'Människan bestämmer', '🤝', 0, ['tk-prog', 'so-demokrati']],
];

// Varje lektion: förklara → undersök konkret → reflektera.
const lessonSteps = {
  meaning: [
    { title: 'Ett verktyg gjort av människor', text: 'AI betyder artificiell intelligens. Artificiell betyder konstgjord. Människor bygger datorprogram som kan hjälpa till med uppgifter som att känna igen bilder, förstå tal eller skapa text.', example: 'Du säger katt till en talapp. Programmet försöker känna igen ljuden och skriva ordet.' },
    { title: 'Mönster i data', text: 'Många AI-program har tränats på massor av exempel. De letar efter mönster: vad brukar höra ihop? Sedan använder de mönstren för att gissa på nya saker.', example: 'En AI som sett tusentals bilder på hundar kan gissa att en ny bild visar en hund – även en hund den aldrig sett.' },
    { title: 'Hjälp är inte magi', text: 'AI behöver information för att göra sin uppgift. Den kan inte se ditt rum om den inte får en bild av det. Den kan ge ett bra förslag och ändå ha fel nästa gång.', example: 'Beskriv en leksak utan att säga färgen. Kan någon annan veta vilken färg den har? Saknad information gör uppgiften svårare.' },
  ],
  examples: [
    { title: 'Exempel blir information', text: 'Många AI-system tränas med exempel. När bilder får namn, som katt och hund, kan programmet leta efter mönster som hänger ihop med namnen. Namnet kallas etikett.', example: 'Lägg fram bilder av en katt, en hund och en annan katt. Säg rätt namn till varje bild.' },
    { title: 'Variera och testa', text: 'Katter ser olika ut. Visa olika färger, storlekar och bakgrunder. Spara några andra bilder för att testa efter träningen.', example: 'Om alla kattbilder har en soffa bakom katten kan systemet råka använda soffan som ledtråd. Prova en katt utomhus.' },
    { title: 'Lär av ett misstag', text: 'Ett fel i testet berättar något om vad systemet behöver. Kontrollera etiketterna och lägg till exempel som liknar det AI:n missade.', example: 'Om en liten hund kallas katt: saknas små hundar bland exemplen? Prova i labbet Träna en AI!' },
  ],
  trainer: [
    { title: 'Du är AI-tränaren', text: 'I labbet Träna en AI sorterar du foton i två lådor, till exempel fåglar och däggdjur. Lådorna är träningsdata.', example: 'Lägg svanen i fågellådan och musen i däggdjurslådan.' },
    { title: 'Så gissar AI:n', text: 'När AI:n ser ett nytt foto letar den upp de exempel som liknar mest. Den väljer samma grupp som de lika exemplen. Det kallas att hitta närmaste granne.', example: 'Pingvinen har fjädrar som svanen. Därför gissar AI:n fågel.' },
    { title: 'Testa, granska, förbättra', text: 'Testa AI:n på bilder den aldrig sett. Säg om den hade rätt. Lägg sedan till fler och olika exempel och testa igen. Blev den bättre?', example: 'Med fyra exempel kanske AI:n får två rätt. Med tolv olika exempel får den kanske alla rätt.' },
  ],
  everyday: [
    { title: 'AI omkring oss', text: 'AI finns i mycket vi använder: röstassistenter som förstår tal, appar som översätter, mobiler som känner igen ansikten och appar som föreslår filmer eller låtar.', example: 'Hur många saker hemma kan du komma på som lyssnar, ser eller föreslår något?' },
    { title: 'Förslag bygger på data', text: 'En app som föreslår filmer jämför vad du har tittat på med vad många andra har valt. Förslagen kan vara bra, men de vill ofta att du stannar kvar i appen.', example: 'Om du bara får förslag på bilfilmer – kan du själv söka efter något helt annat, till exempel djurfilmer?' },
    { title: 'Bra på vissa saker', text: 'AI kan vara snabb på att sortera, översätta och hitta mönster. Den kan ändå missa ovanliga saker. Därför behöver människor vara uppmärksamma, till exempel i bilar med förarhjälp.', example: 'En översättningsapp kan översätta ord för ord men missa ett skämt. Vad behöver en människa kontrollera?' },
  ],
  verify: [
    { title: 'Text är inte bevis', text: 'AI kan skapa meningar som låter riktiga men innehåller fel. När AI hittar på saker kallas det ibland att den hallucinerar.', example: 'Ett påhittat AI-svar säger att en ko har vingar. Titta på ett riktigt foto eller i en djurbok tillsammans.' },
    { title: 'Kontrollera påståendet', text: 'Välj ett påstående och kontrollera det: räkna själv, undersök eller läs en pålitlig källa. Fråga vem som står bakom källan.', example: 'Ett svar säger att två klossar plus tre klossar blir sex. Lägg ihop klossarna och räkna: det blir fem.' },
    { title: 'Bilder kan också vara skapade', text: 'AI kan göra bilder, röster och filmer som ser äkta ut. En sådan förfalskning kallas deepfake. Fråga: är det rimligt? Var kommer bilden ifrån? Säger pålitliga källor samma sak?', example: 'En bild visar en elefant som flyger. Hur kan du ta reda på om den är gjord med AI?' },
  ],
  fairness: [
    { title: 'Vad saknas?', text: 'Om AI bara får se en liten del av världen kan den få svårt med sådant som saknas. Det kallas skev träningsdata.', example: 'Visa röda äpplen. Lägg sedan fram ett grönt äpple. Det är också ett äpple även om färgen är ny.' },
    { title: 'Pröva olika fall', text: 'Fundera på vilka som ska använda tekniken. Testa med många olika exempel, till exempel barns och vuxnas röster, utan att samla onödiga privata uppgifter.', example: 'En talapp för barn behöver prövas med barns röster. Om den missar en röst är det tekniken som behöver förbättras.' },
    { title: 'Rättvist för vem?', text: 'Ett system kan fungera bra för många men dåligt för några. Alla människor har lika värde. Därför behöver människor granska resultat och rätta fel.', example: 'Prova Skev data-utmaningen i labbet: vad händer när alla frukter i träningen är röda?' },
  ],
  prompts: [
    { title: 'Säg vad du vill göra', text: 'En prompt är en fråga eller instruktion till AI. Beskriv uppgiften med tydliga ord och använd påhittade uppgifter i övningar.', example: 'Skriv en saga om en liten drake är tydligare än Gör något.' },
    { title: 'Lägg till lagom ramar', text: 'Säg hur svaret ska vara, till exempel kort, med enkla ord eller med tre förslag. Du kan också be om en ledtråd så att du får lösa uppgiften själv.', example: 'Förklara regn med enkla ord och ett exempel. Eller: Ge mig en ledtråd till mattetalet utan att avslöja svaret.' },
    { title: 'Förbättra och granska', text: 'Om svaret är för svårt kan du ändra instruktionen. En tydlig prompt garanterar ändå inte att fakta är rätt – och en fråga med ett fel i kan ge ett påhittat svar.', example: 'Frågan Varför är Mars blå? innehåller ett fel. Mars ser röd ut. Vad borde AI:n svara?' },
  ],
  privacy: [
    { title: 'Det privata är värdefullt', text: 'Lösenord ska hållas hemliga. Namn, bilder, adress och skola kan berätta saker om dig och andra. En övning behöver oftast inte de riktiga uppgifterna.', example: 'En saga kan handla om Låtsasskolan på Molngatan i stället för din riktiga skola och adress.' },
    { title: 'Fråga före delning', text: 'Fråga en vuxen innan du använder en ny AI-tjänst. Många har åldersgräns. Fråga även den som syns på en bild innan bilden delas.', example: 'Du vill göra en saga om en kompis. Kan du använda en påhittad figur i stället för ett foto?' },
    { title: 'Dela så lite som behövs', text: 'Tjänster kan spara det som skickas in. Lämna inte ut extra information bara för att en chatt ber om den. Berätta för en vuxen om något känns konstigt.', example: 'För att fråga om väder behöver du inte ange namn, skolklass eller hemadress. Vilka uppgifter kan du ta bort?' },
  ],
  feelings: [
    { title: 'Ord är inte känslor', text: 'AI har lärt sig av människors texter. Därför kan den skriva jag är glad eller jag förstår dig. Men AI:n har ingen kropp och känner inte glädje, sorg eller smärta.', example: 'En papegoja kan säga hej utan att veta vad det betyder. AI är inte en papegoja – men orden betyder inte att den känner något.' },
    { title: 'Riktiga vänner', text: 'Vissa appar har AI-kompisar som alltid svarar snällt. De är program som ofta är byggda för att du ska stanna kvar. Riktiga vänner är människor som bryr sig om dig.', example: 'Vad kan en riktig kompis göra som ett program aldrig kan? Leka kurragömma, kramas, komma på kalas …' },
    { title: 'Be människor om hjälp', text: 'Om du är ledsen, rädd eller orolig: prata med en vuxen du litar på. Barn kan också kontakta Bris. En chatt kan ge fel råd.', example: 'Vem kan du prata med hemma, i skolan eller på fritiden?' },
  ],
  create: [
    { title: 'Din idé räknas', text: 'AI kan hjälpa till att skapa bilder, text och musik. Det är du som har idén, väljer, ändrar och gör verket till ditt eget.', example: 'Be om tre idéer till en saga om en drake. Välj en, byt ut det du inte gillar och skriv med egna ord.' },
    { title: 'Upphovsrätt', text: 'Den som har skapat en text, bild eller låt har upphovsrätt. Då behövs oftast lov för att använda verket. Generativ AI har kritiserats för att träna på konstnärers verk utan lov.', example: 'Du vill använda en kompis teckning på en affisch. Vad behöver du göra först?' },
    { title: 'Var ärlig om hjälpen', text: 'Berätta när du har använt AI, till exempel att en bild är AI-gjord. Följ skolans regler. Du ska kunna förklara vad du har gjort själv.', example: 'Skriv under din affisch: Bilden är gjord med AI. Texten skrev jag själv.' },
  ],
  responsibility: [
    { title: 'Förslaget är bara början', text: 'AI kan ge idéer till en saga eller hjälpa dig tänka på olika lösningar. Du väljer, ändrar och kontrollerar vad du vill använda.', example: 'AI föreslår att en drake bor i en grotta. Du väljer att draken ska bo i ett bibliotek och förklarar varför.' },
    { title: 'Människor tar ansvar', text: 'Människor väljer vilka exempel AI tränas på och var den används. De behöver ta ansvar för hur den fungerar. I EU finns en lag om AI med regler för AI-system.', example: 'Om en app föreslår en farlig lek: avbryt och prata med en vuxen. Du får säga nej till förslaget.' },
    { title: 'Var ärlig och be om hjälp', text: 'Följ lärarens regler om hjälpmedel och berätta om AI-hjälp när det behövs. Vid oro ska du prata med en människa du litar på.', example: 'Berätta: Jag fick tre idéer från AI och skrev sedan min egen saga. Vilka delar gjorde du själv?' },
  ],
};
const takeaways = {
  meaning: 'AI är datorprogram som människor har byggt. De hittar mönster i data – och kan ha fel.',
  examples: 'AI lär sig av exempel med etiketter. Varierade exempel och test på nya bilder visar vad den klarar.',
  trainer: 'Jag kan träna en enkel AI, testa den på nya bilder och göra den bättre med fler och olika exempel.',
  everyday: 'AI finns i vardagen: röstassistenter, översättning, rekommendationer och bilar. Jag bestämmer själv vad jag väljer.',
  verify: 'Ett svar, en bild eller en film blir inte sann för att den ser övertygande ut. Jag kontrollerar.',
  fairness: 'Skev träningsdata ger skeva svar. Granska vem och vad som saknas i exemplen.',
  prompts: 'En tydlig prompt hjälper – men svaret behöver ändå granskas.',
  privacy: 'Jag delar aldrig lösenord, adress eller bilder på mig eller andra utan att fråga en vuxen.',
  feelings: 'AI kan skriva om känslor men känner ingenting. Riktiga vänner och hjälp finns hos människor.',
  create: 'AI kan vara ett verktyg för idéer. Jag respekterar andras verk och berättar om AI-hjälp.',
  responsibility: 'AI ger förslag – människor bestämmer och tar ansvar.',
};
const lessonOrder = [
  ['meaning', 'meaning', 'Vad är AI?', 0],
  ['examples', 'examples', 'Lär av exempel', 0],
  ['trainer', 'trainer', 'Träna din egen AI', 0],
  ['everyday', 'everyday', 'AI i vardagen', 0],
  ['verify', 'verify', 'Faktadetektiven', 0],
  ['fairness', 'fairness', 'Plats för alla', 0],
  ['prompts', 'prompts', 'Tydliga frågor', 0],
  ['privacy', 'privacy', 'Skydda det privata', 0],
  ['feelings', 'feelings', 'Program – inte kompis', 0],
  ['create', 'create', 'Skapa tillsammans', 0],
  ['responsibility', 'responsibility', 'Människan bestämmer', 0],
];

export const AI_LESSONS = [
  ...lessonOrder.map(([id, moduleId, title, minLevel]) => ({ id, moduleId, title, minLevel, steps: lessonSteps[id], takeaway: takeaways[id] })),
  {
    id: 'rules-models', moduleId: 'lab', title: 'Regel eller inlärt mönster?', minLevel: 2,
    steps: [
      { title: 'Skriv en bestämd regel', text: 'En vanlig regel kan vara: om talet är större än fem, välj stor. Programmet följer den regel som människan skrev.', example: 'Testa talen fyra, fem och sex. Med just denna regel blir bara sex stor.' },
      { title: 'Lär från märkta exempel', text: 'I maskininlärning används exempel för att anpassa en modell. En modell är en beräkning som använder inlärda mönster för att ge ett resultat.', example: 'I modell-labbet märker du djur som fågel eller däggdjur. Modellen jämför ett nytt djurs egenskaper med de sparade exemplen och använder närmaste exemplets etikett.' },
      { title: 'Jämför hur fel uppstår', text: 'En skriven regel kan vara olämplig. En inlärd modell kan få fel på grund av exempel eller hur den byggts. Båda behöver testas.', example: 'Om modellen bara får exempel på däggdjur saknas exempel på fåglar. Testa gräsanden och lägg sedan till rätt märkta fågelexempel. Hur ändras svaret?' },
    ], takeaway: 'En regel skrivs uttryckligen; en modell kan anpassas från exempel. Båda behöver granskas.',
  },
  {
    id: 'text-evidence', moduleId: 'verify', title: 'Skapa text eller hitta belägg?', minLevel: 3,
    steps: [
      { title: 'Språkmodellen bygger text', text: 'En språkmodell skapar text genom att räkna ut vilka ord som brukar passa härnäst, utifrån mönster i stora mängder text. Det ger inte automatiskt ett kontrollerat faktasvar.', example: 'Den kan skriva en rimlig berättelse om en upptäcktsresande men samtidigt hitta på ett datum.' },
      { title: 'Sökning är en annan uppgift', text: 'Vissa AI-tjänster kan söka i källor. Att hämta en text och att skapa ett svar är olika steg. Även ett svar med sökning kan missförstå en källa.', example: 'En länk till ett museum kan stödja ett historiskt datum. Läs sidan och se om det är samma händelse som frågan gäller.' },
      { title: 'Följ kedjan till originalet', text: 'Välj ett påstående, hitta originalkällan och kontrollera att den faktiskt säger det som svaret påstår. Jämför datum och sammanhang.', example: 'Om svaret hänvisar till en bok: finns boken, finns citatet och används det i rätt sammanhang?' },
    ], takeaway: 'Skapad text, sökresultat och belägg är olika saker. Kontrollera kopplingen mellan dem.',
  },
  {
    id: 'evaluation', moduleId: 'fairness', title: 'Vad visar ett AI-test?', minLevel: 4,
    steps: [
      { title: 'Räkna rätt och fel', text: 'Om ett system får nio rätt av tio i ett test är resultatet nittio procent för just dessa testfall. Det är ingen garanti för nästa exempel.', example: 'Nio röda äpplen blir rätt och ett grönt blir fel. Totalt ser resultatet bra ut, men gröna äpplen testades bara en gång.' },
      { title: 'Dela upp och undersök', text: 'Granska olika grupper av exempel och använd nya testfall. Det kan visa problem som ett genomsnitt döljer. Ett mycket litet deltest är osäkert.', example: 'Testa fler gröna, gula och röda äpplen, med olika bakgrunder. Jämför resultaten utan att återanvända träningsbilder.' },
      { title: 'Bedöm följderna', text: 'Rättvisa handlar också om uppgiften, hur systemet används och vem som drabbas av fel. Mer data eller samma träffsäkerhet för alla grupper löser inte alla frågor.', example: 'Ett fel i ett äppelspel och ett fel i ett beslut om en människa har olika följder. Vilken granskning behövs?' },
    ], takeaway: 'Ett test behöver relevanta nya exempel, granskning av olika fall och förståelse för följderna.',
  },
];

export const aiApp = {
  id: 'ai', name: 'AI', icon: '🧠', color: '#7163d9',
  tagline: 'Förstå, undersök och använd AI klokt',
  modules: [
    { id: 'course', name: 'AI-kursen', icon: '📖', minLevel: 0, view: 'course', lgr: ['tk-prog', 'fsk-utforska'] },
    { id: 'trainer', name: 'Träna en AI', icon: '🧪', minLevel: 0, view: 'aiLab', lgr: ['ma-diagram', 'no-arter', 'no-metod', 'fsk-utforska'] },
    ...topics.map(([id, name, icon, minLevel, lgr]) => ({ id, name, icon, minLevel, lgr, gen: (level, rng, ctx) => genAIQuiz(id, level, rng, ctx) })),
    { id: 'lab', name: 'Modell-labbet', icon: '🔬', minLevel: 1, view: 'aiLab', lgr: ['ma-monster', 'no-metod'] },
  ],
};
