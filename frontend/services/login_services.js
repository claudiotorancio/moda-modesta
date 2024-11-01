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

  // Abrir sesión
  async signin(dataUser) {
    try {
      const response = await fetch(`${this.baseURL}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Habilita las credenciales solo si es necesario para cookies
        // credentials: "include",
        body: JSON.stringify(dataUser),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // En desarrollo, almacena el token en sessionStorage o localStorage
      if (process.env.NODE_ENV === "development") {
        const token = dataResponse.token;

        if (token) {
          sessionStorage.setItem("authToken", token);
        } else {
          throw new Error("Token no recibido en la respuesta.");
        }
      }

      // Almacenar información del usuario
      const userName = dataResponse.user.nombre;
      sessionStorage.setItem("user", JSON.stringify(userName));

      modalControllers.modalMsgReload(dataResponse.message);
    } catch (error) {
      modalControllers.modalMsgReload(error.message);
      console.error(error);
    }
  }

  async fetchProtectedData() {
    const token = sessionStorage.getItem("authToken");
    try {
      const response = await fetch(`${this.baseURL}/api/protected-route`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Manejo de errores si la respuesta no es exitosa
        throw new Error("No se pudo obtener datos protegidos.");
      }

      const data = await response.json();

      return data.user; // Manejar los datos protegidos aquí
    } catch (error) {
      console.error("Error al obtener datos protegidos:", error);
      // Aquí puedes manejar el error, como redirigir a la página de inicio de sesión
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
