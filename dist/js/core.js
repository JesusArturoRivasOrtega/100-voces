/* UMD para navegador local y pruebas Node. Sin red ni paquetes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Voces=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const fmt=n=>Number(n).toLocaleString('es-MX',{minimumFractionDigits:1,maximumFractionDigits:1}).replace('.',',');
 const delta=(a,b)=>Math.round((b-a)*1e10)/1e10;
 const pp=n=>`${n>0?'+':''}${fmt(n)} pp`;
 const complement=n=>delta(n,100);
 const relative=(a,b)=>a===0?null:delta(a,b)/a*100;
 const year=(data,y)=>data.years.find(d=>d.year===Number(y));
 function validate(data){
  if(!data||!Array.isArray(data.years)||!Array.isArray(data.states_2024))throw Error('Estructura de datos incompleta.');
  const years=[2009,2012,2015,2018,2021,2024];
  if(data.years.length!==6||new Set(data.years.map(d=>d.year)).size!==6)throw Error('La serie requiere seis años únicos.');
  for(const d of [...data.years,...data.states_2024]){
   if(!Number.isFinite(d.participation)||d.participation<0||d.participation>100)throw Error('Tasa inválida. No se presenta un valor sustituto.');
   if(!years.includes(d.year)||d.unit!=='porcentaje'||!d.scope||!d.source||!d.reviewed_at||!d.verification)throw Error('Metadatos incompletos.');
   if(d.kind!==([2012,2018,2024].includes(d.year)?'presidencial':'intermedia'))throw Error('Tipo de elección inconsistente.');
  }
  if(data.states_2024.some(d=>d.year!==2024||!d.name)||new Set(data.states_2024.map(d=>d.name)).size!==data.states_2024.length)throw Error('Territorios inconsistentes.');
  return data;
 }
 return {fmt,delta,pp,complement,relative,year,validate};
});
