// Importar estilos y módulos necesarios
import "./styles/assets/css/style.css";
import "./styles/assets/css/productos.css";
import { LoginServices } from "./services/login_services.js";
import { LoginControllers } from "./controllers/login_controllers.js";
import { ListaControllers } from "./controllers/lista.controllers.js";
import { productosInicio } from "./controllers/controllers_inicio.js";
import productForm from "./controllers/productForm.js";
import { controllers } from "./controllers/productos_controllers.js";
import productoServices from "./services/product_services.js"
import { modalControllers } from "./modal/modal.js";
import { baseURL } from "./services/product_services.js"


// Función principal que se ejecuta cuando el DOM está listo
document.addEventListener("DOMContentLoaded", async () => {

  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams)
  const token = urlParams.get('token');

  if (token) {
    try {
      const response = await fetch(`${baseURL}/api/confirmMail?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        modalControllers.modalSuccessSignIn()
        showConfirmationModal("Correo confirmado exitosamente.");
      } else {
        showConfirmationModal("Hubo un problema al confirmar el correo. Verifica el enlace y vuelve a intentarlo.");
      }
    } catch (err) {
      showConfirmationModal("Error al confirmar el correo. Por favor, intenta nuevamente.");
    }
  }


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
    crearproducto.innerHTML = 'Suscribite!'

    const hash = window.location.hash;
  if (hash.startsWith('#product-')) {
    const id = hash.replace('#product-', '');
  
    try {
      // Encapsular el producto en un array si es un solo objeto
      const response = await productoServices.detalleProducto(id);
      const producto = response.product; // Asumiendo que el objeto está dentro de 'product'
  
      // Convertir en array si es necesario
      const productosArray = [producto];
  
      productosArray.forEach(p => {
        controllers.mostrarProducto(
          p.name,
          p.price,
          p.imagePath,
          p.sizes,
          p.description,
          p._id
        );
      });
    } catch (error) {
      console.error('Error al obtener los detalles del producto:', error);
    }
  }
  }

  
  

  
  // Evento para crear un producto
  if(user){ crearproducto.addEventListener("click", () => {
    productForm.render();
  });}else {
   
    document.querySelector("[data-init]").addEventListener("click", (e) => {
        e.preventDefault();
       modalControllers.modalSuscribe()

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
