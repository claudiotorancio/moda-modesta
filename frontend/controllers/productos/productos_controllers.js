import { ProductCard } from "../../controllers/productos/ProductCard.js"; // Ajusta la ruta según tu estructura
import productoServices from "../../services/product_services.js"; // Importa el servicio que obtiene los productos
import { mostrarProducto } from "./ProductViewer.js";
import Carrito from "../carrito/carrito.js";

const carrito = new Carrito();

export const controllers = {
  async renderProducts() {
    try {
      // Cargar la lista de productos
      const listaProductos = await productoServices.listaProductos();
      const { products } = listaProductos;

      // Separar productos destacados y no destacados
      const productosDestacados = products.filter(
        (producto) => producto.isFeatured
      );
      const productosNoDestacados = products.filter(
        (producto) => !producto.isFeatured
      );

      // Renderizar productos destacados
      const contenedorDestacados = document.querySelector("[data-destacados]");
      if (Array.isArray(productosDestacados)) {
        contenedorDestacados.innerHTML = ""; // Limpiar el contenedor antes de agregar los productos
        for (const producto of productosDestacados) {
          const card = new ProductCard(
            producto.name,
            producto.price,
            producto.imagePath,
            producto.description,
            producto.sizes,
            producto._id
          );
          contenedorDestacados.appendChild(card.render());
        }
      } else {
        console.error("Error: No se recibieron productos destacados.");
      }

      // Utiliza un objeto para almacenar los contenedores por sección
      const containers = {};

      // Inicializar contenedores para las secciones
      productosNoDestacados.forEach((producto) => {
        const containerSelector = `[data-${producto.section}]`;
        let container = document.querySelector(containerSelector);

        // Si el contenedor no ha sido inicializado, lo hacemos ahora
        if (container && !containers[containerSelector]) {
          containers[containerSelector] = container;
          container.innerHTML = ""; // Limpiar el contenedor antes de agregar productos
        }
      });

      // Recorre la lista de productos no destacados y organiza los productos por sección
      for (const producto of productosNoDestacados) {
        const productCard = new ProductCard(
          producto.name,
          producto.price,
          producto.imagePath,
          producto.description,
          producto.sizes,
          producto._id
        );

        // Selecciona el contenedor adecuado para el producto
        const containerSelector = `[data-${producto.section}]`;
        const container = containers[containerSelector];

        if (container) {
          // Agrega el producto al contenedor
          container.appendChild(productCard.render());
        } else {
          console.error(
            `Contenedor para la sección "${producto.section}" no encontrado.`
          );
        }
      }
    } catch (error) {
      console.error("Error al renderizar productos:", error);
    }
  },

  async cargarProductosSimilares(id) {
    try {
      const data = await productoServices.productoSimilar(id);
      const similares = data.slice(0, 3); // Limitar a los primeros 3 productos

      const contenedorSimilares = document.getElementById(
        "productos-similares"
      );
      if (!contenedorSimilares) {
        console.error("Contenedor de productos similares no encontrado.");
        return;
      }

      // Verificar si hay productos similares
      if (similares.length === 0) {
        contenedorSimilares.innerHTML = `<p>No se encontraron productos similares.</p>`;
        return;
      }
      // Construir HTML de productos similares
      let productosHTML = "";
      similares.forEach((producto) => {
        const imagenesHTML = producto.imagePath
          .map(
            (img) =>
              `<img src="${img}" alt="${producto.name}" class="img-thumbnail">`
          )
          .join("");

        productosHTML += `
          <div class="producto-similar" data-id="${producto._id}" data-name="${
          producto.name
        }" data-price="${producto.price}" data-image='${JSON.stringify(
          producto.imagePath
        )}' data-sizes='${JSON.stringify(producto.sizes)}' data-description="${
          producto.description
        }">
            <a href="#">
              <img src="${producto.imagePath[0]}" alt="${
          producto.name
        }" class="img-thumbnail">
              <p>${producto.name}</p>
              <p>$ ${producto.price}</p>
            </a>
          </div>
        `;
      });
      contenedorSimilares.innerHTML = productosHTML;

      // Manejo de eventos para productos similares
      contenedorSimilares.addEventListener("click", async (e) => {
        const target = e.target.closest(".producto-similar");
        if (target) {
          const id = target.dataset.id;
          const name = target.dataset.name;
          const price = target.dataset.price;
          const imagePath = JSON.parse(target.dataset.image); // Asegúrate de que esto sea un array
          const sizes = JSON.parse(target.dataset.sizes);
          const description = target.dataset.description;

          window.location.hash = `product-${id}`;
          try {
            await mostrarProducto(
              name,
              price,
              imagePath,
              sizes,
              description,
              id
            );
          } catch (error) {
            console.error("Error al mostrar producto:", error);
          }
        }
      });

      // Manejo de eventos para enlaces
      const enlaces = contenedorSimilares.querySelectorAll("a");
      enlaces.forEach((enlace) => {
        enlace.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.hash = `product-${id}`;
        });
      });
    } catch (error) {
      console.error("Error al cargar productos similares:", error);
    }
  },
  async comprarProducto(name, price, imagePath, id, talleSeleccionado) {
    // Manejar lógica para agregar al carrito
    const producto = {
      _id: id,
      name: name,
      price: price,
      imagePath: imagePath,
    };

    carrito.agregarProducto({
      product: producto,
      size: talleSeleccionado,
    });
  },
};

