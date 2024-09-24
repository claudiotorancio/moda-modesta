import productoServices from "../../services/product_services.js";
import { mostrarProducto } from "./ProductViewer.js";
import { controllers } from "./productos_controllers.js";
import { modalControllers } from "../../modal/modal.js";

export class ProductInit {
  constructor(name, price, imagePath, description, sizes, id, hayStock) {
    this.name = name;
    this.price = price;
    this.imagePath = imagePath;
    this.description = description;
    this.sizes = sizes;
    this.id = id;
    this.hayStock = hayStock;
  }

  productoInicio() {
    const card = document.createElement("div");

    // Verificar si hay algún talle con stock
    // const hayStock = this.sizes.some((item) => item.stock > 0);
    // conso
    const mensajeStock = this.hayStock
      ? `<button type="button" class="btn btn-primary btn-block mt-2" data-compra>Comprar</button>`
      : `<span class="text-danger font-weight-bold ">Sin stock</span>`;

    const contenido = `
      <div class="container mx-auto mt-4">
        <div class="img-card">
          <img class="card-img-top" src="${
            this.imagePath
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
            ${mensajeStock}
          </div>
        </div>
      </div>
    `;

    card.innerHTML = contenido;
    card.classList.add("card");

    // Evento para mostrar el modal con la imagen al hacer clic en la imagen del producto
    card.querySelector(".img-card img").addEventListener("click", async () => {
      try {
        modalControllers.baseModal();
        const modal = document.getElementById("modal");
        const zoomImage = modal.querySelector("[data-table]");
        zoomImage.innerHTML = `
           <img class="card-img-top" src="${this.imagePath[0]}" alt="imagen del producto">
           <div class="d-flex justify-content-center">
            <a href="#" type="button" class="btn btn-info btn-sm mt-2">Ver Detalles</a>
          </div>
          `;

        zoomImage.querySelector("a").addEventListener("click", async (e) => {
          e.preventDefault();
          window.location.hash = `product-${this.id}`;

          try {
            await mostrarProducto(
              this.name,
              this.price,
              this.imagePath,
              this.description,
              this.sizes,
              this.id,
              this.hayStock
            );
          } catch (err) {
            console.log(err);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });

    // Evento para mostrar el modal de compra al hacer clic en "Ver Detalles"
    card.querySelector("a").addEventListener("click", async (e) => {
      e.preventDefault();
      window.location.hash = `product-${this.id}`;

      try {
        await mostrarProducto(
          this.name,
          this.price,
          this.imagePath,
          this.description,
          this.sizes,
          this.id,
          this.hayStock
        );
      } catch (err) {
        console.log(err);
      }
    });

    // Solo permitir la compra si hay stock disponible
    if (this.hayStock) {
      card.querySelector("[data-compra]").addEventListener("click", () => {
        modalControllers.baseModal();
        const modal = document.getElementById("modal");
        const containerTalles = modal.querySelector("[data-table]");

        containerTalles.innerHTML = `
          <label for="variation_1" class="form-label">Talles disponibles</label>
          <select id="variation_1" class="form-select mb-3">
            ${this.sizes
              .filter((item) => item.stock > 0) // Solo talles con stock
              .map(
                (item) => `<option value="${item.size}">${item.size}</option>`
              )
              .join("")}
          </select>
          <div class="text-center">
            <button type="button" class="btn btn-primary btn-block" data-carrito>Agregar al carrito</button>
          </div>
        `;

        containerTalles
          .querySelector("[data-carrito]")
          .addEventListener("click", () => {
            const talleSeleccionado =
              document.getElementById("variation_1").value;
            controllers.comprarProducto(
              this.name,
              this.price,
              this.imagePath,
              this.id,
              talleSeleccionado
            );
          });
      });
    }

    return card;
  }
}
