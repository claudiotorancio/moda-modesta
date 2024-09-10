import { CarritoServices } from "../../services/carrito_services.js";

const carritoServices = new CarritoServices();

export async function cargarCarritoDesdeStorage() {
  const carritoGuardado = sessionStorage.getItem("carrito");

  if (carritoGuardado) {
    this.items = JSON.parse(carritoGuardado);
  } else {
    await cargarDatosCarrito();
    sessionStorage.setItem("carrito", JSON.stringify(this.items));
  }
  actualizarNotificacionCarrito.call(this); // Actualizar notificación al cargar el carrito
}

async function cargarDatosCarrito() {
  try {
    const response = await fetch("/api/carrito");

    if (!response.ok) {
      throw new Error("Error al cargar los datos del carrito");
    }

    this.items = await response.json();
  } catch (error) {
    console.error("Error al cargar los datos del carrito:", error);
    this.items = [];
  }
}

function actualizarNotificacionCarrito() {
  const carritoContainer = document.querySelector(".carrito-link");
  if (!carritoContainer) {
    console.error("No se encontró el contenedor del carrito.");
    return;
  }

  const carritoNotificacion =
    carritoContainer.querySelector(".carrito-cantidad");
  const carritoMonto = carritoContainer.querySelector(".carrito-monto");

  const cantidadTotal = this.items.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );
  const total = this.items.reduce(
    (acc, item) => acc + item.price * item.cantidad,
    0
  );

  carritoNotificacion.textContent = cantidadTotal > 0 ? cantidadTotal : "";
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

    sessionStorage.setItem("carrito", JSON.stringify(this.items));
    this.mostrarCarrito();
    actualizarNotificacionCarrito.call(this); // Actualizar notificación al agregar producto
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

    sessionStorage.setItem("carrito", JSON.stringify(this.items));
    this.mostrarCarrito();
    actualizarNotificacionCarrito.call(this); // Actualizar notificación al eliminar producto
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

    sessionStorage.setItem("carrito", JSON.stringify(this.items));
    this.mostrarCarrito();
    actualizarNotificacionCarrito.call(this); // Actualizar notificación al actualizar cantidad
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
  }
}
