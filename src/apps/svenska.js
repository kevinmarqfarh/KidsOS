// Svenska-appen: språklig medvetenhet (rim, stavelser, ljud), bokstäver,
// läsning, ordbyggen, meningar och berättelser med läsförståelse.

export const ALPHABET = [
  { l: 'A', word: 'apa', e: '🐒' },
  { l: 'B', word: 'banan', e: '🍌' },
  { l: 'C', word: 'citron', e: '🍋', rare: true },
  { l: 'D', word: 'delfin', e: '🐬' },
  { l: 'E', word: 'elefant', e: '🐘' },
  { l: 'F', word: 'fisk', e: '🐟' },
  { l: 'G', word: 'gris', e: '🐷' },
  { l: 'H', word: 'hus', e: '🏠' },
  { l: 'I', word: 'igelkott', e: '🦔' },
  { l: 'J', word: 'jordgubbe', e: '🍓' },
  { l: 'K', word: 'katt', e: '🐱' },
  { l: 'L', word: 'lejon', e: '🦁' },
  { l: 'M', word: 'måne', e: '🌙' },
  { l: 'N', word: 'nyckel', e: '🔑' },
  { l: 'O', word: 'orm', e: '🐍' },
  { l: 'P', word: 'päron', e: '🍐' },
  { l: 'Q', word: 'quiz', e: '❓', rare: true },
  { l: 'R', word: 'raket', e: '🚀' },
  { l: 'S', word: 'sol', e: '☀️' },
  { l: 'T', word: 'tåg', e: '🚂' },
  { l: 'U', word: 'uggla', e: '🦉' },
  { l: 'V', word: 'val', e: '🐳' },
  { l: 'W', word: 'wok', e: '🥘', rare: true },
  { l: 'X', word: 'xylofon', e: '🎼', rare: true },
  { l: 'Y', word: 'yxa', e: '🪓' },
  { l: 'Z', word: 'zebra', e: '🦓', rare: true },
  { l: 'Å', word: 'åska', e: '⛈️' },
  { l: 'Ä', word: 'äpple', e: '🍎' },
  { l: 'Ö', word: 'öga', e: '👁️' },
];
export const LETTERS = ALPHABET.map((a) => a.l);
const COMMON = ALPHABET.filter((a) => !a.rare);

// Ordbank med bilder, sorterad efter längd (för ordbygge och läsning).
export const WORDS = [
  { w: 'ko', e: '🐄' }, { w: 'is', e: '🧊' }, { w: 'ost', e: '🧀' }, { w: 'sol', e: '☀️' }, { w: 'bil', e: '🚗' },
  { w: 'mus', e: '🐭' }, { w: 'hus', e: '🏠' }, { w: 'båt', e: '⛵' }, { w: 'får', e: '🐑' }, { w: 'bok', e: '📖' },
  { w: 'tåg', e: '🚂' }, { w: 'ägg', e: '🥚' }, { w: 'sko', e: '👟' }, { w: 'lök', e: '🧅' }, { w: 'ris', e: '🍚' },
  { w: 'ben', e: '🦴' }, { w: 'sax', e: '✂️' }, { w: 'apa', e: '🐒' }, { w: 'orm', e: '🐍' }, { w: 'uggla', e: '🦉' },
  { w: 'katt', e: '🐱' }, { w: 'hund', e: '🐶' }, { w: 'fisk', e: '🐟' }, { w: 'häst', e: '🐴' }, { w: 'måne', e: '🌙' },
  { w: 'boll', e: '⚽' }, { w: 'keps', e: '🧢' }, { w: 'kaka', e: '🍪' }, { w: 'hatt', e: '🎩' }, { w: 'ring', e: '💍' },
  { w: 'gris', e: '🐷' }, { w: 'glass', e: '🍦' }, { w: 'banan', e: '🍌' }, { w: 'tomat', e: '🍅' }, { w: 'morot', e: '🥕' },
  { w: 'groda', e: '🐸' }, { w: 'raket', e: '🚀' }, { w: 'robot', e: '🤖' }, { w: 'drake', e: '🐉' }, { w: 'krona', e: '👑' },
  { w: 'lampa', e: '💡' }, { w: 'päron', e: '🍐' }, { w: 'nyckel', e: '🔑' }, { w: 'pingvin', e: '🐧' }, { w: 'cykel', e: '🚲' },
  { w: 'snigel', e: '🐌' }, { w: 'paraply', e: '☂️' }, { w: 'ananas', e: '🍍' }, { w: 'giraff', e: '🦒' }, { w: 'fjäril', e: '🦋' },
];

export const RHYMES = [
  [{ w: 'hus', e: '🏠' }, { w: 'mus', e: '🐭' }],
  [{ w: 'katt', e: '🐱' }, { w: 'hatt', e: '🎩' }],
  [{ w: 'ko', e: '🐄' }, { w: 'sko', e: '👟' }],
  [{ w: 'sol', e: '☀️' }, { w: 'stol', e: '🪑' }],
  [{ w: 'nyckel', e: '🔑' }, { w: 'cykel', e: '🚲' }],
  [{ w: 'orm', e: '🐍' }, { w: 'storm', e: '🌪️' }],
  [{ w: 'tåg', e: '🚂' }, { w: 'våg', e: '🌊' }],
  [{ w: 'boll', e: '⚽' }, { w: 'noll', e: '0️⃣' }],
  [{ w: 'gris', e: '🐷' }, { w: 'ris', e: '🍚' }],
  [{ w: 'bil', e: '🚗' }, { w: 'pil', e: '➡️' }],
  [{ w: 'bok', e: '📖' }, { w: 'krok', e: '🪝' }],
  [{ w: 'båt', e: '⛵' }, { w: 'gråt', e: '😢' }],
];

