# Animationskomponenter (fx) – från 21st.dev till vanilla JS

KidsOS använder inga ramverk och ska fungera offline som en enda HTML-fil. Komponenterna nedan finns på
[21st.dev](https://21st.dev) som React-, Tailwind- och Framer Motion-komponenter. Här är de **omskrivna från grunden**
i vanilla JS och CSS, utan beroenden. Vi kopierade ingen kod, bara idén, beteendet och de visuella parametrarna.
Upphovspersonerna anges ändå, enligt MIT-licensens anda.

- Kod: `src/ui/fx.js` (DOM) och `src/ui/fx-logic.js` (ren logik, testas i `tests/unit/fx.test.mjs`).
- Stil: `src/styles/fx.css`, som importeras i `src/styles/app.css`.
- Licenser: Magic UI av Dillion Verma och Animate UI av Elliot Sutton är båda **MIT**, enligt komponentsidorna på 21st.dev (kontrollerat 2026-10-09).

## Urval: varför just de här?

Vi tog med en komponent bara om den hjälper barnet att **förstå, minnas eller hålla fokus**. Rent pynt valdes bort,
till exempel Bento Grid, Spotlight Card, Marquee och Orbiting Circles. Rymden har redan en egen banvy med riktiga
proportioner, och en dekorativ omloppsanimation skulle kunna lära ut fel bild av solsystemet.

| # | Komponent (original) | Port i KidsOS | Var den används | Hur den stödjer inlärningen |
|---|---|---|---|---|
| 1 | [Number Ticker](https://21st.dev/@dillionverma/components/number-ticker) – Magic UI, MIT | `numberTicker(el, from, to)` och `tickerSpan(key, value)` | Stjärnchippet i statusraden (`shell.js`) och i aktivitetsfältet (`desktop.js`), mynten på hemskärmen och i aktivitetsfältet, statistiken i troférummet och "+N ⭐" när en runda är klar | Barnet **ser** talet räkna upp ett steg i taget (4 → 5 → 6). Det övar uppräkning och antalsuppfattning och kopplar belöningen till det barnet gjorde. Chippet studsar lite när värdet ökar. |
| 2 | [Animated Circular Progress Bar](https://21st.dev/@dillionverma/components/animated-circular-progress-bar) – Magic UI, MIT | `progressRing({value, max, center})` | En ring i varje frågerunda (2/6) och två ringar när rundan är klar: resultatet och hur många rätt i rad som återstår till nästa nivå | Delmålen blir synliga och barnet kan följa sin egen utveckling (self-monitoring). Nivåringen visar hur det adaptiva systemet fungerar: "1 av 5 rätt i rad till nästa nivå". Det gör det tydligt att det är ansträngningen som leder framåt. |
| 3 | [Flip Card](https://21st.dev/@skyleen77/components/flip-card) – Animate UI (Elliot Sutton), MIT | `flipCard(front, back, {onFlip})` | Undra → frågekort: framsidan säger "Vad tror du? Gissa först", baksidan visar svaret och "Fundera vidare" | **Hämtningsövning** (retrieval practice): barnet gissar innan det vänder kortet. Knappen "💡 Visa svaret" finns kvar och vänder samma kort. |
| 4 | [Typing Animation](https://21st.dev/@dillionverma/components/typing-animation) och Text Animate – Magic UI, MIT | `wordReveal(el, text)` och `speakAlong(container, say)` | Berättelser ("🔊 Läs för mig"). Frågetexten i quiz när uppläst text och skriven text är desamma | **Ljud kopplas till skrift**: ordet som läses just nu markeras och redan lästa ord blir gråare. Det stödjer avkodning och ordbild för den som håller på att lära sig läsa. Markeringen följer talsyntesens `boundary`-händelser (Safari/iPad). Saknas de, används en uppskattning per stavelse. |
| 5 | [Cool Mode](https://21st.dev/@dillionverma/components/cool-mode) och [Sparkles Text](https://21st.dev/@dillionverma/components/sparkles-text) – Magic UI, MIT | `sparkles(target)` och klassen `.fx-sparkle-text` | En gnistskur från **det svar barnet tryckte på** när svaret är rätt. Regnbågstext på "Fantastiskt – allt rätt!" | Återkopplingen kommer direkt och syns där barnet tittade, så den kopplas till rätt handling. Skuren är mindre när barnet behövde ett andra försök. |
| 6 | [Ripple Button](https://21st.dev/@dillionverma/components/ripple-button) och [Ripple](https://21st.dev/@dillionverma/components/ripple) – Magic UI, MIT | `ripple(el)` | Svarsknappar och sifferknappar i quiz | Visar exakt var fingret träffade. Små barn ser att trycket registrerades och trycker inte flera gånger. Den utökade träffytan (`::after`) behålls, eftersom rippeln klipps i ett eget lager. |
| 7 | [Shimmer Button](https://21st.dev/@dillionverma/components/shimmer-button) – Magic UI, MIT | `shimmer(btn)` | "Nästa ➜", "🔁 En gång till" och "💡 Visa svaret" | Ett mjukt glansljus visar **vilket steg som kommer härnäst**. Det används bara på den primära handlingen. |
| 8 | [Animated List](https://21st.dev/@dillionverma/components/animated-list) – Magic UI, MIT | `animatedList(container)` | Medaljer och samlingskort i troférummet | Korten glider in ett och ett i stället för att alla visas på en gång. Ögat kan följa ett i taget, och det blir lättare att se hur mycket man har samlat. |
| 9 | [Blur Fade](https://21st.dev/@dillionverma/components/blur-fade) – Magic UI, MIT | `blurFade(el)` | Varje ny fråga i quiz | En kort och lugn övergång visar att en **ny** uppgift har börjat. Det hjälper uppmärksamheten utan att distrahera. |
| 10 | [Confetti](https://21st.dev/@dillionverma/components/confetti) – Magic UI, MIT | Fanns redan som `kos.confetti()` | Rundan klar och nya troféer | Behölls. Den skulle kunna flyttas in i fx, men den ligger i `kos.js`, som ägs av agenten för anpassat läge. |

## Rörelse, anpassat läge och tillgänglighet

`motion()` i `fx.js` ger tre nivåer, och den läses vid varje anrop så att ändrade inställningar slår igenom direkt:

- **`none`**, när `prefers-reduced-motion: reduce` gäller: inga animationer. Tickern sätter slutvärdet direkt, och partiklar, rippel och glans visas inte.
- **`calm`**, när `<html data-adapted="…">` är satt till något annat än `off`, `0` eller `false`. Det är anpassat läge för barn med autism:
  - inga partiklar, i stället en lugn grön glöd runt rätt svar
  - ingen glans, ingen rippel, ingen studs och ingen regnbågstext
  - listor och nya frågor tonar in på 0,3 s utan förskjutning
  - vändkortet **tonar** mellan sidorna i stället för att rotera i 3D
  - tickern blir kortare (högst 0,5 s)
  - ordmarkeringen vid uppläsning **behålls** eftersom den stödjer läsningen, men utan skugga
- **`full`**, i alla andra fall.

ARIA:
- Progressringen har `role="img"` och en svensk `aria-label`, till exempel "Fråga 2 av 6 klar".
- Vändkortet är en knapp med `aria-pressed`, och den sida som inte syns har `aria-hidden`.
- Partiklar och rippel har `aria-hidden`.

## API i korthet

```js
import { numberTicker, tickerSpan, progressRing, flipCard, wordReveal, speakAlong,
         sparkles, ripple, animatedList, blurFade, shimmer, motion } from './fx.js';

numberTicker(el, 3, 10);                       // räknar 3 → 10, Promise när klar
h('span.sb-chip', '⭐ ', tickerSpan(`sb-stars:${p.id}`, p.stars)); // tickar från förra visade värdet
const ring = progressRing({ value: 0, max: 6, size: 46, center: (v, m) => `${v}/${m}` });
ring.update(3);                                 // animerar till 50 %
const card = flipCard(frontNode, backNode, { onFlip: (flipped) => {} }); card.flip(true);
await speakAlong(lineEl, (t, o) => kos.say(t, o)); // markerar .word-spännen medan raden läses
sparkles(buttonEl); ripple(buttonEl); shimmer(buttonEl); blurFade(el); animatedList(gridEl);
```

`kos.say` och `speak()` i `src/core/speech.js` tar nu emot `onStart(rate)` och `onBoundary(charIndex, text)`.
`speakAlong` använder dem.
