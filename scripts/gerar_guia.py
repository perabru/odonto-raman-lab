#!/usr/bin/env python3
"""Gera o guia pedagógico em PDF com as fontes e definições do projeto."""
from pathlib import Path
import json, subprocess, sys, html
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,Image,KeepTogether,Preformatted
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'python'))
from analisar import read_csv,analyze
jscode="import {references,bom,phases,questions} from './content.js';import {tracks} from './trilhas.js';console.log(JSON.stringify({references,bom,phases,questions,tracks}));"
meta=json.loads(subprocess.check_output(['node','--input-type=module','-e',jscode],cwd=ROOT))
fonts=Path('/usr/share/fonts/truetype/dejavu')
for name,file in [('D','DejaVuSans.ttf'),('DB','DejaVuSans-Bold.ttf'),('DI','DejaVuSans-Oblique.ttf'),('Serif','DejaVuSerif.ttf')]:pdfmetrics.registerFont(TTFont(name,str(fonts/file)))
pdfmetrics.registerFontFamily('D',normal='D',bold='DB',italic='DI',boldItalic='DB')
GREEN=colors.HexColor('#136c58');INK=colors.HexColor('#243d30');MUTED=colors.HexColor('#687c6c');LIGHT=colors.HexColor('#edf2e8');LINE=colors.HexColor('#d8e3d1')
S=getSampleStyleSheet()
S.add(ParagraphStyle(name='BodyD',fontName='D',fontSize=10,leading=15,textColor=INK,spaceAfter=11))
S.add(ParagraphStyle(name='SmallD',parent=S['BodyD'],fontSize=8.4,leading=12.5,textColor=MUTED,spaceAfter=8))
S.add(ParagraphStyle(name='HeadingD',fontName='DB',fontSize=17,leading=23,textColor=GREEN,spaceBefore=12,spaceAfter=12))
S.add(ParagraphStyle(name='TitleD',fontName='Serif',fontSize=29,leading=36,textColor=GREEN,spaceAfter=22))
S.add(ParagraphStyle(name='KickerD',fontName='DB',fontSize=8,leading=12,textColor=MUTED,spaceAfter=12))
S.add(ParagraphStyle(name='CellD',parent=S['BodyD'],fontSize=8.5,leading=12,spaceAfter=0))
S.add(ParagraphStyle(name='CodeD',fontName='D',fontSize=8,leading=12,textColor=INK,backColor=LIGHT,borderPadding=12,spaceAfter=14))
story=[]
def p(t,style='BodyD'):return Paragraph(t,S[style])
def add(t,style='BodyD'):story.append(p(t,style))
def title(n,t,desc):
 if story:story.append(PageBreak())
 add(f'CADERNO DO PROJETO  /  {n:02d}','KickerD');add(t,'TitleD');add(desc,'SmallD');story.append(Spacer(1,8))
def h(t):add(t,'HeadingD')
def bullets(items):
 for i in items:add('• '+i)
def table(headers,rows,widths,padding=10):
 data=[[p(v,'CellD') for v in headers]]+[[p(str(v),'CellD') for v in row] for row in rows]
 t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),LIGHT),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),padding),('BOTTOMPADDING',(0,0),(-1,-1),padding)]));story.append(t);story.append(Spacer(1,12))
def link(url,label):return f'<link href="{html.escape(url,quote=True)}" color="#136c58"><u>{html.escape(label)}</u></link>'
# Plot directly from the distributed synthetic datasets.
fig,ax=plt.subplots(figsize=(10,4.5));fig.patch.set_facecolor('#f6f8f1');ax.set_facecolor('#f6f8f1')
for name,c,label in [('esmalte','#136c58','Esmalte sintético'),('dentina','#b78d55','Dentina sintética')]:
 x,y,_=read_csv(ROOT/f'dados/{name}_simulado.csv');yy,_,_=analyze(x,y,norm='max');ax.plot(x,yy,color=c,lw=1.8,label=label)
