//SalesAnalytics.js

import salesServices from "../services/sales_services.js";
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

      renderSalesData(
        salesData,
        this.titulo,
        applyFiltersCallback,
        this.filters.period
      );
    } catch (error) {
      console.error("Error al obtener los datos de ventas:", error);
    } finally {
      hideLoading(this.titulo);
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
      this.fetchSalesByPeriod(
        this.filters.period,
        this.filters.category,
        this.filters.startDate,
        this.filters.endDate
      );
    } else {
      // Limpiar los datos si no hay filtros
      renderSalesData([], this.titulo);
    }
  }
}
