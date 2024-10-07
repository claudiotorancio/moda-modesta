import { modalControllers } from "../../modal/modal.js";
import productoServices from "../../services/product_services.js";

export class ProductEditor {
  constructor() {
    this.modal = document.getElementById("modal");
    this.productoEdicion = this.modal.querySelector("[data-table]");
  }

  editProduct(id, name, price, imagePath, description, sizes, isFeatured) {
    this.renderEditor(
      id,
      name,
      price,
      imagePath,
      description,
      sizes,
      isFeatured
    );
    this.setupFormSubmitHandler(id);
  }

  renderEditor(id, name, price, imagePath, description, sizes, isFeatured) {
    modalControllers.baseModal();

    this.productoEdicion.innerHTML = `
      <div class="text-center">
        <div class="card-header d-flex flex-wrap justify-content-center" style="max-width: 100%; overflow-x: auto;">
          ${imagePath
            .map(
              (path, index) => `
            <div class="me-4 text-center" style="flex: 0 0 auto;">
              <img class="img-fluid" style="max-width: 10rem;" src="${path}" alt="Imagen ${
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
            }Check" class="form-check-input" name="image${
              index + 1
            }Check" data-check-image${index + 1}>
            <label for="image${
              index + 1
            }Check" class="form-check-label">Actualizar Imagen ${
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
          <textarea class="form-control mt-3 mb-3 p-2" placeholder="Descripción" required data-description>${description}</textarea>
        </div>
        <div class="form-group form-check mb-3">
          <input type="checkbox" class="form-check-input" id="isFeatured" name="isFeatured" ${
            isFeatured ? "checked" : ""
          }>
          <label class="form-check-label" for="isFeatured">Destacar producto</label>
        </div>
        <label for="sizes">Modificar talles y stocks </label>
        <div class="form-group mb-4">
          ${this.renderSizeOptions(sizes)}
        </div>
        <button type="submit" class="btn btn-primary btn-lg">Editar producto</button>
      </form>
    `;

    this.productoEdicion.classList.add("modalVisor");

    this.setupImageCheckListeners();
  }

  renderSizeOptions(selectedSizes = []) {
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

  setupImageCheckListeners() {
    const imageChecks = document.querySelectorAll(
      "[data-check-image1], [data-check-image2], [data-check-image3]"
    );
    const imageInputs = document.querySelectorAll(
      "[data-image1], [data-image2], [data-image3]"
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

    // Habilitar/Deshabilitar inputs de stock basados en el estado del checkbox
    const sizeChecks = document.querySelectorAll('input[name="sizes"]');
    const stockInputs = document.querySelectorAll('input[name^="stock_"]');

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

      if (imagePath1 && imagePath2) {
        alert(
          "Solo puedes reemplazar una imagen. Si necesitas reemplazar ambas, debes crear un nuevo producto."
        );
        return;
      }

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

      selectedSizes.forEach(({ size, stock }) => {
        const normalizedSize = size.replace(" ", "_").toLowerCase();
        dataEdit.append("sizes[]", size);
        dataEdit.append(`stock_${normalizedSize}`, stock);
      });

      // for (let [key, value] of dataEdit.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

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
