import { modalControllers } from "../modal/modal.js";

class Carrito {
  constructor() {
    this.items = JSON.parse(sessionStorage.getItem('carrito')) || [];
    this.inicializarEventos();
    this.mostrarCarrito()
  }

  inicializarEventos() {
    const toggleCart = document.querySelector('.js-toggle-cart');
    if (toggleCart) {
      toggleCart.addEventListener('click', (event) => {
        event.preventDefault();
        modalControllers.baseModal()
        this.mostrarCarrito();
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
        // Crear la barra de progreso
        const progresoCompra = document.createElement("div");
        progresoCompra.id = "progreso-compra";
        progresoCompra.classList.add("barra-progreso");

        const pasos = ["Carrito", "Entrega", "Pago"];
        pasos.forEach((paso, index) => {
            const pasoElement = document.createElement("div");
            pasoElement.classList.add("paso");
            if (index === 0) pasoElement.classList.add("completado"); // Marca como completado el primer paso
            pasoElement.textContent = paso;
            progresoCompra.appendChild(pasoElement);
        });

        // Añadir la barra de progreso al comienzo del contenido del modal
        summaryDetails.innerHTML = ''; // Limpiar el contenido actual
        summaryDetails.appendChild(progresoCompra);

        summaryDetails.innerHTML += `
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
                                            <option value="express">Envío exprés - $10.00</option>
                                            <option value="pickup">Recoger en tienda - Gratis</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot class="table-footer">
                                <tr>
                                    <td class="table-price">Total</td>
                                    <td class="text-right table-price">
                                        <span id="final-total">$ ${(this.calcularTotal() + 5).toFixed(2)}</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div class="purchase-actions">
                        <button class="btn btn-primary" id="finalize-purchase">Siguiente</button>
                    </div>
                </div>
            </div>
        `;
        summaryDetails.querySelectorAll(".btn-danger").forEach(button => {
          button.addEventListener("click", (event) => {
            const itemId = event.target.dataset.id;
            const itemSize = event.target.dataset.size;
            this.eliminarProducto(itemId, itemSize);
          });
        });
    
        // Evento para activar la casilla "Entrega" cuando se selecciona un modo de envío
        document.querySelector("#shipping-options").addEventListener("change", (event) => {
            const shippingCost = {
                standard: 5.00,
                express: 10.00,
                pickup: 0.00
            }[event.target.value];

            const totalCost = this.calcularTotal() + shippingCost;
            document.querySelector("#final-total").textContent = `$${totalCost.toFixed(2)}`;

            // Marcar la casilla "Entrega" como completada
            const pasos = document.querySelectorAll("#progreso-compra .paso");
            pasos[1].classList.add("completado"); // Activa la casilla "Entrega"
        });
  
      document.querySelector("#finalize-purchase").addEventListener("click", () => {
        // Lógica para finalizar la compra
        alert("Compra finalizada");
      });
  
      document.querySelector(".carrito-monto").textContent = `$${this.calcularTotal().toFixed(2)}`;
    } else {
      summaryDetails.innerHTML = '<div>Carrito vacío</div>';
    }
  }
  
}

const carrito = new Carrito();

export default carrito;
