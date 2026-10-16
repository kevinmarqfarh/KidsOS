// Världen (SO): världsdelar och världshav, djur i världen, kända platser, flaggor, Sverigekartan,
// väderstreck, förr i tiden (sten-, brons-, järnålder och vikingatid), högtider, barnens rättigheter,
// normer och regler, trafik, pengar och demokrati. Många frågor använder riktiga foton men fungerar
// även utan dem (emoji som reserv).
import { photo, hasPhoto } from '../ui/img.js';

export const CONTINENTS = [
  { id: 'europa', name: 'Europa', color: '#3d8bfd', fact: 'Sverige ligger i Europa. Europa är en av de minsta världsdelarna men här bor väldigt många människor.' },
  { id: 'asien', name: 'Asien', color: '#f59e0b', fact: 'Asien är den största världsdelen. Här finns världens högsta berg, Mount Everest, och flest människor.' },
  { id: 'afrika', name: 'Afrika', color: '#ef4444', fact: 'I Afrika finns världens största varma öken, Sahara, och djur som lejon, elefanter och giraffer.' },
  { id: 'nordamerika', name: 'Nordamerika', color: '#22c55e', fact: 'Nordamerika sträcker sig från isiga Grönland och Kanada ner till varma Mexiko.' },
  { id: 'sydamerika', name: 'Sydamerika', color: '#a855f7', fact: 'I Sydamerika finns Amazonas regnskog och den långa bergskedjan Anderna.' },
  { id: 'oceanien', name: 'Oceanien', color: '#ec4899', fact: 'Oceanien är Australien och tusentals öar i Stilla havet. Där bor kängurur och koalor.' },
  { id: 'antarktis', name: 'Antarktis', color: '#94a3b8', fact: 'Antarktis är täckt av is och är den kallaste platsen på jorden. Där bor pingviner. Människor bor inte där för alltid – bara forskare som stannar en tid.' },
];
export const ARKTIS = { id: 'arktis', name: 'Arktis (Nordpolen)', fact: 'Arktis är det isiga havet runt Nordpolen.' };

/* ---------- Världshaven ---------- */
// spots: ellipser (longitud, latitud, rx, ry i grader) där man kan trycka på havet på världskartan.
export const OCEANS = [
  { id: 'stilla', name: 'Stilla havet', fact: 'Stilla havet är världens största och djupaste hav. Det är större än allt land på jorden tillsammans.', spots: [[-140, 5, 26, 20], [160, 15, 13, 13]] },
  { id: 'atlanten', name: 'Atlanten', fact: 'Atlanten ligger mellan Europa och Afrika på ena sidan och Amerika på den andra. Västerhavet vid Göteborg hänger ihop med Atlanten.', spots: [[-40, 30, 13, 15], [-18, -20, 11, 13]] },
  { id: 'indiska', name: 'Indiska oceanen', fact: 'Indiska oceanen ligger mellan Afrika, Asien och Australien. Det är det varmaste världshavet.', spots: [[75, -20, 17, 12]] },
  { id: 'norra', name: 'Norra ishavet', fact: 'Norra ishavet ligger runt Nordpolen. Det är det minsta världshavet och är täckt av is en stor del av året.', spots: [[50, 80, 22, 4]] },
  { id: 'sodra', name: 'Södra ishavet', fact: 'Södra ishavet ligger runt Antarktis. Där är det stormigt och iskallt – och där simmar både valar och pingviner.', spots: [[60, -58, 38, 4], [-110, -62, 28, 4]] },
];

export const WORLD_ANIMALS = [
  { id: 'lejon', def: 'lejonet', name: 'Lejon', e: '🦁', home: 'afrika', not: ['asien'], fact: 'Lejon lever i grupper som kallas flockar. Det är oftast honorna som jagar.' },
  { id: 'elefant', def: 'den afrikanska elefanten', name: 'Afrikansk elefant', e: '🐘', home: 'afrika', fact: 'Den afrikanska elefanten är det största landdjuret. Den kan dricka över 100 liter vatten om dagen.' },
  { id: 'kanguru', def: 'kängurun', name: 'Känguru', e: '🦘', home: 'oceanien', fact: 'Kängurun bär sin unge i en pung på magen och kan hoppa fortare än en bil i stan.' },
  { id: 'koala', def: 'koalan', name: 'Koala', e: '🐨', home: 'oceanien', fact: 'Koalan äter nästan bara eukalyptusblad och sover upp till 20 timmar om dygnet.' },
  { id: 'panda', def: 'jättepandan', name: 'Jättepanda', e: '🐼', home: 'asien', fact: 'Jättepandan bor i bergsskogar i Kina och äter bambu nästan hela dagen.' },
  { id: 'tiger', def: 'tigern', name: 'Tiger', e: '🐯', home: 'asien', fact: 'Tigern är det största kattdjuret. Ingen tiger har exakt samma ränder som en annan.' },
  { id: 'kejsarpingvin', def: 'kejsarpingvinen', name: 'Kejsarpingvin', e: '🐧', home: 'antarktis', fact: 'Kejsarpingvinens pappa håller ägget varmt på fötterna i två månader mitt i vintern.' },
  { id: 'lama', def: 'laman', name: 'Lama', e: '🦙', home: 'sydamerika', fact: 'Laman lever i Anderna. Den kan bära packning uppe i bergen.' },
  { id: 'jaguar', def: 'jaguaren', name: 'Jaguar', e: '🐆', home: 'sydamerika', not: ['nordamerika'], fact: 'Jaguaren lever i regnskogen och är – till skillnad från de flesta katter – bra på att simma.' },
  { id: 'bison', def: 'bisonoxen', name: 'Bisonoxe', e: '🦬', home: 'nordamerika', fact: 'Bisonoxen är Nordamerikas tyngsta landdjur. Förr vandrade miljontals över prärien.' },
  { id: 'ren', def: 'renen', name: 'Ren', e: '🦌', home: 'europa', not: ['arktis', 'asien', 'nordamerika'], fact: 'Renen lever i norra Sverige. Både hanar och honor har horn. Släktingar till renen lever i andra kalla länder runt Nordpolen.' },
  { id: 'isbjorn', def: 'isbjörnen', name: 'Isbjörn', e: '🐻‍❄️', home: 'arktis', not: ['europa', 'asien', 'nordamerika'], fact: 'Isbjörnen lever på isen runt Nordpolen. Pälsen ser vit ut men huden under är svart.' },
];

export const PLACES = [
  { id: 'eiffel', e: '🗼', in: 'i Frankrike', name: 'Eiffeltornet', country: 'Frankrike', flag: '🇫🇷', cont: 'europa', fact: 'Eiffeltornet i Paris byggdes 1889 och är över 300 meter högt.' },
  { id: 'colosseum', e: '🏟️', in: 'i Italien', name: 'Colosseum', country: 'Italien', flag: '🇮🇹', cont: 'europa', fact: 'Colosseum i Rom är nästan 2 000 år gammalt. Där tittade romarna på skådespel.' },
  { id: 'sagrada', e: '⛪', in: 'i Spanien', name: 'Sagrada Família', country: 'Spanien', flag: '🇪🇸', cont: 'europa', fact: 'Kyrkan i Barcelona har byggts i över 140 år och är fortfarande inte helt färdig.' },
  { id: 'vasa', e: '⛵', in: 'i Sverige', name: 'Regalskeppet Vasa', country: 'Sverige', flag: '🇸🇪', cont: 'europa', fact: 'Vasa sjönk i Stockholm 1628 på sin första resa och bärgades 333 år senare.' },
  { id: 'pyramider', e: '🐪', in: 'i Egypten', name: 'Pyramiderna i Giza', country: 'Egypten', flag: '🇪🇬', cont: 'afrika', fact: 'Pyramiderna byggdes för cirka 4 500 år sedan som gravar åt kungar, faraoner.' },
  { id: 'kilimanjaro', e: '🏔️', in: 'i Tanzania', name: 'Kilimanjaro', country: 'Tanzania', flag: '🇹🇿', cont: 'afrika', fact: 'Kilimanjaro är Afrikas högsta berg. Det har snö på toppen fast det ligger nära ekvatorn.' },
  { id: 'muren', e: '🧱', in: 'i Kina', name: 'Kinesiska muren', country: 'Kina', flag: '🇨🇳', cont: 'asien', fact: 'Kinesiska muren är tusentals kilometer lång och byggdes för att skydda landet.' },
  { id: 'tajmahal', e: '🕌', in: 'i Indien', name: 'Taj Mahal', country: 'Indien', flag: '🇮🇳', cont: 'asien', fact: 'Taj Mahal är byggt av vit marmor och glittrar olika i morgon- och kvällsljus.' },
  { id: 'persepolis', e: '🏛️', in: 'i Iran', name: 'Persepolis', country: 'Iran', flag: '🇮🇷', cont: 'asien', fact: 'Persepolis var en praktfull huvudstad i det gamla Persien för cirka 2 500 år sedan.' },
  { id: 'everest', e: '🏔️', in: 'på gränsen mellan Nepal och Kina', name: 'Mount Everest', country: 'Nepal och Kina', noCountryQ: true, flag: '🏔️', cont: 'asien', fact: 'Mount Everest är världens högsta berg – nästan 8 850 meter högt.' },
  { id: 'frihetsgudinnan', e: '🗽', in: 'i USA', name: 'Frihetsgudinnan', country: 'USA', flag: '🇺🇸', cont: 'nordamerika', fact: 'Frihetsgudinnan i New York var en gåva från Frankrike och invigdes 1886.' },
  { id: 'machupicchu', e: '⛰️', in: 'i Peru', name: 'Machu Picchu', country: 'Peru', flag: '🇵🇪', cont: 'sydamerika', fact: 'Machu Picchu är en stad som inkafolket byggde högt uppe i Anderna på 1400-talet.' },
  { id: 'moai', e: '🗿', in: 'på Påskön, som tillhör Chile', name: 'Moai-statyerna', country: 'Chile', flag: '🇨🇱', cont: 'oceanien', fact: 'På Påskön, långt ute i Stilla havet, står hundratals stora stenhuvuden som kallas moai.' },
  { id: 'sydneyopera', e: '🎭', in: 'i Australien', name: 'Operahuset i Sydney', country: 'Australien', flag: '🇦🇺', cont: 'oceanien', fact: 'Taket på operahuset i Sydney ser ut som segel på ett skepp.' },
];

