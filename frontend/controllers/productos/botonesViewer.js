import { comprarProducto } from "../carrito/comprarProducto.js";
import { cargarProductosSimilares } from "./cargarProductosSimilares.js";
import { handleEnvioFormProduct } from "../carrito/envioHandlers.js";
import envioServices from "../../services/envio_services.js";

export async function eventListenerBotones() {
  //evento productos similares
  const botonSimilares = document.getElementById("toggle-similares");

  botonSimilares.addEventListener("click", async () => {
    const icon = botonSimilares.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
    document.getElementById("similares-Container").classList.toggle("show");

    if (
      document.getElementById("similares-Container").classList.contains("show")
    ) {
      await cargarProductosSimilares
        .bind(this)()
        .catch((error) =>
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
    agregarCarritoBtn.addEventListener("click", async (event) => {
      let talleSeleccionado;
      let quantity;

      // Comprobar si la sección es 'opcion3'
      if (this.section === "opcion3") {
        // No hay talle seleccionado, puedes asignar un valor predeterminado
        quantity = document.getElementById("quantity").value || 1;
      } else {
        // Obtener el talle seleccionado del select

        const sizeSelect = document.getElementById("variation_1");
        const quantityInput = document.getElementById("quantity");

        talleSeleccionado = sizeSelect.value;
        quantity = parseInt(quantityInput.value, 10);

        if (event.target.id === "addToCartBtn") {
          const messageElement = document.getElementById("message");
          if (!talleSeleccionado) {
            messageElement.textContent = `Debes seleccionar un talle`;
            document.getElementById("messageContainer").style.display = "block";
          }
        }
      }

      await comprarProducto(
        this.id,
        this.name,
        this.price,
        this.imagePath,
        this.sizes,
        talleSeleccionado,
        this.section,
        this.generalStock,
        quantity,
        this.discount
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
            text: `¡Mira este producto! ${this.name} por solo $${this.price}`,
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
