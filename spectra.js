/* OdontoRaman Lab — algoritmos educacionais, sem inferência clínica. */
export const WINDOWS={phosphate:[930,990],carbonate:[1050,1090],organic:[1420,1480]};
export const gaussian=(x,c,a,s)=>a*Math.exp(-0.5*((x-c)/s)**2);
export function simulate({tissue='enamel',mineral=100,noise=10,fluorescence=35,seed=42}={}){
 let state=seed>>>0;const rand=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296;};
 const x=[],y=[],d=tissue==='dentin',scale=mineral/100;
 for(let n=400;n<=1800;n+=2){let signal=gaussian(n,430,90*scale,11)+gaussian(n,590,130*scale,14)+gaussian(n,960,(d?650:1000)*scale,d?10:7)+gaussian(n,1070,(d?120:75)*scale,13)+gaussian(n,1245,d?95:8,18)+gaussian(n,1450,d?220:15,22)+gaussian(n,1667,d?145:10,27);let bg=fluorescence*(1.3+0.00055*(n-400)+0.9*Math.exp(-0.5*((n-1100)/600)**2));x.push(n);y.push(signal+bg+(rand()+rand()+rand()-1.5)*noise);}
 return {x,y,source:'simulado',tissue};
}
export function parseCSV(text){
 if(text.length>2_000_000)throw Error('O limite é 2 MB. Exporte somente duas colunas.');
 const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).map(t=>t.trim()).filter(t=>t&&!t.startsWith('#'));
 if(!lines.length)throw Error('O arquivo está vazio.');
 const sep=lines[0].includes(';')?';':lines[0].includes('\t')?'\t':',';
 const rows=[];let header=false;
 for(let i=0;i<lines.length;i++){let cols=lines[i].split(sep).map(s=>s.trim().replace(/^"|"$/g,''));if(cols.length!==2)throw Error(`Linha ${i+1}: use exatamente duas colunas (deslocamento e intensidade).`);
 const numeric=cols.map(s=>s!==''?Number(sep===';'?s.replace(',','.'):s):NaN);
 if(!numeric.every(Number.isFinite)){if(i===0 && /shift|raman|desloc|wavenumber/i.test(cols[0]) && /intens/i.test(cols[1])){header=true;continue;}throw Error(`Linha ${i+1}: valor vazio ou não numérico. Verifique separador e unidade.`);}
 if(numeric[0]<0||numeric[0]>10000)throw Error('Deslocamento fora de 0–10000 cm⁻¹. Não importe comprimentos de onda em nm.');rows.push(numeric);}
 if(rows.length<20||rows.length>20000)throw Error('Use de 20 a 20.000 pontos por espectro.');
 rows.sort((a,b)=>a[0]-b[0]);const x=[],y=[],counts=[];let duplicates=0;
 for(const [a,b] of rows){if(x.length&&a===x.at(-1)){const j=y.length-1;y[j]=(y[j]*counts[j]+b)/(counts[j]+1);counts[j]++;duplicates++;}else{x.push(a);y.push(b);counts.push(1);}}
 if(x.length<20||x.at(-1)===x[0])throw Error('São necessários ao menos 20 deslocamentos distintos.');
 return {x,y,duplicates,header,source:'importado — origem a confirmar'};
}
export function baseline(x,y){
 const hull=[];for(let i=0;i<x.length;i++){while(hull.length>=2){const a=hull.at(-2),b=hull.at(-1);const cross=(x[b]-x[a])*(y[i]-y[b])-(y[b]-y[a])*(x[i]-x[b]);if(cross<=0)hull.pop();else break;}hull.push(i);}
 const z=new Array(x.length);for(let h=1;h<hull.length;h++){const a=hull[h-1],b=hull[h];for(let i=a;i<=b;i++)z[i]=y[a]+(y[b]-y[a])*(x[i]-x[a])/(x[b]-x[a]);}return z;
}
export function movingAverage(y,w=3){const k=Math.floor(w/2);return y.map((_,i)=>{let s=0,n=0;for(let j=Math.max(0,i-k);j<=Math.min(y.length-1,i+k);j++){s+=y[j];n++;}return s/n;});}
export function interpolate(x,y,q){if(q<x[0]||q>x.at(-1))return null;let lo=0,hi=x.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(x[m]<=q)lo=m;else hi=m;}return y[lo]+(y[hi]-y[lo])*(q-x[lo])/(x[hi]-x[lo]);}
export function feature(x,y,[lo,hi]){
 if(x[0]>lo||x.at(-1)<hi)return null;
 const xx=[lo,...x.filter(n=>n>lo&&n<hi),hi],yy=xx.map(n=>interpolate(x,y,n));
 if(xx.length<5)return null;const first=yy[0],last=yy.at(-1);const residual=yy.map((v,i)=>v-(first+(last-first)*(xx[i]-lo)/(hi-lo)));
 let p=0;for(let i=1;i<yy.length;i++)if(residual[i]>residual[p])p=i;
 const height=residual[p];let area=0;for(let i=1;i<xx.length;i++)area+=(xx[i]-xx[i-1])*(residual[i]+residual[i-1])/2;
 let left=null,right=null;const half=height/2;
 if(height>1e-10){for(let i=p;i>0;i--)if(residual[i-1]<=half&&residual[i]>=half){left=xx[i-1]+(xx[i]-xx[i-1])*(half-residual[i-1])/(residual[i]-residual[i-1]);break;}for(let i=p;i<xx.length-1;i++)if(residual[i]>=half&&residual[i+1]<=half){right=xx[i]+(xx[i+1]-xx[i])*(half-residual[i])/(residual[i+1]-residual[i]);break;}}
 return {position:height>1e-10?xx[p]:null,height,area,fwhm:left!==null&&right!==null?right-left:null};
}
export function processSpectrum(data,{correct=true,smooth=false,norm='none'}={}){
 const {x}=data;let b=correct?baseline(x,data.y):x.map(()=>0);let y=data.y.map((v,i)=>v-b[i]);const steps=x.slice(1).map((v,i)=>v-x[i]);const step=(x.at(-1)-x[0])/(x.length-1);const uniform=steps.every(v=>Math.abs(v-step)<=0.05*step);
 if(smooth&&!uniform)throw Error('Suavização requer espaçamento uniforme (tolerância de 5%). Reamostre no software do laboratório.');
 if(smooth)y=movingAverage(y);let factor=1;if(norm==='max')factor=Math.max(...y);if(norm==='phosphate'){const points=y.filter((_,i)=>x[i]>=930&&x[i]<=990);factor=points.length?Math.max(...points):0;}
 if(factor<=1e-10)throw Error('Não há intensidade positiva na faixa de normalização. Escolha “Sem normalizar”.');
 if(norm!=='none')y=y.map(v=>v/factor);
 const features=Object.fromEntries(Object.entries(WINDOWS).map(([k,w])=>[k,feature(x,y,w)]));
 const p=features.phosphate,c=features.carbonate,o=features.organic;const ratio=(a,d)=>a&&d&&a.area>0&&d.area>Math.max(1e-9,Math.max(...y)*0.001)?a.area/d.area:null;
 return {x,y,b,features,carbonateRatio:ratio(c,p),organicRatio:ratio(o,p),uniform,step,maxStep:Math.max(...steps),factor,options:{correct,smooth,norm}};
}
export function csvFor(data,processed=null){const headers=processed?'shift_cm-1,intensity_raw,intensity_processed':'shift_cm-1,intensity';return '# OdontoRaman Lab | '+data.source+' | sem interpretação clínica\n'+headers+'\n'+data.x.map((x,i)=>[x,data.y[i],...(processed?[processed.y[i]]:[])].map(n=>Number(n.toFixed(6))).join(',')).join('\n')+'\n';}
