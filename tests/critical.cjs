const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {compare,suggest}=require('../lib/lens-domain.cjs'),data=require('../public/data/ccpc_resumen.json');
const base={type:'rate',scope:'national',year:2024,value:59.7,unit:'%',indicator:'participation'},results=[];
for(const text of [
 'En el municipio de Oaxaca la participación fue 59,7 % en 2024.',
 'Yucatán y Sonora: 59,7 % en 2024.',
 'La aprobación nacional fue 59,7 % en 2024.',
 'Los votos nulos fueron 59,7 % en 2024.',
 'La participación nacional no fue 59,7 % en 2024.',
 'La participación nacional fue más de 59,7 % en 2024.',
 'La participación nacional fue al menos 59,7 % en 2024.',
 'La participación nacional en 2024 fue elevada.'
 ,'La participación de jóvenes en 2024 fue 59,7 %.'
 ,'La participación de mujeres en 2024 fue 59,7 %.'
 ,'La participación de 25 a 29 años en 2024 fue 59,7 %.'
])assert.equal(compare({...base,text},data).status,'unknown',text);
assert.equal(compare({...base,text:'En México la participación bajó a 59,7 % en 2024.'},data).status,'match');
assert.equal(suggest('La participación cayó 2,7 pp entre 2018 y 2024.',data).value,-2.7);
assert.match(compare(base,data).warning,/Consulta manual/);
assert.equal(suggest('En 2024 participaron 47,3 % de personas de 25 a 29 años.',data).entity,'25–29 años');
assert.equal(compare({...base,scope:'age',entity:'25–29 años',value:47.3,text:'En 2024 participaron 47,3 % de personas de 25 a 29 años.'},data).status,'match');
results.push({prueba:'Lente ante afirmaciones adversas',estado:'VERIFICADO',detalle:'Rechaza mezcla de ámbitos, municipio, aprobación, votos nulos, negación, límites y ausencia de cifra; distingue tasa destino de magnitud del cambio y declara consultas manuales.'});
const {chromium,browserOptions,baseURL,axePath}=require('./runtime.cjs');
(async()=>{const browser=await chromium.launch(browserOptions);try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(baseURL+'/public/');await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');
 await page.evaluate(()=>document.fonts.ready);assert.equal(await page.evaluate(()=>document.fonts.check('16px Manrope')&&document.fonts.check('16px "DM Sans"')),true);
 await page.locator('#tiempo .comparison-work summary').click();assert.match(await page.locator('#compareCalculation').textContent(),/-2,7 pp/);assert.match(await page.locator('#compareCalculation').textContent(),/-4,3 %/);assert.equal(await page.locator('#compareSources a').count(),2);
 await page.locator('#compareFrom').selectOption('2024');assert.match(await page.locator('#compareCalculation').textContent(),/0,0 pp/);assert.equal(await page.locator('#compareSources a').count(),1);
 results.push({prueba:'Cálculo visible y trazabilidad',estado:'VERIFICADO',detalle:'La comparación 2018–2024 muestra −2,7 pp y −4,3 % con dos fuentes; el mismo año muestra cero y una sola fuente.'});
 await page.locator('#liveDemo').click();assert.match(await page.locator('#liveStep').textContent(),/Aún no hay respuestas/);
 // Exercise the real event handlers, including the limit, without 84 scroll operations.
 await page.evaluate(()=>{for(let i=0;i<84;i++)document.getElementById('liveDemoAdd').click();});
 assert.equal(await page.locator('#liveCount').textContent(),'500');assert.equal(await page.locator('#liveDemoAdd').isDisabled(),true);
 await page.locator('#liveReveal').click();assert.match(await page.locator('#liveStep').textContent(),/siguiente ronda/);await page.locator('#liveNext').click();assert.equal(await page.locator('#liveCount').textContent(),'0');assert.equal(await page.locator('#liveDemoAdd').isDisabled(),false);await page.locator('#liveLeave').click();
 results.push({prueba:'Ensayo acotado y guía por fase',estado:'VERIFICADO',detalle:'500 respuestas máximas, límite desactiva añadir, revelar orienta la conversación y siguiente ronda vuelve a cero.'});
 await page.route('**/api/live/health',r=>r.fulfill({status:503,contentType:'application/json',body:'{"available":false}'}));await page.locator('#liveRetry').click();await page.locator('#liveAvailability').filter({hasText:'no está disponible'}).waitFor();assert.equal(await page.locator('#liveRetry').isDisabled(),false);
 await page.unroute('**/api/live/health');await page.locator('#liveRetry').click();await page.locator('#liveAvailability').filter({hasText:'Servicio de salas disponible'}).waitFor();
 results.push({prueba:'Recuperación de disponibilidad',estado:'VERIFICADO',detalle:'Servicio 503 explicado sin ocultar el ensayo; reintento posterior restaura disponibilidad.'});
 await page.locator('#liveCreate').click();await page.locator('#liveRoomCode').filter({hasText:/^[A-Z2-9]{6}$/}).waitFor();const code=await page.locator('#liveRoomCode').textContent();
 const guest=await browser.newPage();guest.on('pageerror',e=>errors.push(e.message));await guest.goto(baseURL+'/public/');await guest.locator('#liveJoinCode').fill(code);await guest.locator('#liveJoinForm button').click();await guest.locator('#liveAnswerForm').waitFor({state:'visible'});
 let release,arrived;const waiting=new Promise(r=>arrived=r),gate=new Promise(r=>release=r);
 await guest.route('**/api/live/*/answer',async route=>{arrived();await gate;await route.fulfill({status:200,contentType:'application/json',body:'{"accepted":true}'});});
 await guest.locator('#liveValue').fill('60');await guest.locator('#liveAnswerForm button').click();await waiting;await guest.locator('#liveLeave').click();const completed=guest.waitForResponse(r=>r.url().endsWith('/answer'));release();await(await completed).finished();await guest.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await guest.waitForFunction(()=>!document.getElementById('en-vivo').hasAttribute('aria-busy'));assert.equal(await guest.locator('#liveRoom').isVisible(),false);assert.equal(await guest.locator('#liveAnswerStatus').textContent(),'');await guest.close();await page.locator('#liveClose').click();
 results.push({prueba:'Respuesta tardía tras salir',estado:'VERIFICADO',detalle:'Una respuesta de red retenida y liberada después de salir no reabre la sala, no anuncia recepción en otra vista y no genera errores JavaScript.'});
 await page.addScriptTag({path:axePath});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);}
 assert.deepEqual(errors,[]);results.push({prueba:'Accesibilidad de estados nuevos',estado:'VERIFICADO',detalle:'Cálculo desplegado y sala cerrada sin infracciones axe; cuatro anchos sin desbordamiento; ninguna excepción JavaScript.'});
 fs.writeFileSync(path.join(__dirname,'../evidencia/pruebas-criticas.json'),JSON.stringify({fecha:new Date().toISOString(),resultados:results},null,2));console.log('Auditoría crítica: texto adverso, cuentas, cupo, recuperación, respuesta tardía y accesibilidad OK');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
