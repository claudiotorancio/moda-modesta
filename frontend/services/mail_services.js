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

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }
      const data = await response.json();

      const message = data.message;
      if (data.success) {
        modalControllers.modalCorreoMsg(message);
        await this.carritoServices.limpiarCarrito();
      } else {
        alert(
          "Hubo un problema al finalizar la compra. Por favor, intente nuevamente."
        );
      }
    } catch (err) {
      console.error("Error al enviar los datos de la compra:", err);
      alert(
        "Hubo un error al finalizar la compra. Por favor, intente nuevamente."
      );
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
