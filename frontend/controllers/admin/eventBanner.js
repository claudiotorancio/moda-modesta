// eventBanner.js
export function putBanner() {
  const uploadForm = document.getElementById("uploadForm");
  uploadForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const banner = document.getElementById("banner");
        const imageUrl = e.target.result;

        // Establecer la imagen en el banner
        banner.style.backgroundImage = `url(${imageUrl})`;

        // Guardar la URL en localStorage
        localStorage.setItem("bannerImage", imageUrl);
      };

      reader.readAsDataURL(file);
    }
  });
}

export function loadBannerImage() {
  const savedImageUrl = localStorage.getItem("bannerImage");
  if (savedImageUrl) {
    const banner = document.getElementById("banner");
    banner.style.backgroundImage = `url(${savedImageUrl})`;
  }
}

export function putLogo() {
  // Configurar el evento submit para el formulario del logo
  const uploadLogoForm = document.getElementById("uploadLogoForm");
  uploadLogoForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario

    const fileInput = document.getElementById("logoFileInput");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const logo = document.getElementById("logo");
        const imageUrl = e.target.result;

        // Establecer la imagen en el logo
        logo.src = imageUrl;

        // Guardar la URL en localStorage
        localStorage.setItem("logoImage", imageUrl);
      };

      reader.readAsDataURL(file);
    }
  });
}

export function loadLogoImage() {
  const savedLogoUrl = localStorage.getItem("logoImage");
  if (savedLogoUrl) {
    const logo = document.getElementById("logo");
    logo.src = savedLogoUrl;
  }
}

export function putTitulo() {
  const textForm = document.getElementById("textForm");
  textForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario

    const newTitle = document.getElementById("titleInput").value;
    const newSubtitle = document.getElementById("subtitleInput").value;
    const titleColor = document.getElementById("colorInput").value;

    // Aplicar los cambios al banner
    const bannerTitle = document.getElementById("bannerTitle");
    const bannerSubtitle = document.getElementById("bannerSubtitle");

    if (bannerTitle) {
      bannerTitle.textContent = newTitle;
      bannerTitle.style.color = titleColor;
    }

    if (bannerSubtitle) {
      bannerSubtitle.textContent = newSubtitle;
    }

    // Guardar los valores en localStorage para mantenerlos tras el refresco de la página
    localStorage.setItem("bannerTitle", newTitle);
    localStorage.setItem("bannerSubtitle", newSubtitle);
    localStorage.setItem("bannerTitleColor", titleColor);
  });
}

export function loadBannerText() {
  const savedTitle = localStorage.getItem("bannerTitle");
  const savedSubtitle = localStorage.getItem("bannerSubtitle");
  const savedTitleColor = localStorage.getItem("bannerTitleColor");

  const bannerTitle = document.getElementById("bannerTitle");
  const bannerSubtitle = document.getElementById("bannerSubtitle");

  if (bannerTitle) {
    if (savedTitle) {
      bannerTitle.textContent = savedTitle;
    }
    if (savedTitleColor) {
      bannerTitle.style.color = savedTitleColor;
    }
  }

  if (bannerSubtitle && savedSubtitle) {
    bannerSubtitle.textContent = savedSubtitle;
  }
}

export function putColorSettings() {
  const colorForm = document.getElementById("colorPaginaForm");
  if (!colorForm) return;

  colorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const colorInput = document.getElementById("colorPaginaInput").value;
    document.body.style.backgroundColor = colorInput;
    localStorage.setItem("pageBackgroundColor", colorInput);
    alert("El color de fondo de la página ha sido cambiado.");
  });

  // Cargar el color guardado (si existe)
  const savedColor = localStorage.getItem("pageBackgroundColor");
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
    document.getElementById("colorPaginaInput").value = savedColor;
  }
}

// Función para cargar y aplicar los colores desde localStorage
export function loadColorSettings() {
  const savedBackgroundColor = localStorage.getItem("pageBackgroundColor");
  if (savedBackgroundColor) {
    document.body.style.backgroundColor = savedBackgroundColor;
  }
}

export function putColorSettingsCard() {
  const colorForm = document.getElementById("colorTarjetasForm");
  if (!colorForm) return;

  colorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const colorInput = document.getElementById("colorTarjetasInput").value;
    const tarjetas = document.querySelectorAll(".card"); // Asegúrate de que tus tarjetas tengan la clase "card"
    tarjetas.forEach((tarjeta) => {
      tarjeta.style.backgroundColor = colorInput;
    });
    localStorage.setItem("cardBackgroundColor", colorInput);
    alert("El color de fondo de las tarjetas ha sido cambiado.");
  });

  // Cargar el color guardado (si existe)
  const savedColor = localStorage.getItem("cardBackgroundColor");
  if (savedColor) {
    const tarjetas = document.querySelectorAll(".card");
    tarjetas.forEach((tarjeta) => {
      tarjeta.style.backgroundColor = savedColor;
    });
    document.getElementById("colorTarjetasInput").value = savedColor;
  }
}

// Función para cargar y aplicar los colores desde localStorage
export function loadColorSettingsCard() {
  const savedBackgroundColor = localStorage.getItem("pageBackgroundColor");
  if (savedBackgroundColor) {
    document.body.style.backgroundColor = savedBackgroundColor;
  }

  const savedCardColor = localStorage.getItem("cardBackgroundColor");
  if (savedCardColor) {
    const tarjetas = document.querySelectorAll(".card");
    tarjetas.forEach((tarjeta) => {
      tarjeta.style.backgroundColor = savedCardColor;
    });
  }
}
