import jwt from "jsonwebtoken";
import Users from "../models/User.js"; // Importa el modelo de usuario

export const authenticateJWT = async (req, res, user, next) => {
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("user_sid", token, { httpOnly: true });

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.error("Error en la verificación del token:", err);
          return res.status(403).send("Forbidden"); // Si el token es inválido
        }

        console.log("Token decodificado:", decoded);

        // Asegúrate de que te conectas a la base de datos
        try {
          await connectToDatabase(); // Conecta a MongoDB si no está conectado

          const user = await Users.findById(decoded.id); // Busca al usuario en la base de datos
          console.log("Usuario encontrado:", user);

          if (!user || !user.active) {
            // Si el usuario no existe o no está activo
            return res.status(403).send("Forbidden");
          }

          req.user = user; // Adjunta el usuario a la solicitud (request)
          next(); // Llama al siguiente middleware
        } catch (dbError) {
          console.error("Error en la base de datos:", dbError);
          return res.status(500).send("Internal Server Error"); // Si hay un error con la base de datos
        }
      });
    } else {
      return res.status(401).send("Unauthorized"); // Si no hay token
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return res.status(500).send("Internal Server Error"); // Error general
  }
};
