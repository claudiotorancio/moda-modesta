document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get("categoryId");

  if (categoryId) {
    // Aquí puedes hacer una solicitud al servidor para obtener los productos de la categoría
    fetch(`/api/products?categoryId=${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        const productsContainer = document.querySelector("#productsContainer");
        const categoryTitle = document.querySelector("#categoryTitle");

        categoryTitle.textContent = `Productos de la categoría ${categoryId}`;

        if (data.products.length === 0) {
          productsContainer.innerHTML = "<p>No hay productos para mostrar</p>";
        } else {
          productsContainer.innerHTML = data.products
            .map(
              (product) => `
              <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Precio: ${product.price}</p>
              </div>
            `
            )
            .join("");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
        document.querySelector("#productsContainer").innerHTML =
          "<p>Error al cargar los productos.</p>";
      });
  } else {
    document.querySelector("#productsContainer").innerHTML =
      "<p>No se ha seleccionado ninguna categoría.</p>";
  }
});
