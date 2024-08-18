import { modalControllers } from "../modal/modal.js";

class Carrito {
  constructor() {
    this.items = JSON.parse(sessionStorage.getItem('carrito')) || [];
    this.inicializarEventos();
    this.mostrarCarrito();
  }

  inicializarEventos() {
    const toggleCart = document.querySelector('.js-toggle-cart');
    if (toggleCart) {
      toggleCart.addEventListener('click', (event) => {
        event.preventDefault();
        modalControllers.baseModal();
        this.mostrarCarrito();
      });
    }
    // Reiniciar barra de progreso al cerrar el modal
    const closeModal = document.querySelector('.js-close-modal');
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        sessionStorage.removeItem('progreso-compra'); // Reinicia el progreso
      });
    }
  }

  agregarProducto({ product, size }) {
    const productoExistente = this.items.find(
      item => item._id === product._id && item.size === size
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
        imagePath: product.imagePath
      });
    }

    // Guardar el carrito actualizado en sessionStorage
    sessionStorage.setItem('carrito', JSON.stringify(this.items));
    this.mostrarCarrito();
  }

  eliminarProducto(id) {
    this.items = this.items.filter(item => item._id !== id);
    // Guardar el carrito actualizado en sessionStorage
    sessionStorage.setItem('carrito', JSON.stringify(this.items));
    this.mostrarCarrito();
  }

  actualizarCantidad(id, cantidad) {
    const producto = this.items.find(item => item._id === id);
    if (producto) {
      producto.cantidad = cantidad;
    }
    this.mostrarCarrito();
  }

  calcularTotal() {
    return this.items.reduce((total, producto) => total + producto.price * producto.cantidad, 0);
  }

  mostrarCarrito() {
    const carritoContainer = document.querySelector(".carrito-link");
    const carritoNotificacion = carritoContainer.querySelector(".carrito-cantidad");
    const carritoMonto = carritoContainer.querySelector(".carrito-monto");
    const summaryDetails = document.querySelector("[data-table]");

    carritoNotificacion.textContent = this.items.reduce((acc, item) => acc + item.cantidad, 0);
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
      summaryDetails.innerHTML = '';
      summaryDetails.appendChild(progresoCompra);

      // Añadir los detalles del carrito
      const carritoContent = `
        <div class="container main-container">
            <span class="m-left-half">Ver detalles de mi compra</span>
            <span class="summary-total">$ ${this.calcularTotal().toFixed(2)}</span>
            <div class="summary-details panel p-none">
                <table class="table table-scrollable">
                    <tbody>
                        ${this.items.map(item => `
                            <tr>
                                <td class="summary-img-wrap">
                                    <div class="col-md-6 mx-auto">
                                        <img class="card-img-top" alt="${item.name}" title="${item.name}" src="${item.imagePath}">
                                    </div>
                                </td>
                                <td>${item.name} × ${item.cantidad} <br> <small>Talle: ${item.size}</small></td>
                                <td class="table-price text-right">
                                    <span>$ ${item.price.toFixed(2)}</span>
                                </td>
                                <td class="table-price text-right">
                                    <button class="btn btn-danger" data-id="${item._id}" data-size="${item.size}"><i class="fa-solid fa-scissors"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="table-subtotal">
                    <table class="table">
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td class="text-right"><span>$ ${this.calcularTotal().toFixed(2)}</span></td>
                            </tr>
                            <tr>
                                <td>Envío</td>
                                <td class="text-right">
                                    <select id="shipping-options" class="form-control">
                                        <option value="standard">Seleccione</option>
                                        <option value="express">Envío exprés - $4000 (interior de La Pampa)</option>
                                        <option value="pickup">Retiro en tienda - Gratis</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="table-footer">
                            <tr>
                                <td class="table-price">Total</td>
                                <td class="text-right table-price">
                                    <span id="final-total">$ ${(this.calcularTotal()).toFixed(2)}</span>
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

      // Insertar el contenido del carrito y mantener la barra de progreso
      summaryDetails.insertAdjacentHTML('beforeend', carritoContent);

      // Evento para el botón "Eliminar" en el carrito
      summaryDetails.querySelectorAll(".btn-danger").forEach(button => {
        button.addEventListener("click", (event) => {
          const itemId = event.target.dataset.id;
          const itemSize = event.target.dataset.size;
          this.eliminarProducto(itemId, itemSize);
        });
      });

      // Evento para activar la casilla "Entrega" cuando se selecciona un modo de envío
      const finalizeButton = document.querySelector("#finalize-purchase");
      document.querySelector("#shipping-options").addEventListener("change", (event) => {
        const shippingCost = {
          standard: 0.00,
          express: 4000,
          pickup: 0.00
        }[event.target.value];

        const totalCost = this.calcularTotal() + shippingCost;
        document.querySelector("#final-total").textContent = `$${totalCost.toFixed(2)}`;

        // Marcar la casilla "Entrega" como completada
        const pasos = document.querySelectorAll("#progreso-compra .paso");
        pasos[1].classList.add("completado"); // Activa la casilla "Entrega"

        // Activar botón "Siguiente" solo si se ha seleccionado un modo de envío
        finalizeButton.disabled = !event.target.value;
      });

      // Evento para el botón "Siguiente"
      document.querySelector("#finalize-purchase").addEventListener("click", () => {
        // Marcar la casilla "Pago" como completada
        const pasos = document.querySelectorAll("#progreso-compra .paso");
        pasos[2].classList.add("completado"); // Activa la casilla "Pago"

        // Mostrar el formulario de datos personales pero mantener la barra de progreso
        const formularioDatosPersonales = `
          <div class="container main-container">
              <h3>Datos personales</h3>
              <form id="personal-info-form">
                  <div class="form-group">
                      <label for="nombre">Nombre:</label>
                      <input type="text" id="nombre" class="form-control" required>
                  </div>
                  <div class="form-group">
                      <label for="email">Correo electrónico:</label>
                      <input type="email" id="email" class="form-control" required>
                  </div>
                  <div class="form-group">
                      <label for="telefono">Teléfono:</label>
                      <input type="tel" id="telefono" class="form-control" required>
                  </div>
                  <div class="purchase-actions">
                      <em style="font-size: 10pt; font-family: Arial, sans-serif; background-color: transparent; vertical-align: baseline;">
                        Al dar finalizado se enviarán los datos para el pago a las direcciones que ingresó. Por favor, asegúrese de que estén correctos.
                      </em>
                      <button class="btn btn-success" id="finalize-order">Finalizar compra</button>
                  </div>
              </form>
          </div>
        `;

        // Reemplazar el contenido del carrito con el formulario de datos personales pero mantener la barra de progreso
        summaryDetails.innerHTML = '';
        summaryDetails.appendChild(progresoCompra); // Mantener la barra de progreso
        summaryDetails.insertAdjacentHTML('beforeend', formularioDatosPersonales);

        document.querySelector("#finalize-order").addEventListener("click", (event) => {
          event.preventDefault();
          // Lógica para manejar la finalización de la compra con los datos ingresados
          alert("Compra finalizada con éxito");
        });
      });

      // Evento para navegar a la etapa de "Entrega" al hacer clic en el paso de "Entrega"
      document.querySelector("#progreso-compra").addEventListener("click", (event) => {
        if (event.target.dataset.step === '1') {
          this.mostrarCarrito(); // Vuelve a mostrar la sección de entrega
          this.activarPaso(1); // Marca la casilla "Entrega" como incompleta
        }
      });

      document.querySelector(".carrito-monto").textContent = `$${this.calcularTotal().toFixed(2)}`;
    } else {
      summaryDetails.innerHTML = '<div>Carrito vacío</div>';
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
