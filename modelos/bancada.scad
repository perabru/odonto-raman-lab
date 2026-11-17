// OdontoRaman Lab | mm | protótipo didático com LED. NÃO é barreira laser.
// Abra no OpenSCAD; selecione part; F6; Exportar STL. Medir placa antes de imprimir.
part = "base"; // [base,tampa,bandeja]
$fn=48;
W=180; D=140; H=65; wall=3;
module roundedbox(w,d,h,r=5){hull()for(x=[r,w-r],y=[r,d-r])translate([x,y,0])cylinder(h=h,r=r);}
module base(){difference(){roundedbox(W,D,H);translate([wall,wall,wall])roundedbox(W-2*wall,D-2*wall,H+1,3);translate([-1,18,8])cube([5,16,10]); // USB universal
 for(x=[145,160])translate([x,-1,28])rotate([-90,0,0])cylinder(h=5,d=5.4); // LED
 translate([125,-1,28])rotate([-90,0,0])cylinder(h=5,d=6.4); // botão de painel/adaptador
 } }
module lid(){difference(){union(){roundedbox(W,D,3);translate([3.4,3.4,3])difference(){roundedbox(W-6.8,D-6.8,3,3);translate([2,2,-.1])roundedbox(W-10.8,D-10.8,3.2,2);}}translate([W/2,D/2,-.1])cylinder(h=3.2,d=5.4);} }
module tray(){difference(){roundedbox(70,55,8,4);translate([35,27.5,3])cylinder(h=6,d=24);for(x=[9,61])translate([x,27.5,-1])cylinder(h=10,d=3.4);}}
if(part=="base")base();if(part=="tampa")lid();if(part=="bandeja")tray();
