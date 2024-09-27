import jwt from "jsonwebtoken";
import Users from "../models/User.js"; // Importa el modelo de usuario
import { connectToDatabase } from "../config.js"; // Asegúrate de importar tu función para conectar a la base de datos

export const authenticateJWT = async (req, res, next) => {
  try {
    // Obtén el token de las cookies
    const token = req.cookies.user_sid; // Cambia esto si usas otro nombre para la cookie

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.error("Error en la verificación del token:", err);
          return res.status(403).json({ ok: false, message: "Forbidden" }); // Si el token es inválido
        }

        console.log("Token decodificado:", decoded);

        // Asegúrate de que te conectas a la base de datos
        try {
          await connectToDatabase(); // Conecta a MongoDB si no está conectado

          const user = await Users.findById(decoded.id); // Busca al usuario en la base de datos
          console.log("Usuario encontrado:", user);

          if (!user || !user.active) {
            // Si el usuario no existe o no está activo
            return res.status(403).json({ ok: false, message: "Forbidden" });
          }

          req.user = user; // Adjunta el usuario a la solicitud (request)
          return res.json({ ok: true }); // Devuelve ok: true
        } catch (dbError) {
          console.error("Error en la base de datos:", dbError);
          return res
            .status(500)
            .json({ ok: false, message: "Internal Server Error" }); // Si hay un error con la base de datos
        }
      });
    } else {
      return res.status(401).json({ ok: false, message: "Unauthorized" }); // Si no hay token
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal Server Error" }); // Error general
  }
};
