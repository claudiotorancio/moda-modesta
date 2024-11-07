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
    this.cargarCarrito();
  }

  async cargarCarrito() {
    try {
      // Carga los productos del carrito desde la API
      await cargarCarritoDesdeStorage.call(this);
      this.costoEnvio = 0;
      this.mostrarCarrito(); // Muestra el carrito una vez cargado
      this.actualizarNotificacion();
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  }

  inicializarEventos() {
    const toggleCart = document.querySelector(".js-toggle-cart");
    if (toggleCart) {
      toggleCart.addEventListener("click", (event) => {
        event.preventDefault();
        modalControllers.baseModal();
        this.cargarCarrito();
      });
    }
  }

  async agregarProducto({ product, unidad }) {
    try {
      await agregarProducto.call(this, product, unidad);
      await this.cargarCarrito(); // Recargar carrito después de agregar producto
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async eliminarProducto(id) {
    try {
      await eliminarProducto.call(this, id);
      await this.cargarCarrito(); // Recargar carrito después de eliminar producto
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

  mostrarCarrito() {
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