export const SYLLABLES = [
  { w: 'ko', e: '🐄', s: ['ko'] },
  { w: 'sol', e: '☀️', s: ['sol'] },
  { w: 'hus', e: '🏠', s: ['hus'] },
  { w: 'katt', e: '🐱', s: ['katt'] },
  { w: 'apa', e: '🐒', s: ['a', 'pa'] },
  { w: 'banan', e: '🍌', s: ['ba', 'nan'] },
  { w: 'uggla', e: '🦉', s: ['ugg', 'la'] },
  { w: 'tomat', e: '🍅', s: ['to', 'mat'] },
  { w: 'giraff', e: '🦒', s: ['gi', 'raff'] },
  { w: 'fjäril', e: '🦋', s: ['fjä', 'ril'] },
  { w: 'fotboll', e: '⚽', s: ['fot', 'boll'] },
  { w: 'pingvin', e: '🐧', s: ['ping', 'vin'] },
  { w: 'elefant', e: '🐘', s: ['e', 'le', 'fant'] },
  { w: 'krokodil', e: '🐊', s: ['kro', 'ko', 'dil'] },
  { w: 'paraply', e: '☂️', s: ['pa', 'ra', 'ply'] },
  { w: 'ananas', e: '🍍', s: ['a', 'na', 'nas'] },
  { w: 'snögubbe', e: '⛄', s: ['snö', 'gub', 'be'] },
  { w: 'sköldpadda', e: '🐢', s: ['sköld', 'pad', 'da'] },
  { w: 'nyckelpiga', e: '🐞', s: ['nyck', 'el', 'pi', 'ga'] },
  { w: 'helikopter', e: '🚁', s: ['he', 'li', 'kop', 'ter'] },
];

export const OPPOSITES = [
  ['stor', 'liten'], ['varm', 'kall'], ['glad', 'ledsen'], ['snabb', 'långsam'], ['ljus', 'mörk'],
  ['upp', 'ner'], ['full', 'tom'], ['gammal', 'ny'], ['våt', 'torr'], ['tung', 'lätt'],
  ['öppen', 'stängd'], ['lång', 'kort'], ['hård', 'mjuk'], ['dag', 'natt'], ['först', 'sist'],
];
export const SYNONYMS = [
  ['glad', 'lycklig'], ['stor', 'enorm'], ['snabb', 'kvick'], ['prata', 'tala'], ['titta', 'se'],
  ['arg', 'sur'], ['rädd', 'skrämd'], ['liten', 'pytte'], ['vacker', 'fin'], ['börja', 'starta'],
  ['sluta', 'avsluta'], ['springa', 'rusa'], ['smart', 'klok'], ['tyst', 'ljudlös'],
];

export const SENTENCES = [
  'Katten sover i solen.',
  'Jag har en röd boll.',
  'Hunden springer fort.',
  'Vi äter glass på sommaren.',
  'Månen lyser på natten.',
  'Min syster läser en bok.',
  'Fågeln bygger ett bo.',
  'Det regnar ute i dag.',
  'Ekorren samlar nötter.',
  'Raketen flyger till månen.',
  'Vi cyklar till skolan.',
  'Morfar odlar tomater.',
];

export const PUNCTUATION = [
  { s: 'Vad heter du', p: '?' },
  { s: 'Hur gammal är du', p: '?' },
  { s: 'Var bor du', p: '?' },
  { s: 'Vilken dag är det i dag', p: '?' },
  { s: 'Jag tycker om äpplen', p: '.' },
  { s: 'Solen skiner', p: '.' },
  { s: 'Vi går till parken', p: '.' },
  { s: 'Hunden heter Sixten', p: '.' },
  { s: 'Akta dig', p: '!' },
  { s: 'Vad roligt det här är', p: '!' },
  { s: 'Hjälp', p: '!' },
  { s: 'Grattis på födelsedagen', p: '!' },
];

