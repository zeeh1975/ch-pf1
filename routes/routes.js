const { Router } = require("express");
const rutasProductos = require("./productosRoutes");
const rutasCarritos = require("./carritosRoutes");

const rutas = Router();

rutas.use("/productos", rutasProductos);
rutas.use("/carrito", rutasCarritos);

module.exports = rutas;
