# Forskningsunderlag och designbeslut

Det här dokumentet samlar det underlag som KidsOS bygger på: hur barn använder pekskärmar, vad som gör en app verkligen lärande, hur belöningar kan användas utan att döda nyfikenheten, och hur innehållet kopplas till Skolverkets läroplan. Varje avsnitt slutar med de konkreta beslut som togs i koden.

## 1. Barn och pekskärmar

### Vad forskningen säger

**Tryckytornas storlek.** Nielsen Norman Group rekommenderar minst 1 × 1 cm för interaktiva element. Fingertoppar är 1,6–2 cm breda och tummens kontaktyta ungefär 2,5 cm. Barn behöver större ytor än vuxna eftersom finmotoriken fortfarande utvecklas. Apples Human Interface Guidelines anger 44 × 44 punkter som minsta tryckyta.

**Barn missar oftare – och mest på små mål.** I MTAGIC-projektet (Anthony m.fl., *International Journal of Human-Computer Studies*, 2019) testades 116 barn och 60 vuxna i sex studier:

- Barn missar fler mål än vuxna i alla storlekar. Träffsäkerheten ökar konsekvent med målets storlek. Barns små fingrar kompenserar inte – orsaken är motoriken.
- **Holdovers** – oavsiktliga upprepade tryck – förekom hos nästan alla och var vanligast hos barn. På surfplattor stod de för nästan 10 % av alla tryck.
- På surfplattor missade barnen oftast mål **uppe till vänster**. På mobiler missades mål uppe i mitten och till vänster.
- Barn "glider" med fingret under trycket så att det hamnar utanför målet innan det registreras.
- Gestigenkänning (rita bokstäver, former) var sämst för 5–6-åringar: cirka 66 % igenkänning, mot över 91 % för barn över 10 år. Forskarna rekommenderar förlåtande, åldersanpassad bedömning.
- Tidigare forskning visar att barn har svårt med nyp- och rotationsgester.
- Rekommendationer: större aktiva ytor än det synliga, filtrera bort holdovers med tid och plats, tydlig visuell återkoppling, placera kontroller nära barnet, undvik små mål vid skärmkanterna.

### Beslut i KidsOS

