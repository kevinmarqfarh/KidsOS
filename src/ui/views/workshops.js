import { photoImage, photoCredits } from '../photos.js';
import { studioCharacterSvg, studioItemSvg } from '../studio-art.js';
import { h, clear, onTap } from '../dom.js';
import { createRng } from '../../core/rng.js';
import { loadJSON, saveJSON, loadDrawings } from '../../core/storage.js';
import { STORY_CHOICES, MAP_PLACES, MAP_MISSIONS, exchangePieces, pieceValue, equivalentFractions, sentenceIsValid, mapMove } from '../../apps/workshops.js';

const button = (text,fn,key,attrs={}) => onTap(h('button.workshop-button',{type:'button',dataset:{key},...attrs},text),fn,{guardMs:100});
const field = (text,control) => h('label.workshop-field',h('span',text),control);
const status = () => h('p.workshop-status',{role:'status','aria-live':'polite','aria-atomic':'true'});

function workshop(el,ctx,title,instruction,body) {
  let alive=true;
  const root=h('section.workshop',{ 'aria-label':title });
  const work=h('div.workshop-work');
  const message=status();
  const announce=text=>{if(alive)message.textContent=text;};
  const draw=()=>{
    if(!alive)return;
    const focused=document.activeElement?.closest?.('[data-key]')?.dataset.key;
    clear(work);body(work,ui);
    if(focused){
      const replacement=[...work.querySelectorAll('[data-key]')].find(n=>n.dataset.key===focused);
      if(replacement && !replacement.disabled)replacement.focus({preventScroll:true});
      else {
        const next=work.querySelector('.workshop-pairs button:not([disabled])') || work.querySelector('[data-key="check"]:not([disabled])') || work.querySelector('[data-key="restart"]');
        if(next)next.focus({preventScroll:true});
        else { message.setAttribute('tabindex','-1'); message.focus({preventScroll:true}); }
      }
    }
  };
  const ui={draw,announce,finish(key,text){
    if(!alive||ctx.kos.paused)return;
    const result=ctx.kos.reward({app:ctx.app.id,set:`workshops:${ctx.module.id}`,item:key,silent:true});
    if(result.isNew)ctx.kos.reward({stars:1,silent:true});
    ctx.kos.saveNow();announce(text);
  }};
  root.append(h('header.workshop-head',h('p.workshop-kicker','UTFORSKA · BYGG · UPPTÄCK'),h('h2',title),h('p',instruction),
    button('Läs instruktionen',()=>ctx.kos.read(instruction),'read-instruction')),work,message);
  el.append(root);
  if(ctx.kos.profile.settings.previewRounds){
    work.append(h('div.workshop-plan',h('h3','Så går det till'),h('p',instruction),h('p','Du väljer själv när du fortsätter. Hjälp och paus finns ovanför.'),button('Starta aktiviteten',draw,'start')));
  } else draw();
  return ()=>{alive=false;};
}

