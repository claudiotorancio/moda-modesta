import passport from "../../lib/passport.js";
import jwt from "jsonwebtoken";

const signin = (req, res) => {
  // Verificar que los datos requeridos estén presentes
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  // Validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "El correo electrónico proporcionado no es válido." });
  }

  try {
    passport.authenticate("local.signin", (error, user, info) => {
      // Manejo de errores de autenticación
      if (error) {
        console.error("Error al autenticar la sesión del usuario:", error);
        return res
          .status(500)
          .json({ error: "Error al autenticar la sesión del usuario" });
      }

      // Verifica si el usuario fue encontrado
      if (!user) {
        return res
          .status(401)
          .json({ error: "Usuario o contraseña incorrectos" });
      }

      // Verifica si estamos en modo local o producción
      if (process.env.NODE_ENV === "development") {
        // Autenticación con JWT en modo local
        const token = jwt.sign(
          { user },
          process.env.JWT_SECRET, // Usa una clave secreta segura
          { expiresIn: "1h" } // Expiración del token
        );

        // Responde con el usuario autenticado y el token
        return res.json({
          token,
          user,
          message: "Inicio de sesión exitoso con JWT",
        });
      } else {
        // Autenticación de sesión en producción
        req.logIn(user, (err) => {
          if (err) {
            console.error("Error al iniciar sesión:", err);
            return res.status(500).json({ error: "Error al iniciar sesión" });
          }

          // Responde con el usuario autenticado
          return res.json({
            user: req.user,
            message: "Inicio de sesión exitoso",
          });
        });
      }
    })(req, res);
  } catch (error) {
    console.error("Error inesperado:", error);
    return res.status(500).json({ error: "Error inesperado" });
  }
};

export default signin;
