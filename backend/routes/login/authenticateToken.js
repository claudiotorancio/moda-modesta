const authenticateToken = (req, res, next) => {
  const publicRoutes = ["/api/listaProductos"]; // Rutas públicas

  // Permitir acceso a rutas públicas
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }

    const { _id, email, role, nombre } = decoded.user; // Desestructura el usuario

    req.user = {
      _id,
      email,
      role,
      nombre,
    };

    next(); // Continuar al siguiente middleware
  });
};

export default authenticateToken;
