import { mostrarProducto } from "./ProductViewer.js";
import { ProductEventHandler } from "./ProductEventHandler.js";
import productoServices from "../../services/product_services.js";
import { controllers } from "./productos_controllers.js";

export class ProductCard {
  constructor(
    name,
    price,
    imagePath,
    description,
    sizes,
    id,
    hayStock,
    isFeatured,
    isActive,
    inCart,
    section
  ) {
    this.name = name;
    this.price = price;
    this.imagePath = imagePath;
    this.description = description;
    this.sizes = sizes;
    this.id = id;
    this.hayStock = hayStock;
    this.isFeatured = isFeatured;
    this.isActive = isActive;
    this.inCart = inCart;
    this.secation = section;
  }

  render() {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
    
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
    <a href="#form" class="btn btn-primary" id="${this.id}" data-edit>Editar</a>
    ${
      this.isActive
        ? `<button class="btn btn-danger desactivar-producto" type="button" id="${this.id}">Desactivar</button>`
        : `<button class="btn btn-primary activar-producto" type="button" id="${this.id}">Activar</button>`
    }
  </div>
</div>


    `;

    this.addEventListeners(card);
    return card;
  }

  addEventListeners(card) {
    card
      .querySelector("[data-veradmin]")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        window.location.hash = `product-${this.id}`;

        mostrarProducto(
          this.name,
          this.price,
          this.imagePath,
          this.description,
          this.sizes,
          this.id,
          this.hayStock
        );
      });

    card
      .querySelector(".desactivar-producto, .activar-producto")
      .addEventListener("click", async (e) => {
        e.preventDefault();

        try {
          // Verificar si el producto está en el carrito
          if (this.inCart) {
            alert("El producto está en el carrito y no se puede desactivar.");
            return;
          }

          // Determinar si se activa o desactiva el producto
          if (this.isActive) {
            await handleToggleProduct(this.id, false); // Desactivar producto
          } else {
            await handleToggleProduct(this.id, true); // Activar producto
          }

          // Actualizar los productos en el DOM (puedes optimizar esto si es necesario)
          await controllers.renderProducts();
        } catch (error) {
          console.error("Error al activar/desactivar producto:", error);
        }
      });

    // Función para manejar la activación/desactivación del producto
    async function handleToggleProduct(productId, isActive) {
      if (isActive) {
        await ProductEventHandler.handleActivate(productId);
      } else {
        await ProductEventHandler.handleDesactivate(productId);
      }
    }

    card.querySelector("[data-edit]").addEventListener("click", (e) => {
      e.preventDefault();
      ProductEventHandler.handleEdit(
        this.name,
        this.price,
        this.imagePath,
        this.description,
        this.sizes,
        this.id,
        this.isFeatured
      );
    });
  }
}