/* ---------- Länder och flaggor ---------- */
// Bara flaggor som är lätta att skilja åt (inga nästan-likadana par som Australien/Nya Zeeland).
// prep: "i" eller "på" (på Island). capital: null när svaret inte är entydigt.
export const COUNTRIES = [
  { id: 'sverige', name: 'Sverige', flag: '🇸🇪', cont: 'europa', capital: 'Stockholm', prep: 'i', nordic: true, fact: 'Sveriges flagga är blå med ett gult kors.' },
  { id: 'norge', name: 'Norge', flag: '🇳🇴', cont: 'europa', capital: 'Oslo', prep: 'i', nordic: true, fact: 'Norge är Sveriges granne i väster och har långa, djupa fjordar.' },
  { id: 'danmark', name: 'Danmark', flag: '🇩🇰', cont: 'europa', capital: 'Köpenhamn', prep: 'i', nordic: true, fact: 'Danmarks flagga heter Dannebrog och är en av världens äldsta flaggor.' },
  { id: 'finland', name: 'Finland', flag: '🇫🇮', cont: 'europa', capital: 'Helsingfors', prep: 'i', nordic: true, fact: 'Finland kallas de tusen sjöarnas land. Där pratar man finska, och många pratar också svenska.' },
  { id: 'island', name: 'Island', flag: '🇮🇸', cont: 'europa', capital: 'Reykjavik', prep: 'på', nordic: true, fact: 'Island är en ö med vulkaner, glaciärer och varma källor.' },
  { id: 'tyskland', name: 'Tyskland', flag: '🇩🇪', cont: 'europa', capital: 'Berlin', prep: 'i', fact: 'Tyskland är det land i EU där flest människor bor.' },
  { id: 'frankrike', name: 'Frankrike', flag: '🇫🇷', cont: 'europa', capital: 'Paris', prep: 'i', fact: 'I Frankrike finns Eiffeltornet och massor av sorters ost.' },
  { id: 'storbritannien', name: 'Storbritannien', flag: '🇬🇧', cont: 'europa', capital: 'London', prep: 'i', fact: 'Storbritannien består av England, Skottland, Wales och Nordirland. De flesta bor på den stora ön Storbritannien.' },
  { id: 'spanien', name: 'Spanien', flag: '🇪🇸', cont: 'europa', capital: 'Madrid', prep: 'i', fact: 'I Spanien äter många middag sent på kvällen, när det har blivit svalare.' },
  { id: 'italien', name: 'Italien', flag: '🇮🇹', cont: 'europa', capital: 'Rom', prep: 'i', fact: 'Italien ser ut som en stövel på kartan. Pizzan kommer därifrån.' },
  { id: 'grekland', name: 'Grekland', flag: '🇬🇷', cont: 'europa', capital: 'Aten', prep: 'i', fact: 'De första olympiska spelen hölls i Grekland för nästan 3 000 år sedan.' },
  { id: 'nederlanderna', name: 'Nederländerna', flag: '🇳🇱', cont: 'europa', capital: 'Amsterdam', prep: 'i', fact: 'Nederländerna är platt och en del av landet ligger lägre än havet. Där finns väderkvarnar och tulpaner.' },
  { id: 'polen', name: 'Polen', flag: '🇵🇱', cont: 'europa', capital: 'Warszawa', prep: 'i', fact: 'Polen ligger på andra sidan Östersjön, söder om Sverige.' },
  { id: 'ukraina', name: 'Ukraina', flag: '🇺🇦', cont: 'europa', capital: 'Kyiv', prep: 'i', fact: 'Ukrainas flagga är blå och gul. Den blå delen är himlen och den gula är sädesfälten.' },
  { id: 'turkiet', name: 'Turkiet', flag: '🇹🇷', cont: null, capital: 'Ankara', prep: 'i', fact: 'Turkiet ligger både i Europa och i Asien. Staden Istanbul ligger på båda sidor om ett sund.' },
  { id: 'egypten', name: 'Egypten', flag: '🇪🇬', cont: 'afrika', capital: 'Kairo', prep: 'i', fact: 'Genom Egypten rinner Nilen, en av världens längsta floder. Där finns pyramiderna.' },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', cont: 'afrika', capital: 'Nairobi', prep: 'i', fact: 'I Kenya finns savann med lejon, elefanter och giraffer.' },
  { id: 'sydafrika', name: 'Sydafrika', flag: '🇿🇦', cont: 'afrika', capital: null, prep: 'i', fact: 'Sydafrika ligger längst ner i Afrika och har hela tre huvudstäder.' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', cont: 'asien', capital: 'Tokyo', prep: 'i', fact: 'Japans flagga visar en röd sol. Japan kallas den uppgående solens land.' },
  { id: 'kina', name: 'Kina', flag: '🇨🇳', cont: 'asien', capital: 'Peking', prep: 'i', fact: 'I Kina finns Kinesiska muren och jättepandan.' },
  { id: 'indien', name: 'Indien', flag: '🇮🇳', cont: 'asien', capital: 'New Delhi', prep: 'i', fact: 'Indien är det land i världen där flest människor bor.' },
  { id: 'iran', name: 'Iran', flag: '🇮🇷', cont: 'asien', capital: 'Teheran', prep: 'i', fact: 'I Iran firar man nyår, nowruz, när våren börjar.' },
  { id: 'usa', name: 'USA', flag: '🇺🇸', cont: 'nordamerika', capital: 'Washington D.C.', prep: 'i', fact: 'USA:s flagga har 50 stjärnor – en för varje delstat.' },
  { id: 'kanada', name: 'Kanada', flag: '🇨🇦', cont: 'nordamerika', capital: 'Ottawa', prep: 'i', fact: 'På Kanadas flagga finns ett rött lönnlöv.' },
  { id: 'mexiko', name: 'Mexiko', flag: '🇲🇽', cont: 'nordamerika', capital: 'Mexico City', prep: 'i', fact: 'I Mexiko byggde mayafolket och aztekerna stora städer med pyramider.' },
  { id: 'brasilien', name: 'Brasilien', flag: '🇧🇷', cont: 'sydamerika', capital: 'Brasília', prep: 'i', fact: 'Den största delen av Amazonas regnskog ligger i Brasilien.' },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷', cont: 'sydamerika', capital: 'Buenos Aires', prep: 'i', fact: 'Argentina är ett långt land med höga berg, stora slätter och glaciärer.' },
  { id: 'chile', name: 'Chile', flag: '🇨🇱', cont: 'sydamerika', capital: 'Santiago', prep: 'i', fact: 'Chile är ett av världens längsta och smalaste länder.' },
  { id: 'australien', name: 'Australien', flag: '🇦🇺', cont: 'oceanien', capital: 'Canberra', prep: 'i', fact: 'Australien är både ett land och den största delen av Oceanien. Där bor kängurur.' },
];
/** "i Norge", "på Island" */
export const inCountry = (c) => `${c.prep} ${c.name}`;

/* ---------- Sverige: städer och natur ---------- */
// Koordinater från Wikipedia (avrundade). landsdel: Götaland, Svealand eller Norrland.
// kind: stad | sjo | berg | o | plats. prep: hur man säger "i Malmö" / "på Gotland".
export const SWEDISH_CITIES = [
  { id: 'goteborg', name: 'Göteborg', kind: 'stad', lat: 57.71, lon: 11.97, landskap: null, landsdel: 'Götaland', sea: 'Västerhavet', fact: 'Göteborg är Sveriges näst största stad och har en stor hamn vid Västerhavet.' },
  { id: 'stockholm', name: 'Stockholm', kind: 'stad', lat: 59.33, lon: 18.07, landskap: null, landsdel: 'Svealand', sea: 'Östersjön', lake: 'malaren', fact: 'Stockholm är Sveriges huvudstad och ligger på fjorton öar, där Mälaren möter Östersjön.' },
  { id: 'malmo', name: 'Malmö', kind: 'stad', lat: 55.6, lon: 13.0, landskap: 'Skåne', landsdel: 'Götaland', fact: 'Från Malmö går Öresundsbron till Köpenhamn i Danmark.' },
  { id: 'kiruna', name: 'Kiruna', kind: 'stad', lat: 67.85, lon: 20.23, landskap: 'Lappland', landsdel: 'Norrland', fact: 'I Kiruna går solen inte ner på sommaren – och inte upp mitt i vintern.' },
  { id: 'uppsala', name: 'Uppsala', kind: 'stad', lat: 59.86, lon: 17.64, landskap: 'Uppland', landsdel: 'Svealand', fact: 'Uppsala har Nordens äldsta universitet, från 1477.' },
  { id: 'umea', name: 'Umeå', kind: 'stad', lat: 63.83, lon: 20.26, landskap: 'Västerbotten', landsdel: 'Norrland', fact: 'Umeå kallas björkarnas stad.' },
  { id: 'visby', name: 'Visby', kind: 'stad', lat: 57.64, lon: 18.29, landskap: 'Gotland', landsdel: 'Götaland', sea: 'Östersjön', fact: 'Visby på Gotland har en ringmur från medeltiden.' },
  { id: 'helsingborg', name: 'Helsingborg', kind: 'stad', lat: 56.05, lon: 12.69, landskap: 'Skåne', landsdel: 'Götaland', fact: 'Helsingborg ligger där Öresund är som smalast – bara 4 km till Danmark.' },
  { id: 'lulea', name: 'Luleå', kind: 'stad', lat: 65.58, lon: 22.15, landskap: 'Norrbotten', landsdel: 'Norrland', fact: 'Utanför Luleå finns en skärgård med över 1 300 öar. På vintern kan man åka skridskor på havsisen.' },
  { id: 'sundsvall', name: 'Sundsvall', kind: 'stad', lat: 62.39, lon: 17.31, landskap: 'Medelpad', landsdel: 'Norrland', fact: 'Sundsvall byggdes upp i sten efter en stor brand 1888. Därför kallas mitten av staden Stenstaden.' },
  { id: 'ostersund', name: 'Östersund', kind: 'stad', lat: 63.18, lon: 14.64, landskap: 'Jämtland', landsdel: 'Norrland', lake: 'storsjon', fact: 'Östersund ligger vid Storsjön. Det finns en gammal saga om ett sjöodjur som ska bo i sjön.' },
  { id: 'karlstad', name: 'Karlstad', kind: 'stad', lat: 59.38, lon: 13.5, landskap: 'Värmland', landsdel: 'Svealand', lake: 'vanern', fact: 'Karlstad ligger där Klarälven rinner ut i Vänern. Staden kallas solens stad.' },
  { id: 'jonkoping', name: 'Jönköping', kind: 'stad', lat: 57.78, lon: 14.16, landskap: 'Småland', landsdel: 'Götaland', lake: 'vattern', fact: 'Jönköping ligger vid södra änden av Vättern. Förr gjorde man massor av tändstickor där.' },
  { id: 'linkoping', name: 'Linköping', kind: 'stad', lat: 58.41, lon: 15.62, landskap: 'Östergötland', landsdel: 'Götaland', fact: 'I Linköping byggs flygplan. Där finns också ett stort flygvapenmuseum.' },
  { id: 'orebro', name: 'Örebro', kind: 'stad', lat: 59.27, lon: 15.21, landskap: 'Närke', landsdel: 'Svealand', fact: 'Mitt i Örebro står ett gammalt slott på en ö i Svartån.' },
  { id: 'kalmar', name: 'Kalmar', kind: 'stad', lat: 56.66, lon: 16.36, landskap: 'Småland', landsdel: 'Götaland', sea: 'Östersjön', fact: 'Kalmar har ett stort slott vid havet. Härifrån går Ölandsbron, som är ungefär 6 km lång, över till Öland.' },
  { id: 'karlskrona', name: 'Karlskrona', kind: 'stad', lat: 56.16, lon: 15.59, landskap: 'Blekinge', landsdel: 'Götaland', sea: 'Östersjön', fact: 'Karlskrona är byggd på öar och är marinens viktigaste hamn i Sverige.' },
  { id: 'falun', name: 'Falun', kind: 'stad', lat: 60.61, lon: 15.63, landskap: 'Dalarna', landsdel: 'Svealand', fact: 'I Falun fanns en stor koppargruva. Därifrån kommer den röda färgen på många svenska hus, Falu rödfärg.' },
  { id: 'gavle', name: 'Gävle', kind: 'stad', lat: 60.67, lon: 17.14, landskap: 'Gästrikland', landsdel: 'Norrland', fact: 'I Gävle ställer man varje jul upp en jättestor julbock av halm, Gävlebocken.' },
  { id: 'jokkmokk', name: 'Jokkmokk', kind: 'stad', lat: 66.61, lon: 19.83, landskap: 'Lappland', landsdel: 'Norrland', fact: 'Jokkmokk ligger norr om polcirkeln. Där har samerna haft en vintermarknad i över 400 år.' },
];

export const SWEDISH_NATURE = [
  { id: 'vanern', name: 'Vänern', kind: 'sjo', prep: 'i', lat: 58.9, lon: 13.4, fact: 'Vänern är Sveriges största sjö – och den största i hela EU. Den är så stor att man inte kan se andra stranden.' },
  { id: 'vattern', name: 'Vättern', kind: 'sjo', prep: 'i', lat: 58.3, lon: 14.5, fact: 'Vättern är Sveriges näst största sjö. Vattnet är så klart och rent att flera städer tar sitt dricksvatten därifrån.' },
  { id: 'malaren', name: 'Mälaren', kind: 'sjo', prep: 'i', lat: 59.45, lon: 16.85, fact: 'Mälaren är Sveriges tredje största sjö. Den rinner ut i Östersjön mitt i Stockholm.' },
  { id: 'siljan', name: 'Siljan', kind: 'sjo', prep: 'i', lat: 60.87, lon: 14.8, fact: 'Siljan i Dalarna bildades när en stor meteorit slog ner för väldigt länge sedan – för ungefär 380 miljoner år sedan.' },
  { id: 'storsjon', name: 'Storsjön', kind: 'sjo', prep: 'i', lat: 63.22, lon: 14.32, fact: 'Storsjön ligger mitt i Jämtland. Staden Östersund ligger vid sjöns strand.' },
  { id: 'kebnekaise', name: 'Kebnekaise', kind: 'berg', prep: 'på', lat: 67.9, lon: 18.53, landskap: 'Lappland', landsdel: 'Norrland', fact: 'Kebnekaise är Sveriges högsta berg. Det är nästan 2 100 meter högt och har snö på toppen hela året.' },
  { id: 'gotland', name: 'Gotland', kind: 'o', prep: 'på', lat: 57.35, lon: 18.45, landsdel: 'Götaland', fact: 'Gotland är Sveriges största ö. Vid stränderna står höga stenpelare som kallas raukar.' },
  { id: 'oland', name: 'Öland', kind: 'o', prep: 'på', lat: 56.9, lon: 16.72, landsdel: 'Götaland', fact: 'Öland är Sveriges näst största ö och det minsta landskapet. Där står många gamla väderkvarnar.' },
  { id: 'treriksroset', name: 'Treriksröset', kind: 'plats', prep: 'vid', lat: 69.06, lon: 20.55, fact: 'Vid Treriksröset möts Sverige, Norge och Finland. Det är nästan Sveriges nordligaste punkt.' },
  { id: 'smygehuk', name: 'Smygehuk', kind: 'plats', prep: 'vid', lat: 55.34, lon: 13.36, fact: 'Smygehuk i Skåne är Sveriges sydligaste udde. Härifrån är det ungefär 1 600 km till Treriksröset.' },
];
export const SWEDEN_PLACES = [...SWEDISH_CITIES, ...SWEDISH_NATURE];
export const PLACE_KIND = { stad: { e: '🏙️', name: 'stad' }, sjo: { e: '💧', name: 'sjö' }, berg: { e: '⛰️', name: 'berg' }, o: { e: '🏝️', name: 'ö' }, plats: { e: '📍', name: 'plats' } };
/** "i Malmö", "på Gotland", "i Vänern" */
export const atPlace = (p) => `${p.prep || 'i'} ${p.name}`;

// Kartans gränser (Wikipedias kartdata för "Sweden location map", ekvirektangulär projektion).
export const SWEDEN_BOUNDS = { top: 69.5, bottom: 55.1, left: 10.4, right: 24.6 };
export function projectSweden(lat, lon, b = SWEDEN_BOUNDS) {
  return { x: (lon - b.left) / (b.right - b.left), y: (b.top - lat) / (b.top - b.bottom) };
}

// Förenklad Sverigekontur (longitud, latitud) som ritas när kartfotot saknas. Samma projektion som
// projectSweden, så stiften hamnar rätt. Bredden är korrigerad med cos(62°) så att formen inte blir utdragen.
export const SWEDEN_OUTLINE = {
  land: [
    [[20.55, 69.06], [21.3, 68.78], [22.4, 68.47], [23.0, 68.1], [23.45, 67.4], [23.6, 66.8], [23.7, 66.3], [24.15, 65.82], [23.2, 65.75], [22.15, 65.55], [21.5, 65.3], [21.25, 64.8], [20.6, 64.1], [20.0, 63.7], [19.0, 63.3], [18.2, 62.9], [17.6, 62.45], [17.25, 61.9], [17.2, 61.3], [17.2, 60.7], [17.9, 60.55], [18.6, 60.25], [19.05, 59.85], [18.8, 59.35], [18.3, 59.05], [17.8, 58.9], [17.0, 58.65], [16.65, 58.15], [16.6, 57.6], [16.45, 57.15], [16.35, 56.65], [15.95, 56.2], [15.4, 56.12], [14.75, 56.15], [14.25, 55.95], [14.35, 55.55], [13.8, 55.42], [13.36, 55.34], [12.95, 55.4], [12.95, 55.65], [12.75, 55.95], [12.55, 56.2], [12.85, 56.45], [12.85, 56.7], [12.2, 57.15], [11.9, 57.65], [11.6, 58.0], [11.4, 58.35], [11.15, 58.95], [11.45, 59.1], [11.75, 59.6], [12.45, 60.05], [12.6, 60.55], [12.25, 61.05], [12.7, 61.45], [12.15, 61.75], [12.3, 62.3], [12.05, 62.65], [12.15, 63.3], [12.6, 63.95], [13.95, 64.05], [14.1, 64.5], [13.65, 64.6], [14.45, 65.3], [14.55, 65.75], [15.4, 66.15], [16.0, 66.5], [16.6, 67.05], [17.3, 67.5], [17.9, 67.95], [18.15, 68.45], [19.0, 68.5], [20.0, 68.4], [20.25, 68.75], [20.0, 69.0]],
    [[18.13, 56.92], [18.45, 57.15], [18.75, 57.35], [18.95, 57.55], [19.25, 57.85], [19.1, 57.98], [18.85, 57.9], [18.55, 57.75], [18.2, 57.5], [18.1, 57.25]],
    [[16.4, 56.2], [16.55, 56.25], [16.75, 56.6], [16.95, 56.9], [17.15, 57.33], [17.0, 57.37], [16.75, 57.0], [16.5, 56.6]],
  ],
  lakes: [
    [[12.45, 58.4], [13.1, 58.5], [13.6, 58.65], [14.15, 58.75], [14.0, 59.1], [13.5, 59.35], [13.1, 59.25], [12.7, 59.15], [12.85, 58.85], [12.4, 58.6]],
    [[14.15, 57.8], [14.35, 57.8], [14.6, 58.2], [14.95, 58.55], [14.85, 58.85], [14.6, 58.6], [14.35, 58.3], [14.15, 58.0]],
    [[16.0, 59.45], [16.6, 59.38], [17.3, 59.33], [17.8, 59.3], [17.6, 59.55], [16.8, 59.55], [16.2, 59.6]],
  ],
};
export const SWEDEN_SVG_W = Math.round(1000 * ((SWEDEN_BOUNDS.right - SWEDEN_BOUNDS.left) * Math.cos((62 * Math.PI) / 180)) / (SWEDEN_BOUNDS.top - SWEDEN_BOUNDS.bottom));
/** Sverigekarta som SVG (land, Gotland, Öland och de stora sjöarna). */
export function swedenSvg(cls = 'smap-img') {
  const W = SWEDEN_SVG_W;
  const pt = ([lon, lat]) => {
    const q = projectSweden(lat, lon);
    return `${(q.x * W).toFixed(1)},${(q.y * 1000).toFixed(1)}`;
  };
  const poly = (list, fill) => list.map((p) => `<polygon points="${p.map(pt).join(' ')}" fill="${fill}"/>`).join('');
  return `<svg class="${cls} sweden-svg" viewBox="0 0 ${W} 1000" role="img" aria-label="Karta över Sverige"><rect width="${W}" height="1000" fill="#bfe3f7"/>`
    + `<g stroke="#8a9a6a" stroke-width="3" stroke-linejoin="round">${poly(SWEDEN_OUTLINE.land, '#d9ecc0')}</g>${poly(SWEDEN_OUTLINE.lakes, '#7cc8f2')}</svg>`;
}
/** Kartbilden: riktig karta om fotot finns, annars den ritade. */
export const swedenBase = (cls = 'smap-img') => (hasPhoto('sverigekarta') ? photo('sverigekarta', { alt: 'Karta över Sverige', cls }) : swedenSvg(cls));

export const DIRECTIONS = ['norr', 'nordost', 'öster', 'sydost', 'söder', 'sydväst', 'väster', 'nordväst'];
/** Kompassriktning i grader (0 = norr, 90 = öster) från A till B. */
export function bearingDeg(from, to) {
  const dy = to.lat - from.lat;
  const dx = (to.lon - from.lon) * Math.cos(((from.lat + to.lat) / 2) * (Math.PI / 180));
  return ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
}
/** Väderstreck från punkt A till punkt B (åtta riktningar). */
export function bearing8(from, to) {
  return DIRECTIONS[Math.round(bearingDeg(from, to) / 45) % 8];
}
/** Sant när riktningen ligger tydligt inne i ett väderstreck (inte nära gränsen mellan två). */
export function isClearBearing(from, to, margin = 10) {
  const off = Math.abs((bearingDeg(from, to) % 45) - 22.5);
  const far = Math.hypot(to.lat - from.lat, (to.lon - from.lon) * 0.5) >= 1;
  return off >= margin && far;
}

/* ---------- Världskartan (delas av vyn och frågorna) ---------- */
// Förenklade konturer (longitud, latitud) – barnvänliga, igenkännbara former.
export const OUTLINES = {
  nordamerika: [
    [[-168, 66], [-160, 71], [-140, 70], [-120, 72], [-95, 73], [-80, 70], [-62, 60], [-55, 52], [-65, 45], [-75, 40], [-81, 31], [-80, 26], [-90, 29], [-97, 26], [-97, 20], [-90, 16], [-83, 10], [-78, 8], [-85, 12], [-92, 15], [-105, 20], [-112, 30], [-117, 33], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 60]],
    [[-55, 60], [-45, 60], [-20, 70], [-20, 80], [-40, 83], [-65, 80], [-72, 77], [-60, 70]],
  ],
  sydamerika: [[[-80, 8], [-72, 12], [-60, 10], [-50, 0], [-35, -5], [-38, -15], [-48, -28], [-58, -38], [-65, -45], [-68, -55], [-74, -50], [-72, -35], [-71, -18], [-77, -8], [-81, -3]]],
  europa: [
    [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [5, 58], [5, 62], [12, 66], [20, 70], [30, 70], [40, 68], [45, 65], [55, 68], [60, 60], [55, 50], [48, 45], [40, 42], [30, 41], [26, 38], [22, 36], [15, 38], [12, 44], [5, 43], [-2, 37]],
    [[-6, 50], [2, 51], [0, 54], [-3, 58], [-6, 58], [-5, 54]],
    [[-24, 64], [-14, 64], [-14, 66], [-22, 66]],
  ],
  afrika: [
    [[-17, 21], [-10, 30], [-5, 36], [10, 37], [20, 32], [32, 31], [35, 28], [43, 12], [51, 12], [42, 0], [40, -10], [35, -22], [30, -32], [20, -35], [15, -28], [12, -15], [9, -2], [10, 4], [-8, 5], [-15, 11]],
    [[44, -25], [50, -15], [49, -12], [43, -20]],
  ],
  asien: [
    [[26, 40], [36, 36], [35, 31], [43, 13], [55, 22], [58, 24], [66, 25], [72, 20], [78, 8], [82, 15], [90, 22], [98, 16], [100, 8], [104, 1], [108, 12], [106, 20], [110, 21], [120, 23], [122, 31], [122, 40], [128, 38], [130, 43], [140, 47], [142, 55], [160, 60], [180, 66], [180, 70], [140, 73], [110, 77], [80, 73], [68, 70], [60, 68], [60, 60], [55, 50], [48, 45], [42, 42], [36, 40]],
    [[130, 31], [141, 36], [142, 43], [140, 42], [135, 34]],
    [[95, 5], [105, -6], [115, -8], [120, -5], [110, 1], [100, 2]],
  ],
  oceanien: [
    [[114, -22], [122, -17], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [145, -38], [138, -35], [131, -31], [117, -35], [114, -28]],
    [[166, -46], [174, -41], [178, -38], [173, -35], [170, -44]],
    [[141, -3], [150, -6], [147, -9], [141, -9]],
  ],
  antarktis: [[[-180, -72], [-120, -74], [-60, -66], [0, -70], [60, -67], [120, -66], [180, -72], [180, -85], [-180, -85]]],
};
export const MAP_W = 360;
export const MAP_H = 170;
export const mapProj = ([lon, lat]) => [lon + 180, 85 - lat];

