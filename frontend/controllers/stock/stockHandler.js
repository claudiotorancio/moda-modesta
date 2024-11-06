import { ProductCard } from "../../productoControl/ProductCard.js";
import productoServices from "../../services/product_services.js";
import { StockControllers } from "./stock-controllers.js";
import {
  handleActivate,
  handleDesactivate,
} from "../../productoControl/productEventHandler.js";

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

        const productoDetalles = new ProductCard(
          product._id,
          product.name,
          product.price,
          product.imagePath,
          product.description,
          product.sizes,
          product.isFeatured,
          product.section,
          product.generalStock
        );

        await productoDetalles.handleEdit();
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
        await handleDesactivate(idProducto);
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
        await handleActivate(idProducto);

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
        await handleNotification(idProducto, idNotificaciones);

        // Recargar los productos después de desactivar
        await stockControllersInstance.renderStock();
      } catch (error) {
        console.error("Error al activar el producto:", error);
        alert("Ocurrió un error al activar el producto.");
      }
    });
  });
}
