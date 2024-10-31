import Resena from "../../models/Resena.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const putResena = async (req, res) => {
  try {
    await connectToDatabase();

    const { name, redSocial, resena, estrellas, resenaId } = req.body;

    // Validar datos
    if (!name || !redSocial || !resena || !estrellas || !resenaId) {
      return res
        .status(400)
        .json({ error: "Todos los campos son requeridos." });
    }

    // Crear los datos de la reseña
    const ResenaData = {
      name,
      redSocial,
      resena,
      estrellas,
    };

    // Actualizar la resena
    const updatedResena = await Resena.findByIdAndUpdate(
      resenaId,
      ResenaData,

      { new: true }
    );

    res.json({ message: "Reseña actualizada correctamente", updatedResena });
  } catch (error) {
    console.error("Error al crear la reseña:", error);
    res.status(500).json({ error: "Error al crear la reseña" });
  }
};

export default putResena;
