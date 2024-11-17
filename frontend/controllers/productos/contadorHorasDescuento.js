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

  console.log("Fecha de expiración (UTC):", expiryDateUTC);

  function showRemaining() {
    let now = new Date().getTime();
    let distance = end - now;

    console.log("Tiempo restante (ms):", distance);

    if (distance > 0) {
      // Convertir milisegundos a horas, minutos y segundos
      const hours = Math.floor(distance / (1000 * 60 * 60)); // horas
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // minutos
      const seconds = Math.floor((distance % (1000 * 60)) / 1000); // segundos

      // Mostrar solo si faltan menos de 5 horas
      if (hours < 5) {
        countdownContainer.innerHTML = `
          <small>Descuento finaliza en ${hours}h ${minutes}m ${seconds}s</small>
        `;
      } else {
        countdownContainer.innerHTML = ""; // No mostrar si faltan más de 5 horas
      }
    } else {
      countdownContainer.textContent = "¡El descuento ha terminado!";
    }
  }

  setInterval(showRemaining, 1000);
  showRemaining(); // Llamada inicial para mostrar el contador
}
