import { fileURLToPath } from "url";
import express, { Router, urlencoded } from "express";
import {
  validacionesAgregarResena,
  validacionesPutResena,
  validacionesSendMail,
  validacionesResetPassword,
  validacionesConfirmResetPassword,
  validacionesNotificacionesSinStock,
  validacionesPutProductCart,
  validacionesDeleteCart,
  validacionesDeletOrder,
  validacionesAceptarPedido,
  validacionesFinalizarPedido,
  validacionesCancelarPedido,
  validacionesSuscribeMail,
  validacionesConfirmMail,
  validacionesEnviarPromociones,
  validacionesCostoEnvio,
  validacionesSignup,
  validacionesSignin,
  validacionesUpdatePassword,
} from "../api/validaciones.js";
import morgan from "morgan";
// import cors from "cors";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import rateLimit from "express-rate-limit";
import path from "path";

import passport from "../backend/lib/passport.js";
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
import suscribeMail from "../backend/routes/nodeMailer/contactMail.js";
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
import { isAuthenticated } from "../backend/isAuthenticated.js";
import { validationResult } from "express-validator";
import getSalesByPeriod from "../backend/sales/getSalesByPeriod.js";
import getTopSellingProducts from "../backend/sales/getTopSellingProducts.js";
import gefetchPendingOrders from "../backend/sales/getFetchPendingOrders.js";

const router = Router();
const app = express();

app.set("trust proxy", 1); // confianza en el proxy de primer nivel

// Ruta hacia carpeta 'public'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public");

// Middlewares
// Middleware para manejo de errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map((err) => ({
        field: err.param, // El campo que causó el error
        message: err.msg, // El mensaje de error proporcionado
      })),
    });
  }
  next();
};

// Middlewares
app.use(cors()); // Mueve cors() al inicio
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

// Configuración de la sesión
const store = new MongoDBStore(session)({
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
      secure: process.env.NODE_ENV === "production", // Se asegura de que las cookies sean seguras en producción
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
const uploadSingleUpdate = upload(process.env.BUCKET_AWS).single("imagePath");

// Rutas

//Sales

router.get("/api/sales", requireAdmin, getSalesByPeriod);
router.get("/api/top-selling-products", requireAdmin, getTopSellingProducts);
router.get("/api/orders-pending", requireAdmin, gefetchPendingOrders);
//profile
router.get(
  "/api/infoPersonal",
  isAuthenticated,
  profileControllers.InfoPersonal
);
router.get(
  "/api/pedidosRecientes",
  isAuthenticated,
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
  authenticateJWT,
  requireAdmin,
  getNotificaciones
);
router.post(
  "/api/notificacionIngreso/",
  authenticateJWT,
  requireAdmin,
  notificacionIngreso
);

// Reseñas
router.post(
  "/api/agregarResena",
  validacionesAgregarResena,
  handleValidationErrors,
  requireAdmin,
  agregarResena
);
router.get("/api/getResena", getResena);
router.put(
  "/api/putResena/:id",
  validacionesPutResena,
  handleValidationErrors,
  requireAdmin,
  putResena
);
router.delete("/api/deleteResena/:id", requireAdmin, deleteResena);

// Carrito
router.get("/api/getProductsCart", getProductsCart);
router.post("/api/addProductCart", addProductCart);
router.put(
  "/api/putProductCart/:id",
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
router.get("/api/listaOrder", requireAdmin, purchaseOrder);
router.delete(
  "/api/deleteOrder/:id",
  validacionesDeletOrder,
  handleValidationErrors,
  requireAdmin,
  deleteOrder
);
router.post(
  "/api/compraPrepare",

  requireAdmin,
  compraPrepare
);
router.put("/api/compraEnCamino/:id", requireAdmin, compraEnCamino);
router.put(
  "/api/aceptarPedido/:id",
  validacionesAceptarPedido,
  handleValidationErrors,
  requireAdmin,
  aceptarPedido
);
router.post("/api/correoEnCamino", requireAdmin, correoEnCamino);
router.put(
  "/api/finalizarPedido/:id",
  validacionesFinalizarPedido,
  handleValidationErrors,
  requireAdmin,
  finalizarPedido
);
router.put(
  "/api/compraCancelada/:id",
  validacionesCancelarPedido,
  handleValidationErrors,
  requireAdmin,
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
router.get(
  "/api/confirmMail",
  validacionesConfirmMail,
  handleValidationErrors,
  confirmMail
);
router.get("/success", success);
router.get("/error", error);
router.post(
  "/api/enviarPromocion/",
  validacionesEnviarPromociones,
  handleValidationErrors,
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
router.get("/api/getDataUser", getDataUser);
router.get("/api/getAdmin", getAdmin);
router.get("/api/getUser/:id", requireAdmin, getUser);
router.get("/api/renderLista", requireAdmin, listaAdmin);
router.delete("/api/deleteUser/:id", requireAdmin, deleteUser);
router.put("/api/updateUser/:id", requireAdmin, updateUser);
router.get("/api/contadorProductos/:id", requireAdmin, contadorProductos);

// Rutas productos
router.get("/api/renderDestacados", destacadosProduct);
// router.get("/api/listaProductosUsuario", listaProductosUsuario);
router.get("/api/listaProductos", listaProductos);
router.post("/api/createProduct", requireAdmin, uploadSingle, createProduct);
router.put("/api/desactivateProduct/:id", requireAdmin, desactivateProduct);
router.put("/api/activateProduct/:id", requireAdmin, activarProducto);
router.get("/api/detailsProduct/:id", detailsProduct);
router.put(
  "/api/updateProduct/:id",
  requireAdmin,
  uploadSingleUpdate,
  updateProduct
);
router.get("/api/productoSimilar/:id", productoSimilar);

// Middleware para la autenticación
app.use("/", router);

// Escuchar en el puerto especificado
export default app;
