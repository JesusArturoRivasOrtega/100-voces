Voces.initScenarios=function(data){
 const $=id=>document.getElementById(id),V=Voces,base=V.year(data,2024).participation;
 $('scenarioBase').textContent=V.fmt(base)+' %';$('scenarioBaseFill').style.width=base+'%';
 function draw(){
  const a=Number($('scenarioSliderA').value),b=Number($('scenarioSlider').value);
  for(const [suffix,value] of [['A',a],['',b]]){
   const label=suffix?'A':'B';$('scenarioSlider'+suffix).setAttribute('aria-valuetext',`${V.fmt(value)} por ciento, escenario ${label} hipotético`);
   $('scenarioIncrement'+suffix).textContent=V.fmt(value)+' %';$('scenarioOutput'+suffix).textContent=V.fmt(value)+' %';
   $('scenarioFill'+suffix).style.width=value+'%';
   $('scenarioChange'+suffix).textContent=`${V.pp(V.delta(base,value))} frente al observado · ${V.fmt(V.relative(base,value))} % de cambio relativo.`;
  }
  $('scenarioDifference').textContent=`De A (${V.fmt(a)} %) a B (${V.fmt(b)} %): ${V.pp(V.delta(a,b))}. Frente al observado, B cambia ${V.pp(V.delta(base,b))}. Son supuestos, no predicciones.`;
  V.dots($('scenarioDots'),b,'Escenario B hipotético');
 }
 $('scenarioSliderA').oninput=draw;$('scenarioSlider').oninput=draw;
 $('resetScenario').onclick=()=>{$('scenarioSliderA').value=base;$('scenarioSlider').value=base;draw();};
 $('exampleScenario').onclick=()=>{$('scenarioSliderA').value=Math.max(0,base-5);$('scenarioSlider').value=Math.min(100,base+5);draw();};draw();
};
