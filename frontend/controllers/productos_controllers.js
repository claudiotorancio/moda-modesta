import { modalControllers } from "../modal/modal.js";
import productoServices from "../services/product_services.js";
import carrito from "./carrito-controllers.js";


class ProductCard {
  constructor(name, price, imagePath, description, sizes, id, isFeatured) {
    this.name = name;
    this.price = price;
    this.imagePath = imagePath;
    this.description = description;
    this.sizes = sizes;
    this.id = id;
    this.isFeatured = isFeatured; // Agregar este campo
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
          <a href="#" data-veradmin>ver producto</a>
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

    // Manejar eventos
    card.querySelector("[data-veradmin]").addEventListener("click", (e) => {
      e.preventDefault();
      mostrarProducto(
        this.name,
        this.price,
        this.imagePath,
        this.sizes,
        this.description,
        this.id,
        this.isFeatured
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
        this.sizes,
        this.id,
        this.isFeatured
      );
    });

    return card;
  }
}


class ProductEventHandler {
  constructor() {
    // No hay necesidad de almacenar datos aquí por ahora
  }

  // static handleShow(name, imagePath, sizes, description) {
  //   try {
  //     mostrarProducto(name, imagePath, sizes, description);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  static handleDelete(id) {
    try {
      modalControllers.modalEliminar(id);
    } catch (err) {
      console.log(err);
    }
  }

  static async handleEdit(name, price, imagePath, sizes, description, id) {
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

  editProduct(name, price, imagePath, description, sizes, id, isFeatured) {
    this.renderEditor(name, price, imagePath, description, sizes, id, isFeatured);
    this.setupFormSubmitHandler(id);
  }

  renderEditor(name, price, imagePath, description, sizes, id, isFeatured) {
    modalControllers.baseModal();
    const opcionesTalles = sizes
      .map(
        (size) => `
    <option value="${size}">${size}</option>
  `
      )
      .join("");

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

            <div class="form-group form-check mb-3">
              <input type="checkbox" class="form-check-input" id="isFeatured" name="isFeatured" ${
                isFeatured ? "checked" : ""
              }>
              <label class="form-check-label" for="isFeatured">Destacar producto</label>
            </div>

            <div class="mt-auto pt-3">
            <label for="variation_1">Talles actuales</label>
            <select id="variation_1" class="form-select mb-3">
            ${opcionesTalles}
            </select>
            </div>
            <label for="variation_1">Modificar talles</label>
          <div class="form-group mb-4">
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 1" name="sizes" id="talle1">
              <label class="form-check-label" for="talle1">Talle 1</label>
            </div>
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 2" name="sizes" id="talle2">
              <label class="form-check-label" for="talle2">Talle 2</label>
            </div>
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 3" name="sizes" id="talle3">
              <label class="form-check-label" for="talle3">Talle 3</label>
            </div>
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 4" name="sizes" id="talle4">
              <label class="form-check-label" for="talle4">Talle 4</label>
            </div>
            <div class="form-check-inline me-3">
              <input class="form-check-input" type="checkbox" value="Talle 5" name="sizes" id="talle5">
              <label class="form-check-label" for="talle5">Talle 5</label>
            </div>
          </div>
        
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
      const isFeatured = document.querySelector("#isFeatured").checked;

      const selectedSizes = Array.from(
        document.querySelectorAll('input[name="sizes"]:checked')
      ).map((checkbox) => checkbox.value);

      const dataEdit = new FormData();
      if (imagePath) {
        dataEdit.append("imagePath", imagePath);
      }
      dataEdit.append("name", name);
      dataEdit.append("price", price);
      dataEdit.append("description", description);
      dataEdit.append("oldImagePath", oldImagePath);
      dataEdit.append("isFeatured", isFeatured);

      selectedSizes.forEach((size) => dataEdit.append("sizes[]", size));

      try {
        await productoServices.actualizarProducto(dataEdit, id);
        modalControllers.modalProductoEditado();
      } catch (err) {
        console.error("Error al actualizar el producto:", err);
        alert(
          "Ocurrió un error al actualizar el producto. Por favor, intenta nuevamente."
        );
      }
    });
  }
}

const mostrarProducto = async (name, price, imagePath, sizes, description, id) => {
  modalControllers.baseModal();
  const modal = document.getElementById("modal");
  const mostrarProducto = modal.querySelector("[data-table]");

  // Generar las opciones del select a partir del array sizes
  const opcionesTalles = sizes
    .map(
      (size) => `
    <option value="${size}">${size}</option>
  `
    )
    .join("");

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
            <div class="card-text" style="height: 150px; overflow-y: auto;">
              ${description}
            </div>
          </div>
          
          <div class="mt-auto pt-3">
            <label for="variation_1">Talles disponibles</label>
            <select id="variation_1" class="form-select mb-3">
            ${opcionesTalles}
            </select>

           <div class="d-flex justify-content-between align-items-center">
              <!-- Icono para compartir -->
              <a id="compartir-producto" title="Compartir" class="icono-compartir">
                <i class="fa-solid fa-share-nodes"></i>
              </a>
            </div>
            <div class="form-row align-items-center">
              <div class="mx-auto">
                <button type="button" class="btn btn-primary btn-block mt-4" data-carrito>Agregar al carrito</button>
              </div>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="text-accent">10% de descuento, pagando con Transferencia o depósito bancario (Los datos te llegarán vía mail) *PLAZO MÁXIMO 2HS*</span>
           
            </div>
            
            <em style="font-size: 10pt; font-family: Arial, sans-serif; background-color: transparent; vertical-align: baseline;">
            Se recomienda lavar la prenda a mano con jabón blanco o en lavarropas usando modo delicado sin centrifugado fuerte, utilizando productos que no contengan lavandina ni derivados que puedan dañarla.
            </em>
          </div>
        </div>
      </div>
    </div>
  `;

  // Lógica para agregar al carrito
  const producto = {
    _id: id,
    name: name,
    price: price,
    imagePath: imagePath
  };

  mostrarProducto.querySelector("[data-carrito]").addEventListener("click", () => {
    const talleSeleccionado = document.getElementById("variation_1").value;

    carrito.agregarProducto({ 
      product: producto, 
      size: talleSeleccionado 
    });
  });


  // Lógica para compartir en redes sociales
  const compartirProducto = document.getElementById("compartir-producto");
  compartirProducto.addEventListener("click", () => {
    const productUrl = `${window.location.origin}/product/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `¡Mira este producto! ${name} por solo $${price}`,
        url: productUrl,  // Aquí utilizas la URL específica del producto
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      alert('La función de compartir no es compatible con tu navegador. Por favor, comparte el enlace manualmente.');
    }
  });
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
