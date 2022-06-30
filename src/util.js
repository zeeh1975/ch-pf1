// Crea un objeto con el error y la descripcion del error
function buildErrorMessage(error, descripcion) {
  return {
    error,
    descripcion,
  };
}

module.exports = {buildErrorMessage};
