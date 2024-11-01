import jwt from "jsonwebtoken";

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const publicRoutes = ["/api/listaProductos"]; // Rutas públicas

  // Verificar si la ruta es pública
  if (publicRoutes.includes(req.path)) {
    return next(); // Permitir acceso a rutas públicas
  }

  // Solo aplicar lógica de token en desarrollo
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    const { user } = decoded;
    const { _id, email, role, nombre } = user;

    req.user = {
      _id,
      email,
      role,
      nombre,
    };

    // En producción, verificar si el usuario es un administrador
    if (
      process.env.NODE_ENV !== "development" &&
      (!req.isAuthenticated() || req.user.role !== "admin")
    ) {
      return res.status(403).json({
        error: "Acceso denegado: Solo usuarios administradores pueden acceder",
      });
    }

    next();
  });
};

export default authenticateToken;
