import productoServices from "../../services/product_services.js";
import { modalControllers } from "../../modal/modal.js";
import { ProductEditor } from "./ProductEditor.js";
import { RenderStock } from "../stock/RenderStock.js";

export class ProductEventHandler {
  static async handleDesactivate(id) {
    try {
      await productoServices.desactivarProducto(id);
    } catch (err) {
      console.log(err);
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
