const { productos } = require("../data/productosData");
const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
  HTTP_STATUS_ERROR_BAD_REQUEST,
  HTTP_STATUS_ERROR_NOT_FOUND,
  PRODUCTO_INEXISTENTE,
} = require("../public/assets/scripts/const");
const { buildErrorMessage } = require("../src/util.js");

// Devuelve la lista de productos
const getProductos = (req, res) => {
  try {
    res.status(HTTP_STATUS_OK).send(productos.getAll());
  } catch (error) {
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(
        buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, PRODUCTO_INEXISTENTE)
      );
  }
};

// Devuelve el producto indicado por id
const getProducto = (req, res) => {
  const id = Number(req.params.id);
  const result = productos.getById(id);
  if (result) {
    res.send(result);
  } else {
    res
      .status(HTTP_STATUS_ERROR_NOT_FOUND)
      .send(
        buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, PRODUCTO_INEXISTENTE)
      );
  }
};

// Agrega un nuevo producto
const addProducto = (req, res) => {
  try {
    //console.log(req.body);
    productos.save(req.body);
    res.status(HTTP_STATUS_CREATED).end();
    //res.status(HTTP_STATUS_CREATED).send({result: "OK"});
    // res.status(HTTP_STATUS_ERROR_BAD_REQUEST).send({error: "error inventado"});
  } catch (error) {
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(buildErrorMessage(HTTP_STATUS_ERROR_BAD_REQUEST, error.message));
  }
};

// actualizar un producto
const updateProducto = (req, res) => {
  const productoActualizado = req.body;
  const id = Number(req.params.id);
  const error = productos.validaProducto(productoActualizado);
  if (!error) {
    const result = productos.updateById(id, productoActualizado);
    if (result) {
      res.status(HTTP_STATUS_OK).send(result);
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(
          buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, PRODUCTO_INEXISTENTE)
        );
    }
  } else {
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(buildErrorMessage(HTTP_STATUS_ERROR_BAD_REQUEST, error));
  }
};

// borro un producto
const deleteProducto = (req, res) => {
  const id = Number(req.params.id);
  const result = productos.deleteById(id);
  if (result) {
    res.send(result);
  } else {
    res
      .status(HTTP_STATUS_ERROR_NOT_FOUND)
      .send(
        buildErrorMessage(HTTP_STATUS_ERROR_NOT_FOUND, PRODUCTO_INEXISTENTE)
      );
  }
};

module.exports = {
  getProductos,
  getProducto,
  addProducto,
  updateProducto,
  deleteProducto,
};
