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
import { ListaControllers } from "./controllers/ListaUsuarios/lista.controllers.js";
import { Compras } from "./controllers/compras/compras-controllers.js";
import { ProductForm } from "./controllers/productos/productForm.js";
import { cargarReseñas } from "./controllers/reseña/reseñas.js";
import { initializeCategoryControls } from "./controllers/productos/categoryControls.js";
import { ListaServices } from "./services/lista_services.js";
import { hashControllers } from "./controllers/hashControllers.js";
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

document.addEventListener("DOMContentLoaded", async () => {
  const hash = window.location.hash;
  if (hash.startsWith("#product-")) {
    await hashControllers();
  }

  loadBannerText();
  loadLogoImage();
  loadBannerImage();
  loadColorSettings();
  loadColorSettingsCard();

  // const contactUser = document.querySelector("[data-contact]");
  const resenas = document.querySelector("[data-resenas]");
  const ventas = document.querySelector("[data-ventas]");
  const estilosDiseno = document.querySelector("[data-estilosDiseno]");
  const susxriptores = document.querySelector("[data-suscriptores]");
  const listaStock = document.querySelector("[data-stock]");

  const titulo = document.querySelector("[data-titulo]");

  initializeCategoryControls();
  const listaServicesInstance = new ListaServices();
  const isAdmin = await listaServicesInstance.getDataUser();
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
    const envio = document.querySelector("[data-pedidos]");
    envio.addEventListener("click", (e) => {
      e.preventDefault();
      ocultarProductos();
      const comprasInstance = new Compras(titulo);
      comprasInstance.renderLista();
    });

    const crearProducto = document.querySelector("[data-crearProductos]");
    crearProducto.addEventListener("click", async (e) => {
      e.preventDefault();
      const productForm = new ProductForm(titulo);
      await productForm.render();
    });

    resenas.addEventListener("click", (e) => {
      e.preventDefault();
      ocultarProductos();
      const formResena = new FormResena(titulo);
      formResena.render();
    });

    estilosDiseno.addEventListener("click", (e) => {
      e.preventDefault();
      const estilosInstance = new Estilos(titulo);
      estilosInstance.render();
    });

    listaStock.addEventListener("click", async (e) => {
      e.preventDefault();
      ocultarProductos();
      const stockInstance = new RenderStock(titulo);
      await stockInstance.render();
    });

    susxriptores.addEventListener("click", async (e) => {
      e.preventDefault();
      ocultarProductos();
      const ListaControllersInstamce = new ListaControllers(titulo);
      await ListaControllersInstamce.renderLista();
    });

    ventas.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Seccion en Construccion");
    });
    buscar();
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
