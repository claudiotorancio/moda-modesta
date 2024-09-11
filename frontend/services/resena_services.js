class ResenaService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async renderInicio() {
    return await this.fetchJSON(`${this.baseURL}/api/renderInicio`);
  }

  async getResena() {
    try {
      const response = await fetch(`${this.baseURL}/api/getResena`);
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

  async eliminarProducto(id) {
    try {
      await fetch(`${this.baseURL}/api/deleteProduct/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async detalleProducto(id) {
    return await this.fetchJSON(`${this.baseURL}/api/detailsProduct/${id}`);
  }

  async actualizarProducto(product, id) {
    try {
      const response = await fetch(`${this.baseURL}/api/updateProduct/${id}`, {
        method: "PUT",
        body: product,
      });
      if (!response.ok) {
        throw new Error("No fue posible actualizar el producto");
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async agregarResena(nuevaResena) {
    try {
      const response = await fetch(`${this.baseURL}/api/agregarResena`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaResena),
      });

      if (!response.ok) {
        throw new Error("No fue posible crear la reseña");
      }

      const responseData = await response.json(); // Parsear la respuesta como JSON
      return responseData; // Devolver los datos recibidos
    } catch (error) {
      console.error(error);
    }
  }
}

// Configuración del modo
export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://moda-modesta.vercel.app"
    : "http://localhost:3000";

// Instancia de la clase ProductService
const resenaServices = new ResenaService(baseURL);

export default resenaServices;
