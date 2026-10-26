export const questions = [
 {id:'estimate',title:'¿Cuántas personas de cada cien participaron en 2024?',hint:'Haz una estimación. Después veremos el dato publicado.',min:0,max:100,step:0.1,unit:'%',answer:59.7,explanation:'La tasa nacional CCPC de 2024 fue 59,7 %. Los cien puntos redondean la imagen, no el dato. Se excluyen los registros no especificados.',source:'https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf#page=21'},
 {id:'difference',title:'De 62,4 % en 2018 a 59,7 % en 2024: ¿cuál es el cambio?',hint:'Resta 2024 menos 2018. Usa signo negativo si disminuyó.',min:-100,max:100,step:0.1,unit:'pp',answer:-2.7,explanation:'59,7 − 62,4 = −2,7 puntos porcentuales. La variación relativa es aproximadamente −4,3 %. Una diferencia no explica sus causas.',source:'https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf#page=21'},
 {id:'recall',title:'Después de la explicación: ¿cuál fue la tasa nacional de 2024?',hint:'Recupera el dato exacto, con un decimal.',min:0,max:100,step:0.1,unit:'%',answer:59.7,explanation:'59,7 %. Este cierre mide recuerdo inmediato dentro de la actividad; no demuestra aprendizaje duradero ni representa a la población.',source:'https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf#page=21'}
];
export function summarize(rows,round,phase){
 const stats=questions.map((q,i)=>{const values=rows.filter(r=>r.round===i).map(r=>r.value);return {round:i,count:values.length,mean:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,meanAbsoluteError:values.length?values.reduce((a,b)=>a+Math.abs(b-q.answer),0)/values.length:null,exact:values.filter(v=>Math.abs(v-q.answer)<0.051).length};});
 const visible=stats.filter(s=>s.round<round||(s.round===round&&phase!=='collecting'));
 const bins=Array(20).fill(0),q=questions[round];rows.filter(r=>r.round===round).forEach(r=>{bins[Math.min(19,Math.max(0,Math.floor((r.value-q.min)/(q.max-q.min)*20)))]++;});
 return {count:stats[round].count,bins,results:visible};
}
