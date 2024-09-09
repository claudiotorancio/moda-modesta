export function initializeCategoryControls() {
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
        const containers = contenedorProductos.querySelectorAll(".container");
        const lupas = contenedorProductos.querySelectorAll(".overlay-icon");

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

          containers.forEach((contenedor) => {
            contenedor.style.display = "block";
          });

          lupas.forEach((lupa) => {
            lupa.classList.add("overlay-icon1");
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

          categoriaBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Volver`;
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

  // Agregar un evento de clic al botón "Volver"
  volverBtn.addEventListener("click", () => {
    history.pushState({}, "", "index.html");
    window.location.href = "index.html";
  });
}
