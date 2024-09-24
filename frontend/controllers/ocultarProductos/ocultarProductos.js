export function ocultarProductos() {
  document.querySelectorAll(".categoria").forEach((categoria) => {
    const categoriaBtn = categoria.querySelector("a");
    const opcion = categoriaBtn.getAttribute("id");
    const contenedorProductos = document.querySelector(`[data-${opcion}]`);
    document.querySelectorAll(".productos").forEach((contenedor) => {
      if (contenedor !== contenedorProductos) {
        contenedor.innerHTML = "";
      }
    });

    document.querySelectorAll(".categoria").forEach((categoria) => {
      if (categoria.querySelector(`[data-${opcion}]`)) {
        categoria.querySelector(".texto-categoria").style.display = "none";
        categoria.querySelector(".productos").innerHTML = "";
      }
    });
  });
}
