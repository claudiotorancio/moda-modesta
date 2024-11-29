import { CarritoServices } from "../../services/carrito_services.js";
import validator from "validator";

const carritoServices = new CarritoServices();

export async function cargarCarritoDesdeStorage() {
  try {
    if (!this.sessionId) {
      throw new Error("El sessionId no está definido");
    }
    // Obtén los productos del carrito usando el sessionId
    this.items = await carritoServices.getProductsCart(this.sessionId);

    sessionStorage.setItem("carrito", JSON.stringify(this.items));
    this.actualizarNotificacion?.();
  } catch (error) {
    console.error("Error al cargar el carrito desde la base de datos:", error);
    this.items = [];
  }
}

export function actualizarNotificacionCarrito() {
  const carritoContainer = document.querySelector(".carrito-link");
  if (!carritoContainer) {
    console.error("No se encontró el contenedor del carrito.");
    return;
  }

  const carritoNotificacion =
    carritoContainer.querySelector(".carrito-cantidad");
  const carritoMonto = carritoContainer.querySelector(".carrito-monto");

  const cantidadTotal = this.cantidadTotal?.();
  const total = this.calcularTotal?.();

  carritoNotificacion.textContent = cantidadTotal > 0 ? cantidadTotal : "0";
  carritoMonto.textContent = total > 0 ? `$${total.toFixed(2)}` : "$0.00";
}

//agregar producto nuevo
export async function agregarProducto(product) {
  console.log(product);
  try {
    const sanitizedProductId = validator.escape(product._id);
    const sanitizedSize = product.size ? validator.escape(product.size) : null;

    const productoExistente = this.items.find(
      (item) =>
        item.productId === sanitizedProductId &&
        String(item.size).trim().toLowerCase() === sanitizedSize
    );

    if (productoExistente) {
      // Incrementa la cantidad deseada (aquí usando 1 como incremento predeterminado)
      const nuevaCantidad = productoExistente.cantidad + product.cantidad;

      // Llama a actualizarCantidad para validar y aplicar la lógica de stock
      await actualizarCantidad.call(
        this,
        productoExistente.productId,
        nuevaCantidad,
        product
      );
    } else {
      if (product.stock >= 1) {
        const productoNuevo = {
          name: product.name,
          price: parseFloat(product.price),
          cantidad: product.cantidad,
          unidad: product.unidad,
          imagePath: product.imagePath[0],
          productId: sanitizedProductId,
          category: product.section,
          discount: product.discount,
          isActive: product.isActive,
          sessionId: this.sessionId,
          size: product.size,
        };

        await carritoServices.addProductCart(productoNuevo);
        this.items?.push(productoNuevo);
      } else {
        console.error("Producto sin stock disponible.");
        return alert("Este producto ya no tiene stock disponible.");
      }
    }
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}

//actualizarCantidad base de datos

export async function actualizarCantidad(id, cantidad, product) {
  try {
    // Encontrar el producto en el carrito
    const producto = this.items.find((item) => item.productId === id);
    if (!producto) {
      console.error("Producto no encontrado en el carrito.");
      return;
    }

    // Validar la cantidad ingresada
    const nuevaCantidad = Math.max(0, parseInt(cantidad, 10)); // Asegura que la cantidad sea un número positivo

    // // Verificar stock disponible
    if (nuevaCantidad > product.stock) {
      const messageElement = document.getElementById("message");
      if (messageElement) {
        messageElement.textContent = `Solo hay ${product.stock} unidades disponibles para el producto seleccionado.`;
        document.getElementById("messageContainer").style.display = "block";
      }

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Espera de 3 segundos
      return;
    }

    // Actualizar la cantidad en el carrito y en el almacenamiento
    producto.cantidad = nuevaCantidad;
    await carritoServices.putProductCart({
      cantidad: nuevaCantidad,
      productId: producto._id,
      sessionId: this.sessionId,
    });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
  }
}

export async function eliminarProducto(id) {
  try {
    if (!this.items) {
      await cargarCarritoDesdeStorage.call(this);
    }
    await carritoServices.deleteProductCart(this.sessionId, id);
    this.items = this.items.filter((item) => item._id !== id);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// Verificar si los datos del carrito están presentes al cargar la página
window.addEventListener("load", async () => {
  const sessionId = sessionStorage.getItem("sessionId");
  await cargarCarritoDesdeStorage.call({ items: [], sessionId });
});
