const getDataUser = async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      return res.status(401).json({ ok: false, message: "No autenticado" });
    }

    // Si el usuario es admin
    if (req.user.role === "admin") {
      // Aquí puedes devolver datos o acceso específico para administradores
      // const adminData = await obtenerDatosDeAdmin(); // Función que obtiene los datos de admin
      return res.json({ ok: true, role: "admin" });
    }

    // Si el usuario es un usuario común (no admin)
    if (req.user.role === "user") {
      // Puedes devolver datos específicos para usuarios comunes
      // const userData = await obtenerDatosDeUsuario(); // Función que obtiene los datos de usuario común
      return res.json({ ok: true, role: "user" });
    }

    // Si el rol del usuario no es reconocido
    return res.status(403).json({ ok: false, message: "Rol no autorizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error del servidor" });
  }
};

export default getDataUser;
