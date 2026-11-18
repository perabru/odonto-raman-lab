# OdontoRaman — Como fazer

Guia de execução · 18/11/2026

Emissão laser e leitura óptica próprias. A fotometria mede intensidade; a evolução Raman exige instrumentação espectral. Projeto detalhado: https://perabru.github.io/odonto-raman-lab/docs/Projeto_Laser.md

## 1. Definir a entrega e dividir as equipes

Materiais: Tese, manual, modelo INIC e acesso ao site.

1. Leiam a pergunta do projeto e o resumo da tese de Furuse. O tecido central é a mucosa bucal e a doença é o carcinoma espinocelular.
2. A entrega-base passa a ter emissão laser própria, fotodiodo, ADC, leitura USB/PWA e documentação. A fotometria é real; obter bandas Raman é uma segunda etapa com instrumentação espectral completa.
3. Anotem integrantes e responsabilidades: Eletrônica monta e verifica; Análises Clínicas organiza rastreabilidade e leitura crítica; Informática cuida da aplicação e dos dados.
4. No calendário, ajustem as datas das 16 etapas ao prazo da escola e definam o responsável de cada entrega.

Entrega: Escopo escrito, responsáveis e calendário ajustado.

- [Pesquisa e método](https://perabru.github.io/odonto-raman-lab/#proposta)
- [Tese enviada](https://perabru.github.io/odonto-raman-lab/docs/Furuse_2006_FT_Raman_Mucosa.pdf)
- [Calendário](https://perabru.github.io/odonto-raman-lab/#plano)

## 2. Conferir o estoque e fechar a lista de compras

Materiais: Lista por equipe e inventário da escola.

1. Abra Materiais e filtre Eletrônica. Confira o modelo da placa e o conector USB antes de cotar.
2. Marque o que a escola já possui; ajuste quantidades e informe o valor unitário da cotação. Registre frete e serviços à parte.
3. Em Análises Clínicas, priorize etiquetas, recipientes de treino e peças artificiais. Use microscópio e lâminas do acervo se houver aula supervisionada.
4. Cote o módulo laser visível Classe 2 até 1 mW com driver e documentação, OPT101, ADS1115, filtro ND e gabinete. A evolução Raman tem itens separados para especificação com laboratório.
5. Exporte o CSV de compras e combine quem providenciará cada item. Os links são referências de especificação e cotação, sem reserva de estoque.

Entrega: Lista cotada, itens da escola identificados e responsáveis definidos.

- [Materiais por equipe](https://perabru.github.io/odonto-raman-lab/#materiais)
- [Catálogo de consumíveis](https://kasvi.com.br/wp-content/uploads/KASVI-Catalogo-Digital.pdf)

## 3. Preparar os computadores e a PWA

Materiais: Computador, celular de teste e internet inicial.

1. Instale apenas o necessário para sua função na página Programas. Para usar o site basta o navegador; não é preciso instalar tudo.
2. No celular, abra Coleta PWA e aguarde a indicação de conteúdo preparado para uso offline. Use Instalar app quando o navegador oferecer.
3. No iPhone/iPad use Compartilhar → Adicionar à Tela de Início. Abra o aplicativo instalado e prepare-o novamente: ele pode ter armazenamento separado do navegador.
4. Cadastre um registro DEMO e exporte o backup. Desative temporariamente a conexão pelo próprio aparelho, reabra a PWA e confirme que o registro continua disponível.
5. Volte à internet. Guarde o backup em um local aprovado pela escola, pois limpar dados do navegador ou desinstalar o app pode remover registros.

Entrega: Registro de teste aberto offline no dispositivo que será usado.

- [Programas](https://perabru.github.io/odonto-raman-lab/#programas)
- [Coleta PWA](https://perabru.github.io/odonto-raman-lab/#coleta)
- [Instalação de PWA](https://web.dev/learn/pwa/installation?hl=pt-BR)

## 4. Montar o detector e o corte físico do laser

Materiais: ESP32, OPT101, ADS1115, capacitores, resistores, chave de dois polos, botão e multímetro.

1. Comece sem o laser conectado. Siga a tabela completa de pinos em Bancada laser; OPT101 e ADS1115 recebem 3,3 V.
2. Ligue ADS1115 SDA ao GPIO21 e SCL ao GPIO22. O nó dos pinos 4 e 5 do OPT101 vai a A0. Confira GND e pull-ups.
3. A fonte de 3,0 V do laser passa por chave geral, primeiro contato NO da tampa e botão de emissão, em série. Teste inicialmente usando LED com resistor como carga.
4. O segundo polo da tampa vai ao GPIO14/GND. Monitore a alimentação após o botão no GPIO34 com resistores de 10 kΩ e 100 kΩ conforme o esquema.
5. Confira tensões e continuidade com o professor. O corte deve funcionar fisicamente mesmo com ESP32 desligado.

Entrega: Pinagem conferida e corte físico ensaiado sem laser.

- [Projeto e tabela de pinos](https://perabru.github.io/odonto-raman-lab/docs/Projeto_Laser.md)
- [Montagem](https://perabru.github.io/odonto-raman-lab/#laser)
- [OPT101](https://www.ti.com/lit/ds/symlink/opt101.pdf)
- [ADS1115](https://www.ti.com/lit/ds/symlink/ads1115.pdf)

## 5. Gravar o firmware de aquisição óptica

Materiais: Arduino IDE, cabo de dados e aquisição conferida.

1. Baixe fotometria.ino e abra em pasta fotometria. Instale o núcleo ESP32 oficial e selecione a placa correta.
2. Compile e grave com a alimentação do laser desligada. O código usa Wire; não precisa de biblioteca externa de ADC.
3. No monitor a 115200 baud confira laser_photometry, contagens, tensão, tampa e alimentação. Não há comando de acionamento do laser.
4. Confira detecção do ADC e resposta à luz ambiente. Falha I2C exige corrigir o circuito desligado e reiniciar.
5. Feche o monitor da IDE antes de usar a leitura USB da PWA.

Entrega: Firmware compilado e tensões/estados conferidos.

- [Firmware de leitura](https://perabru.github.io/odonto-raman-lab/firmware/fotometria/fotometria.ino)
- [Instalar ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html)

## 6. Montar a óptica dentro do gabinete

Materiais: Módulo documentado, fonte regulada, suportes, material, ND, detector, gabinete e responsável.

1. Fixe laser, suporte de material, filtro ND e detector na geometria de transmissão, com tudo desligado.
2. O ND deve ter atenuação próxima de OD 3 na faixa do laser. Confira curva e compatibilidade; não o confunda com filtro Raman.
3. Use gabinete opaco, anteparos e terminador de feixe. A caixa STL anterior foi desenhada para LED e precisa de novo projeto para esta finalidade.
4. O responsável verifica potência, contenção, fixações e funcionamento do corte de tampa antes da primeira emissão.
5. Toda mudança de alinhamento ou troca de material ocorre com emissão desligada. O botão de emissão deve ser mantido pressionado apenas com tampa fechada.

Entrega: Montagem óptica revisada e verificação física registrada.

- [Projeto laser](https://perabru.github.io/odonto-raman-lab/docs/Projeto_Laser.md)
- [Ficha do módulo](https://www.lasercomponents.com/fileadmin/user_upload/home/Datasheets/diverse-opto-systems/modules/lc-lmd-650-01-laser-module.pdf)
- [Filtro ND](https://www.thorlabs.de/catalogpages/V21/829.pdf)

## 7. Preparar a ficha e treinar a rastreabilidade

Materiais: Etiquetas, fichas e três materiais inertes do ensaio.

1. Identifique três peças de demonstração como DEMO-001, DEMO-002 e DEMO-003. Não use nomes, prontuários ou fotografias de pacientes.
2. Separe código do espécime, ponto e réplica. Exemplo: DEMO-001 / P01 / R01; novas réplicas mantêm o mesmo código de espécime.
3. Na Coleta PWA registre equipe, data e origem: fotometria real, exemplo de fotometria ou espectro Raman. Não misture essas categorias.
4. Peça a outro colega para conferir os códigos da etiqueta e da ficha e registrar se encontrou divergências.
5. Para dados reais, o laboratório deve fornecer códigos sem identificação pessoal. Uma tabela que permita reidentificar pessoas fica sob guarda institucional, fora deste site público e do GitHub.

Entrega: Três fichas rastreáveis e conferência por outro integrante.

- [Modelo da ficha CSV](https://perabru.github.io/odonto-raman-lab/dados/ficha_coleta_modelo.csv)
- [Dicionário dos campos](https://perabru.github.io/odonto-raman-lab/docs/Dicionario_Coleta.md)
- [Registrar ficha](https://perabru.github.io/odonto-raman-lab/#coleta)

## 8. Estudar a mucosa e relacionar a referência

Materiais: Tese, atlas e, se disponíveis, lâminas didáticas prontas.

1. No modelo 3D identifique epitélio, limite basal, tecido conjuntivo e vasos. Depois compare com uma imagem histológica didática do atlas.
2. Com o professor, descreva organização do epitélio e o conceito de invasão. Não atribua um diagnóstico a uma fotografia ou curva do simulador.
3. Faça uma ficha da tese: objetivo, número de amostras e de pacientes, instrumento, região espectral, processamento e limitações.
4. Diferencie o desenho 3D, os exemplos sintéticos e a evidência experimental da tese nas legendas e nas apresentações.
5. Se usar QuPath, anote estruturas em imagens autorizadas e exporte a figura com fonte e escala fornecida pela imagem, sem inventar medida.

Entrega: Fichamento e figura comentada com fonte.

- [Mucosa 3D](https://perabru.github.io/odonto-raman-lab/#mucosa)
- [Atlas de histologia](https://histology.leeds.ac.uk/home/oral/mouth/)
- [INCA](https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/boca/versao-para-profissionais-de-saude)
- [Tese](https://perabru.github.io/odonto-raman-lab/docs/Furuse_2006_FT_Raman_Mucosa.pdf)

## 9. Medir escuro, referência e amostra na PWA

Materiais: Bancada revisada, computador com Web Serial e materiais inertes.

1. Abra Bancada laser → Medir e salvar → Conectar leitura USB. Conectar não liga o laser.
2. Com tampa fechada e botão solto, aguarde estabilizar e capture escuro. São preservadas as próximas 20 leituras.
3. Com o branco ou suporte vazio, mantenha o botão de emissão pressionado, espere estabilizar e capture referência.
4. Desligue a emissão e a chave geral antes de trocar o material. Feche a tampa, religue, estabilize e capture amostra mantendo o botão pressionado.
5. Confira média, desvio e transmissão relativa. Se houver sinal insuficiente ou possível saturação, corrija a montagem e refaça as três etapas; não aumente a potência.
6. Baixe JSON/CSV ou envie à Coleta PWA, complete código/equipe e clique Salvar. No celular, importe a sessão JSON.

Entrega: Sessão com 60 leituras brutas e código rastreável.

- [Bancada laser](https://perabru.github.io/odonto-raman-lab/#laser)
- [Coleta PWA](https://perabru.github.io/odonto-raman-lab/#coleta)
- [Procedimento](https://perabru.github.io/odonto-raman-lab/docs/Projeto_Laser.md)

## 10. Especificar a evolução Raman com um laboratório

Materiais: Resumo do projeto e professor responsável.

1. O professor apresenta a intenção de construir aquisição Raman própria. Discutam laser de linha estreita, óptica, filtros, espectrômetro, calibração, gabinete e custos, ou acesso a um instrumento existente.
2. Solicitem instrumento, excitação, unidade dos eixos, potência na amostra quando conhecida, integração, acumulações, data, códigos de espécime/ponto/réplica e verificações de qualidade.
3. O responsável institucional define autorizações, material biológico, preparo, transporte, descarte e supervisão. Este guia não orienta biópsia nem coleta clínica por estudantes.
4. O operador do instrumento executa a aquisição e fornece o arquivo bruto original e uma exportação CSV. Não presumam que parâmetros de outro equipamento reproduzem a tese.
5. Sem a instrumentação espectral, a equipe conclui a fotometria real e os testes computacionais, relatando que não mediu bandas Raman nem material humano.

Entrega: Condições acordadas pelo professor ou escopo mantido como didático.

- [Evolução para Raman](https://perabru.github.io/odonto-raman-lab/#laser)
- [Laboratório Univap — consultar](https://www.univap.br/univap/pesquisa/iped/laboratorios-ip-d/laboratorio-de-nanossensores)
- [Método da tese](https://perabru.github.io/odonto-raman-lab/#proposta)
- [Referência INCA](https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/boca/versao-para-profissionais-de-saude)

## 11. Conferir e analisar as curvas

Materiais: CSV bruto e ficha da sessão.

1. Para fotometria, examine escuro, referência, amostra, dispersão e transmissão relativa em Bancada laser. Para espectro Raman, use Analisar curva na coleta correspondente; volts no tempo não são deslocamento Raman.
2. Compare a curva bruta com a processada. Comece sem suavização e sem normalização; altere uma opção por vez e registre o efeito.
3. Para estudar a opção de 1450 cm⁻¹, confira se a janela está coberta e há sinal positivo. A rotina didática usa o máximo entre 1420 e 1480; isso não reproduz automaticamente todo o método da tese.
4. Exporte o bruto preservado, o processado e o relatório dos parâmetros. Avalie problemas de fundo, saturação, origem e resolução com o responsável pelos dados.
5. Na discussão, diferencie réplicas de amostras independentes. O aplicativo não executa PCA clínica nem entrega sensibilidade, especificidade ou diagnóstico.

Entrega: Curvas e relatório vinculados ao código da coleta.

- [Analisar curvas](https://perabru.github.io/odonto-raman-lab/#analise)
- [FT-Raman explicado](https://perabru.github.io/odonto-raman-lab/#ftraman)

## 12. Verificar o fluxo completo e os backups

Materiais: Computador, celular escolhido e uma sessão de teste.

1. Crie uma ficha DEMO, importe o exemplo sintético, salve e recarregue. Confira se códigos, metadados e curva permanecem.
2. Exporte o backup JSON e importe-o em outro navegador de teste. Registros com o mesmo ID não são sobrescritos silenciosamente; confira os conflitos informados.
3. Teste um CSV inválido: o aplicativo deve recusar e preservar a entrada anterior. Teste também ficar offline após a preparação.
4. Confira fisicamente corte da tampa, botão, estabilidade, repetibilidade e resposta a filtros. Teste desconexão USB e erro de ADC; registre o hardware utilizado.
5. Para desenvolvimento, rode npm test. Aprovação de teste automático não substitui o ensaio do hardware ou a verificação no celular da equipe.

Entrega: Planilha de testes com resultado observado e limitações.

- [CSV sintético de teste](https://perabru.github.io/odonto-raman-lab/dados/mucosa_sintetica_A.csv)
- [Registro de verificação](https://perabru.github.io/odonto-raman-lab/docs/VERIFICACAO.md)
- [Código-fonte](https://github.com/perabru/odonto-raman-lab)

## 13. Escrever a monografia, o INIC e preparar a entrega

Materiais: Manual, modelo, registros, imagens próprias e referências.

1. Escreva método conforme o que foi realmente executado: componentes, ligações, versão do programa, origem dos dados, campos coletados e testes.
2. Insira resultados observados, inclusive falhas, correções e limites. Não use números da tese como resultados da equipe.
3. No editor de monografia preencha as seções orientadas pelo manual. No INIC organize resumo, introdução, método, resultados, discussão e conclusão.
4. Exporte Word e revise no modelo oficial fornecido: figuras, fontes, paginação, sumário e cabeçalho. Confirme as regras da edição do INIC antes da submissão.
5. Entregue código, lista de materiais, fotos da montagem, fichas e backups autorizados, relatório dos testes e documentos revisados pelo orientador.

Entrega: Documentação revisada e pacote de entrega organizado.

- [Monografia](https://perabru.github.io/odonto-raman-lab/#documentacao)
- [Escrever INIC](https://perabru.github.io/odonto-raman-lab/#inic)
- [Manual](https://perabru.github.io/odonto-raman-lab/docs/Manual_Monografia_UNIVAP.pdf)
- [Modelo INIC](https://perabru.github.io/odonto-raman-lab/docs/Modelo_INIC_2025_Limpo.docx)

## Programas

- **OdontoRaman PWA** — Todas as equipes. Capturar fotometria por USB, guardar escuro/referência/amostra, importar espectros Raman CSV e exportar backups locais. https://perabru.github.io/odonto-raman-lab/#coleta
- **Chrome / navegador compatível** — Todas as equipes. Acessar a plataforma. Chrome no computador oferece Web Serial para a bancada USB; CSV e fichas são o caminho comum no celular. https://www.google.com/chrome/
- **Arduino IDE 2** — Eletrônica. Compilar fotometria.ino, gravar o ESP32 e conferir leituras a 115200 baud. O novo firmware usa apenas Wire, incluída no núcleo ESP32. https://www.arduino.cc/en/software/
- **Visual Studio Code** — Informática. Editar HTML, CSS, JavaScript, firmware e documentação do projeto. https://code.visualstudio.com/download
- **Git + GitHub** — Informática. Versionar código e publicar o site no GitHub Pages. https://git-scm.com/downloads/
- **Node.js LTS** — Informática. Executar servidor local e testes JavaScript. https://nodejs.org/en/download
- **LibreOffice Writer + Calc** — Todas as equipes. Revisar os DOCX, conferir planilhas de compras e abrir exportações CSV. https://www.libreoffice.org/download/
- **Zotero** — Análises Clínicas / escrita. Organizar a tese e as fontes, anotações e referências. https://www.zotero.org/download/
- **OpenSCAD + PrusaSlicer** — Eletrônica. Preparar suportes mecânicos conforme as medidas reais. Os STL antigos são do exercício LED. https://openscad.org/downloads.html
- **QuPath** — Análises Clínicas. Anotar imagens histológicas digitais autorizadas e discutir estruturas com o professor. https://qupath.github.io/
- **Python + NumPy / SciPy / Matplotlib** — Informática. Reproduzir cálculos e ampliar a análise em ambiente separado. https://www.python.org/downloads/
