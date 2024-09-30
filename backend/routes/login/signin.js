import passport from "../../lib/passport.js";

const signin = (req, res) => {
  // Verificar que los datos requeridos estén presentes
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
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
          .json({ message: info.message || "Usuario no autenticado" });
      }

      // Inicia sesión y maneja la sesión
      req.logIn(user, (err) => {
        if (err) {
          console.error("Error al iniciar sesión:", err);
          return res.status(500).json({ error: "Error al iniciar sesión" });
        }

        // Responde con el usuario autenticado
        return res.json({ user: req.user });
      });
    })(req, res);
  } catch (error) {
    console.error("Error inesperado:", error);
    return res.status(500).json({ error: "Error inesperado" });
  }
};

export default signin;
