# WCAG 2.2 AA – genomgång och förbättringar

2026-10-11. Mål: WCAG 2.2 nivå AA. Detta är en påbörjad, kodbaserad granskning och implementation, ingen överensstämmelseförklaring.

Normativ källa: [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/). Kompletterande förklaringar: [W3C Understanding](https://www.w3.org/WAI/WCAG22/Understanding/). Kraven på tangentbord, namn/roll/värde, kontrast och fokus är separata; att förbättra ett av dem bevisar inte att de övriga är uppfyllda.

## Byggt i denna genomgång

- Interaktiva SVG-delar i världskarta, kropp, solsystem, stjärnbilder och gungbräda får namn, knapproll, tabbfokus och Enter/mellanslag. SVG-kartan använder grupproll när den innehåller kontroller så att bildrollen inte döljer dem. Fokus återställs till motsvarande kontroll vid omritning där en stabil identifierare finns.
- Klickbara ord i berättelser får samma tangentbordsbeteende och beskrivande namn.
- `aria-disabled` blockerar både klick och tangentbordsaktivering i den gemensamma tryckhjälparen.
- Anteckningsfält, föräldrakod och säkerhetskopieringsfält får explicita tillgängliga namn. Miniräknarens resultat är en statusregion.
- Minimerade datorfönster blir inerta och dolda för hjälpmedel; återställning tar bort dessa tillstånd.
- Startmenyn använder en namngiven region med vanliga knappar, i stället för en menu-roll utan motsvarande menytangentbord. Startknappen visar öppet/stängt tillstånd.
- Gemensam fokusmarkering omfattar länkar, textfält och SVG-kontroller. Windows högkontrastläge får systemfärger för fokus och kontrollkanter.
- Primära knappar och faroknappar får mörkare bakgrund. Feedbackens textfärger har separata ljusa och mörka teman. Scrollmarginal ger utrymme kring fokuserade kontroller, men bevisar inte att klistrade rubriker eller tangentbord aldrig täcker fokus.

## Beräknade kontraster

Beräknade enligt WCAG:s relativa sRGB-luminans. Gäller dessa exakta färgpar, inte hela appens faktiska renderade tillstånd. Opacitet, gradienter, överlagringar och andra selektorer behöver granskas separat.

| Färgpar | Förhållande |
|---|---:|
| Primärknapp #294e86 / vit text | 8,31:1 |
| Faroknapp #b52b36 / vit text | 6,24:1 |
| Positiv text #087849 / #e3f8ee | 4,99:1 |
| Försök igen #98500c / #fff2e2 | 5,46:1 |
| Positiv text natt #6ee7b7 / #173a33 | 8,15:1 |
| Försök igen natt #ffd19b / #3d2a17 | 9,63:1 |

## Kriterieområden och kvarvarande arbete

| Område | Krav att verifiera | Nuvarande bevis / återstående arbete |
|---|---|---|
| Textalternativ | 1.1.1 | Foton har befintliga alt-texter. Interaktiva delar får namn. Inventera alla meningsbärande canvas-/SVG-bilder och deras alternativ. |
| Struktur | 1.3.1–1.3.3 | Fältnamn och knappsemantik förbättrade. Verifiera rubrikstruktur, läsordning och instruktioner i alla aktiviteter med skärmläsare. |
| Enhetsläge | 1.3.4–1.3.5 | Ingen avsiktlig orienteringslåsning. Testa rotation; bedöm autocomplete för tillämpliga inmatningsfält. |
| Färg, kontrast, förstoring | 1.4.1, 1.4.3–1.4.5, 1.4.10–1.4.13 | Vissa färgpar beräknade; zoom tillåts sedan tidigare. Testa 200 % text, 320 CSS-px reflow, textavstånd, grafik/kanter och allt hover/fokusinnehåll. |
| Tangentbord | 2.1.1–2.1.2, 2.1.4 | Fler aktiviteter kan aktiveras utan pekare. Rita/spåra kan ha tillämpligt undantag för vägberoende inmatning; fria dragmoment måste bedömas separat. Testa hela slutförandeflöden. |
| Tid och rörelse | 2.2.1–2.2.2, 2.3.1 | Befintlig paus och skärmtidsförlängning finns. Utvärdera tidsgränsens villkor, alla rörelser över fem sekunder och blinkningar. Profilens minskade rörelse bevisar inte ensamt kraven. |
| Navigation och fokus | 2.4.1–2.4.7, 2.4.11 | Fokusmarkering och minimeringsbeteende förbättrade. Kontrollera fokusordning, sidtitel, rubriker, alternativa navigeringsvägar och att fokus inte helt täcks. |
| Pekare och drag | 2.5.1–2.5.4, 2.5.7–2.5.8 | Quizsortering och studio har befintliga alternativ. Kontrollera andra dragaktiviteter, synlig etikett kontra tillgängligt namn, pekaravbrott och varje träffyta/avstånd. |
| Språk | 3.1.1–3.1.2 | Dokumentet är svenska. Inventera eventuella språkbyten. |
| Förutsägbarhet och hjälp | 3.2.1–3.2.4, 3.2.6 | Befintliga hjälpknappar och pauser. Kontrollera ändringar vid fokus/inmatning och konsekvens mellan aktiviteter. |
| Inmatning och autentisering | 3.3.1–3.3.4, 3.3.7–3.3.8 | Fältnamn förbättrade. Felmeddelanden behöver kopplas till fält. Föräldraspärrens multiplikationsfråga/PIN behöver särskild bedömning av kognitivt test och tillgängligt alternativ; ingen godkänd status antas. |
| Hjälpmedel och status | 4.1.2–4.1.3 | Roller, namn och resultatstatus förbättrade. Testa faktisk tillgänglighetsträd/utläsning, nästlade dialoger och dynamisk feedback. |
| Ljud/video | 1.2.1–1.2.5, 1.4.2 | Bedöm vilka mediekrav som är tillämpliga. Uppläsningens inställningar är inte en ersättning för textalternativ, ljudkontroll eller eventuell undertextning. |

Varje kriterium behöver ett eget testresultat innan överensstämmelse kan anges. Tabellen grupperar arbetet och markerar inga kriterier som generellt godkända.

## Verifieringsgräns

Tester körs i Node och LinkeDOM; canvas, bildladdning och webbläsar-API:er ersätts delvis med testmodeller. De verifierar kodbeteende, inte bildlayout, åtkomlighetsträd eller barnets upplevelse. Tidigare policyspärr för lokal webbläsarvisning har inte kringgåtts. Riktig Safari/iPad, tangentbord, VoiceOver, Switch Control, högkontrastläge och zoom måste kontrolleras manuellt.

## Fortsatt granskningsvarv

- Skuggexperimentet och månfasaktiviteten har nu namngivna standardreglage som styr samma modell och mål som dragningen. Månreglaget anger fas i `aria-valuetext`; solreglaget anger position. Detta ger ett tangentbordsalternativ till dessa dragmoment, men träffytor och faktisk hjälpmedelsutläsning är fortfarande ej verifierade.
- Föräldraspärren har ett vanligt text-/lösenordsfält som stödjer inklistring, redigering och Enter. Fel visas i en alert-region och fältet markeras med `aria-invalid`. Den befintliga multiplikationsspärren utan PIN kvarstår och är en öppen fråga för 3.3.8; ingen alternativ vuxenidentifiering har införts som ändrar spärrens syfte.
- Dialoger isolerar bakgrunden med `inert` och återställer tidigare tillstånd vid avslut. Fallbackdialogen hanterar tom kontrollista och första Shift+Tab bättre. Äldre webbläsare utan inert-stöd och faktisk virtuell skärmläsarnavigation behöver fortfarande testas.
- Lekstadens avbrutna pointer-händelse utlöser inte längre släpp-/tryckåtgärden.

### Varför full AA-nivå ännu inte kan markeras

Kravstatusen är fortfarande öppen för hela slutförandeflöden med tangentbord, alla dragmoment, alternativa canvasbeskrivningar, synliga kontrollnamn, samtliga kontrasttillstånd, reflow/textavstånd, tillgänglig vuxenspärr, tid/rörelse och hjälpmedelsnavigation. En godkänd DOM-körning eller beräknade enstaka färgpar räcker inte som bevis för dessa krav. Granskningen kan fortsätta i kod, men full överensstämmelse kräver tillgång till tillåten visuell/webbläsar- och hjälpmedelsverifiering.

## Ny tillgång till publicerad Chrome-app

Användaren anslöt Chrome och angav https://kids.kevinmarquez.se/. Den publicerade appen har nu faktiskt kontrollerats i Chrome, inklusive ett quiz vid 320 CSS-px och tangentbords-/pausflöde. Tidigare uppgifter om blockerad webbläsartestning gäller lokal filvisning, inte denna nya publicerade webbadress. Full överensstämmelse är fortsatt öppen; lokala rättningar finns ännu inte nödvändigtvis i publicerad version. Se [Chrome-genomgång med skärmbilder](CHROME-WCAG-GRANSKNING.md).
