import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const scope='https://example.test/odonto-raman-lab/';
const source=fs.readFileSync(path.join(root,'sw.js'),'utf8');
function worker(){
 const handlers={},entries=new Map(),deleted=[],network=[];let offline=false,claimed=false;
 const key=x=>typeof x==='string'?x:x.url;
 const cache={async addAll(urls){for(const request of urls){const url=key(request);const name=decodeURIComponent(new URL(url).pathname).replace('/odonto-raman-lab/','')||'index.html';const file=path.join(root,name);assert(fs.existsSync(file),'Asset offline ausente: '+name);entries.set(url,new Response(fs.readFileSync(file)));}},async match(req,options){const u=key(req);let r=entries.get(u);if(!r&&options?.ignoreSearch)r=[...entries].find(([x])=>x.split('?')[0]===u.split('?')[0])?.[1];return r?.clone();},async put(req,res){entries.set(key(req),res.clone());}};
 const caches={async open(){return cache;},async keys(){return ['odonto-app-old','unrelated-cache'];},async delete(name){deleted.push(name);}};
 const self={registration:{scope},clients:{async claim(){claimed=true;}},addEventListener(name,fn){handlers[name]=fn;},skipWaiting(){}};
 vm.runInNewContext(source,{self,caches,URL,Response,Request,fetch:async req=>{network.push(key(req));if(offline)throw Error('offline');return new Response('online file');}});
 const run=async name=>{let promise;handlers[name]({waitUntil(p){promise=p;}});await promise;};
 const get=async name=>{let promise;handlers.fetch({request:new Request(new URL(name,scope)),respondWith(p){promise=p;}});return promise?await promise:null;};
 return {run,get,entries,network,deleted,offline:()=>{offline=true;},claimed:()=>claimed};
}
test('PWA instala todos os recursos locais e serve módulos/entrada offline no subdiretório',async()=>{
 const w=worker();await w.run('install');await w.run('activate');w.offline();
 assert(w.claimed());assert.deepEqual(w.deleted,['odonto-app-old']);
 const home=await w.get('./');assert.equal(home.status,200);assert((await home.text()).includes('manifest.webmanifest'));
 for(const asset of ['app.js?v=3.3','collection.js','implementation-data.js','implementation.css?v=3.3','dados/mucosa_sintetica_A.csv'])assert.equal((await w.get(asset)).status,200);
 assert.equal(w.network.length,0);
});
test('download que não foi preparado falha claramente offline e nunca recebe HTML',async()=>{
 const w=worker();await w.run('install');w.offline();const response=await w.get('docs/nunca-aberto.pdf');assert.equal(response.status,503);assert(!(await response.text()).includes('<html'));
});
test('documento visitado online pode ser reaberto offline com ou sem parâmetro de versão',async()=>{
 const w=worker();await w.run('install');await w.get('docs/Manual_Monografia_UNIVAP.pdf?v=3.3');w.offline();assert.equal(await (await w.get('docs/Manual_Monografia_UNIVAP.pdf')).text(),'online file');
});
test('manifesto preserva escopo relativo e ícones reais',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./#coleta');for(const icon of manifest.icons)assert(fs.statSync(path.join(root,icon.src)).size>100);
});
