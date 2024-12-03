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
    this.items = [];
    this.sessionId = null;
    this.inicializarEventos();
  }

  async inicializar() {
    // Asegúrate de que se obtiene el sessionId al cargar la página
    this.sessionId = await this.obtenerOGenerarSessionId();
    if (!this.sessionId) {
      console.error("No se pudo obtener el sessionId.");
    } else {
      console.log("sessionId:", this.sessionId);
      await this.cargarCarritoDesdeStorage();
    }
  }

  async cargarCarritoDesdeStorage() {
    try {
      if (!this.sessionId) throw new Error("El sessionId no está definido");

      this.items = await this.carritoServices.getProductsCart(this.sessionId);
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

  // Obtener sessionId desde el servidor
  async obtenerSessionIdDelServidor() {
    try {
      const response = await fetch(`${this.baseURL}/api/sessionId`).then(
        (res) => res.json()
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener sessionId");
      }
      return response.sessionId;
    } catch (error) {
      console.error("Error al obtener sessionId del servidor:", error);
      return null;
    }
  }

  generateSessionId() {
    return `session_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Obtener o generar sessionId
  async obtenerOGenerarSessionId() {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = await this.obtenerSessionIdDelServidor();
      if (!sessionId) {
        sessionId = this.generateSessionId();
      }
      sessionStorage.setItem("sessionId", sessionId); // Almacena sessionId en sessionStorage
    }
    return sessionId;
  }

  // Método para agregar un producto
  async agregarProducto(producto) {
    try {
      // Asegurarse de que el sessionId esté disponible
      if (!this.sessionId) {
        console.log("sessionId no disponible, obteniendo...");
        this.sessionId = await this.obtenerOGenerarSessionId();
      }

      if (!this.sessionId) {
        console.error("No se pudo obtener sessionId al agregar el producto.");
        return;
      }

      // Aquí va la lógica para agregar el producto
      await agregarProducto.call(this, producto);
      this.mostrarCarrito();
      this.actualizarNotificacion();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async eliminarProducto(id) {
    try {
      // Asegurarse de que el sessionId esté disponible
      if (!this.sessionId) {
        console.log("sessionId no disponible, obteniendo...");
        this.sessionId = await this.obtenerOGenerarSessionId();
      }

      if (!this.sessionId) {
        console.error("No se pudo obtener sessionId al eliminar el producto.");
        return;
      }

      // Lógica para eliminar el producto
      await this.carritoServices.deleteProductCart(this.sessionId, id);
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
  await carrito.inicializar();
});
