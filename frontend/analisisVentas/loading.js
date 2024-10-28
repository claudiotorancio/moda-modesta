//loading.js

export function showLoading(titulo) {
  const loadingMessage = document.createElement("div");
  loadingMessage.className = "alert alert-info";
  loadingMessage.textContent = "Cargando datos...";
  titulo.parentNode.insertBefore(loadingMessage, titulo);
}

export function hideLoading(titulo) {
  const loadingMessage = titulo.parentNode.querySelector(".alert.alert-info");
  if (loadingMessage) {
    loadingMessage.remove();
  }
}
