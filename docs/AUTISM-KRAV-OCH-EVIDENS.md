# KidsOS: fördjupad research, krav och verifiering för barn med autism

**Datum:** 11 oktober 2026. **Målgrupp:** barn 4–12 år, med varierande språk, läsförmåga, motorik, sensoriska behov och behov av vuxenstöd.

## Bedömning

KidsOS har en användbar grund, men underlaget räcker inte för att säga att appen uppfyller alla relevanta kriterier eller passar alla barn med autism. Individuella stödval är införda. Viktiga luckor återstår inom kommunikation, sensorisk kontroll i hela appen, förutsägbara avslut, hjälpmedel och verifiering med barn.

Det finns ingen universell checklista som certifierar en lärapp som lämplig för alla autistiska barn. Vi behöver kombinera teknisk tillgänglighet, pedagogiska rekommendationer, individuella val och faktiska användarresultat. SPSM betonar individens förutsättningar och delaktighet; W3C betonar att automatiska tester inte ersätter tester med personer som har kognitiva funktionsnedsättningar. [S1][S7]

**Beslut:** behandla detta som ett kravunderlag och en prioriterad utvecklingsplan. Använd inte ”autismanpassad för alla” eller ”bevisad behandlingseffekt” som produktpåstående.

### Slutgenomgång av projektet

Efter genomgången av de senaste ändringarna har talspärr, zoom, tangentbordsaktivering
vid sortering och externa typsnittslänkar åtgärdats. Hjälp före svar, valbar plan före
runda och lugn återkoppling har införts. Utforskande vyer har gemensamma hjälp- och
pausknappar. Tidsstyrda steg väntar under paus; vatten, planeter, kälke och
spårningsdemonstration har fått kompletterande kontroll av rörelse och livscykel.
Skärmtidsgränsen behåller den öppna aktiviteten vid förlängning och föregås av en
förvarning under de sista två minuterna.

Ändringarna har testats med ren logik och en isolerad DOM-modell. Den modellen
verifierar händelser och tillstånd, inte faktisk layout, native helskärm, kontrast,
Safari, VoiceOver eller barns upplevelse. Dessa kontroller återstår. Kravmatrisen
nedan är den ursprungliga gap-analysen; uppdaterade resultat finns i
[slutgenomgången](SLUTGENOMGANG-AUTISM.md).

## Metod och avgränsning

Detta är en riktad evidensgenomgång och kodbaserad gap-analys, inte en PRISMA-översikt, klinisk studie eller fullständig WCAG-granskning.

- Sökt i öppet tillgängliga källor från SPSM, Socialstyrelsen, NICE, ASHA, W3C, IMY, forskningspublikationer och autistisk självrepresentation.
- Sökteman: autism och undervisning; visuellt stöd; AKK utan förkunskapskrav; sensorisk miljö; förutsägbarhet; barns delaktighet; digitala interventioner och vardagsöverföring; WCAG 2.2; barns personuppgifter.
- Inkluderat myndighets- och professionsunderlag, originalstudie, forskningsöversikter och tekniska standarder. Använt självrepresentation för värderingar och delaktighet, inte som bevis för behandlingseffekt.
- VR, robotar, föräldrautbildning och vuxenstudier ger inte automatiskt belägg för KidsOS. Äldre relevanta studier används med tydligt årtal och begränsningar.
- Källorna kontrollerades på researchdatumet. Publiceringsdatum ska inte förväxlas med sökmotorns indexeringsdatum.
- Koden har lästs i denna genomgång. En isolerad logikprobering med simulerad talmotor bekräftade att `readAloud='off'` ändå kan leda till ett talanrop via `kos.say`.
- En ny skärmbaserad granskning kunde inte genomföras: in-app-webbläsarens säkerhetspolicy blockerade filadressen. Inga tidigare skärmbilder används som ny granskningsbevisning. Visuellt utseende, faktiska kontraster och hjälpmedelsbeteende är därför inte godkända här.

Inga barn eller vårdnadshavare har intervjuats i denna research. Dokumentet innehåller inga uppmätta effekter på barns stress, välbefinnande eller lärande.

### Hur underlag och status ska läsas

**N:** normativ teknisk standard, när kriteriet är tillämpligt. **V:** myndighets-/professionsvägledning. **F:** forskningsresultat med populations- och metodbegränsningar. **P:** föreslaget produktkrav, härlett från behov och källor; inte ett validerat behandlingsprotokoll.

**Kodstöd:** funktionen finns i granskad kod, men användbarheten är inte styrkt. **Delvis:** stöd finns endast i vissa lägen. **Lucka:** stöd saknas eller granskad kod strider mot avsett beteende. **Ej verifierat:** kräver andra kontroller.

**P0:** möjlig blockerare för säker eller tillgänglig användning, eller ett missvisande produktpåstående. **P1:** viktigt för målgruppens användbarhet. **P2:** fördjupning efter basen. Prioriteringarna är produktbedömningar, inte evidensgrader.

## Vad forskningen faktiskt ger stöd för

### Individuell förståelse och miljö kommer först

SPSM beskriver att stöd behöver utgå från individens styrkor, behov, förståelse av instruktioner och delaktighet. Schema, förberedda byten, intressen och återhämtning är relevanta stöd i skolan. Vår översättning till KidsOS är att barnets stödval ska vara oberoende av ålder och kunna ändras efter dagsform. Detta är en produktöversättning från skolmiljö, inte en studie av appen. [S1]

