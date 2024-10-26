import productoServices from "../../services/product_services.js";
import { ProductEditor } from "./ProductEditor.js";
import envioServices from "../../services/envio_services.js";

export class ProductEventHandler {
  static async handleDesactivate(product) {
    try {
      const { id, inCart } = product;

      // Verificar si el producto está en el carrito
      if (inCart) {
        alert(
          "No puedes desactivar este producto porque está en el carrito de compras."
        );
        return; // Salir de la función si está en el carrito
      }
      const confirmacion = confirm("¿Desea desactivar el producto?");

      if (confirmacion) {
        // Esperar a que se complete la desactivación
        await productoServices.desactivarProducto(id);
      }
    } catch (error) {
      console.error("Error al desactivar el producto:", error);
      alert("Ocurrió un error al desaactivar el producto.");
    }
  }

  static async handleActivate(id) {
    try {
      const confirmacion = confirm("¿Desea activar el producto?");

      if (confirmacion) {
        // Esperar a que se complete la desactivación
        await productoServices.activarProducto(id);
      }
    } catch (error) {
      console.error("Error al activar el producto:", error);
      alert("Ocurrió un error al activar el producto.");
    }
  }

  static async handleNotification(idProducto, idNotificaciones) {
    try {
      const confirmacion = confirm(
        "¿Desea enviar el aviso de ingreso a todas las solicitudes??"
      );

      if (confirmacion) {
        // Esperar a que se complete la desactivación
        await envioServices.notificacionIngreso(idProducto, idNotificaciones);
      }
    } catch (error) {
      console.error("Error al enviar la notificacion:", error);
      alert("Ocurrió un error al notifiar.");
    }
  }

  static async handleEdit(
    id,
    name,
    price,
    imagePath,
    description,
    sizes,
    isFeatured,
    section,
    generalStock
  ) {
    try {
      const productEditor = new ProductEditor();
      productEditor.editProduct(
        id,
        name,
        price,
        imagePath,
        description,
        sizes,
        isFeatured,
        section,
        generalStock
      );
    } catch (error) {
      console.error("Error al obtener el detalle del producto:", error);
      alert(
        "Ocurrió un error al obtener el detalle del producto. Por favor, intenta nuevamente."
      );
    }
  }
}
