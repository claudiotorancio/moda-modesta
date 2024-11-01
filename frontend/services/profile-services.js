import { baseURL } from "../../backend/baseUrl.js";

export class ProfileServices {
  constructor() {
    this.baseURL = baseURL;
  }

  // Extraer usuario
  getUser = async () => {
    try {
      const token = sessionStorage.getItem("authToken"); // Obtener el token desde sessionStorage
      const respuesta = await fetch(`${this.baseURL}/api/infoPersonal`, {
        method: "GET", // Método de la solicitud
        headers: {
          "Content-Type": "application/json", // Tipo de contenido
          Authorization: `Bearer ${token}`, // Añadir el token aquí
        },
      });

      if (!respuesta.ok) {
        throw new Error(`Error en la respuesta: ${respuesta.statusText}`);
      }

      const data = await respuesta.json();
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  };

  // Extraer listado de órdenes
  listaOrders = async () => {
    try {
      const token = sessionStorage.getItem("authToken"); // Obtener el token desde sessionStorage
      const respuesta = await fetch(`${this.baseURL}/api/pedidosRecientes`, {
        method: "GET", // Método de la solicitud
        headers: {
          "Content-Type": "application/json", // Tipo de contenido
          Authorization: `Bearer ${token}`, // Añadir el token aquí
        },
      });

      if (!respuesta.ok) {
        throw new Error(`Error en la respuesta: ${respuesta.statusText}`);
      }

      const data = await respuesta.json();
      return data;
    } catch (error) {
      console.error("Error al obtener la lista de órdenes:", error);
      throw error;
    }
  };
}
