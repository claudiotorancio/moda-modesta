// sendMail.js
// import { validateOrderData } from "./mail/validation.js";
import {
  createTransporter,
  sendVerificationEmail,
} from "./mail/mailService.js";
import { findOrCreateUser } from "./mail/userService.js";
import {
  createOrder,
  saveSalesData,
  updateStock,
  saveCustomerAnalytics,
} from "./mail/orderService.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const sendMail = async (req, res) => {
  try {
    const orderData = req.body;

    await connectToDatabase(); // Ensure the connection is established

    // Set up the transporter for nodemailer
    const transporter = createTransporter();

    // Find or create the user
    const { user, token } = await findOrCreateUser(
      orderData.email,
      orderData.nombre
    );

    // Handle email verification if the user exists but is not verified

    await sendVerificationEmail(
      transporter,
      orderData.email,
      orderData.nombre,
      orderData,
      user,
      token
    );

    // Create new order
    const newOrder = await createOrder(orderData, user._id);

    // Save sales data
    await saveSalesData(orderData.productos, user._id, newOrder._id);

    // Update stock
    await updateStock(orderData.productos);

    // Lógica para guardar datos de análisis de clientes
    await saveCustomerAnalytics(user._id, orderData.productos);

    // Build HTML for the products
    const productosHTML = orderData.productos
      .map(
        (producto) => `
      <tr>
        <td>${producto.name}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.size}</td>
        <td>$${producto.price.toFixed(2)}</td>
        <td>${producto.category}</td>
        <td><a href="https://moda-modesta.vercel.app/#product-${
          producto.hash
        }">Ver producto</a></td>
      </tr>
    `
      )
      .join("");

    // Build HTML content for the order email
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
            <th>Talle/Unidad</th>
            <th>Precio</th>
            <th>Seccion</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          ${productosHTML}
        </tbody>
      </table>
    `;

    // Email options for order notification
    const mailOptionsOrder = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Send to your configured email
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
        "Orden no generada. Por favor, intenta más tarde. Disculpa las molestias.",
    });
  }
};

export default sendMail;
