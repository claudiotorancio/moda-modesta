class CarritoService {
  constructor() {
    this.items = [];
    this.costoEnvio = 0;
    this.isChecked = false;
  }

  calcularTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.cantidad,
      this.costoEnvio
    );
  }

  calcularSubtotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.cantidad,
      0
    );
  }

  mostrarNotificaciones(carritoNotificacion, carritoMonto) {
    carritoNotificacion.textContent = this.items.reduce(
      (acc, item) => acc + item.cantidad,
      0
    );
    carritoMonto.textContent = `$${this.calcularTotal().toFixed(2)}`;
  }

  eliminarProducto(itemId, itemSize) {
    this.items = this.items.filter(
      (item) => item._id !== itemId || item.size !== itemSize
    );
    this.mostrarCarrito(); // Asegúrate de que esta función esté bien implementada
  }

  // Limpia el carrito
  limpiarCarrito() {
    this.items = [];
  }

  // Otras funciones para manejar el carrito...
}

const carritoService = new CarritoService();
export default carritoService;
