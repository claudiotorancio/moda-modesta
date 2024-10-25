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

const validacionesNotificacionesSinStock = [validarEmail(), validarId("id")];

const validacionesAgregarResena = [
  validarCampo("name", "El nombre es obligatorio."),
  validarCampo("redSocial", "La red social es obligatoria."),
  validarCampo("resena", "La reseña es obligatoria."),
  body("estrellas")
    .isInt({ min: 1, max: 5 })
    .withMessage("Las estrellas deben ser entre 1 y 5."),
];
const validacionesPutResena = [validarId("id"), ...validacionesAgregarResena];

const validacionesDeleteCart = [validacionesIdParam];

const validacionesPutProductCart = [validarId("id"), validacionesCantidad];

const validacionesPurchaseOrder = [validarId("userId")];

const validacionesDeletOrder = [validacionesIdParam];

const validacionesAceptarPedido = [validacionesIdParam];

const validacionesFinalizarPedido = [validacionesIdParam];

const validacionesCancelarPedido = [validacionesIdParam];

const validacionesSendMail = [
  validarEmail(),
  validarCampo("nombre", "El nombre es obligatorio."),
  validarCampo("telefono", "El telefono es obligatorio.", true),
];

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

const validacionesCreateProduct = [
  validarCampo("name", "El nombre del producto es obligatorio."),
  validarCampo("price", "El precio es obligatorio.", true),
  validarCampo("description", "La descripción es obligatoria."),
  validarCampo("section", "La sección es obligatoria."),
  validarId("user_id"),
  validacionesCantidad.optional(),

  // Validación para las tallas, si se envían
  body("sizes")
    .optional()
    .custom((value) => {
      try {
        const sizesArray = JSON.parse(value);
        if (!Array.isArray(sizesArray)) throw new Error();
        sizesArray.forEach((sizeData) => {
          if (
            typeof sizeData.size !== "string" ||
            typeof sizeData.stock !== "number" ||
            sizeData.stock < 0
          ) {
            throw new Error(
              "Cada entrada debe tener 'size' y 'stock' válidos."
            );
          }
        });
        return true;
      } catch (error) {
        throw new Error("El formato de las tallas es incorrecto.");
      }
    }),

  // Validación para las imágenes, en caso de que existan
  body("files")
    .optional()
    .isArray()
    .withMessage("Las imágenes deben enviarse en un arreglo.")
    .custom((files) => {
      files.forEach((file) => {
        if (typeof file.location !== "string") {
          throw new Error("Cada archivo debe tener una ubicación válida.");
        }
      });
      return true;
    }),
];

const validacionesUpdateProduct = [
  validarId("id"), // Validación para el ID del producto

  validarCampo("name", "El nombre es obligatorio."),

  validarCampo("price", "El precio es obligatorio.", true), // true para validar como numérico

  validarCampo("description", "La descripción es obligatoria."),

  validarCampo("section", "La sección es obligatoria."),

  validarCampo("isFeatured", "El campo destacado debe ser booleano.")
    .optional()
    .isBoolean(),

  validarCampo(
    "generalStock",
    "El stock general debe ser un número.",
    true
  ).optional(),

  // Validación para el array de talles si es proporcionado
  body("sizes")
    .optional()
    .isArray()
    .withMessage("Los talles deben estar en un formato de lista válida."),
];

export {
  validacionesNotificacionesSinStock,
  validacionesAgregarResena,
  validacionesPutResena,
  validacionesPutProductCart,
  validacionesDeleteCart,
  validacionesPurchaseOrder,
  validacionesDeletOrder,
  validacionesAceptarPedido,
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
  validacionesCreateProduct,
  validacionesUpdateProduct,
};