export function renderSalesData(data, container) {
  if (!container) return;

  container.innerHTML = ""; // Limpia el contenido previo
  const table = document.createElement("table");
  table.className = "table table-striped";
  const tbody = document.createElement("tbody");

  if (!data || data.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No se encontraron ventas para el periodo seleccionado.";
    row.appendChild(cell);
    tbody.appendChild(row);
  } else {
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>Fecha</th>
        <th>Categoría</th>
        <th>Cantidad</th>
        <th>Precio Total</th>
      `;
    tbody.appendChild(headerRow);

    data.forEach((sale) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${new Date(sale.date).toLocaleDateString()}</td>
          <td>${sale.category}</td>
          <td>${sale.quantity}</td>
          <td>$${sale.totalPrice.toFixed(2)}</td>
        `;
      tbody.appendChild(row);
    });
  }

  table.appendChild(tbody);
  container.appendChild(table);
}
