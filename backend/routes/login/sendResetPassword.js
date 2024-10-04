import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Users from "../../models/User.js";
import { baseURL } from "../../../frontend/services/product_services.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

// Función para restablecer la contraseña
const sendResetPassword = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  // Verificar que todos los campos requeridos están presentes
  if (!email) {
    return res.status(400).send({ error: "El campo es obligatorio." });
  }

  // Validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .send({ error: "El correo electrónico proporcionado no es válido." });
  }

  try {
    // Conectar a la base de datos si es necesario
    await connectToDatabase();
    // Verificar si el usuario existe
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Generar un token de restablecimiento
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Guardar el token y su expiración en la base de datos
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // Token válido por 1 hora

    const savedUser = await user.save();
    console.log(savedUser);
    if (!savedUser) {
      throw new Error("No se pudo guardar el usuario con el token.");
    }

    // Construir la URL de confirmación
    const resetLink = `${baseURL}/api/reset-password?token=${token}`;

    // Construir el contenido del correo
    const contentHTML = `
        <h3>Datos de Contacto</h3>
        <ul>
          <li>Correo: ${email}</li>
        </ul>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Reset password</a>
      <p>Gracias por confiar en nosotros,</p>
      <p>El equipo de Moda Modesta</p>
      `;

    // Configurar el transportador de nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL, // dirección de correo
        pass: process.env.ACCESS_KEY_ID, // contraseña o token de acceso
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Configurar el mensaje a enviar
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Restablecimiento de contraseña`,
      html: contentHTML,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message:
        "Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

export default sendResetPassword;
