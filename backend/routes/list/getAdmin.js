const getAdmin = async (req, res) => {
  try {
    console.log("Usuario autenticado antes:", req.user);
    console.log("Sesión antes", req.session);
    // Verificar si el usuario está autenticado
    if ((!req.isAuthenticated(), { session: true })) {
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

    console.log("Usuario autenticado despues:", req.user);
    console.log("Sesión despues:", req.session);

    // Si el usuario está autenticado y tiene el rol de "admin", devolver true
    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export default getAdmin;
