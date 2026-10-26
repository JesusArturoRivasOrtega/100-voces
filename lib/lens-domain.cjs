/* Deterministic numeric comparison. Never classifies an entire narrative as true. */
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function suggest(text,data){
 const s=normalize(text),years=[...new Set((s.match(/\b20\d{2}\b/g)||[]).map(Number))];
 const change=/cay|caid|baj|dismin|aument|subi|creci|cambio|variacion|diferencia/.test(s);
 const found=[...s.matchAll(/([+-]?\d+(?:[.,]\d+)?)\s*(%|por ciento|puntos? porcentuales?|pp\b)/g)];
 const number=found.length===1?Number(found[0][1].replace(',','.')):null;
 const state=data.states_2024.find(x=>s.includes(normalize(x.name))),age=data.age_2024.find(x=>s.includes(normalize(x.age_group).replace('–','-'))||s.includes(normalize(x.age_group)));
 return {type:change?'change':'rate',years,scope:state?'state':age?'age':'national',entity:state?.name||age?.age_group||'',value:number===null?'':change&&/cay|caid|baj|dismin/.test(s)?-Math.abs(number):number,unit:found[0]&&/punto|pp/.test(found[0][2])?'pp':'%',ambiguous:found.length!==1||years.length===0,complement:/no vot|no particip|abstencion/.test(s)};
}
function compare(input,data){
 const {type,scope,entity,year,from,to,unit,value,indicator}=input;
 const unavailable=reason=>({status:'unknown',title:'No comprobable con esta base',reason,sources:[]});
 if(!Number.isFinite(value))return unavailable('Selecciona una cifra numérica válida.');
 if(scope!=='national'&&type==='change')return unavailable('La base solo tiene desgloses de entidades y edades de 2024. No podemos comparar su evolución.');
 let row;
 if(scope==='national')row=data.years.find(x=>x.year===year);
 if(scope==='state'&&year===2024)row=data.states_2024.find(x=>x.name===entity);
 if(scope==='age'&&year===2024)row=data.age_2024.find(x=>x.age_group===entity);
 const amount=r=>indicator==='complement'?100-r.participation:r.participation;
 let expected,corrected,sources=[],warning='';
 const fmt=n=>n.toFixed(1).replace('.',','),label=scope==='national'?'México':entity;
 const indicatorLabel=indicator==='complement'?'no participación (complemento CCPC)':'participación';
 if(type==='change'){
  const a=data.years.find(x=>x.year===from),b=data.years.find(x=>x.year===to);
  if(!a||!b||from===to)return unavailable('Selecciona dos elecciones diferentes que estén en la base.');
  const delta=amount(b)-amount(a),relative=amount(a)===0?null:delta/amount(a)*100;
  if(unit==='%'&&relative===null)return unavailable('No existe variación relativa cuando el valor inicial es cero.');
  expected=unit==='pp'?delta:relative;sources=[a,b];
  corrected=`La ${indicatorLabel} nacional pasó de ${fmt(amount(a))} % en ${from} a ${fmt(amount(b))} % en ${to}: ${fmt(delta)} puntos porcentuales${relative===null?'':`, equivalentes a ${fmt(relative)} % respecto al valor inicial`}.`;
  if(a.kind!==b.kind)warning='Son elecciones de distinto tipo. Conviene comparar presidenciales con presidenciales e intermedias con intermedias.';
 }else{
  if(!row)return unavailable('Ese año o ámbito no está disponible. Hay seis elecciones nacionales, ocho entidades y 18 grupos de edad nacionales de 2024.');
  if(unit!=='%')return unavailable('Una tasa aislada se expresa en porcentaje. Los puntos porcentuales expresan diferencias entre tasas.');
  expected=amount(row);sources=[row];corrected=`La ${indicatorLabel} en ${label}, ${year}, fue ${fmt(expected)} % según la definición CCPC.`;
 }
 const rounded=Math.round((expected+Number.EPSILON)*10)/10,match=Math.abs(value-rounded)<0.00001;
 return {status:match?'match':'review',title:match?'La cifra seleccionada coincide':'Revisa la cifra o la unidad',expected:rounded,reason:`Cifra seleccionada: ${fmt(value)} ${unit}. Referencia calculada a un decimal: ${fmt(rounded)} ${unit}.`,corrected,warning,sources:[...new Map(sources.map(r=>[r.source,r])).values()].map(r=>({url:r.source,page:r.source_page,title:r.source_title||'Publicación del INE'}))};
}
module.exports={suggest,compare};
