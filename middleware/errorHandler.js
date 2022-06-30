const {
  HTTP_STATUS_ERROR_NOT_FOUND,
  HTTP_STATUS_ERROR_INTERNAL_SERVER_ERROR,
} = require("../public/assets/scripts/const");
const { buildErrorMessage } = require("../src/util.js");

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(HTTP_STATUS_ERROR_INTERNAL_SERVER_ERROR).send("Something broke!");
}

function pageNotFound(req, res) {
  res
    .status(HTTP_STATUS_ERROR_NOT_FOUND)
    .send(
      buildErrorMessage(
        HTTP_STATUS_ERROR_NOT_FOUND,
        `No se puede hacer ${req.method} en ${req.path}`
      )
    );
}

module.exports = { errorHandler, pageNotFound };
