import { baseURL } from "./product_services.js";

export class CompraServices {
  constructor() {
    this.baseURL = baseURL;
  }

  //aceptar pedido

  async aceptarPedido(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/aceptarPedido/${id}`, {
        method: "PUT",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      throw error;
    }
  }

  listaOrder = async () => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/listaOrder`);
      const data = await respuesta.json();
      const listado = data.order;
      return listado;
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      throw error;
    }
  };
  //eliminar compra

  // eliminarCompra = async (id) => {
  //   try {
  //     await fetch(`${this.baseURL}/api/deleteCompra/${id}`, {
  //       method: "DELETE",
  //     });
  //   } catch (error) {
  //     console.error("Error al eliminar usuario:", error);
  //     throw error;
  //   }
  // };

  //finalizar pedido

  finalizarPedido = async (id) => {
    try {
      const response = await fetch(
        `${this.baseURL}/api/finalizarPedido/${id}`,
        {
          method: "PUT",
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      throw error;
    }
  };

  //correo pedido en preparacion

  async compraPrepare(email, name, producto) {
    try {
      const response = await fetch(`${this.baseURL}/api/compraPrepare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, producto }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Inspecciona el cuerpo de la respuesta
        console.error("Error en la solicitud:", errorText);
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw error;
    }
  }

  //actualiza estado compra en camino

  async compraEnCamino(id) {
    console.log(id);
    try {
      const response = await fetch(`${this.baseURL}/api/compraEnCamino/${id}`, {
        method: "PUT",
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      throw error;
    }
  }

  async correoEnCaminoe(email, name, producto) {
    try {
      const response = await fetch(`${this.baseURL}/api/correoEnCamino`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, producto }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Inspecciona el cuerpo de la respuesta
        console.error("Error en la solicitud:", errorText);
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      return data;
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw error;
    }
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
