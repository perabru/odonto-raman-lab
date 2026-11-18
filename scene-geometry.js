// Original procedural models: geometry is schematic, never a PCB or optical blueprint.
const colors={green:[.18,.72,.56],blue:[.29,.62,.95],orange:[1,.66,.3],red:[.95,.26,.35],white:[.89,.93,.91],dark:[.09,.16,.18],metal:[.55,.64,.67]};
export {colors};
export function mesh(name,color){return {name,color,positions:[],normals:[],roughness:.55,metalness:0};}
function tri(m,a,b,c){const u=b.map((x,i)=>x-a[i]),v=c.map((x,i)=>x-a[i]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1;n=n.map(x=>x/l);m.positions.push(...a,...b,...c);m.normals.push(...n,...n,...n);}
export function box(name,c,size,color=colors.green){const m=mesh(name,color),[x,y,z]=c,[w,h,d]=size.map(a=>a/2),p=[[-w,-h,-d],[w,-h,-d],[w,h,-d],[-w,h,-d],[-w,-h,d],[w,-h,d],[w,h,d],[-w,h,d]].map(v=>[v[0]+x,v[1]+y,v[2]+z]);for(const [a,b,c,d] of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,1,5,4],[3,7,6,2]]){tri(m,p[a],p[b],p[c]);tri(m,p[a],p[c],p[d]);}return m;}
// Smooth vertex normals preserve rounded LED lenses, wire insulation and optical mounts.
export function sphere(name,c,r,color=colors.white,steps=14){
 const m=mesh(name,color);r=Array.isArray(r)?r:[r,r,r];
 const point=(u,v)=>[c[0]+r[0]*Math.sin(v)*Math.cos(u),c[1]+r[1]*Math.cos(v),c[2]+r[2]*Math.sin(v)*Math.sin(u)];
 const face=(a,b,d)=>{tri(m,a,b,d);for(let i=m.normals.length-9,j=0;j<3;j++,i+=3){const pt=[a,b,d][j],n=pt.map((v,k)=>(v-c[k])/(r[k]*r[k])),l=Math.hypot(...n)||1;m.normals.splice(i,3,...n.map(x=>x/l));}};
 for(let j=0;j<steps;j++)for(let i=0;i<steps*2;i++){const u=i*Math.PI/steps,v=j*Math.PI/steps,a=point(u,v),b=point(u+Math.PI/steps,v),cc=point(u+Math.PI/steps,v+Math.PI/steps),d=point(u,v+Math.PI/steps);face(a,b,cc);face(a,cc,d);}m.roughness=.24;return m;
}
export function tube(name,points,r,color=colors.green,sides=8){
 const m=mesh(name,color),norms=[];
 const rings=points.map((p,i)=>{const q=points[Math.min(i+1,points.length-1)],prev=points[Math.max(0,i-1)],t=q.map((a,k)=>a-prev[k]);let len=Math.hypot(...t)||1;for(let k=0;k<3;k++)t[k]/=len;const ref=Math.abs(t[1])>.85?[1,0,0]:[0,1,0];let u=[t[1]*ref[2]-t[2]*ref[1],t[2]*ref[0]-t[0]*ref[2],t[0]*ref[1]-t[1]*ref[0]],l=Math.hypot(...u)||1;u=u.map(x=>x/l);const v=[t[1]*u[2]-t[2]*u[1],t[2]*u[0]-t[0]*u[2],t[0]*u[1]-t[1]*u[0]];const ns=Array.from({length:sides},(_,k)=>u.map((a,d)=>a*Math.cos(k*2*Math.PI/sides)+v[d]*Math.sin(k*2*Math.PI/sides)));norms.push(ns);return ns.map(n=>p.map((a,d)=>a+r*n[d]));});
 const face=(a,b,c,na,nb,nc)=>{m.positions.push(...a,...b,...c);m.normals.push(...na,...nb,...nc);};
 for(let i=0;i<rings.length-1;i++)for(let k=0;k<sides;k++){const n=(k+1)%sides;face(rings[i][k],rings[i+1][n],rings[i+1][k],norms[i][k],norms[i+1][n],norms[i+1][k]);face(rings[i][k],rings[i][n],rings[i+1][n],norms[i][k],norms[i][n],norms[i+1][n]);}
 for(let k=0;k<sides;k++){const n=(k+1)%sides;tri(m,points[0],rings[0][n],rings[0][k]);const j=rings.length-1;tri(m,points[j],rings[j][k],rings[j][n]);}m.roughness=.32;return m;
}
function material(m,roughness=.4,metalness=0){m.roughness=roughness;m.metalness=metalness;return m;}
function cylinder(name,c,r,length,color,axis='y',sides=20){const a=c.slice(),b=c.slice(),k={x:0,y:1,z:2}[axis];a[k]-=length/2;b[k]+=length/2;return tube(name,[a,b],r,color,sides);}
function wire(name,points,color){const smooth=[];for(let i=0;i<points.length-1;i++){const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],d=points[Math.min(points.length-1,i+2)];for(let j=0;j<8;j++){const t=j/8;smooth.push(b.map((v,k)=>.5*((2*v)+(-a[k]+c[k])*t+(2*a[k]-5*v+4*c[k]-d[k])*t*t+(-a[k]+3*v-3*c[k]+d[k])*t*t*t)));}}smooth.push(points.at(-1));return tube(name,smooth,.027,color,8);}
function screw(c,name='base'){return [material(cylinder(name,c,.075,.04,colors.metal),.24,.8),box(name,[c[0],c[1]+.023,c[2]],[.095,.004,.014],colors.dark)];}
export function waveScene({phase=0,laser=785,shift=960,mode='stokes',magnetic=true}={}){const outNm=mode==='rayleigh'?laser:1/(1/laser+(mode==='anti'?1:-1)*shift/1e7),ratio=outNm/laser;const pieces=[sphere('amostra',[0,0,0],[.4,.52,.42],colors.white),box('laser',[-4.1,0,0],[.7,.65,.65],colors.dark),box('detector',[4.1,0,0],[.65,1.1,.8],colors.dark)];for(const [start,end,k,c,id] of [[-3.75,-.5,1,colors.green,'incidente'],[.5,3.75,1/ratio,mode==='anti'?colors.blue:mode==='rayleigh'?colors.green:colors.orange,'espalhada']]){const pts=Array.from({length:95},(_,i)=>{const x=start+(end-start)*i/94;return [x,.62*Math.sin((x*6-phase)*k),0];});pieces.push(tube(id,pts,.038,c));if(magnetic)pieces.push(tube('magnetico',pts.map(p=>[p[0],0,p[1]]),.018,colors.blue));pieces.push(tube('eixo',[[start,0,0],[end,0,0]],.009,[.25,.37,.4]));}for(const m of pieces)if(["incidente","espalhada","magnetico"].includes(m.name))m.unlit=true;return {meshes:pieces,outNm};}
export function benchScene({lidOpen=false,running=false,progress=0}={}){
 const m=[material(box('base',[0,-.22,0],[8,.3,5.2],[.15,.24,.25]),.62),box('esp32',[-2,.07,0],[1.8,.13,3.2],[.025,.24,.17]),material(box('esp32',[-2,.23,.22],[1.28,.22,1.6],colors.metal),.3,.85),material(box('usb',[-2,.19,1.53],[.7,.28,.49],colors.metal),.2,.9),box('usb',[-2,.19,1.783],[.51,.13,.012],colors.dark),box('protoboard',[1.3,.02,0],[2.8,.23,3.5],[.84,.87,.82])];
 // PCB antenna and header sockets give the ESP32 its recognizable form.
 for(let i=0;i<5;i++)m.push(box('esp32',[-2.42+i*.2,.15,-1.24],[.12,.014,.45],[.7,.56,.22]));
 m.push(box('esp32',[-2,.15,-1.46],[.96,.014,.035],[.7,.56,.22]));
 for(const x of [-2.86,-1.14]){m.push(box('pinos',[x,.17,0],[.2,.18,2.95],colors.dark));for(let i=0;i<15;i++)m.push(material(box('pinos',[x,.3,-1.35+i*.19],[.06,.15,.06],[.74,.63,.35]),.2,.7));}
 for(const x of [-2.62,-1.38])for(const z of [-1.2,1.23])m.push(material(cylinder('esp32',[x,.15,z],.065,.012,[.68,.65,.48]),.4,.6));
 for(let i=0;i<8;i++)m.push(box('esp32',[-2.62+i*.17,.16,1.19],[.08,.07,.12],i%2?colors.metal:colors.dark));
 // Two terminal strips, central trench and color-coded supply rails.
 m.push(box('protoboard',[1.3,.139,0],[.13,.012,3.25],[.47,.53,.5]));
 for(let i=0;i<15;i++)for(const x of [.2,.38,.56,.74,.92,1.67,1.85,2.03,2.21,2.39])m.push(box('protoboard',[x,.141,-1.43+i*.2],[.055,.012,.055],[.28,.34,.31]));
 for(const [x,c] of [[-.01,colors.red],[2.61,colors.blue]])m.push(box('protoboard',[x,.143,0],[.027,.009,3.18],c));
 for(const [x,id,on,color] of [[1.05,'led',running,colors.red],[2.17,'status',!lidOpen,[.25,.8,.39]]]){
  m.push(material(cylinder(id,[x,.31,-.72],.19,.2,on?color:color.map(v=>v*.43)),.17),material(sphere(id,[x,.43,-.72],[.19,.2,.19],on?color:color.map(v=>v*.43),12),.16),cylinder(id,[x,.22,-.72],.23,.055,on?color:color.map(v=>v*.6)));
  for(const dx of [-.075,.075])m.push(material(tube(id,[[x+dx,.22,-.72],[x+dx,.15,-.55]],.013,colors.metal),.3,.8));
  if(on){const light=sphere(id,[x,.49,-.65],[.07,.08,.06],color.map(v=>Math.min(1,v+.35)),8);light.unlit=true;m.push(light);}
 }
 m.push(box('botao',[2.17,.25,.8],[.55,.2,.55],colors.dark),material(box('botao',[2.17,.36,.8],[.48,.03,.48],colors.metal),.3,.8),cylinder('botao',[2.17,.44,.8],.15,.15,colors.dark),box('chave',[3.35,.2,-1.9],[.6,.3,.35],colors.dark),material(box('chave',[3.35,.4,-1.9],[.7,.055,.12],colors.metal),.24,.9));
 for(const x of [.38,1.66]){m.push(cylinder('resistor',[x,.25,-.42],.075,.42,[.75,.64,.45],'x',12));for(const [dx,c] of [[-.11,[.85,.65,.12]],[-.025,[.44,.12,.58]],[.06,[.36,.16,.05]],[.16,[.7,.56,.2]]])m.push(cylinder('resistor',[x+dx,.25,-.42],.077,.025,c,'x',12));for(const dx of [-1,1])m.push(material(tube('resistor',[[x+dx*.21,.25,-.42],[x+dx*.29,.25,-.42],[x+dx*.29,.15,-.42]],.013,colors.metal),.28,.8));}
 for(const [id,pts,c] of [['gpio25',[[-1.14,.36,-.2],[-.48,.65,-.36],[.08,.28,-.42]],colors.red],['gpio14',[[-1.14,.36,-.8],[-.55,.65,-2.1],[2.8,.4,-2.1],[3.35,.32,-2.1]],colors.blue],['gpio27',[[-1.14,.36,.7],[-.55,.62,1.65],[2.17,.27,1.25],[2.17,.25,1.05]],[.61,.36,.8]],['gnd',[[-1.14,.36,1.1],[-.3,.42,1.48],[.2,.18,1.48],[.2,.18,-.2]],[.11,.14,.15]],['gpio26',[[-1.14,.36,-.4],[-.26,.78,-.1],[1.35,.28,-.42]],colors.green]])m.push(wire(id,pts,c));
 for(const x of [-3.65,3.65])for(const z of [-2.18,2.18])m.push(...screw([x,-.045,z]));
 // Lid remains an outlined teaching model to keep the circuit visible.
 const y=lidOpen?3.3:.88;for(const [c,s] of [[[0,y,-2.4],[7.7,.1,.1]],[[0,y,2.4],[7.7,.1,.1]],[[-3.8,y,0],[.1,.1,4.8]],[[3.8,y,0],[.1,.1,4.8]]])m.push(material(box('tampa',c,s,[.42,.62,.58]),.22,.3));
 return m;
}
export function opticalScene(){
 const m=[material(box('mesa',[0,-.7,0],[9.5,.2,4],[.18,.22,.23]),.45,.5)];
 for(let i=0;i<18;i++)for(let j=0;j<7;j++)m.push(cylinder('mesa',[-4.25+i*.5,-.594,-1.5+j*.5],.025,.007,[.05,.07,.08], 'y',6));
 // Optomechanical forms illustrate function; dimensions are not an assembly blueprint.
 m.push(material(box('laser',[-3.7,-.02,0],[1.2,.72,1.05],[.19,.28,.3]),.32,.65),material(cylinder('laser',[-3.02,0,0],.18,.18,colors.metal,'x'),.25,.8));
 for(let i=0;i<6;i++)m.push(box('laser',[-4.13+i*.16,.36,0],[.045,.045,.87],colors.dark));
 function mount(name,c,color,axis='x'){
  m.push(material(box(name,[c[0],-.49,c[2]],[.62,.12,.55],colors.metal),.35,.7),material(cylinder(name,[c[0],-.28,c[2]],.07,.38,colors.metal),.22,.85));
  m.push(material(cylinder(name,c,.46,.13,colors.dark,axis,24),.32,.3),material(cylinder(name,c,.36,.15,color,axis,24),.13,.3));
 }
 mount('filtro',[-2.1,0,0],[.22,.52,.61]);mount('coleta',[0,0,-1.2],[.24,.49,.63],'z');mount('rejeicao',[1.45,0,-1.2],[.62,.42,.23]);
 m.push(material(cylinder('amostra',[0,-.42,0],.52,.23,colors.metal),.35,.7),material(cylinder('amostra',[0,-.25,0],.37,.11,colors.dark),.4,.2),sphere('amostra',[0,-.02,0],[.24,.25,.21],[.89,.86,.72],14));
 m.push(material(box('espectrometro',[3.2,-.05,-1.2],[1.65,.95,1.25],[.17,.23,.25]),.36,.65),material(cylinder('espectrometro',[2.32,0,-1.2],.16,.2,colors.metal,'x'),.28,.85));
 for(let i=0;i<6;i++)m.push(box('espectrometro',[2.72+i*.18,.43,-1.2],[.065,.012,.77],colors.dark));
 m.push(box('espectrometro',[3.55,.08,-.567],[.36,.24,.012],[.18,.52,.51]));
 for(const [name,pts,c] of [['laser-path',[[-2.95,0,0],[0,0,0]],colors.green],['raman-path',[[0,0,0],[0,0,-1.2],[2.4,0,-1.2]],colors.orange]]){const beam=tube(name,pts,.023,c,10);beam.unlit=true;m.push(beam);}
 return m;
}

