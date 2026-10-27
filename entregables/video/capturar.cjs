const fs=require('fs'),path=require('path');
const {chromium,browserOptions,baseURL}=require('../../tests/runtime.cjs');
const out=path.join(__dirname,'capturas');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({...browserOptions,downloadsPath:path.join(out,'downloads')});
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
 const p=await context.newPage();const log=[];
 await p.goto(baseURL+'/public/');await p.waitForFunction(()=>document.documentElement.dataset.ready==='true');await p.evaluate(()=>document.fonts.ready);
 async function snap(name,selector){await p.locator(selector).scrollIntoViewIfNeeded();await p.locator(selector).screenshot({path:path.join(out,name+'.png')});log.push({archivo:name+'.png',selector,url:p.url(),fecha:new Date().toISOString()});}
 await snap('01_portada','#inicio');
 await p.locator('[data-year="2024"]').first().click();await snap('02_nacional','.data-panel');
 await p.locator('#historia details summary').click();await snap('03_evidencia','#yearEvidence');await p.locator('#historia details summary').click();
 await p.locator('[data-denominator="unknown"]').click();await snap('12_denominador','.denominator-lab');
 await p.locator('#presBtn').click();await p.locator('#compareFrom').selectOption('2018');await p.locator('#compareTo').selectOption('2024');
 await p.locator('.compare-toolbar').scrollIntoViewIfNeeded();
 const a=await p.locator('.compare-toolbar').boundingBox(),b=await p.locator('#tiempo .insight').boundingBox();const sy=await p.evaluate(()=>scrollY);
 await p.screenshot({path:path.join(out,'04_comparador.png'),fullPage:true,clip:{x:a.x,y:a.y+sy,width:a.width,height:b.y+b.height-a.y}});log.push({archivo:'04_comparador.png',selector:'.compare-toolbar hasta .insight',url:p.url()});
 await p.locator('#stateSelect').selectOption('Veracruz');await snap('05_territorio','.territory-layout');
 await p.locator('#viewAges').click();await p.locator('#ageSelect').selectOption({label:'25–29 años'});await snap('13_edades','#ageView');
 await p.locator('#quizAnswers button').nth(1).click();await snap('06_quiz','.quiz-wrap');
 await p.locator('#scenarioSliderA').fill('54.7');await p.locator('#scenarioSlider').fill('64.7');await snap('07_escenario','.scenario-card');
 await p.locator('#cardType').selectOption('participation');await p.locator('#cardYear').selectOption('2024');await p.locator('#cardAudience').selectOption('aula');
 for(const fmt of ['horizontal','vertical','story']){await p.locator('#cardFormat').selectOption(fmt);const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#downloadCard').click()]);await download.saveAs(path.join(out,'tarjeta_'+fmt+'.png'));}
 await p.locator('#cardFormat').selectOption('horizontal');await snap('08_exportar','.share-preview');
 await p.locator('#copyText').click();fs.writeFileSync(path.join(out,'descripcion_copiada.txt'),await p.evaluate(()=>navigator.clipboard.readText()));
 fs.copyFileSync(path.resolve(__dirname,'../../public/recursos/carrusel/05.png'),path.join(out,'14_carrusel.png'));log.push({archivo:'14_carrusel.png',origen:'public/recursos/carrusel/05.png',tipo:'lámina generada por el script del carrusel'});await snap('09_aula','#metodo');await snap('10_fuentes','.sources-grid');
 await p.locator('#liveDemo').click();await p.locator('#liveDemoAdd').click();await p.locator('#liveReveal').click();await snap('15_sala','#liveRoom');await p.locator('[data-lens-example="0"]').click();await p.locator('#lensConfirm').check();await p.locator('#lensForm button[type=submit]').click();await snap('16_lente','#lensResult');
 const offline=await context.newPage();await context.setOffline(true);await offline.goto(require('url').pathToFileURL(path.resolve(__dirname,'../../100_VOCES_ABRIR.html')).href);await offline.waitForFunction(()=>document.documentElement.dataset.ready==='true');await offline.locator('.data-panel').screenshot({path:path.join(out,'11_offline.png')});log.push({archivo:'11_offline.png',selector:'.data-panel',url:offline.url(),red:'offline'});
 fs.writeFileSync(path.join(out,'registro_capturas.json'),JSON.stringify(log,null,2));await browser.close();console.log('Capturas y tres descargas reales creadas.');
})().catch(e=>{console.error(e);process.exitCode=1;});
