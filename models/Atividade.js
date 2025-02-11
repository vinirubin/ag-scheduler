class Atividade {
    constructor(
      id,
      nome,
      cargaHoraria,
      professores,
      turmas,
      recursos,
      geminar,
      separar,
      idsPeriodoSemanalRestricao,
      cor
    ) {
      this.id = id;
      this.nome = nome;
      this.cargaHoraria = cargaHoraria;
      this.professores = professores;
      this.turmas = turmas;
      this.recursos = recursos;
      this.geminar = geminar;
      this.separar = separar;
      this.idsPeriodoSemanalRestricao = idsPeriodoSemanalRestricao;
      this.cor = cor;
    }
}

module.exports = Atividade;