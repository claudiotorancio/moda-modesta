import { CompraServices } from "../../services/compra_services.js";
import { ListaServices } from "../../services/lista_services.js";
import { crearTarjeta } from "./crearTarjeta.js";

export class RenderCompras {
  constructor(titulo) {
    this.titulo = titulo;
    this.compraServicesHelpers = new CompraServices();
    this.listado = []; // Almacenar listado completo
    this.listaServicesInstance = new ListaServices();
  }

  async renderCompraLista() {
    try {
      // Limpiar el contenedor antes de renderizar
      this.titulo.innerHTML = "";

      // Agregar la estructura del título y el campo de búsqueda
      const tituloContenido = `
            <div>
                <h2 class="text-center">COMPRAS</h2>
                <input type="text" id="searchInput" placeholder="Buscar..." class="form-control mx-auto mt-2 w-50">
            </div>
            <div class="row"></div> <!-- Contenedor para las compras -->
        `;
      this.titulo.innerHTML = tituloContenido;

      // Configurar el evento de búsqueda
      const searchInput = this.titulo.querySelector("#searchInput");
      searchInput.addEventListener("input", () => this.filtrarCompras());

      // Obtener el listado completo de compras
      this.listado = await this.compraServicesHelpers.purchaseOrder();

      // Ordenar las compras por la fecha de creación (createdAt) en orden descendente
      this.listado.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      this.mostrarCompras(this.listado); // Mostrar todas las compras inicialmente
    } catch (error) {
      console.log(error);
    }
  }

  async mostrarCompras(listado) {
    // Limpiar el contenedor antes de renderizar
    this.titulo.querySelector(".row").innerHTML = "";

    // Insertar notificación al principio, si hay pedidos sin aceptar ni cancelar
    const pedidosPendientes = listado.filter(
      (order) => !order.aceptar && !order.cancelado
    );
    if (pedidosPendientes.length > 0) {
      const notification = document.createElement("div");
      notification.className = "notification alert alert-warning";
      notification.setAttribute("role", "alert");
      notification.innerHTML = `Hay ${pedidosPendientes.length} nuevos pedidos pendientes de revisión.`;
      this.titulo.prepend(notification); // Insertar notificación al inicio
    }

    const row = document.createElement("div");
    row.className = "row"; // Contenedor para las columnas

    for (const order of listado) {
      const id = order.customer.userId;

      // Definir emailVerified como false por defecto
      let emailVerified = false;

      // Verificar si el id es válido antes de llamar al servicio
      if (id) {
        const data = await this.listaServicesInstance.getUser(id);
        emailVerified = data ? data.emailVerified : false; // Manejar caso en que data sea null o undefined
      }

      const orderData = {
        id: order._id,
        name: order.customer.name,
        email: order.customer.email,
        phoneNumber: order.customer.phoneNumber,
        items: order.items,
        aceptar: order.aceptar,
        enCamino: order.enCamino,
        finalizado: order.finalizado,
        created_at: order.createdAt,
        cancelado: order.cancelado,
        emailVerified,
        renderCompraLista: this.renderCompraLista.bind(this),
      };

      const cardCol = document.createElement("div");
      cardCol.className = "col-md-6 mb-4";

      cardCol.appendChild(crearTarjeta(orderData));

      row.appendChild(cardCol);
    }

    // Añadir la fila al contenedor principal
    this.titulo.querySelector(".row").appendChild(row);
  }

  filtrarCompras() {
    const searchInput = this.titulo
      .querySelector("#searchInput")
      .value.toLowerCase();

    // Si el campo de búsqueda está vacío, mostrar todo el listado
    if (!searchInput) {
      this.mostrarCompras(this.listado);
      return;
    }

    // Filtrar las compras basándose en la entrada de búsqueda
    const comprasFiltradas = this.listado.filter((order) => {
      const {
        customer: { name, email, phoneNumber },
        items,
        aceptar,
        enCamino,
        finalizado,
        cancelado,
      } = order;

      const estado = finalizado
        ? "compra cancelada"
        : cancelado
        ? "compra finalizada"
        : enCamino
        ? "en proceso de entrega"
        : aceptar
        ? "aceptado y enviado correo (en preparación)"
        : "en espera de aceptación";

      const productos = items.map((item) => item.name).join(" ");

      return (
        name.toLowerCase().includes(searchInput) ||
        email.toLowerCase().includes(searchInput) ||
        phoneNumber.toLowerCase().includes(searchInput) ||
        estado.toLowerCase().includes(searchInput) ||
        productos.toLowerCase().includes(searchInput)
      );
    });

    this.mostrarCompras(comprasFiltradas);
  }
}
