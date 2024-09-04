import { ListaServices } from "../../services/lista_services.js";
import { EventHandlers } from "./eventHandlers.js";

export class RenderHelpers {
  constructor(tabla, titulo) {
    this.tabla = tabla;
    this.titulo = titulo;
    this.listaServicesHelpers = new ListaServices();
    this.buttonHandler = new EventHandlers();
  }

  async renderUsersList() {
    try {
      // Limpiar el contenedor antes de renderizar
      this.titulo.innerHTML = "";
      this.tabla.innerHTML = "";

      const { listado, usersCantidad } =
        await this.listaServicesHelpers.listaUsers();

      const tituloTabla = `
      <div>
        <div class="row">
          <div class="col-md-12">
            <h2 class="card-header text-center">SUSCRIPTORES</h2>
            <table class="table">
              <thead>
                <tr >
                  <th >Suscriptor(${usersCantidad})</th>
                  <th >Creado</th>
                  <th >emailVerificado</th>
                  <th >Rol</th>
                  <th >Eliminar</th>
                  <th >Actualizar</th>
                </tr>
              </thead>
                <tbody id="tabla-cuerpo">
                    <!-- Aquí se agregará el cuerpo de la tabla -->
                  </tbody>
            </table>
          </div>
        </div>
      </div>`;
      this.titulo.innerHTML = tituloTabla;

      const tablaCuerpo = this.titulo.querySelector("#tabla-cuerpo");

      for (const usuario of listado) {
        const usuarioData = {
          username: usuario.username,
          created_at: usuario.created_at,
          emailVerified: usuario.emailVerified,
          role: usuario.role,
          id: usuario._id,
        };
        tablaCuerpo.appendChild(this.nuevaLista(usuarioData));
      }
    } catch (error) {
      console.log(error);
    }
  }

  nuevaLista({ username, created_at, role, emailVerified, id }) {
    const fechaCreacion = new Date(created_at);
    const fechaFormateada = `${fechaCreacion
      .getFullYear()
      .toString()
      .slice(-2)}-${("0" + (fechaCreacion.getMonth() + 1)).slice(-2)}-${(
      "0" + fechaCreacion.getDate()
    ).slice(-2)}`;

    const verificacionEmail = emailVerified ? "Sí" : "No";

    const card = document.createElement("tr");

    card.innerHTML = `
     
                <td >${username}</td>
                <td>${fechaFormateada}</td>
                <td >${verificacionEmail}</td>
                <td >${role}</td>
                <td ><button type="button" class="btn btn-danger" data-userid="${id}">del</button></td>
                <td ><button type="button" class="btn btn-primary" id="button" data-userUp="${id}">up</button></td>
          `;
    card
      .querySelector("[data-userid]")
      .addEventListener("click", (event) =>
        this.buttonHandler.deleteButtonHandler(event)
      );
    card
      .querySelector("[data-userUp]")
      .addEventListener("click", (event) =>
        this.buttonHandler.updateButtonHandler(event)
      );

    return card;
  }
}