for x in [960,1070,1450]:ax.axvline(x,color='#b0bd9e',ls='--',lw=.8);ax.text(x+6,1.05,str(x),color='#65805e',fontsize=9)
ax.set(xlabel='Deslocamento Raman (cm⁻¹)',ylabel='Intensidade normalizada',xlim=(400,1800),ylim=(-.05,1.18));ax.spines[['top','right']].set_visible(False);ax.grid(axis='y',alpha=.15);ax.legend(frameon=False,fontsize=9,loc='upper right');fig.tight_layout();fig.savefig(ROOT/'assets/espectros_exemplo.png',dpi=170);plt.close(fig)
# 01
add('ODONTORAMAN LAB  /  ENSINO MÉDIO TÉCNICO','KickerD');story.append(Spacer(1,25));add('O que a luz revela<br/>sobre os dentes?','TitleD');add('Proposta interdisciplinar de TCC','HeadingD');add('Informática · Eletrônica · Análises Clínicas');story.append(Spacer(1,15));story.append(Image(str(ROOT/'assets/espectros_exemplo.png'),width=495,height=223));add('Curvas matemáticas para ensino. Não são medições de dentes reais.','SmallD');story.append(Spacer(1,24));add('<b>Uma investigação em 16 semanas.</b> Software para explorar espectros, bancada didática com ESP32, modelos 3D editáveis e um fluxo de análise documentado.');add('Organizado para Prof. Bruno Michel Pera<br/>Versão 2.0 · 17 de novembro de 2026','SmallD');add(link('https://perabru.github.io/odonto-raman-lab/','Abrir o site interativo')+'  |  '+link('https://github.com/perabru/odonto-raman-lab','Abrir o repositório'),'SmallD')
# 02
title(2,'A proposta de pesquisa','Área: instrumentação biomédica educacional, biofotônica e ciência de dados.')
h('Título sugerido');add('Desenvolvimento de uma plataforma didática para análise de espectros Raman de tecidos dentários e integração com uma bancada eletrônica.')
h('Problema e hipótese');add('<b>Pergunta:</b> como integrar instrumentação, programação e conhecimentos bioquímicos para comparar, de maneira rastreável e reproduzível, características espectrais do esmalte e da dentina?');add('<b>Hipótese:</b> um fluxo padronizado pode evidenciar diferenças em bandas minerais e orgânicas, desde que aquisição, origem dos dados e limitações sejam controladas.')
h('Objetivo geral');add('Construir e avaliar uma plataforma educacional de visualização e processamento de espectros, acompanhada de uma bancada demonstrativa e documentação interdisciplinar.')
h('Objetivos específicos');bullets(['Explicar o efeito Raman e as diferenças entre esmalte e dentina.','Implementar leitura CSV, tratamento de fundo, gráficos e métricas.','Construir uma bancada LED com ESP32, controle de tampa e registro serial.','Projetar modelos 3D e verificar cálculos com sinais conhecidos.','Documentar rastreabilidade, limites e reprodução por outra equipe.'])
# 03
title(3,'Dois níveis de execução','O projeto principal deve ser viável sem depender da compra de um espectrômetro.')
h('Nível A: entrega principal na escola');add('Dados sintéticos identificados + plataforma de análise + bancada LED + modelos 3D. O TCC avalia o funcionamento dos algoritmos, a integração eletrônica e o uso pedagógico.');bullets(['O LED demonstra o ciclo de aquisição; não produz um espectro Raman.','O ESP32 registra o estado da bancada e os eventos de abertura/início/fim.','O programa não gera diagnóstico, concentração química ou laudo.'])
h('Nível B: extensão com laboratório parceiro');add('Aplicação do mesmo fluxo a espectros reais, adquiridos por profissional habilitado em equipamento Raman. Depende de acesso, custos, agenda, protocolo e autorizações institucionais.');add('A página do Laboratório de Nanossensores da Univap informa atuação com Raman [9]. Pode ser consultada pelo orientador; não há parceria ou disponibilidade confirmada.')
h('O que não está no escopo');bullets(['Medições dentro da boca, atendimento odontológico ou procedimentos em alunos.','Construção escolar de fonte laser de pesquisa ou adaptação de laser ao circuito LED.','Validação clínica de cárie ou classificação automática de saúde.'])
add('Se o nível B não acontecer, conclua o nível A e relate essa delimitação. Não apresente simulação como experimento biológico.','SmallD')
# 04
title(4,'Cada curso tem uma função','Equipe sugerida: 1 a 2 estudantes por área, com orientação compartilhada.')
table(['Área','Atuação','Entrega verificável'],[
 ['Informática','Programação, gráficos, arquivos CSV, testes e documentação.','Site, scripts, métricas reproduzíveis e repositório organizado.'],
 ['Eletrônica','Montagem 3,3 V, firmware, eventos USB, CAD e ensaios.','Bancada LED, esquema elétrico, testes físicos e modelos imprimíveis.'],
 ['Análises Clínicas','Tecidos, bioquímica, rastreabilidade e qualidade.','Ficha de amostras, critérios de inclusão/exclusão e discussão crítica.'],
 ['Todos','Pergunta de pesquisa, integração, escrita e defesa.','Monografia, demonstração conjunta e registro das decisões.']],[90,205,200])
