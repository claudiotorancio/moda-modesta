import { ProductEventHandler } from "../productos/ProductEventHandler.js";
import productoServices from "../../services/product_services.js";
import { StockControllers } from "./stock-controllers.js";

export async function agregarEventListenerBotones() {
  const titulo = document.querySelector("[data-titulo]");

  const stockControllersInstance = new StockControllers(titulo);

  const botonesDetalles = document.querySelectorAll(".ver-detalles");
  botonesDetalles.forEach((boton) => {
    boton.addEventListener("click", async (event) => {
      const idProducto = event.target.dataset.id;
      // Obtener los detalles del producto
      try {
        const product = await productoServices.detalleProducto(idProducto);
        if (!product) {
          throw new Error("Datos del producto no disponibles");
        }

        const {
          name,
          price,
          imagePath,
          description,
          sizes,
          isFeatured,
          generalStock,
        } = product;

        // Llamar a ProductEventHandler.handleEdit con todos los parámetros
        await ProductEventHandler.handleEdit(
          idProducto,
          name,
          price,
          imagePath,
          description,
          sizes,
          isFeatured,
          generalStock
        );

        await stockControllersInstance.renderStock();
      } catch (error) {
        console.error("Error al obtener los detalles del producto:", error);
        alert("Ocurrió un error al obtener los detalles del producto.");
      }
    });
  });

  const botonesDesactivar = document.querySelectorAll(".desactivar-producto");

  botonesDesactivar.forEach((boton) => {
    boton.addEventListener("click", async (event) => {
      const idProducto = event.target.dataset.id;

      try {
        // Desactivar el producto
        await ProductEventHandler.handleDesactivate(idProducto);
        // Recargar los productos después de desactivar
        await stockControllersInstance.renderStock();
      } catch (error) {
        console.error("Error al desactivar el producto:", error);
        alert("Ocurrió un error al desactivar el producto.");
      }
    });
  });

  const botonesActivar = document.querySelectorAll(".activar-producto");
  botonesActivar.forEach((boton) => {
    boton.addEventListener("click", async (event) => {
      const idProducto = event.target.dataset.id;
      try {
        // Esperar a que se complete la desactivación
        await ProductEventHandler.handleActivate(idProducto);

        // Recargar los productos después de desactivar
        await stockControllersInstance.renderStock();
      } catch (error) {
        console.error("Error al activar el producto:", error);
        alert("Ocurrió un error al activar el producto.");
      }
    });
  });

  const botonesNotificar = document.querySelectorAll(".notificacion-producto");
  botonesNotificar.forEach((boton) => {
    boton.addEventListener("click", async (event) => {
      const idProducto = event.target.dataset.productId;
      const idNotificaciones = event.target.dataset.notificacionIds;

      try {
        // Esperar a que se complete la desactivación
        await ProductEventHandler.handleNotification(
          idProducto,
          idNotificaciones
        );

        // Recargar los productos después de desactivar
        await stockControllersInstance.renderStock();
      } catch (error) {
        console.error("Error al activar el producto:", error);
        alert("Ocurrió un error al activar el producto.");
      }
    });
  });
}
