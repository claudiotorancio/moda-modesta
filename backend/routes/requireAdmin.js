export const requireAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Acceso denegado: Solo usuarios administradores pueden acceder",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
};