h('Como integrar de verdade');add('O arquivo de espectro precisa apontar para um identificador de amostra e uma ficha de aquisição. Os eventos da bancada pertencem ao registro de instrumentação, e não devem ser confundidos com intensidades Raman.');add('A equipe de Análises Clínicas revisa se a comparação faz sentido; a de Informática reproduz os cálculos; a de Eletrônica demonstra como as condições de aquisição podem influenciar o resultado.')
h('Rotina proposta');add('Reunião semanal de 20 minutos. Cada área mostra uma evidência: gráfico, registro, teste, desenho ou referência. O grupo registra a decisão e o próximo responsável. Todos devem explicar o fluxo completo.')
# 05
title(5,'Raman em linguagem simples','Luz espalhada com energia diferente da luz incidente revela modos vibracionais.')
add('A maior parte da luz espalhada mantém a energia do laser: espalhamento Rayleigh. Uma pequena fração troca energia com vibrações da matéria: espalhamento Raman [1]. No ramo Stokes, a luz espalhada tem menor energia e maior comprimento de onda.')
add('<b>Eixo X:</b> deslocamento Raman em cm⁻¹. <b>Eixo Y:</b> intensidade detectada, normalmente em unidades arbitrárias. Potência, tempo, foco, orientação e detector também influenciam o eixo Y.')
table(['Banda aproximada','Atribuição e leitura didática'],[
 ['430 e 590 cm⁻¹','Modos de fosfato associados à fase mineral.'],['960 cm⁻¹','Estiramento simétrico do fosfato da apatita.'],['1070 cm⁻¹','Carbonato; podem existir contribuições sobrepostas.'],['1245 cm⁻¹','Amida III; contribuições da matriz orgânica.'],['1450 cm⁻¹','Deformação CH₂, relevante na matriz de colágeno da dentina.'],['1667 cm⁻¹','Amida I e contribuições relacionadas à composição local.']],[130,365])
add('Posições aproximadas conforme estudos [2,3]. Não são limites clínicos nem assinaturas exclusivas.')
h('Energia e comprimento de onda');add('Δν = 10⁷ × (1/λ₀ − 1/λₛ), com comprimentos de onda em nm. Um laser de 785 nm e deslocamento de 960 cm⁻¹ correspondem a luz Stokes próxima de 849,0 nm. A calculadora do site refaz essa relação.')
# 06
title(6,'Como analisar as curvas','Preserve o sinal bruto. Registre todos os parâmetros usados no tratamento.')
table(['Passo','O que o programa faz','Limitação'],[
 ['1. Validar','Aceita duas colunas; ordena X e agrega duplicatas pela média.','Unidade correta deve ser confirmada pelo usuário.'],['2. Fundo','Envoltória convexa inferior (rubber band).','Fundo não convexo pode não ser bem removido.'],['3. Suavização','Média móvel opcional de 3 pontos.','Pode reduzir altura e alargar bandas.'],['4. Normalização','Nenhuma, máximo global ou máximo em 930–990.','Normalização elimina a escala absoluta.'],['5. Métricas','Área por trapézios e FWHM por cruzamentos interpolados.','Ruído, resolução e sobreposição afetam a estimativa.']],[70,225,200])
