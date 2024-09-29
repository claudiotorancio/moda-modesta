import { CompraServices } from "../../services/compra_services.js";
// import { RenderCompras } from "./renderCompras.js";

export async function finalizarPedidoHandler(id) {
  const confirmacion = confirm(
    "¿Estás seguro de que quieres finalizar este pedido?"
  );

  if (confirmacion) {
    try {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.finalizarPedido(id);
    } catch (error) {
      console.error(error);
    }
  }
}

export async function cancelarPedidoHandler(id, productos) {
  const confirmacion = confirm(
    "¿Estás seguro de que quieres cancelar este pedido?"
  );

  if (confirmacion) {
    try {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.cancelarPedidoHandler(id, productos);
    } catch (error) {
      console.error(error);
    }
  }
}

export async function mensajeEnCaminoHandlerCompra(email, name, producto, id) {
  const confirmacion = confirm(
    "¿Desea enviar la alerta de que el pedido está en camino?"
  );
  if (confirmacion) {
    try {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.compraEnCamino(id);
      await compraServicesHelpers.correoEnCaminoe(email, name, producto);

      alert("Correo de notificación enviado con éxito.");
    } catch (error) {
      console.error(error);
    }
  }
}

export async function aceptarPedidoHandler(email, name, producto, id) {
  try {
    const confirmacion = confirm(
      "¿Desea aceptar este pedido y enviar mensaje de pedido en preparación?"
    );
    if (confirmacion) {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.aceptarPedido(id);
      const response = await compraServicesHelpers.compraPrepare(
        email,
        name,
        producto
      );
      console.log(response);
      alert("Correo de notificación enviado con éxito.");
    }
  } catch (error) {
    console.error("Error al aceptar el pedido o enviar el mensaje:", error);
  }
}

export async function eliminarPedido(id) {
  // Implementación para preparar pedido
  try {
    const confirmacion = confirm(
      "¿Desea eliminar esta orden? (ACCION IRREVERSIBLE)?"
    );
    if (confirmacion) {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.eliminarCompra(id);
      alert("Orden eliminada con éxito.");
    }
  } catch (error) {
    console.error(error);
  }
}
