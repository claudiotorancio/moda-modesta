import moment from "moment";

export async function contadorHorasDescuento() {
  const discountExpiryUTC = "2024-11-11T23:59:59Z";

  // Crear un objeto moment a partir de la fecha de expiración en UTC
  const expiryDate = moment.utc(discountExpiryUTC); // Asegurarse de tratar la fecha como UTC

  function updateCountdown() {
    const now = moment.utc(); // Obtener la fecha y hora actual en UTC

    // Calcular la diferencia en milisegundos
    const timeRemaining = expiryDate.diff(now);

    if (timeRemaining > 0) {
      // Calcular el tiempo restante en días, horas, minutos y segundos
      const duration = moment.duration(timeRemaining);
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      // Mostrar el tiempo restante en el DOM
      document.getElementById("days").textContent = days;
      document.getElementById("hours").textContent = hours;
      document.getElementById("minutes").textContent = minutes;
      document.getElementById("seconds").textContent = seconds;
    } else {
      // Si el descuento ha expirado
      document.getElementById("countdown").textContent =
        "¡El descuento ha expirado!";
    }
  }

  // Actualizar el contador cada segundo
  setInterval(updateCountdown, 1000);

  // Llamar a la función inicialmente para mostrar el estado correcto
  updateCountdown();
}
