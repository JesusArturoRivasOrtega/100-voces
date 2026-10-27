const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {firefox,webkit}=require('playwright'),{baseURL,axePath}=require('./runtime.cjs');
(async()=>{const results=[];
 for(const [name,engine] of [['Firefox',firefox],['WebKit',webkit]]){
  const browser=await engine.launch({headless:true});try{
   const p=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(baseURL+'/public/');await p.waitForFunction(()=>document.documentElement.dataset.ready==='true');
   await p.locator('[data-year="2018"]').first().click();assert.equal(await p.locator('#participationValue').textContent(),'62,4');
   await p.locator('#viewAges').click();await p.locator('#ageSelect').selectOption({label:'25–29 años'});assert.match(await p.locator('#ageValue').textContent(),/47,3/);
   await p.locator('#scenarioSlider').fill('100');assert.match(await p.locator('#scenarioOutput').textContent(),/100/);
   await p.locator('#quizAnswers button').first().click();assert.equal(await p.locator('#nextQuestion').isEnabled(),true);assert.match(await p.locator('#quizFeedback').textContent(),/Correcto/);
   await p.locator('[data-lens-example="1"]').click();await p.locator('#lensConfirm').check();await p.locator('#lensForm button[type=submit]').click();assert.match(await p.locator('#lensVerdict').innerText(),/coincide/);
   const download=p.waitForEvent('download');await p.locator('#lensExport').click();assert.match((await download).suggestedFilename(),/png$/);
   await p.locator('#liveDemo').click();await p.locator('#liveDemoAdd').click();await p.locator('#liveReveal').click();assert.match(await p.locator('#liveOfficial').innerText(),/59[.,]7/);
   await p.locator('#liveLeave').click();await p.locator('#liveCreate').click();await p.locator('#liveRoomCode').filter({hasText:/^[A-Z2-9]{6}$/}).waitFor();await p.locator('#liveReveal').click();await p.locator('#liveNext').click();await p.locator('#liveClose').click();
   const sample=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=1000;c.height=230;const g=c.getContext('2d');g.fillStyle='white';g.fillRect(0,0,1000,230);g.fillStyle='black';g.font='48px Arial';g.fillText('2024: 59.7 %',40,120);return c.toDataURL().split(',')[1];});
   await p.locator('#lensImage').setInputFiles({name:'ejemplo.png',mimeType:'image/png',buffer:Buffer.from(sample,'base64')});await p.locator('#lensStatus').filter({hasText:'Texto extraído'}).waitFor({timeout:120000});assert.match(await p.locator('#lensText').inputValue(),/59[.,]7/);
   for(const width of [320,375,768,1280]){await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' overflow '+width);}
   await p.addScriptTag({path:axePath});const violations=await p.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));assert.deepEqual(violations,[]);
   assert.deepEqual(errors,[]);results.push({prueba:name+' de escritorio automatizado',estado:'VERIFICADO',detalle:`Motor ${browser.version()}: datos, edades, escenarios, quiz, contraste, PNG, demo, sala real local y OCR. Cuatro anchos y cero infracciones axe. WebKit no equivale a Safari físico.`});console.log(name+': OK');
  }finally{await browser.close();}
 }
 fs.writeFileSync(path.join(__dirname,'../evidencia/pruebas-motores.json'),JSON.stringify({fecha:new Date().toISOString(),resultados:results},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
