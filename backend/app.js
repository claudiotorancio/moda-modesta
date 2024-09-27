import express, { urlencoded } from "express";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import indexRouter from "../api/router.js";
// import cookieSession from "cookie-session";

const app = express();

//router

app.set("trust proxy", 1); // Vercel usa un único proxy entre el cliente y tu aplicación

// Ruta hacia carpeta 'public'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public");

//middlewares
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

app.use(cors());
//passport

// const isProduction = process.env.NODE_ENV === "production";
// console.log(isProduction);

// app.use(
//   cookieSession({
//     expires: 600000, // 10 minutos
//     domain: "https://moda-modesta.vercel.app",
//     secure: isProduction, // Solo en producción
//     httpOnly: true, // Previene acceso JavaScript a la cookie
//     sameSite: "lax", // Protección contra CSRF
//   })
// );

app.use("/", indexRouter);

//manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ error: "Algo salió mal, inténtalo de nuevo más tarde." });
});

indexRouter.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

/*app.use('/', authRouter)*/

//Archivos estaticos
app.use(express.static(outputPath));

export default app;
