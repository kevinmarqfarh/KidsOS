// Egen lokal byggsandlåda. Gemensamma profilmynt tjänas i läraktiviteter.
export const BUILD_WORLD_LESSONS=[
 {id:'world-first-build',title:'Välj, bygg och upptäck',minLevel:0,moduleId:'world',lgr:['bi-skapa','ma-geo'],takeaway:'Du kan prova, ta bort och ångra. Din värld sparas för din profil.',steps:[
  {title:'En ruta i taget',text:'Byggvärlden är din plats att skapa. Välj en ruta och en byggdel. Bygg, gå runt och berätta vad du vill skapa.',example:'Bygg en liten plats för en figur. Du bestämmer om det är ett hem, en park eller något annat.'},
  {title:'Prova utan köp',text:'Startlagret räcker för fri lek. Du kan ta bort byggdelar och använda dem igen. Kursmynt kan köpa fler delar när du vill.',example:'Välj en ruta, bygg en del och prova Ta bort eller Ångra. Dina andra kursframsteg ändras inte.'},
 ]},
 {id:'world-plan-build',title:'Planera och pröva din värld',minLevel:4,moduleId:'world',lgr:['bi-46','ma-46'],takeaway:'En ritning och en provtur kan hjälpa dig förbättra en konstruktion.',steps:[
  {title:'Från idé till plan',text:'Du kan planera en byggnad med en enkel ritning ovanifrån. Beskriv längd, bredd och hur figuren ska kunna ta sig fram.',example:'Rita en byggnad som upptar tre gånger två rutor. Det är sex rutor på marken.'},
  {title:'Granska din lösning',text:'Bygg planen och prova att gå runt. Finns en väg fram? Vill du ändra placeringen eller lägga till en detalj?',example:'Jämför ritningen med bygget. Berätta vad du ändrade och varför det fungerade bättre.'},
 ]},
];
export const buildWorldApp={id:'build-world',name:'Byggvärlden',icon:'🧱',color:'#318b73',tagline:'Bygg din värld, utforska och skapa',modules:[{id:'world',name:'Min byggvärld',icon:'🧱',minLevel:0,view:'buildWorld',lgr:['bi-skapa','ma-geo','ma-pos']} ]};
