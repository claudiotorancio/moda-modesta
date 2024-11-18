import moment from "moment";

export async function contadorHorasDescuento(expiryDate, countdownContainer) {
  // Verificar si expiryDate es null o no válido
  if (!expiryDate) {
    countdownContainer.innerHTML = ""; // No mostrar el contador si la fecha es null o no válida
    return;
  }

  // Convierte la fecha de expiración a UTC
  let expiryDateUTC = moment.utc(expiryDate).format("YYYY-MM-DD HH:mm:ss");
  let end = new Date(expiryDateUTC).getTime();

  function showRemaining() {
    let now = new Date().getTime();
    let distance = end - now;

    if (distance > 0) {
      // Convertir milisegundos a horas, minutos y segundos
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // Mostrar solo si faltan menos de 5 horas
      if (hours < 5) {
        countdownContainer.innerHTML = `
        <small class="text-info">Descuento finaliza en ${hours}h ${minutes}m ${seconds}s</small>
      `;
      }
    } else {
      countdownContainer.textContent = "";
    }
  }

  setInterval(showRemaining, 1000);
  showRemaining(); // Llamada inicial para mostrar el contador
}
