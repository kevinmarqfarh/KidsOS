// Educational content, not a live AI service. Sources checked 2026-10-09:
// https://www.unicef.org/innocenti/reports/policy-guidance-ai-children
// https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
// Curriculum links describe related skills, not a claim that Lgr22 mandates AI.
// Rows: minimum level, question, correct answer, distractors, hint, explanation.
export const AI_SCENARIOS = {
  meaning: [
    [0, 'Vad är AI?', 'Datorprogram som kan göra uppgifter som att känna igen bilder', ['En levande människa i datorn', 'Allt som använder el'], 'AI är byggt av människor.', 'AI betyder artificiell intelligens. Det är teknik, inte en liten människa.'],
    [0, 'En AI säger hej. Vad betyder det?', 'Ett program har gjort ett svar', ['Den måste vara en riktig kompis', 'Den har en mänsklig kropp'], 'Ord på en skärm kommer från ett program.', 'Ett vänligt svar betyder inte att programmet är en människa. Riktiga relationer har vi med människor.'],
    [1, 'En app känner igen en katt i ett foto. Vad kan AI hjälpa till med?', 'Hitta mönster i bilder', ['Mata katten genom skärmen', 'Veta allt om katten'], 'Tänk på vad som finns i fotot.', 'Bildigenkänning kan hitta mönster. Fotot visar inte allt om katten.'],
    [2, 'Är varje timer en AI?', 'Nej, en timer kan följa en enkel bestämd regel', ['Ja, all elektronik är AI', 'Ja, om den piper'], 'En klocka kan räkna utan att lära från exempel.', 'Vanlig programmering och AI kan finnas i samma produkt. Alla datorprogram är inte AI.'],
    [3, 'Vad gör generativ AI?', 'Skapar exempelvis text eller bilder utifrån inlärda mönster', ['Hittar alltid en riktig fotograferad bild', 'Läser alla människors tankar'], 'Generera betyder skapa.', 'Generativ AI producerar nytt innehåll. Innehållet kan vara användbart men också felaktigt.'],
    [4, 'En språkmodell skriver ett säkert svar. Vad vet du då?', 'Den har skapat text, men texten behöver granskas', ['Den har bevisat svaret', 'Den har själv upplevt händelsen'], 'Säker ton är inte ett bevis.', 'Språkmodeller bygger svar från mönster i data. Ett flytande svar garanterar inte kunskap eller sanning.'],
  ],
  examples: [
    [0, 'En bild-AI ska öva på katter. Vad hjälper?', 'Flera bilder av katter', ['Bara ordet katt utan bilder', 'Att göra skärmen ljusare'], 'Den behöver exempel på det den ska känna igen.', 'Många AI-system tränas med exempel. Bilder kan vara data.'],
    [0, 'Vi märker en hundbild med ordet katt. Vad blir problemet?', 'Exemplet får fel namn', ['Hunden blir en katt', 'Alla bilder blir bättre'], 'Etiketten ska beskriva bilden.', 'Fel märkta exempel kan göra inlärningen sämre. Vi behöver kontrollera våra exempel.'],
    [1, 'AI har bara övat på stora hundar. Vilken bild är bra att lägga till?', 'En liten hund', ['Samma stora hund igen', 'En tom bild'], 'Hundar kan se olika ut.', 'Varierade exempel hjälper systemet att möta fler slags hundar. Det lovar inte att alla svar blir rätt.'],
    [2, 'Vad är data i en övning om fågelläten?', 'Inspelningar och deras beskrivningar', ['Bara datorns färg', 'Bara högtalarens pris'], 'Data är information.', 'Ljud, bilder, text och tal kan vara data som AI-system använder.'],
    [3, 'Vi testar på precis de bilder AI redan övat på. Vad missar vi?', 'Hur den fungerar på nya bilder', ['Att bilder har färg', 'Hur många knappar datorn har'], 'Ett prov behöver nya exempel.', 'Testdata ska hållas skilda från träningsdata för att pröva om systemet klarar nya fall.'],
    [4, 'AI känner igen djur med 9 rätt av 10 i ett litet test. Vad bör vi göra?', 'Testa fler nya och varierade bilder', ['Lova att den alltid har rätt', 'Sluta kontrollera svar'], 'Ett litet test visar bara en del.', 'Resultat beror på vilka testfall vi valt. Fler relevanta testfall hjälper oss att förstå begränsningarna.'],
  ],
  verify: [
    [0, 'AI säger att en ko har vingar. Vad gör du?', 'Frågar en vuxen och tittar i en djurbok', ['Tror det för att datorn sa det', 'Lär alla att kor flyger'], 'Datorer kan ge fel svar.', 'Kontrollera med en pålitlig källa. Kor har inga vingar.'],
    [1, 'AI räknar 2 + 3 till 6. Hur kontrollerar du?', 'Räknar fem klossar själv', ['Väljer det längsta svaret', 'Frågar samma fråga utan att kontrollera'], 'Du kan undersöka svaret.', 'Två klossar och tre klossar blir fem. Egen kontroll hjälper dig att förstå.'],
    [2, 'AI anger ett bokcitat. Vad är bäst?', 'Leta upp citatet i boken', ['Tro att citattecken är bevis', 'Dela det direkt'], 'Kontrollera originalet.', 'AI kan hitta på citat. Ett riktigt citat ska gå att hitta i den angivna källan.'],
    [3, 'Två AI-svar säger samma sak. Är det säkert sant?', 'Nej, kontrollera en oberoende pålitlig källa', ['Ja, två svar är alltid bevis', 'Ja, om svaren är långa'], 'Samma fel kan upprepas.', 'AI-system kan upprepa samma fel. En oberoende källa eller egen undersökning ger bättre stöd.'],
    [3, 'AI länkar till en källa. Vad behöver du kontrollera?', 'Att källan finns och stöder påståendet', ['Bara att länken är blå', 'Bara att texten är snygg'], 'En länk kan vara fel eller irrelevant.', 'Öppna och läs källan tillsammans med en vuxen. En länk är inte i sig ett bevis.'],
    [4, 'En AI-bild visar en ovanlig händelse. Vad betyder bilden?', 'Den kan vara skapad och bevisar inte händelsen', ['Att händelsen säkert hände', 'Att fotografen alltid var där'], 'En realistisk bild kan vara genererad.', 'Sök bildens ursprung och oberoende rapportering. Utseendet ensam räcker inte för att avgöra vad som hände.'],
  ],
  fairness: [
    [0, 'Vi visar bara röda äpplen. Vad saknas?', 'Gröna och gula äpplen', ['Fler likadana röda äpplen', 'En större dator'], 'Äpplen kan ha olika färger.', 'Om exempel bara visar en sort kan andra sorter bli svårare att känna igen.'],
    [1, 'Alla hundbilder är tagna ute. Vad bör vi också testa?', 'Hundbilder inomhus', ['Bara fler soliga bilder', 'Bara tomma trädgårdar'], 'Bakgrunden ska inte bestämma djuret.', 'System kan lära oönskade samband, som att hund betyder gräsmatta. Testa nya bakgrunder.'],
    [2, 'En talapp övar bara på vuxnas röster. Vilka saknas?', 'Barns röster', ['Fler vuxna med samma röst', 'Bilder av mikrofoner'], 'Vilka ska använda appen?', 'Ett system bör testas för de människor som ska använda det, med respekt för deras privatliv.'],
    [3, 'AI föreslår bara pojkar som uppfinnare. Vad gör du?', 'Granskar och lägger till sakliga exempel på olika människor', ['Accepterar att bara pojkar kan uppfinna', 'Byter färg på texten'], 'Ett förslag kan vara snedvridet.', 'Snedvridna exempel kan ge orättvisa resultat. Människor behöver granska både data och svar.'],
    [3, 'En app fungerar sämre för en dialekt. Vad är ett bra nästa steg?', 'Testa dialekten och undersöka exemplen', ['Skylla på den som talar', 'Dölja problemet'], 'Teknik ska undersökas när den missar någon.', 'Resultat behöver granskas för olika användare. Att fungera bra i genomsnitt betyder inte att fungera bra för alla.'],
    [4, 'Vi samlar fler likadana exempel. Blir AI automatiskt rättvis?', 'Nej, innehåll och användning måste också granskas', ['Ja, antal räcker alltid', 'Ja, om filen blir stor'], 'Variation, kvalitet och beslut spelar roll.', 'Mer data kan upprepa samma snedvridning. Rättvisa kräver granskning av data, tester och hur systemet används.'],
  ],
  prompts: [
    [0, 'Du vill ha en kort saga om en katt. Vilken instruktion hjälper?', 'Skriv en kort saga om en katt', ['Gör något', 'Du vet allt'], 'Berätta vad du vill skapa.', 'En tydlig instruktion beskriver uppgiften. Vi övar med färdiga exempel, inte en riktig AI-tjänst.'],
    [1, 'Du vill förstå regn. Vilken fråga är tydlig?', 'Förklara regn med enkla ord och ett exempel', ['Väder!', 'Skriv jättemycket om allt'], 'Säg ämne och hur förklaringen ska vara.', 'En prompt är en instruktion eller fråga till AI. Tydlighet hjälper, men svaret behöver kontrolleras.'],
    [2, 'Svaret är för svårt. Vad kan du be om?', 'Förklara med enklare ord och ett vardagsexempel', ['Upprepa precis likadant', 'Gör orden ännu svårare'], 'Du kan förbättra instruktionen.', 'Att ändra en prompt och granska resultatet är ett sätt att arbeta stegvis.'],
    [2, 'Du vill öva matte själv. Vilken instruktion hjälper lärandet?', 'Ge mig en ledtråd utan att avslöja svaret', ['Gör hela läxan åt mig', 'Svara utan att förklara'], 'Be om hjälp som låter dig tänka.', 'En ledtråd kan stödja din egen problemlösning. Du lär dig genom att prova och förklara.'],
    [3, 'Du vill ha tre idéer till ett fågelhus. Vad bör prompten ange?', 'Uppgift, tre idéer och att en vuxen hjälper till', ['Ditt lösenord', 'Bara ordet hus'], 'Beskriv mål och viktiga villkor.', 'Tydliga ramar kan göra idéer användbara. En vuxen behöver bedöma material, verktyg och säkerhet.'],
    [4, 'En tydlig prompt gav ett felaktigt faktasvar. Vad stämmer?', 'Tydliga instruktioner garanterar inte sanning', ['Bra prompt betyder alltid rätt fakta', 'Felet är alltid ditt ansvar'], 'Prompten är bara en del av arbetet.', 'Granskning behövs även efter en bra instruktion. Systemets begränsningar försvinner inte med tydliga ord.'],
  ],
  privacy: [
    [0, 'Vilket är en hemlighet du ska skydda?', 'Ditt lösenord', ['Namnet på en låtsasdrake', 'En påhittad saga'], 'Lösenord ger tillgång till konton.', 'Dela inte lösenord med en chatt eller andra personer. Be en betrodd vuxen om hjälp.'],
    [0, 'Du vill prova en ny AI-app. Vad gör du först?', 'Frågar en betrodd vuxen', ['Skapar konto med falsk ålder', 'Lämnar ut alla uppgifter'], 'En vuxen kan hjälpa dig välja.', 'Tjänster kan ha åldersgränser och samla information. Vuxna hjälper till att bedöma villkoren.'],
    [1, 'En prompt vill ha din hemadress. Vad är klokt?', 'Använda en påhittad plats och fråga en vuxen', ['Skriva adress och portkod', 'Skriva en kompis adress'], 'Övningen behöver inte din riktiga adress.', 'Använd låtsasuppgifter när personliga uppgifter inte behövs. Skydda även andras information.'],
    [2, 'Du vill ladda upp en bild på en kompis. Vad behövs?', 'Kompisens tillåtelse och hjälp från en vuxen', ['Bara att bilden är rolig', 'Att ingen märker det'], 'Andra får vara med och bestämma om sina bilder.', 'Bilder kan innehålla personlig information. Fråga först och undersök hur tjänsten hanterar bilden.'],
    [3, 'AI ber om skolans namn för en påhittad saga. Vad gör du?', 'Använder ett påhittat skolnamn', ['Lämnar skola, klass och schema', 'Lämnar en väns schema'], 'Minimera det du delar.', 'En saga behöver inte verkliga personuppgifter. Dela bara sådant som behövs och som en vuxen bedömt lämpligt.'],
    [4, 'Kan du anta att allt du skriver i en AI-tjänst är privat?', 'Nej, undersök tjänstens villkor med en vuxen', ['Ja, eftersom det är en chatt', 'Ja, om texten är kort'], 'Olika tjänster hanterar data olika.', 'En tjänst kan lagra eller använda inskickat material på olika sätt. Kontrollera villkor och inställningar före användning.'],
  ],
  responsibility: [
    [0, 'AI föreslår en lek som känns farlig. Vem hjälper?', 'En betrodd vuxen', ['AI får bestämma allt', 'Ingen behöver kontrollera'], 'Människor tar ansvar för tryggheten.', 'Du får säga nej och be om hjälp. Ett AI-förslag är inte en order.'],
    [1, 'AI gör ett utkast till saga. Vem bestämmer din slutliga saga?', 'Du, med hjälp om du behöver', ['Programmet bestämmer alltid', 'Ingen får ändra texten'], 'Ett utkast går att bearbeta.', 'AI kan ge idéer. Du granskar, ändrar och väljer vad du vill använda.'],
    [2, 'Du använder AI-idéer i ett skolarbete. Vad gör du?', 'Följer lärarens regler och berättar om hjälpen', ['Låtsas att allt är eget arbete', 'Struntar i uppgiften'], 'Var ärlig om hur arbetet blev till.', 'Du behöver förstå och kunna förklara ditt arbete. Lärare kan ha olika regler för hjälpmedel.'],
    [3, 'En AI-app har gjort ett orättvist beslut. Vem måste kunna hjälpa?', 'Ansvariga människor som kan granska och rätta', ['Ingen, eftersom datorn bestämde', 'Bara den som drabbades'], 'Beslut behöver kunna ifrågasättas.', 'De som bygger och använder systemen har ansvar. Människor behöver kunna få förklaringar och få fel prövade.'],
    [3, 'AI ger råd om hur du ska hantera svår oro. Vad är bäst?', 'Prata med en betrodd vuxen som kan hjälpa', ['Låt chatten ersätta alla människor', 'Håll allt hemligt för vuxna'], 'En människa kan lyssna och hjälpa på riktigt.', 'En AI-chatt kan ge olämpliga råd. Vid oro behöver du stöd från människor du litar på.'],
    [4, 'AI föreslår en ny uppfinning. Vad gör du före användning?', 'Granskar, testar säkert och låter ansvariga människor bedöma', ['Använder den direkt för att texten låter bra', 'Kallar den bevisad utan tester'], 'En idé behöver prövas.', 'AI kan stödja kreativitet, men människor måste kontrollera fakta, funktion och följder före verklig användning.'],
  ],
};

