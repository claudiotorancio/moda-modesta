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
import signup from "../backend/routes/login/signup.js";
import logout from "../backend/routes/login/logout.js";
import renderInicio from "../backend/routes/product/renderInicio.js";
import renderProducts from "../backend/routes/product/renderProducts.js";
import createProduct from "../backend/routes/product/createProduct.js";
import deleteProduct from "../backend/routes/product/deleteProduct.js";
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
import path from "path";


const router = Router();

// Configuración de midllewares

router.use(express.json());
router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));

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
      expires: 600000,
    },
  })
);
router.use(passport.initialize());
router.use(passport.session());

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

export const uploadSingle = upload(process.env.BUCKET_AWS).single("image");
const uploadSingleUpdate = upload(process.env.BUCKET_AWS).single("imagePath");

// Rutas nodeMailer
router.post("/api/sendMail", sendMail);
router.post("/api/suscribeMail", suscribeMail);
router.get("/api/confirmMail", confirmMail);
router.get("/success", success);
router.get("/error", error);




// Rutas signin
router.post("/api/signup", signup);
router.post("/api/signin", signin);
router.delete("/api/logout", logout);
// Rutas listado
router.get("/api/getAdmin", getAdmin);
router.get("/api/getUser/:id", getUser);
router.get("/api/renderLista", listaAdmin);
router.delete("/api/deleteUser/:id", deleteUser);
router.put("/api/updateUser/:id", updateUser);
router.get("/api/contadorProductos/:id", contadorProductos);
// Rutas productos
router.get("/api/renderDestacados", destacadosProduct);
router.get("/api/renderInicio", renderInicio);
router.get("/api/renderProducts", renderProducts);
router.post("/api/createProduct", createProduct);
router.delete("/api/deleteProduct/:id", deleteProduct);
router.get("/api/detailsProduct/:id", detailsProduct);
router.put("/api/updateProduct/:id", uploadSingleUpdate, updateProduct);

export default router;
