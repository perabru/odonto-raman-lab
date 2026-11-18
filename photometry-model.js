// Aquisição de intensidade em um único comprimento de onda. Não é espectro Raman.
export const PHASES={dark:'Escuro',reference:'Referência',sample:'Amostra'};
export const CAPTURE_SIZE=20;
const fail=s=>{throw Error(s);};
export function validateOpticalSample(s){
 if(!s||s.type!=='laser_photometry'||s.version!==1||s.spectrometer!==false)fail('Protocolo incompatível: esperado laser_photometry v1.');
 if(!Number.isInteger(s.sequence)||s.sequence<0||s.sequence>4294967295||!Number.isInteger(s.uptime_ms)||s.uptime_ms<0||s.uptime_ms>4294967295)fail('Sequência ou tempo inválido.');
 if(!Number.isInteger(s.adc_counts)||s.adc_counts< -32768||s.adc_counts>32767||!Number.isFinite(s.voltage_v)||Math.abs(s.voltage_v-s.adc_counts*0.000125)>0.000002)fail('Tensão incompatível com ADS1115, faixa ±4,096 V.');
 if(typeof s.lid_closed!=='boolean'||typeof s.laser_powered!=='boolean')fail('Estado elétrico ausente.');
 return {type:'laser_photometry',version:1,sequence:s.sequence,uptime_ms:s.uptime_ms,adc_counts:s.adc_counts,voltage_v:s.voltage_v,lid_closed:s.lid_closed,laser_powered:s.laser_powered,spectrometer:false};
}
export function validateCapture(c,phase){
 if(!Object.hasOwn(PHASES,phase)||!c||typeof c.at!=='string'||!Number.isFinite(Date.parse(c.at))||new Date(c.at).toISOString()!==c.at||!Array.isArray(c.samples)||c.samples.length!==CAPTURE_SIZE)fail('Cada etapa precisa de 20 leituras e data ISO válida.');
 const samples=c.samples.map(validateOpticalSample);
 samples.forEach((s,i)=>{if(!s.lid_closed||s.laser_powered!==(phase!=='dark'))fail('Tampa ou alimentação do módulo incompatível com a etapa '+PHASES[phase]+'.');if(i&&(s.sequence<=samples[i-1].sequence||s.uptime_ms<=samples[i-1].uptime_ms||s.uptime_ms-samples[i-1].uptime_ms>300))fail('Leituras interrompidas ou fora de ordem: repita a captura.');});
 return {at:c.at,samples};
}
export function photometryPayload(p){
 if(!p||p.kind!=='photometry'||p.version!==1||!['hardware','demonstration'].includes(p.source)||p.spectrometer!==false||p.adcRangeV!==4.096||p.detectorSupplyV!==3.3||!Number.isFinite(p.wavelengthNominalNm)||p.wavelengthNominalNm<640||p.wavelengthNominalNm>665)fail('Sessão de fotometria incompatível.');
 const captures=Object.fromEntries(Object.keys(PHASES).map(k=>[k,validateCapture(p.captures?.[k],k)]));
 for(const [a,b] of [['dark','reference'],['reference','sample']]){if(captures[b].samples[0].uptime_ms<=captures[a].samples.at(-1).uptime_ms||captures[b].samples[0].sequence<=captures[a].samples.at(-1).sequence||captures[b].at<captures[a].at)fail('Capture escuro, referência e amostra nesta ordem, na mesma ligação USB.');}
 return {kind:'photometry',version:1,source:p.source,spectrometer:false,wavelengthNominalNm:p.wavelengthNominalNm,adcRangeV:4.096,detectorSupplyV:3.3,captures};
}
export function opticalStats(samples){const values=samples.map(s=>s.voltage_v),mean=values.reduce((a,b)=>a+b,0)/values.length;return {n:values.length,mean,sd:Math.sqrt(values.reduce((sum,x)=>sum+(x-mean)**2,0)/Math.max(1,values.length-1)),min:Math.min(...values),max:Math.max(...values)};}
export function photometryResult(input){
 const p=photometryPayload(input),stats=Object.fromEntries(Object.keys(PHASES).map(k=>[k,opticalStats(p.captures[k].samples)])),issues=[];
 if(Object.values(stats).some(s=>s.max>=2))issues.push('Sinal ≥ 2,0 V: possível saturação do OPT101 a 3,3 V. Aumente a atenuação e repita.');
 if(Object.values(stats).some(s=>s.min< -0.01))issues.push('Tensão negativa incompatível com a montagem: confira ligação e referência.');
 const denominator=stats.reference.mean-stats.dark.mean,numerator=stats.sample.mean-stats.dark.mean;
 const floor=Math.max(0.01,10*Math.max(stats.dark.sd,stats.reference.sd));
 if(denominator<=floor)issues.push('Referência corrigida insuficiente frente ao piso de 10 mV / 10 desvios. Confira alinhamento e ganho óptico.');
 if(numerator<=0)issues.push('Amostra sem sinal positivo acima do escuro. Não calcular transmissão.');
 const transmission=issues.length?null:numerator/denominator;
 return {stats,transmission,issues,warning:transmission!==null&&transmission>1?'Resultado acima de 100%: revise referência, posição e estabilidade do laser; o valor não foi limitado artificialmente.':'',unit:'razão de sinais ópticos',clinicalInterpretation:false};
}
export function photometryCSV(input){const p=photometryPayload(input);return '# origem='+p.source+'; tipo=fotometria; espectro_raman=false; laser_nominal_nm='+p.wavelengthNominalNm+'\nphase,sequence,uptime_ms,adc_counts,voltage_v,lid_closed,laser_powered\n'+Object.keys(PHASES).flatMap(k=>p.captures[k].samples.map(s=>[k,s.sequence,s.uptime_ms,s.adc_counts,s.voltage_v.toFixed(6),s.lid_closed,s.laser_powered].join(','))).join('\n')+'\n';}
export function demoPhotometry(){let seq=0;return photometryPayload({kind:'photometry',version:1,source:'demonstration',spectrometer:false,wavelengthNominalNm:655,adcRangeV:4.096,detectorSupplyV:3.3,captures:Object.fromEntries(Object.keys(PHASES).map((phase,index)=>[phase,{at:new Date(Date.UTC(2026,10,18,12,index)).toISOString(),samples:Array.from({length:CAPTURE_SIZE},(_,i)=>{const counts=[80,4080,2480][index]+(i%5-2)*2;return {type:'laser_photometry',version:1,sequence:++seq,uptime_ms:seq*50,adc_counts:counts,voltage_v:counts*0.000125,lid_closed:true,laser_powered:phase!=='dark',spectrometer:false};})}]))});}
