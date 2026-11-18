import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateMucosa,processMucosa,mucosaCSV,mucosaReport,MUCOSA_BANDS,mucosaLabHTML} from '../mucosa-lab.js';
import {parseCSV,gaussian} from '../spectra.js';

test('mucosa sintética é reprodutível, cobre a janela e não define classes clínicas',()=>{
 const a=simulateMucosa(),repeat=simulateMucosa(),b=simulateMucosa({scenario:'B'});
 assert.deepEqual(a,repeat);assert.equal(a.x[0],800);assert.equal(a.x.at(-1),1800);assert.equal(a.x.length,501);assert.notDeepEqual(a.y,b.y);
 const report=mucosaReport(a,processMucosa(a));assert.equal(report.clinical_interpretation,false);assert.equal(report.simulation.scenario,'A');assert.equal(report.measurements.length,4);
});
test('normalização 1450 preserva a escala relativa, registra divisor e mantém bruto',()=>{
 const a=simulateMucosa({noise:0,background:0}),before=a.y.slice(),p=processMucosa(a,{norm:'1450'});
 const local=p.y.filter((_,i)=>p.x[i]>=1420&&p.x[i]<=1480);assert.equal(Math.max(...local),1);assert.deepEqual(a.y,before);
 const scaled={...a,y:a.y.map(y=>y*7)},q=processMucosa(scaled,{norm:'1450'});
 p.y.forEach((y,i)=>assert.ok(Math.abs(y-q.y[i])<1e-10));assert.ok(Math.abs(q.factor/p.factor-7)<1e-10);
});
test('janelas ausentes e dados incompatíveis falham sem métricas inventadas',()=>{
 const missing={x:Array.from({length:40},(_,i)=>800+i*2),y:Array(40).fill(1)};
 assert.throws(()=>processMucosa(missing),/não cobre/);
 const p=processMucosa(missing,{norm:'none'});assert.ok(p.features.every(f=>f===null));
 const irregular=simulateMucosa();irregular.x[2]+=.5;assert.throws(()=>processMucosa(irregular,{smooth:true}),/uniforme/);
 assert.throws(()=>processMucosa(simulateMucosa(),{norm:'bogus'}),/desconhecida/);
});
test('área e largura de gaussiana conhecida são recuperadas na região de 1004',()=>{
 const x=Array.from({length:1001},(_,i)=>800+i),y=x.map(v=>gaussian(v,1004,100,3));
 const p=processMucosa({x,y},{norm:'none',correct:false}),f=p.features[0];
 assert.equal(f.position,1004);assert.ok(Math.abs(f.area-100*3*Math.sqrt(2*Math.PI))<.001);assert.ok(Math.abs(f.fwhm-2.35482*3)<.1);
});
test('CSV bruto faz ida e volta; relatório conserva parâmetros e nome como dados',()=>{
 const raw={...simulateMucosa(),filename:'<img src=x onerror=alert(1)>\nsecret.csv'},p=processMucosa(raw);
 const csv=mucosaCSV(raw),parsed=parseCSV(csv);assert.equal(parsed.x.length,501);parsed.y.forEach((v,i)=>assert.ok(Math.abs(v-raw.y[i])<1e-7));
 const report=mucosaReport(raw,p);assert.equal(report.filename,raw.filename);assert.equal(report.processing.norm,'1450');
 assert.equal(mucosaCSV(raw,p).split('\n')[2],'shift_cm-1,intensity_raw,intensity_processed');
 assert.equal(MUCOSA_BANDS[2].window[0],1400);assert.ok(!mucosaLabHTML.includes('</option value='));
});
