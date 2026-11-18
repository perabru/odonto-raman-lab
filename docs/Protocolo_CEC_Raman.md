# OdontoRaman — Protocolo Raman para carcinoma espinocelular da boca

Revisão 3.5 • 18/11/2026 • proposta educacional de pesquisa, **não validada para diagnóstico clínico**.

## 1. Foco do TCC

**Doença-alvo:** carcinoma espinocelular da mucosa bucal (CEC/OSCC).  
**Pergunta:** espectros Raman apresentam padrões multivariados associados a diferenças entre amostras de mucosa oral normal e com CEC?  
**Hipótese:** diferenças bioquímicas alteram conjuntamente intensidades em várias regiões Raman. Um pico isolado não confirma câncer.

**Produto da pesquisa:** cadeia de espectrometria documentada, PWA para dados pseudonimizados, análise por paciente, relatórios, monografia e INIC. Não são entregáveis diagnósticos ou laudos médicos.

## 2. O que realmente precisa ser medido

O sistema anterior (laser vermelho → OPT101 → ADS1115 → ESP32) mede luz numa faixa de cor, produzindo tensão e transmissão relativa. **Não mede Raman** e não consegue identificar carcinoma.

Uma aquisição Raman verdadeira exige **laser espectroscópico + óptica de coleta + filtro de rejeição Rayleigh + espectrômetro (dispersivo ou FT-Raman) + detector compatível + padrões de calibração + controle físico de laser**.

O estudo de Furuse (2006) utilizou **laser Nd:YAG 1064 nm** e **espectrômetro FT-Raman Bruker RFS 100/S**. Foram estudadas 81 amostras neoplásicas de 26 pacientes, e 48 amostras normais de 18 pacientes, com 3 espectros por amostra. Portanto, **não** equivale a 129 pacientes. A técnica investigou padrões por análise de componentes principais (PCA). Veja [tese em PDF](./Furuse_2006_FT_Raman_Mucosa.pdf).

### Lista de aquisição e acesso ao laboratório

| Item | Objetivo | Situação |
| --- | --- | --- |
| Laser e fonte/driver espectroscópicos documentados | Excitação de Raman | Definir com laboratório parceiro |
| Filtro edge/notch de rejeição do comprimento de onda do laser | Rejeitar espalhamento Rayleigh | Definir e conferir ficha técnica |
| Óptica de coleta e espectrômetro | Resolver bandas espectrais | Preferir equipamento de laboratório |
| Detector, eletrônica de aquisição e software do fabricante | Registrar espectros com eixo calibrado | Especificar após escolher equipamento |
| Padrão espectral (ex.: silício, quando aplicável) | Verificar a calibração | Acesso por laboratório |
| Gabinete com contenção e intertravamento | Reduzir risco óptico | Inspeção e supervisão obrigatórias |
| Amostras autorizadas com referência histopatológica | Rótulos para pesquisa | Depende de protocolo ético |
| Computador + PWA | Armazenar CSV, gerar gráficos e relatórios | Plataforma existente |
| ESP32 + OPT101 + ADS1115 | Treinamento fotométrico separado | Projeto existente; não Raman |

**Segurança:** nunca apontar laser para boca, olhos, pele ou pessoas. Lasers em 1064 nm são invisíveis ao olho e podem causar lesões sem aviso visual. Não montar, energizar nem alinhar um instrumento desse tipo sem profissional especializado, invólucro adequado e procedimentos de segurança aprovados. A caixa antiga de LED não foi certificada para laser.

## 3. Como fazer: etapas concretas

1. **Estudo:** ler Furuse (2006), entender CEC, FT-Raman, bandas espectrais, PCA e as limitações de estudos ex vivo. Registrar hipóteses, problema e referências.
2. **Escopo:** escolher, com orientadores, se serão usados dados sintéticos para ensino ou espectros reais de equipamento Raman profissional. Identificar o laboratório parceiro antes de prometer montagem própria.
3. **Ética:** submeter o plano humano ao comitê competente quando aplicável; garantir permissões, consentimento, sigilo, rastreabilidade e adequação à LGPD. Não acessar amostras ou dados pessoais de pacientes sem autorização institucional.
4. **Calibração:** operador habilitado verifica deslocamento Raman, resolução, fundo escuro, potência e referência de desempenho; registrar parâmetros no caderno de laboratório.
5. **Medição:** adquirir espectros ex vivo somente sob protocolo aprovado; preservar o bruto e documentar preparo, equipamento, laser, integração, acumulações e qualidade.
6. **Organização:** cada pessoa deve ter código pseudônimo. Replicatas compartilham código de pessoa e têm códigos diferentes de espectro.
7. **Exportação:** o software do Raman gera dados intensidade × deslocamento em cm⁻¹. Converter para CSV de cinco colunas (abaixo). Não converter sinal de fotodiodo OPT101 em "Raman".
8. **PWA:** importar em Raman para câncer bucal, examinar gráficos, avaliar cada participante independentemente, exportar JSON e documentar limitações.
9. **Relatório:** comparar espectros e matriz de confusão; esclarecer origem dos dados, ausência de validação externa, possíveis vieses e necessidade de confirmação histopatológica.
10. **Apresentação:** organizar entregas de Informática, Eletrônica, Análises Clínicas e Administração; redigir monografia e artigo INIC com o modelo original.