export const STORIES = [
  {
    id: 'myran', title: 'Mira och myran', e: '🐜', level: 1,
    text: [
      'Mira är ute i skogen.',
      'Hon ser en liten myra.',
      'Myran bär ett stort barr.',
      'Barret är mycket längre än myran!',
      'Myran slutar inte.',
      'Den bär barret hela vägen hem till stacken.',
      '– Vad stark du är! säger Mira.',
    ],
    questions: [
      { q: 'Var är Mira?', a: 'i skogen', o: ['i skogen', 'på stranden', 'i skolan'] },
      { q: 'Vad bär myran?', a: 'ett barr', o: ['ett barr', 'ett äpple', 'en sten'] },
      { q: 'Vad tycker Mira om myran?', a: 'att den är stark', o: ['att den är stark', 'att den är långsam', 'att den är rädd'] },
    ],
  },
  {
    id: 'regn', title: 'Leo och regnet', e: '🌧️', level: 1,
    text: [
      'Det regnar.',
      'Leo är ledsen.',
      'Han vill gå ut och leka.',
      'Mamma ger honom stövlar och regnjacka.',
      'Nu hoppar Leo i vattenpölar.',
      'Plask, plask!',
      'Leo är glad igen.',
    ],
    questions: [
      { q: 'Varför är Leo ledsen i början?', a: 'det regnar och han vill ut', o: ['det regnar och han vill ut', 'han är hungrig', 'han har tappat sin boll'] },
      { q: 'Vad får Leo av mamma?', a: 'stövlar och regnjacka', o: ['stövlar och regnjacka', 'en glass', 'en bok'] },
      { q: 'Hur känner sig Leo i slutet?', a: 'glad', o: ['glad', 'arg', 'trött'] },
    ],
  },
  {
    id: 'pip', title: 'Roboten Pip', e: '🤖', level: 2,
    text: [
      'Pip är en liten robot som bor i ett klassrum.',
      'Varje kväll, när alla barn har gått hem, vaknar Pip.',
      'En kväll hittar Pip en penna på golvet.',
      'Pip vill hjälpa till. Men vems penna är det?',
      'På pennan står det ett namn: SARA.',
      'Pip rullar till Saras bänk och lägger pennan där.',
      'På morgonen blir Sara jätteglad.',
      '– Någon har hittat min penna! ropar hon.',
      'Pip blinkar lite med sin lampa, men säger ingenting.',
    ],
    questions: [
      { q: 'När vaknar Pip?', a: 'på kvällen', o: ['på kvällen', 'på morgonen', 'mitt på dagen'] },
      { q: 'Hur visste Pip vems pennan var?', a: 'namnet stod på pennan', o: ['namnet stod på pennan', 'Pip gissade', 'läraren sa det'] },
      { q: 'Vad gör Pip när Sara blir glad?', a: 'blinkar med lampan', o: ['blinkar med lampan', 'sjunger en sång', 'pratar med Sara'] },
    ],
  },
  {
    id: 'ekorre', title: 'Ekorren som glömde', e: '🐿️', level: 2,
    text: [
      'Det var höst, och ekorren Ella samlade nötter.',
      'Hon grävde ner dem på massor av ställen i skogen.',
      'När vintern kom var Ella hungrig.',
      'Men var hade hon gömt alla nötter?',
      'Några hittade hon, men många glömde hon bort.',
      'På våren hände något fantastiskt.',
      'Där Ella hade gömt nötter växte små hasselbuskar upp!',
      'Ekorrens glömska blev till nya buskar i skogen.',
    ],
    questions: [
      { q: 'När samlade Ella nötter?', a: 'på hösten', o: ['på hösten', 'på sommaren', 'på våren'] },
      { q: 'När var Ella hungrig?', a: 'på vintern', o: ['på vintern', 'på sommaren', 'på hösten'] },
      { q: 'Vad hände med nötterna hon glömde?', a: 'de blev nya buskar', o: ['de blev nya buskar', 'fåglarna åt upp dem', 'de blev till stenar'] },
    ],
  },
  {
    id: 'manresan', title: 'Månresan', e: '🚀', level: 3,
    text: [
      'Tove och hennes lillebror Sam byggde en raket av en stor kartong.',
      'De målade den silvrig och ritade runda fönster med svart penna.',
      '– Tio, nio, åtta … räknade Tove ända ner till noll.',
      'Sam tryckte på startknappen, som egentligen var en flaskkork.',
      'I fantasin susade de förbi molnen och ut i rymden.',
      'Där var det alldeles svart och fullt av stjärnor.',
      'De landade på månen och hoppade jättehögt, för på månen drar tyngdkraften mycket svagare än på jorden.',
      'Plötsligt ropade pappa: – Middag!',
      'Raketen fick landa snabbt i vardagsrummet.',
      '– Vi åker tillbaka i morgon, viskade Sam.',
    ],
    questions: [
      { q: 'Vad var raketen gjord av?', a: 'kartong', o: ['kartong', 'metall', 'trä'] },
      { q: 'Varför kunde de hoppa så högt på månen?', a: 'tyngdkraften är svagare där', o: ['tyngdkraften är svagare där', 'de hade fjädrar i skorna', 'månen är mjuk'] },
      { q: 'Varför åkte de hem igen?', a: 'pappa ropade att det var middag', o: ['pappa ropade att det var middag', 'raketen gick sönder', 'det blev natt'] },
    ],
  },
  {
    id: 'maskros', title: 'Maskrosen i asfalten', e: '🌼', level: 3,
    text: [
      'Utanför Omars skola fanns bara grå asfalt.',
      'En dag såg Omar en liten maskros som växte i en spricka.',
      '– Hur kan en blomma växa här? undrade han.',
      'Fröken förklarade att maskrosens frö hade flugit dit med vinden, som en pytteliten fallskärm.',
      'I sprickan fanns lite jord och regnvatten. Det räckte!',
      'Omar och hans klass bestämde sig för att hjälpa naturen.',
      'De planterade blommor i stora lådor och byggde ett insektshotell.',
      'Snart surrade bin och humlor runt skolgården.',
      '– Vår grå skolgård har blivit grön, sa Omar stolt.',
    ],
    questions: [
      { q: 'Hur kom maskrosfröet till sprickan?', a: 'med vinden', o: ['med vinden', 'någon planterade det', 'en mask bar dit det'] },
      { q: 'Vad behövde maskrosen för att växa?', a: 'jord och vatten', o: ['jord och vatten', 'sand och is', 'ingenting alls'] },
      { q: 'Vad byggde klassen åt insekterna?', a: 'ett insektshotell', o: ['ett insektshotell', 'ett fågelbo', 'en damm'] },
    ],
  },
{
  "id": "bollhjalp",
  "title": "Bollen under stolen",
  "e": "⚽",
  "level": 0,
  "text": [
    "Liv har en boll.",
    "Bollen rullar under en stol.",
    "Liv böjer sig ner.",
    "Hon tar fram bollen.",
    "Nu kan hon leka igen."
  ],
  "questions": [
    {
      "q": "Vad har Liv?",
      "a": "en boll",
      "o": [
        "en boll",
        "en bok",
        "en sko"
      ],
      "explain": "I berättelsen står det: Liv har en boll."
    },
    {
      "q": "Var hamnar bollen?",
      "a": "under en stol",
      "o": [
        "under en stol",
        "i en väska",
        "på ett bord"
      ],
      "explain": "I berättelsen står det: Bollen rullar under en stol."
    },
    {
      "q": "Vad gör Liv för att nå bollen?",
      "a": "böjer sig ner",
      "o": [
        "böjer sig ner",
        "hoppar upp",
        "somnar"
      ],
      "explain": "I berättelsen står det: Liv böjer sig ner."
    }
  ]
},
{
  "id": "tva-koppar",
  "title": "Två koppar",
  "e": "☕",
  "level": 0,
  "text": [
    "Bo dukar.",
    "Han ställer fram två koppar.",
    "En kopp är gul.",
    "En kopp är blå.",
    "Bo ger den blå koppen till Kim."
  ],
  "questions": [
    {
      "q": "Hur många koppar finns det?",
      "a": "två",
      "o": [
        "två",
        "en",
        "tre"
      ],
      "explain": "I berättelsen står det: Han ställer fram två koppar."
    },
    {
      "q": "Vilken kopp får Kim?",
      "a": "den blå",
      "o": [
        "den blå",
        "den gula",
        "den röda"
      ],
      "explain": "I berättelsen står det: Bo ger den blå koppen till Kim."
    },
    {
      "q": "Vad gör Bo?",
      "a": "dukar",
      "o": [
        "dukar",
        "badar",
        "cyklar"
      ],
      "explain": "I berättelsen står det: Bo dukar."
    }
  ]
},
{
  "id": "froraden",
  "title": "Fröet i krukan",
  "e": "🌱",
  "level": 1,
  "text": [
    "Nora fyller en kruka med jord.",
    "Hon lägger ner ett frö.",
    "Hon vattnar lite och ställer krukan vid fönstret.",
    "Nora tittar i krukan varje dag.",
    "En morgon ser hon två små gröna blad."
  ],
  "questions": [
    {
      "q": "Vad lägger Nora i jorden?",
      "a": "ett frö",
      "o": [
        "ett frö",
        "en sten",
        "en penna"
      ],
      "explain": "I berättelsen står det: Hon lägger ner ett frö."
    },
    {
      "q": "Var står krukan?",
      "a": "vid fönstret",
      "o": [
        "vid fönstret",
        "i garderoben",
        "under sängen"
      ],
      "explain": "I berättelsen står det: Hon vattnar lite och ställer krukan vid fönstret."
    },
    {
      "q": "Vad ser Nora en morgon?",
      "a": "två gröna blad",
      "o": [
        "två gröna blad",
        "en röd boll",
        "en blå kopp"
      ],
      "explain": "I berättelsen står det: En morgon ser hon två små gröna blad."
    }
  ]
},
{
  "id": "bibliotekskort",
  "title": "Boken som väntade",
  "e": "📚",
  "level": 1,
  "text": [
    "Eli går till biblioteket.",
    "Hen vill läsa om havet.",
    "Boken är redan utlånad.",
    "Bibliotekarien skriver upp Eli i kön.",
    "Nästa vecka får Eli ett meddelande: boken har kommit tillbaka!",
    "Nu får Eli låna den."
  ],
  "questions": [
    {
      "q": "Vad vill Eli läsa om?",
      "a": "havet",
      "o": [
        "havet",
        "rymden",
        "fotboll"
      ],
      "explain": "I berättelsen står det: Hen vill läsa om havet."
    },
    {
      "q": "Varför kan Eli inte låna boken direkt?",
      "a": "någon annan har lånat den",
      "o": [
        "någon annan har lånat den",
        "boken saknar sidor",
        "biblioteket är stängt"
      ],
      "explain": "I berättelsen står det: Boken är redan utlånad."
    },
    {
      "q": "Vad betyder meddelandet nästa vecka?",
      "a": "boken finns att låna",
      "o": [
        "boken finns att låna",
        "boken har försvunnit",
        "Eli behöver köpa boken"
      ],
      "explain": "I berättelsen står det: Nästa vecka får Eli ett meddelande: boken har kommit tillbaka!"
    }
  ]
},
{
  "id": "pappersbron",
  "title": "Bron som böjde sig",
  "e": "🌉",
  "level": 2,
  "text": [
    "Alva vill bygga en bro av papper mellan två böcker.",
    "Det platta papperet böjer sig när hon lägger en leksaksbil på det.",
    "Alva viker ett nytt, likadant papper fram och tillbaka som ett dragspel.",
    "Hon lägger det mellan samma böcker och använder samma bil.",
    "Den vikta bron håller bilen.",
    "Alva ritar båda försöken i sin anteckningsbok."
  ],
  "questions": [
    {
      "q": "Vad ändrar Alva i andra försöket?",
      "a": "papperets form",
      "o": [
        "papperets form",
        "bilens storlek",
        "böckernas avstånd"
      ],
      "explain": "I berättelsen står det: Alva viker ett nytt, likadant papper fram och tillbaka som ett dragspel."
    },
    {
      "q": "Vad händer med den platta bron?",
      "a": "den böjer sig",
      "o": [
        "den böjer sig",
        "den flyger iväg",
        "den blir våt"
      ],
      "explain": "I berättelsen står det: Det platta papperet böjer sig när hon lägger en leksaksbil på det."
    },
    {
      "q": "Varför använder Alva samma bil igen?",
      "a": "för att jämföra broarnas former",
      "o": [
        "för att jämföra broarnas former",
        "för att bilen är snabbast",
        "för att ändra två saker samtidigt"
      ],
      "explain": "I berättelsen står det: Hon lägger det mellan samma böcker och använder samma bil."
    }
  ]
},
{
  "id": "spar-i-snon",
  "title": "Spåren vid grinden",
  "e": "🐾",
  "level": 3,
  "text": [
    "Vid grinden ser Aziz små tasspår i snön.",
    "Han tror först att grannens hund har varit där.",
    "Spåren fortsätter under ett mycket lågt staket.",
    "Aziz vet att den stora hunden inte kan komma under staketet.",
    "Då ser han grannens katt krypa fram på samma ställe.",
    "– Jag behöver fler ledtrådar innan jag bestämmer mig, säger han."
  ],
  "questions": [
    {
      "q": "Vad tror Aziz först?",
      "a": "att hunden gjort spåren",
      "o": [
        "att hunden gjort spåren",
        "att en fågel gjort spåren",
        "att snön är målad"
      ],
      "explain": "I berättelsen står det: Han tror först att grannens hund har varit där."
    },
    {
      "q": "Vilken ledtråd talar emot hunden?",
      "a": "staketet är för lågt för hunden",
      "o": [
        "staketet är för lågt för hunden",
        "hunden har tassar",
        "det är vinter"
      ],
      "explain": "I berättelsen står det: Aziz vet att den stora hunden inte kan komma under staketet."
    },
    {
      "q": "Vad gör Aziz när han får nya ledtrådar?",
      "a": "ändrar sin första tanke",
      "o": [
        "ändrar sin första tanke",
        "slutar titta på spåren",
        "målar över spåren"
      ],
      "explain": "I berättelsen står det: – Jag behöver fler ledtrådar innan jag bestämmer mig, säger han."
    }
  ]
},
{
  "id": "klassens-skylt",
  "title": "Skylten med två betydelser",
  "e": "🪧",
  "level": 4,
  "text": [
    "Klassen ska ordna en bytesdag för böcker.",
    "På skylten skriver de: Ta en bok!",
    "När första besökaren kommer tar hon en bok och går.",
    "Noel blir förvånad: – Vi menade att alla skulle lämna en bok också.",
    "Amina pekar på skylten. Där står inget om att lämna något.",
    "Klassen byter text till: Lämna en bok som du läst. Välj sedan en annan bok att ta hem.",
    "Nästa besökare läser skylten, lämnar sin bok och väljer en ny."
  ],
  "questions": [
    {
      "q": "Varför missförstår den första besökaren?",
      "a": "skylten säger bara att ta en bok",
      "o": [
        "skylten säger bara att ta en bok",
        "hon kan inte läsa",
        "hon har aldrig sett en bok"
      ],
      "explain": "I berättelsen står det: Amina pekar på skylten. Där står inget om att lämna något."
    },
    {
      "q": "Vilken ändring gör skylten tydligare?",
      "a": "båda stegen står i texten",
      "o": [
        "båda stegen står i texten",
        "texten blir hemlig",
        "skylten får bara en bild"
      ],
      "explain": "I berättelsen står det: Klassen byter text till: Lämna en bok som du läst. Välj sedan en annan bok att ta hem."
    },
    {
      "q": "Vilken slutsats stöds av händelserna?",
      "a": "tydliga instruktioner behöver ange viktiga steg",
      "o": [
        "tydliga instruktioner behöver ange viktiga steg",
        "besökaren ville förstöra bytesdagen",
        "alla besökare hade samma bok"
      ],
      "explain": "I berättelsen står det: Nästa besökare läser skylten, lämnar sin bok och väljer en ny."
    }
  ]
},
{
  "id": "ryktet-om-parken",
  "title": "Ryktet om parken",
  "e": "🔎",
  "level": 4,
  "text": [
    "I klassens chatt står det att parken ska stänga för alltid.",
    "Meddelandet saknar avsändare och datum.",
    "Maja går till parkens anslagstavla tillsammans med sin pappa.",
    "På skylten står att lekplatsen är stängd måndag till onsdag för att laga en gunga. Resten av parken är öppen.",
    "Skylten har kommunens namn och dagens datum.",
    "Maja skriver ner vad skylten faktiskt säger.",
    "Hon visar texten för sin pappa innan de delar rättelsen."
  ],
  "questions": [
    {
      "q": "Vad är stängt enligt skylten?",
      "a": "lekplatsen måndag till onsdag",
      "o": [
        "lekplatsen måndag till onsdag",
        "hela parken för alltid",
        "biblioteket i en vecka"
      ],
      "explain": "I berättelsen står det: På skylten står att lekplatsen är stängd måndag till onsdag för att laga en gunga. Resten av parken är öppen."
    },
    {
      "q": "Vilken uppgift saknas i chattmeddelandet?",
      "a": "avsändare och datum",
      "o": [
        "avsändare och datum",
        "ordet parken",
        "ett påstående om stängning"
      ],
      "explain": "I berättelsen står det: Meddelandet saknar avsändare och datum."
    },
    {
      "q": "Varför är skylten bättre stöd för rättelsen?",
      "a": "den anger ansvarig avsändare, datum och vad som stängs",
      "o": [
        "den anger ansvarig avsändare, datum och vad som stängs",
        "den är alltid sann för att den är tryckt",
        "den använder färre bokstäver"
      ],
      "explain": "I berättelsen står det: Skylten har kommunens namn och dagens datum."
    }
  ]
}
];

