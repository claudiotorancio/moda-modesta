import { modalControllers } from "../modal/modal.js";
import { baseURL } from "./product_services.js";

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

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }

      const dataResponse = await response.json();
      modalControllers.modalCorreoMsg(dataResponse.message); // Asumiendo que la respuesta incluye un mensaje
    } catch (error) {
      modalControllers.modalCorreoMsg(error.message); // Método que puedes crear para mostrar un error
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
        credentials: "include",
        body: JSON.stringify(dataUser),
      });
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }
      // Manejo de la respuesta
      const data = await response.json();
      const user = data.user.nombre;

      // Uso de sessionStorage para guardar usuario
      sessionStorage.setItem("user", JSON.stringify(user));
      modalControllers.modalSuccessSignIn(user);
    } catch (error) {
      modalControllers.modalErrorSignIn();
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
      // Manejo de la respuesta
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }
      const data = await response.json();

      // Muestra de éxito en pantalla
      modalControllers.modalSuccessSignup();
    } catch (error) {
      modalControllers.modalErrorSignup();
      console.error(error);
    }
  }

  //cerrar session
  async logout() {
    try {
      const response = await fetch(`${this.baseURL}/api/logout`, {
        method: "DELETE",
      });

      // Manejo de la respuesta
      if (!response.ok) {
        throw new Error(
          `Error durante el cierre de sesión: ${response.status} - ${response.statusText}`
        );
      }
      // Remover usuario de sessionStorage
      const user = JSON.parse(sessionStorage.getItem("user"));
      modalControllers.modalLogout(user);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
    }
  }
}
