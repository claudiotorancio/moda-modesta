import { StockControllers } from "./stock-controllers.js";

export class RenderStock {
  constructor(titulo) {
    this.titulo = titulo;
    this.stockControllersInstance = new StockControllers(titulo);
  }

  async render() {
    try {
      this.stockControllersInstance.renderStock();
    } catch (error) {
      console.log(error);
    }
  }
}