/**
 * Världskarta som SVG. highlight: världsdel som ska blinka.
 * oceans: rita tryckbara havsytor (data-hit = havets id). oceanLabels: skriv ut havens namn.
 * contHits: false gör världsdelarna otryckbara (används när man ska trycka på ett hav).
 */
export function worldMapSvg(highlight = null, { oceans = false, oceanLabels = false, contHits = true, home = true } = {}) {
  let s = `<svg class="world-svg" viewBox="0 0 ${MAP_W} ${MAP_H}" role="img" aria-label="världskarta"><rect width="${MAP_W}" height="${MAP_H}" rx="8" fill="#7cc8f2"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M0 ${20 + i * 26} Q90 ${14 + i * 26} 180 ${20 + i * 26} T360 ${20 + i * 26}" stroke="#a5dcf7" stroke-width="1" fill="none"/>`;
  for (const c of CONTINENTS) {
    const polys = OUTLINES[c.id].map((poly) => `<polygon points="${poly.map(mapProj).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}"/>`).join('');
    const hit = contHits ? ` data-hit="${c.id}"` : '';
    s += `<g class="cont${highlight === c.id ? ' hl' : ''}"${hit} fill="${c.color}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round">${polys}</g>`;
  }
  if (oceans) {
    for (const o of OCEANS) {
      const shapes = o.spots.map(([lon, lat, rx, ry]) => {
        const [x, y] = mapProj([lon, lat]);
        return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
      }).join('');
      s += `<g class="ocean${highlight === o.id ? ' hl' : ''}" data-hit="${o.id}">${shapes}</g>`;
      if (oceanLabels) {
        const [lon, lat] = o.spots[0];
        const [x, y] = mapProj([lon, lat]);
        s += `<text class="ocean-name" x="${x}" y="${y + 2.5}" text-anchor="middle" pointer-events="none">${o.name}</text>`;
      }
    }
  }
  if (home) {
    const [sx, sy] = mapProj([12, 58]);
    s += `<g class="home-pin" pointer-events="none"><circle cx="${sx}" cy="${sy}" r="3.4" fill="#fff" stroke="#1f2a44" stroke-width="1.2"/><text x="${sx + 5}" y="${sy - 3}" font-size="7" font-weight="800" fill="#1f2a44">Du</text></g>`;
  }
  return `${s}</svg>`;
}

/** Liten Sverigekarta med markerade platser (foto om det finns, annars ritad karta). */
export function swedenMapHtml(points, { labels = false } = {}) {
  const pins = points.map((p, i) => {
    const q = projectSweden(p.lat, p.lon);
    return `<span class="smap-pin${i ? ' alt' : ''}" style="left:${(q.x * 100).toFixed(1)}%;top:${(q.y * 100).toFixed(1)}%"><i></i>${labels ? `<b>${p.name}</b>` : ''}</span>`;
  }).join('');
  return `<div class="smap">${swedenBase('smap-img')}<span class="smap-n">N ⬆</span>${pins}</div>`;
}

/* ---------- Förr i tiden ---------- */
export const ERAS = [
  { id: 'sten', name: 'Stenåldern', img: 'flintyxa', e: '🪨', when: 'för 10 000 år sedan', fact: 'Människorna jagade, fiskade och gjorde verktyg av sten, ben och trä.' },
  { id: 'brons', name: 'Bronsåldern', img: 'hallristning', e: '🛡️', when: 'för 3 500 år sedan', fact: 'Man gjorde saker av brons och ristade bilder i berget – som hällristningarna i Tanum i Bohuslän.' },
  { id: 'jarn', name: 'Järnåldern och vikingatiden', img: 'vikingaskepp', e: '⛵', when: 'för 1 200 år sedan', fact: 'Vikingarna seglade långt i sina skepp, handlade och skrev med runor.' },
  { id: 'medel', name: 'Medeltiden', img: 'visby', e: '🏰', when: 'för 700 år sedan', fact: 'Man byggde borgar, kyrkor och stadsmurar – som ringmuren i Visby.' },
  { id: 'anga', name: '1800-talet', img: 'angmaskin', e: '🚂', when: 'för ungefär 170 år sedan', fact: 'Ångloken kom och man kunde resa snabbt med tåg för första gången.' },
  { id: 'nu', name: 'I dag', img: null, e: '📱', when: 'nu', fact: 'Vi har datorer, mobiler och flygplan – och du lever just nu!' },
];

// Händelser för tidslinjer (y = ungefärligt årtal, negativt = före vår tideräkning).
export const TIMELINE = [
  { id: 'forsta', e: '🏕️', name: 'De första människorna kommer till Sverige', when: 'för mer än 10 000 år sedan', y: -11000 },
  { id: 'bonder', e: '🌾', name: 'De första bönderna i Sverige', when: 'för ungefär 6 000 år sedan', y: -4000 },
  { id: 'pyramid', e: '🔺', name: 'Pyramiderna i Egypten byggs', when: 'för ungefär 4 500 år sedan', y: -2550 },
  { id: 'bronsalder', e: '🛡️', name: 'Bronsåldern börjar i Norden', when: 'för ungefär 3 700 år sedan', y: -1700 },
  { id: 'vikingar', e: '⛵', name: 'Vikingatiden', when: 'för ungefär 1 200 år sedan', y: 800 },
  { id: 'ringmur', e: '🏰', name: 'Ringmuren i Visby byggs', when: 'för ungefär 700 år sedan', y: 1300 },
  { id: 'vasaskepp', e: '🚢', name: 'Skeppet Vasa sjunker', when: 'år 1628', y: 1628 },
  { id: 'tag', e: '🚂', name: 'De första tågen i Sverige', when: 'på 1850-talet', y: 1856 },
  { id: 'manen', e: '🌕', name: 'Människor landar på månen', when: 'år 1969', y: 1969 },
  { id: 'mobiler', e: '📱', name: 'Smarta mobiler blir vanliga', when: 'för ungefär 15 år sedan', y: 2010 },
];

export const TIME_ITEMS = [
  { id: 'dino', e: '🦕', n: 'dinosaurier', bin: 'dati' },
  { id: 'hast', e: '🐴', n: 'häst och vagn', bin: 'dati' },
  { id: 'runa', e: '🪨', n: 'runsten', bin: 'dati' },
  { id: 'mobil', e: '📱', n: 'mobiltelefon', bin: 'nu' },
  { id: 'skola', e: '🏫', n: 'din skola', bin: 'nu' },
  { id: 'cykel', e: '🚲', n: 'du cyklar', bin: 'nu' },
  { id: 'vuxen', e: '🧑', n: 'när du är vuxen', bin: 'fram' },
  { id: 'mars', e: '🚀', n: 'människor på Mars', bin: 'fram' },
  { id: 'imorgon', e: '📅', n: 'i morgon', bin: 'fram' },
];

// Fanns det på vikingatiden? (ja = fanns, nej = fanns inte)
export const VIKING_THINGS = [
  { id: 'eld', e: '🔥', n: 'eld', bin: 'ja' },
  { id: 'far', e: '🐑', n: 'får', bin: 'ja' },
  { id: 'skepp', e: '⛵', n: 'segelskepp', bin: 'ja' },
  { id: 'brod', e: '🍞', n: 'bröd', bin: 'ja' },
  { id: 'honung', e: '🍯', n: 'honung', bin: 'ja' },
  { id: 'hast', e: '🐴', n: 'häst', bin: 'ja' },
  { id: 'fisk', e: '🐟', n: 'fisk', bin: 'ja' },
  { id: 'ost', e: '🧀', n: 'ost', bin: 'ja' },
  { id: 'mobil', e: '📱', n: 'mobil', bin: 'nej' },
  { id: 'bil', e: '🚗', n: 'bil', bin: 'nej' },
  { id: 'lampa', e: '💡', n: 'glödlampa', bin: 'nej' },
  { id: 'tv', e: '📺', n: 'tv', bin: 'nej' },
  { id: 'potatis', e: '🥔', n: 'potatis', bin: 'nej' },
  { id: 'banan', e: '🍌', n: 'banan', bin: 'nej' },
  { id: 'cykel', e: '🚲', n: 'cykel', bin: 'nej' },
  { id: 'flyg', e: '✈️', n: 'flygplan', bin: 'nej' },
  { id: 'choklad', e: '🍫', n: 'choklad', bin: 'nej' },
];

// Livet förr – från stenåldern till vikingatiden. min/max = nivåer där frågan passar.
export const PAST_LIFE = [
  { era: 'viking', min: 0, max: 2, q: 'Vad lekte barnen med på vikingatiden?', a: ['Leksaker av trä', '🪵'], w: [['Tv-spel', '🎮'], ['Plastbilar', '🚗']], ex: 'Vikingabarn hade leksaker av trä, till exempel hästar, svärd och små båtar. Sådana har man hittat när man grävt i marken.' },
  { era: 'viking', min: 0, max: 2, q: 'Vad gav ljus och värme i vikingarnas hus?', a: ['En eld', '🔥'], w: [['En lampa', '💡'], ['Ett element', '🔌']], ex: 'Mitt i vikingarnas långhus brann en eld. Den gav ljus och värme, och där lagade man mat.' },
  { era: 'viking', min: 0, max: 2, q: 'Hur reste vikingarna långt bort?', a: ['Med skepp', '⛵'], w: [['Med flygplan', '✈️'], ['Med tåg', '🚂']], ex: 'Vikingarna byggde snabba skepp av trä med segel och åror. Med dem kunde de resa långt.' },
  { era: 'sten', min: 0, max: 2, q: 'Hur fick människorna mat på stenåldern?', a: ['De jagade och fiskade', '🏹'], w: [['De handlade i affären', '🛒'], ['De beställde pizza', '🍕']], ex: 'På stenåldern jagade man, fiskade och plockade bär, nötter och svamp.' },
  { era: 'viking', min: 1, max: 4, q: 'Gick barnen i skolan på vikingatiden?', a: ['Nej, de lärde sig genom att hjälpa till hemma'], w: ['Ja, varje dag', 'Ja, men bara på lördagar'], ex: 'Det fanns inga skolor för vanliga barn. Barnen lärde sig laga mat, sköta djuren, väva och fiska genom att hjälpa de vuxna på gården.' },
  { era: 'viking', min: 1, max: 4, q: 'Vad åt man ofta på vikingatiden?', a: ['Gröt, bröd, fisk och kött'], w: ['Pommes frites och korv', 'Pizza och pasta'], ex: 'Vikingarna åt gröt, bröd, fisk, kött, ägg och mjölkmat. Potatis fanns inte – den kom till Sverige mycket senare.' },
  { era: 'viking', min: 1, max: 4, q: 'Vad var vikingarnas kläder gjorda av?', a: ['Ull och lin'], w: ['Plast', 'Jeanstyg'], ex: 'Kläderna vävdes av ull från fåren och lin från linväxten. Det tog lång tid att göra ett klädesplagg.' },
  { era: 'viking', min: 1, max: 4, q: 'Vilka sysslor hade barnen på en vikingagård?', a: ['Vakta djuren och hämta vatten'], w: ['Dammsuga och diska i diskmaskin', 'Köra traktor'], ex: 'Barnen hjälpte till på gården. De vaktade djuren, hämtade vatten och ved och lärde sig hantverk.' },
  { era: 'viking', min: 2, max: 4, q: 'Hur skrev vikingarna?', a: ['Med runor'], w: ['Med kulspetspenna', 'På en dator'], ex: 'Vikingarna skrev med runor. De ristade dem i sten och trä – därför finns det runstenar kvar än i dag.' },
  { era: 'viking', min: 2, max: 4, q: 'Varför ristade man runstenar?', a: ['För att minnas någon som hade dött'], w: ['För att visa vägen till affären', 'För att spela spel på'], ex: 'De flesta runstenar restes till minne av en släkting. I Sverige finns fler runstenar än i något annat land.' },
  { era: 'viking', min: 2, max: 4, q: 'Vad hette vikingarnas hus?', a: ['Långhus'], w: ['Höghus', 'Radhus'], ex: 'Vikingarna bodde i långhus. Där bodde hela familjen – och ibland djuren i ena änden på vintern.' },
  { era: 'viking', min: 3, max: 4, q: 'Vad hette guden med hammaren i den nordiska mytologin?', a: ['Tor'], w: ['Oden', 'Frej'], ex: 'Tor hade hammaren Mjölner. När det åskade sa man att det var Tor som åkte över himlen.' },
  { era: 'viking', min: 3, max: 4, q: 'Vilket brädspel spelade vikingarna?', a: ['Hnefatafl'], w: ['Monopol', 'Fia med knuff'], ex: 'Hnefatafl är ett strategispel där en kung ska fly från brädet. Spelpjäser har hittats i vikingagravar.' },
  { era: 'viking', min: 3, max: 4, q: 'När var vikingatiden ungefär?', a: ['För 1 000–1 200 år sedan'], w: ['För 100 år sedan', 'För 10 000 år sedan'], ex: 'Vikingatiden var ungefär år 800 till 1050. Den var den sista delen av järnåldern.' },
  { era: 'sten', min: 1, max: 4, q: 'Vad gjorde man verktyg av på stenåldern?', a: ['Sten, ben och trä'], w: ['Järn', 'Plast'], ex: 'På stenåldern fanns inga metaller. Man slog till yxor och knivar av flinta och andra stenar och gjorde verktyg av ben och trä.' },
  { era: 'sten', min: 2, max: 4, q: 'Vad hände i slutet av stenåldern?', a: ['Människor började odla och ha djur'], w: ['Man började åka bil', 'Man byggde slott'], ex: 'För ungefär 6 000 år sedan blev människorna i Sverige bönder. De odlade säd och hade kor, får och getter.' },
  { era: 'sten', min: 3, max: 4, q: 'Vilken sten var bäst att göra vassa yxor och knivar av?', a: ['Flinta'], w: ['Marmor', 'Krita'], ex: 'Flinta går att slå så att den får vassa kanter. Den finns framför allt i Skåne.' },
  { era: 'brons', min: 2, max: 4, q: 'Vad ristade människorna i berget på bronsåldern?', a: ['Bilder av skepp, djur och människor'], w: ['Bokstäver och siffror', 'Kartor över städer'], ex: 'Bilderna kallas hällristningar. Många finns i Tanum i Bohuslän.' },
  { era: 'brons', min: 3, max: 4, q: 'Vad är brons?', a: ['En metall av koppar och tenn'], w: ['En sorts sten', 'En sorts trä'], ex: 'Brons gör man genom att smälta ihop koppar och tenn. Metallerna fick handlas hit från länder långt borta, så brons var dyrt.' },
  { era: 'brons', min: 3, max: 4, q: 'Vem hade råd med bronssaker?', a: ['Mest de rika'], w: ['Alla barn', 'Ingen alls'], ex: 'Brons var dyrt eftersom metallen kom långväga ifrån. Vanligt folk använde fortfarande mycket sten, ben och trä.' },
  { era: 'jarn', min: 3, max: 4, q: 'Var hittade man järn under järnåldern?', a: ['I myrar och sjöar'], w: ['I affären', 'I trädens kottar'], ex: 'Man tog upp myrmalm ur myrar och sjöar och smälte fram järnet. Järn fanns nära, så fler kunde få verktyg av metall.' },
];

