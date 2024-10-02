import { CompraServices } from "../../services/compra_services.js";
import { ListaServices } from "../../services/lista_services.js";
import {
  finalizarPedidoHandler,
  eliminarPedido,
  mensajeEnCaminoHandlerCompra,
  aceptarPedidoHandler,
  cancelarPedidoHandler, // Asegúrate de importar esta función
} from "./eventsCompras.js";

export class RenderCompras {
  constructor(titulo) {
    this.titulo = titulo;
    this.compraServicesHelpers = new CompraServices();
    this.listado = []; // Almacenar listado completo
    this.listaServicesInstance = new ListaServices();
  }

  async renderCompraLista() {
    try {
      // Limpiar el contenedor antes de renderizar
      this.titulo.innerHTML = "";

      // Agregar la estructura del título y el campo de búsqueda
      const tituloContenido = `
        <div>
          <h2 class="text-center">COMPRAS</h2>
          <input type="text" id="searchInput" placeholder="Buscar..." class="form-control mx-auto mt-2 w-50">
        </div>
        <div class="row"></div> <!-- Contenedor para las compras -->
      `;
      this.titulo.innerHTML = tituloContenido;

      // Configurar el evento de búsqueda
      const searchInput = this.titulo.querySelector("#searchInput");
      searchInput.addEventListener("input", () => this.filtrarCompras());

      // Obtener el listado completo de compras y mostrarlo
      this.listado = await this.compraServicesHelpers.listaOrder();

      this.mostrarCompras(this.listado); // Mostrar todas las compras inicialmente
    } catch (error) {
      console.log(error);
    }
  }

  async mostrarCompras(listado) {
    // Limpiar el contenedor antes de renderizar
    this.titulo.querySelector(".row").innerHTML = "";

    const row = document.createElement("div");
    row.className = "row"; // Contenedor para las columnas

    for (const order of listado) {
      const id = order.customer.userId;
      const user = await this.listaServicesInstance.getUser(id);
      const emailVerified = user.emailVerified;
      console.log(emailVerified);
      const orderData = {
        id: order._id,
        name: order.customer.name,
        email: order.customer.email,
        phoneNumber: order.customer.phoneNumber,
        items: order.items,
        aceptar: order.aceptar,
        enCamino: order.enCamino,
        finalizado: order.finalizado,
        created_at: order.createdAt,
        cancelado: order.cancelado,
        emailVerified,
      };

      // Mostrar notificación de nuevo pedido
      if (!order.aceptar && !order.cancelado) {
        alert(`Nuevo pedido de ${orderData.name} (${orderData.email})`);
      }

      const cardCol = document.createElement("div");
      cardCol.className = "col-md-6 mb-4"; // 3 columnas en pantallas medianas y más grandes
      cardCol.appendChild(this.crearTarjeta(orderData));

      row.appendChild(cardCol);
    }

    // Añadir la fila al contenedor principal
    this.titulo.querySelector(".row").appendChild(row);
  }

  filtrarCompras() {
    const searchInput = this.titulo
      .querySelector("#searchInput")
      .value.toLowerCase();

    // Si el campo de búsqueda está vacío, mostrar todo el listado
    if (!searchInput) {
      this.mostrarCompras(this.listado);
      return;
    }

    // Filtrar las compras basándose en la entrada de búsqueda
    const comprasFiltradas = this.listado.filter((order) => {
      const {
        customer: { name, email, phoneNumber },
        items,
        aceptar,
        enCamino,
        finalizado,
        cancelado,
      } = order;

      const estado = finalizado
        ? "compra cancelada"
        : cancelado
        ? "compra finalizada"
        : enCamino
        ? "en proceso de entrega"
        : aceptar
        ? "aceptado y enviado correo (en preparación)"
        : "en espera de aceptación";

      const productos = items.map((item) => item.name).join(" ");

      return (
        name.toLowerCase().includes(searchInput) ||
        email.toLowerCase().includes(searchInput) ||
        phoneNumber.toLowerCase().includes(searchInput) ||
        estado.toLowerCase().includes(searchInput) ||
        productos.toLowerCase().includes(searchInput)
      );
    });

    this.mostrarCompras(comprasFiltradas);
  }

  crearTarjeta({
    id,
    name,
    email,
    phoneNumber,
    items,
    aceptar,
    enCamino,
    finalizado,
    created_at,
    cancelado,
    emailVerified,
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
    let btnCancelarDisabled = false;

    if (cancelado) {
      estado = "Compra Cancelada";
      btnAceptarDisabled = true;
      btnEnCaminoDisabled = true;
      btnFinDisabled = true;
      btnCancelarDisabled = true;
    } else if (finalizado) {
      estado = "Compra finalizada";
      btnAceptarDisabled = true;
      btnEnCaminoDisabled = true;
      btnFinDisabled = true;
      btnCancelarDisabled = true;
    } else if (enCamino) {
      estado = "en proceso de entrega";
      btnAceptarDisabled = true;
      btnEnCaminoDisabled = true;
      btnFinDisabled = false;
      btnCancelarDisabled = false;
    } else if (aceptar) {
      estado = "aceptado y enviado correo (en preparación)";
      btnAceptarDisabled = true;
      btnEnCaminoDisabled = false;
      btnFinDisabled = true;
      btnCancelarDisabled = false;
    } else {
      estado = "en espera de aceptación";
      btnAceptarDisabled = false;
      btnEnCaminoDisabled = true;
      btnFinDisabled = true;
      btnCancelarDisabled = false;
    }
    const verified = emailVerified ? "SI" : "NO";
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <div class="card-body w-100">
      <button type="button" class="btn-close btn-close-black position-absolute top-0 end-0" aria-label="Eliminar" data-eliminarPedido="${id}"></button>
      <p class="card-text"><strong>Orden N°:</strong> ${id}</p>
      <h5 class="card-title">Cliente: ${name}</h5>
      <p class="card-text"><strong>Email:</strong> ${email}</p>
      <p class="card-text"><strong>Teléfono:</strong> ${phoneNumber}</p>
      <p class="card-text"><strong>Fecha de creación:</strong> ${fechaFormateada}</p>
      <p class="card-text"><strong>Productos:</strong><br> ${producto}</p>
      <p class="card-text"><strong>Email verificado:</strong> ${verified}</p>
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
      <button type="button" class="btn btn-warning" data-compraCancelada="${id}" ${
      btnCancelarDisabled ? "disabled" : ""
    }>Compra Cancelada</button>
    </div>
  `;

    card
      .querySelector("[data-compraFin]")
      .addEventListener("click", async () => {
        await finalizarPedidoHandler(id);
        await this.renderCompraLista();
      });

    card
      .querySelector("[data-aceptarPedido]")
      .addEventListener("click", async () => {
        await aceptarPedidoHandler(email, name, producto, id);
        await this.renderCompraLista();
      });

    card
      .querySelector("[data-compraEnCamino]")
      .addEventListener("click", async () => {
        await mensajeEnCaminoHandlerCompra(email, name, producto, id);
        await this.renderCompraLista();
      });

    card
      .querySelector("[data-compraCancelada]")
      .addEventListener("click", async () => {
        const productos = items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        }));

        console.log(productos);
        await cancelarPedidoHandler(id, productos); // Maneja la lógica para cancelar la compra y devolver el producto al stock
        await this.renderCompraLista(); // Vuelve a renderizar la lista de compras
      });

    card
      .querySelector("[data-eliminarPedido]")
      .addEventListener("click", async () => {
        await eliminarPedido(id);
        await this.renderCompraLista();
      });

    return card;
  }
}
