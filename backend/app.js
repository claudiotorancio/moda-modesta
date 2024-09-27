import express, { urlencoded } from "express";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import indexRouter from "../api/router.js";

const app = express();

// Ruta hacia carpeta 'public'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public");

// Configurar confianza en proxy para que Express sepa si la conexión es segura
app.set("trust proxy", 1);

// Middlewares
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

// Configuración de CORS para permitir cookies
app.use(
  cors({
    origin: "https://moda-modesta.vercel.app", // Cambia esto por tu dominio de frontend
    credentials: true, // Permitir envío de cookies
  })
);

// Configurar sesión con cookies seguras en producción
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Solo en HTTPS
      httpOnly: true, // Solo accesible por el servidor
      sameSite: "None", // Si frontend y backend están en dominios diferentes
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Usar router
app.use("/", indexRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ error: "Algo salió mal, inténtalo de nuevo más tarde." });
});

// Archivos estáticos
app.use(express.static(outputPath));

export default app;
