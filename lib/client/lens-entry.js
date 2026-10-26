import {createWorker} from 'tesseract.js';
import domain from '../lens-domain.cjs';
const $=id=>document.getElementById(id),data=window.VOCES_DATA;
let result=null,worker=null,ocrBusy=false,previewUrl=null;
function reset(){result=null;$('lensResult').hidden=true;$('lensConfirm').checked=false;}
function fields(){
 const type=$('lensType').value,scope=$('lensScope').value;
 $('lensYears').hidden=type!=='change';$('lensYearField').hidden=type==='change';$('lensEntityField').hidden=scope==='national';
 const select=$('lensEntity'),previous=select.value;select.replaceChildren();
 const rows=scope==='state'?data.states_2024:scope==='age'?data.age_2024:[];
 for(const row of rows){const option=document.createElement('option');option.value=option.textContent=row.name||row.age_group;select.append(option);}
 if([...select.options].some(o=>o.value===previous))select.value=previous;
}
for(const id of ['lensYear','lensFrom','lensTo'])for(const row of data.years){const option=document.createElement('option');option.value=row.year;option.textContent=row.year;$(id).append(option);}
$('lensYear').value='2024';$('lensFrom').value='2018';$('lensTo').value='2024';fields();
for(const id of ['lensType','lensScope'])$(id).onchange=()=>{reset();fields();};
for(const id of ['lensEntity','lensYear','lensFrom','lensTo','lensUnit','lensNumber','lensIndicator'])$(id).addEventListener('input',reset);
$('lensText').addEventListener('input',reset);
function detect(){
 reset();const text=$('lensText').value.trim();if(!text){$('lensStatus').textContent='Pega una afirmación o extrae el texto de una imagen.';return;}
 const found=domain.suggest(text,data);$('lensType').value=found.type;$('lensScope').value=found.scope;fields();
 if(found.entity)$('lensEntity').value=found.entity;
 for(const [id,year] of [['lensYear',found.years[0]],['lensFrom',found.years[0]],['lensTo',found.years[1]]])if(year)$ (id).value=String(year);
 $('lensNumber').value=found.value;$('lensUnit').value=found.unit;$('lensIndicator').value=found.complement?'complement':'participation';
 $('lensStatus').textContent=found.ambiguous?'Hay datos ambiguos o varias cifras. Selecciona manualmente qué cifra quieres contrastar y confirma el contexto.':'Encontramos una posible cifra. Revisa año, ámbito, indicador, signo y unidad antes de confirmar.';
 const highlight=$('lensDetected');highlight.replaceChildren();
 for(const part of text.split(/([+-]?\d+(?:[.,]\d+)?\s*(?:%|pp|puntos porcentuales)?)/g)){const el=document.createElement(/\d/.test(part)?'mark':'span');el.textContent=part;highlight.append(el);}
 $('lensDetectedBox').hidden=false;
}
$('lensDetect').onclick=detect;
const examples=['La participación cayó 2.7 % entre 2018 y 2024.','En México, la participación de 2024 fue 59.7 %.','En 2024 la participación en Yucatán fue 72.7 %.'];
document.querySelectorAll('[data-lens-example]').forEach(b=>b.onclick=()=>{$('lensText').value=examples[Number(b.dataset.lensExample)];detect();});
$('lensForm').onsubmit=e=>{
 e.preventDefault();if(!$('lensConfirm').checked){$('lensStatus').textContent='Confirma el contexto de la cifra antes de contrastar.';$('lensConfirm').focus();return;}
 const raw=$('lensNumber').value.trim().replace('−','-').replace(',','.');if(!/^[+-]?\d+(?:\.\d+)?$/.test(raw)){$('lensStatus').textContent='Introduce una cifra válida; puedes usar signo menos y un decimal.';return;}
 result=domain.compare({type:$('lensType').value,scope:$('lensScope').value,entity:$('lensEntity').value,year:Number($('lensYear').value),from:Number($('lensFrom').value),to:Number($('lensTo').value),unit:$('lensUnit').value,value:Number(raw),indicator:$('lensIndicator').value},data);
 const panel=$('lensResult');panel.hidden=false;panel.dataset.verdict=result.status;
 $('lensVerdict').textContent=result.title;$('lensReason').textContent=result.reason;$('lensCorrected').textContent=result.corrected||'No hay evidencia suficiente para proponer una redacción.';$('lensWarning').textContent=result.warning||'';
 const links=$('lensSources');links.replaceChildren();result.sources.forEach(source=>{const a=document.createElement('a');a.href=source.url;a.textContent=`${source.title} · página ${source.page}`;a.target='_blank';a.rel='noopener noreferrer';links.append(a);});
 $('lensExport').disabled=!result.corrected;$('lensCopy').disabled=!result.corrected;
 $('lensStatus').textContent='Contraste terminado. El resultado se refiere a la cifra y al contexto que confirmaste.';
 panel.focus();
};
function report(){return ['100 VOCES · Lente Ciudadana',result.title,result.reason,result.corrected,result.warning,'Alcance: contraste numérico del contexto confirmado. No verifica toda la afirmación, sus causas ni la autenticidad de una imagen.',...result.sources.map(s=>s.url)].filter(Boolean).join('\n\n');}
$('lensCopy').onclick=async()=>{try{await navigator.clipboard.writeText(report());$('lensStatus').textContent='Explicación y fuentes copiadas.';}catch{$('lensStatus').textContent='No se pudo copiar. Usa Descargar ficha.';}};
$('lensExport').onclick=()=>{const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=900;const c=canvas.getContext('2d');c.fillStyle='#12142b';c.fillRect(0,0,1200,900);c.fillStyle='#baf5d1';c.font='bold 25px sans-serif';c.fillText('100 VOCES / LENTE CIUDADANA',64,68);let y=130;function wrap(text,size,color){c.font=`${size}px sans-serif`;c.fillStyle=color;let line='';for(const word of text.split(/\s+/)){if(c.measureText(line+word).width>1060){c.fillText(line,64,y);y+=size*1.4;line='';}line+=word+' ';}c.fillText(line,64,y);y+=size*1.8;}
 wrap(result.title,42,'#ffffff');wrap(result.corrected,34,'#ffffff');wrap(result.warning||'Una diferencia no demuestra causas.',25,'#d9c4ff');wrap('Contraste numérico. No verifica toda la afirmación ni la autenticidad de una imagen.',23,'#ffffff');result.sources.forEach(s=>wrap(`${s.title}, p. ${s.page}`,21,'#baf5d1'));wrap('Fuentes completas y método: cien-voces-mexico.arthojust.chatgpt.site/#lente',20,'#ffffff');
 const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='100-voces-lente.png';a.click();$('lensStatus').textContent='Ficha PNG descargada. Copiar explicación incluye los enlaces directos a las fuentes.';};
