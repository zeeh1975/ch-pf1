const {
  HTTP_STATUS_ERROR_BAD_UNAUTHORIZED,
} = require("../public/assets/scripts/const");
const { buildErrorMessage } = require("../src/util.js");

const admin = true;

const isAdmin = (req, res, next) => {
  if (admin) {
    next();
  } else {
    res
      .status(HTTP_STATUS_ERROR_BAD_UNAUTHORIZED)
      .send(
        buildErrorMessage(
          HTTP_STATUS_ERROR_BAD_UNAUTHORIZED,
          `No tiene permiso para realizar esa operacion (${req.method}:${req.originalUrl})`
        )
      );
  }
};

module.exports = isAdmin;
