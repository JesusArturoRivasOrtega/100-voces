const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium,browserOptions,baseURL,axePath}=require('./runtime.cjs');
(async()=>{const browser=await chromium.launch(browserOptions),results=[];try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(baseURL+'/public/');
 await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');
 const panel=page.locator('#section-help-panel');
 assert.equal(await page.locator('[data-help]').count(),16);
 assert.equal(await page.getByRole('link',{name:'¿De dónde salen los datos?'}).getAttribute('href'),'#fuentes');
 for(const button of await page.locator('[data-help]').all()){
  const key=await button.getAttribute('data-help');
  console.log('Ayuda: '+key);
  if(key==='edades')await page.locator('#viewAges').click();
  if(key==='recorrido')await page.locator('#journey summary').click();
  await button.scrollIntoViewIfNeeded();await button.hover();await panel.waitFor({state:'visible'});
  assert.equal(await button.getAttribute('aria-expanded'),'true');
  assert.equal(await panel.locator('ol li').count(),2);assert.ok((await panel.locator('.help-purpose').textContent()).length>60);
  assert.match(await panel.locator('.help-limit').textContent(),/^Ten en cuenta:/);
  await panel.hover();await page.waitForTimeout(350);assert.equal(await panel.isVisible(),true,'panel remains hoverable '+key);
  await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);
 }
 results.push({prueba:'Cobertura y ayuda con mouse',estado:'VERIFICADO',detalle:'16 ayudas con propósito, pasos y límites. Permanecen abiertas al mover el mouse al panel y cierran con Escape.'});
 const trigger=page.locator('[data-help="lente"]');await trigger.scrollIntoViewIfNeeded();await trigger.focus();await panel.waitFor({state:'visible'});
 await page.keyboard.press('Enter');assert.equal(await panel.locator('.help-close').evaluate(e=>e===document.activeElement),true);
 await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
 await page.keyboard.press('Enter');await page.keyboard.press('Tab');assert.equal(await panel.locator('#section-help-content').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Tab');assert.equal(await panel.isVisible(),false,'no focus trap');
 await trigger.click();await panel.waitFor({state:'visible'});await page.locator('#lensText').click();assert.equal(await panel.isVisible(),false);
 results.push({prueba:'Teclado y cierre',estado:'VERIFICADO',detalle:'Foco abre la ayuda, Enter permite acceder al cierre, Escape restaura el foco y Tab sale sin atraparlo. Clic exterior cierra.'});
 await page.addScriptTag({path:axePath});
 for(const width of [320,375,390,430,768,1024,1366,1440]){
  await page.setViewportSize({width,height:800});await trigger.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await trigger.click();await panel.waitFor({state:'visible'});
  const bounds=await panel.boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width&&bounds.y>=0&&bounds.y+bounds.height<=800,'panel fits '+width);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page fits '+width);
  await page.keyboard.press('Escape');
 }
 await trigger.click();assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);
 await page.screenshot({path:path.join(__dirname,'../evidencia/ayuda-escritorio.png')});
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await mobile.goto(baseURL+'/public/');const touch=mobile.locator('[data-help="historia"]');await touch.tap();await mobile.locator('#section-help-panel').waitFor({state:'visible'});
 await mobile.screenshot({path:path.join(__dirname,'../evidencia/ayuda-movil.png')});await mobile.locator('#section-help-content').evaluate(e=>e.scrollTop=e.scrollHeight);assert.equal(await mobile.locator('.help-close').isVisible(),true);await touch.tap();assert.equal(await mobile.locator('#section-help-panel').isVisible(),false);
 await touch.tap();await mobile.locator('.help-close').tap();assert.equal(await mobile.locator('#section-help-panel').isVisible(),false);
 results.push({prueba:'Adaptación y accesibilidad',estado:'VERIFICADO',detalle:'Panel dentro de ocho anchos de 320 a 1440 px; apertura y cierre por toque emulado; cero infracciones axe con ayuda abierta. No sustituye dispositivos físicos.'});
 await page.goto('file:///'+path.resolve(__dirname,'../100_VOCES_ABRIR.html').replace(/\\/g,'/'));await page.locator('[data-help="inicio"]').click();assert.equal(await page.locator('#section-help-panel').isVisible(),true);
 assert.deepEqual(errors,[]);results.push({prueba:'Respaldo autónomo',estado:'VERIFICADO',detalle:'Ayuda disponible al abrir el HTML por file://, sin servidor ni consultas externas.'});
 fs.writeFileSync(path.join(__dirname,'../evidencia/pruebas-ayuda.json'),JSON.stringify({fecha:new Date().toISOString(),resultados:results},null,2));
 console.log('Ayudas: 16 contenidos, mouse, teclado, móvil, ocho anchos, axe y respaldo autónomo OK');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
