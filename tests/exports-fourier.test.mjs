import test from 'node:test';
import assert from 'node:assert/strict';
import {buildWordDocument} from '../word-export.js';
import {newWritingDraft,configs} from '../writing.js';
import {fourierDemo} from '../ft-lab.js';
import {mucosaScene} from '../tissue-scene.js';

function unpack(bytes){const view=new DataView(bytes.buffer),files={};let p=0;while(view.getUint32(p,true)===0x04034b50){const size=view.getUint32(p+18,true),length=view.getUint16(p+26,true),extra=view.getUint16(p+28,true),start=p+30+length+extra;const name=new TextDecoder().decode(bytes.slice(p+30,p+30+length));files[name]=new TextDecoder().decode(bytes.slice(start,start+size));p=start+size;}return files;}
for(const kind of ['documentacao','inic'])test(`Word ${kind}: conteúdo, caracteres, seções e formato são preservados`,()=>{
 const d=newWritingDraft(kind);d.metadata.authors='Ana & Bia';d.sections.introducao='Mucosa <tecido> e análise.\n\nSegundo parágrafo.';d.sections.referencias='Furuse (2006).';
 const files=unpack(buildWordDocument(d,configs[kind])),doc=files['word/document.xml'];
 assert(doc.includes('Ana &amp; Bia'));assert(doc.includes('Mucosa &lt;tecido&gt; e análise.'));assert(doc.includes('Segundo parágrafo.'));assert(doc.includes('11906'));assert(doc.includes('16838'));assert(doc.includes('w:left="1701"'));
 if(kind==='documentacao'){assert(doc.includes('TOC'));assert(doc.includes('w:start="1"'));assert(files['word/styles.xml'].includes('Times New Roman'));}else{assert(files['word/styles.xml'].includes('Arial'));assert(!doc.includes('TOC'));}
});
test('Fourier recupera uma banda conhecida no eixo Raman a partir do interferograma',()=>{
 const x=Array.from({length:501},(_,i)=>800+2*i),y=x.map(n=>Math.exp(-.5*((n-1450)/15)**2));
 const r=fourierDemo({x,y});const peak=r.shift[r.reconstructed.indexOf(Math.max(...r.reconstructed))];assert.ok(Math.abs(peak-1450)<=2);assert(r.interferogram.every(Number.isFinite));
 for(let i=0;i<r.opd.length;i++)assert.ok(Math.abs(r.interferogram[i]-r.interferogram.at(-1-i))<1e-10);
 assert.throws(()=>fourierDemo({x,y},1064,512,.1),/Amostragem/);
});
test('Mucosa normal, alterada e separada têm geometria finita e camadas distintas',()=>{
 const normal=mucosaScene(),altered=mucosaScene({altered:true}),separate=mucosaScene({separated:true});
 for(const mode of [normal,altered,separate])for(const m of mode){assert.equal(m.positions.length,m.normals.length);assert.equal(m.positions.length%9,0);assert(m.positions.every(Number.isFinite));assert(m.normals.every(Number.isFinite));}
 assert.notDeepEqual(normal[0].positions,altered[0].positions);assert.equal(normal[2].offset[1],0);assert.ok(separate[2].offset[1]>0);assert(normal.some(m=>m.name==='vasos'));
});
