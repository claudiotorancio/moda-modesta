import jwt from "jsonwebtoken";
import Users from "../../models/User.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";
import helpers from "../../lib/helpers.js";

const updatePassword = async (req, res) => {
  const { newPassword, token } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .send({ message: "Token y nueva contraseña son requeridos" });
  }

  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario por el id en el token
    const user = await Users.findById(decoded._id);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await helpers.encryptPassword(newPassword);

    // Actualizar la contraseña del usuario
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .send({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "El token ha expirado" });
    }
    return res.status(500).send({ message: "Error en el servidor" });
  }
};

export default updatePassword;
