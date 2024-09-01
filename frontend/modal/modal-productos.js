import { LoginControllers } from "../controllers/registro/login_controllers.js";
import mailServices from "../services/mail_services.js";
import productoServices from "../services/product_services.js";

const baseModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  const modalClose = document.querySelector(".modal-close");
  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
};

export const modalProducto = {};
