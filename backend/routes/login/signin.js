import passport from "../../lib/passport.js";

const signin = (req, res) => {
  passport.authenticate("local.signin", { session: true })(
    req,
    res,
    (error) => {
      if (error) {
        console.error("Error al autenticar la sesión del usuario:", error);
        return res
          .status(500)
          .json({ error: "Error al autenticar la sesión del usuario" });
      }

      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      res.cookie("user_sid", req.session.id, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      });

      console.log("Usuario autenticado:", req.user);
      console.log("Sesión:", req.session);

      return res.json({ user: req.user });
    }
  );
};

export default signin;
