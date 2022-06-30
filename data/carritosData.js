const { ContenedorCarritos } = require("../classes/contenedorCarritos");

const carritos = new ContenedorCarritos(__dirname + "/carritos.txt");

module.exports = { carritos };
