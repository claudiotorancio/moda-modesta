import jwt from "jsonwebtoken";
import Users from "../../models/User.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const confirmMail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .send({ success: false, message: "Token no proporcionado" });
  }

  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos usando el _id decodificado
    const user = await Users.findOne({
      _id: decoded._id,
      resetToken: token, // Verifica que el token coincida con el almacenado
      resetTokenExpires: { $gt: Date.now() }, // Verifica si el token no ha expirado
    });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Usuario no encontrado" });
    }

    // Verificar si el correo ya ha sido confirmado
    if (user.emailVerified) {
      return res.send({
        success: true,
        message: "El correo ya está confirmado",
      });
    }

    // Actualizar el estado del correo electrónico del usuario
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    user.emailVerified = true;
    await user.save();

    res.redirect("/success.html");
  } catch (error) {
    console.error("Error al confirmar el correo:", error.message);
    res.redirect("/error.html");
  }
};

export default confirmMail;
