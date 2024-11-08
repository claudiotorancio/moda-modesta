import "./styles/assets/css/base/reset.css";
import "./styles/assets/css/base/base.css";
import "./styles/assets/css/base/variables.css";
import "./styles/assets/css/style.css";
import "./styles/assets/css/productos.css";
import "./styles/assets/css/components/inputs.css";
import "./styles/assets/css/components/modal.css";
import "./styles/assets/css/table.css";
import { baseURL } from "../backend/baseUrl.js";

document.addEventListener("DOMContentLoaded", () => {
  // Obtener el token de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  console.log(token);
  document.getElementById("token").value = token; // Asignar el token al input hidden

  const form = document.getElementById("resetPasswordForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const token = document.getElementById("token").value;

    try {
      const response = await fetch(`${baseURL}/api/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, token }),
      });

      const data = await response.json();
      const messageEl = document.getElementById("message");
      const actionButtonEl = document.getElementById("actionButton");

      if (response.ok) {
        messageEl.textContent = data.message;

        // Crear un botón para ir a la tienda
        actionButtonEl.innerHTML = `<a href="index.html" class="btn btn-success">Ir a la tienda</a>`;
      } else {
        messageEl.textContent = `Error: ${data.message}`;

        // Crear un botón para volver a intentar
        actionButtonEl.innerHTML = `<a href="index.html" class="btn btn-warning">volver a intentar</a>`;
      }
    } catch (error) {
      document.getElementById("message").textContent =
        "Ocurrió un error al intentar restablecer la contraseña.";
      console.error(error);

      // Mostrar botón para volver a intentar en caso de error
      document.getElementById("actionButton").innerHTML = `
       <a href="index.html" class="btn btn-warning">volver a intentar</a>`;
    }
  });
});
