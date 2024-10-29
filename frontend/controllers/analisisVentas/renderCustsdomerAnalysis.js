import Chart from "chart.js/auto";

export function renderCustomerAnalysis(cliente, containerId) {
  const container = document.querySelector(containerId);

  container.innerHTML = `
    <h3 class="text-center mt-4">Comportamiento del Cliente</h3>
    <div class="table-responsive">
      <table id="customerTable" class="table table-bordered table-hover table-sm mt-3">
        <thead class="table-dark">
          <tr>
            <th class="text-center">Cliente</th>
            <th class="text-center">Total Compras</th>
            <th class="text-center">Frecuencia</th>
            <th class="text-center">Valor Promedio</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <h4 class="text-center mt-5">Estadísticas Adicionales</h4>
    <div id="stats" class="mt-3">
      <p><strong>Porcentaje de Clientes Recurrentes:</strong> <span id="recurrentPercentage"></span>%</p>
      <p><strong>Promedio de Venta por Cliente:</strong> $<span id="averagePerCustomer"></span></p>
      <p><strong>Total de Ventas:</strong> $<span id="totalSales"></span></p>
    </div>
    <h5 class="text-center mt-5">Total de Ventas por Cliente</h5>
    <canvas id="customerSalesChart" style="width: 300px; height: 200px;"></canvas>
  `;

  const tbody = document.querySelector("#customerTable tbody");
  tbody.innerHTML = cliente.cliente_data
    .map(
      (cliente) => `
        <tr>
          <td class="text-start">${cliente.nombre}</td>
          <td class="text-center">$${(cliente.total_compras || 0).toFixed(
            2
          )}</td>
          <td class="text-center">${cliente.frecuencia}</td>
          <td class="text-end">$${(cliente.valor_promedio || 0).toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  // Convertir las propiedades a número antes de usar toFixed
  document.getElementById("recurrentPercentage").textContent = (
    parseFloat(cliente.porcentaje_recurrentes) || 0
  ).toFixed(2);
  document.getElementById("averagePerCustomer").textContent = (
    parseFloat(cliente.promedio_por_cliente) || 0
  ).toFixed(2);
  document.getElementById("totalSales").textContent = (
    parseFloat(cliente.total_ventas) || 0
  ).toFixed(2);

  // Preparar datos para el gráfico
  const nombresClientes = cliente.cliente_data.map((cliente) => cliente.nombre);
  const totalComprasClientes = cliente.cliente_data.map(
    (cliente) => cliente.total_compras || 0
  );

  // Crear gráfico de barras
  const ctx = document.getElementById("customerSalesChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: nombresClientes,
      datasets: [
        {
          label: "Total de Ventas por Cliente",
          data: totalComprasClientes,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
