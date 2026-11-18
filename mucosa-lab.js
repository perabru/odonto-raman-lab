import {gaussian, baseline, movingAverage, feature, parseCSV} from './spectra.js';

export const MUCOSA_BANDS = [
 {center:1004,window:[980,1030],label:'Região de 1004',description:'Um pico estreito ajuda a observar como ruído e suavização mudam a posição e a largura estimadas.'},
 {center:1245,window:[1200,1300],label:'Região de 1245',description:'Uma banda mais larga permite comparar a área com a altura. Os valores dependem da janela escolhida.'},
 {center:1450,window:[1400,1500],label:'Região de 1450',description:'A tese normalizou os espectros em 1450 cm⁻¹ (p. 40). Aqui, a opção 1450 divide pelo máximo encontrado entre 1420 e 1480 cm⁻¹.'},
 {center:1655,window:[1600,1710],label:'Região de 1655',description:'Bandas largas podem reunir contribuições sobrepostas. Um máximo local não identifica sozinho uma doença.'}
];
export function simulateMucosa({scenario='A',noise=8,background=35,seed=71}={}) {
 let state=seed>>>0; const random=()=>((state=(1664525*state+1013904223)>>>0)/4294967296);
 const settings=scenario==='B'?[95,100,215,135]:[120,150,180,190],x=[],y=[];
 for(let n=800;n<=1800;n+=2){
  const signal=gaussian(n,1004,settings[0],8)+gaussian(n,1245,settings[1],22)+gaussian(n,1450,settings[2],23)+gaussian(n,1655,settings[3],29)+gaussian(n,1125,45,16)+gaussian(n,1335,42,19);
  x.push(n);y.push(signal+background*(1+.0008*(n-800))+(random()+random()+random()-1.5)*noise);
 }
 return {x,y,source:'simulado',scenario,noise,background,seed};
}
export function processMucosa(data,{correct=true,smooth=false,norm='1450'}={}) {
 const {x}=data;if(!Array.isArray(x)||x.length<20||x.length!==data.y.length)throw Error('O espectro precisa de pelo menos 20 pares válidos.');
 if(x.some((v,i)=>!Number.isFinite(v)||(i&&v<=x[i-1]))||data.y.some(v=>!Number.isFinite(v)))throw Error('Use deslocamentos crescentes e intensidades numéricas.');
 const steps=x.slice(1).map((v,i)=>v-x[i]),step=(x.at(-1)-x[0])/(x.length-1),uniform=steps.every(v=>Math.abs(v-step)<=.05*step);
 if(smooth&&!uniform)throw Error('Suavização exige espaçamento uniforme. Desmarque essa opção ou reamostre no software do laboratório.');
 const b=correct?baseline(x,data.y):x.map(()=>0);let y=data.y.map((v,i)=>v-b[i]);if(smooth)y=movingAverage(y,3);
 if(!['none','max','1450'].includes(norm))throw Error('Normalização desconhecida.');
 let factor=1;
 if(norm==='max')factor=Math.max(...y);
 if(norm==='1450'){
  if(x[0]>1420||x.at(-1)<1480)throw Error('O CSV não cobre 1420–1480 cm⁻¹. Escolha outra normalização.');
  factor=Math.max(...y.filter((_,i)=>x[i]>=1420&&x[i]<=1480));
 }
 if(factor<=1e-10)throw Error('Não há sinal positivo para normalizar. Escolha “Sem normalizar”.');
 if(norm!=='none')y=y.map(v=>v/factor);
 return {x,y,b,factor,uniform,maxStep:Math.max(...steps),options:{correct,smooth,norm},features:MUCOSA_BANDS.map(band=>feature(x,y,band.window))};
}
const csvNumber=n=>Number(n.toFixed(8));
export function mucosaCSV(raw,processed=null) {
 const metadata={source:raw.source,filename:raw.filename||null,scenario:raw.scenario||null,simulation:raw.source==='simulado'?{noise:raw.noise,background:raw.background,seed:raw.seed}:null,processing:processed?.options||null,normalization_factor:processed?.factor||null,clinical_interpretation:false};
 return '# OdontoRaman Lab | mucosa bucal | sem classificação clínica\n# '+JSON.stringify(metadata)+'\n'+(processed?'shift_cm-1,intensity_raw,intensity_processed':'shift_cm-1,intensity')+'\n'+raw.x.map((v,i)=>[v,raw.y[i],...(processed?[processed.y[i]]:[])].map(csvNumber).join(',')).join('\n')+'\n';
}
export function mucosaReport(raw,processed) {
 return {project:'OdontoRaman Lab',topic:'FT-Raman e carcinoma espinocelular da mucosa bucal',created_at:new Date().toISOString(),source:raw.source,filename:raw.filename||null,simulation:raw.source==='simulado'?{scenario:raw.scenario,noise:raw.noise,background:raw.background,seed:raw.seed}:null,points:raw.x.length,range_cm1:[raw.x[0],raw.x.at(-1)],duplicates_averaged:raw.duplicates||0,processing:processed.options,normalization_factor:processed.factor,uniform_spacing:processed.uniform,max_spacing_cm1:processed.maxStep,measurements:MUCOSA_BANDS.map((b,i)=>({region_cm1:b.center,window_cm1:b.window,...processed.features[i]})),clinical_interpretation:false,limitations:'Cenários sintéticos não representam classes clínicas. Métricas exploratórias; sem PCA, classificador ou conclusão diagnóstica. Área medida após subtração da reta entre extremos de cada janela. Normalização 1450 usa máximo local de 1420–1480 cm-1.'};
}

