import { modalControllers } from "../../modal/modal.js";
import productoServices from "../../services/product_services.js";

export class ProductEditor {
  constructor() {
    this.modal = document.getElementById("modal");
    this.productoEdicion = this.modal.querySelector("[data-table]");
  }

  editProduct(name, price, imagePath, description, sizes, id, isFeatured) {
    this.renderEditor(
      name,
      price,
      imagePath,
      description,
      sizes,
      id,
      isFeatured
    );
    this.setupFormSubmitHandler(id);
  }

  renderEditor(name, price, imagePath, description, sizes, id, isFeatured) {
    modalControllers.baseModal();

    this.productoEdicion.innerHTML = `
      <div class="text-center">
        <div class="card-header">
          <img class="img-card-top mx-auto" style="width: 10rem;" src="${imagePath}" alt="">
          <form action="/api/updateProduct/${id}" id="form" enctype="multipart/form-data" method="POST" data-forma>
            <p class="parrafo">Producto a editar</p>
            <div class="form-group">
              <input class="form-control p-2" placeholder="imageUrl" type="file" name="imagePath" data-image autofocus>
              <input type="hidden" class="oldImagePath" name="oldImagePath" value="${imagePath}" data-oldPath>
            </div>
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

            <label for="sizes">Modificar talles</label>
            <div class="form-group mb-4">
              ${this.renderSizeOptions(sizes)}
            </div>
  
            <button type="submit" class="btn btn-primary btn-lg">Editar producto</button>
          </form>
        </div>
      </div>
    `;
    this.productoEdicion.classList.add("modalVisor");
  }

  renderSizeOptions(selectedSizes = []) {
    const sizes = ["Talle 1", "Talle 2", "Talle 3", "Talle 4", "Talle 5"];
    return sizes
      .map(
        (size) => `
          <div class="form-check-inline me-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              value="${size}" 
              name="sizes" 
              id="${size.replace(" ", "").toLowerCase()}" 
              ${selectedSizes.includes(size) ? "checked" : ""}
            >
            <label 
              class="form-check-label" 
              for="${size.replace(" ", "").toLowerCase()}">
              ${size}
            </label>
          </div>
        `
      )
      .join("");
  }

  setupFormSubmitHandler(id) {
    const form = this.productoEdicion.querySelector("[data-forma]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.querySelector("[data-nombre]").value;
      const price = document.querySelector("[data-precio]").value;
      const description = document.querySelector("[data-description]").value;
      const imagePath = document.querySelector("[data-image]").files[0];
      const oldImagePath = document.querySelector("[data-oldPath]").value;
      const isFeatured = document.querySelector("#isFeatured").checked;

      const selectedSizes = Array.from(
        document.querySelectorAll('input[name="sizes"]:checked')
      ).map((checkbox) => checkbox.value);

      const dataEdit = new FormData();
      if (imagePath) {
        dataEdit.append("imagePath", imagePath);
      }
      dataEdit.append("name", name);
      dataEdit.append("price", price);
      dataEdit.append("description", description);
      dataEdit.append("oldImagePath", oldImagePath);
      dataEdit.append("isFeatured", isFeatured);

      selectedSizes.forEach((size) => dataEdit.append("sizes[]", size));

      try {
        await productoServices.actualizarProducto(dataEdit, id);
        modalControllers.modalProductoEditado();
      } catch (err) {
        console.error("Error al actualizar el producto:", err);
        alert(
          "Ocurrió un error al actualizar el producto. Por favor, intenta nuevamente."
        );
      }
    });
  }
}
