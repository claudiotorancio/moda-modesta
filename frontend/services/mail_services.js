import { modalControllers } from "../modal/modal.js";
import { baseURL } from "../../backend/baseUrl.js";
import { CarritoServices } from "./carrito_services.js";
import Carrito from "../controllers/carrito/carrito.js";

export class MailServices {
  constructor() {
    this.baseURL = baseURL;
    this.carritoServices = new CarritoServices(); // Instancia del servicio de carrito
  }

  async sendMail(datosCompra) {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(`${this.baseURL}/api/sendMail`, {
        method: "POST",
        body: JSON.stringify(datosCompra),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

      const carrito = new Carrito();

      carrito.limpiarCarrito();

      return dataResponse; // Devuelve los datos recibidos
    } catch (error) {
      const errorMessages = error.errors
        .map((err) => `${err.field}: ${err.message}`)
        .join("\n");
      modalControllers.modalMsg(errorMessages);
    }
  }

  async mailContact(datos) {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(`${this.baseURL}/api/suscribeMail`, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
