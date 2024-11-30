import productoServices from "../../services/product_services.js";
import { Producto } from "./Producto.js";
import { hayStock } from "./productos_controllers.js";

export async function cargarProductosSimilares() {
  try {
    //evento productos similares
    const botonSimilares = document.getElementById("toggle-similares");

    botonSimilares.addEventListener("click", async () => {
      const icon = botonSimilares.querySelector("i");
      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-up");
      document.getElementById("similares-Container").classList.toggle("show");

      const similares = await productoServices.productoSimilar(this.id);

      const contenedorSimilares = document.getElementById(
        "productos-similares"
      );
      if (!contenedorSimilares) {
        console.error("Contenedor de productos similares no encontrado.");
        return;
      }

      // Verificar si hay productos similares
      if (similares.length === 0) {
        contenedorSimilares.textContent = `No se encontraron similares`;
        return;
      }

      // Construir HTML de productos similares
      let productosHTML = "";
      similares.forEach((producto) => {
        productosHTML += `
          <div class="producto-similar" data-id="${producto._id}" data-name="${
          producto.name
        }" data-price="${producto.price}" data-image='${JSON.stringify(
          producto.imagePath
        )}' data-sizes='${JSON.stringify(producto.sizes)}' data-description="${
          producto.description
        }" data-stock="${hayStock(producto)}">
            <a href="#">
              <img src="${producto.imagePath[0]}" alt="${
          producto.name
        }" class="img-thumbnail">
              <p>${producto.name}</p>
              ${
                producto.discount && hayStock(producto)
                  ? `<span class="original-price">
                $${producto.price.toFixed(2)}
                </span>
                <br>
                <span>
                $${(producto.price * (1 - producto.discount / 100)).toFixed(2)}
                </span>
                <br>
                 <span class="discount-tag">
                ${producto.discount}% off
                </span>
                `
                  : `<span class=" text-muted">$${producto.price.toFixed(
                      2
                    )}</span> `
              }
            </a>
          </div>
        `;
      });
      contenedorSimilares.innerHTML = productosHTML;

      // Manejo de eventos para productos similares
      contenedorSimilares.addEventListener("click", async (e) => {
        const target = e.target.closest(".producto-similar");
        if (target) {
          const id = target.dataset.id;

          const producto = await productoServices.detalleProducto(id);

          if (!producto) {
            console.error("Producto no encontrado en la respuesta de la API.");
            return;
          }

          try {
            const productoSimilar = new Producto(
              producto._id,
              producto.name,
              producto.price,
              producto.imagePath,
              producto.description,
              producto.sizes,
              hayStock(producto),
              producto.section,
              producto.generalStock,
              producto.discount
            );
            productoSimilar.mostrarProducto();
          } catch (error) {
            console.error("Error al mostrar producto:", error);
          }
        }
      });
    });
  } catch (error) {
    console.error("Error al cargar productos similares:", error);
  }
}
