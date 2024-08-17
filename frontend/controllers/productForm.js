import { modalControllers } from "../modal/modal.js";
import productoServices from "../services/product_services.js";

export class ProductForm {
  constructor() {
    this.initForm = document.querySelector("[data-table]");
  }

  //mostrar form
  render() {
    this.clearForm();
    const card = this.createForm();
    this.initForm.appendChild(card);
    this.setupFormSubmitHandler();
  }

  //vaciar contenido
  clearForm() {
    this.initForm.innerHTML = "";
  }

  //crear formulario dinamico
  createForm() {
    modalControllers.baseModal();
    const card = document.createElement("div");
    card.classList.add("modalVisor");
    card.innerHTML = `
        <div class="text-center">
            <div class="card-header">
                <p>Agregar producto</p>
            </div>
            <div class="card-body">
                <form id="form" action="/api/createProduct" enctype="multipart/form-data" method="POST" data-form>
                    <div class="form-group">
                        <input class="form-control p-2"  type="file" name="image" 
                            data-imageUrl  required autofocus>
                    </div>
                    <div class="form-group">
                        <input class="form-control mt-3 p-2" type="text" placeholder="Nombre del producto" name="name" required
                            data-name>
                    </div>
                    <div class="form-group">
                        <input class="form-control mt-3 mb-3 p-2" type="text" placeholder="Precio del producto" name="price"
                            required data-price>
                    </div>
                    <div class="form-group">
                        <textarea class="form-control mt-3 mb-3 p-2" type="text" placeholder="Descripcion" name="description"
                            required data-description></textarea>
                    </div>
                    <p for="miMenuDesplegable">Seccion</p>
                    <div class="form-group">
                        <select class="form-control  mb-3 p-2" id="miMenuDesplegable" name="section">
                            <option value="opcion1">Vestidos</option>
                            <option value="opcion2">Polleras</option>
                            <option value="opcion3">Diversos</option>
                        </select>
                        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="Talle 1" name="sizes" id="talle1" >
            <label class="form-check-label" for="talle1">Talle 1</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="Talle 2" name="sizes" id="talle2">
            <label class="form-check-label" for="talle2">Talle 2</label>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg">Agregar</button>
                </form>
            </div>
        </div>
      `;

    return card;
  }

  //capturar el evento submit
  setupFormSubmitHandler() {
    const form = this.initForm.querySelector("[data-form]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }


  //recopilar y enviar los datos
  async handleSubmit() {
    const name = document.querySelector("[data-name]").value;
    const price = document.querySelector("[data-price]").value;
    const description = document.querySelector("[data-description]").value;
    const section = document.getElementById("miMenuDesplegable").value;
    const image = document.querySelector("[data-imageUrl]").files[0];

    // Captura todos los checkboxes seleccionados
    const selectedSizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked'))
        .map(checkbox => checkbox.value);

    const productData = new FormData();
    productData.append("name", name);
    productData.append("price", price);
    productData.append("description", description);
    productData.append("section", section);
    productData.append("image", image);

    // Agrega los talles seleccionados al FormData
    selectedSizes.forEach(size => productData.append("sizes[]", size));

    const user = JSON.parse(sessionStorage.getItem("user")) || null;

    try {
      await productoServices.crearProducto(productData);
      modalControllers.modalProductoCreado();
    } catch (error) {
      console.error(error);
    }

  }
}

const productForm = new ProductForm();

export default productForm;
