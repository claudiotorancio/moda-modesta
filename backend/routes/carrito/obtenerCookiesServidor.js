const obtenerCookiesServidor = async (req, res) => {
  try {
    // Intentamos obtener el sessionId de las cookies
    const sessionId = req.cookies.sessionId;
    console.log("sessionId", sessionId);

    if (sessionId) {
      // Si encontramos sessionId, respondemos con el valor
      res.json({ sessionId });
    } else {
      // Si no encontramos sessionId, respondemos con un error 404
      res.status(404).json({ error: "No sessionId found" });
    }
  } catch (error) {
    // En caso de error en el proceso, capturamos el error y respondemos con un error 500
    console.error("Error al obtener sessionId desde las cookies:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export default obtenerCookiesServidor;
