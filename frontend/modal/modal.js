import { LoginControllers } from "../controllers/registro/login_controllers.js";
import mailServices from "../services/mail_services.js";
import productoServices from "../services/product_services.js";

const baseModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  const modalClose = document.querySelector(".modal-close");
  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
};

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
  botonEliminar.addEventListener("click", () => {
    productoServices.eliminarProducto(id);
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
      <div class="card-body">
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
const menu = document.querySelector("#menu-mobile div:nth-child(1)");

container.addEventListener("click", (e) => {
  container.classList.toggle("active");
  menu.classList.toggle("open");
});

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
};
