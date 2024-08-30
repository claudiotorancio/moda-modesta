// envio_services.js

import { baseURL } from "./product_services.js";

export class EnvioService {
  constructor() {
    this.baseURL = baseURL;
  }

  async calcularCostoEnvio(datosEnvio) {
    // console.log(datosEnvio);
    try {
      const response = await fetch(`${this.baseURL}/api/costoEnvio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosEnvio),
      });
      if (!response.ok) {
        throw new Error("No fue posible calcular el costo del envío");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
}

const envioServices = new EnvioService();
export default envioServices;
