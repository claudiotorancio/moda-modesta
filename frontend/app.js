import "./styles/assets/css/base/reset.css";
import "./styles/assets/css/base/base.css";

import "./styles/assets/css/base/variables.css";
import "./styles/assets/css/style.css";
import "./styles/assets/css/productos.css";
import "./styles/assets/css/components/inputs.css";
import "./styles/assets/css/components/header.css";
import "./styles/assets/css/components/button.css";
import "./styles/assets/css/components/modal.css";

import { LoginServices } from "./services/login_services.js";
import { LoginControllers } from "./controllers/registro/login_controllers.js";
import { productosInicio } from "./controllers/productos/ProductInit.js";
import productForm from "./controllers/productos/productForm.js";
import { controllers } from "./controllers/productos/productos_controllers.js";
import { modalControllers } from "./modal/modal.js";
import { cargarReseñas } from "./controllers/productos/reseñas.js";
import { Compras } from "./controllers/compras/compras-controllers.js";
import { hashControllers } from "./controllers/hashControllers.js";
import { initializeCategoryControls } from "./controllers/productos/categoryControls.js";
import { ListaServices } from "./services/lista_services.js";
import { ListaControllers } from "./controllers/ListaUsuarios/lista.controllers.js";

document.addEventListener("DOMContentLoaded", async () => {
  const hash = window.location.hash;
  if (hash.startsWith("#product-")) {
    await hashControllers();
  }
  initializeCategoryControls();

  cargarReseñas();

  const listaServicesInstance = new ListaServices();
  const isAdmin = await listaServicesInstance.getAdmin();
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  const divUsuario = document.querySelector(".rounded-circle");
  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");
  const contactUser = document.querySelector("[data-contact]");
  // const crearProductos = document.querySelector("[data-crearProductos]");
  // const pedidos = document.querySelector("[data-pedidos]");
  // const resenas = document.querySelector("[data-resenas]");
  // const suscriptores = document.querySelector("[data-suscriptores]");
  // const ventas = document.querySelector("[data-ventas]");
  const tabla = document.querySelector("[data-lista]");
  const titulo = document.querySelector("[data-titulo]");

  // Mostrar u ocultar elementos según si hay un usuario autenticado y es admin
  if (user && isAdmin) {
    document.querySelectorAll(".admin-only").forEach((el) => {
      el.style.display = "block";
    });

    const envio = document.querySelector("[data-pedidos]");
    envio.addEventListener("click", (e) => {
      e.preventDefault();
      const comprasInstance = new Compras(tabla, titulo);
      comprasInstance.renderLista();
    });

    const crearProducto = document.querySelector("[data-crearProductos]");
    crearProducto.addEventListener("click", (e) => {
      e.preventDefault();
      productForm.render();
    });

    const listaResena = document.querySelector("[data-resenas]");
    listaResena.addEventListener("click", (e) => {
      e.preventDefault();
    });

    const susxriptores = document.querySelector("[data-suscriptores]");
    susxriptores.addEventListener("click", async (e) => {
      e.preventDefault();
      const ListaControllersInstamce = new ListaControllers(tabla, titulo);
      await ListaControllersInstamce.renderLista();
    });

    controllers.renderProducts();
    actualizarUsuario.textContent = `${user}`;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
    contactUser.style.display = "none";
  } else {
    productosInicio.renderInit();
    // crearProductos.style.display = "none";
    // pedidos.style.display = "none";
    // resenas.style.display = "none";
    // suscriptores.style.display = "none";
    // ventas.style.display = "none";
    divUsuario.style.display = "none";
    actualizarUsuario.style.display = "none";
    logoutUsuario.style.display = "none";
    userActive.innerHTML = '<i class="fa-solid fa-user"></i>';
  }

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