/* ---------- Högtider ---------- */
export const HOLIDAYS = [
  { id: 'julgran', name: 'Jul', e: '🎄', tradition: 'kristendomen', fact: 'Julen firas till minne av Jesus födelse. I Sverige firar vi på julafton den 24 december.' },
  { id: 'pasagg', name: 'Påsk', e: '🐣', tradition: 'kristendomen', fact: 'Påsken är kristendomens viktigaste högtid. I Sverige målar vi ägg och klär ut oss till påskkärringar.' },
  { id: 'advent', name: 'Advent', e: '🕯️', tradition: 'kristendomen', fact: 'Advent är de fyra söndagarna före jul. Varje advent tänder man ett nytt ljus i adventsljusstaken.' },
  { id: 'menora', name: 'Chanukka', e: '🕎', tradition: 'judendomen', fact: 'Under chanukka tänds ett nytt ljus i ljusstaken varje kväll i åtta dagar.' },
  { id: 'pesach', name: 'Pesach', e: '🫓', tradition: 'judendomen', fact: 'Under pesach minns judar berättelsen om hur folket fick lämna Egypten. Man äter ett tunt, platt bröd som heter matzá.' },
  { id: 'sabbat', name: 'Sabbat', e: '🕯️', tradition: 'judendomen', fact: 'Sabbaten är judendomens vilodag varje vecka, från fredag kväll till lördag kväll. Den börjar med att man tänder ljus.' },
  { id: 'eid', name: 'Eid al-fitr', e: '🌙', tradition: 'islam', fact: 'Eid al-fitr firas när fastemånaden ramadan är slut – med fest, nya kläder och god mat.' },
  { id: 'ramadan', name: 'Ramadan', e: '🌙', tradition: 'islam', fact: 'Under ramadan fastar vuxna muslimer från soluppgång till solnedgång. På kvällen äter man tillsammans. Barn behöver inte fasta.' },
  { id: 'eidadha', name: 'Eid al-adha', e: '🍲', tradition: 'islam', fact: 'Eid al-adha är islams största högtid. Man firar med familjen och delar med sig av mat till andra.' },
  { id: 'nowruz', name: 'Nowruz', e: '🌱', tradition: 'persisk tradition', fact: 'Nowruz betyder "ny dag" och firas vid vårdagjämningen i Iran och många andra länder – med ett dukat bord med sju saker.' },
  { id: 'diwali', name: 'Diwali', e: '🪔', tradition: 'hinduismen', fact: 'Diwali är hinduismens ljusfest. Man tänder små lampor och ljus för att ljuset ska vinna över mörkret.' },
  { id: 'lucia', name: 'Lucia', e: '👑', tradition: 'svensk tradition', fact: 'Den 13 december sjunger lucia och hennes följe med ljus i håret i den mörka vintern.' },
  { id: 'midsommar', name: 'Midsommar', e: '💐', tradition: 'svensk tradition', fact: 'På midsommar dansar vi runt midsommarstången när dagarna är som längst.' },
  { id: 'valborg', name: 'Valborg', e: '🔥', tradition: 'svensk tradition', fact: 'På valborgsmässoafton den 30 april tänder man brasor och sjunger in våren.' },
  { id: 'nationaldag', name: 'Sveriges nationaldag', e: '🇸🇪', tradition: 'svensk tradition', fact: 'Den 6 juni firar Sverige nationaldagen. Då valdes Gustav Vasa till kung år 1523.' },
  { id: 'samedag', name: 'Samernas nationaldag', e: '🎉', tradition: 'samisk tradition', fact: 'Den 6 februari är samernas nationaldag. Samerna är Sveriges urfolk och har en egen flagga och ett eget språk.' },
];

export const RELIGIONS = [
  { id: 'kristendomen', name: 'kristendomen', symbol: '✝️', symbolName: 'korset', house: 'kyrka', book: 'Bibeln', fact: 'Kristna tror på Gud och på Jesus. De samlas i kyrkan, och deras heliga bok heter Bibeln.' },
  { id: 'islam', name: 'islam', symbol: '☪️', symbolName: 'halvmånen och stjärnan', house: 'moské', book: 'Koranen', fact: 'Muslimer tror på Gud, Allah, och profeten Muhammed. De samlas i moskén, och deras heliga bok heter Koranen.' },
  { id: 'judendomen', name: 'judendomen', symbol: '✡️', symbolName: 'Davidsstjärnan', house: 'synagoga', book: 'Toran', fact: 'Judar tror på Gud. De samlas i synagogan, och deras viktigaste heliga skrift heter Toran.' },
];

/* ---------- Barnens rättigheter ---------- */
export const RIGHTS = [
  { right: 'att gå i skolan', e: '🏫', silly: ['att aldrig borsta tänderna', 'att bestämma över vuxna'], fact: 'Alla barn har rätt till utbildning (barnkonventionen artikel 28).' },
  { right: 'att leka och vila', e: '🧸', silly: ['att äta godis varje dag', 'att ha en egen häst'], fact: 'Alla barn har rätt till lek, vila och fritid (artikel 31).' },
  { right: 'att säga vad de tycker', e: '🗣️', silly: ['att alltid få sin vilja igenom', 'att slippa städa'], fact: 'Barn har rätt att säga sin åsikt, och vuxna ska lyssna (artikel 12).' },
  { right: 'att få vård när de är sjuka', e: '🏥', silly: ['att få en ny mobil varje år', 'att aldrig gå och lägga sig'], fact: 'Alla barn har rätt till sjukvård och att må bra (artikel 24).' },
  { right: 'att vara trygga och skyddas från våld', e: '🤗', silly: ['att få vara uppe hela natten', 'att bara äta glass'], fact: 'Alla barn har rätt att skyddas mot våld (artikel 19).' },
  { right: 'att behandlas lika, oavsett var de kommer ifrån', e: '🤝', silly: ['att vinna alla tävlingar', 'att få bestämma i skolan'], fact: 'Alla barn är lika mycket värda (artikel 2). Barnkonventionen är svensk lag sedan 2020.' },
  { right: 'att ha ett namn och ett land', e: '📛', silly: ['att ha tre husdjur', 'att få åka på semester varje år'], fact: 'Alla barn har rätt till ett namn och ett medborgarskap från födseln (artikel 7).' },
  { right: 'att få mat och ett hem', e: '🏠', silly: ['att få pizza varje dag', 'att ha ett eget badrum'], fact: 'Alla barn har rätt till en skälig levnadsstandard – mat, kläder och någonstans att bo (artikel 27).' },
];
// Rättighet eller önskan?
export const NEEDS_WANTS = [
  { id: 'skola', e: '🏫', n: 'gå i skolan', bin: 'ratt' },
  { id: 'mat', e: '🍎', n: 'mat', bin: 'ratt' },
  { id: 'vard', e: '🏥', n: 'vård när man är sjuk', bin: 'ratt' },
  { id: 'lek', e: '🧸', n: 'leka och vila', bin: 'ratt' },
  { id: 'hem', e: '🏠', n: 'ett hem', bin: 'ratt' },
  { id: 'vatten', e: '🚰', n: 'rent vatten', bin: 'ratt' },
  { id: 'mobil', e: '📱', n: 'en egen mobil', bin: 'onskan' },
  { id: 'godis', e: '🍭', n: 'godis varje dag', bin: 'onskan' },
  { id: 'hast', e: '🐴', n: 'en egen häst', bin: 'onskan' },
  { id: 'spel', e: '🎮', n: 'ett nytt tv-spel', bin: 'onskan' },
  { id: 'resa', e: '✈️', n: 'en resa utomlands', bin: 'onskan' },
  { id: 'pool', e: '🏊', n: 'en egen pool', bin: 'onskan' },
];
// Rättighetsscenarier (nivå 2–4).
export const RIGHTS_CASES = [
  { min: 2, q: 'Lisa får inte vara med i fotbollslaget för att hon är tjej. Vad säger barnkonventionen?', a: 'Det är fel – alla barn är lika mycket värda', w: ['Det är okej om laget vill det', 'Tjejer får bara spela med tjejer'], ex: 'Ingen får behandlas sämre för att de är tjej eller kille, eller för var de kommer ifrån (artikel 2).' },
  { min: 2, q: 'Ali har precis flyttat till Sverige och kan inte svenska än. Har han rätt att gå i skolan?', a: 'Ja, alla barn har rätt att gå i skolan', w: ['Nej, först måste han lära sig svenska', 'Bara om föräldrarna betalar'], ex: 'Alla barn har rätt till utbildning, oavsett vilket språk de pratar (artikel 28). I skolan får man hjälp att lära sig svenska.' },
  { min: 2, q: 'Klassen ska bestämma vart de ska åka på utflykt. Vad har barnen rätt till?', a: 'Att säga vad de tycker', w: ['Att alltid få som de vill', 'Ingenting – vuxna bestämmer allt'], ex: 'Barn har rätt att säga sin åsikt i frågor som rör dem, och vuxna ska lyssna (artikel 12). Ibland bestämmer vuxna ändå, men de ska ha lyssnat.' },
  { min: 3, q: 'Vad är barnkonventionen?', a: 'En överenskommelse om vilka rättigheter alla barn har', w: ['En tävling för barn', 'En lista med läxor'], ex: 'Barnkonventionen gjordes av FN 1989. Nästan alla länder i världen har lovat att följa den. I Sverige är den lag sedan 2020.' },
  { min: 3, q: 'Upp till vilken ålder räknas man som barn i barnkonventionen?', a: 'Tills man fyller 18 år', w: ['Tills man fyller 10 år', 'Tills man börjar skolan'], ex: 'Alla under 18 år är barn enligt barnkonventionen (artikel 1).' },
  { min: 3, q: 'Elsa är sjuk och hennes familj har inte mycket pengar. Har hon rätt till vård?', a: 'Ja, alla barn har rätt till vård', w: ['Nej, bara om familjen är rik', 'Bara om hon bor i en stor stad'], ex: 'Alla barn har rätt till bästa möjliga hälsa och sjukvård (artikel 24). I Sverige är vården gratis för barn.' },
  { min: 4, q: 'Vad betyder "barnets bästa"?', a: 'Vuxna ska tänka på vad som är bäst för barnet när de bestämmer', w: ['Barnet ska alltid få det dyraste', 'Barnet bestämmer allting själv'], ex: 'När vuxna fattar beslut som rör barn ska de först tänka på vad som är bäst för barnet (artikel 3).' },
];

/* ---------- Normer och regler ---------- */
export const RULE_CASES = [
  { min: 0, max: 1, q: 'Hur visar du att du vill säga något i klassen?', a: ['Räcker upp handen', '✋'], w: [['Ropar högt', '📢'], ['Somnar', '😴']], ex: 'Man räcker upp handen och väntar på sin tur. Då kan alla höras.' },
  { min: 0, max: 1, q: 'Vad säger man när man har gjort fel mot någon?', a: ['Förlåt', '🙏'], w: [['Hej då', '👋'], ['Grattis', '🎉']], ex: 'Att säga förlåt och försöka göra det bra igen visar att man bryr sig.' },
  { min: 0, max: 1, q: 'En kompis är ledsen. Vad kan du göra?', a: ['Fråga hur det är', '🤗'], w: [['Skratta', '😂'], ['Springa iväg', '🏃']], ex: 'Att fråga hur någon mår och lyssna är att vara en bra kompis.' },
  { min: 0, max: 1, q: 'Vad gör man med skräp i skolan?', a: ['Slänger det i papperskorgen', '🗑️'], w: [['Kastar det på golvet', '⬇️'], ['Gömmer det i bänken', '🙈']], ex: 'Om alla hjälper till blir skolan en fin plats att vara på.' },
  { min: 1, max: 4, q: 'Någon säger "Du får inte vara med!" till en kompis. Vad är schysst att göra?', a: 'Säga: "Klart du får vara med!"', w: ['Skratta åt kompisen', 'Låtsas att man inte hörde'], ex: 'I skolan ska alla få vara med. Ingen ska bli utanför.' },
  { min: 1, max: 4, q: 'Varför har vi regler i skolan?', a: 'För att alla ska känna sig trygga och kunna lära sig', w: ['För att vuxna ska få bestämma allt', 'För att det ska bli tråkigt'], ex: 'Regler hjälper oss att vara schyssta mot varandra. Många skolor bestämmer ordningsreglerna tillsammans med eleverna.' },
  { min: 1, max: 4, q: 'Du råkar ha sönder en kompis penna. Vad är bra att göra?', a: 'Säga förlåt och försöka hjälpa till', w: ['Gömma pennan', 'Säga att någon annan gjorde det'], ex: 'Alla gör misstag ibland. Det viktiga är att man säger som det är och försöker ställa det till rätta.' },
  { min: 1, max: 4, q: 'Du har förlorat en match. Vad gör en god förlorare?', a: 'Säger grattis till dem som vann', w: ['Sparkar iväg bollen', 'Säger att de andra fuskade'], ex: 'I idrotten är det viktigt att vara schysst både när man vinner och förlorar. Det kallas att visa fair play.' },
  { min: 2, max: 4, q: 'Du vill lägga ut ett foto på din kompis på nätet. Vad gör du först?', a: 'Frågar kompisen om det är okej', w: ['Lägger ut det direkt', 'Skriver något roligt om kompisen till bilden'], ex: 'Fråga alltid innan du delar en bild på någon annan. Alla får bestämma över bilder på sig själva.' },
  { min: 2, max: 4, q: 'Någon du inte känner frågar efter ditt lösenord i ett spel. Vad gör du?', a: 'Säger nej och berättar för en vuxen', w: ['Skickar lösenordet', 'Skickar en kompis lösenord i stället'], ex: 'Ditt lösenord är hemligt – dela det inte med någon på nätet. Berätta för en vuxen om någon frågar.' },
  { min: 2, max: 4, q: 'Någon skriver elaka saker om en klasskompis i en chatt. Vad gör du?', a: 'Berättar för en vuxen och skriver inget elakt själv', w: ['Skriver något ännu elakare', 'Skickar det vidare till fler'], ex: 'Samma regler gäller på nätet som i verkligheten: man ska vara snäll. Om någon blir illa behandlad ska en vuxen få veta det.' },
  { min: 2, max: 4, q: 'Hur länge får man spela på surfplattan?', a: 'Det bestämmer familjen tillsammans', w: ['Hur länge man vill, varje dag', 'Det bestämmer spelet'], ex: 'Olika familjer har olika regler. Det är bra att prata om reglerna så att alla förstår varför de finns.' },
  { min: 3, max: 4, q: 'Vad är en norm?', a: 'En oskriven regel som många följer, som att säga hej', w: ['En lag som polisen skriver', 'Ett sorts spel'], ex: 'Normer är oskrivna regler för hur man brukar göra, till exempel att stå i kö. Normer kan ändras med tiden.' },
  { min: 3, max: 4, q: 'Vad är skillnaden mellan en regel och en lag?', a: 'En lag gäller i hela landet, en regel kan gälla bara i skolan eller hemma', w: ['Det är ingen skillnad', 'Regler gäller bara vuxna'], ex: 'Lagar bestäms av riksdagen och gäller alla i Sverige. Regler kan bestämmas av en skola, en klubb eller en familj.' },
  { min: 3, max: 4, q: 'Vem bestämmer lagarna i Sverige?', a: 'Riksdagen', w: ['Kungen', 'Rektorn'], ex: 'Riksdagen stiftar lagarna. Ledamöterna i riksdagen väljs av folket vart fjärde år. Kungen bestämmer inte över lagarna.' },
  { min: 3, max: 4, q: 'Någon vill att du ska hålla en hemlighet som känns obehaglig. Vad gör du?', a: 'Berättar för en vuxen du litar på', w: ['Håller tyst för alltid', 'Berättar inte för någon'], ex: 'Hemligheter som känns dåliga i magen ska man berätta om. Det är aldrig fel att be en vuxen om hjälp.' },
];

