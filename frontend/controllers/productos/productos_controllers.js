import { ProductCard } from "../../controllers/productos/ProductCard.js"; // Ajusta la ruta según tu estructura
import productoServices from "../../services/product_services.js"; // Importa el servicio que obtiene los productos
import { mostrarProducto } from "./ProductViewer.js";
import Carrito from "../carrito/carrito.js";
import { ProductInit } from "./ProductInit.js";

const carrito = new Carrito();

export const controllers = {
  async renderProducts() {
    try {
      // Carga los productos destacados
      const productosDestacados = await productoServices.destacadosProducto();
      const contenedorDestacados = document.querySelector("[data-destacados]");

      if (contenedorDestacados) {
        contenedorDestacados.innerHTML = "";

        // Ordena los productos por disponibilidad de stock, incluyendo sección "Diversos"
        const productosConStock = productosDestacados.filter(
          (producto) =>
            producto.section === "opcion3"
              ? producto.generalStock > 0 // Verifica el stock general para "Diversos"
              : producto.sizes.some((item) => item.stock > 0) // Verifica el stock por talla para otras secciones
        );
        const productosSinStock = productosDestacados.filter(
          (producto) =>
            producto.section === "opcion3"
              ? producto.generalStock === 0 // Sin stock general para "Diversos"
              : !producto.sizes.some((item) => item.stock > 0) // Sin stock por talla para otras secciones
        );
        const productosOrdenados = [...productosConStock, ...productosSinStock]; // Productos con stock primero

        // Renderiza las tarjetas de los productos destacados
        for (const producto of productosOrdenados) {
          const hayStock =
            producto.section === "opcion3"
              ? producto.generalStock > 0 // Verifica stock general para "Diversos"
              : producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

          const card = new ProductCard(
            producto._id,
            producto.name,
            producto.price,
            producto.imagePath,
            producto.description,
            producto.sizes,
            hayStock,
            producto.isFeatured,
            producto.isActive,
            producto.inCart,
            producto.generalStock
          );
          contenedorDestacados.appendChild(card.render());
        }
      }

      // Carga la lista de productos del admin
      const products = await productoServices.listaProductos();

      document.querySelectorAll(".productos").forEach((contenedor) => {
        if (contenedor !== contenedorDestacados) {
          contenedor.innerHTML = "";
        }
      });

      // Ordena los productos por stock, incluyendo sección "Diversos"
      const productosConStock = products.filter(
        (producto) =>
          producto.section === "opcion3"
            ? producto.generalStock > 0 // Verifica el stock general para "Diversos"
            : producto.sizes.some((item) => item.stock > 0) // Verifica el stock por talla para otras secciones
      );
      const productosSinStock = products.filter(
        (producto) =>
          producto.section === "opcion3"
            ? producto.generalStock === 0 // Sin stock general para "Diversos"
            : !producto.sizes.some((item) => item.stock > 0) // Sin stock por talla para otras secciones
      );
      const productosOrdenados = [...productosConStock, ...productosSinStock]; // Productos con stock primero

      // Renderiza las tarjetas de productos en sus respectivas secciones
      for (const producto of productosOrdenados) {
        const hayStock =
          producto.section === "opcion3"
            ? producto.generalStock > 0 // Verifica stock general para "Diversos"
            : producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

        const productCard = new ProductCard(
          producto._id,
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          hayStock,
          producto.isFeatured,
          producto.isActive,
          producto.inCart,
          producto.generalStock
        );

        const contenedorSeccion = document.querySelector(
          `[data-${producto.section}]`
        );
        if (contenedorSeccion) {
          contenedorSeccion.appendChild(productCard.render());
        }
      }
    } catch (error) {
      console.log("Error al renderizar productos:", error);
    }
  },

  async renderInit() {
    try {
      const productosDestacados = await productoServices.destacadosProducto();
      const contenedorDestacados = document.querySelector("[data-destacados]");
      contenedorDestacados.innerHTML = "";

      // Ordenar los productos destacados por disponibilidad de stock, incluyendo sección "Diversos"
      const destacadosConStock = productosDestacados.filter(
        (producto) =>
          producto.section === "opcion3"
            ? producto.generalStock > 0 // Verifica el stock general para "Diversos"
            : producto.sizes.some((item) => item.stock > 0) // Verifica el stock por talla para otras secciones
      );
      const destacadosSinStock = productosDestacados.filter(
        (producto) =>
          producto.section === "opcion3"
            ? producto.generalStock === 0 // Sin stock general para "Diversos"
            : !producto.sizes.some((item) => item.stock > 0) // Sin stock por talla para otras secciones
      );
      const destacadosOrdenados = [
        ...destacadosConStock,
        ...destacadosSinStock,
      ]; // Productos con stock primero

      // Renderizar productos destacados
      for (const producto of destacadosOrdenados) {
        const hayStock =
          producto.section === "opcion3"
            ? producto.generalStock > 0 // Verifica stock general para "Diversos"
            : producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

        const card = new ProductInit(
          producto._id,
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          hayStock,
          producto.section,
          producto.generalStock
        );
        contenedorDestacados.appendChild(card.productoInicio());
      }

      const products = await productoServices.listaProductos();
      document.querySelectorAll(".productos").forEach((contenedor) => {
        if (contenedor !== contenedorDestacados) {
          contenedor.innerHTML = "";
        }
      });

      // Ordenar los productos generales por disponibilidad de stock, incluyendo sección "Diversos"
      const productosConStockGenerales = products.filter(
        (producto) =>
          producto.section === "opcion3"
            ? producto.generalStock > 0 // Verifica el stock general para "Diversos"
            : producto.sizes.some((item) => item.stock > 0) // Verifica el stock por talla para otras secciones
      );
      const productosSinStockGenerales = products.filter(
        (producto) =>
          producto.section === "opcion3"
            ? producto.generalStock === 0 // Sin stock general para "Diversos"
            : !producto.sizes.some((item) => item.stock > 0) // Sin stock por talla para otras secciones
      );
      const productosOrdenadosGenerales = [
        ...productosConStockGenerales,
        ...productosSinStockGenerales,
      ]; // Productos con stock primero

      // Renderizar productos generales
      for (const producto of productosOrdenadosGenerales) {
        const hayStock =
          producto.section === "opcion3"
            ? producto.generalStock > 0 // Verifica stock general para "Diversos"
            : producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

        const productCard = new ProductInit(
          producto._id,
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          hayStock,
          producto.section,
          producto.generalStock
        );

        const contenedorSeccion = document.querySelector(
          `[data-${producto.section}]`
        );
        if (contenedorSeccion) {
          contenedorSeccion.appendChild(productCard.productoInicio());
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  async cargarProductosSimilares(id) {
    try {
      const data = await productoServices.productoSimilar(id);
      const similares = data.slice(0, 3); // Limitar a los primeros 3 productos

      const contenedorSimilares = document.getElementById(
        "productos-similares"
      );
      if (!contenedorSimilares) {
        console.error("Contenedor de productos similares no encontrado.");
        return;
      }

      // Verificar si hay productos similares
      if (similares.length === 0) {
        contenedorSimilares.innerHTML = `<p>No se encontraron productos similares.</p>`;
        return;
      }

      // Construir HTML de productos similares
      let productosHTML = "";
      similares.forEach((producto) => {
        const hayStock =
          producto.section === "opcion3"
            ? producto.generalStock > 0 // Verifica el stock general para "Diversos"
            : producto.sizes.some((item) => item.stock > 0); // Verifica el stock por talla para otras secciones

        productosHTML += `
          <div class="producto-similar" data-id="${producto._id}" data-name="${
          producto.name
        }" data-price="${producto.price}" data-image='${JSON.stringify(
          producto.imagePath
        )}' data-sizes='${JSON.stringify(producto.sizes)}' data-description="${
          producto.description
        }" data-stock="${hayStock}">
            <a href="#">
              <img src="${producto.imagePath[0]}" alt="${
          producto.name
        }" class="img-thumbnail">
              <p>${producto.name}</p>
              <p>$ ${producto.price}</p>
            </a>
          </div>
        `;
      });
      contenedorSimilares.innerHTML = productosHTML;

      // Manejo de eventos para productos similares
      contenedorSimilares.addEventListener("click", async (e) => {
        const target = e.target.closest(".producto-similar");
        if (target) {
          const id = target.dataset.id;
          const name = target.dataset.name;
          const price = target.dataset.price;
          const imagePath = JSON.parse(target.dataset.image); // Asegúrate de que esto sea un array
          const description = target.dataset.description;
          const sizes = JSON.parse(target.dataset.sizes);
          const hayStock = target.dataset.stock === "true"; // Recuperar el stock ya calculado

          window.location.hash = `product-${id}`;

          const producto = await productoServices.detalleProducto(id);

          if (!producto) {
            console.error("Producto no encontrado en la respuesta de la API.");
            return;
          }

          try {
            await mostrarProducto(
              id,
              name,
              price,
              imagePath,
              description,
              sizes,
              hayStock
            );
          } catch (error) {
            console.error("Error al mostrar producto:", error);
          }
        }
      });

      // Manejo de eventos para enlaces
      const enlaces = contenedorSimilares.querySelectorAll("a");
      enlaces.forEach((enlace) => {
        enlace.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.hash = `product-${id}`;
        });
      });
    } catch (error) {
      console.error("Error al cargar productos similares:", error);
    }
  },

  async comprarProducto(id, name, price, imagePath, sizes, talleSeleccionado) {
    try {
      // Encontrar el objeto del tamaño seleccionado en el array sizes
      const sizeObject = sizes.find((item) => item.size === talleSeleccionado);

      // Verificar si se encontró el objeto del tamaño
      if (!sizeObject) {
        console.error("Talla seleccionada no disponible.");
        return alert("La talla seleccionada no está disponible.");
      }

      // Obtener el stock del talle seleccionado
      const stockSeleccionado = sizeObject.stock;

      // Crear objeto de producto
      const producto = {
        _id: id,
        name: name,
        price: price,
        imagePath: imagePath,
        stock: stockSeleccionado, // Solo el stock del talle seleccionado
      };

      // Agregar producto al carrito
      await carrito.agregarProducto({
        product: producto,
        size: talleSeleccionado,
      });
    } catch (error) {
      console.error("Error al comprar producto:", error);
    }
  },
};
