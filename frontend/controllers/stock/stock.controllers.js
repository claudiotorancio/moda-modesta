import { RenderStock } from "./eventHandlersStock.js";

export class StockControllers {
  constructor(titulo) {
    this.titulo = titulo;
    this.renderHelpresInstance = new RenderStock(titulo);
  }

  async render() {
    try {
      this.renderHelpresInstance.renderStock();
    } catch (error) {
      console.log(error);
    }
  }
}
