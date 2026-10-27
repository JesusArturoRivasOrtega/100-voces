/* Activity evidence stays in memory. Visiting a section never completes a step. */
(() => {
 if(document.documentElement.dataset.ready!=='true')return;
 const $=id=>document.getElementById(id),steps=[['discover','Elegir un dato','historia'],['meaning','Revisar el denominador','historia'],['compare','Realizar una comparación','tiempo'],['limits','Responder una pregunta crítica','aprender'],['contrast','Contrastar una cifra','lente'],['share','Generar una tarjeta con fuente','compartir']];
 const activity=new Map(),panel=document.createElement('details');panel.className='evidence journey';panel.id='journey';
 panel.innerHTML='<summary>Mi recorrido por los datos</summary><p>Este registro refleja acciones realizadas, no conceptos dominados. Permanece en esta página hasta recargar; no se envía al servidor.</p><label for="journeyProgress">Actividades realizadas</label><progress id="journeyProgress" max="6" value="0"></progress><p id="journeyCount" role="status">0 de 6 actividades</p><ol id="journeySteps"></ol><button id="journeyExport" class="cta cta-ghost" type="button" disabled>Descargar mi resumen</button><button id="journeyReset" class="cta cta-ghost" type="button">Borrar mi registro</button>';
 $('metodo').append(panel);
 const list=$('journeySteps');
 function render(){list.replaceChildren();for(const [key,title,section] of steps){const item=document.createElement('li'),link=document.createElement('a');link.href='#'+section;link.textContent=(activity.has(key)?'✓ Realizada: ':'Pendiente: ')+title;item.append(link);list.append(item);}$('journeyProgress').value=activity.size;$('journeyCount').textContent=`${activity.size} de ${steps.length} actividades`;$('journeyExport').disabled=activity.size===0;}
 function record(step,text){if(document.body.classList.contains('tour-active'))return;activity.set(step,text);render();}
 document.addEventListener('voces:activity',e=>{if(steps.some(s=>s[0]===e.detail.step))record(e.detail.step,e.detail.text);});
 $('yearButtons').addEventListener('click',e=>{const b=e.target.closest('[data-year]');if(!b)return;const row=Voces.year(window.VOCES_DATA,b.dataset.year);record('discover',`México ${row.year}: ${Voces.fmt(row.participation)} %. ${row.source}`);});
 document.querySelectorAll('[data-denominator]').forEach(b=>b.addEventListener('click',()=>record('meaning',$('denominatorExplanation').textContent)));
 const comparison=()=>record('compare',$('compareSummary').textContent+' Fuente: '+window.VOCES_DATA.years[0].source);
 ['compareFrom','compareTo'].forEach(id=>$(id).addEventListener('change',comparison));$('compareBars').addEventListener('click',comparison);
 $('journeyReset').onclick=()=>{activity.clear();render();};
 $('journeyExport').onclick=()=>{const text=['100 VOCES · Mi recorrido por los datos','Acciones realizadas; no certifica comprensión ni aprendizaje duradero.',...steps.map(([key,title])=>title+': '+(activity.get(key)||'Pendiente')),'Proyecto independiente · Sin aval institucional del INE'].join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='100-voces-mi-recorrido.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);};render();
})();
