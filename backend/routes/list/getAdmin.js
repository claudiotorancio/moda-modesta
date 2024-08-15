const getAdmin = async (req, res) => {
  try {
    //  Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    //extraer rol de admin
    const role = req.user.role;

    //console.log(`usuario: ${role}`);

    // Retornar el rol
    res.json({ role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getAdmin;
