# Prestanda (okt 2026)

Målgrupp: äldre iPad 9,7" (A9/A10, 2–3 GB RAM, iPadOS 15–16) och iPhone i Safari.
Allt ska fortfarande fungera offline som **en enda HTML-fil** (`dist/index.html`, och `dist/artifact.html` för Claude-artifact).

## Mätmetod

`node scripts/perf.mjs [a.html b.html …] --runs=7 [--throttle=6] [--json]`

- Chromium (playwright-core), iPad-vy 768×1024 @2x, **CPU-strypning 6×** via CDP `Emulation.setCPUThrottlingRate`.
- En profil skapas och loggas in, sedan laddas sidan om. Vi mäter till `.home` (hemskärmen).
- Flera filer mäts omväxlande (A, B, A, B …). Värdena är medianer.
- `cpuHtml`/`cpuParse` är trådens CPU-tid (`tdur` i spårningen). De påverkas mindre av andra processer än väggklockan.
- Minne: `usedJSHeapSize` efter GC, och renderarens RSS (Linux, `ps`).
- Apptid: `openApp()` → två bildrutor (väggtid) och huvudtrådens `TaskDuration` under samma tid.

Obs: maskinen delades med andra agenter (load average ≈ 15–18 på 2 kärnor). Väggklocktiderna varierar därför ±30 %. CPU-tiderna och minnet är stabila.

## Resultat

| Mått (6× strypning, median av 7) | Före | Efter |
|---|---|---|
| Filstorlek `dist/index.html` | **9,5 MB** (9 777 kB) | **7,2 MB** (7 327 kB) |
| Tid till hemskärm (`performance.now()` vid `.home`) | 3 122 ms | **2 181 ms** |
| DOMContentLoaded | 2 625 ms | **1 615 ms** |
| HTML-parsning, CPU-tid (inkl. inbäddad JS) | 690 ms | **273 ms** |
| HTML-parsning, väggtid | 1 192 ms | 412 ms |
| JS-parse/kompilering, CPU-tid | 96 ms | 111 ms (brus) |
| JS-heap efter start | **29,9 MB** | **6,6 MB** |
| JS-heap efter 4 öppnade appar | 30,1 MB | 6,8 MB |
| Renderarens RSS efter start / efter appar | 251 / 300 MB | 249 / 295 MB |
| Öppna app: Undra / Rymden / Matte / Troféer (TaskDuration) | 195 / 158 / 148 / 583 ms | 219 / 219 / 158 / 629 ms |

Apptiderna har inte ändrats mätbart. Skillnaderna ligger inom bruset (±30 % mellan körningar). Troférummet är långsammast att öppna, men en spårning visar att det mest är layout och rastrering, inte JS: unstrypt tar `FunctionCall` ≈ 4 ms och `Layout` ≈ 36 ms.

### Jämförelse av sätt att lägga bilderna i HTML:en (samma bilder, 5 körningar)

| Läge | HTML-parse CPU | Tid till hem | Heap efter appar | Kommentar |
|---|---|---|---|---|
| Före (JS-strängar i bundeln) | 616 ms | 2 634 ms | 30,1 MB | Hela bundeln parsas med 8 MB strängar |
| `json`: ett JSON-block, `JSON.parse` första gången en bild behövs | 486 ms | 1 991 ms | 14,6 MB | Första bilden avkodar allt |
| `slice`: ett block, varje bild klipps ut med förberäknade positioner | 463 ms | 1 568 ms | 14,6 MB | En kopia av hela blocket som JS-sträng |
| **`perkey`: ett `<script type="application/json">` per bild (vald)** | **304 ms** | 1 609 ms | **6,8 MB** | Bara de bilder som visas läses in |

`perkey` gav lägst parsetid och lägst minne. Det beror på att HTML-parsern hanterar många små textnoder billigare än en textnod på 6 MB. Läget väljs med `KIDSOS_IMG_MODE=perkey|json|slice` (standard är `perkey`).

## Vad som ändrades

1. **Bilderna ligger inte längre i JS-bundeln** (`scripts/gen-images.mjs`, `scripts/build.mjs`).
   - `src/generated/images.js` är oförändrad: node-varianten med vanliga strängar. Enhetstesterna importerar den precis som förut.
   - `src/generated/images.browser.js` är webbläsarvarianten. Bygget byter till den via ett esbuild-plugin. Den exporterar samma `IMAGES`/`CREDITS`, men varje `IMAGES[nyckel]` är en getter som läser `<script type="application/json" id="kimg-…">` när den anropas första gången. Resultatet sparas.
   - `img.js`-API:t (`photo`, `hasPhoto`, `photoUrl`, `pic`, `photoize`, `allCredits` …) är oförändrat. Bilderna är fortfarande `data:image/webp;base64,…`, så de fungerar i artifact-sandlådan och offline.
   - `hasPhoto`/`emojiPhotoKey` kontrollerar nu om nyckeln finns (`hasOwnProperty`) i stället för att läsa bilden. Då avkodar `photoize` inte bilder i onödan.
