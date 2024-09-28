import passport from "../../lib/passport.js";

const signin = async (req, res) => {
  try {
    passport.authenticate("local.signin", { session: true })(
      req,
      res,
      (error) => {
        if (error) {
          console.error("Error al autenticar la sesión del usuario:", error);
          return res
            .status(500)
            .json({ error: "Error al autenticar la sesión del usuario" });
        }

        // Verificar si el usuario está autenticado
        if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Usuario no autenticado" });
        }

        // Establecer la cookie después de la autenticación
        res.cookie("user_sid", req.sessionID, {
          secure: true, // Solo se enviará a través de HTTPS
          httpOnly: true, // No accesible desde JavaScript
          sameSite: "lax", // Ayuda a prevenir CSRF
        });

        console.log("Usuario autenticado:", req.user);
        console.log("Sesión:", req.session);

        // Manejo de la respuesta
        return res.json({ user: req.user });
      }
    );
  } catch (error) {
    console.error("Error en la función signin:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default signin;
