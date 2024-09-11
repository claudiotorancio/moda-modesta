const volverBtn = document.createElement("button");
volverBtn.id = "volverBtn";
volverBtn.textContent = "Volver";
document.body.appendChild(volverBtn);

export function initializeCategoryControls() {
  document.querySelectorAll(".categoria").forEach((categoria) => {
    const categoriaBtn = categoria.querySelector("a");
    const opcion = categoriaBtn.getAttribute("id");
    const contenedorProductos = document.querySelector(`[data-${opcion}]`);
    let enInicio = false;

    categoriaBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!enInicio) {
        handleCategorySelection(contenedorProductos, categoriaBtn, opcion);
        enInicio = true;
      } else {
        handleReturn();
        enInicio = false;
      }
    });
  });

  document.querySelectorAll(".ver-todos").forEach((enlace) => {
    enlace.addEventListener("click", function (event) {
      event.preventDefault();
      this.parentElement.nextElementSibling.classList.toggle(
        "ver-todos-activado"
      );
    });
  });

  volverBtn.addEventListener("click", () => {
    handleReturn();
  });
}

function handleCategorySelection(contenedorProductos, categoriaBtn, opcion) {
  try {
    const tarjetas = contenedorProductos.querySelectorAll(".card");

    if (tarjetas.length === 0) {
      contenedorProductos.innerHTML = "<p>No hay productos para mostrar</p>";
      return;
    }

    contenedorProductos.classList.add("allProducts");
    tarjetas.forEach((tarjeta) => tarjeta.classList.add("allCard"));

    const imagen = contenedorProductos.querySelectorAll(".img-card");
    imagen.forEach((tarjeta) => tarjeta.classList.add("img-allCard"));

    document.querySelectorAll(".productos").forEach((contenedor) => {
      if (contenedor !== contenedorProductos) {
        contenedor.innerHTML = "";
      }
    });

    document.querySelectorAll(".categoria").forEach((categoria) => {
      if (!categoria.querySelector(`[data-${opcion}]`)) {
        categoria.querySelector(".texto-categoria").style.display = "none";
        categoria.querySelector(".productos").innerHTML = "";
      }
    });

    categoriaBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Volver`;
    volverBtn.classList.add("show"); // Mostrar el botón "Volver"
    document.querySelector(".busqueda").style.display = "block"; // Ocultar el buscador
    document.querySelector("#searchInput").setAttribute("disabled", true); // Deshabilitar el input de búsqueda
    document.querySelector(".button-busqueda").setAttribute("disabled", true); // Deshabilitar el botón de búsqueda
    window.scrollTo({ top: 200, behavior: "smooth" });
    history.pushState({ categoryId: opcion }, "", `#${opcion}`);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

function handleReturn() {
  volverBtn.classList.remove("show"); // Ocultar el botón "Volver"
  document.querySelector(".busqueda").style.display = "block"; // Mostrar el buscador
  document.querySelector("#searchInput").removeAttribute("disabled"); // Habilitar el input de búsqueda
  document.querySelector(".button-busqueda").removeAttribute("disabled"); // Habilitar el botón de búsqueda
  history.pushState({}, "", "index.html");
  window.location.href = "index.html";
}
