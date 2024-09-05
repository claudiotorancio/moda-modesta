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
      await this.renderComprasInstance.renderCompraLista(
        this.tabla,
        this.titulo
      );
    } catch (error) {
      console.log(error);
    }
  }
}
