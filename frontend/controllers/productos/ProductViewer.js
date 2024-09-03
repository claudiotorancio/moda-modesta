//ProductViewer,js

import { controllers } from "./productos_controllers.js";
import { modalControllers } from "../../modal/modal.js";
// import Carrito from "../carrito/carrito.js";
import {
  handleEnvioFormProduct,
  handleEnvioFormSubmission,
} from "../carrito/envioHandlers.js";

export const mostrarProducto = async (
  name,
  price,
  imagePath,
  sizes,
  description,
  id
) => {
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const mostrarProducto = modal.querySelector("[data-table]");

  mostrarProducto.innerHTML = `
   <div class="row">
  <div class="col-md-6 mx-auto d-flex align-items-center">
    <img class="logo_cabecera" src="https://moda-modesta.s3.us-east-2.amazonaws.com/modesta_logo.png" alt="Moda Modesta Logo" >
    <h5 class="text-muted" style="margin-bottom: 0;">Tienda Virtual Sta Rosa - La Pampa</h5>
  </div>
 <div class="col-md-6 mx-auto">
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="${imagePath}" class="d-block w-100" alt="Imagen 1">
        </div>
        <div class="carousel-item">
          <img src="https://moda-modesta.s3.us-east-2.amazonaws.com/modesta_logo.png" class="d-block w-100" alt="Imagen 2">
        </div>
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

<div class="row mt-4">
  <div class="col-md-6 mx-auto">
    <div class="card-form">
      <h4 class="card-title text-center">${name}</h4>
      <hr>
      <div class="card-text" style="max-height: 200px; overflow-y: auto;">
        ${description}
      </div>
    </div>
    
    <div class="mt-auto pt-3">
      <label for="variation_1" class="form-label">Talles disponibles</label>
      <select id="variation_1" class="form-select mb-3">
        ${sizes
          .map((size) => `<option value="${size}">${size}</option>`)
          .join("")}
      </select>

      <div class="text-center mb-3">
        <a id="compartir-producto" title="Compartir" class="icono-compartir">
          <i class="fa-solid fa-share-nodes"></i>
          <p style="margin: 0;">Compartir</p>
        </a>
      </div>

      <div class="text-center">
        <button type="button" class="btn btn-primary btn-block" data-carrito>Agregar al carrito</button>
      </div>

        <div class="row mt-4">
                <h5>Calcular envio</h5>
                <div class="input-container mt-2">
                      <div class="postal-input-container">
                              <input type="number" class="input" id="cpDestino" name="cpDestino" placeholder="Codigo Postal" data-tipo="cpDestino">
                             
                              <label class="input-label" for="cpDestino">Codigo Postal</label>
                              <span class="input-message-error">Este campo no es válido</span>
                                <i class="fa fa-arrow-right postal-arrow" id="calcular-envio"></i>
                              <div id="shipping-total">
                              </div>
                             
                        </div>
                  </div>
          </div>
                     

      <div class="mt-4">
  <h5>Productos Similares</h5>
  <button id="toggle-similares" class="btn btn-link">
    <i class="fa-solid fa-chevron-down icon-down continuos-move"></i>
  </button>
  <div id="similares-Container" class="collapse">
    <div id="productos-similares" class="d-flex justify-content-center align-items-center gap-3"></div>
  </div>
</div>


      <div class="mt-4">
        <!-- <em style="font-size: 10pt; font-family: Arial, sans-serif; font-style: italic;">
          Se recomienda lavar la prenda a mano con jabón blanco o en lavarropas usando modo delicado sin centrifugado fuerte, utilizando productos que no contengan lavandina ni derivados que puedan dañarla.--!>
        </em>
      </div>
    </div>
  </div>
</div>


  `;

  document
    .getElementById("toggle-similares")
    .addEventListener("click", function () {
      const icon = this.querySelector("i");

      // Alternar entre las clases 'icon-up' y 'icon-down'
      if (icon.classList.contains("icon-down")) {
        icon.classList.remove("icon-down");
        icon.classList.add("icon-up");
      } else {
        icon.classList.remove("icon-up");
        icon.classList.add("icon-down");
      }
    });

  document
    .getElementById("calcular-envio")
    .addEventListener("click", handleEnvioFormProduct.bind(this));

  mostrarProducto
    .querySelector("[data-carrito]")
    .addEventListener("click", () => {
      const talleSeleccionado = document.getElementById("variation_1").value;
      controllers.comprarProducto(
        name,
        price,
        imagePath,
        id,
        talleSeleccionado
      );
    });

  const compartirProducto = document.getElementById("compartir-producto");
  compartirProducto.addEventListener("click", () => {
    const productUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          text: `¡Mira este producto! ${name} por solo $${price}`,
          url: productUrl,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert(
        "La función de compartir no es compatible con tu navegador. Por favor, comparte el enlace manualmente."
      );
    }
  });

  const toggleButton = document.getElementById("toggle-similares");
  const similaresContainer = document.getElementById("similares-Container");

  toggleButton.addEventListener("click", async () => {
    similaresContainer.classList.toggle("show");

    const icon = toggleButton.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");

    if (similaresContainer.classList.contains("show")) {
      try {
        await controllers.cargarProductosSimilares(id);
      } catch (error) {
        console.error("Error al cargar productos similares:", error);
      }
    }
  });
};