// import { modalControllers } from "../../modal/modal.js";
// import productoServices from "../../services/product_services.js";
// import carrito from "../carrito/carrito-controllers.js";

// class ProductCard {
//   constructor(name, price, imagePath, description, sizes, id, isFeatured) {
//     this.name = name;
//     this.price = price;
//     this.imagePath = imagePath;
//     this.description = description;
//     this.sizes = sizes;
//     this.id = id;
//     this.isFeatured = isFeatured;
//   }

//   render() {
//     const card = document.createElement("div");
//     card.classList.add("card");
//     card.innerHTML = `
//       <div class="container mx-auto mt-4">
//         <div class="img-card">
//           <img class="card-img-top" src="${this.imagePath}" alt="">
//         </div>
//         <div class="card-body">
//           <a href="#" data-veradmin>ver producto</a>
//           <h4 class="card-title">${this.name}</h4>
//           <p class="card-text">${"$" + this.price}</p>
//           <a href="#form" class="btn btn-primary" id="${
//             this.id
//           }" data-edit>Editar</a>
//           <button class="btn btn-danger" type="button" id="${
//             this.id
//           }">Eliminar</button>
//         </div>
//       </div>
//     `;

//     // Manejar eventos
//     card.querySelector("[data-veradmin]").addEventListener("click", (e) => {
//       e.preventDefault();
//       mostrarProducto(
//         this.name,
//         this.price,
//         this.imagePath,
//         this.sizes,
//         this.description,
//         this.id,
//         this.isFeatured
//       );
//     });

//     card.querySelector("button").addEventListener("click", async (e) => {
//       e.preventDefault();
//       ProductEventHandler.handleDelete(this.id);
//     });

//     card.querySelector("[data-edit]").addEventListener("click", async (e) => {
//       e.preventDefault();
//       ProductEventHandler.handleEdit(
//         this.name,
//         this.price,
//         this.imagePath,
//         this.description,
//         this.sizes,
//         this.id,
//         this.isFeatured
//       );
//     });

//     return card;
//   }
// }

// class ProductEventHandler {
//   constructor() {
//     // No hay necesidad de almacenar datos aquí por ahora
//   }

//   // static handleShow(name, imagePath, sizes, description) {
//   //   try {
//   //     mostrarProducto(name, imagePath, sizes, description);
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // }

