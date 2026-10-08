# KidsOS

**Ett lärande "operativsystem" för barn 4–10 år – byggt för iPad och mobil.**

KidsOS ser ut och känns som ett eget operativsystem: varje barn har en egen profil på låsskärmen, en hemskärm med appar och en docka, och appar som öppnas i egna fönster. Varje app är ett ämne att fördjupa sig i. Allt är byggt för att väcka **nyfikenhet**, **kreativitet** och **lärande** – och följer Skolverkets läroplan (Lgr22) för förskoleklass och årskurs 1–3.

| Hemskärm | Frågerunda | Robotbanan | Skriv ABC |
|---|---|---|---|
| ![Hemskärm](docs/screenshots/ipad-hemskarm.png) | ![Fråga](docs/screenshots/ipad-fraga.png) | ![Robot](docs/screenshots/ipad-robotbana.png) | ![Skriv ABC](docs/screenshots/ipad-skriv-abc.png) |

## Innehåll

| App | Vad barnet gör |
|---|---|
| 🔢 **Matte** | 15 moduler: räkna, störst/minst, mönster, former (2D och 3D), tiokompisar, plus/minus med tioramar, talföljder, klockan (läsa *och* ställa in visarna), hemliga talet (likhetstecknet), dubbelt/hälften, mäta med linjal, diagram, tiotal/ental med tiobasmaterial, gånger/delat, chans (sannolikhet). |
| 📖 **Svenska** | Bokstavsljud, rimma, klappa stavelser på en trumma, första ljudet, stor/liten bokstav, bygga ord, läsa och välja bild, ABC-ordning, bygga meningar och skiljetecken, motsatser/synonymer, och 6 berättelser som kan läsas upp ord för ord – med frågor om innehållet. |
| ✏️ **Skriv ABC** | Spåra stora och små bokstäver (alla 29), siffror, ord och *sitt eget namn* med fingret. Startpunkter, riktningspilar och en animerad "Visa hur". Bedömningen tål darriga barnhänder men inte klotter. |
| 🔬 **Vetenskap** | Experiment med arbetsgången Fråga → Gissa → Testa → Förklara: flyter/sjunker, magneten, ljus & skugga, vattnets former (smälta, koka, kondensera, frysa), gungbrädan (jämvikt), rutschkanan (friktion), blanda & separera (filtrera/avdunsta) och källsortering med pant. Resultaten sparas i ett protokoll. |
| 🌿 **Biologi** | Utforska kroppen (utsida och organ), "var är …?", sinnena, årstider, livscykler, 25 svenska artkort att samla, djurgrupper, näringskedjor och må bra (sömn, hygien, mat, vänner). |
| 🚀 **Rymden** | Ett levande solsystem att trycka på, bygg och räkna ner en raket, dag & natt i Göteborg, månens faser, planetordning, stjärnbilder att rita (med gamla berättelser), varför vi har årstider, och ett rymdquiz. |
| 🤖 **Kod** | 20 robotbanor i tre kapitel (pilar → sväng & kör → loopar), följ koden, programmerade saker i vardagen, och rita med kod (sköldpaddsgrafik). |
| 🎨 **Rita** | Penslar, stämplar, spegelpensel (symmetri), ångra och ett eget galleri – plus ritidéer som väcker fantasin. |
| 🤔 **Undra** | 32 stora frågor ("Varför är himlen blå?") där barnet gissar först, får ett svar och en följdfråga att fundera vidare på. En ny fråga varje dag på hemskärmen. |
| 🏆 **Troféer** | 52 troféer, titlar från "Nyfiken nybörjare" till "Universumets mästare" och samlingar (artkort, planeter, stjärnbilder, bokstäver). |
| ⚙️ **Inställningar** | Barnets egna val (figur, bakgrund, uppläsning) och en föräldradel bakom spärr: profiler, nivåer, skärmtid, synliga appar, föräldrakod, rapport mot läroplanen och säkerhetskopia. |

Hela kopplingen till läroplanen, modul för modul, finns i [docs/LARANDE.md](docs/LARANDE.md). Forskningen bakom designen finns i [docs/RESEARCH.md](docs/RESEARCH.md). Föräldraguiden finns i [docs/FORALDRAR.md](docs/FORALDRAR.md).

## Byggt för barn

- **Stora tryckytor:** allt är minst 56 punkter, svarsknappar 88 punkter. Testerna underkänner allt under 44.
- **Förlåtande touch:** dubbeltryck filtreras bort, knappar har en osynlig extra marginal och allt som kan dras kan också tryckas.
- **Uppläsning på svenska:** för barn upp till 7 år läses frågor, alternativ och förklaringar upp automatiskt. Äldre barn trycker på 🔊. På iPad används den inbyggda svenska rösten.
- **Anpassad nivå:** fem rätt i rad ger en svårare nivå, tre missar i rad en lättare.
- **Inga straff:** fel ger tips, efter två försök visas svaret med en förklaring. Stjärnor och troféer kan aldrig förloras.
- **Inga annonser och ingen data som lämnar enheten.**

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
