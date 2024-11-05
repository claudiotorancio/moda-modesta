import { modalControllers } from "../../modal/modal.js";
import { eventListenerBotones } from "./botonesViewer.js";

export function getAmountSelectHTML(generalStock) {
  return `
    <div class="form-group mt-3 mb-4">
      <label for="quantity" class="form-label">Cantidad</label>
      <div class="d-flex align-items-center">
        <button type="button" id="decrement" class="btn btn-outline-secondary" disabled>-</button>
        <input type="number" id="quantity" class="form-control text-center mx-2" value="1" min="1" max="${generalStock}" readonly>
        <button type="button" id="increment" class="btn btn-outline-secondary"${
          generalStock > 1 ? "" : " disabled"
        }>+</button>
      </div>
      <div class="text-center mt-3">
     <button type="button" class="btn btn-primary" data-carrito>
       <i class="fas fa-shopping-cart"></i> Agregar al Carrito
    </button>
     <div class="spinner-border text-primary" id="loadingSpinner" style="display: none;" role="status">
       <span class="visually-hidden">Cargando...</span>
    </div>
   </div>
    <div id="messageContainer" style="display: none;" class="mt-3">
  <p id="message" class="alert alert-warning text-center"></p>
  </div>
  `;
}

export function getSizesSelectHTML(sizes) {
  // Generar las opciones de talles según el stock disponible
  const sizesOptions = sizes
    .filter((item) => item.stock > 0)
    .map(
      (item) =>
        `<option value="${item.size}" data-stock="${item.stock}">${item.size}</option>`
    )
    .join("");

  // Si no hay talles con stock, no generar HTML
  if (!sizesOptions) {
    return;
  }

  return `
    <div class="form-group mt-3 mb-4">
      <label for="variation_1" class="form-label">Selecciona un talle</label>
      <select id="variation_1" class="form-select" aria-label="Selecciona un talle" required>
        <option value="" disabled selected>Selecciona un talle...</option>
        ${sizesOptions}
      </select>
    </div>

    <div class="form-group mt-3 mb-4">
      <label for="quantity" class="form-label">Cantidad</label>
      <div class="d-flex align-items-center">
        <button type="button" id="decrement" class="btn btn-outline-secondary" disabled>-</button>
        <input type="number" id="quantity" class="form-control text-center mx-2" value="1" min="1" readonly>
        <button type="button" id="increment" class="btn btn-outline-secondary" disabled>+</button>
      </div>
    <div class="text-center mt-3">
     <button type="button" class="btn btn-primary" id="addToCartBtn" data-carrito>
       <i class="fas fa-shopping-cart"></i> Agregar al Carrito
    </button>
     <div class="spinner-border text-primary" id="loadingSpinner" style="display: none;" role="status">
       <span class="visually-hidden">Cargando...</span>
    </div>
   </div>
    <div id="messageContainer" style="display: none;" class="mt-3">
  <p id="message" class="alert alert-warning text-center"></p>
  </div>

  `;
}

// Evento para manejar el cambio de talle y ajustar el stock
document.addEventListener("change", function (event) {
  if (event.target.id === "variation_1") {
    const selectedOption = event.target.selectedOptions[0];
    if (selectedOption) {
      // Asegurarse de que hay una opción seleccionada
      const stock = parseInt(selectedOption.getAttribute("data-stock"), 10);
      updateQuantityLimits(stock);
    }
  }
});

// Función para actualizar el límite de cantidad en base al stock del talle seleccionado
function updateQuantityLimits(stock) {
  const quantityInput = document.getElementById("quantity");
  const incrementButton = document.getElementById("increment");
  const decrementButton = document.getElementById("decrement");

  // Restablece el valor y habilita los botones
  quantityInput.value = 1;
  quantityInput.setAttribute("max", stock);
  incrementButton.disabled = stock <= 1; // Solo habilita si el stock es mayor a 1
  decrementButton.disabled = true; // Inicia deshabilitado porque el valor mínimo es 1
}