/* ---------- Trafik och säkerhet ---------- */
export const TRAFFIC = [
  { min: 0, max: 1, q: 'Vilken färg har gubben när du får gå?', a: ['Grön', '🟢'], w: [['Röd', '🔴']], ex: 'Grön gubbe betyder gå. Röd gubbe betyder stå still och vänta. Titta ändå åt båda hållen!' },
  { min: 0, max: 1, q: 'Vad ska du ha på huvudet när du cyklar?', a: ['Hjälm', '⛑️'], w: [['Krona', '👑'], ['Hatt', '🎩']], ex: 'Hjälmen skyddar huvudet om du ramlar. I Sverige måste alla barn under 15 år ha hjälm när de cyklar.' },
  { min: 0, max: 1, q: 'Vad ska du ha på dig så att bilarna ser dig när det är mörkt?', a: ['Reflexväst', '🦺'], w: [['Solglasögon', '🕶️'], ['Ballong', '🎈']], ex: 'Reflexer lyser upp när bilarnas ljus träffar dem. Då ser bilisterna dig mycket tidigare.' },
  { min: 0, max: 1, q: 'Vad gör du om bollen rullar ut på gatan?', a: ['Stannar och hämtar en vuxen', '✋'], w: [['Springer efter', '🏃']], ex: 'Spring aldrig efter en boll ut på gatan. Stanna och be en vuxen om hjälp.' },
  { min: 0, max: 1, q: 'Vad har man på sig i bilen?', a: ['Bälte', '🚗'], w: [['Flytväst', '🛟'], ['Badmössa', '🏊']], ex: 'Alla i bilen ska ha bälte. Barn sitter i bilbarnstol eller på en bälteskudde.' },
  { min: 1, max: 4, q: 'Hur tittar du innan du går över gatan?', a: 'Åt vänster, åt höger och åt vänster igen', w: ['Bara rakt fram', 'Upp i himlen'], ex: 'Titta vänster, höger och vänster igen – och lyssna. Gå först när det är helt säkert.' },
  { min: 1, max: 4, q: 'Var är det säkrast att gå över gatan?', a: 'Vid ett övergångsställe eller trafikljus', w: ['Mellan två parkerade bilar', 'I en kurva'], ex: 'Vid övergångsställen och trafikljus är bilisterna beredda på att någon ska gå över. Bakom parkerade bilar syns du inte.' },
  { min: 1, max: 4, q: 'Vilket nummer ringer man om det har hänt en olycka?', a: '112', w: ['123', '911'], ex: '112 är numret till larmcentralen i Sverige och i hela EU. Där får man hjälp av ambulans, polis eller räddningstjänst.' },
  { min: 2, max: 4, q: 'På vilken sida av vägen cyklar man i Sverige?', a: 'Höger sida', w: ['Vänster sida', 'Mitt på vägen'], ex: 'I Sverige kör och cyklar man på höger sida. Finns det en cykelbana ska man använda den.' },
  { min: 2, max: 4, q: 'Vad betyder gult ljus i trafikljuset?', a: 'Snart byter ljuset – var beredd', w: ['Kör så fort du kan', 'Det är trasigt'], ex: 'Gult ljus är en varning: ljuset håller på att byta. Bilarna ska stanna om de kan.' },
  { min: 2, max: 4, q: 'Varför ska man ha reflex när det är mörkt?', a: 'Då syns man på mycket längre håll', w: ['För att det är fint', 'För att hålla värmen'], ex: 'Utan reflex syns du kanske bara på 25–50 meter. Med reflex syns du på över 100 meter – då hinner bilisten bromsa.' },
  { min: 2, max: 4, q: 'Vad betyder skylten?', sign: '🛑', a: 'Stanna helt', w: ['Kör fortare', 'Parkering'], ex: 'Stoppskylten är röd och åttakantig. Där måste fordonen stanna helt, även om ingen kommer.' },
  { min: 2, max: 4, q: 'Vad betyder skylten?', sign: '🚸', a: 'Se upp – här kan det finnas barn', w: ['Här får man inte gå', 'Här finns en lekpark för vuxna'], ex: 'Skylten varnar bilisterna för att det kan finnas barn i närheten, till exempel vid en skola.' },
  { min: 3, max: 4, q: 'Vad betyder skylten?', sign: '⛔', a: 'Här får man inte köra in', w: ['Här får man parkera', 'Här börjar motorvägen'], ex: 'Skylten betyder förbud mot infart. Man får inte köra in på vägen från det hållet.' },
  { min: 3, max: 4, q: 'Upp till vilken ålder måste man ha cykelhjälm enligt lagen i Sverige?', a: 'Tills man fyller 15 år', w: ['Tills man fyller 7 år', 'Tills man fyller 18 år'], ex: 'Lagen säger att barn under 15 år ska ha hjälm när de cyklar. Det är klokt för vuxna också.' },
  { min: 3, max: 4, q: 'En bil kommer till ett övergångsställe där någon väntar och inget trafikljus finns. Vad ska bilen göra?', a: 'Stanna och släppa fram den som ska gå', w: ['Tuta och köra förbi', 'Köra fortare'], ex: 'Bilar ska stanna för gående vid övergångsställen. Men titta alltid själv så att bilen verkligen stannar!' },
  { min: 3, max: 4, q: 'Varför ska barn som är kortare än 140 cm inte sitta framför en krockkudde?', a: 'Krockkudden kan skada ett barn', w: ['Det blir för trångt', 'Barn får inte se ut genom fönstret'], ex: 'Krockkudden blåses upp väldigt snabbt och hårt. Den är gjord för vuxna, så barn ska sitta bak eller ha krockkudden avstängd.' },
];

/* ---------- Pengar ---------- */
export const COINS = [1, 2, 5, 10];
export const NOTES = [20, 50, 100, 200, 500];
const coinHtml = (v) => (v >= 20 ? `<span class="wnote n${v}">${v} kr</span>` : `<span class="wcoin c${v}">${v}</span>`);
export const moneyHtml = (vals) => `<div class="money-row">${vals.map(coinHtml).join('')}</div>`;

export const PRICES = [
  { n: 'ett äpple', e: '🍎', a: '5 kr', w: ['50 kr', '500 kr'] },
  { n: 'en liter mjölk', e: '🥛', a: '15 kr', w: ['150 kr', '1 500 kr'] },
  { n: 'en glass i kiosken', e: '🍦', a: '25 kr', w: ['250 kr', '2 500 kr'] },
  { n: 'en pizza på restaurang', e: '🍕', a: '120 kr', w: ['12 kr', '1 200 kr'] },
  { n: 'en tröja', e: '👕', a: '200 kr', w: ['2 kr', '20 000 kr'] },
  { n: 'en barncykel', e: '🚲', a: '3 000 kr', w: ['30 kr', '300 000 kr'] },
  { n: 'en ny bil', e: '🚗', a: '300 000 kr', w: ['300 kr', '3 000 kr'] },
];
export const SHOP = [
  { n: 'en glass', e: '🍦', p: 15 }, { n: 'ett äpple', e: '🍎', p: 5 }, { n: 'en penna', e: '✏️', p: 12 }, { n: 'ett suddgummi', e: '🧽', p: 8 },
  { n: 'en bulle', e: '🥐', p: 18 }, { n: 'en tidning', e: '📰', p: 35 }, { n: 'en boll', e: '⚽', p: 49 }, { n: 'en bok', e: '📕', p: 79 },
  { n: 'en banan', e: '🍌', p: 4 }, { n: 'en dricka', e: '🧃', p: 14 },
];
export const MONEY_FACTS = [
  { min: 1, q: 'Hur kan man betala när man handlar?', a: 'Med kontanter, kort eller mobilen', w: ['Bara med guld', 'Med skratt'], ex: 'Kontanter är mynt och sedlar. Många betalar med kort eller med en app i mobilen, till exempel Swish.' },
  { min: 1, q: 'Varifrån får vuxna oftast sina pengar?', a: 'De får lön för att de arbetar', w: ['Pengarna växer på träd', 'Banken ger bort pengar gratis'], ex: 'De flesta vuxna arbetar och får lön. Pengarna går till hyra, mat, kläder och mycket annat.' },
  { min: 1, q: 'Vad betyder det att spara pengar?', a: 'Att lägga undan pengar till senare', w: ['Att slänga pengar', 'Att låna pengar'], ex: 'Om man sparar lite i taget kan man till slut köpa något större, som en cykel.' },
  { min: 2, q: 'Vilka mynt finns i Sverige?', a: '1, 2, 5 och 10 kronor', w: ['1, 3 och 7 kronor', '20, 50 och 100 kronor'], ex: 'Svenska mynt är 1, 2, 5 och 10 kronor. 20, 50, 100, 200 och 500 kronor är sedlar.' },
  { min: 2, q: 'Vad är skillnaden mellan något man behöver och något man önskar sig?', a: 'Man behöver mat och kläder, men önskar sig leksaker', w: ['Det är samma sak', 'Man behöver godis varje dag'], ex: 'Behov är sådant man måste ha för att leva och må bra. Önskningar är saker som är roliga men inte nödvändiga.' },
  { min: 3, q: 'Vad gör man med skatten man betalar?', a: 'Den betalar till exempel skolor, vård och vägar', w: ['Kungen får den i fickpengar', 'Den slängs'], ex: 'Alla som tjänar pengar betalar skatt. Skatten går bland annat till skolor, sjukvård, bibliotek och vägar.' },
  { min: 3, q: 'Vad heter Sveriges pengar?', a: 'Kronor', w: ['Euro', 'Dollar'], ex: 'I Sverige betalar vi med svenska kronor. I Finland och många andra EU-länder använder man euro.' },
  { min: 4, q: 'Vad betyder det om något är på rea?', a: 'Det kostar mindre än vanligt', w: ['Det kostar mer än vanligt', 'Det är gratis'], ex: 'Rea betyder att priset är sänkt. Det kan ändå vara klokt att fundera på om man verkligen behöver saken.' },
  { min: 4, q: 'Varför kan det vara bra att jämföra priser?', a: 'Samma sak kan kosta olika i olika affärer', w: ['Det dyraste är alltid bäst', 'Priserna är alltid lika'], ex: 'Om man jämför priser kan man spara pengar till annat.' },
];

/* ---------- Demokrati ---------- */
export const DEMOCRACY = [
  { min: 1, q: 'Vad är ett klassråd?', a: 'Ett möte där eleverna bestämmer och tycker till om klassen', w: ['En lektion i matte', 'En rast med glass'], ex: 'På klassrådet kan alla elever ge förslag och vara med och bestämma om saker i klassen.' },
  { min: 1, q: 'Hur kan klassen bestämma när alla inte tycker lika?', a: 'Genom att rösta', w: ['Den som skriker högst bestämmer', 'Man slår en tärning'], ex: 'När man röstar räknar man hur många som vill vad. Det förslag som får flest röster vinner.' },
  { min: 2, q: 'Vem leder ett möte?', a: 'Ordföranden', w: ['Sekreteraren', 'Vaktmästaren'], ex: 'Ordföranden ser till att alla får prata i tur och ordning och att mötet går framåt.' },
  { min: 2, q: 'Vem skriver ner vad man bestämmer på ett möte?', a: 'Sekreteraren', w: ['Ordföranden', 'Ingen'], ex: 'Sekreteraren skriver protokoll. Då kan alla se vad man bestämde.' },
  { min: 2, q: 'Vad betyder yttrandefrihet?', a: 'Att man får säga vad man tycker', w: ['Att man får göra vad man vill', 'Att bara vuxna får prata'], ex: 'I Sverige får alla säga vad de tycker. Men man ska inte hota eller kränka andra.' },
  { min: 3, q: 'Vad betyder demokrati?', a: 'Att folket är med och bestämmer', w: ['Att en person bestämmer allt', 'Att ingen bestämmer något'], ex: 'Ordet demokrati kommer från grekiskan och betyder ungefär "folkstyre".' },
  { min: 3, q: 'Vad betyder majoritet?', a: 'Fler än hälften', w: ['Färre än hälften', 'Exakt hälften'], ex: 'När mer än hälften röstar på samma sak har den sidan majoritet och vinner omröstningen.' },
  { min: 3, q: 'Varför röstar man ofta hemligt?', a: 'Då kan alla rösta på det de själva vill', w: ['För att det är roligare', 'För att ingen ska rösta'], ex: 'Med hemlig röstning behöver ingen vara rädd för vad andra ska tycka om ens röst.' },
  { min: 4, q: 'Hur gammal måste man vara för att rösta i riksdagsvalet?', a: '18 år', w: ['12 år', '30 år'], ex: 'I Sverige får man rösta i riksdagsvalet när man har fyllt 18 år.' },
  { min: 4, q: 'Hur ofta är det val till riksdagen i Sverige?', a: 'Vart fjärde år', w: ['Varje år', 'Vart tionde år'], ex: 'Det är riksdagsval vart fjärde år. Då väljer vi vilka som ska sitta i riksdagen.' },
  { min: 4, q: 'Hur många ledamöter sitter i Sveriges riksdag?', a: '349', w: ['25', '1 000'], ex: 'Riksdagen har 349 ledamöter. De röstar om lagar och om hur skattepengarna ska användas.' },
];
const VOTE_TOPICS = [
  { e: '⚽', n: 'fotboll' }, { e: '🏃', n: 'kull' }, { e: '🌲', n: 'skogen' }, { e: '🏊', n: 'badhuset' }, { e: '🎨', n: 'måla' },
  { e: '🎬', n: 'film' }, { e: '🍕', n: 'pizza' }, { e: '🌮', n: 'tacos' }, { e: '🧁', n: 'muffins' }, { e: '📚', n: 'högläsning' },
];

/* ---------- Sant eller falskt ---------- */
export const TRUE_FALSE = [
  { min: 0, max: 2, s: 'Sverige ligger i Europa.', t: true, ex: 'Ja! Sverige ligger i norra Europa.' },
  { min: 0, max: 2, s: 'Pingviner bor vid Nordpolen.', t: false, ex: 'Pingviner bor på södra halvan av jorden, till exempel i Antarktis. Vid Nordpolen bor isbjörnar.' },
  { min: 0, max: 2, s: 'Solen går upp i väster.', t: false, ex: 'Solen går upp i öster och ner i väster.' },
  { min: 0, max: 2, s: 'Kängurur lever vilt i Australien.', t: true, ex: 'Ja! Kängurur finns vilda bara i Australien och på Nya Guinea.' },
  { min: 0, max: 2, s: 'Isbjörnar bor i Afrika.', t: false, ex: 'Isbjörnar bor där det är kallt, runt Nordpolen. I Afrika är det för varmt.' },
  { min: 0, max: 2, s: 'Det finns mer hav än land på jorden.', t: true, ex: 'Ja! Ungefär sju tiondelar av jordens yta är hav. Därför kallas jorden ibland den blå planeten.' },
  { min: 0, max: 2, s: 'Lejon lever vilt i svenska skogar.', t: false, ex: 'Vilda lejon finns i Afrika (och några få i Indien). I Sverige finns i stället till exempel älg, räv och lodjur.' },
  { min: 0, max: 3, s: 'Stockholm är Sveriges huvudstad.', t: true, ex: 'Ja! I Stockholm finns riksdagen och regeringen.' },
  { min: 1, max: 3, s: 'Det finns sju världsdelar.', t: true, ex: 'Ja: Europa, Asien, Afrika, Nordamerika, Sydamerika, Oceanien och Antarktis.' },
  { min: 1, max: 3, s: 'Norge är Sveriges granne.', t: true, ex: 'Ja! Sverige har gräns mot Norge och Finland. Danmark ligger på andra sidan Öresund.' },
  { min: 2, max: 4, s: 'Vänern är Sveriges största sjö.', t: true, ex: 'Ja! Vänern är Sveriges – och EU:s – största sjö.' },
  { min: 2, max: 4, s: 'Gotland är Sveriges största ö.', t: true, ex: 'Ja! Näst störst är Öland.' },
  { min: 2, max: 4, s: 'Kebnekaise är Sveriges högsta berg.', t: true, ex: 'Ja! Kebnekaise i Lappland är nästan 2 100 meter högt.' },
  { min: 2, max: 4, s: 'Malmö ligger längst norrut i Sverige.', t: false, ex: 'Malmö ligger långt söderut, i Skåne. Kiruna ligger mycket längre norrut.' },
  { min: 2, max: 4, s: 'Egypten ligger i Asien.', t: false, ex: 'Egypten ligger i Afrika, i nordöstra hörnet.' },
  { min: 2, max: 4, s: 'Brasilien ligger i Sydamerika.', t: true, ex: 'Ja! Brasilien är Sydamerikas största land.' },
  { min: 2, max: 4, s: 'Antarktis är varmare än Sahara.', t: false, ex: 'Antarktis är jordens kallaste plats. Sahara är en het öken.' },
  { min: 2, max: 4, s: 'Göteborg ligger vid Östersjön.', t: false, ex: 'Göteborg ligger vid Västerhavet, på Sveriges västkust. Stockholm ligger vid Östersjön.' },
  { min: 3, max: 4, s: 'Kiruna ligger norr om polcirkeln.', t: true, ex: 'Ja! Därför har Kiruna midnattssol på sommaren.' },
  { min: 3, max: 4, s: 'I Finland pratar många svenska.', t: true, ex: 'Ja! Finland har två officiella språk: finska och svenska.' },
  { min: 3, max: 4, s: 'Danmark ligger norr om Sverige.', t: false, ex: 'Danmark ligger söder om Sverige, på andra sidan Öresund.' },
  { min: 3, max: 4, s: 'Sverige har 25 landskap.', t: true, ex: 'Ja! Från Skåne i söder till Lappland i norr.' },
  { min: 3, max: 4, s: 'Det bor fler än 10 miljoner människor i Sverige.', t: true, ex: 'Ja! Det bor ungefär 10,5 miljoner människor i Sverige.' },
  { min: 3, max: 4, s: 'Amazonas regnskog finns i Afrika.', t: false, ex: 'Amazonas regnskog finns i Sydamerika, mest i Brasilien.' },
  { min: 4, max: 4, s: 'Stilla havet är världens största hav.', t: true, ex: 'Ja! Stilla havet är större än allt land på jorden tillsammans.' },
  { min: 4, max: 4, s: 'Mount Everest är världens högsta berg.', t: true, ex: 'Ja! Det är nästan 8 850 meter högt och ligger mellan Nepal och Kina.' },
  { min: 4, max: 4, s: 'Kina är landet där flest människor bor.', t: false, ex: 'Sedan 2023 bor det fler människor i Indien än i Kina.' },
  { min: 4, max: 4, s: 'Ryssland är världens största land till ytan.', t: true, ex: 'Ja! Ryssland ligger både i Europa och i Asien och är jättestort.' },
  { min: 4, max: 4, s: 'Island ligger i Asien.', t: false, ex: 'Island ligger i Europa, ute i Atlanten mellan Norge och Grönland.' },
  { min: 4, max: 4, s: 'Kungen bestämmer Sveriges lagar.', t: false, ex: 'Det är riksdagen som bestämmer lagarna. Kungen är statschef men har ingen politisk makt.' },
  { min: 4, max: 4, s: 'I Sverige får man rösta i riksdagsvalet från 16 år.', t: false, ex: 'Man får rösta från 18 år.' },
  { min: 4, max: 4, s: 'Vatikanstaten är världens minsta land.', t: true, ex: 'Ja! Vatikanstaten ligger mitt i Rom och är mindre än en halv kvadratkilometer.' },
  { min: 4, max: 4, s: 'Sahara är världens största varma öken.', t: true, ex: 'Ja! Sahara är nästan lika stor som hela USA.' },
];

