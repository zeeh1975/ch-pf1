const { ContenedorProductos } = require("../classes/contenedorProductos");

const productos = new ContenedorProductos(__dirname + "/productos.txt");

module.exports = { productos };
