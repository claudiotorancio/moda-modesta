import Users from "../../models/User.js";
import helpers from "../../lib/helpers.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const updateUser = async (req, res) => {
  try {
    //cuerpo del body
    const { newEmail, newPassword, newRole } = req.body;

    // Obtener el usuario desde el _id
    const userId = req.params.id;

    //console.log(`id de usuario: ${userId}`);

    // Buscar el usuario en la base de datos por su ID
    await connectToDatabase();

    // Buscar el usuario en la base de datos por su ID
    const user = await Users.findById(userId);

    // Verificar si se encontró el usuario
    if (!user) {
      return null, false, { message: "Usuario no encontrado" };
    }

    // Actualizar el nombre de usuario y la contraseña
    user.email = newEmail;
    user.password = await helpers.encryptPassword(newPassword);
    user.role = newRole;

    //salvamos los nuevos datos
    await user.save();

    return res.json({ message: "Usuario acrualizado" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

export default updateUser;
