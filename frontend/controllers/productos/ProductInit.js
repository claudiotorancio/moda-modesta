import {
  getAmountSelectHTML,
  getSizesSelectHTML,
  mostrarProducto,
} from "./ProductViewer.js";
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
      <div class="zoom-container position-relative">
        <img class="card-img-top img-fluid zoom-image" src="${this.imagePath[0]}" alt="imagen del producto">
      </div>
      <div class="d-flex justify-content-center">
        <a href="#" class="btn btn-info btn-sm mt-3">Ver Detalles</a>
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
    const content = getSizesSelectHTML(this.sizes);

    this.updateModalContent(content);
    const carritoButton = document.querySelector("[data-carrito]");

    carritoButton.addEventListener("click", (event) => {
      const talleSeleccionado = document.getElementById("variation_1").value;
      const quantity = document.getElementById("quantity").value;

      if (event.target.id === "addToCartBtn") {
        const messageElement = document.getElementById("message");
        console.log(messageElement);
        if (!talleSeleccionado) {
          messageElement.textContent = `Debes seleccionar un talle`;
          document.getElementById("messageContainer").style.display = "block";
        }
      }
      comprarProducto(
        this.id,
        this.name,
        this.price,
        this.imagePath,
        this.sizes,
        talleSeleccionado,
        this.section,
        this.generalStock,
        quantity
      );
    });
  }

  containerAmountHandler() {
    const content = getAmountSelectHTML(this.generalStock);

    this.updateModalContent(content);
    const carritoButton = document.querySelector("[data-carrito]");

    // Agregar evento de clic al botón para agregar al carrito
    carritoButton.addEventListener("click", () => {
      const cantidadSeleccionada = document.getElementById("quantity").value;

      // Lógica para comprar producto
      comprarProducto(
        this.id,
        this.name,
        this.price,
        this.imagePath,
        this.sizes,
        undefined,
        this.section,
        this.generalStock,
        cantidadSeleccionada
      );
    });
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
    <div class="offer-badge">
      <span>¡20% de Descuento!</span>
    </div>
  </div>
  <div class="card-body text-center">
    <h3 class="card-text text-muted mb-2">${this.name}</h3>
    <p class="card-title text-center font-weight-bold">
      <span class="text-decoration-line-through text-muted">$${this.price.toFixed(
        2
      )}</span> 
      $${(this.price * 0.8).toFixed(2)} <!-- Precio con descuento -->
    </p>
    <div class=" justify-content-center gap-2 mt-2">
      <a href="#" class="btn btn-primary m-1 ">Detalle</a>
      ${this.getMensajeStockHtml()}
     </div>
    <ul class="list-unstyled mt-2">
      <li><i class="fas fa-check-circle"></i> Material de alta calidad</li>
      <li><i class="fas fa-check-circle"></i> Disponible en múltiples colores</li>
    </ul>
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
