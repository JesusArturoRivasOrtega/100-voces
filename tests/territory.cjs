const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium,browserOptions,baseURL,axePath}=require('./runtime.cjs');
const domain=require('../lib/lens-domain.cjs'),data=require('../public/data/ccpc_resumen.json');
(async()=>{const browser=await chromium.launch(browserOptions);try{
 const rows=fs.readFileSync(path.join(__dirname,'../fuentes/ENTIDADES_2024_COTEJO.csv'),'utf8').trim().split(/\r?\n/).slice(1).map(r=>r.split(','));assert.equal(rows.length,32);assert.equal(data.states_2024.length,32);
 const p=await browser.newPage();await p.goto(baseURL+'/public/');await p.waitForFunction(()=>document.documentElement.dataset.ready==='true');await p.locator('#viewStates').click();
 for(const [name,a,b] of rows){assert.equal(a,b);const row=data.states_2024.find(s=>s.name===name);assert.equal(row.participation,Number(a));assert.equal(row.source_page,16);assert.equal(row.reviewed_at,'2026-10-27');
  await p.locator('#stateSelect').selectOption(name);assert.equal(await p.locator('#stateValue').textContent(),Number(a).toFixed(1).replace('.',',')+' %');
  const text=`En ${name} la participación de 2024 fue ${a} %`,s=domain.suggest(text,data);assert.equal(s.scope,'state',name);assert.equal(s.entity,name);assert.equal(s.ambiguous,false,name);assert.equal(domain.compare({type:'rate',scope:'state',entity:name,year:2024,unit:'%',value:Number(a),indicator:'participation'},data).status,'match');
 }
 assert.equal(domain.suggest('Baja California y Baja California Sur en 2024: 47 % y 53.1 %',data).scope,'unknown');assert.equal(domain.suggest('En México la participación de 2024 fue 59.7 %',data).scope,'national');
 await p.locator('#stateSearch').fill('mexico');assert.equal(await p.locator('#stateRankings button:visible').count(),2);await p.locator('#stateSearch').fill('baja california sur');assert.equal(await p.locator('#stateRankings button:visible').count(),1);
 await p.locator('#stateSearch').fill('');await p.addScriptTag({path:axePath});assert.deepEqual(await p.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);
 fs.writeFileSync(path.join(__dirname,'../evidencia/pruebas-territorio.json'),JSON.stringify({fecha:new Date().toISOString(),resultados:[{prueba:'32 entidades y contextos territoriales',estado:'VERIFICADO',detalle:'32 tasas comparadas contra CSV de doble cotejo; cada selección renderiza su valor y cada afirmación identifica ámbito y coincide. Nombres solapados, México nacional, acentos y búsqueda comprobados.'}]},null,2));console.log('32 entidades: datos, selección, Lente y búsquedas OK');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
