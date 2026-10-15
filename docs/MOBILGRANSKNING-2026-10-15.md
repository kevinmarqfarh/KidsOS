# Mobilanpassning och oberoende granskning

Datum: 2026-10-15. Mål: KidsOS på smala telefoner och i liggande läge, med bibehållet desktop- och tablet-läge.

## Arbetssätt och domare

Två implementerande agenter arbetade med hemskärm/navigation respektive aktiviteter. En separat granskare och aktivitetsagenten i en andra, oberoende domarroll granskade kod som de inte själva implementerat. Huvudagenten hanterade viewport, desktopfönster, dialoger, integration och publicerad Chrome-granskning. Ett extra agentvarv rättade rit-, skriv- och kodvyer vid storleksändring.

Iteration 1 rättade dockans överlapp och små aktivitetsytor. Domarna identifierade sedan onåbara desktopikoner, ett överfullt aktivitetsfält och helskärm som gick förbi tangentbordshöjden. Dessa rättades innan browserkontrollen. Iteration 2 mätte den publicerade versionen och hittade en profilknapp på 40 px samt onödigt stort aktivitetsintro; de fick ett sista rättningsvarv.

## Viktigaste ändringarna

- Hemmets scrollport slutar ovanför dockan, med åtta px avstånd. Innehållet scrollar inte under knapparna. Safe-area hanteras separat för vänster och höger sida.
- Kompaktare hälsning, rang, informationskort och verkstadsintro; smala appmenyer har två kolumner och hemmet tre appkolumner.
- Långa texter, formulär, svar, uppställningar och väljare kan brytas eller följa tillgänglig bredd. Liggande pausdialoger kan rullas.
- Datorlägets appar ligger i ett vertikalt scrollbart rutnät på mobil. Aktivitetsfältet reserverar utrymme för öppna appar; saldon finns i startmenyn när chipsen döljs.
- Synlig viewporthöjd används när tangentbordet minskar arbetsytan. Nypzoom förändrar inte appens layoutstorlek. Helskärm använder samma höjd och safe areas.
- Robot, sköldpadda, Rita och Skriv ABC reagerar på storleksändring utan att starta om barnets aktivitet. Ritdata kopieras synkront, vilket undviker tomma mellanbilder vid snabba resize-händelser.

## Kontrollerade steg

1. **Hemskärm och docka – godkänd i mätta format.** Förebilden och den första Chrome-bilden visade ikoner bakom dockan. Efter rättning slutar scrollporten åtta px ovanför dockan i samtliga åtta mobilformat.
2. **Läsning och skrivande – godkänd i kontrollerade flöden.** Faktaläsaren håller bredden vid 320, 375, 390 och 430 px samt 568×320 och 844×390. Ett skrivet utkast var kvar efter höjdbyte till 320×360, och Spara gav bekräftelse.
3. **Uppställning och paus – godkänd i kontrollerade flöden.** Tabellen håller sig inom 320 px. Pausdialogen vid 568×320 hade överkant 16 och underkant 304, med rullbart innehåll. Den tidigare stora introduktionen komprimerades i sista varvet.
4. **Datorläge och appmenyer – godkänd i mätta format.** Alla 13 appmenyer håller 320 px utan sidledsöverflöde. Två öppna fönster gav innehållsbredd 320; aktivitetsfältet hade scrollWidth=clientWidth=320. Flera ytterligare öppna appar ligger i aktivitetsfältets egen horisontella lista.
5. **Kodning och skapande – godkänd i de kontroller som gjorts.** Robotbanan ligger inom bredden efter 320×568 → 568×320 → 390×844 och behåller samma bana. Skriv ABC och Skaparstudion kontrollerades också utan sidledsöverflöde. Bevarat ritinnehåll/program vid resize täcks dessutom av fyra fokuserade DOM/canvas-regressionsprov.
6. **Helskärm – godkänd vid ändrad synlig höjd i Chrome.** Vid 320×360 var fullskärmsappens höjd 360 och innehållsbredden 320. Detta ersätter inte ett test med riktigt iOS-tangentbord.

## Skärmstorlekar och bevis

Hem: 320×568, 375×667, 390×844, 430×932, 568×320, 667×375, 844×390, 932×430 samt desktop 1280×800.

Datorläge: 320×568, 390×844, 568×320, 844×390 och 1280×800.

Mätdata: [measurements.json](audit-mobile-2026-10-15/measurements.json). De breda matriserna gäller version `cf325ac`. Sista justeringarna i `c9cf477` kontrolleras separat nedan.

- [Hem före](audit-mobile-2026-10-15/01-home-before.jpg)
- [Läsning före, 320 px](audit-mobile-2026-10-15/02-reading-before-320.jpg)
- [Hem efter, 390 px](audit-mobile-2026-10-15/03-home-after-390.jpg)
- [Uppställning efter, 320 px](audit-mobile-2026-10-15/04-column-after-320.jpg)
- [Datorläge efter, 320 px](audit-mobile-2026-10-15/05-desktop-phone-after-320.jpg)
- [Robotbana efter, 390 px](audit-mobile-2026-10-15/06-robot-after-390.jpg)

Samtliga accepterade skärmbilder öppnades och granskades från de sparade filerna. Publicerad Chrome gav inga fångade error/warn i detta pass. Alla 480 enhets- och DOM-tester passerar; produktionsbygge och diffkontroll passerar.

## Gränser för resultatet

Kontrollerna gjordes via användarens anslutna Chrome på `https://kids.kevinmarquez.se/`, med viewportinställningar. Lokal filvisning var tidigare blockerad av browserpolicyn; ingen lokal server, alternativ browser eller annan kringgång användes för att återskapa den blockerade åtkomsten.

Detta är inte bevis för alla tänkbara tillstånd i alla övningar eller full WCAG-överensstämmelse. Fysisk iPhone/Safari med dynamiskt adressfält, verkligt tangentbord och panorering, skärmutskärningar, 200 % text och finger/penna/palmavvisning är inte verifierade i denna körning. Domarnas slutgranskning hittade inga konkreta kvarvarande blockerare i den dokumenterade evidensen efter rättningen av profilknappen.

## Slutkontroll av c9cf477

Vercels publiceringsstatus var success före kontrollen. Sista profilknapp- och introjusteringarna verifierades på den publicerade sidan:

- 320×480: tre ikonkolumner, profilknapp 44×44, sidbredd 320, scrollslut 386 och dockstart 394.
- 568×320: fem ikonkolumner, profilknapp 133,47×44, sidbredd 568, scrollslut 246 och dockstart 254.
- 390×844: profilknapp 44×44, sidbredd 390, scrollslut 750 och dockstart 758.
- Faktaläsaren vid 320×568: innehållsbredd 320 och kompakt introduktionskort cirka 211 px högt.

Slutmätningarna finns i [final-checks.json](audit-mobile-2026-10-15/final-checks.json). [Läsövningen efter sista varvet](audit-mobile-2026-10-15/07-reading-final-320.jpg) visar de mindre marginalerna och tryckknapparna. En första efterbild av hemmet som fångade pågående ikonanimation underkändes och ersattes med en stabil bild.

Sista appraden nåddes via tangentbordsfokus vid 390×844: sista appens underkant cirka 718, scrollportens underkant 750 och dockstart 758. [Sista appraden utan docköverlapp](audit-mobile-2026-10-15/08-home-last-row-after.jpg). Slutligen återställdes testprofilens Tablet-läge och Chromes tillfälliga viewportinställning togs bort; ordinarie profiler ändrades inte.
