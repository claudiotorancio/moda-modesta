// //formEnvio.js

// import envioServices from "../services/envio_services.js";

// export function capturarDatosFormulario() {
//   const altoCM = document.getElementById("AltoCM").value;
//   const codigoPostalDestino = document.getElementById(
//     "CodigoPostalDestino"
//   ).value;
//   const codigoPostalOrigen =
//     document.getElementById("CodigoPostalOrigen").value;
//   const iva = document.getElementById("Iva").value;
//   const profundidadCM = document.getElementById("ProfundidadCM").value;
//   const anchoCM = document.getElementById("AnchoCM").value;
//   const entrega = document.getElementById("Entrega").value;
//   const tipo = document.getElementById("Tipo").value;
//   const pesoPaqueteKG = document.getElementById("PesoPaqueteKG").value;

//   // Empaquetar los datos en un objeto
//   const datosEnvio = {
//     altoCM,
//     codigoPostalDestino,
//     codigoPostalOrigen,
//     iva,
//     profundidadCM,
//     anchoCM,
//     entrega,
//     tipo,
//     pesoPaqueteKG,
//   };

//   // Llamar a costoEnvio.js para procesar la consulta
//   envioServices.calcularCostoEnvio(datosEnvio);
// }

// // Exportar la función para ser utilizada en otros archivos
