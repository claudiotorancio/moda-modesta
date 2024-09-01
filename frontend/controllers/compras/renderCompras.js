//RenderCompras.js
import { ListaServices } from "../../services/lista_services.js";

export class RenderCompras {
  constructor(tabla, titulo) {
    this.tabla = tabla;
    this.titulo = titulo;
    this.listaServicesHelpers = new ListaServices();
  }

  async renderCompraLista() {
    try {
      const tituloTabla = `
          <div>
            <div class="row">
              <div class="col-md-12">
                <h2 class="card-header">Users</h2>
                <table class="table">
                  <thead>
                    <tr>
                      <th>User()</th>
                      <th>Create</th>
                      <th>prod()</th>
                      <th>Rol</th>
                      <th>Eliminar</th>
                      <th>Actualizar</th>
                    </tr>
                  </thead>
                  <!-- Aquí se agregará el cuerpo de la tabla -->
                </table>
              </div>
            </div>
          </div>
        `;
      console.log(tituloTabla);

      this.titulo.innerHTML = tituloTabla;
    } catch (error) {
      console.log(error);
    }
  }
}
