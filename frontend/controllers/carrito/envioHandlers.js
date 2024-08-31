// envioHandlers.js
import envioServices from "../../services/envio_services.js";
import { valida } from "./validaciones.js";

export function handleEnvioFormToggle() {
  const envioFormContainer = document.getElementById("envio-form-container");
  envioFormContainer.classList.toggle("show");

  const icon = document.querySelector("#toggle-envio-form i");
  icon.classList.toggle("fa-chevron-down");
  icon.classList.toggle("fa-chevron-up");
}

export async function handleEnvioFormSubmission(event) {
  event.preventDefault();

  // Valida los campos del formulario
  const inputs = document.querySelectorAll("input, select");
  let formularioValido = true;

  inputs.forEach((input) => {
    valida(input);
    if (!input.validity.valid) {
      formularioValido = false;
    }
  });

  if (!formularioValido) {
    console.log("Formulario inválido. Verifica los campos.");
    return; // Detener la ejecución si el formulario no es válido
  }

  // Preparar los datos para la API
  const cpOrigen = 6300;
  const cpDestinoInput = document.getElementById("cpDestino");
  const cpDestino = parseFloat(cpDestinoInput.value);
  const provinciaDestino = document.getElementById("provinciaDestino").value;
  const peso = 5; // Valor estático por ahora

  const datosEnvio = {
    cpOrigen,
    cpDestino,
    provinciaOrigen: "AR-L",
    provinciaDestino,
    peso,
  };

  try {
    // Realizar la solicitud a la API
    const data = await envioServices.calcularCostoEnvio(datosEnvio);

    const valorEnvio = data.paqarClasico.aDomicilio;
    const shippingTotalInput = document.getElementById("shipping-total");
    shippingTotalInput.value = valorEnvio;

    this.costoEnvio = parseFloat(valorEnvio); // Actualiza el costo de envío
    this.provinciaDestino = provinciaDestino;
    this.cpDestino = cpDestino;

    // Actualizar el total del carrito
    const totalCost = this.calcularTotal();
    document.querySelector("#final-total").textContent = `$${totalCost.toFixed(
      2
    )}`;

    // Marcar la casilla "Entrega" como completada
    document
      .querySelector("#progreso-compra .paso:nth-child(2)")
      .classList.add("completado");

    // Habilitar el botón "Siguiente"
    const finalizeButton = document.querySelector("#finalize-purchase");
    finalizeButton.disabled = false;
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

    cpDestinoInput.addEventListener("focus", function handleFocus() {
      cpDestinoInput.setCustomValidity("");
      valida(cpDestinoInput);
      cpDestinoInput.parentElement.classList.remove("input-container--invalid");
      cpDestinoInput.removeEventListener("focus", handleFocus);
    });
  }
}

export function handleCoordinarVendedorChange(event) {
  const isChecked = event.target.checked;
  const shippingFields = [
    document.querySelector("#provinciaDestino"),
    document.querySelector("#cpDestino"),
    document.getElementById("calcular-envio"),
    document.getElementById("shipping-total"),
  ];

  this.isChecked = isChecked;

  shippingFields.forEach((field) => {
    field.disabled = isChecked;
  });

  // Actualizar el costo de envío y el total del carrito
  this.costoEnvio = isChecked
    ? 0
    : parseFloat(document.querySelector("#shipping-total").value || 0);

  const totalCost = this.calcularTotal();
  document.querySelector("#final-total").textContent = `$${totalCost.toFixed(
    2
  )}`;

  const finalizeButton = document.querySelector("#finalize-purchase");
  finalizeButton.disabled = !isChecked && this.costoEnvio === 0;

  // Actualizar el progreso
  const pasoEntrega = document.querySelector(
    "#progreso-compra .paso:nth-child(2)"
  );
  pasoEntrega.classList.toggle(
    "completado",
    isChecked || (!isChecked && this.costoEnvio > 0)
  );
}
