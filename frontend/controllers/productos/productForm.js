import { modalControllers } from "../../modal/modal.js";
import productoServices from "../../services/product_services.js";

export class ProductForm {
  constructor(titulo) {
    this.titulo = titulo;
  }

  // Mostrar formulario
  render() {
    this.clearForm();
    const card = this.createForm();
    this.titulo.appendChild(card);
    this.setupFormSubmitHandler();
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
          <p>Modo selección de imágenes:</p>
          <p>a- Seleccionar una sola imagen</p>
          <p>b- Seleccionar varias imágenes para efecto carrusel.</p>
          <br>
          <div class="card-body w-100">
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
                <textarea class="form-control mt-3 mb-3 p-2" placeholder="Descripción" name="description" required data-description></textarea>
              </div>
              <p for="miMenuDesplegable">Sección</p>
              <div class="form-group">
                <select class="form-control mb-3 p-2" id="miMenuDesplegable" name="section">
                  <option value="opcion1">Vestidos</option>
                  <option value="opcion2">Polleras</option>
                  <option value="opcion3">Diversos</option>
                </select>
              </div>
              
              <!-- Añadir el campo para el stock -->
              <div class="form-group">
                <input class="form-control mt-3 mb-3 p-2" type="number" placeholder="Stock disponible" name="stock" required data-stock>
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
      </div>
    `;
    return card;
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
        <p>b- Seleccionar varias imagenes de una vez para efecto carrousel.</p>
        <br>
        <div class="card-body w-100">
          <form id="form" action="/api/createProduct" enctype="multipart/form-data" method="POST" data-form>
            <!-- Campos del formulario -->
            <!-- Imágenes, nombre, precio, descripción, sección -->
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
            <p for="miMenuDesplegable">Sección</p>
            <div class="form-group">
              <select class="form-control mb-3 p-2" id="miMenuDesplegable" name="section">
                <option value="opcion1">Vestidos</option>
                <option value="opcion2">Polleras</option>
                <option value="opcion3">Diversos</option>
              </select>
            </div >
            
            <!-- Talles disponibles y cantidad de stock -->
            <label for="variation_1">Talles y stock disponibles</label>
            <div class="form-group mb-4">
              <div class="form-row">
                <div class="col">
                  <div class="form-check-inline nt-2 me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 1" name="sizes" id="talle1">
                    <label class="form-check-label" for="talle1">Talle 1</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle1>
                  </div>
                </div>
                <div class="col">
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 2" name="sizes" id="talle2">
                    <label class="form-check-label" for="talle2">Talle 2</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle2>
                  </div>
                </div>
                <div class="col">
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 3" name="sizes" id="talle3">
                    <label class="form-check-label" for="talle3">Talle 3</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle3>
                  </div>
                </div>
                <div class="col">
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 4" name="sizes" id="talle4">
                    <label class="form-check-label" for="talle4">Talle 4</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle4>
                  </div>
                </div>
                <div class="col">
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 5" name="sizes" id="talle5">
                    <label class="form-check-label" for="talle5">Talle 5</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle5>
                  </div>
                </div>
              </div>
            </div>

            <!-- Checkbox para destacar producto -->
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

  // Capturar el evento submit
  setupFormSubmitHandler() {
    const form = this.titulo.querySelector("[data-form]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  // Recopilar y enviar los datos
  async handleSubmit() {
    const name = document.querySelector("[data-name]").value;
    const price = parseFloat(document.querySelector("[data-price]").value);
    const description = document.querySelector("[data-description]").value;
    const section = document.getElementById("miMenuDesplegable").value;
    const images = document.querySelector("[data-imageUrls]").files;
    const isFeatured = document.getElementById("isFeatured").checked;

    // Capturar talles seleccionados y sus stocks
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

    const productData = new FormData();
    productData.append("name", name);
    productData.append("price", price);
    productData.append("description", description);
    productData.append("section", section);
    productData.append("isFeatured", isFeatured);

    // Agrega cada archivo de imagen al FormData
    for (const image of images) {
      productData.append("images[]", image);
    }

    // Adjuntar los talles seleccionados y sus stocks
    selectedSizes.forEach(({ size, stock }) => {
      const normalizedSize = size.replace(" ", "_").toLowerCase();
      productData.append("sizes[]", size);
      productData.append(`stock_${normalizedSize}`, stock);
    });

    // Imprimir el contenido del FormData para depuración
    for (let pair of productData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await productoServices.crearProducto(productData);
      modalControllers.modalProductoCreado();
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }
}
