import {
  loadBannerText,
  putBanner,
  putColorSettings,
  putColorSettingsCard,
  putLogo,
  putTitulo,
  saveStylesToFile,
} from "./eventBanner.js";

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
    this.handleFileUpload();
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
       <button class="btn btn-primary mb-2" data-salvarCambios>Guardar Estilos</button>

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
    const logoButton = document.querySelector("[data-logo]"); // Suponiendo que tienes un botón con data-logo para subir la imagen
    logoButton.addEventListener("click", (e) => {
      e.preventDefault();

      // Verifica si ya existe un formulario, para evitar duplicados
      const existingForm = this.titulo.querySelector("#uploadLogoForm");
      if (existingForm) return;

      // Crear y añadir el formulario para reemplazar la imagen del logo
      const card = document.createElement("div");
      card.className = "d-flex justify-content-center align-items-center";

      card.innerHTML = `
            <div class="form-container p-3 border rounded shadow-sm bg-light">
                <form id="uploadLogoForm">
                 <div class="mb-3">
                        <label for="fileInput" class="form-label">Selecciona una nueva imagen:</label>
                    <input type="file" class="form-control" id="logoFileInput" accept="image/*" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Actualizar Logo</button>
                </form>
            </div>
        `;

      this.titulo.appendChild(card); // Agregar al body o al contenedor adecuado
      putLogo();
    });
  }

  setupTituloBanner() {
    const tituloBannerButton = this.titulo.querySelector("[data-tituloBanner]");
    tituloBannerButton.addEventListener("click", (e) => {
      e.preventDefault();

      // Verifica si ya existe un formulario, para evitar duplicados
      const existingForm = this.titulo.querySelector("#textForm");
      if (existingForm) return;

      const card = document.createElement("div");
      card.className = "d-flex justify-content-center align-items-center"; // Centrar el contenedor del formulario

      card.innerHTML = `
        <div class="form-container">
          <form id="textForm">
            <div class="mb-3">
              <label for="titleInput" class="form-label">Nuevo Título</label>
              <input type="text" id="titleInput" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="subtitleInput" class="form-label">Nuevo Subtítulo</label>
              <input type="text" id="subtitleInput" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="colorInput" class="form-label">Color del Título</label>
              <input type="color" id="colorInput" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Actualizar Texto</button>
          </form>
        </div>
      `;

      // Añadir el formulario debajo de los botones de reemplazo de imagen
      this.titulo.appendChild(card);
      putTitulo();
    });
  }

  setupColorPagina() {
    const colorPaginaButton = this.titulo.querySelector("[data-colorBody]");
    colorPaginaButton.addEventListener("click", (e) => {
      e.preventDefault();

      // Crear y añadir el formulario para seleccionar el color de fondo de la página
      const existingForm = this.titulo.querySelector("#colorPaginaForm");
      if (existingForm) return;

      const card = document.createElement("div");
      card.className = "d-flex justify-content-center align-items-center my-4"; // Centrar el contenedor del formulario y añadir un margen

      card.innerHTML = `
            <div class="form-container p-3 border rounded shadow-sm bg-light">
                <form id="colorPaginaForm">
                    <div class="mb-3">
                        <label for="colorPaginaInput" class="form-label">Selecciona el color de fondo de la página:</label>
                        <input type="color" id="colorPaginaInput" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Aplicar Color</button>
                </form>
            </div>
        `;

      this.titulo.appendChild(card);
      putColorSettings();
    });
  }

  handleFileUpload() {
    const salvarCambios = this.titulo.querySelector("[data-salvarCambios]");
    salvarCambios.addEventListener("click", (e) => {
      e.preventDefault();

      // Crear y añadir el formulario para seleccionar el color de fondo de la página
      const existingForm = this.titulo.querySelector("#colorPaginaForm");
      if (existingForm) return;
      alert("enviar el archivo y las imagenes al creador de la pagina ");
      saveStylesToFile();
      window.location.replace("/index.html");
    });
  }

  setupColorTarjetas() {
    const colorTarjetasButton = this.titulo.querySelector("[data-colorCard]");
    colorTarjetasButton.addEventListener("click", (e) => {
      e.preventDefault();

      // Crear y añadir el formulario para seleccionar el color de fondo de las tarjetas
      const existingForm = this.titulo.querySelector("#colorTarjetasForm");
      if (existingForm) return;

      const card = document.createElement("div");
      card.className = "d-flex justify-content-center align-items-center my-4"; // Centrar el contenedor del formulario y añadir un margen

      card.innerHTML = `
            <div class="form-container p-3 border rounded shadow-sm bg-light">
                <form id="colorTarjetasForm">
                    <div class="mb-3">
                        <label for="colorTarjetasInput" class="form-label">Selecciona el color de fondo de las tarjetas:</label>
                        <input type="color" id="colorTarjetasInput" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Aplicar Color</button>
                </form>
            </div>
        `;

      this.titulo.appendChild(card);
      putColorSettingsCard();
    });
  }
}
