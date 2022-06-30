const productForm = document.querySelector("#productForm");
const listaProductos = document.querySelector("#productos");
const cartItemCount = document.querySelector("#cartItemCount");
const shopingCartButton = document.querySelector("#shopingcartbutton");
const addNewProductDiv = document.querySelector("#addnewproduct");
const addNewProductButton = document.querySelector("#addnewproductbutton");
const modalProductForm = document.querySelector("#modalProductForm");
const modalProductFormTitle = document.querySelector("#modalProductFormTitle");

const host = window.location.protocol + "//" + window.location.host;
const productosURL = new URL("api/productos", host);
const carritoURL = new URL("api/carrito", host);
const arFormat = Intl.NumberFormat("es-AR");
let carrito;
let cantidadProductosCarrito;
let processProduct;
let activeModalProductForm;
const admin = true;

// Funciones utiles

function formateaPrecios(productos) {
  return productos.map((producto) => {
    producto.precioFormateado = "$" + arFormat.format(producto.precio);
    return producto;
  });
}

function mostrarMensajeError(errorMsg) {
  if (typeof Swal !== "undefined") {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: errorMsg,
    });
  } else {
    alert(errorMsg);
  }
}

function mostrarError(errorMsg) {
  if (errorMsg.descripcion) {
    mostrarMensajeError(errorMsg.descripcion);
  } else {
    if (errorMsg.error) {
      mostrarMensajeError(errorMsg.error);
    } else {
      mostrarMensajeError(errorMsg);
    }
  }
}

