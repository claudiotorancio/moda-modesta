// calculos.js
export function calcularSubtotal() {
  return this.items.reduce((total, producto) => total + producto.price, 0);
}

export function calcularTotal() {
  return this.calcularSubtotal() + this.costoEnvio;
}
