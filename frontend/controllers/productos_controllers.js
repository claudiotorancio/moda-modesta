import { modalControllers } from "../modal/modal.js";
import productoServices from "../services/product_services.js";

class ProductCard {
  constructor( name, price,imagePath, description, id) {
    this.name = name;
    this.price = price;
    this.imagePath = imagePath;
    this.description = description;
    this.id = id;
  }

  render() {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="container mx-auto mt-4">
        <div class="img-card">
          <img class="card-img-top" src="${this.imagePath}" alt="">
        </div>
        <div class="card-body">
          <a href="#">ver producto</a>
          <h3 class="card-title">${this.name}</h3>
          <p class="card-text">${"$" + this.price}</p>
          <a href="#form" class="btn btn-primary" id="${
            this.id
          }" data-edit >Editar</a>
          <button class="btn btn-danger" type="button" id="${
            this.id
          }">Eliminar</button>
        </div>
      </div>
    `;

    card.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      ProductEventHandler.handleShow(
        this.name,
        this.imagePath,
        this.description
      );
    });

    card.querySelector("button").addEventListener("click", async (e) => {
      e.preventDefault();
      ProductEventHandler.handleDelete(this.id);
    });

    card.querySelector("[data-edit]").addEventListener("click", async (e) => {
      e.preventDefault();
      ProductEventHandler.handleEdit(
   
        this.name,
        this.price,
        this.imagePath,
        this.description,
        this.id,
      );
    });

    return card;
  }
}

class ProductEventHandler {
  constructor() {
    // No hay necesidad de almacenar datos aquí por ahora
  }

  static handleShow(name, imagePath, sizes, description,) {
    try {
      mostrarProducto(name, imagePath, sizes, description);
    } catch (err) {
      console.log(err);
    }
  }

  static handleDelete(id) {
    try {
      modalControllers.modalEliminar(id);
    } catch (err) {
      console.log(err);
    }
  }

  static async handleEdit(name, price, imagePath, sizes, description,id) {
    try {
      await productoServices.detalleProducto(id);
      const productEditor = new ProductEditor();
      productEditor.editProduct(name, price, imagePath, sizes, description, id);
    } catch (error) {
      console.error("Error al obtener el detalle del producto:", error);
      alert(
        "Ocurrió un error al obtener el detalle del producto. Por favor, intenta nuevamente."
      );
    }
  }
}

class ProductEditor {
  constructor() {
    this.modal = document.getElementById("modal");
    this.productoEdicion = this.modal.querySelector("[data-table]");
  }

  editProduct(name, price, imagePath, description, sizes, id) {
    this.renderEditor(name, price, imagePath, description, sizes, id);
    this.setupFormSubmitHandler(id);
  }

  renderEditor(name, price, imagePath, description, sizes, id) {
    modalControllers.baseModal();
    this.productoEdicion.innerHTML = `
      <div class="text-center">
        <div class="card-header">
          <img class="img-card-top mx-auto" style="width: 10rem;" src="${imagePath}" alt="">
          <form action="/api/updateProduct/${id}" id="form" enctype="multipart/form-data" method="POST" data-forma>
            <p class="parrafo">Producto a editar</p>
            <div class="form-group">
              <input class="form-control p-2" placeholder="imageUrl" type="file" name="imagePath" data-image autofocus>
              <input type="hidden" class="oldImagePath" name="oldImagePath" value="${imagePath}" data-oldPath>
            </div>
            <div class="form-group">
              <input class="form-control mt-3 p-2" placeholder="nombre" type="text" value="${name}" required data-nombre>
            </div>
            <div class="form-group">
              <input class="form-control mt-3 mb-3 p-2" placeholder="precio" type="text" value="${price}" required data-precio>
            </div>
            <div class="form-group">
              <textarea class="form-control mt-3 mb-3 p-2" placeholder="Descripción" required data-description>${description}</textarea>
            </div>
            <div class="form-group">
              <label>Talles disponibles:</label>
              ${sizes.map((size) => `
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="${size}" name="sizes" id="size-${size}" checked>
                  <label class="form-check-label" for="size-${size}">${size}</label>
                </div>
              `).join('')}
            </div>
            <div>
              <button type="submit" class="btn btn-primary btn-lg">Editar producto</button>
            </div>
          </form>
        </div>
      </div>
    `;
    this.productoEdicion.classList.add("modalVisor");
  }

  setupFormSubmitHandler(id) {
    const form = this.productoEdicion.querySelector("[data-forma]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.querySelector("[data-nombre]").value;
      const price = document.querySelector("[data-precio]").value;
      const description = document.querySelector("[data-description]").value;
      const imagePath = document.querySelector("[data-image]").files[0];
      const oldImagePath = document.querySelector("[data-oldPath]").value;

      const selectedSizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked'))
        .map(checkbox => checkbox.value);

      const dataEdit = new FormData();
      if (imagePath) {
        dataEdit.append("imagePath", imagePath);
      }
      dataEdit.append("name", name);
      dataEdit.append("price", price);
      dataEdit.append("description", description);
      dataEdit.append("oldImagePath", oldImagePath);

      selectedSizes.forEach(size => dataEdit.append("sizes[]", size));

      try {
        await productoServices.actualizarProducto(dataEdit, id);
        modalControllers.modalProductoEditado();
      } catch (err) {
        console.error("Error al actualizar el producto:", err);
        alert("Ocurrió un error al actualizar el producto. Por favor, intenta nuevamente.");
      }
    });
  }
}


const mostrarProducto = (name, imagePath, sizes, description) => {
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const mostrarProducto = modal.querySelector("[data-table]");

  // Generar las opciones del select a partir del array sizes
  const opcionesTalles = sizes.map(size => `
    <option value="${size}">${size}</option>
  `).join('');


  mostrarProducto.innerHTML = `
    <div class="contenido_container">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <img class="card-img-top" src="${imagePath}" alt="">
        </div>
        <div class="col-md-6 mx-auto d-flex flex-column">
          <div class="card-body">
            <h3 class="card-title">${name}</h3>
            <br>
            <!-- Área de descripción con altura fija -->
            <div class="card-text" style="height: 150px; overflow-y: auto;">
              ${description}
            </div>
          </div>
          
        
          <div class="mt-auto pt-3">
            <!-- Menú desplegable de talles -->
            <label for="variation_1">Talles disponibles</label>
            <select id="variation_1" class="form-select mb-3">
            ${opcionesTalles}
            </select>

            <!-- Selector de cantidad y botón de carrito -->
            <div class="form-row align-items-center">
             
              <div class="mx-auto">
                <a href="https://wa.me/5492954606273" class="btn btn-primary btn-block mt-4">Consulta  <i class="fa-brands fa-whatsapp"></i>  </a>
              </div>
           
            </div>
          </div>
             <span class="text-accent">10% de descuento, pagando con Transferencia o depósito bancario (Los datos te llegarán vía mail) *PLAZO MÁXIMO 2HS*
</span>
          <em style="font-size: 10pt; font-family: Arial, sans-serif; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space-collapse: preserve;">
          Se recomienda lavar la prenda a mano con jabón blanco o en lavarropas usando modo delicado sin centrifugado fuerte, utilizando productos que no contengan lavandina ni derivados que puedan dañarla.
          </em>
        </div>
      </div>
    </div>
  `;

  mostrarProducto.classList.add("modalVisor");
};





const renderProducts = async () => {
  try {
    const listaProductos = await productoServices.listaProductos();
    const { products } = listaProductos;

    for (const producto of products) {
      const productCard = new ProductCard( 
        producto.name,
        producto.price,
        producto.imagePath,
        producto.description,
        producto.sizes,
        producto._id
        
      );
      // Renderizar el producto y adjuntar al contenedor adecuado
      document
        .querySelector(`[data-${producto.section}]`)
        .appendChild(productCard.render());
    }
  } catch (error) {
    console.log(error);
  }
};

export const controllers = {
  mostrarProducto,
  renderProducts,
};
