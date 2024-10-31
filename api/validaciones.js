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
  .escape(); // Usamos escape-html

const validacionesNotificacionesSinStock = [validarEmail(), validarId("id")];

const validacionesAgregarResena = [
  validarCampo("name", "El nombre es obligatorio."),
  validarCampo("redSocial", "La red social es obligatoria."),
  validarCampo("resena", "La reseña es obligatoria."),
  body("estrellas")
    .isInt({ min: 1, max: 5 })
    .withMessage("Las estrellas deben ser entre 1 y 5."),
];
const validacionesPutResena = [
  validarId("resenaId"),
  ...validacionesAgregarResena,
];

const validacionesDeleteCart = [validacionesIdParam];

const validacionesPutProductCart = [
  validarId("productId"),
  validacionesCantidad,
];

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

const validacionesProducto = [
  validarCampo("name", "El nombre es obligatorio."),
  validarCampo("price", "El precio es obligatorio.", true)
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser mayor que 0."),
  validarCampo("description", "La descripción es obligatoria."),
  body("images")
    .custom((value, { req }) => {
      const images = req.files?.images || [];
      if (images.length > 2) {
        throw new Error("Por favor, selecciona un máximo de 2 imágenes.");
      }
      return true;
    })
    .withMessage("Las imágenes son opcionales, pero no pueden exceder de 2."),
  body("generalStock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock general debe ser un número positivo."),
  body("sizes")
    .optional()
    .custom((value) => {
      try {
        const sizesObj = JSON.parse(value);
        if (
          typeof sizesObj === "object" &&
          Object.values(sizesObj).every(
            (stock) => Number.isInteger(stock) && stock >= 0
          )
        ) {
          return true;
        } else {
          throw new Error("Formato incorrecto en talles y cantidades.");
        }
      } catch (error) {
        throw new Error("Formato JSON inválido en talles.");
      }
    })
    .withMessage("Los talles y sus stocks deben ser un JSON válido."),
];

export const validacionesProductoActualizacion = [
  validarId("id"),
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .trim()
    .customSanitizer(escape),
  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio.")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número mayor que 0.")
    .customSanitizer(escape),
  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria.")
    .trim()
    .customSanitizer(escape),
  body("imagePath")
    .optional()
    .custom((value, { req }) => {
      const images = req.files?.imagePath || [];
      if (images.length > 2) {
        throw new Error("Por favor, selecciona un máximo de 2 imágenes.");
      }
      return true;
    })
    .withMessage("Solo se permiten hasta 2 imágenes."),
  body("generalStock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock general debe ser un número positivo."),
  body("sizes")
    .optional()
    .custom((value, { req }) => {
      const sizes = JSON.parse(value); // Suponiendo que se recibe un JSON
      if (
        Array.isArray(sizes) &&
        sizes.every(
          (size) =>
            typeof size.size === "string" &&
            Number.isInteger(Number(size.stock)) &&
            Number(size.stock) >= 0
        )
      ) {
        return true;
      } else {
        throw new Error("Los talles y sus stocks deben ser válidos.");
      }
    })
    .withMessage("El formato de talles y stocks no es válido."),
];

export {
  validacionesNotificacionesSinStock,
  validacionesAgregarResena,
  validacionesPutResena,
  validacionesPutProductCart,
  validacionesDeleteCart,
  validacionesDeletOrder,
  validacionesAceptarPedido,
  validacionesCancelarPedido,
  validacionesFinalizarPedido,
  validacionesSendMail,
  validacionesSuscribeMail,
  validacionesEnviarPromociones,
  validacionesCostoEnvio,
  validacionesResetPassword,
  validacionesUpdatePassword,
  validacionesConfirmResetPassword,
  validacionesListaProductos,
  validacionesSignin,
  validacionesSignup,
  validacionesProducto,
  validacionesProductoActualizacion,
};