export function pairsView(el,ctx) {
  const kind=ctx.module.kind;
  let count=ctx.level===0?2:4,visible=true,chosen=[],matched=new Set(),cards=[];
  const make=()=>{
    const bank=kind==='letters'?[['A','a'],['M','m'],['S','s'],['O','o'],['L','l'],['Å','å']]:kind==='nature'?[['rav','Räv'],['ekorre','Ekorre'],['igelkott','Igelkott'],['uggla','Uggla'],['nyckelpiga','Nyckelpiga'],['ek','Ek']]:[1,2,3,4,5,6].map(n=>[String(n),'● '.repeat(n).trim()]);
    cards=createRng(730+count).shuffle(bank.slice(0,count).flatMap(([a,b],pair)=>[{id:`${pair}-a`,pair,text:kind==='nature'?`Bild av ${b.toLowerCase()}`:a,photo:kind==='nature'?a:null},{id:`${pair}-b`,pair,text:b,label:kind==='numbers'?`${pair+1} prickar`:b}]));
    chosen=[];matched=new Set();
  };
  make();
  return workshop(el,ctx,ctx.module.name,'Välj två kort som hör ihop. Du kan visa alla kort och prova igen utan tidspress.',(work,ui)=>{
    const size=h('select',{'aria-label':'Antal par'});[2,4,6].forEach(n=>size.append(h('option',{value:n,selected:n===count},`${n} par`)));
    size.addEventListener('change',()=>{count=Number(size.value);make();ui.announce('Ny uppsättning. Alla kort ligger stilla tills du väljer nya.');ui.draw();});
    work.append(h('div.workshop-tools',field('Antal par',size),button(visible?'Dölj omatchade kort':'Visa alla kort',()=>{visible=!visible;ui.draw();},'visibility',{'aria-pressed':String(visible)}),button('Börja om med samma kort',()=>{make();ui.draw();ui.announce('Samma kort, samma platser.');},'restart')),
      h('p',`${matched.size} av ${count} par hittade`));
    const mismatch=chosen.length===2 && cards.find(c=>c.id===chosen[0]).pair!==cards.find(c=>c.id===chosen[1]).pair;
    const grid=h('div.workshop-pairs');
    cards.forEach((card,i)=>{
      const found=matched.has(card.pair),open=visible||found||chosen.includes(card.id);
      const name=open?`Kort ${i+1}: ${card.label||card.text}${found?', par hittat':''}`:`Kort ${i+1}, dolt`;
      grid.append(button(open?(card.photo?h('span',{'aria-hidden':'true',html:photoImage(card.photo,'',true)}):card.text):'?',()=>{
        if(ctx.kos.paused||found||mismatch||chosen.includes(card.id))return;
        chosen.push(card.id);
        if(chosen.length===2){
          const first=cards.find(c=>c.id===chosen[0]);
          if(first.pair===card.pair){matched.add(card.pair);chosen=[];ui.announce('De här korten hör ihop.');if(matched.size===count)ui.finish(`${kind}-${count}`,'Alla par hittade! Du kan börja om med samma kort.');}
          else ui.announce('De här korten är olika. Välj Prova igen när du vill.');
        }
        ui.draw();
      },card.id,{'aria-label':name,'aria-pressed':String(chosen.includes(card.id)),disabled:found,class:found?'is-matched':''}));
    });
    if(kind==='nature')work.append(h('div',{html:photoCredits()}));
    work.append(grid,mismatch?button('Prova igen',()=>{chosen=[];ui.draw();ui.announce('Välj två kort.');},'retry'):null,
      chosen.length===1?button('Avmarkera kortet',()=>{chosen=[];ui.draw();},'unselect'):null);
  });
}

export function numberWorkshopView(el,ctx) {
  let pieces={ones:0,tens:0},target=ctx.level===0?5:12;
  return workshop(el,ctx,'Talverkstaden','Bygg måltalet. Tio ental kan växlas till ett tiotal. Talets värde är samma efter växlingen.',(work,ui)=>{
    const targets=ctx.level===0?[3,5,8]:[12,25,31,46];
    work.append(h('div.workshop-tools',...targets.map(n=>button(`Bygg ${n}`,()=>{target=n;pieces={ones:0,tens:0};ui.draw();ui.announce(`Nu bygger vi ${n}.`);},`target-${n}`,{'aria-pressed':String(n===target)}))));
    work.append(h('div.workshop-value',h('span',`Mål: ${target}`),h('strong',String(pieceValue(pieces))),h('small',`${pieces.tens} tiotal + ${pieces.ones} ental`)));
    const bits=h('div.workshop-pieces',{'aria-label':`${pieces.tens} tiotal och ${pieces.ones} ental`,role:'img'});
    bits.append(h('div',h('b','Tiotal'),h('div.piece-row',Array.from({length:pieces.tens},()=>h('span.ten-piece',{'aria-hidden':'true'},'10')))),h('div',h('b','Ental'),h('div.piece-row',Array.from({length:pieces.ones},()=>h('span.one-piece',{'aria-hidden':'true'},'1')))));
    const adjust=(type,delta)=>{pieces[type]+=delta;ui.draw();ui.announce(`Nu har du ${pieceValue(pieces)}.`);};
    work.append(bits,h('div.workshop-tools',button('+1 ental',()=>adjust('ones',1),'add-one',{disabled:pieceValue(pieces)>=99}),button('−1 ental',()=>adjust('ones',-1),'remove-one',{disabled:!pieces.ones}),button('+1 tiotal',()=>adjust('tens',1),'add-ten',{disabled:pieceValue(pieces)>89}),button('−1 tiotal',()=>adjust('tens',-1),'remove-ten',{disabled:!pieces.tens})),
      h('div.workshop-tools',button('Växla 10 ental till 1 tiotal',()=>{pieces=exchangePieces(pieces,'bundle');ui.draw();ui.announce('Värdet är samma. Tio ental blev ett tiotal.');},'bundle',{disabled:pieces.ones<10}),button('Växla 1 tiotal till 10 ental',()=>{pieces=exchangePieces(pieces,'split');ui.draw();ui.announce('Värdet är samma. Ett tiotal blev tio ental.');},'split',{disabled:!pieces.tens})),
      button('Kontrollera mitt tal',()=>pieceValue(pieces)===target?ui.finish(String(target),`Du byggde ${target}! Visa gärna en annan uppdelning av samma tal.`):ui.announce(`Du har ${pieceValue(pieces)}. Målet är ${target}. Lägg till eller ta bort delar.`),'check'));
  });
}

