import resenaServices from "../../services/resena_services.js";
import { editarResena, eliminarReseña } from "./eventHandlerResena.js";

// Función para agregar una reseña
export async function agregarReseña(resena) {
  try {
    await resenaServices.agregarResena(resena); // Esperar a que la reseña se agregue
    // console.log("Reseña añadida:", resena);

    // Actualizar la UI
    cargarReseñas(); // Recargar las reseñas después de agregar una nueva
  } catch (error) {
    console.error("Error al agregar la reseña:", error);
  }
}

// Función para obtener todas las reseñas
export async function cargarReseñas() {
  const reseñasContainer = document.querySelector("[data-resenasUser]");
  // Limpia el contenedor antes de agregar nuevas reseñas
  reseñasContainer.innerHTML = "";

  // Obtener reseñas
  const reseñas = await resenaServices.getResena(); // Esperar la respuesta de obtenerReseñas()
  // console.log("Reseñas obtenidas:", reseñas); // Verifica qué datos estás recibiendo

  // Verifica que reseñas sea un array
  if (!Array.isArray(reseñas)) {
    console.error("La respuesta no es un array:", reseñas);
    return;
  }

  // Crear elementos para cada reseña
  reseñas.forEach((reseña) => {
    const reseñaElement = document.createElement("div");
    reseñaElement.classList.add("reseña");

    reseñaElement.innerHTML = `
      <p class="nombre-cliente">${reseña.name}</p>
      <p class="calificacion">${"★".repeat(Number(reseña.estrellas))}</p>
      <p class="comentario">${reseña.resena}</p>
      <p class="red-social">${reseña.redSocial}</p>
    `;

    reseñasContainer.appendChild(reseñaElement);
  });
}
export async function cargarReseñasAdmin() {
  const reseñasContainer = document.querySelector("[data-resenasUser]");

  // Limpia el contenedor antes de agregar nuevas reseñas
  reseñasContainer.innerHTML = "";

  // Obtener reseñas
  const reseñas = await resenaServices.getResena(); // Esperar la respuesta de obtenerReseñas()
  // console.log("Reseñas obtenidas:", reseñas); // Verifica qué datos estás recibiendo

  // Verifica que reseñas sea un array
  if (!Array.isArray(reseñas)) {
    console.error("La respuesta no es un array:", reseñas);
    return;
  }

  // Crear elementos para cada reseña
  reseñas.forEach((reseña) => {
    const resenaId = reseña._id;
    const reseñaElement = document.createElement("div");
    reseñaElement.classList.add("reseña");
    reseñaElement.innerHTML = `
    <p class="nombre-cliente">${reseña.name}</p>
    <p class="calificacion">${"★".repeat(Number(reseña.estrellas))}</p>
    <p class="comentario">${reseña.resena}</p>
    <p class="red-social">${reseña.redSocial}</p>
    <button type="submit" class="btn btn-primary" data-editarResena="${resenaId}">Editar reseña</button>
    <button type="button" class="btn btn-danger mt-2" data-eliminarResena="${resenaId}">Eliminar reseña</button>
  `;

    // Accede al botón de editar
    const editButton = reseñaElement.querySelector("button[data-editarResena]");
    editButton.addEventListener("click", () => editarResena(resenaId));

    // Accede al botón de eliminar
    const deleteButton = reseñaElement.querySelector(
      "button[data-eliminarResena]"
    );
    deleteButton.addEventListener("click", () => {
      eliminarReseña(resenaId);
      reseñaElement.remove();
    });

    // Agrega el elemento de la reseña al contenedor principal
    reseñasContainer.appendChild(reseñaElement);
  });
}
