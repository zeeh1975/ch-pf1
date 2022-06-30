const { Contenedor } = require("./contenedor");

// Formato de carrito esperado
// [
// 	{
// 		"id": 1234,
// 		"timestamp": "17/6/2022, 15:15:40",
// 		"productos": [...Lista de productos]
// 	}, ...
// ]

// Clase contenedora de carritos
class ContenedorCarritos extends Contenedor {
  constructor(nombreArchivoContenedor) {
    super(nombreArchivoContenedor);
  }
  // valida y agrega un nuevo mensaje
  // retorna el id del nuevo mensaje
  save() {
    let nuevoCarrito = {};
    nuevoCarrito.timestamp = Date.now();
    nuevoCarrito.productos = [];
    return super.save(nuevoCarrito);
  }
}

module.exports = { ContenedorCarritos };
