import { CarritoServices } from "../../services/carrito_services.js";

const carritoServices = new CarritoServices();

// Función para cargar el carrito desde sessionStorage o desde una fuente asíncrona
export async function cargarCarritoDesdeStorage() {
  // Intentar cargar el carrito guardado en sessionStorage
  const carritoGuardado = sessionStorage.getItem("carrito");

  if (carritoGuardado) {
    // Si hay un carrito guardado en sessionStorage, lo asignamos a this.items
    this.items = JSON.parse(carritoGuardado);
  } else {
    // Si no hay carrito en sessionStorage, lo cargamos desde la fuente asíncrona
    await cargarDatosCarrito();
    // Guardamos el carrito en sessionStorage para futuras cargas
    sessionStorage.setItem("carrito", JSON.stringify(this.items));
  }
}

// Función asíncrona para cargar los datos del carrito desde la fuente (API, base de datos, etc.)
async function cargarDatosCarrito() {
  try {
    // Supongamos que hay una API para obtener el carrito
    const response = await fetch("/api/carrito");

    if (!response.ok) {
      throw new Error("Error al cargar los datos del carrito");
    }

    // Asignamos los datos del carrito a this.items
    this.items = await response.json();
  } catch (error) {
    console.error("Error al cargar los datos del carrito:", error);
    this.items = []; // En caso de error, asignamos un carrito vacío
  }
}

export async function agregarProducto(product, size) {
  console.log(product, size);
  try {
    // Cargar el carrito desde storage si no está cargado ya
    if (!this.items) {
      await cargarCarritoDesdeStorage();
    }

    // Obtener productos del carrito desde el estado local
    const productoExistente = this.items.find(
      (item) => item.productId === product._id && item.size === size
    );

    if (productoExistente) {
      // Actualizar la cantidad en el estado local del carrito
      productoExistente.cantidad += 1;

      // Actualizar el producto en el carrito en el servidor
      await carritoServices.putProductCart(
        { cantidad: productoExistente.cantidad },
        productoExistente._id
      );
    } else {
      // Crear un nuevo producto para agregar al carrito
      const productoNuevo = {
        name: product.name,
        price: parseFloat(product.price),
        cantidad: 1,
        size: size,
        imagePath: product.imagePath[0],
        productId: product._id,
      };

      console.log(productoNuevo);

      // Agregar el nuevo producto al carrito en el servidor
      await carritoServices.addProductCart(productoNuevo);

      // Agregar el nuevo producto al estado local del carrito
      this.items.push(productoNuevo);
    }

    // Guardar el carrito actualizado en sessionStorage
    sessionStorage.setItem("carrito", JSON.stringify(this.items));

    // Mostrar el carrito actualizado
    this.mostrarCarrito();
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}

export async function eliminarProducto(id) {
  try {
    // Cargar el carrito desde storage si no está cargado ya
    if (!this.items) {
      await cargarCarritoDesdeStorage();
    }

    // Eliminar producto del carrito en el servidor
    await carritoServices.deleteProductCart(id);

    // Eliminar el producto del estado local del carrito
    this.items = this.items.filter((item) => item._id !== id);

    // Guardar el carrito actualizado en sessionStorage
    sessionStorage.setItem("carrito", JSON.stringify(this.items));

    // Mostrar el carrito actualizado
    this.mostrarCarrito();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

export async function actualizarCantidad(id, cantidad) {
  try {
    // Cargar el carrito desde storage si no está cargado ya
    if (!this.items) {
      await cargarCarritoDesdeStorage();
    }

    // Actualizar la cantidad del producto en el carrito en el servidor
    await carritoServices.putProductCart({ cantidad }, id);

    // Actualizar la cantidad en el estado local del carrito
    const productoExistente = this.items.find((item) => item._id === id);
    if (productoExistente) {
      productoExistente.cantidad = cantidad;
    }

    // Guardar el carrito actualizado en sessionStorage
    sessionStorage.setItem("carrito", JSON.stringify(this.items));

    // Mostrar el carrito actualizado
    this.mostrarCarrito();
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
  }
}
