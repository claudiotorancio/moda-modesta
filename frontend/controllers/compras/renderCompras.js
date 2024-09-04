import { CompraServices } from "../../services/compra_services.js";

export class RenderCompras {
  constructor(container, titulo) {
    this.container = container;
    this.titulo = titulo;
    this.compraServicesHelpers = new CompraServices();
  }

  async renderCompraLista() {
    try {
      // Limpiar el contenedor antes de renderizar
      this.titulo.innerHTML = "";
      this.container.innerHTML = "";

      const tituloContenido = `
        <div class="row">
          <div class="col-md-12">
            <h2 class="card-header text-center">COMPRAS</h2>
          </div>
        </div>
      `;
      this.titulo.innerHTML = tituloContenido;

      const listado = await this.compraServicesHelpers.listaOrder();

      const row = document.createElement("div");
      row.className = "row"; // Contenedor para las columnas

      for (const order of listado) {
        const orderData = {
          name: order.customer.name,
          created_at: order.createdAt,
          email: order.customer.email,
          phoneNumber: order.customer.phoneNumber,
          items: order.items,
        };

        // Crear la tarjeta y añadirla a la fila
        const cardCol = document.createElement("div");
        cardCol.className = "col-md-4 mb-4"; // 3 columnas en pantallas medianas y más grandes
        cardCol.appendChild(this.crearTarjeta(orderData));

        row.appendChild(cardCol);
      }

      // Añadir la fila al contenedor principal
      this.container.appendChild(row);
    } catch (error) {
      console.log(error);
    }
  }

  crearTarjeta({ name, email, phoneNumber, items, created_at }) {
    const fechaCreacion = new Date(created_at);
    const fechaFormateada = `${fechaCreacion
      .getFullYear()
      .toString()
      .slice(-2)}-${("0" + (fechaCreacion.getMonth() + 1)).slice(-2)}-${(
      "0" + fechaCreacion.getDate()
    ).slice(-2)}`;

    const productos = items
      .map(
        (item) =>
          `<div>
       ${item.name} | Cantidad: ${item.quantity} | Talle: ${item.size} | <a href="${item.hash}" target="_blank">
       Ver producto
        </a>
      </div>`
      )
      .join("<br>");

    const card = document.createElement("div");
    card.className = "card"; // Clase Bootstrap para la tarjeta, con altura completa

    card.innerHTML = `
      <div class="card-body w-100">
        <h5 class="card-title">Cliente: ${name}</h5>
        <p class="card-text"><strong>Email:</strong> ${email}</p>
        <p class="card-text"><strong>Teléfono:</strong> ${phoneNumber}</p>
        <p class="card-text"><strong>Fecha de creación:</strong> ${fechaFormateada}</p>
        <p class="card-text"><strong>Productos:</strong><br> ${productos}</p>
      </div>
      <div class="card-footer text-center">
       <p class="card-text"> Alertas para Cliente</p>
        <button type="button" class="btn btn-primary" data-userid="">en preparacion</button>
        <button type="button" class="btn btn-secondary" id="button" data-userUp="">en camino</button>
      </div>
    `;

    return card;
  }
}