NICE CG170, uppdaterad 2021, rekommenderar individuellt meningsfullt visuellt stöd och hänsyn till sensoriska känsligheter. Kommunikation, miljö, förändrade rutiner och samtidiga hälsobesvär kan påverka hur ett barn fungerar. Det motiverar att appen ska kunna minska krav och ge hjälp, men appen ska inte diagnostisera orsaken till att barnet avbryter. Kliniska insatser i riktlinjen är inte funktioner som en lärapp kan ersätta. [S4]

Socialstyrelsens riktlinjer 2024 betonar tidiga insatser utan att invänta diagnos. För KidsOS är det rimligt att tillgänglighetsval inte kräver diagnosregistrering. Riktlinjerna riktar sig till vård och socialtjänst och är ingen appcertifiering. [S3]

### Kommunikation är mer än uppläsning

Uppläsning hjälper barnet att ta emot information. AKK kan också stödja barnets möjlighet att uttrycka sig. SPSM beskriver flera kommunikationssätt, lyhörda samtalspartner och tid att kommunicera. ASHA anger att AKK inte kräver vissa kognitiva förkunskaper och ska anpassas efter individens behov. [S5][S6]

KidsOS bör därför erbjuda vägar för ”hjälp”, ”stopp”, ”visa igen” och ”jag vet inte”, och fungera tillsammans med barnets befintliga kommunikationshjälpmedel. Ett litet kortsystem är inte ett komplett AKK-system. Val av symboler, åtkomst och användning bör göras tillsammans med barnet, familjen och vid behov logoped/specialpedagog. Kommunikation ska inte behöva tjänas in med poäng.

### Engagemang är inte samma sak som vardagsnytta

Fletcher-Watson med flera (2016) randomiserade 54 barn under sex år till en iPad-insats eller kontroll. Barnen använde appen och föräldrarna uppskattade den, men studien fann inte signifikanta gruppskillnader i de rapporterade vardagliga sociala kommunikationsutfallen. Detta visar varför uppskattning och användning inte ensamma styrker överföring. Det innebär inte att alla appar saknar nytta. [S9]

Leung med flera (2021) sammanställde tio randomiserade studier av mobila insatser; sex rapporterade signifikanta effekter och två blandade resultat. Sökningen omfattade studier till mars 2019. Olika åldrar, mål och upplägg begränsar vad som kan överföras till KidsOS och barn 4–12 år. [S10]

Project AIM (Sandbank med flera, 2023) omfattade 252 studier och 13 304 deltagare, med sökning till november 2021 och huvudsakligen små barn. Resultat förändrades när analyserna begränsades efter risk för bias. Oönskade effekter var otillräckligt övervakade och rapporterade. Produktkonsekvensen är att mäta både nytta och belastning, och att inte använda framgång i tränade uppgifter som bevis för generell utveckling. Detta är inte en KidsOS-utvärdering. [S8]

### Tillgänglighet och självbestämmande behöver egna krav

WCAG 2.2 ger tekniska kriterier. COGA kompletterar med kognitiva behov och användarutvärdering; det är vägledning, inte ytterligare obligatoriska WCAG-kriterier. [S7][S11]

ASAN:s material om självbestämmande ger ett perspektiv från autistisk självrepresentation. Vårt produktkrav är att barnet ska kunna avböja, välja stöd och avsluta utan att förlora intjänade framsteg. Att kräva ögonkontakt, undertrycka ofarlig självreglering eller belöna maskering ska inte vara appmål. Detta är en etisk produktprincip, inte en effektstudie. [S12]

## Kravmatris: 48 kriterier

### Samtidiga behov och ansvarsfördelning

Appens användbarhet behöver prövas även när barnet har exempelvis språkstörning,
adhd, intellektuell funktionsnedsättning eller behov av syn-/motoriska hjälpmedel.
Stödvalen ska kunna ändras efter dagsform. Sömnproblem, smärta och ångest kan
behöva bedömas som egna vårdbehov; ett avbrott i appen är inte ett diagnostiskt
tecken. Familjeguiden bör ge saklig information om vägar till habilitering,
skolstöd och vård, utan att appen föreslår behandling utifrån spelstatistik.
Denna avgränsning följer skillnaden mellan lärmiljö och klinisk vård. [S4]

Innehåll om känslor bör tillåta osäkerhet och flera möjliga tolkningar, skilja
mellan att välja sin egen känsla och att lösa en kunskapsfråga, och aldrig använda
ansiktsuttryck som bevis på barnets känslotillstånd. Detta är ett produktkrav som
behöver innehållsgranskning och användartestning, inte en validerad behandling.

Testbeskrivningarna är föreslagna acceptanskriterier. ”Kodstöd” betyder aldrig att behovet är uppfyllt för varje barn.

### A. Individuella behov och egen röst

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| A01 | Stöd utan diagnoskrav. V/P [S3] | Kodstöd: profilval utan diagnosfält. | P1 | Skapa och anpassa profil utan hälsouppgifter. |
| A02 | Stödval ska sparas och hållas isär per barn. P [S1] | Kodstöd: profilinställningar och normalisering. | P1 | Byt profil, starta om och återställ backup; kontrollera varje val. |
| A03 | Barnets preferenser ska kunna uttryckas med dess kommunikationssätt. V/P [S5][S12] | Delvis: egna inställningar kräver förståelse av text och reglage. | P1 | Barn med olika kommunikationssätt kan välja eller avböja med sitt stöd. |
| A04 | Stödnivå får inte reduceras till kronologisk ålder. V/P [S31] | Delvis: startnivå, layout och automatiskt tal följer ålder; vissa egna val finns. | P1 | Äldre förläsare och yngre läsare kan få rätt stöd utan att förlora relevant innehåll. |

