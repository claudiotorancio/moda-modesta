// RenderStock.js

import envioServices from "../../services/envio_services.js";
import productoServices from "../../services/product_services.js";
import { createProductElement } from "./createTableStock.js";
import { agregarEventListenerBotones } from "./stockHandler.js";
import { hayStock } from "../productos/productos_controllers.js";

export class StockControllers {
  constructor(titulo) {
    this.titulo = titulo;
  }

  async renderStock() {
    const productos = await productoServices.listaProductos();
    const notificaciones = await envioServices.getNotificaciones();

    const categorias = {
      Vestidos: productos.filter((producto) => producto.section === "vestidos"),
      Polleras: productos.filter((producto) => producto.section === "polleras"),
      Diversos: productos.filter((producto) => producto.section === "diversos"),
    };

    this.titulo.innerHTML = "";

    for (const categoria in categorias) {
      if (categorias[categoria].length > 0) {
        const tituloCategoria = `
          <h3 class="text-center mt-4 mb-3" style="font-size: 1.5rem;">${categoria}</h3>
          <div id="productos-${categoria}" class="productos-container"></div>
        `;
        this.titulo.innerHTML += tituloCategoria;

        const productosContenedor = document.querySelector(
          `#productos-${categoria}`
        );

        // Ordenar productos usando `generalStock` o `sizes`
        const productosOrdenados = categorias[categoria].sort((a, b) => {
          // Para productos con tallas
          const stockA =
            a.sizes.length > 0
              ? a.sizes.reduce((acc, size) => acc + size.stock, 0)
              : a.generalStock; // Usar generalStock si no hay tallas

          const stockB =
            b.sizes.length > 0
              ? b.sizes.reduce((acc, size) => acc + size.stock, 0)
              : b.generalStock; // Usar generalStock si no hay tallas

          // Comparación lógica de ordenamiento
          if (stockA === 0 && stockB !== 0) return -1; // Priorizar productos sin stock
          if (stockB === 0 && stockA !== 0) return 1;
          if (stockA < 10 && stockB >= 10) return -1; // Priorizar bajo stock
          if (stockB < 10 && stockA >= 10) return 1;
          return 0; // Si ambos tienen el mismo stock, mantener el orden
        });

        productosOrdenados.forEach(async (producto) => {
          const {
            _id,
            name,
            sizes,
            price,
            isActive,
            isFeatured,
            generalStock,
          } = producto;

          const productoDiv = createProductElement(
            _id,
            name,
            price,
            sizes,
            isActive,
            isFeatured,
            hayStock(producto),
            generalStock,
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
