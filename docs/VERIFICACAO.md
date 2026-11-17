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
