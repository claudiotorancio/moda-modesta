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
