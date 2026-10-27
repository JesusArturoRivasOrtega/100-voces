import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {testDb} from './live-api.mjs';
import {handleLive,purgeExpired} from '../lib/live-service.mjs';
const db=testDb(),results=[];
const call=async(path='',body,auth)=>{
 const response=await handleLive(new Request('http://localhost/api/live'+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost','CF-Connecting-IP':'192.0.2.1',...(auth?{Authorization:'Bearer '+auth}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}),db);
 return {status:response.status,body:await response.json()};
};
try{
 for(const size of [50,100,500]){
  const created=await call('',{});assert.equal(created.status,201);const {code,hostToken}=created.body;
  const participants=Array.from({length:size},()=>crypto.randomUUID());const start=performance.now();
  for(let i=0;i<size;i+=50){const batch=await Promise.all(participants.slice(i,i+50).map(participant=>call('/'+code+'/answer',{round:0,participant,value:59.7})));assert.ok(batch.every(r=>r.status===200),JSON.stringify(batch.filter(r=>r.status!==200)));}
  assert.equal((await call('/'+code)).body.count,size);
  const reads=await Promise.all(Array.from({length:50},()=>call('/'+code)));assert.ok(reads.every(r=>r.body.count===size&&r.body.question.answer===undefined));
  if(size===500){const extra=await Promise.all(Array.from({length:30},()=>call('/'+code+'/answer',{round:0,participant:crypto.randomUUID(),value:10})));assert.ok(extra.every(r=>r.status===409));assert.equal((await call('/'+code+'/answer',{round:0,participant:participants[0],value:10})).status,200);assert.equal((await call('/'+code)).body.count,500);}
  const controls=await Promise.all(Array.from({length:2},()=>call('/'+code+'/control',{round:0,phase:'collecting',action:'reveal'},hostToken)));assert.deepEqual(controls.map(r=>r.status).sort(),[200,409]);
  const revealed=(await call('/'+code)).body;assert.equal(revealed.results[0].count,size);assert.equal(revealed.results[0].exact,size===500?499:size);
  results.push({prueba:`Carga local ${size} identificadores`,estado:'VERIFICADO',detalle:`Misma IP, lotes concurrentes de 50 y 50 lecturas concurrentes; sin respuestas perdidas. ${Math.round(performance.now()-start)} ms en SQLite local; no mide capacidad de producción.`});
 }
 const room=(await call('',{})).body,participant=crypto.randomUUID();
 for(let i=0;i<12;i++)assert.equal((await call('/'+room.code+'/answer',{round:0,participant,value:i})).status,200);
 assert.equal((await call('/'+room.code+'/answer',{round:0,participant,value:12})).status,429);
 assert.equal((await call('/'+room.code+'/answer',{round:0,participant:crypto.randomUUID(),value:15})).status,200);
 const bad=await handleLive(new Request('http://localhost/api/live',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'á'.repeat(1300)})}),db);assert.equal(bad.status,413);
 await db.prepare('UPDATE live_rooms SET expires=0').run();await purgeExpired(db);
 for(const table of ['live_rooms','live_answers'])assert.equal((await db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).first()).n,0);
 for(let i=0;i<499;i++)await db.prepare("INSERT INTO live_rooms (code,host_hash,round,phase,created,expires) VALUES (?, 'fixture', 0, 'collecting', ?, ?)").bind('F'+String(i).padStart(5,'0'),Date.now(),Date.now()+7200000).run();
 const creations=await Promise.all(Array.from({length:3},()=>call('',{})));assert.deepEqual(creations.map(r=>r.status).sort(),[201,503,503]);assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM live_rooms').first()).n,500);
 results.push({prueba:'Abuso, concurrencia y limpieza',estado:'VERIFICADO',detalle:'Límite individual sin bloquear otros participantes; 500 exactos, actualización a capacidad completa, control duplicado rechazado, límite por bytes y borrado de respuestas vencidas.'});
 writeFileSync(new URL('../evidencia/pruebas-carga-local.json',import.meta.url),JSON.stringify({fecha:new Date().toISOString(),entorno:'SQLite en memoria con el mismo controlador de producción. No es un piloto humano ni una prueba de carga del alojamiento.',resultados:results},null,2));
 console.log('Carga local 50/100/500, concurrencia, límites, correcciones y purga: OK');
}finally{db.close();}