const pictureOpt = (x) => ({ id: x.w, html: `<span class="pic">${x.e}</span>`, say: x.w });
const letterOpt = (l) => ({ id: l, label: l, say: l });

/* ---------- Bokstavsljud: vilken bild börjar på bokstaven? ---------- */
export function genLetterPic(level, rng) {
  const pool = level === 0 ? COMMON.slice(0, 14) : COMMON;
  const target = rng.pick(pool);
  const others = rng.sample(COMMON.filter((a) => a.l !== target.l), level === 0 ? 2 : 3);
  return {
    type: 'choice',
    prompt: `Vilken bild börjar på ${target.l}?`,
    say: `Vilken bild börjar på bokstaven ${target.l}?`,
    visual: `<div class="big-letter">${target.l}<small>${target.l.toLowerCase()}</small></div>`,
    options: rng.shuffle([target, ...others].map((a) => ({ id: a.l, html: `<span class="pic">${a.e}</span>`, say: a.word }))),
    answer: target.l,
    hint: 'Säg orden högt och lyssna på första ljudet.',
    explain: `${target.l} som i ${target.word}.`,
    collect: { set: 'lettersHeard', item: target.l },
  };
}

/* ---------- Första ljudet: vilken bokstav börjar ordet på? ---------- */
export function genFirstSound(level, rng) {
  const pool = level <= 1 ? COMMON : ALPHABET;
  const target = rng.pick(pool);
  const confusable = { B: ['D', 'P'], D: ['B', 'T'], P: ['B', 'T'], M: ['N'], N: ['M'], E: ['Ä', 'I'], Ä: ['E', 'Å'], Å: ['O', 'Ä'], O: ['Å', 'U'], U: ['O', 'Y'], Y: ['U', 'I'], I: ['E', 'Y'], G: ['K', 'J'], K: ['G', 'T'], S: ['F', 'Z'], F: ['V', 'S'], V: ['F', 'W'] };
  let others = level >= 2 && confusable[target.l] ? confusable[target.l].slice(0, 2) : [];
  const rest = rng.shuffle(LETTERS.filter((l) => l !== target.l && !others.includes(l)));
  while (others.length < 2) others.push(rest.pop());
  return {
    type: 'choice',
    prompt: `Vilken bokstav börjar ${target.word} på?`,
    visual: `<div class="pic-big">${target.e}</div>`,
    options: rng.shuffle([target.l, ...others].map(letterOpt)),
    answer: target.l,
    hint: `Säg ${target.word} långsamt. Vilket ljud hör du först?`,
    explain: `${target.word} börjar på ${target.l}.`,
    collect: { set: 'lettersHeard', item: target.l },
  };
}

