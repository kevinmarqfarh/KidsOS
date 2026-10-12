// Egenförfattade bygg- och skapandeaktiviteter för KidsOS.
export const WORKSHOP_MODULES = {
  math: [
    {id:'pair-workshop',name:'Parverkstaden',icon:'🧩',minLevel:0,view:'pairs',kind:'numbers',lgr:['ma-tal']},
    {id:'number-workshop',name:'Talverkstaden',icon:'🧱',minLevel:0,view:'numberWorkshop',lgr:['ma-pos']},
    {id:'fraction-kitchen',name:'Bråkköket',icon:'🍽️',minLevel:1,view:'fractionKitchen',lgr:['ma-tal','ma-prop']},
  ],
  svenska: [
    {id:'letter-pairs',name:'Bokstavspar',icon:'🧩',minLevel:0,view:'pairs',kind:'letters',lgr:['sv-ljud','sv-regler']},
    {id:'story-atelier',name:'Berättelseateljén',icon:'🎬',minLevel:0,view:'storyAtelier',lgr:['sv-skriva']},
    {id:'word-scene',name:'Ordscenen',icon:'💬',minLevel:1,view:'wordScene',lgr:['sv-regler']},
  ],
  biology: [{id:'nature-pairs',name:'Naturens par',icon:'🌿',minLevel:0,view:'pairs',kind:'nature',lgr:['no-arter']}],
  world: [{id:'map-journey',name:'Min kartresa',icon:'🧭',minLevel:0,view:'mapJourney',lgr:['so-karta']}],
};
export const STORY_CHOICES = {
  person:['En vän','En robot','En naturdetektiv','En uppfinnare'],
  place:['i parken','vid havet','i skogen','på månen'],
  event:['hittar ett brev','bygger en koja','hjälper en vän','upptäcker en stig'],
};
export const MAP_PLACES = [
  {id:'home',name:'Hemmet',symbol:'🏠',x:0,y:2},
  {id:'park',name:'Parken',symbol:'🌳',x:2,y:2},
  {id:'library',name:'Biblioteket',symbol:'📚',x:2,y:0},
  {id:'pond',name:'Dammen',symbol:'💧',x:4,y:0},
];
export const MAP_MISSIONS = [
  {place:'park',instruction:'Gå två steg österut till parken.'},
  {place:'library',instruction:'Gå två steg norrut till biblioteket.'},
  {place:'pond',instruction:'Gå två steg österut till dammen.'},
];
export function exchangePieces(pieces, direction) {
  const {ones,tens}=pieces;
  if(direction==='bundle' && ones>=10)return {ones:ones-10,tens:tens+1};
  if(direction==='split' && tens>=1)return {ones:ones+10,tens:tens-1};
  return {...pieces};
}
export const pieceValue = pieces => pieces.ones+10*pieces.tens;
export const equivalentFractions = (a,b) => a.n*b.d===b.n*a.d;
export const mapMove = (pos,dx,dy) => ({x:Math.max(0,Math.min(4,pos.x+dx)),y:Math.max(0,Math.min(2,pos.y+dy))});
export function sentenceIsValid(words) {
  if(words.length!==3)return false;
  const [subject,verb,place]=words;
  return ['Katten','Roboten','Fågeln'].includes(subject) && ['vilar','hoppar','leker'].includes(verb) && ['i parken','vid huset','i skogen'].includes(place);
}
