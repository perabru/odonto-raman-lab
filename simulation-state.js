// Educational state model; no access to physical hardware.
export function scatteredWavelength(laser,shift,mode='stokes'){
 const delta=mode==='rayleigh'?0:mode==='anti'?-shift:shift;
 const den=1/laser-delta/1e7;
 if(!(laser>0&&shift>=0&&den>0))throw Error('Parâmetros inválidos.');
 return 1/den;
}
export class BenchSimulation{
 constructor(){this.lidOpen=false;this.state='ready';this.startedAt=0;this.elapsed=0;this.events=[];}
 event(type){this.events.push(type);this.events=this.events.slice(-8);}
 start(now){if(this.lidOpen){this.state='interrupted';this.event('bloqueado: tampa aberta');return false;}if(this.state==='running')return false;this.startedAt=now;this.elapsed=0;this.state='running';this.event('início: LED ligado');return true;}
 setLid(open,now){this.tick(now);this.lidOpen=open;if(open&&this.state==='running'){this.state='interrupted';this.event('interrupção: LED apagado');}this.event(open?'tampa aberta':'tampa fechada');}
 tick(now){if(this.state==='running'){this.elapsed=Math.max(0,Math.min(3,(now-this.startedAt)/1000));if(this.elapsed>=3){this.state='complete';this.event('concluído: LED apagado');}}return this.state;}
}
