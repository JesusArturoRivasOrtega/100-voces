import {createWorker} from 'tesseract.js';
import domain from '../lens-domain.cjs';
const $=id=>document.getElementById(id),data=window.VOCES_DATA;
if(document.documentElement.dataset.ready==='true'){
let result=null,worker=null,ocrBusy=false,previewUrl=null,ocrJob=0;
const stopped=new WeakSet();
async function stop(active){if(active&&!stopped.has(active)){stopped.add(active);try{await active.terminate();}catch{}}}
function reset(){result=null;$('lensResult').hidden=true;$('lensConfirm').checked=false;}
function fields(){
 const type=$('lensType').value,scope=$('lensScope').value;
 $('lensYears').hidden=type!=='change';$('lensYearField').hidden=type==='change';$('lensEntityField').hidden=!['state','age'].includes(scope);
 $('lensYear').required=type!=='change';$('lensFrom').required=$('lensTo').required=type==='change';
 const select=$('lensEntity'),previous=select.value;select.replaceChildren();
 const rows=scope==='state'?data.states_2024:scope==='age'?data.age_2024:[];
 for(const row of rows){const option=document.createElement('option');option.value=option.textContent=row.name||row.age_group;select.append(option);}
 if([...select.options].some(o=>o.value===previous))select.value=previous;
}
for(const id of ['lensYear','lensFrom','lensTo']){const empty=document.createElement('option');empty.value='';empty.textContent='Selecciona el año';$(id).append(empty);for(const row of data.years){const option=document.createElement('option');option.value=row.year;option.textContent=row.year;$(id).append(option);}}
$('lensYear').value='2024';$('lensFrom').value='2018';$('lensTo').value='2024';fields();
for(const id of ['lensType','lensScope'])$(id).onchange=()=>{reset();fields();};
for(const id of ['lensEntity','lensYear','lensFrom','lensTo','lensUnit','lensNumber','lensIndicator'])$(id).addEventListener('input',reset);
$('lensText').addEventListener('input',()=>{reset();$('lensDetectedBox').hidden=true;});
function detect(){
 reset();const text=$('lensText').value.trim();if(!text){$('lensStatus').textContent='Pega una afirmación o extrae el texto de una imagen.';return;}
 const found=domain.suggest(text,data);$('lensType').value=found.type;$('lensScope').value=found.scope==='unknown'?'other':found.scope;fields();
 $('lensContextNote').textContent=/porque|causa|debido|inter[eé]s/i.test(text)?'Esta base no comprueba explicaciones causales ni motivos individuales. Puedes contrastar una cifra, pero su coincidencia no valida la causa propuesta.':'';
 if(found.entity)$('lensEntity').value=found.entity;
 for(const [id,year] of [['lensYear',found.years.length===1?found.years[0]:null],['lensFrom',found.years[0]],['lensTo',found.years[1]]])$(id).value=year?String(year):'';
 $('lensNumber').value=found.value;$('lensUnit').value=found.unit;$('lensIndicator').value=found.complement?'complement':'participation';
 $('lensStatus').textContent=found.ambiguous?'Hay datos ambiguos o varias cifras. Selecciona manualmente qué cifra quieres contrastar y confirma el contexto.':'Encontramos una posible cifra. Revisa año, ámbito, indicador, signo y unidad antes de confirmar.';
 const highlight=$('lensDetected');highlight.replaceChildren();
 for(const part of text.split(/([+-]?\d+(?:[.,]\d+)?\s*(?:%|pp|puntos porcentuales)?)/g)){const el=document.createElement(/\d/.test(part)?'mark':'span');el.textContent=part;highlight.append(el);}
 $('lensDetectedBox').hidden=false;
 const choices=$('lensCandidates');choices.replaceChildren();
 if(found.candidates.length>1){for(const [i,candidate] of found.candidates.entries()){const button=document.createElement('button');button.type='button';button.className='lens-candidate';button.textContent=`${i+1}. ${candidate.value} ${candidate.unit}`;button.title=candidate.context;button.setAttribute('aria-pressed','false');button.onclick=()=>{reset();$('lensNumber').value=candidate.value;$('lensUnit').value=candidate.unit;choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('lensStatus').textContent=`Elegiste ${candidate.value} ${candidate.unit}. Revisa el año y el ámbito de esa cifra antes de confirmar.`;$('lensNumber').focus();};choices.append(button);}}
}
$('lensDetect').onclick=detect;
const examples=['La participación cayó 2.7 % entre 2018 y 2024.','En México, la participación de 2024 fue 59.7 %.','En 2024 la participación en Yucatán fue 72.7 %.','En 2024, el 60 % no participó.','La participación disminuyó porque los jóvenes perdieron interés.'];
document.querySelectorAll('[data-lens-example]').forEach(b=>b.onclick=()=>{$('lensText').value=examples[Number(b.dataset.lensExample)];detect();});
$('lensForm').onsubmit=e=>{
 e.preventDefault();if(!$('lensConfirm').checked){$('lensStatus').textContent='Confirma el contexto de la cifra antes de contrastar.';$('lensConfirm').focus();return;}
 const raw=$('lensNumber').value.trim().replace('−','-').replace(',','.');if(!/^[+-]?\d+(?:\.\d+)?$/.test(raw)){$('lensStatus').textContent='Introduce una cifra válida; puedes usar signo menos y un decimal.';return;}
 result=domain.compare({text:$('lensText').value,type:$('lensType').value,scope:$('lensScope').value,entity:$('lensEntity').value,year:Number($('lensYear').value),from:Number($('lensFrom').value),to:Number($('lensTo').value),unit:$('lensUnit').value,value:Number(raw),indicator:$('lensIndicator').value},data);
 const panel=$('lensResult');panel.hidden=false;panel.dataset.verdict=result.status;
 $('lensVerdict').textContent=result.title;$('lensReason').textContent=result.reason;$('lensCorrected').textContent=result.corrected||'No hay evidencia suficiente para proponer una redacción.';$('lensWarning').textContent=result.warning||'';
 const links=$('lensSources');links.replaceChildren();result.sources.forEach(source=>{const a=document.createElement('a');a.href=source.url;a.textContent=`${source.title} · página ${source.page}`;a.target='_blank';a.rel='noopener noreferrer';links.append(a);});
 $('lensExport').disabled=!result.corrected;$('lensCopy').disabled=!result.corrected;
 $('lensStatus').textContent='Contraste terminado. El resultado se refiere a la cifra y al contexto que confirmaste.';
 panel.focus();
 document.dispatchEvent(new CustomEvent('voces:activity',{detail:{step:'contrast',text:result.title+': '+result.reason}}));
};
function report(){return ['100 VOCES · Lente Ciudadana',result.title,result.reason,result.corrected,result.warning,'Alcance: contraste numérico del contexto confirmado. No verifica toda la afirmación, sus causas ni la autenticidad de una imagen.',...result.sources.map(s=>s.url)].filter(Boolean).join('\n\n');}
$('lensCopy').onclick=async()=>{try{await navigator.clipboard.writeText(report());$('lensStatus').textContent='Explicación y fuentes copiadas.';}catch{$('lensStatus').textContent='No se pudo copiar. Usa Descargar ficha.';}};
$('lensExport').onclick=()=>{if(!result?.corrected)return;const canvas=document.createElement('canvas');canvas.width=1200;const c=canvas.getContext('2d'),lines=[];let y=130;function wrap(text,size,color){c.font=`${size}px sans-serif`;let line='';for(const word of text.split(/\s+/)){if(c.measureText(line+word).width>1060){lines.push({text:line,y,size,color});y+=size*1.4;line='';}line+=word+' ';}lines.push({text:line,y,size,color});y+=size*1.8;}
 wrap(result.title,42,'#ffffff');wrap(result.reason,27,'#d9c4ff');wrap(result.corrected,34,'#ffffff');wrap(result.warning||'Una diferencia no demuestra causas.',25,'#d9c4ff');wrap('Contraste numérico del contexto confirmado. No verifica toda la afirmación ni la autenticidad de una imagen.',23,'#ffffff');result.sources.forEach(s=>wrap(`${s.title}, p. ${s.page}`,21,'#baf5d1'));wrap('Fuentes completas y método: cien-voces-mexico.arthojust.chatgpt.site/#lente',20,'#ffffff');
 canvas.height=Math.ceil(y+40);c.fillStyle='#12142b';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='#baf5d1';c.font='bold 25px sans-serif';c.fillText('100 VOCES / LENTE CIUDADANA',64,68);for(const line of lines){c.font=`${line.size}px sans-serif`;c.fillStyle=line.color;c.fillText(line.text,64,line.y);}
 const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='100-voces-lente.png';a.click();$('lensStatus').textContent='Ficha PNG descargada. Copiar explicación incluye los enlaces directos a las fuentes.';};
$('lensImage').onchange=async()=>{
 if(ocrBusy)return;const file=$('lensImage').files[0];if(!file)return;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024){$('lensStatus').textContent='Usa una imagen PNG, JPG o WebP de hasta 8 MB.';$('lensImage').value='';return;}
 const signature=new Uint8Array(await file.slice(0,12).arrayBuffer());
 const supported=(signature[0]===137&&signature[1]===80&&signature[2]===78&&signature[3]===71)||(signature[0]===255&&signature[1]===216&&signature[2]===255)||(String.fromCharCode(...signature.slice(0,4))==='RIFF'&&String.fromCharCode(...signature.slice(8,12))==='WEBP');
 if(!supported){$('lensStatus').textContent='El archivo no contiene una imagen PNG, JPG o WebP válida.';$('lensImage').value='';return;}
 if(location.protocol==='file:'){$('lensStatus').textContent='Para leer imágenes, abre la web o un servidor local. En este archivo puedes pegar el texto directamente.';return;}
 reset();const job=++ocrJob;let active=null;ocrBusy=true;$('lensImage').disabled=true;$('lensOcrCancel').hidden=false;$('lensOcrProgress').hidden=false;$('lensOcrProgress').value=0;
 try{
  const bitmap=await createImageBitmap(file);const pixels=bitmap.width*bitmap.height;bitmap.close();if(pixels>24000000)throw Error('image_dimensions');if(job!==ocrJob)return;
  if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(file);$('lensPreview').src=previewUrl;$('lensPreview').hidden=false;
  const base=new URL('vendor/ocr/',document.baseURI).href;
  active=await createWorker('spa',1,{workerPath:base+'worker.min.js',corePath:base+'tesseract-core-lstm.wasm.js',langPath:base,gzip:true,logger:m=>{if(job!==ocrJob)return;const recognizing=m.status==='recognizing text';$('lensOcrProgress').value=recognizing?(m.progress||0)*100:0;$('lensStatus').textContent=recognizing?`Leyendo imagen en este dispositivo… ${Math.round((m.progress||0)*100)} %`:'Preparando el lector en tu dispositivo…';}});
  if(job!==ocrJob)return;worker=active;
  const output=await active.recognize(file);if(job!==ocrJob)return;
  $('lensText').value=output.data.text.trim().slice(0,3000);$('lensDetectedBox').hidden=true;
  if(!$('lensText').value){$('lensNumber').value='';$('lensStatus').textContent='No se encontró texto legible. Usa una captura más nítida o pega la afirmación.';return;}
  detect();$('lensStatus').textContent=output.data.confidence<60?'Texto extraído con baja confianza. Revisa especialmente números, signos y decimales antes de confirmar.':'Texto extraído. Revisa posibles errores de lectura antes de confirmar los campos.';
 }catch(e){if(job===ocrJob)$('lensStatus').textContent=e.message==='image_dimensions'?'La imagen supera 24 megapíxeles. Recórtala a la cifra que quieres revisar.':'No se pudo leer la imagen. Prueba una captura más nítida o pega el texto.';}
 finally{await stop(active);if(job===ocrJob){worker=null;ocrBusy=false;$('lensImage').disabled=false;$('lensImage').value='';$('lensOcrCancel').hidden=true;$('lensOcrProgress').hidden=true;}}
};
$('lensOcrCancel').onclick=()=>{ocrJob++;ocrBusy=false;void stop(worker);worker=null;$('lensImage').disabled=false;$('lensImage').value='';$('lensOcrCancel').hidden=true;$('lensOcrProgress').hidden=true;$('lensStatus').textContent='Lectura cancelada. Puedes elegir otra imagen o pegar texto.';};
window.addEventListener('pagehide',()=>{ocrJob++;void stop(worker);worker=null;ocrBusy=false;$('lensImage').disabled=false;$('lensOcrCancel').hidden=true;$('lensOcrProgress').hidden=true;});
}
