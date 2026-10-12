# KidsOS

**Ett lärande "operativsystem" för barn 4–12 år – byggt för iPad och mobil.**

KidsOS ser ut och känns som ett eget operativsystem: varje barn har en egen profil på låsskärmen, en hemskärm med appar och en docka, och appar som öppnas i egna fönster. Varje app är ett ämne att fördjupa sig i. Allt är byggt för att väcka **nyfikenhet**, **kreativitet** och **lärande** – med grundläggande innehåll kopplat till Skolverkets läroplan (Lgr22) för förskoleklass och årskurs 1–3. AI och fördjupad kodning kompletterar dessa färdigheter.

| Hemskärm | Frågerunda | Robotbanan | Skriv ABC |
|---|---|---|---|
| ![Hemskärm](docs/screenshots/ipad-hemskarm.png) | ![Fråga](docs/screenshots/ipad-fraga.png) | ![Robot](docs/screenshots/ipad-robotbana.png) | ![Skriv ABC](docs/screenshots/ipad-skriv-abc.png) |

## Innehåll

| App | Vad barnet gör |
|---|---|
| 🔢 **Matte** | 17 moduler: räkna, störst/minst, mönster, former (2D och 3D), tiokompisar, plus/minus med tioramar, talföljder, klockan (läsa *och* ställa in visarna), hemliga talet (likhetstecknet), dubbelt/hälften, mäta med linjal, diagram, tiotal/ental med tiobasmaterial, gånger/delat, chans (sannolikhet), vardagsproblem samt lika delar och bråk. |
| 📖 **Svenska** | Bokstavsljud, rimma, klappa stavelser på en trumma, första ljudet, stor/liten bokstav, bygga ord, läsa och välja bild, ABC-ordning, bygga meningar och skiljetecken, motsatser/synonymer, Ord i vardagen, Textens ledtrådar och 14 originalberättelser från lyssnande till läsning mellan raderna – med textstöd och förklaringar. |
| ✏️ **Skriv ABC** | Spåra stora och små bokstäver (alla 29), siffror, ord och *sitt eget namn* med fingret. Startpunkter, riktningspilar och en animerad "Visa hur". Bedömningen tål darriga barnhänder men inte klotter. |
| 🔬 **Vetenskap** | Experiment med arbetsgången Fråga → Gissa → Testa → Förklara: flyter/sjunker, magneten, ljus & skugga, vattnets former (smälta, koka, kondensera, frysa), gungbrädan (jämvikt), rutschkanan (friktion), blanda & separera (filtrera/avdunsta) och källsortering med pant. Resultaten sparas i ett protokoll. Tre övningar med 30 scenarier tränar observationer, krafter och att ta vara på saker. |
| 🌿 **Biologi** | Utforska kroppen (utsida och organ), "var är …?", sinnena, årstider, livscykler, 25 svenska artkort att samla, djurgrupper, näringskedjor och må bra (sömn, hygien, mat, vänner). |
| 🚀 **Rymden** | Ett levande solsystem att trycka på, bygg och räkna ner en raket, dag & natt i Göteborg, månens faser, planetordning, stjärnbilder att rita (med gamla berättelser), varför vi har årstider, och ett rymdquiz. |
| 🧠 **AI** | 10 lektioner och 42 scenarier om AI, data, modeller, faktakontroll, rättvisa, tydliga instruktioner och privatliv. Träna en enkel modell med riktiga djurfoton och testa på andra djur. |
| 🤖 **Kodning** | Sex lektioner och 30 frågor om instruktioner, felsökning, loopar, villkor, variabler och händelser/funktioner. Dessutom: 20 robotbanor i tre kapitel (pilar → sväng & kör → loopar), följ koden, programmerade saker i vardagen, och rita med kod (sköldpaddsgrafik). |
| 🌍 **Världen** | Världsdelar, djur, platser, Sverigekartan, väderstreck, historia, högtider och barns rättigheter. |
| 🏡 **Lekstaden** | Skaparstudio med 80 originalföremål, 10 rumsteman, 9 kursbundna paket, 50 berättelseidéer och egna redigerbara figurer. Kursövningar ger spelmynt; köp, inredning och figurer sparas per barn. Den tidigare leksaksstaden finns kvar. |
| 🎨 **Rita** | Penslar, stämplar, spegelpensel (symmetri), ångra och ett eget galleri – plus ritidéer som väcker fantasin. |
| 🤔 **Undra** | 40 stora frågor ("Varför är himlen blå?") där barnet gissar först, får ett svar och en följdfråga att fundera vidare på. En nivåanpassad fråga varje dag på hemskärmen. Nya kort har korta svar för yngre och fördjupning för äldre. |
| 🏆 **Troféer** | 54 troféer, titlar från "Nyfiken nybörjare" till "Universumets mästare" och samlingar (artkort, planeter, stjärnbilder, bokstäver). |
| ⚙️ **Inställningar** | Barnets egna val (figur, bakgrund, uppläsning) och en föräldradel bakom spärr: profiler, nivåer, skärmtid, synliga appar, föräldrakod, rapport mot läroplanen och säkerhetskopia. |

