const { Router } = require("express");
const rutasCarritos = Router();
const {
  addCarrito,
  deleteCarrito,
  getProductosCarrito,
  addProductoCarrito,
  deleteProductoCarrito,
} = require("../controllers/carritosController");

rutasCarritos.post("/", addCarrito);
rutasCarritos.delete("/:id", deleteCarrito);
rutasCarritos.get("/:id/productos", getProductosCarrito);
rutasCarritos.post("/:id/productos", addProductoCarrito);
rutasCarritos.delete("/:id/productos/:id_prod", deleteProductoCarrito);

module.exports = rutasCarritos;

