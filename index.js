const AlgoritmoGenetico = require('./models/AlgoritmoGenetico');

async function executarAlgoritmoGenetico() {
    let Ag = new AlgoritmoGenetico();
    await Ag.carregaDadosDeUmArquivo('input/dados.json');
    await Ag.rodaAG();
}

executarAlgoritmoGenetico();