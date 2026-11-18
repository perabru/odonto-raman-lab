import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSyntheticCohort,parseCohortCSV,cohortCSV,extractRamanFeatures,analyzeCohort,cohortReport,RAMAN_GRID,RAMAN_WINDOWS} from '../cec-raman-model.js';
import {cecRamanHTML} from '../cec-raman.js';

test('a demonstração é determinística, sintética e mantém replicatas por pessoa',()=>{
 const data=makeSyntheticCohort(),again=makeSyntheticCohort();
 assert.deepEqual(data,again);
 assert.equal(data.samples.length,60);
 assert.equal(new Set(data.samples.map(x=>x.patient)).size,30);
 assert.equal(RAMAN_GRID[0],800);assert.equal(RAMAN_GRID.at(-1),1800);
 assert.equal(RAMAN_WINDOWS.length,4);
 assert.equal(data.samples.filter(s=>s.reference==='cec').length,30);
});
test('a análise agrega réplicas por paciente e retorna números finitos com LOPO',()=>{
 const c=makeSyntheticCohort(),s=analyzeCohort(c);
 assert.equal(s.patients,30);assert.equal(s.spectra,60);
 assert.equal(s.nNormal,15);assert.equal(s.nCEC,15);assert.equal(s.pca.length,30);
 assert.equal(s.confusion.tp+s.confusion.fn,15);
 assert.equal(s.confusion.tn+s.confusion.fp,15);
 assert.ok([s.sensitivity,s.specificity,s.balancedAccuracy].every(v=>Number.isFinite(v)&&v>=0&&v<=1));
 assert.equal(s.means.normal.length,201);assert.equal(s.means.cec.length,201);
 assert.ok(s.pca.every(p=>Number.isFinite(p.pc1)&&Number.isFinite(p.pc2)));
 const report=cohortReport(c,s);
 assert.equal(report.clinicalDiagnosis,false);
 assert.equal(report.medicalDevice,false);
 assert.equal(report.synthetic,true);
 assert.match(report.validation,/LOPO/);
 assert.match(s.note,/SINTÉTICOS/);
});
test('CSV exportado pela demonstração é reimportável e preserva unidades e grupos',()=>{
 const csv=cohortCSV(makeSyntheticCohort()),parsed=parseCohortCSV(csv);
 assert.equal(parsed.source,'importado');
 assert.equal(parsed.samples.length,60);
 assert.equal(parsed.samples[0].x[0],800);
 assert.equal(parsed.samples[0].x.at(-1),1800);
 assert.equal(parsed.samples[0].y.length,201);
 assert.deepEqual(parsed.samples[0].y,makeSyntheticCohort().samples[0].y);
 assert.equal(analyzeCohort(parsed).patients,30);
});
test('qualidade e proteção contra entrada inválida: classe, privacidade, eixo e dados',()=>{
 const c=makeSyntheticCohort(),csv=cohortCSV(c);
 assert.throws(()=>parseCohortCSV(csv.replace('DEMO001,','paciente@exemplo.com,')),/pseudonimizados/);
 assert.throws(()=>parseCohortCSV(csv.replace(',normal,800,',',duvidoso,800,')),/reference/);
 assert.throws(()=>parseCohortCSV(csv.replace('shift_cm-1','wavelength_nm')),/Cabeçalho obrigatório/);
 assert.throws(()=>parseCohortCSV(csv.replace(',800,',',600,').replace(',805,',',600,')),/duplicados/);
 assert.throws(()=>parseCohortCSV('patient_code,sample_code,reference,shift_cm-1,intensity\nP001,P001-R1,normal,800,40\n'),/60/);
 assert.throws(()=>extractRamanFeatures({x:[800,805],y:[1,2]}),/incompleto/);
 const small={...c,samples:c.samples.filter(s=>Number(s.patient.slice(-3))<=8)};
 assert.throws(()=>analyzeCohort(small),/cinco pacientes/);
});
test('o módulo evita prometer diagnóstico; tela referencia documentos e coleta',()=>{
 assert.match(cecRamanHTML,/carcinoma espinocelular/i);
 assert.match(cecRamanHTML,/não diagnóstico|não substitui/i);
 assert.match(cecRamanHTML,/docs\/Protocolo_CEC_Raman.md/);
 assert.match(cecRamanHTML,/href="#coleta"/);
 assert.match(cecRamanHTML,/id="cec-file"/);
 assert.match(cecRamanHTML,/id="cec-pca-plot"/);
});
