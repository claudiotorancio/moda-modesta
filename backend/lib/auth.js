import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Asegúrate de importar tu modelo de usuario

export const authenticateJWT = async (req, res, next) => {
  const token = req.cookies.user_sid; // Ajusta esto si guardas el token en otro lugar
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      // Verifica si el usuario existe y está activo en la base de datos
      try {
        const user = await User.findById(decoded.id); // Aquí asumimos que el token contiene el ID del usuario

        if (!user || !user.active) {
          // Revisa si el usuario existe y está activo
          return res
            .status(404)
            .send({ success: false, message: "Usuario no encontrado" });
        }

        req.user = user; // Agregar el usuario al request
        next();
      } catch (dbError) {
        console.error(dbError);
        return res.sendStatus(500); // Internal Server Error
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
