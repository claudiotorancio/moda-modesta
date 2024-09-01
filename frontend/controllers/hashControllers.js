import productoServices from "../services/product_services";

export async function hashControllers() {
  const hash = window.location.hash;
  if (hash.startsWith("#product-")) {
    const id = hash.replace("#product-", "");

    try {
      // Encapsular el producto en un array si es un solo objeto
      const response = await productoServices.detalleProducto(id);
      const producto = response.product; // Asumiendo que el objeto está dentro de 'product'

      // Convertir en array si es necesario
      const productosArray = [producto];

      productosArray.forEach((p) => {
        mostrarProducto(
          p.name,
          p.price,
          p.imagePath,
          p.sizes,
          p.description,
          p._id
        );
      });
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
    }
  }
}
