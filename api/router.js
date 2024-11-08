// import { fileURLToPath } from "url";
// import express, { Router } from "express";
import { Router } from "express";
import {
  validacionesAgregarResena,
  validacionesPutResena,
  validacionesSendMail,
  validacionesSuscribeMail,
  validacionesResetPassword,
  validacionesConfirmResetPassword,
  validacionesNotificacionesSinStock,
  validacionesPutProductCart,
  validacionesDeleteCart,
  validacionesDeletOrder,
  validacionesAceptarPedido,
  validacionesFinalizarPedido,
  validacionesCancelarPedido,
  validacionesEnviarPromociones,
  validacionesCostoEnvio,
  validacionesSignup,
  validacionesSignin,
  validacionesUpdatePassword,
  validacionesProducto,
  validacionesProductoActualizacion,
} from "../api/validaciones.js";
// import morgan from "morgan";
// import cors from "cors";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import MongoDBStore from "connect-mongodb-session";
import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import rateLimit from "express-rate-limit";
import path from "path";

// import passport from "../backend/lib/passport.js";
import MONGODB_URI from "../backend/config.js";
import signin from "../backend/routes/login/signin.js";
import signup from "../backend/routes/login/signup.js";
import logout from "../backend/routes/login/logout.js";
// import listaProductosUsuario from "../backend/routes/product/listaProductosUsuario.js";
import listaProductos from "../backend/routes/product/listaProductos.js";
import createProduct from "../backend/routes/product/createProduct.js";
import desactivateProduct from "../backend/routes/product/desactivateProduct.js";
import activarProducto from "../backend/routes/product/activarProducto.js";
import detailsProduct from "../backend/routes/product/detailsProduct.js";
import updateProduct from "../backend/routes/product/updateProduct.js";
import listaAdmin from "../backend/routes/list/lista.Admin.js";
import deleteUser from "../backend/routes/list/deleteUser.js";
import contadorProductos from "../backend/routes/list/contadorProductos.js";
import updateUser from "../backend/routes/list/updateUser.js";
import getUser from "../backend/routes/list/getUser.js";
import getDataUser from "../backend/routes/list/getDataUser.js";
import destacadosProduct from "../backend/routes/product/destacados.js";
import sendMail from "../backend/routes/nodeMailer/sendMail.js";
import suscribeMail from "../backend/routes/nodeMailer/suscribeMail.js";
import confirmMail from "../backend/routes/nodeMailer/confirmMail.js";
import success from "../backend/routes/nodeMailer/success.js";
import error from "../backend/routes/nodeMailer/error.js";
import costoEnvio from "../backend/routes/Envios/costoEnvio.js";
import productoSimilar from "../backend/routes/product/productoSimilar.js";
import { requireAdmin } from "../backend/routes/requireAdmin.js";
import purchaseOrder from "../backend/routes/purchase/purchase.js";
import deleteOrder from "../backend/routes/purchase/deleteCompra.js";
import compraPrepare from "../backend/routes/purchase/compraPrepare.js";
import compraEnCamino from "../backend/routes/purchase/compraEnCamino.js";
import aceptarPedido from "../backend/routes/purchase/aceptarPedido.js";
import correoEnCamino from "../backend/routes/purchase/correoEnCamino.js";
import finalizarPedido from "../backend/routes/purchase/finalizarPedido.js";
import enviarPromocion from "../backend/routes/list/enviiarpromocion.js";
import getProductsCart from "../backend/routes/carrito/getProductsCart.js";
import addProductCart from "../backend/routes/carrito/addProductCart.js";
import putProductCart from "../backend/routes/carrito/putProductCart.js";
import deleteProductCart from "../backend/routes/carrito/deleteProductCart.js";
import limpiarCarrito from "../backend/routes/carrito/limpiarCarrito.js";
import agregarResena from "../backend/routes/resena/agregarResena.js";
import getResena from "../backend/routes/resena/getResena.js";
import putResena from "../backend/routes/resena/putResena.js";
import deleteResena from "../backend/routes/resena/deleteResena.js";
import { compraCancelada } from "../backend/routes/purchase/compraCancelada.js";
import notificacionSinStock from "../backend/routes/notificaciones/notificacionSinStock.js";
import getNotificaciones from "../backend/routes/notificaciones/getNotificaciones.js";
import notificacionIngreso from "../backend/routes/notificaciones/notificacionIngreso.js";
import { authenticateJWT } from "../backend/lib/auth.js";
import getAdmin from "../backend/routes/list/getAdmin.js";
import password from "../backend/routes/nodeMailer/password.js";
import sendResetPassword from "../backend/routes/login/sendResetPassword.js";
import updatePassword from "../backend/routes/login/updatePassword.js";
import confirmResetpassword from "../backend/routes/login/confirmResetPassword.js";
import { profileControllers } from "../backend/profile/profileControllers.js";
import { validationResult } from "express-validator";
import getSalesByPeriod from "../backend/sales/getSalesByPeriod.js";
import getTopSellingProducts from "../backend/sales/getTopSellingProducts.js";
import gefetchPendingOrders from "../backend/sales/getFetchPendingOrders.js";
import getCustomerAnalytics from "../backend/sales/getCustomerAnalytics.js";
import authenticateToken from "../backend/routes/login/authenticateToken.js";

