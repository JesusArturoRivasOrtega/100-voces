// Bootstrap the current local schema without deleting existing room data.
import './sites-env.mjs';
import {readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const file='.wrangler/local-bootstrap.sql';
mkdirSync('.wrangler',{recursive:true});
const schema=readFileSync('drizzle/0000_cheerful_shen.sql','utf8')
 .replace(/CREATE TABLE /g,'CREATE TABLE IF NOT EXISTS ')
 .replace(/CREATE INDEX /g,'CREATE INDEX IF NOT EXISTS ');
writeFileSync(file,schema);
try{
 const result=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--config','dist/server/wrangler.json','--local','--persist-to','.wrangler/state','--file',file],{stdio:'inherit'});
 if(result.error)throw result.error;
 process.exitCode=result.status??1;
}finally{rmSync(file,{force:true});}
