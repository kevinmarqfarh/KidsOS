// Originala leksaker och berättelsefrön. Allt finns lokalt; inga slumpköp eller riktiga pengar.
export const STUDIO_ITEMS = [
  { id: 'cloud-sofa', name: 'Molnsoffa', category: 'möbler', price: 3, theme: 'cozy', color: '#eda892', shape: 'sofa', width: 24, height: 23 },
  { id: 'sun-bed', name: 'Solstrålesäng', category: 'möbler', price: 4, theme: 'cozy', color: '#eda892', shape: 'bed', width: 28, height: 22 },
  { id: 'moon-lamp', name: 'Månlampa', category: 'dekoration', price: 5, theme: 'cozy', color: '#eda892', shape: 'lamp', width: 10, height: 30 },
  { id: 'round-table', name: 'Runt fikabord', category: 'möbler', price: 6, theme: 'cozy', color: '#eda892', shape: 'table', width: 24, height: 23 },
  { id: 'book-shelf', name: 'Sagohylla', category: 'möbler', price: 7, theme: 'cozy', color: '#eda892', shape: 'shelf', width: 18, height: 40 },
  { id: 'leaf-plant', name: 'Bladkompis', category: 'dekoration', price: 3, theme: 'cozy', color: '#eda892', shape: 'plant', width: 12, height: 18 },
  { id: 'soft-rug', name: 'Mjuk regnbågsmatta', category: 'dekoration', price: 4, theme: 'cozy', color: '#eda892', shape: 'rug', width: 30, height: 12 },
  { id: 'star-cushion', name: 'Stjärnkudde', category: 'dekoration', price: 5, theme: 'cozy', color: '#eda892', shape: 'cushion', width: 12, height: 18 },
  { id: 'moss-sofa', name: 'Mosssoffa', category: 'möbler', price: 3, theme: 'forest', color: '#80b68c', shape: 'sofa', width: 24, height: 23 },
  { id: 'acorn-table', name: 'Ekollonbord', category: 'möbler', price: 4, theme: 'forest', color: '#80b68c', shape: 'table', width: 24, height: 23 },
  { id: 'fern-plant', name: 'Ormbunke', category: 'dekoration', price: 5, theme: 'forest', color: '#80b68c', shape: 'plant', width: 12, height: 18 },
  { id: 'forest-rug', name: 'Stigmatta', category: 'dekoration', price: 6, theme: 'forest', color: '#80b68c', shape: 'rug', width: 30, height: 12 },
  { id: 'bird-art', name: 'Fågeltavla', category: 'dekoration', price: 7, theme: 'forest', color: '#80b68c', shape: 'art', width: 15, height: 19 },
  { id: 'pine-shelf', name: 'Kottehylla', category: 'möbler', price: 3, theme: 'forest', color: '#80b68c', shape: 'shelf', width: 18, height: 40 },
  { id: 'forest-lamp', name: 'Gläntans lampa', category: 'dekoration', price: 4, theme: 'forest', color: '#80b68c', shape: 'lamp', width: 10, height: 30 },
  { id: 'leaf-cushion', name: 'Lövkudde', category: 'dekoration', price: 5, theme: 'forest', color: '#80b68c', shape: 'cushion', width: 12, height: 18 },
  { id: 'lab-table', name: 'Forskarbord', category: 'möbler', price: 3, theme: 'science', color: '#8bc4cf', shape: 'table', width: 24, height: 23 },
  { id: 'microscope', name: 'Mikroskop', category: 'lek', price: 4, theme: 'science', color: '#8bc4cf', shape: 'microscope', width: 12, height: 18 },
  { id: 'flask', name: 'Bubbelkolv', category: 'lek', price: 5, theme: 'science', color: '#8bc4cf', shape: 'flask', width: 12, height: 18 },
  { id: 'magnet', name: 'Hästskomagnet', category: 'lek', price: 6, theme: 'science', color: '#8bc4cf', shape: 'magnet', width: 12, height: 18 },
  { id: 'lab-shelf', name: 'Provhylla', category: 'möbler', price: 7, theme: 'science', color: '#8bc4cf', shape: 'shelf', width: 18, height: 40 },
  { id: 'scale', name: 'Balansvåg', category: 'lek', price: 3, theme: 'science', color: '#8bc4cf', shape: 'scale', width: 12, height: 18 },
  { id: 'science-art', name: 'Frågetavla', category: 'dekoration', price: 4, theme: 'science', color: '#8bc4cf', shape: 'art', width: 15, height: 19 },
  { id: 'lab-lamp', name: 'Undersökningslampa', category: 'dekoration', price: 5, theme: 'science', color: '#8bc4cf', shape: 'lamp', width: 10, height: 30 },
  { id: 'telescope', name: 'Stjärnkikare', category: 'lek', price: 3, theme: 'space', color: '#aaa0dd', shape: 'telescope', width: 12, height: 18 },
  { id: 'rocket-model', name: 'Modellraket', category: 'lek', price: 4, theme: 'space', color: '#aaa0dd', shape: 'rocket', width: 12, height: 18 },
  { id: 'planet-mobile', name: 'Planetmobil', category: 'dekoration', price: 5, theme: 'space', color: '#aaa0dd', shape: 'mobile', width: 12, height: 18 },
  { id: 'orbit-rug', name: 'Omloppsmatta', category: 'dekoration', price: 6, theme: 'space', color: '#aaa0dd', shape: 'rug', width: 30, height: 12 },
  { id: 'space-bed', name: 'Raketsäng', category: 'möbler', price: 7, theme: 'space', color: '#aaa0dd', shape: 'bed', width: 28, height: 22 },
  { id: 'moon-art', name: 'Månfaser', category: 'dekoration', price: 3, theme: 'space', color: '#aaa0dd', shape: 'art', width: 15, height: 19 },
  { id: 'star-lamp', name: 'Stjärnljus', category: 'dekoration', price: 4, theme: 'space', color: '#aaa0dd', shape: 'lamp', width: 10, height: 30 },
  { id: 'space-shelf', name: 'Rymdhylla', category: 'möbler', price: 5, theme: 'space', color: '#aaa0dd', shape: 'shelf', width: 18, height: 40 },
  { id: 'piano', name: 'Litet piano', category: 'lek', price: 3, theme: 'music', color: '#efb362', shape: 'piano', width: 12, height: 18 },
  { id: 'drum', name: 'Rytmtrumma', category: 'lek', price: 4, theme: 'music', color: '#efb362', shape: 'drum', width: 12, height: 18 },
  { id: 'guitar', name: 'Solgitarr', category: 'lek', price: 5, theme: 'music', color: '#efb362', shape: 'guitar', width: 12, height: 18 },
  { id: 'speaker', name: 'Musikhögtalare', category: 'lek', price: 6, theme: 'music', color: '#efb362', shape: 'speaker', width: 12, height: 18 },
  { id: 'music-rug', name: 'Dansmatta', category: 'dekoration', price: 7, theme: 'music', color: '#efb362', shape: 'rug', width: 30, height: 12 },
  { id: 'note-art', name: 'Meloditavla', category: 'dekoration', price: 3, theme: 'music', color: '#efb362', shape: 'art', width: 15, height: 19 },
  { id: 'music-sofa', name: 'Lyssnarsoffa', category: 'möbler', price: 4, theme: 'music', color: '#efb362', shape: 'sofa', width: 24, height: 23 },
  { id: 'music-lamp', name: 'Scenlampa', category: 'dekoration', price: 5, theme: 'music', color: '#efb362', shape: 'lamp', width: 10, height: 30 },
  { id: 'easel', name: 'Målarstaffli', category: 'lek', price: 3, theme: 'art', color: '#e5a3c5', shape: 'easel', width: 12, height: 18 },
  { id: 'paint-jars', name: 'Färgburkar', category: 'lek', price: 4, theme: 'art', color: '#e5a3c5', shape: 'paint', width: 12, height: 18 },
  { id: 'art-table', name: 'Skaparverkstad', category: 'möbler', price: 5, theme: 'art', color: '#e5a3c5', shape: 'table', width: 24, height: 23 },
  { id: 'art-shelf', name: 'Materialhylla', category: 'möbler', price: 6, theme: 'art', color: '#e5a3c5', shape: 'shelf', width: 18, height: 40 },
  { id: 'rainbow-art', name: 'Regnbågstavla', category: 'dekoration', price: 7, theme: 'art', color: '#e5a3c5', shape: 'art', width: 15, height: 19 },
  { id: 'art-rug', name: 'Prickmatta', category: 'dekoration', price: 3, theme: 'art', color: '#e5a3c5', shape: 'rug', width: 30, height: 12 },
  { id: 'clay', name: 'Lerfigur', category: 'lek', price: 4, theme: 'art', color: '#e5a3c5', shape: 'sculpture', width: 12, height: 18 },
  { id: 'art-lamp', name: 'Ateljélampa', category: 'dekoration', price: 5, theme: 'art', color: '#e5a3c5', shape: 'lamp', width: 10, height: 30 },
  { id: 'reading-chair', name: 'Lässtol', category: 'möbler', price: 3, theme: 'library', color: '#bd9a78', shape: 'chair', width: 13, height: 26 },
  { id: 'library-shelf', name: 'Upptäckarhylla', category: 'möbler', price: 4, theme: 'library', color: '#bd9a78', shape: 'shelf', width: 18, height: 40 },
  { id: 'book-stack', name: 'Boktrave', category: 'lek', price: 5, theme: 'library', color: '#bd9a78', shape: 'books', width: 12, height: 18 },
  { id: 'writing-table', name: 'Skrivbord', category: 'möbler', price: 6, theme: 'library', color: '#bd9a78', shape: 'table', width: 24, height: 23 },
  { id: 'globe', name: 'Jordglob', category: 'lek', price: 7, theme: 'library', color: '#bd9a78', shape: 'globe', width: 12, height: 18 },
  { id: 'reading-lamp', name: 'Läslampa', category: 'dekoration', price: 3, theme: 'library', color: '#bd9a78', shape: 'lamp', width: 10, height: 30 },
  { id: 'letter-art', name: 'Bokstavstavla', category: 'dekoration', price: 4, theme: 'library', color: '#bd9a78', shape: 'art', width: 15, height: 19 },
  { id: 'reading-cushion', name: 'Läskudde', category: 'dekoration', price: 5, theme: 'library', color: '#bd9a78', shape: 'cushion', width: 12, height: 18 },
  { id: 'kitchen-table', name: 'Smakbord', category: 'möbler', price: 3, theme: 'kitchen', color: '#f3cd7a', shape: 'table', width: 24, height: 23 },
  { id: 'stove', name: 'Leksaksspis', category: 'möbler', price: 4, theme: 'kitchen', color: '#f3cd7a', shape: 'stove', width: 12, height: 18 },
  { id: 'fridge', name: 'Kylskåp', category: 'möbler', price: 5, theme: 'kitchen', color: '#f3cd7a', shape: 'fridge', width: 15, height: 35 },
  { id: 'fruit-bowl', name: 'Fruktskål', category: 'lek', price: 6, theme: 'kitchen', color: '#f3cd7a', shape: 'bowl', width: 12, height: 18 },
  { id: 'kitchen-shelf', name: 'Receptshylla', category: 'möbler', price: 7, theme: 'kitchen', color: '#f3cd7a', shape: 'shelf', width: 18, height: 40 },
  { id: 'teapot', name: 'Tekanna', category: 'lek', price: 3, theme: 'kitchen', color: '#f3cd7a', shape: 'teapot', width: 12, height: 18 },
  { id: 'kitchen-rug', name: 'Rutmatta', category: 'dekoration', price: 4, theme: 'kitchen', color: '#f3cd7a', shape: 'rug', width: 30, height: 12 },
  { id: 'recipe-art', name: 'Receptstavla', category: 'dekoration', price: 5, theme: 'kitchen', color: '#f3cd7a', shape: 'art', width: 15, height: 19 },
  { id: 'computer', name: 'Kompisdator', category: 'lek', price: 3, theme: 'code', color: '#74bbbc', shape: 'computer', width: 12, height: 18 },
  { id: 'robot', name: 'Kodrobot', category: 'lek', price: 4, theme: 'code', color: '#74bbbc', shape: 'robot', width: 12, height: 18 },
  { id: 'code-table', name: 'Uppfinnarens bord', category: 'möbler', price: 5, theme: 'code', color: '#74bbbc', shape: 'table', width: 24, height: 23 },
  { id: 'code-shelf', name: 'Prototyphylla', category: 'möbler', price: 6, theme: 'code', color: '#74bbbc', shape: 'shelf', width: 18, height: 40 },
  { id: 'circuit-art', name: 'Algoritmtavla', category: 'dekoration', price: 7, theme: 'code', color: '#74bbbc', shape: 'art', width: 15, height: 19 },
  { id: 'code-lamp', name: 'Idélampa', category: 'dekoration', price: 3, theme: 'code', color: '#74bbbc', shape: 'lamp', width: 10, height: 30 },
  { id: 'code-rug', name: 'Rutnätsmatta', category: 'dekoration', price: 4, theme: 'code', color: '#74bbbc', shape: 'rug', width: 30, height: 12 },
  { id: 'code-cushion', name: 'Pixelkudde', category: 'dekoration', price: 5, theme: 'code', color: '#74bbbc', shape: 'cushion', width: 12, height: 18 },
  { id: 'ai-computer', name: 'Mönsterdator', category: 'lek', price: 3, theme: 'ai', color: '#b6a0de', shape: 'computer', width: 12, height: 18 },
  { id: 'ai-robot', name: 'Mönsterkompis', category: 'lek', price: 4, theme: 'ai', color: '#b6a0de', shape: 'robot', width: 12, height: 18 },
  { id: 'ai-table', name: 'Testbord', category: 'möbler', price: 5, theme: 'ai', color: '#b6a0de', shape: 'table', width: 24, height: 23 },
  { id: 'ai-shelf', name: 'Exempelhylla', category: 'möbler', price: 6, theme: 'ai', color: '#b6a0de', shape: 'shelf', width: 18, height: 40 },
  { id: 'ai-art', name: 'Fråga och kontrollera', category: 'dekoration', price: 7, theme: 'ai', color: '#b6a0de', shape: 'art', width: 15, height: 19 },
  { id: 'ai-lamp', name: 'Tankelampa', category: 'dekoration', price: 3, theme: 'ai', color: '#b6a0de', shape: 'lamp', width: 10, height: 30 },
  { id: 'ai-rug', name: 'Mönstermatta', category: 'dekoration', price: 4, theme: 'ai', color: '#b6a0de', shape: 'rug', width: 30, height: 12 },
  { id: 'ai-cushion', name: 'Pratbubbelkudde', category: 'dekoration', price: 5, theme: 'ai', color: '#b6a0de', shape: 'cushion', width: 12, height: 18 },
];
export const STUDIO_ROOMS = [
  { id: 'cozy', name: 'Mysrummet', wall: '#eda892', floor: '#ead4b9', price: 0, starter: true },
  { id: 'forest', name: 'Skogsgläntan', wall: '#80b68c', floor: '#ead4b9', price: 11, starter: false, requirement: { app: 'biology', module: 'seasons', rounds: 1 } },
  { id: 'science', name: 'Upptäckarlabbet', wall: '#8bc4cf', floor: '#ead4b9', price: 12, starter: false, requirement: { app: 'science', module: 'investigate', rounds: 1 } },
  { id: 'space', name: 'Stjärnstationen', wall: '#aaa0dd', floor: '#ead4b9', price: 13, starter: false, requirement: { app: 'space', module: 'quiz', rounds: 1 } },
  { id: 'music', name: 'Musikstudion', wall: '#efb362', floor: '#ead4b9', price: 14, starter: false, requirement: { app: 'svenska', module: 'syllables', rounds: 1 } },
  { id: 'art', name: 'Färgatéljén', wall: '#e5a3c5', floor: '#ead4b9', price: 15, starter: false, requirement: { app: 'math', module: 'shapes', rounds: 1 } },
  { id: 'library', name: 'Sagobiblioteket', wall: '#bd9a78', floor: '#ead4b9', price: 16, starter: false, requirement: { app: 'svenska', module: 'textclues', rounds: 1 } },
  { id: 'kitchen', name: 'Smakverkstan', wall: '#f3cd7a', floor: '#ead4b9', price: 17, starter: false, requirement: { app: 'math', module: 'everyday', rounds: 1 } },
  { id: 'code', name: 'Uppfinnarrummet', wall: '#74bbbc', floor: '#ead4b9', price: 18, starter: false, requirement: { app: 'code', module: 'algorithms', rounds: 1 } },
  { id: 'ai', name: 'Mönsterlabbet', wall: '#b6a0de', floor: '#ead4b9', price: 19, starter: false, requirement: { app: 'ai', module: 'meaning', rounds: 1 } },
];
export const STUDIO_PACKS = [
  { id: 'forest-pack', name: 'Skogsgläntan – saker', theme: 'forest', price: 12, items: ['moss-sofa', 'acorn-table', 'fern-plant', 'forest-rug', 'bird-art', 'pine-shelf', 'forest-lamp', 'leaf-cushion'], requirement: { app: 'biology', module: 'seasons', rounds: 1 } },
  { id: 'science-pack', name: 'Upptäckarlabbet – saker', theme: 'science', price: 14, items: ['lab-table', 'microscope', 'flask', 'magnet', 'lab-shelf', 'scale', 'science-art', 'lab-lamp'], requirement: { app: 'science', module: 'investigate', rounds: 1 } },
  { id: 'space-pack', name: 'Stjärnstationen – saker', theme: 'space', price: 16, items: ['telescope', 'rocket-model', 'planet-mobile', 'orbit-rug', 'space-bed', 'moon-art', 'star-lamp', 'space-shelf'], requirement: { app: 'space', module: 'quiz', rounds: 1 } },
  { id: 'music-pack', name: 'Musikstudion – saker', theme: 'music', price: 18, items: ['piano', 'drum', 'guitar', 'speaker', 'music-rug', 'note-art', 'music-sofa', 'music-lamp'], requirement: { app: 'svenska', module: 'syllables', rounds: 1 } },
  { id: 'art-pack', name: 'Färgatéljén – saker', theme: 'art', price: 20, items: ['easel', 'paint-jars', 'art-table', 'art-shelf', 'rainbow-art', 'art-rug', 'clay', 'art-lamp'], requirement: { app: 'math', module: 'shapes', rounds: 1 } },
  { id: 'library-pack', name: 'Sagobiblioteket – saker', theme: 'library', price: 22, items: ['reading-chair', 'library-shelf', 'book-stack', 'writing-table', 'globe', 'reading-lamp', 'letter-art', 'reading-cushion'], requirement: { app: 'svenska', module: 'textclues', rounds: 1 } },
  { id: 'kitchen-pack', name: 'Smakverkstan – saker', theme: 'kitchen', price: 24, items: ['kitchen-table', 'stove', 'fridge', 'fruit-bowl', 'kitchen-shelf', 'teapot', 'kitchen-rug', 'recipe-art'], requirement: { app: 'math', module: 'everyday', rounds: 1 } },
  { id: 'code-pack', name: 'Uppfinnarrummet – saker', theme: 'code', price: 26, items: ['computer', 'robot', 'code-table', 'code-shelf', 'circuit-art', 'code-lamp', 'code-rug', 'code-cushion'], requirement: { app: 'code', module: 'algorithms', rounds: 1 } },
  { id: 'ai-pack', name: 'Mönsterlabbet – saker', theme: 'ai', price: 28, items: ['ai-computer', 'ai-robot', 'ai-table', 'ai-shelf', 'ai-art', 'ai-lamp', 'ai-rug', 'ai-cushion'], requirement: { app: 'ai', module: 'meaning', rounds: 1 } },
];
export const STORY_PROMPTS = [
  { id: 'cozy-story-1', title: 'Välkommen hem', text: 'En vän kommer på besök. Gör en plats där ni båda trivs.', theme: 'cozy', minLevel: 0 },
  { id: 'cozy-story-2', title: 'En lugn hörna', text: 'Din figur behöver vila efter en stor dag. Ordna en lugn hörna.', theme: 'cozy', minLevel: 0 },
  { id: 'cozy-story-3', title: 'Två vänners önskningar', text: 'Låt två figurer turas om att berätta vad de gillar i rummet.', theme: 'cozy', minLevel: 1 },
  { id: 'cozy-story-4', title: 'Fest för alla', text: 'Planera en fest där någon som gillar lugn också känner sig välkommen.', theme: 'cozy', minLevel: 2 },
  { id: 'forest-story-1', title: 'Utforskarens koja', text: 'Skapa en koja där en liten skogsutforskare kan vila.', theme: 'forest', minLevel: 0 },
  { id: 'forest-story-2', title: 'Skydd från regnet', text: 'Låtsas att det regnar. Var kan figurerna ta skydd?', theme: 'forest', minLevel: 0 },
  { id: 'forest-story-3', title: 'Fågelskådarnas gömställe', text: 'Inred ett rum för att titta på fåglar utan att störa dem.', theme: 'forest', minLevel: 1 },
  { id: 'forest-story-4', title: 'När skogen byter årstid', text: 'Berätta om en skog där årstiden just har ändrats.', theme: 'forest', minLevel: 2 },
  { id: 'science-story-1', title: 'Det flytande mysteriet', text: 'Din figur undrar varför något flyter. Bygg en undersökningsplats.', theme: 'science', minLevel: 0 },
  { id: 'science-story-2', title: 'Forskarna som tyckte olika', text: 'Två forskare tycker olika. Låt dem testa en idé tillsammans.', theme: 'science', minLevel: 0 },
  { id: 'science-story-3', title: 'Ordning i labbet', text: 'Ordna ett labb där saker går att jämföra och sortera.', theme: 'science', minLevel: 1 },
  { id: 'science-story-4', title: 'Från fråga till upptäckt', text: 'Hitta på en fråga, ett test och vad figurerna upptäcker.', theme: 'science', minLevel: 2 },
  { id: 'space-story-1', title: 'Packa för månen', text: 'Förbered ett rum för en resa till månen.', theme: 'space', minLevel: 0 },
  { id: 'space-story-2', title: 'Kvällen vid stjärnkikaren', text: 'Låt en astronaut visa en vän stjärnkikaren.', theme: 'space', minLevel: 0 },
  { id: 'space-story-3', title: 'Vila bland stjärnorna', text: 'Skapa sovplatser för en besättning på en lång resa.', theme: 'space', minLevel: 1 },
  { id: 'space-story-4', title: 'Besättningens gemensamma plan', text: 'Berätta hur besättningen löser ett problem tillsammans.', theme: 'space', minLevel: 2 },
  { id: 'music-story-1', title: 'Trummisens första scen', text: 'Gör en scen för en vän som vill spela trumma.', theme: 'music', minLevel: 0 },
  { id: 'music-story-2', title: 'Dansen som alla skapade', text: 'Skapa en dans där figurerna turas om att hitta på rörelser.', theme: 'music', minLevel: 0 },
  { id: 'music-story-3', title: 'Lugnet bredvid scenen', text: 'Ordna en lugn plats bredvid musikscenen.', theme: 'music', minLevel: 1 },
  { id: 'music-story-4', title: 'Vår första konsert', text: 'Planera en konsert med början, paus och slut.', theme: 'music', minLevel: 2 },
  { id: 'art-story-1', title: 'Öppna vår utställning', text: 'Ordna en utställning för dina figurers konstverk.', theme: 'art', minLevel: 0 },
  { id: 'art-story-2', title: 'Prickar möter ränder', text: 'En figur gillar prickar och en gillar ränder. Skapa tillsammans.', theme: 'art', minLevel: 0 },
  { id: 'art-story-3', title: 'Alla hittar sin pensel', text: 'Gör en ateljé där alla hittar sitt material.', theme: 'art', minLevel: 1 },
  { id: 'art-story-4', title: 'Bilden som berättar', text: 'Hitta på ett konstverk som berättar något utan ord.', theme: 'art', minLevel: 2 },
  { id: 'library-story-1', title: 'Sagans mjuka hörna', text: 'Bygg en mjuk plats för en saga.', theme: 'library', minLevel: 0 },
  { id: 'library-story-2', title: 'Boken jag vill hitta', text: 'Låt en figur låna en bok och berätta vad den hoppas hitta.', theme: 'library', minLevel: 0 },
  { id: 'library-story-3', title: 'Fråga bibliotekarien', text: 'Ordna ett bibliotek där någon lätt kan be om hjälp.', theme: 'library', minLevel: 1 },
  { id: 'library-story-4', title: 'Sagan vi skriver tillsammans', text: 'Skapa början på en saga och låt en annan figur fortsätta.', theme: 'library', minLevel: 2 },
  { id: 'kitchen-story-1', title: 'Picknick för två', text: 'Duka en låtsaspicknick för två vänner.', theme: 'kitchen', minLevel: 0 },
  { id: 'kitchen-story-2', title: 'Ett bord för olika smaker', text: 'Alla gillar olika mat. Ordna ett bord där alla får plats.', theme: 'kitchen', minLevel: 0 },
  { id: 'kitchen-story-3', title: 'Kockens tydliga recept', text: 'Låt kocken förklara ett recept i rätt ordning.', theme: 'kitchen', minLevel: 1 },
  { id: 'kitchen-story-4', title: 'Dela vid middagsbordet', text: 'Planera en måltid och berätta hur figurerna delar rättvist.', theme: 'kitchen', minLevel: 2 },
  { id: 'code-story-1', title: 'Robotens första hem', text: 'Bygg ett hem för en robot som behöver tydliga instruktioner.', theme: 'code', minLevel: 0 },
  { id: 'code-story-2', title: 'Tre steg för roboten', text: 'Låt en figur ge tre steg som roboten kan följa.', theme: 'code', minLevel: 0 },
  { id: 'code-story-3', title: 'Jakten på felet', text: 'Robotens plan går fel. Berätta hur ni hittar felet.', theme: 'code', minLevel: 1 },
  { id: 'code-story-4', title: 'Uppfinningen blir bättre', text: 'Gör en verkstad där figurerna förbättrar en uppfinning tillsammans.', theme: 'code', minLevel: 2 },
  { id: 'ai-story-1', title: 'Olika exempel för kompisen', text: 'Ordna ett rum där en mönsterkompis får se olika exempel.', theme: 'ai', minLevel: 0 },
  { id: 'ai-story-2', title: 'Det märkliga AI-svaret', text: 'AI-kompisen ger ett konstigt svar. Vem kan figuren fråga?', theme: 'ai', minLevel: 0 },
  { id: 'ai-story-3', title: 'Testa på något nytt', text: 'Låt figurerna testa om deras mönster fungerar på ett nytt exempel.', theme: 'ai', minLevel: 1 },
  { id: 'ai-story-4', title: 'Kontrollera tillsammans', text: 'Berätta varför en dator behöver hjälp av människor för att kontrollera svar.', theme: 'ai', minLevel: 2 },
  { id: 'cozy-story-5', title: 'Rummet där alla får plats', text: 'Tre vänner vill använda samma lilla rum: en behöver lugn, en vill leka och en vill läsa. 1. Låt varje figur beskriva sitt behov. 2. Bygg två olika möbleringar och jämför plats, ljud och rörelse. 3. Välj en lösning och berätta vilken kompromiss vännerna gjorde.', theme: 'cozy', minLevel: 4 },
  { id: 'forest-story-5', title: 'Koja med hänsyn', text: 'Utforskarna vill bygga en låtsaskoja nära fåglarnas bo, men en vän oroar sig för djuren. 1. Beskriv vad varje figur vill skydda. 2. Jämför två platser för kojan och vad som kan hända där. 3. Flytta sakerna och berätta hur planen tar hänsyn till både människor och djur.', theme: 'forest', minLevel: 4 },
  { id: 'science-story-5', title: 'Bevis före gissning', text: 'En forskare tror att stora saker alltid sjunker; en annan är tveksam. 1. Låt dem planera ett låtsastest där de jämför både stora och små saker. 2. Berätta vilka observationer som skulle stödja eller motsäga gissningen. 3. Ordna labbet för ett nytt test där bara en sak ändras åt gången.', theme: 'science', minLevel: 4 },
  { id: 'space-story-5', title: 'Stationens svåra beslut', text: 'Rymdstationen har plats för ett nytt rum: ett vilorum eller ett observationsrum. 1. Låt besättningen förklara båda behovens betydelse. 2. Bygg två förslag och jämför hur vardagen skulle fungera. 3. Välj en lösning och hitta ett sätt att ändå hjälpa den som ville något annat.', theme: 'space', minLevel: 4 },
  { id: 'music-story-5', title: 'Konserten som bytte plan', text: 'En konsert får färre besökare än väntat och några tycker att musiken är för stark. 1. Låt arrangörerna fråga två figurer om deras upplevelser. 2. Prova två scenplaceringar och berätta vad ni skulle lyssna efter. 3. Planera en ny konsert med plats för olika behov och förklara vad ni ändrade.', theme: 'music', minLevel: 4 },
  { id: 'art-story-5', title: 'Samma bild, olika berättelser', text: 'Två besökare tolkar samma tavla på olika sätt. 1. Låt båda beskriva detaljerna som får dem att tänka så. 2. Ordna en utställning där flera tolkningar får plats. 3. Skapa en ny berättelse av bilden och skilj det figurerna ser från det de föreställer sig.', theme: 'art', minLevel: 4 },
  { id: 'library-story-5', title: 'Vems version av sagan?', text: 'Två böcker beskriver samma påhittade händelse ur olika figurers perspektiv. 1. Låt bibliotekarien jämföra vad berättarna var med om. 2. Skapa en scen för varje version och hitta en skillnad. 3. Berätta vad ni behöver fråga för att förstå händelsen bättre.', theme: 'library', minLevel: 4 },
  { id: 'kitchen-story-5', title: 'Middag med en plan', text: 'Fyra vänner ordnar en låtsasmiddag, men tid, plats och önskemål räcker inte till allt. 1. Låt dem komma överens om vad som behövs först. 2. Rita upp arbetsordningen genom att placera figurer vid sina stationer. 3. Jämför två sätt att fördela uppgifterna och berätta varför ett passar bättre.', theme: 'kitchen', minLevel: 4 },
  { id: 'code-story-5', title: 'Instruktionen som missförstods', text: 'Två robotar följer samma plan men hamnar på olika platser eftersom ett steg är otydligt. 1. Spela upp instruktionerna med figurerna och hitta steget. 2. Skriv om det med en tydlig ordning och testa från två startplatser. 3. Berätta vad testet visar och vad ni fortfarande behöver undersöka.', theme: 'code', minLevel: 4 },
  { id: 'ai-story-5', title: 'Rättvist även för nya exempel', text: 'En låtsasmodell känner igen bara de föremål som dess skapare brukar använda. 1. Låt två figurer ge olika exempel och förklara vilka som saknas. 2. Planera ett separat test med nya exempel som inte användes vid träningen. 3. Berätta varför många lyckade försök ändå inte bevisar att modellen alltid har rätt.', theme: 'ai', minLevel: 4 },
];

