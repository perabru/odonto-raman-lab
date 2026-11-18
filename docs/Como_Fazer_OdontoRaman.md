# OdontoRaman — Como fazer

Guia de execução · 18/11/2026

Bancada LED e dados de ensino. O ESP32 não mede Raman.

## 1. Definir a entrega e dividir as equipes

Materiais: Tese, manual, modelo INIC e acesso ao site.

1. Leiam a pergunta do projeto e o resumo da tese de Furuse. O tecido central é a mucosa bucal e a doença é o carcinoma espinocelular.
2. Escolham a entrega-base: bancada LED, curvas sintéticas, PWA de registros e documentação. Dados reais entram somente se o parceiro os disponibilizar de forma autorizada.
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
4. Itens do laboratório parceiro precisam de orçamento específico. Não compre laser, reagentes de preparo ou amostras humanas para a bancada escolar.
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

## 4. Montar o circuito LED

Materiais: ESP32, 2 LEDs, 2 resistores 470 Ω, protoboards, fios, botão, fim de curso e multímetro.

1. Desconecte o USB durante a montagem. Identifique GND e os GPIO25, 26, 14 e 27 pelo nome impresso na placa, não pela posição do conector.
2. Ligue GPIO25 → resistor 470 Ω → anodo do LED de ciclo; catodo → GND. Repita com GPIO26 para o LED de estado.
3. Ligue COM do fim de curso ao GND e NO ao GPIO14. Deixe NC sem ligação. A tampa fechada deve pressionar a chave.
4. Ligue o botão entre GPIO27 e GND. Em botão de quatro terminais, confirme os pares internos; os dois lados usados devem se unir apenas ao pressionar.
5. Confira continuidade e ausência de curto entre alimentação e GND. As entradas trabalham com lógica de 3,3 V; a alimentação da placa vem do USB.
6. Peça a conferência do professor de Eletrônica antes de alimentar. Guarde foto do circuito e tabela de ligações.

Entrega: Circuito conferido e pinagem registrada.

