import productoServices from "../services/product_services.js";
import { mostrarProducto } from "./productos/ProductViewer.js";

export async function hashControllers() {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith("#product-")) {
      console.error("URL no válida para un producto.");
      return;
    }

    const id = hash.replace("#product-", "").trim();
    if (!id) {
      console.error("ID del producto no encontrado en el hash.");
      return;
    }

    const response = await productoServices.detalleProducto(id);
    const producto = response.product; // Asumiendo que el objeto está dentro de 'product'

    if (!producto) {
      console.error("Producto no encontrado en la respuesta de la API.");
      return;
    }
    //verificar si hay stock
    const hayStock = producto.stock > 0;
    // Convertir en array si es necesario
    const productosArray = [producto];

    productosArray.forEach((p) => {
      mostrarProducto(
        p.name,
        p.price,
        p.imagePath,
        p.sizes,
        p.description,
        hayStock,
        p._id
      );
    });
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
  }
}