const itemIds = new Set(STUDIO_ITEMS.map(i => i.id));
const roomIds = new Set(STUDIO_ROOMS.map(i => i.id));
const packIds = new Set(STUDIO_PACKS.map(i => i.id));
const finite = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const bounded = (v, fallback = 50) => Math.max(0, Math.min(100, finite(v, fallback)));
const shortText = (v, fallback) => typeof v === 'string' && v.trim() ? v.trim().slice(0, 60) : fallback;
const color = (v, fallback) => typeof v === 'string' && /^#[a-f\d]{6}$/i.test(v) ? v : fallback;
// inventory räknar totalt ägda exemplar, inklusive föremål placerade i rum.
// Tillgängligt antal = inventory[itemId] minus alla placerade exemplar i samtliga rum.
export function emptyStudio(profile) {
  const inventory = Object.fromEntries(STUDIO_ITEMS.filter(i => i.theme === 'cozy').map(i => [i.id, 1]));
  inventory['fruit-bowl'] = 1; inventory['book-stack'] = 1;
  return { v: 1, rooms: [{ id: 'room-cozy', templateId: 'cozy', name: 'Mitt mysrum', wall: '#eda892', floor: '#ead4b9', placed: [
    { uid: 'start-sofa', itemId: 'cloud-sofa', x: 25, y: 66, flipped: false },
    { uid: 'start-rug', itemId: 'soft-rug', x: 50, y: 85, flipped: false },
    { uid: 'start-plant', itemId: 'leaf-plant', x: 82, y: 65, flipped: false },
  ], characters: [{ id: 'friend-1', x: 48, y: 64 }, { id: 'friend-2', x: 66, y: 67 }] }], activeRoom: 'room-cozy', inventory, unlockedPacks: {}, characters: [
    { id: 'friend-1', name: shortText(profile?.name, 'Kim'), skin: '#c68c68', hair: 'curly', hairColor: '#49352a', shirt: '#77bdb5', pants: '#626ca8', expression: 'happy', wear: {} },
    { id: 'friend-2', name: 'Sam', skin: '#f0c9a4', hair: 'short', hairColor: '#78472b', shirt: '#e9a17d', pants: '#6f8c82', expression: 'happy', wear: {} },
  ], goal: null };
}
export function normalizeStudio(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return emptyStudio();
  const base = emptyStudio();
  const characters = Array.isArray(raw.characters) ? raw.characters.filter(c => c && typeof c.id === 'string').slice(0, 24).map((c, i) => ({
    id: c.id.slice(0, 60), name: shortText(c.name, `Vän ${i + 1}`), skin: color(c.skin, '#f0c9a4'), hair: ['short','long','curly','bun','bald'].includes(c.hair) ? c.hair : 'short', hairColor: color(c.hairColor, '#49352a'), shirt: color(c.shirt, '#77bdb5'), pants: color(c.pants, '#626ca8'), expression: ['happy','calm','surprised','sleepy'].includes(c.expression) ? c.expression : 'happy', wear: c.wear && typeof c.wear === 'object' ? Object.fromEntries(Object.entries(c.wear).filter(([k,v]) => ['head','face','hand','neck'].includes(k) && typeof v === 'string')) : {},
  })).filter((c,i,arr) => arr.findIndex(a=>a.id===c.id)===i) : base.characters;
  const charIds = new Set(characters.map(c => c.id));
  const inventory = {};
  if (raw.inventory && typeof raw.inventory === 'object') for (const [id, count] of Object.entries(raw.inventory)) if (itemIds.has(id) && finite(count) > 0) inventory[id] = Math.min(999, Math.floor(finite(count)));
  const seen = new Set();
  const usage = {};
  const rooms = Array.isArray(raw.rooms) ? raw.rooms.filter(r => r && roomIds.has(r.templateId) && typeof r.id === 'string').slice(0, 10).filter(r => {if(seen.has(r.id)) return false; seen.add(r.id); return true;}).map(r => {
    const template = STUDIO_ROOMS.find(t => t.id === r.templateId);
    const uids = new Set();
    const placed = (Array.isArray(r.placed) ? r.placed : []).filter(p => {
      if (!p || !itemIds.has(p.itemId) || typeof p.uid !== 'string' || uids.has(p.uid) || (usage[p.itemId] || 0) >= (inventory[p.itemId] || 0)) return false;
      uids.add(p.uid); usage[p.itemId] = (usage[p.itemId] || 0) + 1; return true;
    }).map(p => ({uid:p.uid.slice(0,60),itemId:p.itemId,x:bounded(p.x),y:bounded(p.y),flipped:p.flipped === true}));
    return {id:r.id.slice(0,60),templateId:r.templateId,name:shortText(r.name,template.name),wall:color(r.wall,template.wall),floor:color(r.floor,template.floor),placed,characters:(Array.isArray(r.characters)?r.characters:[]).filter(c=>c&&charIds.has(c.id)).filter((c,i,a)=>a.findIndex(x=>x.id===c.id)===i).map(c=>({id:c.id,x:bounded(c.x),y:bounded(c.y)}))};
  }) : [];
  if (!rooms.length) return base;
  const unlockedPacks = {};
  for (const id of packIds) if (raw.unlockedPacks?.[id] === true) unlockedPacks[id] = true;
  const goal = raw.goal && ((raw.goal.type === 'pack' && packIds.has(raw.goal.id)) || (raw.goal.type === 'room' && roomIds.has(raw.goal.id))) ? {type:raw.goal.type,id:raw.goal.id} : null;
  return {v:1,rooms,activeRoom:rooms.some(r=>r.id===raw.activeRoom)?raw.activeRoom:rooms[0].id,inventory,unlockedPacks,characters,goal};
}
export function getRequirementProgress(profile, requirement) {
  const required = Math.max(1, Math.floor(finite(requirement?.rounds, 1)));
  const rounds = requirement ? Math.max(0, Math.floor(finite(profile?.stats?.[requirement.app]?.modules?.[requirement.module]?.rounds))) : required;
  return {rounds,required,complete:rounds>=required};
}
export function canUnlockPack(profile, studio, pack) {
  const p = typeof pack === 'string' ? STUDIO_PACKS.find(p=>p.id===pack) : pack;
  return !!p && !studio.unlockedPacks[p.id] && getRequirementProgress(profile,p.requirement).complete && finite(profile?.coins)>=p.price;
}
export function buyPack(profile, studio, id) {
  const pack = STUDIO_PACKS.find(p=>p.id===id);
  if (!pack) return {ok:false,reason:'unknown'};
  if (studio.unlockedPacks[pack.id]) return {ok:false,reason:'owned'};
  if (!getRequirementProgress(profile,pack.requirement).complete) return {ok:false,reason:'learning'};
  if (finite(profile?.coins)<pack.price) return {ok:false,reason:'coins'};
  profile.coins = finite(profile.coins)-pack.price;
  for(const id of pack.items) studio.inventory[id] = Math.max(0,finite(studio.inventory[id]))+1;
  studio.unlockedPacks[pack.id]=true;
  if(studio.goal?.type==='pack' && studio.goal.id===id) studio.goal=null;
  return {ok:true,reason:null};
}
export function unlockRoom(profile,studio,id) {
  const template = STUDIO_ROOMS.find(r=>r.id===id);
  if(!template) return {ok:false,reason:'unknown'};
  if(studio.rooms.some(r=>r.templateId===id)) return {ok:false,reason:'owned'};
  if(!getRequirementProgress(profile,template.requirement).complete) return {ok:false,reason:'learning'};
  if(finite(profile?.coins)<template.price) return {ok:false,reason:'coins'};
  profile.coins=finite(profile.coins)-template.price;
  const room={id:`room-${id}`,templateId:id,name:template.name,wall:template.wall,floor:template.floor,placed:[],characters:[]};
  studio.rooms.push(room); studio.activeRoom=room.id;
  if(studio.goal?.type==='room' && studio.goal.id===id) studio.goal=null;
  return {ok:true,reason:null};
}
