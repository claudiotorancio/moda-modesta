import productoServices from "../../services/product_services.js";
import { ProductEventHandler } from "../productos/ProductEventHandler.js";

export class RenderStock {
  constructor(titulo) {
    this.titulo = titulo;
  }

  async renderStock() {
    const listaProductos = await productoServices.listaProductos();
    const productos = listaProductos.products;

    // Filtrar por categorías
    const vestidos = productos.filter(
      (producto) => producto.section === "opcion1"
    );
    const polleras = productos.filter(
      (producto) => producto.section === "opcion2"
    );
    const diversos = productos.filter(
      (producto) => producto.section === "opcion3"
    );

    // Limpiar el contenido anterior
    this.titulo.innerHTML = "";

    // Crear las secciones para cada categoría
    const categorias = {
      Vestidos: vestidos,
      Polleras: polleras,
      Diversos: diversos,
    };

    for (const categoria in categorias) {
      if (categorias[categoria].length > 0) {
        const tituloCategoria = `
          <h3 class="mt-4">${categoria}</h3>
          <div id="productos-${categoria}" class="productos-container">
            <!-- Aquí se agregará el cuerpo de los productos -->
          </div>
        `;

        // Insertar título y contenedor de productos de la categoría
        this.titulo.innerHTML += tituloCategoria;

        // Obtener la referencia del contenedor de productos
        const productosContenedor = document.querySelector(
          `#productos-${categoria}`
        );

        // Ordenar productos por stock (productos con problemas de umbral primero)
        const productosOrdenados = categorias[categoria].sort((a, b) => {
          const stockA = a.sizes.reduce((acc, size) => acc + size.stock, 0);
          const stockB = b.sizes.reduce((acc, size) => acc + size.stock, 0);

          if (stockA === 0) return -1; // Sin stock va al principio
          if (stockB === 0) return 1;
          if (stockA < 10) return -1; // Stock bajo va antes de stock suficiente
          if (stockB < 10) return 1;
          return 0;
        });

        productosOrdenados.forEach((producto) => {
          const { _id, name, sizes, price } = producto;

          // Crear un contenedor para cada producto
          const productoDiv = document.createElement("div");
          productoDiv.classList.add("producto");
          productoDiv.style.border = "2px solid #000"; // Borde exterior
          productoDiv.style.padding = "10px";
          productoDiv.style.marginBottom = "10px";
          productoDiv.style.backgroundColor = "#fff"; // Fondo blanco

          // Crear una tabla dentro del contenedor del producto
          const productoTable = document.createElement("table");
          productoTable.style.width = "100%";
          productoTable.style.borderCollapse = "collapse";
          productoTable.style.backgroundColor = "#fff"; // Fondo blanco

          const thead = document.createElement("thead");
          thead.innerHTML = `
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Talle</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          `;

          const tbody = document.createElement("tbody");

          let priceShown = false; // Para mostrar el precio solo una vez

          sizes.forEach((size, index) => {
            const row = document.createElement("tr");

            // Determinar la clase según el stock
            let stockClass = "";
            if (size.stock === 0) {
              stockClass = "sin-stock"; // Sin stock
            } else if (size.stock < 10) {
              stockClass = "stock-bajo"; // Stock bajo
            }

            row.innerHTML = `
              <td>${index === 0 ? _id : ""}</td>
              <td>${index === 0 ? name : ""}</td>
              <td>${size.size}</td>
              <td>${size.stock}</td>
              <td>${!priceShown ? price : ""}</td>
              <td class="${stockClass}">${
              size.stock > 0
                ? size.stock < 10
                  ? "Bajo stock"
                  : "En stock"
                : "Sin stock"
            }</td>
              <td>${
                index === 0
                  ? `<button type="button" class="btn btn-info ver-detalles" data-id="${_id}">actualizar</button>`
                  : ""
              }</td>
            `;

            tbody.appendChild(row);
            priceShown = true; // Mostrar el precio solo en la primera fila
          });

          productoTable.appendChild(thead);
          productoTable.appendChild(tbody);

          productoDiv.appendChild(productoTable);

          productosContenedor.appendChild(productoDiv);
        });

        // Añadir el event listener a los botones "Ver detalles"
        this.agregarEventListenerBotones();
      }
    }
  }

  async agregarEventListenerBotones() {
    // Capturar todos los botones "Ver detalles" y agregar el event listener
    const botonesDetalles = document.querySelectorAll(".ver-detalles");
    botonesDetalles.forEach((boton) => {
      boton.addEventListener("click", async (event) => {
        const idProducto = event.target.dataset.id;

        // Obtener los detalles del producto
        try {
          const response = await productoServices.detalleProducto(idProducto);
          if (!response || !response.product) {
            throw new Error("Datos del producto no disponibles");
          }

          const { name, price, imagePath, description, sizes, isFeatured } =
            response.product;

          // Llamar a ProductEventHandler.handleEdit con todos los parámetros
          ProductEventHandler.handleEdit(
            name,
            price,
            imagePath,
            description,
            sizes,
            idProducto,
            isFeatured
          );
        } catch (error) {
          console.error("Error al obtener los detalles del producto:", error);
          alert("Ocurrió un error al obtener los detalles del producto.");
        }
      });
    });
  }

  mostrarDetalles(id) {
    // Implementa la lógica para mostrar los detalles del producto
    ProductEventHandler.handleEdit(id);
    alert(`Mostrar detalles del producto con ID: ${id}`);
  }
}
