const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const root = path.resolve(__dirname, "..");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".ttf": "font/ttf",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".csv": "text/csv; charset=utf-8",
  ".zip": "application/zip",
  ".mp4": "video/mp4",
};
const server = http.createServer((req, res) => {
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
    for (const name of [
      "browser.cjs",
      "improvements.cjs",
      "accessibility.cjs",
      "release.cjs",
    ]) {
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
  }
});
