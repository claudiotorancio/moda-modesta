//validaciones.js

import { body, param, query, check } from "express-validator";
import escape from "escape-html";

const validacionesInfoPersonal = [];

const validacionesPedidosRecientes = [];

const validacionesNotificacionesSinStock = [
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio.")
    .isEmail()
    .withMessage("Debes proporcionar un correo electrónico válido.")
    .trim()
    .escape(), // Sanitizar el email
  body("id")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio.")
    .trim()
    .escape(), // Sanitizar el ID
];

const validacionesNotificacionIngreso = [
  body("idProducto")
    .notEmpty()
    .withMessage("El campo 'idProducto' es obligatorio.")
    .isMongoId()
    .withMessage("El 'idProducto' no es válido.")
    .trim()
    .escape(),
  body("idNotificaciones")
    .notEmpty()
    .withMessage("El campo 'idNotificaciones' es obligatorio.")
    .trim()
    .escape(),
];

const validacionesAgregarResena = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .trim()
    .escape(),
  body("redSocial")
    .notEmpty()
    .withMessage("La red social es obligatoria.")
    .trim()
    .escape(),
  body("resena")
    .notEmpty()
    .withMessage("La reseña es obligatoria.")
    .trim()
    .escape(),
  body("estrellas")
    .isInt({ min: 1, max: 5 })
    .withMessage("Las estrellas deben ser un número entre 1 y 5."),
];

const validacionesPutResena = [
  param("id").isMongoId().withMessage("El ID no es válido."),
  ...validacionesAgregarResena,
];

const validacionesDelete = [
  param("id").isMongoId().withMessage("El ID no es válido."),
];

const validacionesAddProdcutCart = [
  body("productId")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio.")
    .isMongoId()
    .withMessage("El ID del producto no es válido."),
  body("name")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio.")
    .trim()
    .escape(), // Escapar el nombre del producto
  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio.")
    .isNumeric()
    .withMessage("El precio debe ser un número.")
    .escape(), // Escapar el precio
  body("imagePath")
    .notEmpty()
    .withMessage("La ruta de la imagen es obligatoria.")
    .trim()
    .escape(), // Escapar la ruta de la imagen
  body("size")
    .notEmpty()
    .withMessage("La talla es obligatoria.")
    .trim()
    .escape(), // Escapar la talla
  body("cantidad")
    .notEmpty()
    .withMessage("La cantidad es obligatoria.")
    .isInt({ gt: 0 })
    .withMessage("La cantidad debe ser un número mayor que cero."),
];

const validacionesGetProductsCart = [
  param("productId")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio.")
    .isMongoId()
    .withMessage("El ID del producto no es válido."),
  param("cantidad")
    .notEmpty()
    .withMessage("La cantidad es obligatoria.")
    .isInt({ gt: 0 })
    .withMessage("La cantidad debe ser un número mayor que cero."),
];

const validacionesDeleteCart = [...validacionesDelete];

const validacionesPutProdcutCart = [
  param("id")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio.")
    .isMongoId()
    .withMessage("El ID del producto no es válido."),
  body("cantidad")
    .notEmpty()
    .withMessage("La cantidad es obligatoria.")
    .isInt({ gt: 0 })
    .withMessage("La cantidad debe ser un número mayor que cero."),
];

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

const validacionesDeletOrder = [...validacionesDelete];

const validacionesCompraPrepare = [
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido.")
    .isEmail()
    .withMessage("El correo electrónico proporcionado no es válido.")
    .trim()
    .escape(),
  body("name")
    .notEmpty()
    .withMessage("El nombre es requerido.")
    .trim()
    .escape(),
  body("producto")
    .notEmpty()
    .withMessage("El campo 'producto' es requerido.")
    .trim()
    .escape(),
];

const validacionesCompraEnCamino = [
  param("id")
    .isMongoId()
    .withMessage("El ID del producto debe ser un ID de Mongo válido."),
];

