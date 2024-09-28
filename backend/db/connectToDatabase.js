import mongoose from "mongoose";
import MONGODB_URI from "../config.js";

let cachedConnection = null;

export async function connectToDatabase() {
  // Si ya existe una conexión, la reutiliza
  if (cachedConnection) {
    return cachedConnection;
  }

  // Si no hay conexión, crea una nueva
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedConnection = conn;
    console.log("Conexión a MongoDB establecida");
    return cachedConnection;
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}
