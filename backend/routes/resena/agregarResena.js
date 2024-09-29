import Resena from "../../models/Resena.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const agregarResena = async (req, res) => {
  try {
    // Conectar a la base de datos si no está ya conectada
    await connectToDatabase();

    const { name, redSocial, resena, estrellas } = req.body;

    // Validar datos
    if (!name || !redSocial || !resena || !estrellas) {
      return res
        .status(400)
        .json({ error: "Todos los campos son requeridos." });
    }

    // Crear los datos de la reseña
    const createResenaData = {
      name,
      redSocial,
      resena,
      estrellas,
    };

    // Crear un nuevo documento de reseña
    const newResena = new Resena(createResenaData);

    // Guardar la reseña en la base de datos
    await newResena.save();

    res.json({ message: "Reseña guardada correctamente" });
  } catch (error) {
    console.error("Error al crear la reseña:", error);
    res.status(500).json({ error: "Error al crear la reseña" });
  }
};

export default agregarResena;
