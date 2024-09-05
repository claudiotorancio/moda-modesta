import { ListaServices } from "../../services/lista_services.js";
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
      // // Obtener el contenido actual del editor antes de la renderización
      // const contenidoEditor = tinymce.activeEditor
      //   ? tinymce.activeEditor.getContent()
      //   : "";

      // Limpiar el contenedor antes de renderizar
      this.titulo.innerHTML = "";
      this.tabla.innerHTML = "";

      const { listado, usersCantidad } =
        await this.listaServicesHelpers.listaUsers();

      const tituloTabla = `
        <div class="row">
          <div class="col-md-12">
            <h2 class="card-header text-center">SUSCRIPTORES</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Suscriptor(${usersCantidad})</th>
                  <th>Creado</th>
                  <th>Email Verificado</th>
                  <th>Rol</th>
                  <th>Eliminar</th>
                  <th>Actualizar</th>
                </tr>
              </thead>
              <tbody id="tabla-cuerpo">
                <!-- Aquí se agregará el cuerpo de la tabla -->
              </tbody>
            </table>
            <button type="button" class="btn btn-success" id="enviar-promociones">Enviar Promociones</button>
            <div class="form-group mt-3">
              <textarea class="form-control" id="contenido-promocion" rows="20" placeholder="Escribe tu promoción aquí...">${contenidoEditor}</textarea>
            </div>
          </div>
        </div>
      `;
      this.titulo.innerHTML = tituloTabla;

      const tablaCuerpo = this.titulo.querySelector("#tabla-cuerpo");

      for (const usuario of listado) {
        const usuarioData = {
          username: usuario.username,
          created_at: usuario.created_at,
          emailVerified: usuario.emailVerified,
          role: usuario.role,
          id: usuario._id,
        };
        tablaCuerpo.appendChild(this.nuevaLista(usuarioData));
      }

      // tinymce.init({
      //   selector: "#contenido-promocion",
      //   plugins: [
      //     "anchor",
      //     "autolink",
      //     "charmap",
      //     "codesample",
      //     "emoticons",
      //     "image",
      //     "link",
      //     "lists",
      //     "media",
      //     "searchreplace",
      //     "table",
      //     "visualblocks",
      //     "wordcount",
      //     "checklist",
      //     "mediaembed",
      //     "casechange",
      //     "export",
      //     "formatpainter",
      //     "pageembed",
      //     "a11ychecker",
      //     "tinymcespellchecker",
      //     "permanentpen",
      //     "powerpaste",
      //     "advtable",
      //     "advcode",
      //     "editimage",
      //     "advtemplate",
      //     "ai",
      //     "mentions",
      //     "tinycomments",
      //     "tableofcontents",
      //     "footnotes",
      //     "mergetags",
      //     "autocorrect",
      //     "typography",
      //     "inlinecss",
      //     "markdown",
      //   ],
      //   toolbar:
      //     "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
      //   tinycomments_mode: "embedded",
      //   tinycomments_author: "Author name",
      //   mergetags_list: [
      //     { value: "First.Name", title: "First Name" },
      //     { value: "Email", title: "Email" },
      //   ],
      //   ai_request: (request, respondWith) =>
      //     respondWith.string(() =>
      //       Promise.reject("See docs to implement AI Assistant")
      //     ),
      // });

      // // Volver a establecer el contenido del editor después de la renderización
      // if (tinymce.activeEditor) {
      //   tinymce.activeEditor.setContent(contenidoEditor);
      // }

      // Agregar event listener al botón de enviar promociones
      document
        .getElementById("enviar-promociones")
        .addEventListener("click", () => {
          // Confirmar la acción del usuario
          const confirmation = confirm(
            "Está a punto de enviar este contenido a todos los suscriptores. ¿Desea continuar?"
          );

          if (confirmation) {
            // Obtener el contenido del textarea
            const textarea = document.getElementById("contenido-promocion");
            const myContent = textarea.value;

            // Verificar que se ha capturado contenido
            if (myContent.trim() === "") {
              alert("El contenido de la promoción no puede estar vacío.");
              return;
            }

            // Llamar a la función `enviarPromociones` con el contenido
            this.buttonHandler.enviarPromociones(myContent);

            // Volver a renderizar la lista de usuarios (opcional)
            this.renderUsersList();
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  nuevaLista({ username, created_at, role, emailVerified, id }) {
    const fechaCreacion = new Date(created_at);
    const fechaFormateada = `${fechaCreacion
      .getFullYear()
      .toString()
      .slice(-2)}-${("0" + (fechaCreacion.getMonth() + 1)).slice(-2)}-${(
      "0" + fechaCreacion.getDate()
    ).slice(-2)}`;

    const verificacionEmail = emailVerified ? "Sí" : "No";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${username}</td>
      <td>${fechaFormateada}</td>
      <td>${verificacionEmail}</td>
      <td>${role}</td>
      <td><button type="button" class="btn btn-danger" data-userid="${id}">Eliminar</button></td>
      <td><button type="button" class="btn btn-primary" data-userUp="${id}">Actualizar</button></td>
    `;

    row
      .querySelector("[data-userid]")
      .addEventListener("click", (event) =>
        this.buttonHandler.deleteButtonHandler(event)
      );
    row
      .querySelector("[data-userUp]")
      .addEventListener("click", (event) =>
        this.buttonHandler.updateButtonHandler(event)
      );

    return row;
  }
}
