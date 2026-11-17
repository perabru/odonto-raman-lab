// Molar idealizado para ensino. Unidades mm. Não é anatomia de paciente.
// part = completo (STL), esmalte/dentina/polpa (corte para visualização).
part="completo"; $fn=48;
module crown(){hull(){for(x=[-8,8],y=[-6,6])translate([x,y,19])scale([7.2,7.5,8])sphere(1);translate([0,0,12])scale([12,10,4])sphere(1);}for(x=[-7,7],y=[-6,6])translate([x,y,24])scale([7,7,5])sphere(1);}
module roots(){for(x=[-1,1])hull(){translate([x*5,0,11])scale([7,8,5])sphere(1);translate([x*9,0,-9])scale([3,4,3])sphere(1);translate([x*10,0,-15])scale([1.4,2,2])sphere(1);}}
module tooth(){union(){crown();roots();}}
module inner(){translate([0,0,1])scale([.8,.8,.9])tooth();}
module pulp(){hull(){translate([0,0,17])scale([5,3.8,6])sphere(1);translate([0,0,8])scale([5,3,3])sphere(1);}for(x=[-1,1])hull(){translate([x*3,0,9])scale([2,1.8,3])sphere(1);translate([x*8.8,0,-12])scale([.7,.7,1.8])sphere(1);}}
module half(){translate([-50,-50,-30])cube([100,50,100]);}
if(part=="completo")translate([0,0,17])tooth();
if(part=="esmalte")intersection(){difference(){tooth();inner();}half();}
if(part=="dentina")intersection(){difference(){inner();pulp();}half();}
if(part=="polpa")intersection(){pulp();half();}
