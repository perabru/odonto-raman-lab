## Versão 3.3 · 18/11/2026

- 59 testes Node aprovados.
- Fotometria: validação de protocolo/escala, sequência e estados; razão conhecida recuperada; referência insuficiente, sinal não positivo e possível saturação sem resultado inventado; valores acima de 100% sinalizados, sem truncamento.
- Sessões têm 60 leituras brutas e origem identificada. Backup/restauração e incompatibilidade com espectro Raman cobertos por testes.
- Navegador de prévia: atualização 3.2 → 3.3 preservou registros anteriores. Exemplo óptico salvo, recuperado após recarregar e reaberto com razão de 60%. Exportação e reimportação JSON conferidas.
- Conferência de 23 rotas e arquivos locais: nenhum destino ausente. Guia com 13 etapas e lista com 36 itens.
- O workflow compila separadamente os firmwares LED e de fotometria para ESP32 clássico.
- Limites: hardware físico, potência, contenção, repetibilidade e aquisição USB com ESP32 real não ensaiados. A leitura de presença de alimentação não mede emissão óptica. Não há calibração radiométrica ou diagnóstico. A evolução Raman exige instrumento espectral completo e verificação institucional.

## Versão 3.2 · 18/11/2026

- 50 testes Node e 3 testes Python aprovados; 22 rotas e seus arquivos locais conferidos sem destino ausente.

- Testes de coleta: preservação do CSV bruto, origem e parâmetros ausentes; incompatibilidade entre LED e espectro; limites; datas; restauração sem sobrescrever conflitos; exportação CSV e ligação da análise ao registro.
- Testes do service worker com rede indisponível: todos os recursos principais presentes, entrada e módulos no subdiretório, documentos visitados e resposta clara para download não preparado. Manifesto e ícones verificados.
- Navegador: guia por equipe, lista de 22 materiais, filtros, cotação editável e exportação CSV; 11 ferramentas/conjuntos com links e preparo.
- Coleta sintética de 501 pontos salva, recuperada após recarregar e após aplicar atualização da PWA, exportada e reimportada sem duplicar; abertura no analisador manteve origem e código.
- Servidor de prévia desligado durante o ensaio: app reabriu pelo cache, detalhes do registro permaneceram acessíveis e uma nova ficha foi salva. Após reiniciar o servidor e recarregar, as duas fichas de teste continuaram presentes.
- Conteúdo e arquivos de teste do navegador ficaram no ambiente de prévia; não foram publicados como dados de alunos.
- Limites: não houve ensaio físico do ESP32, transmissão Wi-Fi/Bluetooth, aquisição Raman real ou teste em celular físico. USB depende de Web Serial compatível. A sincronização entre aparelhos é manual por backup. PDFs/Word/STL precisam ser acessados antes do uso offline.

## Versão 3.1 · 18/11/2026

- 39 testes Node aprovados. Uma banda conhecida em 1450 cm⁻¹ foi recuperada pelo exemplo de transformada dentro de 2 cm⁻¹.
- Arquivos DOCX de teste abertos, renderizados e inspecionados; textos, caracteres, margens e separação de seções preservados.
- Conferência da identidade SHA-256 do manual com o arquivo enviado: idênticos.
- Teste no navegador: navegação, animação e pausa do FT-Raman; separação da mucosa; filtro do cronograma; recuperação da escrita após recarregar; download Word; consulta interna do manual.
- Os rascunhos e metas anteriores permanecem compatíveis. Nenhum dado de aluno foi publicado no código.
- Limites: ilustração anatômica sem escala histológica; transformada simplificada de sinais sintéticos; rascunho Word requer revisão editorial e adequação ao cabeçalho da edição do INIC. Sem testes em dispositivos móveis físicos.

# Verificação da versão 1.0

Data: 17/11/2026.

## Verificado em software

- Sete testes JavaScript: gaussiana conhecida, baseline linear, sinal ausente, CSV brasileiro, dados inválidos, exportação/reimportação e eixo não uniforme.
- Três testes Python: área/FWHM de gaussiana, paridade numérica com JavaScript e janelas ausentes/sinal nulo.
- Execução do script Python com os dados distribuídos: CSV, JSON e PNG gerados.
- Guia PDF de 15 páginas renderizado e inspecionado, com tabelas, fontes e links.
- Modelos exportados pelo OpenSCAD como sólidos simples e convertidos para STL binário.
- Prévia do site inspecionada no navegador: navegação, curvas, comparação, normalização, importação CSV válida, rejeição de CSV inválido e download de relatório.
- Visualização 3D por software adicionada e verificada quando WebGL não está disponível.

## Verificações ainda físicas / institucionais

- O circuito não foi ensaiado em uma placa física. A equipe deve executar o roteiro de bancada.
- As peças não foram impressas. Verificar dimensões, suporte e encaixe no processo escolhido.
- Não houve aquisição de dados Raman reais. Os exemplos são matemáticos e identificados como simulados.
- Não há parceria, uso de espécimes humanos ou estudo clínico autorizado por este material.
- Web Serial depende de dispositivo e navegador compatíveis; o protocolo JSON e o código estão fornecidos.

## Compilação do ESP32

O workflow GitHub Actions `Validar projeto` foi concluído com sucesso (execução 44192134729), incluindo testes de análise e compilação do sketch. Ele compila o sketch para `esp32:esp32:esp32` com Arduino-ESP32 3.3.2. Consultar o resultado da execução em Actions. A compilação não substitui o teste físico.

## Atualização v2 — 17/11/2026

- 10 testes Node aprovados, incluindo conversão Raman (Stokes/anti-Stokes/Rayleigh), bloqueio, interrupção e duração de 3 s da bancada virtual.
- Quatro STL detalhados regenerados; todas as arestas têm duas faces e volumes orientados positivos.
- Navegador: onda com troca de modo e pausa; camadas e visualizador ampliado; seleção de componentes; início bloqueado e ciclo interrompido; presets e etapas de processamento; trilhas com progresso preservado após recarregar.
- Layout avaliado em desktop e iframe com largura de celular; sem rolagem horizontal na página inicial.
- PDF com 19 páginas; novas páginas de simulações e trilhas renderizadas e inspecionadas.
- Inspeção visual 3D realizada com o renderizador Canvas 2D de contingência. Hardware físico, impressão 3D e aquisição Raman real continuam fora desta validação.


## Versão 3 — 18/11/2026

Foco migrado para CEC da mucosa bucal conforme Furuse2006. Simulações sintéticas A/B, sem classes clínicas ou dados extraídos de figuras. Manual recebido copiado com hash idêntico. Modelos DOCX renderizados e todas as páginas revisadas (1 INIC, 13 monografia).

Verificações: testes de espectros, estados da bancada, importação validada, planejamento/datas/ICS e rascunhos/escape HTML; navegação desktop, mucosa normal/alterada esquemática, ondas1064nm, ciclo/interrupção LED, calendário, salvamento do INIC após reload e prévia. Teste responsivo em iframe390px, não dispositivo físico. Rendering de fallback Canvas2D disponível no navegador de QA; o funcionamento GPU WebGL não foi validado em aparelho físico.

Rascunhos/calendário armazenados localmente, sem colaboração em servidor. HTML/PDF do editor são rascunhos: paginação final e regras da edição INIC requerem revisão no modelo. O calendário não afirma datas oficiais. A tese não fornece CSV bruto; os exemplos são funções matemáticas.
