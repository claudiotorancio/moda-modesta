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
import { ProductForm } from "./controllers/productos/productForm.js";
import { controllers } from "./controllers/productos/productos_controllers.js";
import { modalControllers } from "./modal/modal.js";
import {
  cargarReseñas,
  cargarReseñasAdmin,
} from "./controllers/reseña/reseñas.js";
import { Compras } from "./controllers/compras/compras-controllers.js";
import { hashControllers } from "./controllers/hashControllers.js";
import { initializeCategoryControls } from "./controllers/productos/categoryControls.js";
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

document.addEventListener("DOMContentLoaded", async () => {
  const hash = window.location.hash;
  if (hash.startsWith("#product-")) {
    await hashControllers();
  }
  initializeCategoryControls();

  loadBannerText();
  loadLogoImage();
  loadBannerImage();
  loadColorSettings();
  loadColorSettingsCard();

  const listaServicesInstance = new ListaServices();
  const isAdmin = await listaServicesInstance.getAdmin();
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  const divUsuario = document.querySelector(".rounded-circle");
  const actualizarUsuario = document.querySelector(".data-user");
  const logoutUsuario = document.querySelector("[data-logOut]");
  const userActive = document.querySelector("[data-log]");
  const contactUser = document.querySelector("[data-contact]");
  const resenas = document.querySelector("[data-resenas]");
  const ventas = document.querySelector("[data-ventas]");
  const estilosDiseno = document.querySelector("[data-estilosDiseno]");

  const titulo = document.querySelector("[data-titulo]");

  // Mostrar u ocultar elementos según si hay un usuario autenticado y es admin
  if (user && isAdmin) {
    document.querySelectorAll(".admin-only").forEach((el) => {
      el.style.display = "block";
    });

    cargarReseñasAdmin();

    const envio = document.querySelector("[data-pedidos]");
    envio.addEventListener("click", (e) => {
      e.preventDefault();
      const comprasInstance = new Compras(titulo);
      comprasInstance.renderLista();
    });

    const crearProducto = document.querySelector("[data-crearProductos]");
    crearProducto.addEventListener("click", (e) => {
      e.preventDefault();
      const productForm = new ProductForm(titulo);
      productForm.render();
    });

    resenas.addEventListener("click", (e) => {
      e.preventDefault();
      const formResena = new FormResena(titulo);
      formResena.render();
    });

    estilosDiseno.addEventListener("click", (e) => {
      e.preventDefault();
      const estilosInstance = new Estilos(titulo);
      estilosInstance.render();
    });

    const susxriptores = document.querySelector("[data-suscriptores]");
    susxriptores.addEventListener("click", async (e) => {
      e.preventDefault();
      const ListaControllersInstamce = new ListaControllers(titulo);
      await ListaControllersInstamce.renderLista();
    });

    controllers.renderProducts();
    actualizarUsuario.textContent = `${user}`;
    logoutUsuario.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    userActive.style.display = "none";
    contactUser.style.display = "none";
  } else {
    productosInicio.renderInit();
    cargarReseñas();
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

  ventas.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Seccion en Construccion");
  });

  const logOut = document.querySelector("[data-logOut]");
  logOut.addEventListener("click", (e) => {
    e.preventDefault();
    const loginServicesInstance = new LoginServices();
    loginServicesInstance.logout();
  });
});

// document.getElementById("searchForm").addEventListener("submit", function (e) {
//   e.preventDefault(); // Evitar la recarga de la página
//   const query = document
//     .getElementById("searchInput")
//     .value.trim()
//     .toLowerCase();
//   searchProducts(query);
// });

// document.getElementById("searchInput").addEventListener("input", function () {
//   const query = this.value.trim().toLowerCase();
//   searchProducts(query);
// });

function searchProducts(query) {
  const products = document.querySelectorAll(".card"); // Asegúrate de que cada producto tenga esta clase
  let found = false;

  products.forEach((product) => {
    const productName = product.querySelector("h3").textContent.toLowerCase();
    if (productName.includes(query)) {
      product.style.display = "block"; // Mostrar productos que coincidan
      found = true;
    } else {
      product.style.display = "none"; // Ocultar productos que no coincidan
    }
  });

  // Mostrar un mensaje si no se encontraron productos
  const noResultsMessage = document.getElementById("no-results-message");
  if (!found) {
    noResultsMessage.style.display = "block";
  } else {
    noResultsMessage.style.display = "none";
  }

  // Mostrar todos los productos si la búsqueda está vacía
  if (query === "") {
    productosInicio.renderInit();
    noResultsMessage.style.display = "none";
  }
}
