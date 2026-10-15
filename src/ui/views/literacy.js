import { h, onTap } from '../dom.js';
import { workshop } from './workshops.js';
import { learningPhoto } from '../learning-photo.js';
import { FACT_TEXTS, STORY_TEXTS, PICTURE_PROMPTS, readingQuestions } from '../../apps/literacy-bank.js';
import { hasInSet } from '../../core/model.js';
import { loadJSON, saveJSON } from '../../core/storage.js';

const btn=(text,key,fn,attrs={})=>onTap(h('button.workshop-button',{type:'button',dataset:{key},...attrs},text),fn,{guardMs:100});
const field=(label,input)=>h('label.workshop-field',h('span',label),input);
const REVIEW=['Min text har en rubrik.','Jag har skrivit meningar med stor bokstav och punkt.','Jag har läst eller lyssnat och ändrat något om det behövdes.'];
function notebook(kos) {
  const key=`literacy.${kos.profile.id}`;
  const stored=loadJSON(key,{});
  const notes=stored&&typeof stored==='object'&&!Array.isArray(stored)?stored:{};
  return { get(id){if(!notes[id]||typeof notes[id]!=='object'||Array.isArray(notes[id]))notes[id]={};return notes[id];}, save(){return saveJSON(key,notes);} };
}
function editor(work,book,id,fields,ui,kos,checklist=REVIEW) {
  const draft=book.get(id);
  for(const [key,label,placeholder] of fields){
    const input=h('textarea',{rows:key==='text'?'7':'3',maxlength:'6000',placeholder,'aria-label':label});
    input.value=typeof draft[key]==='string'?draft[key]:'';
    input.addEventListener('input',()=>{draft[key]=input.value;book.save();});
    work.append(field(label,input));
  }
  const review=h('fieldset.literacy-review',h('legend','Titta igenom din text när du vill'));
  checklist.forEach((label,i)=>{
    const input=h('input',{type:'checkbox',checked:!!draft[`review${i}`]});
    input.addEventListener('change',()=>{draft[`review${i}`]=input.checked;book.save();});
    review.append(field(label,input));
  });
  work.append(review,btn('Spara min text','save-writing',()=>{if(kos.paused)return;ui.announce(book.save()?'Din text är sparad på den här enheten.':'Texten finns kvar i sessionen. Lagringen kunde inte sparas permanent.');}),
    btn('Lyssna på min text','read-writing',()=>kos.read(fields.map(([key])=>draft[key]||'').filter(Boolean).join('. '))),
    h('p.muted','Din egen text får inget automatiskt betyg. Berätta, peka eller skriv själv eller tillsammans med en vuxen. Du kan gå tillbaka och ändra.'));
}

export function pictureStoryView(el,ctx) {
  el.classList.add('literacy-activity');
  const book=notebook(ctx.kos);let selected=0;
  return workshop(el,ctx,'Bild till berättelse','Välj en bild. Beskriv något du ser och hitta sedan på en egen berättelse. Du kan också berätta högt.',(work,ui)=>{
    const item=PICTURE_PROMPTS[selected];
    const select=h('select',{'aria-label':'Välj bild till din berättelse',dataset:{key:'picture-select'}});
    PICTURE_PROMPTS.forEach((p,i)=>select.append(h('option',{value:i,selected:i===selected},p.title)));
    select.addEventListener('change',()=>{ctx.kos.stopSpeaking();selected=Number(select.value);ui.draw();ui.announce(`Vald bild: ${PICTURE_PROMPTS[selected].title}. Din tidigare text är kvar.`);});
    const source=h('section.literacy-source',{'aria-label':'Bild och berättelseuppgift'},field('Välj en av 24 bilder',select),learningPhoto(item),h('p.literacy-task',item.prompt),
      btn('Läs berättelsefrågan','read-prompt',()=>ctx.kos.read(item.prompt)),
      h('details.literacy-guidance',h('summary','Om bilden och din fantasi'),h('p','Bilden ger ledtrådar. Du får hitta på vem som är med, vad någon känner och vad som händer. Det är din fantasi, inte fakta om bilden.')));
    const writing=h('section.literacy-response',{'aria-label':'Min berättelse'});
    work.classList.add('literacy-layout');
    work.append(source,writing);
    const fields=ctx.level<=1?[
      ['observe','Vad ser jag?','Ett ord, en mening eller något du kan peka på.'],
      ['text','Min berättelse','Det var en gång … Sedan … Till slut …'],
    ]:[
      ['observe','Vad ser jag i bilden?','Beskriv synliga detaljer. Skilj dem från det du hittar på.'],
      ['title','Min rubrik','Vad ska din berättelse heta?'],
      ['begin','Början: vem, var och när?','Presentera huvudpersonen och platsen.'],
      ['event','Händelsen: vad händer och varför?','Vad vill huvudpersonen? Vad förändras? Använd sedan, men, därför eller eftersom.'],
      ['end','Slutet: hur går det?','Hur löser sig händelsen? Du väljer slutet.'],
      ['text','Min färdiga berättelse','Sätt ihop dina idéer här och lägg till egna detaljer.'],
    ];
    editor(writing,book,item.id,fields,ui,ctx.kos,ctx.level<=1?['Jag har berättat något om bilden.','Jag har hittat på något som händer.']:[...REVIEW,'Min berättelse har början, händelse och slut.']);
  });
}

