// Importar estilos y módulos necesarios
import "./styles/assets/css/style.css";
import "./styles/assets/css/productos.css";
import { LoginServices } from "./services/login_services.js";
import { LoginControllers } from "./controllers/login_controllers.js";
import { ListaControllers } from "./controllers/lista.controllers.js";
import { productosInicio } from "./controllers/controllers_inicio.js";
import productForm from "./controllers/productForm.js";
import { controllers } from "./controllers/productos_controllers.js";

// Función principal que se ejecuta cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  // Obtener usuario autenticado de la sesión
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  // Elementos del DOM
  const divUsuario = document.querySelector(".rounded-circle");
  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");
  const contactUser = document.querySelector("[data-contact]");
  const crearproducto = document.querySelector("[data-init]");

  // Mostrar u ocultar elementos según si hay un usuario autenticado
  if (user) {
    controllers.renderProducts();
    const tabla = document.querySelector("[data-lista]");
    const titulo = document.querySelector("[data-titulo]");
    const listaControllersInstance = new ListaControllers(tabla, titulo);
    listaControllersInstance.renderLista();
    actualizarUsuario.textContent = `${user}`;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
    contactUser.style.display = "none";
  } else {
    productosInicio.renderInit()
    divUsuario.style.display = "none";
    actualizarUsuario.style.display = "none";
    logoutUsuario.style.display = "none";
    userActive.innerHTML = '<i class="fa-solid fa-user"></i>';
    crearproducto.innerHTML = 'Registrarse'
  }

  // Evento para crear un producto
  if(user){ crearproducto.addEventListener("click", () => {
    productForm.render();
  });}else {
   
    document.querySelector("[data-init]").addEventListener("click", (e) => {
        e.preventDefault();
        const loginControllersInstance = new LoginControllers();
        loginControllersInstance.renderSignin();

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
