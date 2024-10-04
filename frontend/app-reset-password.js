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
import { baseURL } from "./services/product_services.js";

document.addEventListener("DOMContentLoaded", () => {
  // Obtener el token de la URL

  const form = document.getElementById("resetPasswordForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;

    try {
      const response = await fetch(`${baseURL}/api/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("message").textContent = data.message;
      } else {
        document.getElementById(
          "message"
        ).textContent = `Error: ${data.message}`;
      }
    } catch (error) {
      document.getElementById("message").textContent =
        "Ocurrió un error al intentar restablecer la contraseña.";
      console.error(error);
    }
  });
});
