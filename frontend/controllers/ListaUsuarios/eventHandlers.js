import { ListaServices } from "../../services/lista_services.js";
export class EventHandlers {
  constructor(tabla) {
    this.tabla = tabla;
    this.listaServicesHelpers = new ListaServices();
  }

  async deleteButtonHandler(event) {
    event.preventDefault();
    const userId = event.target.dataset.userid;

    const confirmacion = confirm(
      "¿Estás seguro de que quieres eliminar esta tarjeta?"
    );

    if (confirmacion) {
      try {
        const role = await this.listaServicesHelpers.getRole(userId);
        if (role !== "admin") {
          await this.listaServicesHelpers.listaServicesInstance.eliminarUser(
            userId
          );
          event.target.closest(".row").remove();
        } else {
          alert("No se puede eliminar un usuario administrador");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async updateButtonHandler(event) {
    event.preventDefault();
    const userId = event.target.dataset.userup;
    try {
      const username = await this.listaServicesHelpers.getUsername(userId);
      this.editarLista(username, userId);
    } catch (error) {
      console.error(error);
    }
  }

  editarLista(username, id) {
    modalControllers.baseModal();
    const modal = document.getElementById("modal");
    const productoEdicion = modal.querySelector("[data-table]");

    productoEdicion.innerHTML = `
    <div class="text-center">
      <div class="card-header">
        <form action="/api/updateUser/" enctype="multipart/form-data" id="form"  method="PUT" data-forma>                
          <p class="parrafo">Usuario a editar</p>
          <div class="form-group">
            <input class="form-control mt-3 p-2" placeholder="Nombre de usuario" type="text" value="${username}" required name="newUsername">
          </div>
          <div class="form-group"> 
            <input class="form-control mt-3 mb-3 p-2" placeholder="newPassword" type="password" required name="newPassword">
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="user" name="newRole" id="roleUser" checked>
            <label class="form-check-label" for="roleUser">
              user
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="admin" name="newRole" id="roleAdmin">
            <label class="form-check-label" for="roleAdmin">
              admin
            </label>
          </div>
          <div>
            <button type="submit" class="btn btn-primary btn-lg">Editar usuario</button>
          </div>
        </form>
      </div>
    </div>
  `;

    productoEdicion.classList.add("modalVisor");

    modal
      .querySelector("[data-forma]")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = document.getElementById("form");
        const formData = new FormData(form);

        const jsonData = {};
        for (const [key, value] of formData.entries()) {
          jsonData[key] = value;
        }

        try {
          await this.listaServicesHelpers.listaServicesInstance.updateUser(
            jsonData,
            id
          );
          modalControllers.modalProductoEditado();
        } catch (error) {
          console.error(error);
        }
      });
  }
}