export function readingWorkshopView(el,ctx) {
  el.classList.add('literacy-activity');
  const items=(ctx.module.kind==='story'?STORY_TEXTS:FACT_TEXTS).filter(item=>ctx.kos.profile.settings.showAllModules || (item.minLevel||0)<=ctx.level);
  const book=notebook(ctx.kos);let short=ctx.level<=1,index=0,choice=null,checked=false,showEvidence=false,ownAnswer=false;
  const readingPositions=new Map();
  const completed=item=>readingQuestions(item,short).every((_,i)=>hasInSet(ctx.kos.profile,`workshops:${ctx.module.id}`,`${item.id}:${short&&!item.minLevel?'short':'full'}:${i}`));
  let selected=Math.max(0,items.findIndex(item=>!completed(item)));
  const reset=()=>{index=0;choice=null;checked=false;showEvidence=false;};
  return workshop(el,ctx,ctx.module.name,'Välj en text. Läs eller lyssna. Texten ligger kvar när du svarar. Du väljer själv när du går vidare.',(work,ui)=>{
    const item=items[selected],compact=short&&!item.minLevel,questions=readingQuestions(item,compact),q=questions[index],draft=book.get(`${item.id}:${compact?'short':'full'}`);
    work.classList.add('literacy-reading');
    work.append(h('p.literacy-completion',`${items.filter(completed).length} av ${items.length} texter har alla valfrågor klara i den valda versionen. Egna svar får inget automatiskt betyg.`));
    const select=h('select',{'aria-label':'Välj text',dataset:{key:'text-select'}});
    items.forEach((p,i)=>select.append(h('option',{value:i,selected:i===selected},p.title)));
    select.addEventListener('change',()=>{ctx.kos.stopSpeaking();selected=Number(select.value);reset();ui.draw();ui.announce(`Vald text: ${items[selected].title}.`);});
    const source=h('section.literacy-source',{'aria-label':'Text att läsa',tabindex:'0'});
    const readingKey=`${item.id}:${compact?'short':'full'}`;
    source.addEventListener('scroll',()=>readingPositions.set(readingKey,source.scrollTop));
    const response=h('section.literacy-response',{'aria-label':'Frågor och egen text'});
    const layout=h('div.literacy-layout',source,response);
    work.append(h('div.workshop-tools',field('Välj text',select),!item.minLevel?btn(short?'Byt till längre text':'Byt till kort text','text-length',()=>{ctx.kos.stopSpeaking();short=!short;reset();ui.draw();ui.announce(short?'Kort text med en fråga.':'Längre text med tre frågor.');}):h('span','Fördjupning: läs, tolka och förklara')),layout);
    source.append(h('article.literacy-passage',h('h3',item.title),h('p',compact?item.short:item.text)),
      btn('Lyssna på texten','read-passage',()=>ctx.kos.read(compact?item.short:item.text)),
      h('p.muted','Du kan lyssna när du övar. Läs själv om du vill träna på att läsa utan uppläsning.'));
    source.scrollTop=readingPositions.get(readingKey)||0;
    response.append(h('h3',`Fråga ${index+1} av ${questions.length}`),h('p',q.prompt),btn('Lyssna på frågan','read-question',()=>ctx.kos.read(q.prompt)),
      btn(ownAnswer?'Välj bland svar':'Svara med egna ord','answer-mode',()=>{ownAnswer=!ownAnswer;choice=null;checked=false;showEvidence=false;ui.draw();}));
    if(ownAnswer){
      const input=h('textarea',{rows:'3',maxlength:'2000','aria-label':q.prompt,dataset:{key:'own-answer'}});input.value=draft[`answer${index}`]||'';
      input.addEventListener('input',()=>{draft[`answer${index}`]=input.value;book.save();});response.append(field('Mitt svar',input),btn('Visa ett exempelsvar','model-answer',()=>{showEvidence=true;ui.draw();}));
    }else{
      // Stable placement while the child reads and tries again; not always answer first.
      const options=[q.answer,...q.wrong];const offset=(selected+index+1)%options.length;
      response.append(h('div.workshop-tools',...options.map((_,i)=>options[(i+offset)%options.length]).map(answer=>btn(answer,`answer-${options.indexOf(answer)}`,()=>{if(ctx.kos.paused)return;choice=answer;checked=false;ui.draw();},{'aria-pressed':String(choice===answer)}))),
        btn('Kontrollera svaret','check',()=>{if(ctx.kos.paused)return;checked=true;ui.draw();if(choice===q.answer)ui.finish(`${item.id}:${compact?'short':'full'}:${index}`,`Det stämmer. ${q.evidence}`);else ui.announce('Prova igen. Läs texten eller välj Visa ledtråden.');},{disabled:choice===null}),
        checked?h('p',choice===q.answer?'Det stämmer.':'Prova igen. Titta i texten som finns kvar.'):null);
    }
    response.append(btn(showEvidence?'Dölj ledtråden':'Visa ledtråden','evidence',()=>{showEvidence=!showEvidence;ui.draw();},{'aria-expanded':String(showEvidence)}));
    if(showEvidence)response.append(h('aside.literacy-evidence',h('h4',ownAnswer?'Ett exempelsvar':'Här finns stöd i texten'),ownAnswer?h('p',q.answer):null,h('p',q.evidence),ownAnswer?h('p','Jämför med ditt svar. Samma innehåll kan uttryckas med andra ord. En vuxen kan hjälpa dig att resonera.'):null));
    response.append(h('div.workshop-tools',btn('Föregående fråga','previous-question',()=>{index--;choice=null;checked=false;showEvidence=false;ui.draw();ui.announce(questions[index].prompt);},{disabled:index===0}),btn('Nästa fråga','next-question',()=>{index++;choice=null;checked=false;showEvidence=false;ui.draw();ui.announce(questions[index].prompt);},{disabled:index===questions.length-1})),
      h('h3',item.kind==='fact'?'Skriv om det du lärde dig':'Berätta vidare'),h('p',item.write));
    editor(response,book,`${item.id}:writing`,[['title','Min rubrik','En rubrik som passar innehållet.'],['notes',item.kind==='fact'?'Mina stödord och fakta':'Början, händelse och slut','Skriv korta stödord eller berätta för en vuxen.'],['text','Min egen text','Skriv med egna ord.']],ui,ctx.kos,item.kind==='fact'?[...REVIEW,'Mina fakta går att hitta i texten.','Jag skiljer fakta från egna påhitt.']:REVIEW);
    response.append(btn('Nästa text','next-text',()=>{ctx.kos.stopSpeaking();selected=(selected+1)%items.length;reset();ui.draw();ui.announce(`Nästa text: ${items[selected].title}.`);}));
  });
}
