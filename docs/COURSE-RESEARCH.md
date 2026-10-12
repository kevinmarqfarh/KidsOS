# Utökat kursinnehåll · 2026-10-11

## Underlag

- [Skolverket: Lgr22, aktuell utgåva från 2025](https://www.skolverket.se/download/18.2cd92ed197a1b2bbcd5e08f/1752153467251/pdf13296.pdf): ämnesområden för svenska/skrivande, matematik, NO, SO, teknik och bild. Appens läroplanskopplingar anger relaterade områden; de är inte en komplett kursplan eller bedömning.
- [Skolverket: matematik](https://syllabuswebb.skolverket.se/syllabuscw/jsp/subject.htm?subjectCode=GRGRMAT01&tos=gr): stöd för skriftliga räknemetoder, positionssystem och resonemang. Uppställning introduceras i appens nivå för åk 2, med två siffror; tre siffror används på högsta nivån. Detta är ett pedagogiskt val, inte en föreskriven årskursgräns.
- [Skolverket: förskolan](https://www.skolverket.se/undervisning/forskolan) och [Lpfö 18 reviderad 2025](https://www.skolverket.se/sokpublikationer/publikationsserier/styrdokument/2025/laroplanforforskolanlpfo18reviderad2025.4.2cd92ed197a1b2bbcd5dcbf.html): analoga lärverktyg, högläsning, lek och rörelse. De yngre barnens nya lektioner föreslår gemensamma aktiviteter med papper, klossar och naturspaning.
- [NASA: What Causes the Seasons?](https://spaceplace.nasa.gov/seasons/en/): faktastöd för jordens rotation och lutning i rymdlektionerna.

## Vad som tillkommit

24 egenförfattade lektioner i `src/apps/discovery-lessons.js`, två per app. Varje lektion innehåller ett begrepp, ett exempel, en öppen undersökning eller samtalsuppgift och en koppling till befintlig övning. Ingen extern tjänst eller webbläsarlänk behövs för barnet.

| App | Introduktion | Fördjupning |
| --- | --- | --- |
| Matte | Antal och föremål | Positionssystem och uppställning |
| Svenska | Ord och ljud | Ledtrådar och läsförståelse |
| Skriv | Bild, namn och budskap | Bearbeta och förtydliga text |
| Experiment | Gissa och undersöka | Jämförelse, upprepning och osäkerhet |
| Biologi | Observation och arter | Samband i ekosystem |
| Rymden | Dag och natt | Årstider och modellers begränsningar |
| Världen | Kartor över närmiljön | Karttyper och skala |
| AI | Kontrollera påståenden | Eget tänkande och ansvar |
| Kod | Instruktioner utan skärm | Dela upp och testa problem |
| Rita | Bild och känsla | Serie och bildutsnitt |
| Undra | Formulera frågor | Observation och belägg |
| Lek | Lyssna och skapa tillsammans | Planera en budget |

Nivå 0 är en vuxenledd introduktion, inte krav på självständig läsning. Fördjupningar låses upp på nivå 2 eller 4. Barnets faktiska skolår och behov kan skilja sig från appens åldersnivå: en vuxen kan välja nivå. AI är berikning med anknytning till kritiskt tänkande och teknik, inte ett eget obligatoriskt skolämne.

Lästa lektioner sparas i en egen samling och räknas inte som rätta quizsvar. Praktiska uppgifter bedöms inte automatiskt. Fortsatt arbete behövs för en fullständig täckning av årskurs 4–6; dessa fördjupningar är ett komplement.

## Uppställning och profiler

Matte har en ny övning med plus/minus, positionskolumner, skrivbara kladdrutor, hjälptext och genomgång av varje kolumn efter svaret. Genomgången hanterar även växling över noll. Barnet lämnar sitt hela svar med befintligt siffertangentbord.

Alla profiler får direktval PC/Tablet på profilskärmen. Valet sparas för varje profil och kan även ändras i Mina inställningar. Tidigare automatiskt läge behålls tills ett val görs.
