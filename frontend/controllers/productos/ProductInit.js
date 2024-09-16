import productoServices from "../../services/product_services.js";
import { mostrarProducto } from "./ProductViewer.js";
import { controllers } from "./productos_controllers.js";
import { modalControllers } from "../../modal/modal.js";

export class ProductInit {
  constructor() {}

  productoInicio(name, price, imagePath, description, sizes, id) {
    const card = document.createElement("div");
    const contenido = `
      <div class="container mx-auto mt-4">
        <div class="img-card">
          <img class="card-img-top" src="${
            imagePath[0]
          }" alt="imagen del producto">
          <!-- Ícono de lupa -->
        <div class="overlay-icon">
          <i class="fas fa-search-plus"></i>
        </div>
        </div>
        <div class="card-body text-center">
          <h3  class="card-text text-muted mb-2">${name}</h3>
          <p class="card-title text-center font-weight-bold">${"$" + price}</p>
          <div class="d-flex justify-content-center">
            <a href="#">Ver Detalles</a>
          </div>
          <div>
            <button type="button" class="btn btn-primary btn-block mt-2" data-compra>Comprar</button>
          </div>
        </div>
      </div>
    `;

    card.innerHTML = contenido;
    card.classList.add("card");

    card.querySelector(".img-card img").addEventListener("click", async () => {
      try {
        modalControllers.baseModal();
        const modal = document.getElementById("modal");
        const zoomImage = modal.querySelector("[data-table]");
        // Agregar una clase específica para este modal
        zoomImage.innerHTML = `
           <img class="card-img-top" src="${imagePath[0]}" alt="imagen del producto">
           <div class="d-flex justify-content-center">
            <a href="#" type="button" class="btn btn-info btn-sm mt-2" >Ver Detalles</a>
          </div>
          `;

        zoomImage.querySelector("a").addEventListener("click", async (e) => {
          e.preventDefault();
          window.location.hash = `product-${id}`;

          try {
            await mostrarProducto(
              name,
              price,
              imagePath,
              sizes,
              description,
              id
            );
          } catch (err) {
            console.log(err);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });

    card.querySelector("a").addEventListener("click", async (e) => {
      e.preventDefault();
      window.location.hash = `product-${id}`;

      try {
        await mostrarProducto(name, price, imagePath, sizes, description, id);
      } catch (err) {
        console.log(err);
      }
    });

    card.querySelector("[data-compra]").addEventListener("click", () => {
      modalControllers.baseModal();
      const modal = document.getElementById("modal");
      const containerTalles = modal.querySelector("[data-table]");

      containerTalles.innerHTML = `
        <label for="variation_1" class="form-label">Talles disponibles</label>
        <select id="variation_1" class="form-select mb-3">
          ${sizes
            .map((item) => `<option value="${item.size}">${item.size}</option>`)
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
            name,
            price,
            imagePath,
            id,
            talleSeleccionado
          );
        });
    });

    return card;
  }

  async renderInit() {
    try {
      const productosDestacados = await productoServices.destacadosProducto();
      const contenedorDestacados = document.querySelector("[data-destacados]");

      if (Array.isArray(productosDestacados)) {
        contenedorDestacados.innerHTML = "";
        for (const producto of productosDestacados) {
          const card = this.productoInicio(
            producto.name,
            producto.price,
            producto.imagePath,
            producto.description,
            producto.sizes,
            producto._id
          );
          contenedorDestacados.appendChild(card);
        }
      } else {
        console.error("Error: No se recibieron productos destacados.");
      }

      const listaProductos = await productoServices.renderInicio();
      const products = listaProductos;

      document.querySelectorAll(".productos").forEach((contenedor) => {
        if (contenedor !== contenedorDestacados) {
          contenedor.innerHTML = "";
        }
      });

      for (const producto of products) {
        const productCard = this.productoInicio(
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          producto._id
        );
        document
          .querySelector(`[data-${producto.section}]`)
          .appendChild(productCard);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const productosInicio = new ProductInit();
