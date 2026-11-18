# OdontoRaman — bancada laser com leitura óptica

Revisão 3.3 · 18/11/2026 · projeto de engenharia a montar e verificar pela equipe.

## O que muda

O experimento principal passa a emitir um feixe laser próprio, iluminar um material inerte e medir a luz transmitida. A cadeia é **módulo laser → material → atenuador óptico → fotodiodo com amplificador → ADC → ESP32 → PWA**. O circuito LED anterior permanece apenas como exercício inicial de programação.

A primeira bancada mede tensão e transmissão relativa em uma única faixa de cor. Ela não mede bandas Raman nem diferencia mucosa normal de carcinoma. A tese de Furuse continua como referência científica do tema; seus dados FT-Raman não são intercambiáveis com estas medidas.

## 1. Fonte e caminho óptico

Use um **módulo laser vermelho com driver integrado e documentação de Classe 2, potência máxima de 1 mW**, não um diodo avulso. Referência de especificação: família LC-LMD-650-01, variante de potência 01, com fios quando disponível. O fabricante informa alimentação de 2,5–3,3 V e comprimento de onda típico de 655 nm. Confirme o código completo, classe e potência com o fornecedor; a família também possui variantes mais potentes.

A proposta utiliza alimentação regulada em **3,0 V**, independente do GPIO. Nunca alimente esse módulo com 5 V ou diretamente pelo ESP32. A fonte deve ter polaridade e limite de corrente compatíveis com a ficha do módulo recebido. O driver vem no módulo; não se ajusta a potência óptica aumentando a tensão.

Monte uma geometria de transmissão com posições fixas: laser, suporte da amostra, filtro ND absorptivo e detector. O filtro deve atenuar aproximadamente mil vezes (OD próximo de 3 **na faixa 650–655 nm**), com curva de transmissão do fabricante. O valor real depende do filtro e da geometria. Ele evita sobrecarregar o detector; não é um filtro Raman nem um equipamento de proteção ocular.

Todos os componentes ópticos ficam dentro de um gabinete opaco, sem janela de observação, com terminador de feixe e anteparos que contenham a luz e as reflexões. A caixa STL antiga foi feita para LEDs e não é um gabinete laser validado. Não exponha o feixe para alinhá-lo com os olhos; o responsável técnico verifica contenção, fixação e potência com instrumentação apropriada antes da operação. A etiqueta do módulo não certifica o aparelho montado.

## 2. Alimentação e interrupção física

A emissão é manual; o firmware e a PWA **somente leem dados**. Ligação funcional da alimentação do laser:

1. Positivo da fonte de 3,0 V → chave geral.
2. Chave geral → contato COM do primeiro polo da chave de tampa.
3. Contato NO desse polo (fechado somente com a tampa pressionando a chave) → botão momentâneo NO de emissão.
4. Saída do botão → positivo do módulo laser.
5. Negativo do módulo → negativo da fonte / GND comum.

O feixe só pode ser alimentado com tampa fechada e botão de emissão mantido pressionado. Abrir a tampa ou soltar o botão interrompe fisicamente a alimentação, mesmo que o computador trave. Escolha chave de tampa com **dois polos eletricamente independentes**: o segundo informa o estado ao ESP32. Não una o contato de 3 V ao GPIO14. Este arranjo é uma proposta de baixo risco relativo para módulo visível de baixa potência; não é circuito de segurança certificado nem autorização para usar lasers mais fortes.

O GPIO34 recebe a indicação elétrica da saída do botão por resistor série de 10 kΩ, com resistor de 100 kΩ de GPIO34 para GND. A indicação `laser_powered` significa que a alimentação do módulo está presente; não comprova que houve emissão. A fonte de 3,0 V e o ESP32 devem compartilhar GND, sem unir as linhas positivas de 3,0 e 3,3 V.

## 3. Detector e pinagem

Use **OPT101** com seu amplificador de transimpedância e **ADS1115**. Neste desenho, ambos trabalham em **3,3 V**; toda entrada analógica deve permanecer dentro da alimentação do ADC. Um valor de faixa ±4,096 V no software não torna uma entrada de 5 V aceitável.

