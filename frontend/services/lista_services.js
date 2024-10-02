import { baseURL } from "./product_services.js";

export class ListaServices {
  constructor() {
    this.baseURL = baseURL;
  }

  //validar admin en session

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

  //validar user en session

  getDataUser = async () => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/getDataUser`);
      const data = await respuesta.json();

      if (data.ok) {
        // Almacenar el token en localStorage
        sessionStorage.setItem("token", data.token);

        // Aquí podrías redirigir al usuario o actualizar el estado de la aplicación
      } else {
        console.error("Error de inicio de sesión:", data.message);
      }

      // Devolver un objeto con la propiedad 'ok' y el 'role'
      return {
        ok: data.ok,
        role: data.role || "user", // Si no tiene role, asumir que es 'user'
      };
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  };

  enviarPromocion = async (myContent) => {
    try {
      await fetch(`${this.baseURL}/api/enviarPromocion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ myContent }),
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  };

  //extraer userId de Users

  getUser = async (userId) => {
    console.log(`getUser id:`, userId);
    try {
      const respuesta = await fetch(`${this.baseURL}/api/getUser/${userId}`);
      const data = await respuesta.json();

      console.log(`getUser user:`, data);
      return data; // Simplificado para devolver solo el usuario
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  };

  //extraer listado de Users

  listaUsers = async () => {
    try {
      const respuesta = await fetch(`${this.baseURL}/api/renderLista`);
      const data = await respuesta.json();
      const listado = data;
      return listado;
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
