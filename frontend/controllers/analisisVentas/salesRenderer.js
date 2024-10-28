// salesRenderer.js

import { renderTopSellingProducts } from "./renderTopSellingProducts.js";

function createPeriodMenu(container, applyFiltersCallback, menuOptions) {
  const menuContainer = document.createElement("div");
  menuContainer.className = "row mb-3 align-items-center"; // Usa un row para el diseño en columnas

  // Título de Categoría
  const categoryTitle = document.createElement("h3");
  categoryTitle.className = "text-center mb-2";
  categoryTitle.textContent = "Panel de Análisis de Ventas";
  menuContainer.appendChild(categoryTitle);

  // Contenedor de botones de categorías
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "col-12 col-md-auto mb-2 mb-md-0 d-flex"; // Se ajusta en PC y móviles

  menuOptions.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btn btn-primary me-2"; // Espaciado entre botones
    button.textContent = option.name;
    button.addEventListener("click", (e) => {
      e.preventDefault();
      applyFiltersCallback(null, option.category);
      resetDateInputs();
    });
    buttonsContainer.appendChild(button);
  });
  menuContainer.appendChild(buttonsContainer);

  // Contenedor select para periodo
  const periodSelectContainer = document.createElement("div");
  periodSelectContainer.className = "col-12 col-md-auto"; // Ajuste para dispositivos
  const periodSelect = document.createElement("select");
  periodSelect.className = "form-select";
  periodSelect.innerHTML = `
       <option value="daily">Diario</option>
       <option value="weekly">Semanal</option>
       <option value="monthly">Mensual</option>
       <option value="annual">Anual</option>
       <option value="range">Rango de Fechas</option>
      `;

  periodSelectContainer.appendChild(periodSelect);
  menuContainer.appendChild(periodSelectContainer);

  // Contenedor para rango de fechas
  const dateRangeContainer = document.createElement("div");
  dateRangeContainer.className =
    "col-12 col-md-auto d-flex align-items-center mt-2 mt-md-0"; // Responsivo en desktop y móviles
  dateRangeContainer.style.display = "none"; // Ocultar por defecto

  const startDateInput = document.createElement("input");
  startDateInput.type = "date";
  startDateInput.className = "form-control me-2";
  startDateInput.disabled = true;

  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateInput.className = "form-control";
  endDateInput.disabled = true;

  dateRangeContainer.appendChild(startDateInput);
  dateRangeContainer.appendChild(endDateInput);
  menuContainer.appendChild(dateRangeContainer);

  // Manejo del cambio de periodo
  periodSelect.addEventListener("change", (e) => {
    const selectedPeriod = e.target.value;
    const isRangeSelected = selectedPeriod === "range";

    startDateInput.disabled = !isRangeSelected;
    endDateInput.disabled = !isRangeSelected;
    dateRangeContainer.style.display = isRangeSelected ? "flex" : "none";

    applyFiltersCallback(selectedPeriod, null);
    periodSelect.value = selectedPeriod;
  });

  // Manejo del cambio de fechas
  startDateInput.addEventListener("change", () => {
    if (startDateInput.value && endDateInput.value) {
      applyFiltersCallback(
        "range",
        null,
        startDateInput.value,
        endDateInput.value
      );
    }
  });

  endDateInput.addEventListener("change", () => {
    if (startDateInput.value && endDateInput.value) {
      applyFiltersCallback(
        "range",
        null,
        startDateInput.value,
        endDateInput.value
      );
    }
  });

  // Resetear fechas
  const resetDateInputs = () => {
    startDateInput.value = "";
    endDateInput.value = "";
  };

  container.appendChild(menuContainer);
}

export function renderSalesData(
  data,
  container,
  applyFiltersCallback,
  selectedPeriod = "",
  topSellingProducts = [] // Añadido para recibir los productos más vendidos
) {
  container.innerHTML = "";

  if (!document.querySelector(".btn-group.mb-3")) {
    createPeriodMenu(container, applyFiltersCallback, [
      { name: "Vestidos", category: "opcion1" },
      { name: "Polleras", category: "opcion2" },
      { name: "Diversos", category: "opcion3" },
    ]);
  }

  const periodSelect = document.querySelector("select.form-select");
  if (periodSelect) {
    periodSelect.value = selectedPeriod;
  }

  if (!data || data.length === 0) {
    const noDataMessage = document.createElement("div");
    noDataMessage.className = "alert alert-warning text-center";
    noDataMessage.textContent = "No hay datos para la consulta";
    container.appendChild(noDataMessage);
    return;
  }

  const totalSalesValue = data.reduce((sum, sale) => sum + sale.totalPrice, 0);

  const table = document.createElement("table");
  table.className = "table table-striped table-responsive-sm";
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
      <th>Fecha</th>
      <th>Categoría</th>
      <th>Cantidad</th>
      <th>Precio Total</th>
    `;
  tbody.appendChild(headerRow);

  const categoryNames = {
    opcion1: "Vestidos",
    opcion2: "Polleras",
    opcion3: "Diversos",
  };

  data.forEach((sale) => {
    const row = document.createElement("tr");
    const categoryName = categoryNames[sale.category] || sale.category;

    row.innerHTML = `
        <td>${new Date(sale.date).toLocaleDateString()}</td>
        <td>${categoryName}</td>
        <td>${sale.quantity}</td>
        <td>$${sale.totalPrice.toFixed(2)}</td>
      `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  const totalSalesContainer = document.createElement("div");
  totalSalesContainer.className = "mt-3 text-center";
  totalSalesContainer.innerHTML = `<strong>Total de Ventas: $${totalSalesValue.toFixed(
    2
  )}</strong>`;
  container.appendChild(totalSalesContainer);

  // Renderizar productos más vendidos después del listado de ventas

  const topSellingContainer = document.querySelector(".top-selling-container");

  if (!topSellingContainer) {
    const newTopSellingContainer = document.createElement("div");
    newTopSellingContainer.className = "top-selling-container";
    container.appendChild(newTopSellingContainer);
    renderTopSellingProducts(topSellingProducts, ".top-selling-container");
  } else {
    // Si ya existe, simplemente renderizar
    renderTopSellingProducts(topSellingProducts, ".top-selling-container");
  }
}
