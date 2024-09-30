class ProductService {
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

  async listaProductosUsuario() {
    return await this.fetchJSON(`${this.baseURL}/api/listaProductosUsuario`);
  }

  async listaProductos() {
    return await this.fetchJSON(`${this.baseURL}/api/listaProductos`);
  }

  async crearProducto(product) {
    console.log(product);
    try {
      const response = await fetch(`${this.baseURL}/api/createProduct`, {
        method: "POST",
        body: product,
      });

      if (!response.ok) {
        throw new Error("No fue posible crear un producto");
      }

      // Obtén el contenido de la respuesta como JSON
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
    }
  }

  async desactivarProducto(id) {
    try {
      await fetch(`${this.baseURL}/api/desactivateProduct/${id}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async activarProducto(id) {
    try {
      await fetch(`${this.baseURL}/api/activateProduct/${id}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async detalleProducto(id) {
    return await this.fetchJSON(`${this.baseURL}/api/detailsProduct/${id}`);
  }

  async destacadosProducto() {
    try {
      const response = await fetch(`${this.baseURL}/api/renderDestacados`);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error al obtener productos destacados:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  async actualizarProducto(product, id) {
    console.log(product);
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

  async productoSimilar(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/productoSimilar/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      return data.productosSimilares;
    } catch (error) {
      console.error("Error al obtener productos similares:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }
}

// Configuración del modo
export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://moda-modesta.vercel.app"
    : "http://localhost:3000";

// Instancia de la clase ProductService
const productoServices = new ProductService(baseURL);

export default productoServices;
