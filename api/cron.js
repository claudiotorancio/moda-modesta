// api/cron.
import moment from "moment";
import Vista from "../backend/models/Vista.js";
import mongoose from "mongoose";
import MONGODB_URI from "../backend/config.js";

export default async function handler(req, res) {
  // if (req.method === "GET") {
  // Conectar a la base de datos y guardar el producto
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const currentDate = new Date();

    const parsedDate = moment.utc(currentDate);

    // Buscar productos cuyo discountExpiry haya pasado
    const productosConDescuentoExpirado = await Vista.find({
      discountExpiry: { $lte: parsedDate },
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
  // } else {
  //   res.status(405).send("Método no permitido");
  // }
}
