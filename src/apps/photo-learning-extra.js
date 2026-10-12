const card = (key,title,question,detail,practice,compareKey) => ({key,title,question,detail,practice,...(compareKey?{compareKey}:{})});

export const EXTRA_PHOTO_LEARNING = {
  math:[
    card('obj-egg','Ett ägg','Hur kan du ordna sex låtsasägg i två lika stora grupper?','Prova med klossar. Tre i varje grupp ger sex tillsammans. Fotot visar ett exempel på ett ägg.','sharing'),
    card('obj-orange','En apelsin','Hur kan du beskriva apelsinens form och jämföra den med ett päron?','Frukter har ungefärliga former. Jämför rundhet och storlek utan att förutsätta att ett större föremål väger mer.','shapes','obj-pear'),
    card('obj-brick','En tegelsten','Vilka kanter och plana ytor kan du upptäcka?','Föremål kan påminna om geometriska former. Titta på hörn, kanter och ytor.','shapes'),
  ],
  svenska:[
    card('obj-dog','En hund','Vilket ord vill du använda för att beskriva hunden?','Du kan beskriva synliga detaljer. Ett foto visar inte säkert vad hunden känner eller tänker.','contextwords','obj-cat'),
    card('obj-train','Ett tåg','Vilka ord behöver du för att berätta om en låtsasresa med tåget?','Du kan skilja det du ser i bilden från det du hittar på i din berättelse.','sentence'),
    card('obj-butterfly','En fjäril','Vilka färger och mönster kan du beskriva?','Välj ord för detaljer i bilden. En annan person kan lägga märke till andra saker.','contextwords'),
  ],
  write:[
    card('obj-apple','Skriv äpple','Vilka bokstäver behöver du för att skriva äpple?','Ordet innehåller ä och två p. Lyssna och jämför sedan bokstäverna när du skriver.','words'),
    card('obj-dog','Skriv hund','Kan du säga hund långsamt och sedan skriva ordet?','Du kan prova bokstäverna på papper eller i Skriv ord. Ta en paus om handen behöver vila.','words'),
    card('obj-car','Skriv bil','Vilka ljud hör du när du säger bil långsamt?','Lyssna på ordets ljud, prova bokstäverna och läs sedan det du skrivit.','words'),
  ],
  science:[
    card('course-condensation','Små vattendroppar','Vad skulle du vilja undersöka om dropparna på ytan?','Kondensation innebär att vattenånga övergår till flytande vatten. Ett foto av droppar kan inte ensamt visa hur de bildades.','water','obj-ice'),
    card('obj-flashlight','En ficklampa','Hur skulle du ändra ett försök för att jämföra skuggor?','Använd samma föremål och ändra exempelvis lampans avstånd en sak i taget. Fotona visar exempel, inte ett färdigt försök.','shadow','course-shadow'),
    card('obj-paperclip','Ett gem','Vad kan du testa för att undersöka gemets egenskaper?','Du kan prova magnetism med en vuxen. Kontrollera resultatet i stället för att bara gissa efter utseendet.','magnet'),
  ],
  biology:[
    card('course-roots','En ung avokadoplanta','Vilka delar ser du mellan fröet och bladen?','Rötter, stam och blad har olika uppgifter. Alla delar behöver inte synas i fotot. Jämförelsebilden visar en annan växt, inte samma planta senare.','plants','course-sprouts'),
    card('grasand','Gräsänder','Vilka skillnader ser du mellan fåglarna i bilden?','Utseende kan variera inom samma art. Titta på färger, näbb och kropp innan du drar en slutsats.','species'),
    card('daggmask','En daggmask','Vad kan du se, och vad skulle du behöva observera när masken rör sig?','Daggmaskar lever i marken och bidrar till nedbrytning. Naturspana försiktigt och lämna djuren i deras miljö.','foodchain'),
  ],
  space:[
    card('iss','Rymdstationen ISS','Vilka delar kan du upptäcka på stationen?','Solpaneler bidrar med el. Det här är ett NASA-fotografi från 2010; stationen kan förändras när delar byggs till.','photos'),
    card('sun','Solen','Vad kan du jämföra mellan bilderna av solen och månen?','Solen avger eget ljus. Månen reflekterar solljus. Titta aldrig direkt mot solen och rikta aldrig ett teleskop mot den.','solar','moon'),
    card('moon-first-quarter','Månen med en belyst halva','Vilken skillnad ser du jämfört med bilden av en fullmåne?','Vi ser olika mycket av månens belysta sida vid olika faser. Månen krymper inte när mindre av den lyser för oss.','moon','moon'),
  ],
  world:[
    card('obj-bridge','En bro','Hur kan en bro påverka hur människor tar sig fram?','Broar kan förbinda platser som skiljs åt av exempelvis vatten. Bilden visar en viss vy av en bro.','places'),
    card('lejon','Ett lejon','Vilka frågor om djurets livsmiljö skulle du vilja undersöka?','Ett foto av ett djur bevisar inte var alla djur av arten lever. Använd fler källor för att undersöka livsmiljöer.','animals'),
    card('obj-train','Att resa med tåg','Hur kan du undersöka var ett tåg går?','Kartor och tidtabeller ger olika slags information. Fotot berättar inte tågets väg eller avgångstid.','places'),
  ],
  ai:[
    card('obj-dog','Varierade djurbilder','Vad skiljer bilderna, och hur skulle du beskriva det för en bildapp?','Olika djur, ljus och bakgrunder ger olika information. Ett system behöver prövas på nya exempel.','examples','obj-cat'),
    card('obj-telescope','Ett verktyg för att observera','Är ett teleskop automatiskt AI bara för att det hjälper oss se mer?','Nej. Ett hjälpmedel behöver inte använda AI. Fråga hur tekniken faktiskt fungerar.','meaning'),
    card('obj-ruler','Kontroll med ett verktyg','Hur kan du kontrollera ett påstående om längd?','Du kan mäta med en linjal. En egen undersökning kan hjälpa dig att granska ett datorgenererat påstående.','verify'),
  ],
  code:[
    card('obj-alarm-clock','En väckarklocka','Vilka steg skulle du beskriva för ett program som ska väcka dig?','En timer kan följa regler utan AI. Bilden visar ett föremål, inte hur en viss klockas program fungerar.','algorithms'),
    card('obj-lamp','En lampa','Hitta på en regel: vad ska hända när en knapp trycks?','En händelse kan starta en instruktion, exempelvis tänd lampan. Alla lampor är inte programmerade.','events'),
    card('obj-microphone','En mikrofon','Vilka steg skulle ett program kunna följa för att spela in ljud?','Beskriv börja spela in, samla ljud och stoppa. Dela upp uppgiften i tydliga steg.','algorithms'),
  ],
  draw:[
    card('obj-butterfly','Mönster på vingar','Vilka detaljer skulle du förenkla när du ritar en egen fjäril?','Du kan undersöka mönster och ungefärlig symmetri. Din bild behöver inte kopiera fotografiet.','drawing-missions'),
    card('obj-pencil','Pennstreck','Hur kan du prova raka och böjda streck med samma verktyg?','Utforska olika rörelser och storlekar på strecken. Du väljer själv hur de ska användas i bilden.','canvas'),
    card('moon','Ljust och mörkt','Hur skulle du visa månens ljusa och mörka områden i en teckning?','Prova kontraster och former. Jämför bilderna och välj vad du vill betona.','canvas','moon-first-quarter'),
  ],
  wonder:[
    card('course-condensation','Droppar på en yta','Vilken fråga skulle du ställa om dropparna?','Beskriv först vad du ser. För att veta hur dropparna bildades behöver du också information om förloppet.','activity-practice'),
    card('course-fallen-leaves','Nedfallna löv','Vad tror du händer med löven om du följer dem under lång tid?','Dokumentera samma plats under flera tillfällen. Nedbrytningen beror på bland annat temperatur och organismer i omgivningen.','activity-practice','course-autumn'),
    card('obj-ice','Is och vatten','Vad skulle du vilja undersöka om isbitar och vattendroppar?','Is är vatten i fast form. Jämför bilderna och planera hur du kan undersöka en förändring med en vuxen.','cards','obj-water-drop'),
  ],
  play:[
    card('obj-teddy','En nalle','Vilken berättelse vill du och en kompis skapa för nallen?','Lyssna på varandras idéer och turas om. En berättelse kan ändras när ni leker tillsammans.','studio'),
    card('obj-egg','Ingredienser i låtsasköket','Hur kan ni planera ett låtsasrecept med lika många ingredienser var?','Använd leksaker eller ritade ingredienser. Riktig matlagning kräver en vuxens hjälp.','town'),
    card('course-roots','En planta i lekens trädgård','Vad behöver era figurer planera om de ska odla något?','Fundera tillsammans på ljus, vatten och hur ni kan följa förändringar. Olika växter behöver olika skötsel.','studio'),
  ],
};
