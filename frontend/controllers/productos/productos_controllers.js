import { ProductCard } from "../../productoControl/ProductCard.js"; // Ajusta la ruta según tu estructura
import productoServices from "../../services/product_services.js"; // Importa el servicio que obtiene los productos
import { Producto } from "./Producto.js";

export const controllers = {
  //Mostrar productos admin
  async renderProducts() {
    try {
      // Carga los productos destacados
      const productosDestacados = await productoServices.destacadosProducto();
      const contenedorDestacados = document.querySelector("[data-destacados]");

      if (contenedorDestacados) {
        contenedorDestacados.innerHTML = "";

        // Renderiza las tarjetas de los productos destacados
        for (const producto of productosDestacados) {
          `hola todo bien`;
          const hayStock =
            producto.generalStock > 0 || // Verifica stock general para "Diversos"
            producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

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
            producto.section,
            producto.generalStock,
            producto.discount,
            producto.discountExpiry
          );
          contenedorDestacados.appendChild(card.render());
        }
      }

      // Carga la lista de las otras opciones
      const products = await productoServices.listaProductos();

      document.querySelectorAll(".productos").forEach((contenedor) => {
        if (contenedor !== contenedorDestacados) {
          contenedor.innerHTML = "";
        }
      });

      // Renderiza las tarjetas de productos en sus respectivas secciones
      for (const producto of products) {
        const hayStock =
          producto.generalStock > 0 || // Verifica stock general para "Diversos"
          producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

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
          producto.section,
          producto.generalStock,
          producto.discount,
          producto.discountExpiry
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

  //mostrar productos usuario

  async renderInit() {
    try {
      const productosDestacados = await productoServices.destacadosProducto();
      const contenedorDestacados = document.querySelector("[data-destacados]");
      contenedorDestacados.innerHTML = "";

      // Renderizar productos destacados
      for (const producto of productosDestacados) {
        const hayStock =
          producto.generalStock > 0 || // Verifica stock general para "Diversos"
          producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones
        const card = new Producto(
          producto._id,
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          hayStock,
          producto.section,
          producto.generalStock,
          producto.discount,
          producto.discountExpiry
        );
        contenedorDestacados.appendChild(card.productoInicio());
      }

      const products = await productoServices.listaProductos();
      document.querySelectorAll(".productos").forEach((contenedor) => {
        if (contenedor !== contenedorDestacados) {
          contenedor.innerHTML = "";
        }
      });

      // Renderizar productos generales
      for (const producto of products) {
        const hayStock =
          producto.generalStock > 0 || // Verifica stock general para "Diversos"
          producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

        const productCard = new Producto(
          producto._id,
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          hayStock,
          producto.section,
          producto.generalStock,
          producto.discount,
          producto.discountExpiry
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
};