/* ---------- Rimma ---------- */
export function genRhyme(level, rng) {
  const pair = rng.pick(RHYMES);
  const [a, b] = rng.shuffle(pair);
  const others = rng.sample(RHYMES.filter((p) => p !== pair).flat(), level === 0 ? 1 : 2);
  const useText = level >= 2;
  return {
    type: 'choice',
    prompt: `Vad rimmar på ${a.w}?`,
    visual: `<div class="pic-big">${a.e}${useText ? `<div class="word">${a.w}</div>` : ''}</div>`,
    options: rng.shuffle([b, ...others]).map((x) => (useText ? { id: x.w, html: `<span class="pic sm">${x.e}</span><span>${x.w}</span>`, say: x.w } : pictureOpt(x))),
    answer: b.w,
    hint: 'Ord som rimmar slutar likadant – som hus och mus.',
    explain: `${a.w} och ${b.w} rimmar!`,
  };
}

/* ---------- Klappa stavelser ---------- */
export function genSyllables(level, rng) {
  const pool = level === 0 ? SYLLABLES.filter((s) => s.s.length <= 3) : SYLLABLES;
  const item = rng.pick(pool);
  return {
    type: 'tapcount',
    prompt: `Klappa ${item.w}! Tryck på trumman en gång för varje stavelse.`,
    say: `Klappa ordet ${item.w}. Tryck på trumman en gång för varje stavelse.`,
    visual: `<div class="pic-big">${item.e}${level >= 1 ? `<div class="word">${item.w}</div>` : ''}</div>`,
    answer: item.s.length,
    max: 6,
    sayWord: item.w,
    hint: `Säg ordet långsamt: ${item.s.join(' – ')}.`,
    explain: `${item.s.join(' – ')}. Det är ${item.s.length} stavelse${item.s.length > 1 ? 'r' : ''}.`,
  };
}