h('Definições usadas no site e no Python');add('Janelas fixas: <b>930–990</b> para fosfato, <b>1050–1090</b> para carbonato e <b>1420–1480 cm⁻¹</b> para contribuições orgânicas. Cada janela recebe uma linha de base local ligando seus extremos.');add('Razões exploratórias: A₁₀₇₀/A₉₆₀ e A₁₄₅₀/A₉₆₀. São razões de áreas, não porcentagens de composição. FWHM é a largura à meia altura. Ausência de cobertura ou denominador insuficiente produz resultado indisponível.')
h('O que verificar antes de interpretar');add('Saturação, fluorescência elevada, ruído, escala mal calibrada e diferenças de aquisição podem invalidar a comparação. O programa não substitui a inspeção de qualidade pelo responsável técnico.')
# 07
title(7,'Um roteiro para o laboratório virtual','Esta atividade usa somente simulações matemáticas identificadas.')
steps=[('Começar','Abra Laboratório virtual. Observe o pico próximo de 960 cm⁻¹ e anote a FWHM.'),('Alterar o fundo','Aumente fluorescência. Desmarque e marque a correção de linha de base. Explique a diferença entre fundo e pico.'),('Alterar o ruído','Aumente o ruído e ative a média móvel. Observe que um processamento também pode alterar o sinal.'),('Comparar tecidos','Selecione dentina. Ative comparação e normalização pelo máximo. Observe as contribuições em 1450 cm⁻¹.'),('Comparar escalas','Reduza o sinal mineral e teste sem normalização. Depois normalize. Discuta o que deixou de ser comparável.'),('Importar e exportar','Baixe um CSV de exemplo e importe-o. Exporte bruto, análise e relatório JSON. Confira os parâmetros registrados.')]
for i,(a,b) in enumerate(steps,1):h(f'{i:02d} · {a}');add(b)
add('Não interprete o controle “sinal mineral” como porcentagem de perda mineral de um dente real. Ele apenas multiplica amplitudes de funções gaussianas.','SmallD')
# 08
title(8,'Desenho de um estudo piloto','O protocolo final deve ser definido pelo orientador e pelo laboratório.')
add('<b>Exemplo de planejamento:</b> 5 espécimes independentes × 2 tecidos, quando disponíveis × 3 pontos × 3 aquisições = até 90 espectros. Isso continua representando 5 espécimes biológicos, não 90 dentes.')
h('Antes de coletar');bullets(['Confirmar viabilidade técnica, agenda e orçamento do laboratório.','Definir o enquadramento ético e obter autorizações aplicáveis antes do uso de material humano.','Definir origem autorizada, preparo, armazenamento e descarte com o responsável técnico.','Definir e registrar laser, potência na amostra, tempo, acumulações, objetiva e resolução.','Verificar a escala e a resolução com padrões e procedimento do laboratório. O silício em torno de 520,7 cm⁻¹ aparece como referência na literatura [4].'])
h('Na análise');add('Agrupe aquisições do mesmo ponto e pontos do mesmo espécime antes de comparar os tecidos. Calcule resumos por espécime, informe dispersão e registre exclusões com justificativa. A quantidade proposta é pedagógica, sem cálculo de poder estatístico.')
h('Ficha mínima');add('sample_id, tooth_id, tecido, ponto, réplica, origem, laser_nm, potencia_mW, integracao_s, acumulacoes, objetiva, resolucao_cm-1, data_iso, operador_codigo, arquivo e observações. Use códigos, nunca nomes de pacientes.')
add('Não recolher dentes de alunos nem improvisar esterilização. Material humano exige fluxo institucional autorizado. O biobanco da FOUSP oferece um exemplo de origem consentida e rastreável [10].','SmallD')
# 09
title(9,'Montagem da bancada LED','ESP32 clássico / WROOM-32. Somente baixa tensão; nenhum laser é conectado.')
table(['Componente','Ligação'],[['LED demonstrador','GPIO25 → resistor de 470 Ω → anodo; catodo → GND.'],['LED de estado','GPIO26 → resistor de 470 Ω → anodo; catodo → GND.'],['Chave de tampa','GPIO14 no contato NO; COM no GND; NC livre. Tampa fechada deve pressionar a chave.'],['Botão iniciar','GPIO27 → botão → GND. Verifique os pares internos do botão de quatro terminais.'],['USB','Alimenta o ESP32 e transmite dados a 115200 baud. GPIOs usam lógica de 3,3 V.']],[125,370])
h('Comportamento esperado');add('Tampa fechada + novo toque: LED de ciclo acende por 3 s. Abertura da tampa interrompe imediatamente o ciclo. Fechar novamente não reinicia sozinho. Segurar o botão não deve produzir ciclos repetidos.')
h('Teste físico que a equipe deve executar');bullets(['Tentar iniciar com a tampa aberta: ciclo bloqueado.','Iniciar fechado e abrir durante o ciclo: LED desliga e registra interrupção.','Fechar e esperar: não deve reiniciar sem novo toque.','Desconectar o fio da chave: leitura deve indicar aberta.','Comparar os eventos USB com o que foi observado na bancada.'])
add('Desconecte o USB para montar. Não aplique 5 V nos GPIOs. O controle por software e a caixa impressa não são proteção certificada para laser. A bancada ainda requer verificação física; testes de software não demonstram segurança óptica [7,8].','SmallD')
# 10
title(10,'Materiais e orçamento','Consulta de produtos em 17/11/2026. Valores mudam; confirme estoque, frete e compatibilidade.')
rows=[]
for b in meta['bom']:
 name=link(b['url'],b['name']) if b['url'] else b['name']
 rows.append([name,b['qty'],f"R$ {b['price']:.2f}",f"R$ {b['price']*b['qty']:.2f}"])
