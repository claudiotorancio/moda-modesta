//Carrito.js

import { modalControllers } from "../../modal/modal.js";
import { mostrarCarrito } from "./mostrarCarrito.js";
import {
  agregarProducto,
  eliminarProducto,
  actualizarCantidad,
  actualizarNotificacionCarrito,
  cargarCarritoDesdeStorage,
} from "./productHandlers.js";
import { calcularSubtotal, calcularTotal, cantidadTotal } from "./calculos.js";
import { CarritoServices } from "../../services/carrito_services.js";

class Carrito {
  constructor() {
    this.carritoServices = new CarritoServices();
    this.costoEnvio = 0;
    this.inicializarEventos();
    this.sessionId = this.obtenerOGenerarSessionId();
    this.items = cargarCarritoDesdeStorage.call(this) || [];
  }

  generateSessionId() {
    // Generar un sessionId único (puedes usar cualquier método de generación de ID único)
    return "session_" + Math.random().toString(36).substr(2, 9);
  }

  // Recuperar o generar sessionId
  async obtenerOGenerarSessionId() {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = await this.carritoServices.obtenerSessionIdDelServidor();
      localStorage.setItem("sessionId", sessionId);
    }
    console.log(sessionId);
    return sessionId;
  }

  inicializarEventos() {
    const toggleCart = document.querySelector(".js-toggle-cart");
    if (toggleCart) {
      toggleCart.addEventListener("click", (event) => {
        event.preventDefault();
        this.costoEnvio = 0;
        modalControllers.baseModal();
        this.mostrarCarrito();
      });
    }
  }

  async agregarProducto(product) {
    try {
      await agregarProducto.call(this, product);
      await this.mostrarCarrito(); // Recargar carrito después de agregar producto
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async eliminarProducto(id) {
    try {
      await eliminarProducto.call(this, id);
      await this.mostrarCarrito(); // Recargar carrito después de eliminar producto
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
    await cargarCarritoDesdeStorage.call(this);
    return mostrarCarrito.call(this);
  }

  // Limpia el carrito
  async limpiarCarrito() {
    this.items = [];
    sessionStorage.removeItem("carrito");
    await this.carritoServices.limpiarCarrito();
  }
}

export default Carrito;
