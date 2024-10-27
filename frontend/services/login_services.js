import { modalControllers } from "../modal/modal.js";
import { baseURL } from "../../backend/baseUrl.js";

export class LoginServices {
  constructor() {
    this.baseURL = baseURL;
  }

  // Método para restablecer la contraseña
  async resetPassword(data) {
    try {
      const response = await fetch(`${this.baseURL}/api/send-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataResponse = await response.json(); // Parsear la respuesta JSON siempre, incluso si hay error

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Si todo sale bien, muestra el mensaje de éxito
      modalControllers.modalMsg(dataResponse.message); // Mensaje de éxito
    } catch (error) {
      // Capturar errores de red o errores del backend y mostrarlos en el modal
      modalControllers.modalMsg(error.message);
      console.error(error);
    }
  }

  //abrir session
  async signin(dataUser) {
    try {
      const response = await fetch(`${this.baseURL}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify(dataUser),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Manejo de la respuesta
      const userName = dataResponse.user.nombre;
      // Uso de sessionStorage para guardar usuario (puedes guardar más información si es necesario)
      sessionStorage.setItem("user", JSON.stringify(userName));

      // Mostrar el mensaje del servidor
      modalControllers.modalMsgReload(dataResponse.message);
    } catch (error) {
      // Captura cualquier error que ocurra
      modalControllers.modalMsgReload(error.message); // Muestra el mensaje de error
      console.error(error);
    }
  }

  //crear usuario
  async signup(dataSignup) {
    try {
      const response = await fetch(`${this.baseURL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSignup),
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

  //cerrar session
  async logout() {
    try {
      const response = await fetch(`${this.baseURL}/api/logout`, {
        method: "DELETE",
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      sessionStorage.removeItem("user");
      // sessionStorage.removeItem("token");
      // Muestra de éxito en pantalla
      modalControllers.modalMsgReload(dataResponse.message);
    } catch (error) {
      modalControllers.modalMsgReload(error.message);
      console.error(error);
    }
  }
}
