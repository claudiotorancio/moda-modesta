import { initializeCategoryControls } from "../productos/categoryControls.js";
import { controllers } from "../productos/productos_controllers.js";

export async function buscar() {
  // Cargar los productos cuando se haga clic en el input de búsqueda
  // document
  //   .getElementById("searchInput")
  //   .addEventListener("focus", async function () {
  //     const titulo = document.querySelector("[data-titulo]");
  //     titulo.innerHTML = "";
  //     // const texto = document.querySelectorAll(".texto-categoria");
  //     // texto.style.display = "flex";
  //     await controllers.renderProducts();
  //   });

  document
    .getElementById("searchInput")
    .addEventListener("focus", async function () {
      const titulo = document.querySelector("[data-titulo]");
      titulo.innerHTML = "";

      document.querySelectorAll(".categoria").forEach((categoria) => {
        categoria.querySelector(".texto-categoria").style.display = "flex";
        categoria.querySelector(".productos").innerHTML = "";
      });
      await controllers.renderProducts();
    });

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

  async function searchProducts(query) {
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
      initializeCategoryControls();
      await controllers.renderProducts();
      noResultsMessage.style.display = "none";
    }
  }
}
