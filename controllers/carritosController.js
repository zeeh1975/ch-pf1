const { carritos } = require("../data/carritosData");
const { productos } = require("../data/productosData");
const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
  HTTP_STATUS_ERROR_BAD_REQUEST,
  HTTP_STATUS_ERROR_NOT_FOUND,
  PRODUCTO_INEXISTENTE,
  CARRITO_INEXISTENTE,
} = require("../public/assets/scripts/const");
const { buildErrorMessage } = require("../src/util.js");

// Crea un nuevo carrito y devuelve su id
const addCarrito = (req, res) => {
  try {
    idCarrito = carritos.save();
    res.status(HTTP_STATUS_CREATED).send({ idCarrito });
  } catch (error) {
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(buildErrorMessage(HTTP_STATUS_ERROR_BAD_REQUEST, error.message));
  }
};

// borro un carrito
const deleteCarrito = (req, res) => {
  const id = Number(req.params.id);
  const result = carritos.deleteById(id);
  if (result) {
    res.status(HTTP_STATUS_OK).end();
  } else {
    res
      .status(HTTP_STATUS_ERROR_NOT_FOUND)
      .send(
        buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, CARRITO_INEXISTENTE)
      );
  }
};

// Devuelve la lista de carritos
const getCarritos = (req, res) => {
  res.status(HTTP_STATUS_OK).send(carritos.getAll());
};

const getProductosCarrito = (req, res) => {
  const id = Number(req.params.id);
  const result = carritos.getById(id);
  if (result) {
    res.send(result.productos);
  } else {
    res
      .status(HTTP_STATUS_ERROR_NOT_FOUND)
      .send(
        buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, CARRITO_INEXISTENTE)
      );
  }
};

const getProductCount = (carrito) => {
  return carrito.productos.reduce((pv, cv) => {
    return pv + cv.stock;
  }, 0);
};

function indexOfProduct(idBuscado, products) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === idBuscado) return i;
  }
  return -1;
}

const addProductoCarrito = (req, res) => {
  const id = Number(req.params.id);
  const carrito = carritos.getById(id);
  if (carrito) {
    const idProducto = req.body.idProducto;
    const index = indexOfProduct(idProducto, carrito.productos);
    if (index !== -1) {
      // se trata de un producto que ya esta en el carrito
      // incremento en uno la cantidad
      carrito.productos[index].stock++;
      carritos.saveToFile();
      res
        .status(HTTP_STATUS_CREATED)
        .end();
      return;
    }
    const producto = productos.getById(idProducto);
    if (producto) {
      const nuevoProducto = { ...producto };
      nuevoProducto.stock = 1;
      carrito.productos.push(nuevoProducto);
      carritos.saveToFile();
      res
        .status(HTTP_STATUS_CREATED)
        .end();
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(
          buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, PRODUCTO_INEXISTENTE)
        );
    }
  } else {
    res
      .status(HTTP_STATUS_ERROR_NOT_FOUND)
      .send(
        buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, CARRITO_INEXISTENTE)
      );
  }
};

const deleteProductoCarrito = (req, res) => {
  const id = Number(req.params.id);
  const id_prod = Number(req.params.id_prod);
  const carrito = carritos.getById(id);
  if (carrito) {
    const index = indexOfProduct(id_prod, carrito.productos);
    if (index > -1) {
      carrito.productos.splice(index, 1);
      res.status(HTTP_STATUS_OK).send(carrito.productos);
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(
          buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, PRODUCTO_INEXISTENTE)
        );
    }
  } else {
    res
      .status(HTTP_STATUS_ERROR_NOT_FOUND)
      .send(
        buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, CARRITO_INEXISTENTE)
      );
  }
};

module.exports = {
  addCarrito,
  deleteCarrito,
  getProductosCarrito,
  addProductoCarrito,
  deleteProductoCarrito,
};
