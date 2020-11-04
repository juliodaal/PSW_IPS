const PI = 3.14159;

const area = (raio) => {
    return PI * raio * raio
}
const perimetro = (raio) => {
    return PI * 2 * raio
}

console.log("<--- No modulo circulo.js")

module.exports.area = area
module.exports.perimetro = perimetro