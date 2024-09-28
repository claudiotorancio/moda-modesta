import Users from "../../models/User.js";
import passport from "../../lib/passport.js";

const signin = (req, res) => {
  passport.authenticate("local.signin")(req, res, (error) => {
    if (error) {
      console.error("Error al autenticar la sesión del usuario:", error);
      return res
        .status(500)
        .json({ error: "Error al autenticar la sesión del usuario" });
    }

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await Users.findById(id);
        console.log("usuario encontrado deserializer", user);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
    // res.cookie("user_sid", req.sessionID, {
    //   secure: process.env.NODE_ENV === "production",
    //   httpOnly: true,
    //   sameSite: "lax",
    // });

    console.log("Usuario autenticado:", req.user);
    console.log("Sesión:", req.session);

    return res.json({ user: req.user });
  });
};

export default signin;
