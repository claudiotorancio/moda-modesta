import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import nodemailer from "nodemailer";
import Order from "../../models/Order.js";
import Vista from "../../models/Vista.js";

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
      aceptar = false, // Valor predeterminado
      enCamino = false, // Valor predeterminado
      finalizado = false, // Valor predeterminado
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
      !costoEnvio === undefined ||
      !checked === undefined ||
      !aceptar === undefined ||
      !enCamino === undefined ||
      !finalizado === undefined
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

    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Guardar la orden en la base de datos
    const newOrder = new Order({
      customer: {
        name: nombre,
        email: email,
        phoneNumber: telefono,
      },
      items: productos.map((producto) => ({
        productId: producto.id, // Asegúrate de que este campo esté presente y coincida con el nombre del campo en el esquema
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
      checked: checked,
      aceptar,
      enCamino,
      finalizado,
    });

    await newOrder.save();

    // Actualizar el stock de los productos y tamaños
    await Promise.all(
      productos.map(async (producto) => {
        const product = await Vista.findById(producto.id);
        if (product) {
          // Encuentra el tamaño correspondiente en el array de sizes
          const size = product.sizes.find((s) => s.size === producto.size);
          if (size) {
            size.stock -= producto.cantidad; // Reducir el stock del tamaño
            if (size.stock < 0) size.stock = 0; // Evitar stock negativo
            await product.save();
          } else {
            console.warn(
              `Tamaño ${producto.size} no encontrado para el producto con ID ${producto.id}.`
            );
          }
        } else {
          console.warn(`Producto con ID ${producto.id} no encontrado.`);
        }
      })
    );

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