## 4. CSV para importar na PWA

Arquivo em formato longo com cabeçalho obrigatório:

    patient_code,sample_code,reference,shift_cm-1,intensity
    P001,P001-R1,normal,800,34.2
    P001,P001-R1,normal,805,35.1
    P002,P002-R1,cec,800,31.3

Essas linhas ilustram o formato, **não** são dados clínicos nem um arquivo completo. O site disponibiliza um CSV sintético com todos os pontos e participantes para teste.

**Regras do importador:** uma linha por deslocamento de um espectro; no mínimo 60 e no máximo 10.000 pontos por espectro; janela incluindo 800–1800 cm⁻¹; intensidade numérica; códigos de 3–32 caracteres (letras, números, hífen, sublinhado). Rótulos exatamente **normal** ou **cec**, definidos pela referência histopatológica da pesquisa. O site não verifica se um rótulo corresponde ao laudo. São exigidos 5 participantes independentes em cada classe para **habilitar o exercício estatístico**, não para validar o desempenho clínico. Separação de colunas com vírgula ou ponto e vírgula; decimais com vírgula somente quando colunas usam ponto e vírgula.

**Privacidade:** não colocar nomes, CPF, prontuários, datas de nascimento nem outras informações identificadoras. O módulo processa o arquivo no navegador e não o salva automaticamente em nuvem.

## 5. Métodos implementados (limites transparentes)

- **Pré-processamento:** interpolação na grade de 800 a 1800 cm⁻¹, passo de 5 cm⁻¹; subtração de uma reta de fundo e retenção de valores positivos; normalização por soma de intensidades. É um método didático, não um pipeline validado para CEC.
- **Recursos:** quatro regiões do gráfico (980–1030, 1200–1300, 1400–1500 e 1600–1710 cm⁻¹), usadas como integrais relativas didáticas. Não são biomarcadores aprovados de câncer.
- **Unidade estatística:** cada paciente contribui uma vez; replicatas do mesmo paciente são agregadas para gráficos e análise.
- **PCA:** projeção descritiva de quatro recursos, não reconstrução da PCA sobre espectros completos feita na tese.
- **Classificação exploratória:** centroide mais próximo com padronização treinada em cada rodada; validação leave-one-patient-out (LOPO). O paciente testado e todas as suas replicatas ficam fora do treinamento. Exibe matriz, sensibilidade e especificidade internas.
- **Dados sintéticos:** gaussianas com diferenças deliberadas; as métricas desses dados são matemáticas, não estimativas clínicas.
- **Dados reais:** sem validação externa, coorte representativa, controle de calibração e revisão por profissionais, os resultados não permitem decidir sobre uma pessoa.

A pesquisa futura pode avaliar modelos completos (PCA-LDA, PLS-DA, SVM) em Python com divisão por pessoa, validação externa, intervalos de confiança e instrumentação padronizada. **Nenhuma dessas etapas futuras deve ser declarada concluída.**

## 6. Programas e equipes

| Curso | Atividade | Software |
| --- | --- | --- |
| Informática | PWA, importação CSV, análise, gráficos, controle de versão | Navegador, Git, Python, pandas, NumPy, scikit-learn, Jupyter |
| Eletrônica | Bancada introdutória, instrumentação óptica supervisionada, calibração | Arduino IDE/PlatformIO e software oficial do espectrômetro |
| Análises Clínicas | CEC, referência histopatológica, ética, amostragem e QC | Ferramentas institucionais e registros de laboratório |
| Administração | Fornecedores, orçamento de instrumentação, viabilidade e plano da empresa | LibreOffice Calc/Writer e módulo Administração |
| Todos | Cronograma, monografia e artigo INIC | Editores integrados à plataforma |

Links: https://www.python.org/ • https://scikit-learn.org/ • https://jupyter.org/ • https://www.arduino.cc/en/software • https://www.libreoffice.org/

## 7. Documentação e fontes

- [Tese de Furuse 2006](./Furuse_2006_FT_Raman_Mucosa.pdf).
- Revisão científica de 2024: https://pmc.ncbi.nlm.nih.gov/articles/PMC11488342/
- Metanálise 2026, Purohit et al.: https://doi.org/10.1007/s42452-026-08860-2
- [Manual da monografia Univap](./Manual_Monografia_UNIVAP.pdf).
- [Modelo INIC 2025](./Modelo_INIC_2025_Limpo.docx) (confirmar versão vigente).
- [Projeto de laser de fotometria, não Raman](./Projeto_Laser.md).

**Status:** interface, simulação e ingestão CSV prontas para uso educacional; aquisição Raman própria, dados reais de CEC, laboratório parceiro, autorizações e validação clínica **não foram realizados/confirmados pela plataforma**.