const router = Router();
// const app = express();

// router.set("trust proxy", 1); // confianza en el proxy de primer nivel
// Ruta hacia carpeta 'public'
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const outputPath = path.join(__dirname, "../public");

// Middlewares
// Middleware para manejo de errores de validación
const handleValidationErrors = (req, res, next) => {
  // console.log(req.user);
  // console.log("Datos en handleValidationErrors:", req.body); // Log para verificar
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Middlewares
// app.use(cors()); // Mueve cors() al inicio
// app.use(urlencoded({ extended: false }));
// app.use(express.json());
// app.use(morgan("dev"));

// Configuración de la sesión
// const MongoStore = MongoDBStore(session);
// const store = new MongoStore({
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
//       secure: process.env.NODE_ENV === "production", // Asegura que las cookies sean seguras en producción
//       httpOnly: true, // Previene acceso JavaScript a la cookie
//       sameSite: "lax", // Protección contra CSRF
//     },
//   })
// );

// app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());

// Ruta para ver las cookies
// app.get("/", (req, res) => {
//   // Acceder a las cookies desde req.cookies
//   console.log(req.cookies); // Ver las cookies en la consola
//   res.send("Revisa las cookies en la consola!");
// });
// // Manejo de errores
// app.use((err, req, res, next) => {
//   console.log("router.js", req.user);
//   console.error(err.stack);
//   res
//     .status(500)
//     .send({ error: "Algo salió mal, inténtalo de nuevo más tarde." });
// });

// app.use((req, res, next) => {
//   res.setHeader(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, proxy-revalidate"
//   );
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   res.setHeader("Surrogate-Control", "no-store");
//   next();
// });

// // Archivos estáticos
// app.use(express.static(outputPath));

// Configuración del rate-limiter
const purchaseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limitar a 10 solicitudes por IP en el intervalo
  message: {
    error:
      "Demasiadas solicitudes desde esta IP. Intenta nuevamente más tarde.",
  },
});

// Configuración de Multer y AWS S3
const s3 = new AWS.S3({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
});

// const uploadNone = multer();

