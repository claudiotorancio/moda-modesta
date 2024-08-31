import { RenderHelpers } from "./renderHelpers.js";
import { EventHandlers } from "./eventHandlers.js";

export class ListaControllers {
  constructor(tabla, titulo) {
    this.tabla = tabla;
    this.titulo = titulo;
    this.renderHelpers = new RenderHelpers(tabla, titulo);
    this.eventHandlers = new EventHandlers(tabla);
  }

  async renderLista() {
    try {
      const role = await this.renderHelpers.listaServicesHelpers.getAdmin();
      if (role === "admin") await this.renderHelpers.renderUsersList();
    } catch (error) {
      console.log(error);
    }
  }
}

// import productoServices from "../../services/product_services.js";
// import { ListaServices } from "../../services/lista_services.js";
// import { modalControllers } from "../../modal/modal.js";

// export class ListaControllers {
//   constructor(tabla, titulo) {
//     this.tabla = tabla;
//     this.titulo = titulo;
//     this.listaServicesInstance = new ListaServices();
//   }
//   //renderizar la lista
//   async renderLista() {
//     try {
//       const role = await this.getAdmin();
//       if (role === "admin") await this.renderUsersList();
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   //redcer usuarios
//   async renderUsersList() {
//     try {
//       const { listado, usersCantidad } =
//         await this.listaServicesInstance.listaUsers();
//       const { total } = await productoServices.listaProductos();

//       const tituloTabla = `
//       <div>
//         <div class="row">
//           <div class="col-md-12">
//             <h2 class="card-header">Users</h2>
//             <table class="table">
//               <thead>
//                 <tr>
//                   <th style="width: 25%;">Users (${usersCantidad})</th>
//                   <th style="width: 25%;">Create</th>
//                   <th style="width: 25%;">prod (${total})</th>
//                   <th style="width: 25%;">Rol</th>
//                   <th style="width: 25%;">Accion</th>
//                 </tr>
//               </thead>
//             </table>
//           </div>
//         </div>
//       </div>`;
//       this.titulo.innerHTML = tituloTabla;

//       listado.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//       for (const usuario of listado) {
//         const totalProductos = await this.obtenerTotalProductos(usuario._id);
//         const usuarioData = {
//           username: usuario.username,
//           created_at: usuario.created_at,
//           role: usuario.role,
//           totalProductos: totalProductos,
//           id: usuario._id,
//         };
//         this.tabla.appendChild(this.nuevaLista(usuarioData));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   //crear la lista dinamica
//   nuevaLista({ username, created_at, role, totalProductos, id }) {
//     const fechaCreacion = new Date(created_at);
//     const fechaFormateada = `${fechaCreacion
//       .getFullYear()
//       .toString()
//       .slice(-2)}-${("0" + (fechaCreacion.getMonth() + 1)).slice(-2)}-${(
//       "0" + fechaCreacion.getDate()
//     ).slice(-2)}`;

//     const card = document.createElement("div");

//     card.innerHTML = `
//       <div class="row">
//         <div class="col-md-12">
//           <table class="table">
//             <tbody>
//               <tr style="text-align: left;">
//                 <td style="width: 25%;" >${username}</td>
//                 <td style="width: 25%;">${fechaFormateada}</td>
//                 <td style="width: 25%;">${totalProductos}</td>
//                 <td style="width: 25%;">${role}</td>
//                 <td style="width: 15%;"><button type="button" class="btn btn-danger" data-userid="${id}" >del</button></td>
//                 <td style="width: 15%;"><button type="button" class="btn btn-primary" id="button" data-userUp="${id}" >up</button></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>`;

//     card
//       .querySelector("[data-userid]")
//       .addEventListener("click", this.deleteButtonHandler.bind(this));
//     card
//       .querySelector("[data-userUp]")
//       .addEventListener("click", this.updateButtonHandler.bind(this));

