// Minimal OOXML export, entirely on the device. No service receives the draft.
const enc=new TextEncoder();
const xml=s=>String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(bytes){let n=0xffffffff;for(const b of bytes)n=crcTable[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
export function zipFiles(files){
 const parts=[],central=[];let offset=0,size=0;
 for(const [name,source] of Object.entries(files)){
  const filename=enc.encode(name),bytes=typeof source==='string'?enc.encode(source):source,crc=crc32(bytes);
  const local=new Uint8Array(30+filename.length),v=new DataView(local.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,crc,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,filename.length,true);local.set(filename,30);
  parts.push(local,bytes);
  const entry=new Uint8Array(46+filename.length),e=new DataView(entry.buffer);
  e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint16(8,0x800,true);e.setUint16(14,33,true);e.setUint32(16,crc,true);e.setUint32(20,bytes.length,true);e.setUint32(24,bytes.length,true);e.setUint16(28,filename.length,true);e.setUint32(42,offset,true);entry.set(filename,46);central.push(entry);size+=entry.length;offset+=local.length+bytes.length;
 }
 const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,central.length,true);e.setUint16(10,central.length,true);e.setUint32(12,size,true);e.setUint32(16,offset,true);
 const result=new Uint8Array(offset+size+22);let at=0;for(const p of [...parts,...central,end]){result.set(p,at);at+=p.length;}return result;
}
export function buildWordDocument(draft,config){
 const inic=draft.kind==='inic',m=draft.metadata,font=inic?'Arial':'Times New Roman',size=inic?20:24;
 const run=(s,bold=false)=>`<w:r><w:rPr>${bold?'<w:b/>':''}</w:rPr><w:t xml:space="preserve">${xml(s)}</w:t></w:r>`;
 const p=(s,{style='Normal',center=false,before=0,after=120,single=false,page=false,indent=null,align=null,noIndent=false,bold=false}={})=>`<w:p><w:pPr><w:pStyle w:val="${style}"/><w:jc w:val="${align||(center?'center':'both')}"/><w:spacing w:before="${before}" w:after="${after}" w:line="${single||inic?240:360}" w:lineRule="auto"/><w:ind w:firstLine="${noIndent||center||style!=='Normal'||inic||single?0:720}"${indent?` w:left="${indent}"`:''}/>${page?'<w:pageBreakBefore/>':''}</w:pPr>${String(s).split('\n').map((line,i)=>(i?'<w:r><w:br/></w:r>':'')+run(line,style==='Title'||bold)).join('')}</w:p>`;
 const sect=(header=false,restart=false)=>`<w:sectPr>${header?'<w:headerReference w:type="default" r:id="header"/>':'<w:headerReference w:type="default" r:id="blank"/>'}<w:type w:val="nextPage"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="${inic?2410:1701}" w:right="1134" w:bottom="1134" w:left="1701" w:header="1134" w:footer="708"/>${restart?'<w:pgNumType w:start="1"/>':''}</w:sectPr>`;
 let body='';
 if(inic){body=p(m.title.toUpperCase(),{style:'Title',center:true})+p(m.authors,{center:true,bold:true})+p([m.school,m.contact].filter(Boolean).join('\n'),{center:true});}
 else{
  body=p(m.school,{center:true})+p(m.authors,{center:true,before:1100})+p(m.title.toUpperCase(),{style:'Title',center:true,before:2200})+p([m.city,m.year].filter(Boolean).join('\n'),{center:true,before:3600});
  body+=p(m.authors,{center:true,page:true})+p(m.title.toUpperCase(),{style:'Title',center:true,before:2200})+p(`Trabalho de Conclusão de Curso apresentado a ${m.school||'[instituição e curso]'}.\nOrientador(a): ${m.advisor||'[nome e titulação]'}`,{single:true,indent:3969,before:1600})+p([m.city,m.year].filter(Boolean).join('\n'),{center:true,before:2500});
 }
 let numbered=false;
 for(const [id,title] of config.sections){
  const value=draft.sections[id];if(!value.trim())continue;
  if(!inic&&id==='dedicatoria'){body+=p(value,{page:true,before:10000,align:'left',noIndent:true});continue;}
  if(!inic&&id==='introducao'){
   body+=p('SUMÁRIO',{style:'Title',center:true,page:true})+'<w:p><w:fldSimple w:instr="TOC \\o &quot;1-2&quot; \\h \\z \\u"><w:r><w:t>Atualize este campo no Word para gerar o sumário.</w:t></w:r></w:fldSimple></w:p>';
   body+=`<w:p><w:pPr>${sect(false)}</w:pPr></w:p>`;numbered=true;
  }
  body+=p(title,{style:!inic&&!numbered?'Title':'Heading1',center:!inic&&!numbered,page:!inic&&id!=='introducao'});
  const single=['resumo','referencias'].includes(id);
  body+=value.split(/\n\s*\n/).filter(s=>s.trim()).map(s=>p(s,{single})).join('');
 }
 const ns='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
 const document=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${ns}><w:body>${body}${sect(!inic&&numbered,!inic&&numbered)}</w:body></w:document>`;
 const files={
  '[Content_Types].xml':`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${[['document','document.main'],['styles','styles'],['settings','settings'],['header1','header'],['blank','header']].map(([file,type])=>`<Override PartName="/word/${file}.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${type}+xml"/>`).join('')}</Types>`,
  '_rels/.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="doc" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
  'word/document.xml':document,
  'word/_rels/document.xml.rels':`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${[['styles','styles','styles.xml'],['settings','settings','settings.xml'],['header','header','header1.xml'],['blank','header','blank.xml']].map(([id,type,target])=>`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="${target}"/>`).join('')}</Relationships>`,
  'word/styles.xml':`<w:styles ${ns}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}"/><w:sz w:val="${size}"/><w:color w:val="000000"/><w:lang w:val="pt-BR"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:widowControl/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:keepLines/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/></w:rPr></w:style></w:styles>`,
  'word/settings.xml':`<w:settings ${ns}><w:updateFields w:val="true"/></w:settings>`,
  'word/header1.xml':`<w:hdr ${ns}><w:p><w:pPr><w:jc w:val="right"/></w:pPr><w:fldSimple w:instr="PAGE"><w:r><w:t>1</w:t></w:r></w:fldSimple></w:p></w:hdr>`,
  'word/blank.xml':`<w:hdr ${ns}><w:p/></w:hdr>`
 };
 return zipFiles(files);
}