### B. Förutsägbarhet och övergångar

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| B01 | Förklara aktivitet, omfattning och slut före start. V/P [S1][S2] | Delvis: antal visas under quiz, inte en gemensam förhandsplan. | P1 | Visa bild/textplan före aktivitet; barnet kan förstå vad som kommer. |
| B02 | Aktuellt steg och nästa steg ska vara tillgängliga utan läsning. V/P [S2] | Delvis: ”Nu/Sedan” är text; prickar kräver tolkning. | P1 | Pröva foto/symbol/text och uppläsning efter barnets förståelse. |
| B03 | Barnet styr när nästa uppgift visas. P [S29] | Kodstöd i quiz: Nästa-knapp. | P1 | Ingen automatisk fråga efter återkoppling eller paus. |
| B04 | Nivåförändring ska kunna skjutas till nästa runda och förklaras. P [S1] | Delvis: frågenivån hålls; intern nivå räknas om under rundan. | P1 | Genererade frågor och synlig nivåinformation stämmer; nästa nivå är begriplig. |
| B05 | Skärmtidsavslut ska förberedas och bevara sammanhang. V/P [S1] | Lucka: `showLimit` stänger aktivt fönster direkt. | P1 | Förvarning i begripligt format, överenskommet avslut och möjlighet att återgå. |

### C. Kommunikation, instruktioner och hjälp

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| C01 | Ett tydligt handlingssteg per instruktion. V/P [S13] | Delvis: flera frågetyper och längre förklaringar. | P1 | Innehållsgranska alla instruktioner och testa förståelse. |
| C02 | Bild/foto/symbol ska vara meningsfull för barnet. V/P [S2] | Delvis: foton och illustrationer finns; inget individuellt symbolval. | P1 | Pröva igenkänning; erbjud alternativa representationer. |
| C03 | Hjälp ska kunna begäras före ett felsvar. P [S5][S30] | Lucka i generell quiz: hint kommer efter fel. | P1 | Hjälpknapp finns från start och ger relevant exempel utan att kräva miss. |
| C04 | Visa igen och läs igen utan att ändra uppgiften. P [S30] | Delvis: läsknapp finns, gemensam demonstration saknas. | P1 | Upprepning bevarar svar, steg och stödval. |
| C05 | Barnet kan uttrycka stopp, paus, osäkerhet och behov av vuxen. V/P [S5][S6] | Delvis: quizpaus finns; övriga uttryck saknar gemensamt stöd. | P1 | Tillgängliga med barnets åtkomstsätt och utan belöningskrav. |
| C06 | Befintligt AKK ska kunna användas under aktiviteten. V/P [S5][S6] | Ej verifierat: helskärm och växling kan påverka åtkomst. | P0 | Testa samtidig/alternativ åtkomst på barnets iPad; inget tvång att lämna sin röst. |

### D. Sinnesintryck och ljud

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| D01 | Ljud Av ska ha en tydlig och konsekvent innebörd. P [S4] | Lucka: tal Av kan kringgås av `kos.say(... force:true)`. | P0 | Start, fel, återkoppling, profilbyte och troféer följer valt tal- och ljudläge. |
| D02 | Ingen oväntad automatisk uppläsning i manuellt läge. P [S4] | Kodstöd: `manual` stoppar `say` och `autoSay`; läsknappar använder `read`. | P0 | Inventera alla talvägar och fördröjningar, också utanför quiz. |
| D03 | Val för mindre rörelse gäller även canvas och JavaScript. P [S4][S19] | Delvis: CSS och planeter täcks; experiment och demonstrationer kan röra sig. | P0 | Kartlägg varje rörelse; erbjud paus/stillbild/val där lämpligt. |
| D04 | Automatiska rörelser kan stoppas enligt tillämpliga WCAG-villkor. N [S20] | Ej verifierat: kontinuerlig vattenanimation finns i koden. | P0 | Kontrollera start, varaktighet, parallellt innehåll och eventuell nödvändighet. |
| D05 | Ingen otillåten blinkning eller ljusblixt. N [S21] | Ej verifierat: `flicker` ändrar skala, inte bevis på farlig ljusblixt. | P0 | Mät faktisk luminans, frekvens, yta och trösklar; gissa inte från klassnamn. |
| D06 | Färg, dekor och återkoppling kan anpassas utan informationsförlust. P [S4][S13] | Delvis: tema/bakgrund och firandeval; ingen samlad förenklad vy. | P1 | Barn kan minska distraktion; svar och status förblir begripliga. |

