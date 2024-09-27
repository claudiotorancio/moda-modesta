import passport from "../../lib/passport.js";

const getAdmin = async (req, res) => {
  try {
    passport.authenticate("cookie", { session: false })(req, res, async () => {
      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        return res
          .status(401)
          .json({ ok: false, message: "Usuario no autenticado" });
      }

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
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export default getAdmin;
