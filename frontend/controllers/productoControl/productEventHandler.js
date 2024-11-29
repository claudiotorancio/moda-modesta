import productoServices from "../../services/product_services.js";
import envioServices from "../../services/envio_services.js";

export async function handleDesactivate(id) {
  try {
    const confirmacion = confirm("¿Desea desactivar el producto?");
    if (confirmacion) {
      await productoServices.desactivarProducto(id);
      return true; // Devolver true si se desactivó con éxito
    }
  } catch (error) {
    console.error("Error al desactivar el producto:", error);
    alert("Ocurrió un error al desactivar el producto.");
  }
  return false; // Devolver false en caso de error o cancelación
}

export async function handleActivate(id) {
  try {
    const confirmacion = confirm("¿Desea activar el producto?");
    if (confirmacion) {
      await productoServices.activarProducto(id);
      return true; // Devolver true si se activó con éxito
    }
  } catch (error) {
    console.error("Error al activar el producto:", error);
    alert("Ocurrió un error al activar el producto.");
  }
  return false; // Devolver false en caso de error o cancelación
}

export async function handleNotification(idProducto, idNotificaciones) {
  try {
    const confirmacion = confirm(
      "¿Desea enviar el aviso de ingreso a todas las solicitudes??"
    );

    if (confirmacion) {
      // Esperar a que se complete la desactivación
      await envioServices.notificacionIngreso(idProducto, idNotificaciones);
    }
  } catch (error) {
    console.error("Error al enviar la notificacion:", error);
    alert("Ocurrió un error al notifiar.");
  }
}
