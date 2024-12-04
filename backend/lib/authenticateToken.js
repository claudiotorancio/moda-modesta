import jwt from "jsonwebtoken";

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/api/listaProductos",
    "/api/addProductCart",
    "/api/getProductsCart",
    "/api/putProductCart",
    "/api/deleteProductCart",
    "/api/limpiarCarrito",
    "/api/sendMail",
    "/api/suscribeMail",
    "/api/costoEnvio",
  ]; // Agrega más rutas públicas si es necesario

  // Verificar si la ruta es pública
  if (publicRoutes.includes(req.path)) {
    return next(); // Permitir acceso a rutas públicas
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Solo aplicar lógica de token en desarrollo
  if (process.env.NODE_ENV === "development") {
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido" });
      }
      const { user } = decoded; // Obtén el objeto user
      const { _id, email, role, nombre } = user; // Desestructura los valores de user

      req.user = {
        _id,
        email,
        role,
        nombre,
      };

      next();
    });
  } else {
    // En producción, verificar autenticación
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Permitir acceso solo a administradores y usuarios normales
    const isAdmin = req.user.role === "admin";
    const isUser = req.user.role === "user";

    if (!isAdmin && !isUser) {
      return res.status(403).json({
        error: "Acceso denegado: Solo usuarios autenticados pueden acceder",
      });
    }

    next();
  }
};

export default authenticateToken;
