const getAdmin = async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({
        error: "Acceso denegado: Solo usuarios administradores pueden acceder",
      });
    }

    console.log(req.user.role);

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
