import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const discount = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    // Enviar los productos destacados como respuesta
    res.json();
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    res
      .status(500)
      .json({ message: "Error al obtener productos destacados", error });
  }
};

export default discount;
