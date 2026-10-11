# Appgenomgång: buggar, UI/UX och enhetsanpassning

Datum: 2026-10-11. Utgångspunkt: main efter eac6e0b. Ändringarna i denna genomgång finns i arbetsmappen. Ytterligare innehållsändringar tillkom under arbetet och har bevarats; slutkontrollen gäller den samlade aktuella koden.

## Omfattning och bevis

Genomgång av appregister, gemensamt skal, profilflöden, quiz, samtliga vyfamiljer, systemverktyg, lagring och de tre stilmallarna. Automatiskt öppnings-/stängningstest av alla 12 appar och 110 moduler i LinkeDOM. Befintliga tester kontrollerar dessutom innehåll, frågegeneratorer, ekonomi, framsteg, stödinställningar och experimentens modeller.

Detta är kodgranskning och enhets-/DOM-testning. DOM-modellen mäter inte layout och ersätter inte webbläsare, touch, skärmläsare eller användartester. Den tidigare säkerhetspolicyspärren för lokal appvisning gäller fortfarande; ingen alternativ webbläsarväg har använts för att kringgå den. Responsiva ändringar är därför byggkontrollerade men behöver visuell verifiering.

## Åtgärdade fynd

| ID | Prioritet | Problem och åtgärd | Kontroll |
|---|---|---|---|
| B01 | Hög | Full lagring gav en minnesreserv som läsningen ignorerade till förmån för äldre diskdata. Senaste reservversionen läses nu först och tas bort efter lyckad skrivning. | Simulerad lagringskvot, återhämtning och borttagning. |
| B02 | Hög | Säkerhetskopian tog bara med sex teckningar trots ett galleri med upp till 24. Exporten inkluderar nu hela galleriet. | Export av 24 teckningar. |
| B03 | Medel | Titelradens pointerup och dblclick växlade maximeringen två gånger. En gemensam dubbeltrycksväg hanterar mus och touch och kan även återställa fönstret. Avbruten pointer räknas inte som tryck. | Händelsesekvens med två tryck följda av dblclick, både maximera och återställ. |
| B04 | Medel | Aktiviteten fortsatte under fönstrets stängningsanimation. Vyn avslutas nu direkt; dess fönster tas bort efter animationen. | Kodgranskning och byggkontroll; realtidsflödet behöver webbläsartest. |
| B05 | Medel | Skrivbordets händelseprenumerationer och resize-lyssnare överlevde skalets avslut. Ny destroy städar dem samt fördröjda resize-timers. | Skrivbordets öppning/avslut i DOM-test samt kodgranskning. |
| B06 | Hög | Anteckningars autosparning använde aktuell anteckning för tidigare inmatnings ordbelöning. Callbacken håller nu den redigerade anteckningen. | Skriv tio ord, byt anteckning före autosparning, kontrollera räknare och belöning. |
| B07 | Medel | Miniräknaren kunde inte fortsätta från negativt resultat och ignorerade vissa ogiltiga tecken. Stöd för tecken framför tal, svenska decimaler och kontroll av hela uttrycket tillagt. | Negativa tal, multiplikation, prioritet, ogiltiga uttryck och division med noll. |
| B08 | Medel | Föräldraspärren saknade fysisk sifferinmatning och kunde godkännas flera gånger under stängning. Siffror, Backspace och Enter stöds; godkännande sker en gång. | Kodinmatning och upprepad Enter i DOM-modell. |
| B09 | Medel | Skalets dialoger saknade fokusspärr och fokusåterställning. Den översta öppna dialogen håller fokus, Tab cirkulerar och Escape stänger en dialog som får avbrytas. Dialogrubriken blir dess tillgängliga namn. | DOM-kontroll av dialog och kodgranskning; faktisk fokusordning/AT behöver webbläsartest. |
| B10 | Medel | Ritvyn kunde starta med negativ canvasbredd i en dold behållare; gamla bildladdningar kunde skriva över senare storleksändringar. Setup väntar på synlig bredd och bildåterställning kontrollerar version och livscykel. | Kodgranskning; canvasrendering och rotation behöver riktig webbläsare. |
| B11 | Medel | Lekstadens korgdrag lyssnade globalt även efter navigation och saknade pointercancel. Draget avbryts och lyssnare tas bort vid navigation, nytt drag och avbruten pointer. | Kodgranskning och öppnings-/stängningstest; drag behöver touchtest. |
| U01 | Medel | Flera layouter utgick enbart från skärmens bredd. Kurser, AI-labb, quiz, studio, raket, anteckningar och utforskare anpassas nu även efter appfönstrets bredd via container queries. Smala datorrubriker prioriterar fönsterknappar. | CSS bygger; visuell kontroll återstår. Äldre webbläsare behåller befintliga viewportregler. |

## Kvarvarande förbättringar och verifiering

1. **Lagringsrespons:** visa tydligt när en sparning endast finns i sessionens minne. `kos.saveNow()` använder fortfarande inte lagringens felresultat för att varna användaren. Reservkopian skyddar aktuell session men överlever inte att webbläsaren stängs.
2. **Tangentbord i fria aktiviteter:** komplettera klickbara SVG-delar och dragbaserade moment där motsvarande knappväg saknas. Öppningstestet verifierar inte att varje aktivitet kan slutföras med tangentbord eller Switch Control.
3. **Minimerade aktiviteter:** besluta om aktivitetstimers och uppläsning ska pausas per fönster. Den nuvarande pausen är gemensam för hela appen; enbart minimering är ingen fullständig paus.
4. **Stödinställningar och respons:** kontrollera att läsknappar tydligt visar när uppläsning är avstängd, och att alla färg-/figurval har begripliga namn i skärmläsare.
5. **Återställning:** testa stora säkerhetskopior och felaktigt formaterade importer. Att galleri och ägande ingår i exporten verifierar inte alla importfel eller lagringskvoter.

## Enhetsmatris för nästa manuella kontroll

| Enhet/flöde | Kontroll |
|---|---|
| Mobil 320–430 px, stående och liggande | Profilguide, rubrikknappar, docka, dialoger, långa svar och scroll. |
| iPad Safari, stående/liggande och Split View | Canvas, ljudupplåsning, helskärm/fallback, rotation mitt i aktivitet och touchdrag. |
| Dator, stort skrivbord med 340–700 px appfönster | Kurs, AI, quiz med bild, studio, Anteckningar och Utforskaren utan klippta knappar eller horisontell scroll. |
| Skärmtangentbord | Anteckningar och profilnamn: skrivfält och primärknapp ska gå att nå när tangentbordet täcker skärmen. |
| Tangentbord, VoiceOver och Switch Control | Fokus i nästlade dialoger, föräldrakod, startmeny, sortering och fria aktiviteter. |
| 200 % zoom och mindre rörelse | Läsbarhet, fokusmarkering, knappar och kontroll av att innehållet inte klipps. |
| Bakgrund/återkomst och lagringskvot | Bevarad uppgift, skärmtid, sparningsrespons, galleri och anteckningar. |

Ingen fullständig felfrihet eller WCAG-överensstämmelse kan fastställas med dessa tester. De åtgärdade fynden är konkreta; resterande punkter är tydligt avgränsade för fortsatt verifiering.

## Körresultat

158 enhets-/DOM-tester passerar, inga fel eller överhoppade tester. Bygget producerar både `dist/index.html` och `dist/artifact.html`. `git diff --check` passerar. Ändringarna är lokala och har inte publicerats i denna genomgång.
