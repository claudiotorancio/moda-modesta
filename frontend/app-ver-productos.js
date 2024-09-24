import "./styles/assets/css/base/reset.css";
import "./styles/assets/css/base/base.css";
import "./styles/assets/css/base/variables.css";
import "./styles/assets/css/style.css";
import "./styles/assets/css/productos.css";
import "./styles/assets/css/components/inputs.css";
import "./styles/assets/css/components/header.css";
import "./styles/assets/css/components/button.css";
import "./styles/assets/css/components/modal.css";
import "./styles/assets/css/table.css";

import { LoginServices } from "./services/login_services.js";
import { LoginControllers } from "./controllers/registro/login_controllers.js";
import { modalControllers } from "./modal/modal.js";
import { cargarReseñas } from "./controllers/reseña/reseñas.js";
import { initializeCategoryControls } from "./controllers/productos/categoryControls.js";
import { ListaServices } from "./services/lista_services.js";
import { hashControllers } from "./controllers/hashControllers.js";

document.addEventListener("DOMContentLoaded", async () => {
  const hash = window.location.hash;
  if (hash.startsWith("#product-")) {
    await hashControllers();
  }

  initializeCategoryControls();
  const listaServicesInstance = new ListaServices();
  const isAdmin = await listaServicesInstance.getAdmin();
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");

  // Mostrar u ocultar elementos según si hay un usuario autenticado y es admin
  if (user && isAdmin) {
    document.querySelectorAll(".admin-only").forEach((el) => {
      el.style.display = "block";
    });

    actualizarUsuario.textContent = `${user}`;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
  }

  cargarReseñas();
  userActive.innerHTML = '<i class="fa-solid fa-user"></i>';

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
});