export function fractionKitchenView(el,ctx) {
  let denominator=2,filled=new Set(),target={n:1,d:2};
  return workshop(el,ctx,'Bråkköket','Alla delar av portionen är lika stora. Välj delar och jämför din portion med målet.',(work,ui)=>{
    work.append(h('div.workshop-tools',...[[1,2],[1,4],[3,4]].map(([n,d])=>button(`Mål ${n}/${d}`,()=>{target={n,d};filled.clear();ui.draw();},`target-${n}-${d}`,{'aria-pressed':String(target.n===n&&target.d===d)}))));
    const select=h('select',{'aria-label':'Antal lika stora delar'});[2,4,8].forEach(d=>select.append(h('option',{value:d,selected:d===denominator},`${d} lika delar`)));
    select.addEventListener('change',()=>{denominator=Number(select.value);filled.clear();ui.draw();ui.announce('Ny indelning. Välj dina delar igen.');});
    const tray=h('div.fraction-tray',{style:{'--parts':Math.min(4,denominator)},'aria-label':'En hel portion uppdelad i lika stora delar'});
    for(let i=0;i<denominator;i++)tray.append(button(filled.has(i)?'Vald':'Välj',()=>{filled.has(i)?filled.delete(i):filled.add(i);ui.draw();ui.announce(`${filled.size} av ${denominator} lika delar valda.`);},`part-${i}`,{'aria-label':`Del ${i+1} av ${denominator}`,'aria-pressed':String(filled.has(i)),class:filled.has(i)?'is-filled':''}));
    work.append(field('Dela den hela portionen',select),h('p.workshop-goal',`Mål: ${target.n}/${target.d}. Din portion: ${filled.size}/${denominator}`),tray,
      button('Jämför med målet',()=>equivalentFractions({n:filled.size,d:denominator},target)?ui.finish(`${target.n}/${target.d}`,`${filled.size}/${denominator} är lika mycket som ${target.n}/${target.d} av samma hela portion.`):ui.announce('Portionerna är olika stora. Välj fler eller färre delar och prova igen.'),'check'),button('Töm min portion',()=>{filled.clear();ui.draw();},'clear'));
  });
}

