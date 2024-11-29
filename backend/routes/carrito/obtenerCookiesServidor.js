const obtenerCookiesServidor = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  console.log("sessionId", sessionId);
  if (sessionId) {
    res.json({ sessionId });
  } else {
    res.status(404).json({ error: "No sessionId found" });
  }
};

export default obtenerCookiesServidor;
