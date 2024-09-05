import { CompraServices } from "../../services/compra_services.js";
import {
  finalizarPedidoHandler,
  mensajePrepareHandlerCompra,
  mensajeEnCaminoHandlerCompra,
  aceptarPedidoHandler,
} from "./eventsCompras.js";

export class RenderCompras {
  constructor(tabla, titulo) {
    if (!tabla || !titulo) {
      throw new Error("Elementos de tabla o título no definidos.");
    }
    this.tabla = tabla;
    this.titulo = titulo;
    this.compraServicesHelpers = new CompraServices();
  }

  async renderCompraLista() {
    try {
      // Limpiar el contenedor antes de renderizar
      this.tabla.innerHTML = "";
      this.titulo.innerHTML = "";

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
          checked: order.checked,
          enCamino: order.enCamino,
          items: order.items,
          id: order._id,
          finalizado: order.finalizado, // Asumimos que existe un campo 'finalizado' en el pedido
        };

        // Mostrar notificación de nuevo pedido
        if (!order.checked) {
          alert(`Nuevo pedido de ${orderData.name} (${orderData.email})`);
        }

        // Crear la tarjeta y añadirla a la fila
        const cardCol = document.createElement("div");
        cardCol.className = "col-md-6 mb-4"; // 3 columnas en pantallas medianas y más grandes
        cardCol.appendChild(this.crearTarjeta(orderData));

        row.appendChild(cardCol);
      }

      // Añadir la fila al contenedor principal
      this.tabla.appendChild(row);
    } catch (error) {
      console.log(error);
    }
  }

  crearTarjeta({
    name,
    email,
    phoneNumber,
    items,
    checked,
    enCamino,
    created_at,
    id,
    finalizado,
  }) {
    const fechaCreacion = new Date(created_at);
    const fechaFormateada = `${fechaCreacion
      .getFullYear()
      .toString()
      .slice(-2)}-${("0" + (fechaCreacion.getMonth() + 1)).slice(-2)}-${(
      "0" + fechaCreacion.getDate()
    ).slice(-2)}`;

    const producto = items
      .map(
        (item) =>
          `<div>
       ${item.name} | Cantidad: ${item.quantity} | Talle: ${item.size} | <a href="${item.hash}" target="_blank">
       Ver producto
        </a>
      </div>`
      )
      .join("<br>");

    let estado;
    let btnAceptarDisabled = false;
    let btnEnCaminoDisabled = true;
    let btnFinDisabled = true;

    if (finalizado) {
      estado = "Compra finalizada";
      btnAceptarDisabled = true;
      btnEnCaminoDisabled = true;
      btnFinDisabled = true;
    } else if (enCamino) {
      estado = "en proceso de entrega";
      btnAceptarDisabled = true;
      btnEnCaminoDisabled = true;
      btnFinDisabled = false;
    } else if (checked) {
      estado = "aceptado y enviado correo (en preparacion)";
      btnAceptarDisabled = true;
      btnEnCaminoDisabled = false;
      btnFinDisabled = true;
    } else {
      estado = "en espera de aceptacion";
      btnAceptarDisabled = false;
      btnEnCaminoDisabled = true;
      btnFinDisabled = true;
    }

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-body w-100">
        <h5 class="card-title">Cliente: ${name}</h5>
        <p class="card-text"><strong>Email:</strong> ${email}</p>
        <p class="card-text"><strong>Teléfono:</strong> ${phoneNumber}</p>
        <p class="card-text"><strong>Fecha de creación:</strong> ${fechaFormateada}</p>
        <p class="card-text"><strong>Productos:</strong><br> ${producto}</p>
          <p class="card-text"><strong>Estado:  <h5 class="card-title">${estado}</h5></p>
      </div>
      <div class="card-footer text-center">
       <p class="card-text"> Alertas</p>
        <button type="button" class="btn btn-primary" data-aceptarPedido="${id}" ${
      btnAceptarDisabled ? "disabled" : ""
    }>Aceptar Pedido</button>
        <button type="button" class="btn btn-primary" data-compraEnCamino="${id}" ${
      btnEnCaminoDisabled ? "disabled" : ""
    }>En camino</button>
        <button type="button" class="btn btn-danger" data-compraFin="${id}" ${
      btnFinDisabled ? "disabled" : ""
    }>Fin</button>   
      </div>
    `;

    card
      .querySelector("[data-compraFin]")
      .addEventListener("click", async () => {
        await finalizarPedidoHandler(id); // Actualiza el estado en la base de datos
        await this.renderCompraLista(); // Vuelve a renderizar la lista de compras
      });

    card
      .querySelector("[data-aceptarPedido]")
      .addEventListener("click", async () => {
        await aceptarPedidoHandler(email, name, producto, id);
        await this.renderCompraLista(); // Vuelve a renderizar la lista de compras
      });

    card
      .querySelector("[data-compraEnCamino]")
      .addEventListener("click", async () => {
        await mensajeEnCaminoHandlerCompra(email, name, producto, id);
        await this.renderCompraLista(); // Vuelve a renderizar la lista de compras
      });

    return card;
  }
}
