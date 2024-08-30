export function cargarReseñas() {
  const reseñasContainer = document.querySelector("[data-opcion4]");

  // Ejemplo de datos de reseñas, podría ser una llamada a una API
  const reseñas = [
    {
      nombre: "Julia Pérez",
      calificacion: 5,
      comentario: "¡Producto excelente, lo recomiendo mucho!",
      redSocial: "Facebook",
    },
    {
      nombre: "María López",
      calificacion: 4,
      comentario: "Muy buen producto, pero el envío fue un poco lento.",
      redSocial: "Instagram",
    },
    {
      nombre: "Maria Jose García",
      calificacion: 5,
      comentario: "La calidad es insuperable. Estoy muy satisfecha.",
      redSocial: "Twitter",
    },
  ];

  reseñas.forEach((reseña) => {
    const reseñaElement = document.createElement("div");
    reseñaElement.classList.add("reseña");

    reseñaElement.innerHTML = `
        <p class="nombre-cliente">${reseña.nombre}</p>
        <p class="calificacion">${"★".repeat(reseña.calificacion)}</p>
        <p class="comentario">${reseña.comentario}</p>
        <p class="red-social">${reseña.redSocial}</p>
      `;

    reseñasContainer.appendChild(reseñaElement);
  });
}
