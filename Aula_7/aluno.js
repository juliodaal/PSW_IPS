function Aluno(_id, _name, _address, _score) {
    this.id = _id
    this.name = _name
    this.address = _address
    this.score = _score
}

let criarAluno = (_id, _name, _address, _score) => {
   return new Aluno(_id, _name, _address, _score)
}

let mediaAlunos = (arrayAlunos) => {
    let acum = 0;
    for (const aluno of arrayAlunos) {
        acum += aluno.score
    }
    return acum / Array.from(arrayAlunos).length
}

module.exports.criarAluno = criarAluno;
module.exports.mediaAlunos = mediaAlunos;
