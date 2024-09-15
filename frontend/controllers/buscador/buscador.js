import { controllers } from "../productos/productos_controllers.js";

export function buscar() {
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Evitar la recarga de la página
      const query = document
        .getElementById("searchInput")
        .value.trim()
        .toLowerCase();
      searchProducts(query);
    });

  document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    searchProducts(query);
  });

  function searchProducts(query) {
    const products = document.querySelectorAll(".card"); // Asegúrate de que cada producto tenga esta clase
    let found = false;

    products.forEach((product) => {
      // Obtener el nombre y el precio del producto
      const productNameElement = product.querySelector("h3");
      const productPriceElement = product.querySelector(".card-text");

      // Manejar productos sin nombre o precio
      const productName = productNameElement
        ? productNameElement.textContent.toLowerCase()
        : "";
      const productPrice = productPriceElement
        ? productPriceElement.textContent.toLowerCase()
        : "";

      // Comprobar si la consulta coincide con el nombre o el precio del producto
      if (productName.includes(query) || productPrice.includes(query)) {
        product.style.display = "block"; // Mostrar productos que coincidan
        found = true;
      } else {
        product.style.display = "none"; // Ocultar productos que no coincidan
      }
    });

    // Mostrar un mensaje si no se encontraron productos
    const noResultsMessage = document.getElementById("no-results-message");
    if (!found) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }

    // Mostrar todos los productos si la búsqueda está vacía
    if (query === "") {
      controllers.renderProducts();
      noResultsMessage.style.display = "none";
    }
  }
}
