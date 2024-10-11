import productoServices from "../services/product_services.js";
import { mostrarProducto } from "./productos/ProductViewer.js";
import { modalControllers } from "../modal/modal.js";

export async function hashControllers() {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith("#product-")) {
      console.error("URL no válida para un producto.");
      return;
    }

    const id = hash.replace("#product-", "").trim();
    if (!id) {
      console.error("ID del producto no encontrado en el hash.");
      return;
    }

    const producto = await productoServices.detalleProducto(id);

    if (!producto) {
      console.error("Producto no encontrado en la respuesta de la API.");
      return;
    }

    // Verificar si el producto está activo o pausado
    const isActive =
      producto.isActive !== undefined ? producto.isActive : producto.isAcative;

    // Si el producto está activo, lo mostramos normalmente
    if (isActive) {
      const hayStock =
        producto.generalStock > 0 || // Verifica stock general para "Diversos"
        producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

      mostrarProducto(
        producto._id,
        producto.name,
        producto.price,
        producto.imagePath,
        producto.description,
        producto.sizes, // Pasar las tallas con su stock
        hayStock,
        producto.section,
        producto.generalStock
      );
    }

    // Si el producto está pausado, mostramos un HTML personalizado
    else {
      mostrarProductoPausado(
        producto.name,
        producto.imagePath,
        producto.isAcative
      );
    }
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
  }
}

function mostrarProductoPausado(name, imagePath, isActive) {
  console.log(name);
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

          ${
            isActive
              ? ""
              : '<div class="alert alert-warning">Producto pausdo</div>'
          }
      
  `;
}
