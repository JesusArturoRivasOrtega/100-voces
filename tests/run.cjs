const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const root = path.resolve(__dirname, "..");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".wasm": "application/wasm",
  ".mjs": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".csv": "text/csv; charset=utf-8",
  ".zip": "application/zip",
  ".mp4": "video/mp4",
};
const liveReady = Promise.all([import('../lib/live-service.mjs'),import('./live-api.mjs')]).then(([api,test])=>({handler:api.handleLive,db:test.testDb()}));
const server = http.createServer(async (req, res) => {
  if(req.url.startsWith('/api/live')) {
    const {handler,db}=await liveReady;
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    const response=await handler(new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})}),db);
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  let name;
  try {
    name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  const file = path.resolve(
    root,
    "." + name + (name.endsWith("/") ? "index.html" : ""),
  );
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
  });
});
server.listen(0, "127.0.0.1", async () => {
  const baseURL = `http://127.0.0.1:${server.address().port}`;
  try {
    const suites = [
      "browser.cjs",
      "improvements.cjs",
      "accessibility.cjs",
      "release.cjs",
      "features.cjs",
      "live-api.mjs",
      "hardening.mjs",
      "resilience.cjs",
      "education.cjs",
      "territory.cjs",
      "help.cjs",
      "visual.cjs",
      "critical.cjs",
      ...(process.env.VOCES_CROSS_BROWSER==='1'||process.argv.includes('engines.cjs')?["engines.cjs"]:[]),
    ];
    const requested=process.argv.slice(2),unknown=requested.filter(name=>!suites.includes(name));
    if(unknown.length)throw Error('Suites desconocidas: '+unknown.join(', '));
    for (const name of (requested.length ? suites.filter(n=>requested.includes(n)) : suites)) {
      console.log(`Verificando ${name}`);
      await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [path.join(__dirname, name)], {
          cwd: root,
          stdio: "inherit",
          env: { ...process.env, VOCES_BASE_URL: baseURL },
        });
        child.on("error", reject);
        child.on("exit", (code) =>
          code === 0 ? resolve() : reject(Error(`${name}: salida ${code}`)),
        );
      });
    }
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    server.close();
    (await liveReady).db.close();
  }
});
