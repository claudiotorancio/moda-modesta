import { ListaServices } from "../../services/lista_services.js";
import productoServices from "../../services/product_services.js";
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
      const { listado, usersCantidad } =
        await this.listaServicesHelpers.listaUsers();

      const { total } = await productoServices.listaProductos();

      const tituloTabla = `
      <div>
        <div class="row">
          <div class="col-md-12">
            <h2 class="card-header">Users</h2>
            <table class="table">
              <thead>
                <tr >
                  <th >User(${usersCantidad})</th>
                  <th >Create</th>
                  <th >prod(${total})</th>
                  <th >Rol</th>
                  <th >Eliminar</th>
                  <th >Actualizar</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>`;
      this.titulo.innerHTML = tituloTabla;

      listado.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      for (const usuario of listado) {
        const totalProductos = await this.obtenerTotalProductos(usuario._id);
        console.log(totalProductos);
        const usuarioData = {
          username: usuario.username,
          created_at: usuario.created_at,
          role: usuario.role,
          totalProductos: totalProductos,
          id: usuario._id,
        };
        this.tabla.appendChild(this.nuevaLista(usuarioData));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async obtenerTotalProductos(userId) {
    const { cantidad } = await this.listaServicesHelpers.totalProductos(userId);
    return cantidad;
  }

  nuevaLista({ username, created_at, role, totalProductos, id }) {
    const fechaCreacion = new Date(created_at);
    const fechaFormateada = `${fechaCreacion
      .getFullYear()
      .toString()
      .slice(-2)}-${("0" + (fechaCreacion.getMonth() + 1)).slice(-2)}-${(
      "0" + fechaCreacion.getDate()
    ).slice(-2)}`;

    const card = document.createElement("div");

    card.innerHTML = `
      <div class="row">
        <div class="col-md-12">
          <table class="table">
            <tbody>
              <tr style="text-align: left;">
                <td >${username}</td>
                <td>${fechaFormateada}</td>
                <td >${totalProductos}</td>
                <td >${role}</td>
                <td ><button type="button" class="btn btn-danger" data-userid="${id}">del</button></td>
                <td ><button type="button" class="btn btn-primary" id="button" data-userUp="${id}">up</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
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
