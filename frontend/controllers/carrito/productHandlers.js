// productoHandlers.js
export function agregarProducto(product, size) {
  const productoExistente = this.items.find(
    (item) => item._id === product._id && item.size === size
  );
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    this.items.push({
      _id: product._id,
      name: product.name,
      price: parseFloat(product.price),
      cantidad: 1,
      size: size,
      imagePath: product.imagePath,
    });
  }
  sessionStorage.setItem("carrito", JSON.stringify(this.items));
  this.mostrarCarrito();
}

export function eliminarProducto(id) {
  this.items = this.items.filter((item) => item._id !== id);
  sessionStorage.setItem("carrito", JSON.stringify(this.items));
  this.mostrarCarrito();
}

export function actualizarCantidad(id, cantidad) {
  const producto = this.items.find((item) => item._id === id);
  if (producto) {
    producto.cantidad = cantidad;
  }
  this.mostrarCarrito();
}
