import productoServices from "../services/product_services.js";

export function setupFormSubmitHandler() {
  const form = document.querySelector("[data-forma]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageInput1 = document.querySelector("[data-image1]");
    const imageInput2 = document.querySelector("[data-image2]");

    if (!imageInput1 && !imageInput2) {
      console.error("No se encontraron los elementos de entrada de imagen.");
      return;
    }

    const imagePath1 = imageInput1 ? imageInput1.files[0] : null;
    const imagePath2 = imageInput2 ? imageInput2.files[0] : null;

    const name = document.querySelector("[data-nombre]").value;
    const price = document.querySelector("[data-precio]").value;
    const description = document.querySelector("[data-description]").value;
    const isFeatured = document.querySelector("#isFeatured").checked;
    const discount = document.querySelector("[data-descuento]").value;

    const selectedSizes = Array.from(
      document.querySelectorAll('input[name="sizes"]:checked')
    ).map((checkbox) => {
      const size = checkbox.value;
      const stock = document.querySelector(
        `input[name="stock_${size.replace(" ", "").toLowerCase()}"]`
      ).value;
      return { size, stock: Number(stock) }; // Asegúrate de que el stock sea un número
    });

    // Verificar si el checkbox existe antes de acceder a él
    const generalStockCheckElement =
      document.getElementById("updateGeneralStock");
    let generalStockCheck = false;
    let generalStock = null;

    if (generalStockCheckElement) {
      generalStockCheck = generalStockCheckElement.checked;
      generalStock = generalStockCheck
        ? document.querySelector("[data-generalStock]").value
        : null;
    }

    const dataEdit = new FormData();

    dataEdit.append("id", this.id);
    dataEdit.append("name", name);
    dataEdit.append("price", price);
    dataEdit.append("description", description);
    dataEdit.append("isFeatured", isFeatured);
    dataEdit.append("discount", discount);

    if (imagePath1) {
      dataEdit.append("imagePath", imagePath1);
      dataEdit.append(
        "oldImagePath",
        document.querySelector("[data-oldPath1]").value
      );
    } else if (imagePath2) {
      dataEdit.append("imagePath", imagePath2);
      dataEdit.append(
        "oldImagePath",
        document.querySelector("[data-oldPath2]").value
      );
    }

    // Lógica para manejar sizes y generalStock
    if (selectedSizes.length > 0 && generalStock !== null) {
      console.error("Solo puedes enviar 'sizes' o 'generalStock', no ambos.");
      alert("Por favor, elige entre 'sizes' o 'generalStock', no ambos.");
      return; // Detiene la ejecución si ambos están presentes
    }

    // Agrega solo uno de los dos
    if (generalStock !== null) {
      dataEdit.append("generalStock", generalStock);
    } else if (selectedSizes.length > 0) {
      dataEdit.append("sizes", JSON.stringify(selectedSizes));
    }

    try {
      await productoServices.actualizarProducto(dataEdit);
    } catch (err) {
      console.error("Error al actualizar el producto:", err);
      alert(
        "Ocurrió un error al actualizar el producto. Por favor, intenta nuevamente."
      );
    }
  });
}
