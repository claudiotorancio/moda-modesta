import express, { Router } from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import passport from "../backend/lib/passport.js";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import MONGODB_URI from "../backend/config.js";
import signin from "../backend/routes/login/signin.js";
import getCookie from "../backend/routes/login/getCookie.js";
import signup from "../backend/routes/login/signup.js";
import logout from "../backend/routes/login/logout.js";
import listaProductosUsuario from "../backend/routes/product/listaProductosUsuario.js";
import listaProductosAdmin from "../backend/routes/product/listaProductosAdmin.js";
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
import getAdmin from "../backend/routes/list/getAdmin.js";
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
import path from "path";
import getNotificaciones from "../backend/routes/notificaciones/getNotificaciones.js";
import notificacionIngreso from "../backend/routes/notificaciones/notificacionIngreso.js";
import { authenticateJWT } from "../backend/lib/auth.js";
import rateLimit from "express-rate-limit";
// import cors from "cors";
import { baseURL } from "../frontend/services/product_services.js";

const router = Router();

// Configuración de midllewares

// router.use("trust proxy", 1); // Vercel usa un único proxy entre el cliente y tu aplicación

// Configuración de CORS
// const corsOptions = {
//   origin: `${baseURL}`, // Cambia esto a la URL de tu frontend
//   credentials: true, // Permite que las cookies de sesión se envíen
// };

router.use(express.json());
router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));
// router.use(cors(corsOptions));

const isProduction = process.env.NODE_ENV === "production";
console.log(isProduction);

router.use(
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
      httpOnly: true, // Previene acceso JavaScript a la cookie
      sameSite: "none", // Protección contra CSRF
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

router.use(passport.initialize());
router.use(passport.session());

// Configuración del rate-limiter
const purchaseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limitar a 10 solicitudes por IP en el intervalo
  message:
    "Demasiadas solicitudes desde esta IP. Intenta nuevamente más tarde.",
});

// Configuración de Multer
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
// Exportar `uploadMultiple` para múltiples imágenes
// export const uploadMultiple = upload(process.env.BUCKET_AWS).array("images"); // 10 es el límite de imágenes, puedes ajustarlo según tus necesidades
const uploadSingleUpdate = upload(process.env.BUCKET_AWS).single("imagePath");

//notificaciones sin stock
router.post("/api/notificacionSinStock", notificacionSinStock);
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

//reseñas
router.post("/api/agregarResena", requireAdmin, agregarResena);
router.get("/api/getResena", getResena);
router.put("/api/putResena/:id", requireAdmin, putResena);
router.delete("/api/deleteResena/:id", requireAdmin, deleteResena);

//carrito

router.get("/api/getProductsCart", getProductsCart);
router.post("/api/addProductCart", addProductCart);
router.put("/api/putProductCart/:id", putProductCart);
router.delete("/api/deleteProductCart/:id", deleteProductCart);
router.delete("/api/limpiarCarrito", limpiarCarrito);

//compras
router.get("/api/listaOrder", requireAdmin, purchaseOrder);
router.delete("/api/deleteOrder/:id", requireAdmin, deleteOrder);
router.post("/api/compraPrepare", requireAdmin, compraPrepare);
router.put("/api/compraEnCamino/:id", requireAdmin, compraEnCamino);
router.put("/api/aceptarPedido/:id", requireAdmin, aceptarPedido);
router.post("/api/correoEnCamino", requireAdmin, correoEnCamino);
router.put("/api/finalizarPedido/:id", requireAdmin, finalizarPedido);
router.put("/api/compraCancelada/:id", requireAdmin, compraCancelada);

// Rutas nodeMailer
router.post("/api/sendMail", purchaseLimiter, sendMail);
router.post("/api/suscribeMail", purchaseLimiter, suscribeMail);
router.get("/api/confirmMail", confirmMail);
router.get("/success", success);
router.get("/error", error);
router.post("/api/enviarPromocion/", requireAdmin, enviarPromocion);

//rutas envio
router.post("/api/costoEnvio", costoEnvio);

// Rutas signin
router.post("/api/signup", signup);
router.post("/api/signin", signin);
router.get("/api/getCookie", getCookie);
router.delete("/api/logout", logout);
// Rutas listado
router.get("/api/getAdmin", getAdmin); // Your controller logic);
router.get("/api/getUser/:id", requireAdmin, getUser);
router.get("/api/renderLista", requireAdmin, listaAdmin);
router.delete("/api/deleteUser/:id", requireAdmin, deleteUser);
router.put("/api/updateUser/:id", requireAdmin, updateUser);
router.get("/api/contadorProductos/:id", requireAdmin, contadorProductos);
// Rutas productos
router.get("/api/renderDestacados", destacadosProduct);
router.get("/api/listaProductosUsuario", listaProductosUsuario);
router.get("/api/listaProductosAdmin", listaProductosAdmin);
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

export default router;
