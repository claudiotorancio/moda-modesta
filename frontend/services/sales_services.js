import { baseURL } from "../../backend/baseUrl.js";

export class SalesServices {
  constructor(baseURL) {
    this.baseURL = baseURL; // URL base de la API
  }

  // Obtener datos de ventas por período (día, semana, mes, año)
  async fetchSalesByPeriod(
    period,
    category = null,
    startDate = null,
    endDate = null
  ) {
    try {
      // Construir la URL, asegurándose de que las fechas no se envíen como cadenas vacías
      const url = new URL(`${this.baseURL}/api/sales`);
      const params = { period };

      if (category) {
        params.category = category;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      // Añadir los parámetros a la URL
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener datos de ventas:", error);
      throw error; // Propagar el error para manejarlo más arriba
    }
  }

  // Obtener productos más vendidos (con opción de filtro por categoría)
  async fetchTopSellingProducts(category = null) {
    const url = category
      ? `${this.baseURL}/api/top-selling-products?category=${category}`
      : `${this.baseURL}/api/top-selling-products`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener productos más vendidos:", error);
      throw error;
    }
  }

  //consultar estado de ordenes
  async fetchPendingOrders() {
    try {
      const response = await fetch(`${this.baseURL}/api/orders-pending`); // Ajusta la ruta a tu API
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
  }

  // Obtener ingresos por categoría
  async fetchRevenueByCategory() {
    try {
      const response = await fetch(`${this.baseURL}/revenue-by-category`);
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error al obtener ingresos por categoría:", error);
      throw error;
    }
  }

  // Obtener análisis de clientes (frecuencia, valor promedio de compra, etc.)
  async fetchCustomerAnalytics() {
    try {
      const response = await fetch(`${this.baseURL}/api/customer-analytics`);
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error al obtener análisis de clientes:", error);
      throw error;
    }
  }
}

const salesServices = new SalesServices(baseURL);

export default salesServices;
