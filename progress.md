Original prompt: Finns spelet som ska vara tungt inspirirerat av Toca Boca där man skapar rum och karaktärer där man vinner spelpengar genom att klara av kursmodulerna? Använd flera agenter, kolla ordentligt hur Toca Boca spelen ser ut och lägg till mycket innehåll som inspirerar användaren att lära sig och vinna nytt innehåll genom inlärning. Använd flera agenter för att bygga på en stor bank av hög-kvalitativt innehåll.

## Arbete
- Inspekterat befintliga Lekstaden: rum, figurer och mynt finns men föremålen är främst emoji och fri lek kan ge mynt via upprepade aktiviteter.
- Granskat Toca Bocas officiella rumdesigner och outfitdesigner visuellt i deras hjälpcenter. Egen originalgrafik ska följa tydlig dockhusvy, färgade ytor, möbelkategorier och uttrycksfulla figurer.
- Tre agenter arbetar med innehållsbank, studions rum-/karaktärsredigerare och lärandets belöningar.
- Ny Skaparstudio planeras med separat sparning per barn; äldre Lekstaden bevaras.

## Verifiering att slutföra
- Kursrunda → mynt → krav uppfyllt → paketköp → placering i rum → sparning efter omladdning.
- Mobil, iPad och datorläge; tangentbord samt tryck och drag.
- Köpförsök utan mynt/utan kurs, dubbelt köp, profilseparation och gammal sparning.
- Kör web-game-klienten, läs state-utdata och inspektera spelbilder.

## Integrering
- Bank: 80 originalföremål, 10 rum, 9 kurspaket och berättelseidéer; fria startföremål och två figurer.
- Studion är en egen modul i Lekstaden och är direkt åtkomlig från stadskartan.
- Avslutad modulrunda ger extra mynt även vid flera försök. Frilekens klick och obegränsade vård-/skördeaktiviteter kan inte längre skapa valuta.
- Rundsammanfattningen visar mynt och en länk tillbaka till studion/målet.
- Webbgame-klienten körs från en kopia med miljöanpassad import av projektets Playwright Core och datorns Chrome. Testfixturen är separat från appen och riktiga profiler.

## Genomförd verifiering
- Fullt flöde på mobil passerar: välj mål, slutför riktig vetenskapsrunda, få mynt, köpa paket, placera mikroskop, öva igen, köpa rum, namnge och läsa tillbaka efter omladdning.
- 134 enhetstester passerar; sparningsmodellen och ekonomin täcks.
- Web-game-klienten har producerat och inspekterat rumsgrafik och JSON-tillstånd. Fönsterövergångar avstängda endast i isolerad bildfixtur för stabila skärmbilder.
- Menygenväg Lekstaden till vänster om Troféer i surfplatta/mobil, motsvarande genvägar i datorns aktivitetsfält.
- Fullskärm stöds med knappen Stor spelvy och F; Escape lämnar helskärm.

## Slutkontroller och kvalitetsjusteringar
- Karaktärsredigering, drag, piltangenter, fullskärm/Escape och separata profiler passerar.
- Studions rot behålls vid uppdateringar, så fullskärm inte stängs av när verktyg växlas.
- Varje rumstema har egen originalbakgrund och arkitektur. Föremålen använder 32 olika ritade former.
- Säkerhetskopiering och profilradering omfattar nu studions rum/inventarier; återläsning verifierad.
- Liggende iPad: breda svarskort för bilder använder två kolumner, vilket rättar ett upptäckt äldre layoutproblem i Världen.

## Status: färdigt
- 135 enhetstester passerar.
- Sju separata webbläsarkontroller passerar: redigerare, drag/fullskärm/profiler, datorgenväg/mynt, komplett lärandeköp, kurser, pekytor och samtliga modulers mobil/iPad-layout.
- Rum, paketvy och karaktärsredigerare inspekterade i web-game-klientens skärmbilder. Inga klientfel registrerade.
- Aktuella bildexempel finns i docs/screenshots/skaparstudio-figurer.png och skaparstudio-paket.png.
- Inga kvarstående blockeringar. Möjliga framtida fördjupningar: fler originella klädmönster och små möbelinteraktioner utan valutabelöning.

## Autism: slutgenomgång 11 oktober 2026

- Genomgång av de fem arbetsområdena i aktuell mapp: bildbank, autism/större stödbehov, Världen/SO, NO/biologi samt AI/Kodning/Undra.
- Research omfattar 48 spårbara kriterier och 33 källor, inklusive en komplettering om klinisk autism nivå 2 och individuellt kommunikationsstöd.
- Tal Av, zoom och sorteringens tangentbordshantering rättade. Hjälp före svar, valbar rundplan, lugn återkoppling och gemensamt aktivitetsstöd införda.
- Tidsstyrda steg hålls vid paus; rörelse/livscykel kompletterade i experiment och spårning. Skärmtidsgränsen behåller aktiviteten vid förlängning och förbereds med förvarning.
- Bildernas inbäddning matchar alla 20 lokala referensfiler och metadata. Externa typsnittslänkar borttagna.
- 150 enhets- och DOM-tester passerar. Bygge och dokumentgenerering passerar. Senaste ändringarna är inte visuellt eller på faktisk iPad verifierade, eftersom webbläsarens tidigare säkerhetsblockering gäller lokala filer.
- Aktuell åtgärds-/teststatus och återstående deltagar- och hjälpmedelskontroller finns i docs/SLUTGENOMGANG-AUTISM.md. Detta är inte en certifiering eller bevis på klinisk effekt.
