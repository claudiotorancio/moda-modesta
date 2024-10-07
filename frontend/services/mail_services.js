import { modalControllers } from "../modal/modal.js";
import { baseURL } from "../../backend/baseUrl.js";
import { CarritoServices } from "./carrito_services.js";

export class MailServices {
  constructor() {
    this.baseURL = baseURL;
    this.carritoServices = new CarritoServices(); // Instancia del servicio de carrito
  }

  async sendMail(datosCompra) {
    try {
      const response = await fetch(`${this.baseURL}/api/sendMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosCompra),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Muestra de éxito en pantalla
      modalControllers.modalMsgReload(dataResponse.message);
      return dataResponse; // Devuelve los datos recibidos
    } catch (error) {
      modalControllers.modalMsgReload(error.message);
      console.error(error);
    }
  }

  async mailContact(datos) {
    try {
      const response = await fetch(`${this.baseURL}/api/suscribeMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
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

const mailServices = new MailServices();

export default mailServices;
