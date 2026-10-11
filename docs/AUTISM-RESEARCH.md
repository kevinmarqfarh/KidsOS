# Autism och tillgänglighet i KidsOS

Fördjupningen finns i [AUTISM-KRAV-OCH-EVIDENS.md](AUTISM-KRAV-OCH-EVIDENS.md):
48 spårbara kriterier, forskningsbegränsningar, konkreta kodfynd och plan för
teknisk verifiering och utvärdering med barn. Det dokumentet är det aktuella
kravunderlaget; texten nedan beskriver den första researchen och implementationen.

Researchdatum: 11 oktober 2026. Underlag för produktutveckling med implementationsstatus nedan; ingen klinisk utvärdering. Avser KidsOS för barn 4–12 år.

Historisk implementationsstatus före slutgenomgången: individuella ljudval, manuell uppläsning,
mindre rörelse, val för belöningsanimationer, rundlängd och samma frågenivå under
rundan finns nu i appen. Frågeövningarna har progressinformation och paus som
behåller uppgiften under den öppna sessionen. Övriga förslag nedan återstår.
Mindre rörelse omfattar gränssnittet, firandet och planetbanorna; pedagogiska
demonstrationer och experiment kan fortfarande innehålla rörelse.

## Rekommenderad riktning

Bygg individuella stöd för kommunikation, förutsägbarhet och sinnesintryck i hela appen. Ett enda ”autismläge” riskerar att samla behov som skiljer sig mycket mellan barn. Anpassningarna bör kunna användas utan att registrera en diagnos. Autism Sverige beskriver betydelsen av individuellt anpassad pedagogik, miljö och kommunikationsstöd. [Autism Sverige](https://www.autism.se/om-autism/autism/)

Detta är en produktrekommendation utifrån källorna. Källorna validerar inte KidsOS eller ett bestämt gränssnitt.

## Vad underlaget stöder

| Område | Källstöd | Tillämpning att pröva i KidsOS |
|---|---|---|
| Visuell struktur | SPSM beskriver hur bilder, föremål och text kan göra aktiviteter mer begripliga och förutsägbara. | Visa ”Nu → Sedan → Klar”, vad barnet ska göra och hur aktiviteten slutar. |
| Individuellt bildstöd | SPSM betonar att abstraktionsnivå och barnets förståelse behöver styra stödet. | Välj foto, illustration eller text utifrån barnet; använd inte enbart emoji som instruktion. |
| Kommunikation | SPSM beskriver kommunikationskartor och andra visuella stöd. | Gör ”Hjälp”, ”Paus”, ”Stopp” och ”Visa igen” tydliga och tillgängliga. |
| Fokus | W3C:s kompletterande vägledning rekommenderar att minska distraktioner och hjälpa användaren hitta tillbaka. | Erbjud en förenklad vy, stabil navigation och möjlighet att dölja dekorativa inslag. |
| Digitala insatser | En forskningsöversikt visar lovande men varierande resultat. | Testa konkreta aktiviteter och vardagsnytta; dra inte slutsatser om behandling från appresultat. |

Källor: [SPSM, visuellt stöd i förskolan](https://www.spsm.se/studiepaket-npf/studiepaket-npf-forskola/tydliggorande-pedagogik-i-forskolan/moment-3--visuellt-stod-i-forskolan/), [SPSM, kommunikation i förskoleklass](https://www.spsm.se/stod-och-rad/fraga-en-radgivare/fragor-och-svar/hur-kan-vi-stotta-en-elev-med-autism-i-forskoleklass-som-har-svart-att-kommunicera/), [W3C, hjälp användaren fokusera](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o5-user-focus/).

Leung med flera (2021) inkluderade tio randomiserade studier: sex rapporterade signifikanta interventionseffekter och två blandade resultat. Studierna skilde sig i deltagare och insatser. Översikten sökte studier till mars 2019 och är därför inte en aktuell totalöversikt. Resultaten ger inte stöd för att alla autismappar fungerar eller för att KidsOS förbättrar sociala färdigheter. Översikten pekar på praktiska uppgifter och vardagsnära material som lovande utgångspunkter. [Forskningsöversikten](https://mental.jmir.org/2021/9/e20892/)

## Befintligt stöd och utvecklingsbehov

Den inledande kodgenomgången hittade ingen separat autismmodul. Följande observationer beskriver utgångsläget före implementationen ovan, inte en genomförd användarstudie:

- `src/ui/settings.js` har val för ljudeffekter och uppläsningstakt. `src/core/model.js` lagrar dessa som gemensamma inställningar. Individuella ljudval per barn bör undersökas.
- `src/core/model.js` stöder låst nivå per ämne. Det är en användbar grund för förutsägbara övningar.
- `src/core/age.js` styr rundlängd utifrån ålder. Valbar längd efter ork och behov är ett separat utvecklingsförslag.
- `src/styles/app.css` respekterar systemets `prefers-reduced-motion`. Det ersätter inte ett tydligt val inne i appen och behöver kompletteras med kontroll av rörelser som skapas i JavaScript.
- `src/core/sound.js` innehåller bland annat fanfar, ljud vid rätt/fel och ljudeffekter. `docs/RESEARCH.md` beskriver konfetti och skakning vid felsvar. Ett lugnare alternativ behöver täcka återkoppling och belöningar, inte bara bakgrunden.
- Stora tryckytor, bildmaterial och uppläsning är befintliga resurser. Läsförmåga, motorik och stödbehov bör kunna anpassas oberoende av ålder.

## Föreslagen första version

Prioriteringen nedan är produktbedömning, inte en rangordning från en klinisk studie.

1. **Individuella sinnesval.** Spara ljud, automatisk uppläsning, dekorativa rörelser och belöningsanimationer per profil. Behåll tydlig statisk återkoppling när effekter stängs av.
2. **Förutsägbara rundor.** Låt barnet och den vuxne välja en kort runda. Visa exempelvis ”Tre uppgifter → Klar”. Byt svårighet vid rundans slut när detta val används.
3. **Paus och återgång.** En lättåtkomlig pausknapp ska stoppa tal och effekter samt bevara uppgiften. Återgången ska visa samma uppgift utan överraskande ljud.
4. **Tydliga instruktioner.** Ett konkret steg åt gången, konsekventa knappar och en frivillig demonstration. Barnet styr när nästa steg visas.
5. **Förenklad hemskärm.** Erbjud ett mindre antal val och stabila placeringar. Låt barnet behålla tillgång till intressen och fri lek.

Förslag på inställningsrubrik: ”Mitt stöd”. Använd begripliga val som ”Mindre rörelse”, ”Läs när jag trycker” och ”Kort runda”. Undvik att göra diagnos till ett krav för stöd.

## Möjlig vardagsdel i nästa steg

- **Min ordning:** en enkel sekvens för en konkret aktivitet, exempelvis tvätta händerna. Visa ett steg i taget och möjliggör samma bildstöd utanför appen.
- **Nu och sedan:** två tydliga aktivitetskort med möjlighet att förbereda en förändring.
- **Jag behöver:** ett litet urval kommunikationskort för hjälp, paus och stopp. Innehåll och symboler måste väljas tillsammans med barnet och dess stödpersoner; detta är inte en ersättning för ett etablerat AKK-system.
- **För vuxna:** kort information om individuella anpassningar och vägar till stöd. Länka till [1177 om autism](https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/autism/).

Dessa funktioner är hypoteser för fortsatt utveckling. Undvik att poängsätta känslor, ögonkontakt eller hur ”normalt” barnet beter sig. En känslofunktion bör låta barnet uttrycka sin upplevelse, inte kräva ett enda rätt svar.

## Hur vi bör utvärdera

Genomför små, frivilliga användartester med barn som har olika kommunikationssätt och stödbehov, tillsammans med vårdnadshavare och specialpedagogisk kompetens. Involvera autistiska personer i utformningen. Barnet ska kunna avbryta när som helst.

Pröva först om barnet förstår nästa steg, kan be om hjälp, kan pausa och hittar tillbaka. Observera behov av vuxenstöd och barnets egen upplevelse av ljud och rörelse. Tolka inte fler klick, fler rätt eller längre skärmtid som mindre stress eller bättre välbefinnande.

Om vardagsöverföring är målet behöver samma aktivitet också följas upp utanför appen. Användartestning kan ge stöd för användbarhet; påståenden om behandlingseffekt kräver en annan typ av studie.

## Avgränsning och nästa research

Detta är en riktad genomgång av svenska stödmaterial, tillgänglighetsvägledning och en relevant forskningsöversikt, inte en systematisk litteraturöversikt. Nästa steg bör vara att precisera målgruppen och söka nyare studier om just visuella aktivitetssekvenser, kommunikationsstöd och vardagsöverföring för barn 4–12 år. Evidens från VR, vuxna eller föräldrautbildning bör inte automatiskt överföras till en lärapp för yngre barn.
