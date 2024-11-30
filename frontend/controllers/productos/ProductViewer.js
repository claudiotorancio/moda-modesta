import { modalControllers } from "../../modal/modal.js";
import { getAmountSelectHTML, getSizesSelectHTML } from "./amountSizesHTML.js";

export function mostrarProducto() {
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const mostrarProducto = modal.querySelector("[data-table]");

  // Crear el HTML del producto con el carrusel integrado
  mostrarProducto.innerHTML = `
      <div class="main-container">
  <div class="container-fluid">
    <div class="row">
      <!-- Columna izquierda: Carrusel de imágenes -->
      <div class="col-md-6">
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
            ${this.imagePath
              .map(
                (_, index) => `
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${
                  index === 0 ? "active" : ""
                }" aria-current="${
                  index === 0 ? "true" : "false"
                }" aria-label="Slide ${index + 1}"></button>
            `
              )
              .join("")}
          </div>
          <div class="carousel-inner">
            ${this.imagePath
              .map(
                (img, index) => `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                  <img src="${img}" class="d-block w-100" alt="Imagen ${
                  index + 1
                }">
                  ${
                    index === 0 && this.hayStock
                      ? `
                        <button id="compartir-producto" class="btn btn-outline-secondary share-button">
                    <i class="fa-solid fa-share-nodes"></i> Compartir
                  </button>
                      `
                      : ""
                  }
                  <div class="carousel-caption d-none d-md-block">
                    <h5>Imagen ${index + 1}</h5>
                    <p>Descripción de la imagen ${index + 1}</p>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>

          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
  
      <!-- Columna derecha: Información del producto y selección de talles -->
      <div class="col-md-6">
        <h2 class="product-title-bold mt-2" style="font-size: 1.3rem;">${
          this.name
        }</h2>
        <h3 class="product-price text-primary-bold mt-2" style="font-weight: bold; font-size: 1.25em;"> ${
          this.discount && this.hayStock
            ? `<span class="original-price">
          $${this.price.toFixed(2)}
          </span>
          <br>
          <span >
          $${(this.price * (1 - this.discount / 100)).toFixed(2)}
          </span>
           <span class="discount-tag">
          ${this.discount}% off
          </span>
          `
            : `<span class=" text-muted">$${this.price.toFixed(2)}</span> `
        }</h3>
        <p class="product-description text-muted">${this.description}</p>
        
        ${
          this.hayStock
            ? ""
            : '<div class="alert alert-warning">Sin stock</div>'
        }
  
        <!-- Selección de talla o cantidad -->
        ${
          this.hayStock
            ? !this.generalStock
              ? `${getSizesSelectHTML.call(this)}`
              : `${getAmountSelectHTML.call(this)}`
            : `
          <div class="main-container">
            <div class="text-center">
              <div class="card-form">
                <p>¡Notificarme cuando ingrese!</p>
                <form id="notificacion-form" action="/api/notificacionSinStock" method="POST">
                  <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" class="input" placeholder="nombre@gmail.com" required>
                  </div>
                  <button type="submit" class="btn btn-primary mt-2">Enviar</button>
                </form>
              </div>
            </div>
          </div>`
        }
  
        <!-- Botón de compartir -->
       
      </div>
    </div>
  
    <!-- Fila inferior: Calcular envío y productos similares -->
    ${
      this.hayStock
        ? `<div class="row mx-auto  align-items-center">
            <div class=" mt-2">
              <h5>Calcular envío</h5>
                <div class="d-flex mt-2">
                   <input type="number" class="input me-2" id="cpDestino" name="cpDestino" placeholder="Codigo Postal" data-tipo="cpDestino" required>
                     <span class="input-message-error">Este campo no es válido</span>
                   <button class="btn btn-secondary" id="calcular-envio">Calcular</button>
                </div>
            <div id="shipping-total" class="mt-2"></div>
          </div>`
        : ""
    }
    <div class="row mt-4">
      <div class=" mt-2">
        <h4>Productos Similares</h4>
        <button id="toggle-similares" class="btn btn-link">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div id="similares-Container" class="collapse">
          <div id="productos-similares" class="d-flex flex-wrap justify-content-center gap-2"></div>
        </div>
      </div>
    </div>
  </div>
  </div>

  `;
  this.cargarProductosSimilares?.();
  this.calcularEnvio?.();
  this.agregarProductoCarrito?.();
  this.compartirProducto?.();
  this.notificacionesSinStock?.();
}