/* ======================= Hjälpfunktioner ======================= */
const contName = (id) => (id === 'arktis' ? ARKTIS.name : CONTINENTS.find((c) => c.id === id).name);
const qpic = (key, alt, e) => photo(key, { alt, cls: 'qphoto', fallback: `<span class="pic-big">${e || '🖼️'}</span>` });
const emojiOpt = (id, e, say) => ({ id, html: `<span class="pic">${e}</span><span class="lbl">${say}</span>`, say });
/**
 * Bildsvar för förläsare: foton om ALLA alternativ har foto (annars kan ett ensamt foto avslöja svaret),
 * annars stora emoji. say = det som läses upp för alternativet.
 */
function imgOptions(items, { key = (x) => x.id, e = (x) => x.e, say = () => '' } = {}) {
  const photos = items.every((x) => hasPhoto(key(x)));
  return items.map((x) => ({ id: x.id, html: photos ? photo(key(x), { alt: '', cls: 'ophoto' }) : `<span class="pic">${e(x)}</span>`, say: say(x) }));
}
const inLevel = (x, level) => (x.min ?? 0) <= level && level <= (x.max ?? 4);

/** Flervalsfråga från en frågebank-post {q, a, w, ex}. a/w kan vara text eller [text, emoji]. */
function bankChoice(rng, item, level, extra = {}) {
  const many = level >= 3 ? 3 : 2;
  const wrong = rng.sample(item.w, many);
  const all = [item.a, ...wrong];
  // Ett svar kan vara ['text', '🔥'] eller bara ['text'] – utan emoji blir det ett textalternativ
  // (annars ritades "undefined" i en bred bildruta som gav sidledsscroll på iPad).
  const withPic = (x) => Array.isArray(x) && !!x[1];
  const options = all.map((x) => (withPic(x) ? emojiOpt(x[0], x[1], x[0]) : Array.isArray(x) ? { id: x[0], label: x[0] } : { id: x, label: x }));
  const answer = Array.isArray(item.a) ? item.a[0] : item.a;
  return { type: 'choice', prompt: item.q, options: rng.shuffle(options), answer, explain: item.ex, wide: withPic(item.a), ...extra };
}

/* ---------- Djur i världen ---------- */
export function genWorldAnimals(level, rng) {
  const a = rng.pick(WORLD_ANIMALS);
  if (level === 0) {
    // De yngsta: välj rätt djur bland tre foton.
    const others = rng.sample(WORLD_ANIMALS.filter((x) => x.id !== a.id), 2);
    return {
      type: 'choice', prompt: `Var är ${a.def}?`, say: `Tryck på ${a.def}.`, wide: true,
      options: imgOptions(rng.shuffle([a, ...others])),
      answer: a.id, hint: `Leta efter ${a.def}.`, explain: a.fact, collect: { set: 'places', item: a.id },
    };
  }
  const regions = [...CONTINENTS.map((c) => c.id), 'arktis'];
  const wrong = rng.sample(regions.filter((r) => r !== a.home && !(a.not || []).includes(r)), level <= 1 ? 2 : 3);
  return {
    type: 'choice', prompt: `Var i världen bor ${a.def} i det vilda?`,
    visual: qpic(a.id, a.name, a.e),
    options: rng.shuffle([a.home, ...wrong]).map((r) => ({ id: r, label: contName(r) })),
    answer: a.home, hint: 'Tänk på klimatet: varmt, kallt, regnskog eller öken?', explain: a.fact, collect: { set: 'places', item: a.id },
  };
}

