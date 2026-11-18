import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlan,validatePlan,buildICS,addDays,validDate,planningHTML} from '../planning.js';

const fresh=()=>createPlan('2026-11-18');

test('suggested dates cover sixteen seven-day weeks across the year boundary',()=>{
 const plan=fresh();
 assert.equal(plan.events.length,16);
 assert.equal(plan.events[0].date,'2026-11-24');
 assert.equal(plan.events[15].date,'2027-03-09');
 assert.equal(addDays('2026-12-31',1),'2027-01-01');
 assert.equal(addDays('2024-02-28',1),'2024-02-29');
 assert.equal(addDays('2026-02-28',1),'2026-03-01');
});

test('invalid calendar dates are rejected instead of silently rolling into another month',()=>{
 for(const date of ['2026-02-29','2026-02-30','2026-13-01','2026-00-10','2026-04-31','2026-1-02','2026-11-18T00:00:00Z','not-a-date',null])assert.equal(validDate(date),false,String(date));
 for(const date of ['2024-02-29','2026-11-18','2099-12-31'])assert.equal(validDate(date),true);
});

test('backup validation preserves editable goals and extras but drops unexpected properties',()=>{
 const plan=fresh();plan.events[0].done=true;plan.events[0].date='2026-11-30';
 plan.events.push({id:'event-extra',kind:'custom',done:false,date:'2027-01-08',title:'Reunião com o orientador',owner:'Todos',note:'Conferir referências.',delivery:'Lista de correções.'});
 const parsed=validatePlan({...plan,unexpected:'not retained',events:plan.events.map(e=>({...e,unknown:true}))});
 assert.deepEqual(parsed,plan);
 assert.notEqual(parsed.events,plan.events);
 parsed.events[0].title='Edited after validation';
 assert.notEqual(parsed.events[0].title,plan.events[0].title);
});

test('invalid restore candidates fail without modifying the current plan',()=>{
 const current=fresh(),before=JSON.stringify(current);
 const candidates=[
  {...current,version:99},
  {...current,start:'2026-02-31'},
  {...current,events:current.events.slice(1)},
  {...current,events:[...current.events,current.events[0]]},
  {...current,events:current.events.map((e,i)=>i===0?{...e,date:'2026-02-31'}:e)},
  {...current,events:current.events.map((e,i)=>i===0?{...e,owner:'Equipe não reconhecida'}:e)},
  {...current,events:current.events.map((e,i)=>i===0?{...e,done:'yes'}:e)},
  {...current,events:current.events.map((e,i)=>i===0?{...e,title:'x'.repeat(161)}:e)},
  {...current,events:current.events.map((e,i)=>i===0?{...e,id:'<script>'}:e)},
  {...current,events:current.events.map((e,i)=>i===0?{...e,week:2}:e)}
 ];
 for(const candidate of candidates)assert.throws(()=>validatePlan(candidate));
 assert.equal(JSON.stringify(current),before);
});

test('backups are bounded to one hundred events',()=>{
 const plan=fresh();
 for(let i=0;i<85;i++)plan.events.push({id:'extra-'+i,kind:'custom',done:false,date:'2027-01-01',title:'Reunião '+i,owner:'Todos',note:'',delivery:''});
 assert.equal(plan.events.length,101);
 assert.throws(()=>validatePlan(plan));
 plan.events.pop();assert.equal(validatePlan(plan).events.length,100);
});

test('ICS has stable identifiers and exclusive end dates for all-day events',()=>{
 const ics=buildICS(fresh(),new Date('2026-11-18T12:34:56Z'));
 assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,16);
 assert.equal((ics.match(/END:VEVENT/g)||[]).length,16);
 assert(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'));
 assert(ics.endsWith('END:VCALENDAR\r\n'));
 assert(ics.includes('UID:week-1@odontoraman.local\r\n'));
 assert(ics.includes('DTSTAMP:20261118T123456Z\r\n'));
 assert(ics.includes('DTSTART;VALUE=DATE:20261124\r\nDTEND;VALUE=DATE:20261125\r\n'));
});

test('ICS escapes text and folds accented UTF-8 content without losing it',()=>{
 const plan=fresh();
 plan.events[0].title='Revisão; curva, amostra\\arquivo\nPróximo passo';
 plan.events[0].note='Análises clínicas e composição da mucosa bucal. '.repeat(20);
 const ics=buildICS(plan,new Date('2026-11-18T00:00:00Z'));
 assert(ics.split('\r\n').every(line=>Buffer.byteLength(line,'utf8')<=75));
 const unfolded=ics.replace(/\r\n /g,'');
 assert(unfolded.includes('SUMMARY:Revisão\\; curva\\, amostra\\\\arquivo\\nPróximo passo\r\n'));
 assert(unfolded.includes(plan.events[0].note));
 assert(!unfolded.includes('\r\nPróximo passo'));
});

test('weekday headings match the Sunday-first calendar layout and do not promise an INIC deadline',()=>{
 const headings=planningHTML.match(/class="calendar-weekdays"[^>]*>(.*?)<\/div>/s)?.[1];
 assert(headings);
 assert.deepEqual([...headings.matchAll(/<span>(.*?)<\/span>/g)].map(m=>m[1]),['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']);
 assert(planningHTML.includes('O prazo oficial do INIC deve ser informado quando a edição for confirmada.'));
});
