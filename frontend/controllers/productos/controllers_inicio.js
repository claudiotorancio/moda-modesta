import productoServices from "../../services/product_services.js";
import { mostrarProducto } from "./ProductViewer.js";

class ProductInit {
  constructor() {
    this.setupPopstateListener();
  }

  setupPopstateListener() {
    window.addEventListener("popstate", (event) => {
      const modal = document.getElementById("modal");

      // Si hay un hash y el modal está abierto
      if (
        window.location.hash.startsWith("#product-") &&
        modal.style.display === "block"
      ) {
        modal.style.display = "none"; // Cerrar el modal
        window.location.hash = ""; // Limpiar el hash
      }

      // Manejar la navegación hacia atrás para las categorías
      const opcion = window.location.hash.replace("#", "");
      if (opcion.startsWith("product-")) {
        // No hay acción específica aquí ya que se manejará en la función `hashControllers`
      } else {
        // Volver a cargar el estado de las categorías
        this.cargarEstadoCategorias(opcion);
      }
    });
  }

  cargarEstadoCategorias(opcion) {
    // Aquí puedes re-renderizar las categorías según el estado
    document.querySelectorAll(".categoria").forEach((categoria) => {
      const categoriaBtn = categoria.querySelector("a");
      const id = categoriaBtn.getAttribute("id");

      if (id === opcion) {
        categoriaBtn.textContent = "Volver";
        categoria.querySelector(".productos").classList.add("allProducts");
        // Otros ajustes si es necesario
      } else {
        categoriaBtn.textContent = "Ver más";
        categoria.querySelector(".productos").innerHTML = "";
      }
    });
  }

  productoInicio(name, price, imagePath, description, sizes, id) {
    const card = document.createElement("div");
    const contenido = `
      <div class="container mx-auto mt-4">
        <div class="img-card">
          <img class="card-img-top" src="${imagePath}" alt="">
        </div>
        <div class="card-body">
          <a href="#">ver producto</a>
          <h3 class="card-title">${name}</h3>
          <p class="card-text">${"$" + price}</p>
        </div>
      </div>
    `;

    card.innerHTML = contenido;
    card.classList.add("card");

    card.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      // Actualiza la URL con un hash que incluye el ID del producto
      window.location.hash = `product-${id}`;

      try {
        mostrarProducto(name, price, imagePath, sizes, description, id);
        // Empujar el estado al historial para que "Atrás" funcione correctamente
        history.pushState({ id }, "", `#product-${id}`);
      } catch (err) {
        console.log(err);
      }
    });

    return card;
  }

  async renderInit() {
    try {
      // Renderizar productos destacados
      const productosDestacados = await productoServices.destacadosProducto();
      const contenedorDestacados = document.querySelector("[data-destacados]");

      if (Array.isArray(productosDestacados)) {
        contenedorDestacados.innerHTML = ""; // Limpiar contenedor de destacados
        for (const producto of productosDestacados) {
          const card = this.productoInicio(
            producto.name,
            producto.price,
            producto.imagePath,
            producto.description,
            producto.sizes,
            producto._id
          );
          contenedorDestacados.appendChild(card);
        }
      } else {
        console.error("Error: No se recibieron productos destacados.");
      }

      // Renderizar otras categorías
      const listaProductos = await productoServices.renderInicio();
      const products = listaProductos;

      // Limpiar todos los contenedores de categorías antes de renderizar
      document.querySelectorAll(".productos").forEach((contenedor) => {
        if (contenedor !== contenedorDestacados) {
          contenedor.innerHTML = ""; // Limpiar contenido existente
        }
      });

      for (const producto of products) {
        const productCard = this.productoInicio(
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          producto._id
        );

        // Renderizar el producto y adjuntar al contenedor adecuado
        document
          .querySelector(`[data-${producto.section}]`)
          .appendChild(productCard);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

document.querySelectorAll(".categoria").forEach((categoria) => {
  const categoriaBtn = categoria.querySelector("a");
  const opcion = categoriaBtn.getAttribute("id");
  const contenedorProductos = document.querySelector(`[data-${opcion}]`);
  let enInicio = false; // Variable para mantener el estado de visualización

  categoriaBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Evitar comportamiento predeterminado del enlace

    try {
      // Verificar si hay productos disponibles en la categoría
      const tarjetas = contenedorProductos.querySelectorAll(".card");

      if (tarjetas.length === 0) {
        // No hay productos, mostrar mensaje de "sitio en construcción"
        contenedorProductos.innerHTML = "<p>No hay productos para mostrar</p>";
        return; // Salir del evento sin realizar otras acciones
      }

      // Si aún no se han mostrado todos los productos
      if (!enInicio) {
        contenedorProductos.classList.add("allProducts");

        tarjetas.forEach((tarjeta) => {
          tarjeta.classList.add("allCard");
        });

        const imagen = contenedorProductos.querySelectorAll(".img-card");
        imagen.forEach((tarjeta) => {
          tarjeta.classList.add("img-allCard");
        });

        // Limpiar contenido de las secciones diferentes a la actual
        document.querySelectorAll(".productos").forEach((contenedor) => {
          if (contenedor !== contenedorProductos) {
            contenedor.innerHTML = ""; // Limpiar contenido existente
          }
        });

        // Ocultar las demás categorías
        document.querySelectorAll(".categoria").forEach((categoria) => {
          if (!categoria.querySelector(`[data-${opcion}]`)) {
            categoria.querySelector(".texto-categoria").style.display = "none";
            categoria.querySelector(".productos").innerHTML = "";
          }
        });

        // Cambiar el texto del enlace a 'Volver'
        categoriaBtn.textContent = "Volver";

        // Agregar estado al historial
        history.pushState({ opcion }, "", `#${opcion}`);

        enInicio = true; // Cambiar el estado para volver

        // Desplazar la página hacia arriba
        window.scrollTo({ top: 330, behavior: "smooth" });
      } else {
        // Si ya se han mostrado todos los productos, redirigir a la página de inicio
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      // Manejar el error de manera adecuada
    }
  });
});

export const productosInicio = new ProductInit();
