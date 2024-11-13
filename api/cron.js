// api/cron.
import moment from "moment";
import Vista from "../backend/models/Vista.js";
import { connectToDatabase } from "../backend/db/connectToDatabase.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    await connectToDatabase();
    try {
      // Obtener la fecha actual
      const currentDate = moment.utc().endOf("day");

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

      res.status(200).json({ message: "Productos actualizados exitosamente" });
    } catch (error) {
      console.error(
        "Error al actualizar productos con descuento expirado:",
        error
      );
      res.status(500).send("Error al ejecutar cron job");
    }
  } else {
    res.status(405).send("Método no permitido");
  }
}
