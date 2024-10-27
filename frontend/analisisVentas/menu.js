export function initMenu(titulo, menuOptions, applyFiltersCallback) {
  if (document.querySelector(".btn-group.mb-3")) return null;

  const menuContainer = document.createElement("div");
  menuContainer.className = "btn-group mb-3";

  menuOptions.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btn btn-primary me-2";
    button.textContent = option.name;
    button.addEventListener("click", (e) => {
      e.preventDefault();
      applyFiltersCallback(null, option.category); // Aplicamos filtro solo de categoría
    });
    menuContainer.appendChild(button);
  });

  const periodSelect = document.createElement("select");
  periodSelect.className = "form-select me-2";
  periodSelect.innerHTML = `
        <option value="daily">Diario</option>
        <option value="weekly">Semanal</option>
        <option value="monthly" selected>Mensual</option>
        <option value="annual">Anual</option>
        <option value="range">Rango de Fechas</option> <!-- Opción para rango de fechas -->
      `;

  // Manejo del cambio de periodo
  periodSelect.addEventListener("change", (e) => {
    const isRangeSelected = e.target.value === "range";
    startDateInput.disabled = !isRangeSelected; // Habilitar/deshabilitar input de fecha de inicio
    endDateInput.disabled = !isRangeSelected; // Habilitar/deshabilitar input de fecha de fin
    applyFiltersCallback(e.target.value, null); // Aplicamos filtro de periodo
  });

  menuContainer.appendChild(periodSelect);

  const dateRangeContainer = document.createElement("div");
  dateRangeContainer.className = "d-flex align-items-center";

  const startDateInput = document.createElement("input");
  startDateInput.type = "date";
  startDateInput.className = "form-control me-2";
  startDateInput.disabled = true; // Deshabilitar por defecto
  startDateInput.addEventListener("change", () => {
    if (startDateInput.value && endDateInput.value) {
      applyFiltersCallback(
        "range",
        null,
        startDateInput.value,
        endDateInput.value
      ); // Aplicamos rango de fechas
    }
  });

  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateInput.className = "form-control me-2";
  endDateInput.disabled = true; // Deshabilitar por defecto
  endDateInput.addEventListener("change", () => {
    if (startDateInput.value && endDateInput.value) {
      applyFiltersCallback(
        "range",
        null,
        startDateInput.value,
        endDateInput.value
      ); // Aplicamos rango de fechas
    }
  });

  dateRangeContainer.appendChild(startDateInput);
  dateRangeContainer.appendChild(endDateInput);
  menuContainer.appendChild(dateRangeContainer);

  titulo.parentNode.insertBefore(menuContainer, titulo);

  const salesDataContainer = document.createElement("div");
  salesDataContainer.id = "sales-data-container";
  titulo.parentNode.insertBefore(salesDataContainer, titulo.nextSibling);

  return { salesDataContainer };
}
