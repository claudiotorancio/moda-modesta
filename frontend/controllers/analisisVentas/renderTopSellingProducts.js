import Chart from "chart.js/auto";

export function renderTopSellingProducts(products, titulo) {
  // Seleccionar el contenedor y renderizar la tabla y el espacio para el gráfico
  const container = document.querySelector(titulo);
  container.innerHTML = `
    <h3 class="text-center mt-4">Productos Populares</h3>
    <div class="table-responsive">
      <table id="topProductsTable" class="table table-bordered table-hover table-sm mt-3">
        <thead class="table-dark">
          <tr>
            <th class="text-center">Nombre</th>
            <th class="text-center">Cantidad Vendida</th>
            <th class="text-center">Ingresos Generados</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product) => `
            <tr>
              <td class="text-start">${product.productInfo.name}</td>
              <td class="text-center">${product.totalSales}</td>
              <td class="text-end">$${product.revenueGenerated.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="text-center mt-3">
      <button id="viewMoreButton" class="btn btn-primary">Ver Más</button>
    </div>
    <h4 class="text-center mt-5">Ingresos por Categoría</h4>
 <canvas id="categoryRevenueChart" style="width: 300px; height: 200px;"></canvas>

  `;

  // Procesar datos para el gráfico
  const categoryData = {};
  products.forEach((product) => {
    const category = product.productInfo.section;
    const revenue = product.revenueGenerated;

    if (categoryData[category]) {
      categoryData[category] += revenue;
    } else {
      categoryData[category] = revenue;
    }
  });

  const categories = Object.keys(categoryData);
  const revenues = Object.values(categoryData);

  // Crear el gráfico usando Chart.js
  const ctx = document.getElementById("categoryRevenueChart").getContext("2d");
  new Chart(ctx, {
    type: "bar", // Cambiar a 'bar' para gráfico de barras
    data: {
      labels: categories,
      datasets: [
        {
          label: "Ingresos por Categoría",
          data: revenues,
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(231, 74, 59, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(231, 74, 59, 1)",
          ],
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
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });

  // Lógica para "Ver Más"
  document.getElementById("viewMoreButton").addEventListener("click", () => {
    console.log("Mostrar más productos");
  });
}