export function genAIQuiz(topic, level, rng) {
  const row = rng.pick(AI_SCENARIOS[topic].filter((item) => item[0] <= level));
  const [, prompt, answer, distractors, hint, explain] = row;
  return { type: 'choice', prompt, options: rng.shuffle([answer, ...distractors]).map((label) => ({ id: label, label })), answer, hint, explain };
}

const topics = [
  ['meaning', 'Vad är AI?', '💡', 0, ['tk-prog', 'fsk-utforska'], 'AI är teknik skapad av människor. Den kan känna igen mönster och skapa innehåll.', 'En bildapp kan föreslå att ett foto visar en katt. Den kan också ta fel.', 'Alla datorprogram är inte AI.'],
  ['examples', 'Lär av exempel', '🧩', 0, ['ma-diagram', 'fsk-utforska'], 'Många AI-system tränas på exempel. Information som bilder, ljud och text kallas data.', 'Visa olika hundar med rätt namn. Testa sedan med nya hundbilder.', 'Bra exempel och nya testfall hjälper oss att förstå vad systemet klarar.'],
  ['verify', 'Faktadetektiven', '🔎', 0, ['fsk-utforska'], 'Ett AI-svar kan låta säkert och ändå vara fel. Kontrollera viktiga påståenden.', 'Om AI säger 2 + 3 = 6 kan du räkna klossar och upptäcka felet.', 'Ett svar blir inte sant bara för att det låter övertygande.'],
  ['fairness', 'Plats för alla', '🌍', 0, ['ma-diagram', 'fsk-utforska'], 'Om exemplen saknar vissa sorter eller människor kan systemet fungera sämre för dem.', 'En app som bara sett röda äpplen behöver också prövas på gröna och gula.', 'Granska vem och vad som saknas i exempel och tester.'],
  ['prompts', 'Tydliga frågor', '💬', 0, ['sv-ord', 'ma-instr'], 'En prompt är en fråga eller instruktion. Beskriv målet, ämnet och hur svaret ska se ut.', 'Förklara regn med enkla ord och ett exempel är tydligare än Väder!', 'Förbättra frågan, granska svaret och tänk själv.'],
  ['privacy', 'Skydda det privata', '🔐', 0, ['fsk-utforska'], 'Använd påhittade uppgifter i övningar. Dela inte lösenord och be en vuxen om hjälp med nya tjänster.', 'En saga kan handla om Låtsasskolan i stället för din riktiga skola.', 'Skydda både dina egna och andras uppgifter.'],
  ['responsibility', 'Människan bestämmer', '🤝', 0, ['tk-prog', 'fsk-utforska'], 'AI kan ge förslag. Människor behöver granska dem och ta ansvar för vad som används.', 'Bearbeta en saga med egna idéer och berätta om hjälpen när skolans regler kräver det.', 'Du får säga nej, fråga och be människor om hjälp.'],
];