### E. Återhämtning och belastning

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| E01 | Paus/hjälp/avslut tillgängligt i alla aktivitetstyper. V/P [S1] | Delvis: bevarande paus i generell quiz. | P1 | Quiz, kurs, experiment, robot, spårning och fri lek testas separat. |
| E02 | Paus stoppar tal, effekter, timer och sena callbackar. P [S30] | Delvis: quiz har spärr och talepok; ingen gemensam livscykel för alla vyer. | P0 | Pausa under tal, drag och animation; vänta; återgå utan oönskad förändring. |
| E03 | Avsluta utan skuldbeläggning eller förlust av intjänade framsteg. P [S12] | Delvis: belöningar kan behållas; ofärdig runda har inget generellt återtag. | P1 | Avslut är begripligt; återuppta där detta utlovas, annars förklara före avslut. |
| E04 | Kort aktivitet efter ork, utan krav på högre prestation. P [S1] | Kodstöd: 3/5/8 frågor eller åldersval. | P1 | Välj längd och avbryt oberoende av poäng; observera barnets upplevelse. |

### F. Lärande och innehåll

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| F01 | Separera läsning, motorik, ämneskunskap och förståelse. V/P [S31] | Delvis: ämnesnivå finns, representation kan fortfarande begränsa deltagande. | P1 | Samma kunskapsmål kan visas med olika text-/motorikkrav. |
| F02 | Fel ska ge konkret hjälp och möjlighet att korrigera. P [S13] | Kodstöd: tips och förklaringar; kvalitet behöver granskas. | P1 | Kontrollera att hint passar felet, inte bara säger ”försök igen”. |
| F03 | Begrepp och svar ska inte bero på onödig social gissning. P [S13] | Ej verifierat för hela innehållet. | P1 | Granska tvetydighet, bildtolkning, bokstavlighet och alternativa rimliga svar. |
| F04 | Intressen och frivillig lek ska stödja deltagande. V/P [S1] | Kodstöd: ämnesval och fri skaparstudio; individualisering begränsad. | P2 | Barn kan välja intresse och repetera utan att tvingas byta ämne. |

### G. Autonomi och belöningar

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| G01 | Inga mål om maskering, lydnad eller obligatorisk ögonkontakt. P [S12] | Ej verifierat genom full innehållsgranskning. | P0 | Granska allt socialt innehåll och framtida AI-funktioner mot principen. |
| G02 | Stöd och kommunikation ska aldrig låsas bakom poäng. P [S6][S12] | Kodstöd för inställningar; nya stöd måste omfattas. | P0 | Alla hjälp-/stopp-/kommunikationsval tillgängliga från första start. |
| G03 | Belöningar får inte störa pågående aktivitet eller pressa fortsatt användning. P [S29] | Delvis: firande kan stängas av; trofénotiser kan visas mitt i quiz. | P1 | Lugn återkoppling; kontrollera notiser, sviter och ”en gång till”. |

### H. Motorik och hjälpmedel

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| H01 | Tangentbordsmotsvarighet för tillämpliga funktioner. N [S14] | Lucka: sorteringsobjekt har pointerhantering utan motsvarande aktivering. | P0 | Tab, Enter och mellanslag fungerar hela vägen; fria ritbanor bedöms separat. |
| H02 | Drag har alternativ utan drag där kriteriet gäller. N [S15] | Delvis: korgar har klick; objekten väljs via pointerup. | P0 | Välj och placera via enkel pekning samt tangentbord där tillämpligt. |
| H03 | Rätt namn, roll och tillstånd för kontroller. N [S16] | Delvis: stödreglage märkta; vissa objekt saknar tydliga tillgängliga namn. | P0 | Kontrollera tillgänglighetsträd och faktisk uppläsning i VoiceOver. |
| H04 | Synligt fokus och korrekt återgång efter dialog. N/P [S22] | Delvis: quiz återför fokus; globala dialoger och fönster ej verifierade. | P0 | Fokus får inte döljas helt; ingen fälla; ordning är begriplig. |
| H05 | Tillräckliga tryckytor och stöd för alternativ åtkomst. N/P [S17] | Delvis: stora knappar; tidigare tester har touchfokus. | P1 | Mät CSS-storlek/avstånd; testa Switch Control och relevant motoriskt hjälpmedel. |

### I. Syn, text och layout

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| I01 | Text kan förstoras utan informations-/funktionsförlust. N [S18] | Lucka: byggd sida och gester begränsar zoom. | P0 | Tillåt förstoringsväg; kontrollera 200 procent text i faktisk Safari. |
| I02 | Omflöde vid smal effektiv bredd. N [S23] | Ej verifierat: vanlig mobilbredd räcker inte som 400-procentskontroll. | P0 | Testa 320 CSS-pixlars effektiv bredd; bedöm tillåtna tvådimensionella undantag. |
| I03 | Text och kontroller har tillräcklig kontrast. N [S24][S25] | Ej verifierat i alla teman/tillstånd. | P0 | Mät vanlig/stor text, kanter, fokus och status mot rätt tröskel. |
| I04 | Färg är inte enda informationsbärare. N [S26] | Delvis: textåterkoppling finns; prickar och tillstånd behöver granskas. | P0 | Status fungerar utan färgseende; tillför text/form/programmatisk status. |

### J. Vardag och samspel

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| J01 | Vardagsnytta ska kunna följas upp utanför appen. F/P [S8][S9] | Lucka: appframsteg visar främst användning och svar. | P1 | Testa samma mål med annat material och i vardag, utan träningsskärmen. |
| J02 | Frivilligt vuxen-/kamratstöd med lyhörda instruktioner. V/P [S4][S5] | Delvis: samtalsidéer finns; ingen gemensam stödstruktur. | P2 | Den vuxne stödjer initiativ och väntar; barnet kan delta på eget sätt. |

