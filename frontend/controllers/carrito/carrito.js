import { modalControllers } from "../../modal/modal.js";
import { mostrarCarrito } from "./mostrarCarrito.js";
import {
  agregarProducto,
  actualizarCantidad,
  actualizarNotificacionCarrito,
} from "./productHandlers.js";
import { calcularSubtotal, calcularTotal, cantidadTotal } from "./calculos.js";
import { CarritoServices } from "../../services/carrito_services.js";

class Carrito {
  constructor() {
    this.carritoServices = new CarritoServices();
    this.costoEnvio = 0;
    this.inicializarEventos();
    this.items = [];
  }

  async cargarCarritoDesdeStorage() {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) throw new Error("El sessionId no está definido");

      this.items = await this.carritoServices.getProductsCart(sessionId);
      sessionStorage.setItem("carrito", JSON.stringify(this.items));
      this.actualizarNotificacion();
    } catch (error) {
      console.error(
        "Error al cargar el carrito desde la base de datos:",
        error
      );
      this.items = [];
    }
  }

  inicializarEventos() {
    const toggleCart = document.querySelector(".js-toggle-cart");
    if (toggleCart) {
      toggleCart.addEventListener("click", (event) => {
        event.preventDefault();
        this.costoEnvio = 0;
        modalControllers.baseModal();
        this.mostrarCarrito();
        this.actualizarNotificacion();
      });
    }
  }

  async agregarProducto({ producto, sessionId }) {
    try {
      await agregarProducto.call(this, producto, sessionId);
      this.mostrarCarrito();
      this.actualizarNotificacion();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async eliminarProducto(id) {
    try {
      const sessionId = localStorage.getItem("sessionId");
      await this.carritoServices.deleteProductCart(sessionId, id);
      this.items = this.items.filter((item) => item._id !== id);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  async actualizarCantidad(id, cantidad) {
    try {
      await actualizarCantidad.call(this, id, cantidad);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  }

  calcularSubtotal() {
    return calcularSubtotal.call(this);
  }

  calcularTotal() {
    return calcularTotal.call(this);
  }

  cantidadTotal() {
    return cantidadTotal.call(this);
  }

  actualizarNotificacion() {
    actualizarNotificacionCarrito.call(this);
  }

  async mostrarCarrito() {
    this.cargarCarritoDesdeStorage();
    return mostrarCarrito.call(this);
  }

  async limpiarCarrito() {
    this.items = [];
    sessionStorage.removeItem("carrito");
    await this.carritoServices.limpiarCarrito();
  }
}

export default Carrito;

// Inicializar el carrito al cargar la página
window.addEventListener("load", async () => {
  const carrito = new Carrito();
  await carrito.cargarCarritoDesdeStorage();
});
