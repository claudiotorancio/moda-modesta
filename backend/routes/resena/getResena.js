import Resena from "../../models/Resena.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const getResena = async (req, res) => {
  try {
    // Conectar a la base de datos si no está ya conectada

    await connectToDatabase();

    const dataResenas = await Resena.find();

    if (dataResenas) {
      res.json({ dataResenas });
    } else {
      res.json({ message: "No hay productos en el carrito" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default getResena;
