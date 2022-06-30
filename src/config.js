const dotenv = require("dotenv");

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8080;

module.exports = { SERVER_PORT };
