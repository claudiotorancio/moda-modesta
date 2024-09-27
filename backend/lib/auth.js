// backend/middleware/auth.js
import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.user_sid; // Ajusta esto si guardas el token en otro lugar
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Agregar el usuario al request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
