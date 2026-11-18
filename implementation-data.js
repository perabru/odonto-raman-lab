/* Conteúdo da revisão laser 3.3. Quantidades iniciais por bancada. */
export const LINKS={
 "arduino": "https://www.arduino.cc/en/software/",
 "esp32": "https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html",
 "vscode": "https://code.visualstudio.com/download",
 "node": "https://nodejs.org/en/download",
 "git": "https://git-scm.com/downloads/",
 "python": "https://www.python.org/downloads/",
 "zotero": "https://www.zotero.org/download/",
 "libre": "https://www.libreoffice.org/download/",
 "openscad": "https://openscad.org/downloads.html",
 "slicer": "https://www.prusa3d.com/p/prusaslicer/",
 "qupath": "https://qupath.github.io/",
 "chrome": "https://www.google.com/chrome/",
 "pwa": "https://web.dev/learn/pwa/installation?hl=pt-BR",
 "serial": "https://developer.chrome.com/docs/capabilities/serial?hl=pt-br",
 "histologia": "https://histology.leeds.ac.uk/home/oral/mouth/",
 "inca": "https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/boca/versao-para-profissionais-de-saude",
 "parceiro": "https://www.univap.br/univap/pesquisa/iped/laboratorios-ip-d/laboratorio-de-nanossensores",
 "kasvi": "https://kasvi.com.br/wp-content/uploads/KASVI-Catalogo-Digital.pdf",
 "protoboard": "https://www.robocore.net/tutoriais/como-utilizar-uma-protoboard",
 "tese": "docs/Furuse_2006_FT_Raman_Mucosa.pdf",
 "manual": "docs/Manual_Monografia_UNIVAP.pdf",
 "inic": "docs/Modelo_INIC_2025_Limpo.docx",
 "repo": "https://github.com/perabru/odonto-raman-lab",
 "laser": "docs/Projeto_Laser.md",
 "opt101": "https://www.ti.com/lit/ds/symlink/opt101.pdf",
 "ads1115": "https://www.ti.com/lit/ds/symlink/ads1115.pdf",
 "laserModule": "https://www.lasercomponents.com/fileadmin/user_upload/home/Datasheets/diverse-opto-systems/modules/lc-lmd-650-01-laser-module.pdf",
 "nd": "https://www.thorlabs.de/catalogpages/V21/829.pdf",
 "raman": "https://www.horiba.com/usa/scientific/technologies/raman-imaging-and-spectroscopy/raman-spectrometer-presentation/"
};
export const MATERIALS=[
 {
  "id": "esp32",
  "area": "eletronica",
  "name": "ESP32 clássico WROOM-32 / DevKit de 30 pinos",
  "qty": 1,
  "unit": "placa",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Ler ADS1115 e estados; enviar tensão por USB. Conferir GPIO21, 22, 14 e 34 na placa clássica. O ESP32 não alimenta o laser.",
  "url": "https://www.makerhero.com/produto/modulo-wifi-esp32-bluetooth/"
 },
 {
  "id": "usb",
  "area": "eletronica",
  "name": "Cabo USB de dados",
  "qty": 1,
  "unit": "cabo",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Compatível com o conector da placa comprada. Cabo apenas de carga não permite programar nem registrar eventos.",
  "url": "https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html"
 },
 {
  "id": "breadboard",
  "area": "eletronica",
  "name": "Protoboard de 400 pontos",
  "qty": 2,
  "unit": "unidade",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Duas unidades deixam os pinos da placa larga acessíveis. Conferir continuidade dos barramentos.",
  "url": "https://www.makerhero.com/produto/protoboard-400-pontos/"
 },
 {
  "id": "led",
  "area": "eletronica",
  "name": "LED difuso vermelho de 5 mm",
  "qty": 1,
  "unit": "unidade",
  "priority": "Teste elétrico inicial",
  "status": "cotar",
  "purpose": "Carga de teste com resistor para verificar o corte físico antes de conectar o módulo laser.",
  "url": "https://www.makerhero.com/produto/led-difuso-5mm-vermelho/"
 },
 {
  "id": "resistor",
  "area": "eletronica",
  "name": "Resistor 470 Ω, ¼ W",
  "qty": 1,
  "unit": "unidade",
  "priority": "Teste elétrico inicial",
  "status": "cotar",
  "purpose": "Em série com o LED de teste, usado antes da conexão do laser.",
  "url": "https://www.makerhero.com/produto/resistor-470%CF%89-1-4w/"
 },
 {
  "id": "button",
  "area": "eletronica",
  "name": "Botão momentâneo NO para emissão manual",
  "qty": 1,
  "unit": "unidade",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Alimenta o módulo apenas enquanto pressionado, em série com a tampa. Confirmar capacidade para a corrente do módulo e fixação.",
  "url": "docs/Projeto_Laser.md"
 },
 {
  "id": "jumpers",
  "area": "eletronica",
  "name": "Kit de 40 jumpers macho–macho",
  "qty": 1,
  "unit": "kit",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Montagem na protoboard; acrescentar fios ou terminais compatíveis com a chave se necessário.",
  "url": "https://www.makerhero.com/produto/jumpers-macho-macho-x40-unidades/"
 },
 {
  "id": "multimeter",
  "area": "eletronica",
  "name": "Multímetro digital com continuidade",
  "qty": 1,
  "unit": "instrumento",
  "priority": "Usar da escola",
  "status": "conferir",
  "purpose": "Conferir resistores, contatos do botão, GND e ausência de curto antes de alimentar.",
  "url": "https://www.robocore.net/tutoriais/como-utilizar-uma-protoboard"
 },
 {
  "id": "laser-class2",
  "area": "eletronica",
  "name": "Módulo laser vermelho Classe 2, até 1 mW, driver integrado",
  "qty": 1,
  "unit": "módulo",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Faixa 650–655 nm; referência LC-LMD-650-01, variante 01. Exigir classe e potência documentadas. Fonte regulada de 3,0 V; não usar diodo avulso ou módulo sem especificação.",
  "url": "https://www.lasercomponents.com/fileadmin/user_upload/home/Datasheets/diverse-opto-systems/modules/lc-lmd-650-01-laser-module.pdf"
 },
 {
  "id": "opt101",
  "area": "eletronica",
  "name": "Fotodiodo OPT101 com amplificador integrado",
  "qty": 1,
  "unit": "sensor",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Alimentar em 3,3 V. Confirmar encapsulamento; pinos 4 e 5 unidos. Mede intensidade recebida, não bandas Raman.",
  "url": "https://www.ti.com/lit/ds/symlink/opt101.pdf"
 },
 {
  "id": "ads1115",
  "area": "eletronica",
  "name": "ADS1115 em breakout I2C",
  "qty": 1,
  "unit": "placa",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "ADC de 16 bits, VDD 3,3 V, ADDR em GND, faixa de software ±4,096 V. Verificar pull-ups do breakout em 3,3 V.",
  "url": "https://www.ti.com/lit/ds/symlink/ads1115.pdf"
 },
 {
  "id": "nd-laser",
  "area": "eletronica",
  "name": "Filtro ND absorptivo com atenuação próxima de OD 3 em 650–655 nm",
  "qty": 1,
  "unit": "filtro",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Solicitar curva de transmissão na cor do laser; reduzir sinal no detector para evitar saturação. Não é filtro Raman nem proteção ocular.",
  "url": "https://www.thorlabs.de/catalogpages/V21/829.pdf"
 },
 {
  "id": "laser-supply",
  "area": "eletronica",
  "name": "Fonte regulada de 3,0 V, polaridade e corrente verificadas",
  "qty": 1,
  "unit": "fonte",
  "priority": "Essencial",
  "status": "conferir",
  "purpose": "Fonte separada para o módulo; GND comum ao ESP32, positivos separados. Respeitar limites do módulo recebido.",
  "url": "docs/Projeto_Laser.md"
 },
 {
  "id": "lid-dual",
  "area": "eletronica",
  "name": "Chave de tampa com dois polos independentes e contatos NO",
  "qty": 1,
  "unit": "chave",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Primeiro polo interrompe fisicamente a fonte do laser; segundo polo lê tampa pelo GPIO14. Não confundir com o fim de curso de um polo da versão LED.",
  "url": "docs/Projeto_Laser.md"
 },
 {
  "id": "master-switch",
  "area": "eletronica",
  "name": "Chave geral de alimentação do módulo laser",
  "qty": 1,
  "unit": "chave",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Desligar antes de abrir para trocar material. Em série com tampa e botão de emissão, montada e identificada no gabinete.",
  "url": "docs/Projeto_Laser.md"
 },
 {
  "id": "sense-resistors",
  "area": "eletronica",
  "name": "Resistores 10 kΩ e 100 kΩ, ¼ W",
  "qty": 1,
  "unit": "par",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "10 kΩ em série no monitor GPIO34; 100 kΩ de GPIO34 para GND. Não aplicar mais de 3,3 V à entrada.",
  "url": "docs/Projeto_Laser.md"
 },
 {
  "id": "decoupling",
  "area": "eletronica",
  "name": "Capacitor cerâmico 100 nF",
  "qty": 1,
  "unit": "unidade",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Desacoplar OPT101 entre pinos 1 e 3, próximo ao sensor.",
  "url": "https://www.ti.com/lit/ds/symlink/opt101.pdf"
 },
 {
  "id": "i2c-pullups",
  "area": "eletronica",
  "name": "Resistores 4,7 kΩ para pull-up I2C",
  "qty": 2,
  "unit": "unidade",
  "priority": "Conferir breakout",
  "status": "conferir",
  "purpose": "Somente se a placa ADS1115 não os tiver; SDA/SCL para 3,3 V. Conferir o esquema do breakout antes da montagem.",
  "url": "https://www.ti.com/lit/ds/symlink/ads1115.pdf"
 },
 {
  "id": "laser-enclosure",
  "area": "eletronica",
  "name": "Gabinete opaco, anteparos e terminador de feixe",
  "qty": 1,
  "unit": "conjunto",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Projetar para fixar e conter todo o caminho óptico, sem janela. A caixa STL anterior não foi validada para laser. Revisão do responsável antes de emitir.",
  "url": "docs/Projeto_Laser.md"
 },
 {
  "id": "optical-holders",
  "area": "eletronica",
  "name": "Suportes fixos para laser, material, filtro e detector",
  "qty": 1,
  "unit": "conjunto",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Manter posição e geometria durante escuro, referência e amostra. Fixações compatíveis com as peças reais.",
  "url": "docs/Projeto_Laser.md"
 },
 {
  "id": "laser-check",
  "area": "eletronica",
  "name": "Verificação da potência e contenção com responsável e medidor adequado",
  "qty": 1,
  "unit": "serviço / acesso",
  "priority": "Antes da primeira emissão",
  "status": "consultar",
  "purpose": "Usar estrutura de óptica da instituição para conferir módulo, gabinete e corte. Não inferir potência observando o brilho.",
  "url": "https://www.univap.br/univap/pesquisa/iped/laboratorios-ip-d/laboratorio-de-nanossensores"
 },
 {
  "id": "inert-optical",
  "area": "clinicas",
  "name": "Materiais inertes transmissivos para comparar sinais",
  "qty": 3,
  "unit": "peça",
  "priority": "Ensaio óptico",
  "status": "cotar",
  "purpose": "Filtros/lâminas didáticas identificadas, fixados no mesmo suporte. Registrar geometria e referência. Sem equivalência bioquímica com mucosa.",
  "url": "docs/Projeto_Laser.md"
 },
 {
  "id": "raman-source",
  "area": "parceria",
  "name": "Fonte Raman de linha estreita + driver / controle térmico",
  "qty": 1,
  "unit": "conjunto a especificar",
  "priority": "Evolução Raman",
  "status": "consultar",
  "purpose": "Evolução Raman: definir excitação com o laboratório. O módulo vermelho da bancada não substitui uma fonte espectroscópica.",
  "url": "https://www.horiba.com/usa/scientific/technologies/raman-imaging-and-spectroscopy/raman-spectrometer-presentation/"
 },
 {
  "id": "raman-optics",
  "area": "parceria",
  "name": "Óptica de coleta, filtro de limpeza e edge/notch",
  "qty": 1,
  "unit": "conjunto a especificar",
  "priority": "Evolução Raman",
  "status": "consultar",
  "purpose": "Filtros precisam corresponder ao laser e à faixa Raman; filtro ND não rejeita seletivamente a linha Rayleigh.",
  "url": "https://www.horiba.com/usa/scientific/technologies/raman-imaging-and-spectroscopy/raman-spectrometer-presentation/"
 },
 {
  "id": "raman-spectrometer",
  "area": "parceria",
  "name": "Espectrógrafo / detector / software compatíveis",
  "qty": 1,
  "unit": "sistema a especificar",
  "priority": "Evolução Raman",
  "status": "consultar",
  "purpose": "Dimensionar faixa, resolução, sensibilidade, padrões e interface. 785 nm dispersivo não reproduz FT-Raman 1064 nm da tese.",
  "url": "https://www.horiba.com/usa/scientific/technologies/raman-imaging-and-spectroscopy/raman-spectrometer-presentation/"
 },
 {
  "id": "computer",
  "area": "eletronica",
  "name": "Computador com USB e navegador compatível",
  "qty": 1,
  "unit": "equipamento",
  "priority": "Usar da escola",
  "status": "conferir",
  "purpose": "Gravação do firmware, monitor USB e exportação. O celular pode registrar fichas e importar arquivos.",
  "url": "https://www.google.com/chrome/"
 },
 {
  "id": "labels",
  "area": "clinicas",
  "name": "Etiquetas adesivas e caneta permanente",
  "qty": 1,
  "unit": "conjunto",
  "priority": "Essencial",
  "status": "cotar",
  "purpose": "Identificar recipientes de treino com códigos fictícios, por exemplo DEMO-001. Não escrever nome de paciente.",
  "url": "dados/ficha_coleta_modelo.csv"
 },
 {
  "id": "tubes",
  "area": "clinicas",
  "name": "Microtubos de 1,5 ou 2 mL vazios, com tampa",
  "qty": 20,
  "unit": "unidade",
  "priority": "Treino de rastreio",
  "status": "cotar",
  "purpose": "Simular identificação e organização. Não coletar saliva, sangue ou tecido; fracionar o pacote com a escola se possível.",
  "url": "https://kasvi.com.br/wp-content/uploads/KASVI-Catalogo-Digital.pdf"
 },
 {
  "id": "rack",
  "area": "clinicas",
  "name": "Estante compatível com os microtubos",
  "qty": 1,
  "unit": "unidade",
  "priority": "Treino de rastreio",
  "status": "conferir",
  "purpose": "Manter os códigos visíveis e conferir posição x ficha. Reaproveitar a estante do laboratório.",
  "url": "https://kasvi.com.br/wp-content/uploads/KASVI-Catalogo-Digital.pdf"
 },
 {
  "id": "tray",
  "area": "clinicas",
  "name": "Recipientes ou placas de Petri para demonstração",
  "qty": 3,
  "unit": "unidade",
  "priority": "Treino de rastreio",
  "status": "cotar",
  "purpose": "Acomodar peças artificiais secas, sem cultura, reagentes ou material humano. Não são porta-amostras Raman certificados.",
  "url": "https://portal.kasvi.com.br/item/search?categoryid=2985&l1=2&l2=128&paths=2%3A128"
 },
 {
  "id": "slides",
  "area": "clinicas",
  "name": "Lâminas histológicas didáticas prontas de mucosa/epitélio",
  "qty": 2,
  "unit": "lâmina",
  "priority": "Opcional",
  "status": "conferir",
  "purpose": "Usar acervo institucional com identificação e supervisão. Confirmar o tecido antes de cotar; não comprar um kit genérico inteiro sem necessidade. Atlas virtual é alternativa.",
  "url": "https://histology.leeds.ac.uk/home/oral/mouth/"
 },
 {
  "id": "microscope",
  "area": "clinicas",
  "name": "Microscópio óptico do laboratório de ensino",
  "qty": 1,
  "unit": "instrumento",
  "priority": "Opcional",
  "status": "conferir",
  "purpose": "Apenas se houver aula com lâminas prontas. Para leitura de imagens digitais, usar o computador e o atlas.",
  "url": "https://histology.leeds.ac.uk/home/oral/mouth/"
 },
 {
  "id": "ppe",
  "area": "clinicas",
  "name": "Jaleco e proteção definida pelo laboratório",
  "qty": 1,
  "unit": "conjunto por aluno",
  "priority": "Se houver aula em laboratório",
  "status": "conferir",
  "purpose": "Quantidade deve ser ajustada ao grupo e à atividade pelo responsável. EPIs não tornam adequada a coleta de tecido na escola.",
  "url": "https://www.univap.br/univap/pesquisa/iped/laboratorios-ip-d/laboratorio-de-nanossensores"
 },
 {
  "id": "raman",
  "area": "parceria",
  "name": "Acesso a espectrômetro Raman/FT-Raman e operador",
  "qty": 1,
  "unit": "serviço a dimensionar",
  "priority": "Somente com parceiro",
  "status": "consultar",
  "purpose": "Solicitar disponibilidade, compatibilidade com o estudo, exportação CSV, custo por sessão e relatório de aquisição. Não há parceria confirmada.",
  "url": "https://www.univap.br/univap/pesquisa/iped/laboratorios-ip-d/laboratorio-de-nanossensores"
 },
 {
  "id": "holder",
  "area": "parceria",
  "name": "Suportes, padrão de verificação e consumíveis do instrumento",
  "qty": 1,
  "unit": "lote a definir",
  "priority": "Definido pelo laboratório",
  "status": "consultar",
  "purpose": "O operador define o suporte, branco, referência, limpeza e consumíveis compatíveis. Não comprar vidro ou reagentes supondo compatibilidade Raman.",
  "url": "https://www.univap.br/univap/pesquisa/iped/laboratorios-ip-d/laboratorio-de-nanossensores"
 },
 {
  "id": "dataset",
  "area": "parceria",
  "name": "Conjunto de dados autorizado e ficha de aquisição",
  "qty": 1,
  "unit": "conjunto",
  "priority": "Se houver dados reais",
  "status": "consultar",
  "purpose": "Solicitar espectros sem identificação pessoal, parâmetros, réplicas e códigos de espécime. Material humano e referência histopatológica ficam sob o fluxo institucional.",
  "url": "https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/boca/versao-para-profissionais-de-saude"
 }
];
export const AREA_NAMES={
 "eletronica": "Eletrônica",
 "clinicas": "Análises Clínicas",
 "parceria": "Laboratório parceiro"
};
export const PROGRAMS=[
 {
  "name": "OdontoRaman PWA",
  "area": "Todas as equipes",
  "need": "Principal",
  "purpose": "Capturar fotometria por USB, guardar escuro/referência/amostra, importar espectros Raman CSV e exportar backups locais.",
  "url": "#coleta",
  "action": "Abrir coleta",
  "setup": "Abra o site com internet e use Instalar app, quando disponível. No iPhone/iPad: Compartilhar → Adicionar à Tela de Início. Faça o teste offline no próprio aparelho."
 },
 {
  "name": "Chrome / navegador compatível",
  "area": "Todas as equipes",
  "need": "Principal",
  "purpose": "Acessar a plataforma. Chrome no computador oferece Web Serial para a bancada USB; CSV e fichas são o caminho comum no celular.",
  "url": "https://www.google.com/chrome/",
  "action": "Site oficial",
  "setup": "Mantenha o navegador atualizado. Instalar a PWA não cria suporte a USB, Bluetooth ou Wi-Fi que o navegador não oferece."
 },
 {
  "name": "Arduino IDE 2",
  "area": "Eletrônica",
  "need": "Principal",
  "purpose": "Compilar fotometria.ino, gravar o ESP32 e conferir leituras a 115200 baud. O novo firmware usa apenas Wire, incluída no núcleo ESP32.",
  "url": "https://www.arduino.cc/en/software/",
  "action": "Download oficial",
  "setup": "Instale o pacote estável esp32 by Espressif Systems no Gerenciador de Placas. Selecione ESP32 Dev Module para a placa clássica compatível."
 },
 {
  "name": "Visual Studio Code",
  "area": "Informática",
  "need": "Desenvolvimento",
  "purpose": "Editar HTML, CSS, JavaScript, firmware e documentação do projeto.",
  "url": "https://code.visualstudio.com/download",
  "action": "Download oficial",
  "setup": "Abra a pasta do repositório. O site não precisa de extensão paga nem de assistente de IA para funcionar."
 },
 {
  "name": "Git + GitHub",
  "area": "Informática",
  "need": "Desenvolvimento",
  "purpose": "Versionar código e publicar o site no GitHub Pages.",
  "url": "https://git-scm.com/downloads/",
  "action": "Instalar Git",
  "setup": "Use um branch para alterações. Não versione os backups de coleta nem arquivos de pacientes; o repositório é público."
 },
 {
  "name": "Node.js LTS",
  "area": "Informática",
  "need": "Desenvolvimento",
  "purpose": "Executar servidor local e testes JavaScript.",
  "url": "https://nodejs.org/en/download",
  "action": "Download oficial",
  "setup": "Na pasta do projeto: npm test e npm run dev -- --port 8000. Abra http://localhost:8000; não abra index.html por file://."
 },
 {
  "name": "LibreOffice Writer + Calc",
  "area": "Todas as equipes",
  "need": "Recomendado",
  "purpose": "Revisar os DOCX, conferir planilhas de compras e abrir exportações CSV.",
  "url": "https://www.libreoffice.org/download/",
  "action": "Download oficial",
  "setup": "No CSV de fichas escolha UTF-8 e separador ponto e vírgula. Revise paginação, sumário, figuras e cabeçalho no modelo da entrega."
 },
 {
  "name": "Zotero",
  "area": "Análises Clínicas / escrita",
  "need": "Recomendado",
  "purpose": "Organizar a tese e as fontes, anotações e referências.",
  "url": "https://www.zotero.org/download/",
  "action": "Download oficial",
  "setup": "Crie a coleção OdontoRaman. Confira autor, título, ano e instituição de cada referência; revisar a saída bibliográfica é parte da entrega."
 },
 {
  "name": "OpenSCAD + PrusaSlicer",
  "area": "Eletrônica",
  "need": "Se houver impressão 3D",
  "purpose": "Preparar suportes mecânicos conforme as medidas reais. Os STL antigos são do exercício LED.",
  "url": "https://openscad.org/downloads.html",
  "extra": "https://www.prusa3d.com/p/prusaslicer/",
  "action": "OpenSCAD",
  "setup": "Projete fixações conforme componentes e gabinete revisados pelo responsável. O arquivo bancada.scad antigo não constitui contenção laser validada; não basta imprimi-lo para operar a nova fonte."
 },
 {
  "name": "QuPath",
  "area": "Análises Clínicas",
  "need": "Opcional",
  "purpose": "Anotar imagens histológicas digitais autorizadas e discutir estruturas com o professor.",
  "url": "https://qupath.github.io/",
  "action": "Download oficial",
  "setup": "Use imagens didáticas ou autorizadas. Não é necessário para coletar CSV, e anotações não equivalem a um diagnóstico."
 },
 {
  "name": "Python + NumPy / SciPy / Matplotlib",
  "area": "Informática",
  "need": "Opcional",
  "purpose": "Reproduzir cálculos e ampliar a análise em ambiente separado.",
  "url": "https://www.python.org/downloads/",
  "action": "Download oficial",
  "setup": "Crie um ambiente virtual e instale python/requirements.txt. O script analisar.py existente é do exemplo dental; para mucosa, use o módulo mucosa-lab.js e seus testes até adaptar e verificar a rotina Python."
 }
];
export const HOW_STEPS=[
 {
  "id": "escopo",
  "area": "todos",
  "title": "Definir a entrega e dividir as equipes",
  "duration": "1 encontro",
  "materials": "Tese, manual, modelo INIC e acesso ao site.",
  "steps": [
   "Leiam a pergunta do projeto e o resumo da tese de Furuse. O tecido central é a mucosa bucal e a doença é o carcinoma espinocelular.",
   "A entrega-base passa a ter emissão laser própria, fotodiodo, ADC, leitura USB/PWA e documentação. A fotometria é real; obter bandas Raman é uma segunda etapa com instrumentação espectral completa.",
   "Anotem integrantes e responsabilidades: Eletrônica monta e verifica; Análises Clínicas organiza rastreabilidade e leitura crítica; Informática cuida da aplicação e dos dados.",
   "No calendário, ajustem as datas das 16 etapas ao prazo da escola e definam o responsável de cada entrega."
  ],
  "evidence": "Escopo escrito, responsáveis e calendário ajustado.",
  "links": [
   {
    "label": "Pesquisa e método",
    "url": "#proposta"
   },
   {
    "label": "Tese enviada",
    "url": "docs/Furuse_2006_FT_Raman_Mucosa.pdf"
   },
   {
    "label": "Calendário",
    "url": "#plano"
   }
  ]
 },
 {
  "id": "compras",
  "area": "todos",
  "title": "Conferir o estoque e fechar a lista de compras",
  "duration": "Antes da montagem",
  "materials": "Lista por equipe e inventário da escola.",
  "steps": [
   "Abra Materiais e filtre Eletrônica. Confira o modelo da placa e o conector USB antes de cotar.",
   "Marque o que a escola já possui; ajuste quantidades e informe o valor unitário da cotação. Registre frete e serviços à parte.",
   "Em Análises Clínicas, priorize etiquetas, recipientes de treino e peças artificiais. Use microscópio e lâminas do acervo se houver aula supervisionada.",
   "Cote o módulo laser visível Classe 2 até 1 mW com driver e documentação, OPT101, ADS1115, filtro ND e gabinete. A evolução Raman tem itens separados para especificação com laboratório.",
   "Exporte o CSV de compras e combine quem providenciará cada item. Os links são referências de especificação e cotação, sem reserva de estoque."
  ],
  "evidence": "Lista cotada, itens da escola identificados e responsáveis definidos.",
  "links": [
   {
    "label": "Materiais por equipe",
    "url": "#materiais"
   },
   {
    "label": "Catálogo de consumíveis",
    "url": "https://kasvi.com.br/wp-content/uploads/KASVI-Catalogo-Digital.pdf"
   }
  ]
 },
 {
  "id": "programas",
  "area": "todos",
  "title": "Preparar os computadores e a PWA",
  "duration": "1 encontro",
  "materials": "Computador, celular de teste e internet inicial.",
  "steps": [
   "Instale apenas o necessário para sua função na página Programas. Para usar o site basta o navegador; não é preciso instalar tudo.",
   "No celular, abra Coleta PWA e aguarde a indicação de conteúdo preparado para uso offline. Use Instalar app quando o navegador oferecer.",
   "No iPhone/iPad use Compartilhar → Adicionar à Tela de Início. Abra o aplicativo instalado e prepare-o novamente: ele pode ter armazenamento separado do navegador.",
   "Cadastre um registro DEMO e exporte o backup. Desative temporariamente a conexão pelo próprio aparelho, reabra a PWA e confirme que o registro continua disponível.",
   "Volte à internet. Guarde o backup em um local aprovado pela escola, pois limpar dados do navegador ou desinstalar o app pode remover registros."
  ],
  "evidence": "Registro de teste aberto offline no dispositivo que será usado.",
  "links": [
   {
    "label": "Programas",
    "url": "#programas"
   },
   {
    "label": "Coleta PWA",
    "url": "#coleta"
   },
   {
    "label": "Instalação de PWA",
    "url": "https://web.dev/learn/pwa/installation?hl=pt-BR"
   }
  ]
 },
 {
  "id": "circuito-laser",
  "title": "Montar o detector e o corte físico do laser",
  "area": "eletronica",
  "duration": "Conforme montagem e verificação",
  "materials": "ESP32, OPT101, ADS1115, capacitores, resistores, chave de dois polos, botão e multímetro.",
  "steps": [
   "Comece sem o laser conectado. Siga a tabela completa de pinos em Bancada laser; OPT101 e ADS1115 recebem 3,3 V.",
   "Ligue ADS1115 SDA ao GPIO21 e SCL ao GPIO22. O nó dos pinos 4 e 5 do OPT101 vai a A0. Confira GND e pull-ups.",
   "A fonte de 3,0 V do laser passa por chave geral, primeiro contato NO da tampa e botão de emissão, em série. Teste inicialmente usando LED com resistor como carga.",
   "O segundo polo da tampa vai ao GPIO14/GND. Monitore a alimentação após o botão no GPIO34 com resistores de 10 kΩ e 100 kΩ conforme o esquema.",
   "Confira tensões e continuidade com o professor. O corte deve funcionar fisicamente mesmo com ESP32 desligado."
  ],
  "evidence": "Pinagem conferida e corte físico ensaiado sem laser.",
  "links": [
   {
    "label": "Projeto e tabela de pinos",
    "url": "docs/Projeto_Laser.md"
   },
   {
    "label": "Montagem",
    "url": "#laser"
   },
   {
    "label": "OPT101",
    "url": "https://www.ti.com/lit/ds/symlink/opt101.pdf"
   },
   {
    "label": "ADS1115",
    "url": "https://www.ti.com/lit/ds/symlink/ads1115.pdf"
   }
  ]
 },
 {
  "id": "firmware-laser",
  "title": "Gravar o firmware de aquisição óptica",
  "area": "eletronica",
  "duration": "Conforme montagem e verificação",
  "materials": "Arduino IDE, cabo de dados e aquisição conferida.",
  "steps": [
   "Baixe fotometria.ino e abra em pasta fotometria. Instale o núcleo ESP32 oficial e selecione a placa correta.",
   "Compile e grave com a alimentação do laser desligada. O código usa Wire; não precisa de biblioteca externa de ADC.",
   "No monitor a 115200 baud confira laser_photometry, contagens, tensão, tampa e alimentação. Não há comando de acionamento do laser.",
   "Confira detecção do ADC e resposta à luz ambiente. Falha I2C exige corrigir o circuito desligado e reiniciar.",
   "Feche o monitor da IDE antes de usar a leitura USB da PWA."
  ],
  "evidence": "Firmware compilado e tensões/estados conferidos.",
  "links": [
   {
    "label": "Firmware de leitura",
    "url": "firmware/fotometria/fotometria.ino"
   },
   {
    "label": "Instalar ESP32",
    "url": "https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html"
   }
  ]
 },
 {
  "id": "caixa-laser",
  "title": "Montar a óptica dentro do gabinete",
  "area": "eletronica",
  "duration": "Conforme montagem e verificação",
  "materials": "Módulo documentado, fonte regulada, suportes, material, ND, detector, gabinete e responsável.",
  "steps": [
   "Fixe laser, suporte de material, filtro ND e detector na geometria de transmissão, com tudo desligado.",
   "O ND deve ter atenuação próxima de OD 3 na faixa do laser. Confira curva e compatibilidade; não o confunda com filtro Raman.",
   "Use gabinete opaco, anteparos e terminador de feixe. A caixa STL anterior foi desenhada para LED e precisa de novo projeto para esta finalidade.",
   "O responsável verifica potência, contenção, fixações e funcionamento do corte de tampa antes da primeira emissão.",
   "Toda mudança de alinhamento ou troca de material ocorre com emissão desligada. O botão de emissão deve ser mantido pressionado apenas com tampa fechada."
  ],
  "evidence": "Montagem óptica revisada e verificação física registrada.",
  "links": [
   {
    "label": "Projeto laser",
    "url": "docs/Projeto_Laser.md"
   },
   {
    "label": "Ficha do módulo",
    "url": "https://www.lasercomponents.com/fileadmin/user_upload/home/Datasheets/diverse-opto-systems/modules/lc-lmd-650-01-laser-module.pdf"
   },
   {
    "label": "Filtro ND",
    "url": "https://www.thorlabs.de/catalogpages/V21/829.pdf"
   }
  ]
 },
 {
  "id": "rastreio",
  "area": "clinicas",
  "title": "Preparar a ficha e treinar a rastreabilidade",
  "duration": "1 encontro",
  "materials": "Etiquetas, fichas e três materiais inertes do ensaio.",
  "steps": [
   "Identifique três peças de demonstração como DEMO-001, DEMO-002 e DEMO-003. Não use nomes, prontuários ou fotografias de pacientes.",
   "Separe código do espécime, ponto e réplica. Exemplo: DEMO-001 / P01 / R01; novas réplicas mantêm o mesmo código de espécime.",
   "Na Coleta PWA registre equipe, data e origem: fotometria real, exemplo de fotometria ou espectro Raman. Não misture essas categorias.",
   "Peça a outro colega para conferir os códigos da etiqueta e da ficha e registrar se encontrou divergências.",
   "Para dados reais, o laboratório deve fornecer códigos sem identificação pessoal. Uma tabela que permita reidentificar pessoas fica sob guarda institucional, fora deste site público e do GitHub."
  ],
  "evidence": "Três fichas rastreáveis e conferência por outro integrante.",
  "links": [
   {
    "label": "Modelo da ficha CSV",
    "url": "dados/ficha_coleta_modelo.csv"
   },
   {
    "label": "Dicionário dos campos",
    "url": "docs/Dicionario_Coleta.md"
   },
   {
    "label": "Registrar ficha",
    "url": "#coleta"
   }
  ]
 },
 {
  "id": "histologia",
  "area": "clinicas",
  "title": "Estudar a mucosa e relacionar a referência",
  "duration": "1–2 encontros",
  "materials": "Tese, atlas e, se disponíveis, lâminas didáticas prontas.",
  "steps": [
   "No modelo 3D identifique epitélio, limite basal, tecido conjuntivo e vasos. Depois compare com uma imagem histológica didática do atlas.",
   "Com o professor, descreva organização do epitélio e o conceito de invasão. Não atribua um diagnóstico a uma fotografia ou curva do simulador.",
   "Faça uma ficha da tese: objetivo, número de amostras e de pacientes, instrumento, região espectral, processamento e limitações.",
   "Diferencie o desenho 3D, os exemplos sintéticos e a evidência experimental da tese nas legendas e nas apresentações.",
   "Se usar QuPath, anote estruturas em imagens autorizadas e exporte a figura com fonte e escala fornecida pela imagem, sem inventar medida."
  ],
  "evidence": "Fichamento e figura comentada com fonte.",
  "links": [
   {
    "label": "Mucosa 3D",
    "url": "#mucosa"
   },
   {
    "label": "Atlas de histologia",
    "url": "https://histology.leeds.ac.uk/home/oral/mouth/"
   },
   {
    "label": "INCA",
    "url": "https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/boca/versao-para-profissionais-de-saude"
   },
   {
    "label": "Tese",
    "url": "docs/Furuse_2006_FT_Raman_Mucosa.pdf"
   }
  ]
 },
 {
  "id": "coletar-laser",
  "title": "Medir escuro, referência e amostra na PWA",
  "area": "informatica",
  "duration": "Conforme montagem e verificação",
  "materials": "Bancada revisada, computador com Web Serial e materiais inertes.",
  "steps": [
   "Abra Bancada laser → Medir e salvar → Conectar leitura USB. Conectar não liga o laser.",
   "Com tampa fechada e botão solto, aguarde estabilizar e capture escuro. São preservadas as próximas 20 leituras.",
   "Com o branco ou suporte vazio, mantenha o botão de emissão pressionado, espere estabilizar e capture referência.",
   "Desligue a emissão e a chave geral antes de trocar o material. Feche a tampa, religue, estabilize e capture amostra mantendo o botão pressionado.",
   "Confira média, desvio e transmissão relativa. Se houver sinal insuficiente ou possível saturação, corrija a montagem e refaça as três etapas; não aumente a potência.",
   "Baixe JSON/CSV ou envie à Coleta PWA, complete código/equipe e clique Salvar. No celular, importe a sessão JSON."
  ],
  "evidence": "Sessão com 60 leituras brutas e código rastreável.",
  "links": [
   {
    "label": "Bancada laser",
    "url": "#laser"
   },
   {
    "label": "Coleta PWA",
    "url": "#coleta"
   },
   {
    "label": "Procedimento",
    "url": "docs/Projeto_Laser.md"
   }
  ]
 },
 {
  "id": "parceiro",
  "area": "clinicas",
  "title": "Especificar a evolução Raman com um laboratório",
  "duration": "Antes de prometer coleta real",
  "materials": "Resumo do projeto e professor responsável.",
  "steps": [
   "O professor apresenta a intenção de construir aquisição Raman própria. Discutam laser de linha estreita, óptica, filtros, espectrômetro, calibração, gabinete e custos, ou acesso a um instrumento existente.",
   "Solicitem instrumento, excitação, unidade dos eixos, potência na amostra quando conhecida, integração, acumulações, data, códigos de espécime/ponto/réplica e verificações de qualidade.",
   "O responsável institucional define autorizações, material biológico, preparo, transporte, descarte e supervisão. Este guia não orienta biópsia nem coleta clínica por estudantes.",
   "O operador do instrumento executa a aquisição e fornece o arquivo bruto original e uma exportação CSV. Não presumam que parâmetros de outro equipamento reproduzem a tese.",
   "Sem a instrumentação espectral, a equipe conclui a fotometria real e os testes computacionais, relatando que não mediu bandas Raman nem material humano."
  ],
  "evidence": "Condições acordadas pelo professor ou escopo mantido como didático.",
  "links": [
   {
    "label": "Evolução para Raman",
    "url": "#laser"
   },
   {
    "label": "Laboratório Univap — consultar",
    "url": "https://www.univap.br/univap/pesquisa/iped/laboratorios-ip-d/laboratorio-de-nanossensores"
   },
   {
    "label": "Método da tese",
    "url": "#proposta"
   },
   {
    "label": "Referência INCA",
    "url": "https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/boca/versao-para-profissionais-de-saude"
   }
  ]
 },
 {
  "id": "analisar",
  "area": "informatica",
  "title": "Conferir e analisar as curvas",
  "duration": "Após cada lote",
  "materials": "CSV bruto e ficha da sessão.",
  "steps": [
   "Para fotometria, examine escuro, referência, amostra, dispersão e transmissão relativa em Bancada laser. Para espectro Raman, use Analisar curva na coleta correspondente; volts no tempo não são deslocamento Raman.",
   "Compare a curva bruta com a processada. Comece sem suavização e sem normalização; altere uma opção por vez e registre o efeito.",
   "Para estudar a opção de 1450 cm⁻¹, confira se a janela está coberta e há sinal positivo. A rotina didática usa o máximo entre 1420 e 1480; isso não reproduz automaticamente todo o método da tese.",
   "Exporte o bruto preservado, o processado e o relatório dos parâmetros. Avalie problemas de fundo, saturação, origem e resolução com o responsável pelos dados.",
   "Na discussão, diferencie réplicas de amostras independentes. O aplicativo não executa PCA clínica nem entrega sensibilidade, especificidade ou diagnóstico."
  ],
  "evidence": "Curvas e relatório vinculados ao código da coleta.",
  "links": [
   {
    "label": "Analisar curvas",
    "url": "#analise"
   },
   {
    "label": "FT-Raman explicado",
    "url": "#ftraman"
   }
  ]
 },
 {
  "id": "validar",
  "area": "informatica",
  "title": "Verificar o fluxo completo e os backups",
  "duration": "Antes de apresentar",
  "materials": "Computador, celular escolhido e uma sessão de teste.",
  "steps": [
   "Crie uma ficha DEMO, importe o exemplo sintético, salve e recarregue. Confira se códigos, metadados e curva permanecem.",
   "Exporte o backup JSON e importe-o em outro navegador de teste. Registros com o mesmo ID não são sobrescritos silenciosamente; confira os conflitos informados.",
   "Teste um CSV inválido: o aplicativo deve recusar e preservar a entrada anterior. Teste também ficar offline após a preparação.",
   "Confira fisicamente corte da tampa, botão, estabilidade, repetibilidade e resposta a filtros. Teste desconexão USB e erro de ADC; registre o hardware utilizado.",
   "Para desenvolvimento, rode npm test. Aprovação de teste automático não substitui o ensaio do hardware ou a verificação no celular da equipe."
  ],
  "evidence": "Planilha de testes com resultado observado e limitações.",
  "links": [
   {
    "label": "CSV sintético de teste",
    "url": "dados/mucosa_sintetica_A.csv"
   },
   {
    "label": "Registro de verificação",
    "url": "docs/VERIFICACAO.md"
   },
   {
    "label": "Código-fonte",
    "url": "https://github.com/perabru/odonto-raman-lab"
   }
  ]
 },
 {
  "id": "escrever",
  "area": "todos",
  "title": "Escrever a monografia, o INIC e preparar a entrega",
  "duration": "Durante todo o projeto",
  "materials": "Manual, modelo, registros, imagens próprias e referências.",
  "steps": [
   "Escreva método conforme o que foi realmente executado: componentes, ligações, versão do programa, origem dos dados, campos coletados e testes.",
   "Insira resultados observados, inclusive falhas, correções e limites. Não use números da tese como resultados da equipe.",
   "No editor de monografia preencha as seções orientadas pelo manual. No INIC organize resumo, introdução, método, resultados, discussão e conclusão.",
   "Exporte Word e revise no modelo oficial fornecido: figuras, fontes, paginação, sumário e cabeçalho. Confirme as regras da edição do INIC antes da submissão.",
   "Entregue código, lista de materiais, fotos da montagem, fichas e backups autorizados, relatório dos testes e documentos revisados pelo orientador."
  ],
  "evidence": "Documentação revisada e pacote de entrega organizado.",
  "links": [
   {
    "label": "Monografia",
    "url": "#documentacao"
   },
   {
    "label": "Escrever INIC",
    "url": "#inic"
   },
   {
    "label": "Manual",
    "url": "docs/Manual_Monografia_UNIVAP.pdf"
   },
   {
    "label": "Modelo INIC",
    "url": "docs/Modelo_INIC_2025_Limpo.docx"
   }
  ]
 }
];
