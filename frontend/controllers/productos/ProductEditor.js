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
  <div class="card-header d-flex justify-content-center">
    <div class="me-4">
      <img class="img-card-top" style="width: 10rem;" src="${
        imagePath[0]
      }" alt="Imagen 1">
      <p class="text-muted">Imagen 1</p>
    </div>
    <div>
      <img class="img-card-top" style="width: 10rem;" src="${
        imagePath[1]
      }" alt="Imagen 2">
      <p class="text-muted">Imagen 2</p>
    </div>
  </div>
</div>

     
          <form action="/api/updateProduct/${id}" id="form" enctype="multipart/form-data" method="POST" data-forma>
            <p class="parrafo">Producto a editar</p>
            
            <div class="form-group">
              <input type="checkbox" id="image1Check" class="form-check-input" name="image1Check" data-check-image1>
              <label for="image1Check" class="form-check-label">Actualizar Imagen 1</label>
              <input class="form-control p-2 mt-2" placeholder="imageUrl" type="file" name="imagePath1" data-image1 disabled>
              <input type="hidden" class="oldImagePath" name="oldImagePath1" value="${
                imagePath[0]
              }" data-oldPath1>
            </div>
            
            <div class="form-group">
              <input type="checkbox" id="image2Check" class="form-check-input" name="image2Check" data-check-image2>
              <label for="image2Check" class="form-check-label">Actualizar Imagen 2</label>
              <input class="form-control p-2 mt-2" placeholder="imageUrl" type="file" name="imagePath2" data-image2 disabled>
              <input type="hidden" class="oldImagePath" name="oldImagePath2" value="${
                imagePath[1]
              }" data-oldPath2>
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

    this.setupImageCheckListeners();
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

  setupImageCheckListeners() {
    const image1Check = document.querySelector("[data-check-image1]");
    const image2Check = document.querySelector("[data-check-image2]");
    const image1Input = document.querySelector("[data-image1]");
    const image2Input = document.querySelector("[data-image2]");

    // Deshabilitar inputs inicialmente
    image1Input.disabled = !image1Check.checked;
    image2Input.disabled = !image2Check.checked;

    image1Check.addEventListener("change", () => {
      if (image1Check.checked && image2Check.checked) {
        alert(
          "Solo puedes reemplazar una imagen. Para reemplazar ambas, crea un nuevo producto."
        );
        image1Check.checked = false;
        image1Input.disabled = true;
      } else {
        image1Input.disabled = !image1Check.checked;
      }
    });

    image2Check.addEventListener("change", () => {
      if (image2Check.checked && image1Check.checked) {
        alert(
          "Solo puedes reemplazar una imagen. Para reemplazar ambas, crea un nuevo producto y si es neceario elimina este."
        );
        image2Check.checked = false;
        image2Input.disabled = true;
      } else {
        image2Input.disabled = !image2Check.checked;
      }
    });
  }

  setupFormSubmitHandler(id) {
    const form = this.productoEdicion.querySelector("[data-forma]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const imagePath1 = document.querySelector("[data-image1]").files[0];
      const imagePath2 = document.querySelector("[data-image2]").files[0];

      // Validar si ambas imágenes están siendo reemplazadas
      if (imagePath1 && imagePath2) {
        alert(
          "Solo puedes reemplazar una imagen. Si necesitas reemplazar ambas, debes crear un nuevo producto."
        );
        return;
      }

      // Obtener otros campos del formulario
      const name = document.querySelector("[data-nombre]").value;
      const price = document.querySelector("[data-precio]").value;
      const description = document.querySelector("[data-description]").value;
      const isFeatured = document.querySelector("#isFeatured").checked;
      const selectedSizes = Array.from(
        document.querySelectorAll('input[name="sizes"]:checked')
      ).map((checkbox) => checkbox.value);

      const dataEdit = new FormData();

      // Adjuntar la imagen correspondiente al FormData
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

      // Adjuntar los demás datos del formulario
      dataEdit.append("name", name);
      dataEdit.append("price", price);
      dataEdit.append("description", description);
      dataEdit.append("isFeatured", isFeatured);

      // Adjuntar los talles seleccionados
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
