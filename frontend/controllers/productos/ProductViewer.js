import { controllers } from "./productos_controllers.js";
import { modalControllers } from "../../modal/modal.js";
import { handleEnvioFormProduct } from "../carrito/envioHandlers.js";

export const mostrarProducto = async (
  name,
  price,
  imagePath,
  description,
  sizes,

  id,
  hayStock // Nuevo parámetro para indicar si hay stock
) => {
  console.log(name, price, imagePath, sizes, description, id, hayStock);
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const mostrarProducto = modal.querySelector("[data-table]");

  // Crear el HTML del producto con el carrusel integrado
  mostrarProducto.innerHTML = `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <!-- Carrusel de Imágenes -->
          <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              ${imagePath
                .map(
                  (_, index) => `
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${
                    index === 0 ? "active" : ""
                  }" aria-current="${
                    index === 0 ? "true" : "false"
                  }" aria-label="Slide ${index + 1}"></button>
              `
                )
                .join("")}
            </div>
            <div class="carousel-inner">
              ${imagePath
                .map(
                  (img, index) => `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                  <img src="${img}" class="d-block w-100" alt="Imagen ${
                    index + 1
                  }">
                </div>
              `
                )
                .join("")}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
        <div class="col-md-6">
          <h2 class="product-title-bold mt-2"  style="font-size: 1.3rem;">${name}</h2>
          <h3 class="product-price text-primary-bold mt-2" style="font-weight: bold; font-size: 1.25em;">$${price}</h3>
          <p class="product-description text-muted">${description}</p>

          ${hayStock ? "" : '<div class="alert alert-warning">Sin stock</div>'}
          
          <div class="product-options">
            <label for="variation_1" class="form-label">Talles disponibles</label>
            <select id="variation_1" class="form-select mb-3" ${
              hayStock ? "" : "disabled"
            }>
              ${sizes
                .map(
                  (item) => `<option value="${item.size}">${item.size}</option>`
                )
                .join("")}
            </select>
          </div>
          
          <div class="d-flex justify-content-between mt-3">
            <button type="button" class="btn btn-primary me-2" data-carrito ${
              hayStock ? "" : "disabled"
            }>Añadir carrito</button>
            <a id="compartir-producto" class="btn btn-outline-secondary">
              <i class="fa-solid fa-share-nodes"></i> Compartir
            </a>
          </div>
        </div>
      </div>

      ${
        hayStock
          ? `
        <div class="row mt-4">
          <h5>Calcular envío</h5>
          <div class="input-container mt-2">
            <div class="postal-input-container">
              <input type="number" class="input" id="cpDestino" name="cpDestino" placeholder="Codigo Postal" data-tipo="cpDestino">
              <label class="input-label" for="cpDestino">Codigo Postal</label>
              <span class="input-message-error">Este campo no es válido</span>
              <i class="btn btn-secondary fa fa-arrow-right postal-arrow" id="calcular-envio"></i>
              <div id="shipping-total"></div>
            </div>
          </div>
        </div>`
          : ""
      }

      <div class="row mt-4">
        <div class="col-12">
          <h4>Productos Similares</h4>
          <button id="toggle-similares" class="btn btn-link">
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          <div id="similares-Container" class="collapse">
            <div id="productos-similares" class="d-flex flex-wrap justify-content-start gap-2"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Manejar eventos para los botones
  document
    .getElementById("toggle-similares")
    .addEventListener("click", function () {
      const icon = this.querySelector("i");
      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-up");
      document.getElementById("similares-Container").classList.toggle("show");

      if (
        document
          .getElementById("similares-Container")
          .classList.contains("show")
      ) {
        controllers
          .cargarProductosSimilares(id)
          .catch((error) =>
            console.error("Error al cargar productos similares:", error)
          );
      }
    });

  // Verificar si existe el botón de calcular envío antes de añadir el event listener
  const calcularEnvioBtn = document.getElementById("calcular-envio");
  if (calcularEnvioBtn) {
    calcularEnvioBtn.addEventListener(
      "click",
      handleEnvioFormProduct.bind(this)
    );
  } else {
    console.log("Botón de calcular envío no encontrado, no hay stock.");
  }

  // Verificar si el botón de carrito existe antes de añadir el event listener
  const agregarCarritoBtn = mostrarProducto.querySelector("[data-carrito]");
  if (agregarCarritoBtn) {
    agregarCarritoBtn.addEventListener("click", () => {
      const talleSeleccionado = document.getElementById("variation_1").value;
      controllers.comprarProducto(
        name,
        price,
        imagePath,
        id,
        talleSeleccionado
      );
    });
  } else {
    console.log(
      "Botón de añadir al carrito no encontrado, posiblemente no hay stock."
    );
  }

  // Asegurarte de que el elemento existe antes de agregar el event listener
  const compartirBtn = document.getElementById("compartir-producto");

  if (compartirBtn) {
    compartirBtn.addEventListener("click", () => {
      // Lógica de compartir

      compartirBtn.disabled = true; // Deshabilitar mientras se realiza la acción de compartir
      const productUrl = window.location.href;

      if (navigator.share) {
        navigator
          .share({
            text: `¡Mira este producto! ${name} por solo $${price}`,
            url: productUrl,
          })
          .then(() => {
            console.log("Compartido exitosamente");
          })
          .catch((error) => {
            console.log("Error al compartir:", error);
          })
          .finally(() => {
            compartirBtn.disabled = false; // Habilitar nuevamente
          });
      } else {
        alert(
          "La función de compartir no es compatible con tu navegador. Comparte manualmente el enlace."
        );
        compartirBtn.disabled = false; // Habilitar en caso de error
      }
    });
  } else {
    console.error("El botón 'compartir-producto' no existe en el DOM.");
  }
};
