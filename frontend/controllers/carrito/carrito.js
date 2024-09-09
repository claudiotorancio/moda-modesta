import { modalControllers } from "../../modal/modal.js";
import { mostrarCarrito } from "./mostrarCarrito.js";
import {
  agregarProducto,
  eliminarProducto,
  actualizarCantidad,
} from "./productHandlers.js";
import { calcularSubtotal, calcularTotal } from "./calculos.js";
import { CarritoServices } from "../../services/carrito_services.js";

class Carrito {
  constructor() {
    this.carritoServices = new CarritoServices();
    this.items = []; // Inicia con un array vacío
    this.costoEnvio = 0;
    this.envioExpiracion = null;
    this.loading = true; // Agrega estado de carga
    this.inicializarEventos();
    this.cargarCarrito(); // Carga los productos al iniciar
  }

  async cargarCarrito() {
    try {
      // Carga los productos del carrito desde la API
      this.items = await this.carritoServices.getProductsCart();
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    } finally {
      this.loading = false; // Cambia el estado de carga a false
      this.mostrarCarrito(); // Muestra el carrito una vez cargado
    }
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
        // Realiza cualquier limpieza adicional si es necesario
      });
    }
  }

  async agregarProducto({ product, size }) {
    try {
      await agregarProducto.call(this, product, size);
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

  mostrarCarrito() {
    // Verifica si los productos aún se están cargando
    if (this.loading) {
      // Mostrar un indicador de carga, o simplemente no hacer nada
      console.log("Cargando productos del carrito...");
      return;
    }

    // Mostrar los productos del carrito si están cargados
    mostrarCarrito.call(this);
  }
}

export default Carrito;
