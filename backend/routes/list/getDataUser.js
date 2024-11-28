const getDataUser = async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      return res.status(401).json({ ok: false, message: "No autenticado" });
    }

    // Crear un payload con información del usuario
    const token = {
      nombre: req.user.nombre,
      email: req.user.email,
      userId: req.user._id,
    };

    // Generar un token (ajusta la clave secreta y el tiempo de expiración según sea necesario)

    // Devolver el token en la respuesta
    return res.json({ ok: true, role: req.user.role, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error del servidor" });
  }
};

export default getDataUser;
