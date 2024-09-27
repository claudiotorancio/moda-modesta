import express, { urlencoded } from "express";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import indexRouter from "../api/router.js";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import MONGODB_URI from "../backend/config.js";
import passport from "passport";

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

const isProduction = process.env.NODE_ENV === "production";
console.log(isProduction);

// Configurar sesión con cookies seguras en producción
app.use(
  session({
    key: "user_sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore(session)({
      uri: MONGODB_URI,
      collection: "mySessions",
    }),
    cookie: {
      // domain: "https://moda-modesta.vercel.app",
      expires: 600000, // 10 minutos
      secure: isProduction, // Solo en producción
      httpOnly: true, // Previene acceso JavaScript a la cookie
      sameSite: "lax", // Protección contra CSRF
    },
  })
);

router.use(passport.initialize());
router.use(passport.session());
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
