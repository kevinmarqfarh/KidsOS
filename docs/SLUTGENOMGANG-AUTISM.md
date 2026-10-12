# Slutgenomgång: senaste projektändringarna och autismstödet

Datum: 11 oktober 2026. Avser projektmappen KIDS, inklusive sammanslagningen och de lokala ändringar som användaren bekräftat innehåller Claudes arbete. Ingen separat författaridentifiering görs för varje fil; genomgången gäller resultatet i mappen.

## Resultat

Forskningsunderlaget är färdigställt för denna omgång: 48 kriterier med spårbara källor, avgränsningar och acceptanstester, samt en komplettering om större stödbehov och klinisk autism nivå 2. Appens pedagogiska nivåer är separata från kliniska stödbehov.

De konkreta tekniska luckorna i talspärr, zoom, sorteringens tangentbordshantering och externa typsnittslänkar är åtgärdade. Hjälp före svar, valbar plan före rundan och lugn återkoppling finns nu. Utforskande vyer har gemensamma hjälp- och pausknappar. Paus håller tidsstyrda steg och skärmtidsgränsen behåller den öppna aktiviteten när en vuxen ger mer tid.

Detta är inte ett godkännande av alla 48 kriterier för alla barn. Faktisk layout, kontrast, iPad, VoiceOver, Switch Control och användbarhet med barn behöver fortfarande verifieras.

## Genomgång av de fem arbetsområdena

| Arbetsområde i användarens sammanfattning | Granskat resultat i mappen | Kontroller och slutsats |
|---|---|---|
| Photo agent wave 3 | 20 lokalt inbäddade referensbilder i `src/assets/photos`, samt en separat äldre bildbank. | Varje referensbild matchar sin lokala fil byte för byte. Metadata matchar licensförteckningen. Detta är inte en ny juridisk kontroll av varje extern licens eller visuell verifiering av motivet. |
| Autism level 2 research agent | Individuella stödval och forskningsdokumenten. | Kompletterat med CDC:s kliniska nivådefinition och ASHA:s individuella kommunikationsstöd. Ingen automatisk ”nivå 2-profil” införs. Teknisk status redovisas per kriterium nedan. |
| World/SO finisher agent | Världen: åtta moduler, sex frågegeneratorer; kartor, historia, rättigheter och fotogalleri. | Generatorer och läroplansreferenser kontrolleras av innehållstesterna. Delad hjälp, paus och talspärr omfattar nu detta innehåll. Fullständig faktagranskning av varje historiskt/geografiskt påstående och faktisk kartåtkomst med hjälpmedel återstår. |
| NO/biology finisher agent | Vetenskap: elva moduler; biologi: nio. Frågor, experiment, arter, årstider och kropp. | Befintliga fysik- och generatortester passerar. Kontroll av paus/rörelse kompletterad i experiment. Sena experimenthändelser skyddas efter avslut. En missvisande raketförklaring om omloppshastighet har rättats. |
| AI, Kodning & Undra agent | AI: tio lektioner och 42 scenarier. Kodning: sex lektioner och 30 kursfrågor, dessutom robot och sköldpadda. Undra: nivåanpassade svar. | Kursstruktur, övningslänkar, lokal klassificeringsmodell, generatorer och nivåurval testas. Sena belöningar efter avslut har spärrats i robot/sköldpadda. AI-labbet använder en lokal modell och tillför inga externa AI-anrop. |

Även Skaparstudion, lärandemynten, profilseparationen, säkerhetskopiering och helskärmsintegrationen granskades eftersom de berör gemensamma flöden. Studions helskärm använder nu samma fönsterkontroll som övriga appar, så pausknappar och överlägg tillhör rätt behållare.

## Åtgärder i denna slutomgång

