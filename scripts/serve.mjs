import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const base=process.cwd();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.csv':'text/csv; charset=utf-8','.pdf':'application/pdf','.stl':'model/stl','.png':'image/png'};
http.createServer((req,res)=>{try{const url=new URL(req.url,'http://localhost');let name=decodeURIComponent(url.pathname);if(name.endsWith('/'))name+='index.html';const file=path.resolve(base,'.'+name);if(!file.startsWith(base+path.sep)||name.includes('/.git')){res.writeHead(403).end();return;}const buf=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'}).end(buf);}catch{res.writeHead(404).end('Arquivo não encontrado');}}).listen(Number(process.argv.includes('--port')?process.argv[process.argv.indexOf('--port')+1]:(process.env.PORT||3000)),process.argv.includes('--host')?process.argv[process.argv.indexOf('--host')+1]:'0.0.0.0');