| Componente / terminal | Ligação desta revisão |
| --- | --- |
| ESP32 3V3 | ADS1115 VDD e OPT101 pino 1 |
| GND comum | ADS1115 GND; OPT101 pinos 3 e 8; negativo da fonte de 3,0 V |
| OPT101 pinos 4 e 5 | Unidos, usando a realimentação interna; este nó vai a ADS1115 A0 |
| OPT101 pinos 2, 6 e 7 | Sem conexão nesta montagem |
| Capacitor 100 nF | Entre OPT101 pinos 1 e 3, próximo ao sensor |
| ADS1115 SDA / SCL | ESP32 GPIO21 / GPIO22 |
| ADS1115 ADDR | GND, endereço 0x48 |
| ADS1115 ALERT, A1, A2, A3 | Sem conexão, salvo orientação do fabricante da placa |
| Segundo polo da chave de tampa | COM → GND; NO → GPIO14, INPUT_PULLUP |
| Saída do botão de emissão | Resistor 10 kΩ → GPIO34; resistor 100 kΩ de GPIO34 → GND |

A numeração do OPT101 é a do datasheet, vista superior; confirme o encapsulamento. Se comprar módulo montado, use os terminais e o esquema **desse módulo**. O breakout ADS1115 deve ter pull-ups I2C para 3,3 V; confirme se já existem. Na ausência deles, use um resistor de 4,7 kΩ em SDA e outro em SCL para 3,3 V.

Desligue todas as fontes ao modificar a montagem. Confira continuidade, ausência de curto e tensões antes de conectar sensor e ADC. Valide primeiro a interrupção física usando um LED com resistor como carga de teste, sem o laser conectado.

## 4. Firmware e ligação USB

1. Instale Arduino IDE e o pacote oficial `esp32 by Espressif Systems`.
2. Baixe `firmware/fotometria/fotometria.ino`, abra em uma pasta chamada `fotometria` e selecione a placa ESP32 clássica correspondente.
3. Compile e grave com o laser desconectado da alimentação. O código usa apenas a biblioteca Wire incluída no núcleo ESP32.
4. O ADS1115 opera continuamente a 128 conversões/s. O ESP32 publica 20 leituras/s, em JSON por linha, a 115200 baud. A escala é 0,125 mV por contagem.
5. Confira mensagens e estados no monitor serial. Erro I2C interrompe a aquisição; corrija a ligação com tudo desligado e reinicie.
6. Feche o monitor da IDE e, no site, abra **Bancada laser → Conectar leitura USB**. Escolha a porta. A conexão não liga o laser.

O firmware não possui pino de acionamento, ajuste de potência ou comando remoto de emissão. Abrir e fechar uma porta USB pode reiniciar o ESP32; nesse caso refaça escuro e referência. Uma sessão deve permanecer na mesma conexão, sem alterar posição, alimentação, filtro ou ganho.

## 5. Primeira sessão: escuro, referência e amostra

Use materiais inertes, como lâminas/filtros didáticos transmissivos, fixados no mesmo suporte. Material opaco pode fornecer sinal abaixo do limite. Não use boca, pele ou tecido humano nesta bancada de desenvolvimento.

1. **Escuro:** feche a caixa, deixe o botão de emissão solto e aguarde estabilizar. Clique Capturar escuro. A PWA guarda as próximas 20 leituras (cerca de 1 s).
2. **Referência:** mantenha o suporte vazio ou com o branco definido no protocolo. Feche a tampa, mantenha o botão de emissão pressionado e aguarde o sinal estabilizar. Clique Capturar referência, mantendo a emissão até terminar.
3. Solte o botão e desligue a chave geral antes de abrir a tampa. Insira o material sem alterar a geometria. Feche a caixa e religue a chave.
4. **Amostra:** mantenha o botão pressionado, aguarde estabilizar e clique Capturar amostra. Solte o botão quando terminar.
5. A PWA mostra média e desvio padrão de cada etapa. Calcula `T relativa = (Vamostra − Vescuro) / (Vreferência − Vescuro)` apenas quando os sinais permitem.
6. Se mudar referência, filtro, posição ou alimentação, inicie outra sessão. Faça réplicas com retirada e reposicionamento para estudar repetibilidade; registre cada réplica separadamente.
7. Baixe JSON e CSV ou envie para **Coleta PWA**, complete código, equipe e observações, e salve. Exporte o backup ao final.

O aplicativo bloqueia a captura com tampa aberta, alimentação incompatível com a etapa, interrupções de dados ou sequência fora de ordem. O limiar de 2,0 V é um alerta conservador de possível saturação do OPT101 alimentado a 3,3 V, não uma calibração do detector. Uma referência corrigida deve exceder 10 mV e dez vezes o maior desvio entre referência e escuro. Estes são critérios de engenharia iniciais a validar no protótipo. Não aumente a potência para contornar um sinal ruim; confira a óptica e a eletrônica.

