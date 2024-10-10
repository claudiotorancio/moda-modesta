import { ProductCard } from "../../controllers/productos/ProductCard.js"; // Ajusta la ruta según tu estructura
import productoServices from "../../services/product_services.js"; // Importa el servicio que obtiene los productos
import { ProductInit } from "./ProductInit.js";

export const controllers = {
  //Mostrar productos admin
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

  //mostrar productos usuario

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
          producto.generalStock > 0 || // Verifica stock general para "Diversos"
          producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

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
          producto.generalStock > 0 || // Verifica stock general para "Diversos"
          producto.sizes.some((item) => item.stock > 0); // Verifica stock por talla para otras secciones

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
};
