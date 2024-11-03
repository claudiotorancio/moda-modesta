import "./styles/assets/css/base/reset.css";
import "./styles/assets/css/base/base.css";
import "./styles/assets/css/base/variables.css";
import "./styles/assets/css/style.css";
import "./styles/assets/css/productos.css";
import "./styles/assets/css/components/inputs.css";
import "./styles/assets/css/components/modal.css";
import "./styles/assets/css/table.css";

import { LoginServices } from "./services/login_services.js";
import { LoginControllers } from "./controllers/registro/login_controllers.js";
import { ListaServices } from "./services/lista_services.js";
import { RenderProfile } from "./profile/RenderProfile.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener rol del usuario y datos
  const isAdmin = await obtenerRolUsuario();
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  // Elementos del DOM para manipulación de interfaz de usuario
  const infoPersonal = document.getElementById("info-personal");
  const pedidosRecientes = document.getElementById("pedidos-recientes");

  const renderProfileInstance = new RenderProfile(
    infoPersonal,
    pedidosRecientes
  );

  // Configurar la interfaz del usuario según autenticación y permisos
  configurarInterfazUsuario(user, isAdmin, renderProfileInstance);

  // Configuración de eventos de inicio y cierre de sesión
  configurarEventosGlobales();
});

// Función para obtener el rol del usuario según el entorno
async function obtenerRolUsuario() {
  if (process.env.NODE_ENV === "development") {
    const loginServicesInstance = new LoginServices();
    return await loginServicesInstance.fetchProtectedData();
  } else {
    const listaServicesInstance = new ListaServices();
    return await listaServicesInstance.getDataUser();
  }
}

// Configura la interfaz de usuario según autenticación y rol
function configurarInterfazUsuario(user, isAdmin, renderProfileInstance) {
  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");

  if (user) {
    if (isAdmin) {
      document
        .querySelectorAll(".admin-only")
        .forEach((el) => (el.style.display = "block"));
    }
    renderProfileInstance.render();
    actualizarUsuario.textContent = `${user}`;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
  } else {
    userActive.innerHTML = '<i class="fa-solid fa-user"></i>';
  }
}

// Configura eventos globales para login y logout
function configurarEventosGlobales() {
  const login = document.querySelector("[data-log]");
  login.addEventListener("click", (e) => {
    e.preventDefault();
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  });

  const logOut = document.querySelector("[data-logOut]");
  logOut.addEventListener("click", (e) => {
    e.preventDefault();
    const loginServicesInstance = new LoginServices();
    loginServicesInstance.logout();
  });
}
