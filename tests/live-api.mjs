import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {handleLive} from '../lib/live-service.mjs';
export function testDb(){
 const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');
 for(const file of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));
 function prepare(sql){let values=[];return {bind(...v){values=v;return this;},async first(){return sqlite.prepare(sql).get(...values)||null;},async all(){return {results:sqlite.prepare(sql).all(...values)};},async run(){const r=sqlite.prepare(sql).run(...values);return {meta:{changes:Number(r.changes)}};}};}
 return {prepare,batch:async statements=>{sqlite.exec('BEGIN');try{const rows=await Promise.all(statements.map(s=>s.run()));sqlite.exec('COMMIT');return rows;}catch(e){sqlite.exec('ROLLBACK');throw e;}},close:()=>sqlite.close()};
}
export async function verifyApi(){const db=testDb();let assertions=0;
 const call=async(path='',body,auth,origin='http://localhost')=>{const r=await handleLive(new Request('http://localhost/api/live'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Origin:origin,...(auth?{Authorization:'Bearer '+auth}:{})},...(body?{body:JSON.stringify(body)}:{})}),db);return {status:r.status,body:await r.json()};};
 try{
 const created=await call('',{});assert.equal(created.status,201);const {code,hostToken}=created.body;
 const a=crypto.randomUUID(),b=crypto.randomUUID();assert.equal((await call('/'+code)).body.question.answer,undefined);
 assert.equal((await call('/'+code+'/control',{round:0,phase:'collecting',action:'reveal'},'bad')).status,403);
 assert.equal((await call('/'+code+'/answer',{round:0,participant:a,value:120})).status,400);
 assert.equal((await call('/'+code+'/answer',{round:0,participant:a,value:55},null,'https://evil.example')).status,403);
 for(const [participant,value] of [[a,55],[a,59.7],[b,80]])assert.equal((await call('/'+code+'/answer',{round:0,participant,value})).status,200);
 let state=(await call('/'+code)).body;assert.equal(state.count,2);assert.equal(state.results.length,0);
 assert.equal((await call('/'+code+'/control',{round:0,phase:'collecting',action:'reveal'},hostToken)).status,200);
 assert.equal((await call('/'+code+'/answer',{round:0,participant:a,value:45})).status,409);
 state=(await call('/'+code)).body;assert.equal(state.results[0].exact,1);assert.equal(state.question.answer,59.7);assert.equal(state.host_hash,undefined);
 assert.equal((await call('/'+code+'/control',{round:0,phase:'revealed',action:'next'},hostToken)).status,200);
 assert.equal((await call('/'+code+'/answer',{round:0,participant:a,value:45})).status,409);
 assert.equal((await call('/'+code+'/control',{round:1,phase:'collecting',action:'close'},hostToken)).status,200);
 await db.prepare('UPDATE live_rooms SET expires=0 WHERE code=?').bind(code).run();assert.equal((await call('/'+code)).status,404);
 console.log('API: aislamiento, deduplicación, permisos, cierre, caducidad y fuente de evidencia: OK');
 }finally{db.close();}
}
if(process.argv[1]?.endsWith('live-api.mjs'))await verifyApi();
