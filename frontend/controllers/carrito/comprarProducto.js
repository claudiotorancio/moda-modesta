import Carrito from "./carrito.js";

const carrito = new Carrito();

export async function comprarProducto(
  id,
  name,
  price,
  imagePath,
  sizes,
  talleSeleccionado, // Cantidad cuando es de 'opcion3'
  section,
  generalStock,
  quantityInput,
  discount
) {
  try {
    let stockSeleccionado;
    let cantidad = Math.max(0, parseInt(quantityInput)); // Por defecto, la cantidad es 1

    // Verificar si es de la sección 'opcion3'
    if (section === "opcion3") {
      // En 'opcion3', 'talleSeleccionado' contiene la cantidad seleccionada
      stockSeleccionado = generalStock;

      // Verificar que haya suficiente stock general
      if (cantidad > stockSeleccionado) {
        console.error("Stock insuficiente para la cantidad seleccionada.");
        return alert(
          "No hay suficiente stock disponible para la cantidad seleccionada."
        );
      }

      // Verificar que haya suficiente stock general
      if (cantidad > stockSeleccionado) {
        console.error("Stock insuficiente para la cantidad seleccionada.");
        return alert(
          "No hay suficiente stock disponible para la cantidad seleccionada."
        );
      }
    } else {
      // Para otras secciones, encontrar el objeto del tamaño seleccionado en el array sizes
      const sizeObject = sizes.find((item) => item.size === talleSeleccionado);

      // Obtener el stock del talle seleccionado
      stockSeleccionado = sizeObject.stock || undefined;

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
      section: section,
      stock: stockSeleccionado, // Stock del talle o general, dependiendo de la sección
      cantidad: cantidad, // Incluir la cantidad seleccionada
      discount: discount,
    };

    // Agregar producto al carrito
    await carrito.agregarProducto({
      product: producto,
      size: section === "opcion3" ? "Un." : talleSeleccionado, // Si es opcion3, no hay talles
    });
  } catch (error) {
    console.error("Error al comprar producto:", error);
  }
}
