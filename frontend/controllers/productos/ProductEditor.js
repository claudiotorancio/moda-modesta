import { modalControllers } from "../../modal/modal.js";
import productoServices from "../../services/product_services.js";

export class ProductEditor {
  constructor() {
    this.modal = document.getElementById("modal");
    this.productoEdicion = this.modal.querySelector("[data-table]");
    this.sizeOptions = [
      { size: "Talle 1" },
      { size: "Talle 2" },
      { size: "Talle 3" },
      { size: "Talle 4" },
      { size: "Talle 5" },
    ];
  }

  editProduct(data) {
    this.renderEditor(data);
    this.setupEventListeners(data.id);
  }

  renderEditor({
    id,
    name,
    price,
    imagePath,
    description,
    sizes,
    isFeatured,
    section,
    generalStock,
  }) {
    modalControllers.baseModal();
    this.productoEdicion.innerHTML = `
      <div class="text-center">
        ${this.renderImages(imagePath)}
      </div>
      <form action="/api/updateProduct/${id}" id="form" enctype="multipart/form-data" method="POST" data-forma>
        <p class="parrafo">Producto a editar</p>
        ${this.renderImageInputs(imagePath)}
        ${this.renderTextInput("nombre", "text", name)}
        ${this.renderTextInput("precio", "text", price)}
        <div class="form-group">
          <textarea class="form-control mt-3 mb-2 p-2" placeholder="Descripción" required data-description>${description}</textarea>
        </div>
        ${this.renderCheckbox("isFeatured", "Destacar producto", isFeatured)}
        ${
          section !== "opcion3" && sizes
            ? `<label for="sizes">Modificar talles y stocks </label>${this.renderSizeOptions(
                sizes
              )}`
            : this.renderGeneralStockHtml(generalStock)
        }
        <button type="submit" class="btn btn-primary btn-lg">Editar producto</button>
      </form>
    `;
  }

  renderImages(imagePath) {
    return `
      <div class="card-header d-flex flex-wrap justify-content-center">
        ${imagePath
          .map(
            (path, index) => `
          <div class="me-4 text-center">
            <img class="img-fluid" style="max-width: 5rem;" src="${path}" alt="Imagen ${
              index + 1
            }">
            <p class="text-muted">Imagen ${index + 1}</p>
          </div>`
          )
          .join("")}
      </div>
    `;
  }

  renderImageInputs(imagePath) {
    return imagePath
      .map(
        (path, index) => `
      <div class="form-group">
        ${this.renderCheckbox(
          `image${index + 1}Check`,
          `Actualizar Imagen ${index + 1}`,
          false,
          `data-check-image${index + 1}`
        )}
        <input class="form-control p-2 mt-2" placeholder="imageUrl" type="file" name="imagePath${
          index + 1
        }" data-image${index + 1} required disabled>
        <input type="hidden" name="oldImagePath${
          index + 1
        }" value="${path}" data-oldPath${index + 1}>
      </div>
    `
      )
      .join("");
  }

  renderTextInput(name, type, value) {
    return `<div class="form-group">
      <input class="form-control mt-3 p-2" placeholder="${name}" type="${type}" value="${value}" required data-${name}>
    </div>`;
  }

  renderCheckbox(id, label, isChecked, dataAttr = "") {
    return `<div class="form-group form-check mb-3">
      <input type="checkbox" class="form-check-input" id="${id}" name="${id}" ${
      isChecked ? "checked" : ""
    } ${dataAttr ? dataAttr : ""}>
      <label class="form-check-label" for="${id}">${label}</label>
    </div>`;
  }

  renderGeneralStockHtml(generalStock) {
    return `
      ${this.renderCheckbox("updateGeneralStock", "Modificar stock general")}
      <div class="form-group">
        <label for="generalStock">Stock general</label>
        <input class="form-control mt-3 mb-3 p-2" type="number" value="${generalStock}" required data-generalStock disabled>
      </div>
    `;
  }

  renderSizeOptions(selectedSizes = []) {
    return this.sizeOptions
      .map(
        ({ size }) => `
      <div class="form-check-inline me-3">
        ${this.renderCheckbox(
          size.replace(" ", "").toLowerCase(),
          size,
          selectedSizes.some((s) => s.size === size)
        )}
        <input class="form-control mt-2" type="number" placeholder="Sin stock" name="stock_${size
          .replace(" ", "")
          .toLowerCase()}" 
          value="${
            selectedSizes.find((s) => s.size === size)?.stock || 0
          }" disabled>
      </div>
    `
      )
      .join("");
  }

  setupEventListeners(id) {
    this.setupImageCheckListeners();
    this.setupGeneralStockCheck();
    this.setupSizesCheckListeners();
    this.setupFormSubmitHandler(id);
  }

  setupGeneralStockCheck() {
    const generalStockInput = document.querySelector("[data-generalStock]");
    const generalStockCheck = document.getElementById("updateGeneralStock");

    if (generalStockInput && generalStockCheck) {
      generalStockCheck.addEventListener("change", () => {
        generalStockInput.disabled = !generalStockCheck.checked;
      });
      generalStockInput.disabled = !generalStockCheck.checked;
    }
  }

  setupImageCheckListeners() {
    const imageChecks = document.querySelectorAll(
      "[data-check-image1], [data-check-image2]"
    );
    const imageInputs = document.querySelectorAll(
      "[data-image1], [data-image2]"
    );

    imageChecks.forEach((check, index) => {
      check.addEventListener("change", () => {
        const selectedImages = Array.from(imageChecks).filter(
          (c) => c.checked
        ).length;
        if (selectedImages > 1) {
          alert("Solo puedes reemplazar una imagen.");
          check.checked = false;
        }
        imageInputs[index].disabled = !check.checked;
      });
    });
  }

  setupSizesCheckListeners() {
    document.querySelectorAll('input[name="sizes"]').forEach((check) => {
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
      const dataEdit = this.prepareFormData();
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

  prepareFormData() {
    const dataEdit = new FormData();
    dataEdit.append("name", document.querySelector("[data-nombre]").value);
    dataEdit.append("price", document.querySelector("[data-precio]").value);
    dataEdit.append(
      "description",
      document.querySelector("[data-description]").value
    );
    dataEdit.append(
      "isFeatured",
      document.querySelector("#isFeatured").checked
    );

    document
      .querySelectorAll("[data-check-image1], [data-check-image2]")
      .forEach((check, index) => {
        if (check.checked) {
          const imageInput = document.querySelector(`[data-image${index + 1}]`);
          dataEdit.append("imagePath", imageInput.files[0]);
          dataEdit.append(
            "oldImagePath",
            document.querySelector(`[data-oldPath${index + 1}]`).value
          );
        }
      });

    const generalStockCheck = document.getElementById("updateGeneralStock");
    if (generalStockCheck?.checked) {
      dataEdit.append(
        "generalStock",
        document.querySelector("[data-generalStock]").value
      );
    }

    document
      .querySelectorAll('input[name="sizes"]:checked')
      .forEach((checkbox) => {
        const size = checkbox.value;
        const stock = document.querySelector(
          `input[name="stock_${size.replace(" ", "").toLowerCase()}"]`
        ).value;
        dataEdit.append("sizes[]", size);
        dataEdit.append(`stock_${size.replace(" ", "").toLowerCase()}`, stock);
      });

    return dataEdit;
  }
}