- [Esquema elétrico](https://perabru.github.io/odonto-raman-lab/assets/circuito.svg)
- [Montagem e monitor](https://perabru.github.io/odonto-raman-lab/#bancada)
- [Como usar protoboard](https://www.robocore.net/tutoriais/como-utilizar-uma-protoboard)

## 5. Gravar o firmware e testar o ciclo

Materiais: Arduino IDE, cabo USB de dados e circuito conferido.

1. Baixe bancada.ino e abra-o na Arduino IDE dentro de uma pasta chamada bancada.
2. Siga a instalação oficial do suporte ESP32. No Gerenciador de Placas instale a versão estável de esp32 by Espressif Systems; escolha a placa clássica compatível e a porta correta.
3. Compile e envie o código. Se a porta não aparecer, confira cabo, USB e o driver oficial correspondente ao conversor da sua placa.
4. Abra o monitor serial em 115200 baud. Com a tampa fechada, pressione o botão: o LED de ciclo deve acender por cerca de 3 segundos e depois apagar.
5. Repita abrindo a tampa durante o ciclo: o LED deve apagar e surgir tampa_aberta. Com tampa aberta, iniciar deve produzir inicio_bloqueado.
6. Registre data, versão do firmware, resultado esperado, resultado observado e correção quando houver falha. Não avance para a caixa enquanto esses testes falharem.

Entrega: Três testes registrados: ciclo normal, interrupção e início bloqueado.

- [Baixar firmware](https://perabru.github.io/odonto-raman-lab/firmware/bancada/bancada.ino)
- [Instalar ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html)
- [Arduino IDE](https://www.arduino.cc/en/software/)

## 6. Ajustar a caixa e documentar a montagem

Materiais: STL/SCAD, fatiador e acesso à impressão 3D.

1. Baixe a base, tampa e bandeja. No OpenSCAD confira os encaixes com as medidas reais de sua placa e chave.
2. No PrusaSlicer use o perfil da impressora da escola. Verifique dimensões, orientação, suportes e estimativa de material com o responsável.
3. Imprima e monte sem forçar a placa. Fixe o fim de curso para que fechar a tampa realmente o pressione; proteja os terminais contra curto.
4. Repita os três testes do firmware depois da fixação. Fotografe a montagem e anote alterações de dimensões.
5. A caixa é uma demonstração com LEDs; não constitui proteção ou intertravamento para laser de pesquisa.

Entrega: Caixa montada, fotos e repetição dos testes.

- [Arquivos de impressão](https://perabru.github.io/odonto-raman-lab/#modelos)
- [Fonte da caixa](https://perabru.github.io/odonto-raman-lab/modelos/bancada.scad)
- [PrusaSlicer](https://www.prusa3d.com/p/prusaslicer/)

## 7. Preparar a ficha e treinar a rastreabilidade

Materiais: Etiquetas, recipientes vazios e três peças artificiais.

1. Identifique três peças de demonstração como DEMO-001, DEMO-002 e DEMO-003. Não use nomes, prontuários ou fotografias de pacientes.
2. Separe código do espécime, ponto e réplica. Exemplo: DEMO-001 / P01 / R01; novas réplicas mantêm o mesmo código de espécime.
3. Na Coleta PWA registre a equipe, origem, data e observações da atividade. Escolha a origem verdadeira: demonstração, sintético ou CSV do laboratório.
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

## 9. Registrar CSV e eventos da bancada na PWA

Materiais: PWA preparada, códigos definidos e arquivo ou bancada USB.

1. Para uma ficha de treino, preencha os campos da Coleta PWA e salve. Para um espectro, selecione a origem e importe um CSV de duas colunas: shift_cm-1 e intensity.
2. Informe equipamento e condições conhecidas: laser em nm, potência em mW, integração em segundos e acumulações. Deixe desconhecidos em branco; não copie os valores da tese como se fossem os da sua sessão.
3. Para USB, use Chrome/Edge compatível no computador e feche o monitor da Arduino IDE. Em Montagem e monitor clique Conectar ESP32 e selecione a porta.
4. Faça um ensaio e clique Enviar eventos para coleta. Complete o código e salve a sessão. A janela guarda os últimos 1.000 eventos; salve ao final de cada ensaio.
5. No celular, use fichas e importação de arquivos. Esta versão não tem conexão direta ao ESP32 por Wi-Fi/Bluetooth nem sincronização em nuvem.
6. Baixe o backup ao fim da aula. O JSON guarda registros, CSV bruto e eventos; o CSV de fichas guarda apenas os metadados.

Entrega: Registro salvo, origem identificada e backup baixado.

- [Coleta PWA](https://perabru.github.io/odonto-raman-lab/#coleta)
- [Monitor USB](https://perabru.github.io/odonto-raman-lab/#bancada)
- [Compatibilidade Web Serial](https://developer.chrome.com/docs/capabilities/serial?hl=pt-br)

## 10. Solicitar dados a um laboratório, se fizer parte do escopo

Materiais: Resumo do projeto e professor responsável.

1. O professor apresenta o projeto ao laboratório e pergunta sobre disponibilidade, custo, treinamento e possibilidade de receber dados já existentes sem identificação pessoal.
2. Solicitem instrumento, excitação, unidade dos eixos, potência na amostra quando conhecida, integração, acumulações, data, códigos de espécime/ponto/réplica e verificações de qualidade.
3. O responsável institucional define autorizações, material biológico, preparo, transporte, descarte e supervisão. Este guia não orienta biópsia nem coleta clínica por estudantes.
4. O operador do instrumento executa a aquisição e fornece o arquivo bruto original e uma exportação CSV. Não presumam que parâmetros de outro equipamento reproduzem a tese.
5. Confiram origem, critérios de inclusão e limitações antes de usar os dados. Se não houver parceria, concluam a avaliação didática com dados sintéticos claramente identificados.

Entrega: Condições acordadas pelo professor ou escopo mantido como didático.

- [Laboratório Univap — consultar](https://www.univap.br/univap/pesquisa/iped/laboratorios-ip-d/laboratorio-de-nanossensores)
- [Método da tese](https://perabru.github.io/odonto-raman-lab/#proposta)
- [Referência INCA](https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/boca/versao-para-profissionais-de-saude)

## 11. Conferir e analisar as curvas

Materiais: CSV bruto e ficha da sessão.

1. Abra uma coleta com espectro e use Analisar curva. Confira a origem, o intervalo do eixo e o número de pontos; não trate eventos LED como espectro.
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
4. Confira a montagem física com os três ensaios do firmware e registre o modelo do computador/celular e navegador usados.
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

- **OdontoRaman PWA** — Todas as equipes. Registrar fichas, anexar CSV, guardar eventos LED, trabalhar offline após preparar o aparelho e exportar backup. https://perabru.github.io/odonto-raman-lab/#coleta
- **Chrome / navegador compatível** — Todas as equipes. Acessar a plataforma. Chrome no computador oferece Web Serial para a bancada USB; CSV e fichas são o caminho comum no celular. https://www.google.com/chrome/
- **Arduino IDE 2** — Eletrônica. Compilar e gravar bancada.ino no ESP32 e conferir o monitor a 115200 baud. https://www.arduino.cc/en/software/
- **Visual Studio Code** — Informática. Editar HTML, CSS, JavaScript, firmware e documentação do projeto. https://code.visualstudio.com/download
- **Git + GitHub** — Informática. Versionar código e publicar o site no GitHub Pages. https://git-scm.com/downloads/
- **Node.js LTS** — Informática. Executar servidor local e testes JavaScript. https://nodejs.org/en/download
- **LibreOffice Writer + Calc** — Todas as equipes. Revisar os DOCX, conferir planilhas de compras e abrir exportações CSV. https://www.libreoffice.org/download/
- **Zotero** — Análises Clínicas / escrita. Organizar a tese e as fontes, anotações e referências. https://www.zotero.org/download/
- **OpenSCAD + PrusaSlicer** — Eletrônica. Ajustar a caixa e preparar os STL para a impressora disponível na escola. https://openscad.org/downloads.html
- **QuPath** — Análises Clínicas. Anotar imagens histológicas digitais autorizadas e discutir estruturas com o professor. https://qupath.github.io/
- **Python + NumPy / SciPy / Matplotlib** — Informática. Reproduzir cálculos e ampliar a análise em ambiente separado. https://www.python.org/downloads/
