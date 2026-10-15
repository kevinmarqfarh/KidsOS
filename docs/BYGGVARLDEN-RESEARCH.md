# Byggvärlden: research och granskningskrav

Researchdatum: 2026-10-15. Dokumentet skiljer designunderlag från verifierat beteende. Godkända tester är inte ett intyg om klinisk lämplighet eller full WCAG-överensstämmelse.

## Egen byggvärld efter Lekstaden

Rekommendationen är en egen lokal byggleksak med kvarter, byggdelar, figurer och frivilliga uppdrag. Roblox dokumentation ger användbara generella mönster för flera inmatningssätt. Vi använder egen kod, egna enkla former och eget innehåll. Roblox körmiljö, protokoll, konton, varumärkesgrafik och spelarnas tillgångar behövs inte.

Roblox [Input](https://create.roblox.com/docs/input) och [Cross-platform development](https://create.roblox.com/docs/projects/cross-platform) beskriver hur samma spelhandling kan ha olika kontroller på dator och pekskärm. Vår tillämpning: välj ruta, välj byggdel och använd en tydlig byggknapp; tangentbord ska kunna utföra samma handlingar. Ingen handling ska kräva precisionsdragning eller en gest med flera fingrar.

## Stöd för begriplighet och lugn

[SPSM Autism](https://www.spsm.se/funktionsnedsattningar/autism/) beskriver betydelsen av förberedelser, struktur och visuellt stöd. Vår designtolkning: synligt valt verktyg, text tillsammans med symbol, kort instruktion, oförändrad värld när hjälp öppnas samt fria val mellan lek och uppdrag. Behoven varierar mellan barn; diagnos ska inte styra alla inställningar.

[W3C COGA: Let Users Go Back](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p02-back-undo/) rekommenderar förutsägbara vägar tillbaka utan förlust av arbete. Vår tillämpning: ångra byggändring, möjlighet att avbryta köp, autosparande per profil och säkerhetskopia. COGA är kompletterande vägledning och är inte i sig ett WCAG-krav.

[Xbox Accessibility Guideline 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117) behandlar distraherande rörelser och inställningar för visuella effekter. Vår tillämpning: fast kamera, ingen kameraskakning och inga nödvändiga bakgrundsanimationer. Respektera appens inställningar för reducerad rörelse, ljud och återkoppling. Detta är en tillämpning av spelvägledning, ingen Xbox-certifiering.

## Ekonomi och integration

Appens befintliga profilmynt ska vara den gemensamma valutan. `src/core/model.js` ger redan mynt för genomförda kursmoduler. Byggvärlden ska läsa samma saldo, inte skapa en fristående plånbok. Kontroller i både gemensam frågerunda och specialövningar behöver verifiera kopplingen för samtliga kursappar.

Startdelar och fri lek bör vara användbara även med noll mynt. Köp gäller tydligt namngivna delar eller paket med fast pris och användning efter köp. Visa saldo och kvarvarande saldo före köp; otillräckligt saldo ska förklaras utan skuld eller uppmaning att fortsätta spela. Inga verkliga pengar, annonser, slumpköp, nedräkningar, förlorade dagssviter eller sociala jämförelser. Inga externa spelare, chattar eller publicerade barnuppgifter.

## Acceptansmatris för oberoende domare

| Område | Godkänt när | Evidens |
| --- | --- | --- |
| Start och återkomst | Världen nås från Lekstaden och samma profil återfår bygget efter omstart | DOM-flöde, spar-/laddningstest |
| Fri lek | Ett barn med noll mynt kan välja, bygga, ta bort och ångra | Logiktest och verkligt gränssnittsflöde |
| Ekonomi | Köp visar pris, kan avbrytas, debiterar en gång och kan inte ge negativt saldo | Test av dubbelaktivering, gränssaldo och integration |
| Kurskoppling | Alla kursappar använder samma profilmynt; kreativt deltagande kan också belönas | Inventering av belöningsvägar och regressionstest |
| Pekskärm | Alla byggfunktioner fungerar med enstaka tryck; avbruten pekhändelse ändrar inget | Pekflöde, fysisk telefon och penna återstår separat |
| Tangentbord | Val, bygg, ångra och köp kan göras med synligt fokus och begriplig ordning | Webbläsarflöde med tangentbord |
| Mobil | 320, 390 och 430 px: huvudkontroller nås, inget sidöverflöde och dialog kan stängas | Skärmbilder och uppmätta gränser i webbläsare |
| Kognition | Vald ruta/verktyg och nästa steg framgår; hjälp och paus bevarar arbetet | DOM och visuell granskning, senare barnobservation |
| Sensorik | Inga obligatoriska rörelser eller ljud; befintliga preferenser respekteras | Kodinventering och kontroll med reducerad rörelse |
| Tillgänglig information | Rutornas namn anger position och innehåll; färg är inte enda markör | DOM/AT-granskning; fysisk VoiceOver separat |
| Datalagring | Profilbyte isolerar världar; säkerhetskopia återställer världen; radering tar bort den | Automatiserat roundtrip- och isoleringstest |
| Robusthet | Felaktiga importer normaliseras; världsgränser respekteras; lagringsfel döljs inte | Tester för korrupt data, gränser och full lagring |

## 10/10-bedömning kräver evidens

Målet är en välfungerande byggleksak, men ett önskat betyg är inte ett testresultat. Varje granskare ska ange observerat beteende, konkret brist och underlag. En automatisk domare får inte sätta 10/10 enbart för att tester passerar eller för att koden ser rimlig ut.

Slutrapporten ska skilja logiktester, DOM-tester, webbläsarmätningar, bildgranskning och fysisk enhetsprovning. Om någon av dessa inte gjorts ska den beskrivas som återstående. Lärare/förälder och barn i olika åldrar behöver prova begriplighet och skaparglädje innan påståenden om pedagogisk effekt kan göras. Ingen funktionslista kan bevisa ett universellt 10/10 eller att alla barn med autism får rätt stöd.

## Genomförd oberoende granskning

Första kodvarvet hittade fyra brister: vikpaneler stängdes och tappade fokus vid uppdatering, avslutat köp tappade fokus, canvas saknade textbeskrivning av bygget och bekräftelseknappen behövde skydd mot upprepad aktivering. Vyagenten rättade dessa; nästa kodvarv begärde även beständig varning vid tillfällig lagring, unikt köp-id och kvarvarande saldo i köpförslaget. Dessa noteringar beskriver granskningsarbetet, inte ett slutligt visuellt godkännande.

Andra rättningsvarvet är kodgranskat: separat lagringsvarning finns kvar, köp visar kvarvarande saldo och ett ökande köp-id stoppar gamla bekräftelseknappar även efter ett nytt likadant köpförslag. Öppna paneler bevaras och textlistan beskriver placeringarna. Ingen kvarvarande blockerare identifierades i denna kodgranskning.

Aktuell riktad testsvit omfattar 11 modelltester, 9 DOM-tester och 2 integrationstester. Huvudagenten rapporterar 504 passerande tester i hela appen. Byggvärldstesterna täcker fria startdelar, gränser, återföring, korrupt data, atomiska byggskisser, uppdragens nåbarhet, gamla köpförslag, öppna paneler, paus, förhandsvisning, profilåterkomst, säkerhetskopia och profilradering. Modellsambandet mellan alla 12 kursappar och gemensamma köpmynt är testat; det motsvarar inte manuell provning av alla kursers gränssnitt.

### Publicerad Chrome, faktisk användning

Huvudagenten har verifierat Lekstaden → Byggvärlden, gratis hus med 15 delar och ytterligare en sten, borttagning/ångra, tangentbordsförflyttning, paus/fortsätt samt sparning/omladdning med 16 delar och 18 mynt bevarade. Ett faktiskt kursflöde provades: Plus & minus med sex frågor gav 13 mynt och 10 trofémynt, sammanlagt 23; ett steninköp för fem lämnade 18. Ingen varning eller felrad observerades i den kontrollerade webbläsarloggen.

Fem format mättes: 320 × 568, 390 × 844, 430 × 932, 568 × 320 och 1280 × 800. Rapporten från huvudagenten visar inga sidöverflöden i dessa mätningar; rotinnehållets bredder var respektive 296, 366, 406, 544 och 1040 px. Canvas höll sig inom tillgänglig bredd. Enbart breddmätning kan inte upptäcka överlapp eller dolda kontroller.

Oberoende bildgranskning av `built-390.jpg` och `start-390.jpg` fann en tydlig egen byggvärld, läsbart saldo och stora knappar, men styrningen hamnade långt nedanför byggytan. I nästa varvs `final-390.jpg` ligger Gå/Bygg och riktningsknappar direkt efter byggytan, vilket förbättrar åtkomsten. `final-build-controls-390.jpg` och `final-controls-320.jpg` visar att placera, ångra, rotera och ta bort ryms och nås under den kvarliggande byggytan.

### Slutvarv på publicerad version `bc142a3`

Huvudagenten rapporterar att hela testsviten med 504 tester och produktionsbygget passerar. Samma genomgångna bygg- och myntflöde är bevarat efter publiceringen.

Oberoende bildgranskning av `release-landscape.jpg` visar byggyta och kontroller i separata kolumner i liggande mobilformat. `release-focus-320.jpg` visar att fokuserad Ångra-knapp är helt synlig nedanför canvas och status. `release-390.jpg` visar navigationspilar och begripligt hinderbesked nära byggytan. I `release-controls-430.jpg` syns placera, ångra, rotera och ta bort. `release-short-desktop.jpg` visar separerad byggyta och panel med rimliga proportioner. Huvudagentens mått för låg datorskärm är canvas 428,57 × 299,99 px, förhållande 1,4286, och rotbredd 976 av 976 tillgängliga px. Övriga rapporterade bredder är fortsatt 296, 366, 406, 544 och 1040 px inom respektive tillgänglig bredd.

Inga nya blockerande visuella fynd identifierades i dessa bilder. Tidigare fynd om liggande överlapp, canvasproportioner och dold återkoppling bedöms rättade inom de observerade flödena. Efter en separat stabiliserad skärmfångst är även `release-desktop.jpg` oberoende bildgranskad vid 1280 × 800 px. Den visar byggyta till vänster och läsbara kontroller, status, saldo och paneler till höger utan synligt överlapp. Huvudagentens mått är rotbredd 1040 px och canvas 588 × 411,59 px. Bred dator har därmed både bild- och mätunderlag.

Fysisk Safari/iPhone, verklig penna, skärmläsarens uppläsning och barnens begriplighet/skaparglädje är inte verifierade här. Slutsatsen gäller kontrollerad kod, tester, Chrome-flöden, mätningar och angivna bilder. Ingen universell 10/10-bedömning eller full tillgänglighetsförsäkran utfärdas.
