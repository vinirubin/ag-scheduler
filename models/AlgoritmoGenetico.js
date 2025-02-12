// Importação das classes necessárias de arquivos locais
const Recurso = require('./Recurso.js');
const Periodo = require('./Periodo.js');
const Turma = require('./Turma.js');
const Professor = require('./Professor.js');
const DiaDaSemana = require('./DiaDaSemana.js');
const Aula = require('./Aula.js');
const Turno = require('./Turno.js');
const Atividade = require('./Atividade.js');
const PeriodoSemanal = require('./PeriodoSemanal.js');

// Importação de módulos nativos do Node.js
const fs = require('fs'); // Módulo para manipulação do sistema de arquivos
const path = require('path'); // Módulo para manipulação de caminhos de arquivos

// Importação da classe Individuo de um arquivo local
const Individuo = require('./Individuo.js');


class AlgoritmoGenetico {

    /**
     * Construtor da classe `AlgoritmoGenetico`.
     * 
     * Inicializa as propriedades necessárias para o funcionamento do algoritmo genético,
     * incluindo listas de turmas, professores, dias da semana, turnos, atividades, períodos semanais,
     * períodos, recursos e aulas. Além disso, define parâmetros como o tamanho da população,
     * a quantidade de gerações e a taxa de mutação, além de inicializar variáveis para armazenar
     * o melhor indivíduo geral, o melhor indivíduo da geração atual e a população inicial.
     * 
     * @constructor
     */ 
    constructor() {
        this.turmas = []; // {Array} Lista de turmas disponíveis.
        this.professores = []; // {Array} Lista de professores disponíveis.
        this.diasDaSemana = []; // {Array} Lista de dias da semana.
        this.turnos = []; // {Array} Lista de turnos disponíveis.
        this.atividades = []; // {Array} Lista de atividades a serem alocadas.
        this.periodosSemanais = []; // {Array} Lista de períodos semanais disponíveis.
        this.periodos = []; // {Array} Lista de períodos disponíveis.
        this.recursos = []; // {Array} Lista de recursos disponíveis.
        this.aulas = []; // {Array} Lista de aulas a serem alocadas.
        this.tamanhoPopulacao = 100; // {number} Tamanho da população inicial.
        this.quantidadeDeGeracoes = 10000; // {number} Quantidade de gerações a serem evoluídas.
        this.taxaMutacao = 0.01; // {number} Taxa de mutação aplicada durante a evolução.
        this.MelhorIndividuoGeral = null; // {Object|null} Melhor indivíduo encontrado ao longo de todas as gerações.
        this.MelhorIndividuoGeracao = null; // {Object|null} Melhor indivíduo encontrado na geração atual.
        this.populacao = []; // {Array} População inicial de indivíduos.
    }

    /**
     * Carrega os dados de entrada a partir de um arquivo JSON.
     * 
     * Esta função lê o conteúdo de um arquivo JSON localizado no caminho especificado,
     * analisa o conteúdo e armazena os dados resultantes utilizando o método `setDados`.
     * 
     * @param {string} caminhoDadosTeste - O caminho para o arquivo JSON a ser lido.
     * 
     * @throws {Error} Lança um erro se ocorrer uma falha ao ler ou analisar o arquivo JSON.
     */
    carregaDadosDeUmArquivo(caminhoDadosTeste) {
        try {
            const conteudo = fs.readFileSync(caminhoDadosTeste, 'utf-8');
            const dados = JSON.parse(conteudo);
            this.setDados(dados);
        } catch (erro) {
            console.error("Erro ao carregar o arquivo JSON:", erro.message);
            throw new Error(`Falha ao carregar os dados do arquivo: ${erro.message}`);
        }
    }