/* ---------- Stor & liten bokstav ---------- */
export function genCase(level, rng) {
  const l = rng.pick(level === 0 ? COMMON.slice(0, 16).map((a) => a.l) : LETTERS);
  const lower = l.toLowerCase();
  const tricky = { B: ['d', 'p', 'q'], D: ['b', 'p', 'q'], P: ['q', 'b', 'd'], Q: ['p', 'g', 'b'], N: ['m', 'u', 'h'], M: ['n', 'w'], U: ['n', 'v'], A: ['ä', 'å', 'o'], O: ['ö', 'å', 'a'], Å: ['ä', 'a'], Ä: ['å', 'a'] };
  let others = level >= 1 && tricky[l] ? tricky[l].slice(0, 2) : [];
  const rest = rng.shuffle(LETTERS.map((x) => x.toLowerCase()).filter((x) => x !== lower && !others.includes(x)));
  while (others.length < 2) others.push(rest.pop());
  const reverse = level >= 1 && rng.chance(0.5);
  if (reverse) {
    return {
      type: 'choice', prompt: `Vilken stor bokstav hör ihop med ${lower}?`, say: `Vilken versal hör ihop med den lilla bokstaven ${l}?`,
      visual: `<div class="big-letter">${lower}</div>`,
      options: rng.shuffle([l, ...others.map((x) => x.toUpperCase())]).map(letterOpt), answer: l,
      hint: 'Versaler är stora bokstäver. Gemener är små.', explain: `${l} och ${lower} är samma bokstav.`,
    };
  }
  return {
    type: 'choice', prompt: `Hitta lilla ${l}!`, say: `Hitta den lilla bokstaven ${l}.`,
    visual: `<div class="big-letter">${l}</div>`,
    options: rng.shuffle([lower, ...others]).map((x) => ({ id: x, label: x, say: '' })), answer: lower,
    hint: 'Akta dig för b, d, p och q – de är lätta att blanda ihop!', explain: `${l} och ${lower} är samma bokstav.`,
  };
}

/* ---------- Bygg ordet ---------- */
export function wordsForLevel(level) {
  if (level <= 0) return WORDS.filter((w) => w.w.length <= 3);
  if (level === 1) return WORDS.filter((w) => w.w.length <= 4);
  if (level === 2) return WORDS.filter((w) => w.w.length >= 4 && w.w.length <= 5);
  return WORDS.filter((w) => w.w.length >= 5);
}
export function genBuild(level, rng) {
  const item = rng.pick(wordsForLevel(level));
  const letters = item.w.toUpperCase().split('');
  const extra = level >= 2 ? rng.sample(LETTERS.filter((l) => !letters.includes(l)), 2) : [];
  return {
    type: 'build',
    prompt: 'Bygg ordet!',
    say: `Bygg ordet ${item.w}.`,
    visual: `<div class="pic-big">${item.e}</div>`,
    word: item.w.toUpperCase(),
    tiles: rng.shuffle([...letters, ...extra]),
    sayWord: item.w,
    hint: `Lyssna på ljuden: ${item.w.split('').join(' – ')}.`,
    explain: `${item.w.toUpperCase()} – ${item.w}.`,
  };
}

/* ---------- Läs & välj ---------- */
export function genReadPick(level, rng) {
  const pool = wordsForLevel(Math.max(1, level));
  const item = rng.pick(pool);
  const others = rng.sample(WORDS.filter((w) => w.w !== item.w && w.w[0] === item.w[0]).concat(rng.sample(WORDS.filter((w) => w.w !== item.w), 3)), 2);
  const uniq = [...new Map([item, ...others].map((x) => [x.w, x])).values()];
  while (uniq.length < 3) {
    const x = rng.pick(WORDS);
    if (!uniq.find((u) => u.w === x.w)) uniq.push(x);
  }
  return {
    type: 'choice',
    prompt: 'Läs ordet. Vilken bild passar?',
    visual: `<div class="read-word">${level >= 3 ? item.w : item.w.toUpperCase()}</div>`,
    options: rng.shuffle(uniq.slice(0, 3)).map((x) => ({ id: x.w, html: `<span class="pic">${x.e}</span>`, say: '' })),
    answer: item.w,
    noSpeakVisual: true,
    hint: 'Ljuda bokstav för bokstav och dra ihop ljuden.',
    explain: `Det står ${item.w}.`,
  };
}

/* ---------- Alfabetisk ordning ---------- */
export function genAlphabet(level, rng) {
  if (level >= 3 && rng.chance(0.5)) {
    const picks = rng.sample(WORDS.filter((w, i, arr) => arr.findIndex((x) => x.w[0] === w.w[0]) === i), 4);
    const sorted = picks.slice().sort((a, b) => a.w.localeCompare(b.w, 'sv'));
    return {
      type: 'order',
      prompt: 'Tryck på orden i bokstavsordning (ABC-ordning).',
      items: rng.shuffle(picks).map((p) => ({ id: p.w, html: `<span class="pic sm">${p.e}</span><span>${p.w}</span>`, say: p.w })),
      answerOrder: sorted.map((p) => p.w),
      hint: 'Titta på första bokstaven i varje ord. Kom ihåg: … X Y Z Å Ä Ö.',
      explain: sorted.map((p) => p.w).join(', ') + '.',
    };
  }
  const i = rng.int(0, LETTERS.length - 2);
  const before = level >= 2 && rng.chance(0.4) && i > 0;
  const ans = before ? LETTERS[i - 1] : LETTERS[i + 1];
  const others = rng.sample(LETTERS.filter((l) => l !== ans && l !== LETTERS[i]), 2);
  return {
    type: 'choice',
    prompt: before ? `Vilken bokstav kommer före ${LETTERS[i]}?` : `Vilken bokstav kommer efter ${LETTERS[i]}?`,
    visual: `<div class="alpha-strip">${LETTERS.slice(Math.max(0, i - 3), i).map((l) => `<span class="dim">${level >= 3 ? '·' : l}</span>`).join('')}${before ? '<span class="blank">?</span>' : ''}<span class="cur">${LETTERS[i]}</span>${before ? '' : '<span class="blank">?</span>'}</div>`,
    options: rng.shuffle([ans, ...others]).map(letterOpt),
    answer: ans,
    hint: 'Sjung ABC-sången i huvudet!',
    explain: before ? `${ans} kommer före ${LETTERS[i]}.` : `Efter ${LETTERS[i]} kommer ${ans}.`,
  };
}