export function storyAtelierView(el,ctx) {
  const key=`story.${ctx.kos.profile.id}`;
  const saved=loadJSON(key,null);
  let scene=0,showGallery=false;
  const drawings=loadDrawings(ctx.kos.profile.id);
  const scenes=Array.from({length:3},(_,i)=>({person:STORY_CHOICES.person.includes(saved?.[i]?.person)?saved[i].person:STORY_CHOICES.person[i],place:STORY_CHOICES.place.includes(saved?.[i]?.place)?saved[i].place:STORY_CHOICES.place[i],event:STORY_CHOICES.event.includes(saved?.[i]?.event)?saved[i].event:STORY_CHOICES.event[i],drawing:drawings.some(d=>d.id===saved?.[i]?.drawing)?saved[i].drawing:null,text:typeof saved?.[i]?.text==='string'?saved[i].text.slice(0,1000):''}));
  const persist=()=>saveJSON(key,scenes);
  return workshop(el,ctx,'Berättelseateljén','Skapa början, fortsättningen och slutet. Välj bildidéer och skriv eller berätta tillsammans med någon. Det finns många möjliga berättelser.',(work,ui)=>{
    work.append(h('nav.workshop-tools',{'aria-label':'Berättelsens delar'},...['Början','Sedan','Slutet'].map((name,i)=>button(`${i+1}. ${name}`,()=>{scene=i;ui.draw();},`scene-${i}`,{'aria-pressed':String(scene===i)}))));
    const current=scenes[scene];
    for(const [kind,label] of [['person','Vem?'],['place','Var?'],['event','Vad händer?']]){
      work.append(h('fieldset.workshop-choice',h('legend',label),...STORY_CHOICES[kind].map(value=>button(value,()=>{current[kind]=value;persist();ui.draw();},`${kind}-${value}`,{'aria-pressed':String(current[kind]===value)}))));
    }
    const drawing=drawings.find(d=>d.id===current.drawing);
    work.append(button(showGallery?'Stäng bildval':'Välj en egen teckning',()=>{showGallery=!showGallery;ui.draw();},'gallery',{'aria-expanded':String(showGallery)}));
    if(showGallery){
      const gallery=h('div.workshop-gallery');
      drawings.forEach((d,i)=>gallery.append(button(h('img',{src:d.data,alt:`Min teckning ${i+1}`}),()=>{current.drawing=d.id;persist();showGallery=false;ui.draw();},`drawing-${i}`,{'aria-label':`Använd min teckning ${i+1}`})));
      work.append(drawings.length?gallery:h('p','Du har inga sparade teckningar ännu. Rita och spara en bild i Rita, och kom sedan tillbaka.'));
    }
    if(drawing)work.append(h('img.story-drawing',{src:drawing.data,alt:'Din valda teckning till den här berättelsedelen'}),button('Ta bort teckningen från den här delen',()=>{current.drawing=null;persist();ui.draw();},'remove-drawing'));
    const suggestion=`${current.person} ${current.place} ${current.event}.`;
    work.append(h('article.story-scene',h('span.scene-number',{'aria-hidden':'true'},String(scene+1)),h('div.atelier-illustration',{'aria-hidden':'true',html:current.person==='En robot'?studioItemSvg({kind:'robot',color:'#77bdb5'}):studioCharacterSvg({name:current.person,skin:'#f0c9a4',hair:'short',hairColor:'#49352a',shirt:'#77bdb5',pants:'#626ca8',expression:'calm'})}),h('p',suggestion)));
    const text=h('textarea',{rows:'4',maxlength:'1000','aria-label':`Din text till del ${scene+1}`,placeholder:'Skriv här om du vill. Du kan också berätta utan att skriva.'});text.value=current.text;
    text.addEventListener('input',()=>{current.text=text.value;persist();});
    work.append(field('Min egen berättelse',text),button('Läs den här delen',()=>ctx.kos.read(current.text||suggestion),'read-scene'),button('Spara min berättelse',()=>{const ok=persist();ui.announce(ok?'Berättelsen är sparad på den här enheten.':'Berättelsen finns kvar i den här sessionen. Lagringen kunde inte sparas permanent.');},'save'),
      button('Läs hela berättelsen',()=>ctx.kos.read(scenes.map(s=>s.text||`${s.person} ${s.place} ${s.event}.`).join(' ')),'read-all'),
      h('p.muted','Du kan lägga till dina egna teckningar i Rita och leka berättelsen i Skaparstudion.'));
  });
}

