import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Users from "../../models/User.js";

const deleteUser = async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Obtener el ID del usuario a eliminar
    const userId = req.params.id;

    // Buscar y eliminar el usuario por su ID
    const deletedUser = await Users.findByIdAndDelete(userId);

    // Usuario eliminado con éxito
    return res.json({ message: "User deleted", deletedUser });
  } catch (error) {
    // Manejar errores durante la eliminación del usuario
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteUser;
