import resenaServices from "../../services/resena_services.js";
import { modalControllers } from "../../modal/modal.js";

export class FormResena {
  constructor(titulo) {
    this.titulo = titulo;
  }

  // Mostrar formulario
  render() {
    this.clearForm();
    const card = this.createForm();
    this.titulo.appendChild(card);
    this.setupFormSubmitHandler();
  }

  // Vaciar contenido
  clearForm() {
    this.titulo.innerHTML = "";
  }

  // Crear formulario dinámico
  createForm() {
    const card = document.createElement("div");
    card.className = "d-flex justify-content-center align-items-center"; // Centrar el contenedor del formulario

    card.innerHTML = `
      <div>
        <div class="text-center">
          <div class="card-header">
            <p>Cargar nueva Reseña</p>
          </div>
          <div class="card-body w-100">
            <form id="form" action="/api/agregarResena" enctype="multipart/form-data" method="POST" data-form>
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
                <button type="submit" class="btn btn-primary btn-lg">Enviar Reseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    return card;
  }

  // Capturar el evento submit
  setupFormSubmitHandler() {
    const form = this.titulo.querySelector("form[data-form]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  // Recopilar y enviar los datos
  async handleSubmit() {
    const name = document.querySelector("[data-name]").value;
    const redSocial = document.querySelector("[data-redSocial]").value;
    const resena = document.querySelector("[data-resena]").value;
    const estrellas = document.getElementById("miMenuDesplegable").value;

    const nuevaResena = {
      name,
      redSocial,
      resena,
      estrellas,
    };

    try {
      // Agregar reseña a la lista
      await resenaServices.agregarResena(nuevaResena);
    } catch (error) {
      console.error("Error al agregar la reseña:", error);
    }
  }
}