// Layer dimensions and cell sizes are deliberately enlarged for teaching.
// The altered view illustrates disorganized architecture, not a histological diagnosis.
export function mucosaScene({altered=false}={}){
 const m=[],width=5.8,depth=3.1,stepsX=36,stepsZ=20;
 const relief=(x,z)=>.13*Math.cos(x*.85)*Math.cos(z*.9)+.026*Math.sin(x*5+z*3);
 function layer(name,low,high,color){
  const out=mesh(name,color),point=(i,j,h)=>{const x=-width/2+width*i/stepsX,z=-depth/2+depth*j/stepsZ;return[x,h+relief(x,z),z];};
  for(let j=0;j<stepsZ;j++)for(let i=0;i<stepsX;i++){tri(out,point(i,j,high),point(i,j+1,high),point(i+1,j+1,high));tri(out,point(i,j,high),point(i+1,j+1,high),point(i+1,j,high));tri(out,point(i,j,low),point(i+1,j+1,low),point(i,j+1,low));tri(out,point(i,j,low),point(i+1,j,low),point(i+1,j+1,low));}
  for(let i=0;i<stepsX;i++){tri(out,point(i,0,low),point(i,0,high),point(i+1,0,high));tri(out,point(i,0,low),point(i+1,0,high),point(i+1,0,low));tri(out,point(i,stepsZ,low),point(i+1,stepsZ,high),point(i,stepsZ,high));tri(out,point(i,stepsZ,low),point(i+1,stepsZ,low),point(i+1,stepsZ,high));}
  for(let j=0;j<stepsZ;j++){tri(out,point(0,j,low),point(0,j+1,high),point(0,j,high));tri(out,point(0,j,low),point(0,j+1,low),point(0,j+1,high));tri(out,point(stepsX,j,low),point(stepsX,j,high),point(stepsX,j+1,high));tri(out,point(stepsX,j,low),point(stepsX,j+1,high),point(stepsX,j+1,low));}out.roughness=.64;return out;
 }
 m.push(layer('conjuntivo',-.85,-.06,[.64,.3,.35]),layer('basal',-.06,.015,[.83,.61,.52]),layer('epitelio',.015,.67,[.78,.42,.43]));
 // The front face functions as a cut section with enlarged nuclei.
 for(let row=0;row<4;row++)for(let i=0;i<19;i++){const x=-2.7+i*.3+(row%2)*.055,y=.075+row*.147+relief(x,1.56),variant=altered&&Math.abs(x)<.95;const jitter=variant?.045*Math.sin(i*3+row*2):0;const cell=sphere('celulas',[x+jitter,y,1.568],[variant?.095:.059,variant?.065:.035,.025],[.46,.19,.28],8);cell.roughness=.7;m.push(cell);}
 if(altered){for(let j=0;j<4;j++)for(let i=0;i<5-j;i++){const x=-.54+i*.26+j*.07,y=-.04-j*.15+relief(x,1.57);m.push(material(sphere('celulas',[x,y,1.575],[.1,.078,.028],[.53,.19,.32],9),.67));}}
 const vesselPaths=[[[-2.6,-.58,1.58],[-1.6,-.4,1.58],[-.6,-.58,1.58],[.6,-.47,1.58],[2.6,-.62,1.58]],[[-1.6,-.4,1.58],[-1.3,-.18,1.58]],[ [.6,-.47,1.58],[1,-.2,1.58]]];
 for(const pts of vesselPaths)m.push(tube('vasos',pts,.035,[.5,.14,.19],8));
 for(let i=0;i<14;i++){const x=-2.5+i*.38,y=-.26-.26*((i*7)%11)/11;m.push(tube('conjuntivo',[[x,y,1.57],[x+.1,y+.025,1.57],[x+.23,y-.014,1.57]],.009,[.87,.62,.6],6));}
 return m;
}
