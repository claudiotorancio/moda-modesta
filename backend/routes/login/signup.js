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
      .send({ error: "El correo electrónico proporcionado no es válido." });
  }

  try {
    //cifrar contraseñas con passport
    passport.authenticate("local.signup", function (err, user, info) {
      //manejo de errores
      if (err) {
        throw err;
      }
      if (!user) {
        return res.status(400).json({ message: "Failed to sign up" });
      }
      if (user) {
        res.json({ message: "Usuario registrado" });
      }
    })(req, res);
  } catch (error) {
    // Manejar errores generales aquí
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default signup;