//     return card;
//   }
//   //evento delete
//   async deleteButtonHandler(event) {
//     event.preventDefault();
//     const userId = event.target.dataset.userid;

//     const confirmacion = confirm(
//       "¿Estás seguro de que quieres eliminar esta tarjeta?"
//     );

//     if (confirmacion) {
//       try {
//         const role = await this.getRole(userId);
//         if (role !== "admin") {
//           await this.listaServicesInstance.eliminarUser(userId);
//           event.target.closest(".row").remove();
//         } else {
//           alert("No se puede eliminar un usuario administrador");
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }
//   //evento update
//   async updateButtonHandler(event) {
//     event.preventDefault();
//     const userId = event.target.dataset.userup;
//     //console.log(`updateButton id: ${userId}`);
//     try {
//       const username = await this.getUsername(userId);
//       this.editarLista(username, userId);
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   //extraer datos de Users
//   async getUsername(userId) {
//     // console.log(`getUsername id: ${userId}`);
//     const user = await this.listaServicesInstance.getUser(userId);
//     // console.log(`getUsername: ${user}`);
//     return user.username;
//   }
//   //extraer datos de Users

//   async getAdmin() {
//     try {
//       const role = await this.listaServicesInstance.getAdmin();
//       //console.log(`getAdmin: ${role}`);
//       return role;
//     } catch (error) {
//       console.error("Error al obtener el rol del usuario:", error);
//       throw error;
//     }
//   }
//   //extraer datos de Users

//   async getRole(id) {
//     try {
//       const user = await this.listaServicesInstance.getUser(id);
//       //console.log(`getRole: ${user}`);
//       return user.role;
//     } catch (error) {
//       console.error("Error al obtener el rol del usuario:", error);
//       throw error;
//     }
//   }
//   //extraer datos de Products

//   async obtenerTotalProductos(userId) {
//     const { cantidad } = await this.listaServicesInstance.totalProductos(
//       userId
//     );
//     return cantidad;
//   }
//   //edicin de los datos de la lista

//   editarLista(username, id) {
//     modalControllers.baseModal();
//     const modal = document.getElementById("modal");
//     const productoEdicion = modal.querySelector("[data-table]");

//     productoEdicion.innerHTML = `
//     <div class="text-center">
//       <div class="card-header">
//         <form action="/api/updateUser/" enctype="multipart/form-data" id="form"  method="PUT" data-forma>
//           <p class="parrafo">Usuario a editar</p>
//           <div class="form-group">
//             <input class="form-control mt-3 p-2"  placeholder="Nombre de usuario" type="text" value="${username}" required name="newUsername">
//           </div>
//           <div class="form-group">
//             <input class="form-control mt-3 mb-3 p-2"  placeholder="newPassword" type="password"  required name="newPassword">
//           </div>
//           <div class="form-check">
//             <input class="form-check-input" type="checkbox" value="user" name="newRole" id="roleUser" checked>
//             <label class="form-check-label" for="roleUser">
//               user
//             </label>
//           </div>
//           <div class="form-check">
//             <input class="form-check-input" type="checkbox" value="admin" name="newRole" id="roleAdmin">
//             <label class="form-check-label" for="roleAdmin">
//               admin
//             </label>
//           </div>
//           <div>
//             <button type="submit" class="btn btn-primary btn-lg">Editar usuario</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   `;

//     productoEdicion.classList.add("modalVisor");

//     modal
//       .querySelector("[data-forma]")
//       .addEventListener("submit", async (e) => {
//         e.preventDefault();

//         // Obtener los datos del formulario
//         const form = document.getElementById("form");
//         const formData = new FormData(form);

//         // Convertir los datos de FormData a JSON
//         const jsonData = {};
//         for (const [key, value] of formData.entries()) {
//           jsonData[key] = value;
//         }

//         try {
//           await this.listaServicesInstance.updateUser(jsonData, id);
//           modalControllers.modalProductoEditado();
//         } catch (error) {
//           console.error(error);
//         }
//       });
//   }
// }