//   static handleDelete(id) {
//     try {
//       modalControllers.modalEliminar(id);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async handleEdit(name, price, imagePath, sizes, description, id) {
//     try {
//       await productoServices.detalleProducto(id);
//       const productEditor = new ProductEditor();
//       productEditor.editProduct(name, price, imagePath, sizes, description, id);
//     } catch (error) {
//       console.error("Error al obtener el detalle del producto:", error);
//       alert(
//         "Ocurrió un error al obtener el detalle del producto. Por favor, intenta nuevamente."
//       );
//     }
//   }
// }

// class ProductEditor {
//   constructor() {
//     this.modal = document.getElementById("modal");
//     this.productoEdicion = this.modal.querySelector("[data-table]");
//   }

//   editProduct(name, price, imagePath, description, sizes, id, isFeatured) {
//     this.renderEditor(
//       name,
//       price,
//       imagePath,
//       description,
//       sizes,
//       id,
//       isFeatured
//     );
//     this.setupFormSubmitHandler(id);
//   }

//   renderEditor(name, price, imagePath, description, sizes, id, isFeatured) {
//     modalControllers.baseModal();
//     const opcionesTalles = sizes
//       .map(
//         (size) => `
//     <option value="${size}">${size}</option>
//   `
//       )
//       .join("");

//     this.productoEdicion.innerHTML = `
//       <div class="text-center">
//         <div class="card-header">
//           <img class="img-card-top mx-auto" style="width: 10rem;" src="${imagePath}" alt="">
//           <form action="/api/updateProduct/${id}" id="form" enctype="multipart/form-data" method="POST" data-forma>
//             <p class="parrafo">Producto a editar</p>
//             <div class="form-group">
//               <input class="form-control p-2" placeholder="imageUrl" type="file" name="imagePath" data-image autofocus>
//               <input type="hidden" class="oldImagePath" name="oldImagePath" value="${imagePath}" data-oldPath>
//             </div>
//             <div class="form-group">
//               <input class="form-control mt-3 p-2" placeholder="nombre" type="text" value="${name}" required data-nombre>
//             </div>
//             <div class="form-group">
//               <input class="form-control mt-3 mb-3 p-2" placeholder="precio" type="text" value="${price}" required data-precio>
//             </div>
//             <div class="form-group">
//               <textarea class="form-control mt-3 mb-3 p-2" placeholder="Descripción" required data-description>${description}</textarea>
//             </div>

//             <div class="form-group form-check mb-3">
//               <input type="checkbox" class="form-check-input" id="isFeatured" name="isFeatured" ${
//                 isFeatured ? "checked" : ""
//               }>
//               <label class="form-check-label" for="isFeatured">Destacar producto</label>
//             </div>

//             <div class="mt-auto pt-3">
//             <label for="variation_1">Talles actuales</label>
//             <select id="variation_1" class="form-select mb-3">
//             ${opcionesTalles}
//             </select>
//             </div>
//             <label for="variation_1">Modificar talles</label>
//           <div class="form-group mb-4">
//             <div class="form-check-inline me-3">
//               <input class="form-check-input" type="checkbox" value="Talle 1" name="sizes" id="talle1">
//               <label class="form-check-label" for="talle1">Talle 1</label>
//             </div>
//             <div class="form-check-inline me-3">
//               <input class="form-check-input" type="checkbox" value="Talle 2" name="sizes" id="talle2">
//               <label class="form-check-label" for="talle2">Talle 2</label>
//             </div>
//             <div class="form-check-inline me-3">
//               <input class="form-check-input" type="checkbox" value="Talle 3" name="sizes" id="talle3">
//               <label class="form-check-label" for="talle3">Talle 3</label>
//             </div>
//             <div class="form-check-inline me-3">
//               <input class="form-check-input" type="checkbox" value="Talle 4" name="sizes" id="talle4">
//               <label class="form-check-label" for="talle4">Talle 4</label>
//             </div>
//             <div class="form-check-inline me-3">
//               <input class="form-check-input" type="checkbox" value="Talle 5" name="sizes" id="talle5">
//               <label class="form-check-label" for="talle5">Talle 5</label>
//             </div>
//           </div>

