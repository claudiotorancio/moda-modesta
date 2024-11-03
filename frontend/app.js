// Importación de estilos y módulos
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
import { ProductForm } from "./controllers/productos/productForm.js";
import { controllers } from "./controllers/productos/productos_controllers.js";
import { modalControllers } from "./modal/modal.js";
import {
  cargarReseñas,
  cargarReseñasAdmin,
} from "./controllers/reseña/reseñas.js";
import { Compras } from "./controllers/compras/compras-controllers.js";
import { hashControllers } from "./controllers/hashControllers.js";
import { ListaServices } from "./services/lista_services.js";
import { ListaControllers } from "./controllers/ListaUsuarios/lista.controllers.js";
import { FormResena } from "./controllers/reseña/formResena.js";
import { Estilos } from "./controllers/admin/Estilos.js";
import {
  loadBannerImage,
  loadBannerText,
  loadColorSettings,
  loadColorSettingsCard,
  loadLogoImage,
} from "./controllers/admin/eventBanner.js";
import { buscar } from "./controllers/buscador/buscador.js";
import { RenderStock } from "./controllers/stock/RenderStock.js";
import { ocultarProductos } from "./controllers/ocultarProductos/ocultarProductos.js";
import { SalesAnalytics } from "./controllers/analisisVentas/SalesAnalytics.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(sessionStorage.getItem("user")) || null;
  const isAdmin = await getUserRole();

  const hash = window.location.hash;

  if (hash.startsWith("#product-")) {
    await hashControllers(hash.replace("#product-", ""));
  }

  // Inicializar componentes básicos
  await initializeBanner();
  await initializeUserControls(user, isAdmin);
  await initializeEventListeners(user, isAdmin);
});

async function getUserRole() {
  if (process.env.NODE_ENV === "development") {
    const loginServicesInstance = new LoginServices();
    return await loginServicesInstance.fetchProtectedData();
  } else {
    const listaServicesInstance = new ListaServices();
    return await listaServicesInstance.getDataUser();
  }
}

async function initializeBanner() {
  loadBannerText();
  loadLogoImage();
  loadBannerImage();
  loadColorSettings();
  loadColorSettingsCard();
}

async function initializeUserControls(user, isAdmin) {
  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");

  if (user && isAdmin?.role === "admin") {
    showAdminControls();
    actualizarUsuario.innerHTML = user;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
    buscar();
    await controllers.renderProducts();
    cargarReseñasAdmin();
  } else if (user && isAdmin?.role === "user") {
    console.log(isAdmin);
    showUserControls();
    actualizarUsuario.textContent = user;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
    await controllers.renderInit();
    cargarReseñas();
  } else {
    controllers.renderInit();
    userActive.innerHTML = '<i class="fa-solid fa-user"></i>';
    cargarReseñas();
  }
}

function showAdminControls() {
  document
    .querySelectorAll(".user-only")
    .forEach((el) => (el.style.display = "block"));
  document
    .querySelectorAll(".admin-only")
    .forEach((el) => (el.style.display = "block"));
}

function showUserControls() {
  document
    .querySelectorAll(".admin-only")
    .forEach((el) => (el.style.display = "none"));
  document
    .querySelectorAll(".user-only")
    .forEach((el) => (el.style.display = "block"));
}

async function initializeEventListeners(user, isAdmin) {
  const titulo = document.querySelector("[data-titulo]");

  // Eventos para roles de usuario
  if (user && isAdmin?.role === "admin") {
    setupAdminEventListeners(titulo);
  }

  // Eventos comunes
  document.querySelector("[data-init]").addEventListener("click", (e) => {
    modalControllers.modalSuscribe();
  });

  document.querySelector("[data-log]").addEventListener("click", (e) => {
    e.preventDefault();
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  });

  document.querySelector("[data-logOut]").addEventListener("click", (e) => {
    e.preventDefault();
    const loginServicesInstance = new LoginServices();
    loginServicesInstance.logout();
  });
}

function setupAdminEventListeners(titulo) {
  document.querySelector("[data-pedidos]").addEventListener("click", (e) => {
    e.preventDefault();
    ocultarProductos();
    const comprasInstance = new Compras(titulo);
    comprasInstance.renderLista();
  });

  document
    .querySelector("[data-crearProductos]")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const productForm = new ProductForm(titulo);
      await productForm.render();
    });

  document.querySelector("[data-resenas]").addEventListener("click", (e) => {
    e.preventDefault();
    ocultarProductos();
    const formResena = new FormResena(titulo);
    formResena.render();
  });

  document
    .querySelector("[data-estilosDiseno]")
    .addEventListener("click", (e) => {
      e.preventDefault();
      const estilosInstance = new Estilos(titulo);
      estilosInstance.render();
    });

  document
    .querySelector("[data-stock]")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      ocultarProductos();
      const stockInstance = new RenderStock(titulo);
      await stockInstance.render();
    });

  document
    .querySelector("[data-suscriptores]")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      ocultarProductos();
      const listaControllersInstance = new ListaControllers(titulo);
      await listaControllersInstance.renderLista();
    });

  document
    .querySelector("[data-ventas]")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      ocultarProductos();
      const salesAnalyticsInstance = new SalesAnalytics(titulo);
      await salesAnalyticsInstance.fetchSalesByPeriod();
    });
}
