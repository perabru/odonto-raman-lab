import {mesh,sphere,tube} from './scene-geometry.js';
// Original educational cross-section; dimensions are deliberately not anatomical scale.
export function mucosaScene({altered=false,separated=false}={}){
 const meshes=[],w=5.8,d=2.65,nx=68,nz=26;
 const top=(x,z)=>.79+.05*Math.sin(x*2.1+z)*Math.cos(z*2)+.025*Math.cos(x*5.4-z*2);
 const basal=(x,z)=>.07+.105*Math.cos(x*3.3)*Math.cos(z*1.5)+.035*Math.sin(x*7.4+z*1.7);
 const invasion=(x,z)=>altered?-.39*Math.exp(-Math.pow(x/.5,2))*Math.exp(-Math.pow((z-1.2)/.8,2)):0;
 const low=(x,z)=>basal(x,z)+invasion(x,z);
 const face=(m,a,b,c)=>{const u=b.map((v,i)=>v-a[i]),v=c.map((p,i)=>p-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1;m.positions.push(...a,...b,...c);m.normals.push(...n.map(v=>v/l),...n.map(v=>v/l),...n.map(v=>v/l));};
 function layer(name,bottom,upper,color,offset=0){const m=mesh(name,color);m.offset=[0,offset,0];m.organic=true;m.roughness=.44;
  const point=(i,j,fn)=>{const x=-w/2+i*w/nx,z=-d/2+j*d/nz;return[x,fn(x,z),z];};
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++)for(const [fn,reverse] of [[upper,false],[bottom,true]]){if(name==='basal'&&altered&&Math.abs(-w/2+(i+.5)*w/nx)<.57&&(-d/2+j*d/nz)>.55)continue;const a=point(i,j,fn),b=point(i,j+1,fn),c=point(i+1,j+1,fn),dd=point(i+1,j,fn);face(m,a,reverse?c:b,reverse?b:c);face(m,a,reverse?dd:c,reverse?c:dd);}
  function side(i,j,k,l){if(name==='basal'&&altered&&j===nz&&Math.abs(-w/2+(i+.5)*w/nx)<.57)return;const a=point(i,j,bottom),b=point(i,j,upper),c=point(k,l,upper),dd=point(k,l,bottom);face(m,a,b,c);face(m,a,c,dd);}
  for(let i=0;i<nx;i++){side(i,0,i+1,0);side(i+1,nz,i,nz);}for(let j=0;j<nz;j++){side(0,j+1,0,j);side(nx,j,nx,j+1);}meshes.push(m);return m;
 }
 layer('conjuntivo',()=>-.95,(x,z)=>low(x,z)-.035,[.73,.39,.4]);
 layer('basal',(x,z)=>low(x,z)-.035,low,[.91,.69,.56],separated?.32:0);
 layer('epitelio',low,top,[.87,.51,.52],separated?.67:0);
 const merge=(target,item)=>{target.positions.push(...item.positions);target.normals.push(...item.normals);};
 const cells=mesh('celulas',[.8,.43,.5]),nuclei=mesh('celulas',[.38,.16,.29]);cells.offset=nuclei.offset=[0,separated?.67:0,0];cells.organic=true;nuclei.roughness=.54;
 for(let row=0;row<5;row++)for(let i=0;i<27;i++){
  let x=-2.79+i*.207+(row%2)*.055;const t=(row+.5)/5,b=low(x,d/2),y=b+(top(x,d/2)-b)*t;
  const abnormal=altered&&Math.abs(x)<.62;const jitter=abnormal?.025*Math.sin(i*4+row*3):0;const rx=.087*(1+(abnormal?.3:0)),ry=.065*(1-t*.5)*(abnormal?1.2:1);
  merge(cells,sphere('celulas',[x+jitter,y+jitter,d/2+.008],[rx,ry,.023],cells.color,7));
  merge(nuclei,sphere('celulas',[x+jitter+.01*Math.sin(i*2+row),y+jitter,d/2+.029],[rx*(abnormal?.6:.42),ry*.47,.015],nuclei.color,7));
 }
 meshes.push(cells,nuclei);
 const collagen=mesh('conjuntivo',[.91,.65,.61]);collagen.roughness=.72;
 for(let j=0;j<7;j++)for(let i=0;i<14;i++){
  const x=-2.8+i*.4+(j%2)*.08,y=-.17-j*.11;
  const pts=Array.from({length:12},(_,k)=>[x+k*.028,y+.018*Math.sin(k*.45+i+j),d/2+.008]);
  merge(collagen,tube('conjuntivo',pts,.009,collagen.color,5));
 }meshes.push(collagen);
 const vessels=mesh('vasos',[.62,.13,.2]);vessels.roughness=.35;
 const main=Array.from({length:64},(_,i)=>{let x=-2.9+i*5.8/63;return [x,-.65+.065*Math.sin(x*2),d/2+.025];});merge(vessels,tube('vasos',main,.045,vessels.color,10));
 for(const x of [-2.2,-1.2,.9,2]){const pts=Array.from({length:30},(_,k)=>{const t=k/29;return[x+.2*Math.sin(t*3),-.65+t*.48,d/2+.025];});merge(vessels,tube('vasos',pts,.022,vessels.color,8));}meshes.push(vessels);
 return meshes;
}
