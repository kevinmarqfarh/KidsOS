# Lärande som öppnar Lekstaden

## Inspiration undersökt 9 oktober 2026

[Toca Bocas officiella World-sida](https://www.tocaboca.com/toca-boca-world) presenterar egna berättelser, en världskarta, Character Creator och Home Designer. Sidans bildbeskrivningar visar en rumsvy med inredningsmeny och en figurvy. Bildfilerna kunde inte hämtas av granskningsverktyget; nedanstående förslag bygger på dessa officiella beskrivningar och hjälptext, inte på en påstådd granskning av varje bildpixel.

Huvudagenten granskade även skärmbilder i [Tocas officiella artikel om dekorationsmenyn](https://tocaboca.helpshift.com/hc/en/3-toca-boca-world/faq/138-what-s-new-in-the-home-designer-decoration-menu/?s=general). Där syns kategorilista, varma mint- och beigeinteriörer, golvperspektiv samt möbelikoner med mörka konturer. Det stöder ett tydligt rum med synlig golvyta, egen mjuk färgpalett och lättidentifierade föremål.

Sex konkreta tillämpningar för KidsOS:

1. Låt rummet vara huvudscenen och föremålen en visuell meny under den. Home Designer visas med en meny full av hushållsföremål på den officiella sidan.
2. Ge figurer egna redigerbara utseenden och låt dem bo i rummet. Den officiella sidan beskriver båda skapandeverktygen som centrala.
3. Samla figur, kläder och inredning nära varandra. [Den officiella Outfit Designer-hjälpen](https://tocaboca.helpshift.com/hc/en/3-toca-boca-world/faq/241-introducing-outfit-designer-your-new-tool-to-style-outfits/) beskriver skaparmenyn inne i huset.
4. Visa tydliga kategorier för blandning av kläder och accessoarer. Samma hjälp beskriver kategorier och att kombinera delar; KidsOS kan använda egna former, färger och tillbehör.
5. Erbjud startföremål direkt och sparade skapelser som barnet återkommer till. Hjälpen beskriver startdelar och sparande när barnet lämnar skaparen.
6. Ge teman som stöder barnets egna berättelser: djurklinik, forskarlabb, café och rymdrum. Den officiella World-sidan beskriver flera vardags- och fantasiroller; KidsOS-temana är egna förslag med koppling till kurser.

[Officiell butikshjälp](https://tocaboca.helpshift.com/hc/en/3-toca-boca-world/faq/135-what-type-of-content-is-available-for-purchase-on-toca-boca-world/?l=en&p=web) beskriver betalda hus-, möbel- och stilpaket. KidsOS lärandemynt är vår egen mekanik: vi hävdar inte att Toca ger valuta för kursmoduler. Inga bilder, figurer eller varumärkesdelar från Toca används som speltillgångar.

## Belöningsregler

- Befintliga stjärnor ger ett mynt var.
- Första fullföljda frågerundan i en modul ger fem extra mynt. Nästa fullföljda runda i samma modul ger två extra mynt.
- Fullföljandemynten kräver ingen perfekt prestation. Barn som behöver flera försök får samma extra belöning.
- Rundans befintliga bonusstjärnor ger ytterligare ett eller två mynt. Svarets stjärnor och trofémynt visas separat från fullföljandebonusen.
- Varje ny trofé ger fortsatt fem mynt.
- Lärandepaket kan kopplas till sparad modulstatistik: minst en fullföljd runda i aktuell modul. Inga betalda genvägar, tidskrav eller förlorade mynt vid misstag.
- En öppnad faktasida är inget genomfört kursmoment. En fri lekhandling ska inte generera obegränsat med mynt.
- Mynten gäller bara i den lokala appen. Ingen koppling till riktiga pengar, annonser, brådskande erbjudanden eller köpkrav.

`recordRound` anropas en gång vid avslutad frågerunda och returnerar `moduleCoins` samt `coinsEarned` (fullföljandemynt plus rundans bonusstjärnemynt). Detta omfattar inte tidigare svar eller troféer. Kärnan signalerar `coins` när lärandebelöningar ändrar saldot, så öppna lekrum kan uppdateras direkt.

Köp använder atomisk betalning: ogiltiga eller negativa priser och köp utan täckning ändrar aldrig saldot. Barnets föremål är återanvändbara; att flytta eller ta bort dem i ett rum ska inte förbruka ägandet.
