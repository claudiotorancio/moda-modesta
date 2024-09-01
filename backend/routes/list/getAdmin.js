const getAdmin = async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      return res
        .status(401)
        .json({ ok: false, error: "Usuario no autenticado" });
    }

    // Verificar si el usuario tiene el rol de "admin"
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          ok: false,
          error:
            "Acceso denegado: Solo usuarios administradores pueden acceder",
        });
    }

    res.json({ ok: true, role: req.user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

export default getAdmin;
