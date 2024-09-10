import { CarritoServices } from "../../services/carrito_services.js";

const carritoServices = new CarritoServices();

export async function agregarProducto(product, size) {
  console.log(product, size);
  try {
    // Obtener productos del carrito
    const productosCarrito = await carritoServices.getProductsCart();
    console.log(productosCarrito);

    // Buscar el producto en el carrito
    const productoExistente = productosCarrito.find(
      (item) => item.productId === product._id && item.size === size
    );

    if (productoExistente) {
      // Actualizar cantidad y recalcular el precio total
      const nuevaCantidad = productoExistente.cantidad + 1;

      // Actualizar el producto en el carrito
      await carritoServices.putProductCart(
        { cantidad: nuevaCantidad },
        productoExistente._id
      );
    } else {
      // Crear un nuevo producto para agregar al carrito
      const productoNuevo = {
        name: product.name,
        price: parseFloat(product.price),
        cantidad: 1,
        size: size,
        imagePath: product.imagePath[0],
        productId: product._id,
      };

      console.log(productoNuevo);

      // Agregar el nuevo producto al carrito
      await carritoServices.addProductCart(productoNuevo);
    }

    // Mostrar el carrito actualizado
    this.mostrarCarrito(); // Asegúrate de que 'this' esté correctamente vinculado
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}

export async function eliminarProducto(id) {
  try {
    // Eliminar producto del carrito
    await carritoServices.deleteProductCart(id);
    // Mostrar el carrito actualizado
    this.mostrarCarrito(); // Asegúrate de que 'this' esté correctamente vinculado
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

export async function actualizarCantidad(id, cantidad) {
  try {
    // Actualizar la cantidad del producto en el carrito
    await carritoServices.putProductCart({ cantidad }, id);
    // Mostrar el carrito actualizado
    this.mostrarCarrito(); // Asegúrate de que 'this' esté correctamente vinculado
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
  }
}
