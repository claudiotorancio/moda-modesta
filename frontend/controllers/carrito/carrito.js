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
    this.sessionId = null;
    this.items = [];
    this.inicializarEventos();
  }

  async inicializar() {
    try {
      // Cargar o generar el sessionId
      this.sessionId = localStorage.getItem("modesta_sessionId");
      if (!this.sessionId) {
        this.sessionId = await this.obtenerOGenerarSessionId();
      }
      // Cargar el carrito desde el almacenamiento
      await this.cargarCarrito();
    } catch (error) {
      console.error("Error durante la inicialización del carrito:", error);
    }
  }

  async obtenerOGenerarSessionId() {
    try {
      let sessionId = localStorage.getItem("modesta_sessionId");
      if (!sessionId) {
        sessionId = await this.carritoServices.obtenerOGenerarSessionId();
      }
      return sessionId;
    } catch (error) {
      console.error("Error al obtener o generar sessionId:", error);
      return null;
    }
  }

  async cargarCarrito() {
    try {
      this.sessionId = localStorage.getItem("modesta_sessionId");
      if (!this.sessionId) {
        throw new Error("El sessionId no está definido");
      }
      // Obtener los productos del carrito desde el servidor
      this.items = await this.carritoServices.getProductsCart(this.sessionId);
      this.actualizarSessionStorage();
      this.actualizarNotificacion();
    } catch (error) {
      console.error(
        "Error al cargar el carrito desde la base de datos:",
        error
      );
      this.items = [];
    }
  }

  cargarSessionStorage() {
    const storedItems = JSON.parse(sessionStorage.getItem("carrito")) || [];
    if (storedItems.length > 0) {
      this.items = storedItems;
      console.log("Carrito cargado desde sessionStorage:", this.items);
      return true; // Retorna true si se cargaron ítems desde storage
    } else {
      console.log("No hay ítems en sessionStorage.");
      return false; // Retorna false si no hay ítems en storage
    }
  }

  actualizarSessionStorage() {
    sessionStorage.setItem("carrito", JSON.stringify(this.items));
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

  async agregarProducto(producto) {
    try {
      await agregarProducto.call(this, producto);
      this.mostrarCarrito();
      this.actualizarNotificacion();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async eliminarProducto(id) {
    try {
      await this.cargarCarrito();
      await this.carritoServices.deleteProductCart(this.sessionId, id);
      this.items = this.items.filter((item) => item._id !== id);
      this.actualizarSessionStorage();
      this.mostrarCarrito();
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
