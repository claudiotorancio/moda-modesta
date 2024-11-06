export async function compartirProducto() {
  //evento comnpratir
  const compartirBtn = document.getElementById("compartir-producto");

  if (compartirBtn) {
    compartirBtn.addEventListener("click", async () => {
      // Lógica de compartir

      compartirBtn.disabled = true; // Deshabilitar mientras se realiza la acción de compartir
      const productUrl = window.location.href;

      if (navigator.share) {
        await navigator
          .share({
            text: `¡Mira este producto! ${this.name} por solo $${this.price}`,
            url: productUrl,
          })
          .then(() => {
            console.log("Compartido exitosamente");
          })
          .catch((error) => {
            console.log("Error al compartir:", error);
          })
          .finally(() => {
            compartirBtn.disabled = false; // Habilitar nuevamente
          });
      } else {
        alert(
          "La función de compartir no es compatible con tu navegador. Comparte manualmente el enlace."
        );
        compartirBtn.disabled = false; // Habilitar en caso de error
      }
    });
  } else {
    // console.error("El botón 'compartir-producto' no existe en el DOM.");
  }
}
