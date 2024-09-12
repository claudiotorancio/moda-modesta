import { putBanner } from "./eventBanner.js";

export class Estilos {
  constructor(titulo) {
    this.titulo = titulo;
  }

  render() {
    this.clearForm();
    const card = this.createButtons();
    this.titulo.appendChild(card);
    this.setupImgBanner(); // Configura el evento para el botón de reemplazar imagen de banner
    this.setupLogo();
    this.setupTituloBanner();
    this.setupColorPagina();
    this.setupColorTarjetas();
  }

  // Vaciar contenido
  clearForm() {
    this.titulo.innerHTML = "";
  }

  createButtons() {
    const card = document.createElement("div");
    card.className = "d-flex justify-content-center align-items-center"; // Centrar el contenedor del formulario

    card.innerHTML = `
      <div class="d-flex flex-column">
        <button class="btn btn-primary mb-2" data-banner>Reemplazar imagen banner</button>
        <button class="btn btn-primary mb-2" data-logo>Reemplazar logo</button>
        <button class="btn btn-primary mb-2" data-tituloBanner>Reemplazar título banner</button>
        <button class="btn btn-primary mb-2" data-colorBody>Reemplazar color de fondo página</button>
        <button class="btn btn-primary mb-2" data-colorCard>Reemplazar color fondo tarjetas</button>
      </div>
    `;

    return card;
  }

  // Capturar los eventos
  setupImgBanner() {
    const bannerButton = this.titulo.querySelector("[data-banner]");
    bannerButton.addEventListener("click", (e) => {
      e.preventDefault();

      // Verifica si ya existe un formulario, para evitar duplicados
      const existingForm = this.titulo.querySelector("#uploadForm");
      if (existingForm) return;

      // Crear y añadir el formulario para reemplazar la imagen del banner
      const card = document.createElement("div");
      card.className = "d-flex justify-content-center align-items-center my-4"; // Centrar el contenedor del formulario y añadir un margen

      card.innerHTML = `
            <div class="form-container p-3 border rounded shadow-sm bg-light">
                <form id="uploadForm">
                    <div class="mb-3">
                        <label for="fileInput" class="form-label">Selecciona una nueva imagen:</label>
                        <input type="file" class="form-control" id="fileInput" accept="image/*" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Actualizar Banner</button>
                </form>
            </div>
        `;

      this.titulo.appendChild(card);
      putBanner(); // Mueve la lógica de putBanner aquí para mayor claridad
    });
  }

  setupLogo() {
    const logoButton = this.titulo.querySelector("[data-logo]");
    logoButton.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Estoy en el botón de logo");
    });
  }

  setupTituloBanner() {
    const tituloBannerButton = this.titulo.querySelector("[data-tituloBanner]");
    tituloBannerButton.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Estoy en el botón de título del banner");
    });
  }

  setupColorPagina() {
    const colorPaginaButton = this.titulo.querySelector("[data-colorBody]");
    colorPaginaButton.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Estoy en el botón de color de fondo de página");
    });
  }

  setupColorTarjetas() {
    const colorTarjetasButton = this.titulo.querySelector("[data-colorCard]");
    colorTarjetasButton.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Estoy en el botón de color de fondo de tarjetas");
    });
  }
}