export const mucosaLabHTML=`<div class="page-heading"><span class="eyebrow">SOFTWARE / MUCOSA BUCAL</span><h1>Analise uma curva Raman.</h1><p>Escolha um exemplo, ajuste o processamento e examine uma região do espectro.</p></div>
<div class="mucosa-notice"><b>O que esta atividade demonstra</b><p>Os cenários A e B são curvas matemáticas para testar o software. Não representam pacientes nem curvas clínicas de normalidade ou câncer.</p></div>
<div class="mucosa-workflow"><button data-ml-step="0" class="active" aria-pressed="true"><b>1</b> Escolher dados</button><button data-ml-step="1" aria-pressed="false"><b>2</b> Processar</button><button data-ml-step="2" aria-pressed="false"><b>3</b> Ler e exportar</button></div>
<p id="ml-guidance" class="mucosa-guidance" role="status">Comece pelo cenário A. Depois compare com B ou importe um CSV do laboratório.</p>
<div class="mucosa-layout"><aside class="mucosa-controls card">
 <h2>Dados de entrada</h2><div class="mucosa-presets"><button class="active" data-ml-preset="A" aria-pressed="true">Cenário A</button><button data-ml-preset="B" aria-pressed="false">Cenário B</button><button data-ml-preset="noise" aria-pressed="false">Com ruído</button></div>
 <label class="ml-file-label" for="ml-file">Importar CSV <input id="ml-file" type="file" accept=".csv,.txt,text/csv,text/plain"></label><p class="caption">Duas colunas: deslocamento em cm⁻¹ e intensidade. Até 2 MB. O arquivo fica neste navegador.</p>
 <div id="ml-synthetic-controls"><label for="ml-noise">Ruído <output id="ml-noise-value">8</output></label><input id="ml-noise" type="range" min="0" max="100" value="8"><label for="ml-background">Fundo <output id="ml-background-value">35</output></label><input id="ml-background" type="range" min="0" max="200" value="35"></div>
 <button id="ml-reset" class="btn secondary full">Voltar ao exemplo A</button>
 <h2 class="ml-process-heading">Processamento</h2><label class="check"><input id="ml-correct" type="checkbox" checked> Remover linha de base</label><label class="check"><input id="ml-smooth" type="checkbox"> Suavizar 3 pontos</label><label for="ml-normalize">Normalização</label><select id="ml-normalize"><option value="1450">Pico em torno de 1450</option><option value="max">Máximo do espectro</option><option value="none">Sem normalizar</option></select>
 <label class="check ml-compare"><input id="ml-compare" type="checkbox"> Comparar com exemplo B</label><p class="caption">A comparação usa dados sintéticos e o mesmo processamento.</p>
</aside><div class="mucosa-results"><div class="card mucosa-plot-card"><div class="mucosa-plot-heading"><div><span id="ml-source" class="tag">DADOS SINTÉTICOS</span><h2 id="ml-chart-title">Cenário A</h2></div><span class="caption">800–1800 cm⁻¹ no exemplo</span></div><div id="ml-plot" tabindex="0" aria-label="Gráfico do espectro. Use os botões abaixo para selecionar uma região."></div><p id="ml-cursor" class="caption">Mova o cursor ou toque na curva para ler um ponto.</p><div class="mucosa-legend"><span class="ml-raw">Bruto</span><span class="ml-processed">Processado</span><span id="ml-compare-key" class="ml-comparison" hidden>Exemplo B processado</span></div><p id="ml-message" class="caption" role="status"></p></div>
 <div class="mucosa-band-buttons">${MUCOSA_BANDS.map((b,i)=>`<button data-ml-band="${i}" class="${i===2?'active':''}" aria-pressed="${i===2}">${b.center} <small>cm⁻¹</small></button>`).join('')}</div>
 <div class="mucosa-band-story"><h3 id="ml-band-title">Região de 1450 cm⁻¹</h3><p id="ml-band-description"></p></div><div id="ml-metrics" class="mucosa-metrics"></div>
 <div class="button-row mucosa-exports"><button id="ml-export-raw" class="btn secondary">CSV bruto ↓</button><button id="ml-export-processed" class="btn primary">CSV processado ↓</button><button id="ml-export-report" class="btn secondary">Relatório JSON ↓</button></div><p class="caption">O CSV bruto pode ser reimportado. O processado tem três colunas para auditoria; o JSON registra os parâmetros.</p></div></div>
<details class="card spaced"><summary>Como esta atividade se relaciona com a tese</summary><p>Furuse (2006, p. 40–43) analisou a região de 800 a 1800 cm⁻¹, normalizou em 1450 cm⁻¹ e empregou análise de componentes principais (PCA). Esta atividade ensina leitura e processamento de curvas; não reproduz a PCA nem a separação de grupos relatada no trabalho.</p><p>As quatro regiões selecionáveis são referências de navegação do exemplo matemático, sem atribuição molecular automática. As janelas foram escolhidas para ensino. A área é calculada por trapézios depois de descontar a reta entre os extremos da janela; a largura é a distância entre os cruzamentos com metade da altura. Sobreposição de bandas e resolução alteram essas estimativas.</p><p>Para comparar amostras reais, registre origem, equipamento, parâmetros e referência histopatológica com o laboratório. Espectros repetidos de uma mesma amostra não são pacientes independentes. O software não fornece diagnóstico.</p><a href="#proposta" class="text-link">Ler o recorte do projeto</a></details>`;

