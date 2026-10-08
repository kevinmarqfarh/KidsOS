// Koppling till läroplanerna. Citaten är hämtade ur Skolverkets Lgr22
// (centralt innehåll i årskurs 1–3 resp. förskoleklassen) och Lpfö 18.
// Se docs/RESEARCH.md för källor.
export const CURRICULUM = {
  // Matematik åk 1–3
  'ma-tal': { subject: 'Matematik', area: 'Taluppfattning och tals användning', text: 'Naturliga tal och deras egenskaper samt hur talen kan delas upp och användas för att ange antal och ordning.' },
  'ma-pos': { subject: 'Matematik', area: 'Taluppfattning och tals användning', text: 'Hur positionssystemet kan användas för att beskriva naturliga tal.' },
  'ma-rakna': { subject: 'Matematik', area: 'Taluppfattning och tals användning', text: 'De fyra räknesättens egenskaper och samband samt användning i olika situationer.' },
  'ma-metod': { subject: 'Matematik', area: 'Taluppfattning och tals användning', text: 'Centrala metoder för beräkningar med naturliga tal, vid huvudräkning och överslagsräkning.' },
  'ma-likhet': { subject: 'Matematik', area: 'Algebra', text: 'Matematiska likheter och likhetstecknets betydelse.' },
  'ma-okand': { subject: 'Matematik', area: 'Algebra', text: 'Obekanta tal och hur de kan betecknas med en symbol.' },
  'ma-monster': { subject: 'Matematik', area: 'Algebra', text: 'Hur enkla mönster i talföljder och enkla geometriska mönster kan konstrueras, beskrivas och uttryckas.' },
  'ma-instr': { subject: 'Matematik', area: 'Algebra', text: 'Hur entydiga stegvisa instruktioner kan konstrueras, beskrivas och följas som grund för programmering. Hur symboler används vid stegvisa instruktioner.' },
  'ma-geo': { subject: 'Matematik', area: 'Geometri', text: 'Grundläggande geometriska tvådimensionella objekt samt objekten klot, kon, cylinder och rätblock.' },
  'ma-mat': { subject: 'Matematik', area: 'Geometri', text: 'Jämförelser och uppskattningar av matematiska storheter. Mätning av längd, massa, volym och tid med vanliga nutida och äldre måttenheter.' },
  'ma-sym': { subject: 'Matematik', area: 'Geometri', text: 'Symmetri, till exempel i bilder och i naturen, och hur symmetri kan konstrueras.' },
  'ma-chans': { subject: 'Matematik', area: 'Sannolikhet och statistik', text: 'Slumpmässiga händelser i konkreta situationer.' },
  'ma-diagram': { subject: 'Matematik', area: 'Sannolikhet och statistik', text: 'Enkla tabeller och diagram och hur de kan användas för att sortera data och beskriva resultat från enkla undersökningar.' },
  'ma-prop': { subject: 'Matematik', area: 'Samband och förändring', text: 'Proportionella samband, däribland dubbelt och hälften.' },
  'ma-tid': { subject: 'Matematik', area: 'Geometri', text: 'Mätning av längd, massa, volym och tid med vanliga nutida och äldre måttenheter. (Här: tid – klockan.)' },

  // Svenska åk 1–3
  'sv-ljud': { subject: 'Svenska', area: 'Läsa och skriva', text: 'Sambandet mellan ljud och bokstav.' },
  'sv-avkoda': { subject: 'Svenska', area: 'Läsa och skriva', text: 'Strategier för att avkoda, förstå och tolka ord, begrepp och texter.' },
  'sv-skriva': { subject: 'Svenska', area: 'Läsa och skriva', text: 'Strategier för att skriva ord, meningar och olika typer av texter.' },
  'sv-handstil': { subject: 'Svenska', area: 'Läsa och skriva', text: 'Handstil och att skriva med digitala verktyg.' },
  'sv-regler': { subject: 'Svenska', area: 'Läsa och skriva', text: 'Grundläggande skrivregler, med gemener och versaler, de vanligaste skiljetecknen samt stavning av vanligt förekommande ord.' },
  'sv-alfabet': { subject: 'Svenska', area: 'Läsa och skriva', text: 'Alfabetet och alfabetisk ordning.' },
  'sv-text': { subject: 'Svenska', area: 'Texter', text: 'Hur en berättande text kan organiseras med inledning, händelseförlopp och avslutning samt personbeskrivningar.' },
  'sv-ord': { subject: 'Svenska', area: 'Språkbruk', text: 'Ord och begrepp för att på ett varierat sätt uttrycka känslor, kunskaper och åsikter.' },
  'sv-fsk': { subject: 'Förskoleklass', area: 'Språk och kommunikation', text: 'Bokstäver och andra symboler för att förmedla budskap.' },

  // NO åk 1–3 (biologi, fysik, kemi)
  'no-arstid': { subject: 'NO', area: 'Året runt i naturen', text: 'Årstidsväxlingar i naturen och hur man känner igen årstider.' },
  'no-livscykel': { subject: 'Biologi', area: 'Året runt i naturen', text: 'Några djurs och växters livscykler och anpassningar till olika livsmiljöer och årstider.' },
  'no-arter': { subject: 'Biologi', area: 'Året runt i naturen', text: 'Djur, växter och svampar i närmiljön, hur de kan grupperas samt namn på några vanligt förekommande arter.' },
  'no-kedja': { subject: 'Biologi', area: 'Året runt i naturen', text: 'Enkla näringskedjor som beskriver samband mellan organismer i ekosystem.' },
  'no-kropp': { subject: 'NO', area: 'Kropp och hälsa', text: 'Människans kroppsdelar, deras namn och funktion.' },
  'no-sinnen': { subject: 'NO', area: 'Kropp och hälsa', text: 'Människans upplevelser av ljus, ljud, temperatur, smak och doft med hjälp av olika sinnen.' },
  'no-halsa': { subject: 'NO', area: 'Kropp och hälsa', text: 'Betydelsen av mat, sömn, hygien, motion och sociala relationer för att må bra.' },
  'no-material': { subject: 'NO', area: 'Material och ämnen i vår omgivning', text: 'Materials egenskaper och hur material och föremål kan sorteras efter egenskaperna utseende, magnetism, ledningsförmåga och om de flyter eller sjunker i vatten.' },
  'no-vatten': { subject: 'NO', area: 'Material och ämnen i vår omgivning', text: 'Vattnets olika former: fast, flytande och gas. Övergångar mellan formerna: avdunstning, kokning, kondensering, smältning och stelning.' },
  'no-blandning': { subject: 'NO', area: 'Material och ämnen i vår omgivning', text: 'Enkla lösningar och blandningar och hur de kan delas upp i sina beståndsdelar, till exempel genom avdunstning och filtrering.' },
  'no-sortera': { subject: 'NO', area: 'Material och ämnen i vår omgivning', text: 'Vilka material olika vardagliga föremål är tillverkade av och hur de kan källsorteras.' },
  'no-balans': { subject: 'NO', area: 'Kraft och rörelse', text: 'Balans, tyngdpunkt och jämvikt som kan observeras i lek och rörelse, till exempel vid balansgång och på gungbrädor.' },
  'no-friktion': { subject: 'NO', area: 'Kraft och rörelse', text: 'Tyngdkraft och friktion som kan observeras i lek och rörelse, till exempel i gungor och rutschbanor.' },
  'no-ljus': { subject: 'NO', area: 'Kropp och hälsa / fysik', text: 'Människans upplevelser av ljus, ljud, temperatur, smak och doft med hjälp av olika sinnen. (Här: ljus och skugga.)' },
  'no-metod': { subject: 'NO', area: 'Metoder och arbetssätt', text: 'Enkla naturvetenskapliga undersökningar. Dokumentation av undersökningar med text, bild och andra uttrycksformer.' },
  'no-himmel': { subject: 'NO', area: 'Året runt i naturen', text: 'Jordens, solens och månens rörelser i förhållande till varandra. Månens olika faser. Stjärnbilder och stjärnhimlens utseende vid olika tider på året.' },
  'no-berattelse': { subject: 'NO', area: 'Berättelser om natur och naturvetenskap', text: 'Berättelser om äldre tiders naturvetenskap och om olika kulturers strävan att förstå och förklara fenomen i naturen.' },

  // Teknik åk 1–3
  'tk-prog': { subject: 'Teknik', area: 'Tekniska lösningar', text: 'Föremål i elevernas vardag som styrs med hjälp av programmering, till exempel hushållsmaskiner och smarta telefoner.' },
  'tk-styr': { subject: 'Teknik', area: 'Arbetsmetoder', text: 'Styrning av föremål med programmering.' },

  // Bild / skapande
  'bi-skapa': { subject: 'Bild', area: 'Bildframställning', text: 'Framställning av berättande bilder, till exempel sagobilder och serier. Teckning, måleri, modellering och konstruktion.' },
  'fsk-utforska': { subject: 'Förskoleklass', area: 'Natur, teknik och samhälle', text: 'Olika sätt att utforska företeelser och samband i natur, teknik och samhälle, genom observationer, mätningar och samtal.' },
};

export function curriculumFor(ids = []) {
  return ids.map((id) => ({ id, ...CURRICULUM[id] })).filter((c) => c.text);
}
