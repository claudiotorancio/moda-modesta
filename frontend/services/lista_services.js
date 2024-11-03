import { baseURL } from "../../backend/baseUrl.js";
import { modalControllers } from "../modal/modal.js";
import { jwtDecode } from "jwt-decode";

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

      if (!token) {
        console.error("No se encontró el token de autenticación.");
        return { ok: false, message: "No autenticado" };
      }

      // Llamada a la API para validar o actualizar el token si es necesario
      const respuesta = await fetch(`${this.baseURL}/api/getDataUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await respuesta.json();

      if (!data.ok) {
        console.error("Error de autenticación:", data.message);
        return { ok: false, message: data.message };
      }
      const tokenUser = data.token;
      // Decodificar el token para extraer datos del usuario
      const decodedToken = jwtDecode(tokenUser);
      const userData = {
        nombre: decodedToken.nombre || "", // Asegúrate de que los campos coincidan con los del token
        email: decodedToken.email || "",
        role: data.role || decodedToken.role || "user", // Obtener el rol desde el token o la respuesta
      };

      return { ok: true, user: userData.role, userData };
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return { ok: false, message: "Error en la solicitud" };
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

  // Extraer cantidad de productos de Products
  // totalProductos = async (id) => {
  //   try {
  //     const respuesta = await fetch(
  //       `${this.baseURL}/api/contadorProductos/${id}`
  //     );
  //     console.log(respuesta);
  //     return respuesta.json();
  //   } catch (error) {
  //     console.error("Error al obtener el total de productos:", error);
  //     throw error;
  //   }
  // };
}
