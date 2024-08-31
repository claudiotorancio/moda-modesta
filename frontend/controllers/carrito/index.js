// index.js
import Carrito from "./carrito.js";
import { handleFinalizePurchase } from "./finalizeHandlers.js";
import {
  handleEnvioFormSubmission,
  handleEnvioFormToggle,
  handleCoordinarVendedorChange,
} from "./envioHandlers.js";

const carrito = new Carrito();
document
  .getElementById("finalize-purchase")
  .addEventListener("click", () => handleFinalizePurchase.call(carrito));
document
  .getElementById("calcular-envio")
  .addEventListener("click", (event) =>
    handleEnvioFormSubmission.call(carrito, event)
  );
document
  .getElementById("toggle-envio-form")
  .addEventListener("click", handleEnvioFormToggle);
document
  .getElementById("coordinar-vendedor")
  .addEventListener("input", () => handleCoordinarVendedorChange.call(carrito));
