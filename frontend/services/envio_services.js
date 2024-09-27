// envio_services.js

import { baseURL } from "./product_services.js";
import { modalControllers } from "../modal/modal.js";

export class EnvioService {
  constructor() {
    this.baseURL = baseURL;
  }

  async calcularCostoEnvio(datosEnvio) {
    // console.log(datosEnvio);
    try {
      const response = await fetch(`${this.baseURL}/api/costoEnvio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    const response = await fetch(`${this.baseURL}/api/notificacionSinStock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      throw new Error("No fue posible guradar la notificacion");
    }
    return await response.json();
  }
  catch(error) {
    console.error(error);
  }

  // Obtener productos del carrito
  async getNotificaciones() {
    try {
      const response = await fetch(`${this.baseURL}/api/getNotificaciones`);
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error al obtener lwsa notificaciones", error);
      throw error;
    }
  }

  async notificacionIngreso(idProducto, idNotificaciones) {
    try {
      const response = await fetch(`${this.baseURL}/api/notificacionIngreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ idProducto, idNotificaciones }),
      });

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        modalControllers.modalCorreoEnviado();
      } else {
        modalControllers.modalCorreoNoenviado();
      }
    } catch (err) {
      console.error("Error al enviar los datos de la notificacion:", err);
      alert("Hubo un error al enviar. Por favor, intente nuevamente.");
    }
  }
}

const envioServices = new EnvioService();
export default envioServices;
