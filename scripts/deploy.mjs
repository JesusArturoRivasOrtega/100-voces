import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import './runtime-env.mjs';
const config = JSON.parse(readFileSync('wrangler.json', 'utf8'));
if (config.d1_databases.some(db => !db.database_id || db.database_id === '00000000-0000-4000-8000-000000000000')) {
  throw new Error('Crea tu base D1 y configura su database_id en wrangler.json antes de publicar.');
}
const configPath = 'dist/server/wrangler.json';
const built = JSON.parse(readFileSync(configPath, 'utf8'));
if (JSON.stringify(built.d1_databases.map(db => db.database_id)) !== JSON.stringify(config.d1_databases.map(db => db.database_id))) {
  throw new Error('La configuración cambió. Ejecuta npm run build antes de publicar.');
}
for (const args of [
  ['d1', 'migrations', 'apply', 'DB', '--config', configPath, '--remote'],
  ['deploy', '--config', configPath],
]) {
  const result = spawnSync(process.execPath, ['node_modules/wrangler/bin/wrangler.js', ...args], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
