/* Deterministic numeric comparison. Never classifies an entire narrative as true. */
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[−–—]/g,'-').toLowerCase();
function suggest(text,data){
 const s=normalize(text),years=[...new Set((s.match(/\b20\d{2}\b/g)||[]).map(Number))];
 const narrative=s.replace(/baja california(?: sur)?/g,'');
 // A destination rate ("bajó a 59,7 %") is not the size of the change.
 const destination=/\b(?:cayo|bajo|disminuyo|aumento|subio|crecio)\s+(?:hasta\s+)?a\s+[\d]/.test(narrative);
 const change=!destination&&/\b(?:cayo|caida|bajo|baja|dismin\w*|aument\w*|subio|creci\w*|cambio|variacion|diferencia)\b/.test(narrative);
 const found=[...s.matchAll(/([+-]?\d+(?:[.,]\d+)?)\s*(%|por ciento|puntos? porcentuales?|pp\b)/g)];
 const candidates=found.map(m=>({value:change&&/cay|caid|baj|dismin/.test(narrative)?-Math.abs(Number(m[1].replace(',','.'))):Number(m[1].replace(',','.')),unit:/punto|pp/.test(m[2])?'pp':'%',label:m[0],context:s.slice(Math.max(0,m.index-35),Math.min(s.length,m.index+m[0].length+35))}));
 let remaining=s;const states=[];
 for(const row of [...data.states_2024].sort((a,b)=>b.name.length-a.name.length)){
  const name=normalize(row.name);if(remaining.includes(name)){states.push(row);remaining=remaining.split(name).join(' ');}
 }
 const ageText=s.replace(/\b(\d{1,3})\s*(?:a|al|-)\s*(\d{1,3})\s*anos\b/g,'$1-$2 anos');
 const ages=data.age_2024.filter(x=>ageText.includes(normalize(x.age_group)));
 const mixed=states.length+ages.length>1, state=states[0],age=ages[0];
 const unavailable=/municipio|municipal|distrito|distrital|seccion electoral|\b(?:mujeres|hombres|sexo|genero|rural|rurales|urbana|urbanas|indigenas)\b/.test(s)||(!ages.length&&/\b(?:jovenes|adultos|adolescentes)\b|\d\s*anos\b/.test(s));
 return {type:change?'change':'rate',years,scope:mixed||unavailable?'unknown':state?'state':age?'age':'national',entity:mixed||unavailable?'':state?.name||age?.age_group||'',value:candidates.length===1?candidates[0].value:'',unit:candidates[0]?.unit||'%',candidates,ambiguous:found.length!==1||years.length!==(change?2:1)||mixed||unavailable,complement:/no vot|no particip|abstencion/.test(s)};
}
function compare(input,data){
 const {type,scope,entity,year,from,to,unit,value,indicator}=input;
 const unavailable=reason=>({status:'unknown',title:'No comprobable con esta base',reason,sources:[]});
 if(!['rate','change'].includes(type)||!['national','state','age'].includes(scope)||!['%','pp'].includes(unit)||!['participation','complement'].includes(indicator))return unavailable('Selecciona un indicador, ámbito y unidad disponibles.');
 if(!Number.isFinite(value))return unavailable('Selecciona una cifra numérica válida.');
 if(input.text?.trim()){
  const detected=suggest(input.text,data),conflicts=[];
  if(detected.scope==='unknown')conflicts.push('el texto mezcla poblaciones o menciona un ámbito sin datos disponibles');
  if(!detected.candidates.length)conflicts.push('no se encontró una cifra con % o puntos porcentuales en el texto');
  if(/\bno\s+(?:fue|es|era|alcanzo|llego)|\b(?:mas|menos) de\b|\bal menos\b|\b(?:superior|inferior) a\b/.test(normalize(input.text)))conflicts.push('la afirmación contiene una negación o un límite; este comparador solo comprueba igualdades numéricas explícitas');
  if(/\b(?:aprobacion|popularidad|intencion de voto|votos? nulos?|votos? validos?|votos? para|pib|inflacion|desempleo)\b/.test(normalize(input.text)))conflicts.push('la afirmación menciona un indicador que esta base de participación no verifica');
  if(detected.candidates.length && !detected.candidates.some(c=>c.value===value&&c.unit===unit))conflicts.push('la cifra, el signo o la unidad no aparecen juntos en el texto');
  if(type==='rate'&&detected.candidates.length>1&&detected.years.length>1)conflicts.push('hay varias cifras y años; separa una sola afirmación para evitar asociar una cifra al año equivocado');
  const selectedYears=type==='change'?[from,to]:[year];
  if(detected.years.length && selectedYears.some(y=>!detected.years.includes(y)))conflicts.push('el año seleccionado no aparece en el texto');
  if(detected.entity && (detected.scope!==scope||detected.entity!==entity))conflicts.push('la entidad o el grupo de edad del texto difiere del seleccionado');
  if(/\bmexico\b|\bnacional\b/.test(normalize(input.text))&&!detected.entity&&scope!=='national')conflicts.push('el texto es nacional, pero seleccionaste otro ámbito');
  if(detected.complement && indicator!=='complement')conflicts.push('el texto habla de no participación, pero seleccionaste participación');
  if(!detected.complement&&/participaci[oó]n/i.test(input.text)&&indicator==='complement')conflicts.push('el texto habla de participación, pero seleccionaste su complemento');
  if(detected.candidates.length===1&&detected.type!==type)conflicts.push('el texto y el campo no describen el mismo tipo de cifra (tasa o cambio)');
  if(conflicts.length)return unavailable('El texto y los campos no concuerdan: '+conflicts.join('; ')+'. Corrige los campos o pega solo la afirmación que quieres revisar.');
 }
 if(scope!=='national'&&type==='change')return unavailable('La base solo tiene desgloses de entidades y edades de 2024. No podemos comparar su evolución.');
 let row;
 if(scope==='national')row=data.years.find(x=>x.year===year);
 if(scope==='state'&&year===2024)row=data.states_2024.find(x=>x.name===entity);
 if(scope==='age'&&year===2024)row=data.age_2024.find(x=>x.age_group===entity);
 const amount=r=>indicator==='complement'?100-r.participation:r.participation;
 let expected,corrected,sources=[],warning='';
 if(!input.text?.trim())warning='Consulta manual: se comparan únicamente los campos introducidos; no hay una afirmación original que revisar.';
 const fmt=n=>n.toFixed(1).replace('.',','),label=scope==='national'?'México':entity;
 const indicatorLabel=indicator==='complement'?'no participación (complemento CCPC)':'participación';
 if(type==='change'){
  const a=data.years.find(x=>x.year===from),b=data.years.find(x=>x.year===to);
  if(!a||!b||from>=to)return unavailable('Selecciona dos elecciones de la base: el año inicial debe ser anterior al final.');
  const delta=amount(b)-amount(a),relative=amount(a)===0?null:delta/amount(a)*100;
  if(unit==='%'&&relative===null)return unavailable('No existe variación relativa cuando el valor inicial es cero.');
  expected=unit==='pp'?delta:relative;sources=[a,b];
  corrected=`La ${indicatorLabel} nacional pasó de ${fmt(amount(a))} % en ${from} a ${fmt(amount(b))} % en ${to}: ${fmt(delta)} puntos porcentuales${relative===null?'':`, equivalentes a ${fmt(relative)} % respecto al valor inicial`}.`;
  if(a.kind!==b.kind)warning+=' Son elecciones de distinto tipo. Conviene comparar presidenciales con presidenciales e intermedias con intermedias.';
 }else{
  if(!row)return unavailable('Ese año o ámbito no está disponible. Hay seis elecciones nacionales, 32 entidades y 18 grupos de edad nacionales de 2024.');
  if(unit!=='%')return unavailable('Una tasa aislada se expresa en porcentaje. Los puntos porcentuales expresan diferencias entre tasas.');
  expected=amount(row);sources=[row];corrected=`La ${indicatorLabel} en ${label}, ${year}, fue ${fmt(expected)} % según la definición CCPC.`;
 }
 const rounded=Math.round((expected+Number.EPSILON)*10)/10,match=Math.abs(value-rounded)<0.00001;
 return {status:match?'match':'review',title:match?'La cifra seleccionada coincide':'Revisa la cifra o la unidad',expected:rounded,reason:`Contexto revisado: ${indicatorLabel}, ${label}, ${type==='change'?`${from} a ${to}`:year}. Cifra seleccionada: ${fmt(value)} ${unit}. Referencia calculada a un decimal: ${fmt(rounded)} ${unit}. ${unit==='pp'?'Se resta la tasa inicial a la final.':type==='change'?'Se divide la diferencia entre la tasa inicial y se multiplica por 100.':''} La coincidencia numérica no valida toda la afirmación.`,corrected,warning,sources:[...new Map(sources.map(r=>[r.source,r])).values()].map(r=>({url:r.source,page:r.source_page,title:r.source_title||'Publicación del INE'}))};
}
module.exports={suggest,compare};
