import productoServices from "../../services/product_services.js";

export class ProductEventHandler {
  static async handleEdit(idProducto) {
    try {
      const response = await productoServices.detalleProducto(idProducto);
      if (!response || !response.product)
        throw new Error("Producto no disponible");
      const { name, price, imagePath, description, sizes, isFeatured } =
        response.product;

      // Lógica para mostrar detalles o actualizar producto
      console.log("Detalles del producto:", name, price, imagePath);
    } catch (error) {
      console.error("Error al obtener los detalles:", error);
      alert("Ocurrió un error al obtener los detalles del producto.");
    }
  }

  static async handleDelete(idProducto) {
    try {
      const confirmacion = confirm(
        "¿Estás seguro de que deseas eliminar este producto?"
      );
      if (!confirmacion) return;

      await productoServices.eliminarProducto(idProducto);
      alert("Producto eliminado con éxito.");
      location.reload(); // Recargar la página para reflejar los cambios
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Ocurrió un error al eliminar el producto.");
    }
  }
}
