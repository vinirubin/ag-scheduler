class Individuo {
    constructor(aulas, periodosDisponiveis) {
        this.genes = periodosDisponiveis.map(periodo => ({ ...periodo, aulas: [] }));
        
        this.aptidao = 0;

        aulas.forEach(aula => {
            const indiceAleatorio = Math.floor(Math.random() * this.genes.length);
            this.genes[indiceAleatorio].aulas.push(aula);
        });

        this.calculaAptidao();
    }

    calculaAptidao() {
        this.aptidao = 0; // Reinicia a aptidão do indivíduo
    
        this.genes.forEach(geneAtual => {
            let aptidaoNoGene = 0;
    
            // Inicializa conjuntos para verificar conflitos
            const turmasVistas = new Set();
            const professoresVistos = new Set();
            const recursosVistos = new Set();
    
            // Encontra o gene adjacente para verificar geminação
            const geneProximo = this.genes.find(gene => 
                gene.diaSemana === geneAtual.diaSemana && 
                gene.turno === geneAtual.turno && 
                gene.periodo === geneAtual.periodo + 1
            );

            const geneAnterior = this.genes.find(gene => 
                gene.diaSemana === geneAtual.diaSemana && 
                gene.turno === geneAtual.turno && 
                gene.periodo === geneAtual.periodo - 1
            );
    
            geneAtual.aulas.forEach(aula => {
                // Verifica conflitos de professores
                aula.atividade.professores.forEach(professor => {
                    if (professoresVistos.has(professor)) {
                        aptidaoNoGene += 10; // Penalidade por conflito
                    } else {
                        professoresVistos.add(professor);
                    }
                });
    
                // Verifica conflitos de turmas
                aula.atividade.turmas.forEach(turma => {
                    if (turmasVistas.has(turma)) {
                        aptidaoNoGene += 10; // Penalidade por conflito
                    } else {
                        turmasVistas.add(turma);
                    }
                });
    
                // Verifica conflitos de recursos
                aula.atividade.recursos.forEach(recurso => {
                    if (recursosVistos.has(recurso)) {
                        aptidaoNoGene += 10; // Penalidade por conflito
                    } else {
                        recursosVistos.add(recurso);
                    }
                });
    
                // Verifica se a atividade precisa ser geminada
                if (aula.atividade.geminar && geneProximo) {
                    const atividadeGeminadaExiste = geneProximo.aulas.some(aulaProxima => 
                        aula.atividade.id === aulaProxima.atividade.id
                    );
    
                    if (!atividadeGeminadaExiste) {
                        aptidaoNoGene += 1; // Penalidade por não geminar
                    }
                }

                if (aula.atividade.geminar && geneAnterior) {
                    const atividadeGeminadaExiste = geneAnterior.aulas.some(aulaProxima => 
                        aula.atividade.id === aulaProxima.atividade.id
                    );
    
                    if (!atividadeGeminadaExiste) {
                        aptidaoNoGene += 1; // Penalidade por não geminar
                    }
                }

                // Verifica restrições de períodos semanais
                aula.atividade.idsPeriodoSemanalRestricao?.forEach(idRestrito => {
                    if (idRestrito === geneAtual.id) {
                        aptidaoNoGene += 100; // Penalidade por conflito de período
                    }
                });
            });
    
            // Atualiza a aptidão do gene atual e do indivíduo
            geneAtual.aptidao = aptidaoNoGene;
            this.aptidao += aptidaoNoGene;
        });
    }    
    
    sofreMutacao(taxaMutacao) {    
        this.genes.forEach(gene => {
            const aulasParaMutar = [...gene.aulas];
            
            aulasParaMutar.forEach((aula, indexAula) => {
                if (Math.random() < taxaMutacao) {
                    // Remove a aula
                    const aulaSelecionada = gene.aulas.splice(indexAula, 1)[0];
                    if (!aulaSelecionada) return;
    
                    // Encontre genes válidos
                    const genesValidos = this.genes.filter(g =>
                        !g.aulas.some(a => a.atividade === aulaSelecionada.atividade)
                    );
    
                    // Reinsere em um gene válido
                    if (genesValidos.length > 0) {
                        const novoGene = genesValidos[Math.floor(Math.random() * genesValidos.length)];
                        novoGene.aulas.push(aulaSelecionada);
                    } else {
                        gene.aulas.push(aulaSelecionada); // Volta ao original, se necessário
                    }
                }
            });
        });
    
        this.calculaAptidao();
    }
    
    clone() {
        // Cria uma cópia profunda de `Individuo`
        const copia = new Individuo([], []);
        copia.genes = this.genes.map(gene => ({
            ...gene,
            aulas: gene.aulas.map(aula => ({ ...aula })) // Cópia profunda das aulas
        }));
        copia.aptidao = this.aptidao;
        return copia;
    }
}

module.exports = Individuo;