import productoServices from "../../services/product_services.js";

export class ProductForm {
  constructor(titulo) {
    this.titulo = titulo;
    this.sectionSelect = null;
    this.render();
  }

  // Mostrar formulario
  render() {
    this.clearForm();
    const card = this.createForm();
    this.titulo.appendChild(card);
    this.sectionSelect = this.titulo.querySelector("#miMenuDesplegable");
    this.setupSelectChangeHandler();
    this.updateSizesVisibility();
    this.setupFormSubmitHandler();
  }

  // Vaciar contenido
  clearForm() {
    this.titulo.innerHTML = "";
  }

  // Crear formulario dinámico
  createForm() {
    const card = document.createElement("div");
    card.classList.add("card", "card-body", "p-3");

    card.innerHTML = `
      <form class="formulario" method="POST" enctype="multipart/form-data">
        <div class="mb-3">
          <label>Nombre del Producto</label>
          <input class="form-control p-2" type="text" name="name" data-name required autofocus />
        </div>
        <div class="mb-3">
          <label>Precio</label>
          <input class="form-control p-2" type="number" step="0.01" name="price" data-price required />
        </div>
        <div class="mb-3">
          <label>Descripción</label>
          <textarea class="form-control p-2" name="description" data-description required></textarea>
        </div>
        <div class="mb-3">
          <label>Imágenes</label>
          <input class="form-control p-2" type="file" name="images" data-imageUrls multiple required autofocus accept="image/*" max="2" />
        </div>
        <div class="mb-3">
          <label>Sección</label>
          <select id="miMenuDesplegable" class="form-control p-2">
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>
        <div id="sizesSection" class="mb-3">
          <label>Selecciona los talles disponibles:</label>
          <div>
            <label><input type="checkbox" name="sizes" value="XS"> XS</label>
            <input type="number" placeholder="Stock XS" data-stock-xs style="display: none;" />
            <label><input type="checkbox" name="sizes" value="S"> S</label>
            <input type="number" placeholder="Stock S" data-stock-s style="display: none;" />
            <label><input type="checkbox" name="sizes" value="M"> M</label>
            <input type="number" placeholder="Stock M" data-stock-m style="display: none;" />
            <label><input type="checkbox" name="sizes" value="L"> L</label>
            <input type="number" placeholder="Stock L" data-stock-l style="display: none;" />
            <label><input type="checkbox" name="sizes" value="XL"> XL</label>
            <input type="number" placeholder="Stock XL" data-stock-xl style="display: none;" />
          </div>
        </div>
        <div id="generalStockSection" class="mb-3" style="display: none;">
          <label>Stock General</label>
          <input class="form-control p-2" type="number" id="generalStock" name="generalStock" />
        </div>
        <div class="mb-3">
          <label><input type="checkbox" id="isFeatured" /> Producto destacado</label>
        </div>
        <button type="submit" class="btn btn-primary">Crear Producto</button>
      </form>
    `;
    return card;
  }

  // Configurar el evento change en el select
  setupSelectChangeHandler() {
    if (this.sectionSelect) {
      this.sectionSelect.addEventListener("change", () =>
        this.updateSizesVisibility()
      );
    }
  }

  // Lógica para actualizar la visibilidad de los talles
  updateSizesVisibility() {
    const sizesContainer = document.querySelector(".sizes-container");
    const generalStockContainer = document.querySelector(
      ".general-stock-container"
    );
    const selectedValue = this.sectionSelect.value;

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

  collectSizesAndStock() {
    const selectedSizes = Array.from(
      document.querySelectorAll('input[name="sizes"]:checked')
    ).map((checkbox) => {
      const size = checkbox.value;
      const stockInput = document.querySelector(
        `[data-stock-${size.toLowerCase().replace(" ", "")}]`
      );
      return { size, stock: stockInput ? parseInt(stockInput.value) : 0 };
    });
    return selectedSizes;
  }

  // Capturar el evento submit
  setupFormSubmitHandler() {
    const form = this.titulo.querySelector("[data-form]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const name = document.querySelector("[data-name]").value;
    const price = parseFloat(document.querySelector("[data-price]").value);
    const description = document.querySelector("[data-description]").value;
    const isFeatured = document.getElementById("isFeatured").checked;

    let productData = new FormData();
    productData.append("name", name);
    productData.append("price", price);
    productData.append("description", description);
    productData.append("section", this.sectionSelect.value);
    productData.append("isFeatured", isFeatured);

    // Agrega cada archivo de imagen al FormData
    const images = document.querySelector("[data-imageUrls]").files;
    for (const image of images) {
      productData.append("images[]", image);
    }

    // Capturar datos de stock dependiendo de la sección seleccionada
    if (this.sectionSelect.value === "opcion3") {
      // Si es "Diversos", capturar el stock general
      productData.append(
        "generalStock",
        parseInt(document.getElementById("generalStock").value) || 0
      );
    } else {
      // Si no es "Diversos", capturar los talles y sus stocks
      const sizesStock = this.collectSizesAndStock();
      productData.append("sizes", JSON.stringify(sizesStock));
    }

    try {
      await productoServices.crearProducto(productData);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }
}