/* ---------- Kända platser ---------- */
export function genPlaces(level, rng) {
  const pl = rng.pick(PLACES);
  if (level === 0) {
    // Olika emoji så att reservbilderna går att skilja åt (Everest och Kilimanjaro har båda 🏔️).
    const others = rng.sample(PLACES.filter((x) => x.id !== pl.id && x.e !== pl.e), 2);
    return {
      type: 'choice', prompt: `Var är ${pl.name}?`, say: `Tryck på ${pl.name}.`, wide: true,
      options: imgOptions(rng.shuffle([pl, ...others])),
      answer: pl.id, hint: pl.fact, explain: pl.fact, collect: { set: 'places', item: pl.id },
    };
  }
  if (level === 1 || rng.chance(0.4)) {
    const others = rng.sample(PLACES.filter((x) => x.id !== pl.id), 2);
    return {
      type: 'choice', prompt: 'Vad heter platsen på bilden?', visual: qpic(pl.id, pl.name, pl.e),
      options: rng.shuffle([pl, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: pl.id,
      hint: `Den finns ${pl.in}.`, explain: pl.fact, collect: { set: 'places', item: pl.id },
    };
  }
  if (pl.noCountryQ) {
    const others = rng.sample(PLACES.filter((x) => x.id !== pl.id), level >= 3 ? 3 : 2);
    return {
      type: 'choice', prompt: 'Vad heter platsen på bilden?', visual: qpic(pl.id, pl.name, pl.e),
      options: rng.shuffle([pl, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: pl.id,
      hint: `Den finns ${pl.in}.`, explain: pl.fact, collect: { set: 'places', item: pl.id },
    };
  }
  const others = rng.sample([...new Map(PLACES.filter((x) => x.country !== pl.country && !x.noCountryQ).map((x) => [x.country, x])).values()], level >= 3 ? 3 : 2);
  return {
    type: 'choice', prompt: `I vilket land finns ${pl.name}?`, visual: qpic(pl.id, pl.name, pl.e),
    options: rng.shuffle([pl, ...others]).map((x) => ({ id: x.country, label: `${x.flag} ${x.country}`, say: x.country })), answer: pl.country,
    hint: pl.id === 'moai' ? 'Påskön ligger långt ute i Stilla havet, men landet den tillhör ligger i Sydamerika.' : `Det ligger i ${contName(pl.cont)}.`, explain: pl.fact, collect: { set: 'places', item: pl.id },
  };
}

/* ---------- Världshaven ---------- */
const SEA_ANIMALS = [['val', '🐋'], ['bläckfisk', '🐙'], ['delfin', '🐬'], ['hummer', '🦞'], ['havssköldpadda', '🐢'], ['haj', '🦈']];
const LAND_ANIMALS = [['kamel', '🐫'], ['giraff', '🦒'], ['ko', '🐄'], ['ekorre', '🐿️'], ['häst', '🐴']];
const OCEAN_FACTS = [
  { q: 'Vilket är världens största hav?', a: 'stilla', ex: 'Stilla havet är störst. Det täcker nästan en tredjedel av jorden.' },
  { q: 'Vilket hav ligger mellan Europa och Nordamerika?', a: 'atlanten', ex: 'Atlanten ligger mellan Europa och Afrika i öster och Amerika i väster.' },
  { q: 'Vilket hav ligger runt Antarktis?', a: 'sodra', ex: 'Södra ishavet ligger runt hela Antarktis.' },
  { q: 'Vilket hav ligger runt Nordpolen?', a: 'norra', ex: 'Norra ishavet ligger runt Nordpolen och är det minsta världshavet.' },
  { q: 'Vilket hav ligger mellan Afrika och Australien?', a: 'indiska', ex: 'Indiska oceanen ligger mellan Afrika, Asien och Australien.' },
  { q: 'Vilket hav ligger mellan Asien och Amerika?', a: 'stilla', ex: 'Stilla havet ligger mellan Asien och Australien i väster och Amerika i öster.' },
  { q: 'Vilket är det varmaste världshavet?', a: 'indiska', ex: 'En stor del av Indiska oceanen ligger nära ekvatorn, där solen värmer mest. Därför är den varmast.' },
  { q: 'Vilket är det minsta världshavet?', a: 'norra', ex: 'Norra ishavet är minst. En stor del av året är det täckt av is.' },
];
const SWEDISH_SEAS = [
  { q: 'Vid vilket hav ligger Göteborg?', a: 'Västerhavet', ex: 'Göteborg ligger på västkusten vid Västerhavet, som hänger ihop med Atlanten.' },
  { q: 'Vid vilket hav ligger Stockholm?', a: 'Östersjön', ex: 'Stockholm ligger på ostkusten, där Mälaren rinner ut i Östersjön.' },
  { q: 'Vid vilket hav ligger Visby?', a: 'Östersjön', ex: 'Gotland och Visby ligger mitt ute i Östersjön.' },
  { q: 'Vid vilket hav ligger Kalmar?', a: 'Östersjön', ex: 'Kalmar ligger vid Östersjön, mittemot Öland.' },
];
export function genOceans(level, rng) {
  if (level === 0) {
    if (rng.chance(0.4)) {
      return {
        type: 'choice', prompt: 'Finns det mest hav eller mest land på jorden?', visual: '<span class="pic-big">🌍</span>', wide: true,
        options: rng.shuffle([emojiOpt('hav', '🌊', 'mest hav'), emojiOpt('land', '🏞️', 'mest land')]), answer: 'hav',
        hint: 'Titta på jordgloben – vilken färg ser du mest?', explain: 'Det finns mest hav! Ungefär sju tiondelar av jorden är täckt av vatten.',
      };
    }
    const [n, e] = rng.pick(SEA_ANIMALS);
    const others = rng.sample(LAND_ANIMALS, 2);
    return {
      type: 'choice', prompt: 'Vilket djur bor i havet?', wide: true,
      options: rng.shuffle([emojiOpt(n, e, n), ...others.map(([m, f]) => emojiOpt(m, f, m))]), answer: n,
      hint: 'Vem kan simma under vattnet hela livet?', explain: `${n[0].toUpperCase()}${n.slice(1)} bor i havet. Jordens hav är fulla av liv – från små räkor till jättestora valar.`,
    };
  }
  if (level <= 2 || rng.chance(0.45)) {
    const o = rng.pick(level === 1 ? OCEANS.filter((x) => x.id !== 'sodra') : OCEANS);
    return {
      type: 'tap', prompt: `Tryck på ${o.name}!`, say: `Tryck på ${o.name} på kartan.`,
      visual: worldMapSvg(null, { oceans: true, oceanLabels: level === 1, contHits: false, home: false }), answer: o.id,
      hint: level <= 1 ? 'Haven är de blå fälten mellan världsdelarna.' : o.fact, explain: o.fact,
    };
  }
  if (level >= 3 && rng.chance(0.3)) {
    const s = rng.pick(SWEDISH_SEAS);
    const opts = ['Västerhavet', 'Östersjön', 'Medelhavet'];
    return { type: 'choice', prompt: s.q, options: rng.shuffle(opts).map((o) => ({ id: o, label: o })), answer: s.a, hint: 'Västkusten eller ostkusten?', explain: s.ex };
  }
  const f = rng.pick(OCEAN_FACTS);
  const right = OCEANS.find((o) => o.id === f.a);
  const wrong = rng.sample(OCEANS.filter((o) => o.id !== f.a), level >= 4 ? 3 : 2);
  return {
    type: 'choice', prompt: f.q, visual: worldMapSvg(null, { oceans: true, oceanLabels: level < 4, contHits: false, home: false }),
    options: rng.shuffle([right, ...wrong]).map((o) => ({ id: o.id, label: o.name })), answer: f.a,
    hint: 'Titta på kartan.', explain: `${f.ex} ${right.fact}`,
  };
}

/* ---------- Flaggor och länder ---------- */
export function genFlags(level, rng) {
  if (level === 0) {
    const se = COUNTRIES[0];
    const others = rng.sample(COUNTRIES.filter((c) => !c.nordic), 2);
    return {
      type: 'choice', prompt: 'Vilken är Sveriges flagga?', wide: true,
      options: rng.shuffle([se, ...others]).map((c) => ({ id: c.id, html: `<span class="pic flag">${c.flag}</span>`, say: '' })), answer: 'sverige',
      hint: 'Sveriges flagga är blå med ett gult kors.', explain: se.fact,
    };
  }
  const pool = level === 1 ? COUNTRIES.filter((c) => c.nordic) : level === 2 ? COUNTRIES.slice(0, 14) : COUNTRIES;
  const c = rng.pick(pool);
  const n = level >= 3 ? 4 : 3;
  const mode = level <= 2 ? rng.pick(['flag', 'flag', 'which']) : rng.pick(['flag', 'capital', 'capital', 'cont']);
  if (mode === 'capital' && c.capital) {
    const others = rng.sample(COUNTRIES.filter((x) => x.id !== c.id && x.capital), n - 1);
    return {
      type: 'choice', prompt: `Vad heter huvudstaden ${inCountry(c)}?`, visual: `<span class="pic-big flag">${c.flag}</span>`,
      options: rng.shuffle([c, ...others]).map((x) => ({ id: x.capital, label: x.capital })), answer: c.capital,
      hint: c.fact, explain: `Huvudstaden ${inCountry(c)} heter ${c.capital}. ${c.fact}`,
    };
  }
  if (mode === 'cont' && c.cont) {
    const wrong = rng.sample(CONTINENTS.filter((x) => x.id !== c.cont && x.id !== 'antarktis'), n - 1);
    return {
      type: 'choice', prompt: `I vilken världsdel ligger ${c.name}?`, visual: `<span class="pic-big flag">${c.flag}</span>`,
      options: rng.shuffle([CONTINENTS.find((x) => x.id === c.cont), ...wrong]).map((x) => ({ id: x.id, label: x.name })), answer: c.cont,
      hint: 'Tänk på kartan över världen.', explain: `${c.name} ligger i ${contName(c.cont)}. ${c.fact}`,
    };
  }
  if (mode === 'which') {
    const others = rng.sample(pool.filter((x) => x.id !== c.id), n - 1);
    return {
      type: 'choice', prompt: `Vilken är flaggan för ${c.name}?`, wide: true,
      options: rng.shuffle([c, ...others]).map((x) => ({ id: x.id, html: `<span class="pic flag">${x.flag}</span>`, say: '' })), answer: c.id,
      hint: c.fact, explain: c.fact,
    };
  }
  const others = rng.sample(pool.filter((x) => x.id !== c.id), n - 1);
  return {
    type: 'choice', prompt: 'Vilket land har den här flaggan?', visual: `<span class="pic-big flag">${c.flag}</span>`,
    options: rng.shuffle([c, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: c.id,
    hint: c.cont ? `Landet ligger i ${contName(c.cont)}.` : 'Landet ligger både i Europa och i Asien.', explain: c.fact,
  };
}

/* ---------- Sverigequiz ---------- */
const BIG_FACTS = [
  { q: 'Vilken är Sveriges största sjö?', a: 'vanern', pool: ['vattern', 'malaren', 'siljan', 'storsjon'] },
  { q: 'Vilken är Sveriges näst största sjö?', a: 'vattern', pool: ['vanern', 'malaren', 'siljan'], min: 3 },
  { q: 'Vilken är Sveriges största ö?', a: 'gotland', pool: ['oland', 'vanern', 'smygehuk'] },
  { q: 'Vilket är Sveriges högsta berg?', a: 'kebnekaise', pool: ['treriksroset', 'gotland', 'siljan'] },
  { q: 'Vid vilken sjö ligger Karlstad?', a: 'vanern', pool: ['vattern', 'malaren', 'storsjon'], min: 3 },
  { q: 'Vid vilken sjö ligger Jönköping?', a: 'vattern', pool: ['vanern', 'malaren', 'siljan'], min: 3 },
  { q: 'Vid vilken sjö ligger Östersund?', a: 'storsjon', pool: ['vanern', 'vattern', 'siljan'], min: 3 },
  { q: 'Var möts Sverige, Norge och Finland?', a: 'treriksroset', pool: ['smygehuk', 'kebnekaise', 'gotland'], min: 3 },
  { q: 'Vad heter Sveriges sydligaste udde?', a: 'smygehuk', pool: ['treriksroset', 'oland', 'kebnekaise'], min: 3 },
];
const LANDSKAP = ['Skåne', 'Småland', 'Blekinge', 'Östergötland', 'Närke', 'Uppland', 'Värmland', 'Dalarna', 'Gästrikland', 'Medelpad', 'Jämtland', 'Västerbotten', 'Norrbotten', 'Lappland', 'Gotland'];
const byId = (id) => SWEDEN_PLACES.find((p) => p.id === id);
export function genSwedenQuiz(level, rng) {
  const kinds = level <= 1 ? ['big', 'capital'] : level === 2 ? ['big', 'north', 'north'] : level === 3 ? ['big', 'north', 'landsdel', 'order'] : ['big', 'landskap', 'landsdel', 'order', 'count'];
  const kind = rng.pick(kinds);
  if (kind === 'capital') {
    const c = byId('stockholm');
    const others = rng.sample(SWEDISH_CITIES.filter((x) => x.id !== 'stockholm' && ['goteborg', 'malmo', 'uppsala', 'kiruna'].includes(x.id)), 2);
    return {
      type: 'choice', prompt: 'Vad heter Sveriges huvudstad?', visual: swedenMapHtml([c]) || '<span class="pic-big">🇸🇪</span>',
      options: rng.shuffle([c, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: 'stockholm', hint: 'Där bor kungen och där finns riksdagen.', explain: c.fact,
    };
  }
  if (kind === 'north') {
    let a;
    let b;
    let guard = 0;
    do {
      [a, b] = rng.sample(SWEDISH_CITIES, 2);
    } while (Math.abs(a.lat - b.lat) < 1.5 && guard++ < 50);
    const south = rng.chance(0.4);
    const ans = (south ? a.lat < b.lat : a.lat > b.lat) ? a : b;
    const dir = south ? 'söderut' : 'norrut';
    return {
      type: 'choice', prompt: `Vilken stad ligger längst ${dir}?`, visual: swedenMapHtml(rng.shuffle([a, b]), { labels: true }),
      options: rng.shuffle([a, b]).map((x) => ({ id: x.id, label: x.name })), answer: ans.id,
      hint: 'Norr är uppåt på kartan.', explain: `${ans.name} ligger längre ${dir}. ${ans.fact}`,
    };
  }
  if (kind === 'landsdel') {
    const p = rng.pick(SWEDEN_PLACES.filter((x) => x.landsdel));
    return {
      type: 'choice', prompt: `I vilken landsdel ligger ${p.name}?`, visual: swedenMapHtml([p]),
      options: ['Götaland', 'Svealand', 'Norrland'].map((o) => ({ id: o, label: o })), answer: p.landsdel,
      hint: 'Götaland är längst söderut, Svealand i mitten och Norrland längst norrut.', explain: `${p.name} ligger i ${p.landsdel}. ${p.fact}`,
    };
  }
  if (kind === 'landskap') {
    const p = rng.pick(SWEDEN_PLACES.filter((x) => x.landskap && x.kind !== 'o'));
    const others = rng.sample(LANDSKAP.filter((l) => l !== p.landskap), 3);
    return {
      type: 'choice', prompt: `I vilket landskap ligger ${p.name}?`, visual: swedenMapHtml([p]),
      options: rng.shuffle([p.landskap, ...others]).map((o) => ({ id: o, label: o })), answer: p.landskap,
      hint: 'Sverige har 25 landskap. Titta var på kartan platsen ligger.', explain: `${p.name} ligger i ${p.landskap}. ${p.fact}`,
    };
  }
  if (kind === 'order') {
    const n = level >= 4 ? 4 : 3;
    let pick;
    let guard = 0;
    do {
      pick = rng.sample(SWEDISH_CITIES, n).sort((x, y) => y.lat - x.lat);
    } while (pick.some((p, i) => i && pick[i - 1].lat - p.lat < 0.8) && guard++ < 80);
    return {
      type: 'order', prompt: 'Sätt städerna i ordning från norr till söder.',
      items: rng.shuffle(pick).map((p) => ({ id: p.id, html: `<span class="lbl">${p.name}</span>`, say: p.name })),
      answerOrder: pick.map((p) => p.id), joiner: '↓', visual: swedenMapHtml(pick),
      hint: 'Den som ligger högst upp på kartan är längst norrut.', explain: `Från norr till söder: ${pick.map((p) => p.name).join(', ')}.`,
    };
  }
  if (kind === 'count') {
    const f = rng.pick([
      { q: 'Hur många landskap har Sverige?', a: '25', w: ['7', '50', '100'], ex: 'Sverige har 25 landskap, från Skåne i söder till Lappland i norr. Lappland är störst och Öland minst.' },
      { q: 'Hur många människor bor ungefär i Sverige?', a: '10 miljoner', w: ['1 miljon', '100 miljoner', '10 000'], ex: 'Det bor ungefär 10,5 miljoner människor i Sverige.' },
      { q: 'Hur lång är Sverige från norr till söder, ungefär?', a: '1 600 km', w: ['160 km', '16 000 km', '600 km'], ex: 'Från Treriksröset i norr till Smygehuk i söder är det ungefär 1 600 km fågelvägen.' },
      { q: 'Vilket är Sveriges största landskap?', a: 'Lappland', w: ['Skåne', 'Öland', 'Gotland'], ex: 'Lappland är Sveriges största och nordligaste landskap. Där ligger Kebnekaise.' },
    ]);
    return { type: 'choice', prompt: f.q, options: rng.shuffle([f.a, ...f.w]).map((o) => ({ id: o, label: o })), answer: f.a, hint: 'Tänk efter – vad låter rimligt?', explain: f.ex };
  }
  const f = rng.pick(BIG_FACTS.filter((x) => (x.min ?? 0) <= level));
  const right = byId(f.a);
  const wrong = rng.sample(f.pool, level >= 3 ? 3 : 2).map(byId);
  return {
    type: 'choice', prompt: f.q, visual: swedenMapHtml([right]),
    options: rng.shuffle([right, ...wrong]).map((x) => ({ id: x.id, label: `${PLACE_KIND[x.kind].e} ${x.name}`, say: x.name })), answer: right.id,
    hint: 'Kartan visar var platsen ligger.', explain: right.fact, collect: { set: 'cities', item: right.id },
  };
}

/* ---------- Väderstreck ---------- */
export const COMPASS = [
  { id: 'norr', short: 'N', deg: 0 }, { id: 'öster', short: 'Ö', deg: 90 }, { id: 'söder', short: 'S', deg: 180 }, { id: 'väster', short: 'V', deg: 270 },
  { id: 'nordost', short: 'NO', deg: 45 }, { id: 'sydost', short: 'SO', deg: 135 }, { id: 'sydväst', short: 'SV', deg: 225 }, { id: 'nordväst', short: 'NV', deg: 315 },
];
export function compassSvg(deg, { labels = true } = {}) {
  const lab = labels ? COMPASS.slice(0, 4).map((c) => {
    const a = ((c.deg - 90) * Math.PI) / 180;
    return `<text x="${100 + Math.cos(a) * 82}" y="${100 + Math.sin(a) * 82 + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="#1f2a44" font-family="var(--font-display)">${c.short}</text>`;
  }).join('') : '';
  return `<svg class="compass" viewBox="0 0 200 200" role="img" aria-label="kompass"><circle cx="100" cy="100" r="96" fill="#fff" stroke="#1f2a44" stroke-width="4"/>
    <polygon points="100,22 112,100 100,178 88,100" fill="#e5e7eb"/><polygon points="22,100 100,88 178,100 100,112" fill="#e5e7eb"/>${lab}
    <g transform="rotate(${deg} 100 100)"><polygon points="100,30 114,104 100,96 86,104" fill="#ef4444"/><polygon points="100,170 114,104 100,112 86,104" fill="#94a3b8"/></g><circle cx="100" cy="100" r="7" fill="#1f2a44"/></svg>`;
}
/** Par av platser där väderstrecket är tydligt (inte på gränsen mellan två). */
export function clearTargets(from, pool = SWEDEN_PLACES) {
  return pool.filter((p) => p.id !== from.id && isClearBearing(from, p));
}
const ORIGINS = ['goteborg', 'stockholm', 'malmo', 'umea', 'jonkoping'];
export function genCompass(level, rng) {
  if (level >= 2 && rng.chance(0.5)) {
    const from = level >= 4 && rng.chance(0.6) ? byId(rng.pick(ORIGINS)) : SWEDISH_CITIES[0];
    const to = rng.pick(clearTargets(from, level >= 3 ? SWEDEN_PLACES : SWEDISH_CITIES));
    const ans = bearing8(from, to);
    const opts = rng.shuffle([ans, ...rng.sample(DIRECTIONS.filter((c) => c !== ans), level >= 4 ? 3 : 2)]);
    return {
      type: 'choice', prompt: `Du är ${atPlace(from)}. Åt vilket håll ligger ${to.name}?`, visual: swedenMapHtml([from, to], { labels: true }) || compassSvg(0),
      options: opts.map((o) => ({ id: o, label: o })), answer: ans, hint: 'Norr är uppåt på kartan.', explain: `${to.name} ligger ${ans} om ${from.name}. ${to.fact}`,
    };
  }
  if (rng.chance(0.3)) {
    const facts = [
      { q: 'Åt vilket håll går solen upp?', a: 'öster', ex: 'Solen går upp i öster och ner i väster.' },
      { q: 'Åt vilket håll går solen ner?', a: 'väster', ex: 'Solen går ner i väster.' },
      { q: 'Vilket väderstreck är uppåt på en karta?', a: 'norr', ex: 'På kartor är norr nästan alltid uppåt.' },
      { q: 'Åt vilket håll pekar en kompassnål?', a: 'norr', ex: 'Kompassnålen är en magnet som pekar mot norr.' },
      { q: 'Var står solen högst mitt på dagen i Sverige?', a: 'söder', ex: 'Mitt på dagen står solen i söder när man är i Sverige.' },
      { q: 'Åt vilket håll ligger Norge från Sverige?', a: 'väster', ex: 'Norge ligger väster om Sverige. Finland ligger öster om Sverige.' },
      { q: 'Åt vilket håll ligger Finland från Sverige?', a: 'öster', ex: 'Finland ligger öster om Sverige, på andra sidan Bottniska viken.' },
      { q: 'Åt vilket håll ligger Danmark från Sverige?', a: 'söder', ex: 'Danmark ligger söder om Sverige, på andra sidan Öresund.' },
    ];
    const f = rng.pick(level <= 1 ? facts.slice(0, 4) : facts);
    return { type: 'choice', prompt: f.q, visual: compassSvg(0), options: rng.shuffle(['norr', 'söder', 'öster', 'väster']).map((o) => ({ id: o, label: o })), answer: f.a, hint: 'Kom ihåg: Norr, Öster, Söder, Väster – medsols.', explain: f.ex };
  }
  const pool = level <= 1 ? COMPASS.slice(0, 4) : COMPASS;
  const c = rng.pick(pool);
  const opts = rng.shuffle([c, ...rng.sample(pool.filter((x) => x !== c), level <= 1 ? 2 : 3)]);
  return {
    type: 'choice', prompt: 'Åt vilket väderstreck pekar den röda pilen?', visual: compassSvg(c.deg),
    options: opts.map((o) => ({ id: o.id, label: o.id })), answer: c.id, hint: 'N betyder norr. Gå medsols: norr, öster, söder, väster.', explain: `Pilen pekar mot ${c.id}.`,
  };
}

/* ---------- Förr i tiden (tidslinjer) ---------- */
export function genHistory(level, rng) {
  if (level <= 1 && rng.chance(0.5)) {
    const bins = [{ id: 'dati', label: 'Dåtid', html: '⏪' }, { id: 'nu', label: 'Nutid', html: '⏺️' }, { id: 'fram', label: 'Framtid', html: '⏩' }];
    const items = rng.sample(TIME_ITEMS, level === 0 ? 4 : 6);
    return {
      type: 'sort', prompt: 'Hände det förr, händer det nu eller i framtiden?', bins,
      items: items.map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
      hint: 'Dåtid är det som redan har hänt. Framtid är det som inte har hänt än.', explain: 'Dåtid, nutid och framtid – så kan vi prata om tid.',
    };
  }
  if (level >= 3 && rng.chance(0.45)) {
    const n = level >= 4 ? 5 : 4;
    const ev = rng.sample(TIMELINE, n).sort((a, b) => a.y - b.y);
    return {
      type: 'order', prompt: 'Gör en tidslinje! Tryck från det som hände först till det som hände sist.',
      items: rng.shuffle(ev).map((e) => ({ id: e.id, html: `<span class="pic sm">${e.e}</span><span class="lbl">${e.name}</span>`, say: e.name })),
      answerOrder: ev.map((e) => e.id), joiner: '→', hint: 'Fundera på vad som är allra äldst.', explain: ev.map((e) => `${e.name}: ${e.when}`).join('. ') + '.',
    };
  }
  if (rng.chance(0.5)) {
    const eras = level <= 2 ? [ERAS[0], ERAS[2], ERAS[5]] : rng.sample(ERAS, 4).sort((a, b) => ERAS.indexOf(a) - ERAS.indexOf(b));
    return {
      type: 'order', prompt: 'Gör en tidslinje! Tryck från det äldsta till det nyaste.',
      items: rng.shuffle(eras).map((e) => ({ id: e.id, html: `${e.img ? photo(e.img, { alt: '', cls: 'tphoto', fallback: `<span class="pic sm">${e.e}</span>` }) : `<span class="pic sm">${e.e}</span>`}<span class="lbl">${e.name}</span>`, say: e.name })),
      answerOrder: eras.map((e) => e.id), joiner: '→', hint: 'Stenåldern var allra först – för väldigt länge sedan.', explain: eras.map((e) => `${e.name}: ${e.when}`).join('. ') + '.',
    };
  }
  if (level === 0) {
    const old = rng.pick(TIME_ITEMS.filter((i) => i.bin === 'dati'));
    const now = rng.sample(TIME_ITEMS.filter((i) => i.bin === 'nu'), 2);
    return {
      type: 'choice', prompt: 'Vad hör till förr i tiden?', say: 'Vad hör till förr i tiden, för länge sedan?', wide: true,
      options: rng.shuffle([old, ...now]).map((i) => emojiOpt(i.id, i.e, i.n)), answer: old.id,
      hint: 'Vad fanns för väldigt länge sedan?', explain: `${old.n[0].toUpperCase()}${old.n.slice(1)} hör till dåtiden – det som redan har hänt för länge sedan.`,
    };
  }
  const era = rng.pick(ERAS.slice(0, 5));
  const others = rng.sample(ERAS.filter((e) => e !== era), 2);
  return {
    type: 'choice', prompt: 'Vilken tid kommer bilden från?', visual: era.img ? qpic(era.img, era.name, era.e) : `<span class="pic-big">${era.e}</span>`,
    options: rng.shuffle([era, ...others]).map((e) => ({ id: e.id, label: e.name })), answer: era.id, hint: era.fact, explain: `${era.name} – ${era.when}. ${era.fact}`,
  };
}

/* ---------- Barn förr i tiden (sten-, brons-, järnålder och vikingatid) ---------- */
export function genPastLife(level, rng) {
  if (level <= 2 && rng.chance(0.35)) {
    const yes = rng.sample(VIKING_THINGS.filter((t) => t.bin === 'ja'), level === 0 ? 2 : 3);
    const no = rng.sample(VIKING_THINGS.filter((t) => t.bin === 'nej'), level === 0 ? 2 : 3);
    return {
      type: 'sort', prompt: 'Fanns det på vikingatiden?', bins: [{ id: 'ja', label: 'Fanns', html: '⛵' }, { id: 'nej', label: 'Fanns inte', html: '🚫' }],
      items: rng.shuffle([...yes, ...no]).map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
      hint: 'Vikingarna hade ingen el, inga motorer och ingen mat från Amerika.', explain: 'Vikingarna hade eld, djur, skepp och mat från gården. Potatis, bananer och choklad kom till Sverige långt senare – och el och motorer fanns inte alls.',
    };
  }
  const item = rng.pick(PAST_LIFE.filter((x) => inLevel(x, level)));
  const visual = item.era === 'viking' ? qpic('vikingaskepp', 'Vikingaskepp', '⛵') : item.era === 'sten' ? qpic('flintyxa', 'Flintyxa', '🪨') : item.era === 'brons' ? qpic('hallristning', 'Hällristning', '🛡️') : '<span class="pic-big">⚒️</span>';
  return bankChoice(rng, item, level, { visual: level === 0 ? undefined : visual, hint: 'Tänk på hur det var innan det fanns el, bilar och affärer.' });
}

/* ---------- Högtider ---------- */
const holidayVisual = (ho) => qpic(ho.id, ho.name, ho.e);
export function genHolidays(level, rng) {
  if (level <= 1) {
    const easy = HOLIDAYS.filter((x) => ['julgran', 'pasagg', 'lucia', 'midsommar', 'menora', 'eid', 'valborg', 'diwali'].includes(x.id));
    const ho = rng.pick(easy);
    const others = rng.sample(easy.filter((x) => x.e !== ho.e), 2);
    return {
      type: 'choice', prompt: `Vilken bild hör till ${ho.name.toLowerCase().startsWith('eid') ? ho.name : ho.name.toLowerCase()}?`, wide: true,
      options: imgOptions(rng.shuffle([ho, ...others])), answer: ho.id,
      hint: 'Tänk på vad man brukar se när man firar.', explain: ho.fact,
    };
  }
  const r = rng.next();
  if (level >= 3 && r < 0.3) {
    const rel = rng.pick(RELIGIONS);
    const kind = rng.pick(['symbol', 'house', 'book']);
    const q = { symbol: `Vilken symbol hör till ${rel.name}?`, house: `Vad heter byggnaden där man samlas inom ${rel.name}?`, book: `Vad heter den heliga boken inom ${rel.name}?` }[kind];
    return {
      type: 'choice', prompt: q, options: rng.shuffle(RELIGIONS).map((x) => (kind === 'symbol' ? { id: x.id, label: `${x.symbol} ${x.symbolName}`, say: x.symbolName } : { id: x.id, label: x[kind] })), answer: rel.id,
      hint: 'Kristendomen, islam och judendom har både likheter och skillnader.', explain: rel.fact,
    };
  }
  const ho = rng.pick(HOLIDAYS);
  if (r < 0.65) {
    const trads = [...new Set(HOLIDAYS.map((x) => x.tradition))];
    return {
      type: 'choice', prompt: `${ho.name} – vilken tradition eller religion hör högtiden till?`, visual: holidayVisual(ho),
      options: rng.shuffle([ho.tradition, ...rng.sample(trads.filter((t) => t !== ho.tradition), level >= 4 ? 3 : 2)]).map((t) => ({ id: t, label: t })), answer: ho.tradition,
      hint: 'Fundera på vem som firar högtiden.', explain: ho.fact,
    };
  }
  const withPhoto = HOLIDAYS.filter((x) => hasPhoto(x.id));
  const h0 = rng.pick(withPhoto.length >= 3 ? withPhoto : HOLIDAYS);
  const others = rng.sample(HOLIDAYS.filter((x) => x.id !== h0.id && x.e !== h0.e), 2);
  return {
    type: 'choice', prompt: 'Vilken högtid visar bilden?', visual: holidayVisual(h0),
    options: rng.shuffle([h0, ...others]).map((x) => ({ id: x.id, label: x.name })), answer: h0.id, hint: 'Titta på detaljerna i bilden.', explain: h0.fact,
  };
}

/* ---------- Barnens rättigheter ---------- */
export function genRights(level, rng) {
  if (level === 0) {
    const r = rng.pick(RIGHTS.slice(0, 4));
    const silly = rng.sample([['godis', '🍭'], ['en egen mobil', '📱'], ['en häst', '🐴'], ['ett tv-spel', '🎮']], 2);
    const sayRight = { '🏫': 'skola', '🧸': 'leka', '🗣️': 'säga vad man tycker', '🏥': 'vård' }[r.e];
    return {
      type: 'choice', prompt: 'Vad har alla barn rätt till?', visual: '<span class="pic-big">🧒🌍</span>', wide: true,
      options: rng.shuffle([emojiOpt('ratt', r.e, sayRight), ...silly.map(([n, e]) => emojiOpt(n, e, n))]), answer: 'ratt',
      hint: 'Det är något som alla barn behöver.', explain: r.fact,
    };
  }
  if (level <= 2 && rng.chance(0.4)) {
    const items = [...rng.sample(NEEDS_WANTS.filter((x) => x.bin === 'ratt'), 3), ...rng.sample(NEEDS_WANTS.filter((x) => x.bin === 'onskan'), 3)];
    return {
      type: 'sort', prompt: 'Är det en rättighet eller en önskan?', bins: [{ id: 'ratt', label: 'Rättighet', html: '🤝' }, { id: 'onskan', label: 'Önskan', html: '⭐' }],
      items: rng.shuffle(items).map((i) => ({ id: i.id, html: `<span class="pic sm">${i.e}</span><span class="lbl">${i.n}</span>`, bin: i.bin, say: i.n })),
      hint: 'En rättighet är något alla barn behöver för att må bra.', explain: 'Rättigheter är sådant alla barn behöver: mat, ett hem, skola, vård och lek. Önskningar är roliga saker som man inte måste ha.',
    };
  }
  if (level >= 2 && rng.chance(0.5)) {
    const c = rng.pick(RIGHTS_CASES.filter((x) => x.min <= level));
    return bankChoice(rng, c, level, { visual: '<span class="pic-big">⚖️</span>', hint: 'Barnkonventionen gäller alla barn i hela världen.' });
  }
  const r = rng.pick(RIGHTS);
  return {
    type: 'choice', prompt: 'Vilken rättighet har alla barn i hela världen?', visual: `<span class="pic-big">${r.e}</span>`,
    options: rng.shuffle([r.right, ...r.silly]).map((t) => ({ id: t, label: `Rätt ${t}` })), answer: r.right,
    hint: 'Barnkonventionen handlar om sådant som alla barn behöver för att må bra.', explain: r.fact,
  };
}

/* ---------- Regler och schyssta val ---------- */
export function genRules(level, rng) {
  const item = rng.pick(RULE_CASES.filter((x) => inLevel(x, level)));
  return bankChoice(rng, item, level, { hint: 'Vad skulle göra att alla mår bra?' });
}

/* ---------- Trafik ---------- */
export function genTraffic(level, rng) {
  const item = rng.pick(TRAFFIC.filter((x) => inLevel(x, level)));
  const visual = item.sign ? `<span class="pic-big">${item.sign}</span>` : level === 0 ? undefined : '<span class="pic-big">🚦</span>';
  return bankChoice(rng, item, level, { visual, hint: 'Tänk på vad som är säkrast.' });
}

/* ---------- Pengar ---------- */
function coinsFor(total, rng, allowed) {
  const out = [];
  let left = total;
  const denoms = [...allowed].sort((a, b) => b - a);
  while (left > 0) {
    const fits = denoms.filter((d) => d <= left);
    const d = rng.chance(0.7) ? fits[0] : rng.pick(fits);
    out.push(d);
    left -= d;
  }
  return out.sort((a, b) => b - a);
}
export function genMoney(level, rng) {
  if (level === 0) {
    const n = rng.int(2, 6);
    const opts = [n, n === 2 ? 3 : n - 1, n + 1].filter((v, i, arr) => arr.indexOf(v) === i);
    return {
      type: 'choice', prompt: 'Hur många kronor är det?', say: 'Räkna enkronorna. Hur många kronor är det?', visual: moneyHtml(Array(n).fill(1)),
      options: rng.shuffle(opts).map((v) => ({ id: String(v), label: `${v} kr`, say: `${v} kronor` })), answer: String(n),
      hint: 'Peka på varje mynt och räkna.', explain: `Det är ${n} enkronor – ${n} kronor.`,
    };
  }
  const r = rng.next();
  if (level === 1) {
    if (r < 0.6) {
      const total = rng.int(3, 12);
      const coins = coinsFor(total, rng, [1, 5]);
      return {
        type: 'choice', prompt: 'Hur mycket pengar är det?', visual: moneyHtml(coins),
        options: rng.shuffle([total, total + 1, total > 3 ? total - 1 : total + 2]).map((v) => ({ id: String(v), label: `${v} kr`, say: `${v} kronor` })), answer: String(total),
        hint: 'Börja med det största myntet och räkna vidare.', explain: `${coins.join(' + ')} = ${total} kronor.`,
      };
    }
    const f = rng.pick(MONEY_FACTS.filter((x) => x.min <= 1));
    return bankChoice(rng, f, level, { visual: '<span class="pic-big">🪙</span>' });
  }
  if (r < 0.35) {
    const max = level === 2 ? 30 : level === 3 ? 100 : 500;
    const allowed = level === 2 ? COINS : level === 3 ? [...COINS, 20, 50] : [...COINS, ...NOTES.slice(0, 4)];
    const total = rng.int(level === 2 ? 6 : 25, max);
    const coins = coinsFor(total, rng, allowed);
    return {
      type: 'numpad', prompt: 'Hur många kronor är det tillsammans?', visual: moneyHtml(coins), answer: total,
      hint: 'Börja med de största och räkna vidare.', explain: `${coins.join(' + ')} = ${total} kronor.`,
    };
  }
  if (r < 0.6) {
    const item = rng.pick(SHOP.filter((x) => x.p < (level === 2 ? 20 : 100)));
    const pay = level === 2 ? 20 : rng.pick([50, 100].filter((v) => v > item.p));
    const back = pay - item.p;
    return {
      type: 'numpad', prompt: `Du köper ${item.n} för ${item.p} kr och betalar med ${pay} kr. Hur mycket får du tillbaka?`,
      visual: `<div class="shop-q"><span class="pic">${item.e}</span><span class="price-tag">${item.p} kr</span>${moneyHtml([pay])}</div>`, answer: back,
      hint: `Räkna från ${item.p} upp till ${pay}.`, explain: `${pay} − ${item.p} = ${back}. Du får ${back} kronor tillbaka.`,
    };
  }
  if (r < 0.8) {
    const p = rng.pick(PRICES);
    return {
      type: 'choice', prompt: `Ungefär hur mycket kostar ${p.n}?`, visual: `<span class="pic-big">${p.e}</span>`,
      options: rng.shuffle([p.a, ...p.w]).map((o) => ({ id: o, label: o })), answer: p.a,
      hint: 'Jämför med något du vet vad det kostar.', explain: `${p.n[0].toUpperCase()}${p.n.slice(1)} kostar ungefär ${p.a}. Priser kan vara olika i olika affärer.`,
    };
  }
  const f = rng.pick(MONEY_FACTS.filter((x) => x.min <= level));
  return bankChoice(rng, f, level, { visual: '<span class="pic-big">💰</span>' });
}

/* ---------- Demokrati och klassråd ---------- */
const hands = (n) => '✋'.repeat(n);
export function genDemocracy(level, rng) {
  if (level <= 1) {
    const n = level === 0 ? 2 : 3;
    const topics = rng.sample(VOTE_TOPICS, n);
    let counts;
    do {
      counts = topics.map(() => rng.int(1, level === 0 ? 6 : 8));
    } while (new Set(counts).size !== n || Math.max(...counts) - [...counts].sort((a, b) => b - a)[1] < (level === 0 ? 2 : 1));
    const win = topics[counts.indexOf(Math.max(...counts))];
    const rows = topics.map((t, i) => `<div class="vrow"><span class="pic sm">${t.e}</span><span class="hands">${hands(counts[i])}</span></div>`).join('');
    return {
      type: 'choice', prompt: 'Klassen röstar. Vilket förslag fick flest röster?', visual: `<div class="votes">${rows}</div>`, wide: true,
      options: rng.shuffle(topics).map((t) => emojiOpt(t.n, t.e, t.n)), answer: win.n,
      hint: 'Räkna händerna på varje rad.', explain: `${win.n[0].toUpperCase()}${win.n.slice(1)} fick flest röster: ${Math.max(...counts)} stycken. När man röstar vinner det som flest vill.`,
    };
  }
  const r = rng.next();
  if (level === 2 && r < 0.4) {
    const [a, b] = rng.sample(VOTE_TOPICS, 2);
    const ca = rng.int(5, 15);
    let cb = rng.int(5, 15);
    if (cb === ca) cb += 2;
    const win = ca > cb ? a : b;
    return {
      type: 'choice', prompt: `På klassrådet röstar ${ca} på ${a.n} och ${cb} på ${b.n}. Vad vinner?`, visual: `<span class="pic-big">🗳️</span>`,
      options: rng.shuffle([a, b]).map((t) => ({ id: t.n, label: `${t.e} ${t.n}`, say: t.n })), answer: win.n,
      hint: 'Vilket tal är störst?', explain: `${Math.max(ca, cb)} är fler än ${Math.min(ca, cb)}, så ${win.n} vinner.`,
    };
  }
  if (level >= 3 && r < 0.35) {
    const total = rng.int(18, 30);
    if (level === 4 && rng.chance(0.5)) {
      const need = Math.floor(total / 2) + 1;
      return {
        type: 'numpad', prompt: `Det är ${total} elever i klassen. Hur många röster behövs minst för att få majoritet, alltså fler än hälften?`, visual: '<span class="pic-big">🗳️</span>', answer: need,
        hint: `Hälften av ${total} är ${total / 2}. Hur många behövs för att vara fler än så?`, explain: `Hälften av ${total} är ${total / 2}. Fler än hälften är ${need} röster.`,
      };
    }
    const [a, b] = rng.sample(VOTE_TOPICS, 2);
    const ca = rng.int(Math.ceil(total / 2) + 1, total - 2);
    return {
      type: 'numpad', prompt: `Alla ${total} elever i klassen röstar. ${ca} röstar på ${a.n}. Resten röstar på ${b.n}. Hur många röstar på ${b.n}?`, visual: `<span class="pic-big">${a.e} 🆚 ${b.e}</span>`, answer: total - ca,
      hint: `Räkna ${total} minus ${ca}.`, explain: `${total} − ${ca} = ${total - ca}. ${a.n[0].toUpperCase()}${a.n.slice(1)} vinner med ${ca} röster.`,
    };
  }
  const f = rng.pick(DEMOCRACY.filter((x) => x.min <= level));
  return bankChoice(rng, f, level, { visual: '<span class="pic-big">🗳️</span>', hint: 'I en demokrati är alla med och bestämmer.' });
}

/* ---------- Sant eller falskt ---------- */
export function genTrueFalse(level, rng) {
  const s = rng.pick(TRUE_FALSE.filter((x) => inLevel(x, level)));
  return {
    type: 'choice', prompt: s.s, say: `Sant eller falskt? ${s.s}`, wide: true,
    options: [emojiOpt('sant', '👍', 'Sant'), emojiOpt('falskt', '👎', 'Falskt')], answer: s.t ? 'sant' : 'falskt',
    hint: 'Tänk efter – stämmer det?', explain: s.t ? s.ex : `Falskt! ${s.ex}`,
  };
}

export const worldApp = {
  id: 'world',
  name: 'Världen',
  icon: '🌍',
  color: '#0f9d8a',
  tagline: 'Länder, kartor, djur och förr i tiden',
  modules: [
    { id: 'continents', name: 'Världsdelar och hav', icon: '🗺️', minLevel: 0, view: 'continents', lgr: ['so-varldshav', 'so-karta'], photo: () => photo('worldmap', { cls: 'tile-photo' }) },
    { id: 'oceans', name: 'Världshaven', icon: '🌊', minLevel: 0, gen: genOceans, lgr: ['so-varldshav', 'so-karta'] },
    { id: 'animals', name: 'Djur i världen', icon: '🦁', minLevel: 0, gen: genWorldAnimals, lgr: ['so-varlden', 'so-varldshav', 'no-arter'], photo: () => photo('lejon', { cls: 'tile-photo' }) },
    { id: 'places', name: 'Kända platser', icon: '🗼', minLevel: 0, gen: genPlaces, lgr: ['so-varldshav', 'so-platser'], photo: () => photo('eiffel', { cls: 'tile-photo' }) },
    { id: 'flags', name: 'Flaggor och länder', icon: '🏳️', minLevel: 0, gen: genFlags, lgr: ['so-varldshav', 'so-platser'] },
    { id: 'truefalse', name: 'Sant eller falskt?', icon: '🤔', minLevel: 0, gen: genTrueFalse, lgr: ['so-varldshav', 'so-platser', 'so-varlden'] },
    { id: 'sweden', name: 'Sverigekartan', icon: '🇸🇪', minLevel: 1, view: 'sweden', lgr: ['so-karta', 'so-platser'], photo: () => photo('sverigekarta', { cls: 'tile-photo map' }) },
    { id: 'swedenquiz', name: 'Sverigequiz', icon: '🏞️', minLevel: 1, gen: genSwedenQuiz, lgr: ['so-platser', 'so-karta'] },
    { id: 'compass', name: 'Väderstreck', icon: '🧭', minLevel: 1, gen: genCompass, lgr: ['so-karta'] },
    { id: 'history', name: 'Tidslinjer', icon: '⏳', minLevel: 0, gen: genHistory, lgr: ['so-tid', 'so-forntid'], photo: () => photo('angmaskin', { cls: 'tile-photo' }) },
    { id: 'pastlife', name: 'Barn förr i tiden', icon: '⛵', minLevel: 0, gen: genPastLife, lgr: ['so-forntid', 'so-norden-forntid', 'so-mytologi'], photo: () => photo('vikingaskepp', { cls: 'tile-photo' }) },
    { id: 'holidays', name: 'Högtider', icon: '🎉', minLevel: 1, gen: genHolidays, lgr: ['so-hogtid'], photo: () => photo('lucia', { cls: 'tile-photo' }) },
    { id: 'rights', name: 'Barnens rättigheter', icon: '🤝', minLevel: 0, gen: genRights, lgr: ['so-rattigheter'] },
    { id: 'rules', name: 'Regler och schyssta val', icon: '🙋', minLevel: 0, gen: genRules, lgr: ['so-normer', 'so-livsfragor'] },
    { id: 'traffic', name: 'Trafik och säkerhet', icon: '🚦', minLevel: 0, gen: genTraffic, lgr: ['so-trafik'] },
    { id: 'money', name: 'Pengar', icon: '🪙', minLevel: 0, gen: genMoney, lgr: ['so-pengar'] },
    { id: 'democracy', name: 'Klassråd och rösta', icon: '🗳️', minLevel: 0, gen: genDemocracy, lgr: ['so-demokrati'] },
  ],
};
