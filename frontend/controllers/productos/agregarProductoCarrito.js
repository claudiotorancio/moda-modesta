import { comprarProducto } from "../carrito/comprarProducto.js";

export async function agregarProductoCarrito() {
  // Agregar al carrito
  const agregarCarritoBtn = document.querySelector("[data-carrito]");
  if (agregarCarritoBtn) {
    agregarCarritoBtn.addEventListener("click", async (event) => {
      let talleSeleccionado;
      let quantity;

      // Comprobar si la sección es 'opcion3'
      if (this.section === "opcion3") {
        // No hay talle seleccionado, puedes asignar un valor predeterminado
        quantity = document.getElementById("quantity").value || 1;
      } else {
        // Obtener el talle seleccionado del select

        const sizeSelect = document.getElementById("variation_1");
        const quantityInput = document.getElementById("quantity");

        talleSeleccionado = sizeSelect.value;
        quantity = parseInt(quantityInput.value, 10);

        if (event.target.id === "addToCartBtn") {
          const messageElement = document.getElementById("message");
          if (!talleSeleccionado) {
            messageElement.textContent = `Debes seleccionar un talle`;
            document.getElementById("messageContainer").style.display = "block";
          }
        }
      }

      try {
        await comprarProducto(
          this.id,
          this.name,
          this.price,
          this.imagePath,
          this.sizes,
          talleSeleccionado,
          this.section,
          this.generalStock,
          quantity,
          this.discount
        );
      } catch (error) {
        console.log(error);
      }
    });
  } else {
    console.log(
      "Botón de añadir al carrito no encontrado, posiblemente no hay stock."
    );
  }
}