2. **Mindre bilder** (`scripts/shrink_images.py`, samma mål i `scripts/fetch_images.py`).
   - Föremål (`obj-*`, emoji-ersättare): 320 → **240 px, q60**.
   - Motivbilder: 560 → **480 px, q62**. Bilder som redan är högst 480 px och månfaserna (400 px) rörs inte.
   - Totalt: 331 bilder, 6 015 kB → **4 162 kB**.
   - `assets/img-optimized.json` håller kontrollsummor, så att en bild aldrig komprimeras om två gånger.
   - Visuell kontroll i iPad @2x:
     - Fotospana: huvudbild ≈ 270 CSS-px och kort.
     - Räkna: miniatyrer.
     - Värsta fallet `.pic-big` på 150 px (225 CSS-px = 450 enhetspx): 240-pixelsfotot blir där något mjukare än förut, men det syns inga artefakter.
     - I normala storlekar (miniatyrer på 40–90 px, kort på 220 px) märks ingen skillnad.
3. **Lätt grafikläge** (`src/core/perf-mode.js` och sist i `src/styles/app.css`).
   - När det slås på:
     - Safari/iPadOS före 16.2 (samma gräns som color-mix-reserverna).
     - Högst 2 kärnor eller högst 2 GB `deviceMemory`.
     - Systemets "Minska genomskinlighet" (`prefers-reduced-transparency`).
     - `?fx=lite` i adressen (`?fx=full` stänger av).
   - Vad det gör:
     - Klassen `.lite-fx` stänger av `backdrop-filter` på statusraden, dockan, rangskylten, widgetar, aktivitetsfältet och startmenyn. Det är helbreddsytor som annars ritas om vid varje scroll.
     - Glaset läggs i två lager och blir då nästan ogenomskinligt (≈ 92 %), i både ljust och mörkt tema.
     - Blur-animationerna (`fx-blur-fade`, `fx-word-in`) blir vanlig toning.
4. **Solsystemets animationsloop** (`src/ui/views/space.js`, `animate`).
   - Förut körde den `querySelectorAll('.planet')` och skrev om alla planeter i varje bildruta, även när banan stod still (paus eller reducerad rörelse).
   - Nu hämtas planeterna en gång per uppbyggnad, och inget skrivs om när banan står still och valet är oförändrat.
5. **`content-visibility: auto`** på troférummets sektioner, samlingarna, galleriet och Utforskarens rutnät. Chromium och Safari 18+ hoppar då över det som inte syns. Äldre Safari ignorerar det.

## Granskade mönster utan åtgärd

- `setInterval`: skalets statusrad (30 s), skrivbordets klocka och widgetar (30 s), skärmtid (10 s). Ringar, rörelsepauser och nedräkningar kontrollerar `isConnected` eller rensas när vyn stängs. Trädgårdens 5-sekunderstimer rensas i `timers`. Andningspausen (100 ms) slutar när andningsrundan är klar.
- `MutationObserver` finns bara i `autoPhotoize` och är begränsad till app-roten, inte hela dokumentet.
- `requestAnimationFrame`:
  - Konfetti (110 bildrutor), spårdemon (avbryts) och vetenskapens simuleringar (stoppar på `alive`/`isConnected`) är alla begränsade.
  - Bara solsystemet körde onödigt arbete, se punkt 4.
- Inga omritningar med `innerHTML` varje sekund hittades. Klockan uppdateras var 30:e sekund.

## Kvar att göra

- **Målet < 6 MB nåddes inte: filen är 7,2 MB.**
  - Bilderna står för 5,5 MB base64 och koden/CSS:en för ≈ 1,8 MB.
  - Uppskattning: föremål 200 px q60 och motiv 440 px q60 ger ≈ 6,1 MB. Då blir `.pic-big` och fotokorten (220–420 CSS-px på @2x) synligt suddigare, så det gjordes inte.
  - Under 6 MB utan synlig förlust kräver att bilder som aldrig används tas bort, eller att JS-bundeln krymper.
- **RSS ändrades knappt.** HTML-källan (7 MB) ligger kvar i minnet.
  - En variant med `Blob`-URL:er skulle ge kortare `innerHTML`-strängar.
  - Den testades inte, eftersom blob-URL:er i artifact-sandlådan (opakt ursprung) är osäkra i Safari.
- Den lätta grafiken bygger på user agent och kärnantal. Den bör verifieras på den riktiga iPaden (titta på statusraden och dockan när du scrollar).
