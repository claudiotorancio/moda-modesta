import passport from "../../lib/passport.js";

const signin = async (req, res) => {
  try {
    // Usar passport.authenticate() para manejar la autenticación del usuario
    passport.authenticate("local.signin", { session: false })(
      req,
      res,
      async (error, user) => {
        if (error) {
          console.error("Error al autenticar la sesión del usuario:", error);
          return res
            .status(500)
            .json({ error: "Error al autenticar la sesión del usuario" });
        }

        // Si la autenticación falla
        if (!user) {
          return res
            .status(401)
            .json({ message: "Usuario o contraseña incorrectos" });
        }

        // Si la autenticación es exitosa, ahora llamamos a req.login para iniciar la sesión
        req.login(user, (err) => {
          if (err) {
            console.error("Error al iniciar sesión:", err);
            return res.status(500).json({ error: "Error al iniciar sesión" });
          }

          console.log("Usuario autenticado:", req.user);
          console.log("Sesión:", req.session);

          // Manejo de la respuesta para mostrar en pantalla los valores
          return res.json({ user: req.user });
        });
      }
    );
  } catch (error) {
    console.error("Error en la función signin:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default signin;
