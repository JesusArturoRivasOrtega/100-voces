// Run with the bundled artifact-tool runtime; preserve the existing editable deck.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const runtime=process.env.VOCES_ARTIFACT_MODULES;
if(!runtime)throw Error('Set VOCES_ARTIFACT_MODULES to the workspace dependency node_modules directory.');
const {PresentationFile,FileBlob}=await import(pathToFileURL(path.join(runtime,'@oai/artifact-tool/dist/artifact_tool.mjs')).href);
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'outputs/deck');await fs.mkdir(out,{recursive:true});
const source=path.join(import.meta.dirname,'100_VOCES_Presentacion_Ejecutiva_10.pptx');
const deck=await PresentationFile.importPptx(await FileBlob.load(source));
const content=JSON.parse(await fs.readFile(path.join(import.meta.dirname,'contenido_presentacion.json'),'utf8'));
const inspection=await deck.inspect({kind:'textbox',maxChars:100000});
for(let i=0;i<10;i++){
 const records=inspection.records.filter(r=>r.kind==='textbox'&&r.slideIndex===i);
 for(let j=0;j<4;j++){
  const r=records[j],value=j===0?content[i][j].toUpperCase():content[i][j];if(r.text===value)continue;
  const shape=deck.resolve(r.id);shape.text=value;shape.text.style={fontFamily:'Arial',fontSize:r.style.fontSize,color:r.style.color,bold:!!r.style.bold};
 }
 deck.slides.items[i].speakerNotes.text=content[i][4]+'\nFuente: https://ine.mx/wp-content/uploads/2025/06/Manual-Conteos-Censales-2009-2024.pdf\nProyecto independiente; sin aval institucional.';
}
for(let i=0;i<10;i++){const png=await deck.export({slide:deck.slides.items[i],format:'png',scale:1});await fs.writeFile(path.join(out,`slide-${i+1}.png`),new Uint8Array(await png.arrayBuffer()));}
const candidate=path.join(out,'candidate.pptx');await (await PresentationFile.exportPptx(deck)).save(candidate);
const skill=process.env.VOCES_PRESENTATIONS_SKILL,python=process.env.VOCES_ARTIFACT_PYTHON;
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const run=Date.now();const final=path.join(out,'validated',`100_VOCES_1_3_${run}.pptx`);await fs.mkdir(path.dirname(final),{recursive:true});
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12191999,6858000','--validate-heading-fit'],explicitTotalSlideCount:10,verifyArtifactToolImport:true,receiptPath:path.join(out,`validation-${run}.json`)});
await fs.copyFile(final,source);console.log('10 slides updated, rendered and validated.');
