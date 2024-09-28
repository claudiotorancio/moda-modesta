import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import indexRouter from "../api/router.js";
// import { baseURL } from "../frontend/services/product_services.js";
// import passport from "../backend/lib/passport.js";
// import session from "express-session";
// import MongoDBStore from "connect-mongodb-session";
// import MONGODB_URI from "../backend/config.js";

const app = express();

//router

// app.set("trust proxy", 1); // Vercel usa un único proxy entre el cliente y tu aplicación

// Ruta hacia carpeta 'public'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public");

//middlewares
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// Configuración de CORS
// const corsOptions = {
//   origin: `${baseURL}`, // Cambia esto a la URL de tu frontend
//   credentials: true, // Permite que las cookies de sesión se envíen
// };

app.use(cors());
//passport

// const isProduction = process.env.NODE_ENV === "production";
// console.log(isProduction);

// const mongoStore = MongoDBStore(session); // Crear la clase del store de MongoDB

// app.use(
//   session({
//     key: "user_sid",
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     store: new mongoStore({
//       uri: MONGODB_URI,
//       collection: "mySessions",
//     }),
//     cookie: {
//       secure: false, // Solo en producción
//       httpOnly: true, // Previene acceso JavaScript a la cookie
//       sameSite: "None", // Protección contra CSRF
//       maxAge: 24 * 60 * 60 * 1000, // 24 horas
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

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
