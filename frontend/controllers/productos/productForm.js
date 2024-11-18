import productoServices from "../../services/product_services.js";
import { prodcutFormHtml } from "./productFormHtml.js";

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
    const enableDiscountCheckbox = this.titulo.querySelector("#enableDiscount");
    enableDiscountCheckbox.addEventListener("change", () =>
      this.toggleDiscountInputs()
    );
    this.toggleDiscountInputs();
  }

  // Vaciar contenido
  clearForm() {
    this.titulo.innerHTML = "";
  }

  // Crear formulario dinámico
  createForm() {
    const card = document.createElement("div");
    card.className = "d-flex justify-content-center align-items-center"; // Centrar el contenedor del formulario

    card.innerHTML = prodcutFormHtml();
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

    if (selectedValue === "diversos") {
      // Si es "Diversos", oculta los talles y muestra el campo de stock general
      sizesContainer.classList.add("d-none");
      generalStockContainer.classList.remove("d-none");
    } else {
      // Si no es "Diversos", muestra los talles y oculta el stock general
      sizesContainer.classList.remove("d-none");
      generalStockContainer.classList.add("d-none");
    }
  }

  //talles seleccionados

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
      // Validar que solo se puedan seleccionar 2 imágenes
      const images = document.querySelector("[data-imageUrls]").files;
      if (images.length > 2) {
        e.preventDefault(); // Evitar el envío del formulario
        alert("Por favor, selecciona un máximo de 2 imágenes."); // Mensaje de alerta
        return; // Salir de la función
      }

      // Verificar la sección seleccionada
      const selectedSection = this.sectionSelect.value;

      // Validar que se haya seleccionado al menos un talle para secciones que no sean "Diversos"
      if (selectedSection !== "opcion3") {
        const selectedSizes = Array.from(
          document.querySelectorAll('input[name="sizes"]:checked')
        );
        if (selectedSizes.length === 0) {
          e.preventDefault(); // Evitar el envío del formulario
          alert("Por favor, selecciona al menos un talle."); // Mensaje de alerta
          return; // Salir de la función
        }
      } else {
        // Si es "Diversos", validar que se haya ingresado un stock general
        const generalStock = document.querySelector("#generalStock").value;
        if (!generalStock || parseInt(generalStock) <= 0) {
          e.preventDefault(); // Evitar el envío del formulario
          alert("Por favor, ingresar una cantidad de stock"); // Mensaje de alerta
          return; // Salir de la función
        }
      }

      // Si las validaciones son correctas, enviar el formulario
      e.preventDefault(); // Prevenir el envío predeterminado
      this.handleSubmit();
    });
  }

  // Función para mostrar u ocultar los campos de descuento y hacer obligatoria la expiración si está habilitado
  toggleDiscountInputs() {
    const isDiscountEnabled = document.getElementById("enableDiscount").checked;
    const discountFields = document.getElementById("discountFields");
    const discountPercentage = document.getElementById("discountPercentage");
    const discountExpiration = document.getElementById("discountExpiration");

    discountFields.style.display = isDiscountEnabled ? "block" : "none";
    discountPercentage.disabled = !isDiscountEnabled;
    discountExpiration.disabled = !isDiscountEnabled;

    // Hacer que la fecha de expiración sea obligatoria si el descuento está activado
    if (isDiscountEnabled) {
      discountExpiration.setAttribute("required", "required");
    } else {
      discountExpiration.removeAttribute("required");
    }
  }

  // Función para validar el formulario antes de enviarlo
  validateForm(event) {
    const isDiscountEnabled = document.getElementById("enableDiscount").checked;
    const discountExpiration =
      document.getElementById("discountExpiration").value;

    // Si el descuento está activado pero no se ha ingresado una fecha de expiración, muestra un alert
    if (isDiscountEnabled && !discountExpiration) {
      alert("Por favor, ingrese una fecha de expiración para el descuento.");
      event.preventDefault(); // Evita el envío del formulario
      return false;
    }
    return true;
  }

  async handleSubmit() {
    const name = document.querySelector("[data-name]").value;
    const price = parseFloat(document.querySelector("[data-price]").value);
    const description = document.querySelector("[data-description]").value;
    const isFeatured = document.getElementById("isFeatured").checked;
    const discount =
      parseInt(document.querySelector("[data-discount]").value) || 0;
    const discountExpiry =
      document.querySelector("[data-discount-expiry]").value || "";

    let productData = new FormData();
    productData.append("name", name);
    productData.append("price", price);
    productData.append("description", description);
    productData.append("section", this.sectionSelect.value);
    productData.append("isFeatured", isFeatured);
    productData.append("discount", discount);
    productData.append("discountExpiry", discountExpiry);

    // Agrega cada archivo de imagen al FormData
    const images = document.querySelector("[data-imageUrls]").files;
    for (const image of images) {
      productData.append("images[]", image);
    }

    // Capturar datos de stock dependiendo de la sección seleccionada
    if (this.sectionSelect.value === "opcion3") {
      productData.append(
        "generalStock",
        parseInt(document.getElementById("generalStock").value) || 0
      );
    } else {
      const sizesStock = this.collectSizesAndStock();
      productData.append("sizes", JSON.stringify(sizesStock));
    }

    // Mostrar los datos del FormData en la consola
    // for (let [key, value] of productData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      await productoServices.crearProducto(productData);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }
}
