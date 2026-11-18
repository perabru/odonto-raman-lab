import {RAMAN_GRID,makeSyntheticCohort,parseCohortCSV,analyzeCohort,cohortCSV,cohortReport} from './cec-raman-model.js';

export const cecRamanHTML=[
'<div class="page-heading"><span class="eyebrow">PESQUISA CENTRAL · CÂNCER DA BOCA</span><h1>Raman para investigar câncer bucal</h1><p>Compare assinaturas espectrais da mucosa oral normal e do carcinoma espinocelular (CEC) com métodos estatísticos transparentes.</p></div>',
'<div class="cec-warning" role="note"><b>Pesquisa, não diagnóstico.</b> A histopatologia permanece a referência para confirmar câncer de boca. Nenhum resultado deste site substitui exame clínico, biópsia ou laudo profissional.</div>',
'<div class="cec-hero"><div><span class="tag">FOCO DO TCC</span><h2>Da luz espalhada aos padrões moleculares.</h2><p>Um laser excita a amostra e um espectrômetro mede os pequenos deslocamentos de frequência da luz espalhada. O software compara espectros obtidos de amostras com referência histopatológica, sem declarar que um pico isolado detecta câncer.</p><div class="button-row"><button class="btn primary" type="button" id="cec-go-lab">Explorar os espectros</button><a class="btn secondary" href="docs/Protocolo_CEC_Raman.md" download>Baixar protocolo de pesquisa ↓</a></div></div><div class="cec-hero-equation" aria-label="Caminho óptico Raman"><span>LASER</span><i>→</i><span>TECIDO</span><i>→</i><span>FILTRO</span><i>→</i><span>ESPECTRÔMETRO</span><i>→</i><span>CSV + PWA</span></div></div>',
'<div class="cec-columns"><article class="card"><span class="eyebrow">1. ELETRÔNICA E ÓPTICA</span><h3>Obter Raman de verdade</h3><p>Fonte laser especificada, óptica de coleta, filtro de rejeição Rayleigh, dispersão espectral, detector compatível, calibração e contenção física. A bancada ESP32 + OPT101 existente mede intensidade/transmissão; <strong>não produz espectros Raman</strong>.</p><a href="#laser" class="text-link">Ver bancada didática e limitações</a></article>',
'<article class="card"><span class="eyebrow">2. ANÁLISES CLÍNICAS</span><h3>Referência independente</h3><p>A pesquisa compara mucosa normal e carcinoma espinocelular confirmados por histopatologia, sob supervisão de laboratório e aprovação ética aplicável. Trabalhar inicialmente com dados sintéticos e amostras-padrão não biológicas.</p><a href="docs/Furuse_2006_FT_Raman_Mucosa.pdf" class="text-link" download>Ler estudo de Furuse (2006) ↓</a></article>',
'<article class="card"><span class="eyebrow">3. INFORMÁTICA</span><h3>PWA + análise por paciente</h3><p>Importe espectros em CSV pseudonimizados, corrija um fundo simples, normalize, compare quatro regiões didáticas e execute avaliação cruzada sem misturar replicatas do mesmo paciente nos conjuntos de treino e teste.</p><a href="#coleta" class="text-link">Abrir fichas de coleta da PWA</a></article>',
'<article class="card"><span class="eyebrow">4. ADMINISTRAÇÃO E INIC</span><h3>Transformar em projeto viável</h3><p>Registre custos de instrumentação e laboratório, monte a empresa fictícia, planeje cronograma e escreva resultados com limitações claras, separando testes educacionais da pesquisa real.</p><a href="#administracao" class="text-link">Abrir plano de negócios</a> · <a href="#inic" class="text-link">Escrever artigo INIC</a></article></div>',
'<section class="card cec-lab-card" id="cec-lab"><div class="cec-card-top"><div><span class="eyebrow">LABORATÓRIO DE COMPARAÇÃO</span><h2>Espectros Raman e grupos histopatológicos</h2><p>O exemplo já abre com dados gerados matematicamente. Substitua somente por espectros de equipamento Raman real com rótulos de referência auditáveis.</p></div><span class="cec-source-pill" id="cec-source">DADOS SINTÉTICOS</span></div>',
'<div class="cec-action-bar"><button class="btn primary" id="cec-load-demo">Usar demonstração</button><label class="btn secondary cec-upload">Importar conjunto CSV<input id="cec-file" type="file" accept=".csv,text/csv" hidden></label><button class="btn secondary" id="cec-download-demo">Baixar CSV de exemplo</button><button class="btn secondary" id="cec-download-report">Relatório JSON ↓</button></div>',
'<div class="cec-status" id="cec-status" role="status" aria-live="polite">Preparando simulação.</div><div id="cec-kpis" class="cec-kpis" aria-label="Resumo dos dados"></div>',
'<div class="cec-figures"><div class="cec-figure"><h3>Curvas médias normalizadas</h3><p>Uma curva média por grupo, atribuindo o mesmo peso a cada paciente.</p><div id="cec-spectra-plot" class="cec-chart" role="img" aria-label="Gráfico comparativo dos espectros"></div><div class="cec-legend"><span><i class="cec-dot normal"></i> Mucosa normal</span><span><i class="cec-dot cec"></i> CEC</span></div></div><div class="cec-figure"><h3>PCA exploratória</h3><p>Projeção descritiva das quatro regiões espectrais, sem classificação clínica.</p><div id="cec-pca-plot" class="cec-chart" role="img" aria-label="Projeção PCA dos participantes"></div><div class="cec-legend"><span><i class="cec-dot normal"></i> Normal</span><span><i class="cec-dot cec"></i> CEC</span></div></div></div>',
'<div class="cec-evaluation"><div><span class="eyebrow">AVALIAÇÃO INTERNA · DEIXE UM PACIENTE DE FORA</span><h3>Separação sem vazamento entre replicatas</h3><p>Um classificador simples compara perfis multivariados e exclui todas as medições do paciente avaliado do treinamento. Esses números descrevem somente o conjunto carregado; não demonstram desempenho em pacientes novos.</p></div><div id="cec-confusion" class="cec-confusion" aria-label="Matriz de confusão"></div></div>',
'<p id="cec-limitation" class="cec-disclaimer"></p></section>',
'<section class="cec-columns cec-final"><article class="card"><span class="eyebrow">COMO FAZER · PROTOCOLO</span><h2>Sequência de pesquisa</h2><ol><li>Definir objetivo: diferença entre mucosa normal e CEC, não rastreamento automático.</li><li>Estabelecer laboratório parceiro, instrumentos e critérios de segurança óptica.</li><li>Obter aprovação ética e referência histopatológica antes de qualquer dado humano.</li><li>Medir padrões não biológicos, calibrar e registrar escuro, referência e parâmetros do Raman.</li><li>Coletar/receber espectros codificados; não inserir nomes de pacientes.</li><li>Importar CSV na PWA e verificar qualidade, classes e replicatas.</li><li>Avaliar por paciente, relatar limitações, escrever o INIC e a monografia.</li></ol><a href="docs/Protocolo_CEC_Raman.md" download class="btn secondary">Protocolo completo ↓</a></article>',
'<article class="card"><span class="eyebrow">ESTUDO DE REFERÊNCIA</span><h2>Furuse (2006)</h2><p>A tese estudou FT-Raman de carcinoma espinocelular da mucosa bucal e mucosa normal, com laser Nd:YAG de 1064 nm, espectrômetro Bruker RFS 100/S e PCA. As 81 amostras neoplásicas e 48 normais não representam 129 participantes independentes: foram 26 e 18 pacientes, respectivamente.</p><p>O sistema atual não reproduz automaticamente o instrumento, o protocolo nem a validação daquele estudo. A simulação do site não é uma reconstrução dos dados da tese.</p><div class="button-row"><a href="docs/Furuse_2006_FT_Raman_Mucosa.pdf" class="btn secondary" download>Tese original ↓</a><a href="docs/Modelo_INIC_2025_Limpo.docx" class="btn secondary" download>Modelo INIC ↓</a><a href="docs/Manual_Monografia_UNIVAP.pdf" class="btn secondary" download>Manual Univap ↓</a></div></article></section>'
].join('');

