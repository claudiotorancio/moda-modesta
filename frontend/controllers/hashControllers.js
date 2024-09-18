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

    // Verificar si hay stock en alguna de las tallas
    const hayStock = producto.sizes.some((item) => item.stock > 0);

    console.log(`Stock disponible: ${hayStock ? "Sí" : "No"}`);

    // Convertir en array si es necesario (en caso de que quieras manejar varios productos)
    const productosArray = [producto];

    productosArray.forEach((p) => {
      mostrarProducto(
        p.name,
        p.price,
        p.imagePath,
        p.sizes, // Pasar las tallas con su stock
        p.description,
        p._id,
        hayStock // Pasar si hay stock general o no
      );
    });
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
  }
}
