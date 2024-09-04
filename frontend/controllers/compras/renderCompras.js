import { CompraServices } from "../../services/compra_services.js";

export class RenderCompras {
  constructor(tabla, titulo) {
    this.tabla = tabla;
    this.titulo = titulo;
    this.compraServicesHelpers = new CompraServices();
  }

  async renderCompraLista() {
    try {
      // Limpiar el contenedor antes de renderizar
      this.titulo.innerHTML = "";
      this.tabla.innerHTML = "";

      const tituloTabla = `
          <div>
            <div class="row">
              <div class="col-md-12">
                <h2 class="card-header">COMPRAS</h2>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Producto</th>
                      <th>Telefono</th>
                      <th>Fecha de Creación</th>
                      <th>AlertPrepare</th>
                      <th>AlertEnCamino</th>
                    </tr>
                  </thead>
                  <tbody id="tabla-cuerpo">
                    <!-- Aquí se agregará el cuerpo de la tabla -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
      this.titulo.innerHTML = tituloTabla;

      const listado = await this.compraServicesHelpers.listaOrder();

      const tablaCuerpo = this.titulo.querySelector("#tabla-cuerpo");

      for (const order of listado) {
        const orderData = {
          name: order.customer.name,
          created_at: order.createdAt,
          email: order.customer.email,
          phoneNumber: order.customer.phoneNumber,
          items: order.items,
        };

        tablaCuerpo.appendChild(this.nuevaTabla(orderData));
      }
    } catch (error) {
      console.log(error);
    }
  }

  nuevaTabla({ name, email, phoneNumber, items, created_at }) {
    const fechaCreacion = new Date(created_at);
    const fechaFormateada = `${fechaCreacion
      .getFullYear()
      .toString()
      .slice(-2)}-${("0" + (fechaCreacion.getMonth() + 1)).slice(-2)}-${(
      "0" + fechaCreacion.getDate()
    ).slice(-2)}`;

    const productos = items
      .map(
        (item) =>
          `<div>
       ${item.name} | Cantidad: ${item.quantity} | Talle: ${item.size} | <a Href=" ${item.hash}" target="blank">
       ver producto
        </a>
      </div>`
      )
      .join("<br>"); // Concatenar los productos con salto de línea

    const card = document.createElement("tr"); // Cambiado de "div" a "tr" para ser compatible con la tabla

    card.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${productos}</td>
      <td>${phoneNumber}</td>
      <td>${fechaFormateada}</td>
      <td><button type="button" class="btn btn-primary" data-userid="">del</button></td>
      <td><button type="button" class="btn btn-primary" id="button" data-userUp="">up</button></td>
    `;

    return card;
  }
}