function saveFile(name,body,type){
 const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
const fmt=n=>(n*100).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
function spectrumSVG(stats){
 const left=55,right=810,top=24,bottom=290,w=840,h=325;
 const all=[...stats.means.normal,...stats.means.cec],limit=Math.max(1e-8,...all)*1.13;
 const X=i=>left+i/(RAMAN_GRID.length-1)*(right-left);
 const Y=v=>bottom-v/limit*(bottom-top);
 const trace=(a,color)=>'<path d="'+a.map((v,i)=>(i?'L':'M')+X(i).toFixed(2)+','+Y(v).toFixed(2)).join('')+'" fill="none" stroke="'+color+'" stroke-width="2.7" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';
 const grid=[0,1,2,3,4].map(j=>{
  const y=top+(bottom-top)*j/4;return '<line x1="'+left+'" y1="'+y+'" x2="'+right+'" y2="'+y+'" stroke="#dce8e3" stroke-dasharray="3 5"/>';
 }).join('');
 const marks=[800,1000,1200,1400,1600,1800].map(n=>'<text x="'+X((n-800)/5)+'" y="309" text-anchor="middle" font-size="13">'+n+'</text>').join('');
 return '<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Curvas médias normalizadas dos grupos"><g fill="#59726a" font-family="Arial">'+grid+marks+'<text x="420" y="324" text-anchor="middle" font-size="12">Deslocamento Raman (cm⁻¹)</text></g>'+trace(stats.means.normal,'#118b75')+trace(stats.means.cec,'#d17658')+'</svg>';
}
function pcaSVG(stats){
 const x=stats.pca.map(p=>p.pc1),y=stats.pca.map(p=>p.pc2);
 const maxX=Math.max(1,...x.map(Math.abs))*1.15,maxY=Math.max(1,...y.map(Math.abs))*1.15;
 const X=v=>420+v/maxX*350,Y=v=>162-v/maxY*130;
 const dots=stats.pca.map(p=>'<circle cx="'+X(p.pc1).toFixed(2)+'" cy="'+Y(p.pc2).toFixed(2)+'" r="6" fill="'+(p.reference==='cec'?'#d17658':'#118b75')+'" fill-opacity=".78" stroke="white" stroke-width="1.5"><title>Participante codificado '+p.patient+' · '+(p.reference==='cec'?'CEC':'normal')+'</title></circle>').join('');
 return '<svg viewBox="0 0 840 325" role="img" aria-label="PCA descritiva por participante"><line x1="55" y1="162" x2="807" y2="162" stroke="#aabbb4"/><line x1="420" y1="25" x2="420" y2="290" stroke="#aabbb4"/><g fill="#59726a" font-family="Arial" font-size="13"><text x="780" y="150">PC1</text><text x="430" y="28">PC2</text><text x="420" y="318" text-anchor="middle">Projeção das quatro regiões didáticas</text></g>'+dots+'</svg>';
}
function confusionHTML(stats){
 const c=stats.confusion;
 return '<table><caption>Resultado interno LOPO (contagens)</caption><thead><tr><th>Referência / previsão</th><th>CEC</th><th>Normal</th></tr></thead><tbody>'+
 '<tr><th>CEC</th><td>'+c.tp+'</td><td>'+c.fn+'</td></tr><tr><th>Normal</th><td>'+c.fp+'</td><td>'+c.tn+'</td></tr></tbody></table>';
}
export function initCECRaman(){
 const $=s=>document.querySelector(s);if(!$('#cec-load-demo'))return;
 let cohort=makeSyntheticCohort(),stats=null;
 function render(){
  try{
   stats=analyzeCohort(cohort);
   $('#cec-source').textContent=cohort.source==='sintetico'?'DADOS SINTÉTICOS':'CSV IMPORTADO · RÓTULOS NÃO VERIFICADOS';
   $('#cec-source').classList.toggle('imported',cohort.source==='importado');
   $('#cec-kpis').innerHTML=[
    ['Participantes',stats.patients],['Espectros',stats.spectra],['Referência normal',stats.nNormal],
    ['Referência CEC',stats.nCEC],['Sensibilidade interna',fmt(stats.sensitivity)],['Especificidade interna',fmt(stats.specificity)]
   ].map(v=>'<div><small>'+v[0]+'</small><strong>'+v[1]+'</strong></div>').join('');
   $('#cec-spectra-plot').innerHTML=spectrumSVG(stats);$('#cec-pca-plot').innerHTML=pcaSVG(stats);
   $('#cec-confusion').innerHTML=confusionHTML(stats);
   $('#cec-status').textContent=cohort.source==='sintetico'?'Demonstração matemática: 30 participantes fictícios e 2 espectros por participante.':'Conjunto importado processado apenas neste navegador. Verifique a origem, a referência histopatológica e a aprovação ética.';
   $('#cec-status').classList.remove('error');
   $('#cec-limitation').textContent=stats.note+' A PCA é descritiva; a validação por paciente usa centróides calculados apenas a partir dos participantes de treinamento em cada rodada.';
   $('#cec-download-report').disabled=false;
  }catch(e){
   stats=null;$('#cec-status').textContent=e.message;$('#cec-status').classList.add('error');$('#cec-download-report').disabled=true;
   ['cec-kpis','cec-spectra-plot','cec-pca-plot','cec-confusion'].forEach(id=>$('#'+id).replaceChildren());
   $('#cec-limitation').textContent='Corrija as entradas antes de interpretar o conjunto.';
  }
 }
 $('#cec-go-lab').onclick=()=>$('#cec-lab').scrollIntoView({behavior:'smooth',block:'start'});
 $('#cec-load-demo').onclick=()=>{cohort=makeSyntheticCohort();render();};
 $('#cec-download-demo').onclick=()=>saveFile('odonto_cec_raman_EXEMPLO_SINTETICO.csv',cohortCSV(makeSyntheticCohort()),'text/csv;charset=utf-8');
 $('#cec-download-report').onclick=()=>{if(stats)saveFile('odonto_cec_raman_relatorio_'+cohort.source+'.json',JSON.stringify(cohortReport(cohort,stats),null,2),'application/json');};
 $('#cec-file').onchange=async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try{
   if(file.size>10000000)throw Error('Arquivo maior que 10 MB.');
   const incoming=parseCohortCSV(await file.text());
   analyzeCohort(incoming);cohort=incoming;render();
   $('#cec-status').textContent+=' Arquivo: '+file.name.slice(0,100)+'.';
  }catch(e){$('#cec-status').textContent='Importação recusada: '+e.message+' O conjunto anterior foi preservado.';$('#cec-status').classList.add('error');}
  finally{event.target.value='';}
 };
 render();
}
