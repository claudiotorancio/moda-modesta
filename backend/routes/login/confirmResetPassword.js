import jwt from "jsonwebtoken";
import Users from "../../models/User.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const confirmResetpassword = async (req, res) => {
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
    const user = await Users.findById(decoded._id);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Usuario no encontrado" });
    }

    res.redirect(`/reset-password.html?token=${token}`);
  } catch (error) {
    console.error("Error al recibir datos:", error.message);
    res.redirect("/error.html");
  }
};

export default confirmResetpassword;
