//mailsevice

import nodemailer from "nodemailer";
import { baseURL } from "../../../baseUrl.js";

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.ACCESS_KEY_ID,
    },
    tls: { rejectUnauthorized: false },
  });
};

export const sendVerificationEmail = async (
  transporter,
  email,
  nombre,
  token
) => {
  const confirmUrl = `${baseURL}/api/confirmMail?token=${token}`;
  const verificationMailHTML = `
  <h3>Datos de Contacto</h3>
  <ul>
    <li><strong>Correo:</strong> ${email}</li>
    <li><strong>Nombre:</strong> ${nombre}</li>
  </ul>
  <p>Tu cuenta ya existe pero aún no ha sido verificada. Para disfrutar de todos los beneficios, te hemos enviado un nuevo correo para confirmar tu dirección.</p>
  <p><strong>¡Importante!</strong> Al verificar tu correo electrónico, podrás acceder a descuentos exclusivos, promociones especiales y las últimas novedades de nuestros productos. ¡No te lo pierdas!</p>
  <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Confirmar correo</a>
  <p>Gracias por confiar en nosotros,</p>
  <p>El equipo de Moda Modesta</p>
`;

  const mailOptionsUser = {
    from: process.env.EMAIL,
    to: email,
    subject: `¡Hola ${nombre}! Confirma tu correo`,
    html: verificationMailHTML,
  };

  await transporter.sendMail(mailOptionsUser);
};

export const sendThankYouEmail = async (
  transporter,
  orderData,
  user,
  token
) => {
  // Construir la lista de productos en formato HTML
  const productosHTML = orderData.productos
    .map(
      (producto) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
          producto.name
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
          producto.cantidad
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
          producto.size
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${producto.price.toFixed(
          2
        )}</td>
      </tr>
    `
    )
    .join("");

  const confirmUrl = `${baseURL}/api/confirmMail?token=${token}`;

  // Contenido HTML del correo de agradecimiento
  const thankYouHTML = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h1 style="color: #28a745; font-size: 24px;">¡Gracias por tu compra, ${
      user.nombre
    }!</h1>
    <p style="font-size: 16px;">Tu orden ha sido procesada con éxito. A continuación, los detalles de tu compra:</p>

    <h2 style="font-size: 20px; border-bottom: 2px solid #28a745;">Detalles de la Orden</h2>
    <ul style="list-style-type: none; padding: 0;">
      <li><strong>Email:</strong> ${orderData.email}</li>
      <li><strong>Total:</strong> $${orderData.total}</li>
      <li><strong>Costo de Envío:</strong> $${orderData.costoEnvio}</li>
    </ul>

    <h2 style="font-size: 20px; border-bottom: 2px solid #28a745;">Productos Comprados</h2>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 10px;">Nombre del Producto</th>
          <th style="padding: 10px;">Cantidad</th>
          <th style="padding: 10px;">Talle</th>
          <th style="padding: 10px;">Precio</th>
        </tr>
      </thead>
      <tbody>
        ${productosHTML}
      </tbody>
    </table>

    <p style="font-size: 16px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
        ${
          !user.emailVerificado
            ? `
    <p style="font-size: 16px;">Hemos creado una cuenta para ti con la dirección de correo <strong>${orderData.email}</strong>.</p>
    

      <p style="font-size: 16px;">Para activar tu cuenta, haz clic en el siguiente botón:</p>
      <a href="${confirmUrl}" style="display: inline-block; padding: 10px 15px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Confirmar correo</a>
    `
            : ""
        }

    <p style="font-size: 16px; margin-top: 20px;">Gracias por confiar en nosotros,</p>
    <p style="font-size: 16px;">El equipo de Moda Modesta</p>
  </div>
`;

  const mailOptionsThankYou = {
    from: process.env.EMAIL, // Correo desde donde se envía el agradecimiento
    to: orderData.email, // Enviar al correo del usuario
    subject: `¡Gracias por tu compra, ${user.nombre}!`,
    html: thankYouHTML,
  };

  await transporter.sendMail(mailOptionsThankYou);
};
// Si  existe el usuario

// Buscar si el usuario existe
