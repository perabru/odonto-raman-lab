export function initPWA(){
 const $=s=>document.querySelector(s),status=$('#pwa-offline-status');let prompt=null;
 const network=()=>{$('#pwa-network').textContent=navigator.onLine?'Com conexão':'Sem conexão · dados locais';$('#pwa-network').classList.toggle('offline',!navigator.onLine);};network();window.addEventListener('online',network);window.addEventListener('offline',network);
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;$('#pwa-install').hidden=false;});
 $('#pwa-install').onclick=async()=>{if(!prompt)return;await prompt.prompt();await prompt.userChoice;prompt=null;$('#pwa-install').hidden=true;};
 window.addEventListener('appinstalled',()=>{$('#pwa-install').hidden=true;});
 if(!('serviceWorker' in navigator)||!window.isSecureContext){status.textContent='Uso offline indisponível neste navegador/contexto. Abra o site por HTTPS.';return;}
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{
  const update=()=>{if(reg.waiting&&navigator.serviceWorker.controller){$('#pwa-update').hidden=false;$('#pwa-update').textContent='Atualização disponível · salve e atualize';$('#pwa-update').onclick=()=>{reg.waiting?.postMessage({type:'ACTIVATE_UPDATE'});};}};update();
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')update();if(worker.state==='redundant'&&!reg.active)status.textContent='Preparação offline falhou. Verifique a conexão e reabra o app.';});});
  let controlled=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(controlled)location.reload();else{controlled=true;status.textContent='App preparado para uso offline';}});
  navigator.serviceWorker.ready.then(()=>{status.textContent='App preparado para uso offline';});
 }).catch(()=>{status.textContent='Não foi possível preparar o modo offline. Continue online e exporte seus registros.';});
}
