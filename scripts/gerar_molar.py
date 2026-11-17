"""Molar didático original. Instale numpy e scikit-image; execute da raiz.
Geometria idealizada em mm, ampliada para ensino; não deriva de pacientes.
Marching cubes: https://scikit-image.org/docs/stable/api/skimage.measure.html
"""
from pathlib import Path
import struct
import numpy as np
from skimage.measure import marching_cubes

STEP = 0.8
x = np.arange(-23.6, 24.4, STEP, dtype=np.float32)
y = np.arange(-42.8, 30.8, STEP, dtype=np.float32)  # eixo vertical
z = np.arange(-20.4, 21.2, STEP, dtype=np.float32)
X, Y, Z = np.meshgrid(x, y, z, indexing='ij')

def union(a, b, k=2.0):
    h = np.maximum(k-np.abs(a-b), 0)/k
    return np.minimum(a, b)-h*h*k*.25

def ellipsoid(cx, cy, cz, rx, ry, rz):
    return (np.sqrt(((X-cx)/rx)**2+((Y-cy)/ry)**2+((Z-cz)/rz)**2)-1)*min(rx, ry, rz)

def root(side, inner=False):
    field = np.full(X.shape, 1e3, dtype=np.float32)
    for t in np.linspace(0, 1, 28):
        cx = side*(6+7*t-1.4*t*t)
        cy = 3-40*t
        cz = -1.0+2*t*t if side < 0 else 1.5-3*t*t
        radius = (6.3*(1-t)**.72+.8) if not inner else (1.4*(1-t)**.7+.45)
        field = union(field, ellipsoid(cx,cy,cz,radius,2.1 if inner else 4,radius*.84), .7)
    return field

# Coroa arredondada com quatro cúspides; a fissura é uma depressão suave.
crown = ((np.abs(X/16.2)**3.3+np.abs(Z/12.4)**3.3+np.abs((Y-11)/10.4)**3.3)**(1/3.3)-1)*10
for a, b, h in [(-8,-6,22),(8,-6,21),(-8,6,21),(8,6,22)]:
    crown = union(crown,ellipsoid(a,h-4,b,8.5,7,7),2.2)
outer = union(union(crown, root(-1),2.8),root(1),2.8)
# Esmalte apenas na coroa. A porção radicular é representada pela dentina;
# cemento e ligamento periodontal não são modelados neste esquema.
enamel_inner = np.maximum(outer+2.2, -Y+1)
enamel = np.maximum(np.maximum(outer, -enamel_inner), -Y+1)
body = np.minimum(outer+2.2, np.maximum(outer,Y-1))
pulp = ellipsoid(0,10,0,6,7.8,4.3)
for side in [-1,1]:
    pulp = union(pulp,root(side,True),1.8)
    pulp = union(pulp,ellipsoid(side*4.8,16,-.5,2,4,2),1.2)
dentin = np.maximum(body,-pulp)
# Corte frontal plano em Z=0; volumes fechados para exportação.
fields = {'completo':outer, 'esmalte':np.maximum(enamel,Z), 'dentina':np.maximum(dentin,Z), 'polpa':np.maximum(pulp,Z)}
out=Path('modelos');out.mkdir(exist_ok=True)
for name, field in fields.items():
    vertices, faces, _, _ = marching_cubes(field, 0, spacing=(STEP,STEP,STEP), gradient_direction='ascent',allow_degenerate=False)
    vertices += np.array([x[0],y[0],z[0]])
    # STL usa Z para altura; viewer transforma de volta para Y vertical.
    vertices=vertices[:,[0,2,1]]
    faces=faces[:,[0,2,1]]
    triangles=vertices[faces]
    volume=np.sum(np.einsum('ij,ij->i',triangles[:,0],np.cross(triangles[:,1],triangles[:,2])))/6
    if volume < 0:
        faces=faces[:,[0,2,1]]
        triangles=vertices[faces]
    normals=np.cross(triangles[:,1]-triangles[:,0], triangles[:,2]-triangles[:,0])
    normals/=np.maximum(np.linalg.norm(normals,axis=1,keepdims=True),1e-12)
    with (out/(name+'.stl')).open('wb') as f:
        f.write(('OdontoRaman v2 - molar didatico idealizado - '+name).encode().ljust(80,b' '));f.write(struct.pack('<I',len(faces)))
        for n,t in zip(normals,triangles):f.write(struct.pack('<12fH',*n,*t.flatten(),0))
    edges=np.sort(np.concatenate([faces[:,[0,1]],faces[:,[1,2]],faces[:,[2,0]]]),axis=1)
    _, counts=np.unique(edges,axis=0,return_counts=True)
    assert np.all(counts==2), f'{name}: malha aberta'
    print(name, len(faces),'triangulos; malha fechada')
