'use strict';
// Zero-dependency static server for local demo: node scripts/serve.js  ->  http://localhost:8080
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' };
const PORT = Number(process.env.PORT) || 8080;
http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.normalize(path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath));
  if (!file.startsWith(ROOT + path.sep) || !TYPES[path.extname(file)]) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)], 'x-content-type-options': 'nosniff' });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`Code-based checker on http://localhost:${PORT}`));
