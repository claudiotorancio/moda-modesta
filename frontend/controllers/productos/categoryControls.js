export async function initializeCategoryControls() {
  const volverBtn = document.createElement("button");
  volverBtn.id = "volverBtn";
  volverBtn.textContent = "Volver";
  document.body.appendChild(volverBtn);

  // Manejador para el evento 'popstate'
  window.addEventListener("popstate", (event) => {
    const state = event.state;
    if (state && state.categoryId) {
      // Manejar el caso en que se navega a una categoría específica
      handleCategoryChange(state.categoryId);
    } else {
      // Manejar el caso en que se navega a la página principal
      handleHomePage();
    }
  });

  const handleCategoryChange = async (categoryId) => {
    try {
      const categoria = document.querySelector(`#${categoryId}`);
      if (categoria) {
        const categoriaBtn = categoria.querySelector("a");
        const contenedorProductos = document.querySelector(
          `[data-${categoryId}]`
        );
        const tarjetas = contenedorProductos.querySelectorAll(".card");

        if (tarjetas.length === 0) {
          contenedorProductos.innerHTML =
            "<p>No hay productos para mostrar</p>";
          return;
        }

        contenedorProductos.classList.add("allProducts");
        tarjetas.forEach((tarjeta) => {
          tarjeta.classList.add("allCard");
        });

        const imagen = contenedorProductos.querySelectorAll(".img-card");
        imagen.forEach((tarjeta) => {
          tarjeta.classList.add("img-allCard");
        });

        document.querySelectorAll(".productos").forEach((contenedor) => {
          if (contenedor !== contenedorProductos) {
            contenedor.innerHTML = "";
          }
        });

        document.querySelectorAll(".categoria").forEach((categoria) => {
          if (!categoria.querySelector(`[data-${categoryId}]`)) {
            categoria.querySelector(".texto-categoria").style.display = "none";
            categoria.querySelector(".productos").innerHTML = "";
          }
        });

        categoriaBtn.textContent = "Volver";
        volverBtn.classList.add("show");
        window.scrollTo({ top: 330, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleHomePage = () => {
    document.querySelectorAll(".productos").forEach((contenedor) => {
      contenedor.innerHTML = "";
    });

    document.querySelectorAll(".categoria").forEach((categoria) => {
      categoria.querySelector(".texto-categoria").style.display = "block";
    });

    volverBtn.classList.remove("show");
  };

  document.querySelectorAll(".categoria").forEach((categoria) => {
    const categoriaBtn = categoria.querySelector("a");
    const opcion = categoriaBtn.getAttribute("id");
    const contenedorProductos = document.querySelector(`[data-${opcion}]`);
    let enInicio = false;

    categoriaBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const tarjetas = contenedorProductos.querySelectorAll(".card");

        if (tarjetas.length === 0) {
          contenedorProductos.innerHTML =
            "<p>No hay productos para mostrar</p>";
          return;
        }

        if (!enInicio) {
          contenedorProductos.classList.add("allProducts");
          tarjetas.forEach((tarjeta) => {
            tarjeta.classList.add("allCard");
          });

          const imagen = contenedorProductos.querySelectorAll(".img-card");
          imagen.forEach((tarjeta) => {
            tarjeta.classList.add("img-allCard");
          });

          document.querySelectorAll(".productos").forEach((contenedor) => {
            if (contenedor !== contenedorProductos) {
              contenedor.innerHTML = "";
            }
          });

          document.querySelectorAll(".categoria").forEach((categoria) => {
            if (!categoria.querySelector(`[data-${opcion}]`)) {
              categoria.querySelector(".texto-categoria").style.display =
                "none";
              categoria.querySelector(".productos").innerHTML = "";
            }
          });

          categoriaBtn.textContent = "Volver";
          enInicio = true;
          volverBtn.classList.add("show");
          window.scrollTo({ top: 330, behavior: "smooth" });
          history.pushState({ categoryId: opcion }, "", `#${opcion}`);
        } else {
          volverBtn.classList.remove("show");
          history.pushState({}, "", "index.html");
          window.location.href = "index.html";
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    });
  });

  document.querySelectorAll(".ver-todos").forEach((enlace) => {
    enlace.addEventListener("click", async function (event) {
      event.preventDefault();
      const contenedorProductos = this.parentElement.nextElementSibling;
      contenedorProductos.classList.toggle("ver-todos-activado");
    });
  });

  volverBtn.addEventListener("click", () => {
    history.pushState({}, "", "index.html");
    window.location.href = "index.html";
  });
}