- Uppläsning Av stoppar både automatisk återkoppling och läsknappar. När jag trycker tillåter explicit läsning och stoppar automatiskt tal.
- Avbrutet tal avslutar väntande taloperationer och tar bort reservtimern. Detta förhindrar sena följdhändelser när talmotorn inte rapporterar avslut.
- Profilbyte avbryter tidigare tal; fördröjda trofénotiser får inte visas för ett annat barn.
- Zoomspärrar i sidans metadata och globala touchhändelser borttagna. Oavsiktliga dubbeltryck filtreras fortsatt på knapparna.
- Sorteringsobjekt och korgar kan aktiveras med Enter/mellanslag. Namn, valstatus och färdigstatus exponeras. Dragets efterföljande click väljer inte objektet på nytt.
- Hjälp kan visas före svar utan att räknas som ett misslyckat försök. Plan före rundan och lugn återkoppling sparas per profil.
- Gemensam paus håller tidsstyrda steg. Vattenpartiklar och planeter står still under paus. Aktiva webbanimationer pausas där webbläsaren erbjuder API-stöd.
- Mindre rörelse visar vattenpartiklar stilla, kälkens slutläge direkt och spårningslinjen utan rörlig penna. Dag/natt kan ändras stegvis. Kodning kan fortfarande visa separata programsteg.
- Skärmtidsförvarning visas under de sista två minuterna. Gränsen pausar i stället för att stänga fönstret. Föräldraspärren kan öppnas inom gränsöverlägget; förlängning återgår till aktiviteten.
- Bilder är fortsatt inbäddade. Externa typsnittslänkar borttagna; systemets tillgängliga typsnitt används. Påståendet om data har preciserats till lokal lagring av profiler och framsteg.
- Rakettexten beskriver cirka 28 000 km/h som hastighet i låg omloppsbana, inte som ett generellt krav för att nå rymden. [NASA](https://spotthestation.nasa.gov/faq.cfm)

## Uppdaterad kravmatris

Kriteriernas fullständiga definitioner, källor och acceptanstester finns i [AUTISM-KRAV-OCH-EVIDENS.md](AUTISM-KRAV-OCH-EVIDENS.md). ”Funktionstest” nedan avser logik eller isolerad DOM, inte verklig webbläsarlayout eller deltagarutvärdering.

| ID | Aktuell status efter slutomgången | Nästa verifiering eller återstående behov |
|---|---|---|
| A01 | Kodstöd utan diagnoskrav. | Barnets åtkomst till valen. |
| A02 | Funktionstest: stödval hålls isär och återställs. | Faktisk enhet och lagringsfel. |
| A03 | Delvis: hjälp, paus och avböjande finns. | Individuellt kommunikations-/symbolformat. |
| A04 | Delvis: manuella stödval och nivåval. | Äldre förläsare och andra ojämna färdighetsprofiler. |
| B01 | Infört: valbar förhandsplan för quiz. | Förståelse utan läsning; plan för andra aktiviteter. |
| B02 | Delvis: text och explicit uppläsning. | Individuellt meningsfulla bilder/foton. |
| B03 | Kodstöd: barnet väljer Nästa. | Deltagarutvärdering. |
| B04 | Funktionstest: samma genererade nivå i rundan. | Synliga indikatorer i faktisk UI. |
| B05 | Infört: varning och bevarad aktivitet vid förlängning. | Verklig tidsgräns, förberedelsens begriplighet. |
| C01 | Delvis: kort hjälp för aktivitetstyper. | Full instruktion-/innehållsgranskning. |
| C02 | Delvis: foton/illustrationer finns. | Individuellt symbolval och igenkänning. |
| C03 | Funktionstest: hjälp före svar utan poängavdrag. | Barnets förståelse av hjälpen. |
| C04 | Delvis: läsa igen; statisk spårningsdemonstration. | Individuella exempel för varje frågetyp. |
| C05 | Delvis: pausa och avsluta. | Jag vet inte, stopp och vuxenhjälp med barnets kommunikationssätt. |
| C06 | Strukturtest: överlägg och stöd tillhör helskärmsbehållaren. | Samspel med befintlig AKK på iPad. |
| D01 | Funktionstest: Av spärrar tal, även force-anrop. | Alla faktiska röst-/ljudvägar på enhet. |
| D02 | Funktionstest: manuell läsning fungerar; automatiskt tal stoppas. | Lång användning och sena händelser i Safari. |
| D03 | Delvis: fler JavaScript-rörelser omfattas. | Alla rörelser och meningsfulla statiska alternativ. |
| D04 | Delvis: gemensam paus och stilla vatten. | Tillämpliga WCAG-villkor i verklig rendering. |
| D05 | Ej verifierat. | Luminans, frekvens, yta och flashtrösklar. |
| D06 | Delvis: individuella val och lugn återkoppling. | Förenklad vy och individuell färg-/bildförståelse. |
| E01 | Infört: hjälp/paus i quiz och utforskande vyer. | Åtkomst med alla relevanta hjälpmedel. |
| E02 | Funktionstest: väntesteg stoppas; animationer får pauskontroll. | Alla vyers beteende i riktig webbläsare. |
| E03 | Funktionstest: avslut behåller intjänat. | Återtag efter omladdning finns inte för ofärdig quiz. |
| E04 | Kodstöd: valbar rundlängd. | Ork och frivillighet med barnet. |
| F01 | Delvis: separata stödval. | Representation efter läsning/motorik/förståelse. |
| F02 | Kodstöd: tips och förklaring. | Kvalitet i varje tips och rimliga felsvar. |
| F03 | Ej fullständigt verifierat. | Tvetydighet och onödig social gissning i hela banken. |
| F04 | Kodstöd: ämnesval och fri lek. | Deltagande och individuella intressen. |
| G01 | Ingen ny funktion för maskering/ögonkontakt införs. | Systematisk granskning av allt socialt innehåll. |
| G02 | Kodstöd: hjälp och stöd kräver inte poäng. | Kommunikation som framtida funktion ska följa samma princip. |
| G03 | Infört: lugn återkoppling stoppar trofé-/nivånotiser. | Hur belöningar och fortsatt användning upplevs. |
| H01 | Funktionstest: sortering via tangentbord. | Kartor, canvas och övrig alternativ åtkomst. |
| H02 | Funktionstest: sortering via tryck/tangentbord; drag bevarat. | Alla andra dragfunktioner. |
| H03 | Delvis: sorteringens namn och status förbättrade. | Tillgänglighetsträd/VoiceOver för alla kontroller. |
| H04 | Delvis: dialoghjälpare med återgång och fallback. | Faktiskt fokus, skärmläsare och alla globala dialoger. |
| H05 | Kodstöd för stora ytor. | Faktisk mätning och Switch Control. |
| I01 | Zoomspärrar borttagna. | 200 procent text och faktisk Safari. |
| I02 | Ej verifierat för denna ändring. | 320 CSS-pixlars effektiv bredd och relevanta undantag. |
| I03 | Ej verifierat. | Mät kontrast i alla teman/tillstånd. |
| I04 | Delvis: sorteringens status är programmatisk. | Färgoberoende status i hela appen. |
| J01 | Ingen uppmätt vardagsöverföring. | Testa mål utanför appen. |
| J02 | Delvis: hjälptexter och samtalsidéer. | Lyhörd vuxen-/kamratmedverkan. |
| K01 | Externa typsnittsanrop borttagna; dataformulering preciserad. | Faktisk nätverkstrafik och webbläsarens rösttjänster. |
| K02 | Kod-/modelltest: backup och profilseparation. | Begriplighet, privat innehåll och återställning på enhet. |
| L01 | Deltagarutvärdering saknas. | Barn med varierande stödbehov och autistisk medverkan. |
| L02 | Belastning och välbefinnande inte uppmätta. | Frivillighet, barnets uttryck och familjeuppföljning. |
| L03 | Påståenden preciserade; kvarvarande begränsningar dokumenterade. | Fortsatt kontroll före publicering och efter ändringar. |

## Verifiering och avgränsningar

Slutkörningen gav **150 godkända tester, noll fel och inga överhoppade tester**.
Av dessa är elva nya DOM-funktionstester. Appens båda HTML-utgåvor bygger och
läroplansdokumentet genereras. De byggda filerna har svenska dokumentmarkeringar,
tillåten zoom och inga externa typsnittslänkar.

- Enhetstesterna granskar frågegeneratorer i 65 moduler, med 120 frön och fem nivåer per generator, samt bland annat matte, fysik, robotfacit, kurser, ekonomi och sparning.
- Nya DOM-funktionstester täcker tal Av/manuellt tal, plan, hjälp, paus/avslut, tangentbordssortering, pausad väntan, stabil frågenivå, gemensamt aktivitetsstöd, stilla vatten, skärmtidsöverlägg, avbruten talmotor, dragets efterföljande click och helskärmens struktur.
- Referensbildtestet jämför samtliga 20 inbäddade bilder med filerna och metadata.
- Bygge och generering av läroplansdokument har kontrollerats.
- Webbläsarens tidigare säkerhetsblockering av lokala filer innebär att nya visuella och faktiska webbläsartester inte har utförts i denna slutomgång. Resultat från tidigare webbläsarkörningar gäller tidigare versioner och räknas inte som godkännande av de nya ändringarna.

Det finns fortfarande behov av faktisk iPad-/Safari-kontroll, full WCAG-granskning och pilotutvärdering med barn och deras stödpersoner. Forsknings- och kodarbetet i denna omgång är avslutat; användbarhet och effekt för målgruppen är inte därmed bevisade.
