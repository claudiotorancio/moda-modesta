import { baseURL } from "./product_services.js";

export class EnvioService {
    constructor(baseURL) {
      this.baseURL = baseURL;
    }

   
    async calcularCostoEnvio({ peso, destino }) {
      try {
        const response = await fetch(`${this.baseURL}/api/calcularCostoEnvio`, {
          method: "POST",
          body: JSON.stringify({ peso, destino }),
          headers: {
            "Content-Type": "application/json",
          },
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
  

