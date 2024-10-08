// // import express, { urlencoded } from "express";
// // import { fileURLToPath } from "url";
// // import path from "path";
// // import morgan from "morgan";
// // import cors from "cors";
// // import cookieParser from "cookie-parser";
// // import indexRouter from "../api/router.js";
// // import passport from "../backend/lib/passport.js";
// // import session from "express-session";
// // import MongoDBStore from "connect-mongodb-session";
// // import MONGODB_URI from "../backend/config.js";

// // const app = express();

// //router
// // // Ruta hacia carpeta 'public'
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);
// // const outputPath = path.join(__dirname, "../public");

// //middlewares
// app.use(cookieParser());
// app.use(urlencoded({ extended: false }));
// app.use(express.json());
// app.use(morgan("dev"));

// app.use(cors());
// //passport

// const store = new MongoDBStore(session)({
//   uri: MONGODB_URI,
//   collection: "mySessions",
// });

// app.use(
//   session({
//     key: "user_sid",
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//       expires: 600000, // 10 minutos
//       secure: process.env.NODE_ENV === "production", // Se asegura de que las cookies sean seguras en producción
//       httpOnly: true, // Previene acceso JavaScript a la cookie
//       sameSite: "lax", // Protección contra CSRF
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use("/", indexRouter);

// //manejo de errores
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res
//     .status(500)
//     .send({ error: "Algo salió mal, inténtalo de nuevo más tarde." });
// });

// indexRouter.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: "Error interno del servidor" });
// });

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: "Error interno del servidor" });
// });

// /*app.use('/', authRouter)*/

// //Archivos estaticos
// app.use(express.static(outputPath));

// export default app;