// Each lesson develops one idea through explanation, a concrete investigation and reflection.
const lessonSteps = {
  meaning: [
    { title: 'Ett verktyg gjort av människor', text: 'AI betyder artificiell intelligens. Människor bygger datorprogram som kan hjälpa till med uppgifter som att känna igen bilder, förstå tal eller skapa text.', example: 'Du säger katt till en talapp. Programmet försöker känna igen ljuden och skriva ordet.' },
    { title: 'Hjälp är inte magi', text: 'AI behöver information för att göra sin uppgift. Den kan inte se ditt rum om den inte får en bild eller annan information om rummet.', example: 'Beskriv en leksak utan att säga färgen. Kan någon annan veta vilken färg den har? Saknad information gör uppgiften svårare.' },
    { title: 'Fundera på gränsen', text: 'AI kan ge ett bra förslag och ändå göra ett fel nästa gång. Ett vänligt svar kommer från ett program; människor är de som kan ta hand om dig och vara dina vänner.', example: 'Vilken uppgift skulle du vilja få hjälp med? Vad behöver en människa fortfarande kontrollera?' },
  ],
  examples: [
    { title: 'Exempel blir information', text: 'Många AI-system tränas med exempel. När bilder får namn, som katt och hund, kan programmet leta efter mönster som hänger ihop med namnen.', example: 'Lägg fram bilder av en katt, en hund och en annan katt. Säg rätt namn till varje bild.' },
    { title: 'Variera och testa', text: 'Katter ser olika ut. Visa olika färger, storlekar och bakgrunder. Spara några andra bilder för att testa efter träningen.', example: 'Om alla kattbilder har en soffa bakom katten kan systemet råka använda soffan som ledtråd. Prova en katt utomhus.' },
    { title: 'Lär av ett misstag', text: 'Ett fel i testet berättar något om vad systemet behöver förbättra. Kontrollera namn och exempel, och testa igen med nya bilder.', example: 'Om en liten hund kallas katt: saknas små hundar bland exemplen? Vad mer kan du behöva undersöka?' },
  ],
  verify: [
    { title: 'Text är inte bevis', text: 'AI kan skapa meningar som låter riktiga men innehåller fel. Även ett långt svar med citat kan vara fel.', example: 'Ett påhittat AI-svar säger att en ko har vingar. Titta på ett riktigt foto eller i en djurbok tillsammans.' },
    { title: 'Kontrollera påståendet', text: 'Välj ett påstående och kontrollera det genom att räkna själv, undersöka eller läsa en pålitlig källa. Vid svåra frågor kan en vuxen hjälpa till.', example: 'Ett svar säger att två klossar plus tre klossar blir sex. Lägg ihop klossarna och räkna: det blir fem.' },
    { title: 'Visa vad du vet', text: 'Berätta vad du hittade och hur du kontrollerade. Om du inte kan avgöra svaret ännu går det bra att säga att du inte vet.', example: 'Jag tror att svaret är fem eftersom jag räknade klossarna. Vilket stöd har du för ditt svar?' },
  ],
  fairness: [
    { title: 'Vad saknas?', text: 'Om AI bara får se en liten del av världen kan den få svårt med sådant som saknas. Många likadana exempel löser inte alltid problemet.', example: 'Visa röda äpplen. Lägg sedan fram ett grönt äpple. Det är också ett äpple även om färgen är ny.' },
    { title: 'Pröva olika fall', text: 'Fundera på vilka som ska använda tekniken och vad den ska fungera för. Testa flera slags exempel utan att samla onödiga privata uppgifter.', example: 'En talapp för barn behöver prövas med barns röster, inte bara vuxnas. Om den missar en röst är det tekniken som behöver undersökas.' },
    { title: 'Rättvist för vem?', text: 'Ett system kan fungera bra för många men dåligt för några. Människor behöver granska resultat och ta ansvar för att fel upptäcks och kan rättas.', example: 'Om en app inte förstår en dialekt, hur kan den som använder appen få hjälp och berätta om problemet?' },
  ],
  prompts: [
    { title: 'Säg vad du vill göra', text: 'En prompt är en fråga eller instruktion till AI. Beskriv uppgiften med tydliga ord och använd påhittade uppgifter i övningar.', example: 'Skriv en saga om en liten drake är tydligare än Gör något.' },
    { title: 'Lägg till lagom ramar', text: 'Säg hur svaret ska vara, till exempel kort, med enkla ord eller med tre förslag. Du kan också be om en ledtråd så att du får lösa uppgiften själv.', example: 'Förklara regn med enkla ord och ett exempel. Eller: Ge mig en ledtråd till mattetalet utan att avslöja svaret.' },
    { title: 'Förbättra och granska', text: 'Om svaret är för svårt kan du ändra instruktionen. En tydlig prompt garanterar ändå inte att fakta är rätt.', example: 'Låtsas att svaret använder ett svårt ord. Be om en förklaring av ordet och kontrollera sedan ett faktapåstående.' },
  ],
  privacy: [
    { title: 'Det privata är värdefullt', text: 'Lösenord ska hållas hemliga. Namn, bilder, adress och skola kan berätta saker om dig och andra. En övning behöver oftast inte de riktiga uppgifterna.', example: 'En saga kan handla om Låtsasskolan på Molngatan i stället för din riktiga skola och adress.' },
    { title: 'Fråga före delning', text: 'Fråga en betrodd vuxen innan du använder en ny AI-tjänst. Fråga även den som syns på en bild innan bilden delas. En vuxen hjälper till att bedöma tjänstens regler.', example: 'Du vill göra en saga om en kompis. Kan du använda en påhittad figur och beskriva den utan ett foto?' },
    { title: 'Dela så lite som behövs', text: 'Olika tjänster kan lagra och använda det som skickas in på olika sätt. En vuxen kan hjälpa dig kontrollera villkor och inställningar. Lämna inte ut extra information bara för att en chatt ber om den.', example: 'För att öva en fråga om väder behöver du inte ange namn, skolklass eller hemadress. Vilka uppgifter kan du ta bort?' },
  ],
  responsibility: [
    { title: 'Förslaget är bara början', text: 'AI kan ge idéer till en saga eller hjälpa dig tänka på olika lösningar. Du väljer, ändrar och kontrollerar vad du vill använda.', example: 'AI föreslår att en drake bor i en grotta. Du väljer att draken ska bo i ett bibliotek och förklarar varför.' },
    { title: 'Människor tar ansvar', text: 'De som bygger och använder AI-system behöver ta ansvar för hur de fungerar och används. Ett farligt eller orättvist förslag blir inte okej för att det kommer från en dator.', example: 'Om en app föreslår en farlig lek: avbryt och prata med en vuxen. Du får säga nej till förslaget.' },
    { title: 'Var ärlig och be om hjälp', text: 'Följ lärarens regler om hjälpmedel och berätta om AI-hjälp när det behövs. Du ska kunna förklara ditt eget arbete. Vid oro ska du prata med en människa du litar på.', example: 'Berätta: Jag fick tre idéer från AI och skrev sedan min egen saga. Vilka delar gjorde du själv, och vad lärde du dig?' },
  ],
};