T acima de 100% fica visível, acompanhada de aviso para revisar referência e estabilidade. A razão não fornece concentração, potência absoluta em mW, composição bioquímica nem diagnóstico. A PWA mantém dados reais e demonstrações identificados e não os envia ao analisador de espectros Raman.

## 6. O que registrar e testar

- Modelo e lote do laser, classe documentada, comprimento de onda nominal e tensão utilizada; potência medida, se houver medidor calibrado.
- Detector, ADC, alimentação, filtro/curva, distâncias, suporte, material e código da sessão.
- Teste elétrico de tampa, botão e interrupção independente do software, inicialmente sem laser.
- Conferência de contenção e potência por responsável habilitado; fotos com fontes desligadas.
- Escuro estável, resposta a filtros, repetibilidade, sinal insuficiente, possível saturação e desconexão USB.
- Brutos das três etapas, média, desvio, versão do programa e justificativa para excluir uma sessão.

O software foi preparado para esse protocolo. A montagem física, a estabilidade e a classificação do conjunto dependem da verificação da equipe; não foram comprovadas por testes de software.

## 7. Para obter Raman com a própria bancada

Se a meta for medir bandas Raman, acrescente um sistema espectral completo. O fotodiodo único soma a luz recebida; não separa comprimentos de onda. A lista de especificação a discutir com um laboratório de óptica é:

| Bloco | O que definir antes de cotar |
| --- | --- |
| Fonte de excitação | Laser de linha estreita e estável, driver, controle térmico e documentação. O módulo vermelho desta bancada não tem especificação para Raman. |
| Óptica de excitação/coleta | Filtro de limpeza do laser, lentes/objetiva, suporte e geometria reproduzível, acoplamento ao espectrômetro. |
| Rejeição Rayleigh | Filtro edge/notch correspondente à excitação e ao intervalo Raman; ND não substitui esse filtro. |
| Separação e detecção | Espectrógrafo, rede, detector sensível à faixa e resolução efetivamente medida; compatibilidade de fenda/fibra e ruído. |
| Referências e software | Padrões para verificar eixo/resolução, medidor de potência, aquisição pelo software do instrumento e exportação do bruto. |
| Contenção e operação | Gabinete projetado para o sistema, intertravamentos, avaliação de risco e treinamento do responsável. |

Uma opção modular de pesquisa usa 785 nm, filtros correspondentes e detector adequado ao infravermelho próximo. É outra técnica instrumental em relação ao **FT-Raman de 1064 nm da tese**, que usa interferômetro e detector de germânio. Reproduzir esse estudo exige especificação de todo o conjunto, não somente trocar a cor do laser. Não transfira potências de artigos para uma montagem diferente. Comece a avaliação Raman com padrão não biológico e um protocolo do laboratório; material humano depende de fluxo institucional próprio.

A PWA já importa CSV Raman `shift_cm-1,intensity` adquirido por um instrumento compatível. O novo monitor de fotometria não transforma sua curva de volts no tempo em espectro.

## Fontes técnicas

- Laser Components — especificação do módulo: https://www.lasercomponents.com/fileadmin/user_upload/home/Datasheets/diverse-opto-systems/modules/lc-lmd-650-01-laser-module.pdf
- Texas Instruments — OPT101: https://www.ti.com/lit/ds/symlink/opt101.pdf
- Texas Instruments — ADS1115: https://www.ti.com/lit/ds/symlink/ads1115.pdf
- Adafruit — alimentação e entradas do ADC: https://learn.adafruit.com/adafruit-4-channel-adc-breakouts/assembly-and-wiring
- Thorlabs — filtros ND absorptivos, catálogo de referência: https://www.thorlabs.de/catalogpages/V21/829.pdf
- HORIBA — componentes de um instrumento Raman: https://www.horiba.com/usa/scientific/technologies/raman-imaging-and-spectroscopy/raman-spectrometer-presentation/
- UKHSA — classes e exposição laser: https://www.gov.uk/government/publications/laser-radiation-safety-advice/laser-radiation-safety-advice
- Espressif — Arduino ESP32: https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html

As especificações de projeto são propostas para revisão técnica. Os links não confirmam estoque, preço ou certificação da montagem final.
