import { modalControllers } from "../../modal/modal.js";
import resenaServices from "../../services/resena_services.js";
import { cargarReseñas, cargarReseñasAdmin } from "./reseñas.js";

export async function editarResena(resenaId) {
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const contenedorModal = modal.querySelector("[data-table]");

  contenedorModal.innerHTML = "";

  contenedorModal.innerHTML = `
 <div>
        <div class="text-center">
          <div class="card-header">
            <p>Editar Reseña</p>
          </div>
          <div class="card-body w-100">
            <form id="form" action="/api/putResena" enctype="multipart/form-data" method="PUT" data-form>
              <div class="form-group">
                <input class="form-control mt-3 p-2" type="text" placeholder="Nombre " name="name" required data-name>
              </div>
              <div class="form-group">
                <input class="form-control mt-3 mb-3 p-2" type="text" placeholder="Red social" name="redSocial" required data-redSocial>
              </div>
              <div class="form-group">
                <textarea class="form-control mt-3 mb-3 p-2" placeholder="Reseña" name="resena" required data-resena></textarea>
              </div>
              <p for="miMenuDesplegable">Estrellas</p>
              <div class="form-group">
                <select type="number" class="form-control mb-3 p-2" id="miMenuDesplegable" name="section">
                  <option value="3">3 estrellas</option>
                  <option value="4">4 estrellas</option>
                  <option value="5">5 estrellas</option>
                </select>
              </div>
              <div class="submitResena">
                <button type="submit" class="btn btn-primary btn-lg" data-resenaId="${resenaId}">Editar Reseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  `;
  // Manejar el evento de envío del formulario
  const form = contenedorModal.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("[data-name]").value;
    const redSocial = document.querySelector("[data-redSocial]").value;
    const resena = document.querySelector("[data-resena]").value;
    const estrellas = document.getElementById("miMenuDesplegable").value;

    const nuevaResena = {
      name,
      redSocial,
      resena,
      estrellas,
      resenaId,
    };

    try {
      // Agregar reseña a la lista
      await resenaServices.putResena(nuevaResena);
      await cargarReseñasAdmin();
    } catch (error) {
      console.error("Error al agregar la reseña:", error);
    }
  });
}

export async function eliminarReseña(resenaId) {
  const confirmacion = confirm("¿Está seguro que desea eliminar esta reseña?");
  if (confirmacion) {
    await resenaServices.deleteResena(resenaId);
    await cargarReseñasAdmin();
  }
}
