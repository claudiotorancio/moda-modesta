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
    this.items = []; // Inicia con un array vacío
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
        this.cargarCarrito(); // Carga los productos al iniciar
        modalControllers.baseModal();
        this.mostrarCarrito();
        this.actualizarNotificacion();
      });
    }
  }

  async agregarProducto({ product, size }) {
    try {
      await agregarProducto.call(this, product, size);
      await this.cargarCarrito(); // Recargar carrito después de agregar producto
      this.actualizarNotificacion();
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
      await this.cargarCarrito(); // Recargar carrito después de actualizar cantidad
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
    return actualizarNotificacionCarrito.call(this);
  }

  mostrarCarrito() {
    return mostrarCarrito.call(this);
  }

  // Limpia el carrito
  limpiarCarrito() {
    this.items = [];
    sessionStorage.removeItem("carrito");
    this.carritoServices.limpiarCarrito();
  }
}

export default Carrito;
