import productoServices from "../../services/product_services.js";
import { mostrarProducto } from "./ProductViewer.js";

export async function cargarProductosSimilares(id) {
  try {
    const data = await productoServices.productoSimilar(id);
    const similares = data.slice(0, 3); // Limitar a los primeros 3 productos

    const contenedorSimilares = document.getElementById("productos-similares");
    if (!contenedorSimilares) {
      console.error("Contenedor de productos similares no encontrado.");
      return;
    }

    // Verificar si hay productos similares
    if (similares.length === 0) {
      contenedorSimilares.innerHTML = `<p>No se encontraron productos similares.</p>`;
      return;
    }

    // Construir HTML de productos similares
    let productosHTML = "";
    similares.forEach((producto) => {
      const hayStock =
        producto.generalStock > 0 || // Verifica stock general para "Diversos"
        producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

      productosHTML += `
          <div class="producto-similar" data-id="${producto._id}" data-name="${
        producto.name
      }" data-price="${producto.price}" data-image='${JSON.stringify(
        producto.imagePath
      )}' data-sizes='${JSON.stringify(producto.sizes)}' data-description="${
        producto.description
      }" data-stock="${hayStock}">
            <a href="#">
              <img src="${producto.imagePath[0]}" alt="${
        producto.name
      }" class="img-thumbnail">
              <p>${producto.name}</p>
              <p>$ ${producto.price}</p>
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
        const name = target.dataset.name;
        const price = target.dataset.price;
        const imagePath = JSON.parse(target.dataset.image); // Asegúrate de que esto sea un array
        const description = target.dataset.description;
        const sizes = JSON.parse(target.dataset.sizes);
        const hayStock = target.dataset.stock === "true"; // Recuperar el stock ya calculado

        window.location.hash = `product-${id}`;

        const producto = await productoServices.detalleProducto(id);

        if (!producto) {
          console.error("Producto no encontrado en la respuesta de la API.");
          return;
        }

        try {
          await mostrarProducto(
            id,
            name,
            price,
            imagePath,
            description,
            sizes,
            hayStock
          );
        } catch (error) {
          console.error("Error al mostrar producto:", error);
        }
      }
    });

    // Manejo de eventos para enlaces
    const enlaces = contenedorSimilares.querySelectorAll("a");
    enlaces.forEach((enlace) => {
      enlace.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.hash = `product-${id}`;
      });
    });
  } catch (error) {
    console.error("Error al cargar productos similares:", error);
  }
}
