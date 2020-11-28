let aluno = require('./aluno.js')
this.arrayAlunos = []
let array = [
    {
        "id" : 1,
        "name" : "Julio Sousa",
        "address" : "Rua Dom Joao",
        "score" : 20,
    },
    {
        "id" : 2,
        "name" : "Gonçalo Fernandes",
        "address" : "Rua Dom Patricio",
        "score" : 15,
    },
    {
        "id" : 3,
        "name" : "Joao Rosado",
        "address" : "Rua Dom Pepino",
        "score" : 17,
    },
    {
        "id" : 4,
        "name" : "David Martins",
        "address" : "Rua Dom Popular",
        "score" : 12,
    },
    {
        "id" : 5,
        "name" : "Tiago Batista",
        "address" : "Rua Dom Pelotudo",
        "score" : 10,
    },
]

let criar = (arrayStudents) => {
    for (const student of arrayStudents) {
        this.arrayAlunos.push(aluno.criarAluno(student.id,student.name,student.address,student.score))
    }
}
criar(array)
console.log(aluno.mediaAlunos(this.arrayAlunos))