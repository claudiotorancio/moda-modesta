import passport from "../../lib/passport.js";

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

      // Inicia sesión y maneja la sesión
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
    })(req, res);
  } catch (error) {
    console.error("Error inesperado:", error);
    return res.status(500).json({ error: "Error inesperado" });
  }
};

export default signin;
