import {build} from 'esbuild';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('public/vendor/ocr',{recursive:true});
await build({entryPoints:{live:'lib/client/live-entry.js',lens:'lib/client/lens-entry.js'},outdir:'public/js',bundle:true,format:'iife',platform:'browser',target:'es2022',minify:true,legalComments:'eof'});
for(const [source,target] of [['node_modules/tesseract.js/dist/worker.min.js','worker.min.js'],['node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js','tesseract-core-lstm.wasm.js'],['node_modules/tesseract.js-core/tesseract-core-lstm.wasm','tesseract-core-lstm.wasm']])await copyFile(source,'public/vendor/ocr/'+target);
for(const [source,target] of [['node_modules/tesseract.js/LICENSE.md','LICENSE-tesseract.txt'],['node_modules/tesseract.js-core/LICENSE','LICENSE-core.txt'],['node_modules/qrcode/license','LICENSE-qrcode.txt']])await copyFile(source,'public/vendor/ocr/'+target);
