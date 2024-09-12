import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Resena from "../../models/Resena.js";

const deleteResena = async (req, res) => {
  try {
    // Conectar a la base de datos si no está ya conectada

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const resenaId = req.params.id;

    const deleteResena = await Resena.findByIdAndDelete(resenaId);

    return res.json({ message: "Reseña eliminada", deleteResena });
  } catch (error) {
    // Manejar errores durante la eliminación del usuario
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteResena;
