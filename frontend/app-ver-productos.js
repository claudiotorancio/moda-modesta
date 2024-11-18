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
import { modalControllers } from "./modal/modal.js";
import { cargarReseñas } from "./controllers/reseña/reseñas.js";
import { initializeCategoryControls } from "./controllers/productos/categoryControls.js";
import { ListaServices } from "./services/lista_services.js";
import { hashControllers } from "./hashControllers/hashControllers.js";
import { initializeCategoryControlsAdmin } from "./controllers/productoControl/categoryControlsAdmin.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Cargar producto según el hash si está presente
  const hash = window.location.hash;
  if (hash.startsWith("#product-")) {
    await hashControllers();
  }

  // Determinar rol del usuario
  const isAdmin = await obtenerRolUsuario();
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  // Configurar la interfaz de usuario según rol y autenticación
  configurarInterfazUsuario(user, isAdmin);

  // Cargar reseñas y otros elementos de la interfaz
  cargarReseñas();

  // Configurar eventos de inicio de sesión y suscripción
  configurarEventosGlobales();
});

// Función para obtener el rol del usuario
async function obtenerRolUsuario() {
  if (process.env.NODE_ENV === "development") {
    const loginServicesInstance = new LoginServices();
    return await loginServicesInstance.fetchProtectedData();
  } else {
    const listaServicesInstance = new ListaServices();
    return await listaServicesInstance.getDataUser();
  }
}

// Configura la interfaz según el rol y la autenticación
function configurarInterfazUsuario(user, isAdmin) {
  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");

  if (user) {
    if (isAdmin.role === "admin") {
      mostrarElementos(".admin-only", "block");
      initializeCategoryControlsAdmin();
    } else {
      mostrarElementos(".admin-only", "block");
      initializeCategoryControls();
    }
    actualizarUsuario.textContent = `${user}`;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
  } else {
    initializeCategoryControls();
    userActive.innerHTML = '<i class="fa-solid fa-user"></i>';
  }
}

// Muestra u oculta elementos según el selector y el estilo de display
function mostrarElementos(selector, displayStyle) {
  document.querySelectorAll(selector).forEach((el) => {
    el.style.display = displayStyle;
  });
}

// Configura eventos globales de inicio de sesión y suscripción
function configurarEventosGlobales() {
  const initButton = document.querySelector("[data-init]");
  initButton.addEventListener("click", (e) => {
    modalControllers.modalSuscribe();
  });

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
