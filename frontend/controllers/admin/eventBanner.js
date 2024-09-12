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

function loadBannerImage() {
  const savedImageUrl = localStorage.getItem("bannerImage");
  if (savedImageUrl) {
    const banner = document.getElementById("banner");
    banner.style.backgroundImage = `url(${savedImageUrl})`;
  }
}

document.addEventListener("DOMContentLoaded", loadBannerImage);