export function initMucosaLab(){
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];if(!$('#ml-plot'))return;
 let raw=simulateMucosa(),processed=null,bandIndex=2,preset='A';
 const n=(v,d=2)=>Number.isFinite(v)?v.toLocaleString('pt-BR',{maximumFractionDigits:d}):'—';
 const options=()=>({correct:$('#ml-correct').checked,smooth:$('#ml-smooth').checked,norm:$('#ml-normalize').value});
 const save=(name,value,type)=>{const u=URL.createObjectURL(new Blob([value],{type})),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);};
 function renderMetrics(){
  const band=MUCOSA_BANDS[bandIndex],f=processed?.features[bandIndex];$('#ml-band-title').textContent=band.label+' cm⁻¹';$('#ml-band-description').textContent=band.description;
  $('#ml-metrics').innerHTML=[['Máximo local',f?.position,'cm⁻¹'],['Área da janela',f?.area,processed?.options.norm==='none'?'u.a. × cm⁻¹':'intensidade normalizada × cm⁻¹'],['Largura à meia altura',f?.fwhm,'cm⁻¹']].map(([a,b,c])=>`<div><span>${a}</span><b>${n(b)}</b><small>${c}</small></div>`).join('');
 }
 function plot(comparison){
  const w=840,h=380,pad={left:64,right:22,top:25,bottom:56},x0=raw.x[0],x1=raw.x.at(-1),displayRaw=raw.y.map(v=>v/processed.factor);
  const visibleComparison=comparison?comparison.y.filter((_,i)=>comparison.x[i]>=x0&&comparison.x[i]<=x1):[];
  const all=[...displayRaw,...processed.y,...visibleComparison];let y0=Math.min(0,...all),y1=Math.max(...all);if(y0===y1)y1=y0+1;y1+=(y1-y0)*.12;
  const X=v=>pad.left+(v-x0)/(x1-x0)*(w-pad.left-pad.right),Y=v=>h-pad.bottom-(v-y0)/(y1-y0)*(h-pad.top-pad.bottom);
  const path=(xs,ys)=>xs.map((v,i)=>`${i?'L':'M'}${X(v).toFixed(2)},${Y(ys[i]).toFixed(2)}`).join('');
  let grid='';for(let i=0;i<=4;i++){const v=y0+(y1-y0)*i/4;grid+=`<line x1="${pad.left}" x2="${w-pad.right}" y1="${Y(v)}" y2="${Y(v)}" stroke="#e3e9e4"/><text x="${pad.left-10}" y="${Y(v)+4}" text-anchor="end">${n(v,y1<10?2:0)}</text>`;}
  for(let i=0;i<=5;i++){const v=x0+(x1-x0)*i/5;grid+=`<text x="${X(v)}" y="${h-pad.bottom+24}" text-anchor="middle">${n(v,0)}</text>`;}
  const b=MUCOSA_BANDS[bandIndex],left=Math.max(b.window[0],x0),right=Math.min(b.window[1],x1),region=left<right?`<rect x="${X(left)}" y="${pad.top}" width="${X(right)-X(left)}" height="${h-pad.top-pad.bottom}" fill="#e6efe9"/>`:'';
  $('#ml-plot').innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Espectro ${raw.source==='simulado'?'sintético':'importado'} de intensidade por deslocamento Raman"><defs><clipPath id="ml-clip"><rect x="${pad.left}" y="${pad.top}" width="${w-pad.left-pad.right}" height="${h-pad.top-pad.bottom}"/></clipPath></defs><g class="mucosa-plot-text">${region}${grid}<g clip-path="url(#ml-clip)"><path d="${path(raw.x,displayRaw)}" stroke="#abb7b1" fill="none" stroke-width="1.7"/><path d="${path(raw.x,processed.y)}" stroke="#136c58" fill="none" stroke-width="2.7"/>${comparison?`<path d="${path(comparison.x,comparison.y)}" stroke="#bb754e" fill="none" stroke-width="2" stroke-dasharray="7 4"/>`:''}<circle id="ml-point" cx="-10" cy="-10" r="4" fill="#136c58"/></g><text x="${w/2}" y="${h-6}" text-anchor="middle">Deslocamento Raman (cm⁻¹)</text><text transform="translate(15 ${h/2}) rotate(-90)" text-anchor="middle">${processed.options.norm==='none'?'Intensidade (u.a.)':'Intensidade normalizada'}</text></g></svg>`;
  const svg=$('#ml-plot svg');svg.addEventListener('pointermove',e=>{const rect=svg.getBoundingClientRect(),q=x0+((e.clientX-rect.left)/rect.width*w-pad.left)/(w-pad.left-pad.right)*(x1-x0);let i=0;for(let j=1;j<raw.x.length;j++)if(Math.abs(raw.x[j]-q)<Math.abs(raw.x[i]-q))i=j;$('#ml-cursor').textContent=`${n(raw.x[i],1)} cm⁻¹ · ${n(processed.y[i],4)} ${processed.options.norm==='none'?'u.a.':'(normalizada)'}`;$('#ml-point').setAttribute('cx',X(raw.x[i]));$('#ml-point').setAttribute('cy',Y(processed.y[i]));});
 }
 function render(){
  $('#ml-noise-value').textContent=$('#ml-noise').value;$('#ml-background-value').textContent=$('#ml-background').value;
  $('#ml-synthetic-controls').hidden=raw.source!=='simulado';$('#ml-source').textContent=raw.source==='simulado'?'DADOS SINTÉTICOS':'CSV IMPORTADO';$('#ml-chart-title').textContent=raw.source==='simulado'?`Cenário ${raw.scenario}`:raw.filename;
  $$('[data-ml-preset]').forEach(b=>{const active=raw.source==='simulado'&&b.dataset.mlPreset===preset;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
  try{
   processed=processMucosa(raw,options());const comparison=$('#ml-compare').checked?processMucosa(simulateMucosa({scenario:'B',noise:0,background:0}),options()):null;plot(comparison);renderMetrics();$('#ml-compare-key').hidden=!comparison;
   const messages=[raw.source==='simulado'?'Curva gerada por gaussianas; sem dados de pacientes.':'CSV importado. Confirme a procedência e as condições de aquisição.'];
   if(raw.duplicates)messages.push(`${raw.duplicates} deslocamento(s) duplicado(s) agregado(s) pela média.`);
   if(processed.options.norm!=='none')messages.push('Bruto e processado usam o mesmo divisor.');
   if(processed.maxStep>5)messages.push('Espaçamento maior que 5 cm⁻¹: largura e posição exigem cautela.');
   if(processed.features.some(f=>!f))messages.push('Uma ou mais regiões não estão cobertas por pontos suficientes.');
   if(!processed.uniform)messages.push('Eixo irregular: integração considera as distâncias reais.');
   $('#ml-message').textContent=messages.join(' ');$('#ml-message').classList.remove('error');$('#ml-export-processed').disabled=false;$('#ml-export-report').disabled=false;
  }catch(e){processed=null;$('#ml-plot').replaceChildren();renderMetrics();$('#ml-message').textContent=e.message;$('#ml-message').classList.add('error');$('#ml-export-processed').disabled=true;$('#ml-export-report').disabled=true;}
 }
 function setScenario(scenario,noise=8,background=35){preset=scenario;$('#ml-noise').value=noise;$('#ml-background').value=background;raw=simulateMucosa({scenario:scenario==='B'?'B':'A',noise,background});render();}
 $$('[data-ml-preset]').forEach(b=>b.onclick=()=>setScenario(b.dataset.mlPreset,b.dataset.mlPreset==='noise'?80:8));
 ['ml-noise','ml-background'].forEach(id=>$('#'+id).oninput=()=>{if(raw.source==='simulado'){raw=simulateMucosa({scenario:raw.scenario,noise:+$('#ml-noise').value,background:+$('#ml-background').value});render();}});
 ['ml-correct','ml-smooth','ml-normalize','ml-compare'].forEach(id=>$('#'+id).onchange=render);
 $('#ml-reset').onclick=()=>{$('#ml-correct').checked=true;$('#ml-smooth').checked=false;$('#ml-normalize').value='1450';$('#ml-compare').checked=false;setScenario('A');};
 $('#ml-file').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>2_000_000)throw Error('O limite de arquivo é 2 MB.');const imported=parseCSV(await file.text());raw={...imported,source:'importado',filename:file.name.slice(0,200)};$('#ml-normalize').value='none';$('#ml-smooth').checked=false;$('#ml-compare').checked=false;render();}catch(error){$('#ml-message').textContent='Importação recusada: '+error.message+' A curva anterior foi preservada.';$('#ml-message').classList.add('error');}finally{e.target.value='';}};
 $$('[data-ml-band]').forEach(button=>button.onclick=()=>{bandIndex=+button.dataset.mlBand;$$('[data-ml-band]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button);});render();});
 const instructions=['Comece pelo cenário A. Depois compare com B ou importe um CSV do laboratório.','Marque a correção de fundo e escolha a normalização. Ative a suavização para observar seu efeito nos picos.','Selecione uma região, registre a área e a largura e exporte os dados com os parâmetros usados.'];
 $$('[data-ml-step]').forEach(button=>button.onclick=()=>{$$('[data-ml-step]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button);});$('#ml-guidance').textContent=instructions[+button.dataset.mlStep];const target=button.dataset.mlStep==='0'?$('#ml-file'):button.dataset.mlStep==='1'?$('#ml-correct'):$$('[data-ml-band]')[bandIndex];target.focus({preventScroll:true});});
 $('#ml-export-raw').onclick=()=>save('mucosa_'+(raw.source==='simulado'?'sintetica':'importada')+'_bruto.csv',mucosaCSV(raw),'text/csv;charset=utf-8');
 $('#ml-export-processed').onclick=()=>{if(processed)save('mucosa_processada.csv',mucosaCSV(raw,processed),'text/csv;charset=utf-8');};
 $('#ml-export-report').onclick=()=>{if(processed)save('mucosa_relatorio.json',JSON.stringify(mucosaReport(raw,processed),null,2),'application/json');};
 render();
}
