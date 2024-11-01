//

import jwt from "jsonwebtoken";

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  // Solo aplicar lógica de token en desarrollo
  if (process.env.NODE_ENV === "development") {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ error: "Token no proporcionado" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Token inválido" });
      req.user = user; // Añadir el usuario al request
      next();
    });
  } else {
    // En producción, usar sesión de Passport

    return next(); // El usuario está autenticado, continúa
  }
};

export default authenticateToken;
