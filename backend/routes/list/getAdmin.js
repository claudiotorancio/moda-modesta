import passport from "../../lib/passport.js";

const getAdmin = async (req, res) => {
  passport.authenticate(
    "cookie",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return res
          .status(500)
          .json({ ok: false, message: "Error interno del servidor" });
      }
      if (!user) {
        return res
          .status(401)
          .json({ ok: false, message: "Usuario no autenticado" });
      }

      // Attach the user to the request
      req.user = user;

      // Verificar si el usuario tiene el rol de "admin"
      if (req.user.role !== "admin") {
        return res.status(403).json({
          ok: false,
          message: "Acceso denegado. No es un administrador.",
        });
      }

      console.log("Usuario autenticado:", req.user);
      // Si el usuario está autenticado y tiene el rol de "admin", devolver true
      return res.json({ ok: true });
    }
  )(req, res);
};

export default getAdmin;
