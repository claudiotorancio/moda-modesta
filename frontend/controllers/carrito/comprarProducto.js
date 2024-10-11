import Carrito from "./carrito.js";

const carrito = new Carrito();

export async function comprarProducto(
  id,
  name,
  price,
  imagePath,
  sizes,
  talleSeleccionado,
  section,
  generalStock
) {
  try {
    let stockSeleccionado;

    // Verificar si es de la sección 'opcion3'
    if (section === "opcion3") {
      // Usar el generalStock para productos de esta sección
      stockSeleccionado = generalStock;
    } else {
      // Encontrar el objeto del tamaño seleccionado en el array sizes
      const sizeObject = sizes.find((item) => item.size === talleSeleccionado);

      // Obtener el stock del talle seleccionado
      stockSeleccionado = sizeObject.stock;

      // Verificar si hay stock disponible para la talla seleccionada
      if (stockSeleccionado <= 0) {
        console.error("Stock insuficiente para la talla seleccionada.");
        return alert("No hay stock disponible para la talla seleccionada.");
      }
    }

    // Crear objeto de producto
    const producto = {
      _id: id,
      name: name,
      price: price,
      imagePath: imagePath,
      stock: stockSeleccionado, // Stock del talle o general, dependiendo de la sección
    };

    // Agregar producto al carrito
    await carrito.agregarProducto({
      product: producto,
      size: talleSeleccionado || "Un.", // Indicar 'Sin talla' si no hay talla seleccionada (opcion3)
    });
  } catch (error) {
    console.error("Error al comprar producto:", error);
  }
}
