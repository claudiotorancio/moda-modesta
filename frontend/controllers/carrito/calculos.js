// calculos.js
export function calcularSubtotal() {
  return this.items.reduce((total, producto) => {
    // Si el producto tiene un descuento, calcula el precio con descuento
    const precioConDescuento =
      producto.discount > 0
        ? producto.price * (1 - producto.discount / 100)
        : producto.price;

    // Suma el precio (con descuento si aplica) al total, multiplicado por la cantidad
    return total + precioConDescuento * producto.cantidad;
  }, 0);
}

export function calcularTotal() {
  return this.calcularSubtotal() + this.costoEnvio;
}
