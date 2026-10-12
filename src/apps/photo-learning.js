// Handvalda verkliga motiv. Foton ska ge något att undersöka, inte bara dekorera.
// Bildkällor och licenser finns i assets/credits.json och docs/BILDKALLOR.md.
import { EXTRA_PHOTO_LEARNING } from './photo-learning-extra.js';
const card = (key, title, question, detail, practice) => ({ key, title, question, detail, practice });
export const PHOTO_LEARNING = {
  math: [
    card('obj-apple','Ett äpple','Hur kan du visa ett, två och tre äpplen med saker hemma?','Använd en sak för varje räkneord. Att flytta sakerna ändrar inte antalet.','count'),
    card('obj-dice','Tärningar','Hur är prickarna grupperade på tärningarna?','Du kan känna igen små antal genom deras mönster, och kontrollera genom att räkna prickarna.','count'),
    card('obj-ruler','En linjal','Vilka markeringar kan du upptäcka på linjalen?','När du mäter börjar du vid nollmarkeringen. Linjalens kant behöver inte vara noll.','measure'),
    card('obj-coin','Ett mynt','Var ser du tal på myntet?','Mynt från olika länder har olika värden och valutor. Ett stort mynt är inte alltid värt mer.','shopping-practice'),
    card('obj-pear','Päron på en gren','Hur kan du dela låtsaspäron lika mellan två personer?','En rättvis delning ger lika många till varje person. Använd klossar när du provar.','sharing'),
    card('obj-scale','En våg','Vad kan du använda en våg till?','En våg hjälper dig att jämföra eller mäta massa. Storlek och massa är olika egenskaper.','measure'),
  ],
  svenska: [
    card('obj-monkey','En apa','Vilket ljud hör du först när du säger apa?','Säg ordet långsamt. Bokstaven A kan visa det första ljudet i apa.','firstsound'),
    card('obj-cat','En katt','Vilka ord kan beskriva katten utan att du gissar vad den känner?','Beskriv sådant du ser, som päls och öron. En bild berättar inte säkert vad djuret känner.','contextwords'),
    card('obj-car','En bil','Hur många stavelser hör du i ordet bil?','Säg bil och klappa rytmen: ordet har en stavelse.','syllables'),
    card('obj-house','Ett hus','Vad kan du säga säkert om bilden, och vad skulle du behöva veta mer om?','En bild ger ledtrådar, men visar inte exempelvis vem som bor i huset.','textclues'),
    card('obj-key','En nyckel','Hur skulle du beskriva nyckeln för någon som inte ser bilden?','Form, färg och delar hjälper andra att förstå ditt budskap.','words'),
    card('obj-sailboat','En segelbåt','Hitta på en mening om bilden. Vad ser du, och vad hittar du på?','Skilj din beskrivning av bilden från din egen berättelse. Båda kan vara intressanta.','sentence'),
  ],
  write: [
    card('obj-pencil','Pennor','Hur håller du en penna så att handen kan röra sig bekvämt?','Prova lugna streck och pauser. Du kan öva med penna på papper eller stylus på skrivytan.','letter-practice'),
    card('obj-envelope','Ett kuvert','Vad kan du skriva på ett kort till någon du tycker om?','Ett namn och en hälsning förmedlar ett budskap. En vuxen kan hjälpa dig att skriva.','name'),
    card('obj-cat','En katt','Kan du skriva ordet katt?','Lyssna på ljuden och jämför sedan dina bokstäver med ordet.','words'),
    card('obj-flower','Blommor','Vilka former i bilden kan du prova att rita med lugna pennstreck?','Bågar, raka linjer och rundade former förekommer både i bilder och bokstäver.','letter-practice'),
    card('obj-book','En bok','Vilken skillnad ser du mellan bokstäver och illustrationer?','Text och bilder kan förmedla olika delar av samma budskap.','upper'),
    card('obj-paintbrush','Penslar','Prova ett stort streck och sedan ett litet. Vad behöver handen göra?','Att byta storlek på streck hjälper dig att utforska rörelser. Du behöver inte skriva snabbt.','letter-practice'),
  ],
  science: [
    card('obj-magnet','En magnet','Vad visar järnfilspånen runt magneten?','Järnfilspån kan ordna sig i mönster i magnetens fält. Alla metaller dras inte till magneter.','magnet'),
    card('obj-ice','Isbitar','Vad skulle du behöva observera för att veta om isen smälter?','Följ samma isbit över tid och beskriv förändringen. Ett enda foto visar inte hela förloppet.','water'),
    card('course-shadow','Trädens skuggor','Vad i bilden tyder på att ljus stoppas av träden?','Skugga uppstår där något blockerar ljuset. Jämför ljusa och mörka områden på marken.','shadow'),
    card('obj-water-drop','Vattendroppar','Vad kan du beskriva om dropparnas form och läge?','Observationer börjar med det du faktiskt ser. Förklaringar behöver ibland fler undersökningar.','investigate'),
    card('obj-wood','Ved','Vad skulle du vilja undersöka om en liten träbit?','Du kan jämföra egenskaper och gissa om en bit flyter. Testa med en vuxen.','float'),
    card('obj-rock','En sten','Vilka egenskaper kan du se, och vilka behöver du testa?','Du kan se färg och ungefärlig form. Massa och magnetism behöver mätas eller undersökas.','investigate'),
  ],
  biology: [
    card('ekorre','En ekorre','Vilka delar hjälper ekorren att röra sig och hålla i sin föda?','Titta på tassar, klor och svans. Beskriv först vad du ser.','species'),
    card('humla','En humla vid en blomma','Vad kan humlan leta efter i blomman?','Humlor samlar nektar och pollen. När pollen flyttas mellan blommor kan växter pollineras.','foodchain'),
    card('course-oak','En ek','Hur skiljer sig eken från en gran?','Eken är ett lövträd. Jämför löv, barr, krona och stam när du naturspanar.','species'),
    card('course-sprouts','Groddande bönor','Vilka nya delar kan du upptäcka hos groddarna?','En växt kan utvecklas ur ett frö. Följ samma frö över flera dagar för att se förloppet.','lifecycle'),
    card('course-autumn','Löv på hösten','Vad har förändrats i träden och på marken?','Färger och nedfallna löv kan vara ledtrådar till årstidsväxlingar. Alla träd tappar inte sina blad samtidigt.','seasons'),
    card('spindel','En spindel','Hur många ben kan en spindel ha även när inte alla syns tydligt på fotot?','Spindlar har åtta ben. En kameravinkel kan gömma delar, så bilden ensam visar inte alltid allt.','groups'),
  ],
  space: [
    card('earth','Jorden från rymden','Vilka färger och mönster kan du hitta på jorden?','Hav, land och moln syns i rymdbilder. Fotografier visar en viss vy, inte alla platser samtidigt.','solar'),
    card('moon','Månen','Kan du hitta mörkare områden och kratrar?','Månen har ljusare och mörkare områden. Den lyser genom att reflektera solljus.','moon'),
    card('mars','Mars','Vilka skillnader ser du mellan Mars och jorden?','Jämför färger och synliga ytmönster. Kameror och bildbearbetning påverkar hur rymdbilder ser ut.','solar'),
    card('jupiter','Jupiter','Vad lägger du märke till i banden över planeten?','Jupiter har en atmosfär med moln och stora vädersystem. Bilden visar inte en fast markyta.','solar'),
    card('saturn','Saturnus','Vad ser du runt planeten?','Saturnus ringar består av många mindre bitar, främst is. De är inte en enda solid skiva.','solar'),
    card('astronaut','En astronaut','Vilken utrustning kan du upptäcka?','En rymddräkt ger skydd och hjälper astronauten att leva och arbeta i miljöer där människor annars inte kan vara.','photos'),
  ],
  world: [
    card('eiffel','Eiffeltornet','Vad i konstruktionen skulle du vilja undersöka närmare?','Eiffeltornet finns i Paris i Frankrike. Titta på hur formerna bygger upp tornet.','places'),
    card('colosseum','Colosseum','Vad berättar den här byggnaden om äldre tider?','Colosseum finns i Rom. Ett fotografi visar hur platsen ser ut vid ett tillfälle, men historien kräver fler källor.','history'),
    card('everest','Ett högt berg','Vad kan landskapet betyda för människor som lever där?','Berg, väder och höjd kan påverka resor, bebyggelse och vardagsliv.','places'),
    card('moai','Statyer på Rapa Nui','Vilka former och detaljer lägger du märke till?','Moai är statyer på Rapa Nui. För att förstå deras historia behöver vi mer än ett fotografi.','places'),
    card('obj-compass','En kompass','Hur kan en kompass hjälpa dig att hitta riktningen?','En kompass visar riktningar. Den behöver användas tillsammans med kunskap om platsen eller en karta.','compass'),
    card('course-winter','Ett vinterlandskap','Vad kan du säga om vädret från bilden, och vad vet du inte?','Snö ger en ledtråd om förhållanden. En enda bild berättar inte platsens klimat under hela året.','places'),
  ],
  ai: [
    card('obj-robot','En verklig robot','Hur skiljer sig en robot från en människa?','En robot är byggd teknik. Alla robotar använder inte AI, och AI behöver inte ha en robotkropp.','meaning'),
    card('obj-camera','En kamera','Vad skulle en bildapp behöva för att undersöka ett motiv?','Ett system behöver information, till exempel en bild. Det kan inte se något som det inte har fått information om.','examples'),
    card('obj-cat','En kattbild','Vad kan skilja den här kattbilden från en annan?','Bakgrund, ljus, färg och kameravinkel kan variera. Varierade exempel hjälper oss att undersöka bildigenkänning.','examples'),
    card('obj-computer','En dator','Kan en säker ton på skärmen bevisa att ett svar är rätt?','Nej. Kontrollera påståenden med egna undersökningar och tillförlitliga källor. Fotot här visar en dator, inte ett AI-svar.','verify'),
    card('obj-microphone','En mikrofon','Vilka olika ljud skulle en talapp behöva kunna hantera?','Röster och bakgrundsljud varierar. Resultat behöver granskas för de människor som ska använda tekniken.','fairness'),
    card('obj-mobile','En telefon','Vad behöver du hålla privat när du använder digitala tjänster?','Lämna inte ut lösenord eller privata uppgifter till okända tjänster. Be en vuxen om hjälp.','privacy'),
  ],
  code: [
    card('obj-robot','En robot','Vilka tydliga steg skulle du ge en leksaksrobot?','Säg vad som ska göras och i vilken ordning. Ett foto visar inte vilket program just den här roboten använder.','algorithms'),
    card('obj-traffic-light','Trafikljus','Vilka regler behöver du själv följa i trafiken?','Teknik kan följa regler och program. Följ trafikregler och en vuxens hjälp när du är ute.','everyday'),
    card('obj-game-controller','En spelkontroll','Vad vill du att en figur ska göra när en knapp trycks?','Knapptrycket kan vara en händelse som startar instruktioner i ett program.','events'),
    card('obj-computer','En dator','Hur kan du dela en stor programmeringsuppgift i mindre delar?','Beskriv en del, testa den och fortsätt. Datorns utseende berättar inte vilket program den kör.','debug'),
    card('obj-dice','Tärningar','Hur skulle du beskriva en upprepning i ett tärningsspel?','En loop kan upprepa exempelvis kasta, läs av och räkna poäng.','loops'),
    card('obj-key','En nyckel','Hitta på en regel: om dörren är låst, vad gör du då?','Ett villkor väljer vad som händer beroende på om något är sant eller falskt.','conditions'),
  ],
  draw: [
    card('obj-flower','Blommor','Vilka former skulle du förenkla när du tecknar bilden?','Du kan börja med stora former och lägga till detaljer. Din bild behöver inte bli ett fotografi.','drawing-missions'),
    card('course-oak','En ek','Vad blir störst i din bild: kronan, stammen eller omgivningen?','Placering och storlek hjälper dig att leda betraktarens blick.','drawing-missions'),
    card('obj-paintbrush','Penslar','Vilka olika streck kan dina verktyg göra?','Prova raka, böjda, tunna och breda streck på papper eller i ritytan.','canvas'),
    card('obj-bridge','En bro underifrån','Vilka linjer leder blicken genom bilden?','Fotografens position och bildutsnitt påverkar vad vi ser. Prova att teckna samma sak från två håll.','drawing-missions'),
    card('course-shadow','Ljus och skuggor','Hur kan du visa skillnaden mellan ljust och mörkt i en teckning?','Du kan använda ljusare och mörkare färger eller lämna delar av papperet vita.','canvas'),
    card('course-autumn','Höstens färger','Vilka färger vill du använda i en egen höstbild?','Du väljer själv hur din bild ska uttrycka en känsla eller en händelse.','drawing-missions'),
  ],
  wonder: [
    card('obj-rainbow','En regnbåge','Vad skulle du vilja veta om ljuset i en regnbåge?','Ljus kan brytas och reflekteras i vattendroppar. Din fråga kan bli början på en undersökning.','cards'),
    card('obj-cloud','Moln','Vilka former ser du, och hur skulle du följa deras förändring?','Moln består av små vattendroppar eller iskristaller. Rita eller beskriv vad du ser vid flera tillfällen.','activity-practice'),
    card('course-sprouts','Groddar','Vad tror du förändras om du följer ett frö varje dag?','Dokumentera samma frö över tid. Bilder från olika dagar hjälper dig att jämföra.','activity-practice'),
    card('course-shadow','Trädens skuggor','Vad skulle du mäta om du vill veta om en skugga ändras?','Använd samma föremål och jämför längden vid flera tidpunkter.','activity-practice'),
    card('course-spring','Blommor på våren','Hur kan du undersöka när växter börjar blomma där du bor?','Titta på samma plats under flera veckor och anteckna datum och vad du ser.','cards'),
    card('obj-microscope','Ett mikroskop','Vad skulle du vilja titta närmare på?','Instrument kan visa detaljer som är svåra att se utan förstoring. De ger nya frågor att undersöka.','cards'),
  ],
  play: [
    card('obj-apple','En vara i låtsasbutiken','Hur vill du sätta ett låtsaspris och planera ett köp?','Du kan öva att lägga ihop priser och räkna vad som blir kvar. Fotot anger inget riktigt försäljningspris.','activity-practice'),
    card('obj-potted-plant','En krukväxt','Hur skulle dina lekfigurer ta hand om en växt?','Planera tillsammans och fundera på ljus och vatten. Olika växter behöver olika skötsel.','studio'),
    card('obj-cat','En katt','Vilka frågor skulle du ställa om du lekte djurklinik?','Du kan hitta på en berättelse och lyssna på en kompis idéer. Riktiga sjuka djur behöver en vuxen och veterinär.','town'),
    card('obj-ball','En boll','Hitta på en lek där alla kan bidra. Vilka regler behövs?','Tydliga och gemensamma regler kan göra leken lättare att förstå.','studio'),
    card('obj-house','Ett hus','Vad vill du bygga i din egen lekvärld?','Beskriv vem som bor där och hur figurerna kan hjälpa varandra.','studio'),
    card('obj-paintbrush','Verktyg för att skapa','Hur kan två personer skapa en bild tillsammans?','Turas om, lyssna på idéer och prova flera lösningar.','studio'),
  ],
};

