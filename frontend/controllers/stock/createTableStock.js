export function createProductElement(
  _id,
  name,
  price,
  sizes,
  isActive,
  isFeatured,
  hayStock,
  generalStock,
  notificaciones
) {
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
        <th>aviso de ingreso</th>
      </tr>
    `;

  const tbody = document.createElement("tbody");

  // Si no hay tallas disponibles (por ejemplo, para "Diversos")
  if (sizes.length === 0) {
    // Aplicar clases para cada talle individualmente en la lista
    const notified = notificaciones.some(
      (item) =>
        item.productId.toString() === _id.toString() && item.notified === false
    );

    const notificacionesPendientes = notificaciones.filter(
      (item) =>
        item.productId.toString() === _id.toString() && item.notified === false
    );
    const estadoStock =
      generalStock === 0
        ? "sin-stock"
        : generalStock < 10
        ? "stock-bajo"
        : "en-stock";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="ID">${_id}</td>
      <td data-label="Producto">${name}</td>
      <td data-label="Talles y Cantidades">
        <span class="${estadoStock}">
          ${generalStock} ${
      generalStock === 0
        ? "(sin stock)"
        : generalStock < 10
        ? "(bajo stock)"
        : "(en stock)"
    }
        </span>
      </td>
      <td data-label="Precio">${price}</td>
      <td data-label="Estado" class="${estadoStock}">${
      generalStock === 0
        ? "Sin stock"
        : generalStock < 10
        ? "Bajo stock"
        : "En stock"
    }</td>
      <td data-label="Acciones">
        <button type="button" class="btn btn-info ver-detalles" data-id="${_id}">Ver/Editar</button>
      </td>
      <td data-label="Destacado">${isFeatured ? "sí" : "no"}</td>
        <td data-label="Notificacion">${
          notified
            ? `<p>solicitudes (${notificacionesPendientes.length})</p>
       <button type="button" class="btn btn-primary notificacion-producto" 
         data-product-id="${_id}" 
         data-notificacion-ids="${notificacionesPendientes
           .map((item) => item._id.toString())
           .join(",")}" ${hayStock ? "" : "disabled"}>
         enviar
       </button>`
            : "sin notificaciones"
        }</td>
    `;
    tbody.appendChild(row);
  } else {
    // Aplicar clases para cada talle individualmente en la lista
    const notified = notificaciones.some(
      (item) =>
        item.productId.toString() === _id.toString() && item.notified === false
    );

    const notificacionesPendientes = notificaciones.filter(
      (item) =>
        item.productId.toString() === _id.toString() && item.notified === false
    );
    // Manejar productos con tallas
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
      <td data-label="Estado" class="${getStockState(sizes)}">${getStockState(
      sizes
    ).replace("-", " ")}</td>
      <td data-label="Acciones">
        <button type="button" class="btn btn-info ver-detalles" data-id="${_id}">Ver/Editar</button>
      </td>
      <td data-label="Destacado">${isFeatured ? "sí" : "no"}</td>
      <td data-label="Notificacion">${
        notified
          ? `<p>solicitudes (${notificacionesPendientes.length})</p>
       <button type="button" class="btn btn-primary notificacion-producto" 
         data-product-id="${_id}" 
         data-notificacion-ids="${notificacionesPendientes
           .map((item) => item._id.toString())
           .join(",")}" ${hayStock ? "" : "disabled"}>
         enviar
       </button>`
          : "sin notificaciones"
      }</td>
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

function getStockState(sizes, generalStock) {
  if (sizes.length === 0) {
    // Si no hay talles, usamos el generalStock
    if (generalStock === 0) return "sin-stock";
    if (generalStock < 10) return "stock-bajo";
    return "en-stock";
  }
  if (sizes.every((size) => size.stock === 0)) return "sin-stock";
  if (sizes.some((size) => size.stock < 10 && size.stock > 0))
    return "stock-bajo";
  return "en-stock";
}
