// RenderStock.js

import { modalControllers } from "../../modal/modal.js";
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
          const { _id, name, sizes, price, isActive } = producto;
          const productoDiv = this.createProductElement(
            _id,
            name,
            sizes,
            price,
            isActive
          );
          productosContenedor.appendChild(productoDiv);
        });
      }
    }

    // Añadir el event listener a los botones "Ver detalles" y "Desactivar/Activar"
    this.agregarEventListenerBotones();
  }

  createProductElement(_id, name, sizes, price, isActive) {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("table");
    productoDiv.style.border = "2px solid #000";
    productoDiv.style.padding = "10px";
    productoDiv.style.marginBottom = "10px";
    productoDiv.style.backgroundColor = "#fff";

    const productoTable = document.createElement("table");
    productoTable.style.width = "100%";
    productoTable.style.borderCollapse = "collapse";
    productoTable.style.backgroundColor = "#fff";

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

    if (sizes.length === 0) {
      const row = this.createEmptyStockRow(_id, name, price);
      tbody.appendChild(row);
    } else {
      sizes.forEach((size, index) => {
        const row = this.createSizeRow(index, _id, name, size, price);
        tbody.appendChild(row);
      });
    }

    productoTable.appendChild(thead);
    productoTable.appendChild(tbody);
    productoDiv.appendChild(productoTable);

    // Añadir el botón de activar/desactivar
    const estadoButton = isActive
      ? `<button type="button" class="btn btn-warning desactivar-producto" data-id="${_id}">Desactivar</button>`
      : `<button type="button" class="btn btn-success activar-producto" data-id="${_id}">Activar</button>`;

    const accionesDiv = document.createElement("div");
    accionesDiv.innerHTML = estadoButton;

    productoDiv.appendChild(accionesDiv);

    return productoDiv;
  }

  createEmptyStockRow(_id, name, price) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${_id}</td>
      <td>${name}</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>${price}</td>
      <td class="sin-stock">Sin stock</td>
      <td>
        <button type="button" class="btn btn-info ver-detalles" data-id="${_id}">editar</button>
      </td>
    `;
    return row;
  }

  createSizeRow(index, _id, name, size, price) {
    const stockClass =
      size.stock === 0 ? "sin-stock" : size.stock < 10 ? "stock-bajo" : "";
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index === 0 ? _id : ""}</td>
      <td>${index === 0 ? name : ""}</td>
      <td>${size.size}</td>
      <td>${size.stock}</td>
      <td>${index === 0 ? price : ""}</td>
      <td class="${stockClass}">${
      size.stock > 0
        ? size.stock < 10
          ? "Bajo stock"
          : "En stock"
        : "Sin stock"
    }</td>
      <td>
        ${
          index === 0
            ? ` 
          <button type="button" class="btn btn-info ver-detalles" data-id="${_id}">editar</button>`
            : ""
        }
      </td>
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
          const confirmacion = confirm("¿Desea desactivar el producto?");

          if (!confirmacion) {
            return; // Si el usuario cancela, no hacer nada
          }

          // Verificar detalles del producto antes de desactivarlo
          const producto = await productoServices.detalleProducto(idProducto);

          if (producto.inCart) {
            alert("El producto está en el carrito y no se puede eliminar.");
            return; // Salir si el producto está en el carrito
          }

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
          const confirmacion = confirm("¿Desea activar el producto?");

          if (confirmacion) {
            // Esperar a que se complete la desactivación
            await productoServices.activarProducto(idProducto);

            // Recargar los productos después de desactivar
            this.renderStock();
          }
        } catch (error) {
          console.error("Error al activar el producto:", error);
          alert("Ocurrió un error al activar el producto.");
        }
      });
    });
  }
}
