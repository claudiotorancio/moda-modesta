import { CompraServices } from "../../services/compra_services.js";
// import { RenderCompras } from "./renderCompras.js";

export async function finalizarPedidoHandler(id) {
  const confirmacion = confirm(
    "¿Estás seguro de que quieres finalizar este pedido?"
  );

  if (confirmacion) {
    try {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.finalizarPedido(id);
    } catch (error) {
      console.error(error);
    }
  }
}

export async function mensajeEnCaminoHandlerCompra(email, name, producto, id) {
  const confirmacion = confirm(
    "¿Desea enviar la alerta de que el pedido está en camino?"
  );
  if (confirmacion) {
    try {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.compraEnCamino(id);
      await compraServicesHelpers.correoEnCaminoe(email, name, producto);
      alert("Correo de notificación enviado con éxito.");
    } catch (error) {
      console.error(error);
    }
  }
}

export async function aceptarPedidoHandler(email, name, producto, id) {
  try {
    const confirmacion = confirm(
      "¿Desea aceptar este pedido y enviar mensaje de pedido en preparación?"
    );
    if (confirmacion) {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.aceptarPedido(id);
      const response = await compraServicesHelpers.compraPrepare(
        email,
        name,
        producto
      );
      console.log(response);
      alert("Correo de notificación enviado con éxito.");
    }
  } catch (error) {
    console.error("Error al aceptar el pedido o enviar el mensaje:", error);
  }
}

export async function eliminarPedido(id) {
  // Implementación para preparar pedido
  try {
    const confirmacion = confirm(
      "¿Desea eliminar esta orden? (ACCION IRREVERSIBLE)?"
    );
    if (confirmacion) {
      const compraServicesHelpers = new CompraServices();
      await compraServicesHelpers.eliminarCompra(id);
      alert("Orden eliminada con éxito.");
    }
  } catch (error) {
    console.error(error);
  }
}

//   mostrarNotificacion(mensaje) {
//     // Implementación básica para mostrar una notificación en la UI
//     const notificacion = document.createElement("div");
//     notificacion.className = "alert alert-success"; // Estilo de Bootstrap para alertas de éxito
//     notificacion.textContent = mensaje;
//     document.body.appendChild(notificacion);

//     // Remover la notificación después de 3 segundos
//     setTimeout(() => {
//       document.body.removeChild(notificacion);
//     }, 3000);
//   }
//   //   //extraer datos de Users
//   async getUsername(userId) {
//     // console.log(`getUsername id: ${userId}`);
//     const user = await this.listaServicesHelpers.getUser(userId);
//     // console.log(`getUsername: ${user}`);
//     return user.username;
//   }

//   //extraer datos de Users

//   async getRole(id) {
//     try {
//       const user = await this.listaServicesHelpers.getUser(id);
//       //console.log(`getRole: ${user}`);
//       return user.role;
//     } catch (error) {
//       console.error("Error al obtener el rol del usuario:", error);
//       throw error;
//     }
//   }

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
//             <input class="form-control mt-3 p-2" placeholder="Nombre de usuario" type="text" value="${username}" required name="newUsername">
//           </div>
//           <div class="form-group">
//             <input class="form-control mt-3 mb-3 p-2" placeholder="newPassword" type="password" required name="newPassword">
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

//         const form = document.getElementById("form");
//         const formData = new FormData(form);

//         const jsonData = {};
//         for (const [key, value] of formData.entries()) {
//           jsonData[key] = value;
//         }

//         try {
//           await this.listaServicesHelpers.updateUser(jsonData, id);
//           modalControllers.modalProductoEditado();
//         } catch (error) {
//           console.error(error);
//         }
//       });
//   }
// }
