import { modalControllers } from "../../modal/modal.js";
import envioServices from "../../services/envio_services.js";
import mailServices from "../../services/mail_services.js";
import { capturarDatosEnvio } from "../envios/formEnvio.js";
import { valida } from "./validaciones.js";
import { generarOpcionesProvincias } from "./validaProvincias.js";

class Carrito {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("carrito")) || [];
    this.costoEnvio = 0; // Variable para almacenar el costo de envío seleccionado
    this.envioExpiracion = null; // Variable para controlar la expiración del costo de envío
    this.inicializarEventos();
    this.mostrarCarrito();
  }

  inicializarEventos() {
    const toggleCart = document.querySelector(".js-toggle-cart");
    if (toggleCart) {
      toggleCart.addEventListener("click", (event) => {
        event.preventDefault();
        modalControllers.baseModal();
        this.mostrarCarrito();
      });
    }
    // Reiniciar barra de progreso al cerrar el modal
    const closeModal = document.querySelector(".js-close-modal");
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        sessionStorage.removeItem("progreso-compra"); // Reinicia el progreso
      });
    }
  }

  agregarProducto({ product, size }) {
    const productoExistente = this.items.find(
      (item) => item._id === product._id && item.size === size
    );

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      this.items.push({
        _id: product._id,
        name: product.name,
        price: parseFloat(product.price),
        cantidad: 1,
        size: size, // Almacenar el talle seleccionado
        imagePath: product.imagePath,
      });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(this.items));
    this.mostrarCarrito();
  }

  eliminarProducto(id) {
    this.items = this.items.filter((item) => item._id !== id);
    // Guardar el carrito actualizado en sessionStorage
    localStorage.setItem("carrito", JSON.stringify(this.items));
    this.mostrarCarrito();
  }

  actualizarCantidad(id, cantidad) {
    const producto = this.items.find((item) => item._id === id);
    if (producto) {
      producto.cantidad = cantidad;
    }
    this.mostrarCarrito();
  }

  calcularSubtotal() {
    const totalCarrito = this.items.reduce(
      (total, producto) => total + producto.price * producto.cantidad,
      0
    );
    return totalCarrito;
  }

  calcularTotal() {
    return this.calcularSubtotal() + this.costoEnvio;
  }

  mostrarCarrito() {
    const carritoContainer = document.querySelector(".carrito-link");
    const carritoNotificacion =
      carritoContainer.querySelector(".carrito-cantidad");
    const carritoMonto = carritoContainer.querySelector(".carrito-monto");
    const summaryDetails = document.querySelector("[data-table]");

    carritoNotificacion.textContent = this.items.reduce(
      (acc, item) => acc + item.cantidad,
      0
    );
    carritoMonto.textContent = `$${this.calcularTotal().toFixed(2)}`;

    if (this.items.length !== 0) {
      const progresoCompra = document.createElement("div");
      progresoCompra.id = "progreso-compra";
      progresoCompra.classList.add("barra-progreso");

      const pasos = ["Carrito", "Entrega", "Pago"];
      pasos.forEach((paso, index) => {
        const pasoElement = document.createElement("div");
        pasoElement.classList.add("paso");
        if (index === 0) pasoElement.classList.add("completado");
        pasoElement.textContent = paso;
        pasoElement.dataset.step = index; // Añadir un atributo de paso para identificarlo
        progresoCompra.appendChild(pasoElement);
      });

      // Limpiar el contenido actual y añadir la barra de progreso
      summaryDetails.innerHTML = "";
      summaryDetails.appendChild(progresoCompra);

      // Añadir los detalles del carrito
      const carritoContent = `
      <div class="container main-container">
          <div class="summary-details panel p-none">
              <table class="table table-scrollable">
                  <tbody>
                      ${this.items
                        .map(
                          (item) => `
                          <tr style="display: inline-flex;">
                              <td class="summary-img-wrap">
                                  <div class="col-md-6 mx-auto">
                                      <img class="card-img-top" alt="${
                                        item.name
                                      }" title="${item.name}" src="${
                            item.imagePath
                          }">
                                  </div>
                              </td>
                              <td>${item.name} × ${item.cantidad} <br> <small>${
                            item.size
                          }</small></td>
                              <td class="table-price text-right">
                                  <span>$ ${item.price.toFixed(2)}</span>
                              </td>
                              <td class="table-price text-right">
                                  <button class="btn btn-danger" data-id="${
                                    item._id
                                  }" data-size="${
                            item.size
                          }"><i class="fa-solid fa-scissors"></i></button>
                              </td>
                          </tr>
                      `
                        )
                        .join("")}
                  </tbody>
              </table>
  
              <div class="table-subtotal">
                  <table class="table">
                      <tbody>
                          <tr>
                              <td>Subtotal</td>
                              <td class="text-right"><span>$ ${this.calcularSubtotal().toFixed(
                                2
                              )}</span></td>
                          </tr>
                          <tr>
                              <td>Envío
                                  <button id="toggle-envio-form" class="btn btn-link">
                                      <i class="fa-solid fa-chevron-down"></i>
                                  </button>
                              </td>
                              <td class="text-right">
                                  <div id="envio-form-container" class="collapse">
                                      <form id="envio-form" action="/api/costoEnvio" enctype="multipart/form-data" method="POST">
                                          <div class="input-container">
                                              <input type="checkbox" id="coordinar-vendedor" name="coordinarVendedor">
                                              <label for="coordinar-vendedor">Coordinar con vendedor</label>
                                          </div>
                                          <div class="input-container">
                                              <select class="input" id="provinciaDestino" name="provinciaDestino" placeholder="Codigo Postal" data-tipo="Provincia" required>
                                                  <!-- Options -->
                                              </select>
                                          </div>
                                         <div class="input-container">
        <div class="postal-input-container">
            <input type="number" class="input" id="cpDestino" name="cpDestino" placeholder="Codigo Postal" data-tipo="cpDestino" required>
            <label class="input-label" for="cpDestino">Codigo Postal</label>
            <span class="input-message-error">Este campo no es válido</span>
            <!-- Flecha como ícono dentro del input -->
            <i class="fa fa-arrow-right postal-arrow" id="calcular-envio"></i>
        </div>
    </div>
                                      </form>
                                      <div class="input-container">
                                          <input type="number" class="form-control" id="shipping-total" name="shipping-options" placeholder="0" required readonly>
                                      </div>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                      <tfoot class="table-footer">
                          <tr>
                              <td class="table-price">Total</td>
                              <td class="text-right table-price">
                                  <span id="final-total">$ 0,00</span>
                              </td>
                          </tr>
                      </tfoot>
                  </table>
              </div>
  
              <div class="purchase-actions">
                  <button class="btn btn-primary" id="finalize-purchase" disabled>Siguiente</button>
              </div>
          </div>
      </div>
  `;

      summaryDetails.insertAdjacentHTML("beforeend", carritoContent);

      document
        .getElementById("toggle-envio-form")
        .addEventListener("click", () => {
          const envioFormContainer = document.getElementById(
            "envio-form-container"
          );
          envioFormContainer.classList.toggle("show");

          const icon = document.querySelector("#toggle-envio-form i");
          icon.classList.toggle("fa-chevron-down");
          icon.classList.toggle("fa-chevron-up");
        });

      //validas provincia con codigo de referncia
      const selectElement = document.querySelector("#provinciaDestino");

      if (selectElement) {
        generarOpcionesProvincias(selectElement);
      } else {
        console.error("Elemento select no encontrado.");
      }

      // Validar inputs al perder el foco
      const inputs = document.querySelectorAll("input, select");
      inputs.forEach((input) => {
        input.addEventListener("blur", (event) => {
          valida(event.target);
        });
      });

      //calcular en API costo de envio
      document
        .getElementById("calcular-envio")
        .addEventListener("click", async (event) => {
          event.preventDefault();

          // Primero, valida los campos del formulario
          let formularioValido = true;
          const inputs = document.querySelectorAll("input, select");

          inputs.forEach((input) => {
            valida(input);
            if (!input.validity.valid) {
              formularioValido = false;
            }
          });

          if (!formularioValido) {
            console.log("Formulario inválido. Verifica los campos.");
            return; // Detener la ejecución si el formulario no es válido
          }

          // Solo si el formulario es válido, prepara los datos para la API
          const cpOrigen = 6300;
          const cpDestinoInput = document.getElementById("cpDestino");
          const cpDestino = parseFloat(cpDestinoInput.value);
          const provinciaOrigen = "AR-L";
          const provinciaDestino =
            document.getElementById("provinciaDestino").value;
          const peso = 5;

          const datosEnvio = {
            cpOrigen,
            cpDestino,
            provinciaOrigen,
            provinciaDestino,
            peso,
          };

          try {
            // Realiza la solicitud a la API
            const data = await envioServices.calcularCostoEnvio(datosEnvio);

            const valorEnvio = data.paqarClasico.aDomicilio;

            const shippingTotalInput =
              document.getElementById("shipping-total");
            shippingTotalInput.value = valorEnvio; // Asigna el valor al input

            this.costoEnvio = parseFloat(valorEnvio); // Actualiza el costo de envío
            this.provinciaDestino = provinciaDestino;
            this.cpDestino = cpDestino;

            // Actualiza el total del carrito
            const totalCost = this.calcularTotal();
            document.querySelector(
              "#final-total"
            ).textContent = `$${totalCost.toFixed(2)}`;

            // Marca la casilla "Entrega" como completada
            document
              .querySelectorAll("#progreso-compra .paso")[1]
              .classList.add("completado");

            // Habilitar el botón "Siguiente"
            const finalizeButton = document.querySelector("#finalize-purchase");
            finalizeButton.disabled = false;
          } catch (err) {
            // En tu bloque catch
            console.error("Error al calcular el costo de envío:", err);

            const cpDestinoInput = document.getElementById("cpDestino");

            // Establecer un mensaje de error personalizado
            cpDestinoInput.setCustomValidity(
              "Código Postal no válido según el servidor."
            );

            // Volver a validar el input para mostrar el mensaje
            valida(cpDestinoInput);

            // Asegurarse de que el campo no quede deshabilitado y esté habilitado para nuevas entradas
            cpDestinoInput.disabled = false;

            // Aplicar la clase de error
            cpDestinoInput.parentElement.classList.add(
              "input-container--invalid"
            );

            // Agregar un event listener para limpiar el error cuando el usuario hace clic en el campo
            cpDestinoInput.addEventListener("focus", function handleFocus() {
              cpDestinoInput.setCustomValidity("");
              valida(cpDestinoInput);
              cpDestinoInput.parentElement.classList.remove(
                "input-container--invalid"
              );

              // Elimina el event listener después de manejar el evento
              cpDestinoInput.removeEventListener("focus", handleFocus);
            });
          }
        });

      //checked disbled
      document
        .querySelector("#coordinar-vendedor")
        .addEventListener("input", (event) => {
          const isChecked = event.target.checked;
          const shippingFields = [
            document.querySelector("#provinciaDestino"),
            document.querySelector("#cpDestino"),
            document.getElementById("calcular-envio"),
            document.getElementById("shipping-total"),
          ];

          this.isChecked = isChecked;

          shippingFields.forEach((field) => {
            field.disabled = isChecked;
          });

          // Actualizar el costo de envío y el total del carrito
          if (isChecked) {
            this.costoEnvio = 0;
          } else {
            this.costoEnvio = parseFloat(
              document.querySelector("#shipping-total").value || 0
            );
          }

          // Actualizar el total en la interfaz
          const totalCost = this.calcularTotal();
          document.querySelector(
            "#final-total"
          ).textContent = `$${totalCost.toFixed(2)}`;

          const finalizeButton = document.querySelector("#finalize-purchase");
          finalizeButton.disabled = !isChecked && this.costoEnvio === 0;
          document
            .querySelectorAll("#progreso-compra .paso")[1]
            .classList.toggle(
              "completado",
              isChecked || (!isChecked && this.costoEnvio > 0)
            );
        });

      // Evento para el botón "Eliminar" en el carrito
      summaryDetails.querySelectorAll(".btn-danger").forEach((button) => {
        button.addEventListener("click", (event) => {
          const itemId = event.target.dataset.id;
          const itemSize = event.target.dataset.size;
          this.eliminarProducto(itemId, itemSize);
        });
      });

      document
        .querySelector("#finalize-purchase")
        .addEventListener("click", () => {
          // Marcar la casilla "Pago" como completada
          const pasos = document.querySelectorAll("#progreso-compra .paso");
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

          // Reemplazar el contenido del carrito con el formulario de datos personales pero mantener la barra de progreso
          summaryDetails.innerHTML = "";
          summaryDetails.appendChild(progresoCompra); // Mantener la barra de progreso
          summaryDetails.insertAdjacentHTML(
            "beforeend",
            formularioDatosPersonales
          );

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
              console.log(datosCompra);
              try {
                await mailServices.sendMail(datosCompra);
                modalControllers.modalCompraOk();
              } catch (error) {
                console.error("Error al enviar los datos de la compra:", error);
                alert(
                  "Hubo un problema al procesar la compra. Por favor, intente nuevamente."
                );
              }
            });
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
    } else {
      summaryDetails.innerHTML = "<div>Carrito vacío</div>";
    }
  }

  activarPaso(pasoIndex) {
    const pasos = document.querySelectorAll("#progreso-compra .paso");
    pasos.forEach((paso, index) => {
      if (index < pasoIndex) {
        paso.classList.add("completado");
      } else {
        paso.classList.remove("completado");
      }
    });
  }
}

const carrito = new Carrito();

export default carrito;
