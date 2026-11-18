# OdontoRaman — campos da coleta

Use apenas códigos do projeto e arquivos autorizados. O aplicativo é um caderno educacional local, não um prontuário. Não inserir nome, CPF, contato, prontuário, foto ou dado que identifique uma pessoa. Dados institucionais que permitam reidentificação ficam sob guarda do laboratório responsável, fora do site e do GitHub.

| Campo | Como preencher | Exemplo didático |
|---|---|---|
| Código do espécime | Código estável, com letras, números, hífen ou sublinhado. Réplicas do mesmo espécime mantêm este código. | DEMO-001 |
| Ponto | Região/posição definida no protocolo da equipe. Não é classificação clínica. | P01 |
| Réplica | Identificador da repetição, sem contar como novo espécime. | R01 |
| Equipe | Identificação do grupo; não precisa conter nomes. | Equipe 1 |
| Data e hora | Momento da sessão na hora local do aparelho. O backup armazena ISO 8601 com referência UTC. | Preencher ao executar |
| Origem | Ficha de demonstração, espectro sintético, CSV autorizado de laboratório ou eventos LED. | Espectro sintético |
| Equipamento | Modelo ou origem técnica informada pelo responsável. | Gerador matemático OdontoRaman |
| Laser | Comprimento de onda de excitação em nm; desconhecido fica em branco. Não é o eixo Raman. | Em branco no exemplo sintético |
| Potência | Potência na amostra, em mW, quando o operador informou. Não copiar potência nominal sem registrar a condição. | Em branco se desconhecida |
| Integração | Tempo por acumulação em segundos. Confirmar como o equipamento define este parâmetro. | Em branco se desconhecido |
| Acumulações | Quantidade de acumulações da aquisição; não é número de amostras. | Em branco se desconhecida |
| Observações | Condições da sessão, problema, correção e referência do protocolo. Sem dados pessoais. | Teste de importação do exemplo A |

## Arquivos e preservação

- **CSV de espectro:** duas colunas `shift_cm-1,intensity`, com 20 a 20.000 pontos e até 2 MB. Separadores aceitos: vírgula, ponto e vírgula ou tabulação. Com ponto e vírgula, aceita vírgula decimal. Comentários começam com `#`.
- **Eixo horizontal:** deslocamento Raman em cm⁻¹. Uma tabela de comprimentos de onda em nm precisa ser convertida e validada fora do importador; não basta renomear a coluna.
- **Texto bruto:** fica preservado no registro e no backup. Na análise, o parser ordena o eixo e agrega deslocamentos repetidos pela média, informando a contagem. Não muda o arquivo original armazenado.
- **Eventos LED:** JSON exportado pelo monitor USB, com `spectrometer:false` e até 1.000 eventos válidos. Não contém Raman, intensidade espectral ou diagnóstico.
- **JSON de backup:** inclui fichas, arquivos CSV brutos e eventos. É a forma de continuar em outro aparelho. Limite local: 300 registros e 24 MB; importador de backup aceita arquivo de até 25 MB.
- **CSV de fichas:** somente os metadados. Não substitui o backup dos arquivos brutos. Use UTF-8 e separador ponto e vírgula no Calc/Excel.
- **Conflito de ID:** importar um backup não sobrescreve um registro diferente que já tenha o mesmo ID. A aplicação informa o conflito; preserve o arquivo de origem para comparação.
- **Correção:** salve uma nova ficha com o ID anterior nas observações. O registro original permanece como evidência.

## Fluxo entre os cursos

1. Análises Clínicas define os códigos e confere a correspondência entre ficha e arquivo.
2. Eletrônica testa o circuito e salva os eventos LED do ensaio.
3. Informática verifica importação, preservação do bruto, análise e recuperação do backup.
4. O grupo exporta ao fim da sessão e guarda a cópia em local aprovado pela escola.

Instalar a PWA não ativa transmissão Wi-Fi/Bluetooth nem sincronização. O conteúdo principal pode ser usado offline após preparação no próprio aparelho; documentos maiores precisam ser acessados antes. O sistema não foi validado para armazenamento clínico identificável.
