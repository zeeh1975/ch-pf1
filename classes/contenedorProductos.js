const { Contenedor } = require("./contenedor");
const { validUrlRegex } = require("../public/assets/scripts/const");

// Formato de producto esperado
// [
// 	{
//    "id",
//    "timestamp": "17/6/2022, 15:15:40",
//    "nombre": "Nombre del producto",
//    "descripcion": "descripcion del producto",
//    "codigo": "codigo del producto",
//    "foto": "foto del producto (url)",
//    "precio": 123.12, // precio del producto
//    "stock": 1234 // stock disponible del producto
// 	}, ...
// ]

// Clase contenedora de productos
class ContenedorProductos extends Contenedor {
  constructor(nombreArchivoContenedor) {
    super(nombreArchivoContenedor);
  }
  // valida y agrega un nuevo producto
  // retorna el id del nuevo producto
  save(producto) {
    // valido el producto
    let error = this.validaProducto(producto);
    if (error != "") {
      throw new Error(error);
    }
    producto.timestamp = Date.now();
    // eliminar espacios de mas en todos los strings
    producto.nombre = producto.nombre.trim();
    producto.descripcion = producto.descripcion.trim();
    producto.codigo = producto.codigo.trim();
    // forzar numeros
    producto.precio = +producto.precio;
    producto.stock = +producto.stock;
    return super.save(producto);
  }
  // retorna el producto actualizado indicado por idBuscado o null si no existe
  updateById(idBuscado, productoActualizado) {
    // valido el producto
    let error = this.validaProducto(productoActualizado);
    if (error != "") {
      throw new Error(error);
    }
    return super.updateById(idBuscado, productoActualizado);
  }
  // Verifica que el objeto producto tenga las claves esperadas y que sean del tipo esperados
  validaProducto(producto) {
    // validacion de nombre
    let validacion = validateTextField(producto, "nombre");
    if (validacion != "") {
      return validacion;
    }
    // validacion de descripcion
    validacion = validateTextField(producto, "descripcion");
    if (validacion != "") {
      return validacion;
    }
    // validacion de codigo
    validacion = validateTextField(producto, "codigo");
    if (validacion != "") {
      return validacion;
    }
    // validaciones de foto
    validacion = validateTextField(producto, "foto");
    if (validacion != "") {
      return validacion;
    }
    if (!validUrlRegex.test(producto.foto)) {
      return "La clave foto no contiene una URL valida";
    }

    // validaciones de precio
    validacion = validateNumericField(producto, "precio");
    if (validacion != "") {
      return validacion;
    }
    if (producto.precio <= 0) {
      return "El precio debe ser mayor a cero";
    }
    // validaciones de stock
    validacion = validateNumericField(producto, "stock");
    if (validacion != "") {
      return validacion;
    }
    if (producto.stock < 0) {
      return "El stock no puede ser menor que cero";
    }
    return "";
  }
}

const validateTextField = (object, field) => {
  if (!object.hasOwnProperty(field)) {
    return `El objecto no tiene una clave '${field}'`;
  }
  if (typeof object[field] !== "string") {
    return `La clave '${field}' debe ser texto`;
  }
  if (object[field].trim() == "") {
    return `La clave '${field}' no puede estar vacía`;
  }
  return "";
};

const validateNumericField = (object, field) => {
  if (!object.hasOwnProperty(field)) {
    return `El objecto no tiene una clave '${field}'`;
  }
  if (isNaN(object[field])) {
    return `La clave '${field}' debe ser un nuemro`;
  }
  return "";
};

module.exports = { ContenedorProductos };
