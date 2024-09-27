import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Importa el modelo de usuario

export const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.cookies.user_sid; // Asegúrate de que el token se obtiene correctamente
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).send("Forbidden"); // Forbidden
        }

        // Verifica si el usuario existe y está activo en la base de datos
        try {
          // Conectar a la base de datos
          await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });

          const user = await User.findById(decoded.id); // Busca el usuario en la BD usando el ID del token

          if (!user || !user.active) {
            // Verifica si el usuario está activo
            return res.status(403).send("Forbidden"); // Forbidden
          }

          req.user = user; // Adjunta el usuario al request
          next(); // Pasa al siguiente middleware
        } catch (dbError) {
          console.error("Database error:", dbError);
          return res.status(500).send("Internal Server Error"); // Error del servidor
        }
      });
    } else {
      return res.status(401).send("Unauthorized"); // Unauthorized
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).send("Internal Server Error"); // Error del servidor
  }
};
