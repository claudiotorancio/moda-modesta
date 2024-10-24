//logout.js

const logout = (req, res) => {
  try {
    // Comprobar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      return res
        .status(401)
        .json({ success: false, message: "No estás autenticado." });
    }
    //manejo de passport para el logout
    req.logout((err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: false, error: "Error during logout" });
      }

      return res.status(201).json({ success: true, message: "Logout exitoso" });
    });
  } catch (error) {
    console.error("Error en la función logout:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default logout;
