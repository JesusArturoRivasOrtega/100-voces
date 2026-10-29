import QRCode from 'qrcode';
import {questions,summarize} from '../../public/js/live-domain.mjs';
const $=id=>document.getElementById(id),fmt=n=>Number(n).toLocaleString('es-MX',{maximumFractionDigits:1,minimumFractionDigits:1}).replace('.',',');
let session=null,state=null,timer=null,busy=false,localRows=[],localRound=0,localPhase='collecting',lastKey='',expired=false,revision=0;
const saved={get(k){try{return JSON.parse(sessionStorage.getItem(k));}catch{return null;}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v));}catch{}}};
const notice=t=>{$('liveStatus').textContent=t;};
async function api(path='',data,host){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
 try {const r=await fetch('/api/live'+path,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(host?{Authorization:'Bearer '+host}:{})},...(data?{body:JSON.stringify(data)}:{}),signal:controller.signal});
 let result;try{result=await r.json();}catch{throw Error('Este archivo no dispone del servicio de salas. Abre la web publicada o usa la demostración local.');}
 if(!r.ok){const error=Error(result.error||'No se pudo conectar.');error.status=r.status;throw error;}return result;
 }finally{clearTimeout(timeout);}
}
function download(name,text,type='text/plain;charset=utf-8'){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function run(fn){if(busy)return;busy=true;try{await fn();}catch(e){notice(e.name==='AbortError'?'La conexión tardó demasiado. Puedes reintentar.':e.message);}finally{busy=false;}}
function demoState(){return {code:'DEMO',round:localRound,phase:localPhase,question:questions[localRound],expires:Date.now()+7200000,...summarize(localRows,localRound,localPhase)};}
async function refresh(){
 if(!session)return;
 const current=session,requestRevision=++revision;
 try{const fresh=session.demo?demoState():await api('/'+session.code);if(current!==session||requestRevision!==revision)return;state=fresh;render();$('liveConnection').textContent=session.demo?'Demostración local · respuestas ficticias':'Conectado · actualización cada 3 s';}
 catch(e){if(current!==session||requestRevision!==revision)return;expired=e.status===404;$('liveConnection').textContent=expired?'La sala ha caducado. Puedes crear otra.':'Conexión interrumpida · reintentando';if(expired){$('liveAnswerForm').hidden=true;$('liveHostControls').hidden=true;saved.set('voces-live',null);}notice(e.message);}
 finally{if(current===session&&requestRevision===revision){clearTimeout(timer);if(session&&!session.demo&&!expired&&state?.phase!=='closed'&&!document.hidden&&navigator.onLine)timer=setTimeout(refresh,3000);}}
}
async function enter(info){
 clearTimeout(timer);session=info;state=null;lastKey='';expired=false;
 $('liveLobby').hidden=true;$('liveRoom').hidden=false;$('liveRoomCode').textContent=info.code;
 $('liveAnswerForm').hidden=true;$('liveHostControls').hidden=true;$('liveEvidence').hidden=true;$('liveSummary').hidden=true;$('liveRound').textContent='CARGANDO SALA…';
 $('liveQuestion').textContent='Conectando con tu sala…';$('liveHint').textContent='';$('liveCount').textContent='—';$('livePhase').textContent='Conectando';$('liveConnection').textContent='';$('liveCloud').replaceChildren();
 $('liveInvite').hidden=!info.hostToken||info.demo;$('liveDemoControls').hidden=!info.demo;
 $('liveRole').textContent=info.demo?'ENSAYO SIN CONEXIÓN':info.hostToken?'PRESENTADOR':'PARTICIPANTE';
 if(!info.demo){saved.set('voces-live',info);const url=new URL(location.href);url.search='';url.searchParams.set('sala',info.code);url.hash='en-vivo';$('liveInviteLink').value=url.href;
 if(info.hostToken){$('liveInvite').open=true;await QRCode.toCanvas($('liveQr'),url.href,{width:176,margin:2,color:{dark:'#12142b',light:'#ffffff'}});}
 }
 notice('');await refresh();$('liveRoom').focus();
}
function render(){
 const q=state.question,key=state.round+':'+state.phase;
 $('liveRound').textContent=`RONDA ${state.round+1} DE ${questions.length}`;
 $('liveQuestion').textContent=q.title;$('liveHint').textContent=q.hint;
 $('liveCount').textContent=state.count;$('liveCountLabel').textContent=session.demo?'respuestas ficticias':'respuestas en esta ronda';
 const locked=state.phase!=='collecting';
 $('livePhase').textContent=state.phase==='closed'?'Sesión cerrada':locked?'Evidencia revelada':'Recibiendo respuestas';
 $('liveAnswerForm').hidden=!!session.hostToken||session.demo||locked;
 $('liveHostControls').hidden=!(session.hostToken||session.demo)||state.phase==='closed';
 $('liveReveal').hidden=locked;$('liveNext').hidden=!locked||state.round===questions.length-1;
 $('liveDemoAdd').disabled=locked;
 if(key!==lastKey){$('liveValue').min=q.min;$('liveValue').max=q.max;$('liveValue').step=q.step;$('liveValue').value='';$('liveValueLabel').textContent=`Tu respuesta (${q.unit})`;$('liveAnswerStatus').textContent='';lastKey=key;}
 const chart=$('liveCloud');const max=Math.max(1,...state.bins);
 state.bins.forEach((n,i)=>{let col=chart.children[i];if(!col){col=document.createElement('div');col.className='live-bin';const bar=document.createElement('i');bar.setAttribute('aria-hidden','true');const count=document.createElement('span');col.append(count,bar);chart.append(col);}col.style.setProperty('--bar',`${n/max*85}%`);col.firstChild.textContent=n||'';col.title=`${fmt(q.min+i*(q.max-q.min)/20)} a ${fmt(q.min+(i+1)*(q.max-q.min)/20)}: ${n} respuestas`;});
 chart.setAttribute('aria-label',`Distribución de ${state.count} respuestas en veinte intervalos de ${q.min} a ${q.max} ${q.unit}.`);
 $('liveScaleMin').textContent=q.min+' '+q.unit;$('liveScaleMax').textContent=q.max+' '+q.unit;
 const counts=$('liveDistribution');counts.replaceChildren();state.bins.forEach((n,i)=>{if(!n)return;const li=document.createElement('li');li.textContent=`${fmt(q.min+i*(q.max-q.min)/20)}–${fmt(q.min+(i+1)*(q.max-q.min)/20)} ${q.unit}: ${n} respuesta(s)`;counts.append(li);});
 $('liveEvidence').hidden=!locked;
 if(locked){$('liveOfficial').textContent=fmt(q.answer)+' '+q.unit;$('liveExplanation').textContent=q.explanation;$('liveSource').href=q.source;const stat=state.results.find(r=>r.round===state.round);$('liveGroupMean').textContent=stat?.mean==null?'Todavía no hay respuestas.':`Promedio del grupo: ${fmt(stat.mean)} ${q.unit}. Coincidencias exactas: ${stat.exact} de ${stat.count}.`;}
 $('liveSummary').hidden=state.results.length===0;
 const list=$('liveResults');list.replaceChildren();state.results.forEach(s=>{const li=document.createElement('li');li.textContent=`Ronda ${s.round+1}: ${s.count} respuestas · ${s.exact} coincidencias exactas${s.meanAbsoluteError===null?'':` · error absoluto medio ${fmt(s.meanAbsoluteError)} pp`}.`;list.append(li);});
}
$('liveCreate').onclick=()=>run(async()=>{const r=await api('',{});await enter({...r,participant:crypto.randomUUID()});});
$('liveJoinForm').onsubmit=e=>{e.preventDefault();run(async()=>{const code=$('liveJoinCode').value.trim().toUpperCase();await api('/'+code);await enter({code,participant:saved.get('voces-participant-'+code)||crypto.randomUUID()});saved.set('voces-participant-'+code,session.participant);});};
$('liveDemo').onclick=()=>run(async()=>{localRows=[];localRound=0;localPhase='collecting';await enter({demo:true,code:'DEMO'});});
$('liveDemoAdd').onclick=()=>{if(localPhase!=='collecting')return;const q=questions[localRound];Array.from({length:6},()=>Math.round((q.min+Math.random()*(q.max-q.min))*10)/10).forEach(value=>localRows.push({round:localRound,value:Math.max(q.min,Math.min(q.max,value))}));refresh();};
$('liveAnswerForm').onsubmit=e=>{e.preventDefault();run(async()=>{const raw=$('liveValue').value;if(!raw.trim())throw Error('Escribe tu respuesta.');await api('/'+session.code+'/answer',{round:state.round,value:Number(raw),participant:session.participant});$('liveAnswerStatus').textContent='Respuesta recibida. Puedes cambiarla mientras la ronda siga abierta.';await refresh();});};
async function control(action){if(session.demo){if(action==='reveal')localPhase='revealed';if(action==='next'){localRound++;localPhase='collecting';}if(action==='close')localPhase='closed';}else await api('/'+session.code+'/control',{action,round:state.round,phase:state.phase},session.hostToken);await refresh();}
for(const [id,action] of [['liveReveal','reveal'],['liveNext','next'],['liveClose','close']])$(id).onclick=()=>run(()=>control(action));
$('liveLeave').onclick=()=>{clearTimeout(timer);const previous=session;session=null;state=null;revision++;configureResume(previous?.demo?null:previous);$('liveRoom').hidden=true;$('liveLobby').hidden=false;$('liveCreate').focus();notice(previous?.demo?'Terminaste el ensayo local. Al volver a entrar comenzarás sin respuestas ficticias.':'Saliste de la vista. Puedes retomar tu sala durante esta sesión del navegador; caduca a las dos horas.');};
$('liveCopyInvite').onclick=()=>run(async()=>{try{await navigator.clipboard.writeText($('liveInviteLink').value);notice('Enlace copiado.');}catch{$('liveInviteLink').focus();$('liveInviteLink').select();notice('Selecciona y copia el enlace.');}});
$('liveExport').onclick=()=>{const lines=['100 VOCES · Resumen de actividad',`Sala: ${session.code}${session.demo?' · DEMOSTRACIÓN CON DATOS FICTICIOS':''}`,`Fecha: ${new Date().toISOString()}`,...state.results.map(s=>`Ronda ${s.round+1} | respuestas: ${s.count} | coincidencias: ${s.exact} | media: ${s.mean==null?'sin datos':fmt(s.mean)+' '+questions[s.round].unit} | error absoluto medio: ${s.meanAbsoluteError==null?'sin datos':fmt(s.meanAbsoluteError)+' pp'}`),'Los resultados describen esta sesión. El cierre mide recuerdo inmediato; no demuestra aprendizaje duradero. Los grupos de cada ronda pueden ser diferentes. No es una encuesta representativa.','Fuente de contraste: '+questions[0].source];download('100-voces-sala-'+session.code+'.txt',lines.join('\n'));};
$('livePresent').onclick=()=>run(async()=>{if(document.fullscreenElement)await document.exitFullscreen();else if($('liveRoom').requestFullscreen)await $('liveRoom').requestFullscreen();else notice('Usa el modo de pantalla completa de tu navegador.');});
const code=new URL(location.href).searchParams.get('sala'),previous=saved.get('voces-live');
if(code&&/^[A-Z2-9]{6}$/.test(code)){ $('liveJoinCode').value=code;location.hash='en-vivo';notice('Código recibido. Pulsa Entrar para unirte.');}
function configureResume(info){$('liveResume').hidden=!info;$('liveResume').onclick=info?()=>run(()=>enter(info)):null;}
if(previous&&!previous.demo&&(!code||previous.code===code))configureResume(previous);
window.addEventListener('pagehide',()=>{clearTimeout(timer);revision++;});
window.addEventListener('pageshow',event=>{if(event.persisted&&session)void refresh();});
document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!document.hidden&&session&&!expired)void refresh();});
window.addEventListener('offline',()=>{clearTimeout(timer);if(session&&!session.demo)$('liveConnection').textContent='Sin conexión · tus controles volverán al reconectar';});
window.addEventListener('online',()=>{if(session&&!expired)void refresh();});

async function checkAvailability(){
 const status=$('liveAvailability');if(!status)return;
 if(location.protocol==='file:'){status.textContent='Archivo sin servidor: usa la demostración local. Las salas compartidas necesitan el servicio web.';return;}
 try{const health=await api('/health');if(!health.available)throw Error();status.textContent='Servicio de salas disponible. Crea una sala y comparte el código con quienes puedan acceder a esta web. Las salas caducan a las dos horas.';}
 catch{status.textContent='El servicio de salas no está disponible en esta dirección. Puedes usar la demostración local. Si abriste la app con Python, consulta las instrucciones siguientes para iniciar el servidor completo; si estás en la web publicada, revisa tu conexión y vuelve a intentar.';}
}
void checkAvailability();window.addEventListener('online',checkAvailability);
