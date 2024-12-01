import moment from "moment";
import Vista from "../backend/models/Vista.js";
import { connectToDatabase } from "../backend/db/connectToDatabase.js";

export default async function handler(req, res) {
  try {
    // Conexión a la base de datos usando caché
    await connectToDatabase();

    const currentDate = moment.utc().toDate(); // Formato UTC compatible con MongoDB

    // Buscar y actualizar productos en lote
    const result = await Vista.updateMany(
      { discountExpiry: { $lte: currentDate } },
      { $set: { discount: 0, discountExpiry: "" } }
    );

    // console.log(result);

    console.log(`${result.modifiedCount} productos actualizados`);
    res.status(200).json({ message: "Productos actualizados exitosamente" });
  } catch (error) {
    console.error("Error al actualizar productos:", error);
    res.status(500).send("Error al ejecutar cron job");
  }
}
