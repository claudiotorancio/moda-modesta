import { generarOpcionesProvincias } from "./validaProvincias.js";
import { valida } from "./validaciones.js";
import {
  handleEnvioFormToggle,
  handleEnvioFormSubmission,
  handleCoordinarVendedorChange,
} from "./envioHandlers.js";
import { handleFinalizePurchase } from "./finalizeHandlers.js";

export function mostrarCarrito() {
  const summaryDetails = document.querySelector("[data-table]");

  const subtotal = this.calcularSubtotal();
  const total = this.calcularTotal();

  if (this.items.length > 0) {
    const progresoCompra = document.createElement("div");
    progresoCompra.id = "progreso-compra";
    progresoCompra.classList.add("barra-progreso");

    const pasos = ["Carrito", "Entrega", "Pago"];
    pasos.forEach((paso, index) => {
      const pasoElement = document.createElement("div");
      pasoElement.classList.add("paso");
      if (index === 0) pasoElement.classList.add("completado");
      pasoElement.textContent = paso;
      pasoElement.dataset.step = index;
      progresoCompra.appendChild(pasoElement);
    });

    summaryDetails.innerHTML = "";
    summaryDetails.appendChild(progresoCompra);

    const carritoContent = `
      <div class="main-container">
  <div class="summary-details panel p-none">
    <table class="table table-scrollable">
      <tbody>
        ${this.items
          .map((item) => {
            // Calcula el precio con descuento para cada artículo
            (item.price * (1 - item.discount / 100)).toFixed(2);
            return `
               <tr>
  <td class="summary-img-wrap">
    <img class="card-img-top" alt="${item.name}" title="${item.name}" src="${
              item.imagePath
            }">
  </td>
  <td>${item.name} × ${item.cantidad} <br> <small>${item.size}</small></td>
  <td class="table-price">
    ${
      item.discount > 0
        ? `
          <!-- Precio original tachado y precio con descuento -->
          <br>
          <span class="original-price">
          $${(item.price * item.cantidad).toFixed(2)}
          </span>
          <br>
          <span ">
          $${(item.price * (1 - item.discount / 100) * item.cantidad).toFixed(
            2
          )}
          </span>
          <br>
          <span class="discount-tag">
          ${item.discount}% off
          </span>
        `
        : `
          <!-- Precio sin descuento -->
          <span >$${(item.price * item.cantidad).toFixed(2)}</span>
        `
    }
  </td>
  <td class="table-price">
    <button class="btn btn-danger" data-id="${item._id}" data-size="${
              item.size
            }">
      Del
    </button>
  </td>
</tr>

              `;
          })
          .join("")}
      </tbody>
    </table>

    <div class="table-subtotal mb-9">
      <table class="table">
        <tbody>
          <tr>
            <td>SUBTOTAL</td>
            <td class="text-right mb-5"><span>$${subtotal.toFixed(
              2
            )}</span></td>
          </tr>
          <tr>
            <td>ENVIO
              <div>
                <button id="toggle-envio-form" class="btn btn-link">
                  <i class="fa-solid fa-chevron-down continuos-move"></i>
                </button>
              </div>
            </td>
            <td class="text-right">
              <div id="envio-form-container" class="collapse">
                <form id="envio-form" action="/api/costoEnvio" enctype="multipart/form-data" method="POST">
                  <div class="input-container">
                    <input type="checkbox" id="coordinar-vendedor" name="coordinarVendedor">
                    <label for="coordinar-vendedor">Coordinar con vendedor</label>
                  </div>
                  <div class="input-container">
                    <select class="input" id="provinciaDestino" name="provinciaDestino" data-tipo="Provincia" required>
                      <!-- Options -->
                    </select>
                  </div>
                  <div class="input-container">
                    <input type="number" class="input" id="cpDestino" name="cpDestino" placeholder="Codigo Postal" data-tipo="cpDestino" required>
                    <span class="input-message-error">Este campo no es válido</span>
                    <i class="fa fa-arrow-right postal-arrow" id="calcular-envio"></i>
                  </div>
                </form>
                <div class="input-container">
                  <input type="number" class="input" id="shipping-total" name="shipping-options" placeholder="0" required readonly>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot class="table-footer">
          <tr>
            <td class="table-price">TOTAL</td>
            <td class="text-right table-price">
              <span id="final-total">$${total.toFixed(2)}</span>
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

    // Attach event listeners
    document
      .getElementById("toggle-envio-form")
      .addEventListener("click", function () {
        const icon = this.querySelector("i");
        icon.classList.toggle("icon-down");
        icon.classList.toggle("icon-up");
      });

    document
      .getElementById("toggle-envio-form")
      .addEventListener("click", handleEnvioFormToggle);

    generarOpcionesProvincias(document.querySelector("#provinciaDestino"));

    document.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("blur", (event) => {
        valida(event.target);
      });
    });

    document
      .getElementById("calcular-envio")
      .addEventListener("click", handleEnvioFormSubmission.bind(this));

    document
      .querySelector("#coordinar-vendedor")
      .addEventListener("input", handleCoordinarVendedorChange.bind(this));

    summaryDetails.querySelectorAll(".btn-danger").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const productId = event.target.dataset.id;
        if (productId) {
          await this.eliminarProducto?.(productId);
          this.mostrarCarrito(); // Refresh the cart view
        } else {
          console.error("ID del producto no encontrado:", event.target);
        }
      });
    });

    document
      .querySelector("#finalize-purchase")
      .addEventListener("click", handleFinalizePurchase.bind(this));
  } else {
    summaryDetails.innerHTML = `
        <div class="empty-cart-message" style="padding: 20px; text-align: center; font-size: 1.5rem; color: #ff0000;">
          <p>Tu carrito está vacío.</p>
          <button class="btn btn-primary" onclick="window.location.href='index.html';">Volver a la tienda</button>
        </div>
      `;
  }
}
