import mongoose from "mongoose";
import MONGODB_URI from "../config.js";

let cachedConnection = null;

/**
 * Conecta a MongoDB con lógica de reintentos.
 * @param {number} maxRetries Número máximo de reintentos.
 * @param {number} delay Tiempo de espera entre reintentos en milisegundos.
 * @returns {Promise<mongoose.Connection>} Conexión a MongoDB.
 */
export async function connectToDatabase(maxRetries = 5, delay = 2000) {
  // Reutiliza la conexión si ya está establecida
  if (cachedConnection) {
    return cachedConnection;
  }

  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Intentando conectar a MongoDB (Intento ${retries + 1})...`);
      const conn = await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      cachedConnection = conn;
      console.log("Conexión a MongoDB establecida exitosamente");
      return cachedConnection; // Devuelve la conexión exitosa
    } catch (error) {
      console.error(
        `Error al conectar a MongoDB (Intento ${retries + 1}):`,
        error.message
      );

      retries += 1;
      if (retries >= maxRetries) {
        console.error(
          "Número máximo de reintentos alcanzado. Falló la conexión a MongoDB."
        );
        throw new Error(
          "No se pudo conectar a MongoDB después de varios intentos."
        );
      }

      console.log(`Reintentando en ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Espera antes de reintentar
    }
  }
}