// Eventos para los botones de incrementar y decrementar
document.addEventListener("click", function (event) {
  const quantityInput = document.getElementById("quantity");
  if (quantityInput) {
    const maxQuantity = parseInt(quantityInput.getAttribute("max"), 10);
    console.log(maxQuantity);

    if (event.target.id === "increment") {
      if (quantityInput.value < maxQuantity) {
        quantityInput.value = parseInt(quantityInput.value, 10) + 1;
      }
      document.getElementById("decrement").disabled = quantityInput.value <= 1;
      return;
    }

    if (event.target.id === "decrement") {
      if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value, 10) - 1;
      }
      document.getElementById("decrement").disabled = quantityInput.value <= 1;
      return;
    }

    // Deshabilitar el botón de incrementar si alcanza el máximo
    document.getElementById("increment").disabled =
      quantityInput.value >= maxQuantity;
  }
});

export const mostrarProducto = async (
  id,
  name,
  price,
  imagePath,
  description,
  sizes,
  hayStock,
  section,
  generalStock
) => {
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const mostrarProducto = modal.querySelector("[data-table]");

  // Crear el HTML del producto con el carrusel integrado
  mostrarProducto.innerHTML = `
  <div class="container-fluid">
    <div class="row">
      <!-- Columna izquierda: Carrusel de imágenes -->
      <div class="col-md-6">
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
                <div class="carousel-caption d-none d-md-block">
                  <h5>Imagen ${index + 1}</h5>
                  <p>Descripción de la imagen ${index + 1}</p>
                </div>
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
  
      <!-- Columna derecha: Información del producto y selección de talles -->
      <div class="col-md-6">
        <h2 class="product-title-bold mt-2" style="font-size: 1.3rem;">${name}</h2>
        <h3 class="product-price text-primary-bold mt-2" style="font-weight: bold; font-size: 1.25em;">$${price}</h3>
        <p class="product-description text-muted">${description}</p>
        
        ${hayStock ? "" : '<div class="alert alert-warning">Sin stock</div>'}
  
        <!-- Selección de talla o cantidad -->
        ${
          hayStock
            ? !generalStock
              ? `${getSizesSelectHTML(sizes)}`
              : `${getAmountSelectHTML(generalStock)}`
            : `
          <div class="main-container">
            <div class="text-center">
              <div class="card-form">
                <p>¡Notificarme cuando ingrese!</p>
                <form id="notificacion-form" action="/api/notificacionSinStock" method="POST">
                  <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" class="input" placeholder="nombre@gmail.com" required>
                  </div>
                  <button type="submit" class="btn btn-primary mt-2">Enviar</button>
                </form>
              </div>
            </div>
          </div>`
        }
  
        <!-- Botón de compartir -->
        ${
          hayStock
            ? `<div class="d-flex justify-content-center mt-3">
              <a id="compartir-producto" class="btn btn-outline-secondary"><i class="fa-solid fa-share-nodes"></i> Compartir</a>
            </div>`
            : ""
        }
      </div>
    </div>
  
    <!-- Fila inferior: Calcular envío y productos similares -->
    ${
      hayStock
        ? `<div class="row mx-auto  align-items-center">
            <div class=" mt-2">
              <h5>Calcular envío</h5>
                <div class="d-flex mt-2">
                   <input type="number" class="form-control me-2" id="cpDestino" name="cpDestino" placeholder="Código Postal">
                   <button class="btn btn-secondary" id="calcular-envio">Calcular</button>
                </div>
            <div id="shipping-total" class="mt-2"></div>
          </div>`
        : ""
    }
    <div class="row mt-4">
      <div class=" mt-2">
        <h4>Productos Similares</h4>
        <button id="toggle-similares" class="btn btn-link">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div id="similares-Container" class="collapse">
          <div id="productos-similares" class="d-flex flex-wrap justify-content-center gap-2"></div>
        </div>
      </div>
    </div>
  </div>
  `;

  // Manejar eventos para los botones
  eventListenerBotones(
    id,
    name,
    price,
    imagePath,
    sizes,
    section,
    generalStock
  );
};
