import envioServices from "../../services/envio_services.js";

export async function notificacionesSinStock() {
  //envia notificacion sin stock
  const notificacionForm = document.querySelector("#notificacion-form");
  if (notificacionForm) {
    notificacionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Obtener los datos del formulario
      const email = document.querySelector("#email").value;

      const datos = {
        email,
        id,
      };
      // Validar que los campos no estén vacíos
      if (!email || !id) {
        alert("Por favor, complete todos los campos.");
        return;
      }

      // Aquí puedes enviar los datos del formulario a tu servidor
      try {
        await envioServices.notificacionSinStock(datos);
      } catch (error) {
        console.error("Error al guardar la notificacion", error);
      }
    });
  } else {
    // console.error("El botón 'notificar' no existe en el DOM.");
  }
}
