import { modalControllers } from "../../modal/modal.js";
import { eventListenerBotones } from "./botonesViewer.js";

export const mostrarProducto = async (
  id,
  name,
  price,
  imagePath,
  description,
  sizes,
  hayStock,
  section,
  generalStock
) => {
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const mostrarProducto = modal.querySelector("[data-table]");

  // Crear el HTML del producto con el carrusel integrado
  mostrarProducto.innerHTML = `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <!-- Carrusel de Imágenes -->
          <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              ${imagePath
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
              ${imagePath
                .map(
                  (img, index) => `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                  <img src="${img}" class="d-block w-100" alt="Imagen ${
                    index + 1
                  }">
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
        <div class="col-md-6">
          <h2 class="product-title-bold mt-2" style="font-size: 1.3rem;">${name}</h2>
          <h3 class="product-price text-primary-bold mt-2" style="font-weight: bold; font-size: 1.25em;">$${price}</h3>
          <p class="product-description text-muted">${description}</p>

          ${hayStock ? "" : '<div class="alert alert-warning">Sin stock</div>'}
          ${
            hayStock
              ? ` <div class="product-options">
            ${
              section !== "opcion3"
                ? `
              <label for="variation_1" class="form-label">Talles disponibles</label>
      <select id="variation_1" class="input mb-3">
        ${sizes
          .filter((item) => item.stock > 0)
          .map(
            (item) =>
              `<option value="${item.size}">${item.size} - ( Stock: ${item.stock} )</option>`
          )
          .join("")}
      </select>`
                : ""
            }
            </div>`
              : `<div class="main-container">
                  <div class="text-center">
                    <div class="card-form">
                      <p>¡Notificarme cuando ingrese!</p>
                      <form id="notificacion-form" action="/api/notificacionSinStock" enctype="multipart/form-data" method="POST">
                        <div class="form-group">
                          <label for="email">Email:</label>
                          <input type="email" id="email" class="input" placeholder="nombre@gmail.com " required>
                        </div>
                        <button type="submit" class="btn btn-primary mt-2">Enviar</button>
                      </form>
                    </div>
                  </div>`
          }

          </div>
          ${
            hayStock
              ? `<div class="d-flex justify-content-center mt-3">
            <button type="button" class="btn btn-primary me-2" data-carrito 
              >Añadir carrito</button>
               `
              : ""
          }
           ${
             hayStock
               ? `<a id="compartir-producto" class="btn btn-outline-secondary">
              <i class="fa-solid fa-share-nodes"></i> Compartir
            </a>`
               : ""
           }
           </div><div id="messageContainer" style="display: none;">
  <p id="message" class="alert alert-warning mt-3 text-center"></p>
</div>
          </div>
        </div>
      </div>

      ${
        hayStock
          ? `
       <div class="row mt-4 align-items-center">
  <h5 class="col-12">Calcular envío</h5>
  
  <div class="col-md-8 mt-2">
    <div class="input-container">
      <input type="number" class="input form-control" id="cpDestino" name="cpDestino" placeholder="" data-tipo="cpDestino">
      <label class="input-label" for="cpDestino">Código Postal</label>
      <span class="input-message-error">Este campo no es válido</span>
    </div>
  </div>
  
  <div class="col-md-4 mt-2">
    <button class="btn btn-secondary w-100" id="calcular-envio">
      Calcular
    </button>
  </div>

  <div class="col-12 mt-2">
    <div id="shipping-total"></div>
  </div>
</div>
`
          : ""
      }

      <div class="row mt-4">
        <div class="col-12">
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
  `;

  // Manejar eventos para los botones
  eventListenerBotones(
    id,
    name,
    price,
    imagePath,
    sizes,
    section,
    generalStock
  );
};
