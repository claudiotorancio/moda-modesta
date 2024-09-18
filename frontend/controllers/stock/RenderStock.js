import productoServices from "../../services/product_services.js";
import { ProductEventHandler } from "../productos/ProductEventHandler.js";

export class RenderStock {
  constructor(titulo) {
    this.titulo = titulo;
  }

  async renderStock() {
    const listaProductos = await productoServices.listaProductos();
    const productos = listaProductos.products;

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
          const { _id, name, sizes, price } = producto;
          const productoDiv = this.createProductElement(
            _id,
            name,
            sizes,
            price
          );
          productosContenedor.appendChild(productoDiv);
        });
      }
    }

    // Añadir el event listener a los botones "Ver detalles"
    this.agregarEventListenerBotones();
  }

  createProductElement(_id, name, sizes, price) {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("table");
    productoDiv.style.border = "2px solid #000"; // Borde exterior
    productoDiv.style.padding = "10px";
    productoDiv.style.marginBottom = "10px";
    productoDiv.style.backgroundColor = "#fff"; // Fondo blanco

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
        <button type="button" class="btn btn-danger eliminar-producto" data-id="${_id}">Del</button>
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
          <button type="button" class="btn btn-info ver-detalles" data-id="${_id}">editar</button>
          <button type="button" class="btn btn-danger eliminar-producto" data-id="${_id}">del</button>`
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
        ProductEventHandler.handleEdit(idProducto);
      });
    });

    const botonesEliminar = document.querySelectorAll(".eliminar-producto");
    botonesEliminar.forEach((boton) => {
      boton.addEventListener("click", async (event) => {
        const idProducto = event.target.dataset.id;
        const listaProducto = await productoServices.detalleProducto(
          idProducto
        );
        const producto = listaProducto.product;

        if (producto.inCart) {
          alert("El producto está en el carrito y no se puede eliminar.");
        } else {
          ProductEventHandler.handleDelete(idProducto);
        }
      });
    });
  }
}
