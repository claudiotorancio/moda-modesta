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

  volverBtn.addEventListener("click", () => {
    handleReturn();
  });
}

function handleCategorySelection(contenedorProductos, categoriaBtn, opcion) {
  try {
    const tarjetas = contenedorProductos.querySelectorAll(".card");
    const tarjetasPorPagina = 8; // Número de tarjetas que se mostrarán inicialmente
    let tarjetasMostradas = 0;

    if (tarjetas.length === 0) {
      contenedorProductos.innerHTML = "<p>No hay productos para mostrar</p>";
      return;
    }

    // Mostrar las primeras tarjetas
    mostrarTarjetas(tarjetas, tarjetasMostradas, tarjetasPorPagina);
    tarjetasMostradas += tarjetasPorPagina;

    // Escuchar el evento de scroll para cargar más tarjetas
    const cargarMasTarjetas = () => {
      // Verifica si estamos cerca del final de la página
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200
      ) {
        mostrarTarjetas(tarjetas, tarjetasMostradas, tarjetasPorPagina);
        tarjetasMostradas += tarjetasPorPagina;

        // Si no hay más tarjetas para mostrar, elimina el listener del scroll
        if (tarjetasMostradas >= tarjetas.length) {
          window.removeEventListener("scroll", cargarMasTarjetas);
        }
      }
    };

    window.addEventListener("scroll", cargarMasTarjetas);

    contenedorProductos.classList.add("allProducts");

    // Aplicar estilo visual a todas las tarjetas iniciales
    aplicarEstiloTarjetas(tarjetas);

    // Ocultar otras categorías
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
    window.scrollTo({ top: 200, behavior: "smooth" });
    history.pushState({ categoryId: opcion }, "", `#${opcion}`);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

function mostrarTarjetas(tarjetas, inicio, limite) {
  for (let i = inicio; i < inicio + limite && i < tarjetas.length; i++) {
    tarjetas[i].classList.add("show");
    tarjetas[i].style.display = "block"; // Asegura que las tarjetas sean visibles
  }
}

function aplicarEstiloTarjetas(tarjetas) {
  tarjetas.forEach((tarjeta) => {
    tarjeta.classList.add("allCard"); // Asegúrate de que tengan las mismas clases de estilo
    const imagen = tarjeta.querySelector(".img-card");
    if (imagen) {
      imagen.classList.add("img-allCard");
    }
  });
}

function handleReturn() {
  volverBtn.classList.remove("show"); // Ocultar el botón "Volver"
  history.pushState({}, "", "index.html");
  window.location.href = "index.html";
}
