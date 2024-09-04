// Importar estilos y módulos necesarios
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
// import { ListaControllers } from "./controllers/ListaUsuarios/lista.controllers.js";
import { productosInicio } from "./controllers/productos/ProductInit.js";
// import { mostrarProducto } from "./controllers/productos/ProductViewer.js";
import productForm from "./controllers/productos/productForm.js";
import { controllers } from "./controllers/productos/productos_controllers.js";
// import productoServices from "./services/product_services.js";
import { modalControllers } from "./modal/modal.js";
import { cargarReseñas } from "./controllers/productos/reseñas.js";
import { Compras } from "./controllers/compras/compras-controllers.js";
import { hashControllers } from "./controllers/hashControllers.js";
import { initializeCategoryControls } from "./controllers/productos/categoryControls.js";

// Función principal que se ejecuta cuando el DOM está listo
document.addEventListener("DOMContentLoaded", async () => {
  // Llama a la función de inicialización con la opción correspondiente
  initializeCategoryControls();

  const hash = window.location.hash;
  if (hash.startsWith("#product-")) {
    await hashControllers();
  }

  cargarReseñas();
  // modalControllers.modalSuscribe();
  // Obtener usuario autenticado de la sesión
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  // Elementos del DOM
  const divUsuario = document.querySelector(".rounded-circle");
  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");
  const contactUser = document.querySelector("[data-contact]");
  const crearproducto = document.querySelector("[data-init]");
  const pedidos = document.querySelector("[data-pedidos]");
  const resenas = document.querySelector("[data-resenas]");
  const suscriptores = document.querySelector("[data-suscriptores]");
  const ventas = document.querySelector("[data-ventas]");

  const tabla = document.querySelector("[data-lista]");
  const titulo = document.querySelector("[data-titulo]");

  // Mostrar u ocultar elementos según si hay un usuario autenticado
  if (user) {
    //Evento para consultar pedidos
    const envio = document.querySelector("[data-pedidos]");
    envio.addEventListener("click", (e) => {
      e.preventDefault();
      const comprasInstance = new Compras(tabla, titulo);
      comprasInstance.renderLista();
    });

    controllers.renderProducts();
    // const listaControllersInstance = new ListaControllers(tabla, titulo)
    // listaControllersInstance.renderLista();

    actualizarUsuario.textContent = `${user}`;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
    contactUser.style.display = "none";
  } else {
    productosInicio.renderInit();
    pedidos.style.display = "none";
    resenas.style.display = "none";
    suscriptores.style.display = "none";
    ventas.style.display = "none";
    divUsuario.style.display = "none";
    actualizarUsuario.style.display = "none";
    logoutUsuario.style.display = "none";
    userActive.innerHTML = '<i class="fa-solid fa-user"></i>';
    crearproducto.innerHTML = "Suscribite!";
  }

  // Evento para crear un producto
  if (user) {
    document.querySelector("[data-init]").addEventListener("click", (e) => {
      productForm.render();
    });
  } else {
    document.querySelector("[data-init]").addEventListener("click", (e) => {
      e.preventDefault();
      modalControllers.modalSuscribe();
    });
  }

  // Evento para iniciar sesión
  const login = document.querySelector("[data-log]");
  login.addEventListener("click", (e) => {
    e.preventDefault();
    const loginControllersInstance = new LoginControllers();
    loginControllersInstance.renderSignin();
  });

  // Evento para cerrar sesión
  const logOut = document.querySelector("[data-logOut]");
  logOut.addEventListener("click", (e) => {
    e.preventDefault();
    const loginServicesInstance = new LoginServices();
    loginServicesInstance.logout();
  });
});
