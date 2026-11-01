import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const runtime = resolve(root, '.runtime');
for (const [name, value] of Object.entries({
  WRANGLER_SEND_METRICS: 'false', WRANGLER_WRITE_LOGS: 'false',
  WRANGLER_LOG_PATH: resolve(runtime, 'logs'),
  WRANGLER_REGISTRY_PATH: resolve(runtime, 'dev-registry'),
  MINIFLARE_REGISTRY_PATH: resolve(runtime, 'registry'),
})) process.env[name] ??= value;
mkdirSync(runtime, { recursive: true });
