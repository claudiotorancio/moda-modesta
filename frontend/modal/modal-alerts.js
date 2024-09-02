import { LoginControllers } from "../controllers/registro/login_controllers.js";
import mailServices from "../services/mail_services.js";
import productoServices from "../services/product_services.js";

const baseModal = () => {
  const modal = document.getElementById("modal-alerts");
  modal.style.display = "block";

  // Añadir un nuevo estado al historial cuando se abre el modal
  window.history.pushState({ modalOpen: true }, "");

  const modalClose = document.querySelector(".modal-close-alerts");

  // Función para cerrar el modal sin afectar el historial
  const closeModal = () => {
    modal.style.display = "none";
  };

  // Escuchar el evento de clic en el botón de cierre
  modalClose.addEventListener("click", () => {
    closeModal();
    // window.history.back(); // Solo retrocede en el historial al cerrar con el botón
  });

  // Cerrar el modal si se hace clic fuera del contenido del modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(); // Cierra el modal, pero no afecta el historial
    }
  });

  // Escuchar el evento 'popstate' para cerrar el modal si se presiona "Atrás"
  window.addEventListener("popstate", (event) => {
    if (modal.style.display === "block") {
      closeModal(); // Cierra el modal sin modificar el historial
    }
  });
};

export const modalAlerts = {
  baseModal,
};
