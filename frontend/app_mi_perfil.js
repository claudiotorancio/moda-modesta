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
import { ListaServices } from "./services/lista_services.js";
import { RenderProfile } from "./profile/RenderProfile.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listaServicesInstance = new ListaServices();
  const isAdmin = await listaServicesInstance.getDataUser();
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");

  const infoPersonal = document.getElementById("info-personal");
  const pedidosRecientes = document.getElementById("pedidos-recientes");

  const renderProfileInstance = new RenderProfile(
    infoPersonal,
    pedidosRecientes
  );

  // Mostrar u ocultar elementos según si hay un usuario autenticado y es admin
  if (user && isAdmin) {
    document.querySelectorAll(".admin-only").forEach((el) => {
      el.style.display = "block";
    });

    renderProfileInstance.render();

    actualizarUsuario.textContent = `${user}`;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
  }

  userActive.innerHTML = '<i class="fa-solid fa-user"></i>';

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
