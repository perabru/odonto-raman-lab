/* OdontoRaman: análise exploratória de espectros Raman de mucosa bucal.
   NÃO é dispositivo médico nem fornece diagnóstico individual. */
export const RAMAN_GRID=Array.from({length:201},(_,i)=>800+5*i);
export const RAMAN_WINDOWS=[
  {name:"1004 cm⁻¹",lo:980,hi:1030},
  {name:"1245 cm⁻¹",lo:1200,hi:1300},
  {name:"1450 cm⁻¹",lo:1400,hi:1500},
  {name:"1655 cm⁻¹",lo:1600,hi:1710}
];
const avg=a=>a.reduce((s,v)=>s+v,0)/a.length;
const round=(n,d=5)=>Number(n.toFixed(d));
function assert(cond,msg){if(!cond)throw Error(msg);}
function gauss(x,c,a,s){return a*Math.exp(-.5*((x-c)/s)**2);}
function randomSource(seed=76){let s=seed>>>0;return ()=>((s=(1664525*s+1013904223)>>>0)/4294967296);}
export function makeSyntheticCohort(){
 const rand=randomSource(2287),samples=[];
 for(let p=0;p<30;p++){
  const reference=p<15?"normal":"cec",patient="DEMO"+String(p+1).padStart(3,"0"),variation=.82+rand()*.36;
  for(let r=1;r<=2;r++){
   const x=RAMAN_GRID.slice(),y=x.map(n=>{
    const amplitudes=reference==="cec"?[93,92,160,126]:[124,145,181,190];
    const signal=gauss(n,1004,amplitudes[0]*variation,10)+gauss(n,1245,amplitudes[1]*variation,25)+gauss(n,1450,amplitudes[2]*variation,26)+gauss(n,1655,amplitudes[3]*variation,30)+gauss(n,1115,46,17)+gauss(n,1340,44,21);
    return round(signal+25+.025*(n-800)+(rand()+rand()+rand()-1.5)*12,5);
   });
   samples.push({patient,sample:patient+"-R"+r,reference,x,y});
  }
 }
 return {source:"sintetico",samples,origin:"Gaussiana didática; classes simuladas, nenhum paciente real."};
}
const CODE=/^[A-Za-z0-9_-]{3,32}$/;
export function parseCohortCSV(csv){
 assert(typeof csv==="string"&&csv.length<=10000000,"O arquivo deve ter até 10 MB.");
 const lines=csv.replace(/^\uFEFF/,"").split(/\r?\n/).map(v=>v.trim()).filter(v=>v&&!v.startsWith("#"));
 assert(lines.length>1,"Arquivo vazio: use o modelo CSV com cabeçalho.");
 const sep=lines[0].includes(";")?";":lines[0].includes("\t")?"\t":",";
 const header=lines.shift().split(sep).map(s=>s.toLowerCase().replace(/^\s*["']?|["']?\s*$/g,"").trim());
 const names=["patient_code","sample_code","reference","shift_cm-1","intensity"],ix=names.map(n=>header.indexOf(n));
 assert(ix.every(i=>i>=0),"Cabeçalho obrigatório: "+names.join(", "));
 assert(header.length===names.length,"Use exatamente as cinco colunas do modelo CSV.");
 assert(lines.length<=120000,"Limite de 120 mil linhas.");
 const groups=new Map(),patients=new Map();
 lines.forEach((line,i)=>{
  const col=line.split(sep).map(v=>v.trim().replace(/^"|"$/g,""));
  assert(col.length===5,"Linha "+(i+2)+": número incorreto de colunas.");
  const [patient,sample,reference,shiftRaw,intensityRaw]=ix.map(j=>col[j]);
  assert(CODE.test(patient)&&CODE.test(sample),"Linha "+(i+2)+": IDs pseudonimizados (3–32 caracteres, somente letras, números, _ e -).");
  assert(["normal","cec"].includes(reference),"Linha "+(i+2)+": reference deve ser normal ou cec (conforme laudo informado).");
  if(patients.has(patient))assert(patients.get(patient)===reference,"Um mesmo paciente não pode ter duas referências distintas.");
  patients.set(patient,reference);
  const number=s=>Number(sep===";"?s.replace(",","."):s);
  const shift=number(shiftRaw),intensity=number(intensityRaw);
  assert(shiftRaw!==""&&intensityRaw!==""&&Number.isFinite(shift)&&Number.isFinite(intensity),"Linha "+(i+2)+": deslocamento/intensidade inválidos.");
  assert(shift>=0&&shift<=4000&&Math.abs(intensity)<1e9,"Linha "+(i+2)+": valor fora do intervalo permitido.");
  if(!groups.has(sample))groups.set(sample,{patient,sample,reference,x:[],y:[]});
  const g=groups.get(sample);
  assert(g.patient===patient&&g.reference===reference,"Código de amostra associado a pacientes ou referências diferentes.");
  g.x.push(shift);g.y.push(intensity);
 });
 assert(groups.size<=500,"Limite de 500 espectros.");
 const samples=[...groups.values()];
 samples.forEach(s=>{
  assert(s.x.length>=60&&s.x.length<=10000,"Amostra "+s.sample+": exige 60–10.000 pontos.");
  const pairs=s.x.map((x,i)=>[x,s.y[i]]).sort((a,b)=>a[0]-b[0]);
  s.x=pairs.map(p=>p[0]);s.y=pairs.map(p=>p[1]);
  assert(s.x[0]<=800&&s.x.at(-1)>=1800,"Amostra "+s.sample+": o eixo deve cobrir 800–1800 cm⁻¹.");
  assert(s.x.every((x,i)=>i===0||x>s.x[i-1]),"Amostra "+s.sample+": há deslocamentos duplicados.");
 });
 return {source:"importado",samples,origin:"CSV externo; referência histopatológica informada pelo pesquisador, NÃO verificada."};
}
function interp(x,y,q){
 let l=0,r=x.length-1;while(r-l>1){const m=(r+l)>>1;if(x[m]<=q)l=m;else r=m;}
 return y[l]+(y[r]-y[l])*(q-x[l])/(x[r]-x[l]);
}
export function extractRamanFeatures(sample){
 assert(sample.x.length===sample.y.length&&sample.x.length>=60,"Espectro incompleto.");
 assert(sample.x[0]<=800&&sample.x.at(-1)>=1800,"Espectro não cobre a região 800–1800 cm⁻¹.");
 const x=RAMAN_GRID,y=x.map(q=>interp(sample.x,sample.y,q));
 // Correção linear simples e área positiva: método exploratório, não padronização clínica.
 const corrected=y.map((v,i)=>Math.max(0,v-(y[0]+(y.at(-1)-y[0])*i/(y.length-1))));
 const sum=corrected.reduce((a,b)=>a+b,0);
 assert(sum>1e-8,"O espectro não contém sinal positivo após a correção de fundo.");
 const trace=corrected.map(v=>v/sum);
 const features=RAMAN_WINDOWS.map(w=>trace.reduce((s,v,i)=>s+(x[i]>=w.lo&&x[i]<=w.hi?v:0),0));
 return {trace,features};
}
function vectorMean(vectors){return vectors[0].map((_,i)=>avg(vectors.map(v=>v[i])));}
function spread(train){
 const mu=vectorMean(train.map(p=>p.features));
 const sd=mu.map((_,j)=>{
  const v=avg(train.map(p=>(p.features[j]-mu[j])**2));
  return Math.max(Math.sqrt(v),1e-8);
 });
 return {mu,sd};
}
const z=(features,stats)=>features.map((v,j)=>(v-stats.mu[j])/stats.sd[j]);
const distance=(a,b)=>a.reduce((s,v,i)=>s+(v-b[i])**2,0);
function classifyOne(train,test){
 const stats=spread(train),refs=["normal","cec"];
 const centers=refs.map(ref=>vectorMean(train.filter(p=>p.reference===ref).map(p=>z(p.features,stats))));
 const q=z(test.features,stats);
 return distance(q,centers[1])<distance(q,centers[0])?"cec":"normal";
}
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const unit=v=>{const n=Math.hypot(...v);return n>1e-12?v.map(x=>x/n):[1,0,0,0];};
function pcaPoints(patients){
 const stats=spread(patients),a=patients.map(p=>z(p.features,stats)),dim=4;
 const c=Array.from({length:dim},(_,i)=>Array.from({length:dim},(_,j)=>a.reduce((s,v)=>s+v[i]*v[j],0)/Math.max(1,a.length-1)));
 const mul=(m,v)=>m.map(row=>dot(row,v));
 let v1=unit([1,.4,.2,.1]);for(let i=0;i<80;i++)v1=unit(mul(c,v1));
 const eigen=dot(v1,mul(c,v1)),c2=c.map((row,i)=>row.map((v,j)=>v-eigen*v1[i]*v1[j]));
 let v2=unit([-.2,.8,.5,.2]);for(let i=0;i<80;i++){let t=mul(c2,v2),projection=dot(t,v1);t=t.map((v,j)=>v-projection*v1[j]);v2=unit(t);}
 return patients.map((p,i)=>({reference:p.reference,patient:p.patient,pc1:round(dot(a[i],v1),5),pc2:round(dot(a[i],v2),5)}));
}
export function analyzeCohort(cohort){
 assert(cohort&&["sintetico","importado"].includes(cohort.source),"Origem de dados inválida.");
 assert(Array.isArray(cohort.samples)&&cohort.samples.length,"Sem espectros.");
 const groups=new Map();
 cohort.samples.forEach(sample=>{
  assert(CODE.test(sample.patient)&&CODE.test(sample.sample),"Códigos de amostra inválidos.");
  assert(["normal","cec"].includes(sample.reference),"Referência não aceita.");
  const {trace,features}=extractRamanFeatures(sample);
  if(!groups.has(sample.patient))groups.set(sample.patient,{patient:sample.patient,reference:sample.reference,features:[],traces:[]});
  const p=groups.get(sample.patient);
  assert(p.reference===sample.reference,"Paciente com rótulos conflitantes.");
  p.features.push(features);p.traces.push(trace);
 });
 const patients=[...groups.values()].map(p=>({patient:p.patient,reference:p.reference,features:vectorMean(p.features),trace:vectorMean(p.traces),replicates:p.features.length}));
 const nNormal=patients.filter(p=>p.reference==="normal").length,nCEC=patients.length-nNormal;
 assert(nNormal>=5&&nCEC>=5,"São exigidos ao menos cinco pacientes independentes em cada grupo para o exercício. Isso não estabelece validade clínica.");
 // LOPO: todas as replicatas do participante excluído ficam fora do treinamento.
 const confusion={tp:0,tn:0,fp:0,fn:0};
 patients.forEach((p,i)=>{
  const prediction=classifyOne(patients.filter((_,j)=>j!==i),p);
  if(p.reference==="cec")confusion[prediction==="cec"?"tp":"fn"]++;
  else confusion[prediction==="normal"?"tn":"fp"]++;
 });
 const sensitivity=confusion.tp/nCEC,specificity=confusion.tn/nNormal;
 const means={normal:vectorMean(patients.filter(p=>p.reference==="normal").map(p=>p.trace)),cec:vectorMean(patients.filter(p=>p.reference==="cec").map(p=>p.trace))};
 return {source:cohort.source,patients:patients.length,spectra:cohort.samples.length,nNormal,nCEC,means,pca:pcaPoints(patients),confusion,sensitivity,specificity,balancedAccuracy:(sensitivity+specificity)/2,
  method:"Quatro integrais em janelas didáticas após correção linear e normalização pela soma; classificador centróide mais próximo, padronização recalculada a cada validação deixe-um-paciente-de-fora (LOPO).",
  note:cohort.source==="sintetico"?"RESULTADOS DE DADOS SINTÉTICOS. Não representam sensibilidade, especificidade ou acurácia clínica.":"Métricas internas e exploratórias; rótulos histopatológicos fornecidos pelo pesquisador não foram verificados. Não há validação externa nem diagnóstico."};
}
export function cohortCSV(cohort){
 const rows=["patient_code,sample_code,reference,shift_cm-1,intensity"];
 for(const s of cohort.samples)for(let i=0;i<s.x.length;i++)rows.push([s.patient,s.sample,s.reference,s.x[i],s.y[i]].join(","));
 return "# OdontoRaman · "+(cohort.source==="sintetico"?"DADOS SINTÉTICOS; nunca usar como pacientes":"Dados importados; verificar ética e rótulos")+"\n"+rows.join("\n")+"\n";
}
export function cohortReport(cohort,stats){
 return {project:"OdontoRaman Lab",topic:"Carcinoma espinocelular de mucosa bucal / Raman",createdAt:new Date().toISOString(),source:cohort.source,origin:cohort.origin,
  reference:"histopatologia informada nos metadados; padrão-ouro externo à plataforma",counts:{patients:stats.patients,spectra:stats.spectra,normal:stats.nNormal,cec:stats.nCEC},
  windows:RAMAN_WINDOWS,algorithm:stats.method,validation:"LOPO por paciente, sem validação externa",confusion:stats.confusion,
  sensitivity:round(stats.sensitivity,4),specificity:round(stats.specificity,4),balancedAccuracy:round(stats.balancedAccuracy,4),
  synthetic:cohort.source==="sintetico",clinicalDiagnosis:false,medicalDevice:false,limitations:stats.note};
}