### K. Integritet och sakliga påståenden

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| K01 | Minimera barns uppgifter och externa beroenden. V/P [S27] | Delvis: lokal profil/backup; extern Google Fonts-länk finns. | P0 | Inventera verklig nätverkstrafik; lokala typsnitt; begripliga uppgifter om lagring. |
| K02 | Backup och radering ska vara begripliga och hanterbara. V/P [S27] | Delvis: export/radering finns; backup inkluderar flera privata innehållstyper. | P1 | Förklara omfattning, vem som kan läsa kopian och vad radering gör; prova återställning. |

### L. Utvärdering och kvalitet

| ID | Kriterium och grund | Nuläge | Prio | Verifiering för godkännande |
|---|---|---|---|---|
| L01 | Testa med barn med olika stödbehov och med autistisk medverkan. V/P [S7][S12] | Ej verifierat: inga deltagardata i denna genomgång. | P0 | Dokumentera deltagarnas åtkomstsätt, medverkan, återkoppling och ändringar. |
| L02 | Mät både nytta och oönskad belastning. F/P [S8] | Lucka: appstatistik är inte ett välbefinnandemått. | P0 | Följ barnets uttryck, frivillighet, vuxenstöd och svårigheter med avslut. |
| L03 | Produktpåståenden ska motsvara faktisk verifiering. F/P [S8][S10] | Delvis: dokumentationen beskriver begränsningar; starka påståenden förekommer. | P0 | Granska text om ingen datatrafik, inga distraktioner, autismstöd och lärandeeffekt. |

## Konkreta fynd i koden

Dessa är kodfynd, inte skärmbaserade observationer. Radnummer avser granskad version och kan ändras.

1. **Talet Av är inte en fullständig spärr.** `src/ui/kos.js`, `say`/`read`, anropar `speak` med `force:true`. `src/core/speech.js` tillåter detta när talet är avstängt. Exempel på automatisk `say` finns vid fel i `src/ui/quiz.js` och vid välkomsthälsning i `src/ui/shell.js`. Logikproben gav ett talanrop med profilens tal Av. Skilj explicit läsning från automatisk återkoppling och definiera vad Av innebär.
2. **Zoom begränsas uttryckligen.** `scripts/build.mjs:42` har `maximum-scale=1` och `user-scalable=no`; `src/main.js` förhindrar gester och täta touchslut. Detta är en konkret risk för I01, inte bevis för hur varje modern webbläsare beter sig. Ta bort generella förstoringshinder och hantera oavsiktliga dubbeltryck lokalt.
3. **Sortering är inte genomgående tangentbordsåtkomlig.** `src/ui/quiz.js`, `sort`/`attachDrag`: objekten får `role=button` och `tabindex`, men valet sker via pointer-händelser. `onTap` i `src/ui/dom.js` kopplar bara click. En roll gör inte en div till en fungerande tangentbordsknapp. Tillför aktivering och tydliga namn.
4. **Paus är inte gemensam i alla vyer.** Quiz har en bevarande paus. `src/ui/views/science.js` har egna animationsloopar, och `src/ui/views/trace.js` har en rörlig demonstration. De omfattas inte automatiskt av CSS-spärrar. Kartlägg livscykeln för varje vy.
5. **Skärmtidsgränsen avbryter direkt.** `src/ui/shell.js`, `showLimit`, börjar med `closeWindow(true)`. En vänlig sluttext ersätter inte förberedelse och kontinuitet. Förslag: begriplig förvarning, nästa avslutspunkt och tydligt återtag; exakt upplägg väljs med barnet och den vuxne.
6. **Hjälp kommer efter fel.** `src/ui/quiz.js` ger hint i `wrong`. Det saknas en generell hjälpknapp före svar. Tillför en frivillig väg till exempel och vuxenstöd.
7. **Extern typsnittsförfrågan kan förekomma.** `scripts/build.mjs:13,32–34` länkar Google Fonts. Det bevisar inte att profilinnehåll skickas, men ”ingen data lämnar enheten” är för kategoriskt utan nätverksinventering. Lokal lagring och helt offline drift är olika påståenden.
8. **Intern och synlig nivå kan skilja sig.** `steadyRounds` behåller quizfrågornas startnivå, medan `recordAnswer` fortfarande uppdaterar ämnesnivån. Kontrollera indikatorerna så att barnet inte får motsägelsefull information.

## Vad WCAG innebär här

WCAG 2.2 AA är ett rimligt tekniskt produktmål, men den här matrisen är inte hela standardens kontrollista. Alla tillämpliga A- och AA-kriterier, inklusive sådana som inte listas här, måste bedömas för full överensstämmelse. [S11]

