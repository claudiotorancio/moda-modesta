import { baseURL } from "../../backend/baseUrl.js";
import { modalControllers } from "../modal/modal.js";

export class CompraServices {
  constructor() {
    this.baseURL = baseURL;
  }

  //aceptar pedido

  async aceptarPedido(id) {
    try {
      const token = sessionStorage.getItem("authToken"); // O donde tengas almacenado el token
      const response = await fetch(`${this.baseURL}/api/aceptarPedido/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token aquí
          "Content-Type": "application/json", // Agregar Content-Type si envías datos en JSON
        },
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
  }

  purchaseOrder = async () => {
    try {
      const token = sessionStorage.getItem("authToken"); // O donde tengas almacenado el token
      const response = await fetch(`${this.baseURL}/api/purchaseOrder`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token aquí
          "Content-Type": "application/json", // Agregar Content-Type si envías datos en JSON
        },
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(dataResponse.error || "Error en la solicitud.");
      }

      // Muestra de éxito en pantalla
      return dataResponse;
    } catch (error) {
      console.error(error);
    }
  };

  //eliminar compra

  eliminarCompra = async (id) => {
    try {
      const token = sessionStorage.getItem("authToken"); // O donde tengas almacenado el token
      const response = await fetch(`${this.baseURL}/api/deleteOrder/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token aquí
          "Content-Type": "application/json", // Este encabezado puede ser opcional para solicitudes DELETE
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

  //finalizar pedido

  finalizarPedido = async (id) => {
    try {
      const token = sessionStorage.getItem("authToken"); // O donde tengas almacenado el token
      const response = await fetch(
        `${this.baseURL}/api/finalizarPedido/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token aquí
            "Content-Type": "application/json", // Este encabezado puede ser opcional
          },
        }
      );
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

  //finalizar pedido

  cancelarPedidoHandler = async (id, productos) => {
    try {
      const token = sessionStorage.getItem("authToken"); // Obtener el token de sessionStorage
      const response = await fetch(
        `${this.baseURL}/api/compraCancelada/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Indica que el cuerpo es JSON
            Authorization: `Bearer ${token}`, // Agregar el token aquí
          },
          body: JSON.stringify({ productos }), // Convierte el objeto a JSON
        }
      );
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

  //correo pedido en preparacion

  async compraPrepare(email, name, producto) {
    try {
      const token = sessionStorage.getItem("authToken"); // Obtener el token de sessionStorage
      const response = await fetch(`${this.baseURL}/api/compraPrepare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token aquí
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
    try {
      const token = sessionStorage.getItem("authToken"); // Obtener el token de sessionStorage
      const response = await fetch(`${this.baseURL}/api/compraEnCamino/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Asegúrate de incluir el tipo de contenido
          Authorization: `Bearer ${token}`, // Agregar el token aquí
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Aquí manejas el mensaje de error que envía el backend
        throw new Error(data.error || "Error en la solicitud.");
      }

      return data;
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      throw error;
    }
  }

  async correoEnCamino(email, name, producto) {
    try {
      const token = sessionStorage.getItem("authToken"); // Obtener el token de sessionStorage
      const response = await fetch(`${this.baseURL}/api/correoEnCamino`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indica que el cuerpo es JSON
          Authorization: `Bearer ${token}`, // Agregar el token aquí
        },
        body: JSON.stringify({ email, name, producto }), // Convierte el objeto a JSON
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
