import productoServices from "../../services/product_services.js";
import { mostrarProducto } from "./ProductViewer.js";
import { controllers } from "./productos_controllers.js";
import { modalControllers } from "../../modal/modal.js";

class ProductInit {
  constructor() {}

  productoInicio(name, price, imagePath, description, sizes, id) {
    const card = document.createElement("div");
    const contenido = `
      <div class="container mx-auto mt-4">
        <div class="img-card" >
          <img class="card-img-top" src="${imagePath[0]}" alt="">
        </div>
        <div class="card-body">
         
          <h3 class="card-text text-center text-muted mb-3">${name}</h3>
          <p class="card-title text-center font-weight-bold ">${"$" + price}</p>
          <div class="d-flex justify-content-center">
      <a href="#" >Ver Producto</a>
    </div>
           <div>
        <button type="button" class="btn btn-primary btn-block mt-2" data-compra>Comprar</button>
      </div>
        </div>
        
      </div>
    `;

    card.innerHTML = contenido;
    card.classList.add("card");

    card.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      // Actualiza la URL con un hash que incluye el ID del producto
      window.location.hash = `product-${id}`;

      try {
        mostrarProducto(name, price, imagePath, sizes, description, id);
      } catch (err) {
        console.log(err);
      }
    });

    card.querySelector("[data-compra]").addEventListener("click", () => {
      modalControllers.baseModal();
      const modal = document.getElementById("modal");
      const containerTalles = modal.querySelector("[data-table");

      containerTalles.innerHTML = `
<label for="variation_1" class="form-label">Talles disponibles</label>
      <select id="variation_1" class="form-select mb-3">
        ${sizes
          .map((size) => `<option value="${size}">${size}</option>`)
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
      // Renderizar productos destacados
      const productosDestacados = await productoServices.destacadosProducto();
      const contenedorDestacados = document.querySelector("[data-destacados]");

      if (Array.isArray(productosDestacados)) {
        contenedorDestacados.innerHTML = ""; // Limpiar contenedor de destacados
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

      // Renderizar otras categorías
      const listaProductos = await productoServices.renderInicio();
      const products = listaProductos;

      // Limpiar todos los contenedores de categorías antes de renderizar
      document.querySelectorAll(".productos").forEach((contenedor) => {
        if (contenedor !== contenedorDestacados) {
          contenedor.innerHTML = ""; // Limpiar contenido existente
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

        // Renderizar el producto y adjuntar al contenedor adecuado
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