/* ---------- Meningar ---------- */
export function genSentence(level, rng) {
  if (rng.chance(0.4)) {
    const item = rng.pick(PUNCTUATION);
    return {
      type: 'choice',
      prompt: 'Vilket tecken ska stå sist i meningen?',
      visual: `<div class="read-word sm">${item.s}<span class="blank">?</span></div>`,
      say: `Vilket tecken ska stå sist? ${item.s}`,
      options: [
        { id: '.', label: '.', say: 'punkt' },
        { id: '?', label: '?', say: 'frågetecken' },
        { id: '!', label: '!', say: 'utropstecken' },
      ],
      answer: item.p,
      hint: 'Är det en fråga? Ett utrop? Eller ett vanligt påstående?',
      explain: { '.': 'Punkt – ett vanligt påstående.', '?': 'Frågetecken – det är en fråga.', '!': 'Utropstecken – ett utrop eller en uppmaning.' }[item.p],
    };
  }
  const s = rng.pick(SENTENCES);
  const words = s.replace('.', '').split(' ');
  return {
    type: 'order',
    prompt: 'Bygg meningen. Tryck på orden i rätt ordning.',
    say: 'Bygg meningen. Tryck på orden i rätt ordning. Tänk på stor bokstav först!',
    items: rng.shuffle(words.map((w, i) => ({ id: `${i}`, label: i === words.length - 1 ? `${w}.` : w, say: w }))),
    answerOrder: words.map((_, i) => `${i}`),
    joiner: ' ',
    hint: 'En mening börjar med stor bokstav och slutar med punkt.',
    explain: s,
  };
}

/* ---------- Ord: motsatser och synonymer ---------- */
export function genWords(level, rng) {
  const opp = level <= 2 || rng.chance(0.6);
  const list = opp ? OPPOSITES : SYNONYMS;
  const pair = rng.shuffle(rng.pick(list));
  const others = rng.sample(list.filter((p) => !p.includes(pair[0])).flat().filter((w) => w !== pair[1]), 2);
  return {
    type: 'choice',
    prompt: opp ? `Vad är motsatsen till "${pair[0]}"?` : `Vilket ord betyder ungefär samma sak som "${pair[0]}"?`,
    visual: `<div class="read-word">${pair[0]}</div>`,
    options: rng.shuffle([pair[1], ...others]).map((w) => ({ id: w, label: w })),
    answer: pair[1],
    hint: opp ? 'En motsats betyder det helt omvända.' : 'Synonymer är ord som betyder nästan samma sak.',
    explain: opp ? `${pair[0]} – ${pair[1]}` : `${pair[0]} och ${pair[1]} betyder nästan samma sak.`,
  };
}


// Originala mikrotexter: all information som behövs finns i själva situationen.
export const CONTEXT_WORDS = [
  [
    0,
    "Mio viskar. Rösten är mycket tyst.",
    "Hur låter Mio?",
    "tyst",
    "högt",
    "som en trumma"
  ],
  [
    0,
    "Koppen är tom. Det finns inget vatten i den.",
    "Vad betyder tom?",
    "utan vatten",
    "full med vatten",
    "trasig"
  ],
  [
    0,
    "Bollen är mjuk. Den går att trycka ihop.",
    "Vilken boll är mjuk?",
    "den som går att trycka ihop",
    "den som är hård som sten",
    "den som saknas"
  ],
  [
    1,
    "Lina skyndar sig. Hon går fort för att hinna till bussen.",
    "Vad betyder skyndar sig?",
    "gör något fort",
    "sover länge",
    "står still"
  ],
  [
    1,
    "Ali lånar en bok. Han ska lämna tillbaka den.",
    "Vad betyder lånar här?",
    "får använda en tid",
    "köper för alltid",
    "kastar bort"
  ],
  [
    1,
    "Sam delar päronet i två lika stora bitar.",
    "Vad betyder lika stora?",
    "samma storlek",
    "olika färg",
    "bara en bit"
  ],
  [
    2,
    "Fatima tvekar mellan två spel. Hon har ännu inte bestämt sig.",
    "Vad betyder tvekar?",
    "är osäker på valet",
    "har redan valt",
    "glömmer reglerna"
  ],
  [
    2,
    "Vägen är hal efter regnet. Skorna glider på den.",
    "Vad betyder hal?",
    "lätt att glida på",
    "full av trappor",
    "helt torr"
  ],
  [
    2,
    "Joel beskriver sin cykel: den är grön och har en korg.",
    "Vad gör han när han beskriver?",
    "berättar hur den är",
    "gömmer den",
    "byter bort den"
  ],
  [
    3,
    "Vera jämför två torn. Hon mäter höjden på båda.",
    "Vad betyder jämför här?",
    "undersöker likheter och skillnader",
    "bygger bara ett torn",
    "river båda utan att titta"
  ],
  [
    3,
    "Nils upptäcker ett mönster: röd, blå, röd, blå.",
    "Vad är ett mönster här?",
    "något som upprepas enligt en regel",
    "bara slumpmässiga färger",
    "en färg som saknas"
  ],
  [
    3,
    "När lampan slocknar föreslår Li att de först kontrollerar batteriet.",
    "Vad gör Li när hon föreslår?",
    "ger en idé om nästa steg",
    "säger att allt är klart",
    "lovar att lampan aldrig slocknar"
  ],
  [
    4,
    "Undersökningen omfattar bara klassens elever. Den säger inget om andra skolor.",
    "Vad betyder omfattar här?",
    "inkluderar",
    "utesluter",
    "avbryter"
  ],
  [
    4,
    "Författaren preciserar tiden: inte på kvällen utan klockan 18.",
    "Vad betyder preciserar?",
    "gör uppgiften mer exakt",
    "tar bort tidsuppgiften",
    "byter ämne"
  ],
  [
    4,
    "Resultatet är preliminärt. Gruppen ska kontrollera det igen innan den är färdig.",
    "Vad betyder preliminärt?",
    "ännu inte slutgiltigt",
    "omöjligt att kontrollera",
    "alltid fel"
  ]
];
export const TEXT_CLUES = [
  [
    0,
    "Det regnar. Isa tar ett paraply.",
    "Vad vill Isa hålla borta?",
    "regnet",
    "solen i texten",
    "sin bok"
  ],
  [
    0,
    "Olle gäspar och lägger huvudet på kudden.",
    "Vad visar att Olle vill vila?",
    "han lägger huvudet på kudden",
    "han hoppar på ett ben",
    "han springer ut"
  ],
  [
    0,
    "Minas händer är kalla. Hon tar på vantar.",
    "Varför tar Mina vantar?",
    "för att värma händerna",
    "för att äta soppa",
    "för att rita på papper"
  ],
  [
    1,
    "Pelle ska måla. Han täcker bordet med gammalt papper.",
    "Varför täcker han bordet?",
    "för att skydda det från färg",
    "för att göra bordet högre",
    "för att färgen ska ta slut"
  ],
  [
    1,
    "Nora ser att växtens jord är torr. Hon hämtar vattenkannan.",
    "Vad tänker Nora göra?",
    "vattna växten",
    "måla krukan",
    "lägga jord i sängen"
  ],
  [
    1,
    "Kim letar efter sin mössa. På hyllan ligger bara en halsduk.",
    "Vad har Kim ännu inte hittat?",
    "mössan",
    "halsduken",
    "hyllan"
  ],
  [
    2,
    "Ella sätter en lapp på sin matlåda: ELLA. Det finns flera likadana lådor.",
    "Varför skriver hon sitt namn?",
    "för att känna igen sin låda",
    "för att maten ska bli varm",
    "för att alla ska få samma namn"
  ],
  [
    2,
    "Båda skorna är leriga efter promenaden. Theo ställer dem på en bricka vid dörren.",
    "Vilket skäl passar bäst?",
    "att samla leran vid dörren",
    "att skorna ska bli större",
    "att brickan ska flyga"
  ],
  [
    2,
    "Gruppen ska bygga ett torn. En håller plattan, en staplar och en hämtar klossar.",
    "Vad visar texten?",
    "de hjälps åt med olika uppgifter",
    "alla staplar samtidigt",
    "ingen använder klossar"
  ],
  [
    3,
    "På lappen står: Träning torsdag kl. 17. På onsdagen väntar ingen vid planen.",
    "Vad förklarar att ingen är där?",
    "träningen är först nästa dag",
    "träningen börjar på onsdag",
    "planen nämns inte"
  ],
  [
    3,
    "Maja testar två pappersflygplan från samma plats. Hon kastar varje modell tre gånger.",
    "Varför gör hon flera kast?",
    "för att jämföra fler resultat",
    "för att ändra startplatsen",
    "för att slippa mäta"
  ],
  [
    3,
    "Först står det att Leo glömt sin nyckel. Sedan knackar han på och väntar.",
    "Varför knackar Leo?",
    "han kan inte låsa upp med sin nyckel",
    "han har redan öppnat dörren",
    "han vill måla dörren"
  ],
  [
    4,
    "En annons säger att alla gillar spelet. Undersökningen frågade bara fem av tillverkarens anställda.",
    "Vilken invändning stöds av texten?",
    "fem anställda visar inte vad alla tycker",
    "ingen anställd har spelat",
    "spelet saknar regler"
  ],
  [
    4,
    "Bussen kom sent samma dag som det regnade. Texten anger ingen orsak till förseningen.",
    "Vad kan vi säkert säga?",
    "regn och försening inträffade samma dag",
    "regnet orsakade förseningen",
    "bussen är alltid sen"
  ],
  [
    4,
    "Sara säger att uppgiften är enkel. Amir har försökt flera gånger och ber om en ledtråd.",
    "Vilken slutsats stöds bäst?",
    "samma uppgift kan upplevas olika",
    "Amir vill aldrig lära sig",
    "Sara har alltid rätt"
  ]
];

