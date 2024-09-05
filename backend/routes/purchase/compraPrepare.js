import nodemailer from "nodemailer";

const compraPrepare = async (req, res) => {
  try {
    const { email, name, producto } = req.body;
    console.log(req.body);

    // Verificar que el campo email está presente
    if (!email) {
      return res
        .status(400)
        .json({ error: "El correo electrónico es requerido." });
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "El correo electrónico proporcionado no es válido." });
    }

    // Construir el contenido del correo
    const contentHTML = `
      <h3>Datos de Contacto</h3>
      <ul>
        <li><strong>Correo:</strong> ${email}</li>
        <li><strong>Nombre:</strong> ${name}</li>
      </ul>
      <p>Hola ${name},</p>
      <p>Tu pedido con el producto <strong>${producto}</strong> está en preparación.</p>
      <p>Pronto recibirás novedades sobre el estado de tu pedido.</p>
      <p>Gracias por tu compra.</p>
      <p>Si tienes alguna pregunta, no dudes en contactarnos a <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
    `;

    // Configurar el transportador de nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL, // dirección de correo
        pass: process.env.ACCESS_KEY_ID, // Contraseña o token de acceso
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Configurar el mensaje a enviar
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `¡Hola ${name}! Tu pedido está en preparación`,
      html: contentHTML,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    console.log("Correo enviado:", info.messageId);
    res.status(201).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error al enviar el correo:", error.message);
    res.status(500).json({ error: "Error al enviar el correo." });
  }
};

export default compraPrepare;
