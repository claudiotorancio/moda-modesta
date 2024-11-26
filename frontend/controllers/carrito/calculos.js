// calculos.js
export function calcularSubtotal() {
  return this.items.reduce((total, producto) => {
    // Excluir productos pausados
    if (!producto.isActive) return total;
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
  // Excluir los productos pausados al calcular el subtotal
  const subtotal = this.calcularSubtotal();
  return subtotal + this.costoEnvio;
}

// Función para calcular la cantidad total de productos
export function cantidadTotal() {
  return this.items.reduce((acc, item) => {
    // Excluir productos pausados
    if (!item.isActive) return acc;

    return acc + item.cantidad;
  }, 0);
}
