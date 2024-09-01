import { baseURL } from "./product_services.js";

export class ListaServices {
  constructor() {
    this.baseURL = baseURL;
  }

  //extraer listado de Users

  listaUsers = async () => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/renderLista`);
      return respuesta.json();
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      throw error;
    }
  };
  //eliminar usuario

  eliminarUser = async (id) => {
    try {
      await fetch(`${this.baseURL}/api/deleteUser/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  };
  //actualizar usuario

  updateUser = async (dataUser, id) => {
    try {
      await fetch(`${this.baseURL}/api/updateUser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUser),
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  };
  //extraer cantidad de productos de Products

  totalProductos = async (id) => {
    try {
      const respuesta = await fetch(
        `${this.baseURL}/api/contadorProductos/${id}`
      );
      return respuesta.json();
    } catch (error) {
      console.error("Error al obtener el total de productos:", error);
      throw error;
    }
  };
}
