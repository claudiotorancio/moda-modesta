import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Users from "../../models/User.js";
import { baseURL } from "../../baseUrl.js";
import helpers from "../../lib/helpers.js";
import crypto from "crypto";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const suscribeMail = async (req, res) => {
  const generateRandomPassword = (length = 12) => {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
  };

  try {
    const { email, nombre } = req.body;

    // Verificar que todos los campos requeridos están presentes
    if (!nombre || !email) {
      return res
        .status(400)
        .send({ error: "Todos los campos son requeridos." });
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({ error: "El correo electrónico proporcionado no es válido." });
    }

    // Conectar a la base de datos
    await connectToDatabase();

    // Verificar si el usuario ya existe
    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
      // Si el usuario existe pero no ha verificado su correo
      if (!existingUser.emailVerified) {
        // Generar un nuevo token de confirmación
        const token = jwt.sign(
          { _id: existingUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        // Actualizar el usuario con el nuevo resetToken y la expiración
        existingUser.resetToken = token;
        existingUser.resetTokenExpires = Date.now() + 3600000; // Token válido por 1 hora

        await existingUser.save();

        // Construir la URL de confirmación
        const confirmUrl = `${baseURL}/api/confirmMail?token=${token}`;

        // Construir el contenido del correo
        const contentHTML = `
          <h3>Datos de Contacto</h3>
          <ul>
            <li>Correo: ${email}</li>
            <li>Nombre: ${nombre}</li>
          </ul>
          <p>Para confirmar tu correo, por favor haz clic en el siguiente enlace:</p>
          <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Confirmar Correo</a>
        <p>Gracias por confiar en nosotros,</p>
        <p>El equipo de Moda Modesta</p>
        `;

        // Configurar el transportador de nodemailer
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true para 465, false para otros puertos
          auth: {
            user: process.env.EMAIL,
            pass: process.env.ACCESS_KEY_ID,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        // Configurar el mensaje a enviar
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: `¡Hola ${nombre}! Confirma tu correo`,
          html: contentHTML,
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);
        console.log("Correo enviado para confirmar:", email);

        return res
          .status(200)
          .json({ success: true, message: "Correo de confirmación enviado." });
      } else {
        return res
          .status(400)
          .send({ error: "Este correo ya está registrado y verificado." });
      }
    }

    // Si el usuario no existe, crear uno nuevo
    const plainPassword = generateRandomPassword();
    const hashedPassword = await helpers.encryptPassword(plainPassword);
    const newUser = new Users({
      nombre: nombre,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generar un token de confirmación con el _id del nuevo usuario
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    newUser.resetToken = token;
    newUser.resetTokenExpires = Date.now() + 3600000; // Token válido por 1 hora

    await newUser.save();

    const confirmUrl = `${baseURL}/api/confirmMail?token=${token}`;

    const contentHTML = `
      <h3>Datos de Contacto</h3>
      <ul>
        <li>Correo: ${email}</li>
        <li>Nombre: ${nombre}</li>
      </ul>
      <p>¡Suscríbete para no perderte las novedades y recibir descuentos exclusivos!</p>
      <p>Para confirmar tu suscripción, por favor haz clic en el siguiente enlace:</p>
      <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Confirmar Suscripción</a>
    <p>Gracias por confiar en nosotros,</p>
    <p>El equipo de Moda Modesta</p>
    `;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.ACCESS_KEY_ID,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `¡Hola ${nombre}! Confirma tu suscripción`,
      html: contentHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", email);
    res
      .status(201)
      .json({ success: true, message: "Correo enviado con exito!" });
  } catch (error) {
    console.error("Error al enviar el correo:", error.message);
    res.status(500).json({ error: "Error al enviar el correo." });
  }
};

export default suscribeMail;