// Drag är ett frivilligt alternativ. En enda pekare äger draget; avbrott gör ingen ändring.
function dragWord(node,enabled,place,kos) {
  let start=null,suppressUntil=0;
  node.classList.toggle('can-drag',enabled);
  node.addEventListener('click',event=>{if(performance.now()<suppressUntil){event.preventDefault();event.stopImmediatePropagation();}},true);
  node.addEventListener('pointerdown',event=>{
    if(!enabled||kos.paused||event.isPrimary===false||start||event.button>0)return;
    start={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};node.setPointerCapture?.(event.pointerId);
  });
  node.addEventListener('pointermove',event=>{
    if(!start||event.pointerId!==start.id)return;
    if(Math.hypot(event.clientX-start.x,event.clientY-start.y)>8){start.moved=true;node.classList.add('is-dragging');}
  });
  const end=event=>{
    if(!start||event.pointerId!==start.id)return;
    const moved=start.moved;start=null;node.classList.remove('is-dragging');
    if(moved){suppressUntil=performance.now()+400;event.preventDefault();if(event.type==='pointerup'&&!kos.paused){const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-word-drop]');if(target && target.closest('.workshop')===node.closest('.workshop'))place();}}
  };
  node.addEventListener('pointerup',end);node.addEventListener('pointercancel',end);
  node.addEventListener('lostpointercapture',()=>{start=null;node.classList.remove('is-dragging');});
}

export function wordSceneView(el,ctx) {
  let words=[],drag=false;
  const options=['Katten','Roboten','Fågeln','vilar','hoppar','leker','i parken','vid huset','i skogen'];
  return workshop(el,ctx,'Ordscenen','Bygg en mening med vem, vad som händer och var. Tryck på orden i ordning. Dra är ett valfritt sätt att lägga till ord.',(work,ui)=>{
    const mode=h('input',{type:'checkbox',checked:drag});mode.addEventListener('change',()=>{drag=mode.checked;ui.draw();});work.append(field('Tillåt drag med finger eller touchpenna',mode));
    const bank=h('div.workshop-tools',{'aria-label':'Ord att välja'});
    options.forEach(word=>{
      const add=()=>{if(ctx.kos.paused||words.length>=3)return;words.push(word);ui.draw();ui.announce(`${words.join(' ')}. ${words.length} av 3 delar.`);};
      const node=h('button.workshop-button',{type:'button',dataset:{key:`word-${word}`},disabled:words.length>=3},word);
      dragWord(node,drag,add,ctx.kos);onTap(node,add,{guardMs:100});bank.append(node);
    });
    const slots=h('div.word-scene-slots',{dataset:{wordDrop:'true'},'aria-label':'Din mening'});
    for(let i=0;i<3;i++)slots.append(words[i]?button(words[i],()=>{words.splice(i,1);ui.draw();ui.announce('Ordet togs bort.');},`slot-${i}`,{'aria-label':`Ta bort ${words[i]} från plats ${i+1}`}):h('span.word-slot',`${i+1}. ${['Vem?','Gör vad?','Var?'][i]}`));
    work.append(bank,slots,h('p',words.length?`${words.join(' ')}${words.length===3?'.':''}`:'Din mening visas här.'),button('Kontrollera meningen',()=>{
      if(sentenceIsValid(words))ui.finish(words.join('|'),'Meningen fungerar: någon gör något på en plats. Prova gärna en annan mening.');
      else ui.announce('Prova ett namn först, sedan vad som händer och sist en plats. Du kan trycka på ett valt ord för att ta bort det.');
    },'check'),button('Läs min mening',()=>ctx.kos.read(words.join(' ')),'read',{disabled:!words.length}),button('Börja om',()=>{words=[];ui.draw();},'clear'));
    if(sentenceIsValid(words))work.append(h('article.story-scene',h('span.scene-character',{'aria-hidden':'true'},words[0]==='Katten'?'🐱':words[0]==='Roboten'?'🤖':'🐦'),h('strong',words[0]),h('p',`${words[1]} ${words[2]}.`),h('p.muted','Lek eller rita det som meningen berättar.')));
  });
}

export function mapJourneyView(el,ctx) {
  let pos={x:0,y:2},mission=0;
  return workshop(el,ctx,'Min kartresa','Följ ledtråden med riktningsknapparna eller tryck på en angränsande ruta. Norr är uppåt på den här kartan.',(work,ui)=>{
    const current=MAP_MISSIONS[mission];
    work.append(h('p.workshop-goal',mission<MAP_MISSIONS.length?`Nu: uppdrag ${mission+1} av 3. ${current.instruction}`:'Alla tre platser hittade. Du kan utforska kartan eller börja om.'));
    const move=(dx,dy)=>{if(ctx.kos.paused)return;pos=mapMove(pos,dx,dy);ui.draw();ui.announce(`Kolumn ${pos.x+1}, rad ${pos.y+1}.`);};
    const grid=h('div.journey-map',{'aria-label':'Karta med fem kolumner och tre rader'});
    for(let y=0;y<3;y++)for(let x=0;x<5;x++){
      const place=MAP_PLACES.find(p=>p.x===x&&p.y===y),here=pos.x===x&&pos.y===y,adjacent=Math.abs(pos.x-x)+Math.abs(pos.y-y)===1;
      grid.append(button(here?'Här':place?.symbol||'·',()=>{if(adjacent)move(x-pos.x,y-pos.y);},`cell-${x}-${y}`,{'aria-label':`${place?.name||'Stig'}, kolumn ${x+1}, rad ${y+1}${here?', du är här':''}`,disabled:!adjacent&&!here,'aria-current':here?'location':null,class:here?'is-here':''}));
    }
    work.append(grid,h('div.map-legend',...MAP_PLACES.map(p=>h('span',`${p.symbol} ${p.name}`))),h('div.workshop-tools',button('↑ Norr',()=>move(0,-1),'north',{disabled:pos.y===0}),button('← Väster',()=>move(-1,0),'west',{disabled:pos.x===0}),button('Öster →',()=>move(1,0),'east',{disabled:pos.x===4}),button('↓ Söder',()=>move(0,1),'south',{disabled:pos.y===2})),
      button('Jag är framme',()=>{
        if(!current)return;
        const target=MAP_PLACES.find(p=>p.id===current.place);
        if(pos.x===target.x&&pos.y===target.y){mission++;ui.draw();ui.finish(current.place,`Du hittade ${target.name}! ${mission===3?'Resan är klar.':'Nästa ledtråd visas ovanför.'}`);}
        else ui.announce('Du är på en annan plats. Läs ledtråden och titta på kartans symboler.');
      },'check',{disabled:!current}),button('Börja om från hemmet',()=>{mission=0;pos={x:0,y:2};ui.draw();ui.announce('Samma resa börjar vid hemmet.');},'restart'));
  });
}
