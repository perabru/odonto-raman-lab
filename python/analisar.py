#!/usr/bin/env python3
"""OdontoRaman Lab: análise exploratória, sem classificação clínica.
Uso: python analisar.py ../dados/esmalte_simulado.csv --saida resultado
Mesmo processamento do site: envoltória convexa inferior, média móvel opcional,
normalização opcional, linha de base local em cada janela. Requer Python 3.10+.
"""
import argparse, csv, json, math
from pathlib import Path
import numpy as np

def read_csv(path):
    text=Path(path).read_text(encoding='utf-8-sig')
    if len(text)>2_000_000: raise ValueError('Arquivo excede 2 MB.')
    lines=[s.strip() for s in text.splitlines() if s.strip() and not s.strip().startswith('#')]
    if not lines: raise ValueError('Arquivo vazio.')
    sep=';' if ';' in lines[0] else '\t' if '\t' in lines[0] else ','
    rows=[]
    for i,s in enumerate(lines):
        fields=next(csv.reader([s],delimiter=sep))
        if len(fields)!=2: raise ValueError(f'Linha {i+1}: use exatamente duas colunas.')
        try:
            values=[float(f.replace(',','.')) if sep==';' else float(f) for f in fields]
        except ValueError:
            if i==0 and any(k in fields[0].lower() for k in ('shift','raman','desloc','wavenumber')) and 'intens' in fields[1].lower(): continue
            raise ValueError(f'Linha {i+1}: valor inválido.')
        if not all(math.isfinite(v) for v in values) or not 0<=values[0]<=10000: raise ValueError(f'Linha {i+1}: valor fora dos limites.')
        rows.append(values)
    if not 20<=len(rows)<=20000: raise ValueError('Use 20 a 20.000 pontos.')
    rows=np.array(sorted(rows)); x,inds,counts=np.unique(rows[:,0],return_inverse=True,return_counts=True)
    y=np.bincount(inds,weights=rows[:,1])/counts
    if len(x)<20: raise ValueError('Use 20 deslocamentos distintos.')
    return x,y,int(len(rows)-len(x))

def baseline(x,y):
    hull=[]
    for i in range(len(x)):
        while len(hull)>=2:
            a,b=hull[-2:]
            cross=(x[b]-x[a])*(y[i]-y[b])-(y[b]-y[a])*(x[i]-x[b])
            if cross<=0: hull.pop()
            else: break
        hull.append(i)
    return np.interp(x,x[hull],y[hull])

def feature(x,y,lo,hi):
    if x[0]>lo or x[-1]<hi: return None
    xx=np.r_[lo,x[(x>lo)&(x<hi)],hi]
    if len(xx)<5:return None
    yy=np.interp(xx,x,y); yy=yy-np.interp(xx,[lo,hi],[yy[0],yy[-1]])
    p=int(np.argmax(yy)); height=float(yy[p]); half=height/2; left=right=None
    if height>1e-10:
        for i in range(p,0,-1):
            if yy[i-1]<=half<=yy[i]:
                left=float(xx[i-1]+(xx[i]-xx[i-1])*(half-yy[i-1])/(yy[i]-yy[i-1]));break
        for i in range(p,len(xx)-1):
            if yy[i]>=half>=yy[i+1]:
                right=float(xx[i]+(xx[i+1]-xx[i])*(half-yy[i])/(yy[i+1]-yy[i]));break
    area=float(np.sum(np.diff(xx)*(yy[1:]+yy[:-1])/2))
    return dict(position=float(xx[p]) if height>1e-10 else None,height=height,area=area,fwhm=right-left if left is not None and right is not None else None)

def analyze(x,raw,correct=True,smooth=False,norm='none'):
    b=baseline(x,raw) if correct else np.zeros_like(raw); y=raw-b
    steps=np.diff(x);uniform=bool(np.all(np.abs(steps-steps.mean())<=.05*steps.mean()))
    if smooth:
        if not uniform:raise ValueError('Suavização requer espaçamento uniforme (5%).')
        y=np.array([np.mean(y[max(0,i-1):min(len(y),i+2)]) for i in range(len(y))])
    factor=1.
    if norm=='max':factor=float(y.max())
    elif norm=='phosphate':
        subset=y[(x>=930)&(x<=990)];factor=float(subset.max()) if len(subset) else 0
    if factor<=1e-10:raise ValueError('Normalização sem intensidade positiva.')
    if norm!='none':y=y/factor
    f={name:feature(x,y,*w) for name,w in {'phosphate':(930,990),'carbonate':(1050,1090),'organic':(1420,1480)}.items()}
    def ratio(a,d):return a['area']/d['area'] if a and d and a['area']>0 and d['area']>max(1e-9,float(y.max())*.001) else None
    report=dict(features=f,carbonate_ratio=ratio(f['carbonate'],f['phosphate']),organic_ratio=ratio(f['organic'],f['phosphate']),uniform=uniform,max_step=float(steps.max()),normalization_factor=factor,processing={'baseline':correct,'smooth_3_points':smooth,'normalization':norm},clinical_interpretation=False)
    return y,b,report

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('csv');p.add_argument('--saida',default='resultado');p.add_argument('--sem-baseline',action='store_true');p.add_argument('--suavizar',action='store_true');p.add_argument('--normalizar',choices=['none','max','phosphate'],default='none');args=p.parse_args()
    try:
        x,raw,dups=read_csv(args.csv);y,b,report=analyze(x,raw,not args.sem_baseline,args.suavizar,args.normalizar)
        report.update(input=Path(args.csv).name,duplicates_averaged=dups,origin='confirmar na ficha; exemplos do projeto são simulados')
        out=Path(args.saida);out.mkdir(parents=True,exist_ok=True)
        np.savetxt(out/'espectro_processado.csv',np.column_stack([x,raw,y]),delimiter=',',header='shift_cm-1,intensity_raw,intensity_processed',comments='',fmt='%.8f')
        (out/'metricas.json').write_text(json.dumps(report,indent=2,ensure_ascii=False,allow_nan=False),encoding='utf-8')
        import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
        fig,axes=plt.subplots(2,1,figsize=(10,7),sharex=True);axes[0].plot(x,raw,color='#84928d',label='Bruto');axes[0].plot(x,b,color='#ce8d43',label='Linha de base');axes[1].plot(x,y,color='#177b64',label='Processado')
        for ax in axes:ax.legend();ax.grid(alpha=.15);ax.set_ylabel('Intensidade (u.a.)')
        axes[1].set_xlabel('Deslocamento Raman (cm⁻¹)');fig.suptitle('OdontoRaman • '+Path(args.csv).name+' • análise exploratória');fig.tight_layout();fig.savefig(out/'espectro.png',dpi=180);plt.close(fig)
        print(json.dumps(report,indent=2,ensure_ascii=False));print(f'Arquivos salvos em: {out.resolve()}')
    except (ValueError,OSError) as e:p.exit(2,f'Erro: {e}\n')
if __name__=='__main__':main()
