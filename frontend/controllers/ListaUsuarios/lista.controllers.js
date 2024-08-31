import { RenderHelpers } from "./renderHelpers.js";
import { EventHandlers } from "./eventHandlers.js";

export class ListaControllers {
  constructor(tabla, titulo) {
    this.tabla = tabla;
    this.titulo = titulo;
    this.renderHelpers = new RenderHelpers(tabla, titulo);
    this.eventHandlers = new EventHandlers(tabla);
  }

  async renderLista() {
    try {
      const role = await this.renderHelpers.listaServicesHelpers.getAdmin();
      if (role === "admin") await this.renderHelpers.renderUsersList();
    } catch (error) {
      console.log(error);
    }
  }
}
