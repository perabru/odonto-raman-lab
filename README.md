# OdontoRaman Lab

Proposta de TCC para ensino médio técnico que integra **Informática, Eletrônica e Análises Clínicas** em uma plataforma educacional de espectroscopia Raman de tecidos dentários.

**Site:** https://perabru.github.io/odonto-raman-lab/  
**Guia:** [PDF de 15 páginas](docs/Guia_OdontoRaman.pdf)

## O que está incluído

- Proposta com pergunta, objetivos, limites, divisão de tarefas, plano de 16 semanas e rubrica.
- Fundamentos Raman e referências científicas consultadas em 17/11/2026.
- Laboratório virtual com curvas sintéticas identificadas, importação de CSV, correção de fundo, normalização, áreas e FWHM.
- Modelos 3D interativos e arquivos STL / OpenSCAD originais: molar, camadas, base, tampa e bandeja.
- Circuito de bancada LED, firmware ESP32 e monitor Web Serial opcional.
- Lista de materiais com links de produtos, orçamento editável e exportação CSV.
- Script Python com as mesmas definições analíticas do site.
- Modo apresentação com oito telas, atividade com correção e guia PDF.

## Delimitação científica

Este é um projeto **educacional**. O ESP32 controla LEDs e registra estados; **não mede Raman**. Os CSV fornecidos são **simulados**, não são dados de pacientes e não validam diagnóstico. Para obter espectros reais, é necessário um instrumento Raman profissional e um laboratório parceiro. Nenhuma parceria está confirmada.

A versão principal é a avaliação didática e computacional. Uma extensão com material humano depende do fluxo ético e técnico institucional. Não realizar medições na boca nem recolher dentes de estudantes. A caixa e o circuito não são controles de segurança para laser.

## Executar localmente

Nenhuma dependência JavaScript é necessária.

```bash
python -m http.server 8000
```

Abra http://localhost:8000. Não use `file://`: módulos e modelos precisam de um servidor HTTP. O site público pode ser usado diretamente no navegador, sem Python. CSV importado é processado localmente. O checklist é salvo apenas no navegador.

### Análise Python

```bash
cd python
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# Linux / macOS: source .venv/bin/activate
python -m pip install -r requirements.txt
python analisar.py ../dados/esmalte_simulado.csv --saida resultado
```

Saídas: CSV bruto/processado, métricas JSON e gráfico PNG. Opções: `--suavizar`, `--normalizar max`, `--normalizar phosphate` e `--sem-baseline`.

### Firmware

Abra `firmware/bancada/bancada.ino` na Arduino IDE, instale **esp32 by Espressif Systems**, selecione ESP32 Dev Module e a porta USB. Baud rate: **115200**. Não requer bibliotecas externas. Pinagem e comportamento estão no comentário do arquivo e no site. A montagem física deve ser validada pela equipe antes da demonstração.

### Modelos

STL em `modelos/` e fontes `bancada.scad` / `dente.scad`. Unidades: mm. No OpenSCAD, selecione `part`, renderize com F6 e exporte. Medir e ajustar encaixes ao processo de impressão da escola. A peça anatômica é idealizada.

## Definições analíticas

1. Validação de duas colunas: `shift_cm-1,intensity`; máximo de 2 MB e 20.000 pontos.
2. Ordenação de deslocamento e média de duplicatas com informação explícita.
3. Linha de base opcional pela envoltória convexa inferior (rubber band).
4. Média móvel opcional de 3 pontos, somente com eixo aproximadamente uniforme (5%).
5. Normalização opcional pelo máximo global ou pelo máximo em 930–990 cm⁻¹.
6. Linha de base local entre extremos de cada janela, área por trapézios e FWHM por cruzamentos interpolados.
7. Razões de áreas: 1050–1090 / 930–990 e 1420–1480 / 930–990 cm⁻¹.

Não são concentrações. Saturação, ruído, resolução e sobreposição devem ser avaliados pelo responsável. A rotina não substitui um ajuste espectral validado. O relatório registra parâmetros, origem e limitações.

## Verificações

```bash
node --test tests/*.test.mjs
python tests/paridade.py
```

Os testes verificam FWHM e área de gaussiana conhecida, linha de base, validação de CSV, casos sem sinal e paridade numérica entre Python e JavaScript. O workflow `Validar projeto` também compila o firmware para o ESP32 clássico. A execução remota é visível em **Actions**; não equivale a um teste físico de hardware.

A interface possui renderização WebGL com alternativa 3D por software. Fontes, imagens, códigos e modelos usados pelo site são locais. Web Serial depende do navegador e do sistema; no celular, utilize os gráficos e modelos normalmente e o monitor serial em um computador compatível.

## Publicar no GitHub Pages

Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save. O arquivo `.nojekyll` permite servir os arquivos estáticos diretamente.

## Organização

| Caminho | Conteúdo |
|---|---|
| `index.html`, `styles.css`, `app.js` | Interface e interações |
| `content.js` | Conteúdo, referências e materiais |
| `spectra.js` | Processamento numérico JavaScript |
| `viewer.js` | Visualizador STL com alternativa sem GPU |
| `dados/` | Exemplos sintéticos e ficha de amostras |
| `python/` | Análise reproduzível e dependências |
| `firmware/` | Sketch ESP32 |
| `modelos/` | STL e fontes OpenSCAD |
| `docs/` | Guia da turma e registro de verificação |
| `scripts/gerar_guia.py` | Geração do guia com ReportLab |
| `tests/` | Testes científicos e paridade |

Material organizado para **Prof. Bruno Michel Pera**. Sem vínculo comercial com fornecedores e sem parceria institucional firmada. Veja as referências completas no site e no guia. Código e modelos próprios sob licença MIT; artigos e produtos externos mantêm seus direitos e condições de uso.