$('lensImage').onchange=async()=>{
 if(ocrBusy)return;const file=$('lensImage').files[0];if(!file)return;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024){$('lensStatus').textContent='Usa una imagen PNG, JPG o WebP de hasta 8 MB.';$('lensImage').value='';return;}
 if(location.protocol==='file:'){$('lensStatus').textContent='Para leer imágenes, abre la web o un servidor local. En este archivo puedes pegar el texto directamente.';return;}
 reset();ocrBusy=true;$('lensImage').disabled=true;$('lensOcrCancel').hidden=false;
 try{
  if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(file);$('lensPreview').src=previewUrl;$('lensPreview').hidden=false;
  const base=new URL('vendor/ocr/',document.baseURI).href;
  const active=await createWorker('spa',1,{workerPath:base+'worker.min.js',corePath:base+'tesseract-core-lstm.wasm.js',langPath:base,gzip:true,logger:m=>{$('lensStatus').textContent=`Leyendo imagen en este dispositivo… ${Math.round((m.progress||0)*100)} %`;}});
  if(!ocrBusy){await active.terminate();return;}worker=active;
  const output=await worker.recognize(file);
  $('lensText').value=output.data.text.trim();detect();$('lensStatus').textContent='Texto extraído. Revisa posibles errores de lectura antes de confirmar los campos.';
 }catch(e){$('lensStatus').textContent=ocrBusy?'No se pudo leer la imagen. Prueba una captura más nítida o pega el texto.':'Lectura cancelada.';}
 finally{if(worker){await worker.terminate();worker=null;}ocrBusy=false;$('lensImage').disabled=false;$('lensOcrCancel').hidden=true;}
};
$('lensOcrCancel').onclick=()=>{ocrBusy=false;if(worker)worker.terminate();$('lensStatus').textContent='Lectura cancelada.';};
