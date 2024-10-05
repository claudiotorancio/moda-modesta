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

    const producto = await productoServices.detalleProducto(id);

    if (!producto) {
      console.error("Producto no encontrado en la respuesta de la API.");
      return;
    }

    // Asegúrate de que el campo que indica si el producto está activo sea correcto.
    const isActive =
      producto.isActive !== undefined ? producto.isActive : producto.isAcative;

    if (!isActive) {
      alert("El producto ya no está disponible.");

      // Eliminar el hash de la barra de direcciones para evitar alertas futuras en recargas
      window.history.replaceState(null, null, window.location.pathname);

      return;
    }

    // Verificar si hay stock en alguna de las tallas
    const hayStock = producto.sizes.some((item) => item.stock > 0);

    // Mostrar el producto solo si está activo y tiene stock
    mostrarProducto(
      producto._id,
      producto.name,
      producto.price,
      producto.imagePath,
      producto.description,
      producto.sizes, // Pasar las tallas con su stock
      hayStock // Pasar si hay stock general o no
    );
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
  }
}
