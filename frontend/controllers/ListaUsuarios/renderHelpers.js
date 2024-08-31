import { ListaServices } from "../../services/lista_services.js";
import productoServices from "../../services/product_services.js";

export class RenderHelpers {
  constructor(tabla, titulo) {
    this.tabla = tabla;
    this.titulo = titulo;
    this.listaServicesHelpers = new ListaServices();
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
                <tr>
                  <th style="width: 25%;">Users (${usersCantidad})</th>
                  <th style="width: 25%;">Create</th>
                  <th style="width: 25%;">prod (${total})</th>
                  <th style="width: 25%;">Rol</th>
                  <th style="width: 25%;">Accion</th>
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
                <td style="width: 25%;">${username}</td>
                <td style="width: 25%;">${fechaFormateada}</td>
                <td style="width: 25%;">${totalProductos}</td>
                <td style="width: 25%;">${role}</td>
                <td style="width: 15%;"><button type="button" class="btn btn-danger" data-userid="${id}">del</button></td>
                <td style="width: 15%;"><button type="button" class="btn btn-primary" id="button" data-userUp="${id}">up</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;

    return card;
  }
}
