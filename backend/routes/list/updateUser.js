import Users from "../../models/User.js";
import helpers from "../../lib/helpers.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const updateUser = async (req, res) => {
  try {
    //cuerpo del body
    const { newUsername, newPassword, newRole } = req.body;

    // Obtener el usuario desde el _id
    const userId = req.params.id;

    //console.log(`id de usuario: ${userId}`);

    // Buscar el usuario en la base de datos por su ID
    await connectToDatabase();

    // Buscar el usuario en la base de datos por su ID
    const user = await Users.findById(userId);
    console.log(user);

    // Verificar si se encontró el usuario
    if (!user) {
      return null, false, { message: "Usuario no encontrado" };
    }

    console.log(`nuevo username; ${newUsername}`);
    console.log(`nuevo password; ${newPassword}`);

    // Actualizar el nombre de usuario y la contraseña
    user.username = newUsername;
    user.password = await helpers.encryptPassword(newPassword);
    user.role = newRole;

    //salvamos los nuevos datos
    await user.save();

    return res.json({ user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default updateUser;
