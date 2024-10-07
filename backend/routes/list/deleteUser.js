import Users from "../../models/User.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const deleteUser = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener el ID del usuario a eliminar
    const userId = req.params.id;

    // Buscar y eliminar el usuario por su ID
    const deletedUser = await Users.findByIdAndDelete(userId);

    // Usuario eliminado con éxito
    return res.json({ message: "Usuario eliminado", deletedUser });
  } catch (error) {
    // Manejar errores durante la eliminación del usuario
    console.error(error);
    return res.status(500).json({ error: "Error al elimninar eñ usuario" });
  }
};

export default deleteUser;
