# QA-brief (buggjakt och optimering, okt 2026)

KidsOS (/home/claude/kidsos) körs av Kevins barn (5, 7 och 9 år) på en **äldre iPad 9,7" med hemknapp** och i Safari på iPhone. Kevin rapporterade två saker från iPaden:
- navigeringsknapparna ("Hem", tillbaka) och apptiteln syntes knappt
- bokstäver i flera kursappar syntes inte

**Grundorsak** (redan rättad, commit c0ca358): Safari före 16.2 saknar `color-mix()`. Bygget (`scripts/css-compat.mjs`) lägger nu in reservfärger och flyttar originalen in i `@supports`.

**Testa i "gammal iPad"-läge** med `node scripts/build.mjs --legacy-sim`. Det skriver `dist/legacy-sim.html`, där alla `@supports(color-mix)`-block är borttagna.

## Verktyg
- Bygg: `npm run -s build`. Med `--legacy-sim` byggs även simulatorn.
- Enhetstester: `npm run -s test:unit`. Måste vara gröna.
- E2E: `npm run -s test:e2e` (playwright-core).
  - Chromium finns på `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Testerna hittar `/usr/bin/chromium`.
  - Kör enskilda filer eller tester med `node --test --test-name-pattern="…" tests/e2e/<fil>`.
- Testkrok i sidan: `window.kidsos = { kos, goHome, openApp }`. `window.kidsos.q` är den aktuella frågan.
  - Skapa profil: `k.createProfile({name, age, wallpaper})`, sedan `k.login(id)`, `goHome()` och `openApp(appId, moduleId)`.
  - Ålder 5–7 ger surfplatte-layout. Ålder 8+ ger dator-layout, eller sätt `profile.settings.layout = 'tablet'`.
- Skärmbilder: spara under `/tmp/claude-0/qa-<ditt-namn>/` och titta på dem med Read. Spara inte i `docs/screenshots` om det inte behövs för dokumentationen.

## Regler (flera agenter jobbar samtidigt)
- Läs alltid filen precis innan du ändrar den. Gör små, riktade Edit-anrop och skriv aldrig om hela filer.
- Gör inga git-commits. Huvudagenten committar.
- Behåll beteenden som testerna kräver. Om ett test är fel, rätta testet och motivera det.
- Svenska i allt som barnen ser.
- **Slutrapport:** vad du hittade, med orsak, fil och rad, vad du rättade, vad som återstår och testresultat.
