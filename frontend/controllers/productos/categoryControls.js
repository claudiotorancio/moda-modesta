export async function initializeCategoryControls() {
  const volverBtn = document.createElement("button");
  volverBtn.id = "volverBtn";
  volverBtn.textContent = "Volver";
  document.body.appendChild(volverBtn);

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
          volverBtn.classList.add("show"); // Mostrar el botón "Volver"
          window.scrollTo({ top: 330, behavior: "smooth" });
          history.pushState({ categoryId: opcion }, "", `#${opcion}`);
        } else {
          volverBtn.classList.remove("show"); // Ocultar el botón "Volver"
          history.pushState({}, "", "index.html"); // Usa pushState en lugar de replaceState
          window.location.href = "index.html"; // Recargar la página opcionalmente
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

  // Agregar un evento de clic al botón "Volver"
  volverBtn.addEventListener("click", async () => {
    history.pushState({}, "", "index.html");
    window.location.href = "index.html";
  });
}
