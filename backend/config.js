import { config } from "dotenv";

// manejo de variables de entorno con dotenv

try {
  if (process.env.NODE_ENV !== "production") {
    config();
  }
} catch (error) {
  console.error("Error al cargar las variables de entorno");
}

//asignar valor a la variable MONGODB_URI, presente en casi todas las rutas

const MONGODB_URI = process.env.MONGODB_URI;

export default MONGODB_URI;
