import { CarritoServices } from "../../services/carrito_services.js";

const carritoServices = new CarritoServices();

// Helper function to update sessionStorage
function actualizarSessionStorage(items) {
  sessionStorage.setItem("carrito", JSON.stringify(items));
}

export async function agregarProducto(product, size) {
  try {
    // Obtener productos del carrito desde sessionStorage
    const productosCarrito =
      JSON.parse(sessionStorage.getItem("carrito")) || [];

    // Buscar el producto en el carrito
    const productoExistente = productosCarrito.find(
      (item) => item.productId === product._id && item.size === size
    );

    if (productoExistente) {
      // Actualizar cantidad y recalcular el precio total
      productoExistente.cantidad += 1;

      // Actualizar el producto en la API
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

      // Agregar el nuevo producto a la API
      await carritoServices.addProductCart(productoNuevo);

      // Agregar el nuevo producto al array del carrito
      productosCarrito.push(productoNuevo);
    }

    // Actualizar sessionStorage
    actualizarSessionStorage(productosCarrito);

    // Mostrar el carrito actualizado
    this.mostrarCarrito(); // Asegúrate de que 'this' esté correctamente vinculado
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}

export async function eliminarProducto(id) {
  try {
    // Obtener productos del carrito desde sessionStorage
    const productosCarrito =
      JSON.parse(sessionStorage.getItem("carrito")) || [];

    // Filtrar el producto a eliminar
    const productosActualizados = productosCarrito.filter(
      (item) => item._id !== id
    );

    // Eliminar el producto en la API
    await carritoServices.deleteProductCart(id);

    // Actualizar sessionStorage
    actualizarSessionStorage(productosActualizados);

    // Mostrar el carrito actualizado
    this.mostrarCarrito(); // Asegúrate de que 'this' esté correctamente vinculado
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

export async function actualizarCantidad(id, cantidad) {
  try {
    // Obtener productos del carrito desde sessionStorage
    const productosCarrito =
      JSON.parse(sessionStorage.getItem("carrito")) || [];

    // Encontrar el producto a actualizar
    const producto = productosCarrito.find((item) => item._id === id);

    if (producto) {
      // Actualizar la cantidad en el array
      producto.cantidad = cantidad;

      // Actualizar la cantidad en la API
      await carritoServices.putProductCart({ cantidad }, id);

      // Actualizar sessionStorage
      actualizarSessionStorage(productosCarrito);

      // Mostrar el carrito actualizado
      this.mostrarCarrito(); // Asegúrate de que 'this' esté correctamente vinculado
    }
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
  }
}
