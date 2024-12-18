import { baseURL } from "../../backend/baseUrl.js";
import { modalControllers } from "../modal/modal.js";

class ResenaService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchJSON(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async getResena() {
    try {
      const response = await fetch(`${this.baseURL}/api/getResena`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Agregar el token aquí
        },
      });
      if (!response.ok) {
        throw new Error("No se pudo obtener las reseñas");
      }
      const data = await response.json();
      return data.dataResenas; // Extrae el array de reseñas del objeto de respuesta
    } catch (error) {
      console.error("Error al obtener las reseñas:", error);
      return []; // Retorna un array vacío en caso de error
    }
  }

  async deleteResena(id) {
    try {
      await fetch(`${this.baseURL}/api/deleteResena`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Agregar el token aquí
        },
        body: JSON.stringify({ id }), // Asegúrate de enviar el id como un objeto JSON
      });
    } catch (error) {
      console.error(error);
    }
  }

  async putResena(resena) {
    try {
      const response = await fetch(`${this.baseURL}/api/putResena`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Agregar el token aquí
        },
        body: JSON.stringify(resena),
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

  async agregarResena(nuevaResena) {
    try {
      const response = await fetch(`${this.baseURL}/api/agregarResena`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Agregar el token aquí
        },
        body: JSON.stringify(nuevaResena),
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
}

// Instancia de la clase ResenaService
const resenaServices = new ResenaService(baseURL);

export default resenaServices;
