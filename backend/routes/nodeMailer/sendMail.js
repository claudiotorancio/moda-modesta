import nodemailer from "nodemailer";

const sendMail = async (req, res) => {
  try {
    const { nombre, email, telefono, productos, total, costoEnvio } = req.body;
    console.log(req.body);

    // Verificar que todos los campos requeridos están presentes
    if (
      !nombre ||
      !email ||
      !telefono ||
      !productos ||
      !total ||
      costoEnvio === undefined
    ) {
      return res
        .status(400)
        .send({ error: "Todos los campos son requeridos." });
    }

    // Construir la lista de productos en formato HTML
    const productosHTML = productos
      .map(
        (producto) => `
        <tr>
          <td>${producto.name}</td>
          <td>${producto.cantidad}</td>
          <td>${producto.size}</td>
          <td>$${producto.price.toFixed(2)}</td>
          <td><a href="https://moda-modesta.vercel.app/#product-${
            producto.hash
          }">Ver producto</a></td>
        </tr>
      `
      )
      .join("");

    // Construir el contenido HTML del correo
    const contentHTML = `
        <h1>Información de la Compra</h1>
        <ul>
          <li><strong>Nombre:</strong> ${nombre}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Teléfono:</strong> ${telefono}</li>
          <li><strong>Total:</strong> $${total}</li>
          <li><strong>Costo de Envío:</strong> $${costoEnvio}</li>
        </ul>
        <h2>Productos</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Cantidad</th>
              <th>Talle</th>
              <th>Precio</th>
              <th>Enlace</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>
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
      from: email,
      to: process.env.EMAIL,
      subject: `Nueva compra de ${nombre}`,
      html: contentHTML,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    console.log("Correo enviado:", info.messageId);
    res.status(201).send({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error al enviar el correo:", error.message);
    res.status(500).send({ error: "Error al enviar el correo." });
  }
};

export default sendMail;
