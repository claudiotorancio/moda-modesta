const getAdmin = async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      return res.status(401).json({ ok: false });
    }

    // Verificar si el usuario tiene el rol de "admin"
    if (req.user.role !== "admin") {
      return res.status(403).json({ ok: false });
    }

    // Si el usuario está autenticado y tiene el rol de "admin", simplemente responde que es admin
    res.json({ ok: true, role: req.user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export default getAdmin;
