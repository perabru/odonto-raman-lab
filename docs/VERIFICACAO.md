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

O workflow GitHub Actions `Validar projeto` compila o sketch para `esp32:esp32:esp32` com Arduino-ESP32 3.3.2. Consultar o resultado da execução em Actions. A compilação não substitui o teste físico.
