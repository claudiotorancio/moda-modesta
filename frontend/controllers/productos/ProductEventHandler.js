import productoServices from "../../services/product_services.js";
import { modalControllers } from "../../modal/modal.js";
import { ProductEditor } from "./ProductEditor.js";

export class ProductEventHandler {
  static async handleDesactivate(id) {
    try {
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

  static async handleEdit(
    name,
    price,
    imagePath,
    description,
    sizes,
    id,
    isFeatured
  ) {
    try {
      await productoServices.detalleProducto(id);
      const productEditor = new ProductEditor();
      productEditor.editProduct(
        name,
        price,
        imagePath,
        description,
        sizes,
        id,
        isFeatured
      );
    } catch (error) {
      console.error("Error al obtener el detalle del producto:", error);
      alert(
        "Ocurrió un error al obtener el detalle del producto. Por favor, intenta nuevamente."
      );
    }
  }
}
