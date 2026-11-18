import {initFT} from './ft-lab.js';
import {ModelViewer} from './viewer.js?v=3.2';
import {mucosaScene} from './tissue-scene.js';
import {initPlanning} from './planning.js?v=3.2';
import {initWriting} from './writing.js?v=3.2';
import {initMucosaLab} from './mucosa-lab.js?v=3.2';
export function initResearch(hero){
 initFT();initPlanning();initWriting();initMucosaLab();
 hero.scene='mucosa';hero.reset();hero.setMeshes(mucosaScene());
 let viewer;const $=s=>document.querySelector(s);
 const stories={epitelio:['Epitélio','Revestimento superficial estratificado. É o tecido de origem do carcinoma espinocelular.'],basal:['Limite basal','Separa o epitélio do conjuntivo no esquema. A invasão atravessa esse limite; sua avaliação é histológica.'],conjuntivo:['Tecido conjuntivo','Suporte abaixo do epitélio. Contém matriz extracelular, células e vasos.'],vasos:['Vasos','Representação ampliada de vasos no conjuntivo. Não é um mapa vascular individual.'],celulas:['Células e núcleos','Os núcleos foram ampliados para mostrar organização e desorganização. Forma e cor neste modelo não medem malignidade.']};
 function select(name){if(!stories[name])return;viewer?.setSelected(name);$('#mucosa-story').innerHTML=`<b>${stories[name][0]}</b><p>${stories[name][1]}</p>`;document.querySelectorAll('[data-mucosa-part]').forEach(b=>{b.classList.toggle('active',b.dataset.mucosaPart===name);b.setAttribute('aria-pressed',b.dataset.mucosaPart===name);});}
 function ensure(){if(!viewer){viewer=new ModelViewer($('#mucosa3d'),{onSelect:select});viewer.scene='mucosa';viewer.reset();viewer.setMeshes(mucosaScene());}return viewer;}
 $('#mucosa-plus').onclick=()=>ensure().zoom(-.4);$('#mucosa-minus').onclick=()=>ensure().zoom(.4);$('#mucosa-reset').onclick=()=>{ensure().reset();$('#mucosa-isolate').checked=false;select('epitelio');};
 function refreshTissue(){ensure().setMeshes(mucosaScene({altered:$('#mucosa-altered').checked,separated:$('#mucosa-separate').checked}));select($('#mucosa-altered').checked?'celulas':'epitelio');}$('#mucosa-altered').onchange=refreshTissue;$('#mucosa-separate').onchange=refreshTissue;$('#mucosa-front').onclick=()=>ensure().preset('front');$('#mucosa-top').onclick=()=>ensure().preset('top');$('#mucosa-isolate').onchange=e=>ensure().setSelected(viewer.selected||'epitelio',e.target.checked);
 document.querySelectorAll('[data-mucosa-part]').forEach(b=>b.onclick=()=>{ensure();select(b.dataset.mucosaPart);});
 function route(){if(location.hash==='#mucosa'){ensure().draw();}if(location.hash!=='#inicio')hero.setAuto(false);}
 window.addEventListener('hashchange',route);select('epitelio');route();
}

const reader=document.querySelector('#document-reader');
document.addEventListener('click',e=>{const button=e.target.closest('[data-view-document]');if(!button)return;const path=button.dataset.viewDocument;if(!['docs/Furuse_2006_FT_Raman_Mucosa.pdf','docs/Manual_Monografia_UNIVAP.pdf'].includes(path))return;reader.querySelector('iframe').src=path;document.querySelector('#reader-download').href=path;document.querySelector('#reader-title').textContent=button.dataset.documentTitle||'Documento';reader.showModal();});
document.querySelector('#reader-close').onclick=()=>reader.close();
