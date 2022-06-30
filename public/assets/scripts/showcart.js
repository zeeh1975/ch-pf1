async function showCart(showButtons) {
  let nav;
  return await Swal.fire({
    html: document.querySelector("#shopingcart").innerHTML,
    showDenyButton: showButtons,
    showConfirmButton: showButtons,
    confirmButtonText: 'Comprar...',
    denyButtonText: `Vaciar carrito`,
    showCloseButton: false,
    position: "top-right",
    customClass: {
      container: "sidebar",
      popup: "border-radius-0",
    },
    showClass: {
      popup: "animate__animated animate__fadeInRight animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutRight animate__faster",
    },
    willClose: () => {
      nav = Swal.getHtmlContainer().querySelector("#shopingcart");
    },
    didClose: () => {
      document.body.insertBefore(
        nav,
        document.querySelector("#shopingcartbutton")
      );
    },
    width: 500,
  });
}
