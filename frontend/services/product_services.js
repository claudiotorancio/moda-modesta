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

  async crearProducto(product, images) {
    console.log(product, images);
    try {
      // Crear una instancia de FormData
      const formData = new FormData();

      // Agregar los campos del producto al FormData
      for (const key in product) {
        formData.append(key, product[key]);
      }

      // Agregar las imágenes al FormData
      for (const image of images) {
        formData.append("images", image);
      }

      const response = await fetch(`${this.baseURL}/api/createProduct`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("No fue posible crear un producto");
      }

      // La respuesta puede ser en formato JSON, usa .json() para obtener los datos
      return await response.json();
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

  async destacadosProducto() {
    try {
      const response = await fetch(`${this.baseURL}/api/renderDestacados`);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();

      // Asegúrate de que la propiedad productosDestacados existe y es un array
      if (!Array.isArray(data.productosDestacados)) {
        throw new Error("La propiedad productosDestacados no es un array.");
      }

      return data.productosDestacados;
    } catch (error) {
      console.error("Error al obtener productos destacados:", error);
      return []; // Devuelve un array vacío en caso de error
    }
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
