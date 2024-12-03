import { CarritoServices } from "../../services/carrito_services.js";
import validator from "validator";
import Carrito from "./carrito.js";

const carritoServices = new CarritoServices();

export function actualizarNotificacionCarrito() {
  const carritoContainer = document.querySelector(".carrito-link");
  if (!carritoContainer) {
    console.error("No se encontró el contenedor del carrito.");
    return;
  }

  const carritoNotificacion =
    carritoContainer.querySelector(".carrito-cantidad");
  const carritoMonto = carritoContainer.querySelector(".carrito-monto");

  if (!this.cantidadTotal || !this.calcularTotal) {
    console.error(
      "Las funciones 'cantidadTotal' o 'calcularTotal' no están definidas."
    );
    return;
  }

  const cantidadTotal = this.cantidadTotal();
  const total = this.calcularTotal();

  carritoNotificacion.textContent = cantidadTotal > 0 ? cantidadTotal : "0";
  carritoMonto.textContent = total > 0 ? `$${total.toFixed(2)}` : "$0.00";
}

// Agregar producto al carrito
export async function agregarProducto(product) {
  try {
    const sanitizedProductId = validator.escape(product._id);
    const sanitizedSize = product.size ? validator.escape(product.size) : null;

    const productoExistente = this.items.find(
      (item) =>
        item.productId === sanitizedProductId &&
        String(item.size || "")
          .trim()
          .toLowerCase() === (sanitizedSize || "")
    );

    if (productoExistente) {
      const nuevaCantidad = productoExistente.cantidad + product.cantidad;

      // Validar y actualizar cantidad con lógica de stock
      await actualizarCantidad.call(
        this,
        productoExistente.productId,
        nuevaCantidad,
        product
      );
    } else {
      if (product.stock > 0) {
        const productoNuevo = {
          ...product,
          productId: sanitizedProductId,
          sessionId: this.sessionId,
        };

        await carritoServices.addProductCart(productoNuevo);
        this.items.push(productoNuevo);
      } else {
        console.error("Producto sin stock disponible.");
        alert("Este producto ya no tiene stock disponible.");
      }
    }
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}

// Actualizar cantidad en la base de datos
export async function actualizarCantidad(id, cantidad, product) {
  try {
    const carrito = new Carrito();
    await carrito.cargarCarritoDesdeStorage();
    const producto = this.items.find((item) => item.productId === id);
    if (!producto) {
      console.error("Producto no encontrado en el carrito.");
      return;
    }

    const nuevaCantidad = Math.max(0, parseInt(cantidad, 10));

    if (nuevaCantidad > product.stock) {
      const messageElement = document.getElementById("message");
      if (messageElement) {
        messageElement.textContent = `Solo hay ${product.stock} unidades disponibles para el producto seleccionado.`;
        document.getElementById("messageContainer").style.display = "block";
      }

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Espera de 3 segundos
      return;
    }

    producto.cantidad = nuevaCantidad;

    await carritoServices.putProductCart({
      cantidad: nuevaCantidad,
      productId: producto.productId,
      sessionId: this.sessionId,
    });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
  }
}