- Textförstoring: normalt upp till 200 procent utan förlust av innehåll/funktion, med standardens undantag. [S18]
- Omflöde: exempelvis 320 CSS-pixlars bredd vid motsvarande förstoring; vissa tvådimensionella innehåll har undantag. [S23]
- Textkontrast: normalt minst 4,5:1, eller 3:1 för stor text enligt definitionen. Relevant icke-textkontrast har egna villkor och normalt 3:1. [S24][S25]
- Målyta 2.5.8 AA: 24 × 24 CSS-pixlar eller tillåtet avstånd/undantag. KidsOS bör behålla större barnvänliga ytor. Appens 44-punkterstest är inte samma sak som hela WCAG-bedömningen. [S17]
- Rörelse från interaktion 2.3.3 är AAA. Vi föreslår det som ytterligare produktkrav där tillämpligt, inte som AA-krav. [S19]
- Kontinuerlig rörelse 2.2.2 och ljusblixt 2.3.1 har skilda villkor. Ett reglage efter att en otillåten ljusblixt har visats är inte tillräckligt. En snabb skaländring är samtidigt inte automatiskt en ljusblixt. [S20][S21]
- 3.2.6 kräver konsekvent placering av vissa hjälpvägar om de finns; det kräver inte i sig att varje app har en hjälpknapp. Vårt C03 är ett separat behovsbaserat produktkrav. [S28]

## Rekommenderad ordning för utvecklingen

### Etapp 1: tillförlitlig grund

Stäng luckorna D01, H01–H03 och I01 först. Inventera all rörelse och sena händelser för D03–D05/E02. Gör nätverksinventering och korrigera K01/L03. Leverera med riktade testfall för varje fynd, inte bara ett större antal allmänna tester.

### Etapp 2: begriplighet och självständigt deltagande

Inför gemensamma Hjälp, Visa igen, Paus och Avsluta. Skapa en förhandsplan som fungerar med individuellt bildstöd. Förbered skärmtidsavslut. Erbjud förenklad navigation och lugn återkoppling. Behåll intressen och fri lek.

### Etapp 3: kommunikation och vardagsöverföring

Utforma kommunikationsstöd med barnet och relevanta stödpersoner. Undersök samspel med befintlig AKK. Prova konkreta vardagssekvenser med samma stöd även utanför appen. Gör inget behandlingspåstående utifrån att en funktion liknar en klinisk metod.

### Etapp 4: återkommande verifiering

Genomför tillgänglighetskontroller, deltagarutvärdering och uppföljning efter ändringar. Bevara resultat per kriterium och för varje relevant åtkomstsätt. Markera okända resultat som okända.

## Plan för tester med barn

### Rekrytering och medverkan

Använd små, iterativa omgångar. Föreslaget startupplägg: 4–6 familjer per omgång, därefter komplettering där behov inte representerats. Detta är ett praktiskt pilotupplägg, inte en statistiskt motiverad effektstudie eller garanti om täckning.

Representera förläsare och läsare, talande barn och AKK-användare, olika motoriska/sensoriska behov och samtidig adhd eller intellektuell funktionsnedsättning där målgruppen omfattar dessa. Rekrytera inte bara barn som lätt kan beskriva upplevelsen muntligt. Vårdnadshavares perspektiv kompletterar barnets, ersätter det inte. Involvera autistiska personer i prioritering och tolkning. [S7]

Förbered information i barnets format, vårdnadshavares samtycke där relevant och barnets fortlöpande vilja att delta. Avböjande och obehag ska respekteras även utan tal. Spela inte in eller samla hälsouppgifter som inte behövs. Vid planerad klinisk forskning krävs ett separat professionellt upplägg.

### Föreslagna uppgifter

1. Hitta en vald aktivitet med sitt vanliga stöd.
2. Förstå vad som ska göras och när aktiviteten är klar.
3. Be om hjälp utan att först svara fel.
4. Ändra ett störande intryck och kontrollera att valet följer profilen.
5. Pausa mitt i aktiviteten och återgå utan överraskning.
6. Avböja eller avsluta; undersök även ett förberett skärmtidsavslut.
7. Använd samma kunskapsmål med annat material efteråt, om vardagsöverföring är avsikten.

Barnet behöver inte slutföra listan. Det är appen som utvärderas.

### Vad som dokumenteras

Notera åtkomstsätt, barnets val och uttryck, vilken hjälp som behövdes, när missförstånd uppstod och vad som gjorde återgång lättare. Skilj spontant initiativ från guidat genomförande. Dokumentera avbrott och negativa upplevelser, även när uppgiften blev korrekt.

Använd inte ögonkontakt, stillasittande, längre skärmtid eller fler klick som framgångsmått. Tid kan beskriva arbetsbörda men ska inte bli en pressande gräns för barnet. Följ upp belastning och avslutssvårigheter med familjen utan att tillskriva appen orsak enbart genom tidsmässigt samband. [S8]

### Teknisk testuppsättning

Safari på faktisk iPad/iPhone, desktopläge, stora textinställningar, VoiceOver, relevant Switch Control/tangentbord, manuell och avstängd uppläsning, ljud Av, mindre rörelse, flera profiler, omladdning, backup, lagringsfel och avbrutna aktiviteter. Automatiska kontroller kompletteras med manuell och deltagarbaserad verifiering.

## När vi får säga att en version är redo

- Alla tillämpliga P0-rader har dokumenterad kontroll och inga kända blockerare. En allvarlig enskild lucka kan inte döljas av ett medelvärde.
- P1-stöd finns eller har en tydlig, testad alternativ väg för den avsedda användargruppen.
- Alla tillämpliga WCAG A/AA-kriterier har bedömts innan full WCAG-överensstämmelse påstås.
- Pilotutvärderingen har lett till korrigeringar; kvarvarande målgruppsbegränsningar redovisas.
- Påståenden skiljer teknisk funktion, upplevd användbarhet, lärande och klinisk effekt.
- Utsagan ska vara ”utvärderad för dessa uppgifter och behov i denna version”, inte ”möter alla behov vid autism”.

