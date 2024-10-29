// controllers/mail/userService.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Users from "../../../models/User.js";
import helpers from "../../../lib/helpers.js";

export const findOrCreateUser = async (email, nombre) => {
  let user = await Users.findOne({ email });
  // Si el usuario existe pero no ha verificado su correo
  if (user && !user.emailVerified) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // Token válido por 1 hora

    await user.save();
    return { user, token };
  }

  // Si no existe el usuario, crearlo
  if (!user) {
    const generateRandomPassword = (length = 12) =>
      crypto.randomBytes(length).toString("hex").slice(0, length);

    const plainPassword = generateRandomPassword();
    const hashedPassword = await helpers.encryptPassword(plainPassword);

    const newUser = new Users({
      nombre,
      email,
      password: hashedPassword,
    });

    user = await newUser.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    newUser.resetToken = token;
    newUser.resetTokenExpires = Date.now() + 3600000; // Token válido por 1 hora

    await newUser.save();
    return { user, token };
  }

  return { user };
};
