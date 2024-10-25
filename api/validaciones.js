//validaciones.js

import { body, param, query } from "express-validator";
import escape from "escape-html";

// Funciones auxiliares
const validarEmail = () =>
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio.")
    .isEmail()
    .withMessage("Debes proporcionar un correo electrónico válido.")
    .trim()
    .customSanitizer(escape); // Usamos escape-html

const validarId = (campo = "id") =>
  body(campo)
    .notEmpty()
    .withMessage(`El ${campo} es obligatorio.`)
    .isMongoId()
    .withMessage(`El ${campo} no es válido.`)
    .trim()
    .customSanitizer(escape); // Usamos escape-html

const validarCampo = (campo, mensaje, isNumeric = false) => {
  let validador = body(campo)
    .notEmpty()
    .withMessage(mensaje)
    .trim()
    .customSanitizer(escape); // Usamos escape-html
  if (isNumeric) {
    validador = validador
      .isNumeric()
      .withMessage(`${campo} debe ser numérico.`);
  }
  return validador;
};

// Validaciones comunes
const validacionesIdParam = param("id")
  .isMongoId()
  .withMessage("El ID no es válido.")
  .customSanitizer(escape); // Usamos escape-html

const validacionesCantidad = body("cantidad")
  .notEmpty()
  .withMessage("La cantidad es obligatoria.")
  .isInt({ gt: 0 })
  .withMessage("Debe ser un número mayor que cero.")
  .customSanitizer(escape); // Usamos escape-html

const validacionesInfoPersonal = [];

const validacionesPedidosRecientes = [];

const validacionesNotificacionesSinStock = [validarEmail(), validarId("id")];

const validacionesNotificacionIngreso = [
  validarId("idProducto"),
  validarId("idNotificaciones"),
];

const validacionesAgregarResena = [
  validarCampo("name", "El nombre es obligatorio."),
  validarCampo("redSocial", "La red social es obligatoria."),
  validarCampo("resena", "La reseña es obligatoria."),
  body("estrellas")
    .isInt({ min: 1, max: 5 })
    .withMessage("Las estrellas deben ser entre 1 y 5."),
];
const validacionesPutResena = [validarId("id"), ...validacionesAgregarResena];

const validacionesDelete = [validacionesIdParam];

const validacionesAddProductCart = [
  validarId("productId"),
  validarCampo("name", "El nombre del producto es obligatorio."),
  validarCampo("price", "El precio es obligatorio.", true),
  validarCampo("imagePath", "La ruta de la imagen es obligatoria."),
  validarCampo("size", "La talla es obligatoria."),
  validacionesCantidad,
];
const validacionesGetProductsCart = [
  validarId("productId"),
  validacionesCantidad,
];

const validacionesDeleteCart = [validacionesIdParam];

const validacionesPutProductCart = [validarId("id"), validacionesCantidad];

const validacionesPurchaseOrder = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio debe ser una fecha válida en formato ISO.")
    .toDate(), // Convertir a objeto Date
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de fin debe ser una fecha válida en formato ISO.")
    .toDate(), // Convertir a objeto Date
  query("userId")
    .optional()
    .isMongoId()
    .withMessage("El ID del usuario no es válido."),
];

const validacionesDeletOrder = [validacionesIdParam];

const validacionesCompraPrepare = [
  validarEmail(),
  validarCampo("name", "El nombre es obligatorio."),
  validarCampo("producto", "El producto es obligatorio."),
];

const validacionesCompraEnCamino = [validacionesIdParam];

const validacionesAceptarPedido = [validacionesIdParam];

const validacionesCorreoEnCamino = [
  validarEmail(),
  validarCampo("name", "El nombre es obligatorio."),
  validarCampo("producto", "El producto es obligatorio."),
];

const validacionesFinalizarPedido = [validacionesIdParam];

const validacionesCancelarPedido = [validacionesIdParam];

const validacionesSendMail = [validarEmail()];

const validacionesSuscribeMail = [
  validarCampo("nombre", "El nombre es obligatorio."),
  validarEmail(),
];

const validacionesConfirmMail = [
  validarCampo("token", "El token es requerido"),
];

const validacionesEnviarPromociones = [
  body("myContent")
    .notEmpty()
    .withMessage("El contenido de la promoción es requerido.")
    .isString()
    .withMessage("El contenido de la promoción debe ser una cadena de texto.")
    .customSanitizer((value) => escape(value)), // Sanitiza el contenido
];

const validacionesCostoEnvio = [
  validarCampo("cpOrigen", "El código postal de origen es requerido.", true), // Campo numérico
  validarCampo("cpDestino", "El código postal de destino es requerido.", true), // Campo numérico
  validarCampo("provinciaOrigen", "La provincia de origen es requerida."), // Cadena de texto
  validarCampo("provinciaDestino", "La provincia de destino es requerida."), // Cadena de texto
  validarCampo("peso", "El peso es requerido.", true), // Campo numérico
];

const validacionesResetPassword = [validarEmail()];

const validacionesUpdatePassword = [
  validarCampo("token", "El token es requerido"),

  body("newPassword")
    .exists()
    .withMessage("La nueva contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[a-zA-Z]/)
    .withMessage("La contraseña debe contener al menos una letra")
    .trim() // Elimina espacios en blanco al principio y al final
    .escape(), // Escapa caracteres especiales para prevenir inyecciones
];

const validacionesConfirmResetPassword = [
  validarCampo("token", "El token es requerido"),
];

const validacionesListaProductos = [validarId("user_id").optional()];
const validacionesSignup = [
  // Validar el nombre
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido.")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres.")
    .escape(),

  // Validar el correo electrónico
  body("email")
    .isEmail()
    .withMessage("El correo electrónico proporcionado no es válido.")
    .normalizeEmail(),

  // Validar la contraseña
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres.")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número.")
    .matches(/[a-zA-Z]/)
    .withMessage("La contraseña debe contener al menos una letra."),
];

const validacionesSignin = [
  validarEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria."),
];

export {
  validacionesInfoPersonal,
  validacionesPedidosRecientes,
  validacionesNotificacionesSinStock,
  validacionesNotificacionIngreso,
  validacionesAgregarResena,
  validacionesPutResena,
  validacionesDelete,
  validacionesAddProductCart,
  validacionesGetProductsCart,
  validacionesPutProductCart,
  validacionesDeleteCart,
  validacionesPurchaseOrder,
  validacionesDeletOrder,
  validacionesCompraPrepare,
  validacionesCompraEnCamino,
  validacionesAceptarPedido,
  validacionesCorreoEnCamino,
  validacionesCancelarPedido,
  validacionesFinalizarPedido,
  validacionesSendMail,
  validacionesSuscribeMail,
  validacionesConfirmMail,
  validacionesEnviarPromociones,
  validacionesCostoEnvio,
  validacionesResetPassword,
  validacionesUpdatePassword,
  validacionesConfirmResetPassword,
  validacionesListaProductos,
  validacionesSignin,
  validacionesSignup,
};
