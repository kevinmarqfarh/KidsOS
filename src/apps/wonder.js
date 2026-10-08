// Undra – nyfikenhetsfrågor med barnvänliga svar och en följdfråga som väcker nya tankar.
// "think" är en fråga att fundera vidare på (gärna tillsammans med en vuxen).

export const WONDERS = [
  { id: 'himmel', e: '🌤️', cat: 'Natur', q: 'Varför är himlen blå?', a: 'Solljuset innehåller alla regnbågens färger. När ljuset krockar med luften sprids det blå ljuset mest åt alla håll – därför ser hela himlen blå ut.', think: 'Varför blir himlen röd och orange när solen går ner?' },
  { id: 'regnbage', e: '🌈', cat: 'Natur', q: 'Hur blir en regnbåge till?', a: 'När solen lyser på regndroppar delas ljuset upp i sina färger, precis som i ett prisma. Du ser en regnbåge när solen är bakom dig och regnet framför dig.', think: 'Kan du göra en egen regnbåge med en vattenslang en solig dag?' },
  { id: 'aska', e: '⛈️', cat: 'Natur', q: 'Varför kommer åskan efter blixten?', a: 'Ljus färdas jättefort och ljud mycket långsammare. Räkna sekunderna mellan blixt och knall och dela med tre – då vet du ungefär hur många kilometer bort åskan är.', think: 'Om det tar sex sekunder – hur långt bort är åskan?' },
  { id: 'gaspa', e: '🥱', cat: 'Kroppen', q: 'Varför gäspar man?', a: 'Forskarna är inte helt säkra! En idé är att gäspningar hjälper till att kyla hjärnan och göra oss piggare. Och gäspningar smittar – bara att läsa om dem kan få dig att gäspa.', think: 'Gäspade du nu? Testa att gäspa framför någon och se om de gäspar också.' },
  { id: 'hicka', e: '😮', cat: 'Kroppen', q: 'Varför får man hicka?', a: 'Hicka är när muskeln under lungorna – mellangärdet – plötsligt drar ihop sig. Då stängs stämbanden snabbt och det säger "hick!".', think: 'Vilka knep känner du till mot hicka?' },
  { id: 'drommar', e: '💭', cat: 'Kroppen', q: 'Varför drömmer vi?', a: 'När vi sover sorterar hjärnan allt vi varit med om. Drömmar kan vara ett sätt för hjärnan att öva och minnas. Alla drömmer – även om vi inte alltid minns det.', think: 'Vad är det konstigaste du har drömt?' },
  { id: 'gashud', e: '🥶', cat: 'Kroppen', q: 'Varför får man gåshud?', a: 'När du fryser drar små muskler vid varje hårstrå ihop sig och hårstråna reser sig. Våra förfäder hade mer hår, och då blev pälsen tjockare och varmare.', think: 'Vilka djur gör likadant när de fryser eller blir rädda?' },
  { id: 'katt', e: '🐈', cat: 'Djur', q: 'Varför spinner katter?', a: 'Katter spinner ofta när de är glada och trygga. Men de kan också spinna när de är sjuka eller rädda – det verkar lugna dem.', think: 'Vilka andra ljud gör djur för att visa hur de mår?' },
  { id: 'zebra', e: '🦓', cat: 'Djur', q: 'Varför har zebror ränder?', a: 'Forskare har upptäckt att flugor har svårt att landa på randiga ytor. Ränderna kanske skyddar zebran mot bitande flugor!', think: 'Vilka andra djur har mönster – och varför tror du det?' },
  { id: 'flamingo', e: '🦩', cat: 'Djur', q: 'Varför är flamingor rosa?', a: 'De äter små kräftdjur och alger med rosa färgämnen. Utan den maten skulle flamingorna bli vitare!', think: 'Om du bara åt morötter – skulle du bli orange?' },
  { id: 'myror', e: '🐜', cat: 'Djur', q: 'Hur hittar myrorna hem?', a: 'Myror lämnar doftspår efter sig som andra myror följer. Vissa myror räknar till och med sina steg!', think: 'Hur hittar du hem om du har gått vilse?' },
  { id: 'fladdermus', e: '🦇', cat: 'Djur', q: 'Hur ser fladdermöss i mörkret?', a: 'De skriker ljud som är för ljusa för oss att höra. Ljudet studsar mot saker och kommer tillbaka – då "hör" fladdermusen var saker finns. Det kallas ekolokalisering.', think: 'Vilka maskiner använder samma knep som fladdermusen?' },
  { id: 'manen', e: '🌙', cat: 'Rymden', q: 'Varför ändrar månen form?', a: 'Månen är alltid rund! Solen lyser upp halva månen. När månen åker runt jorden ser vi olika mycket av den upplysta sidan.', think: 'Titta på månen i kväll – är den växande eller avtagande?' },
  { id: 'stjarnor', e: '⭐', cat: 'Rymden', q: 'Varför blinkar stjärnorna?', a: 'Stjärnljuset måste gå genom luften runt jorden, och luften rör sig hela tiden. Då darrar ljuset lite – och det ser ut som att stjärnan blinkar.', think: 'Blinkar stjärnorna i rymden, där det inte finns luft?' },
  { id: 'rymd-ljud', e: '🔇', cat: 'Rymden', q: 'Kan man höra ljud i rymden?', a: 'Nej! Ljud behöver något att färdas genom, som luft eller vatten. I rymden är det nästan tomt, så där är det alldeles tyst.', think: 'Hur pratar astronauterna med varandra då?' },
  { id: 'sol-varm', e: '☀️', cat: 'Rymden', q: 'Varför är solen så varm?', a: 'Inne i solen pressas små partiklar ihop så hårt att de smälter samman. Det kallas fusion och ger enorma mängder energi – ljus och värme.', think: 'Vad skulle hända med jorden utan solen?' },
  { id: 'is-flyter', e: '🧊', cat: 'Vetenskap', q: 'Varför flyter is?', a: 'När vatten fryser ordnar sig vattnets små delar i ett mönster med mer mellanrum. Isen blir lite lättare än vattnet, så den flyter. Tur för fiskarna – sjöarna fryser uppifrån!', think: 'Vad tror du skulle hända om isen sjönk?' },
  { id: 'magnet', e: '🧲', cat: 'Vetenskap', q: 'Hur fungerar en magnet?', a: 'I en magnet pekar massor av pyttesmå delar åt samma håll. Tillsammans skapar de en osynlig kraft som drar i järn.', think: 'Jorden är också en stor magnet – vad använder man det till?' },
  { id: 'brod', e: '🍞', cat: 'Vetenskap', q: 'Varför blir brödet stort när det jäser?', a: 'Jästen är små levande svampar som äter socker och "fiser" ut gasen koldioxid. Gasen blir bubblor som gör degen stor och luftig.', think: 'Titta in i en brödskiva – kan du se hålen efter bubblorna?' },
  { id: 'ekar', e: '🔊', cat: 'Vetenskap', q: 'Varför kan det eka?', a: 'Ljudet studsar mot en bergvägg eller ett stort hus och kommer tillbaka till dig – lite senare. Det är ett eko.', think: 'Var har du hört ett eko?' },
  { id: 'lov', e: '🍁', cat: 'Natur', q: 'Varför blir löven gula och röda på hösten?', a: 'Löven är gröna av ämnet klorofyll som hjälper trädet att göra mat av solljus. På hösten bryts det gröna ner – då syns de gula och röda färgerna som funnits där hela tiden.', think: 'Vilka träd behåller sina gröna barr hela vintern?' },
  { id: 'regn', e: '🌧️', cat: 'Natur', q: 'Var kommer regnet ifrån?', a: 'Solen värmer vatten i hav och sjöar så att det avdunstar. Uppe i luften blir det kallt och vattnet bildar moln av små droppar. När dropparna blir tunga faller de som regn.', think: 'Samma vatten har kanske druckits av en dinosaurie – kan det stämma?' },
  { id: 'dinosaurier', e: '🦖', cat: 'Historia', q: 'Hur vet vi hur dinosaurier såg ut?', a: 'Forskare hittar fossil – ben som blivit sten under miljontals år. Som ett pussel bygger de ihop skeletten. Vissa fossil visar till och med fjädrar!', think: 'Vilka djur som lever i dag är släkt med dinosaurierna? (Tips: de kan flyga.)' },
  { id: 'internet', e: '🌐', cat: 'Teknik', q: 'Hur fungerar internet?', a: 'Internet är miljontals datorer som är kopplade till varandra med sladdar under marken, i havet och via radiovågor. Meddelanden delas upp i små paket som hittar sin egen väg och sätts ihop igen.', think: 'Hur tror du ett meddelande hittar rätt mottagare?' },
  { id: 'flygplan', e: '✈️', cat: 'Teknik', q: 'Hur kan ett tungt flygplan flyga?', a: 'Vingarna är formade så att luften som strömmar förbi trycker planet uppåt. Motorerna ser till att planet åker tillräckligt fort framåt.', think: 'Vik ett pappersflygplan – vad händer om du böjer vingarna?' },
  { id: 'robot', e: '🤖', cat: 'Teknik', q: 'Kan robotar tänka?', a: 'Robotar följer program som människor har skrivit. Vissa program kan lära sig av exempel och verka smarta, men de förstår inte saker på samma sätt som du.', think: 'Vad skulle du vilja att en robot hjälpte dig med?' },
  { id: 'hav-salt', e: '🌊', cat: 'Natur', q: 'Varför är havet salt?', a: 'Regn och floder tar med sig små mängder salt från stenar och berg ut i havet. När havsvattnet avdunstar stannar saltet kvar. Under väldigt lång tid har havet blivit salt.', think: 'Varför är det inte salt i sjöarna?' },
  { id: 'kittlas', e: '🤭', cat: 'Kroppen', q: 'Varför kan man inte kittla sig själv?', a: 'Hjärnan vet redan vad din hand ska göra, så den blir inte överraskad. Kittlingar känns mest när de kommer oväntat.', think: 'Testa! Kan du kittla dig själv under foten?' },
  { id: 'varfor-sova', e: '😴', cat: 'Kroppen', q: 'Varför måste vi sova?', a: 'När du sover växer kroppen, sår läker och hjärnan sparar det du lärt dig under dagen. Därför är det lättare att minnas saker efter en god natts sömn.', think: 'Hur känner du dig när du sovit för lite?' },
  { id: 'vikingar', e: '⛵', cat: 'Historia', q: 'Hade vikingarna horn på hjälmarna?', a: 'Nej! Det är en myt som kom från teatrar och målningar på 1800-talet. Riktiga vikingahjälmar var runda och enkla.', think: 'Hur kan man ta reda på om något verkligen är sant?' },
  { id: 'bin', e: '🐝', cat: 'Djur', q: 'Hur gör bina honung?', a: 'Bina samlar söt nektar från blommor. I kupan gör de om nektarn och fläktar med vingarna så att vattnet avdunstar. Kvar blir tjock, söt honung.', think: 'Vilka blommor tror du att bina gillar mest?' },
  { id: 'eld', e: '🔥', cat: 'Vetenskap', q: 'Vad behöver en eld för att brinna?', a: 'Eld behöver tre saker: något som kan brinna, värme och syre från luften. Tar man bort en av dem slocknar elden. Därför kvävs elden under en brandfilt.', think: 'Varför ska man aldrig leka med eld utan en vuxen?' },
];

export const wonderApp = {
  id: 'wonder',
  name: 'Undra',
  icon: '🤔',
  color: '#f5a524',
  tagline: 'Stora frågor om allt',
  modules: [{ id: 'cards', name: 'Frågekort', icon: '🤔', minLevel: 0, view: 'wonder', lgr: ['fsk-utforska', 'no-berattelse'] }],
};

/** Dagens fråga – samma för hela dagen, olika per dag. */
export function wonderOfTheDay(date = new Date()) {
  const start = Date.UTC(2024, 0, 1);
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86400000);
  return WONDERS[((day % WONDERS.length) + WONDERS.length) % WONDERS.length];
}
