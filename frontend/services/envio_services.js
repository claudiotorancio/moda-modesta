import { baseURL } from "../../backend/baseUrl.js";
import { modalControllers } from "../modal/modal.js";

export class EnvioService {
  constructor() {
    this.baseURL = baseURL;
  }

  async calcularCostoEnvio(datosEnvio) {
    try {
      const response = await fetch(`${this.baseURL}/api/costoEnvio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Agregar el token aquí
        },
        body: JSON.stringify(datosEnvio),
      });
      if (!response.ok) {
        throw new Error("No fue posible calcular el costo del envío");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async notificacionSinStock(datos) {
    try {
      const response = await fetch(`${this.baseURL}/api/notificacionSinStock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        // Si la respuesta no es exitosa, se lanza un error con el mensaje adecuado
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Si la respuesta es exitosa, muestra el mensaje de éxito
      modalControllers.modalMsg(dataResponse.message);
      return dataResponse; // Devuelve los datos recibidos
    } catch (error) {
      // Aquí capturamos cualquier error, ya sea del backend o de la solicitud
      console.error("Error:", error);
      modalControllers.modalMsg(error.message); // Muestra el error en el modal
    }
  }

  // Obtener productos del carrito
  async getNotificaciones() {
    try {
      const response = await fetch(`${this.baseURL}/api/getNotificaciones`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Agregar el token aquí
        },
      });
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener las notificaciones", error);
      throw error;
    }
  }

  async notificacionIngreso(idProducto, idNotificaciones) {
    try {
      const response = await fetch(`${this.baseURL}/api/notificacionIngreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Agregar el token aquí
        },
        body: JSON.stringify({ idProducto, idNotificaciones }),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Muestra de éxito en pantalla
      modalControllers.modalMsg(dataResponse.message);
      return dataResponse; // Devuelve los datos recibidos
    } catch (error) {
      modalControllers.modalMsg(error.message);
      console.error(error);
    }
  }
}

const envioServices = new EnvioService();
export default envioServices;
