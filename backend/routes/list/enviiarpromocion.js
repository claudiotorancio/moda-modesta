import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Users from "../../models/User.js";

const enviarPromocion = async (req, res) => {
  try {
    const { myContent } = req.body;
    console.log(req.body);
    // Verificar que todos los campos requeridos están presentes
    if (!myContent) {
      return res
        .status(400)
        .send({ error: "El contenido de la promoción es requerido." });
    }

    // Conectar a la base de datos si es necesario
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Obtener todos los usuarios con el email verificado
    const usuarios = await Users.find({ emailVerified: true });
    if (usuarios.length === 0) {
      return res
        .status(404)
        .send({ error: "No se encontraron usuarios con correos verificados." });
    }
    console.log(usuarios);
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

    // Enviar correos electrónicos a cada usuario verificado
    const emailPromises = usuarios.map((usuario) => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: usuario.username,
        subject: "Promoción Especial",
        html: myContent,
      };

      return transporter.sendMail(mailOptions);
    });

    // Esperar a que se envíen todos los correos electrónicos
    const results = await Promise.all(emailPromises);

    console.log(
      "Correos enviados:",
      results.map((info) => info.messageId)
    );
    res
      .status(200)
      .send({ success: true, message: "Promociones enviadas exitosamente." });
  } catch (error) {
    console.error("Error al enviar los correos:", error.message);
    res.status(500).send({ error: "Error al enviar los correos." });
  }
};

export default enviarPromocion;
