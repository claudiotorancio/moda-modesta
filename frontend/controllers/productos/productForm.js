import { modalControllers } from "../../modal/modal.js";
import productoServices from "../../services/product_services.js";

export class ProductForm {
  constructor() {
    this.initForm = document.querySelector("[data-table]");
  }

  // Mostrar formulario
  render() {
    this.clearForm();
    const card = this.createForm();
    this.initForm.appendChild(card);
    this.setupFormSubmitHandler();
  }

  // Vaciar contenido
  clearForm() {
    this.initForm.innerHTML = "";
  }

  // Crear formulario dinámico
  createForm() {
    modalControllers.baseModal();
    const card = document.createElement("div");
    card.classList.add("modalVisor");
    card.innerHTML = `
    <div class="text-center">
      <div class="card-header">
        <p>Agregar producto</p>
      </div>
      <div class="card-form">
        <form id="form" action="/api/createProduct" enctype="multipart/form-data" method="POST" data-form>
          <div class="form-group">
            <input class="form-control p-2" type="file" name="images" data-imageUrls multiple required autofocus>
          </div>
          <div class="form-group">
       <input class="form-control mt-3 p-2" type="text" placeholder="Nombre del producto" name="name" required data-name>

          </div>
          <div class="form-group">
            <input class="form-control mt-3 mb-3 p-2" type="text" placeholder="Precio del producto" name="price" required data-price>
          </div>
          <div class="form-group">
            <textarea class="form-control mt-3 mb-3 p-2" type="text" placeholder="Descripción" name="description" required data-description></textarea>
          </div>
          <p for="miMenuDesplegable">Sección</p>
          <div class="form-group">
            <select class="form-control mb-3 p-2" id="miMenuDesplegable" name="section">
              <option value="opcion1">Vestidos</option>
              <option value="opcion2">Polleras</option>
              <option value="opcion3">Diversos</option>
            </select>
          </div>
          <label for="variation_1">Talles disponibles</label>
          <div class="form-group mb-4">
            <!-- Checkbox de talles disponibles -->
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 1" name="sizes" id="talle1">
              <label class="form-check-label" for="talle1">Talle 1</label>
            </div>
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 2" name="sizes" id="talle2">
              <label class="form-check-label" for="talle2">Talle 2</label>
            </div>
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 3" name="sizes" id="talle3">
              <label class="form-check-label" for="talle3">Talle 3</label>
            </div>
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 4" name="sizes" id="talle4">
              <label class="form-check-label" for="talle4">Talle 4</label>
            </div>
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 5" name="sizes" id="talle5">
              <label class="form-check-label" for="talle5">Talle 5</label>
            </div>
          </div>

          <!-- Checkbox para destacar producto -->
          <div class="form-group">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="isFeatured" name="isFeatured">
              <label class="form-check-label" for="isFeatured">
                Destacar producto
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg">Agregar</button>
        </form>
      </div>
    </div>
  `;
    return card;
  }

  // Capturar el evento submit
  setupFormSubmitHandler() {
    const form = this.initForm.querySelector("[data-form]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  // Recopilar y enviar los datos
  async handleSubmit() {
    // Captura los valores del formulario
    const name = document.querySelector("[data-name]").value;
    const price = parseFloat(document.querySelector("[data-price]").value);
    const description = document.querySelector("[data-description]").value;
    const section = document.getElementById("miMenuDesplegable").value;
    const images = document.querySelector('input[type="file"]').files;
    const isFeatured = document.getElementById("isFeatured").checked;

    // Verifica que los campos obligatorios no estén vacíos
    if (!name || isNaN(price) || !description || !section || !images.length) {
      console.error("Por favor completa todos los campos requeridos.");
      return;
    }

    // Captura todos los checkboxes seleccionados
    const selectedSizes = Array.from(
      document.querySelectorAll('input[name="sizes"]:checked')
    ).map((checkbox) => checkbox.value);

    // Crea un nuevo FormData
    const productData = new FormData();
    productData.append("name", name);
    productData.append("price", price);
    productData.append("description", description);
    productData.append("section", section);
    productData.append("isFeatured", isFeatured);
    productData.append("images", images);

    // Agrega los talles seleccionados al FormData
    selectedSizes.forEach((size) => productData.append("sizes[]", size));

    // Envía la solicitud
    try {
      await productoServices.crearProducto(productData);
      modalControllers.modalProductoCreado();
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }
}

const productForm = new ProductForm();

export default productForm;
