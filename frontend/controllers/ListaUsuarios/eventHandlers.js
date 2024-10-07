import { ListaServices } from "../../services/lista_services.js";
import { modalControllers } from "../../modal/modal.js";

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
        const role = await this.getRole(userId);
        if (role !== "admin") {
          await this.listaServicesHelpers.eliminarUser(userId);
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
      const username = await this.getUsername(userId);
      this.editarLista(username, userId);
    } catch (error) {
      console.error(error);
    }
  }

  //extraer datos de Users
  async getUsername(userId) {
    // console.log(`getUsername id: ${userId}`);
    const user = await this.listaServicesHelpers.getUser(userId);
    // console.log(`getUsername: ${user}`);
    return user.email;
  }

  //extraer datos de Users

  async getRole(id) {
    try {
      const user = await this.listaServicesHelpers.getUser(id);
      //console.log(`getRole: ${user}`);
      return user.role;
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      throw error;
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
            <input class="form-control mt-3 p-2" placeholder="email" type="email" value="${username}" required name="newEmail">
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
          await this.listaServicesHelpers.updateUser(jsonData, id);
        } catch (error) {
          console.error(error);
        }
      });
  }

  // Método para enviar promociones
  async enviarPromociones(myContent) {
    await this.listaServicesHelpers.enviarPromocion(myContent);
  }
}