for (const [app,items] of Object.entries(EXTRA_PHOTO_LEARNING)) PHOTO_LEARNING[app].push(...items);
PHOTO_LEARNING.biology.find(item=>item.key==='course-oak').compareKey='gran';
PHOTO_LEARNING.space.find(item=>item.key==='earth').compareKey='mars';

// Fotot följer delens konkreta exempel. Diagram och modeller finns kvar i övningarna.
export const LESSON_PHOTOS = {
  'tal-saker': ['obj-apple','obj-dice'], 'positioner': ['obj-pencil','obj-ruler'],
  'lyssna-ord': ['obj-monkey','obj-car'], 'las-detektiv': ['obj-umbrella','obj-book'],
  'skriv-budskap': ['obj-envelope','obj-pencil'], 'bearbeta-text': ['obj-book','obj-pencil'],
  'gissa-prova': ['obj-wood','obj-spoon'], 'rattvist-test': ['obj-car','obj-ruler'],
  'naturspanare': ['ekorre','course-oak'], 'ekosystem': ['hare','rav'],
  'dag-natt': ['earth','course-shadow'], 'arstider-modell': ['course-spring','course-winter'],
  'min-karta': ['obj-compass','obj-house'], 'kartor-jamfor': ['obj-compass','everest'],
  'ai-kontroll': ['obj-computer','obj-cat'], 'ai-eget-tankande': ['obj-pencil','obj-computer'],
  'kod-utan-skarm': ['obj-robot','obj-game-controller'], 'kod-dela': ['obj-computer','obj-game-controller'],
  'bild-beratta': ['obj-paintbrush','obj-flower'], 'bild-serie': ['obj-camera','obj-bridge'],
  'undra-fraga': ['obj-cloud','course-sprouts'], 'undra-belagg': ['course-sprouts','obj-ruler'],
  'lek-tillsammans': ['obj-house','obj-ball'], 'lek-budget': ['obj-apple','obj-coin'],
};

