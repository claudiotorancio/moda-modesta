//compras-controllers.js

import { RenderCompras } from "./renderCompras.js";

export class Compras {
  constructor(tabla, titulo) {
    this.tabla = tabla;
    this.titulo = titulo;
    this.renderComprasInstance = new RenderCompras(tabla, titulo);
  }

  async renderLista() {
    try {
      const data =
        await this.renderComprasInstance.listaServicesHelpers.getAdmin();
      console.log(data);

      if (data.ok && data.role === "admin") {
        // Solo continua si el usuario está autenticado y es un admin
        await this.renderComprasInstance.renderCompraLista();
      } else {
        console.error(
          "Usuario no autenticado o error:",
          data.error || data.message
        );
        // Maneja el caso de no autenticación, por ejemplo, redirigir a la página de login
      }
    } catch (error) {
      console.log(error);
    }
  }
}
