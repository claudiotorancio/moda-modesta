import { baseURL } from "./product_services.js";

export class CarritoServices {
  constructor() {
    this.baseURL = baseURL;
  }

  // Obtener productos del carrito
  getProductsCart = async () => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/getProductsCart`);
      if (!respuesta.ok) {
        throw new Error("Error en la solicitud");
      }
      const data = await respuesta.json();
      const productosCarrito = data.productsCart;
      return productosCarrito;
    } catch (error) {
      console.error("Error al obtener productos del carrito:", error);
      throw error;
    }
  };

  // Agregar producto al carrito
  addProductCart = async (producto) => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/addProductCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });
      if (!respuesta.ok) {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  };

  // Eliminar producto del carrito
  deleteProductCart = async (id) => {
    console.log(id);
    try {
      const respuesta = await fetch(
        `${this.baseURL}/api/deleteProductCart/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!respuesta.ok) {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  };

  // Actualizar cantidad del producto en el carrito
  putProductCart = async (data, id) => {
    try {
      const respuesta = await fetch(
        `${this.baseURL}/api/putProductCart/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!respuesta.ok) {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error al actualizar producto en el carrito:", error);
      throw error;
    }
  };
}