export const NATIVE_LESSON_PHOTOS = {
  ai: { meaning:'obj-robot', examples:'obj-cat', trainer:'obj-cat', everyday:'obj-mobile', verify:'obj-computer', fairness:'obj-microphone', prompts:'obj-pencil', privacy:'obj-mobile', feelings:'obj-robot', create:'obj-paintbrush', responsibility:'obj-computer', 'rules-models':'obj-robot', 'text-evidence':'obj-book', evaluation:'obj-microphone' },
  code: { algorithms:'obj-traffic-light', 'robot-intro':'obj-robot', 'predict-intro':'obj-game-controller', debugging:'obj-computer', computers:'obj-computer', loops:'obj-dice', conditions:'obj-key', 'turtle-intro':'obj-pencil', variables:'obj-coin', events:'obj-game-controller' },
};

export const PHOTO_DETAILS = {};
for (const item of Object.values(PHOTO_LEARNING).flat()) PHOTO_DETAILS[item.key] ||= item;
PHOTO_DETAILS.hare = card('hare','En hare','Vilka detaljer ser du i päls och öron?','En näringskedja kan visa samband mellan växter och djur.','foodchain');
PHOTO_DETAILS.rav = card('rav','En räv','Vilka skillnader ser du jämfört med haren?','Ett fotografi visar djuret vid ett tillfälle, inte hela dess liv.','foodchain');
PHOTO_DETAILS['obj-spoon'] = card('obj-spoon','En sked','Vilka egenskaper skulle du vilja undersöka?','Form och material kan påverka ett föremåls egenskaper.','float');
PHOTO_DETAILS['obj-umbrella'] = card('obj-umbrella','Ett paraply','Vilken berättelse skulle bilden kunna vara en ledtråd till?','Skilj sådant du vet från sådant du gissar.','textclues');
PHOTO_DETAILS.gran = card('gran','En gran','Vilken skillnad ser du mot ett lövträd?','Granens barr och krona kan jämföras med lövträd.','species');

