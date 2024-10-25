import { ProfileServices } from "../services/profile-services.js";
import { LoginControllers } from "../controllers/registro/login_controllers.js";
import { modalControllers } from "../modal/modal.js";

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const profileControllers = {
  async InfoPersonal() {
    try {
      const profileServicesInstance = new ProfileServices();
      const user = await profileServicesInstance.getUser();

      const divInfoPersonal = document.getElementById("info-personal");
      divInfoPersonal.innerHTML = "";

      const contenido = `
        <h2>Perfil de Usuario</h2>
        <div class="card p-3" id="info-personal">
          <h3>Información Personal</h3>
          <div class="mb-3">
            <label for="username" class="form-label mt-3">Nombre de Usuario</label>
            <input
              type="text"
              class="form-control"
              id="username"
              value="${escapeHtml(user.nombre)}"
              disabled
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input
              type="email"
              class="form-control"
              id="email"
              value="${escapeHtml(user.email)}"
              disabled
            />
          </div>
          <button id="btn-reset-password" class="btn btn-primary">Cambiar Contraseña</button>
        </div>`;

      divInfoPersonal.innerHTML = contenido;

      const btnResetPassword = document.getElementById("btn-reset-password");
      btnResetPassword.addEventListener("click", async () => {
        try {
          const loginControllersInstance = new LoginControllers();
          loginControllersInstance.renderResetPassword();
          modalControllers.baseModal();
        } catch (error) {
          console.error("Error al cambiar la contraseña:", error);
          alert("Hubo un problema al cambiar la contraseña.");
        }
      });
    } catch (error) {
      console.log("Error al obtener la información del perfil:", error);
      alert("Hubo un problema al cargar la información del perfil.");
    }
  },

  async pedidosRecientes() {
    try {
      const profileServicesInstance = new ProfileServices();
      const pedidos = await profileServicesInstance.listaOrders();

      // Ordenar los pedidos por fecha de creación (más recientes primero)
      pedidos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const divPedidosRecientes = document.getElementById("pedidos-recientes");
      divPedidosRecientes.innerHTML = "";

      let contenido = `
        <h3>Pedidos Recientes</h3>
        <ul class="list-group">`;

      pedidos.forEach((pedido) => {
        const fechaPedido = new Date(pedido.createdAt).toLocaleDateString();

        contenido += `
          <li class="list-group-item mb-4">
            <div class="d-flex justify-content-between">
              <div>
                <strong>Pedido #${pedido._id}</strong><br>
                Fecha: ${fechaPedido} <br>
                Total: <strong>$${pedido.totalAmount}</strong> <br>
                Estado: ${this.obtenerEstadoPedido(pedido)}
              </div>
            </div>
            <ul class="list-group mt-3">`;

        pedido.items.forEach((item) => {
          contenido += `
            <li class="list-group-item mt-2">
              <strong>Producto:</strong> ${item.name} <br>
              <strong>Talle:</strong> ${item.size} <br>
              <strong>Cantidad:</strong> ${item.quantity} <br>
              <strong>Precio:</strong> $${item.price} <br>
              <a href="${item.hash}" target="_blank" class="btn btn-primary mt-2">Ver Producto</a>
            </li>`;
        });

        contenido += `</ul>
          </li>`;
      });

      contenido += `</ul>`;

      divPedidosRecientes.innerHTML = contenido;
    } catch (error) {
      console.log("Error al obtener los pedidos recientes:", error);
      alert("Hubo un problema al cargar los pedidos recientes.");
    }
  },

  obtenerEstadoPedido(pedido) {
    if (pedido.finalizado) {
      return "Entregado";
    } else if (pedido.enCamino) {
      return "En proceso de entrega";
    } else if (pedido.aceptar) {
      return "Procesando pedido";
    } else if (pedido.cancelado) {
      return "Compra Cancelada";
    } else {
      return "Pendiente";
    }
  },
};