table(['Material / link','Qtde.','Unitário','Subtotal'],rows,[285,45,80,85])
total=sum(b['qty']*b['price'] for b in meta['bom']);add(f'<b>Subtotal de planejamento: R$ {total:.2f}. Com reserva de 20%: R$ {total*1.2:.2f}.</b>')
add('ESP32 (R$ 60), cabo (R$ 15) e impressão/fixação (R$ 50) são estimativas próprias. Demais itens usam preços de referência consultados. A placa ESP32 de 30 pinos estava sem estoque na consulta direta. Duas protoboards de 400 pontos facilitam acesso às laterais da placa.','SmallD')
h('Instrumentação Raman: orçamento separado');add('O custo de acesso ao espectrômetro, preparo, consumíveis e operador não está incluído. Solicite uma proposta ao laboratório. A família WP 785X [11] e os sistemas HORIBA são referências técnicas, não um conjunto pronto de baixo custo.');add('As configurações podem incluir ou não laser e sonda. A resolução necessária para FWHM precisa ser discutida; não compare instrumentos só pela faixa espectral. Óptica, filtro Rayleigh e detector adequado fazem parte do sistema.')
# 11
title(11,'Modelos 3D e construção','Os arquivos são originais, em milímetros, com fontes OpenSCAD editáveis.')
table(['Arquivo','Dimensão / finalidade'],[['completo.stl','Molar idealizado para ensino; não é anatomia individual.'],['esmalte / dentina / polpa.stl','Camadas em corte usadas no visualizador.'],['base.stl','180 × 140 × 65 mm; parede 3 mm.'],['tampa.stl','180 × 140 × 6 mm, incluindo encaixe.'],['bandeja.stl','70 × 55 × 8 mm; cavidade de 24 mm; furos de 3,4 mm.'],['dente.scad / bancada.scad','Selecione part no OpenSCAD, renderize com F6 e exporte STL.']],[175,320])
h('Antes de imprimir');bullets(['Meça sua placa, USB, chave e botão. Não existe furação universal de ESP32 neste modelo.','A fixação da eletrônica é por espaçadores/fita de protótipo. O botão tátil fica na protoboard; o furo frontal é para adaptação opcional.','Monte e ajuste mecanicamente o acionamento da chave de tampa.','Folga nominal da tampa: 0,4 mm por lado. Faça um teste de encaixe.'])
h('Parâmetros iniciais de impressão');add('PLA, camada de 0,2 mm e 3 paredes são um ponto de partida. Base e bandeja com face inferior na mesa. Tampa com face externa apoiada. Molar requer suporte e orientação definidos no fatiador.');add('Não foram realizados ensaios físicos de impressão ou encaixe. As peças são protótipos didáticos; PLA não é recipiente clínico nem barreira de segurança laser.','SmallD')
# 12
title(12,'Executar e reproduzir','Todos os arquivos estão no repositório e nas opções de download do site.')
h('Firmware');add('Instale Arduino IDE e o pacote esp32 by Espressif Systems, conforme documentação oficial. Abra firmware/bancada/bancada.ino, escolha ESP32 Dev Module e a porta USB. Revise a montagem e envie. Monitor serial: 115200 baud.');add(link('https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html','Guia oficial de instalação do Arduino-ESP32'),'SmallD')
h('Python 3.10 ou superior');story.append(Preformatted('cd python\npython -m venv .venv\n# Windows PowerShell:\n.venv\\Scripts\\Activate.ps1\n# macOS/Linux:\nsource .venv/bin/activate\npython -m pip install -r requirements.txt\npython analisar.py ../dados/esmalte_simulado.csv --saida resultado',S['CodeD']))
add('O programa produz CSV processado, métricas JSON e gráfico PNG. Opções: --suavizar e --normalizar max. O padrão mantém intensidades sem normalização e aplica a correção de fundo.')
h('Site local e testes');story.append(Preformatted('git clone https://github.com/perabru/odonto-raman-lab.git\ncd odonto-raman-lab\npython -m http.server 8000\n# Abrir http://localhost:8000\nnode --test tests/*.test.mjs\npython tests/paridade.py',S['CodeD']))
add('O site público funciona no navegador sem instalar Python. Para Web Serial, use computador/navegador compatível e feche o monitor serial da IDE antes de conectar. Não abra o site por file://; os módulos e modelos precisam ser servidos via HTTP.','SmallD')
# 13
title(13,'Cronograma e critérios','16 semanas; proposta de 2 a 4 horas semanais por estudante.')
table(['Semanas','Entrega'],[[week,f'<b>{t}</b><br/>{d}'] for week,t,team,d in meta['phases']],[75,420])
add('<b>Rubrica (100 pontos):</b> fundamentação 20; integração 20; software e análise 20; eletrônica e modelos 15; qualidade/rastreabilidade 15; comunicação 10.','SmallD')
add('<b>Conclusão:</b> outro grupo deve conseguir executar os exemplos, reproduzir métricas, montar a demonstração e explicar as limitações. Resultados esperados da proposta não devem ser apresentados como resultados já obtidos.','SmallD')
# 14
title(14,'Ensinar, apresentar, discutir','Aula inicial de 50 minutos e defesa de 15 minutos.')
h('Primeira aula');add('0–5 min: pergunta inicial. 5–15: Raman, eixos e anatomia 3D. 15–30: simulador com fluorescência e ruído. 30–40: bancada e divisão de funções. 40–50: desafios e definição da primeira entrega.')
h('Defesa do TCC');add('0–3 min: objetivo e limites. 3–6: Análises Clínicas. 6–9: Eletrônica. 9–12: Informática com demonstração. 12–15: resultados obtidos, dificuldades e conclusão. O site oferece oito telas em modo apresentação.')
h('Quatro desafios com respostas');
for i,(q,answers,correct,why) in enumerate(meta['questions'],1):
 add(f'<b>{i}. {html.escape(q)}</b>');add(f'{html.escape(answers[correct])}. {html.escape(why)}','SmallD')
