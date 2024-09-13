import { LoginControllers } from "../controllers/registro/login_controllers.js";
import mailServices from "../services/mail_services.js";
import productoServices from "../services/product_services.js";

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

const modalEliminar = (id) => {
  baseModal();
  const modal = document.getElementById("modal");
  const eliminarProducto = modal.querySelector("[data-table]");
  eliminarProducto.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>Desea eliminar el Producto?</h4> 
            <button class="boton-eliminar btn btn-danger" data-index="${id}">Eliminar</button>
        </div>
    </div>
    </div>
    </div>
    `;
  eliminarProducto.classList.add("modalVisor");
  const botonEliminar = eliminarProducto.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", async () => {
    await productoServices.eliminarProducto(id);
    window.location.replace("/index.html");
  });

  /*setTimeout(() => {
        window.location.href= '/index.html';
       }, 2000);*/
};

const modalSuccessSignIn = (username) => {
  baseModal();
  const modal = document.getElementById("modal");
  const success = modal.querySelector("[data-table]");
  success.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>Bienvenido! ${username}</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Ir a inicio</button>
        </div>
    </div>
    </div>
    </div>
    `;
  success.classList.add("open");

  const botonEliminar = success.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    window.location.replace("/index.html");
  });
  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

const modalProductoCreado = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const success = modal.querySelector("[data-table]");
  success.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>producto creado correctamente!</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Volver</button>
        </div>
    </div>
    </div>
    </div>
    `;

  success.classList.add("modalVisor");

  const botonEliminar = success.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    window.location.replace("/index.html");
  });
  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

const modalProductoEditado = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const success = modal.querySelector("[data-table]");
  success.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>producto editado!</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Volver</button>
        </div>
    </div>
    </div>
    </div>
    `;

  success.classList.add("modalVisor");

  const botonEliminar = success.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    window.location.replace("/index.html");
  });
  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

const modalErrorSignIn = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const incorrect = modal.querySelector("[data-table]");
  incorrect.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div >
            <br>
            <h4>Usuario o contraseña incorrectos</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Volver</button>
        </div>
    </div>
    </div>
    </div>
    `;

  incorrect.classList.add("modalVisor");

  const botonEliminar = incorrect.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  });
  setTimeout(() => {
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  }, 2000);
};

const modalSuccessSignup = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const successSignup = modal.querySelector("[data-table]");
  successSignup.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div >
            <br>
            <h4>Datos guardados!</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Iniciar Sesion</button>
        </div>
    </div>
    </div>
    </div>
    `;

  successSignup.classList.add("modalVisor");

  const botonEliminar = successSignup.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  });
  setTimeout(() => {
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  }, 3000);
};

const modalErrorSignup = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const errorSignup = modal.querySelector("[data-table]");
  errorSignup.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>Nombre de usuario existente</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Volver a intentar</button>
        </div>
    </div>
    </div>
    </div>
    `;

  errorSignup.classList.add("modalVisor");

  const botonEliminar = errorSignup.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignup();
  });

  setTimeout(() => {
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignup();
  }, 2000);
};

const modalErrorRegistro = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const errorSignup = modal.querySelector("[data-table]");
  errorSignup.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div >
            <br>
            <h4>Debe registarse para comenzar!</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">SignIn</button>
        </div>
    </div>
    </div>
    </div>
    `;

  errorSignup.classList.add("modalVisor");

  const botonEliminar = errorSignup.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  });

  setTimeout(() => {
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  }, 2000);
};

const modalLogout = (user) => {
  baseModal();
  const modal = document.getElementById("modal");
  const errorSignup = modal.querySelector("[data-table]");
  errorSignup.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div >
            <br>
            <h4>Velve Pronto ${user}!!</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Ok</button>
        </div>
    </div>
    </div>
    </div>
    `;

  errorSignup.classList.add("modalVisor");

  const botonEliminar = errorSignup.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    modal.style.display = "none";
    window.location.replace("/index.html");
  });

  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

const modalErrConexion = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const incorrect = modal.querySelector("[data-table]");
  incorrect.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>Error de conexion</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Volver</button>
        </div>
    </div>
    </div>
    </div>
    `;

  incorrect.classList.add("modalVisor");

  const botonEliminar = success.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    window.location.replace("/index.html");
  });
  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

