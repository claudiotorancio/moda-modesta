import productoServices from "../../services/product_services.js";
import { controllers } from "./productos_controllers.js";

export class ProductForm {
  constructor(titulo) {
    this.titulo = titulo;
    this.render();
    this.setupSelectChangeHandler();
    this.updateSizesVisibility(); // Llama a la función al iniciar para ocultar talles si es necesario
  }

  // Mostrar formulario
  render() {
    this.clearForm();
    const card = this.createForm();
    this.titulo.appendChild(card);

    this.setupSelectChangeHandler();
    this.updateSizesVisibility(); // Llama a la función al iniciar para ocultar talles si es necesario
    this.setupFormSubmitHandler();
  }

  mostrarProducts() {
    document.querySelectorAll(".categoria").forEach((categoria) => {
      categoria.querySelector(".texto-categoria").style.display = "flex";
      controllers.renderProducts();
    });
  }

  // Vaciar contenido
  clearForm() {
    this.titulo.innerHTML = "";
  }

  // Crear formulario dinámico
  createForm() {
    const card = document.createElement("div");
    card.className = "d-flex justify-content-center align-items-center"; // Centrar el contenedor del formulario

    card.innerHTML = `
    <div>
      <div class="text-center">
        <div class="card-header mb-2">
          <h3 style="font-weight: bold;">Agregar producto</h3>
        </div>
        <p>Modo seleccion de imagenes:</p>
        <p>a- Seleccionar una sola imagen</p>
        <p>b- Seleccionar dos (2) imagenes de una vez para efecto carrousel.</p>
        <br>
        <div class="card-body w-100">
          <form id="form" action="/api/createProduct" enctype="multipart/form-data" method="POST" data-form>

            <p for="miMenuDesplegable">Sección</p>
            <div class="form-group">
              <select class="form-control mb-3 p-2" id="miMenuDesplegable" name="section">
                <option value="opcion1">Vestidos</option>
                <option value="opcion2">Polleras</option>
                <option value="opcion3">Diversos</option>
              </select>
            </div>

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
              <textarea class="form-control mt-3 mb-3 p-2" placeholder="Descripción" name="description" required data-description></textarea>
            </div>
            
            <!-- Talles disponibles y cantidad de stock -->
         
            <div class="form-group mb-4 sizes-container"> <!-- Añade una clase aquí -->
               <label for="variation_1">Talles y stock disponibles</label>
              <div class="form-row">
                <div class="col-center flex">
                  <div class="form-check-inline nt-2 me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 1" name="sizes" id="talle1">
                    <label class="form-check-label" for="talle1">Talle 1</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle1>
                  </div>
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 2" name="sizes" id="talle2">
                    <label class="form-check-label" for="talle2">Talle 2</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle2>
                  </div>
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 3" name="sizes" id="talle3">
                    <label class="form-check-label" for="talle3">Talle 3</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle3>
                  </div>
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 4" name="sizes" id="talle4">
                    <label class="form-check-label" for="talle4">Talle 4</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle4>
                  </div>
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 5" name="sizes" id="talle5">
                    <label class="form-check-label" for="talle5">Talle 5</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle5>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group general-stock-container d-none"> <!-- Oculto por defecto -->
  <label for="generalStock">Stock general</label>
  <input type="number" min="0" class="form-control mt-2" placeholder="Stock" id="generalStock" name="generalStock">
</div>


            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="isFeatured" name="isFeatured">
                <label class="form-check-label" for="isFeatured">Destacar producto</label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg">Agregar</button>
          </form>
        </div>
      </div>
    </div>
  `;
    return card;
  }

  // Configurar el evento change en el select
  setupSelectChangeHandler() {
    const sectionSelect = this.titulo.querySelector("#miMenuDesplegable");
    sectionSelect.addEventListener("change", () =>
      this.updateSizesVisibility()
    );
  }

  // Lógica para actualizar la visibilidad de los talles
  updateSizesVisibility() {
    const sectionSelect = document.getElementById("miMenuDesplegable");
    const sizesContainer = document.querySelector(".sizes-container");
    const generalStockContainer = document.querySelector(
      ".general-stock-container"
    );
    const selectedValue = sectionSelect.value;

    if (selectedValue === "opcion3") {
      // Si es "Diversos", oculta los talles y muestra el campo de stock general
      sizesContainer.classList.add("d-none");
      generalStockContainer.classList.remove("d-none");
    } else {
      // Si no es "Diversos", muestra los talles y oculta el stock general
      sizesContainer.classList.remove("d-none");
      generalStockContainer.classList.add("d-none");
    }
  }

  // Capturar el evento submit
  setupFormSubmitHandler() {
    const form = this.titulo.querySelector("[data-form]");
    form.addEventListener("submit", (e) => {
      const images = document.querySelector("[data-imageUrls]").files;

      // Validar que solo se puedan seleccionar 2 imágenes
      if (images.length > 2) {
        e.preventDefault(); // Evitar el envío del formulario
        alert("Por favor, selecciona un máximo de 2 imágenes."); // Mensaje de alerta
        return; // Salir de la función
      }

      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const name = document.querySelector("[data-name]").value;
    const price = parseFloat(document.querySelector("[data-price]").value);
    const description = document.querySelector("[data-description]").value;
    const section = document.getElementById("miMenuDesplegable").value;
    const images = document.querySelector("[data-imageUrls]").files;
    const isFeatured = document.getElementById("isFeatured").checked;

    let productData = new FormData();
    productData.append("name", name);
    productData.append("price", price);
    productData.append("description", description);
    productData.append("section", section);
    productData.append("isFeatured", isFeatured);

    // Agrega cada archivo de imagen al FormData
    for (const image of images) {
      productData.append("images[]", image);
    }

    // Capturar datos de stock dependiendo de la sección seleccionada
    if (section === "opcion3") {
      // Si es "Diversos", capturar el stock general
      const generalStock =
        parseInt(document.getElementById("generalStock").value) || 0;
      productData.append("generalStock", generalStock);
    } else {
      // Si no es "Diversos", capturar los talles y sus stocks
      const selectedSizes = Array.from(
        document.querySelectorAll('input[name="sizes"]:checked')
      ).map((checkbox) => {
        const size = checkbox.value;
        const stockInput = document.querySelector(
          `[data-stock-${size.toLowerCase().replace(" ", "")}]`
        );
        const stock = stockInput ? parseInt(stockInput.value) : 0;
        return { size, stock };
      });

      productData.append("sizes", JSON.stringify(selectedSizes));
    }

    try {
      await productoServices.crearProducto(productData);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }
}