const upload = () =>
  multer({
    storage: multerS3({
      s3,
      bucket: process.env.BUCKET_AWS,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: "public-read",
      metadata(req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key(req, file, cb) {
        cb(null, Date.now().toString() + path.extname(file.originalname));
      },
    }),
  });

export const uploadSingle = upload(process.env.BUCKET_AWS).array("images[]", 3);
export const uploadSingleUpdate = upload(process.env.BUCKET_AWS).single(
  "imagePath"
);

// Rutas

router.get("/api/protected-route", authenticateToken, (req, res) => {
  res.json({
    message: "Datos protegidos obtenidos con éxito",
    user: req.user,
  });
});

//Sales

router.get("/api/sales", authenticateToken, getSalesByPeriod);
router.get(
  "/api/top-selling-products",
  authenticateToken,
  getTopSellingProducts
);
router.get("/api/orders-pending", authenticateToken, gefetchPendingOrders);
router.get("/api/customer-analytics", authenticateToken, getCustomerAnalytics);
//profile
router.get(
  "/api/pedidosRecientes",
  authenticateToken,
  profileControllers.pedidosRecientes
);

// Notificaciones
router.post(
  "/api/notificacionSinStock",
  validacionesNotificacionesSinStock,
  handleValidationErrors,
  notificacionSinStock
);
router.get(
  "/api/getNotificaciones",
  authenticateToken,
  authenticateJWT,
  getNotificaciones
);
router.post(
  "/api/notificacionIngreso/",
  authenticateToken,

  authenticateJWT,
  notificacionIngreso
);

// Reseñas
router.post(
  "/api/agregarResena",
  authenticateToken,
  validacionesAgregarResena,
  handleValidationErrors,

  agregarResena
);
router.get("/api/getResena", getResena);
router.put(
  "/api/putResena",
  authenticateToken,
  validacionesPutResena,
  handleValidationErrors,
  putResena
);
router.delete("/api/deleteResena", authenticateToken, deleteResena);

// Carrito
router.get("/api/getProductsCart", getProductsCart);
router.post("/api/addProductCart", addProductCart);

router.put(
  "/api/putProductCart",
  validacionesPutProductCart,
  handleValidationErrors,
  putProductCart
);
router.delete(
  "/api/deleteProductCart/:id",
  validacionesDeleteCart,
  handleValidationErrors,
  deleteProductCart
);
router.delete("/api/limpiarCarrito", limpiarCarrito);

// Compras
router.get("/api/purchaseOrder", authenticateToken, purchaseOrder);
router.delete(
  "/api/deleteOrder/:id",
  authenticateToken,
  validacionesDeletOrder,
  handleValidationErrors,
  requireAdmin,
  deleteOrder
);
router.post(
  "/api/compraPrepare",
  authenticateToken,
  requireAdmin,
  compraPrepare
);
router.put("/api/compraEnCamino/:id", authenticateToken, compraEnCamino);
router.put(
  "/api/aceptarPedido/:id",
  authenticateToken,
  validacionesAceptarPedido,
  handleValidationErrors,
  aceptarPedido
);
router.post("/api/correoEnCamino", authenticateToken, correoEnCamino);
router.put(
  "/api/finalizarPedido/:id",
  authenticateToken,
  validacionesFinalizarPedido,
  handleValidationErrors,
  finalizarPedido
);
router.put(
  "/api/compraCancelada/:id",
  authenticateToken,
  validacionesCancelarPedido,
  handleValidationErrors,
  compraCancelada
);

// Rutas nodeMailer
router.post(
  "/api/sendMail",
  validacionesSendMail,
  handleValidationErrors,
  purchaseLimiter,
  sendMail
);
router.post(
  "/api/suscribeMail",
  validacionesSuscribeMail,
  handleValidationErrors,
  purchaseLimiter,
  suscribeMail
);
router.get("/api/confirmMail", confirmMail);
router.get("/success", success);
router.get("/error", error);
router.post(
  "/api/enviarPromocion/",
  authenticateToken,
  validacionesEnviarPromociones,
  requireAdmin,
  enviarPromocion
);

// Rutas envío
router.post(
  "/api/costoEnvio",
  validacionesCostoEnvio,
  handleValidationErrors,
  costoEnvio
);

// Rutas signin
router.post(
  "/api/signup",
  validacionesSignup,
  handleValidationErrors,
  purchaseLimiter,
  signup
);

router.post(
  "/api/signin",
  validacionesSignin,
  handleValidationErrors,
  purchaseLimiter,
  signin
);

router.delete("/api/logout", logout);
router.post(
  "/api/send-reset-password",
  validacionesResetPassword,
  handleValidationErrors,
  purchaseLimiter,
  sendResetPassword
);
router.get("/reset-password", password);
router.post(
  "/api/update-password",
  validacionesUpdatePassword,
  handleValidationErrors,
  updatePassword
);
router.get(
  "/api/reset-password",
  validacionesConfirmResetPassword,
  handleValidationErrors,
  confirmResetpassword
);

// Rutas listado
router.get("/api/getDataUser", authenticateToken, getDataUser);
router.get("/api/getAdmin", getAdmin);
router.get("/api/getUser/:id", authenticateToken, getUser);
router.get("/api/renderLista", authenticateToken, listaAdmin);
router.delete("/api/deleteUser/:id", authenticateToken, deleteUser);
router.put("/api/updateUser/:id", authenticateToken, updateUser);
router.get("/api/contadorProductos/:id", authenticateToken, contadorProductos);

// Rutas productos
router.get("/api/renderDestacados", destacadosProduct);
// router.get("/api/listaProductosUsuario", listaProductosUsuario);
router.get("/api/listaProductos", authenticateToken, listaProductos);
router.post(
  "/api/createProduct",
  uploadSingle,

  validacionesProducto,
  handleValidationErrors,
  authenticateToken,
  createProduct
);
router.put(
  "/api/desactivateProduct/:id",
  authenticateToken,
  desactivateProduct
);
router.put("/api/activateProduct/:id", authenticateToken, activarProducto);
router.get("/api/detailsProduct/:id", detailsProduct);
router.put(
  "/api/updateProduct",
  uploadSingleUpdate,
  (req, res, next) => {
    // Ver los datos que están llegando a la validación
    console.log("Datos entrantes router.js:", req.body);
    next(); // Continúa al siguiente middleware
  },

  validacionesProductoActualizacion,
  handleValidationErrors,
  authenticateToken,
  updateProduct
);
router.get("/api/productoSimilar/:id", productoSimilar);

// // Middleware para la autenticación
// app.use("/", router);

// Escuchar en el puerto especificado
export default router;
