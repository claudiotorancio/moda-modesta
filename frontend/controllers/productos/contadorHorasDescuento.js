import moment from "moment";

export async function contadorHorasDescuento(expiryDate, countdownContainer) {
  // Usa la fecha directamente si ya está en UTC
  const expiryDateUTC = moment(expiryDate).utc(); // Convertir a UTC si es necesario
  console.log(
    "Fecha de expiración (UTC):",
    expiryDateUTC.format("YYYY-MM-DD HH:mm:ss")
  );

  function updateCountdown() {
    // Obtén la fecha actual en UTC
    const now = moment.utc(); // Fecha actual en UTC
    console.log("Fecha actual (UTC):", now.format("YYYY-MM-DD HH:mm:ss"));

    // Calcula la diferencia en milisegundos
    const timeRemaining = expiryDateUTC.diff(now);
    console.log("Tiempo restante (ms):", timeRemaining);

    if (timeRemaining > 0) {
      const duration = moment.duration(timeRemaining);

      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      // Mostrar solo si faltan menos de 5 horas
      if (hours < 5) {
        countdownContainer.innerHTML = `
          <small>Descuento termina en ${hours}h ${minutes}m ${seconds}s</small>
        `;
      } else {
        countdownContainer.innerHTML = ""; // No mostrar si faltan más de 5 horas
      }
    } else {
      countdownContainer.textContent = "";
    }
  }

  // Actualiza cada segundo
  setInterval(updateCountdown, 1000);
  updateCountdown();
}
