import nodemailer from "nodemailer";
import Order from "../../models/Order.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Users from "../../models/User.js";
import helpers from "../../lib/helpers.js";
import { baseURL } from "../../../frontend/services/product_services.js";

const sendMail = async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      provincia,
      codigoPostal,
      productos,
      total,
      costoEnvio,
      checked,
      aceptar = false,
      enCamino = false,
      finalizado = false,
    } = req.body;

    // Verificar que todos los campos requeridos están presentes
    if (
      !nombre ||
      !email ||
      !telefono ||
      !provincia === undefined ||
      !codigoPostal === undefined ||
      !productos ||
      !total ||
      !costoEnvio == undefined ||
      checked === undefined ||
      aceptar === undefined ||
      enCamino === undefined ||
      finalizado === undefined
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
          <li><strong>Provincia:</strong> ${provincia}</li>
          <li><strong>Código Postal:</strong> ${codigoPostal}</li>
          <li><strong>Total:</strong> $${total}</li>
          <li><strong>Costo de Envío:</strong> $${costoEnvio}</li>
          <li><strong>Coordinar envio:</strong> ${checked ? "Sí" : "No"}</li>
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
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.ACCESS_KEY_ID,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Conectar a la base de datos
    await connectToDatabase();

    // Buscar si el usuario existe
    let user = await Users.findOne({
      username: email,
    });

    // Si el usuario existe pero no ha verificado su correo, enviar correo de verificación
    if (user && !user.emailVerified) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

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

      // No se detiene aquí, se continúa generando la orden
    }

    // Si no existe el usuario, crearlo y enviar el correo de bienvenida
    if (!user) {
      const generateRandomPassword = (length = 12) =>
        crypto.randomBytes(length).toString("hex").slice(0, length);

      const plainPassword = generateRandomPassword();
      const hashedPassword = await helpers.encryptPassword(plainPassword);

      const newUser = new Users({
        username: email,
        password: hashedPassword,
      });

      user = await newUser.save();

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const confirmUrl = `${baseURL}/api/confirmMail?token=${token}`;

      const welcomeMailHTML = `
        <h3>Datos de Contacto</h3>
        <ul>
          <li>Correo: ${email}</li>
          <li>Nombre: ${nombre}</li>
        </ul>
        <p>¡Gracias por tu compra! Tu orden ha sido generada con éxito.</p>
        <p>Hemos creado una cuenta para ti. Tu usuario es: <strong>${email}</strong> y tu contraseña temporal es: <strong>${plainPassword}</strong></p>
        <p>Cambia tu contraseña por seguridad. Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
        <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Confirmar correo</a>
        <p>Gracias por confiar en nosotros,</p>
        <p>El equipo de Moda Modesta</p>
      `;

      const mailOptionsUser = {
        from: process.env.EMAIL,
        to: email,
        subject: `¡Hola ${nombre}! Confirma tu correo`,
        html: welcomeMailHTML,
      };

      await transporter.sendMail(mailOptionsUser);
    }

    // Generar y guardar la orden en la base de datos
    const newOrder = new Order({
      customer: {
        name: nombre,
        email: email,
        phoneNumber: telefono,
        userId: user._id,
      },
      items: productos.map((producto) => ({
        productId: producto.id,
        name: producto.name,
        price: producto.price,
        quantity: producto.cantidad,
        size: producto.size,
        hash: `https://moda-modesta.vercel.app/#product-${producto.hash}`,
      })),
      totalAmount: total,
      shippingCost: costoEnvio,
      destination: {
        province: provincia,
        postalCode: codigoPostal,
      },
      checked,
      aceptar,
      enCamino,
      finalizado,
    });

    await newOrder.save();

    // Actualizar el stock de los productos
    await Promise.all(
      productos.map(async (producto) => {
        const product = await Vista.findById(producto.id);
        if (product) {
          const size = product.sizes.find((s) => s.size === producto.size);
          if (size) {
            size.stock -= producto.cantidad;
            size.stock = Math.max(size.stock, 0);
            await product.save();
          }
        }
      })
    );

    const mailOptionsOrder = {
      from: email,
      to: process.env.EMAIL,
      subject: `Nueva compra de ${nombre}`,
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
    res.status(500).send({ error: "Error al enviar el correo." });
  }
};

export default sendMail;