h('Uma resposta importante à banca');add('“O projeto detecta cárie?” Não. A plataforma explora características espectrais e valida funções educacionais. Uma alegação diagnóstica exigiria estudo e validação próprios. A aquisição real depende do nível B e não foi realizada por este material.')
# 15 references
title(15,'Referências e continuidade','Fontes primárias, documentação oficial e páginas institucionais.')
for i,(name,typ,url,note) in enumerate(meta['references'],1):
 add(f'<b>[{i}]</b> '+link(url,name), 'SmallD');add(typ+'. '+note,'SmallD')
add('Consulta: 17/11/2026. Links de materiais aparecem no orçamento e no site. Não há vínculo comercial nem parceria institucional firmada.','SmallD')
# Complemento da experiência interativa v2.
title(16,'Quatro simulações conectadas','Abra as seções na ordem: dente, onda, hardware e software.')
h('1. Dente em 3D');add('Arraste para girar, use os botões de zoom e selecione esmalte, dentina ou polpa. O controle de separação afasta as peças; a opção de isolamento mostra somente uma camada. Modelo idealizado, sem finalidade clínica. Os STL detalhados são gerados por scripts/gerar_molar.py; o SCAD preserva a versão simplificada.')
h('2. Luz e Raman em 3D');add('Escolha Stokes, Rayleigh ou anti-Stokes. Altere o laser e o deslocamento; observe o comprimento de onda calculado. Reproduza ou pause a onda. A animação é desacelerada, com campos, cores e amplitudes ilustrativos. Não representa intensidade relativa nem probabilidade dos processos.')
h('3. Hardware em 3D');add('A aba escolar permite iniciar um ciclo de 3 s, abrir a tampa e observar bloqueio ou interrupção. Selecione cada componente para identificar sua função. A aba do instrumento mostra um caminho óptico funcional, sem escala e sem instrução de alinhamento laser. A simulação não substitui testes físicos.')
h('4. Software e curvas');add('Siga entrada, processamento, métricas e exportação. Os atalhos preparam cenários de sinal limpo, ruído, fluorescência e comparação entre tecidos sintéticos. Preserve o bruto e registre as escolhas. Importar CSV não confirma sua origem ou qualidade.')
add(link('https://perabru.github.io/odonto-raman-lab/#trilhas','Abrir as trilhas interativas'),'SmallD')
for index,(key,track) in enumerate(meta['tracks'].items(),17):
 title(index,track['name']+': sua trilha',track['role'])
 add('<b>Pré-requisito:</b> '+html.escape(track['prerequisite']),'SmallD')
 add('<b>Entrega final:</b> '+html.escape(track['result']),'SmallD')
 table(['Etapa','Estudar e praticar','Entregar'],[[str(i+1)+' · '+row[0],row[1]+'<br/><br/>'+row[3],row[4]] for i,row in enumerate(track['lessons'])],[110,255,130],padding=5)
 add('No site, cada etapa traz uma explicação, atividade vinculada e checklist individual salvo no navegador. As oito etapas se articulam ao cronograma de 16 semanas.','SmallD')
def footer(c,doc):
 w,hp=doc.pagesize;c.setFillColor(colors.HexColor('#f7f9f3'));c.rect(0,0,w,hp,fill=1,stroke=0)
 c.setFillColor(GREEN);c.rect(42,hp-32,28,3,fill=1,stroke=0)
 c.setStrokeColor(LINE);c.line(48,44,w-48,44);c.setFont('D',7.3);c.setFillColor(MUTED);c.drawString(48,29,'OdontoRaman Lab · Prof. Bruno Michel Pera · Material educacional');c.drawRightString(w-48,29,f'{doc.page:02d}')
doc=SimpleDocTemplate(str(ROOT/'docs/Guia_OdontoRaman.pdf'),pagesize=(595.28,841.89),rightMargin=50,leftMargin=50,topMargin=55,bottomMargin=63,title='OdontoRaman Lab - Proposta de TCC e guia da turma',author='Bruno Michel Pera',subject='Projeto interdisciplinar de ensino médio técnico')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(ROOT/'docs/Guia_OdontoRaman.pdf')