//               <button type="submit" class="btn btn-primary btn-lg">Editar producto</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     `;
//     this.productoEdicion.classList.add("modalVisor");
//   }

//   setupFormSubmitHandler(id) {
//     const form = this.productoEdicion.querySelector("[data-forma]");
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const name = document.querySelector("[data-nombre]").value;
//       const price = document.querySelector("[data-precio]").value;
//       const description = document.querySelector("[data-description]").value;
//       const imagePath = document.querySelector("[data-image]").files[0];
//       const oldImagePath = document.querySelector("[data-oldPath]").value;
//       const isFeatured = document.querySelector("#isFeatured").checked;

//       const selectedSizes = Array.from(
//         document.querySelectorAll('input[name="sizes"]:checked')
//       ).map((checkbox) => checkbox.value);

//       const dataEdit = new FormData();
//       if (imagePath) {
//         dataEdit.append("imagePath", imagePath);
//       }
//       dataEdit.append("name", name);
//       dataEdit.append("price", price);
//       dataEdit.append("description", description);
//       dataEdit.append("oldImagePath", oldImagePath);
//       dataEdit.append("isFeatured", isFeatured);

//       selectedSizes.forEach((size) => dataEdit.append("sizes[]", size));

//       try {
//         await productoServices.actualizarProducto(dataEdit, id);
//         modalControllers.modalProductoEditado();
//       } catch (err) {
//         console.error("Error al actualizar el producto:", err);
//         alert(
//           "Ocurrió un error al actualizar el producto. Por favor, intenta nuevamente."
//         );
//       }
//     });
//   }
// }

// const cargarProductosSimilares = async (id) => {
//   try {
//     const data = await productoServices.productoSimilar(id);
//     const similares = data;

//     const contenedorSimilares = document.getElementById("productos-similares");
//     if (!contenedorSimilares) {
//       console.error("Contenedor de productos similares no encontrado.");
//       return;
//     }

//     contenedorSimilares.innerHTML = ""; // Limpiar contenedor antes de agregar nuevos productos
//     similares.forEach((producto) => {
//       // Actualiza la URL con un hash que incluye el ID del producto
//       window.location.hash = `product-${id}`;

//       const productoHTML = `
//         <div class="producto-similar" data-id="${producto._id}" data-name="${
//         producto.name
//       }" data-price="${producto.price}" data-image="${
//         producto.imagePath
//       }" data-sizes='${JSON.stringify(producto.sizes)}' data-description="${
//         producto.description
//       }">
//           <a href="#">
//             <img src="${producto.imagePath}" alt="${
//         producto.name
//       }" class="img-thumbnail">
//             <p>${producto.name}</p>
//             <p>$ ${producto.price}</p>
//           </a>
//         </div>
//       `;
//       contenedorSimilares.innerHTML += productoHTML;
//     });

//     contenedorSimilares.addEventListener("click", (e) => {
//       const target = e.target.closest(".producto-similar");
//       if (target) {
//         const id = target.dataset.id;
//         const name = target.dataset.name;
//         const price = target.dataset.price;
//         const imagePath = [target.dataset.image];
//         const sizes = JSON.parse(target.dataset.sizes);
//         const description = target.dataset.description;
//         mostrarProducto(name, price, imagePath, sizes, description, id);
//       }
//     });
//   } catch (error) {
//     console.error("Error al cargar productos similares:", error);
//   }
// };

// const mostrarProducto = async (
//   name,
//   price,
//   imagePath,
//   sizes,
//   description,
//   id
// ) => {
//   modalControllers.baseModal();
//   const modal = document.getElementById("modal");
//   const mostrarProducto = modal.querySelector("[data-table]");

