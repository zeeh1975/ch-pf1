const express = require("express");
const app = express();
const path = require("path");
const { errorHandler, pageNotFound } = require("../middleware/errorHandler");
const rutas = require("../routes/routes");
const config = require("./config");

// configuracion del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api", rutas);
app.all("*", pageNotFound);
app.use(errorHandler);

// creo el servidor de Express en el puerto indicado
const server = app.listen(config.SERVER_PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

// loguear cualquier error a consola
server.on("error", (error) => console.log(`Error en servidor ${error}`));