Hela kopplingen till läroplanen, modul för modul, finns i [docs/LARANDE.md](docs/LARANDE.md). Forskningen bakom designen finns i [docs/RESEARCH.md](docs/RESEARCH.md). Föräldraguiden finns i [docs/FORALDRAR.md](docs/FORALDRAR.md).

## Byggt för barn

**Individuellt stöd:** Under Inställningar → Mitt stöd finns personliga val för
ljudeffekter, mindre rörelse, belöningsanimationer, rundlängd, plan före rundan och
lugn återkoppling. Uppläsning kan väljas till ”När jag trycker” eller helt stängas
av. Frågeövningar och utforskande vyer har hjälp och paus. Skärmtidsgränsen
förbereds och behåller den öppna aktiviteten om en vuxen ger mer tid.
Se [föräldraguiden](docs/FORALDRAR.md) och [autismunderlaget](docs/AUTISM-RESEARCH.md).

- **Stora tryckytor:** allt är minst 56 punkter, svarsknappar 88 punkter. Testerna underkänner allt under 44.
- **Förlåtande touch:** dubbeltryck filtreras bort, knappar har en osynlig extra marginal och allt som kan dras kan också tryckas.
- **Uppläsning på svenska:** för barn upp till 7 år läses frågor, alternativ och förklaringar upp automatiskt. Äldre barn trycker på 🔊. På iPad används den inbyggda svenska rösten.
- **Anpassad nivå:** fem rätt i rad ger en svårare nivå, tre missar i rad en lättare.
- **Inga straff:** fel ger tips, efter två försök visas svaret med en förklaring. Stjärnor och troféer kan aldrig förloras.
- **Inga annonser. Profiler och framsteg sparas lokalt.** Bilder bäddas in och typsnitt hämtas inte från externa tjänster.

## Kom igång

Ingen installation behövs för barnen – KidsOS är en enda HTML-fil.

**På iPad eller mobil**
1. Öppna länken till den publicerade versionen i Safari.
2. Tryck på dela-knappen → **Lägg till på hemskärmen**. Då öppnas KidsOS i helskärm som en egen app.
3. Skapa en profil per barn (en vuxen gör det). Snabbstarten skapar tre syskon (5, 7 och 9 år) som du sedan kan byta namn på.

**Från datorn (samma wifi)**
```bash
npm install
npm run build
npm run serve     # skriver ut en adress, t.ex. http://192.168.1.20:8080, att öppna på iPaden
```

Framstegen sparas i webbläsaren på respektive enhet. Under Inställningar → Föräldrar → Säkerhetskopia kan du flytta framsteg mellan enheter.

## För utvecklare

```bash
npm install
npm run build      # bygger dist/index.html (fristående) och dist/artifact.html
npm run dev        # bygger om vid ändringar
npm test           # enhetstester + bygg + end-to-end-tester
npm run docs       # genererar docs/LARANDE.md från koden
```

End-to-end-testerna använder Chromium. Sätt `CHROME_PATH` om den inte hittas automatiskt.

### Struktur

```
src/
  main.js               start
  core/                 ren logik utan DOM (testbar i Node)
    model.js            profiler, nivåanpassning, rundor, dagar i rad, skärmtid
    trophies.js         troféer och framsteg
    progress.js         titlar
    age.js              nivåer och åldrar
    curriculum.js       Lgr22-citat
    storage.js          lagring med reservläge i minnet + säkerhetskopia
    speech.js, sound.js uppläsning och syntetiserade ljud
  apps/                 innehåll och frågegeneratorer per ämne
    math.js svenska.js letters.js science.js biology.js space.js code.js wonder.js draw.js
    registry.js         alla appar i hemskärmens ordning
  ui/
    shell.js            låsskärm, hemskärm, docka, fönster, föräldraspärr, paus
    quiz.js             frågemotorn (8 frågetyper)
    visuals.js          SVG-illustrationer som rena funktioner
    trophyroom.js settings.js
    views/              interaktiva vyer (spårning, robot, experiment, rymden …)
  styles/app.css
scripts/                build, serve, docs
tests/unit/             Node-tester (bl.a. tusentals genererade frågor per modul)
tests/e2e/              Playwright-tester med pekskärm på iPad- och mobilskärm
```

