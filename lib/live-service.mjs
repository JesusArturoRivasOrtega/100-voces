import { questions, summarize } from '../public/js/live-domain.mjs';
const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const reply = (data, status=200) => new Response(JSON.stringify(data),{status,headers});
const hash = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
const token = () => crypto.randomUUID()+crypto.randomUUID();
export async function handleLive(request, db) {
  try {
    if (!db) return reply({error:'Las salas compartidas no están disponibles en esta versión. Usa la demostración local.'},503);
    const url=new URL(request.url), path=url.pathname.replace(/^\/api\/live\/?/,'').split('/').filter(Boolean);
    if(request.method==='GET' && path[0]==='health') return reply({available:true,retentionHours:2});
    let body={};
    if(request.method==='POST') {
      const origin=request.headers.get('origin');
      if(origin && origin!==url.origin) return reply({error:'Origen no permitido.'},403);
      if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'Se requiere JSON.'},415);
      const input=await request.text(); if(input.length>2048)return reply({error:'Solicitud demasiado grande.'},413);
      try {body=JSON.parse(input);}catch{return reply({error:'JSON inválido.'},400);}
      if(!body || typeof body!=='object' || Array.isArray(body))return reply({error:'Solicitud inválida.'},400);
    }
    const now=Date.now();
    async function rateLimit(kind,max,window=60000) {
      const ip=request.headers.get('cf-connecting-ip')||'local';
      const key=await hash(kind+':'+ip+':'+Math.floor(now/window));
      const result=await db.prepare('INSERT INTO live_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+window).first();
      return result.count<=max;
    }
    if(request.method==='POST' && path.length===0) {
      if(!await rateLimit('create',10,3600000))return reply({error:'Has creado varias salas. Inténtalo más tarde.'},429);
      await db.batch([db.prepare('DELETE FROM live_answers WHERE room IN (SELECT code FROM live_rooms WHERE expires < ?)').bind(now),db.prepare('DELETE FROM live_rooms WHERE expires < ?').bind(now),db.prepare('DELETE FROM live_limits WHERE expires < ?').bind(now)]);
      const count=await db.prepare('SELECT COUNT(*) AS n FROM live_rooms').first();
      if(count.n>=500)return reply({error:'Las salas están ocupadas. Inténtalo más tarde.'},503);
      const host=token(), hostHash=await hash(host), alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for(let attempt=0;attempt<5;attempt++) {
        const code=Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>alphabet[b%alphabet.length]).join('');
        const result=await db.prepare('INSERT OR IGNORE INTO live_rooms (code,host_hash,round,phase,created,expires) VALUES (?,?,0,\'collecting\',?,?)').bind(code,hostHash,now,now+7200000).run();
        if(result.meta.changes)return reply({code,hostToken:host,expires:now+7200000},201);
      }
      return reply({error:'No se pudo crear la sala. Inténtalo otra vez.'},503);
    }
    const code=path[0];
    if(!/^[A-Z2-9]{6}$/.test(code||''))return reply({error:'Escribe el código de seis caracteres de la sala.'},400);
    const room=await db.prepare('SELECT * FROM live_rooms WHERE code=?').bind(code).first();
    if(!room || room.expires<=now)return reply({error:'La sala no existe o ha caducado.'},404);
    if(request.method==='GET' && path.length===1) {
      const rows=await db.prepare('SELECT round,value FROM live_answers WHERE room=?').bind(code).all();
      const {answer,explanation,source,...prompt}=questions[room.round];
      const question=room.phase==='collecting'?prompt:questions[room.round];
      return reply({code,round:room.round,phase:room.phase,expires:room.expires,question,...summarize(rows.results,room.round,room.phase)});
    }
    if(request.method==='POST' && path[1]==='answer' && path.length===2) {
      if(!await rateLimit('answer',180))return reply({error:'Demasiadas respuestas. Espera un momento.'},429);
      if(room.phase!=='collecting'||body.round!==room.round)return reply({error:'La pregunta cambió o ya se reveló. Actualiza la sala.'},409);
      const q=questions[room.round];
      if(typeof body.value!=='number'||!Number.isFinite(body.value)||body.value<q.min||body.value>q.max||typeof body.participant!=='string'||!/^[a-f0-9-]{36}$/.test(body.participant))return reply({error:'Respuesta inválida.'},400);
      const participant=await hash(code+body.participant);
      const total=await db.prepare('SELECT COUNT(*) AS n FROM live_answers WHERE room=? AND round=?').bind(code,room.round).first();
      if(total.n>=500)return reply({error:'Se alcanzó el límite de respuestas de esta ronda.'},409);
      const result=await db.prepare(`INSERT INTO live_answers (room,round,participant,value)
        SELECT code,round,?,? FROM live_rooms WHERE code=? AND round=? AND phase='collecting' AND expires>?
        ON CONFLICT(room,round,participant) DO UPDATE SET value=excluded.value`).bind(participant,Math.round(body.value*10)/10,code,room.round,now).run();
      if(!result.meta.changes)return reply({error:'La ronda acaba de cerrar.'},409);
      return reply({accepted:true});
    }
    if(request.method==='POST' && path[1]==='control' && path.length===2) {
      const bearer=request.headers.get('authorization')?.replace(/^Bearer /,'')||'';
      if(!bearer || await hash(bearer)!==room.host_hash)return reply({error:'Solo quien creó la sala puede controlarla.'},403);
      if(body.round!==room.round || body.phase!==room.phase)return reply({error:'El estado de la sala cambió. Vuelve a intentarlo.'},409);
      let nextPhase=room.phase,nextRound=room.round;
      if(body.action==='reveal'&&room.phase==='collecting')nextPhase='revealed';
      else if(body.action==='next'&&room.phase==='revealed'&&room.round<questions.length-1){nextRound++;nextPhase='collecting';}
      else if(body.action==='close'&&room.phase!=='closed')nextPhase='closed';
      else return reply({error:'Acción no disponible.'},409);
      const changed=await db.prepare('UPDATE live_rooms SET phase=?,round=? WHERE code=? AND round=? AND phase=?').bind(nextPhase,nextRound,code,room.round,room.phase).run();
      if(!changed.meta.changes)return reply({error:'El estado cambió. Actualiza la sala.'},409);
      return reply({ok:true});
    }
    return reply({error:'Ruta no disponible.'},404);
  }catch(e){console.error('live_api_failure', e instanceof Error ? e.name : 'unknown');return reply({error:'No se pudo conectar con la sala. Inténtalo de nuevo.'},500);}
}