    /**
     * Define os dados da classe a partir de um objeto fornecido.
     * 
     * Esta função recebe um objeto `dados` e preenche as propriedades da classe com instâncias
     * de objetos correspondentes às entidades como turmas, professores, dias da semana, turnos, 
     * atividades, períodos semanais, períodos e recursos. Cada item nas listas de dados é mapeado
     * para a criação de uma nova instância da respectiva classe.
     * 
     * @param {Object} dados - Objeto contendo os dados a serem carregados. Deve possuir as seguintes propriedades:
     * @param {Array} dados.turmas - Lista de objetos representando as turmas, cada um com `id` e `nome`.
     * @param {Array} dados.professores - Lista de objetos representando os professores, cada um com `id` e `nome`.
     * @param {Array} dados.diasDaSemana - Lista de objetos representando os dias da semana, cada um com `id`, `nome` e `turnos`.
     * @param {Array} dados.turnos - Lista de objetos representando os turnos, cada um com `id`, `nome` e `periodos`.
     * @param {Array} dados.atividades - Lista de objetos representando as atividades, cada uma com diversas propriedades, como `id`, `nome`, `cargaHoraria`, `professores`, `turmas`, `recursos`, etc.
     * @param {Array} dados.periodosSemanais - Lista de objetos representando os períodos semanais, cada um com `id`, `idDiaDaSemana`, `idTurno` e `idPeriodo`.
     * @param {Array} dados.periodos - Lista de objetos representando os períodos, cada um com `id`, `horarioInicio`, `horarioFim` e `idTurno`.
     * @param {Array} dados.recursos - Lista de objetos representando os recursos, cada um com `id` e `nome`.
     * 
     * @throws {Error} Lança um erro se qualquer uma das propriedades obrigatórias no objeto `dados` estiver ausente ou estiver em formato incorreto.
     */
    setDados(dados) {
        this.turmas = dados.turmas.map(turma => new Turma(turma.id, turma.nome));
        this.professores = dados.professores.map(professor => new Professor(professor.id, professor.nome));
        this.diasDaSemana = dados.diasDaSemana.map(dia => new DiaDaSemana(dia.id, dia.nome, dia.turnos));
        this.turnos = dados.turnos.map(turno => new Turno(turno.id, turno.nome, turno.periodos));
        this.atividades = dados.atividades.map(atividade => new Atividade(atividade.id, atividade.nome, atividade.cargaHoraria, atividade.professores, atividade.turmas, atividade.recursos, atividade.geminar, atividade.separar, atividade.idsPeriodoSemanalRestricao, atividade.cor));
        this.periodosSemanais = dados.periodosSemanais.map(periodoSemanal => new PeriodoSemanal(periodoSemanal.id, periodoSemanal.idDiaDaSemana, periodoSemanal.idTurno, periodoSemanal.idPeriodo));
        this.periodos = dados.periodos.map(periodo => new Periodo(periodo.id, periodo.horarioInicio, periodo.horarioFim, periodo.idTurno));
        this.recursos = dados.recursos.map(recurso => new Recurso(recurso.id, recurso.nome));
    }

