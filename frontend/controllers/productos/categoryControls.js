import productoServices from "../../services/product_services.js";
import { ProductCard } from "./ProductCard.js";
import { ProductInit } from "./ProductInit.js";

export async function initializeCategoryControls() {
  const productos = await productoServices.listaProductos();

  // Obtener la opción de la query string
  const urlParams = new URLSearchParams(window.location.search);
  const opcion = urlParams.get("section"); // 'section' es la clave de la query string
  console.log(opcion);
  if (!opcion) {
    console.warn("No se ha seleccionado ninguna categoría.");
    return; // Redirigir a la página principal si es necesario
  }

  // Ocultar otros contenedores
  document.querySelectorAll(".categoria").forEach((categoria) => {
    if (!categoria.querySelector(`[data-${opcion}]`)) {
      categoria.querySelector(".texto-categoria").style.display = "none";
      categoria.querySelector(".productos").innerHTML = "";
    }
  });

  let productosFiltrados;

  // Filtrar los productos por la categoría seleccionada
  if (opcion === "destacados") {
    productosFiltrados = await productoServices.destacadosProducto();
  } else {
    productosFiltrados = productos.filter(
      (producto) => producto.section === opcion
    );
  }

  // Seleccionamos el contenedor de la sección actual
  const contenedorSeccion = document.querySelector(`[data-${opcion}]`);
  if (!contenedorSeccion) return; // Salir si no se encuentra el contenedor

  // Limpiar el contenedor antes de cargar productos
  contenedorSeccion.innerHTML = "";

  // Variables para controlar la carga progresiva
  const productosPorPagina = 4; // Mostramos 8 productos por bloque
  let paginaActual = 0;
  let cargando = false;

  // **Crear botón de "Volver"**
  const volverBtn = document.createElement("button");
  volverBtn.id = "volverBtn";
  volverBtn.textContent = "ir a inicio";
  volverBtn.classList.add("show");
  document.body.appendChild(volverBtn);
  volverBtn.onclick = () => {
    window.location.href = "index.html"; // O puedes usar window.location.href = "index.html";
  };

  if (productosFiltrados.length === 0) {
    contenedorSeccion.innerHTML = "<p>No hay productos para mostrar</p>";
    return;
  }

  // Función para cargar productos en bloques
  const cargarProductos = async () => {
    if (cargando) return; // Evitar múltiples llamadas a la vez
    cargando = true;

    try {
      const inicio = paginaActual * productosPorPagina;
      const fin = inicio + productosPorPagina;

      // Si ya se han cargado todos los productos, detener la carga
      if (inicio >= productosFiltrados.length) {
        window.removeEventListener("scroll", manejarScroll);
        return;
      }

      const productosBloque = productosFiltrados.slice(inicio, fin);

      for (const producto of productosBloque) {
        const hayStock = producto.sizes.some((item) => item.stock > 0);
        const productCategory = new ProductInit(
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          producto._id,
          hayStock
        );

        // Intentar obtener el usuario desde sessionStorage (mejora en la verificación)
        const user = sessionStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;

        // Definir variable para la tarjeta del producto
        let tarjetaProducto;

        // Si hay un usuario administrador, crea la tarjeta de ProductCard
        if (parsedUser) {
          tarjetaProducto = new ProductCard(
            producto.name,
            producto.price,
            producto.imagePath,
            producto.description,
            producto.sizes,
            producto._id,
            hayStock
          ).render(); // Crear producto para admin
        } else {
          // Si no hay usuario o no es admin, crear tarjeta de productoInicio
          tarjetaProducto = productCategory.productoInicio(); // Crear la tarjeta del producto para usuario
        }

        // Añadir clases a la tarjeta y la imagen
        tarjetaProducto.classList.add("allCard");

        const imagenProducto = tarjetaProducto.querySelector(".img-card");
        if (imagenProducto) {
          imagenProducto.classList.add("img-allCard");
        }

        // Agregar la tarjeta al contenedor de la sección
        contenedorSeccion.appendChild(tarjetaProducto);
        contenedorSeccion.classList.add("allProducts");
        contenedorSeccion.classList.add("ver-todos-activado");
      }

      // Incrementar la página actual para cargar más productos en la próxima vez
      paginaActual++;
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    } finally {
      // Restablecer el estado de carga
      cargando = false;
    }
  };

  // Cargar los primeros productos inicialmente
  cargarProductos();

  // Función que detecta cuando se llega al final de la página
  const manejarScroll = () => {
    const scrollPos = window.innerHeight + window.scrollY;
    const scrollMax = document.body.offsetHeight - 200; // Ajustar si es necesario

    if (scrollPos >= scrollMax) {
      // Cargar más productos cuando se llegue al final
      cargarProductos();
    }
  };

  // Agregar un listener para el evento popstate
  window.addEventListener("popstate", function (event) {
    const modal = document.getElementById("modal"); // Cambia #myModal por el ID o clase de tu modal
    // Verificar si el modal está abierto
    if ((modal.style.display = "block")) {
      // Si el modal está abierto, solo ciérralo
      modal.style.display = "none"; // Aquí depende de cómo cierras tu modal
      history.pushState(null, null, window.location.href); // Reemplaza el estado actual sin hash
    } else {
      // Si el modal no está abierto, redirigir a index.html
      window.location.href = "index.html"; // Redirigir a index.html
    }
  });

  // Agregar evento de scroll
  window.addEventListener("scroll", manejarScroll);
}
