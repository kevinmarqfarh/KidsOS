// Original vector props for the dollhouse studio. No external image assets.
const palette = ['#f5a6a8','#87c8bd','#b8a5df','#edc07e','#91badc'];
export function studioItemSvg(item = {}) {
 const c = /^#[0-9a-f]{3,8}$/i.test(item.color || '') ? item.color : palette[(String(item.id||'').length)%palette.length];
 const kind = item.shape || item.kind || item.type || 'art';
 const rect=(x,y,w,h,fill=c,r=6)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
 const legs=`${rect(20,83,6,12,'#8b6250',2)}${rect(94,83,6,12,'#8b6250',2)}`;
 const shapes={
 sofa: `${rect(13,32,94,53)}${rect(22,40,36,28,'#ffe2dc')}${rect(62,40,36,28,'#ffe2dc')}${rect(8,53,17,33)}${rect(95,53,17,33)}${rect(24,70,71,15)}${legs}`,
 bed: `${rect(12,25,16,62,'#b98968')}${rect(25,52,84,34)}${rect(29,46,26,17,'#fff4df')}${rect(58,48,50,36)}<path d="M63 52v26m12-26v26m12-26v26" stroke="#ffffff" opacity=".5"/>${legs}`,
 table: `${rect(10,45,100,14,'#dcaa76')}${rect(20,59,8,35,'#b98968',2)}${rect(91,59,8,35,'#b98968',2)}`,
 lamp: `<path d="M38 15h44l12 35H26Z" fill="${c}"/>${rect(57,50,6,36,'#9a725b',2)}<ellipse cx="60" cy="88" rx="25" ry="6" fill="#bd977a"/><path d="M84 51v15"/><circle cx="84" cy="68" r="3" fill="#edc07e"/>`,
 shelf: `${rect(15,9,90,85,'#b98968')}${rect(23,16,74,31,'#fff2d8',1)}${rect(23,54,74,32,'#fff2d8',1)}${[0,1,2,3].map((n)=>rect(29+n*12,23+n%2*4,9,23-n%2*4,palette[n],1)).join('')}<circle cx="78" cy="70" r="10" fill="${c}"/>${rect(29,64,15,21,'#87c8bd',2)}`,
 plant: `<path d="M60 65V24m0 24Q23 50 28 23q30-4 32 25m0 10q37-2 33-28Q64 28 60 58" fill="#82b890"/><path d="M38 63h44l-8 29H46Z" fill="${c}"/>`,
 rug: `<ellipse cx="60" cy="71" rx="55" ry="24" fill="${c}"/><ellipse cx="60" cy="71" rx="43" ry="15" fill="#ffefd9"/><path d="M25 71h70m-57-8 5 15m32-15-5 15" stroke="${c}"/>`,
 computer: `${rect(18,17,84,53,'#657d91')}${rect(24,23,72,40,'#d1f1ec',2)}<path d="M41 36l-8 7 8 7m38-14 8 7-8 7m-14-18-8 24" stroke="#598bb0" fill="none"/>${rect(56,70,8,12,'#657d91',1)}${rect(35,82,50,6,'#657d91',2)}${rect(15,91,90,6,'#a4bbcb',2)}`,
 telescope: `<path d="M60 52L30 95m30-43 30 43m-30-43v43" fill="none"/><g transform="rotate(-25 60 40)">${rect(24,24,65,26)}${rect(83,20,12,34,'#6b7d93',3)}${rect(18,30,9,14,'#6b7d93',2)}</g>`,
 art: `${rect(20,9,80,79,'#c19571',3)}${rect(27,16,66,65,'#f7ecd8',1)}<circle cx="72" cy="34" r="10" fill="#edc07e"/><path d="M29 76l24-32 17 22 12-15 9 25Z" fill="${c}"/>`,
 cushion: `${rect(24,28,72,60)}<path d="M34 38q25 10 52 0m-52 40q25-10 52 0" fill="none" stroke="#fff1dc"/><circle cx="60" cy="57" r="5" fill="#fff1dc"/>`,
 };
 Object.assign(shapes, {
 chair: `${rect(30,18,60,44)}${rect(26,57,68,17)}${legs}`,
 microscope: `<path d="M48 20l22 12-16 33-19-10Z" fill="${c}"/><path d="M69 42q28 23 5 40H33" fill="none" stroke-width="8"/>${rect(27,85,66,9,'#657d91')}${rect(30,66,35,6,'#657d91',1)}`,
 flask: `<path d="M49 15h22v27l25 40q6 13-10 13H34q-16 0-10-13l25-40Z" fill="#d1f1ec"/><path d="M39 62h42l13 22q3 8-9 8H35q-12 0-9-8Z" fill="${c}"/><circle cx="55" cy="73" r="4" fill="#fff"/>`,
 magnet: `<path d="M25 22v38q0 30 35 30t35-30V22H74v38q0 10-14 10T46 60V22Z" fill="${c}"/>${rect(24,14,23,18,'#d1f1ec',1)}${rect(73,14,23,18,'#d1f1ec',1)}`,
 scale: `<path d="M60 19v69m-34 1h68M23 35h74M30 35 17 64h26Zm60 0L77 64h26Z" fill="${c}"/><circle cx="60" cy="27" r="7" fill="#edc07e"/>`,
 rocket: `<path d="M60 9q24 27 19 63H41Q36 36 60 9Z" fill="${c}"/><circle cx="60" cy="40" r="12" fill="#d1f1ec"/><path d="M41 56 25 82h17m36-26 17 26H78M48 75l12 22 12-22" fill="#edc07e"/>`,
 mobile: `<path d="M60 8v18M21 28h78m-67 0v25m28-25v37m28-37v18" fill="none"/><circle cx="32" cy="64" r="13" fill="${c}"/><circle cx="60" cy="77" r="10" fill="#edc07e"/><circle cx="88" cy="56" r="10" fill="#87c8bd"/>`,
 piano: `${rect(12,19,96,66)}${rect(14,58,92,23,'#fff4df',1)}<path d="M27 58v23m13-23v23m13-23v23m13-23v23m13-23v23m13-23v23"/>${legs}`,
 drum: `${rect(24,33,72,48)}<ellipse cx="60" cy="33" rx="36" ry="12" fill="#fff4df"/><path d="M27 43 40 77l15-34 15 34 18-34" fill="none"/><path d="m27 12 27 13m38-13L68 25" stroke-width="5"/>`,
 guitar: `<ellipse cx="52" cy="71" rx="26" ry="22" fill="${c}"/><ellipse cx="54" cy="53" rx="20" ry="15" fill="${c}"/><path d="M56 55 75 13" stroke="#b98968" stroke-width="12"/><circle cx="53" cy="65" r="8" fill="#51494b"/><path d="M51 81 77 11" fill="none" stroke="#fff4df"/>`,
 speaker: `${rect(28,11,64,83,'#657d91')}<circle cx="60" cy="34" r="13" fill="${c}"/><circle cx="60" cy="72" r="19" fill="${c}"/><circle cx="60" cy="72" r="8" fill="#51494b"/>`,
 easel: `<path d="M60 11 25 97m35-86 35 86M31 73h58" fill="none" stroke="#b98968" stroke-width="7"/>${rect(24,22,72,49,'#fff4df',1)}<path d="M34 56q15-33 24-4t26-10" fill="none" stroke="${c}" stroke-width="7"/>`,
 paint: [0,1,2].map(n=>`${rect(14+n*32,37,27,48,palette[n])}${rect(13+n*32,31,29,10,'#fff4df',2)}`).join(''),
 sculpture: `<path d="M32 88q-7-24 13-36-16-31 10-35 32-4 17 32 27 9 16 39Z" fill="${c}"/>${rect(24,89,74,8,'#b98968',2)}`,
 books: [0,1,2,3].map(n=>`${rect(21+n%2*7,76-n*18,73,15,palette[n],2)}${rect(28+n%2*7,80-n*18,58,6,'#fff4df',1)}`).join(''),
 globe: `<circle cx="60" cy="43" r="29" fill="#91badc"/><path d="m45 22 19 5-6 14-15 5-9-14m32 11 19 4-12 20-14-8Z" fill="#87c8bd"/><path d="M82 17q35 46-21 63v11M43 91h37" fill="none" stroke="#b98968" stroke-width="5"/>`,
 stove: `${rect(24,17,72,77)}${rect(30,43,60,41,'#657d91')}<circle cx="41" cy="31" r="4" fill="#fff4df"/><circle cx="60" cy="31" r="4" fill="#fff4df"/><circle cx="79" cy="31" r="4" fill="#fff4df"/>`,
 fridge: `${rect(31,7,58,88)}<path d="M31 38h58m-11-17v9m0 18v16" fill="none"/>`,
 bowl: `<path d="M19 56h82q-5 36-41 36T19 56Z" fill="${c}"/><circle cx="40" cy="45" r="14" fill="#ed9492"/><circle cx="66" cy="43" r="15" fill="#edc07e"/><circle cx="85" cy="50" r="11" fill="#87c8bd"/>`,
 teapot: `<ellipse cx="58" cy="64" rx="30" ry="24" fill="${c}"/><path d="M83 50q36-15 17 18H85M29 60 11 45l13 33" fill="${c}"/>${rect(37,37,41,9)}<circle cx="58" cy="33" r="5" fill="${c}"/>`,
 robot: `${rect(27,14,66,43)}${rect(33,59,54,33)}<circle cx="44" cy="34" r="5" fill="#d1f1ec"/><circle cx="75" cy="34" r="5" fill="#d1f1ec"/><path d="M43 47h33M20 63v21m80-21v21M44 92v8m32-8v8M60 14V6" fill="none" stroke-width="5"/>`,
 });
 if (kind === 'art') {
  const frame=`${rect(20,9,80,79,'#c19571',3)}${rect(27,16,66,65,'#f7ecd8',1)}`;
  const theme=item.theme;
  if(theme==='space') shapes.art=frame+'<g fill="#aaa0dd"><circle cx="40" cy="47" r="9"/><circle cx="62" cy="47" r="9"/><circle cx="83" cy="47" r="9"/></g><path d="M62 38a9 9 0 0 1 0 18Z" fill="#fff4df"/>';
  if(theme==='forest') shapes.art=frame+`<path d="M40 60q0-29 19-22 11-18 18-2l13 6-13 6q0 18-26 18Z" fill="${c}"/><circle cx="72" cy="39" r="2" fill="#51494b"/><path d="M57 65v7m8-7v7"/>`;
  if(theme==='music') shapes.art=frame+'<path d="M46 62V31l30-7v32" fill="none" stroke-width="4"/><ellipse cx="40" cy="64" rx="8" ry="5" fill="#efb362"/><ellipse cx="70" cy="59" rx="8" ry="5" fill="#efb362"/>';
  if(theme==='library') shapes.art=frame+'<path d="M35 66 48 31l13 35m-23-10h19m11-25v35m0-35h7q18 4 0 16h-7m0 0h8q18 13-1 19h-7" fill="none" stroke="#bd9a78" stroke-width="4"/>';
  if(theme==='code') shapes.art=frame+'<path d="m47 32-14 16 14 16m26-32 14 16-14 16M64 28 55 68" fill="none" stroke="#74bbbc" stroke-width="5"/>';
  if(theme==='ai') shapes.art=frame+'<circle cx="43" cy="38" r="9" fill="#b6a0de"/><circle cx="75" cy="38" r="9" fill="#b6a0de"/><path d="M35 58h16v15H35m33-15h16v15H68M52 38h14" fill="#edc07e"/>';
 }
 return `<svg viewBox="0 0 120 105" aria-hidden="true"><g stroke="#51494b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${shapes[kind] || shapes.art}</g></svg>`;
}
export function studioCharacterSvg(c = {}) {
 const safe=(v,f)=>/^#[0-9a-f]{3,8}$/i.test(v||'')?v:f;
 const skin=safe(c.skin,'#efbe91'), hair=safe(c.hairColor,'#74513f'), shirt=safe(c.outfit||c.shirt,'#91badc');
 const hairstyles={short:'<path d="M24 44Q17 12 50 12q34 0 28 32L61 28 47 37 34 29Z"/>',long:'<path d="M22 43Q19 11 50 11q32 0 29 32l5 43H17Z"/>',curls:[22,35,48,61,75].map((x,i)=>`<circle cx="${x}" cy="${25+i%2*6}" r="13"/>`).join(''),pigtails:'<circle cx="18" cy="45" r="14"/><circle cx="82" cy="45" r="14"/><path d="M24 40Q21 12 50 12q29 0 26 28Z"/>',bald:''};
 hairstyles.curly=hairstyles.curls; hairstyles.bun='<circle cx="50" cy="15" r="13"/><path d="M24 40Q21 17 50 17q29 0 26 23Z"/>';
 const pants=safe(c.pants,'#64798f');
 const eyes=c.expression==='sleepy'?'<path d="M35 47q5 5 10 0m11 0q5 5 10 0" fill="none"/>':'<circle cx="40" cy="47" r="3" fill="#51494b"/><circle cx="61" cy="47" r="3" fill="#51494b"/>';
 const mouth=c.expression==='surprised'?'<ellipse cx="51" cy="61" rx="4" ry="5" fill="#51494b"/>':c.expression==='calm'?'<path d="M44 61h14" fill="none"/>':'<path d="M43 59q8 7 16 0" fill="none"/>';
 return `<svg viewBox="0 0 100 160" aria-hidden="true"><g stroke="#51494b" stroke-width="2.3" stroke-linejoin="round"><ellipse cx="50" cy="153" rx="32" ry="5" fill="#51494b" opacity=".13"/><g fill="${hair}">${c.hair==='long'?hairstyles.long:''}</g><rect x="32" y="111" width="15" height="35" rx="5" fill="${pants}"/><rect x="53" y="111" width="15" height="35" rx="5" fill="${pants}"/><rect x="25" y="140" width="23" height="11" rx="5" fill="#fff4df"/><rect x="52" y="140" width="23" height="11" rx="5" fill="#fff4df"/><rect x="13" y="78" width="15" height="36" rx="7" fill="${skin}"/><rect x="72" y="78" width="15" height="36" rx="7" fill="${skin}"/><rect x="25" y="73" width="50" height="46" rx="13" fill="${shirt}"/><path d="M39 79q11 12 22 0" fill="none"/><circle cx="50" cy="44" r="26" fill="${skin}"/><g fill="${hair}">${hairstyles[c.hair]||hairstyles.short}</g>${eyes}${mouth}<circle cx="33" cy="57" r="4" fill="#ed9492" stroke="none" opacity=".5"/><circle cx="68" cy="57" r="4" fill="#ed9492" stroke="none" opacity=".5"/><path d="M46 97h8m-4-4v8" stroke="#fff4df"/></g></svg>`;
}