const validacionesAceptarPedido = [
  param("id") // Se refiere al parámetro 'id' en la ruta
    .isMongoId() // Verifica que el 'id' sea un ID de MongoDB válido
    .withMessage("El ID del producto debe ser un ID de Mongo válido."), // Mensaje de error si la validación falla
];

const validacionesCorreoEnCamino = [
  body("email")
    .isEmail()
    .withMessage("El correo electrónico proporcionado no es válido."), // Valida que el email sea un formato correcto
  body("name").notEmpty().withMessage("El nombre es requerido."), // Valida que el nombre no esté vacío
  body("producto").notEmpty().withMessage("El producto es requerido."), // Valida que el campo producto no esté vacío
];

const validacionesFinalizarPedido = [
  param("id") // Se refiere al parámetro 'id' en la ruta
    .isMongoId() // Verifica que el 'id' sea un ID de MongoDB válido
    .withMessage("El ID del producto debe ser un ID de Mongo válido."), // Mensaje de error si la validación falla
];

const validacionesCancelarPedido = [
  param("id") // Se refiere al parámetro 'id' en la ruta
    .isMongoId() // Verifica que el 'id' sea un ID de MongoDB válido
    .withMessage("El ID del producto debe ser un ID de Mongo válido."), // Mensaje de error si la validación falla
];

const validacionesSendMail = [
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio.")
    .isEmail()
    .withMessage("Debes proporcionar un correo electrónico válido.")
    .trim()
    .escape(),
];

const validacionesSuscribeMail = [
  // Verificar que el campo 'nombre' no esté vacío y sanitizar
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido.")
    .customSanitizer((value) => escape(value)), // Sanitizar el nombre

  // Verificar que el campo 'email' no esté vacío y validar el formato
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido.")
    .isEmail()
    .withMessage("El correo electrónico proporcionado no es válido."),
];

const validacionesConfirmMail = [
  // Verificar que el token esté presente
  query("token")
    .notEmpty()
    .withMessage("Token no proporcionado.")
    .isString()
    .withMessage("El token debe ser una cadena de texto."),
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
  body("cpOrigen")
    .notEmpty()
    .withMessage("El código postal de origen es requerido.")
    .isNumeric()
    .withMessage("El código postal de origen debe ser numérico.")
    .customSanitizer((value) => escapeHtml(value)),

  body("cpDestino")
    .notEmpty()
    .withMessage("El código postal de destino es requerido.")
    .isNumeric()
    .withMessage("El código postal de destino debe ser numérico.")
    .customSanitizer((value) => escapeHtml(value)),

  body("provinciaOrigen")
    .notEmpty()
    .withMessage("La provincia de origen es requerida.")
    .isString()
    .withMessage("La provincia de origen debe ser una cadena de texto.")
    .customSanitizer((value) => escapeHtml(value)),

  body("provinciaDestino")
    .notEmpty()
    .withMessage("La provincia de destino es requerida.")
    .isString()
    .withMessage("La provincia de destino debe ser una cadena de texto.")
    .customSanitizer((value) => escapeHtml(value)),

  body("peso")
    .notEmpty()
    .withMessage("El peso es requerido.")
    .isNumeric()
    .withMessage("El peso debe ser numérico.")
    .customSanitizer((value) => escapeHtml(value)),
];

const validacionesResetPassword = [
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio.")
    .isEmail()
    .withMessage("Debes proporcionar un correo electrónico válido.")
    .trim()
    .escape(),
];

const validacionesUpdatePassword = [
  body("token")
    .exists()
    .withMessage("El token es requerido")
    .isString()
    .withMessage("El token debe ser una cadena válida"),

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
  query("token")
    .notEmpty()
    .withMessage("El token es obligatorio.")
    .trim()
    .escape(),
];

const validacionesListaProductos = [
  check("user_id")
    .optional()
    .isMongoId()
    .withMessage("El ID de usuario no es válido."),
];
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
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio.")
    .isEmail()
    .withMessage("Debes proporcionar un correo electrónico válido.")
    .trim()
    .escape(),
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
  validacionesAddProdcutCart,
  validacionesGetProductsCart,
  validacionesPutProdcutCart,
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
