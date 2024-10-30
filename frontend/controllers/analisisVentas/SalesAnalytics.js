//SalesAnalytics.js

import salesServices from "../../services/sales_services.js";
import { renderSalesData } from "./salesRenderer.js";
import { showLoading, hideLoading } from "./loading.js";

export class SalesAnalytics {
  constructor(titulo) {
    this.titulo = titulo; // Asegúrate de que esto sea un elemento DOM
    this.apiService = salesServices;
    this.filters = {
      period: "daily",
      category: null,
      startDate: null,
      endDate: null,
    };
  }

  async fetchSalesByPeriod() {
    if (!this.filters.period) {
      renderSalesData([], this.titulo); // No mostrar datos si no hay período seleccionado
      return;
    }

    try {
      showLoading(this.titulo);
      const salesData = await this.apiService.fetchSalesByPeriod(
        this.filters.period,
        this.filters.category,
        this.filters.startDate,
        this.filters.endDate
      );

      const applyFiltersCallback = (period, category, startDate, endDate) => {
        this.applyFilters(period, category, startDate, endDate);
      };

      // Llama a la función para obtener productos más vendidos
      const topSellingProducts = await this.fetchTopSellingProducts();

      const pendingOrders = await this.checkPendingOrders();

      // Aquí se asegura de que se manejen correctamente los datos de analytics
      const customerAnalytics = await this.fetchCustomerAnalytics();
      if (!customerAnalytics || customerAnalytics.length === 0) {
        console.warn("No hay análisis de clientes disponibles.");
      }

      // Renderiza los datos de ventas y los productos más vendidos
      renderSalesData(
        salesData,
        this.titulo,
        applyFiltersCallback,
        this.filters.period,
        topSellingProducts, // Pasar los productos más vendidos
        pendingOrders,
        customerAnalytics
      );
    } catch (error) {
      console.error("Error al obtener los datos de ventas:", error);
    } finally {
      hideLoading(this.titulo);
    }
  }

  async checkPendingOrders() {
    try {
      const pendingOrders = await this.apiService.fetchPendingOrders(); // Implementa este método en tu servicio

      // Filtra las órdenes que cumplen con los criterios
      const ordersToUpdate = pendingOrders.filter(
        (order) => !order.finalizado && !order.cancelado
      );
      return ordersToUpdate;
    } catch (error) {
      console.error("Error al verificar las órdenes pendientes:", error);
    }
  }

  applyFilters(period, category, startDate, endDate) {
    // Actualiza el período y la categoría en los filtros
    this.filters.period = period || this.filters.period;
    this.filters.category = category;

    // Maneja el rango de fechas si el período es "range"
    if (this.filters.period === "range") {
      this.filters.startDate = startDate || this.filters.startDate; // Asegúrate de que estas fechas estén definidas
      this.filters.endDate = endDate || this.filters.endDate; // Asegúrate de que estas fechas estén definidas
    } else {
      // Reiniciar fechas si el período no es un rango
      this.filters.startDate = null;
      this.filters.endDate = null;
    }

    // Realiza la consulta si hay un período definido
    if (this.filters.period) {
      this.fetchSalesByPeriod();
    } else {
      // Limpiar los datos si no hay filtros
      renderSalesData([], this.titulo);
    }
  }

  async fetchTopSellingProducts() {
    return await this.apiService.fetchTopSellingProducts(this.filters.category);
  }

  async fetchCustomerAnalytics() {
    return await this.apiService.fetchCustomerAnalytics();
  }
}