// Varje rum har sin egen arkitektur och sitt eget motiv; lösa saker ägs separat.
export function studioRoomSvg(room = {}) {
 const theme=room.templateId||'cozy';
 const line='#776c65';
 const sky=theme==='space'?'#253259':'#bce4ed';
 const outside=theme==='space'?'<circle cx="792" cy="159" r="35" fill="#d8cdf5"/><path d="M736 174q58-36 119 0" stroke="#eadfac" stroke-width="9" fill="none"/><g fill="#fff4dc"><circle cx="708" cy="92" r="3"/><circle cx="852" cy="205" r="4"/><circle cx="854" cy="106" r="3"/></g>':'<circle cx="824" cy="119" r="26" fill="#ffe49c"/><path d="M690 224q34-58 73-12t116-24v68H690Z" fill="#92c9a3"/>';
 const panels={
  cozy:'<path d="M647 65q-10 152 8 236m260-236q10 152-8 236" stroke="#fff0dc" stroke-width="24" fill="none"/><path d="M87 67h89m-45-22v44" stroke="#f4cc91" stroke-width="5"/>',
  forest:'<g fill="#4f8a63" opacity=".35"><path d="M0 0q90 18 142 90Q63 86 0 34Z"/><path d="M123 0q112 12 156 65-86 12-156-45Z"/><path d="M1000 0q-88 40-140 118 106-11 140-75Z"/></g><path d="M48 154q46-32 98 0m-74 24q26-20 54 0" stroke="#edf1d0" stroke-width="8" fill="none"/>',
  science:Array.from({length:8},(_,i)=>`<path d="M${i*140} 0v395" stroke="#fff" opacity=".25"/>`).join('')+Array.from({length:4},(_,i)=>`<path d="M0 ${i*100}h1000" stroke="#fff" opacity=".25"/>`).join('')+'<circle cx="112" cy="99" r="47" fill="#f5f7df"/><path d="M89 99h46m-23-23v46" stroke="#82bdbb" stroke-width="11"/>',
  space:'<g fill="#fff4dc"><path d="m85 58 5 14 14 2-12 9 4 14-11-9-12 9 4-14-12-9 14-2Z"/><circle cx="343" cy="85" r="4"/><circle cx="536" cy="158" r="3"/><circle cx="281" cy="268" r="3"/><circle cx="166" cy="194" r="4"/></g>',
  music:Array.from({length:12},(_,i)=>`<rect x="${i*46+40}" y="53" width="22" height="${i%3*30+90}" rx="11" fill="#fff3dc" opacity=".5"/>`).join('')+'<path d="M86 240v-38l38-11v40m-39 9c-22-13-34 20-10 21 12 0 14-11 10-21m38-9c-22-13-34 20-10 21 12 0 14-11 10-21" fill="#997bb7"/>',
  art:'<g opacity=".45"><circle cx="95" cy="102" r="48" fill="#ffe9a0"/><rect x="209" y="71" width="75" height="75" rx="15" fill="#94cbc0"/><path d="m404 66 53 90H351Z" fill="#fbe9e1"/></g><path d="M45 261q58-24 99 0t103 0t105 0" stroke="#fff0dc" stroke-width="18" fill="none"/>',
  library:'<path d="M58 397V120q0-78 100-78t100 78v277m45 0V120q0-78 100-78t100 78v277" stroke="#ecd4af" stroke-width="18" fill="none"/><path d="M83 308h63m-63 24h108m184-24h64m-64 24h108" stroke="#f5e6c7" stroke-width="6"/>',
  kitchen:Array.from({length:6},(_,i)=>`<rect x="${i*155+22}" y="215" width="144" height="174" rx="6" fill="#fff4e0" opacity=".45"/>`).join('')+'<path d="M0 293h1000" stroke="#e9d4a2" stroke-width="5"/>',
  code:Array.from({length:6},(_,row)=>Array.from({length:10},(_,col)=>`<circle cx="${col*55+50}" cy="${row*52+54}" r="4" fill="#7da89b" opacity=".55"/>`).join('')).join('')+'<path d="m247 62-22 25 22 25m68-50 22 25-22 25" stroke="#fff3dc" stroke-width="10" fill="none"/>',
  ai:Array.from({length:4},(_,row)=>Array.from({length:7},(_,col)=>`<rect x="${col*58+55}" y="${row*57+56}" width="35" height="35" rx="9" fill="${(row+col)%3===0?'#fff3dc':'#c4b8e9'}" opacity=".6"/>`).join('')).join(''),
 }[theme]||'';
 const window=theme==='space'?`<circle cx="785" cy="172" r="120" fill="#e7d7ab" stroke="${line}" stroke-width="4"/><circle cx="785" cy="172" r="106" fill="${sky}"/>${outside}`:`<rect x="680" y="66" width="202" height="205" rx="16" fill="#fff3dc" stroke="${line}" stroke-width="4"/><rect x="694" y="80" width="174" height="174" rx="9" fill="${sky}"/>${outside}<path d="M782 80v174m-88-87h174" stroke="${line}" stroke-width="4" fill="none"/>`;
 return `<svg viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">${panels}${window}<path d="M0 398h1000v16H0Z" fill="#fff3dc" stroke="${line}" stroke-width="4"/><g stroke="${line}" stroke-width="3" opacity=".18" fill="none"><path d="M0 477h1000M0 538h1000M160 414 40 600m310-186-40 186m190-186 20 186m180-186 90 186m110-186 150 186"/></g></svg>`;
}
