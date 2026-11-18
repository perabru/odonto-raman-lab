import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {guideMarkdown,materialsCSV,defaultMaterials} from '../implementation.js';
import {simulateMucosa,mucosaCSV} from '../mucosa-lab.js';
import {BUSINESS_STEPS,BUSINESS_FIELDS,BUSINESS_LINKS} from '../administracao-data.js';
const version=JSON.parse(fs.readFileSync('package.json','utf8')).version,query=version.split('.').slice(0,2).join('.');
fs.writeFileSync('docs/Como_Fazer_OdontoRaman.md',guideMarkdown());
fs.writeFileSync('docs/Administracao_Criar_Empresa.md','# Administração — criar a empresa do projeto\n\nOdontoRaman Lab · roteiro acadêmico · revisão 3.4 · 18/11/2026\n\nO curso prepara uma proposta de empresa de tecnologia educacional. O protótipo não foi validado para diagnóstico. Nenhum cadastro ou CNPJ é aberto pelo site.\n\n## Programas e materiais\n\nUse o plano editável do site, LibreOffice Calc (cotações e fluxo de caixa), Writer (documentos) e Impress (pitch). Reutilize computador da escola; confira a lista de materiais e cote os serviços necessários à eventual formalização.\n\n'+BUSINESS_STEPS.map((s,i)=>`## ${i+1}. ${s.title}\n\nMeta sugerida: semana ${s.week}.\n\n${s.text}\n\nMateriais: ${s.materials}\n\n${s.steps.map((t,j)=>`${j+1}. ${t}`).join('\n')}\n\nEntrega: ${s.evidence}\n\nFonte: ${BUSINESS_LINKS[s.link]}`).join('\n\n')+'\n\n## Modelo do plano de negócio\n\n'+BUSINESS_FIELDS.map(([,title,help])=>`### ${title}\n\n${help}\n\n[Preencher com decisões e evidências da equipe]`).join('\n\n')+'\n\n## Cálculos\n\nContribuição por unidade = preço × (1 − deduções percentuais/100) − custo variável.\nPonto de equilíbrio = custos fixos mensais ÷ contribuição por unidade, arredondado para cima; exige contribuição positiva.\nResultado mensal simplificado = contribuição × unidades − custos fixos.\nInvestimento + reserva = recursos iniciais previstos. Não subtrair novamente do resultado mensal.\n\nO modelo é um cenário, não lucro contábil ou fluxo de caixa. Registre prazos, financiamento, depreciação e tributos fora das premissas separadamente. Consulte orientação contábil para atividade, registro e tributação.\n\n## Fontes oficiais de abertura e regularização\n\n'+Object.entries(BUSINESS_LINKS).map(([k,v])=>`- ${k}: ${v}`).join('\n')+'\n');
fs.writeFileSync('dados/materiais_modelo.csv',materialsCSV(defaultMaterials()).replaceAll('\r\n','\n'));
fs.writeFileSync('dados/mucosa_sintetica_A.csv',mucosaCSV(simulateMucosa()));
const core=['./','index.html','manifest.webmanifest',...fs.readdirSync('.').filter(x=>/\.(js|css)$/.test(x)&&x!=='sw.js').flatMap(x=>[x,x+'?v='+query]),'assets/favicon.svg','assets/icon-192.png','assets/icon-512.png','assets/icon-maskable.png','assets/circuito.svg','assets/arquitetura.svg','assets/bancada-laser.svg','docs/Projeto_Laser.md','firmware/fotometria/fotometria.ino','dados/mucosa_sintetica_A.csv','dados/ficha_coleta_modelo.csv','docs/Como_Fazer_OdontoRaman.md','docs/Dicionario_Coleta.md','docs/Administracao_Criar_Empresa.md','docs/Protocolo_CEC_Raman.md'];
const revision=createHash('sha256').update(core.map(name=>fs.readFileSync(name.split('?')[0]==='./'?'index.html':name.split('?')[0])).map(b=>b.toString('base64')).join('')).digest('hex').slice(0,12);
const sw=`/* Gerado por scripts/prepare-pwa.mjs. Atualize a versão ao publicar alterações. */
const CACHE='odonto-app-${version}-${revision}';
const CORE=${JSON.stringify(core,null,2)};
const scoped=path=>new URL(path,self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE.map(path=>new Request(scoped(path),{cache:'reload'}))))));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('odonto-app-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url),scope=new URL(self.registration.scope);
 if(req.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 // Somente a entrada do app recebe fallback HTML. Downloads nunca recebem HTML no lugar do arquivo.
 const appEntry=url.pathname===scope.pathname||url.pathname===scope.pathname+'index.html';
 const asset=/\\.(?:js|css|png|svg|pdf|docx|csv|json|md|stl|scad|ino|webmanifest)$/.test(url.pathname);
 if(!appEntry&&!asset)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const key=appEntry?scoped('index.html'):req;
  const cached=await cache.match(key);
  if(cached)return cached;
  // PDFs e outros downloads podem ter um parâmetro de versão no link.
  if(!/\\.(?:js|css)$/.test(url.pathname)){const previous=await cache.match(req,{ignoreSearch:true});if(previous)return previous;}
  try{const response=await fetch(req);if(response.ok&&response.type!=='opaque'){try{await cache.put(key,response.clone());}catch{ /* Sem espaço: a resposta online ainda pode ser entregue. */ }}return response;}
  catch{return new Response('Arquivo não disponível offline. Abra-o com conexão antes da próxima sessão.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
 })());
});
`;
fs.writeFileSync('sw.js',sw);
console.log(`PWA ${version}: ${core.length} recursos locais preparados; guia e modelos exportados.`);
