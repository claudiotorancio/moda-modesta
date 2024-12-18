//validaciones.js

import { body, param, query, validationResult } from "express-validator";
import escape from "escape-html";
import moment from "moment";

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

// Validación de datos de la orden
const validarOrderData = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio.").trim(),

  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio.")
    .isEmail()
    .withMessage("Debes proporcionar un correo electrónico válido.")
    .trim(),

  body("telefono")
    .notEmpty()
    .withMessage("El teléfono es obligatorio.")
    .isNumeric()
    .withMessage("El teléfono debe ser un número.")
    .trim(),

  body("provincia")
    .optional() // No requiere validación porque es opcional
    .trim()
    .isString()
    .withMessage("La provincia debe ser un valor válido."), // Si se proporciona, debe ser una cadena válida

  body("codigoPostal")
    .optional() // Campo opcional
    .isNumeric()
    .withMessage("El código postal debe ser numérico.") // Valida que sea numérico
    .trim(), // Aplica un recorte al valor

  body("productos")
    .isArray({ min: 1 })
    .withMessage("Debe haber al menos un producto en la orden.")
    .bail()
    .custom((value) => {
      value.forEach((item, index) => {
        if (
          !item.id ||
          !item.name ||
          !item.price ||
          typeof item.discount !== "number" ||
          item.discount < 0 ||
          item.discount > 100 ||
          !item.cantidad ||
          !item.size ||
          !item.hash ||
          !item.category
        ) {
          throw new Error(`Faltan campos en el producto #${index + 1}.`);
        }
      });
      return true;
    }),

  body("total")
    .notEmpty()
    .withMessage("El total es obligatorio.")
    .isFloat({ gt: 0 })
    .withMessage("El total debe ser un número mayor a cero."),

  body("costoEnvio")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("El costo de envío debe ser un número válido."),

  body("checked")
    .isBoolean()
    .withMessage("El campo 'checked' debe ser un valor booleano."),
];

export default validarOrderData;

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
  query("token", "El token es requerido"),
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
  query("token", "El token es requerido"),
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
  validarCampo("price", "El precio es obligatorio.", true),
  validarCampo("description", "La descripción es obligatoria."),
  validarCampo("isFeatured", "El estado de destacado es obligatorio."),
  body("generalStock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock general debe ser un número positivo."),
  body("sizes")
    .optional()
    .custom((value) => {
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
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("El descuento debe ser un número entre 0 y 100."),
  body("discountExpiry")
    .optional()
    .custom((value) => {
      if (!value) return true;

      // Crear `parsedDate` y `currentDate` en UTC
      const parsedDate = moment.utc(value).endOf("day");
      const discountExoiryParsed = parsedDate.format();

      // console.log("Fecha de expiración ajustada:", parsedDate.format()); // Muestra la fecha de expiración ajustada en UTC
      // console.log("Fecha actual:", currentDate.toISOString()); // Muestra la fecha actual en formato UTC

      // Comparación únicamente de la fecha
      if (parsedDate.isBefore(discountExoiryParsed)) {
        throw new Error(
          "La fecha de expiración no puede ser una fecha pasada."
        );
      }

      return true;
    }),
];

const validacionesProductoActualizacion = [
  // (req, res, next) => {
  //   // Ver los datos que están llegando a la validación
  //   console.log("Datos entrantes:", req.body);
  //   next(); // Continúa al siguiente middleware
  // },
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
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("El descuento debe ser un número entre 0 y 100."),

  body("discountExpiry")
    .optional()
    .custom((value) => {
      if (!value) return true;

      // Crear `parsedDate` y `currentDate` en UTC
      const parsedDate = moment.utc(value).endOf("day");
      const discountExoiryParsed = parsedDate.format();

      // console.log("Fecha de expiración ajustada:", parsedDate.format()); // Muestra la fecha de expiración ajustada en UTC
      // console.log("Fecha actual:", currentDate.toISOString()); // Muestra la fecha actual en formato UTC

      // Comparación únicamente de la fecha
      if (parsedDate.isBefore(discountExoiryParsed)) {
        throw new Error(
          "La fecha de expiración no puede ser una fecha pasada."
        );
      }

      return true;
    }),
  // // Verifica si hay errores
  // (req, res, next) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     // Si hay errores, se envía un array con los mensajes de error
  //     return res.status(400).json({ errors: errors.array() });
  //   }
  //   next(); // Si no hay errores, continúa con el siguiente middleware o controlador
  // },
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
  validarOrderData,
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