## Källförteckning

Alla länkar kontrollerade 11 oktober 2026. W3C:s Understanding-sidor förklarar standarden; det normativa dokumentet är S11. Källor som inte kunde öppnas i fulltext används endast för det innehåll som faktiskt gick att verifiera.

- **S1 — SPSM:** [Autism och undervisning](https://www.spsm.se/stod-och-rad/undervisning/autism-och-undervisning/). Publicerad 17 augusti 2026. Skolkontext, individuell anpassning och övergångar.
- **S2 — SPSM:** [Visuellt stöd i förskolan](https://www.spsm.se/studiepaket-npf/studiepaket-npf-forskola/tydliggorande-pedagogik-i-forskolan/moment-3--visuellt-stod-i-forskolan/). Pedagogiskt stöd, inte appstudie.
- **S3 — Socialstyrelsen:** [Nationella riktlinjer: adhd och autism](https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/nationella-riktlinjer/riktlinjer-och-utvarderingar/adhd-och-autism/). Huvudrapport 2024; vård/socialtjänst.
- **S4 — NICE:** [CG170, prioriterade rekommendationer](https://www.nice.org.uk/guidance/cg170/chapter/key-priorities-for-implementation). 2013, uppdaterad 2021. Klinisk vägledning för under 19 år.
- **S5 — SPSM:** [Alternativ och kompletterande kommunikation](https://www.spsm.se/stod-och-rad/sprak-och-kommunikation/alternativ-och-kompletterande-kommunikation/).
- **S6 — ASHA:** [Augmentative and Alternative Communication](https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/). Professionsvägledning, inklusive förkunskaper och individuell bedömning.
- **S7 — W3C:** [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/). Working Group Note 2021; kompletterande vägledning.
- **S8 — Sandbank med flera:** [Project AIM, uppdaterad metaanalys](https://pmc.ncbi.nlm.nih.gov/articles/PMC10644209/). BMJ 2023;383:e076733. Sökning till november 2021, små barn och många insatstyper.
- **S9 — Fletcher-Watson med flera:** [A trial of an iPad intervention targeting social communication skills in children with autism](https://eprints.ncl.ac.uk/229033). Autism 2016;20(7):771–782. Universitetets publiceringspost och abstract granskade.
- **S10 — Leung med flera:** [Effectiveness of Using Mobile Technology…](https://mental.jmir.org/2021/9/e20892/). JMIR Mental Health 2021;8(9):e20892. Tio RCT, sökning till mars 2019.
- **S11 — W3C:** [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Normativ standard.
- **S12 — ASAN:** [The Right to Make Choices](https://autisticadvocacy.org/actioncenter/issues/choices/). Självrepresentationsperspektiv; sökindexets sammanfattning verifierad, fulltextsidan kunde inte öppnas. Ingen empirisk effektkälla.
- **S13 — W3C:** [Clear and Understandable Content](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/). Kompletterande kognitiv vägledning.
- **S14 — W3C:** [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html).
- **S15 — W3C:** [2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements).
- **S16 — W3C:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html).
- **S17 — W3C:** [2.5.8 Target Size, Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- **S18 — W3C:** [1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).
- **S19 — W3C:** [2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). AAA.
- **S20 — W3C:** [2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- **S21 — W3C:** [2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold).
- **S22 — W3C:** [2.4.11 Focus Not Obscured, Minimum](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
- **S23 — W3C:** [1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
- **S24 — W3C:** [1.4.3 Contrast, Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- **S25 — W3C:** [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- **S26 — W3C:** [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
- **S27 — IMY:** [För dig som är vårdnadshavare](https://www.imy.se/privatperson/dataskydd/dataskydd-for-dig-som-ar-ung/for-dig-som-ar-vardnadshavare/). Uppdaterad 10 december 2025. Barns särskilda skydd; ingen juridisk bedömning av KidsOS i detta dokument.
- **S28 — W3C:** [3.2.6 Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html).
- **S29 — W3C:** [Help Users Focus](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o5-user-focus/). Kompletterande vägledning.
- **S30 — W3C:** [Provide Help and Support](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o7-support/). Kompletterande vägledning.
- **S31 — SPSM:** [Autism i grundskolan](https://www.spsm.se/studiepaket-npf/studiepaket-npf-grundskola/autism-i-grundskolan/). Publicerad 17 februari 2026. Individuella förutsättningar och kartläggning.

[S1]: https://www.spsm.se/stod-och-rad/undervisning/autism-och-undervisning/
[S2]: https://www.spsm.se/studiepaket-npf/studiepaket-npf-forskola/tydliggorande-pedagogik-i-forskolan/moment-3--visuellt-stod-i-forskolan/
[S3]: https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/nationella-riktlinjer/riktlinjer-och-utvarderingar/adhd-och-autism/
[S4]: https://www.nice.org.uk/guidance/cg170/chapter/key-priorities-for-implementation
[S5]: https://www.spsm.se/stod-och-rad/sprak-och-kommunikation/alternativ-och-kompletterande-kommunikation/
[S6]: https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/
[S7]: https://www.w3.org/TR/coga-usable/
[S8]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10644209/
[S9]: https://eprints.ncl.ac.uk/229033
[S10]: https://mental.jmir.org/2021/9/e20892/
[S11]: https://www.w3.org/TR/WCAG22/
[S12]: https://autisticadvocacy.org/actioncenter/issues/choices/
[S13]: https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/
[S14]: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
[S15]: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
[S16]: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
[S17]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
[S18]: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
[S19]: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
[S20]: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
[S21]: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold
[S22]: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
[S23]: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
[S24]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
[S25]: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
[S26]: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
[S27]: https://www.imy.se/privatperson/dataskydd/dataskydd-for-dig-som-ar-ung/for-dig-som-ar-vardnadshavare/
[S28]: https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html
[S29]: https://www.w3.org/WAI/WCAG2/supplemental/objectives/o5-user-focus/
[S30]: https://www.w3.org/WAI/WCAG2/supplemental/objectives/o7-support/
[S31]: https://www.spsm.se/studiepaket-npf/studiepaket-npf-grundskola/autism-i-grundskolan/

## Komplettering: barn med större stödbehov och autism nivå 2

CDC:s återgivning av DSM-5 anger nivå 2 som behov av omfattande stöd. Bedömningen gäller social kommunikation och begränsade/repetitiva beteendemönster. Den är inte ett mått på läsförmåga, motorik eller en lämplig svårighetsnivå i en lärapp. KidsOS egna nivåer 1–5 är pedagogiska nivåer och ska hållas åtskilda från kliniska stödbehov. Appen behöver inte registrera klinisk nivå för att erbjuda anpassningar. [S32]

SPSM betonar kartläggning av individens förutsättningar och den omgivande lärmiljön. Därför bör stöd väljas efter observerade behov och barnets uttryck, inte automatiskt efter diagnosetikett. Behov av vuxenstöd är inte i sig ett misslyckat användartest om aktiviteten är avsedd att göras tillsammans. Testet ska visa om det planerade stödet räcker och om barnet kan delta på sitt sätt. [S31]

### Praktiskt arbetssätt att pröva

1. **Förstå uppgiften:** visa ett exempel med bekant föremål eller bild; be barnet visa sitt val med det kommunikationssätt som fungerar. Kräv inte ett muntligt återberättande.
2. **Förstå ordningen:** pröva ”Nu → Sedan → Klar” med meningsfulla symboler eller foton. Den införda textplanen är ett steg, men ingen verifierad lösning för barn som inte tolkar skriven text.
3. **Kunna påverka:** ge vägar till hjälp, upprepning, paus och avböjande. Ett ”nej” ska inte bli ett felsvar eller ta bort intjänade belöningar.
4. **Hantera sinnesintryck:** välj ljud, tal och rörelse tillsammans. Pröva också den fysiska platsen, ljus och störande bakgrundsljud. Ett lugnt skärmläge gör inte automatiskt omgivningen lugn.
5. **Ha rimlig arbetsbörda:** använd kortare rundor, tydliga avslut och återhämtning efter behov. Tre frågor är ett valbart produktupplägg, inte en evidensbaserad dos för autism nivå 2.
6. **Bevara kommunikationen:** barnet ska kunna använda sin befintliga AKK när appen används. Vuxna behöver modellera och svara på barnets initiativ, även när initiativet gäller att avsluta aktiviteten. [S33]
7. **Följa upp utanför appen:** välj ett konkret mål och pröva motsvarande aktivitet med annat material. Registrera barnets delaktighet och hjälpbehov; räkna inte bara appens poäng.

Listan är en tillämpningshypotes för KidsOS och måste prövas med barnet och stödpersonerna. Den är inte en behandlingsrekommendation eller ett kriterium för att få använda appen.

### Stabila val och antal alternativ

ASHA beskriver att symbolstorlek, antal symboler, organisation och åtkomst behöver individualiseras efter bland annat förståelse, sinnen och motorik. Stabil placering kan minska krav på minne och motorisk planering. Det innebär inte att alla barn ska ha två alternativ eller att ord och kommunikationsmöjligheter ska tas bort generellt. För KidsOS bör vi skilja stabila navigations- och stödknappar från övningar där variation fyller ett uttryckligt lärandemål. [S6]

### Det som fortfarande kräver medverkan från familjer och sakkunniga

- Val och förståelse av bild-/symbolsystem.
- Samspel med befintlig AKK, VoiceOver och relevant Switch Control på faktisk iPad.
- Hur förvarning och avslut upplevs; vad barnet uttrycker före, under och efter aktiviteten.
- Begriplighet vid samtidig språkstörning eller intellektuell funktionsnedsättning.
- Om ett tänkt vardagsmål faktiskt blir lättare eller mer tillgängligt utanför appen.

**S32 — CDC:** [Clinical Testing and Diagnosis for Autism Spectrum Disorder](https://www.cdc.gov/autism/hcp/diagnosis/index.html). Kontrollerad 11 oktober 2026. Klinisk beskrivning, ingen appstandard.

**S33 — ASHA:** [Augmentative and Alternative Communication in Early Intervention](https://www.asha.org/practice/early-intervention-provider-support/augmentative-and-alternative-communication-in-early-intervention/). Kontrollerad 11 oktober 2026. Professionsvägledning om individuellt kommunikationsstöd.

[S32]: https://www.cdc.gov/autism/hcp/diagnosis/index.html
[S33]: https://www.asha.org/practice/early-intervention-provider-support/augmentative-and-alternative-communication-in-early-intervention/