async function fetchRequest(destURL, method, body) {
  return await fetch(destURL, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
}

// Carrito
// Crea un nuevo carrito
async function crearCarrito() {
  const errorMsg = "No fue posible crear el carrito";
  try {
    const responseData = await fetchRequest(carritoURL, "POST");
    if (responseData.status === HTTP_STATUS_CREATED) {
      response = await responseData.json();
      if (response.idCarrito) {
        carrito = response.idCarrito;
        carritoItemCount = 0;
        return;
      }
    }
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// borrar un carrito
async function borrarCarrito(carrito) {
  const errorMsg = "No fue posible borrar el carrito";
  try {
    const responseData = await fetchRequest(
      carritoURL + "/" + carrito,
      "DELETE"
    );
    if (responseData.status === HTTP_STATUS_OK) {
      return;
    }
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// Productos
// Agrega un nuevo producto
async function addProduct() {
  try {
    const responseData = await fetchRequest(
      productosURL,
      "POST",
      JSON.stringify({
        nombre: productForm.nombre.value,
        descripcion: productForm.descripcion.value,
        codigo: productForm.codigo.value,
        foto: productForm.foto.value,
        precio: productForm.precio.value,
        stock: productForm.stock.value,
      })
    );
    if (responseData.status === HTTP_STATUS_CREATED) {
      activeModalProductForm.hide();
      getProductos();
    } else {
      // se muestra un mensaje con el error
      response = await responseData.json();
      mostrarError(response);
    }
  } catch (error) {
    console.log("error=", error);
  }
}

// Actualiza los datos de un producto
async function updateProduct(productId) {
  try {
    const responseData = await fetchRequest(
      productosURL + "/" + productId,
      "PUT",
      JSON.stringify({
        nombre: productForm.nombre.value,
        descripcion: productForm.descripcion.value,
        codigo: productForm.codigo.value,
        foto: productForm.foto.value,
        precio: productForm.precio.value,
        stock: productForm.stock.value,
      })
    );
    if (responseData.status === HTTP_STATUS_OK) {
      activeModalProductForm.hide();
      getProductos();
    } else {
      // se muestra un mensaje con el error
      response = await responseData.json();
      mostrarError(response);
    }
  } catch (error) {
    console.log("error=", error);
  }
}

// borra un producto
async function deleteProduct(productId) {
  try {
    const responseData = await fetchRequest(
      productosURL + "/" + productId,
      "DELETE"
    );
    if (responseData.status === HTTP_STATUS_OK) {
      getProductos();
    } else {
      // si el resultado no es el esperado
      // se muestra un mensaje con el error
      response = await responseData.json();
      mostrarError(response);
    }
  } catch (error) {
    console.log("error=", error);
  }
}

// obtiene los detalles de un producto
async function getProductData(productId) {
  try {
    const responseData = await fetchRequest(
      productosURL + "/" + productId,
      "GET"
    );
    if (responseData.status === HTTP_STATUS_OK) {
      response = await responseData.json();
      return response;
    }
    return null;
  } catch (error) {
    console.log("error=", error);
    return null;
  }
}

// Contenido
// renderiza la lista de productos mediante la plantilla predefinida
function makeProductTable(productos) {
  return fetch(host + "/assets/views/tabla_productos.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      productosFormateados = formateaPrecios(productos);
      const html = template({
        isAdmin: admin,
        productos: productosFormateados,
      });
      return html;
    });
}

// obtiene la lista de productos y la inserta en la pagina
async function getProductos() {
  const errorMsg = "No fue posible obtener la lista de productos";
  try {
    const responseData = await fetchRequest(productosURL, "GET");
    if (responseData.status === HTTP_STATUS_OK) {
      response = await responseData.json();
      makeProductTable(response).then((html) => {
        document.getElementById("productos").innerHTML = html;
      });
      return;
    }
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

function actualizarCantidadProductosCarrito(cantidadProductos) {
  cartItemCount.innerHTML = cantidadProductos;
}

// Genera el contenido html para mostrar el contenido del carrito
function makeCarrito(carrito) {
  return fetch(host + "/assets/views/tabla_carrito.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      cantidadProductosCarrito = 0;
      let importeTotal = 0;
      carrito.forEach((producto) => {
        const precioTotalProducto = producto.precio * producto.stock;
        producto.precioFormateado = "$" + arFormat.format(precioTotalProducto);
        cantidadProductosCarrito += producto.stock;
        importeTotal += precioTotalProducto;
      });
      actualizarCantidadProductosCarrito(cantidadProductosCarrito);
      importeTotal = "$" + arFormat.format(importeTotal);
      const html = template({
        productos: carrito,
        cantidadProductosCarrito,
        importeTotal,
      });
      return html;
    });
}

// Elimina un item del carrito
async function removeItemFromCart(productId) {
  const errorMsg = "No fue posible eliminar el producto del carrito";
  try {
    const removeProductCartUrl =
      carritoURL + "/" + carrito + "/productos/" + productId;
    const responseData = await fetchRequest(removeProductCartUrl, "DELETE");
    if (responseData.status === HTTP_STATUS_OK) {
      const response = await responseData.json();
      const shoppingCart = document.getElementById("shopingcart");
      html = await makeCarrito(response);
      shoppingCart.innerHTML = html;
      // Actualizar el contenido del sidebar con el nuevo carrito renderizado
      const sidebar = document.querySelector(".swal2-html-container");
      if (sidebar) {
        sidebar.innerHTML = html;
      }
      return;
    }
    const response = await responseData.text();
    console.log(response);
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// Renderiza el carrito
async function renderCarrito() {
  const errorMsg = "No fue posible cargar el carrito";
  try {
    const addProductCartUrl = carritoURL + "/" + carrito + "/productos";
    const responseData = await fetchRequest(addProductCartUrl, "GET");
    if (responseData.status === HTTP_STATUS_OK) {
      const response = await responseData.json();
      makeCarrito(response).then((html) => {
        document.getElementById("shopingcart").innerHTML = html;
      });
      return;
    }
    response = await responseData.text();
    console.log(response);
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// agrega un producto al carrito
async function agregarProductoCarrito(idProducto) {
  const errorMsg = "No fue posible agregar el producto al carrito";
  try {
    const addProductCartUrl = carritoURL + "/" + carrito + "/productos";
    const responseData = await fetchRequest(
      addProductCartUrl,
      "POST",
      JSON.stringify({ idProducto })
    );
    if (responseData.status === HTTP_STATUS_CREATED) {
      //response = await responseData.json();
      await renderCarrito();
      return;
    }
    response = await responseData.text();
    console.log(response);
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// Presenta el formulario para editar un producto
async function editProduct(productId) {
  modalProductFormTitle.innerHTML = "Editar producto";
  activeModalProductForm = new bootstrap.Modal(modalProductForm);
  processProduct = updateProduct.bind(null, productId);
  producto = await getProductData(productId);
  if (producto) {
    productForm.nombre.value = producto.nombre;
    productForm.descripcion.value = producto.descripcion;
    productForm.codigo.value = producto.codigo;
    productForm.foto.value = producto.foto;
    productForm.precio.value = producto.precio;
    productForm.stock.value = producto.stock;
    activeModalProductForm.show();
  } else {
    mostrarError("No fue posible obtener el producto");
  }
}

// Presenta el formulario para agregar un producto
async function addNewProduct(productId) {
  modalProductFormTitle.innerHTML = "Agregar producto";
  activeModalProductForm = new bootstrap.Modal(modalProductForm);
  processProduct = addProduct.bind(null, productId);
  productForm.reset();
  activeModalProductForm.show();
}

// Confirma la elimiancion de un producto
async function removeProduct(productId) {
  result = await Swal.fire({
    title: "¿Está seguro que quiere eliminar el producto?",
    icon: "question",
    showCancelButton: true,
    showConfirmButton: false,
    showDenyButton: true,
    cancelButtonText: "Cancelar",
    denyButtonText: `Eliminar`,
  });

  if (result.isDenied) {
    // eliminar
    deleteProduct(productId);
  }
}

// Eventos

listaProductos.addEventListener("click", (e) => {
  if (e.target.name === "cartAdd") {
    e.preventDefault();
    const productId = +e.target.id;
    agregarProductoCarrito(productId);
  }
});

shopingCartButton.addEventListener("click", async (e) => {
  if (cantidadProductosCarrito > 0) {
    result = await showCart(true);
    if (result.isDenied) {
      // vaciar carrito
      result = await Swal.fire({
        title: "¿Está seguro que quiere vaciar el carrito?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: false,
        showDenyButton: true,
        cancelButtonText: "Cancelar",
        denyButtonText: `Vaciar`,
      });

      if (result.isDenied) {
        // eliminar
        await borrarCarrito(carrito);
        await crearCarrito();
        await renderCarrito();
      }
    } else {
      if (result.isConfirmed) {
        // comprar
        alert("Comprar");
      }
    }
  } else {
    showCart(false);
  }
});

addNewProductButton.addEventListener("click", (e) => {
  e.preventDefault();
  addNewProduct();
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.attributes.name.value == "removefromcart") {
    e.preventDefault();
    removeItemFromCart(e.target.id);
  }
  if (e.target && e.target.attributes.name.value == "editproduct") {
    e.preventDefault();
    editProduct(e.target.id);
  }
  if (e.target && e.target.attributes.name.value == "removeproduct") {
    e.preventDefault();
    removeProduct(e.target.id);
  }
});

// pone el foco en el campo nombre al mostrar el modal
modalProductForm.addEventListener("shown.bs.modal", (e) => {
  productForm.nombre.focus();
});

// submit formulario productos
productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  processProduct();
});

// Configuraciones de la app
async function run() {
  await crearCarrito();
  await renderCarrito();
  await getProductos();
}

// mostrar el boton de agregar producto si se trata del adiministrador
if (admin) {
  addNewProductDiv.style = "";
}

run();
