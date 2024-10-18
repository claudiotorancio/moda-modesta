import productoServices from "../../services/product_services.js";

export class ProductForm {
  constructor(titulo) {
    this.titulo = titulo;
    this.sectionSelect = null; // Referencia al select de sección
    this.sectionSelectHandler = null; // Almacena el manejador del evento select
    this.render();
  }

  render() {
    this.clearForm();
    const card = this.createForm();
    this.titulo.appendChild(card);

    this.sectionSelect = this.titulo.querySelector("#miMenuDesplegable");
    this.setupSelectChangeHandler();
    this.updateSizesVisibility();
    this.setupFormSubmitHandler();
  }

  clearForm() {
    this.titulo.innerHTML = "";
  }

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

  setupSelectChangeHandler() {
    const sectionSelect = this.sectionSelect;
    if (!this.sectionSelectHandler) {
      this.sectionSelectHandler = () => this.updateSizesVisibility();
      sectionSelect.addEventListener("change", this.sectionSelectHandler);
    }
  }

  updateSizesVisibility() {
    const selectedValue = this.sectionSelect.value;
    const sizesSection = document.getElementById("sizesSection");
    const generalStockSection = document.getElementById("generalStockSection");

    if (selectedValue === "opcion3") {
      sizesSection.style.display = "none";
      generalStockSection.style.display = "block";
    } else {
      sizesSection.style.display = "block";
      generalStockSection.style.display = "none";
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

  setupFormSubmitHandler() {
    const form = this.titulo.querySelector("form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleSubmit();
    });
  }

  async handleSubmit() {
    const productData = new FormData();
    productData.append("name", document.querySelector("[data-name]").value);
    productData.append(
      "price",
      parseFloat(document.querySelector("[data-price]").value)
    );
    productData.append(
      "description",
      document.querySelector("[data-description]").value
    );
    productData.append("section", this.sectionSelect.value);
    productData.append(
      "isFeatured",
      document.getElementById("isFeatured").checked
    );

    // Agregar imágenes
    const images = document.querySelector("[data-imageUrls]").files;
    for (const image of images) {
      productData.append("images[]", image);
    }

    // Manejo del stock según la sección
    if (this.sectionSelect.value === "opcion3") {
      productData.append(
        "generalStock",
        parseInt(document.getElementById("generalStock").value) || 0
      );
    } else {
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
