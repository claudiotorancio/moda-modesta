import {
  finalizarPedidoHandler,
  eliminarPedido,
  mensajeEnCaminoHandlerCompra,
  aceptarPedidoHandler,
  cancelarPedidoHandler, // Asegúrate de importar esta función
} from "./eventsCompras.js";

export function crearTarjeta({
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
  renderCompraLista,
}) {
  const fechaFormateada = new Date(created_at).toLocaleDateString();

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

  card.querySelector("[data-compraFin]").addEventListener("click", async () => {
    await finalizarPedidoHandler(id);
    await renderCompraLista();
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
      await renderCompraLista();
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
      await renderCompraLista(); // Vuelve a renderizar la lista de compras
    });

  card
    .querySelector("[data-eliminarPedido]")
    .addEventListener("click", async () => {
      await eliminarPedido(id);
      await renderCompraLista();
    });

  return card;
}
