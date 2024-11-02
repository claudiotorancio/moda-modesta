import { comprarProducto } from "../carrito/comprarProducto.js";
import { cargarProductosSimilares } from "./cargarProductosSimilares.js";
import { handleEnvioFormProduct } from "../carrito/envioHandlers.js";
import envioServices from "../../services/envio_services.js";

export async function eventListenerBotones(
  id,
  name,
  price,
  imagePath,
  sizes,
  section,
  generalStock,
  messageElement
) {
  //evento productos similares
  const botonSimilares = document.getElementById("toggle-similares");

  botonSimilares.addEventListener("click", async function () {
    const icon = this.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
    document.getElementById("similares-Container").classList.toggle("show");

    if (
      document.getElementById("similares-Container").classList.contains("show")
    ) {
      await cargarProductosSimilares(id).catch((error) =>
        console.error("Error al cargar productos similares:", error)
      );
    }
  });

  // calcular envio
  const calcularEnvioBtn = document.getElementById("calcular-envio");
  if (calcularEnvioBtn) {
    calcularEnvioBtn.addEventListener(
      "click",
      handleEnvioFormProduct.bind(this)
    );
  } else {
    // console.log("Botón de calcular envío no encontrado, no hay stock.");
  }

  // Agregar al carrito
  const agregarCarritoBtn = document.querySelector("[data-carrito]");
  if (agregarCarritoBtn) {
    agregarCarritoBtn.addEventListener("click", async () => {
      let talleSeleccionado;

      // Comprobar si la sección es 'opcion3'
      if (section === "opcion3") {
        // No hay talle seleccionado, puedes asignar un valor predeterminado
        talleSeleccionado = 1; // O 'Sin talla' si prefieres
      } else {
        // Obtener el talle seleccionado del select
        talleSeleccionado = document.getElementById("variation_1").value;
      }

      await comprarProducto(
        id,
        name,
        price,
        imagePath,
        sizes,
        talleSeleccionado,
        section,
        generalStock,
        messageElement
      );
    });
  } else {
    // console.log(
    //   "Botón de añadir al carrito no encontrado, posiblemente no hay stock."
    // );
  }

  //evento comnpratir
  const compartirBtn = document.getElementById("compartir-producto");

  if (compartirBtn) {
    compartirBtn.addEventListener("click", () => {
      // Lógica de compartir

      compartirBtn.disabled = true; // Deshabilitar mientras se realiza la acción de compartir
      const productUrl = window.location.href;

      if (navigator.share) {
        navigator
          .share({
            text: `¡Mira este producto! ${name} por solo $${price}`,
            url: productUrl,
          })
          .then(() => {
            console.log("Compartido exitosamente");
          })
          .catch((error) => {
            console.log("Error al compartir:", error);
          })
          .finally(() => {
            compartirBtn.disabled = false; // Habilitar nuevamente
          });
      } else {
        alert(
          "La función de compartir no es compatible con tu navegador. Comparte manualmente el enlace."
        );
        compartirBtn.disabled = false; // Habilitar en caso de error
      }
    });
  } else {
    // console.error("El botón 'compartir-producto' no existe en el DOM.");
  }

  //enviar notificacion sin stock

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
