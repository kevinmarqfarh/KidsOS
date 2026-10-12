// Egna sammanfattningar, inte citat eller fullständig läroplanstäckning.
const subjectUrl=code=>`https://syllabuswebb.skolverket.se/compulsorycw/jsp/subject.htm?subjectCode=${code}&tos=gr`;
const upper=(subject,code,text)=>({subject,area:'Fördjupning i årskurs 4–6',stage:'middle',source:subjectUrl(code),text});
export default {
 'lpfo-lek':{subject:'Förskola',area:'Lek, språk och utforskande',stage:'preschool',source:'https://www.skolverket.se/undervisning/forskolan/guide-till-andringar-i-forskolans-laroplan',text:'Egen sammanfattning av Lpfö 18 reviderad 2025: lek, högläsning, samtal, skapande och utforskande. Förskolans lärverktyg ska främst vara analoga.'},
 'fsk-lek':{subject:'Förskoleklass',area:'Samtala, skapa och utforska',stage:'reception',source:'https://www.skolverket.se/download/18.2cd92ed197a1b2bbcd5e08f/1752153467251/pdf1',text:'Egen sammanfattning av Lgr22 del 3: lek och varierade uttrycksformer, språk, matematiska resonemang samt utforskande av natur, teknik och samhälle.'},
 'ma-46':upper('Matematik','GRGRMAT01','Egen sammanfattning: bråk, decimaler och procent, problemlösning och rimlighet samt statistik med medelvärde, median och typvärde.'),
 'sv-46':upper('Svenska','GRGRSVE01','Egen sammanfattning: förstå och resonera om texter, sammanfatta, jämföra information, anpassa eget skrivande och bearbeta texter.'),
 'no-46':upper('NO','GRGRFYS01','Egen sammanfattning: planera och dokumentera undersökningar, värdera resultat och använda modeller för naturvetenskapliga samband.'),
 'geo-46':upper('Geografi','GRGRGEO01','Egen sammanfattning: kartors uppbyggnad, symboler och skala samt användning av geografiska källor och fältstudier.'),
 'so-46':upper('SO','GRGRSAM01','Egen sammanfattning: demokratiska arbetssätt, information i medier samt källkritisk granskning av avsändare, syfte och underlag. Kartskala kopplar också till geografi och matematik.'),
 'tk-46':upper('Teknik och programmering','GRGRTEK01','Egen sammanfattning: tekniska lösningar, konstruktion och styrning med programmering samt dokumentation och förbättring av lösningar.'),
 'bi-46':upper('Bild','GRGRBIL01','Egen sammanfattning: bildberättande, budskap, bildutsnitt, bildanalys samt medvetna val vid framställning av bilder.'),
};
