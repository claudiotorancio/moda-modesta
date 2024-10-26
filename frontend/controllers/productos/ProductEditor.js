import { modalControllers } from "../../modal/modal.js";
import productoServices from "../../services/product_services.js";

export class ProductEditor {
  constructor() {
    this.modal = document.getElementById("modal");
    this.productoEdicion = this.modal.querySelector("[data-table]");
  }

  editProduct(
    id,
    name,
    price,
    imagePath,
    description,
    sizes,
    isFeatured,
    section,
    generalStock
  ) {
    this.renderEditor(
      id,
      name,
      price,
      imagePath,
      description,
      sizes,
      isFeatured,
      section,
      generalStock
    );
    this.setupImageCheckListeners();
    this.setupGeneralStockCheck();
    this.setupSizesCheckListeners();
    this.setupFormSubmitHandler(id);
  }

  renderEditor(
    id,
    name,
    price,
    imagePath,
    description,
    sizes,
    isFeatured,
    section,
    generalStock
  ) {
    modalControllers.baseModal();
    this.productoEdicion.innerHTML = `
      <div class="text-center">
        <div class="card-header d-flex flex-wrap justify-content-center" style="max-width: 100%; overflow-x: auto;">
          ${imagePath
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
      <form action="/api/updateProduct/${id}" id="form" enctype="multipart/form-data" method="POST" data-forma>
        <p class="parrafo">Producto a editar</p>
        ${imagePath
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
          <input class="form-control mt-3 p-2" placeholder="nombre" type="text" value="${name}" required data-nombre>
        </div>
        <div class="form-group">
          <input class="form-control mt-3 mb-3 p-2" placeholder="precio" type="text" value="${price}" required data-precio>
        </div>
        <div class="form-group">
          <textarea class="form-control mt-3 mb-2 p-2" placeholder="Descripción" required data-description>${description}</textarea>
        </div>
        <div class="form-group form-check mb-3">
          <input type="checkbox" class="form-check-input" id="isFeatured" name="isFeatured" ${
            isFeatured ? "checked" : ""
          }>
          <label class="form-check-label" for="isFeatured">Destacar producto</label>
        </div>
        ${
          section !== "opcion3" && sizes
            ? `
          <label for="sizes">Modificar talles y stocks </label>
          <div class="form-group mb-4">
            ${this.renderSizeOptions(sizes)}
          </div>`
            : ` 
            ${this.renderGeneralStockHtml(generalStock)}
          `
        }
        <button type="submit" class="btn btn-primary btn-lg">Editar producto</button>
      </form>
    `;
  }

  setupGeneralStockCheck() {
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

  renderGeneralStockHtml(generalStock) {
    return `<div class="form-group form-check mb-3">
            <input type="checkbox" class="form-check-input" id="updateGeneralStock" name="updateGeneralStock">
            <label class="form-check-label" for="updateGeneralStock">Modificar stock general</label>
          </div>
          <div class="form-group">
            <label for="generalStock">Stock general</label>
            <input class="form-control mt-3 mb-3 p-2" type="number" value="${generalStock}" required data-generalStock disabled>
          </div>`;
  }

  renderSizeOptions(selectedSizes = []) {
    const sizes = [
      { size: "Talle 1" },
      { size: "Talle 2" },
      { size: "Talle 3" },
      { size: "Talle 4" },
      { size: "Talle 5" },
    ];

    return `
  <div class="d-flex flex-wrap">
    ${sizes
      .map(
        ({ size }) => `
        <div class="form-check form-check-inline d-flex align-items-center me-3">
          <input 
            class="form-check-input me-1" 
            type="checkbox" 
            value="${size}" 
            name="sizes" 
            id="${size.replace(" ", "").toLowerCase()}" 
            ${selectedSizes.some((s) => s.size === size) ? "checked" : ""}
          >
          <label 
            class="form-check-label me-2" 
            for="${size.replace(" ", "").toLowerCase()}">
            ${size}
          </label>
          <input 
            class="form-control form-control-sm" 
            type="number" 
            placeholder="Sin stock" 
            name="stock_${size.replace(" ", "").toLowerCase()}" 
            value="${selectedSizes.find((s) => s.size === size)?.stock || 0}" 
            disabled
            style="max-width: 80px;"
          >
        </div>
      `
      )
      .join("")}
  </div>
`;
  }

  setupImageCheckListeners() {
    const imageChecks = document.querySelectorAll(
      "[data-check-image1], [data-check-image2]"
    );
    const imageInputs = document.querySelectorAll(
      "[data-image1], [data-image2]"
    );
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

  setupSizesCheckListeners() {
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

  setupFormSubmitHandler(id) {
    const form = this.productoEdicion.querySelector("[data-forma]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const imageInput1 = document.querySelector("[data-image1]");
      const imageInput2 = document.querySelector("[data-image2]");

      if (!imageInput1 && !imageInput2) {
        console.error("No se encontraron los elementos de entrada de imagen.");
        return;
      }

      const imagePath1 = imageInput1 ? imageInput1.files[0] : null;
      const imagePath2 = imageInput2 ? imageInput2.files[0] : null;

      const name = document.querySelector("[data-nombre]").value;
      const price = document.querySelector("[data-precio]").value;
      const description = document.querySelector("[data-description]").value;
      const isFeatured = document.querySelector("#isFeatured").checked;

      const selectedSizes = Array.from(
        document.querySelectorAll('input[name="sizes"]:checked')
      ).map((checkbox) => {
        const size = checkbox.value;
        const stock = document.querySelector(
          `input[name="stock_${size.replace(" ", "").toLowerCase()}"]`
        ).value;
        return { size, stock };
      });

      // Verificar si el checkbox existe antes de acceder a él
      const generalStockCheckElement =
        document.getElementById("updateGeneralStock");
      let generalStockCheck = false;
      let generalStock = null;

      if (generalStockCheckElement) {
        generalStockCheck = generalStockCheckElement.checked;
        generalStock = generalStockCheck
          ? document.querySelector("[data-generalStock]").value
          : null;
      }

      const dataEdit = new FormData();

      if (imagePath1) {
        dataEdit.append("imagePath", imagePath1);
        dataEdit.append(
          "oldImagePath",
          document.querySelector("[data-oldPath1]").value
        );
      } else if (imagePath2) {
        dataEdit.append("imagePath", imagePath2);
        dataEdit.append(
          "oldImagePath",
          document.querySelector("[data-oldPath2]").value
        );
      }

      dataEdit.append("name", name);
      dataEdit.append("price", price);
      dataEdit.append("description", description);
      dataEdit.append("isFeatured", isFeatured);

      if (generalStock !== null) {
        dataEdit.append("generalStock", generalStock);
      }

      selectedSizes.forEach(({ size, stock }) => {
        const normalizedSize = size.replace(" ", "_").toLowerCase();
        dataEdit.append("sizes[]", size);
        dataEdit.append(`stock_${normalizedSize}`, stock);
      });

      try {
        await productoServices.actualizarProducto(dataEdit, id);
      } catch (err) {
        console.error("Error al actualizar el producto:", err);
        alert(
          "Ocurrió un error al actualizar el producto. Por favor, intenta nuevamente."
        );
      }
    });
  }
}
