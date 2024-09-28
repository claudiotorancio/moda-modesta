import passport from "../../lib/passport.js";

const signin = (req, res) => {
  passport.authenticate("local.signin")(req, res, (error) => {
    if (error) {
      console.error("Error al autenticar la sesión del usuario:", error);
      return res
        .status(500)
        .json({ error: "Error al autenticar la sesión del usuario" });
    }

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    return res.json({ user: req.user });
  });
};

export default signin;