function contextChoice(bank, level, rng, inference) {
  const pool = bank.filter((row) => row[0] === Math.max(0, Math.min(4, level)));
  const [, context, question, answer, ...wrong] = rng.pick(pool);
  return {
    type: 'choice', prompt: `${context} ${question}`, say: `${context} ${question}`,
    options: rng.shuffle([answer, ...wrong]).map((label) => ({ id: label, label, say: label })),
    answer, hint: inference ? 'Lyssna på texten igen. Vilken ledtråd hjälper dig?' : 'Lyssna på hela meningen. Den hjälper dig att förstå ordet.',
    explain: `${answer}. ${context}`,
  };
}
export function genContextWords(level, rng) { return contextChoice(CONTEXT_WORDS, level, rng, false); }
export function genTextClues(level, rng) { return contextChoice(TEXT_CLUES, level, rng, true); }

export const svenskaApp = {
  id: 'svenska',
  name: 'Svenska',
  icon: '📖',
  color: '#f2545b',
  tagline: 'Ljud, bokstäver, ord och sagor',
  modules: [
    { id: 'letterpic', name: 'Bokstavsljud', icon: '🔤', minLevel: 0, maxLevel: 2, gen: genLetterPic, lgr: ['sv-ljud', 'sv-fsk'] },
    { id: 'rhyme', name: 'Rimma', icon: '🎵', minLevel: 0, gen: genRhyme, lgr: ['sv-fsk', 'sv-avkoda'] },
    { id: 'syllables', name: 'Klappa stavelser', icon: '🥁', minLevel: 0, gen: genSyllables, lgr: ['sv-avkoda'] },
    { id: 'firstsound', name: 'Första ljudet', icon: '👂', minLevel: 0, gen: genFirstSound, lgr: ['sv-ljud'] },
    { id: 'case', name: 'Stor & liten', icon: '🅰️', minLevel: 0, gen: genCase, lgr: ['sv-regler'] },
    { id: 'build', name: 'Bygg ordet', icon: '🧩', minLevel: 1, gen: genBuild, lgr: ['sv-skriva', 'sv-ljud'] },
    { id: 'readpick', name: 'Läs & välj', icon: '👀', minLevel: 1, gen: genReadPick, lgr: ['sv-avkoda'] },
    { id: 'alphabet', name: 'ABC-ordning', icon: '🔠', minLevel: 1, gen: genAlphabet, lgr: ['sv-alfabet'] },
    { id: 'stories', name: 'Berättelser', icon: '📚', minLevel: 0, view: 'stories', lgr: ['sv-avkoda', 'sv-text'] },
    { id: 'sentence', name: 'Meningar', icon: '✍️', minLevel: 2, gen: genSentence, lgr: ['sv-regler', 'sv-skriva'] },
    { id: 'contextwords', name: 'Ord i vardagen', icon: '💬', minLevel: 0, gen: genContextWords, lgr: ['sv-ord', 'sv-text'] },
    { id: 'textclues', name: 'Textens ledtrådar', icon: '🔎', minLevel: 0, gen: genTextClues, lgr: ['sv-text'] },
    { id: 'words', name: 'Ordskatten', icon: '💎', minLevel: 2, gen: genWords, lgr: ['sv-ord'] },
  ],
};
