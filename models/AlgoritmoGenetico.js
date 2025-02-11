const Recurso = require('./Recurso.js');
const Periodo = require('./Periodo.js');
const Turma = require('./Turma.js');
const Professor = require('./Professor.js');
const DiaDaSemana = require('./DiaDaSemana.js');
const Aula = require('./Aula.js');
const Turno = require('./Turno.js');
const Atividade = require('./Atividade.js');
const PeriodoSemanal = require('./PeriodoSemanal.js');
const fs = require('fs');
const path = require('path');
const Individuo = require('./Individuo.js');

class AlgoritmoGenetico {

    async carregaDadosDeUmArquivo(caminhoDadosTeste) {
        try {
          const conteudo = fs.readFileSync(caminhoDadosTeste, 'utf-8');
          const dados = JSON.parse(conteudo);
          this.setDados(dados);
        } catch (erro) {
          console.error("Erro ao carregar o arquivo JSON:", erro.message);
        }
    }

    async setDados(dados) {
        this.turmas = dados.turmas.map(turma => new Turma(turma.id, turma.nome));
        this.professores = dados.professores.map(professor => new Professor(professor.id, professor.nome));
        this.diasDaSemana = dados.diasDaSemana.map(dia => new DiaDaSemana(dia.id, dia.nome, dia.turnos));
        this.turnos = dados.turnos.map(turno => new Turno(turno.id, turno.nome, turno.periodos));
        this.atividades = dados.atividades.map(atividade => new Atividade(atividade.id, atividade.nome, atividade.cargaHoraria, atividade.professores, atividade.turmas, atividade.recursos, atividade.geminar, atividade.separar, atividade.idsPeriodoSemanalRestricao, atividade.cor));
        this.periodosSemanais = dados.periodosSemanais.map(periodoSemanal => new PeriodoSemanal(periodoSemanal.id, periodoSemanal.idDiaDaSemana, periodoSemanal.idTurno, periodoSemanal.idPeriodo));
        this.periodos = dados.periodos.map(periodo => new Periodo(periodo.id, periodo.horarioInicio, periodo.horarioFim, periodo.idTurno));
        this.recursos = dados.recursos.map(recurso => new Recurso(recurso.id, recurso.nome));
    }

    async inicializar() {
        try {
            this.aulas = [];
            
            this.tamanhoPopulacao = 200;
            this.quantidadeDeGeracoes = 1000;
            this.taxaMutacao = 0.01;
            this.MelhorIndividuoGeral = null;
            this.MelhorIndividuoGeracao = null;
            this.populacao = [];
            let idsequencial = 1;

            this.atividades.forEach(atividade => {
                for (let i = 0; i < atividade.cargaHoraria; i++) {
                    this.aulas.push(new Aula(idsequencial++, atividade));
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar o AG:', error);
            throw error;
        }
    }

    copiaGene(gene) {
        return {
            ...gene,
            aulas: gene.aulas.map((aula) => ({ ...aula })),
        };
    }

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
    
        // Atualiza o melhor indivíduo geral se necessário
        this.MelhorIndividuoGeral = this.populacao.reduce((melhor, individuo) => 
            (individuo.aptidao < melhor.aptidao ? individuo : melhor), this.populacao[0]
        );
    
        // Opcional: verifique se há um indivíduo melhor e atualize-o
        if (this.MelhorIndividuoGeracao.aptidao < this.MelhorIndividuoGeral.aptidao) {
            this.MelhorIndividuoGeral = this.MelhorIndividuoGeracao.clone();
        }
    }    

    async rodaAG() {
        await this.inicializar();
        
        this.populacao = Array.from(
            { length: this.tamanhoPopulacao },
            () => new Individuo(this.aulas, this.periodosSemanais)
        );

        // Inicializa `MelhorIndividuoGeral` com uma cópia do primeiro indivíduo
        this.MelhorIndividuoGeral = this.populacao[0].clone();

        for (let geracao = 0; geracao < this.quantidadeDeGeracoes; geracao++) {
            this.populacao.forEach(individuo => individuo.calculaAptidao());

            // Encontra o melhor indivíduo da geração atual
            this.MelhorIndividuoGeracao = this.populacao.reduce((melhor, individuo) =>
                (individuo.aptidao < melhor.aptidao ? individuo : melhor), this.populacao[0]
            );

            // Atualiza `MelhorIndividuoGeral` se a aptidão da geração for melhor
            if (this.MelhorIndividuoGeracao.aptidao < this.MelhorIndividuoGeral.aptidao) {
                this.MelhorIndividuoGeral = this.MelhorIndividuoGeracao.clone();
            }

            this.EvoluiPopulacao();

            console.log("Geracao: ", geracao + 1 , "; atual: ", this.MelhorIndividuoGeracao.aptidao, "; melhor: ", this.MelhorIndividuoGeral.aptidao);

            if (this.MelhorIndividuoGeral.aptidao === 0) {
                console.log("Solução perfeita encontrada");
                break;
            }
        }

        this.salvaHTML(this.MelhorIndividuoGeral, '../output/MelhorSolucao.html');
    }

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
    
                    // let color = 'rgba(0, 0, 255, 0.75)';
    
                    let color = 'rgba(0, 0, 0, 0)';
    
                    if (geneAtual) {
                        if (geneAtual.aptidao > 5) {
                            color = 'rgba(255, 0, 0, 0.55)';
                        }     
                    }
                    
                    html += `<td style="background-color: ${color}">`;
    
                    if (geneAtual) {
                        // html += `<div> Aptidao do Periodo Semanal: ${geneAtual.aptidao} </div>`;
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