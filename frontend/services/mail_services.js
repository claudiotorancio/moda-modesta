import { modalControllers } from "../modal/modal.js";
import { baseURL } from "./product_services.js";
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

      if (data.success) {
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
      console.error("Error al enviar los datos de la suscripción:", err);
      alert("Hubo un error al suscribirse. Por favor, intente nuevamente.");
    }
  }
}

const mailServices = new MailServices();

export default mailServices;
