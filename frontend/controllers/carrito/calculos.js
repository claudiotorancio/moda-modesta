// calculos.js
export function calcularSubtotal() {
  return this.items.reduce(
    (total, producto) => total + producto.price * producto.cantidad,
    0
  );
}

export function calcularParcial() {
  return this.items.reduce(
    (cantidad, producto) => cantidad * producto.price,
    0
  );
}
export function calcularTotal() {
  return this.calcularSubtotal() + this.costoEnvio;
}
