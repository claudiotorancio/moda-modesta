// main.js
import { SalesAnalytics } from "./SalesAnalytics.js";
import { initMenu } from "./menu.js";
import { renderSalesData } from "./salesRenderer.js";
import { setFilters } from "./filters.js";
import { showLoading, hideLoading } from "./loading.js";

const salesAnalytics = new SalesAnalytics(document.getElementById("titulo"));

// Configura y lanza la app
salesAnalytics.initMenu = () =>
  initMenu(
    salesAnalytics.titulo.parentNode,
    salesAnalytics.menuOptions,
    (period, category) => setFilters(salesAnalytics.filters, period, category),
    () => salesAnalytics.applyFilters()
  );

salesAnalytics.renderSalesData = (data) =>
  renderSalesData(data, salesAnalytics.salesDataContainer);
salesAnalytics.showLoading = () =>
  showLoading(salesAnalytics.titulo.parentNode);
salesAnalytics.hideLoading = () =>
  hideLoading(salesAnalytics.titulo.parentNode);
