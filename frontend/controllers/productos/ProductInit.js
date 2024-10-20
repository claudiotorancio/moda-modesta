import { mostrarProducto } from "./ProductViewer.js";
import { comprarProducto } from "../carrito/comprarProducto.js";
import { modalControllers } from "../../modal/modal.js";

export class ProductInit {
  constructor(
    id,
    name,
    price,
    imagePath,
    description,
    sizes,
    hayStock,
    section,
    generalStock
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.imagePath = imagePath;
    this.description = description;
    this.sizes = sizes;
    this.hayStock = hayStock;
    this.section = section; // Añadimos la categoría (opcion3)
    this.generalStock = generalStock;
  }

  mensajeStockHandler() {
    const { hayStock } = this;

    return hayStock
      ? `<button type="button" class="btn btn-primary btn-block mt-2" data-compra>Comprar</button>`
      : `<span class="text-danger font-weight-bold">Sin stock</span>`;
  }

  updateModalContent(content) {
    modalControllers.baseModal();
    const modal = document.getElementById("modal");
    const contentContainer = modal.querySelector("[data-table]");
    contentContainer.innerHTML = content;
  }

  getStockButtonHTML() {
    return this.hayStock
      ? `<button type="button" class="btn btn-primary btn-block mt-2" data-compra>Comprar</button>`
      : `<span class="text-danger font-weight-bold">Sin stock</span>`;
  }

  getTallesSelectHTML() {
    return `
      <label for="variation_1" class="form-label">Talles disponibles</label>
      <select id="variation_1" class="form-select mb-3">
        ${this.sizes
          .filter((item) => item.stock > 0)
          .map((item) => `<option value="${item.size}">${item.size}</option>`)
          .join("")}
      </select>
      <div class="text-center">
        <button type="button" class="btn btn-primary btn-block" data-carrito>Agregar al carrito</button>
      </div>
      <p id="message" class="mt-3 text-center"></p>`;
  }

  getAmountSelectHTML() {
    // Generar las opciones del select según el stock disponible
    const options = Array.from(
      { length: this.generalStock },
      (_, i) => `<option value="${i + 1}">${i + 1}</option>`
    ).join("");

    return `
      <label for="quantity" class="form-label">Seleccione la cantidad</label>
      <select id="quantity" class="form-select mb-3">
        ${options}
      </select>
      <div class="text-center">
        <button type="button" class="btn btn-primary btn-block" data-carrito>Agregar al carrito</button>
      </div>
      <p id="message" class="mt-3 text-center"></p>`;
  }

  zoomImageHandler() {
    const content = `
      <img class="card-img-top" src="${this.imagePath[0]}" alt="imagen del producto">
      <div class="d-flex justify-content-center">
        <a href="#" type="button" class="btn btn-info btn-sm mt-2">Ver Detalles</a>
      </div>`;

    this.updateModalContent(content);

    document
      .querySelector("a.btn-info")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        window.location.hash = `product-${this.id}`;
        try {
          await mostrarProducto(
            this.id,
            this.name,
            this.price,
            this.imagePath,
            this.description,
            this.sizes,
            this.hayStock,
            this.section,
            this.generalStock
          );
        } catch (err) {
          console.error(err);
        }
      });
  }

  containerTallesHandler() {
    const content = this.getTallesSelectHTML();

    this.updateModalContent(content);

    document.querySelector("[data-carrito]").addEventListener("click", () => {
      const talleSeleccionado = document.getElementById("variation_1").value;
      comprarProducto(
        this.id,
        this.name,
        this.price,
        this.imagePath,
        this.sizes,
        talleSeleccionado
      );
    });
  }

  containerAmountHandler() {
    const content = this.getAmountSelectHTML();

    this.updateModalContent(content);

    document.querySelector("[data-carrito]").addEventListener("click", () => {
      const cantidadSeleccionada = document.getElementById("quantity").value;
      comprarProducto(
        this.id,
        this.name,
        this.price,
        this.imagePath,
        this.sizes,
        cantidadSeleccionada,
        this.section,
        this.generalStock
      );
    });
  }

  productoInicio() {
    const card = document.createElement("div");
    const contenido = `
      <div class="container mx-auto mt-4">
        <div class="img-card">
          <img class="card-img-top" src="${
            this.imagePath[0]
          }" alt="imagen del producto">
          <!-- Ícono de lupa -->
          <div class="overlay-icon">
            <i class="fas fa-search-plus"></i>
          </div>
        </div>
        <div class="card-body text-center">
          <h3 class="card-text text-muted mb-2">${this.name}</h3>
          <p class="card-title text-center font-weight-bold">${
            "$" + this.price
          }</p>
          <div class="d-flex justify-content-center">
            <a href="#">Ver Detalles</a>
          </div>
          <div>
            ${this.mensajeStockHandler()}
          </div>
        </div>
      </div>
    `;

    card.innerHTML = contenido;
    card.classList.add("card");

    card.querySelector(".img-card img").addEventListener("click", async () => {
      this.zoomImageHandler();
    });

    // Evento para mostrar el modal de compra al hacer clic en "Ver Detalles"
    card.querySelector("a").addEventListener("click", async (e) => {
      e.preventDefault();
      // Agregar el identificador único
      window.location.hash = `product-${this.id}`;

      try {
        await mostrarProducto(
          this.id,
          this.name,
          this.price,
          this.imagePath,
          this.description,
          this.sizes,
          this.hayStock,
          this.section,
          this.generalStock
        );
      } catch (err) {
        console.log(err);
      }
    });

    // Solo permitir la compra si hay stock disponible y no es "opcion3"
    if (this.hayStock) {
      card.querySelector("[data-compra]").addEventListener("click", (e) => {
        e.preventDefault();
        if (this.section === "opcion3") {
          this.containerAmountHandler();
        } else {
          this.containerTallesHandler();
        }
      });
    }

    return card;
  }
}
