import { CarritoServices } from "../../services/carrito_services.js";

const carritoServices = new CarritoServices();

export async function cargarCarritoDesdeStorage() {
  try {
    const carrito = await carritoServices.getProductsCart();
    this.items = carrito || [];
    actualizarNotificacionCarrito.call(this);
  } catch (error) {
    console.error("Error al cargar el carrito desde la base de datos:", error);
    this.items = [];
  }
}

function actualizarNotificacionCarrito() {
  const items = this.items;

  const carritoContainer = document.querySelector(".carrito-link");
  if (!carritoContainer) {
    console.error("No se encontró el contenedor del carrito.");
    return;
  }

  const carritoNotificacion =
    carritoContainer.querySelector(".carrito-cantidad");
  const carritoMonto = carritoContainer.querySelector(".carrito-monto");

  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);
  const total = items.reduce(
    (acc, item) => acc + item.price * item.cantidad,
    0
  );

  carritoNotificacion.textContent = cantidadTotal > 0 ? cantidadTotal : "0";
  carritoMonto.textContent = total > 0 ? `$${total.toFixed(2)}` : "$0.00";
}

export async function agregarProducto(product, size) {
  try {
    if (!this.items) {
      await cargarCarritoDesdeStorage.call(this);
    }

    const productoExistente = this.items.find(
      (item) => item.productId === product._id && item.size === size
    );

    if (productoExistente) {
      productoExistente.cantidad += 1;
      await carritoServices.putProductCart(
        { cantidad: productoExistente.cantidad },
        productoExistente._id
      );
    } else {
      const productoNuevo = {
        name: product.name,
        price: parseFloat(product.price),
        cantidad: 1,
        size: size,
        imagePath: product.imagePath[0],
        productId: product._id,
      };

      await carritoServices.addProductCart(productoNuevo);
      this.items.push(productoNuevo);
    }

    this.mostrarCarrito();
    actualizarNotificacionCarrito.call(this);
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}

export async function eliminarProducto(id) {
  try {
    if (!this.items) {
      await cargarCarritoDesdeStorage.call(this);
    }

    await carritoServices.deleteProductCart(id);
    this.items = this.items.filter((item) => item._id !== id);

    this.mostrarCarrito();
    actualizarNotificacionCarrito.call(this);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

export async function actualizarCantidad(id, cantidad) {
  try {
    if (!this.items) {
      await cargarCarritoDesdeStorage.call(this);
    }

    await carritoServices.putProductCart({ cantidad }, id);
    const productoExistente = this.items.find((item) => item._id === id);
    if (productoExistente) {
      productoExistente.cantidad = cantidad;
    }

    this.mostrarCarrito();
    actualizarNotificacionCarrito.call(this);
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
  }
}

// Verificar si los datos del carrito están presentes al cargar la página
window.addEventListener("load", async () => {
  await cargarCarritoDesdeStorage.call({ items: [] });
});
