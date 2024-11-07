import { modalControllers } from "../modal/modal.js";
import productoServices from "../services/product_services.js";

export function handleEdit() {
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const productoEdicion = modal.querySelector("[data-table]");
  productoEdicion.innerHTML = `
      <div class="text-center">
        <div class="card-header d-flex flex-wrap justify-content-center" style="max-width: 100%; overflow-x: auto;">
          ${this.imagePath
            .map(
              (path, index) => `
            <div class="me-4 text-center" style="flex: 0 0 auto;">
              <img class="img-fluid" style="max-width: 5rem;" src="${path}" alt="Imagen ${
                index + 1
              }">
              <p class="text-muted">Imagen ${index + 1}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      <form action="/api/updateProduct/${
        this.id
      }" id="form" enctype="multipart/form-data" method="POST" data-forma>
        <p class="parrafo">Producto a editar</p>
        ${this.imagePath
          .map(
            (path, index) => `
          <div class="form-group">
            <input type="checkbox" id="image${
              index + 1
            }Check" class="form-check-input mt-2" name="image${
              index + 1
            }Check" data-check-image${index + 1}>
            <label for="image${
              index + 1
            }Check" class="form-check-label mt-2">Actualizar Imagen ${
              index + 1
            }</label>
            <input class="form-control p-2 mt-2" placeholder="imageUrl" type="file" name="imagePath${
              index + 1
            }" data-image${index + 1} required disabled>
            <input type="hidden" class="oldImagePath" name="oldImagePath${
              index + 1
            }" value="${path}" data-oldPath${index + 1}>
          </div>
        `
          )
          .join("")}
        <div class="form-group">
          <input class="form-control mt-3 p-2" placeholder="nombre" type="text" value="${
            this.name
          }" required data-nombre>
        </div>
        <div class="form-group">
          <input class="form-control mt-3 mb-3 p-2" placeholder="precio" type="text" value="${
            this.price
          }" required data-precio>
        </div>
        <div class="form-group">
      <input class="form-control mt-3 mb-3 p-2" placeholder="descuento (%)" type="number" min="0" max="100" value="${
        this.discount || 0
      }" required data-descuento>
    </div>
        <div class="form-group">
          <textarea class="form-control mt-3 mb-2 p-2" placeholder="Descripción" required data-description>${
            this.description
          }</textarea>
        </div>
        <div class="form-group form-check mb-3">
          <input type="checkbox" class="form-check-input" id="isFeatured" name="isFeatured" ${
            this.isFeatured ? "checked" : ""
          }>
          <label class="form-check-label" for="isFeatured">Destacar producto</label>
        </div>
        ${
          !this.generalStock && this.sizes
            ? `
          <label for="sizes">Modificar talles y stocks </label>
          <div class="form-row mt-3 mb-3">
           <div class="col-center flex">
            ${renderSizeOptions(this.sizes)}
            </div>
          </div>`
            : ` 
            ${renderGeneralStockHtml.call(this)}
          `
        }
        <button type="submit" class="btn btn-primary btn-lg">Editar producto</button>
      </form>
    `;

  setupImageCheckListeners();
  setupGeneralStockCheck();
  setupSizesCheckListeners();
  this.setupFormSubmitHandler?.();
}

function setupGeneralStockCheck() {
  // Selecciona los elementos
  const generalStockInput = document.querySelector("[data-generalStock]");
  const generalStockCheck = document.getElementById("updateGeneralStock");

  // Verifica que ambos elementos existan antes de proceder
  if (!generalStockInput) {
    // console.error("El input de stock general no existe.");
    return;
  }

  if (!generalStockCheck) {
    // console.error("El checkbox de 'updateGeneralStock' no existe.");
    return;
  }

  // Agrega el event listener para habilitar/deshabilitar el input
  generalStockCheck.addEventListener("change", () => {
    generalStockInput.disabled = !generalStockCheck.checked;
  });

  // Inicializa el estado del input basado en el estado actual del checkbox
  generalStockInput.disabled = !generalStockCheck.checked;
}

function renderGeneralStockHtml() {
  return `<div class="form-group form-check mb-3">
            <input type="checkbox" class="form-check-input" id="updateGeneralStock" name="updateGeneralStock">
            <label class="form-check-label" for="updateGeneralStock">Modificar stock general</label>
          </div>
          <div class="form-group">
            <label for="generalStock">Stock general</label>
            <input class="form-control mt-3 mb-3 p-2" type="number" value="${this.generalStock}" required data-generalStock disabled>
          </div>`;
}

function renderSizeOptions(selectedSizes = []) {
  const sizes = [
    { size: "Talle 1" },
    { size: "Talle 2" },
    { size: "Talle 3" },
    { size: "Talle 4" },
    { size: "Talle 5" },
  ];

  return sizes
    .map(
      ({ size }) => `
        <div class="form-check-inline me-3">
          <input 
            class="form-check-input" 
            type="checkbox" 
            value="${size}" 
            name="sizes" 
            id="${size.replace(" ", "").toLowerCase()}" 
            ${selectedSizes.some((s) => s.size === size) ? "checked" : ""}
          >
          <label 
            class="form-check-label" 
            for="${size.replace(" ", "").toLowerCase()}">
            ${size}
          </label>
          <input 
            class="form-control mt-2" 
            type="number" 
            placeholder="Sin stock" 
            name="stock_${size.replace(" ", "").toLowerCase()}" 
            value="${selectedSizes.find((s) => s.size === size)?.stock || 0}" 
            disabled
          >
        </div>
      `
    )
    .join("");
}

function setupImageCheckListeners() {
  const imageChecks = document.querySelectorAll(
    "[data-check-image1], [data-check-image2]"
  );
  const imageInputs = document.querySelectorAll("[data-image1], [data-image2]");
  const maxSelectable = 2;

  // Deshabilitar los inputs de imagen inicialmente
  imageInputs.forEach((input, index) => {
    input.disabled = !imageChecks[index].checked;
  });

  imageChecks.forEach((check, index) => {
    check.addEventListener("change", () => {
      // Contar cuántas imágenes han sido seleccionadas
      const selectedImages = Array.from(imageChecks).filter(
        (c) => c.checked
      ).length;

      if (selectedImages >= maxSelectable) {
        alert(
          "Solo puedes reemplazar una imagen. Para reemplazar ambas, crea un nuevo producto."
        );
        check.checked = false;
      }

      // Habilitar/deshabilitar el input de imagen correspondiente
      imageInputs[index].disabled = !check.checked;
    });
  });
}

function setupSizesCheckListeners() {
  const sizeChecks = document.querySelectorAll('input[name="sizes"]');

  sizeChecks.forEach((check) => {
    const size = check.value;
    const stockInput = document.querySelector(
      `input[name="stock_${size.replace(" ", "").toLowerCase()}"]`
    );
    check.addEventListener("change", () => {
      stockInput.disabled = !check.checked;
    });
  });
}
