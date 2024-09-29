import nodemailer from "nodemailer";

const correoEnCamino = async (req, res) => {
  try {
    const { email, name, producto } = req.body;

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
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #555;">Datos de Contacto</h2>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Correo:</strong> ${email}</li>
        <li><strong>Nombre:</strong> ${name}</li>
      </ul>
  
      <p>Hola <strong>${name}</strong>,</p>
  
      <p>Nos complace informarte que tu pedido con el producto <strong>${producto}</strong> está en proceso de entrega. Pronto llegará a la dirección indicada.</p>
  
      <p>Gracias por tu compra y por confiar en nosotros.</p>
  
      <p>Si tienes alguna pregunta o inquietud, no dudes en contactarnos a través de nuestro correo: <a href="mailto:${process.env.EMAIL}" style="color: #1a73e8; text-decoration: none;">${process.env.EMAIL}</a>.</p>
  
      <p>Atentamente,</p>
      <p><strong>El equipo de Moda Modesta</strong></p>
  
      <footer style="margin-top: 30px; font-size: 12px; color: #777;">
        <p>Este correo es generado automáticamente, por favor no responda a este mensaje.</p>
      </footer>
    </div>
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
      subject: `¡Hola ${name}! Tu pedido está en proceso de entrega-`,
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

export default correoEnCamino;
