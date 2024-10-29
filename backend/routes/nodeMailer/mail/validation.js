// controllers/mail/validation.js
export const validateOrderData = (data) => {
  const {
    nombre,
    email,
    telefono,
    provincia,
    codigoPostal,
    productos,
    total,
    costoEnvio,
    checked,
    aceptar = false,
    enCamino = false,
    finalizado = false,
  } = data;

  // Verificar que todos los campos requeridos están presentes
  if (
    !nombre ||
    !email ||
    !telefono ||
    !provincia === undefined ||
    !codigoPostal === undefined ||
    !productos ||
    !total ||
    !costoEnvio == undefined ||
    checked === undefined ||
    aceptar === undefined ||
    enCamino === undefined ||
    finalizado === undefined
  ) {
    throw new Error("Todos los campos son requeridos.");
  }
};
