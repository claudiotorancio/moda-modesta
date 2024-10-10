import mailServices from "../services/mail_services.js";

const baseModal = async () => {
  const modal = document.getElementById("modal");

  // Ejemplo de operación asíncrona antes de mostrar el modal
  try {
    // Supongamos que estás cargando datos de una API o realizando alguna tarea asíncrona
    await fetchData(); // Ejemplo de función asíncrona

    modal.style.display = "block";

    // Añadir un nuevo estado al historial cuando se abre el modal
    window.history.pushState({ modalOpen: true }, "");

    const modalClose = document.querySelector(".modal-close");

    // Función para cerrar el modal sin afectar el historial
    const closeModal = () => {
      modal.style.display = "none";
    };

    // Escuchar el evento de clic en el botón de cierre
    modalClose.addEventListener("click", () => {
      closeModal();
      // window.history.back(); // Solo retrocede en el historial al cerrar con el botón
    });

    // Cerrar el modal si se hace clic fuera del contenido del modal
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(); // Cierra el modal, pero no afecta el historial
      }
    });

    // Escuchar el evento 'popstate' para cerrar el modal si se presiona "Atrás"
    window.addEventListener("popstate", (event) => {
      if (modal.style.display === "block") {
        closeModal(); // Cierra el modal sin modificar el historial
      }
    });
  } catch (error) {
    console.error("Error al abrir el modal:", error);
  }
};

// Ejemplo de función asíncrona que podrías usar en baseModal
async function fetchData() {
  // Simulación de una operación asíncrona, como una llamada a una API
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Datos cargados");
      resolve();
    }, 1000);
  });
}

const showModal = async (
  title,
  message,
  buttonText,
  buttonAction,
  autoClose = null, // Tiempo para cierre automático
  redirectUrl = null // URL para redirección opcional
) => {
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector("[data-table]");

  modalContent.innerHTML = `
    <div class="text-center">
      <div class="card-header">
        <div>
          <br>
          <h4>${title}</h4> 
          <p>${message}</p>
          <button class="modal-button btn btn-primary">${buttonText}</button>
        </div>
      </div>
    </div>
  `;
  modal.style.display = "block";

  const modalButton = modalContent.querySelector(".modal-button");
  modalButton.addEventListener("click", () => {
    buttonAction(); // Ejecuta la acción pasada como parámetro
    closeModal(); // Cierra el modal
  });

  // Define la función para cerrar el modal
  const closeModal = () => {
    modal.style.display = "none";
  };

  // Si autoClose está definido, cierra el modal y maneja la redirección opcional
  if (autoClose) {
    setTimeout(() => {
      closeModal();
      if (redirectUrl) {
        window.location.replace(redirectUrl); // Redirige si hay una URL
      }
    }, autoClose);
  }
};

const modalSuscribe = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const suscribe = modal.querySelector("[data-table]");
  suscribe.innerHTML = `
   <div class="main-container">
    <div class="text-center">
      <div class="card-header">
        <h4>¡Ofertas y Novedades!</h4>
      </div>
      <div class="card-form">
        <p>¡Suscribite para no perderte las novedades y recibir descuentos exclusivos!</p>
        <form id="subscribe-form" action="/api/suscribeMail" enctype="multipart/form-data" method="POST">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" class="form-control" required>
          </div>
          <div class="form-group mb-4">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Suscribirme</button>
        </form>
        <em style="font-size: 10pt; font-family: Arial, sans-serif; font-style: italic; background-color: transparent; vertical-align: baseline;">Recibirás un correo para validar tu email.</em>
      </div>
    </div>
    </div>
  `;

  const subscribeForm = suscribe.querySelector("#subscribe-form");
  subscribeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    const email = document.querySelector("#email").value;
    const nombre = document.querySelector("#nombre").value;

    const datos = {
      email,
      nombre,
    };
    // Aquí puedes enviar los datos del formulario a tu servidor
    try {
      await mailServices.mailContact(datos);
    } catch (error) {
      console.error("Error al suscribirse:", error);
    }
  });
};

const modalMsg = (message) => {
  showModal(
    "Mensaje: ",
    message,
    "Cerrar",

    () => {
      null;
    },
    null
  );
};

const modalMsgReload = (message) => {
  showModal(
    message,
    "",
    "Volver",

    () => {
      window.location.replace("/index.html");
    },
    10000,
    "/index.html"
  );
};

export const modalControllers = {
  modalMsgReload,
  baseModal,
  modalSuscribe,
  modalMsg,
};