export const PHOTO_CURRICULUM = {
  math:['ma-tal','ma-mat'], svenska:['sv-ord','sv-avkoda'], write:['sv-handstil','sv-ljud'], science:['no-metod','no-material'],
  biology:['no-arter','no-livscykel'], space:['no-himmel'], world:['so-platser','so-karta'], ai:['tk-prog','sv-avsandare'],
  code:['ma-instr','tk-prog'], draw:['bi-skapa'], wonder:['fsk-utforska','no-metod'], play:['sv-ord','bi-skapa'],
};

// Motiv till nya progressionstexter; foton ersätter inte uppgifternas modeller.
const progressionPhotos={
 math:[['obj-apple','obj-dice'],['obj-alarm-clock','obj-brick'],['obj-dice','obj-apple'],['obj-apple','obj-pear'],['obj-pencil','obj-ruler'],['obj-coin','obj-pencil'],['obj-orange','obj-apple'],['obj-ruler','obj-scale']],
 svenska:[['obj-book','obj-house'],['obj-cat','obj-house'],['obj-house','obj-key'],['obj-envelope','obj-pencil'],['obj-book','obj-pencil'],['obj-umbrella','obj-pencil'],['obj-book','obj-computer'],['obj-envelope','obj-pencil']],
 science:[['obj-wood','obj-rock'],['obj-flashlight','course-shadow'],['obj-wood','obj-water-drop'],['obj-microphone','obj-book'],['obj-car','obj-ruler'],['obj-ruler','obj-pencil'],['obj-car','obj-ruler'],['obj-ice','course-condensation']],
 world:[['obj-house','obj-book'],['obj-ball','obj-house'],['obj-compass','obj-house'],['obj-alarm-clock','obj-envelope'],['obj-ball','obj-pencil'],['obj-camera','colosseum'],['obj-compass','obj-ruler'],['obj-book','obj-computer']],
 code:[['obj-pencil','obj-brick'],['obj-brick','obj-house'],['obj-dice','obj-brick'],['obj-robot','obj-compass'],['obj-umbrella','obj-key'],['obj-coin','obj-pencil'],['obj-computer','obj-game-controller'],['obj-pencil','obj-computer']],
 draw:[['obj-pencil','obj-paintbrush'],['obj-rainbow','obj-paintbrush'],['obj-house','obj-pencil'],['obj-flower','obj-paintbrush'],['obj-ball','obj-pencil'],['obj-camera','obj-pencil'],['obj-flower','obj-camera'],['course-oak','obj-paintbrush']],
};
for(const [app,pairs] of Object.entries(progressionPhotos))pairs.forEach((pair,i)=>{LESSON_PHOTOS[`${app}-progression-${i+1}`]=pair;});
