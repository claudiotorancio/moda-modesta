import { modalControllers } from "../modal/modal.js";
import { baseURL } from "../../backend/baseUrl.js";

class ProductService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchJSON(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async listaProductos() {
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token está presente
    try {
      const response = await fetch(`${this.baseURL}/api/listaProductos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener la lista de productos.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }

  async detalleProducto(id) {
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token está presente
    return await this.fetchJSON(`${this.baseURL}/api/detailsProduct/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async crearProducto(product) {
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token está presente
    try {
      const response = await fetch(`${this.baseURL}/api/createProduct`, {
        method: "POST",
        body: product, // formData
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
        },
      });

      const dataResponse = await response.json().catch(() => {
        throw new Error("Respuesta no válida del servidor.");
      });

      if (!response.ok) {
        // Lanza el contenido JSON en caso de error (si está presente)
        throw dataResponse;
      }
      // Muestra de éxito en pantalla
      modalControllers.modalMsgReload(dataResponse.message);
    } catch (error) {
      const errorMessages = error.errors
        .map((err) => `${err.field}: ${err.message}`)
        .join("\n");
      modalControllers.modalMsgReload(errorMessages);
    }
  }

  async desactivarProducto(id) {
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token está presente
    try {
      const response = await fetch(
        `${this.baseURL}/api/desactivateProduct/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token aquí
          },
        }
      );
      const dataResponse = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Muestra de éxito en pantalla
      modalControllers.modalMsg(dataResponse.message);
    } catch (error) {
      modalControllers.modalMsg(error.message);
      console.error(error);
    }
  }

  async activarProducto(id) {
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token está presente
    try {
      const response = await fetch(
        `${this.baseURL}/api/activateProduct/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token aquí
          },
        }
      );
      const dataResponse = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Muestra de éxito en pantalla
      modalControllers.modalMsg(dataResponse.message);
    } catch (error) {
      modalControllers.modalMsg(error.message);
      console.error(error);
    }
  }

  async destacadosProducto() {
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token está presente
    try {
      const response = await fetch(`${this.baseURL}/api/renderDestacados`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error al obtener productos destacados:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  async actualizarProducto(product) {
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token está presente
    try {
      const response = await fetch(`${this.baseURL}/api/updateProduct`, {
        method: "PUT",
        body: product, // formData
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
        },
      });

      const dataResponse = await response.json().catch(() => {
        throw new Error("Respuesta no válida del servidor.");
      });

      if (!response.ok) {
        // Lanza el contenido JSON en caso de error (si está presente)
        throw dataResponse;
      }
      // Muestra de éxito en pantalla
      modalControllers.modalMsgReloadEstado(dataResponse.message);
    } catch (error) {
      const errorMessages = error.errors
        .map((err) => `${err.field}: ${err.message}`)
        .join("\n");
      modalControllers.modalMsg(errorMessages);
    }
  }

  async productoSimilar(id) {
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token está presente
    try {
      const response = await fetch(
        `${this.baseURL}/api/productoSimilar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token aquí
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      return data.productosSimilares;
    } catch (error) {
      console.error("Error al obtener productos similares:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }
}

// Instancia de la clase ProductService
const productoServices = new ProductService(baseURL);

export default productoServices;
