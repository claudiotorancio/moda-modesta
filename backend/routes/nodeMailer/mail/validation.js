// // controllers/mail/validation.js
// export const validateOrderData = (data) => {
//   const {
//     nombre,
//     email,
//     telefono,
//     provincia,
//     codigoPostal,
//     productos,
//     total,
//     costoEnvio,
//     checked,
//   } = data;
//   console.log(productos);

//   if (!Array.isArray(productos) || productos.length === 0) {
//     throw new Error("Debe haber al menos un producto en la orden.");
//   }

//   productos.forEach((item, index) => {
//     // Verificar que los campos del producto están presentes, pero permitir 'size' como null o como cualquier valor válido
//     if (
//       !item.id ||
//       !item.name ||
//       !item.price ||
//       typeof item.discount !== "number" || // Verifica que 'discount' sea un número
//       item.discount < 0 ||
//       item.discount > 100 || // Si es un porcentaje, debería estar entre 0 y 100
//       !item.cantidad ||
//       !item.size || // 'size' no debe ser undefined, pero sí puede ser null
//       !item.hash ||
//       !item.category
//     ) {
//       throw new Error(`Faltan campos en el producto #${index + 1}.`);
//     }
//   });

//   // Verificar que todos los campos requeridos estén presentes
//   if (
//     !nombre ||
//     !email ||
//     !telefono ||
//     !provincia === undefined ||
//     !codigoPostal === undefined ||
//     !productos ||
//     !total ||
//     !costoEnvio === undefined ||
//     !checked
//   ) {
//     throw new Error("Todos los campos son requeridos.");
//   }
// };