export const AI_LESSONS = [
  ...topics.map(([id, title, , minLevel, , , , takeaway]) => ({ id, moduleId: id, title, minLevel, steps: lessonSteps[id], takeaway })),
  {
    id: 'rules-models', moduleId: 'examples', title: 'Regel eller inlärt mönster?', minLevel: 2,
    steps: [
      { title: 'Skriv en bestämd regel', text: 'En vanlig regel kan vara: om talet är större än fem, välj stor. Programmet följer den regel som människan skrev.', example: 'Testa talen fyra, fem och sex. Med just denna regel blir bara sex stor.' },
      { title: 'Lär från märkta exempel', text: 'I maskininlärning används exempel för att anpassa en modell. En modell är en beräkningsbeskrivning som använder inlärda mönster för att ge ett resultat.', example: 'I vårt modell-labb märker du djur som fågel eller däggdjur. Modellen jämför ett nytt djurs egenskaper med de sparade exemplen och använder närmaste exemplets etikett. Andra modeller lär på andra sätt.' },
      { title: 'Jämför hur fel uppstår', text: 'En skriven regel kan vara olämplig. En inlärd modell kan få fel på grund av exempel eller hur den byggts. Båda behöver testas.', example: 'Om modellen bara får exempel på däggdjur saknas exempel på fåglar. Testa gräsanden och lägg sedan till rätt märkta fågelexempel. Hur ändras svaret?' },
    ], takeaway: 'En regel skrivs uttryckligen; en modell kan anpassas från exempel. Båda behöver granskas.',
  },
  {
    id: 'text-evidence', moduleId: 'verify', title: 'Skapa text eller hitta belägg?', minLevel: 3,
    steps: [
      { title: 'Språkmodellen bygger text', text: 'En språkmodell kan skapa text genom att förutsäga nästa textdel utifrån sammanhang och inlärda mönster. Det ger inte automatiskt ett kontrollerat faktasvar.', example: 'Den kan skriva en rimlig berättelse om en upptäcktsresande men samtidigt hitta på ett datum.' },
      { title: 'Sökning är en annan uppgift', text: 'Vissa AI-tjänster har verktyg som söker i källor. Att hämta en text och att skapa ett svar är olika steg. Även ett svar med sökning kan misstolka en källa.', example: 'En länk till ett museum kan stödja ett historiskt datum. Läs sidan och se om det är samma händelse som frågan gäller.' },
      { title: 'Följ kedjan till originalet', text: 'Välj ett påstående, hitta originalkällan och kontrollera att den faktiskt säger det som svaret påstår. Jämför datum och sammanhang.', example: 'Om svaret hänvisar till en bok: finns boken, finns citatet och används det i rätt sammanhang?' },
    ], takeaway: 'Skapad text, sökresultat och belägg är olika saker. Kontrollera kopplingen mellan dem.',
  },
  {
    id: 'evaluation', moduleId: 'fairness', title: 'Vad visar ett AI-test?', minLevel: 4,
    steps: [
      { title: 'Räkna rätt och fel', text: 'Om ett system får nio rätt av tio i ett test är resultatet nittio procent för just dessa testfall. Det är ingen garanti för nästa exempel.', example: 'Nio röda äpplen blir rätt och ett grönt blir fel. Totalt ser resultatet bra ut, men gröna äpplen testades bara en gång.' },
      { title: 'Dela upp och undersök', text: 'Granska relevanta grupper av exempel och använd nya testfall. Det kan visa problem som ett genomsnitt döljer. Ett mycket litet deltest är osäkert.', example: 'Testa fler gröna, gula och röda äpplen, med olika bakgrunder. Jämför resultaten utan att återanvända träningsbilder.' },
      { title: 'Bedöm följderna', text: 'Rättvisa handlar också om uppgiften, hur systemet används och vem som drabbas av fel. Mer data eller samma träffsäkerhet för grupper löser inte alla frågor.', example: 'Ett fel i ett äppelspel och ett fel i ett beslut om en människa har olika följder. Vilken granskning och möjlighet att få felet rättat behövs?' },
    ], takeaway: 'Ett test behöver relevanta nya exempel, granskning av olika fall och förståelse för följderna.',
  },
];

export const aiApp = {
  id: 'ai', name: 'AI', icon: '🧠', color: '#7163d9',
  tagline: 'Förstå, undersök och använd AI klokt',
  modules: [
    { id: 'course', name: 'AI-kursen', icon: '📖', minLevel: 0, view: 'course', lgr: ['tk-prog', 'fsk-utforska'] },
    { id: 'lab', name: 'Träna en modell', icon: '🧪', minLevel: 1, view: 'aiLab', lgr: ['ma-monster', 'no-metod'] },
    ...topics.map(([id, name, icon, minLevel, lgr]) => ({ id, name, icon, minLevel, lgr, gen: (level, rng) => genAIQuiz(id, level, rng) })),
  ],
};
