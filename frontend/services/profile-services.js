import { baseURL } from "./product_services.js";

export class ProfileServices {
  constructor() {
    this.baseURL = baseURL;
  }
  //extraer sers

  getUser = async () => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/infoPersonal`);
      const data = await respuesta.json();

      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  };

  //extraer listado de Ordenes

  listaOrders = async () => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/pedidosRecientes`);
      const data = await respuesta.json();

      return data;
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      throw error;
    }
  };
}
