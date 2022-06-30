const { ContenedorProductos } = require("./contenedorProductos");
const { ContenedorChat } = require("./contenedorChat");

let productos = new ContenedorProductos(__dirname+"/../data/productos.txt");

productos.save({title:"sfdsd",price:"33",thumbnail:"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"});

let chat = new ContenedorChat(__dirname+"/../data/chat.txt");

chat.save({email:"unmailinventado@gmail.com", mensaje:"Hola mundo!"});

