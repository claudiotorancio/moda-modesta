import salesServices from "../services/sales_services.js";
import { initMenu } from "./menu.js";
import { setFilters } from "./filters.js";
import { renderSalesData } from "./salesRenderer.js";
import { showLoading, hideLoading } from "./loading.js";

export class SalesAnalytics {
  constructor(titulo) {
    this.titulo = titulo;
    this.apiService = salesServices;
    this.filters = {
      period: "monthly",
      category: null,
      startDate: null,
      endDate: null,
    };
    this.menuOptions = [
      { name: "Vestidos", category: "opcion1" },
      { name: "Polleras", category: "opcion2" },
      { name: "Diversos", category: "opcion3" },
    ];

    const initResult = this.initMenu();
    if (!initResult) {
      console.error(
        "No se pudo inicializar el menú y el contenedor de datos de ventas."
      );
      return;
    }
    this.salesDataContainer = initResult.salesDataContainer;
  }

  initMenu() {
    const result = initMenu(
      this.titulo,
      this.menuOptions,
      (period, category, startDate, endDate) => {
        this.applyFilters(period, category, startDate, endDate);
      }
    );

    if (!result) {
      console.error("Error: initMenu no devolvió un contenedor.");
      return null;
    }
    return result;
  }

  async fetchSalesByPeriod() {
    try {
      showLoading(this.titulo);
      const salesData = await this.apiService.fetchSalesByPeriod(
        this.filters.period,
        this.filters.category,
        this.filters.startDate,
        this.filters.endDate
      );
      renderSalesData(salesData, this.salesDataContainer);
    } catch (error) {
      console.error("Error al obtener los datos de ventas:", error);
    } finally {
      hideLoading(this.titulo);
    }
  }

  applyFilters(period, category, startDate, endDate) {
    // Llama a setFilters pasando los nuevos parámetros
    setFilters(this.filters, period, category, startDate, endDate);
    // Si hay un rango de fechas, puedes limpiar la categoría
    if (startDate && endDate) {
      this.filters.category = null; // Opcional: Limpiar categoría si se selecciona un rango
    }
    // Ahora, realiza la consulta para obtener las ventas
    this.fetchSalesByPeriod();
  }
}
