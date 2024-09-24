// RenderStock.js

import productoServices from "../../services/product_services.js";

import { ProductEventHandler } from "../productos/ProductEventHandler.js";

export class RenderStock {
  constructor(titulo) {
    this.titulo = titulo;
  }

  async renderStock() {
    const productos = await productoServices.listaProductosAdmin();

    const categorias = {
      Vestidos: productos.filter((producto) => producto.section === "opcion1"),
      Polleras: productos.filter((producto) => producto.section === "opcion2"),
      Diversos: productos.filter((producto) => producto.section === "opcion3"),
    };

    this.titulo.innerHTML = "";

    for (const categoria in categorias) {
      if (categorias[categoria].length > 0) {
        const tituloCategoria = `
          <h3 class="mt-4">${categoria}</h3>
          <div id="productos-${categoria}" class="productos-container"></div>
        `;
        this.titulo.innerHTML += tituloCategoria;

        const productosContenedor = document.querySelector(
          `#productos-${categoria}`
        );

        const productosOrdenados = categorias[categoria].sort((a, b) => {
          const stockA = a.sizes.reduce((acc, size) => acc + size.stock, 0);
          const stockB = b.sizes.reduce((acc, size) => acc + size.stock, 0);
          return stockA === 0 ? -1 : stockB === 0 ? 1 : stockA < 10 ? -1 : 1;
        });

        productosOrdenados.forEach((producto) => {
          const { _id, name, sizes, price, isActive, isFeatured } = producto;
          const productoDiv = this.createProductElement(
            _id,
            name,
            sizes,
            price,
            isActive,
            isFeatured
          );
          productosContenedor.appendChild(productoDiv);
        });
      }
    }

    // Añadir el event listener a los botones "Ver detalles" y "Desactivar/Activar"
    this.agregarEventListenerBotones();
  }

  createProductElement(_id, name, sizes, price, isActive, isFeatured) {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("table-stock");

    const productoTable = document.createElement("table");
    productoTable.classList.add("table-producto");

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>#</th>
        <th>Producto</th>
        <th>Talles y Cantidades</th>
        <th>Precio Unitario</th>
        <th>Estado</th>
        <th>Acciones</th>
        <th>Destacado</th>
      </tr>
    `;

    const tbody = document.createElement("tbody");

    if (sizes.length === 0) {
      const row = this.createEmptyStockRow(_id, name, price, isFeatured);
      tbody.appendChild(row);
    } else {
      // Aplicar clases para cada talle individualmente en la lista
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="ID">${_id}</td>
        <td data-label="Producto">${name}</td>
        <td data-label="Talles y Cantidades">
          <ul class="size-list">
            ${sizes
              .map(
                (size) => `
              <li class="${
                size.stock === 0
                  ? "sin-stock"
                  : size.stock < 10
                  ? "stock-bajo"
                  : "en-stock"
              }">
                <strong>${size.size}:</strong> ${size.stock} ${
                  size.stock === 0
                    ? "(sin stock)"
                    : size.stock < 10
                    ? "(bajo stock)"
                    : "(en stock)"
                }
              </li>
            `
              )
              .join("")}
          </ul>
        </td>
        <td data-label="Precio">${price}</td>
        <td data-label="Estado" class="${this.getStockState(sizes)}">
          ${this.getStockState(sizes).replace("-", " ")}
        </td>
        <td data-label="Acciones">
          <button type="button" class="btn btn-info ver-detalles" data-id="${_id}">Editar</button>
        </td>
        <td data-label="Destacado">${isFeatured ? "sí" : "no"}</td>
      `;
      tbody.appendChild(row);
    }

    productoTable.appendChild(thead);
    productoTable.appendChild(tbody);
    productoDiv.appendChild(productoTable);

    const estadoButton = isActive
      ? `<button type="button" class="btn btn-warning desactivar-producto" data-id="${_id}">Desactivar</button>`
      : `<button type="button" class="btn btn-success activar-producto" data-id="${_id}">Activar</button>`;

    const accionesDiv = document.createElement("div");
    accionesDiv.innerHTML = estadoButton;

    productoDiv.appendChild(accionesDiv);

    return productoDiv;
  }

  // Helper method to get the overall stock state based on sizes
  getStockState(sizes) {
    if (sizes.every((size) => size.stock === 0)) return "sin-stock";
    if (sizes.some((size) => size.stock < 10 && size.stock > 0))
      return "stock-bajo";
    return "en-stock";
  }

  createEmptyStockRow(_id, name, price, isFeatured) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="ID">${_id}</td>
      <td data-label="Producto">${name}</td>
      <td  data-label="Talle y Cantidades">N/A</td>
      <td  data-label="Precio">${price}</td>
      <td data-label="Estado" class="sin-stock">Sin stock</td>
      <td>
        <button type="button" class="btn btn-info ver-detalles" data-id="${_id}">editar</button>
      </td>
      <td>${isFeatured ? "si" : "no"}</td>
    `;
    return row;
  }

  async agregarEventListenerBotones() {
    const botonesDetalles = document.querySelectorAll(".ver-detalles");
    botonesDetalles.forEach((boton) => {
      boton.addEventListener("click", async (event) => {
        const idProducto = event.target.dataset.id;
        // Obtener los detalles del producto
        try {
          const product = await productoServices.detalleProducto(idProducto);
          if (!product) {
            throw new Error("Datos del producto no disponibles");
          }

          const { name, price, imagePath, description, sizes, isFeatured } =
            product;

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

    const botonesDesactivar = document.querySelectorAll(".desactivar-producto");

    botonesDesactivar.forEach((boton) => {
      boton.addEventListener("click", async (event) => {
        const idProducto = event.target.dataset.id;

        try {
          // Desactivar el producto
          await ProductEventHandler.handleDesactivate(idProducto);
          // Recargar los productos después de desactivar
          this.renderStock(); // Asegúrate de que `this` se refiere a la instancia correcta
        } catch (error) {
          console.error("Error al desactivar el producto:", error);
          alert("Ocurrió un error al desactivar el producto.");
        }
      });
    });

    const botonesActivar = document.querySelectorAll(".activar-producto");
    botonesActivar.forEach((boton) => {
      boton.addEventListener("click", async (event) => {
        const idProducto = event.target.dataset.id;
        try {
          // Esperar a que se complete la desactivación
          await ProductEventHandler.handleActivate(idProducto);

          // Recargar los productos después de desactivar
          this.renderStock();
        } catch (error) {
          console.error("Error al activar el producto:", error);
          alert("Ocurrió un error al activar el producto.");
        }
      });
    });
  }
}
