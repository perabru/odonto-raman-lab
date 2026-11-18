import test from 'node:test';
import assert from 'node:assert/strict';
import {newBusinessPlan,validateBusinessPlan,businessMetrics,businessMarkdown} from '../administracao.js';
import {addAdministrationGoals,createPlan} from '../planning.js';
const scenario={price:100,variable:40,rate:10,fixed:1000,quantity:30,investment:2000,reserve:500};
test('cenário financeiro desconta deduções, evita duplicar investimento e arredonda equilíbrio',()=>{
 assert.deepEqual(businessMetrics(scenario),{contribution:50,revenue:3000,expenses:2500,result:500,breakEven:20,startup:2500});
 assert.equal(businessMetrics({...scenario,fixed:1001}).breakEven,21);
 assert.equal(businessMetrics({...scenario,price:.3,variable:.2,fixed:.3,rate:0}).breakEven,3);
 assert.equal(businessMetrics({...scenario,quantity:0}).result,-1000);
 assert.equal(businessMetrics({...scenario,variable:95}).breakEven,null);
 assert.equal(businessMetrics({...scenario,variable:90}).breakEven,null);
 assert.equal(businessMetrics(newBusinessPlan().finance),null);
});
test('backup empresarial preserva texto e etapas e recusa números inválidos sem alterar a origem',()=>{
 const p=newBusinessPlan();p.fields.name='Empresa da equipe';p.finance=scenario;p.done=[0,2];
 const roundtrip=validateBusinessPlan(JSON.parse(JSON.stringify(p)));assert.deepEqual(roundtrip,p);roundtrip.fields.name='Outra';assert.equal(p.fields.name,'Empresa da equipe');
 for(const finance of [{...scenario,rate:100},{...scenario,quantity:1.2},{...scenario,price:0},{...scenario,reserve:-1},{...scenario,investment:Infinity}])assert.throws(()=>validateBusinessPlan({...p,finance}));
 assert.throws(()=>validateBusinessPlan({...p,done:[8]}));assert.throws(()=>validateBusinessPlan({...p,fields:{...p.fields,name:'a'.repeat(6001)}}));
 assert.match(businessMarkdown(p),/Empresa da equipe/);assert.match(businessMarkdown(p),/20 unidade/);
});
test('metas de Administração são adicionadas uma vez e preservam compromissos editados',()=>{
 const initial=createPlan('2026-11-18');initial.events[0].title='Entrega personalizada';
 const first=addAdministrationGoals(initial);assert.equal(first.added,8);assert.equal(first.plan.events.length,24);assert.equal(initial.events.length,16);
 assert.equal(first.plan.events.find(e=>e.id==='admin-1').date,'2026-12-01');
 assert.equal(first.plan.events.find(e=>e.id==='admin-8').date,'2027-03-09');
 first.plan.events.find(e=>e.id==='admin-1').date='2026-12-03';
 const next=addAdministrationGoals(first.plan);assert.equal(next.added,0);assert.deepEqual(next.plan,first.plan);
});
test('limite de agenda é verificado antes de adicionar metas e não deixa inclusão parcial',()=>{
 const p=createPlan('2026-11-18');while(p.events.length<94)p.events.push({...p.events[0],kind:'custom',id:'extra-'+p.events.length});
 assert.throws(()=>addAdministrationGoals(p));assert.equal(p.events.length,94);
});