const modalSuscribe = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const suscribe = modal.querySelector("[data-table]");
  suscribe.innerHTML = `
   <div class="container main-container">
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

    // Validar que los campos no estén vacíos
    if (!email || !nombre) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Aquí puedes enviar los datos del formulario a tu servidor
    try {
      await mailServices.mailContact(datos);
    } catch (error) {
      console.error("Error al suscribirse:", error);
      alert(
        "Hubo un problema al procesar la suscripción. Por favor, intente nuevamente."
      );
    }
  });
};

const modalCorreoEnviado = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const success = modal.querySelector("[data-table]");
  success.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>Correo enviado</h4> 
            <div>
            <button class="boton-eliminar btn btn-primary" data-index="">Volver</button>
            </div>
            <em style="font-size: 10pt; font-family: Arial, sans-serif; font-style: italic; background-color: transparent; vertical-align: baseline;">Verifica tu casila de email porfavor.</em>
        </div>
    </div>
    </div>
    </div>
    `;

  success.classList.add("modalVisor");

  const botonEliminar = success.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    window.location.replace("/index.html");
  });
  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

const modalCompraOk = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const success = modal.querySelector("[data-table]");
  success.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>Correo enviado</h4> 
            <div>
            <button class="boton-eliminar btn btn-primary" data-index="">Volver</button>
            </div>
            <em style="font-size: 10pt; font-family: Arial, sans-serif; font-style: italic; background-color: transparent; vertical-align: baseline;">En breve recibiras un correo con toda la info<em>
        </div>
    </div>
    </div>
    </div>
    `;

  success.classList.add("modalVisor");

  const botonEliminar = success.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    window.location.replace("/index.html");
  });
  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

const modalCorreoNoenviado = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const success = modal.querySelector("[data-table]");
  success.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4>Error al envar el correo</h4> 
           <div>
            <button class="boton-eliminar btn btn-primary" data-index="">Reintentar</button>
            </div>
        </div>
    </div>
    </div>
    </div>
    `;

  success.classList.add("modalVisor");

  const botonEliminar = success.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    window.location.replace("/index.html");
  });
  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

const container = document.querySelector("#menu-mobile");
const menu = document.querySelector(".main-menu");
const checkBox = document.querySelector("#check");

document.addEventListener("click", (e) => {
  if (!container.contains(e.target) && checkBox.checked) {
    checkBox.checked = false; // Desmarca el checkbox para cerrar el menú
  }
});

const modalCarritoVacio = () => {
  baseModal();
  const modal = document.getElementById("modal");
  const success = modal.querySelector("[data-table]");
  success.innerHTML = `
    <div class="text-center">
    <div class="card-header">
    <div>
        <div>
            <br>
            <h4Tu carrito está vacío</h4> 
            <button class="boton-eliminar btn btn-primary" data-index="">Ir a inicio</button>
        </div>
    </div>
    </div>
    </div>
    `;
  success.classList.add("open");

  const botonEliminar = success.querySelector(".boton-eliminar");
  botonEliminar.addEventListener("click", () => {
    window.location.replace("/index.html");
  });
  setTimeout(() => {
    window.location.replace("/index.html");
  }, 3000);
};

export const modalControllers = {
  modalEliminar,
  baseModal,
  modalSuccessSignIn,
  modalErrorSignIn,
  modalSuccessSignup,
  modalErrorSignup,
  modalLogout,
  modalProductoCreado,
  modalErrorRegistro,
  modalProductoEditado,
  modalErrConexion,
  modalSuscribe,
  modalCorreoEnviado,
  modalCorreoNoenviado,
  modalCompraOk,
  modalCarritoVacio,
};
