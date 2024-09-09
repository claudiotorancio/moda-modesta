import { CarritoServices } from "../../services/carrito_services.js";

const carritoServices = new CarritoServices();

export async function agregarProducto(product, size) {
  console.log(product, size);
  try {
    // Obtener productos del carrito desde el estado local
    const productoExistente = this.items.find(
      (item) => item.productId === product._id && item.size === size
    );

    if (productoExistente) {
      // Actualizar la cantidad en el estado local del carrito
      productoExistente.cantidad += 1;

      // Actualizar el producto en el carrito en el servidor
      await carritoServices.putProductCart(
        { cantidad: productoExistente.cantidad },
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

      // Agregar el nuevo producto al carrito en el servidor
      await carritoServices.addProductCart(productoNuevo);

      // Agregar el nuevo producto al estado local del carrito
      this.items.push(productoNuevo);
    }

    // Mostrar el carrito actualizado
    this.mostrarCarrito();
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}

export async function eliminarProducto(id) {
  try {
    // Eliminar producto del carrito en el servidor
    await carritoServices.deleteProductCart(id);

    // Eliminar el producto del estado local del carrito
    this.items = this.items.filter((item) => item._id !== id);

    // Mostrar el carrito actualizado
    this.mostrarCarrito();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

export async function actualizarCantidad(id, cantidad) {
  try {
    // Actualizar la cantidad del producto en el carrito en el servidor
    await carritoServices.putProductCart({ cantidad }, id);

    // Actualizar la cantidad en el estado local del carrito
    const productoExistente = this.items.find((item) => item._id === id);
    if (productoExistente) {
      productoExistente.cantidad = cantidad;
    }

    // Mostrar el carrito actualizado
    this.mostrarCarrito();
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
  }
}
