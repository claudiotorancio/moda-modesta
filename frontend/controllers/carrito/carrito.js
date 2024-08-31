// carrito.js
import { modalControllers } from "../../modal/modal.js";
import { mostrarCarrito } from "./mostrarCarrito.js";
import {
  agregarProducto,
  eliminarProducto,
  actualizarCantidad,
} from "./productHandlers.js";
import { calcularSubtotal, calcularTotal } from "./calculos.js";

class Carrito {
  constructor() {
    this.items = JSON.parse(sessionStorage.getItem("carrito")) || [];
    this.costoEnvio = 0;
    this.envioExpiracion = null;
    this.inicializarEventos();
    this.mostrarCarrito();
  }

  inicializarEventos() {
    const toggleCart = document.querySelector(".js-toggle-cart");
    if (toggleCart) {
      toggleCart.addEventListener("click", (event) => {
        event.preventDefault();
        modalControllers.baseModal();
        this.mostrarCarrito();
      });
    }
    const closeModal = document.querySelector(".js-close-modal");
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        sessionStorage.removeItem("progreso-compra");
      });
    }
  }

  agregarProducto({ product, size }) {
    agregarProducto.call(this, product, size);
  }

  eliminarProducto(id) {
    eliminarProducto.call(this, id);
  }

  actualizarCantidad(id, cantidad) {
    actualizarCantidad.call(this, id, cantidad);
  }

  calcularSubtotal() {
    return calcularSubtotal.call(this);
  }

  calcularTotal() {
    return calcularTotal.call(this);
  }

  mostrarCarrito() {
    mostrarCarrito.call(this);
  }
}

export default Carrito;
