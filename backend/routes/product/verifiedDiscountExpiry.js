import cron from "node-cron";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

// Conexión a la base de datos
await connectToDatabase();

// Tarea programada para ejecutar cada día a la medianoche
cron.schedule("* * * * *", async () => {
  console.log("Ejecutando tarea de verificación de expiración de descuentos");

  try {
    // Obtener la fecha actual
    const currentDate = new Date();

    // Buscar productos cuyo discountExpiry haya pasado
    const productosConDescuentoExpirado = await Vista.find({
      discountExpiry: { $lte: currentDate },
    });

    // Actualizar los productos con descuento expirado
    await Promise.all(
      productosConDescuentoExpirado.map(async (producto) => {
        producto.discount = 0;
        producto.discountExpiry = ""; // Opcional: Puedes eliminar la fecha de expiración
        await producto.save();
      })
    );

    console.log("Productos actualizados exitosamente");
  } catch (error) {
    console.error(
      "Error al actualizar productos con descuento expirado:",
      error
    );
  }
});
