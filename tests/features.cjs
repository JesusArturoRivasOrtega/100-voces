const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {compare,suggest}=require('../lib/lens-domain.cjs'),data=require('../public/data/ccpc_resumen.json');
const base={type:'rate',scope:'national',year:2024,unit:'%',value:59.7,indicator:'participation'};
assert.equal(compare(base,data).status,'match');
assert.equal(compare({...base,value:60},data).status,'review');
for(const input of [
 {...base,text:'En 2018 la participación fue 59,7 %.'},
 {...base,text:'En Yucatán en 2024 la participación fue 59,7 %.'},
 {...base,text:'En 2024 no participó el 59,7 %.'},
 {...base,text:'En México en 2024 la participación fue 60 %.'},
 {...base,type:'change',from:2024,to:2012,value:2.4,unit:'pp'}
])assert.equal(compare(input,data).status,'unknown');
assert.equal(compare({...base,text:'En México en 2024 la participación fue 59,7 %.'},data).status,'match');

assert.equal(compare({...base,year:2026},data).status,'unknown');
assert.equal(compare({...base,scope:'state',entity:'No existe'},data).status,'unknown');
assert.equal(compare({...base,scope:'age',entity:'25–29 años',value:47.3},data).status,'match');
assert.equal(compare({...base,value:40.3,indicator:'complement'},data).status,'match');
const change={...base,type:'change',from:2018,to:2024,value:-2.7};
assert.equal(compare(change,data).status,'review');assert.equal(compare(change,data).expected,-4.3);
assert.equal(compare({...change,unit:'pp'},data).status,'match');
assert.equal(compare({...change,scope:'state'},data).status,'unknown');
assert.ok(compare({...change,from:2015},data).warning);
assert.equal(suggest('La participación cayó 2,7 % entre 2018 y 2024.',data).value,-2.7);
assert.equal(suggest('2018: 62.4 %, 2024: 59.7 %',data).ambiguous,true);
const {chromium,browserOptions,baseURL,axePath}=require('./runtime.cjs');
(async()=>{const browser=await chromium.launch(browserOptions);try{
 const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));await p.goto(baseURL+'/public/');
 await p.waitForFunction(()=>document.documentElement.dataset.ready==='true');
 await p.locator('#historia').scrollIntoViewIfNeeded();
 const dotTop=await p.locator('#dotGrid').evaluate(e=>e.getBoundingClientRect().top+scrollY);
 await p.locator('#historia .stat-column details summary').click();
 assert.ok(Math.abs(await p.locator('#dotGrid').evaluate(e=>e.getBoundingClientRect().top+scrollY)-dotTop)<1,'Opening evidence must not move the grid');
 await p.locator('#compareFrom').selectOption('2024');await p.locator('#compareTo').selectOption('2012');
 assert.equal(await p.locator('#compareFrom').inputValue(),'2012');assert.equal(await p.locator('#compareTo').inputValue(),'2024');
 assert.match(await p.locator('#compareSummary').textContent(),/De 2012 a 2024/);
 assert.equal(await p.locator('#glosario dt').count(),9);
 await p.locator('#liveAvailability').filter({hasText:'Servicio de salas disponible'}).waitFor();
 const staticPage=await browser.newPage();await staticPage.route('**/api/live/health',route=>route.fulfill({status:404,contentType:'text/html',body:'Not found'}));
 await staticPage.goto(baseURL+'/public/');await staticPage.locator('#liveAvailability').filter({hasText:'no está disponible'}).waitFor();
 await staticPage.locator('#liveDemo').click();await staticPage.evaluate(()=>{window.savedRandom=Math.random;Math.random=()=>0.1;});await staticPage.locator('#liveDemoAdd').click();assert.equal(await staticPage.locator('#liveCount').textContent(),'6');
 await staticPage.evaluate(()=>{Math.random=()=>0.9;});await staticPage.locator('#liveDemoAdd').click();assert.equal(await staticPage.locator('#liveCount').textContent(),'12');
 assert.equal(await staticPage.locator('#liveCloud .live-bin').nth(2).locator('span').textContent(),'6');assert.equal(await staticPage.locator('#liveCloud .live-bin').nth(18).locator('span').textContent(),'6');
 await staticPage.evaluate(()=>{Math.random=window.savedRandom;});await staticPage.close();

 await p.locator('[data-lens-example="0"]').click();await p.locator('#lensConfirm').check();await p.locator('#lensForm button[type=submit]').click();
 assert.match(await p.locator('#lensReason').innerText(),/-4,3/);assert.match(await p.locator('#lensVerdict').innerText(),/Revisa/);
 await p.locator('#lensUnit').selectOption('pp');assert.equal(await p.locator('#lensConfirm').isChecked(),false);
 await p.locator('#lensConfirm').check();await p.locator('#lensForm button[type=submit]').click();assert.match(await p.locator('#lensReason').innerText(),/no concuerdan/);
 await p.locator('#lensText').fill('La participación cayó 2,7 pp entre 2018 y 2024.');await p.locator('#lensDetect').click();
 await p.locator('#lensConfirm').check();await p.locator('#lensForm button[type=submit]').click();assert.match(await p.locator('#lensVerdict').innerText(),/coincide/);
 const dl=p.waitForEvent('download');await p.locator('#lensExport').click();const card=await dl;assert.match(card.suggestedFilename(),/\.png$/);await card.saveAs(path.join(__dirname,'../evidencia/lente-ficha.png'));
 await p.locator('#lensText').fill('<img src=x onerror=alert(1)> 59.7 % en 2024');await p.locator('#lensDetect').click();assert.equal(await p.locator('#lensDetected img').count(),0);
 await p.locator('#liveDemo').click();await p.locator('#liveDemoAdd').click();assert.equal(await p.locator('#liveCount').innerText(),'6');
 await p.locator('#liveReveal').click();await p.locator('#liveOfficial').waitFor({state:'visible'});assert.match(await p.locator('#liveOfficial').innerText(),/59[.,]7/);
 await p.locator('#liveNext').click();assert.equal(await p.locator('#liveCount').innerText(),'0');await p.locator('#liveDemoAdd').click();await p.locator('#liveReveal').click();assert.match(await p.locator('#liveOfficial').innerText(),/-2[.,]7/);
 await p.locator('#liveNext').click();await p.locator('#liveDemoAdd').click();await p.locator('#liveReveal').click();await p.locator('#liveClose').click();
 assert.equal(await p.locator('#livePhase').innerText(),'Sesión cerrada');await p.locator('#liveSummary').evaluate(el=>el.open=true);
 const summary=p.waitForEvent('download');await p.locator('#liveExport').click();assert.match((await summary).suggestedFilename(),/DEMO/);
 await p.addScriptTag({path:axePath});const violations=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(violations,[]);
 for(const width of [320,375,768,1440]){await p.setViewportSize({width,height:1000});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'overflow '+width);}
 await p.setViewportSize({width:1440,height:1000});await p.locator('#en-vivo').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(__dirname,'../evidencia/sala-viva.png')});await p.locator('#lente').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(__dirname,'../evidencia/lente-ciudadana.png')});
 await p.locator('#liveLeave').click();await p.locator('#liveCreate').click();await p.locator('#liveRoomCode').filter({hasText:/^[A-Z2-9]{6}$/}).waitFor();
 const code=await p.locator('#liveRoomCode').innerText();
 const contexts=await Promise.all([browser.newContext(),browser.newContext()]);
 const guests=await Promise.all(contexts.map(c=>c.newPage()));
 for(const guest of guests){await guest.goto(baseURL+'/public/?sala='+code);await guest.locator('#liveJoinForm button').click();await guest.locator('#liveValue').fill('59.7');await guest.locator('#liveAnswerForm button').click();await guest.locator('#liveAnswerStatus').filter({hasText:'recibida'}).waitFor();assert.equal(await guest.locator('#liveHostControls').isVisible(),false);}
 await p.waitForFunction(()=>document.getElementById('liveCount').textContent==='2');await p.locator('#liveReveal').click();
 for(const guest of guests){await guest.locator('#liveEvidence').waitFor({state:'visible'});assert.match(await guest.locator('#liveOfficial').innerText(),/59[.,]7/);}
 await p.reload();await p.locator('#liveResume').click();await p.locator('#liveNext').click();
 for(const guest of guests){await guest.locator('#liveRound').filter({hasText:'RONDA 2'}).waitFor();}
 await p.locator('#liveClose').click();for(const c of contexts)await c.close();
 const sample=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=1200;c.height=300;const g=c.getContext('2d');g.fillStyle='white';g.fillRect(0,0,1200,300);g.fillStyle='black';g.font='48px Arial';g.fillText('En Mexico, la participacion en 2024',40,100);g.fillText('fue de 59.7 %. Fuente: INE.',40,180);return c.toDataURL('image/png').split(',')[1];});
 const ocrRequests=[];const record=request=>ocrRequests.push({url:request.url(),method:request.method()});p.on('request',record);
 await p.locator('#lensImage').setInputFiles({name:'captura-ejemplo.png',mimeType:'image/png',buffer:Buffer.from(sample,'base64')});
 await p.locator('#lensStatus').filter({hasText:'Texto extraído'}).waitFor({timeout:120000});
 assert.match(await p.locator('#lensText').inputValue(),/59[.,]7/);
 p.off('request',record);assert.deepEqual(ocrRequests.filter(r=>r.method==='POST'||(!r.url.startsWith(baseURL)&&!r.url.startsWith('blob:'+baseURL)&&!r.url.startsWith('data:'))),[],'OCR debe permanecer en el origen local');
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(__dirname,'../evidencia/pruebas-version-1.2.json'),JSON.stringify({fecha:new Date().toISOString(),resultados:[
 {prueba:'Contraste numérico y ámbitos',estado:'VERIFICADO',detalle:'Tasas, complementos, edad y unidades; rechaza años, ámbito, indicador y cifra contradictorios con el texto; rechaza cronología inversa'},
 {prueba:'Sala compartida',estado:'VERIFICADO',detalle:'Presentador y dos contextos independientes; sincronización, recuperación y control de rondas'},
 {prueba:'Demo y exportaciones',estado:'VERIFICADO',detalle:'Tres rondas ficticias, lotes variables comprobados con aleatoriedad controlada, resumen y ficha PNG; aviso de servidor estático y ensayo disponible'},
 {prueba:'OCR local',estado:'VERIFICADO',detalle:'Captura sintética leída en español, sin subida ni solicitudes a otro origen'},
 {prueba:'Accesibilidad y adaptación',estado:'VERIFICADO',detalle:'Cuadrícula anclada al revelar evidencia; fechas ordenadas; glosario; sin infracciones axe ni desbordamiento en 320,375,768,1440 px'}
 ]},null,2));
 console.log('Lente, sala con dos participantes, reanudar presentador, OCR local, demo, exportaciones, accesibilidad y responsive: OK');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
