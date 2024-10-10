// RenderStock.js

import envioServices from "../../services/envio_services.js";
import productoServices from "../../services/product_services.js";
import { createProductElement } from "./createTableStock.js";
import { agregarEventListenerBotones } from "./stockHandler.js";

export class StockControllers {
  constructor(titulo) {
    this.titulo = titulo;
  }

  async renderStock() {
    const productos = await productoServices.listaProductos();
    const notificaciones = await envioServices.getNotificaciones();

    const categorias = {
      Vestidos: productos.filter((producto) => producto.section === "opcion1"),
      Polleras: productos.filter((producto) => producto.section === "opcion2"),
      Diversos: productos.filter((producto) => producto.section === "opcion3"),
    };

    this.titulo.innerHTML = "";

    for (const categoria in categorias) {
      if (categorias[categoria].length > 0) {
        const tituloCategoria = `
          <h3 class="mt-4">${categoria}</h3>
          <div id="productos-${categoria}" class="productos-container"></div>
        `;
        this.titulo.innerHTML += tituloCategoria;

        const productosContenedor = document.querySelector(
          `#productos-${categoria}`
        );

        const productosOrdenados = categorias[categoria].sort((a, b) => {
          const stockA = a.sizes.reduce((acc, size) => acc + size.stock, 0);
          const stockB = b.sizes.reduce((acc, size) => acc + size.stock, 0);
          return stockA === 0 ? -1 : stockB === 0 ? 1 : stockA < 10 ? -1 : 1;
        });

        productosOrdenados.forEach(async (producto) => {
          const { _id, name, sizes, price, isActive, isFeatured } = producto;
          const hayStock =
            producto.section === "opcion3"
              ? producto.generalStock > 0 // Verifica stock general para "Diversos"
              : producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

          const productoDiv = createProductElement(
            _id,
            name,
            price,
            sizes,
            isActive,
            isFeatured,
            hayStock,
            notificaciones
          );

          productosContenedor.appendChild(productoDiv);
        });
      }
    }

    // Añadir el event listener a los botones "Ver detalles" - "Desactivar/Activar" - "Notificaciones"
    agregarEventListenerBotones();
  }
}
