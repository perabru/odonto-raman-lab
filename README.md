## Atualização 3.1

O projeto continua centrado no carcinoma espinocelular da mucosa bucal e na tese de Furuse (2006). Esta atualização acrescenta:

- Mucosa procedural com relevo, papilas, células, fibras e vasos; vistas do corte e superior, separação e isolamento das estruturas. A vista alterada é esquemática e não representa estágio clínico.
- Instrumento FT-Raman com braços do interferômetro de Michelson, espelho móvel e demonstração numérica de interferograma e transformada cosseno. Sinais exclusivamente sintéticos.
- Cronograma visual editável e filtrável por equipe, preservando os backups e as metas da versão anterior.
- Exportação dos rascunhos da monografia e do INIC em DOCX, processada no navegador. Monografia: A4, Times New Roman 12, margens 3/2 cm, sumário por campo e numeração da parte textual. INIC: A4, Arial 10 e margens da base enviada. A submissão exige revisão no modelo do evento, inclusive cabeçalho, figuras e regras da edição.
- Tese e manual com leitura interna; downloads do manual, modelo INIC limpo e estrutura da monografia.
- Menu principal reduzido a pesquisa, simulação, análise, planejamento e escrita. Conteúdo complementar continua em Estudos e arquivos.

Os rascunhos e metas continuam locais ao navegador, sem sincronização entre alunos. Exporte backups JSON. O site não gera resultados clínicos nem classifica pacientes.

Validação: 39 testes automatizados (incluindo exportação OOXML, Fourier, geometria, calendário, escrita e processamento), paridade numérica JavaScript/Python e conferência no navegador de modelos, filtros, recuperação do rascunho, download DOCX e leitor PDF. O firmware não foi alterado.

---

# OdontoRaman Lab

Proposta de TCC para ensino médio técnico que integra **Informática, Eletrônica e Análises Clínicas** em uma plataforma educacional de FT-Raman e carcinoma espinocelular da mucosa bucal, com base na tese de Furuse (2006).

**Site:** https://perabru.github.io/odonto-raman-lab/  
**Documentação:** [Manual enviado](docs/Manual_Monografia_UNIVAP.pdf) · [Modelo monografia](docs/Modelo_Monografia_UNIVAP.docx) · [Modelo INIC limpo](docs/Modelo_INIC_2025_Limpo.docx)

## Versão 3 — mucosa, planejamento e escrita

- Mucosa 3D com epitélio, limite basal, conjuntivo, vasos e núcleos ampliados.
- Cenários matemáticos A/B de 800–1800 cm⁻¹; importação CSV; normalização opcional na janela de 1450 cm⁻¹. Não são dados da tese ou classes clínicas.
- Calendário com 16 etapas editáveis, metas, responsáveis, exportação ICS e backup JSON. Datas sugeridas; nenhum prazo oficial INIC foi inventado.
- Editores separados de monografia e INIC: autosave local, prévia, impressão, HTML/Markdown e backup JSON. Sem contas ou sincronização.
- Manual recebido integralmente e modelos DOCX limpos. Modelo INIC baseado em 2025; chamada vigente deve ser confirmada.
- Conteúdo dental anterior permanece explicitamente complementar; Guia_OdontoRaman.pdf é o guia legado dessa versão.

## Recursos complementares

- Proposta com pergunta, objetivos, limites, divisão de tarefas, plano de 16 semanas e rubrica.
- Fundamentos Raman e referências científicas consultadas em 17/11/2026.
- Laboratório virtual com curvas sintéticas identificadas, importação de CSV, correção de fundo, normalização, áreas e FWHM.
- Modelos 3D interativos e arquivos STL / OpenSCAD originais: molar, camadas, base, tampa e bandeja.
- Circuito de bancada LED, firmware ESP32 e monitor Web Serial opcional.
- Lista de materiais com links de produtos, orçamento editável e exportação CSV.
- Script Python legado para o complemento dental; a análise principal de mucosa está em mucosa-lab.js.
- Modo apresentação com seis telas, atividade com correção e editores de escrita.

## Delimitação científica

Este é um projeto **educacional**. O ESP32 controla LEDs e registra estados; **não mede Raman**. Os CSV fornecidos são **simulados**, não são dados de pacientes e não validam diagnóstico. Para obter espectros reais, é necessário um instrumento Raman profissional e um laboratório parceiro. Nenhuma parceria está confirmada.

A versão principal é a avaliação didática e computacional. Uma extensão com material humano depende do fluxo ético e técnico institucional. Não realizar medições ou coleta de tecido em estudantes. A caixa e o circuito não são controles de segurança para laser.

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

## Experiência interativa v2

O percurso principal agora é **Dente 3D → Luz e Raman 3D → Hardware 3D → Software e curvas → Trilhas de estudo**.

- Molar detalhado com seleção de camadas, isolamento, separação gradual, zoom, vistas e rotação opcional.
- Onda eletromagnética em 3D: Stokes, Rayleigh e anti-Stokes; laser e deslocamento ajustáveis. Tempo, cores e amplitudes são ilustrativos; o comprimento de onda de saída é calculado pela diferença de números de onda.
- Hardware 3D: bancada LED com dois LEDs, ESP32, protoboard, botão e chave de tampa. Ciclo virtual de 3 s com bloqueio e interrupção. Uma segunda cena explica o caminho óptico de um instrumento Raman profissional.
- Software guiado em quatro etapas com cenários de ruído, fluorescência e comparação de tecidos sintéticos.
- Oito etapas de estudo por curso (24 no total), com explicação, atividade, entrega e progresso local. Sem cadastro ou dados pessoais.
- Guia PDF atualizado com 19 páginas, incluindo as três trilhas.

### Modelos e código das cenas

`viewer.js` renderiza malhas locais via WebGL ou Canvas 2D quando WebGL não está disponível. `scene-geometry.js` constrói as cenas didáticas de onda e hardware. `simulation-state.js` contém a lógica verificável da bancada virtual e a conversão espectral. `experience.js` conecta os controles, sem acessar hardware físico.

Os quatro STL do molar são gerados por `scripts/gerar_molar.py`:

```bash
python -m pip install numpy scikit-image
python scripts/gerar_molar.py
```

O script usa campos geométricos e marching cubes; verifica malhas fechadas e orienta as faces para fora. Unidades: mm, com ampliação didática. Os modelos não foram impressos ou validados clinicamente. `modelos/dente.scad` preserva a versão simplificada anterior para exercícios de CAD; não é a origem das malhas detalhadas da v2. Caixa e bandeja continuam descritas em `modelos/bancada.scad`.

A animação de hardware representa a lógica de estados. Não simula corrente, tolerância, falhas elétricas ou desempenho óptico e não substitui teste físico supervisionado. Os arquivos originais de firmware, dados e análise permanecem disponíveis.
