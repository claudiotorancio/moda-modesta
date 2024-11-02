import { fileURLToPath } from "url";
import express, { urlencoded } from "express";
import router from "./router.js";

import morgan from "morgan";
// import cors from "cors";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";

import path from "path";
import passport from "../backend/lib/passport.js";
import MONGODB_URI from "../backend/config.js";

const app = express();

app.set("trust proxy", 1); // confianza en el proxy de primer nivele

// Ruta hacia carpeta 'public'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public");

// Middlewares

// Middlewares
app.use(cors()); // Mueve cors() al inicio
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

// Configuración de la sesión
const MongoStore = MongoDBStore(session);
const store = new MongoStore({
  uri: MONGODB_URI,
  collection: "mySessions",
});

app.use(
  session({
    key: "user_sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      expires: 600000, // 10 minutos
      secure: process.env.NODE_ENV === "production", // Asegura que las cookies sean seguras en producción
      httpOnly: true, // Previene acceso JavaScript a la cookie
      sameSite: "lax", // Protección contra CSRF
    },
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Ruta para ver las cookies
app.get("/", (req, res) => {
  // Acceder a las cookies desde req.cookies
  console.log(req.cookies); // Ver las cookies en la consola
  res.send("Revisa las cookies en la consola!");
});
// Manejo de errores
app.use((err, req, res, next) => {
  console.log("router.js", req.user);
  console.error(err.stack);
  res
    .status(500)
    .send({ error: "Algo salió mal, inténtalo de nuevo más tarde." });
});

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// Archivos estáticos
app.use(express.static(outputPath));

// Rutas

// Middleware para la autenticación
app.use("/", router);

// Escuchar en el puerto especificado
export default app;
