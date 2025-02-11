class PeriodoSemanal {
    constructor(id, diaSemana, turno, periodo) {
        this.id = id;
        this.diaSemana = diaSemana;
        this.turno = turno;
        this.periodo = periodo;
        this.aulas = [];
        this.aptidao = 0;
    }
}

module.exports = PeriodoSemanal;