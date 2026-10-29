const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium,browserOptions,baseURL}=require('./runtime.cjs');
(async()=>{const browser=await chromium.launch(browserOptions),results=[];try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(baseURL+'/public/');await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');
 assert.equal(await page.locator('.orbit-detail').getAttribute('aria-hidden'),'true');
 assert.equal(await page.locator('.reading-progress').getAttribute('aria-hidden'),'true');
 await page.locator('.hero-right').hover();await page.waitForFunction(()=>document.querySelector('.hero-right').style.getPropertyValue('--light-x')!=='');
 await page.mouse.move(0,0);assert.equal(await page.locator('.hero-right').evaluate(e=>e.style.getPropertyValue('--light-x')),'');
 await page.locator('[data-year="2018"]').first().click();assert.equal(await page.locator('#participationValue').textContent(),'62,4');
 await page.waitForFunction(()=>document.getElementById('participationValue').getAnimations().length>0);
 // Keep the effect alive longer than the assertion deadline so natural completion
 // cannot disguise a broken media-change handler. Chromium dispatches it async.
 await page.locator('#participationValue').evaluate(e=>e.getAnimations().forEach(a=>a.effect.updateTiming({duration:10000})));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches&&document.getElementById('participationValue').getAnimations().every(a=>a.playState!=='running'),{},{timeout:1500});
 assert.equal(await page.locator('#participationValue').evaluate(e=>e.getAnimations().filter(a=>a.playState==='running').length),0);
 await page.locator('[data-year="2024"]').first().click();assert.equal(await page.locator('#participationValue').textContent(),'59,7');
 assert.equal(await page.locator('#participationValue').evaluate(e=>e.getAnimations().length),0);
 assert.equal(await page.locator('#dotGrid .dot').count(),100);assert.equal(await page.locator('#dotGrid .on').count(),60);
 results.push({prueba:'Movimiento y precisión',estado:'VERIFICADO',detalle:'Luz decorativa responde al mouse y se restablece; la cifra exacta aparece inmediatamente; cambiar a movimiento reducido detiene los efectos y conserva los cien puntos.'});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-year="2018"]').first().click();await page.waitForTimeout(1100);
 assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0,'No perpetual animation');
 await page.locator('#fuentes').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));
 await page.waitForFunction(()=>parseFloat(document.querySelector('.reading-progress span').style.transform.slice(7))>.5);
 assert.equal(await page.locator('#journeyCount').textContent(),'1 de 6 actividades');
 results.push({prueba:'Efectos finitos y progreso visual',estado:'VERIFICADO',detalle:'Los efectos terminan; el indicador de desplazamiento no registra aprendizaje ni altera Mi recorrido.'});
 await page.emulateMedia({reducedMotion:'reduce'});
 const ids=['inicio','historia','tiempo','territorio','aprender','escenarios','compartir','en-vivo','lente','metodo','recursos','fuentes'];
 for(const width of [320,375,390,430,768,1024,1366,1440]){
  await page.setViewportSize({width,height:1000});
  for(const id of ids){await page.locator('#'+id).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+id+' '+width);}
 }
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  for(const id of ids){await page.locator('#'+id).evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-130,behavior:'instant'}));await page.screenshot({path:path.join(__dirname,`../evidencia/visual-${id}-${width}.png`)});}
 }
 assert.deepEqual(errors,[]);results.push({prueba:'Composición adaptable',estado:'VERIFICADO',detalle:'Doce secciones en ocho anchos sin desbordamiento; 24 capturas de escritorio y móvil para revisión visual; sin errores JavaScript.'});
 fs.writeFileSync(path.join(__dirname,'../evidencia/pruebas-visuales.json'),JSON.stringify({fecha:new Date().toISOString(),resultados:results},null,2));console.log('Refinamiento visual: efectos finitos, precisión, movimiento reducido, 96 vistas y capturas OK');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
