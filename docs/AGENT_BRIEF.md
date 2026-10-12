# Brief för innehålls- och förbättringsagenter (KidsOS)

KidsOS är ett lärande "operativsystem" för svenska barn som är **5, 7 och 9 år**. Det körs i webbläsare på iPad (9,7") och mobil.
- 5 åringen är förläsare (förskoleklass): allt läses upp och han svarar med bilder och emoji.
- 7 åringen går i åk 1: han läser korta ord.
- 9 åringen går i åk 3: hon läser och har datorlayouten.

Allt i appen är på **svenska**, med korrekt grammatik: rätt en/ett, bestämd form och plural. Tonen är varm och nyfiken, aldrig nedlåtande.

## Arkitektur (läs innan du ändrar)
- Vanilla JS ES-moduler, byggs med esbuild till en enda HTML-fil (`npm run build` ger `dist/index.html`).
- Appar definieras i `src/apps/*.js` och registreras i `src/apps/registry.js`. En app ser ut så här: `{ id, name, icon, color, modules: [...] }`.
- En modul ser ut så här: `{ id, name, icon, minLevel, gen | view, lgr: [läroplanskoder], photo?: () => html }`.
  - `gen(level 0–4, rng, ctx)` är en **ren** frågegenerator. Den använder `rng.pick`, `rng.sample`, `rng.shuffle`, `rng.int(a,b)` och `rng.chance(p)`. Se `src/core/rng.js`.
  - Frågetyper som valideras i `tests/unit/content.test.mjs`: choice, numpad, order, sort, build, tapcount, tap och clock. Läs den filen och en befintlig generator innan du skriver nya.
  - `view` pekar på interaktiva vyer i `src/ui/views/*.js` (mappas i `src/ui/views/index.js`).
- Nivåer 0–4 motsvarar ungefär: 0 = 4–5 år (förläsare), 1 = 6 år (förskoleklass), 2 = 7 år (åk 1), 3 = 8 år (åk 2), 4 = 9–10 år (åk 3). Systemet är adaptivt: 5 rätt i rad ger nivå upp och 3 fel i rad ger nivå ned. Startnivån sätts av barnets ålder. Se `src/core/age.js`.
  - **Varje nivå ska kännas rätt för den åldern.** Nivå 0 ska ha bildsvar, inget som kräver läsning och få alternativ (2–3). Nivå 4 ska vara verkligt utmanande för en 9-åring.
- Fältet `say` på en fråga är det som läses upp. Det ska fungera för förläsare: tala om vad de ska göra. Uppläsningen sker med Web Speech på svenska.
- Riktiga foton: `photo(key, {alt, cls})` och `hasPhoto(key)` från `src/ui/img.js`. Bilderna kommer från Wikimedia Commons med fri licens. Nycklar finns i `assets/image-catalog.json`.
  - **Generatorer måste fungera även om ett foto saknas.** Hämtningen pågår och en del nycklar kan saknas. Tester körs med vilka foton som helst.
  - Behöver du nya foton? Lista dem i din slutrapport som `nyckel: "sv:Wikipedia-titel"`. Ändra INTE image-catalog.json (den används av en pågående hämtning).
- Belöningar: `kos.reward({app, stars, set, item, counter})` från vyer. Quiz-frågor kan ha `collect: {set, item}`. Mynt följer med stjärnor automatiskt.

## Regler för parallellt arbete (viktigt – flera agenter jobbar samtidigt)
- Ändra **bara** de filer som ditt uppdrag tilldelar dig.
  - Nya läroplanskoder: lägg dem i din egen `src/core/lgr/<ditt>.js`, som `export default { 'kod': { subject, area, text } }`. Citera Lgr22 ordagrant (centralt innehåll åk 1–3 eller förskoleklass). Befintliga koder finns i `src/core/curriculum.js`; använd dem gärna. Ändra inte curriculum.js.
  - Ny CSS: lägg den i din egen `src/styles/apps/<ditt>.css`.
  - Nya enhetstester: lägg dem i din egen `tests/unit/<ditt>.test.mjs`.
  - Rör INTE `trophies.js`, `registry.js`, `shell.js`, `desktop.js`, `kos.js`, `desktop.css`, `package.json`, git eller `dist/`. Föreslå troféer i din slutrapport (id, namn, ikon, villkor).
- Kör `npm run -s test:unit` (node --test). Det måste vara grönt för dina filer innan du är klar. Kör inte `npm run build` eller e2e. Andra agenters filer kan tillfälligt vara trasiga; nämn det i så fall i rapporten.
- Gör inga git-commits.

## Kvalitetskrav
- **Fakta ska stämma.** Kontrollera siffror (avstånd, antal, år) mot pålitliga källor (WebSearch/WebFetch: Wikipedia, NASA, Naturhistoriska riksmuseet, SMHI, Skolverket). Barnvänliga förenklingar är okej, felaktigheter är det inte.
- Mycket variation: tillräckligt med innehåll för att samma fråga inte ska komma direkt igen.
- Förklaringar (`explain`) ska lära ut något och inte bara säga "rätt".
- Inget våldsamt, läskigt eller olämpligt för 5-åringar.
- Touch: inga små mål. Följ befintliga mönster, till exempel `onTap` från `src/ui/dom.js`.

## Slutrapport (din sista text)
Kort lista:
1. Vad du lade till och ändrade, per fil och med antal nya frågor/objekt per nivå.
2. Nya läroplanskoder.
3. Önskade foton.
4. Trofé-förslag.
5. Kända risker.

## Våg 2: uppdaterat läge (läs detta också)
- Kevin har byggt vidare med Codex. Det arbetet är nu sammanslaget med vågen 1.
  - Nya appar: `src/apps/ai.js` och `ai-lab.js`, med vyerna `src/ui/views/ai.js` och `course.js`. Kodkursen ligger i `code.js` (CODING_LESSONS).
  - Åldersintervall finns i `src/core/age.js`. Bakgrunder finns i `src/ui/wallpapers.js`.
  - Ett andra fotosystem finns: `src/ui/photos.js` med `src/assets/photos/*` och `catalog.js`. Det kommer att slås ihop med `src/ui/img.js` av fotoagenten.
- **Läs om dina filer innan du ändrar dem.** De kan ha ändrats sedan du såg dem senast.
- Flera agenter kan behöva röra samma delade fil. Gör då små, riktade Edit-anrop: läs alltid precis innan och skriv aldrig om hela filen. Dessa filer delas:
  - `shell.js`, `kos.js` och `quiz.js` ägs av agenten för anpassat läge.
  - Animationer och 21st-komponenter ägs av fx-agenten.
- Under testerna finns alla appars innehåll i `tests/unit/`. Hela sviten ska vara grön när du är klar. Om ett test som inte är ditt failar, nämn det i rapporten.
- Riktiga foton prioriteras framför emoji när det hjälper förståelsen. Använd hjälparna i `src/ui/img.js` (`photo`, `hasPhoto` och snart `pic`). Ha alltid emoji som reserv.
