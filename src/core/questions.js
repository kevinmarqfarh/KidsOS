// Variation utan att ändra svårighet eller räkna omkastade alternativ som nya frågor.
const sessions=new Map();
export function questionSession(profileId,appId,moduleId) {
  const key=JSON.stringify([profileId,appId,moduleId]);
  if(!sessions.has(key)){
    if(sessions.size>=200)sessions.delete(sessions.keys().next().value);
    sessions.set(key,{ctx:{},recent:[]});
  }
  return sessions.get(key);
}
export function questionIdentity(q) {
  if(q.questionId)return String(q.questionId);
  // Alternativens ordning och distraktorer är inte själva uppgiften.
  const value=JSON.stringify([q.type,q.prompt,q.say,q.word,q.answer,q.answerOrder,q.target,q.items?.map(i=>[i.id,i.bin,i.label,i.say,i.html]),q.visual]);
  let hash=2166136261;
  for(let i=0;i<value.length;i++)hash=Math.imul(hash^value.charCodeAt(i),16777619);
  return (hash>>>0).toString(36);
}
export function variedQuestion(generate,session,roundSeen=new Set(),attempts=32) {
  let best=null,bestRank=-Infinity;
  for(let i=0;i<attempts;i++){
    const q=generate();if(!q)break;
    const id=questionIdentity(q),last=session.recent.lastIndexOf(id);
    const rank=(roundSeen.has(id)?0:1000)+(last<0?1000:session.recent.length-last);
    if(rank>bestRank){best=q;bestRank=rank;}
    if(!roundSeen.has(id)&&last<0)break;
  }
  if(best && roundSeen.has(questionIdentity(best)))return null;
  if(best){const id=questionIdentity(best);roundSeen.add(id);session.recent.push(id);if(session.recent.length>32)session.recent.shift();}
  return best;
}
export function deckPick(pool,rng,ctx,key,identity=item=>item[1],preferred=null) {
  if(!pool.length)return null;
  const signature=JSON.stringify(pool.map(identity));
  const decks=ctx.questionDecks||(ctx.questionDecks={});
  let deck=decks[key];
  if(!deck||deck.signature!==signature)deck=decks[key]={signature,remaining:[],last:null};
  if(!deck.remaining.length){
    deck.remaining=rng.shuffle(pool.map((_,i)=>i));
    if(pool.length>1&&identity(pool[deck.remaining[0]])===deck.last){const first=deck.remaining.shift();deck.remaining.push(first);}
  }
  const preferredIndex=preferred?deck.remaining.findIndex(i=>preferred(pool[i])):-1;
  const [index]=deck.remaining.splice(preferredIndex<0?0:preferredIndex,1);
  const row=pool[index];deck.last=identity(row);return row;
}
