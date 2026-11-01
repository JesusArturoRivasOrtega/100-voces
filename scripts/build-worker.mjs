import { build } from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
if (dirname(output) !== resolve(root)) throw new Error('Invalid build directory');
await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, 'server'), { recursive: true });
await cp(resolve(root, 'public'), resolve(output, 'client'), { recursive: true });
await build({ absWorkingDir: root, entryPoints: ['worker/index.ts'], outfile: resolve(output, 'server/index.js'), bundle: true, format: 'esm', platform: 'neutral', target: 'es2022', minify: true });
const config = JSON.parse(await readFile(resolve(root, 'wrangler.json'), 'utf8'));
delete config.$schema;
config.main = 'index.js';
config.assets.directory = '../client';
for (const binding of config.d1_databases) binding.migrations_dir = '../../drizzle';
await writeFile(resolve(output, 'server/wrangler.json'), JSON.stringify(config, null, 2) + '\n');
console.log('Worker y recursos construidos en dist/.');
