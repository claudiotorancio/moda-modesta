import { mostrarProducto } from "./ProductViewer.js";
// import { comprarProducto } from "../carrito/comprarProducto.js";
import { modalControllers } from "../../modal/modal.js";
import { getAmountSelectHTML, getSizesSelectHTML } from "./amountSizesHTML.js";
import { cargarProductosSimilares } from "./cargarProductosSimilares.js";
import { calcularEnvio } from "./calcularEnvio.js";
import { agregarProductoCarrito } from "./agregarProductoCarrito.js";
import { compartirProducto } from "./compartirProducto.js";
import { notificacionesSinStock } from "./notificacionesSinStock.js";

export class Producto {
  constructor(
    id,
    name,
    price,
    imagePath,
    description,
    sizes,
    hayStock,
    section,
    generalStock,
    discount
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
    this.discount = discount;
  }

  async mostrarProducto() {
    window.location.hash = `product-${this.id}`;
    await mostrarProducto.call(this);
  }

  async cargarProductosSimilares() {
    await cargarProductosSimilares.call(this);
  }

  async calcularEnvio() {
    await calcularEnvio.call(this);
  }

  async agregarProductoCarrito(event) {
    await agregarProductoCarrito.call(this, event);
  }

  async compartirProducto() {
    await compartirProducto.call(this);
  }

  async notificacionesSinStock() {
    await notificacionesSinStock.call(this);
  }

  updateModalContent(content) {
    modalControllers.baseModal();
    const modal = document.getElementById("modal");
    const contentContainer = modal.querySelector("[data-table]");
    contentContainer.innerHTML = content;
  }

  //html dinamico

  getMensajeStockHtml() {
    return this.hayStock
      ? `<button type="button" class="btn btn-primary " data-compra>Comprar</button>`
      : `<span class="text-danger mt-2 font-weight-bold">Sin stock</span>`;
  }

  getZoomImageHtml() {
    return `
      <div class="zoom-container position-relative d-flex flex-column align-items-center p-3" style="border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <!-- Imagen con efecto de sombra y hover -->
        <div class="image-wrapper position-relative" style="overflow: hidden; border-radius: 8px;">
          <img class="zoom-image img-fluid" src="${this.imagePath[0]}" alt="Imagen del producto" style="transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer;">
        </div>
        
        <!-- Descripción breve -->
        <div class="product-description text-center mt-3" style="color: #333;">
          <p class="m-0" style="font-size: 0.95rem;">${this.description}</p>
        </div>
  
        <!-- Botón de detalles -->
        <div class="d-flex justify-content-center">
          <a href="#" class="btn btn-info btn-sm mt-3" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Ver Detalles</a>
        </div>
      </div>
    `;
  }

  // eventos producto inicio
  zoomImageHandler() {
    const content = this.getZoomImageHtml();

    this.updateModalContent(content);

    document
      .querySelector("a.btn-info")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          this.mostrarProducto();
        } catch (err) {
          console.error(err);
        }
      });
  }

  async containerTallesHandler() {
    const content = getSizesSelectHTML.call(this);
    this.updateModalContent(content);
    await this.agregarProductoCarrito();
  }

  async containerAmountHandler() {
    const content = getAmountSelectHTML.call(this);
    this.updateModalContent(content);
    await this.agregarProductoCarrito();
  }

  productoInicio() {
    const card = document.createElement("div");
    const contenido = `
    <div class="container mx-auto mt-4">
  <div class="img-card position-relative">
    <img class="card-img-top" src="${
      this.imagePath[0]
    }" alt="imagen del producto">
    <div class="overlay-icon">
      <i class="fas fa-search-plus"></i>
    </div>
    ${
      this.discount && this.hayStock
        ? `<div class="offer-badge">
      <span>¡${this.discount}% de Descuento!</span>
    </div>`
        : ""
    }
  </div>
  <div class="card-body text-center">
    <h3 class="card-text text-muted mb-2">${this.name}</h3>
    <p class="card-title text-center font-weight-bold">
    ${
      this.discount && this.hayStock
        ? `<span class="original-price">
          $${this.price.toFixed(2)}
          </span>
          <br>
          <span >
          $${(this.price * (1 - this.discount / 100)).toFixed(2)}
          </span>
           <span class="discount-tag">
          ${this.discount}% off
          </span>
          `
        : `<span class=" text-muted">$${this.price.toFixed(2)}</span> `
    }
      
    <div class=" justify-content-center gap-2 mt-2">
      <a href="#" class="btn btn-primary m-1 ">Detalle</a>
      ${this.getMensajeStockHtml()}
     </div>
    <ul class="list-unstyled mt-2">
      <li><i class="fas fa-check-circle"></i> Material de alta calidad</li>
      <li><i class="fas fa-check-circle"></i> Stock permanente</li>
    </ul>
  </div>
</div>


    `;

    card.innerHTML = contenido;
    card.classList.add("card");

    card.querySelector(".img-card img").addEventListener("click", async () => {
      this.zoomImageHandler();
    });

    card.querySelector("a").addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await this.mostrarProducto();
      } catch (err) {
        console.log(err);
      }
    }); // Asegura que `this` mantenga el contexto de la instancia actual

    // Solo permitir la compra si hay stock disponible y no es "opcion3"
    if (this.hayStock) {
      card.querySelector("[data-compra]").addEventListener("click", (e) => {
        e.preventDefault();
        this.selectSizeAmount();
      });
    }

    return card;
  }

  selectSizeAmount() {
    if (this.section === "opcion3") {
      this.containerAmountHandler();
    } else {
      this.containerTallesHandler();
    }
  }
}
