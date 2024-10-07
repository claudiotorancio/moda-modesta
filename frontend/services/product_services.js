import { modalControllers } from "../modal/modal.js";
import { baseURL } from "../../backend/baseUrl.js";

class ProductService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async listaProductos() {
    return await this.fetchJSON(`${this.baseURL}/api/listaProductos`);
  }

  async detalleProducto(id) {
    return await this.fetchJSON(`${this.baseURL}/api/detailsProduct/${id}`);
  }

  async crearProducto(product) {
    console.log(product);
    try {
      const response = await fetch(`${this.baseURL}/api/createProduct`, {
        method: "POST",
        body: product,
      });

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

  async desactivarProducto(id) {
    try {
      const response = await fetch(
        `${this.baseURL}/api/desactivateProduct/${id}`,
        {
          method: "PUT",
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
    try {
      const response = await fetch(
        `${this.baseURL}/api/activateProduct/${id}`,
        {
          method: "PUT",
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
    try {
      const response = await fetch(`${this.baseURL}/api/renderDestacados`);
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

  async actualizarProducto(product, id) {
    try {
      const response = await fetch(`${this.baseURL}/api/updateProduct/${id}`, {
        method: "PUT",
        body: product,
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Muestra de éxito en pantalla
      modalControllers.modalMsgReload(dataResponse.message);
    } catch (error) {
      modalControllers.modalMsgReload(error.message);
      console.error(error);
    }
  }

  async productoSimilar(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/productoSimilar/${id}`);
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