    /**
     * Inicializa a lista de aulas a partir das atividades definidas.
     * 
     * Esta função percorre a lista de atividades e, para cada atividade, cria uma instância de `Aula`
     * para cada unidade de carga horária definida. As aulas são armazenadas na propriedade `aulas`.
     * 
     * @throws {Error} Lança um erro se ocorrer uma falha ao inicializar as aulas.
     */
    inicializar() {
        try {
            this.aulas = [];
            let idSequencial = 1;

            this.atividades.forEach(atividade => {
                for (let i = 0; i < atividade.cargaHoraria; i++) {
                    this.aulas.push(new Aula(idSequencial++, atividade));
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar o AG:', error);
            throw error;
        }
    }

    /**
     * Cria uma cópia superficial de um objeto `gene`, incluindo uma cópia independente da propriedade `aulas`.
     * 
     * Esta função recebe um objeto `gene` e retorna um novo objeto com as mesmas propriedades do original.
     * A propriedade `aulas` é copiada de forma independente, garantindo que alterações na cópia não afetem o original.
     * 
     * @param {Object} gene - O objeto a ser copiado. Deve possuir a propriedade `aulas`, que é um array de objetos.
     * 
     * @returns {Object} Uma nova instância de `gene` com a propriedade `aulas` copiada de forma independente.
     */
    copiaGene(gene) {
        return {
            ...gene,
            aulas: gene.aulas.map((aula) => ({ ...aula })),
        };
    }

    /**
     * Realiza o operador de crossover baseado em ciclos alternados entre dois indivíduos pais.
     * 
     * Este método combina os genes dos pais para gerar dois novos indivíduos filhos. A herança dos genes é alternada entre os pais,
     * promovendo a diversidade genética na população. O processo é realizado da seguinte forma:
     * 
     * 1. Para cada gene na posição `i`:
     *    - Se o gene não foi previamente alternado:
     *      - Inicia-se um ciclo de herança alternada.
     *      - A partir da posição `i`, alterna-se a herança dos genes entre os pais até retornar à posição inicial ou encontrar um ciclo fechado.
     * 
     * 2. Os genes alternados formam os cromossomos dos filhos.
     * 
     * @param {Individuo} pai - O indivíduo pai que contribui com metade dos genes para os filhos.
     * @param {Individuo} mae - O indivíduo mãe que contribui com a outra metade dos genes para os filhos.
     * 
     * @returns {Individuo[]} Um array contendo dois novos indivíduos filhos gerados pelo crossover.
     * 
     * @throws {Error} Lança um erro se ocorrer uma falha durante o processo de crossover.
     */
    Cruzamento(pai, mae) {
        const tamanho = pai.genes.length;
        const filho1Genes = [];
        const filho2Genes = [];
        const cicloAlternado = new Array(tamanho).fill(false); // Alterna a herança

        for (let i = 0; i < tamanho; i++) {
            if (!cicloAlternado[i]) {
                // Marca início do ciclo
                let posicao = i;
                let alternar = false;

                do {
                    cicloAlternado[posicao] = true;

                    if (alternar) {
                        filho1Genes[posicao] = this.copiaGene(mae.genes[posicao]);
                        filho2Genes[posicao] = this.copiaGene(pai.genes[posicao]);
                    } else {
                        filho1Genes[posicao] = this.copiaGene(pai.genes[posicao]);
                        filho2Genes[posicao] = this.copiaGene(mae.genes[posicao]);
                    }

                    alternar = !alternar;

                    // Busca próxima posição
                    posicao = pai.genes.findIndex(
                        (gene) =>
                            gene.periodo === mae.genes[posicao].periodo &&
                            gene.diaSemana === mae.genes[posicao].diaSemana
                    );
                } while (posicao !== i && posicao !== -1);
            }
        }

        // Cria os novos indivíduos com os genes gerados
        const filho1 = new Individuo([], []);
        filho1.genes = filho1Genes;
        filho1.calculaAptidao();

        const filho2 = new Individuo([], []);
        filho2.genes = filho2Genes;
        filho2.calculaAptidao();

        return [filho1, filho2];
    }

    /**
     * Realiza a seleção por torneio para escolher um indivíduo da população.
     * 
     * Este método seleciona aleatoriamente um subconjunto de indivíduos da população e escolhe o mais apto entre eles
     * para a próxima geração. A aptidão é medida pela propriedade `aptidao` de cada indivíduo, onde valores menores indicam
     * maior aptidão.
     * 
     * @returns {Individuo} O indivíduo mais apto selecionado para a próxima geração.
     * 
     * @throws {Error} Lança um erro se ocorrer uma falha durante o processo de seleção.
     */
    SelecaoPorTorneio() {
        const tamanhoTorneio = 5;
        const competidores = [];
        
        for (let i = 0; i < tamanhoTorneio; i++) {
            const indiceAleatorio = Math.floor(Math.random() * this.populacao.length);
            competidores.push(this.populacao[indiceAleatorio]);
        }

        return competidores.reduce((melhor, competidor) => 
            (competidor.aptidao < melhor.aptidao ? competidor : melhor), competidores[0]
        );
    }

    /**
     * Evolui a população atual gerando uma nova geração de indivíduos.
     * 
     * Este método realiza o processo de evolução da população em um algoritmo genético, que inclui:
     * 
     * 1. **Preservação do melhor indivíduo**: O melhor indivíduo da geração atual é mantido na nova população (elitismo).
     * 2. **Seleção de pais**: Dois indivíduos são selecionados aleatoriamente da população atual para atuarem como pais.
     * 3. **Cruzamento**: Os pais selecionados sofrem um cruzamento para gerar dois filhos.
     * 4. **Mutação**: Cada filho gerado sofre uma mutação com uma probabilidade definida.
     * 5. **Substituição**: Os filhos gerados substituem os indivíduos menos aptos da população atual, formando a nova geração.
     * 
     * @returns {void}
     * 
     * @throws {Error} Lança um erro se ocorrer uma falha durante o processo de evolução.
     */
    EvoluiPopulacao() {
        const filhos = [];
        const limiteTentativas = 10;

        // Preserva o melhor indivíduo da geração (elitismo)
        filhos.push(this.MelhorIndividuoGeral.clone());

        while (filhos.length < this.tamanhoPopulacao) {
            let selecionado1 = this.SelecaoPorTorneio();
            let selecionado2 = this.SelecaoPorTorneio();
            let tentativas = 0;

            // Garantir que o selecionado1 e selecionado2 não sejam iguais
            while (selecionado1 === selecionado2 && tentativas < limiteTentativas) {
                selecionado2 = this.SelecaoPorTorneio();
                tentativas++;
            }

            // Realiza o cruzamento entre os pais
            const [filho1, filho2] = this.Cruzamento(selecionado1, selecionado2);
            
            // Aplica mutação nos filhos
            filho1.sofreMutacao(this.taxaMutacao);
            filho2.sofreMutacao(this.taxaMutacao);

            // Adiciona os filhos à população
            filhos.push(filho1);
            if (filhos.length < this.tamanhoPopulacao) {
                filhos.push(filho2);
            }
        }

        // Substitui a população antiga pela nova geração (com elitismo)
        this.populacao = filhos;
    }
  
    /**
     * Executa o Algoritmo Genético para a geração de horários escolares.
     * 
     * Este método realiza o ciclo completo de um Algoritmo Genético, que inclui:
     * 
     * 1. **Inicialização**: Criação da população inicial de indivíduos (soluções candidatas).
     * 2. **Avaliação**: Cálculo da aptidão de cada indivíduo na população.
     * 3. **Evolução**: Geração de novas populações através de seleção, cruzamento e mutação.
     * 4. **Convergência**: Monitoramento da evolução para identificar quando uma solução satisfatória é encontrada ou quando o algoritmo deve ser interrompido.
     * 5. **Salvamento**: Armazenamento da melhor solução encontrada em um arquivo HTML.
     * 
     * @returns {void}
     * 
     * @throws {Error} Lança um erro se ocorrer uma falha durante o processo de execução do Algoritmo Genético.
     */
    rodaAG() {
        this.inicializar();
        
        this.populacao = Array.from(
            { length: this.tamanhoPopulacao },
            () => new Individuo(this.aulas, this.periodosSemanais)
        );

        this.MelhorIndividuoGeral = this.populacao[0].clone();
        let geracoesSemMelhoria = 0;
        const limiteGeracoesSemMelhoria = 100;

        for (let geracao = 0; geracao < this.quantidadeDeGeracoes; geracao++) {
            this.populacao.forEach(individuo => individuo.calculaAptidao());

            this.MelhorIndividuoGeracao = this.populacao.reduce((melhor, individuo) =>
                (individuo.aptidao < melhor.aptidao ? individuo : melhor), this.populacao[0]
            );

            if (this.MelhorIndividuoGeracao.aptidao < this.MelhorIndividuoGeral.aptidao) {
                this.MelhorIndividuoGeral = this.MelhorIndividuoGeracao.clone();
                geracoesSemMelhoria = 0; // Reset o contador de gerações sem melhoria
            } else {
                geracoesSemMelhoria++; // Incrementa o contador de gerações sem melhoria
            }

            this.EvoluiPopulacao();

            console.log("Geração: ", geracao + 1, "; Atual: ", this.MelhorIndividuoGeracao.aptidao, "; Melhor: ", this.MelhorIndividuoGeral.aptidao);

            if (this.MelhorIndividuoGeral.aptidao === 0) {
                console.log("Solução perfeita encontrada");
                break;
            }

            if (geracoesSemMelhoria >= limiteGeracoesSemMelhoria) {
                console.log(`Nenhuma melhoria nas últimas ${limiteGeracoesSemMelhoria} gerações. Interrompendo o algoritmo.`);
                break;
            }
        }

        this.salvaHTML(this.MelhorIndividuoGeral, '../output/solucao.html');
    }

    /**
     * Gera e salva um arquivo HTML representando a grade de horários de um indivíduo.
     *
     * A função constrói uma página HTML contendo uma tabela que organiza a grade de horários
     * por períodos e dias da semana. Cada célula da tabela exibe as aulas associadas ao
     * respectivo período, incluindo informações como nome da atividade, turmas, professores
     * e recursos. A cor de fundo de cada célula pode variar conforme a aptidão das aulas,
     * facilitando a identificação visual de períodos com maior relevância ou desempenho.
     *
     * A estrutura do HTML inclui:
     * - Um cabeçalho com o título "Grade de Horários" e a aptidão total do indivíduo.
     * - Uma tabela onde a primeira coluna indica o intervalo de horário de cada período,
     *   e as colunas subsequentes representam os dias da semana.
     * - Células preenchidas com os detalhes das aulas, ordenadas e estilizadas conforme as
     *   informações da atividade.
     *
     * @param {Individuo} individuo - Objeto que representa o indivíduo cuja grade de horários será renderizada.
     *        Este objeto deve conter, entre outras propriedades, 'aptidao' e 'genes', que são utilizados
     *        para determinar o conteúdo e a formatação da tabela.
     * @param {String} [filename='grade_de_horarios.html'] - Caminho (absoluto ou relativo) e nome do arquivo
     *        onde o HTML gerado será salvo.
     *
     * @throws {Error} Lança um erro se ocorrer uma falha durante a escrita do arquivo HTML ou em algum
     *                 ponto crítico da execução do Algoritmo Genético.
     *
     * @returns {void} A função não retorna nenhum valor.
     */
    salvaHTML(individuo, filename = 'grade_de_horarios.html') {    
        let html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Grade de Horários</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                    th { background-color: #f2f2f2; }
                    div.aula { padding: 5px; margin-bottom: 5px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Grade de Horários</h1>
                <h2>Aptidão do Individuo: ${individuo.aptidao}</h2>
                <table><thead><tr><th>Horário</th>`;

        Object.values(this.diasDaSemana).forEach(dia => {
            html += `<th>${dia.nome}</th>`;
        });

        html += `</tr></thead><tbody>`;

        this.turnos.forEach(turno => {
            turno.periodos.forEach(idPeriodo => {
                const periodo = this.periodos.find(periodo => periodo.id === idPeriodo);

                html += `<tr><td>${periodo.horarioInicio} - ${periodo.horarioFim}</td>`;

                this.diasDaSemana.forEach(dia => {

                    const geneAtual = individuo.genes.find(gene =>
                        gene.diaSemana == dia.id && gene.turno == turno.id && gene.periodo == idPeriodo && gene.aulas.length > 0
                    );

                    let color = 'rgba(0, 0, 0, 0)';

                    if (geneAtual) {
                        if (geneAtual.aptidao > 5) {
                            color = 'rgba(255, 0, 0, 0.55)';
                        }     
                    }
                    
                    html += `<td style="background-color: ${color}">`;

                    if (geneAtual) {
                        // Exibe informações adicionais sobre a aptidão do período, se necessário
                    };
                    
                    html += `${
                        geneAtual
                        ? geneAtual.aulas
                            .sort((a, b) => a.atividade.turmas[0] - b.atividade.turmas[0])
                            .map(aula => {
                                const turmas = aula.atividade.turmas.map(
                                    idTurma => this.turmas.find(turma => turma.id === idTurma)?.nome || "Turma não encontrada"
                                ).join(", ");

                                const recursos = aula.atividade.recursos.map(
                                    idRecurso => this.recursos.find(recurso => recurso.id === idRecurso)?.nome || "Recurso não encontrado"
                                ).join(", ");

                                const professores = aula.atividade.professores.map(
                                    idProfessor => this.professores.find(professor => professor.id === idProfessor)?.nome || "Professor não encontrado"
                                ).join(", ");

                                return `<div class="aula" style="background-color:  ${aula?.atividade?.cor || '#ffffff'}">
                                            ${aula?.atividade?.nome || 'Atividade não especificada'} <br>
                                            ${turmas || 'Sem turmas'} - 
                                            ${professores || 'Sem professores'} - 
                                            ${recursos || 'Sem recursos'}
                                        </div>`;

                            })
                            .join("")
                        : "-"
                    }</td>`;   
                });
                html += `</tr>`;
            });
            html += `<tr><td style="background-color: Gainsboro">-</td><td colspan="${this.diasDaSemana.length}" style="background-color: Gainsboro">-</td></tr>`;
        });

        html += `</tbody></table></body></html>`;
        
        const filePath = path.join(__dirname, filename);
        fs.writeFileSync(filePath, html, 'utf8');
    };

}

module.exports = AlgoritmoGenetico;