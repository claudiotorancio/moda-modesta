// import { comprarProducto } from "../carrito/comprarProducto.js";
import Carrito from "../carrito/carrito.js";

const carrito = new Carrito();

export async function agregarProductoCarrito() {
  const carritoButton = document.querySelector("[data-carrito]");

  if (carritoButton) {
    carritoButton.addEventListener("click", async (event) => {
      event.preventDefault();

      let talleSeleccionado;
      let quantity;
      let stockSeleccionado;

      // Comprobar si la sección es 'opcion3'
      if (this.generalStock) {
        // No hay talle seleccionado, puedes asignar un valor predeterminado
        const valorQuantity = document.getElementById("quantity").value || 1;
        quantity = Math.max(0, parseInt(valorQuantity));
        stockSeleccionado = this.generalStock;
      } else {
        // Obtener el talle seleccionado del select
        const sizeSelect = document.getElementById("variation_1");
        const quantityInput = document.getElementById("quantity");

        const selectedSize = sizeSelect.value;

        if (!selectedSize) {
          // Si no se ha seleccionado un talle, mostramos un mensaje y salimos
          const messageElement = document.getElementById("message");
          messageElement.textContent = `Debes seleccionar un talle`;
          document.getElementById("messageContainer").style.display = "block";
          return; // No continuar hasta que se seleccione el talle
        }

        const sizeObject = this.sizes.find(
          (item) => item.size === selectedSize
        );

        stockSeleccionado = sizeObject.stock;

        talleSeleccionado = selectedSize;
        quantity = parseInt(quantityInput.value, 10);

        // Validación de cantidad
        if (quantity <= 0 || isNaN(quantity)) {
          const messageElement = document.getElementById("message");
          messageElement.textContent = `La cantidad debe ser un número positivo`;
          document.getElementById("messageContainer").style.display = "block";
          return; // No continuar si la cantidad no es válida
        }
      }

      try {
        const producto = {
          _id: this.id,
          name: this.name,
          price: this.price,
          imagePath: this.imagePath,
          section: this.section,
          stock: stockSeleccionado,
          cantidad: quantity,
          discount: this.discount,
          unidad: this.generalStock ? "Un." : talleSeleccionado,
          isActive: this.isActive,
        };

        await carrito.agregarProducto(producto);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
