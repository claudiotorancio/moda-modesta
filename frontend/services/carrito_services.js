import { baseURL } from "../../backend/baseUrl.js";

export class CarritoServices {
  constructor() {
    this.baseURL = baseURL;
  }

  async limpiarCarrito() {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(`${this.baseURL}/api/limpiarCarrito`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al limpiar el carrito en la base de datos");
      }

      return response.json();
    } catch (error) {
      console.error("Error al limpiar el carrito en la base de datos:", error);
    }
  }
  getProductsCart = async (sessionId) => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Verifica que el sessionId no sea undefined
      if (!sessionId) {
        throw new Error("El sessionId no está definido");
      }

      // Realizar la solicitud GET
      const respuesta = await fetch(
        `${this.baseURL}/api/getProductsCart?sessionId=${sessionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await respuesta.json();

      // Devolver los productos del carrito
      const productosCarrito = data.items;
      return productosCarrito;
    } catch (error) {
      console.error("Error al obtener productos del carrito:", error);
      throw error;
    }
  };

  // Agregar producto al carrito
  addProductCart = async (producto) => {
    const token = sessionStorage.getItem("authToken");

    try {
      const respuesta = await fetch(`${this.baseURL}/api/addProductCart`, {
        method: "POST",
        body: JSON.stringify(producto),
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
          "Content-Type": "application/json",
        },
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
  deleteProductCart = async (sessionId, id) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const respuesta = await fetch(`${this.baseURL}/api/deleteProductCart`, {
        method: "DELETE",
        body: JSON.stringify({ sessionId, id }),
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
          "Content-Type": "application/json",
        },
      });
      if (!respuesta.ok) {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  };

  // Actualizar cantidad del producto en el carrito
  putProductCart = async (data) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const respuesta = await fetch(`${this.baseURL}/api/putProductCart`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
          "Content-Type": "application/json",
        },
      });
      if (!respuesta.ok) {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error al actualizar producto en el carrito:", error);
      throw error;
    }
  };

  obtenerSessionIdDelServidor = async () => {
    try {
      const response = await fetch(`${this.baseURL}/api/sessionId`, {
        method: "GET",
        // credentials: "include", // Importante para incluir cookies en la solicitud
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener sessionId");
      }

      const data = await response.json();

      return data.sessionId;
    } catch (error) {
      console.error("Error al obtener sessionId del servidor:", error);
      return null;
    }
  };

  generateSessionId() {
    return `session_${Math.random().toString(36).substr(2, 9)}`;
  }

  async obtenerOGenerarSessionId() {
    try {
      // Primero verifica si ya hay un sessionId en localStorage
      let sessionId = localStorage.getItem("modesta_sessionId");

      if (!sessionId) {
        // Si no hay uno en localStorage, intenta obtenerlo del servidor
        sessionId = await this.obtenerSessionIdDelServidor();

        // Si no lo obtiene del servidor, genera uno nuevo
        if (!sessionId) {
          sessionId = this.generateSessionId();
        }

        // Guarda el sessionId en localStorage
        localStorage.setItem("modesta_sessionId", sessionId);
      }

      return sessionId;
    } catch (error) {
      console.error("Error en obtenerOGenerarSessionId:", error);
      // Genera un sessionId como último recurso y lo guarda
      const fallbackSessionId = this.generateSessionId();
      localStorage.setItem("modesta_sessionId", fallbackSessionId);
      return fallbackSessionId;
    }
  }
}
