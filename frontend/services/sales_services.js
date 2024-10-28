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
      ? `${this.baseURL}/top-selling-products?category=${category}`
      : `${this.baseURL}/top-selling-products`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error al obtener productos más vendidos:", error);
      throw error;
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
      const response = await fetch(`${this.baseURL}/customer-analytics`);
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
