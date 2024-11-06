import envioServices from "../../services/envio_services.js";
import { valida } from "../carrito/validaciones.js";

//fcion para calcular envio en detalles de productViewer
export async function calcularEnvio() {
  const calcularEnvioBtn = document.getElementById("calcular-envio");
  if (calcularEnvioBtn) {
    calcularEnvioBtn.addEventListener("click", async () => {
      // Seleccionar el icono de la flecha
      const arrowIcon = document.getElementById("calcular-envio");

      // Preparar los datos para la API
      const cpOrigen = 6300;
      const cpDestinoInput = document.getElementById("cpDestino");
      const cpDestino = parseFloat(cpDestinoInput.value);
      const peso = 5; // Valor estático por ahora

      const datosEnvio = {
        cpOrigen,
        cpDestino,
        provinciaOrigen: "AR-L",
        provinciaDestino: "AR-L",
        peso,
      };

      try {
        // Realizar la solicitud a la API
        const data = await envioServices.calcularCostoEnvio(datosEnvio);

        const valorEnvio = data.paqarClasico.aDomicilio;
        const shippingTotalInput = document.getElementById("shipping-total");

        shippingTotalInput.innerHTML = getShipingTotalHtml(valorEnvio);

        // Mostrar la flecha de nuevo si el cálculo fue exitoso
        arrowIcon.style.display = "none";
      } catch (err) {
        console.error("Error al calcular el costo de envío:", err);

        // Manejar errores de la API
        const cpDestinoInput = document.getElementById("cpDestino");
        cpDestinoInput.setCustomValidity(
          "Código Postal no válido según el servidor."
        );
        valida(cpDestinoInput); // Forzar la validación para mostrar el mensaje

        cpDestinoInput.disabled = false;
        cpDestinoInput.parentElement.classList.add("input-container--invalid");

        // Ocultar la flecha si hay un error
        arrowIcon.style.display = "none";

        cpDestinoInput.addEventListener("focus", function handleFocus() {
          cpDestinoInput.setCustomValidity("");
          valida(cpDestinoInput);
          cpDestinoInput.parentElement.classList.remove(
            "input-container--invalid"
          );
          cpDestinoInput.removeEventListener("focus", handleFocus);

          // Mostrar la flecha cuando se intenta corregir el error
          arrowIcon.style.display = "block";
        });
      }
    });
  }
}

function getShipingTotalHtml(valorEnvio) {
  return `
        <div style="display: flex; align-items: center;">
          <img src="https://moda-modesta.s3.us-east-2.amazonaws.com/vecteezy_delivery-and-courier-motorbike-logo_12665408.jpg" 
               alt="Moto de cadete" 
               style="width: 4rem; flex-shrink: 0; margin-right: 0.5rem;">
          <span style="font-size: 0.8rem;">Entrega a Domicilio: Pago en destino. (horario comercial)</span>
        </div>
        <div style="display: flex; align-items: center;">
          <img src="https://moda-modesta.s3.us-east-2.amazonaws.com/correo-argentino.svg" 
               alt="Correo Argentino" 
               style="width: 4rem;  flex-shrink: 0; margin-right: 0.5rem;">
          <span style="font-size: 0.8rem;">Correo Argentino: $${valorEnvio}. - 3 a 6 días hábiles. (despues del despacho)</span>
        </div>
        <div style="display: flex; align-items: center;">
          <img src="https://moda-modesta.s3.us-east-2.amazonaws.com/ubicacion.png" 
               alt="Retiro en tienda" 
               style="width: 4rem; flex-shrink: 0; margin-right: 0.5rem;">
          <span style="font-size: 0.8rem;">Retiro en Local: Gratis. Disponible en nuestro local.</span>
        </div>
      `;
}
