import { BUILD_WORLD_LESSONS } from './build-world-app.js';
import { PROGRESSION_LESSONS } from './progression-lessons.js';
// Egna pedagogiska texter, förankrade i källorna i docs/COURSE-RESEARCH.md.
// Nivåerna är appens progression, inte officiella kunskapskrav.
const lesson = (id, title, minLevel, moduleId, lgr, text, example, task, takeaway) => ({
  id, title, minLevel, moduleId, lgr, takeaway,
  steps: [
    { title: 'Upptäck', text, example },
    { title: 'Undersök och berätta', text: task, example: 'Berätta hur du tänkte. Det går bra att rita, visa med saker eller prata med någon. Du behöver inte kunna allt ännu.' },
  ],
});
export const DISCOVERY_LESSONS = {
  math: [
    lesson('tal-saker', 'Tal finns överallt', 0, 'count', ['ma-tal'], 'Ett tal berättar hur många saker det finns. När du räknar får varje sak ett räkneord.', 'Tre knappar är fortfarande tre om du flyttar isär dem.', 'Lägg fram fem klossar med en vuxen. Flytta dem. Är antalet samma? Visa hur du vet.', 'Räkna varje sak en gång. Det sista räkneordet berättar antalet.'),
    lesson('positioner', 'Så fungerar uppställning', 2, 'column', ['ma-pos', 'ma-metod'], 'I en uppställning står ental under ental och tiotal under tiotal. Börja från höger. Tio ental kan växlas till ett tiotal.', '27 + 15: 7 + 5 är 12. Skriv 2 ental och flytta 1 tiotal som minnessiffra. Tiotalen blir 2 + 1 + 1 = 4. Svaret är 42.', 'Visa 42 med fyra tiotal och två ental. Förklara hur du kan växla ett tiotal när du räknar 42 − 15.', 'Förstå växlingen med klossar eller en bild, och kontrollera svaret med det andra räknesättet.'),
  ],
  svenska: [
    lesson('lyssna-ord', 'Lyssna på ord', 0, 'firstsound', ['sv-ljud'], 'Ord består av ljud. Du kan lyssna på det första ljudet innan du kan läsa hela ordet.', 'Sol börjar med sss. Säg ljudet långsamt och lyssna.', 'Hitta två saker som börjar med samma ljud. En vuxen kan säga orden med dig. Klappa sedan stavelserna i ditt namn.', 'Bokstäver visar ljud som hjälper oss att läsa ord.'),
    lesson('las-detektiv', 'Bli en läsdetektiv', 2, 'textclues', ['sv-avkoda'], 'Ibland säger en text något rakt ut. Ibland behöver du kombinera ledtrådar med det du redan vet.', 'Mira tog paraplyet och drog på stövlarna. Texten säger inte att det regnar, men det är en rimlig gissning.', 'Läs en kort text med någon. Vilka saker vet ni från texten? Vad gissar ni? Peka på ledtrådarna.', 'En bra tolkning har stöd i texten. Flera tolkningar kan vara möjliga.'),
  ],
  write: [
    lesson('skriv-budskap', 'Skriv för någon', 0, 'name', ['sv-handstil', 'sv-fsk'], 'Bilder och bokstäver kan berätta något för en annan person. Ditt namn är ett budskap om vem du är.', 'Rita dig själv och prova att skriva ditt namn under bilden.', 'Gör ett kort på papper till någon. En vuxen kan skriva det du berättar. Prova en bokstav själv.', 'Du kan förmedla ett budskap med både bilder och bokstäver.'),
    lesson('bearbeta-text', 'Gör texten tydligare', 2, 'words', ['sv-skriva', 'sv-regler'], 'En text blir tydligare när du läser den igen. Kontrollera stora bokstäver, mellanrum och punkt. Fundera också på vad läsaren behöver veta.', 'Hunden sprang. Var sprang den? Hunden sprang genom parken blir tydligare.', 'Skriv tre meningar på papper. Läs dem högt och ändra en mening så att en kompis lättare förstår.', 'Att ändra en text är en del av att skriva.'),
  ],
  science: [
    lesson('gissa-prova', 'Gissa, prova, upptäck', 0, 'float', ['no-metod', 'no-material'], 'En undersökning börjar med en fråga. Du gissar, provar och berättar vad du såg. Resultatet får gärna överraska dig.', 'Flyter en träbit och en metallsked? Material och form kan påverka resultatet.', 'Prova med en vuxen i en liten skål vatten. Rita vad som flöt och sjönk. Håll vatten borta från elektronik.', 'En gissning är början på en undersökning. Det du ser hjälper dig att tänka vidare.'),
    lesson('rattvist-test', 'Gör ett rättvist test', 4, 'investigate', ['no-metod'], 'När du jämför behöver du ändra en sak åt gången. Upprepa gärna försöket och skriv upp resultatet.', 'För att jämföra två ramper använder du samma bil och samma starthöjd, men olika underlag.', 'Planera ett test av hur långt en leksaksbil rullar på olika underlag. Mät tre gånger per underlag och jämför. Vad kan göra mätningen osäker?', 'Ett genomtänkt test hjälper dig att förstå vad som påverkade resultatet.'),
  ],
  biology: [
    lesson('naturspanare', 'Bli en naturspanare', 0, 'species', ['no-arter'], 'Djur och växter lever nära oss. Du kan upptäcka skillnader genom att titta på blad, ben, vingar och spår.', 'En spindel har åtta ben. En insekt har sex ben.', 'Titta efter tre levande saker utomhus med en vuxen. Rita dem och lämna djuren i deras miljö. Smaka inte på okända växter eller svampar.', 'Titta noga och beskriv vad du ser innan du gissar artens namn.'),
    lesson('ekosystem', 'Alla hänger ihop', 4, 'foodchain', ['no-kedja'], 'I ett ekosystem samspelar organismer med varandra och sin omgivning. Växter använder ljus. Djur behöver föda. Nedbrytare hjälper näringsämnen att återvända.', 'Gräs kan ätas av en hare, som kan ätas av en räv. I verkligheten ingår fler samband än i en enda kedja.', 'Rita en näringskedja med pilar från födan till den som äter. Fundera på vad som kan hända om en art minskar.', 'En förändring kan påverka flera delar av ett ekosystem.'),
  ],
  space: [
    lesson('dag-natt', 'Varför blir det natt?', 0, 'daynight', ['no-himmel'], 'Jorden snurrar. Den sida som är vänd mot solen har dag. När en plats vänds bort från solen får den natt.', 'Solen behöver inte åka runt jorden för att det ska bli dag och natt.', 'Låt en vuxen lysa med en ficklampa på en boll. Markera var du bor och snurra bollen. När får din plats ljus?', 'Jordens rotation förklarar växlingen mellan dag och natt.'),
    lesson('arstider-modell', 'Årstider med en modell', 4, 'seasons', ['no-himmel', 'no-arstid'], 'Jordaxeln lutar. När norra halvklotet lutar mot solen får vi längre dagar och mer direkt solljus. Då är det sommar här och vinter på södra halvklotet.', 'Årstiderna beror på lutningen, inte på att jorden är mycket närmare solen på sommaren.', 'Prova med boll och lampa tillsammans med en vuxen. Behåll axelns lutning åt samma håll när bollen går runt lampan. Vad kan modellen visa, och vad visar den inte?', 'Modeller hjälper oss att förstå, men de visar inte alla detaljer.'),
  ],
  world: [
    lesson('min-karta', 'Gör din egen karta', 0, 'places', ['so-karta', 'so-platser'], 'En karta visar platser uppifrån. Symboler kan stå för hus, träd eller vägar.', 'En fyrkant kan visa ett hus. En liten förklaring berättar vad symbolen betyder.', 'Rita en karta över ett rum på papper. Låt någon hitta en sak med hjälp av kartan.', 'En karta förenklar verkligheten så att vi kan hitta.'),
    lesson('kartor-jamfor', 'Vad berättar kartan?', 4, 'compass', ['so-karta'], 'Olika kartor berättar olika saker. En vägkarta visar vägar. En karta över höjd visar landskap. Kartans skala hjälper oss att förstå avstånd.', 'Om 1 centimeter motsvarar 1 kilometer blir 3 centimeter 3 kilometer.', 'Jämför två kartor i en atlas med en vuxen. Vad visar de? Vad saknas? Hur hjälper teckenförklaringen dig?', 'Välj karta efter frågan du vill undersöka.'),
  ],
  ai: [
    lesson('ai-kontroll', 'Kontrollera datorns påstående', 0, 'verify', ['sv-avkoda'], 'Ett datorprogram kan ge ett svar som är fel. Du kan kontrollera med riktiga saker och fråga en vuxen.', 'Om ett program säger att två och tre är sex kan du räkna fem klossar själv.', 'Hitta på ett tokigt påstående om ett djur. Hur skulle ni undersöka om det är sant?', 'Ett svar på skärmen behöver inte vara sant.'),
    lesson('ai-eget-tankande', 'Använd ditt eget tänkande', 4, 'responsibility', ['sv-digital'], 'AI kan föreslå idéer men har inget ansvar för din uppgift. Du behöver förstå, kontrollera och förklara det du använder.', 'En ledtråd kan hjälpa dig vidare. Ett färdigt svar lär dig mindre om du inte förstår det.', 'Jämför hjälp som ger en ledtråd med hjälp som gör hela uppgiften. Vilken hjälp låter dig träna? Diskutera vad du behöver berätta för läraren.', 'Du lär dig genom att själv undersöka och förklara. Vi övar här utan en extern AI-tjänst.'),
  ],
  code: [
    lesson('kod-utan-skarm', 'Programmera en kompis', 0, 'algorithms', ['ma-instr'], 'En instruktion behöver vara tydlig. Ordningen spelar roll när någon följer den steg för steg.', 'Ta ett steg framåt. Vänd åt höger. Ta två steg framåt.', 'Gör en kort bana på golvet. Turas om att ge instruktioner och följa dem. Ändra instruktionen om den blir otydlig.', 'Testa och förbättra instruktionerna när resultatet blir annorlunda än du tänkte.'),
    lesson('kod-dela', 'Dela upp ett problem', 4, 'variables', ['tk-styr', 'ma-instr'], 'Ett stort problem blir lättare när du delar det i små delar. Du kan testa en del i taget och återanvända fungerande instruktioner.', 'Ett spel kan delas i att flytta figuren, räkna poäng och avgöra när rundan är klar.', 'Planera ett enkelt spel på papper. Beskriv vad som händer om spelaren trycker på en knapp och hur poäng kan sparas.', 'Små testbara delar gör det lättare att hitta och rätta fel.'),
  ],
  draw: [
    lesson('bild-beratta', 'Berätta med bilder', 0, 'canvas', ['bi-skapa'], 'En bild kan visa en händelse eller en känsla. Du väljer färger, former och det som ska synas.', 'Rita någon som är glad. Hur kan ansiktet och kroppen visa känslan?', 'Rita en händelse på papper eller i appen. Låt en kompis berätta vad den ser, och berätta sedan din idé.', 'Det kan finnas flera sätt att förstå samma bild.'),
    lesson('bild-serie', 'Skapa en bildberättelse', 4, 'canvas', ['bi-skapa'], 'I en serie berättar bilderna tillsammans. Bildutsnitt, färg och placering kan leda läsarens blick.', 'Tre rutor kan visa ett problem, ett försök och en lösning.', 'Gör en serie med tre rutor på papper. Prova en närbild i en ruta. Hur förändras berättelsen?', 'Dina bildval påverkar hur andra upplever berättelsen.'),
  ],
  wonder: [
    lesson('undra-fraga', 'Samla dina frågor', 0, 'cards', ['fsk-utforska'], 'Nyfikenhet börjar med att undra. Du behöver inte veta svaret för att ställa en bra fråga.', 'Varför syns min skugga ibland och ibland inte?', 'Titta runt med någon och hitta tre frågor. Välj en som ni kan undersöka genom att titta eller prova.', 'Dina frågor kan bli början på nya upptäckter.'),
    lesson('undra-belagg', 'Vad skulle övertyga dig?', 4, 'cards', ['no-metod'], 'En förklaring blir starkare när den stöds av observationer och tillförlitliga källor. Fundera på vad som skulle få dig att ändra dig.', 'För att undersöka om en växt växer mot ljuset kan du följa den under flera dagar.', 'Välj en fråga. Planera hur du kan undersöka den och vad du behöver dokumentera. Vilket resultat skulle överraska dig?', 'Att ändra uppfattning när du får bättre stöd är en del av att lära.'),
  ],
  play: [
    lesson('lek-tillsammans', 'Planera en lek tillsammans', 0, 'studio', ['bi-skapa', 'sv-ord'], 'I en gemensam lek kan alla bidra med idéer. Ni kan turas om, lyssna och ändra berättelsen tillsammans.', 'En figur behöver ett hem. En annan behöver en vän. Hur kan berättelserna mötas?', 'Bygg ett rum med klossar eller rita det med en kompis. Bestäm tillsammans vad figurerna ska göra.', 'Att lyssna och skapa tillsammans ger nya idéer.'),
    lesson('lek-budget', 'Planera dina inköp', 4, 'town', ['ma-rakna', 'ma-metod'], 'En budget hjälper dig att planera hur pengarna ska räcka. Jämför priser och räkna vad som blir kvar.', 'Du har 30 mynt och köper saker för 12 och 8. Du har 10 kvar.', 'Gör en låtsasbutik på papper. Sätt priser och planera två olika inköp med samma budget. Förklara vilket du väljer.', 'Du kan räkna, jämföra och välja innan du köper.'),
  ],
};

for(const [app,lessons] of Object.entries(PROGRESSION_LESSONS)) DISCOVERY_LESSONS[app].push(...lessons);

DISCOVERY_LESSONS['build-world']=BUILD_WORLD_LESSONS;
