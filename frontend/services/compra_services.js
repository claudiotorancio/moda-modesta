import { baseURL } from "./product_services.js";

export class CompraServices {
  constructor() {
    this.baseURL = baseURL;
  }

  //   //extraer userId de Users

  //   getUser = async (userId) => {
  //     //console.log(`getUser id:`, userId);
  //     try {
  //       const respuesta = await fetch(`${this.baseURL}/api/getUser/${userId}`);
  //       const data = await respuesta.json();
  //       const user = data.user;
  //       //console.log(`getUser user:`, user);
  //       return user; // Simplificado para devolver solo el usuario
  //     } catch (error) {
  //       console.error("Error al obtener usuario:", error);
  //       throw error;
  //     }
  //   };

  //extraer listado de Users

  listaOrder = async () => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/listaOrder`);
      const data = await respuesta.json();
      const listado = data.order;
      console.log(listado);
      return listado;
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      throw error;
    }
  };
  //eliminar usuario

  //   eliminarUser = async (id) => {
  //     try {
  //       await fetch(`${this.baseURL}/api/deleteUser/${id}`, {
  //         method: "DELETE",
  //       });
  //     } catch (error) {
  //       console.error("Error al eliminar usuario:", error);
  //       throw error;
  //     }
  //   };
  //   //actualizar usuario

  //   updateUser = async (dataUser, id) => {
  //     try {
  //       await fetch(`${this.baseURL}/api/updateUser/${id}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(dataUser),
  //       });
  //     } catch (error) {
  //       console.error("Error al actualizar usuario:", error);
  //       throw error;
  //     }
  //   };
  //   //extraer cantidad de productos de Products

  //   totalProductos = async (id) => {
  //     try {
  //       const respuesta = await fetch(
  //         `${this.baseURL}/api/contadorProductos/${id}`
  //       );
  //       return respuesta.json();
  //     } catch (error) {
  //       console.error("Error al obtener el total de productos:", error);
  //       throw error;
  //     }
  //   };
}
