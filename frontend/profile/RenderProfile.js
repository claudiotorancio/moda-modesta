//RenderPeofile.js

import { profileControllers } from "./profile-controllers.js";

export class RenderProfile {
  constructor(infoPersonal, pedidosRecientes) {
    this.infoPersonal = infoPersonal;
    this.pedidosRecientes = pedidosRecientes;
    this.profileControllers = profileControllers;
  }

  async render() {
    try {
      await this.profileControllers.InfoPersonal();
      await this.profileControllers.pedidosRecientes();
    } catch (error) {
      console.log(error);
    }
  }
}
