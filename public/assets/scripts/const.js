const validEmailRegex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const validUrlRegex =
  /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/;
const HTTP_STATUS_ERROR_BAD_REQUEST = 400;
const HTTP_STATUS_ERROR_BAD_UNAUTHORIZED = 401;
const HTTP_STATUS_ERROR_NOT_FOUND = 404;
const HTTP_STATUS_ERROR_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const PRODUCTO_INEXISTENTE = "El producto no existe";
const CARRITO_INEXISTENTE = "El id de carrito no es valido";

// chequeo que module este definido para que no
// salte error en caso de usarlo del lado del cliente
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validEmailRegex,
    validUrlRegex,
    HTTP_STATUS_ERROR_BAD_REQUEST,
    HTTP_STATUS_ERROR_BAD_UNAUTHORIZED,
    HTTP_STATUS_ERROR_NOT_FOUND,
    HTTP_STATUS_ERROR_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_OK,
    HTTP_STATUS_CREATED,
    PRODUCTO_INEXISTENTE,
    CARRITO_INEXISTENTE,
  };
}
