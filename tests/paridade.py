"""Testes independentes e comparação das implementações Python / JavaScript."""
import sys,json,subprocess,unittest
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'python'))
from analisar import analyze,feature,read_csv
ROOT=Path(__file__).resolve().parents[1]
class AnalysisTests(unittest.TestCase):
 def test_gaussian(self):
  x=np.linspace(930,990,601); y=100*np.exp(-.5*((x-960)/4)**2)
  f=feature(x,y,930,990)
  self.assertAlmostEqual(f['fwhm'],2.35482*4,delta=.01)
  self.assertAlmostEqual(f['area'],100*4*np.sqrt(2*np.pi),delta=.01)
 def test_js_python_parity(self):
  script="import fs from 'node:fs';import {parseCSV,processSpectrum} from './spectra.js';console.log(JSON.stringify(processSpectrum(parseCSV(fs.readFileSync('dados/esmalte_simulado.csv','utf8')),{correct:true,smooth:true,norm:'max'})))"
  js=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT))
  x,y,_=read_csv(ROOT/'dados/esmalte_simulado.csv');_,_,py=analyze(x,y,True,True,'max')
  for name in ['phosphate','carbonate','organic']:
   for metric in ['area','height','fwhm','position']:
    self.assertAlmostEqual(js['features'][name][metric],py['features'][name][metric],places=9)
 def test_zero_and_truncated(self):
  self.assertIsNone(feature(np.array([1,2,3]),np.zeros(3),930,990))
  x=np.linspace(400,1800,701);_,_,r=analyze(x,np.zeros(701))
  self.assertIsNone(r['carbonate_ratio']);self.assertIsNone(r['features']['phosphate']['fwhm'])
if __name__=='__main__':unittest.main()
