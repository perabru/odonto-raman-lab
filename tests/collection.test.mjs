import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRecord,spectrumPayload,ledPayload,validateCollectionBackup,mergeCollection,recordsCSV} from '../collection-model.js';
import {simulateMucosa,mucosaCSV,mucosaReport,processMucosa} from '../mucosa-lab.js';
import {defaultMaterials,validateMaterials,materialTotals,materialsCSV} from '../implementation.js';

const record=(extra={})=>({version:1,id:'test-001',createdAt:'2026-11-18T12:00:00.000Z',measuredAt:'2026-11-18T11:00:00.000Z',sampleCode:'DEMO-001',point:'P01',replicate:'R01',team:'Equipe 1',origin:'demonstracao',instrument:'',laserNm:null,powerMw:null,integrationSeconds:null,accumulations:null,notes:'',payload:null,...extra});
const event={type:'bancada_led',event:'ciclo_finalizado',state:'concluido',lid_closed:true,uptime_ms:3123,spectrometer:false,received_at:'2026-11-18T12:00:00.000Z'};

test('coleta preserva CSV bruto e parâmetros desconhecidos como ausentes',()=>{
 const csv=mucosaCSV(simulateMucosa()),r=validateRecord(record({origin:'sintetico',payload:spectrumPayload(csv,'exemplo.csv')}));
 assert.equal(r.payload.rawCSV,csv);assert.equal(r.payload.points,501);assert.equal(r.laserNm,null);
 const copy=validateCollectionBackup({format:'odonto-collection',version:1,records:[r]});assert.deepEqual(copy,[r]);
});
test('coleta rejeita mistura entre eventos LED e espectro, sem dados fictícios',()=>{
 assert.throws(()=>validateRecord(record({origin:'laboratorio'})),/exige um espectro/);
 assert.throws(()=>validateRecord(record({origin:'bancada_led',payload:spectrumPayload(mucosaCSV(simulateMucosa()),'a.csv')})),/eventos/);
 assert.throws(()=>validateRecord(record({origin:'bancada_led',laserNm:1064,payload:ledPayload([event])})),/não possuem parâmetros/);
 assert.throws(()=>ledPayload([{...event,spectrometer:true}]),/incompatível/);
 assert.throws(()=>ledPayload([{...event,uptime_ms:NaN}]),/inválido/);
 assert.deepEqual(ledPayload([event]).events[0],event);
});
test('backup inválido é recusado antes de alterar registros e IDs não são sobrescritos',()=>{
 const a=validateRecord(record()),before=JSON.stringify(a),b=validateRecord(record({id:'test-002'}));
 assert.throws(()=>validateCollectionBackup({format:'odonto-collection',version:1,records:[a,{...b,sampleCode:'<script>'}]}));
 assert.equal(JSON.stringify(a),before);
 const result=mergeCollection([a],[a,{...a,notes:'outro conteúdo'},b]);
 assert.equal(result.added,1);assert.equal(result.duplicates,1);assert.equal(result.conflicts,1);assert.equal(result.records[0].notes,'');
 assert.throws(()=>validateCollectionBackup({format:'odonto-collection',version:1,records:[a,a]}),/duplicados/);
});
test('validação recusa tamanho, números não finitos, origem desconhecida e caracteres em códigos',()=>{
 assert.throws(()=>validateRecord(record({laserNm:Infinity})));
 assert.throws(()=>validateRecord(record({measuredAt:'2026-02-30T11:00:00.000Z'})),/data inválida/);
 assert.throws(()=>validateRecord(record({origin:'diagnostico'})));
 assert.throws(()=>validateRecord(record({sampleCode:'João / 123'})));
 assert.throws(()=>validateRecord(record({accumulations:1.5})));
 assert.throws(()=>spectrumPayload('x'.repeat(2000001),'a.csv'));
 assert.throws(()=>ledPayload(Array(1001).fill(event)));
});
test('CSV de fichas protege fórmulas e mantém separadores/linhas dentro das células',()=>{
 const r=validateRecord(record({team:'=1+1',notes:'linha 1; "aspas"\nlinha 2'})),csv=recordsCSV([r]);
 assert(csv.includes('"\'=1+1"'));assert(csv.includes('"linha 1; ""aspas""\nlinha 2"'));assert(csv.startsWith('\uFEFF'));
});
test('relatório de análise mantém a ligação com a coleta e a origem sintética',()=>{
 const raw={...simulateMucosa(),source:'importado',filename:'a.csv',collection:{id:'test-001',sampleCode:'DEMO-001',origin:'sintetico'}};
 const report=mucosaReport(raw,processMucosa(raw));assert.deepEqual(report.collection,raw.collection);assert.equal(report.clinical_interpretation,false);
});
test('orçamento distingue cotação ausente, empréstimo e zero informado',()=>{
 const state=defaultMaterials();assert.equal(materialTotals(state).total,0);assert(materialTotals(state).missing>0);
 state.esp32.price=55;state.usb.price=0;state.multimeter.price=1000;state.led.price=.3;state.led.qty=2;
 const total=materialTotals(state);assert.equal(total.total,55.6);assert(!materialsCSV(state).includes('NaN'));
 assert.deepEqual(validateMaterials(JSON.parse(JSON.stringify(state))),state);
 assert.throws(()=>validateMaterials({...state,esp32:{qty:-1,price:0,status:'cotar'}}));
});
