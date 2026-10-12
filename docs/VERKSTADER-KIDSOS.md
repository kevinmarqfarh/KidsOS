# Interaktiva verkstäder i KidsOS

Implementerat 2026-10-12. Åtta nya moduler använder sex gemensamma aktivitetstyper. Det här genomför de sex huvudidéerna från inspirationssammanställningen med egna uppgifter och befintligt KidsOS-bildspråk. Övriga förslag i Skolplus-kartläggningen är fortsatt framtida alternativ.

## Var aktiviteterna finns

| App | Modul | Funktion |
|---|---|---|
| Matte | Parverkstaden | Matcha tal och antal. Två, fyra eller sex par, valbart synliga/dolda kort. |
| Svenska | Bokstavspar | Matcha stora och små bokstäver med samma motor. |
| Biologi | Naturens par | Matcha lokalt inbäddade naturfoton och namn. Bildkällor/licenser följer med. |
| Matte | Talverkstaden | Bygg måltal, lägg till/ta bort ental och tiotal, växla åt båda håll. |
| Matte | Bråkköket | Dela samma hela portion i två/fyra/åtta lika stora delar och jämför likvärdiga bråk. |
| Svenska | Berättelseateljén | Tre delar, valbara person/plats/händelse, egen text och egna sparade teckningar. |
| Svenska | Ordscenen | Bygg meningar med tre delar via knappar eller frivillig dragning. Alla 27 avsedda kombinationer accepteras. |
| Världen | Min kartresa | Tre stegvisa uppdrag med karta, symbolförklaring och riktningsknappar; även angränsande rutor går att trycka på. |

Bråkköket och Ordscenen börjar på nivå 2. Förälderns befintliga nivå- och modulinställningar gäller. Övriga finns från nivå 1. Parens storlek går att välja direkt; Talverkstadens första mål anpassas efter pedagogisk nivå. Detta är introduktionsaktiviteter, inte fullständiga kurser för varje ålder.

## Finger, touchpenna och tangentbord

Alla kärnfunktioner går att använda med vanliga knappar, reglage eller skrivfält. Ordscenen erbjuder dessutom valbar dragning med Pointer Events, utan tryckkänslighetskrav. Bara den aktiva pekarens rörelser påverkar draget; sekundära pekare och avbrutna drag gör ingen ändring. Ett efterföljande klick får inte lägga till samma ord igen. Dragning är bara aktiv på ordkorten när barnet uttryckligen valt det; övriga ytor ska kunna scrollas.

Kontroller har normalt minst 56 px höjd. Kartans fem kolumner delar tillgänglig bredd och har 64 px höga knappar. Exakt layout och träffytor behöver kontrolleras i renderad version. De nya pointer-testerna är simulerade DOM-händelser, inte bevis på faktisk Apple Pencil, palmavvisning eller andra pennmodeller.

## Individuellt stöd

- Befintlig Hjälp/Paus följer med samtliga nya vyer, med aktiviteterna bevarade under paus.
- Profilens förhandsvisning visar en plan före start. Uppläsningen följer befintliga talinställningar.
- Matchningskorten är synliga som standard. Barnet kan välja minnesläge eller visa korten igen.
- Kortplatserna ändras inte efter försök. Efter två olika kort väntar aktiviteten på Prova igen.
- Inga nedräkningar, snabbhetskrav, automatisk borttagning av stöd eller förlust av tidigare belöningar.
- Text visar vald mängd, karta/position och nästa uppdrag; respons anges i en statusregion.
- Skapande berättelser betygsätts inte. Övningsmål ger en engångsbelöning per identifierat mål, utan återkommande stjärnfarmning eller automatisk fanfar.

Detta är stödval som behöver individanpassas. Det är ingen klinisk validering eller garanti att aktiviteterna passar varje barn med autism.

## Sparning

Berättelsens text och val sparas vid ändring per profil. Egna teckningar kopplas med bild-id, utan att duplicera bilddata. Berättelsen följer med säkerhetskopian och tas bort tillsammans med profilens övriga material. Om en sparning misslyckas finns den aktuella datan i sessionens minnesreserv; Spara-knappen beskriver detta i sin respons.

## Verifiering och gränser

Modeller för talväxling, bråklikhet, ordföljd och kartsteg testas separat. DOM-tester kontrollerar hela matchningar, fel/försök igen, belöningsdeduplicering, talbygge, likvärdiga bråk, berättelsesparning, val av teckning, kartresan, paus/förhandsplan samt pointercancel och exakt en placering med simulerad penna/finger.

Alla appmoduler omfattas även av det befintliga öppnings-/stängningstestet. Bygget genererar de två fristående distributionsfilerna.

Nya verkstäder har ännu inte publicerats och därför inte visuellt testats på den publicerade KidsOS-adressen. Testa dem efter publicering i Chrome och Safari, på riktig iPad med finger/touchpenna, och med tangentbord, VoiceOver, förstoring och berörda barn/vuxna. Full WCAG 2.2 AA anges inte.