### Lägga till innehåll

**En ny frågemodul** är en funktion som får `(nivå 0–4, rng)` och returnerar en fråga:

```js
export function genMinModul(level, rng) {
  const a = rng.int(1, 5 + level * 5);
  return {
    type: 'choice',                 // choice | numpad | order | sort | build | tapcount | tap | clock
    prompt: `Vad är ${a} + 1?`,
    options: [{ id: String(a + 1), label: String(a + 1) }, { id: String(a), label: String(a) }],
    answer: String(a + 1),
    hint: 'Räkna ett steg till.',
    explain: `${a} + 1 = ${a + 1}.`,
  };
}
```

Registrera den i appens `modules`-lista med `gen`, `minLevel` och `lgr` (läroplanskoder). Enhetstesterna kontrollerar automatiskt att den ger giltiga frågor på alla nivåer.

## Licens

Privat familjeprojekt.

### Fotografier i lärmaterialet

Alla foton kommer från Wikimedia Commons (fria licenser) och bäddas in i den fristående
HTML-filen så att de fungerar utan nätverk. Ett enda system:

1. `assets/image-catalog.json` – nyckel → `File:…` (eller `sv:Artikel`). Gruppen `objects` är
   föremål/djur/mat som ersätter emoji i frågor (`src/core/emoji-photos.js`).
2. `python3 scripts/fetch_images.py [--group=objects] [nyckel …]` hämtar, kontrollerar licensen och
   sparar WebP i `assets/img/` samt upphov i `assets/credits.json`.
3. `node scripts/gen-images.mjs` (körs av `test:unit`/bygget) skriver `src/generated/images.js` och
   `docs/BILDKALLOR.md`.
4. I koden: `photo`, `hasPhoto`, `pic`, `photoize` från `src/ui/img.js`. `src/ui/photos.js` är ett
   tunt kompatibilitetslager.

Källor och licenser visas under Inställningar → Om bilderna och i [BILDKALLOR.md](docs/BILDKALLOR.md).

### AI och Kodning

Kurserna kombinerar uppläsningsbara lektioner med övningar och sparade läsframsteg.
Fördjupningar låses upp efter barnets nivå. Kodning behåller tidigare robotframsteg.
AI-labbet använder en lokal närmaste-granne-modell med öppet redovisade egenskaper,
inte bildtolkning. Barnen kan ändra träningsetiketter och jämföra svar på andra djur.
Inga externa AI-konton eller tjänster behövs. AI-innehållet bygger på
[UNICEF:s riktlinjer](https://www.unicef.org/innocenti/reports/policy-guidance-ai-children) och
[NIST:s generativa AI-profil](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).
AI-fördjupningen kompletterar de grundläggande färdigheter som kopplas till läroplanen.

### Enkel profilguide

Föräldern öppnar spärren och godkänner ett av fyra åldersintervall: 4–5, 6–7,
8–9 eller 10–12 år. Barnet gör sedan tre enkla steg: namn, figur och utseende.
Intervallen styr startnivå, uppläsning och rundlängd; övningarna anpassas vidare
när barnet lär sig. Bakgrundskorten visar samma skalbara landskap som hemskärmen.

### Datorläge

Det sammanslagna projektet har också datorläge för äldre barn, med skrivbord och flyttbara fönster. Föräldern kan välja surfplatta eller dator under profilens inställningar. Både kursapparna och profilguiden fungerar med dessa val.

### Skaparstudion och lärandemynt

Lekstaden ligger till vänster om Troféer i nedre menyn. Genvägen öppnar Skaparstudion.
Barnet kan börja leka direkt i ett mysrum med gratis möbler och två figurer. Saker kan
väljas och placeras med tryck, flyttas med drag eller piltangenter, vändas och läggas
tillbaka. Väggar, golv, namn, frisyrer, klädfärger och ansiktsuttryck går att ändra.

Nya temapaket och rum visar vilken kursövning som behövs. Första färdiga rundan i
en modul ger fem extra spelmynt; repetition ger två. Stjärnornas mynt finns kvar.
Att behöva flera försök tar inte bort mynt. Frilekens klick skapar inte valuta.
Inga riktiga pengar eller annonser används. Se [inspiration och belöningsregler](docs/PLAY-REWARD-DESIGN.md).

Studion använder originalillustrationer i SVG. Toca Bocas officiella rum- och
outfitverktyg har studerats som inspiration för fri lek, kategorier och tydlig
rumsvy. Spelgrafiken och innehållet är KidsOS eget.