| Forskningsfynd | Så löste vi det |
|---|---|
| Minst 1 cm / 44 pt | Alla knappar ≥ 56 pt (≈ 1,1 cm på iPad 9,7"), svarsknappar ≥ 88 pt, appikoner 80–116 pt. Ett automatiskt test underkänner allt under 44 pt. |
| Holdovers | Varje knapp ignorerar ett nytt tryck inom 350 ms (`onTap` i `src/ui/dom.js`). Snabbare för sifferknappar (120 ms) och korgar vid sortering. |
| Fingret glider utanför | Svarsknapparna har en osynlig marginal på 7 px (`.choice::after`). Sorteringskorgar tar emot släpp 16 px utanför kanten. Tryck i bilder letar upp närmaste träffyta inom 48 px. |
| Missar uppe till vänster | Alla svar och primära knappar ligger i nedre halvan (tumzonen). Hemknappen uppe till vänster är 64 × 60 pt. |
| Svårt med nyp/rotation | Inga nyp- eller rotationsgester. Dubbeltrycks-zoom och nyp-zoom är avstängda. Bara tryck och enkel dragning används, och allt som går att dra går också att trycka (tryck på sak → tryck på korg). |
| Svag gestigenkänning hos 5-åringar | Bokstavsspårningen bedöms med tolerans per nivå (11 % av rutan för de minsta, 6,5 % för de största). Den jämför täckning och precision i stället för exakt form, och har ett klotterskydd. Missade delar markeras orange så att barnet ser vad som fattas. |
| Tydlig återkoppling | Varje tryck ger en fysisk "knapptryckning" (3D-knappar som trycks ned), ett ljud och färg. Rätt svar studsar, fel svar skakar. |

### Skärmen: iPad 9,7" och mobil

En iPad 9,7" har 768 × 1024 punkter i stående läge (2 048 × 1 536 pixlar, 264 ppi). Layouten är byggd för den storleken och skalar ner till mobiler (390 pt breda) och upp till liggande läge (1024 pt). I liggande läge på iPad visas frågebild och svar sida vid sida. Ett test går igenom varje modul i både mobil- och liggande iPad-läge och underkänner allt som ger sidledsscroll.

## 2. Vad gör en app lärande?

Hirsh-Pasek m.fl. (*Psychological Science in the Public Interest*, 2015) beskriver fyra pelare för lärande appar:

1. **Aktivt engagemang ("minds-on")** – barnet ska tänka och bearbeta, inte bara trycka. Ett navigationspussel slår ett arkadspel.
2. **Engagemang i lärandet** – inga distraktioner. Ljud, rörelser och sidospel som inte hör till lärmålet stör.
3. **Meningsfullhet** – koppla till barnets vardag och det barnet redan kan.
4. **Social interaktion** – uppmana till samtal med föräldrar och kompisar.

Appar bör ha tydliga lärmål och stödja utforskande, frågande och upptäckande.

### Beslut i KidsOS

- **Minds-on överallt:** programmering i stället för att trycka på saker som rör sig. Experiment där barnet *gissar först* (hypotes) och sedan testar. Klockan ställs genom att dra i visaren, och timvisaren följer med som på en riktig klocka.
- **Inga distraktioner:** inga reklamer, inga tidtagarur, inga animationer som pågår medan barnet tänker. Konfetti visas bara när en uppgift är klar.
- **Meningsfullhet:** Göteborg finns med i Dag & natt och i dagsljusdiagrammet. Svenska arter (ekorre, igelkott, blåbär), källsortering med pant, svenska tidsuttryck ("kvart i tre") och barnets eget namn i skrivövningen.
- **Socialt:** Undra-korten slutar med "Fundera vidare" och uppmanar barnet att gissa högt eller berätta för någon. Berättelserna avslutas med "Kan du berätta den för någon?".
- **Lärande av fel:** efter två försök visas rätt svar med en förklaring. Ingen fråga lämnas utan ett "varför".

## 3. Gamification utan att döda nyfikenheten

Belöningar kan både hjälpa och stjälpa. I MTAGIC-studien höjde poäng och små priser andelen barn som slutförde uppgifterna från 73 % till 97 %. Men forskning om *överjustifiering* (yttre belöningar som tränger undan inre motivation) och självbestämmandeteorin (SDT – behov av kompetens, självständighet och samhörighet) visar att belöningar ska bekräfta kompetens, inte vara själva målet.

### Beslut i KidsOS

- **Stjärnor bekräftar kompetens:** en stjärna för rätt på första försöket och bonus för avslutad runda. Inga stjärnor dras någonsin av.
- **Inga straff eller förluster:** "Dagar i rad" visar bara bästa svit. Troféer går inte att förlora. Fel svar ger tips, inte minuspoäng.
- **Troféer som belönar beteenden vi vill ha:** "Ger aldrig upp" (försöka igen efter fel), "Gissningsgeni" (gissa innan man testar), "Nyfiken själ" (utforska frågor), "Upptäcktsresande" (prova alla appar).
- **Samlingar som väcker nyfikenhet:** artkort, planeter och stjärnbilder visas som frågetecken tills de upptäcks.
- **Självständighet:** barnet väljer själv app och modul. Låsta moduler syns (med vilken nivå som behövs) så att barnet ser vart det är på väg.
- **Kompetens – zonen för närmaste utveckling:** nivån anpassas automatiskt. Fem rätt i rad på första försöket ger en svårare nivå, tre missar i rad en lättare. Föräldern kan låsa nivån.
- **Skärmtid:** valfri daglig gräns. När tiden är slut visas en vänlig paus med förslag på aktiviteter utan skärm.

## 4. Språklig medvetenhet före läsning

För 5–7-åringar bygger Svenska-appen på samma progression som Bornholmsmodellen (Lundberg) och förskoleklassens språklekar. Ingvar Lundberg beskriver fyra grunder för god läsning: språklig medvetenhet, bokstavskunskap, ordförråd och motivation. Ordningen i appen är:

1. Lyssna och rimma
2. Stavelser (klappa på trumman)
3. Första ljudet i ord
4. Bokstav ↔ ljud ↔ bild
5. Bygga ord av bokstäver (ljudning)
6. Läsa ord och korta texter med frågor om innehållet

Allt i de första stegen fungerar utan att barnet kan läsa. Frågorna läses upp och svaren är bilder.

## 5. Läroplanen – Lgr22

Innehållet följer det centrala innehållet i Skolverkets Lgr22 för årskurs 1–3 och kapitel 2 för förskoleklassen. Varje modul i koden har en `lgr`-lista som pekar på citat i `src/core/curriculum.js`. Föräldrarapporten visar vilka områden barnet har övat.

Ett exempel: i matematik för årskurs 1–3 finns *"Hur entydiga stegvisa instruktioner kan konstrueras, beskrivas och följas som grund för programmering"*. I teknik finns *"Föremål i elevernas vardag som styrs med hjälp av programmering"*. Kod-appen täcker båda.

En 5-åring går i förskolan (Lpfö 18) eller förskoleklassen beroende på födelsedag. KidsOS behandlar 4–5 år som en egen nivå där allt kan göras med ljud och bild.

Se [`LARANDE.md`](LARANDE.md) för hela kopplingen modul för modul.

## Källor

- Nielsen Norman Group – [Touch Targets on Touchscreens](https://www.nngroup.com/articles/touch-target-size/)
- Anthony, L. m.fl. (2019). *Designing smarter touch-based interfaces for educational contexts* (MTAGIC). [Preprint, University of Florida](https://init.cise.ufl.edu/wp-content/uploads/sites/378/2019/03/anthony-et-al-IJHCS2019-MTAGIC-final-preprint.pdf)
- Hirsh-Pasek, K. m.fl. (2015). *Putting Education in "Educational" Apps: Lessons From the Science of Learning*. [Association for Psychological Science](https://www.psychologicalscience.org/publications/educational-apps.html)
- Skolverket – Lgr22, centralt innehåll i svenska för årskurs 1–3 ([sammanställning, Uppsala universitet](https://uu.se/download/18.40583c018b38063b4a5b1/1697461879395/32022centraltinnehall.pdf))
- Lgr22 NO årskurs 1–3, fördelat per år ([Vattholmaskolan, Uppsala](https://vattholmaskolan.uppsala.se/globalassets/__grundskola/skyttorp-skola/dokument/no-rod-trad.pdf))
- Lgr22 biologi och förskoleklass ([Kreativum](https://kreativum.se/wp-content/uploads/2025/12/Laroplan-ak-1-3-1.pdf), [förskoleklass](https://kreativum.se/wp-content/uploads/2025/12/Laroplan-forskoleklass-1.pdf))
- Lgr22 matematik årskurs 1–3 ([Studentlitteratur, matris](https://www.studentlitteratur.se/globalassets/serier/laromedel/favorit-matematik/favorit_matris_1-3_lgr22_2021.pdf)) och förändringar mot Lgr11 ([Sanoma Utbildning](https://www.sanomautbildning.se/49c96b/globalassets/forskola-ak-6/koll-pa-matematik-f-3/pdfer/lgr22/kpm_lgr22.pdf))
- Lgr22 teknik och programmering ([Linköpings universitet, CETIS](https://liu.se/dfsmedia/dd35e243dfb7406993c1815aaf88a675/48164-source/options/download/cetis-jamforelse-mellan-kursplaner-lgr11-lgr22), [Kreativum Robothumlor](https://kreativum.se/wp-content/uploads/2023/08/Laroplansanknytning-Robothumlor-F-1-lgr22.pdf))
- Bornholmsmodellen ([Uppsävjaskolan, Uppsala](https://uppsavjaskolan.uppsala.se/globalassets/__grundskola/uppsavjaskolan/dokument/bornholmsmodellen1.pdf)); Lundberg, I. (2007). *Bornholmsmodellen*. Natur & Kultur.
