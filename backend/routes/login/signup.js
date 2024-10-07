import passport from "../../lib/passport.js";

const signup = async (req, res) => {
  // Verificar que los datos requeridos estén presentes
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
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
    //cifrar contraseñas con passport
    passport.authenticate("local.signup", function (err, user, info) {
      //manejo de errores
      if (err) {
        console.error("Error en la autenticación:", err);
        return res.status(500).json({ error: "Error en la autenticación" });
      }
      if (!user) {
        return res
          .status(400)
          .json({
            error:
              "Este correo electrónico ya está registrado. Si olvidó su contraseña, puede solicitar un restablecimiento.",
          });
      }
      res.status(201).json({
        message: "Usuario registrado correctamente",
      });
    })(req, res);
  } catch (error) {
    // Manejar errores generales aquí
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default signup;
