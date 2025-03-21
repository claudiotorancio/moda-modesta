import { mostrarProducto } from "../../controllers/productos/ProductViewer.js";
import { handleEdit } from "./handleEdit.js";
import { setupFormSubmitHandler } from "./setupFormSubmitHandler.js.js";
import { handleDesactivate, handleActivate } from "./productEventHandler.js";

export class ProductCard {
  constructor(
    id,
    name,
    price,
    imagePath,
    description,
    sizes,
    hayStock,
    isFeatured,
    isActive,
    inCart,
    section,
    generalStock,
    discount,
    discountExpiry
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.imagePath = imagePath;
    this.description = description;
    this.sizes = sizes;
    this.hayStock = hayStock;
    this.isFeatured = isFeatured;
    this.isActive = isActive;
    this.inCart = inCart;
    this.section = section;
    this.generalStock = generalStock;
    this.discount = discount;
    this.discountExpiry = discountExpiry;
  }

  async mostrarProducto() {
    await mostrarProducto.call(this);
  }

  async handleEdit() {
    await handleEdit.call(this);
  }

  async setupFormSubmitHandler() {
    await setupFormSubmitHandler.call(this);
  }

  // Aquí es donde manejamos todos los event listeners dentro de la clase
  addEventListeners(card) {
    card
      .querySelector("[data-veradmin]")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        await this.mostrarProducto();
      });

    const toggleButton = card.querySelector(
      ".desactivar-producto, .activar-producto"
    );

    toggleButton.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        let confirmacion;
        if (this.isActive) {
          confirmacion = await handleDesactivate(this.id);
        } else {
          confirmacion = await handleActivate(this.id);
        }

        // Cambiar el estado del botón solo si el usuario confirma
        if (confirmacion) {
          this.isActive = !this.isActive; // Cambiar el estado del producto
          toggleButton.textContent = this.isActive ? "Desactivar" : "Activar"; // Cambiar el texto del botón
          toggleButton.classList.toggle("btn-danger", this.isActive);
          toggleButton.classList.toggle("btn-success", !this.isActive);
        }
      } catch (error) {
        console.error("Error al activar/desactivar producto:", error);
      }
    });

    card.querySelector("[data-edit]").addEventListener("click", (e) => {
      e.preventDefault();
      this.handleEdit();
    });
  }

  render() {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      ${
        this.discount
          ? `<div class="offer-badge">
      <span>¡${this.discount}% de Descuento!</span>
    </div>`
          : ""
      }
    <div class="container mx-auto mt-4">
      <div class="img-card">
        <img class="card-img-top" src="${this.imagePath[0]}" alt="">
      </div>

      <!-- Mostrar "Sí" o "No" sin interacción -->
      <div class="mt-2">
        <label>Producto destacado:</label>
        <p>${this.isFeatured ? "Sí" : "No"}</p>
      </div>
      <div class="mt-2">
        <label>Hay stock:</label>
        <p>${this.hayStock ? "Sí" : "No"}</p>
      </div>

      <div class="card-body">
        <a href="#" data-veradmin>ver producto</a>
        <h3 class="card-title">${this.name}</h3>
        <p class="card-text">${"$" + this.price}</p>
        <a href="#form" class="btn btn-primary" id="${
          this.id
        }" data-edit>Editar</a>
        ${
          this.isActive
            ? `<button class="btn btn-danger desactivar-producto" type="button" id="${this.id}">Desactivar</button>`
            : `<button class="btn btn-success activar-producto" type="button" id="${this.id}">Activar</button>`
        }
      </div>
    </div>
    `;

    // Llamamos al método addEventListeners dentro de la clase, pasando la tarjeta generada
    this.addEventListeners(card);

    return card;
  }
}
