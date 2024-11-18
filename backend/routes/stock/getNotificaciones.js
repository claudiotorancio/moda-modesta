import Notification from "../../models/Notification.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const getNotificaciones = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    const productsConNotificacion = await Notification.find({
      notified: false,
    });

    if (productsConNotificacion) {
      res.json(productsConNotificacion);
    } else {
      res.json({ message: "No hay productos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default getNotificaciones;
