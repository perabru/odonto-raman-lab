import {createPlan,upgradeLaserStages} from '../planning.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {CAPTURE_SIZE,demoPhotometry,photometryPayload,photometryResult,photometryCSV,validateOpticalSample} from '../photometry-model.js';
import {validateRecord,validateCollectionBackup,mergeCollection,recordsCSV} from '../collection-model.js';
const clone=v=>structuredClone(v);
const record=p=>({version:1,id:'optical-test-001',createdAt:'2026-11-18T12:00:00.000Z',measuredAt:'2026-11-18T12:00:00.000Z',sampleCode:'MAT-001',point:'P1',replicate:'R1',team:'Equipe de teste',origin:p.source==='hardware'?'fotometria':'fotometria_demo',instrument:'OPT101 + ADS1115',laserNm:655,powerMw:null,integrationSeconds:null,accumulations:null,notes:'Teste de software',payload:p});
function voltage(p,phase,counts){p.captures[phase].samples.forEach(s=>{s.adc_counts=counts;s.voltage_v=counts*.000125;});}
test('fotometria recupera transmissão conhecida, com bruto e origem preservados',()=>{
 const p=demoPhotometry(),copy=clone(p),r=photometryResult(p);assert(Math.abs(r.transmission-.6)<1e-12);assert.equal(r.stats.dark.n,CAPTURE_SIZE);assert(r.stats.reference.sd>0);assert.equal(r.clinicalInterpretation,false);assert.deepEqual(p,copy);assert.deepEqual(photometryPayload(JSON.parse(JSON.stringify(p))),p);
 const csv=photometryCSV(p);assert(csv.startsWith('# origem=demonstration'));assert.equal(csv.trim().split('\n').length,62);assert(csv.includes('adc_counts,voltage_v'));assert(!csv.includes('shift_cm'));
});
test('referência nula, sinal negativo e saturação não fabricam transmissão',()=>{
 for(const variant of ['null','negative','saturation']){const p=demoPhotometry();if(variant==='null')voltage(p,'reference',80);if(variant==='negative')voltage(p,'sample',0);if(variant==='saturation')voltage(p,'sample',17000);const r=photometryResult(p);assert.equal(r.transmission,null);assert(r.issues.length);}
 const noisy=demoPhotometry();noisy.captures.reference.samples.forEach((s,i)=>{s.adc_counts=400+(i%2?300:-300);s.voltage_v=s.adc_counts*.000125;});assert.equal(photometryResult(noisy).transmission,null);
});
test('resultado acima de 100% permanece explícito, sem limitar ou diagnosticar',()=>{
 const p=demoPhotometry();voltage(p,'sample',6080);const r=photometryResult(p);assert(Math.abs(r.transmission-1.5)<1e-12);assert.match(r.warning,/100%/);
});
test('protocolo rejeita escala errada, números não finitos e mensagens de outro aparelho',()=>{
 const sample=demoPhotometry().captures.dark.samples[0];for(const fields of [{voltage_v:Infinity},{voltage_v:3},{adc_counts:1.5},{spectrometer:true},{type:'bancada_led'},{laser_powered:1},{sequence:-1}])assert.throws(()=>validateOpticalSample({...sample,...fields}));
});
test('tampa aberta, laser ligado no escuro ou desligado na referência invalidam captura',()=>{
 for(const [phase,field,value] of [['dark','lid_closed',false],['dark','laser_powered',true],['reference','laser_powered',false],['sample','lid_closed',false]]){const p=demoPhotometry();p.captures[phase].samples[3][field]=value;assert.throws(()=>photometryPayload(p));}
});
test('não mistura sessões reiniciadas, sequências repetidas ou etapas incompletas',()=>{
 for(const mutate of [p=>p.captures.sample.samples.pop(),p=>p.captures.sample.samples[5].sequence=1,p=>p.captures.sample.samples[5].uptime_ms+=400,p=>p.captures.reference.at='invalid',p=>p.captures.sample=p.captures.reference,p=>p.wavelengthNominalNm=1064]){const p=demoPhotometry();mutate(p);assert.throws(()=>photometryPayload(p));}
});
test('coleta distingue medições e exemplo, sem aceitar fotometria como Raman',()=>{
 const p=demoPhotometry(),r=record(p);assert.deepEqual(validateRecord(r),r);assert.throws(()=>validateRecord({...r,origin:'fotometria'}));assert.throws(()=>validateRecord({...r,origin:'laboratorio'}));assert.throws(()=>validateRecord({...r,laserNm:785}));assert.throws(()=>validateRecord({...r,integrationSeconds:1}));assert.throws(()=>validateRecord({...r,powerMw:5}));
 p.source='hardware';assert.equal(validateRecord(record(p)).origin,'fotometria');assert(recordsCSV([r]).includes('leituras_opticas'));
});
test('backup de coleta mantém 60 brutos e é idempotente',()=>{
 const r=validateRecord(record(demoPhotometry()));const incoming=validateCollectionBackup(JSON.parse(JSON.stringify({format:'odonto-collection',version:1,records:[r]})));assert.deepEqual(incoming[0],r);const merged=mergeCollection([r],incoming);assert.equal(merged.duplicates,1);assert.equal(merged.added,0);assert.deepEqual(merged.records[0].payload.captures,r.payload.captures);
});

test('revisão do plano atualiza só metas LED originais e preserva datas e personalizações',()=>{
 const p=createPlan('2026-11-18');p.events[3].title='Documentar a bancada LED';p.events[3].note='Revisar pinagem, resistores, alimentação e interrupção do ciclo pela tampa.';p.events[3].done=true;p.events[6].title='Minha aquisição personalizada';const before=clone(p),up=upgradeLaserStages(p);assert.equal(up.changed,1);assert.match(up.plan.events[3].title,/laser/);assert.equal(up.plan.events[3].done,false);assert.equal(up.plan.events[3].date,p.events[3].date);assert.equal(up.plan.events[6].title,p.events[6].title);assert.deepEqual(p,before);assert.equal(upgradeLaserStages(up.plan).changed,0);
});
