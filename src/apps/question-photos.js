// Explicit stöd till just dessa frågor. Ingen gissning från nyckelord och inget
// svar i bildtexten. Frågan och dess svarsalternativ ändras inte.
const p = (key,title) => ({key,title});
const CAR = p('obj-car','En bil, som exempel på föremålet i uppgiften');
const COMPUTER = p('obj-computer','En dator');
const MOON = p('moon','Månen mot en mörk bakgrund');
const SHADOW = p('course-shadow','Skuggor från träd på en gata');
export const QUESTION_PHOTOS = {
  science: {
    'Du vill se om en sten flyter. Vad kan du göra med en vuxen?':[p('obj-rock','En sten')],
    'Isen blir vatten. Vad har hänt?':[p('obj-ice','Isbitar')],
    'Vad behöver du för att se en skugga?':[SHADOW],
    'Vilken anteckning berättar vad du såg?':[p('obj-wood','Ved, som exempel på trä')],
    'Du jämför en bil på matta och trä. Vad ska vara samma?':[CAR],
    'Bilen rullar 20, 22 och 21 cm. Hur beskriver du resultatet?':[CAR],
    'Du lyser på en kloss. Var finns skuggan?':[p('obj-flashlight','Ficklampor')],
    'Vilket är ett mätresultat?':[SHADOW],
    'Vilken sak brukar en magnet dra till sig?':[p('obj-magnet','En magnet med järnfilspån omkring sig')],
  },
  biology: {
    'Du hittar ett litet djur med åtta ben. Vilken grupp passar?':[p('spindel','Ett litet djur bland växter')],
    'Vilken del tar vanligen upp vatten ur jorden?':[p('course-roots','En ung planta med frö och flera synliga växtdelar')],
    'Vad gör du med ett okänt djur ute?':[p('ekorre','Ett djur utomhus')],
    'Gräs äts av hare. Hare kan ätas av räv. Vilken ordning visar födan?':[p('hare','En hare'),p('rav','En räv')],
    'Varför är humlor viktiga för många blommande växter?':[p('humla','En humla vid en blomma')],
    'Vad händer med näringsämnen när nedbrytare bryter ner döda löv?':[p('course-fallen-leaves','Nedfallna löv')],
    'Du ser färre fjärilar en dag. Vad kan du dra för slutsats?':[p('obj-butterfly','En fjäril')],
  },
  space: {
    'Din plats på jorden vänds bort från solen. Vad blir det?':[p('earth','Jorden sedd från rymden')],
    'Vilket föremål lyser med eget ljus?':[p('sun','En ljus skiva mot en mörk bakgrund'),MOON],
    'Vad går månen runt?':[MOON],
    'Varför kan månen se olika stor ut från natt till natt?':[MOON,p('moon-first-quarter','Månen vid en annan fas')],
    'Vad gör jorden på ungefär ett år?':[p('earth','Jorden')],
    'Vad förklarar främst våra årstider?':[p('course-spring','Blommande träd'),p('course-winter','Snö i ett landskap')],
  },
  world: {
    'Vad visar en karta över ditt rum?':[p('obj-house','Ett hus, som exempel på en plats')],
    'Norr är uppåt på kartan. Vilket håll är åt höger?':[p('obj-compass','En kompass')],
  },
  ai: {
    'En bildapp känner igen en hund som en katt. Vad kan du säga?':[p('obj-dog','En hund'),p('obj-cat','En katt')],
    'Vilka exempel hjälper en bildapp att se olika katter?':[p('obj-cat','Ett exempel på en kattbild')],
    'En AI anger ett citat ur en bok. Hur kan du kontrollera det?':[p('obj-book','En bok')],
    'Ett AI-test gav 8 rätt av 10. Vad kan du säga säkert?':[COMPUTER],
    'En AI-lösning fungerar sämre för barns röster. Vad behövs?':[p('obj-microphone','En mikrofon')],
  },
  wonder: {
    'Vad hjälper dig minnas vad du såg ute?':[p('course-autumn','Ett landskap att observera')],
    'Hur kan du undersöka om skuggans längd ändras?':[SHADOW],
  },
};

export function photosForQuestion(appId,moduleId,prompt) {
  if(moduleId!=='activity-practice')return [];
  return QUESTION_PHOTOS[appId]?.[prompt] || [];
}
