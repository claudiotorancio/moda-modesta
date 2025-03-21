import { baseURL } from "../../backend/baseUrl.js";
import { modalControllers } from "../modal/modal.js";

export class ListaServices {
  constructor() {
    this.baseURL = baseURL;
  }

  // Validar admin en session
  getAdmin = async (token) => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/getAdmin`, {
        headers: {
          Authorization: `Bearer ${token}`, // Añadir el token en la cabecera
        },
      });

      const data = await respuesta.json();

      if (data.ok) {
        return data; // Devuelve el objeto del administrador (incluyendo el rol)
      } else {
        return { role: null }; // Usuario no es administrador
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  };

  // Validar user en session
  getDataUser = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      const respuesta = await fetch(`${this.baseURL}/api/getDataUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await respuesta.json();

      if (!data.ok) {
        console.error("Error de inicio de sesión:", data.message);
        return { ok: false, message: data.message };
      }

      const user = data.user;

      return {
        ok: data.ok,
        role: data.role,
        user,
      };
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  };

  enviarPromocion = async (myContent) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(`${this.baseURL}/api/enviarPromocion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token aquí
        },
        body: JSON.stringify({ myContent }),
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
  };

  // Extraer userId de Users
  getUser = async (userId) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const respuesta = await fetch(`${this.baseURL}/api/getUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token aquí
        },
      });
      const data = await respuesta.json();

      return data; // Simplificado para devolver solo el usuario
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  };

  // Extraer listado de Users
  listaUsers = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const respuesta = await fetch(`${this.baseURL}/api/renderLista`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token aquí
        },
      });
      const data = await respuesta.json();
      return data; // Retornar listado de usuarios
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      throw error;
    }
  };

  // Eliminar usuario
  eliminarUser = async (id) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(`${this.baseURL}/api/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token aquí
        },
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
  };

  // Actualizar usuario
  updateUser = async (dataUser, id) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(`${this.baseURL}/api/updateUser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token aquí
        },
        body: JSON.stringify(dataUser),
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
  };
}
