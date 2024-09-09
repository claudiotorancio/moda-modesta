// finalizeHandlers.js
import { valida } from "./validaciones.js";
import mailServices from "../../services/mail_services.js";
import { modalControllers } from "../../modal/modal.js";

export function handleFinalizePurchase() {
  // Obtener o crear progresoCompra
  const progresoCompra = document.querySelector("#progreso-compra");
  if (!progresoCompra) {
    console.error("El contenedor de la barra de progreso no se encontró.");
    return;
  }

  // Marca el paso "Pago" como completado
  const pasos = progresoCompra.querySelectorAll(".paso");
  if (pasos.length < 3) {
    console.error("No se encontraron los pasos en la barra de progreso.");
    return;
  }
  pasos[2].classList.add("completado"); // Activa la casilla "Pago"

  // Mostrar el formulario de datos personales pero mantener la barra de progreso
  const formularioDatosPersonales = `
      <form id="personal-info-form" action="/api/sendmail" enctype="multipart/form-data" method="POST">
    <div class="container main-container">
        <h4>Datos personales</h4>
      
         <fieldset>
            <div class="input-container">
                <input name="name" id="name" type="text" class="input" placeholder="Nombre" data-tipo="nombre">
                <label class="input-label" for="name">Nombre</label>
                  <span class="input-message-error">Este campo no es valido</span>
            </div>
            <div class="input-container">
                <input name="email"  type="email" id="email" class="input" placeholder="Email" data-tipo="email" required>
                <label class="input-label" for="email">Email</label>
                  <span class="input-message-error">Este campo no es valido</span>
            </div>
            <div class="input-container">
                <input name="phoneNumber" type="tel" id="phoneNumber" class="input" placeholder="Número telefónico" pattern="\\d{10}" required maxlength="10" data-tipo="numero"  required>
                 <label class="input-label" for="phoneNumber">Número telefónico</label>
                  <span class="input-message-error">Este campo no es valido</span>
            </div>
          </fieldset>
          <em style="font-size: 10pt; font-family: Arial, sans-serif; background-color: transparent; vertical-align: baseline;">
Al dar finalizado se enviarán los datos para el pago al correo ingresado. Por favor, asegúrese de que estén correctos, Muchas gracias!
</em>

            <div>
               
                <button type="submit" class="btn btn-primary" id="finalize-order">Finalizar compra</button>
            </div>
       
    </div>
     </form>
  `;

  const summaryDetails = document.querySelector("[data-table]");
  summaryDetails.innerHTML = ""; // Limpiar contenido actual
  summaryDetails.appendChild(progresoCompra); // Reinsertar la barra de progreso
  summaryDetails.insertAdjacentHTML("beforeend", formularioDatosPersonales);

  // Validar inputs al perder el foco
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("blur", (event) => {
      valida(event.target);
    });
  });

  // Agregar evento para validar todo el formulario antes de enviar
  document
    .getElementById("personal-info-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      let formularioValido = true;
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        valida(input);
        if (!input.validity.valid) {
          formularioValido = false;
        }
      });

      if (!formularioValido) {
        return;
      }

      const nombre = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const telefono = document.querySelector("#phoneNumber").value;

      const productos = this.items.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        cantidad: item.cantidad,
        size: item.size,
        hash: item._id,
      }));

      const datosCompra = {
        nombre,
        email,
        telefono,
        productos,
        total: this.calcularTotal(),
        costoEnvio: this.costoEnvio,
        provincia: this.provinciaDestino,
        codigoPostal: this.cpDestino,
        checked: this.isChecked,
      };

      try {
        await mailServices.sendMail(datosCompra);
        modalControllers.modalCompraOk();
      } catch (error) {
        console.error("Error al enviar los datos de la compra:", error);
        alert(
          "Hubo un problema al procesar la compra. Por favor, intente nuevamente."
        );
      }
      this.limpiarCarrito();
    });

  // Evento para navegar a la etapa de "Entrega" al hacer clic en el paso de "Entrega"
  document
    .querySelector("#progreso-compra")
    .addEventListener("click", (event) => {
      console.log("Evento Click Disparado", event.target.dataset.step); // Verifica que el evento se esté disparando
      if (event.target.dataset.step === "1") {
        this.mostrarCarrito();
      }
    });

  document.querySelector(
    ".carrito-monto"
  ).textContent = `$${this.calcularTotal().toFixed(2)}`;
}