//   // Renderizar detalles del producto
//   mostrarProducto.innerHTML = `
//     <div class="contenido_container">
//       <div class="row">
//         <div class="col-md-6 mx-auto">
//           <img class="card-img-top" src="${imagePath}" alt="">
//         </div>
//         <div class="col-md-6 mx-auto d-flex flex-column">
//           <div class="card-body">
//             <h4 class="card-title">${name}</h4>
//             <br>
//             <div class="card-text" style="overflow-y: auto;">
//               ${description}
//             </div>
//           </div>
//           <div class="mt-auto pt-3">
//             <label for="variation_1">Talles disponibles</label>
//             <select id="variation_1" class="form-select mb-3">
//               ${sizes
//                 .map((size) => `<option value="${size}">${size}</option>`)
//                 .join("")}
//             </select>
//             <div class="mx-auto text-center">
//               <a id="compartir-producto" title="Compartir" class="icono-compartir">
//                 <i class="fa-solid fa-share-nodes"></i>
//                 <p>Compartir</p>
//               </a>
//             </div>
//             <div class="form-row align-items-center">
//               <div class="mx-auto">
//                 <button type="button" class="btn btn-primary btn-block" data-carrito>Agregar al carrito</button>
//               </div>
//             </div>
//             <div class="d-flex justify-content-between align-items-center mt-3"></div>
//             <em style="font-size: 10pt; font-family: Arial, sans-serif; font-style: italic; background-color: transparent; vertical-align: baseline;">
//               Se recomienda lavar la prenda a mano con jabón blanco o en lavarropas usando modo delicado sin centrifugado fuerte, utilizando productos que no contengan lavandina ni derivados que puedan dañarla.
//             </em>
//           </div>
//         </div>
//       </div>
//       <div class="row mt-4">
//         <h5>Productos Similares</h5>
//         <div id="productos-similares" class="d-flex justify-content-center align-items-center gap-3"></div>
//       </div>
//     </div>
//   `;

//   // Manejar lógica para agregar al carrito
//   const producto = {
//     _id: id,
//     name: name,
//     price: price,
//     imagePath: imagePath,
//   };

//   mostrarProducto
//     .querySelector("[data-carrito]")
//     .addEventListener("click", () => {
//       const talleSeleccionado = document.getElementById("variation_1").value;
//       carrito.agregarProducto({
//         product: producto,
//         size: talleSeleccionado,
//       });
//     });

//   const compartirProducto = document.getElementById("compartir-producto");
//   compartirProducto.addEventListener("click", () => {
//     const productUrl = window.location.href;
//     if (navigator.share) {
//       navigator
//         .share({
//           text: `¡Mira este producto! ${name} por solo $${price}`,
//           url: productUrl,
//         })
//         .catch((error) => console.log("Error sharing:", error));
//     } else {
//       alert(
//         "La función de compartir no es compatible con tu navegador. Por favor, comparte el enlace manualmente."
//       );
//     }
//   });
//   try {
//     await cargarProductosSimilares(id);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const renderProducts = async () => {
//   try {
//     const listaProductos = await productoServices.listaProductos();
//     const { products } = listaProductos;

//     for (const producto of products) {
//       const productCard = new ProductCard(
//         producto.name,
//         producto.price,
//         producto.imagePath,
//         producto.description,
//         producto.sizes,
//         producto._id,
//         producto.isFeatured
//       );
//       // Renderizar el producto y adjuntar al contenedor adecuado
//       const container = document.querySelector(`[data-${producto.section}]`);
//       if (container) {
//         container.appendChild(productCard.render());
//       } else {
//         console.error(
//           `Contenedor para la sección "${producto.section}" no encontrado.`
//         );
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const controllers = {
//   mostrarProducto,
//   renderProducts,
//   cargarProductosSimilares,
// }
