const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/ARTU2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=path.join(__dirname,'capturas');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
 const p=await context.newPage();const log=[];
 await p.goto('http://127.0.0.1:8765/dist/');await p.waitForFunction(()=>document.documentElement.dataset.ready==='true');await p.evaluate(()=>document.fonts.ready);
 async function snap(name,selector){await p.locator(selector).scrollIntoViewIfNeeded();await p.locator(selector).screenshot({path:path.join(out,name+'.png')});log.push({archivo:name+'.png',selector,url:p.url(),fecha:new Date().toISOString()});}
 await snap('01_portada','#inicio');
 await p.locator('[data-year="2024"]').first().click();await snap('02_nacional','.data-panel');
 await p.locator('#historia details summary').click();await snap('03_evidencia','#yearEvidence');await p.locator('#historia details summary').click();
 await p.locator('#presBtn').click();await p.locator('#compareFrom').selectOption('2018');await p.locator('#compareTo').selectOption('2024');
 await p.locator('.compare-toolbar').scrollIntoViewIfNeeded();
 const a=await p.locator('.compare-toolbar').boundingBox(),b=await p.locator('#tiempo .insight').boundingBox();const sy=await p.evaluate(()=>scrollY);
 await p.screenshot({path:path.join(out,'04_comparador.png'),fullPage:true,clip:{x:a.x,y:a.y+sy,width:a.width,height:b.y+b.height-a.y}});log.push({archivo:'04_comparador.png',selector:'.compare-toolbar hasta .insight',url:p.url()});
 await p.locator('#stateSelect').selectOption('Veracruz');await snap('05_territorio','.territory-layout');
 await p.locator('#quizAnswers button').nth(1).click();await snap('06_quiz','.quiz-wrap');
 await p.locator('#scenarioSlider').fill('64.7');await snap('07_escenario','.scenario-card');
 await p.locator('#cardType').selectOption('participation');await p.locator('#cardYear').selectOption('2024');await p.locator('#cardAudience').selectOption('aula');
 for(const fmt of ['horizontal','vertical','story']){await p.locator('#cardFormat').selectOption(fmt);const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#downloadCard').click()]);await download.saveAs(path.join(out,'tarjeta_'+fmt+'.png'));}
 await p.locator('#cardFormat').selectOption('horizontal');await snap('08_exportar','.share-preview');
 await p.locator('#copyText').click();fs.writeFileSync(path.join(out,'descripcion_copiada.txt'),await p.evaluate(()=>navigator.clipboard.readText()));
 await snap('09_aula','#metodo');await snap('10_fuentes','.sources-grid');
 const offline=await context.newPage();await context.setOffline(true);await offline.goto('file:///D:/INE_CONCURSO/100-voces/100_VOCES_ABRIR.html');await offline.waitForFunction(()=>document.documentElement.dataset.ready==='true');await offline.locator('.data-panel').screenshot({path:path.join(out,'11_offline.png')});log.push({archivo:'11_offline.png',selector:'.data-panel',url:offline.url(),red:'offline'});
 fs.writeFileSync(path.join(out,'registro_capturas.json'),JSON.stringify(log,null,2));await browser.close();console.log('Capturas y tres descargas reales creadas.');
})().catch(e=>{console.error(e);process.exitCode=1;});
