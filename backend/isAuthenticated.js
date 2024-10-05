export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ message: "Debes estar logueado para acceder a esta página" });
}
