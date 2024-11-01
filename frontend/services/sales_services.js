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

      // Obtener el token desde el sessionStorage
      const token = sessionStorage.getItem("authToken");

      // Hacer la solicitud fetch con el token en los encabezados
      const response = await fetch(url, {
        method: "GET", // Asumimos que es un GET, cambia según sea necesario
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadir el token aquí
        },
      });

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
  // Obtener productos más vendidos (con opción de filtro por categoría)
  async fetchTopSellingProducts(category = null) {
    const url = category
      ? `${this.baseURL}/api/top-selling-products?category=${category}`
      : `${this.baseURL}/api/top-selling-products`;
    try {
      // Obtener el token desde el sessionStorage
      const token = sessionStorage.getItem("authToken");

      // Hacer la solicitud fetch con el token en los encabezados
      const response = await fetch(url, {
        method: "GET", // Asumimos que es un GET, cambia según sea necesario
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadir el token aquí
        },
      });

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
  // Consultar estado de órdenes pendientes
  async fetchPendingOrders() {
    try {
      // Obtener el token desde el sessionStorage
      const token = sessionStorage.getItem("authToken");

      // Hacer la solicitud fetch con el token en los encabezados
      const response = await fetch(`${this.baseURL}/api/orders-pending`, {
        method: "GET", // Asumimos que es un GET, cambia según sea necesario
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadir el token aquí
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
      console.error("Error al obtener órdenes pendientes:", error);
      throw error; // Propagar el error para manejarlo más arriba
    }
  }

  // Obtener análisis de clientes (frecuencia, valor promedio de compra, etc.)
  // Obtener análisis de clientes (frecuencia, valor promedio de compra, etc.)
  async fetchCustomerAnalytics() {
    try {
      // Obtener el token desde el sessionStorage
      const token = sessionStorage.getItem("authToken");

      // Hacer la solicitud fetch con el token en los encabezados
      const response = await fetch(`${this.baseURL}/api/customer-analytics`, {
        method: "GET", // Asumimos que es un GET, cambia según sea necesario
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadir el token aquí
        },
      });

      if (!response.ok) {
        // Si la respuesta no es 200, puedes devolver un array vacío o un objeto predeterminado
        if (response.status === 404) {
          console.warn("No se encontraron datos de análisis de clientes.");
          return []; // Devuelve un array vacío
        }
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error al obtener análisis de clientes:", error);
      return []; // Asegúrate de devolver un array vacío en caso de error
    }
  }
}

const salesServices = new SalesServices(baseURL);

export default salesServices;
