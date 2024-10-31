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
  (req, res, next) => {
    // Ver los datos que están llegando a la validación
    console.log("Datos entrantes:", req.body);
    next(); // Continúa al siguiente middleware
  },
  validarCampo("name", "El nombre es obligatorio."),
  validarCampo("price", "El precio es obligatorio.", true),
  validarCampo("description", "La descripción es obligatoria."),
  validarCampo("isFeatured", "El estado de destacado es obligatorio."),
  // body("images").custom((value) => {
  //   // Validar que sea un array de objetos File
  //   if (!Array.isArray(value) || value.length === 0) {
  //     throw new Error(
  //       "El campo de imágenes es obligatorio y debe ser un array."
  //     );
  //   }
  //   value.forEach((file) => {
  //     if (!(file instanceof File)) {
  //       throw new Error("Cada imagen debe ser un archivo.");
  //     }
  //     const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  //     if (!allowedTypes.includes(file.type)) {
  //       throw new Error(
  //         "El tipo de imagen no es válido. Solo se permiten JPEG, PNG y GIF."
  //       );
  //     }
  //     if (file.size > 2 * 1024 * 1024) {
  //       // Ejemplo: límite de 2MB
  //       throw new Error("El tamaño de la imagen debe ser inferior a 2MB.");
  //     }
  //   });
  //   return true; // Validación correcta
  // }),
  // Validación para sizes, que es opcional
  body("sizes")
    .optional()
    .custom((value) => {
      // Verificar si el value es una cadena JSON y parsear
      try {
        const sizes = typeof value === "string" ? JSON.parse(value) : value;
        if (
          Array.isArray(sizes) &&
          sizes.every(
            (size) =>
              typeof size.size === "string" &&
              Number.isInteger(Number(size.stock)) &&
              Number(size.stock) >= 0
          )
        ) {
          return true; // Validación correcta
        } else {
          throw new Error("Los talles y sus stocks deben ser válidos.");
        }
      } catch (error) {
        throw new Error("El formato de talles debe ser un JSON válido.");
      }
    })
    .withMessage("El formato de talles y stocks no es válido."),
];

const validacionesProductoActualizacion = [
  (req, res, next) => {
    // Ver los datos que están llegando a la validación
    console.log("Datos entrantes:", req.body);
    next(); // Continúa al siguiente middleware
  },
  validarId("id"),
  validarCampo("name", "El nombre es obligatorio."),
  validarCampo("price", "El precio es obligatorio.", true),
  validarCampo("description", "La descripción es obligatoria."),
  validarCampo("isFeatured", "El estado de destacado es obligatorio."),
  body("generalStock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock general debe ser un número positivo."),

  // Validación para imagePath, que es opcional
  body("imagePath")
    .optional()
    .custom((value) => {
      // Validar que sea un objeto File
      if (value instanceof File) {
        // Puedes agregar más validaciones aquí si es necesario, por ejemplo:
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(value.type)) {
          throw new Error(
            "El tipo de imagen no es válido. Solo se permiten JPEG, PNG y GIF."
          );
        }
        if (value.size > 2 * 1024 * 1024) {
          // Ejemplo: límite de 2MB
          throw new Error("El tamaño de la imagen debe ser inferior a 2MB.");
        }
        return true; // Validación correcta
      } else {
        throw new Error("El campo imagePath debe ser un archivo.");
      }
    }),

  // Validación para oldImagePath, que es opcional
  body("oldImagePath")
    .optional()
    .isString()
    .withMessage("La ruta de la imagen antigua debe ser una cadena.")
    .trim(),

  // Validación para generalStock, que es opcional
  body("generalStock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock general debe ser un número positivo."),

  // Validación para sizes, que es opcional
  body("sizes")
    .optional()
    .custom((value, { req }) => {
      // Verificar si el value es una cadena JSON y parsear
      try {
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
          return true; // Validación correcta
        } else {
          throw new Error("Los talles y sus stocks deben ser válidos.");
        }
      } catch (error) {
        throw new Error("El formato de talles debe ser un JSON válido.");
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
