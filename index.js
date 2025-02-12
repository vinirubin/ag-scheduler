const AlgoritmoGenetico = require('./models/AlgoritmoGenetico');

async function executarAlgoritmoGenetico() {
    let Ag = new AlgoritmoGenetico();
    Ag.carregaDadosDeUmArquivo('input/dados.json');
    Ag.rodaAG();
}

executarAlgoritmoGenetico();