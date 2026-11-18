import test from 'node:test';
import assert from 'node:assert/strict';
import {newWritingDraft,validateWritingDraft,writingDocumentHTML,writingDocumentText,countWritingWords,escapeWritingHTML} from '../writing.js';

for(const kind of ['documentacao','inic']){
 test(`${kind}: rascunho válido preserva conteúdo e checklist`,()=>{
  const draft=newWritingDraft(kind);
  draft.metadata.authors='Autora A\nAutor B';
  draft.sections.introducao='Primeiro parágrafo.\n\nSegundo parágrafo.';
  const restored=validateWritingDraft(JSON.parse(JSON.stringify(draft)),kind);
  assert.deepEqual(restored,draft);
  assert.notEqual(restored,draft);
 });
 test(`${kind}: exportação HTML neutraliza marcação e atributos enviados pelo usuário`,()=>{
  const draft=newWritingDraft(kind);
  draft.metadata.title='<script>alert("x")</script>';
  draft.metadata.authors='A & B';
  draft.sections.introducao='<img src=x onerror=alert(1)>\n\nTexto & evidência.';
  const html=writingDocumentHTML(draft);
  assert(!html.includes('<script>'));
  assert(!html.includes('<img '));
  assert(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert(html.includes('A &amp; B'));
  assert(html.includes('<p>Texto &amp; evidência.</p>'));
  assert(html.includes('lang="pt-BR"'));
 });
 test(`${kind}: importação recusa outro tipo de documento e entradas malformadas`,()=>{
  const draft=newWritingDraft(kind);
  assert.throws(()=>validateWritingDraft({...draft,kind:kind==='inic'?'documentacao':'inic'},kind));
  assert.throws(()=>validateWritingDraft({...draft,version:2},kind));
  assert.throws(()=>validateWritingDraft({...draft,review:['inexistente']},kind));
  assert.throws(()=>validateWritingDraft({...draft,sections:{...draft.sections,introducao:123}},kind));
  assert.throws(()=>validateWritingDraft({...draft,metadata:{...draft.metadata,extra:'x'}},kind));
  assert.throws(()=>validateWritingDraft({...draft,metadata:{...draft.metadata,title:'x'.repeat(4001)}},kind));
  assert.throws(()=>validateWritingDraft({...draft,sections:{...draft.sections,introducao:'x'.repeat(150001)}},kind));
 });
 test(`${kind}: falha na validação não altera o rascunho de entrada`,()=>{
  const draft=newWritingDraft(kind);
  draft.sections.introducao='Texto que precisa ser preservado.';
  const original=JSON.stringify(draft);
  assert.throws(()=>validateWritingDraft({...draft,review:['inválido']},kind));
  assert.equal(JSON.stringify(draft),original);
 });
 test(`${kind}: exportação de texto mantém conteúdo e seções em elaboração`,()=>{
  const draft=newWritingDraft(kind);
  draft.sections.introducao='Primeiro\n\nSegundo';
  const text=writingDocumentText(draft);
  assert(text.includes('Primeiro\n\nSegundo'));
  assert(text.includes('[Em elaboração]'));
  assert(text.includes(draft.metadata.title));
 });
}

test('contagem de palavras respeita espaços, quebras de linha e texto vazio',()=>{
 assert.equal(countWritingWords(' a  b\n c '),3);
 assert.equal(countWritingWords(''),0);
 assert.equal(countWritingWords(' \n\t '),0);
 assert.equal(countWritingWords('mucosa bucal'),2);
});
test('escape cobre entidades, marcação e ambas as aspas',()=>{
 assert.equal(escapeWritingHTML('<>&"\''),'&lt;&gt;&amp;&quot;&#39;');
});
