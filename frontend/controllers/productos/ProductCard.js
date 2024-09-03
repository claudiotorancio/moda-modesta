import { mostrarProducto } from "./ProductViewer.js";
import { ProductEventHandler } from "./ProductEventHandler.js";

export class ProductCard {
  constructor(name, price, imagePath, description, sizes, id, isFeatured) {
    this.name = name;
    this.price = price;
    this.imagePath = imagePath;
    this.description = description;
    this.sizes = sizes;
    this.id = id;
    this.isFeatured = isFeatured;
  }

  render() {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="container mx-auto mt-4">
        <div class="img-card">
          <img class="card-img-top" src="${this.imagePath[0]}" alt="">
        </div>
        <div class="card-body">
          <a href="#" data-veradmin>ver producto</a>
          <h4 class="card-title">${this.name}</h4>
          <p class="card-text">${"$" + this.price}</p>
          <a href="#form" class="btn btn-primary" id="${
            this.id
          }" data-edit>Editar</a>
          <button class="btn btn-danger" type="button" id="${
            this.id
          }">Eliminar</button>
        </div>
      </div>
    `;

    this.addEventListeners(card);
    return card;
  }

  addEventListeners(card) {
    card.querySelector("[data-veradmin]").addEventListener("click", (e) => {
      e.preventDefault();
      window.location.hash = `product-${this.id}`;
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

    card.querySelector("button").addEventListener("click", (e) => {
      e.preventDefault();
      ProductEventHandler.handleDelete(this.id);
    });

    card.querySelector("[data-edit]").addEventListener("click", (e) => {
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
  }
}
