//sendMail.js
import { validateOrderData } from "./mail/validation.js";
import {
  createTransporter,
  sendVerificationEmail,
} from "./mail/mailService.js";
import { findOrCreateUser } from "./mail/userService.js";
import {
  createOrder,
  saveSalesData,
  updateStock,
} from "./mail/orderService.js";

import { connectToDatabase } from "../../db/connectToDatabase.js";
import { sendThankYouEmail } from "./mail/mailService.js";

const sendMail = async (req, res) => {
  try {
    const orderData = req.body;

    connectToDatabase();
    // Validar datos de la orden
    validateOrderData(orderData);

    // Configurar el transportador de nodemailer
    const transporter = createTransporter();

    // Buscar o crear usuario
    const { user, token, existsButNotVerified } = await findOrCreateUser(
      orderData.email,
      orderData.nombre
    );

    // Si el usuario ya existe pero no ha verificado su correo
    if (existsButNotVerified) {
      await sendVerificationEmail(
        transporter,
        orderData.email,
        orderData.nombre,
        token
      );
      return res.json({
        success: true,
        message:
          "Tu cuenta ya existe, pero no ha sido verificada. Se ha enviado un correo para confirmar tu dirección.",
      });
    }

    // Si el usuario fue creado, enviar el correo de agradecimiento
    const newOrder = await createOrder(orderData, user._id);

    // Guardar los datos de la venta
    await saveSalesData(orderData.productos, user._id, newOrder._id);

    // Actualizar el stock de los productos
    await updateStock(orderData.productos);

    // Enviar el correo de agradecimiento
    await sendThankYouEmail(transporter, orderData, user, token);

    // Construir la lista de productos en formato HTML
    const productosHTML = orderData.productos
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
       <li><strong>Nombre:</strong> ${orderData.nombre}</li>
       <li><strong>Email:</strong> ${orderData.email}</li>
       <li><strong>Teléfono:</strong> ${orderData.telefono}</li>
       <li><strong>Provincia:</strong> ${orderData.provincia}</li>
       <li><strong>Código Postal:</strong> ${orderData.codigoPostal}</li>
       <li><strong>Total:</strong> $${orderData.total}</li>
       <li><strong>Costo de Envío:</strong> $${orderData.costoEnvio}</li>
       <li><strong>Coordinar envio:</strong> ${
         orderData.checked ? "Sí" : "No"
       }</li>
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

    // Enviar correo de notificación de nueva compra
    const mailOptionsOrder = {
      from: orderData.email, // Cambiado a tu correo electrónico configurado en las variables de entorno
      to: process.env.EMAIL, // Enviar al correo del usuario
      subject: `Nueva compra de ${orderData.nombre}`,
      html: contentHTML,
    };

    await transporter.sendMail(mailOptionsOrder);

    res.json({
      success: true,
      message:
        "¡Orden creada con éxito! Si tu correo no ha sido verificado, recibirás un correo para validar tu cuenta.",
    });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({
      error:
        "Orden no generada, porfavor intenta mas tarde, Disculpe las molestias.",
    });
  }
};

export default sendMail;
