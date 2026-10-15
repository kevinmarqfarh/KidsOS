# Byggvärlden – verifiering 2026-10-15

Byggvärlden är en egen lokal isometrisk byggleksak med 10 × 10 rutor, fyra byggnivåer, tio materialtyper, 125 fria startdelar, tre byggskisser och sex frivilliga byggidéer. Den finns efter Lekstaden och nås även från Lekstadens meny. Inga externa spelare eller verkliga köp ingår.

## Automatiskt

- 504/504 tester i hela appen passerade efter sista kodändringen.
- 11 modelltester, 9 DOM-tester och 2 särskilda integrationstester täcker byggdelar, skisser, kollisioner, lager, köp, gamla köpknappar, paus, återkomst, säkerhetskopia och profilisolering.
- Alla 12 kursapparnas ID:n verifieras genom den gemensamma belöningsmodellen. Kreativa stjärnbelöningar använder också den gemensamma plånboken. Detta är inte en manuell genomgång av samtliga kursaktiviteter.
- Produktionsbygge och kontroll av ändringarnas whitespace passerade.

## Riktigt Chrome-flöde på publicerad app

Testprofil WCAG-test startade med 0 mynt. Gratisbyggskissen Lilla huset placerade 15 delar. Ett tak togs bort och återställdes med Ångra. En verklig Plus & minus-omgång med sex synliga frågor gav 13 mynt, och två nya troféer gav ytterligare 10. Belöningskortets knapp öppnade Byggvärlden med 23 mynt. Ett stenblock kostade 5; saldot blev exakt 18. Lagerantalet ökade och delen kunde placeras. Efter Spara och omladdning fanns huset, stenen och 18 mynt kvar.

Även tangentbordsförflyttning, kollision, paus/fortsätt, Lekstadens direktlänk, köp med otillräckligt saldo och synlig placeringsåterkoppling provades. Under slutkontrollen placerades ytterligare en sten. Inga varningar eller fel registrerades i den fångade webbläsarloggen.

## Skärmar och bildgranskning

| Fönster | Innehållsbredd / scrollbredd | Resultat |
| --- | --- | --- |
| 320 × 568 | 296 / 296 | Ön kvar vid byggning; synligt tangentbordsfokus och status |
| 390 × 844 | 366 / 366 | Primära kontroller direkt under ön |
| 430 × 932 | 406 / 406 | Material och byggknappar ryms |
| 568 × 320 | 544 / 544 | Två kolumner hindrar ön från att täcka kontroller |
| 1000 × 400 | 976 / 976 | Canvas 428,57 × 299,99 bibehåller 10:7, utan felaktig träffyta |
| 1280 × 800 | 1040 / 1040 | Två kolumner och synlig värld bredvid kontroller |

Slutbilder finns i `audit-build-world-2026-10-15/release-*.jpg`. Äldre bilder i samma mapp visar tidigare granskningsvarv. Två oberoende domare fann inga kvarvarande konkreta blockerare i kontrollerad slutkod och slutbilder. Fixade fynd omfattar köpbekräftelse, fokus, synlig återkoppling, lagringsvarning, korta fönster och liggande mobil.

## Praktiska gränser

Chrome med ändrad fönsterstorlek är inte fysisk Safari- eller pennprovning. VoiceOver, faktisk touchpenna och observation av barn i olika åldrar återstår. Ingen universell 10/10-bedömning, full WCAG-certifiering eller pedagogisk effekt kan fastställas med denna granskning. Värld och saldo sparas per lokal profil och följer säkerhetskopian; de synkas inte automatiskt mellan enheter.
