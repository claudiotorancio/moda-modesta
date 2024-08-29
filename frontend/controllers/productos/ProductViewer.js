import { controllers } from "./productos_controllers.js";
import { modalControllers } from "../../modal/modal.js";
import carrito from "../carrito/carrito-controllers.js";

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
    <div class="contenido_container">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <img class="card-img-top" src="${imagePath}" alt="">
        </div>
        <div class="col-md-6 mx-auto d-flex flex-column">
          <div class="card-body">
            <h4 class="card-title">${name}</h4>
            <br>
            <div class="card-text" style="overflow-y: auto;">
              ${description}
            </div>
          </div>
          <div class="mt-auto pt-3">
            <label for="variation_1">Talles disponibles</label>
            <select id="variation_1" class="form-select mb-3">
              ${sizes
                .map((size) => `<option value="${size}">${size}</option>`)
                .join("")}
            </select>
            <div class="mx-auto text-center">
              <a id="compartir-producto" title="Compartir" class="icono-compartir">
                <i class="fa-solid fa-share-nodes"></i>
                <p>Compartir</p>
              </a>
            </div>
            <div class="form-row align-items-center">
              <div class="mx-auto">
                <button type="button" class="btn btn-primary btn-block" data-carrito>Agregar al carrito</button>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3"></div>
            <em style="font-size: 10pt; font-family: Arial, sans-serif; font-style: italic; background-color: transparent; vertical-align: baseline;">
              Se recomienda lavar la prenda a mano con jabón blanco o en lavarropas usando modo delicado sin centrifugado fuerte, utilizando productos que no contengan lavandina ni derivados que puedan dañarla.
            </em>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <h5>Productos Similares</h5>
        <!-- Botón para mostrar/ocultar productos similares -->
        <button id="toggle-similares" class="btn btn-link">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div id="similares-Container" class="collapse">
          <div id="productos-similares" class="d-flex justify-content-center align-items-center gap-3"></div>
        </div>
      </div>
    </div>
  `;

  // Manejar lógica para agregar al carrito
  const producto = {
    _id: id,
    name: name,
    price: price,
    imagePath: imagePath,
  };

  mostrarProducto
    .querySelector("[data-carrito]")
    .addEventListener("click", () => {
      const talleSeleccionado = document.getElementById("variation_1").value;
      carrito.agregarProducto({
        product: producto,
        size: talleSeleccionado,
      });
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
