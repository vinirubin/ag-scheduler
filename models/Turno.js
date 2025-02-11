class Turno {
    constructor(id, nome, periodos = []) {
        this.id = id;
        this.nome = nome;
        this.periodos = periodos;
    }    
}

module.exports = Turno;

