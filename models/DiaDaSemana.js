class DiaDaSemana {
    constructor(id, nome, turnos = []) {
        this.id = id;
        this.nome = nome;
        this.turnos = turnos;
    }
}

module.exports = DiaDaSemana;