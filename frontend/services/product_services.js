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

  async renderInicio() {
    return await this.fetchJSON(`${this.baseURL}/api/renderInicio`);
  }

  async listaProductos() {
    return await this.fetchJSON(`${this.baseURL}/api/renderProducts`);
  }

  async crearProducto(product) {
    try {
      const response = await fetch(`${this.baseURL}/api/createProduct`, {
        method: "POST",
        body: product,
      });
      if (!response.ok) {
        throw new Error("No fue posible crear un producto");
      }
      return response.body;
    } catch (error) {
      console.error(error);
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
}

// Configuración del modo
export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://moda-modesta.vercel.app"
    : "http://localhost:3000";

// Instancia de la clase ProductService
const productoServices = new ProductService(baseURL);

export default productoServices;
